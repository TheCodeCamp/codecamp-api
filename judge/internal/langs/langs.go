// Package langs is the allowlist of supported submission languages. Only
// languages registered here can be compiled/run; the language string from a
// submission is normalised and looked up, so untrusted input never reaches a
// shell or selects an arbitrary command.
package langs

import "path/filepath"

func dirOf(p string) string { return filepath.Dir(p) }

// Spec describes how to compile (optional) and run a submission for one language.
type Spec struct {
	// Ext is the source-file extension (without the dot).
	Ext string
	// Compiled reports whether Compile must run before Run.
	Compiled bool
	// Compile returns the argv (no shell) to compile src into the binary at
	// bin. Only called when Compiled is true.
	Compile func(src, bin string) []string
	// Run returns the argv (no shell) to execute the submission. For compiled
	// languages this runs bin; for interpreted ones it runs the interpreter on src.
	Run func(src, bin string) []string
}

var registry = map[string]Spec{
	"c": {
		Ext:      "c",
		Compiled: true,
		Compile:  func(src, bin string) []string { return []string{"gcc", "-O2", "-o", bin, src, "-lm"} },
		Run:      func(src, bin string) []string { return []string{bin} },
	},
	"cpp": {
		Ext:      "cpp",
		Compiled: true,
		Compile:  func(src, bin string) []string { return []string{"g++", "-O2", "-o", bin, src} },
		Run:      func(src, bin string) []string { return []string{bin} },
	},
	"java": {
		// Source must declare a top-level class named Main.
		Ext:      "java",
		Compiled: true,
		Compile:  func(src, bin string) []string { return []string{"javac", "-d", dirOf(bin), src} },
		Run:      func(src, bin string) []string { return []string{"java", "-cp", dirOf(bin), "Main"} },
	},
	"py": {
		Ext:      "py",
		Compiled: false,
		Run:      func(src, bin string) []string { return []string{"python3", src} },
	},
}

// aliases maps user-facing language names to registry keys.
var aliases = map[string]string{
	"c":       "c",
	"c++":     "cpp",
	"cpp":     "cpp",
	"java":    "java",
	"py":      "py",
	"python":  "py",
	"python3": "py",
}

// Lookup resolves a (possibly aliased) language name to its Spec.
func Lookup(name string) (Spec, bool) {
	key, ok := aliases[name]
	if !ok {
		return Spec{}, false
	}
	spec, ok := registry[key]
	return spec, ok
}

// SourceName is the fixed source filename for a language. Java requires the
// class (and therefore the file) to be named Main.
func (s Spec) SourceName() string {
	if s.Ext == "java" {
		return "Main.java"
	}
	return "Solution." + s.Ext
}
