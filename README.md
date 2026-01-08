# Ralph - Autonomous AI Coding Loops

Ralph is a technique for running AI coding agents in a loop. You run the same prompt repeatedly. The AI picks its own tasks from a PRD. It commits after each feature. You come back later to working code.

This repository provides a ready-to-use Ralph setup with scripts, examples, and best practices.

## What is Ralph?

Ralph flips the traditional AI coding workflow on its head:

**Traditional**: You write detailed prompts for each task, supervising every step.

**Ralph**: You write a PRD once, then let the AI autonomously work through it task by task.

The loop:
1. AI reads the PRD and progress file
2. AI picks the next task to implement
3. AI writes code, runs tests, and commits
4. AI updates the progress file
5. Loop repeats until PRD is complete

## Prerequisites

### 1. Install Claude Code

Claude Code is Anthropic's CLI for agentic coding. Install with the native binary:

```bash
curl -fsSL https://anthropic.com/install-claude.sh | sh
```

If you get "command not found: claude" after installing, add it to your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Alternatively, install via npm:

```bash
npm i -g @anthropic-ai/claude-code
```

Run `claude` to authenticate with your Anthropic account.

### 2. Install Docker Desktop (Optional but Recommended)

Docker Desktop lets you run Claude Code in an isolated sandbox. The AI can execute commands, install packages, and modify files without touching your local machine.

