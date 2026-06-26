// Package run compiles and executes a single submission under resource limits
// and produces a verdict by comparing program output against expected output.
package run

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"codecamp/judge/internal/langs"
	"codecamp/judge/internal/sandbox"
)

type Verdict string

const (
	AC  Verdict = "AC"  // accepted
	WA  Verdict = "WA"  // wrong answer
	CE  Verdict = "CE"  // compile error
	TLE Verdict = "TLE" // time / CPU limit exceeded
	RE  Verdict = "RE"  // runtime error (or internal failure)
)

// Request is everything needed to judge one submission.
type Request struct {
	Language         string
	SourceB64        string
	TimeLimitMs      int64
	OutputLimitBytes int64
	InputPath        string
	ExpectedPath     string
}

const (
	defaultTimeMs      = 2000
	compileTimeout     = 15 * time.Second
	defaultMemBytes    = 256 << 20 // 256 MiB
	defaultOutputBytes = 64 << 20  // 64 MiB
	maxOpenFiles       = 64
	wallGrace          = 500 * time.Millisecond
)

// Judge runs the full compile → execute → compare pipeline. It returns a
// terminal Verdict; the error is non-nil only for internal failures the caller
// should log (the verdict is still safe to report, defaulting to RE).
func Judge(ctx context.Context, req Request) (Verdict, error) {
	spec, ok := langs.Lookup(strings.ToLower(strings.TrimSpace(req.Language)))
	if !ok {
		return RE, fmt.Errorf("unsupported language %q", req.Language)
	}

	src, err := base64.StdEncoding.DecodeString(req.SourceB64)
	if err != nil {
		return CE, nil // unparseable source
	}

	workDir, err := os.MkdirTemp("", "cc-judge-*")
	if err != nil {
		return RE, err
	}
	defer os.RemoveAll(workDir)

	srcPath := filepath.Join(workDir, spec.SourceName())
	if err := os.WriteFile(srcPath, src, 0o600); err != nil {
		return RE, err
	}
	binPath := filepath.Join(workDir, "program")

	if spec.Compiled {
		cctx, cancel := context.WithTimeout(ctx, compileTimeout)
		defer cancel()
		argv := spec.Compile(srcPath, binPath)
		cmd := exec.CommandContext(cctx, argv[0], argv[1:]...)
		cmd.Dir = workDir
		var cerr bytes.Buffer
		cmd.Stderr = &cerr
		if err := cmd.Run(); err != nil {
			return CE, nil
		}
	}

	expected, err := os.ReadFile(req.ExpectedPath)
	if err != nil {
		return RE, fmt.Errorf("missing expected output: %w", err)
	}
	input, _ := os.ReadFile(req.InputPath) // absent input => empty stdin

	// Resolve the run command. syscall.Exec in the sandbox child needs an
	// absolute program path (no PATH lookup), so resolve interpreters here.
	runArgv := spec.Run(srcPath, binPath)
	progPath, err := exec.LookPath(runArgv[0])
	if err != nil {
		return RE, fmt.Errorf("runtime not found: %s", runArgv[0])
	}
	runArgv[0] = progPath

	self, err := os.Executable()
	if err != nil {
		return RE, err
	}

	timeMs := req.TimeLimitMs
	if timeMs <= 0 {
		timeMs = defaultTimeMs
	}
	outBytes := req.OutputLimitBytes
	if outBytes <= 0 {
		outBytes = defaultOutputBytes
	}
	lim := sandbox.Limits{
		CPUSeconds: uint64((timeMs+999)/1000) + 1,
		MemBytes:   defaultMemBytes,
		FileBytes:  uint64(outBytes),
		OpenFiles:  maxOpenFiles,
	}
	childArgv := sandbox.ChildArgs(self, lim, runArgv[0], runArgv[1:])
	wall := time.Duration(timeMs)*time.Millisecond + wallGrace

	cmd := exec.Command(childArgv[0], childArgv[1:]...)
	cmd.Dir = workDir
	cmd.Stdin = bytes.NewReader(input)
	out := &capWriter{limit: int(outBytes)}
	cmd.Stdout = out
	cmd.Stderr = io.Discard
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	if err := cmd.Start(); err != nil {
		return RE, err
	}
	pgid := cmd.Process.Pid
	out.kill = func() { _ = syscall.Kill(-pgid, syscall.SIGKILL) }

	done := make(chan error, 1)
	go func() { done <- cmd.Wait() }()

	var waitErr error
	timedOut := false
	select {
	case <-time.After(wall):
		timedOut = true
		_ = syscall.Kill(-pgid, syscall.SIGKILL)
		<-done
	case <-ctx.Done():
		_ = syscall.Kill(-pgid, syscall.SIGKILL)
		<-done
		return RE, ctx.Err()
	case waitErr = <-done:
	}

	switch {
	case timedOut:
		return TLE, nil
	case out.over:
		return RE, nil // output limit exceeded
	case waitErr != nil:
		if signaledByLimit(waitErr) {
			return TLE, nil
		}
		return RE, nil
	}

	if normalize(out.buf.Bytes()) == normalize(expected) {
		return AC, nil
	}
	return WA, nil
}

// signaledByLimit reports whether the process was killed by a CPU/kill signal,
// which we attribute to the CPU rlimit (SIGXCPU) or a limit kill (SIGKILL).
func signaledByLimit(err error) bool {
	ee, ok := err.(*exec.ExitError)
	if !ok {
		return false
	}
	ws, ok := ee.Sys().(syscall.WaitStatus)
	if !ok || !ws.Signaled() {
		return false
	}
	switch ws.Signal() {
	case syscall.SIGXCPU, syscall.SIGKILL:
		return true
	}
	return false
}

// normalize makes output comparison tolerant of trailing whitespace and CRLF.
func normalize(b []byte) string {
	s := strings.ReplaceAll(string(b), "\r\n", "\n")
	lines := strings.Split(s, "\n")
	for i := range lines {
		lines[i] = strings.TrimRight(lines[i], " \t")
	}
	return strings.TrimRight(strings.Join(lines, "\n"), "\n")
}

// capWriter buffers program output up to limit bytes, then flags overflow and
// kills the process group so a runaway producer can't exhaust memory.
type capWriter struct {
	buf   bytes.Buffer
	limit int
	over  bool
	kill  func()
}

func (w *capWriter) Write(p []byte) (int, error) {
	if w.over {
		return len(p), nil
	}
	if w.buf.Len()+len(p) > w.limit {
		if rem := w.limit - w.buf.Len(); rem > 0 {
			w.buf.Write(p[:rem])
		}
		w.over = true
		if w.kill != nil {
			w.kill()
		}
		return len(p), nil
	}
	return w.buf.Write(p)
}
