# CodeCamp

An online coding-judge platform: submit solutions to programming problems, have
them compiled and run against test cases, and track results on contest
leaderboards.

This is the API + frontend monorepo. The codebase was revamped in v2.0.0:
boot-blocking bugs fixed, configuration centralised, secrets moved to the
environment, and the code-execution **judge rewritten in Go** with OS-level
sandboxing.

## Architecture

```
                      ┌─────────────────────────┐
  Browser ──────────► │  Angular SPA            │   (built into server/public)
                      └─────────────┬───────────┘
                                    │ HTTP (REST + JWT)
                      ┌─────────────▼───────────┐
                      │  API server (Node/Express) │  server/  ·  port 80
                      │  users, contests, problems, │
                      │  solutions, rankings        │
                      └──────┬───────────────┬─────┘
                             │ HTTP          │ Mongoose
                  GET /:id   │               ▼
                      ┌──────▼──────┐   ┌──────────┐
                      │ Judge (Go)  │◄──┤ MongoDB  │
                      │ judge/      │   │OnlineJudge│
                      │ port 3001   │   └──────────┘
                      │ gcc/g++/    │
                      │ javac/python│  (rlimit + timeout sandbox)
                      └─────────────┘
```

- **`server/`** — Express API. Auth (JWT), contests, problems, solution
  submission, rankings. Serves the built SPA from `server/public/`.
- **`judge/`** — Go service. Looks up a submission, compiles and runs it under
  CPU/memory/output/wall-clock limits, compares output to the expected file,
  and returns a verdict (`true` / `false` / `"CE"` / `"TLE"` / `"RE"`).
- **`contest/`** — shared Mongoose models (Contest, Problem, Ranking).
- **`codecamp-front/`** — Angular SPA (single-page UI).

The server and judge share one MongoDB. The server writes test cases to
`judge/result/{input,output}/<contest>/<problem>.txt`; the judge reads them.

## Prerequisites

- **Node.js** 18+ and npm (API server + frontend)
- **Go** 1.21+ (judge service)
- **MongoDB** 4.x+ running locally (default `mongodb://127.0.0.1:27017/OnlineJudge`)
- Compilers/interpreters on `PATH` for the languages you want to judge:
  `gcc`, `g++`, `javac`/`java`, `python3`
- A Unix-like OS for the judge (Linux/macOS) — the sandbox uses POSIX `setrlimit`.

## Setup

```bash
# 1. Configure
cp .env.example .env        # then edit secrets / URIs

# 2. Install API server deps
npm install

# 3. Build the frontend (outputs into server/public, served by the API)
npm run start:front
```

### Environment variables (`.env`)

| Variable       | Purpose                                  | Dev default |
|----------------|------------------------------------------|-------------|
| `NODE_ENV`     | `development` / `production`             | development |
| `MONGODB_URI`  | Mongo connection (server + judge)        | `mongodb://127.0.0.1:27017/OnlineJudge` |
| `JWT_SECRET`   | JWT signing/verification secret          | insecure dev fallback |
| `SESSION_KEYS` | comma-separated session keys             | dev keys    |
| `PORT_SERVER`  | API server port                          | 80          |
| `JUDGE_URL`    | where the server reaches the judge       | `http://localhost:3001` |
| `JUDGE_PORT`   | judge listen port                        | 3001        |

In **production** the server refuses to start unless `JWT_SECRET` and
`SESSION_KEYS` are set.

## Running

```bash
npm run start:server   # API server (Node)
npm run start:judge    # judge service (Go)  —  cd judge && go run ./cmd/judge
npm start              # both together (via concurrently)
```

Health checks: `GET http://localhost:80/health` and
`GET http://localhost:3001/health`.

## API (selected endpoints)

| Method | Path                                  | Description                       |
|--------|---------------------------------------|-----------------------------------|
| GET    | `/health`                             | liveness + DB status              |
| POST   | `/users/signup`                       | register (validated)              |
| POST   | `/users/signin`                       | login → JWT                       |
| GET    | `/users/profile`                      | current user (JWT required)       |
| POST   | `/contest`                            | create contest                    |
| GET    | `/contest` · `/contest/:id`           | list / get contest                |
| GET    | `/contest/:id/problems/:code`         | get problem                       |
| POST   | `/solution`                           | submit a solution (validated)     |
| GET    | `/solution/history/:username`         | paginated submission history      |
| GET    | `/rankings/:contestId`                | contest leaderboard               |

## The judge

Supported languages and their submission requirements:

| Language | Aliases             | Notes                                  |
|----------|---------------------|----------------------------------------|
| C        | `c`                 | compiled with `gcc -O2`                |
| C++      | `cpp`, `c++`        | compiled with `g++ -O2`                |
| Java     | `java`              | top-level class **must** be `Main`     |
| Python   | `py`, `python`, `python3` | run with `python3`               |

Each submission runs in a fresh temp directory with `setrlimit` caps on CPU
time, memory, file-write size and open files, plus a wall-clock kill. The
language and filenames come from a fixed allowlist and commands are executed via
`exec` arg-slices (no shell), so submission data can never be injected into a
shell command.

## Testing

```bash
npm run lint     # eslint over server/ + contest/ + scripts/
npm test         # API smoke test (signup → signin → profile); SKIPs if no Mongo
cd judge && go vet ./... && go test ./...   # judge unit tests
```

## Known follow-ups (out of scope for the v2.0.0 revamp)

- Full Angular major-version upgrade (currently aligned on a self-consistent
  Angular 5 + CLI 1.7 toolchain).
- Container-per-submission isolation for the judge (current isolation is
  OS rlimits + timeout; a Docker seam is left for this).
- OAuth login strategies (passport providers were removed as dead code; auth is
  currently username/password + JWT).

## License

[MIT](LICENSE.md)