Install [Docker Desktop 4.50+](https://www.docker.com/products/docker-desktop/), then run:

```bash
docker sandbox run claude
```

Key benefits of sandboxes:
- Your working directory mounts at the same path inside the container
- Git config is auto-injected for proper commit attribution
- One sandbox per workspace - state persists between runs

See the [Docker Sandboxes docs](https://docs.anthropic.com/claude/docs/docker-sandboxes) for more.

## Quick Start

### For New Projects

**Option 1: Clone as template**
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ralph.git my-project
cd my-project

# Remove git history and start fresh
rm -rf .git
git init
git add -A
git commit -m "Initial commit from Ralph template"
```

**Option 2: Use as GitHub template**
- Click "Use this template" on GitHub
- Create your new repository
- Clone your new repo

**Option 3: Copy into existing project**
```bash
# From your project directory
curl -L https://github.com/YOUR_USERNAME/ralph/archive/main.tar.gz | tar xz --strip=1
```

### Setup

1. **Customize the PRD** (`PRD.md`) for your project:
   - Define clear, discrete tasks
   - Use markdown checklist format
   - Be specific about requirements

2. **Run human-in-the-loop Ralph** to test:
   ```bash
   ./ralph-once.sh
   ```
   Watch what it does, check the commit, run again.

3. **Go autonomous** when ready:
   ```bash
   ./afk-ralph.sh 20  # Run for 20 iterations
   ```

4. **Come back to working code** - check commits and progress.txt

**Note:** Replace `YOUR_USERNAME/ralph` with the actual repo URL when published.

## Coding Standards (.claude/claude.md)

This repo includes `.claude/claude.md` - a comprehensive coding standards file that guides Claude's behavior during Ralph loops.

**What it covers:**
- **Language preferences** - TypeScript by default, Python for data science, etc.
- **Code style** - Minimal comments, self-documenting code, clear naming
- **Testing standards** - 80% minimum coverage, test-first approach
- **Architecture patterns** - Keep it simple, avoid over-engineering
- **Git commit standards** - Conventional commits, atomic changes
- **Security best practices** - Input validation, no committed secrets
- **Anti-patterns to avoid** - Common mistakes and how to fix them

Claude automatically reads this file and follows these standards during execution. Customize `.claude/claude.md` for your project's specific needs.

**Key philosophy:**
- Code should be self-documenting (minimal comments)
- Tests are mandatory before marking tasks complete
- Simple solutions over clever ones
- Working code > perfect code

See `.claude/claude.md` for the full guide.

## Quality Hooks (.claude/hooks/)

Hooks allow you to enforce quality standards automatically. This repo includes example hooks:

**Available hooks:**
- `pre-commit-lint.sh` - Run linting before each commit
- `pre-commit-test.sh` - Run tests before each commit

**How to use:**
```bash
# Option 1: Configure in Claude Code settings
# Add to ~/.config/claude/settings.json:
{
  "hooks": {
    "pre-commit": ".claude/hooks/pre-commit-test.sh"
  }
}

# Option 2: Git pre-commit hook
cp .claude/hooks/pre-commit-test.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Why use hooks?**
- Prevent commits with failing tests
- Catch linting errors early
- Enforce code quality automatically
- Stop Ralph loops when quality issues arise

See `.claude/hooks/README.md` for creating custom hooks (coverage checks, bundle size limits, security audits, etc.).

## Memory System (.ai/ralph/)

Ralph now includes **commit-anchored memory** to maintain context efficiently across iterations without bloating token usage.

### How It Works

**Two files track progress:**

1. **`.ai/ralph/plan.md`** - Current task plan (overwritten each iteration)
   - Written BEFORE implementation starts
   - Defines: goal, files to modify, tests to write, exit criteria
   - Prevents scope creep - Claude commits to a plan before coding

2. **`.ai/ralph/index.md`** - Commit history log (append-only)
   - Written AFTER each successful commit
   - One entry per commit, keyed by SHA
   - 5-7 lines max per entry
   - Provides compressed context from previous iterations

### The Planning Phase

Every iteration follows this flow:

```
1. Read PRD + progress.txt + last 3 entries from index.md
2. Pick next incomplete task
3. Write plan.md (what, where, how, done-when)
4. Execute the plan
5. Run tests
6. Commit changes
7. Append summary to index.md
8. Update progress.txt
```

### Example plan.md

```markdown
## Goal
Add JWT authentication to API endpoints.

## Files
- src/auth.ts - create auth service with token generation
- src/middleware/auth.ts - JWT verification middleware
- tests/auth.test.ts - unit tests for auth service

## Tests
- Token generation with valid credentials
- Token verification succeeds with valid token
- Token verification fails with expired/invalid token
- Middleware blocks unauthenticated requests

## Exit Criteria
- All tests pass with 80%+ coverage
- Endpoints protected by auth middleware
- No security vulnerabilities
- Changes committed with clear message
```

### Example index.md Entry

```markdown
## a3f5c21 — Add JWT authentication
- files: src/auth.ts, src/middleware/auth.ts, tests/auth.test.ts
- tests: 12 passing
- notes: Used jsonwebtoken library, tokens expire in 24h
- next: Add password reset flow
```

### Benefits

**Context efficiency:**
- Read last 3-5 commits instead of entire git history
- Claude gets compressed, relevant context
- Saves tokens on every iteration

**Scope control:**
- Plan written before coding prevents feature creep
- Clear exit criteria define "done"
- One task per iteration enforced by structure

**Visibility:**
- See what's about to happen (plan.md)
- See what happened (index.md)
- Track progress without reading full git log

**Memory persistence:**
- Context survives across sessions
- Resume work without re-explaining history
- New Claude instances can pick up where you left off

### File Locations

The `.ai/` directory is for AI runtime artifacts (separate from `.claude/` config):

```
.ai/ralph/
├── plan.md    # Current iteration plan
└── index.md   # Commit history log
```

This separation allows portability - if you switch from Claude Code to another AI tool, memory format stays consistent.

## Usage

### Human-in-the-Loop Mode

Use `ralph-once.sh` when you want to observe each iteration:

```bash
./ralph-once.sh
```

This runs Claude once, implementing a single task. You can:
- Review the changes
- Check the commit
- Verify tests pass
- Run it again when ready

**Perfect for:**
- First time using Ralph
- Learning how it works
- Projects where you want tight control

### Autonomous Mode

Use `afk-ralph.sh` to let Ralph work independently:

```bash
./afk-ralph.sh <iterations>
```

Examples:
```bash
./afk-ralph.sh 10   # Run for 10 iterations
./afk-ralph.sh 50   # Run for 50 iterations
```

The loop will:
- Stop early if the PRD is complete
- Exit on any error
- Output progress after each iteration

**Perfect for:**
- Well-defined PRDs
- Low-risk tasks
- Going AFK while code gets written

### Running in Docker Sandbox

Recommended for safety and isolation:

```bash
# Human-in-the-loop
docker sandbox run claude ./ralph-once.sh

# Autonomous
docker sandbox run claude ./afk-ralph.sh 20
```

The sandbox:
- Isolates file changes from your host
- Mounts your directory at the same path
- Preserves state between runs
- Auto-injects git config for commits

## Writing Good PRDs

The quality of your PRD determines Ralph's success. Follow these guidelines:

### ✅ Do

- **Break down into atomic tasks** - Each task should be one clear feature or fix
- **Use clear acceptance criteria** - Define "done" for each task
- **Order tasks logically** - Dependencies should come before dependent tasks
- **Be specific** - "Add user authentication with JWT" beats "Make it secure"
- **Include testing requirements** - "Write unit tests for X" as explicit tasks

### ❌ Don't

- **Vague goals** - "Make it better" or "Improve performance"
- **Massive tasks** - "Build the entire backend" (break it down!)
- **Missing context** - Assume AI knows your tech stack and constraints
- **Ambiguous scope** - "Add some tests" (how many? for what?)

### Example: Good vs Bad

**Bad PRD:**
```markdown
- Make a web app
- Add features
- Make it fast
```

**Good PRD:**
```markdown
- [ ] Setup Express.js server with basic routing
- [ ] Create User model with mongoose (fields: name, email, password)
- [ ] Implement POST /api/register endpoint with validation
- [ ] Add bcrypt password hashing
- [ ] Write unit tests for User model
- [ ] Write integration tests for registration endpoint
- [ ] Add rate limiting middleware (max 5 requests/min)
- [ ] Document API endpoints in README
```

## Customization

Ralph is just a loop - customize it for your workflow.

### Change the Task Source

Instead of a local PRD, pull tasks from:
- GitHub Issues: `gh issue list --json title,body`
- Linear: Use Linear API to fetch issues
- Notion: Query a database of tasks
- Any task tracker with a CLI or API

### Change the Output

Instead of committing to main:
- Create a branch and open a PR for each task
- Push to a review branch for manual approval
- Generate a summary report instead of committing

### Specialized Loops

See the `examples/` directory for specialized loop types:

- **test-coverage-loop.sh** - Continuously improve test coverage
- **linting-loop.sh** - Fix linting errors one by one
- **refactor-loop.sh** - Clean up code duplication and smells
- **pr-review-loop.sh** - Create a PR for each task (requires GitHub CLI)

Any task that fits "look at repo, improve something, commit" works with Ralph.

## Examples

This repository includes four example loop variations:

### Test Coverage Loop
```bash
./examples/test-coverage-loop.sh 20 80
```
Runs 20 iterations, targeting 80% coverage. Finds uncovered code and writes tests.

### Linting Loop
```bash
./examples/linting-loop.sh 30
```
Fixes linting errors one at a time. Customize the linter command inside the script.

### Refactoring Loop
```bash
./examples/refactor-loop.sh 15
```
Detects code duplication with jscpd and refactors into shared utilities.

### PR Review Loop
```bash
./examples/pr-review-loop.sh 10
```
Creates a feature branch and PR for each task. Perfect for team workflows requiring code review. Requires GitHub CLI (`gh`).

**Each example includes:**
- Clear comments explaining how to customize
- Adjustable parameters (coverage target, iteration count, etc.)
- Completion detection

## Troubleshooting

### "command not found: claude"

Add Claude Code to your PATH:
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Ralph keeps working on the same task

The PRD or progress file might be ambiguous. Make sure:
- Tasks are clearly marked as complete in progress.txt
- PRD uses checkboxes `- [ ]` for incomplete, `- [x]` for complete
- Each task is atomic and well-defined

### Tests keep failing

Add this to your PRD:
```markdown
- [ ] Fix any test failures before proceeding to next task
```

Or modify the loop to stop on test failure:
```bash
# Add to the script after test run
if [ $? -ne 0 ]; then
  echo "Tests failed, stopping loop"
  exit 1
fi
```

### Too many iterations used

Your tasks might be too large. Break them down:
- Split "Build authentication system" into 5-10 smaller tasks
- Each task should be implementable in one focused coding session

### Commits are too large

Emphasize in the prompt:
```
ONLY WORK ON A SINGLE, SMALL TASK.
If a task seems large, break it into smaller pieces and do one piece.
```

### Docker sandbox issues

Make sure:
- Docker Desktop is running
- You're using version 4.50+
- Your directory is mounted (it happens automatically)

## How It Works

### The Loop Mechanism

1. **Read State**: Claude reads `PRD.md` and `progress.txt`
2. **Pick Task**: Finds the next incomplete task
3. **Implement**: Writes code, runs tests
4. **Commit**: Creates a git commit
5. **Update Progress**: Appends to progress.txt
6. **Repeat**: Loop continues

### Completion Detection

The autonomous loop (`afk-ralph.sh`) looks for `<promise>COMPLETE</promise>` in Claude's output. When the PRD is complete, Claude outputs this sigil and the loop exits early.

### Permission Mode

Scripts use `--permission-mode acceptEdits` to auto-accept file changes. This prevents the loop from stalling on confirmation prompts.

### Print Mode

The `-p` flag runs Claude in non-interactive mode, outputting to stdout. This allows the loop to capture results and check for completion.

## Project Structure

```
ralph/
├── README.md                      # This file
├── ralph-once.sh                  # Human-in-the-loop script
├── afk-ralph.sh                   # Autonomous loop script
├── PRD.md                         # Example PRD (todo app)
├── progress.txt                   # Progress tracking
├── .gitignore                     # Common ignores
├── .ai/
│   └── ralph/
│       ├── plan.md                # Current task plan (overwritten)
│       └── index.md               # Commit history log (append-only)
├── .claude/
│   ├── claude.md                  # Coding standards and preferences
│   └── hooks/
│       ├── README.md              # Hook documentation
│       ├── pre-commit-lint.sh     # Linting hook example
│       └── pre-commit-test.sh     # Testing hook example
└── examples/
    ├── test-coverage-loop.sh      # Test coverage improvement
    ├── linting-loop.sh            # Lint fixing loop
    ├── refactor-loop.sh           # Code cleanup loop
    └── pr-review-loop.sh          # PR-per-task workflow
```

## Best Practices

1. **Start small** - Use ralph-once.sh first to build intuition
2. **Write detailed PRDs** - More clarity = better results
3. **Use Docker sandboxes** - Isolation prevents accidents
4. **Check commits regularly** - Even in autonomous mode, review progress
5. **Set iteration limits** - Cap loops to prevent runaway costs
6. **Include tests in PRD** - Make testing an explicit task
7. **One task at a time** - Emphasize this in your prompts

## Cost Management

Ralph runs Claude repeatedly, which incurs API costs:
- **Monitor usage** in your Anthropic dashboard
- **Set iteration limits** to cap spending
- **Use Docker sandboxes** to avoid accidental changes
- **Start with small PRDs** to estimate cost per iteration

Estimate: ~$0.10-0.50 per iteration depending on task complexity and codebase size.

## Credits

Ralph was created by [Andrew Ettinger](https://twitter.com/aettinger). This repository is a reusable implementation based on his guide.

**Original article**: [How to Build with Ralph](https://www.ettinger.dev/how-to-build-with-ralph)

**Related resources**:
- [11 Tips for AI Coding with Ralph](https://www.ettinger.dev/11-tips-for-ai-coding-with-ralph)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)
- [Docker Sandboxes Guide](https://docs.anthropic.com/claude/docs/docker-sandboxes)

## License

MIT - Feel free to use and modify for your projects.

## Contributing

Contributions welcome! Some ideas:
- Additional example loops (security scanning, documentation, etc.)
- Integration with other task trackers
- Improved error handling
- Better completion detection

Open an issue or PR to contribute.
