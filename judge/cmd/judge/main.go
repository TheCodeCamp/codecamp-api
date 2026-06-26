// Command judge is the CodeCamp execution service. It exposes the same HTTP
// contract the Node API server calls (GET /<solutionId> -> JSON verdict) but
// compiles and runs untrusted submissions under OS resource limits.
//
// When invoked with the hidden "__exec" subcommand it acts as the sandbox
// child (see internal/sandbox): it applies setrlimit to itself and exec()s the
// target program. Normal startup launches the HTTP server.
package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"codecamp/judge/internal/run"
	"codecamp/judge/internal/sandbox"
	"codecamp/judge/internal/store"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == sandbox.ExecArg {
		sandbox.RunChild(os.Args[2:]) // never returns on success
		return
	}

	uri := env("MONGODB_URI", "mongodb://127.0.0.1:27017/OnlineJudge")
	port := env("JUDGE_PORT", "3001")
	resultDir := env("JUDGE_RESULT_DIR", "result")

	st, err := store.Connect(context.Background(), uri)
	if err != nil {
		log.Fatalf("mongo connect failed: %v", err)
	}
	log.Printf("judge connected to mongo: %s", uri)

	h := &handler{store: st, resultDir: resultDir}
	mux := http.NewServeMux()
	mux.HandleFunc("/health", h.health)
	mux.HandleFunc("/", h.judge)

	addr := ":" + port
	log.Printf("Go judge listening on %s (results dir: %s)", addr, resultDir)
	log.Fatal(http.ListenAndServe(addr, mux))
}

type handler struct {
	store     *store.Store
	resultDir string
}

func (h *handler) health(w http.ResponseWriter, r *http.Request) {
	status := "ok"
	code := http.StatusOK
	if err := h.store.Ping(r.Context()); err != nil {
		status, code = "degraded", http.StatusServiceUnavailable
	}
	writeJSON(w, code, map[string]any{"status": status})
}

// judge handles GET /<solutionId>. The response body is JSON matching what the
// Node server expects: `true` (accepted), `false` (wrong answer), or one of the
// strings "CE" / "TLE" / "RE". An unknown/missing submission yields `null`.
func (h *handler) judge(w http.ResponseWriter, r *http.Request) {
	id := strings.Trim(r.URL.Path, "/")
	if id == "" || id == "ide" || id == "favicon.ico" {
		writeRaw(w, "null")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
	defer cancel()

	sol, err := h.store.SolutionByID(ctx, id)
	if err != nil {
		log.Printf("lookup solution %s: %v", id, err)
		writeRaw(w, "null")
		return
	}
	if sol == nil {
		writeRaw(w, "null")
		return
	}

	prob, err := h.store.ProblemByCode(ctx, sol.Problem)
	if err != nil || prob == nil {
		if err != nil {
			log.Printf("lookup problem %s: %v", sol.Problem, err)
		}
		writeRaw(w, "null")
		return
	}

	req := run.Request{
		Language:         sol.Language,
		SourceB64:        sol.Description,
		TimeLimitMs:      prob.TimeLimitMs,
		OutputLimitBytes: prob.SourceLimit,
		InputPath:        filepath.Join(h.resultDir, "input", sol.Contest, prob.Code+".txt"),
		ExpectedPath:     filepath.Join(h.resultDir, "output", sol.Contest, prob.Code+".txt"),
	}

	verdict, jerr := run.Judge(ctx, req)
	if jerr != nil {
		log.Printf("judge %s (%s): %v", id, sol.Language, jerr)
	}

	switch verdict {
	case run.AC:
		writeRaw(w, "true")
	case run.WA:
		writeRaw(w, "false")
	default: // CE / TLE / RE
		writeJSONString(w, string(verdict))
	}
}

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeRaw(w http.ResponseWriter, body string) {
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(body))
}

func writeJSONString(w http.ResponseWriter, s string) {
	b, _ := json.Marshal(s)
	writeRaw(w, string(b))
}
