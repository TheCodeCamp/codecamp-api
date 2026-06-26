//go:build !windows

package sandbox

import "syscall"

// applyLimits caps CPU time, data segment, file-write size and open files for
// the current process. These constants exist on both Linux and Darwin.
func applyLimits(l Limits) error {
	set := func(res int, v uint64) error {
		rl := &syscall.Rlimit{Cur: v, Max: v}
		return syscall.Setrlimit(res, rl)
	}
	if l.CPUSeconds > 0 {
		if err := set(syscall.RLIMIT_CPU, l.CPUSeconds); err != nil {
			return err
		}
	}
	if l.MemBytes > 0 {
		if err := set(syscall.RLIMIT_DATA, l.MemBytes); err != nil {
			return err
		}
	}
	if l.FileBytes > 0 {
		if err := set(syscall.RLIMIT_FSIZE, l.FileBytes); err != nil {
			return err
		}
	}
	if l.OpenFiles > 0 {
		if err := set(syscall.RLIMIT_NOFILE, l.OpenFiles); err != nil {
			return err
		}
	}
	return nil
}

func execProg(prog string, argv []string, env []string) error {
	return syscall.Exec(prog, argv, env)
}
