package langs

import (
	"strings"
	"testing"
)

func TestLookupAliases(t *testing.T) {
	for _, name := range []string{"c", "C", "cpp", "C++", "java", "py", "Python", "python3"} {
		if _, ok := Lookup(strings.ToLower(name)); !ok {
			t.Errorf("expected %q to resolve", name)
		}
	}
	if _, ok := Lookup("rust"); ok {
		t.Error("unsupported language should not resolve")
	}
	if _, ok := Lookup(""); ok {
		t.Error("empty language should not resolve")
	}
}

func TestSourceName(t *testing.T) {
	java, _ := Lookup("java")
	if java.SourceName() != "Main.java" {
		t.Errorf("java source name = %q, want Main.java", java.SourceName())
	}
	c, _ := Lookup("c")
	if c.SourceName() != "Solution.c" {
		t.Errorf("c source name = %q, want Solution.c", c.SourceName())
	}
}

func TestRunArgvHasNoShell(t *testing.T) {
	// argv slices must be plain tokens — no shell metacharacters that could
	// indicate string interpolation crept back in.
	py, _ := Lookup("py")
	argv := py.Run("/tmp/x/Solution.py", "/tmp/x/program")
	if len(argv) == 0 || argv[0] != "python3" {
		t.Fatalf("unexpected python argv: %v", argv)
	}
	for _, tok := range argv {
		if strings.ContainsAny(tok, "|&;<>$`") {
			t.Errorf("argv token contains shell metachar: %q", tok)
		}
	}
}
