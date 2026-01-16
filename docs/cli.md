# CLI Reference

Complete reference for all Ralphie commands and options.

## Commands

### `ralphie run`

Execute iteration loops against your SPEC.

```bash
ralphie run              # Run one iteration
ralphie run -n 5         # Run 5 iterations
ralphie run --all        # Run until SPEC complete (max 100)
ralphie run --greedy     # Complete multiple tasks per iteration
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-n, --iterations <n>` | Number of iterations to run | 1 |
| `-a, --all` | Run until SPEC complete (max 100 iterations) | false |
| `-g, --greedy` | Complete multiple tasks per iteration | false |
| `-p, --prompt <text>` | Custom prompt to send to the AI | - |
| `--prompt-file <path>` | Read prompt from file | - |
| `--cwd <path>` | Working directory | current |
| `--timeout-idle <sec>` | Kill after N seconds idle | 120 |
| `--save-jsonl <path>` | Save raw output to JSONL file | - |
| `--no-branch` | Skip feature branch creation | false |
| `--headless` | Output JSON events instead of UI | false |
| `--stuck-threshold <n>` | Iterations without progress before stuck | 3 |
| `--harness <name>` | AI harness to use: `claude`, `codex` | claude |

### `ralphie spec`

Generate a SPEC.md from a project description.

```bash
ralphie spec "Build a REST API"           # Interactive mode (default)
ralphie spec --auto "Todo app"            # Autonomous with review loop
ralphie spec --headless "Blog platform"   # JSON output for automation
```

#### Options

| Option | Description |
|--------|-------------|
| `--auto` | Generate spec autonomously with review loop, no human interaction |
| `--headless` | Output JSON events, great for automation |

### `ralphie init`

Initialize Ralphie in an existing project.

```bash
cd your-project
ralphie init
```

Creates:
- `.ai/ralphie/` - Working directory for plans and history
- `.claude/ralphie.md` - Coding standards
- `.claude/skills/` - Ralphie skills for Claude Code

### `ralphie validate`

Check project structure and SPEC conventions.

```bash
ralphie validate
```

Validates:
- Required files exist (SPEC.md, etc.)
- SPEC follows conventions (checkboxes, structure)
- Project structure is correct

### `ralphie upgrade`

Upgrade project to latest Ralphie version.

```bash
ralphie upgrade
```

## Greedy Mode

By default, Ralphie follows classic Ralph Wiggum: **one task per iteration**, fresh context each time.

With `--greedy`, Ralphie completes **as many tasks as possible** before context fills up:

```bash
ralphie run --greedy -n 5      # Each iteration does multiple tasks
ralphie run --greedy --all     # Maximum throughput
```

### Tradeoffs

| Aspect | Default (one task) | Greedy (many tasks) |
|--------|-------------------|---------------------|
| Throughput | Slower (overhead per task) | Faster (overhead only at start) |
| Progress visibility | Frequent signals | Batched - wait longer, see more |
| Stuck detection | Precise (clean boundaries) | Less precise (may timeout mid-task) |
| Context | Fresh start each task | Accumulates |
| Error recovery | Clean restart on failure | Errors may cascade |

**Use greedy for:** Related tasks, scaffolding, bulk refactoring, maximum speed.

**Use default for:** Unrelated tasks, complex features, debugging, precise tracking.

## Headless Mode

For automation and CI/CD integration:

```bash
ralphie run --headless -n 10
```

Outputs JSON events to stdout:

```json
{"event":"started","spec":"SPEC.md","tasks":5,"timestamp":"2024-01-15T10:30:00Z"}
{"event":"iteration","n":1,"phase":"starting"}
{"event":"tool","type":"read","path":"src/index.ts"}
{"event":"tool","type":"write","path":"src/utils.ts"}
{"event":"commit","hash":"abc1234","message":"Add utility functions"}
{"event":"task_complete","index":0,"text":"Set up project structure"}
{"event":"iteration_done","n":1,"duration_ms":45000}
{"event":"complete","tasks_done":5,"total_duration_ms":180000}
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All tasks complete |
| 1 | Stuck (no progress after threshold) |
| 2 | Max iterations reached |
| 3 | Fatal error |

### End-to-End Automation

```bash
# Generate spec and run to completion
ralphie spec --headless "my project" && ralphie run --headless --all
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RALPH_HARNESS` | Default harness (claude, codex) |
| `ANTHROPIC_API_KEY` | API key for Claude harness |
| `OPENAI_API_KEY` | API key for Codex harness |

## Configuration File

Create `.ralphie/config.yml` for persistent settings:

```yaml
harness: codex
```

Configuration priority:
1. CLI flags
2. Environment variables
3. Config file
4. Defaults
