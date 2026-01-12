# Ralph Coding Standards

This file defines coding standards and preferences for AI agents working in Ralph loops.

## Language Preferences

### Default: TypeScript
- Use TypeScript by default for all new projects unless requirements explicitly state otherwise
- Prefer strict mode: `"strict": true` in tsconfig.json
- Use modern ES6+ syntax (async/await, destructuring, arrow functions)

### When to use Python
- Data science, ML, or scientific computing projects
- When SPEC explicitly requires Python
- When existing codebase is Python
- For CLI tools where Python stdlib is sufficient

### When to use other languages
- Follow the existing codebase language
- Respect SPEC requirements
- Go for systems programming or high-performance needs
- Rust for systems-level safety requirements

## Code Style

### Comments
- **NO comments unless absolutely necessary**
- Code should be self-documenting through clear naming
- Only add comments for:
  - Complex algorithms that aren't immediately obvious
  - Edge cases and gotchas
  - Public API documentation (JSDoc/docstrings)
  - "Why" not "what" - explain reasoning, not mechanics

**Bad:**
```typescript
// Get the user name
const userName = user.name;

// Loop through items
for (const item of items) {
  // Process the item
  processItem(item);
}
```

**Good:**
```typescript
const userName = user.name;

for (const item of items) {
  processItem(item);
}
```

**Acceptable comment:**
```typescript
// Use binary search instead of linear - dataset can be 100k+ items
const index = binarySearch(sortedItems, target);

// Edge case: API returns null instead of empty array for new users
const orders = response.orders ?? [];
```

### Naming Conventions
- Use descriptive, meaningful names
- Prefer `getUserById` over `get` or `fetchUser`
- Boolean variables: `isLoading`, `hasPermission`, `canEdit`
- Avoid abbreviations unless widely known (`id`, `url`, `api` are fine)

### Function Size
- Keep functions small and focused (< 50 lines ideal)
- One responsibility per function
- Extract complex logic into named helper functions

### Error Handling
- Use proper error handling, don't swallow errors silently
- TypeScript: Return types with explicit error types
- Python: Raise specific exceptions, not generic Exception
- Log errors with context before re-throwing

## Testing Standards

### Coverage Requirements
- Aim for **80% minimum** code coverage
- 100% coverage for:
  - Core business logic
  - Utility functions
  - Security-critical code
  - Public APIs

### Testing Strategy
- Write tests BEFORE marking a feature complete
- Unit tests for individual functions/classes
- Integration tests for workflows
- E2E tests for critical user paths

### Test Structure
```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('returns user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, name: 'Alice' };

      // Act
      const user = await userService.getUserById(userId);

      // Assert
      expect(user).toEqual(expectedUser);
    });

    it('throws NotFoundError when user does not exist', async () => {
      await expect(userService.getUserById('nonexistent'))
        .rejects.toThrow(NotFoundError);
    });
  });
});
```

## Architecture Patterns

### Keep It Simple
- Don't over-engineer
- Avoid premature abstraction
- Three similar lines > one premature abstraction
- Build for current requirements, not hypothetical future

### File Organization
```
src/
├── models/          # Data models/types
├── services/        # Business logic
├── controllers/     # Request handlers (if web app)
├── utils/           # Pure utility functions
├── config/          # Configuration
└── index.ts         # Entry point

tests/
├── unit/
├── integration/
└── e2e/
```

### Separation of Concerns
- Models: Data structures only
- Services: Business logic, orchestration
- Controllers: Input validation, response formatting
- Utils: Pure functions, no side effects

## Git Commit Standards

### Commit Messages
Follow conventional commits:

```
type(scope): brief description

Longer explanation if needed.

- Bullet points for multiple changes
- Reference issue numbers: #123
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code change that neither fixes bug nor adds feature
- `test:` Adding or updating tests
- `docs:` Documentation only changes
- `chore:` Maintenance tasks

**Examples:**
```
feat(auth): add JWT token refresh mechanism

fix(api): handle null response from user service

refactor(utils): extract duplicate validation logic

