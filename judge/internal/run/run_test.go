package run

import "testing"

func TestNormalize(t *testing.T) {
	cases := []struct{ in, want string }{
		{"42\n", "42"},
		{"42", "42"},
		{"a \nb\t\n", "a\nb"},
		{"x\r\ny\r\n", "x\ny"},
		{"\n\n3\n\n", "\n\n3"},
	}
	for _, c := range cases {
		if got := normalize([]byte(c.in)); got != c.want {
			t.Errorf("normalize(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}

func TestNormalizeEqualityIgnoresTrailingWS(t *testing.T) {
	if normalize([]byte("1 2 3\n")) != normalize([]byte("1 2 3   \n\n")) {
		t.Error("trailing whitespace should not affect equality")
	}
}

func TestCapWriterOverflowFlagsAndKills(t *testing.T) {
	killed := false
	w := &capWriter{limit: 4, kill: func() { killed = true }}
	n, err := w.Write([]byte("ab"))
	if err != nil || n != 2 || w.over {
		t.Fatalf("first write: n=%d err=%v over=%v", n, err, w.over)
	}
	if _, err := w.Write([]byte("cdef")); err != nil {
		t.Fatalf("overflow write returned error: %v", err)
	}
	if !w.over {
		t.Error("expected over=true after exceeding limit")
	}
	if !killed {
		t.Error("expected kill hook to fire on overflow")
	}
	if w.buf.Len() != 4 {
		t.Errorf("buffer should be capped at 4, got %d", w.buf.Len())
	}
}
