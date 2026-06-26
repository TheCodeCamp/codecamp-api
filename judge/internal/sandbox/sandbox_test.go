package sandbox

import "testing"

func TestChildArgsOrdering(t *testing.T) {
	lim := Limits{CPUSeconds: 3, MemBytes: 1024, FileBytes: 2048, OpenFiles: 64}
	got := ChildArgs("/bin/judge", lim, "/usr/bin/python3", []string{"/tmp/Solution.py"})
	want := []string{"/bin/judge", ExecArg, "3", "1024", "2048", "64", "--", "/usr/bin/python3", "/tmp/Solution.py"}
	if len(got) != len(want) {
		t.Fatalf("len = %d, want %d (%v)", len(got), len(want), got)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("arg[%d] = %q, want %q", i, got[i], want[i])
		}
	}
}

func TestChildArgsRoundTripsLimits(t *testing.T) {
	// The "--" separator must sit at index 6 (after self, __exec, 4 limits) so
	// RunChild's argv[4]=="--" check (on os.Args[2:]) holds.
	got := ChildArgs("self", Limits{}, "prog", nil)
	if got[6] != "--" {
		t.Fatalf("expected separator at index 6, got %v", got)
	}
}