test(user-service): add tests for edge cases
```

### Commit Size
- **One logical change per commit**
- Commits should be atomic and revertable
- If you can't describe it in one line, it's probably too big

## Performance Considerations

### Do Optimize
- Database queries (use indexes, avoid N+1)
- API response times (< 200ms ideal)
- Bundle sizes for web apps
- Memory leaks in long-running processes

### Don't Optimize Prematurely
- Micro-optimizations before profiling
- Complex caching before measuring benefit
- Over-engineering for hypothetical scale

### When to Profile
- After implementing a feature, before optimizing
- When performance issues are reported
- For critical paths (hot loops, frequent API calls)

## Security Best Practices

### Always Validate
- Validate ALL user input
- Sanitize data before DB queries
- Use parameterized queries (never string concatenation)
- Validate file uploads (type, size, content)

### Never Commit
- API keys, secrets, passwords
- `.env` files with real credentials
- Private keys or certificates
- Personal or sensitive data

### Authentication & Authorization
- Use established libraries (Passport.js, Auth0, etc.)
- Never roll your own crypto
- Implement rate limiting
- Use HTTPS only in production

## Dependencies

### When to Add Dependencies
- Established, well-maintained libraries for complex problems
- Security-critical functionality (auth, crypto)
- Significant time savings vs. implementation cost

### When NOT to Add Dependencies
- Simple utilities you can write in 10 lines
- Poorly maintained packages (old, few contributors)
- Dependencies with dependencies with dependencies
- For functionality already in stdlib

### Check Before Adding
```bash
# Check package stats
npm info <package>

# Check for vulnerabilities
npm audit

# Check bundle size impact
npx bundlephobia <package>
```

## Ralph-Specific Guidelines

### Required Reading
Before starting work in a Ralph loop:
- **Always read:** `SPEC.md` - Project requirements and task list
- **Read if needed:** `STATE.txt` - Check if unsure what's already done
- **Read if needed:** `.ai/ralph/index.md` - Last 3-5 commits for context

Lazy load context. SPEC has the tasks; only read progress/index if you need to verify state.

### Creating SPECs (Interactive)

When a user asks to create a new SPEC, use the **AskUserQuestion** tool to conduct a structured interview. This ensures you gather all requirements before generating the SPEC.

**Three Question Batches:**

Run these in sequence, using the answers from each batch to inform the next:

**Batch 1: Technical Foundation**
```
AskUserQuestion with questions:
- "Language/Framework?" - Options: TypeScript/Node.js, Python, Go, Rust
- "Architecture?" - Options: CLI tool, Web API, Library, Full-stack app
- "Primary data store?" - Options: None/in-memory, SQLite/file-based, PostgreSQL/MySQL, Redis/MongoDB
```

**Batch 2: Feature Scope**
```
AskUserQuestion with questions:
- "Core features?" - (multiSelect: true) Options based on architecture choice
- "Authentication needed?" - Options: None, API keys, JWT/sessions, OAuth
- "External integrations?" - (multiSelect: true) Options: None, REST APIs, Webhooks, Message queues
```

**Batch 3: Quality Gates**
```
AskUserQuestion with questions:
- "Testing level?" - Options: Unit tests only, Unit + integration, Full coverage (unit/integration/e2e)
- "Documentation needs?" - Options: Code comments only, README + API docs, Full documentation site
```

**Example AskUserQuestion Call:**

```typescript
AskUserQuestion({
  questions: [
    {
      question: "What language and framework should we use?",
      header: "Stack",
      multiSelect: false,
      options: [
        { label: "TypeScript/Node.js (Recommended)", description: "Modern JS with type safety, great for APIs and CLIs" },
        { label: "Python", description: "Excellent for data processing, ML, and scripting" },
        { label: "Go", description: "Fast compilation, great for systems and networking" },
        { label: "Rust", description: "Memory safety, ideal for performance-critical systems" }
      ]
    },
    {
      question: "What type of application is this?",
      header: "Type",
      multiSelect: false,
      options: [
        { label: "CLI tool", description: "Command-line interface application" },
        { label: "Web API", description: "REST or GraphQL backend service" },
        { label: "Library", description: "Reusable package/module" },
        { label: "Full-stack app", description: "Frontend + backend application" }
      ]
    }
  ]
})
```

**Interview Flow:**

1. **Ask Batch 1** → Understand technical constraints
2. **Ask Batch 2** → Scope features based on architecture
3. **Ask Batch 3** → Set quality expectations
4. **Generate SPEC** → Create structured tasks optimized for iteration efficiency

**Important:** When starting a new project, replace the existing SPEC.md entirely. Each SPEC represents one project or feature set.

### Writing SPECs

When generating a SPEC, optimize for **iteration efficiency**. Each checkbox = one Ralph iteration (~3 min), so structure matters.

**Batch by default.** Group related tasks under one checkbox:

```markdown
# BAD - 4 iterations (12 min)
- [ ] Create ThoughtItem.tsx
- [ ] Create ToolActivityItem.tsx
- [ ] Create CommitItem.tsx
- [ ] Create PhaseIndicator.tsx

