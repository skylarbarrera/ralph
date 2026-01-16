# Architecture

How Ralphie works under the hood.

## The Loop

```
┌─────────────────────────────────────────────────┐
│  You: ralphie spec "my idea"                    │
│       ↓                                         │
│  AI interviews → generates SPEC.md              │
│       ↓                                         │
│  You: ralphie run --all                         │
│       ↓                                         │
│  ┌──────────────────────────────────────────┐   │
│  │  Loop:                                   │   │
│  │    1. Read SPEC.md                       │   │
│  │    2. Pick next unchecked task           │   │
│  │    3. Implement + test                   │   │
│  │    4. Commit                             │   │
│  │    5. Exit (fresh restart)               │   │
│  └──────────────────────────────────────────┘   │
│       ↓                                         │
│  Done: working code in git history              │
└─────────────────────────────────────────────────┘
```

## Why It Works

**Progress lives in git, not the LLM's context.**

Each iteration starts fresh—no accumulated confusion. The AI can fail, hallucinate, or get stuck. Doesn't matter. Next iteration reads committed state and continues.

This is the [Ralph Wiggum technique](https://github.com/ghuntley/how-to-ralph-wiggum): iteration beats perfection.

## Project Structure

After `ralphie init`:

```
your-project/
├── SPEC.md              # Task checklist (the contract)
├── STATE.txt            # Progress log
└── .ai/ralphie/
    ├── plan.md          # Current task plan
    └── index.md         # History across iterations
```

| File | Purpose |
|------|---------|
| `SPEC.md` | Tasks with `- [ ]` checkboxes. Ralphie checks them off. |
| `STATE.txt` | What's done, what failed, context for next iteration. |
| `.ai/ralphie/plan.md` | Current iteration's implementation plan. |

## Stuck Detection

If no tasks complete after N iterations (default: 3), Ralphie exits with code 1.

```bash
ralphie run --stuck-threshold 5   # More patience
ralphie run --stuck-threshold 1   # Fail fast
```

## Modes

| Mode | Flag | Use Case |
|------|------|----------|
| Interactive | (default) | Watch progress in TUI |
| Headless | `--headless` | CI/CD, automation |
| Greedy | `--greedy` | Multiple tasks per iteration |

See [cli.md](cli.md) for details.
