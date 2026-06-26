// Package sandbox runs untrusted compiled/interpreted code under OS resource
// limits. The judge re-executes its own binary with the ExecArg subcommand;
// that child applies setrlimit to *itself* and then exec()s the target, so the
// limits are inherited by the real process. This is the only portable way to
// set per-child rlimits in Go (there is no SysProcAttr field for them).
package sandbox

import (
	"fmt"
	"os"
	"strconv"
)

// ExecArg is the hidden subcommand that marks a sandboxed re-exec.
const ExecArg = "__exec"

// Limits are the resource caps applied to a single submission run.
type Limits struct {
	CPUSeconds uint64 // RLIMIT_CPU (hard CPU time)
	MemBytes   uint64 // RLIMIT_DATA (heap/data segment)
	FileBytes  uint64 // RLIMIT_FSIZE (max file write size)
	OpenFiles  uint64 // RLIMIT_NOFILE
}

// ChildArgs builds the argv used to re-exec self as the sandbox child:
//
//	<self> __exec <cpu> <mem> <fsize> <nofile> -- <prog> [args...]
func ChildArgs(self string, lim Limits, prog string, progArgs []string) []string {
	args := []string{
		self, ExecArg,
		strconv.FormatUint(lim.CPUSeconds, 10),
		strconv.FormatUint(lim.MemBytes, 10),
		strconv.FormatUint(lim.FileBytes, 10),
		strconv.FormatUint(lim.OpenFiles, 10),
		"--", prog,
	}
	return append(args, progArgs...)
}

// RunChild is invoked in the re-exec'd process. It parses the limit args,
// applies them to itself, then exec()s the target program. It never returns on
// success; on failure it exits non-zero so the parent records a runtime error.
func RunChild(argv []string) {
	// argv == os.Args[2:] == [cpu mem fsize nofile -- prog args...]
	if len(argv) < 6 || argv[4] != "--" {
		fmt.Fprintln(os.Stderr, "sandbox: malformed exec args")
		os.Exit(2)
	}
	lim := Limits{
		CPUSeconds: mustUint(argv[0]),
		MemBytes:   mustUint(argv[1]),
		FileBytes:  mustUint(argv[2]),
		OpenFiles:  mustUint(argv[3]),
	}
	prog := argv[5]
	progArgs := argv[5:] // includes prog as argv[0] for exec

	if err := applyLimits(lim); err != nil {
		fmt.Fprintln(os.Stderr, "sandbox: setrlimit:", err)
		os.Exit(2)
	}
	if err := execProg(prog, progArgs, os.Environ()); err != nil {
		fmt.Fprintln(os.Stderr, "sandbox: exec:", err)
		os.Exit(127)
	}
}

func mustUint(s string) uint64 {
	v, err := strconv.ParseUint(s, 10, 64)
	if err != nil {
		fmt.Fprintln(os.Stderr, "sandbox: bad limit value:", s)
		os.Exit(2)
	}
	return v
}