# GOOD - 1 iteration (4 min)
- [ ] Create activity feed components (ThoughtItem, ToolActivityItem, CommitItem, PhaseIndicator)
```

**Batch when:**
- Same file or same directory
- Similar structure (4 similar components = 1 task)
- Tightly coupled (interface + implementation)
- Style/config changes across files

**Don't batch when:**
- Different areas of codebase
- Complex logic needing focus
- Tasks where one failure shouldn't block others

**Always include tests with implementation:**
```markdown
# BAD - tests as separate task
- [ ] Create usePulse.ts hook
- [ ] Create usePulse.test.ts

# GOOD - tests included
- [ ] Create usePulse.ts hook with tests
```

### Memory System (.ai/ralph/)

Ralph uses commit-anchored memory to maintain context efficiently.

**Two files:**

1. **`.ai/ralph/plan.md`** - Current task plan (overwritten each iteration)
   - Written BEFORE implementation starts
   - Defines scope, files, tests, exit criteria
   - Prevents scope creep

2. **`.ai/ralph/index.md`** - Commit history log (append-only)
   - Written AFTER each successful commit
   - One entry per commit, keyed by SHA
   - 5-7 lines max per entry

**Planning Phase (MANDATORY):**

Before implementing any task:
1. Read SPEC.md, STATE.txt, and last 3 entries from index.md
2. **Spawn exploration agents** (if needed) to understand unfamiliar code
3. Write plan to `.ai/ralph/plan.md` using this format:
```markdown
## Goal
One sentence describing what this iteration accomplishes.

## Files
- src/feature.ts - add new function
- tests/feature.test.ts - unit tests

## Tests
- Test scenario 1
- Test scenario 2

## Exit Criteria
- Function works with valid input
- Tests pass with 80%+ coverage
- Changes committed
```

**Task(Explore) Protocol:**

Before writing your plan, spawn parallel exploration agents to understand unfamiliar parts of the codebase. This is faster than reading files sequentially and helps you make better architectural decisions.

**When to Explore:**
- Working in a new area of the codebase
- Task involves multiple interconnected modules
- Unsure about existing patterns or conventions
- Need to understand how similar features were implemented

**When to Skip:**
- Working on a file you've modified recently
- Simple changes to isolated functions
- Task is well-defined with specific file paths in SPEC

**Spawn Parallel Agents:**

Use the Task tool with `subagent_type='Explore'` to spawn agents that search the codebase in parallel:

```typescript
// Spawn 2-3 exploration agents in parallel (single message with multiple Task calls)
Task({
  subagent_type: 'Explore',
  description: 'Find auth patterns',
  prompt: 'Find how authentication is implemented. Look for middleware, JWT handling, session management. Report file paths and key patterns.'
})

Task({
  subagent_type: 'Explore',
  description: 'Find test patterns',
  prompt: 'Find testing patterns for API endpoints. Look for test setup, mocking strategies, assertion patterns. Report examples I can follow.'
})

Task({
  subagent_type: 'Explore',
  description: 'Find error handling',
  prompt: 'Find error handling patterns. Look for custom error classes, error middleware, response formatting. Report the conventions used.'
})
```

**What to Explore:**
- **Architecture**: "How is [feature] structured? What files/modules are involved?"
- **Patterns**: "What patterns are used for [X]? Show me examples."
- **Dependencies**: "What does [module] depend on? What depends on it?"
- **Conventions**: "What naming/file structure conventions are used?"

**Using Results:**
- Wait for all agents to complete before writing plan
- Incorporate discovered file paths into your plan's Files section
- Follow patterns the agents identify (don't invent new ones)
- Note any concerns or blockers in your plan

**Memory Index Format:**

After committing, append to `.ai/ralph/index.md`:
```markdown
## abc1234 — Add user authentication
- files: src/auth.ts, tests/auth.test.ts
- tests: 12 passing
- notes: Used bcrypt for password hashing
- next: Add password reset endpoint
```

**Hard Rules:**
- No commit = no index entry
- Plan must exist before coding starts
- Keep summaries concise (context window optimization)
- Read index.md only for last 3-5 commits (not entire history)

### Task Completion Criteria
A task is ONLY complete when:
- [ ] Code is written and works
- [ ] Tests are written and passing
- [ ] No linting errors
- [ ] Documentation updated (if public API)
- [ ] Changes committed with clear message

### Code Review Protocol

Before committing, spawn a review agent to catch issues you might have missed. This adds ~30 seconds but prevents bugs and maintains code quality.

**When to Review:**
- After tests pass, before committing
- For any task that changes logic or adds features
- When modifying code you didn't write

**When to Skip:**
- Documentation-only changes
- Simple config/dependency updates
- Trivial fixes (typos, formatting)

**Spawn Review Agent:**

```typescript
Task({
  subagent_type: 'general-purpose',
  description: 'Review code changes',
  prompt: `Review my changes for this task: [TASK DESCRIPTION]

Files changed:
- [list files]

Check for:
1. **Bugs**: Logic errors, edge cases, null handling
2. **Tests**: Coverage gaps, missing assertions, fragile tests
3. **Patterns**: Consistency with codebase conventions
4. **Security**: Input validation, injection risks, secrets exposure
5. **Performance**: N+1 queries, unnecessary loops, memory leaks

Respond with:
- CRITICAL: Issues that must be fixed before commit
- SUGGESTIONS: Improvements to consider (optional to address)
- APPROVED: If no critical issues found`
})
```

**Handling Feedback:**

| Response | Action |
|----------|--------|
| CRITICAL issues | Fix them, re-run tests, request another review |
| SUGGESTIONS only | Address if quick (<2 min), otherwise note for future |
| APPROVED | Proceed to commit |

**Example Review Flow:**

```
1. Implement feature + tests
2. Run tests (npm test) → pass
3. Run type check (npm run type-check) → pass
4. Spawn review agent with diff summary
5. Agent responds: "APPROVED" or "CRITICAL: [issue]"
6. If critical: fix and re-review
7. Commit changes
```

### Sub-Task Tracking Protocol

Use the **TodoWrite** tool to break down complex SPEC tasks into granular, trackable sub-steps. This provides real-time visibility into progress and helps maintain focus.

**When to Use TodoWrite:**
- SPEC task has 3+ distinct steps
- Task spans multiple files or concerns
- Implementation order matters
- You want to track progress through a complex task

**When to Skip:**
- Simple, single-action tasks
- Task is already atomic (one file, one change)
- Quick fixes under 5 minutes

**TodoWrite Structure:**

Each sub-task needs three fields:
- `content`: Imperative description ("Create auth middleware")
- `activeForm`: Present continuous for display ("Creating auth middleware")
- `status`: One of `pending`, `in_progress`, `completed`

**Example TodoWrite Call:**

```typescript
// Breaking down: "Add user authentication with JWT"
TodoWrite({
  todos: [
    { content: "Create User model with password hash field", activeForm: "Creating User model", status: "in_progress" },
    { content: "Add JWT token generation utility", activeForm: "Adding JWT utilities", status: "pending" },
    { content: "Create auth middleware for route protection", activeForm: "Creating auth middleware", status: "pending" },
    { content: "Add login and register endpoints", activeForm: "Adding auth endpoints", status: "pending" },
    { content: "Write tests for auth flow", activeForm: "Writing auth tests", status: "pending" }
  ]
})
```

**Workflow:**

1. **Start of task**: Read SPEC task, break into sub-tasks, call TodoWrite with first item as `in_progress`
2. **During implementation**: Update status to `completed` as you finish each sub-task, set next to `in_progress`
3. **End of task**: All sub-tasks should be `completed` before committing

**Rules:**
- Only ONE sub-task should be `in_progress` at a time
- Mark completed IMMEDIATELY after finishing (don't batch)
- Sub-tasks should map to discrete, verifiable actions
- Keep sub-tasks small enough to complete in <10 minutes each

**Integration with SPEC Tasks:**

```
SPEC Task (checkbox):     "Add user authentication with JWT"
                              ↓
Sub-Tasks (TodoWrite):    1. Create User model ✓
                          2. Add JWT utilities ✓
                          3. Create auth middleware ●  ← in_progress
                          4. Add auth endpoints
                          5. Write tests
                              ↓
Commit + check SPEC:      [x] Add user authentication with JWT
```

### Progress Updates
When updating `STATE.txt`, be specific:
```
2024-01-08: Implemented user authentication with JWT
  - Added login/register endpoints
  - Created User model with bcrypt password hashing
  - Tests: 15 passing (auth.test.ts)
  - Commit: feat(auth): add JWT authentication
```

### Error Recovery
If a task fails:
1. Document the error in STATE.txt
2. Don't mark task as complete
3. Create a new task to fix the blocker
4. If blocked on external factor, note it and move to next task

### Hooks Configuration

Claude Code supports hooks that execute at specific points during a conversation. Ralph uses the **Stop hook** to validate that each iteration completed successfully before allowing the next iteration to begin.

**What is the Stop Hook?**

The Stop hook runs when Claude Code finishes responding. For Ralph, this validates that:
- Code changes were implemented
- Tests passed
- Type checks passed (if TypeScript)
- A commit was made
- Tracking files were updated

**Setting Up the Stop Hook:**

Create or update `.claude/settings.json` in your project:

```json
{
  "$schema": "https://raw.githubusercontent.com/anthropics/claude-code/main/schemas/settings.json",
  "hooks": {
    "Stop": [
      {
        "type": "prompt",
        "promptFile": "scripts/validate-iteration.md",
        "description": "Validate Ralph iteration completion"
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(npm test:*)",
      "Bash(npm run type-check:*)",
      "Bash(npx vitest:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)"
    ],
    "deny": []
  }
}
```

**The Validation Prompt:**

The Stop hook uses `scripts/validate-iteration.md` which contains an LLM prompt that checks:

1. **Task Implementation** - Code changes address the SPEC task
2. **Tests Pass** - `npm test` or `npx vitest` ran successfully
3. **Type Check Passes** - `npm run type-check` or `tsc` passed
4. **Commit Made** - Git commit was created with proper message
5. **Index Updated** - `.ai/ralph/index.md` has new entry
6. **SPEC Updated** - Completed task checkbox marked `[x]`
7. **STATE Updated** - `STATE.txt` has progress entry

**Validation Output:**

The validation prompt returns JSON:

```json
{
  "valid": true,
  "checks": {
    "task_implemented": true,
    "tests_passed": true,
    "type_check_passed": true,
    "commit_made": true,
    "index_updated": true,
    "spec_updated": true,
    "state_updated": true
  },
  "issues": [],
  "summary": "Iteration completed successfully: feat(auth): add JWT token refresh"
}
```

If `valid` is `false`, the hook provides specific issues that need to be addressed before the iteration can be considered complete.

**When Validation Fails:**

| Issue | Action |
|-------|--------|
| Tests failed | Fix the failing tests before retrying |
| No commit made | Complete the iteration by committing changes |
| Index not updated | Append entry to `.ai/ralph/index.md` |
| Partial implementation | Complete the remaining parts of the task |

**Disabling the Hook:**

To run Ralph without validation (e.g., for debugging), remove the Stop hook from settings.json or rename the file temporarily.

## Code Review Checklist

Before committing, verify:
- [ ] Code works (manual test + automated tests)
- [ ] Tests pass with good coverage
- [ ] No linting errors
- [ ] No commented-out code
- [ ] No console.log/print statements (use proper logging)
- [ ] No TODO comments (convert to tasks)
- [ ] Error handling is present
- [ ] Security vulnerabilities checked
- [ ] Performance is acceptable
- [ ] Commit message is clear

## Anti-Patterns to Avoid

### Don't Do This
- ❌ Catch and ignore errors without logging
- ❌ Use `any` type in TypeScript
- ❌ Mutate function parameters
- ❌ Write god functions (> 100 lines)
- ❌ Nest callbacks > 3 levels deep
- ❌ Copy-paste code instead of extracting function
- ❌ Skip tests "to save time"
- ❌ Commit broken code
- ❌ Push directly to main without PR (in team settings)

### Do This Instead
- ✅ Log errors with context, then throw/return
- ✅ Use specific types (string, number, CustomType)
- ✅ Return new values, don't mutate
- ✅ Extract into smaller, named functions
- ✅ Use async/await or Promises
- ✅ Extract to shared utility function
- ✅ Write tests first or immediately after
- ✅ Fix before committing
- ✅ Use feature branches + PR for review

## Tools and Linters

### Recommended Setup

**TypeScript:**
```json
{
  "extends": "@typescript-eslint/recommended",
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": "warn"
  }
}
```

**Python:**
```ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
addopts = --cov=src --cov-report=html --cov-report=term

[mypy]
strict = true
warn_return_any = true
warn_unused_configs = true
```

### Run Before Every Commit
```bash
# TypeScript
npm run lint
npm run type-check
npm test

# Python
pylint src/
mypy src/
pytest --cov=src --cov-fail-under=80
```

## Philosophical Principles

1. **Simplicity over cleverness** - Code is read more than written
2. **Explicit over implicit** - Make intentions clear
3. **Working over perfect** - Ship working code, iterate
4. **Tested over untested** - Tests are documentation that code works
5. **Documented over undocumented** - Future you will thank present you
6. **Consistent over innovative** - Follow existing patterns in codebase

---

When in doubt, prioritize:
1. **Working code** - Does it work?
2. **Tested code** - How do we know it works?
3. **Readable code** - Can others understand it?
4. **Maintainable code** - Can it be changed safely?
5. **Performant code** - Is it fast enough?

In that order.
