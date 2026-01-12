---
name: ralph-iterate
description: Execute one Ralph iteration - load context, explore codebase, plan implementation, write code with tests, review changes, and commit. Use this skill to run a single autonomous coding iteration following the Ralph protocol.
context: fork
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task, TodoWrite, LSP
---

# Ralph Iteration Protocol

Execute ONE complete Ralph iteration: read SPEC, plan, implement, test, review, commit.

## Step 1: Load Context

### 1.1 Read SPEC.md

Find the next incomplete task:
- Look for the first unchecked checkbox: `- [ ]`
- Skip checked items: `- [x]`
- A batched checkbox counts as ONE task (e.g., "Create components A, B, C" = 1 task)

```
Read SPEC.md → Find first `- [ ]` → This is your task for this iteration
```

### 1.2 Check STATE.txt (if needed)

Read `STATE.txt` when:
- Unsure if a task was partially completed
- Need to understand blockers from previous iterations
- Want to verify what was done vs what SPEC shows

Look for:
- ✅ entries (completed work)
- ⚠️ entries (blockers or issues)
- Last completion timestamp

### 1.3 Read Recent Context

Read **last 3-5 entries** from `.ai/ralph/index.md`:
- Extract file patterns (what files were recently changed)
- Note "next:" hints (what the previous iteration recommended)
- Understand recent architectural decisions

**Don't read the entire index** — only recent entries to stay context-efficient.

### 1.4 Break Down with TodoWrite

If the task has **3+ steps**, use TodoWrite to track sub-tasks:

```typescript
TodoWrite({
  todos: [
    {
      content: "Read existing auth code",
      activeForm: "Reading existing auth code",
      status: "pending"
    },
    {
      content: "Create login endpoint",
      activeForm: "Creating login endpoint",
      status: "pending"
    },
    {
      content: "Add input validation",
      activeForm: "Adding input validation",
      status: "pending"
    },
    {
      content: "Write unit tests",
      activeForm: "Writing unit tests",
      status: "pending"
    }
  ]
})
```

**Required fields:**
- `content`: Imperative form (what to do)
- `activeForm`: Present continuous (what's happening)
- `status`: "pending" | "in_progress" | "completed"

**Skip TodoWrite when:**
- Task is atomic (single file, single change)
- Task is documentation-only
- Task can be completed in under 3 steps

## Step 2: Explore (if needed)

Before writing your plan, spawn parallel exploration agents to understand unfamiliar parts of the codebase. This is faster than reading files sequentially and helps you make better architectural decisions.

### 2.1 When to Explore

**Explore when:**
- Working in a new area of the codebase
- Task involves multiple interconnected modules
- Unsure about existing patterns or conventions
- Need to understand how similar features were implemented

**Skip when:**
- Working on files you've modified recently
- Simple changes to isolated functions
- Task specifies exact file paths in SPEC
- Documentation-only changes

### 2.2 Spawn Parallel Agents

Use the Task tool with `subagent_type='Explore'` to spawn agents that search the codebase in parallel. **Send all Task calls in a single message** to run them concurrently:

```typescript
// Example: Exploring for an authentication feature
// Spawn all agents in ONE message (parallel execution)

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

### 2.3 What to Explore

Tailor your exploration prompts to your task:

| Need | Prompt Focus |
|------|--------------|
| **Architecture** | "How is [feature] structured? What files/modules are involved?" |
| **Patterns** | "What patterns are used for [X]? Show me examples." |
| **Dependencies** | "What does [module] depend on? What depends on it?" |
| **Conventions** | "What naming/file structure conventions are used?" |
| **Similar features** | "How is [existing similar feature] implemented?" |

### 2.4 Using Exploration Results

Once all agents complete:

1. **Wait for completion** — don't proceed until all agents return
2. **Extract file paths** — incorporate discovered paths into your plan's Files section
3. **Follow patterns** — use patterns the agents identify (don't invent new ones)
4. **Note concerns** — document any blockers or risks in your plan
5. **Update sub-tasks** — add/remove TodoWrite items based on findings

```
Exploration Results → Informs Plan → Guides Implementation
```

## Step 3: Plan

Write your plan to `.ai/ralph/plan.md` **before writing any code**. The plan is your contract for this iteration — it defines scope, prevents creep, and provides a clear completion target.

### 3.1 Write the Goal

The Goal is a **single sentence** that describes what this iteration accomplishes. It should be:
- **Specific**: Name the feature, component, or fix
- **Completable**: Something achievable in one iteration
- **Verifiable**: You can objectively confirm it's done

**Good goals:**
```markdown
## Goal
Add JWT token refresh endpoint that returns a new access token when given a valid refresh token.
```

```markdown
## Goal
Fix race condition in WebSocket reconnection that causes duplicate message handlers.
```

**Bad goals (too vague):**
```markdown
## Goal
Improve authentication.  ← What specifically? Add? Fix? Refactor?
```

```markdown
## Goal
Work on the API.  ← Which endpoint? What change?
```

### 3.2 List the Files

List every file you plan to create or modify with a brief note about what changes:

```markdown
## Files
- src/auth/refresh.ts - create token refresh endpoint
- src/auth/middleware.ts - add refresh token validation
- src/auth/types.ts - add RefreshTokenPayload type
- tests/auth/refresh.test.ts - unit tests for refresh flow
```

**Guidelines:**
- **Be explicit** — list actual file paths, not "auth files"
- **Include tests** — every implementation file should have a corresponding test file
- **Note the action** — "create", "modify", "add", "fix", "remove"
- **Use exploration results** — if Step 2 found patterns in specific files, reference them

If you're unsure which files need changes, your exploration in Step 2 was incomplete. Go back and explore more before planning.

### 3.3 Define the Tests

List specific test scenarios that prove your implementation works. These become your acceptance criteria:

```markdown
## Tests
- Returns new access token when refresh token is valid
- Returns 401 when refresh token is expired
- Returns 401 when refresh token is revoked
- Returns 400 when refresh token is malformed
- Rotates refresh token on successful refresh (one-time use)
```

**Guidelines:**
- **Cover happy path** — at least one test for the success case
- **Cover error cases** — invalid input, edge cases, failures
- **Be specific** — "handles errors" is not a test; "returns 404 when user not found" is
- **Match existing patterns** — look at how similar features are tested in the codebase

**Skip when:**
- Task is documentation-only
- Task is configuration/setup (no logic to test)
- Existing tests already cover the change

### 3.4 Set Exit Criteria

Exit criteria are the **checkboxes you must check** before committing. They combine your goal, tests, and any additional requirements:

```markdown
## Exit Criteria
- Refresh endpoint returns new tokens for valid requests
- All 5 test scenarios pass
- Type checking passes (`npm run type-check`)
- No new linting errors
- Changes committed with conventional message
```

**Standard exit criteria (include most of these):**
- Feature/fix works as described in Goal
- Tests pass with good coverage (80%+ for new code)
- Type checking passes (if TypeScript)
- No linting errors
- Changes committed

**Additional criteria (when applicable):**
- Documentation updated (for public APIs)
- Migration added (for database changes)
- Environment variables documented (for new config)

### Complete Plan Example

```markdown
## Goal
Add JWT token refresh endpoint that returns a new access token when given a valid refresh token.

## Files
- src/auth/refresh.ts - create token refresh endpoint
- src/auth/middleware.ts - add refresh token validation helper
- src/auth/types.ts - add RefreshTokenPayload interface
- tests/auth/refresh.test.ts - unit tests

## Tests
- Returns new access token when refresh token is valid
- Returns 401 when refresh token is expired
- Returns 401 when refresh token is revoked
- Returns 400 when refresh token is malformed
- Rotates refresh token on successful refresh

## Exit Criteria
- Refresh endpoint works for valid requests
- All 5 test scenarios pass
- Type checking passes
- Changes committed
```

### After Writing the Plan

1. **Review scope** — Is this achievable in one iteration? If not, split the task.
2. **Update TodoWrite** — Add sub-tasks based on your Files list if not done in Step 1.
3. **Proceed to implementation** — Only start coding after the plan is written.

## Step 4: Implement

Now execute your plan. Write the code, write the tests, and verify everything works before proceeding to review.

### 4.1 Write the Code

Follow your plan's Files section. For each file:

1. **Read first** — Understand existing code before modifying
2. **Follow patterns** — Match the codebase's style, conventions, and architecture
3. **Keep it simple** — Don't over-engineer or add features beyond the plan
4. **Update TodoWrite** — Mark sub-task as `in_progress` when you start

```typescript
// Before starting a sub-task:
TodoWrite({
  todos: [
    { content: "Create login endpoint", activeForm: "Creating login endpoint", status: "in_progress" },
    { content: "Add input validation", activeForm: "Adding input validation", status: "pending" },
    // ...
  ]
})
```

**Implementation order:**
1. Types/interfaces first (if TypeScript)
2. Core logic
3. Integration points (exports, routes, etc.)
4. Tests (or write alongside — see 4.2)

**Avoid:**
- Adding comments unless truly necessary (code should be self-documenting)
- Creating new patterns when existing patterns work
- Scope creep — if you discover something outside the plan, note it for the next iteration

### 4.2 Write the Tests

Write tests that match your plan's Tests section. Each test scenario becomes a test case.

**Test structure:**
```typescript
describe('RefreshToken', () => {
  describe('refresh', () => {
    it('returns new access token when refresh token is valid', async () => {
      // Arrange - set up test data
      const refreshToken = createValidRefreshToken();

      // Act - call the function
      const result = await refresh(refreshToken);

      // Assert - verify the outcome
      expect(result.accessToken).toBeDefined();
      expect(result.expiresIn).toBe(3600);
    });

    it('returns 401 when refresh token is expired', async () => {
      const expiredToken = createExpiredRefreshToken();

      await expect(refresh(expiredToken))
        .rejects.toThrow(UnauthorizedError);
    });
  });
});
```

**Guidelines:**
- **One assertion per test** (when practical) — easier to debug failures
- **Descriptive names** — test name should describe the scenario
- **Cover the plan** — every test in your Tests section should become a real test
- **Match existing patterns** — look at how similar features are tested

**Update TodoWrite after writing tests:**
```typescript
TodoWrite({
  todos: [
    { content: "Create login endpoint", activeForm: "Creating login endpoint", status: "completed" },
    { content: "Add input validation", activeForm: "Adding input validation", status: "completed" },
    { content: "Write unit tests", activeForm: "Writing unit tests", status: "in_progress" },
    // ...
  ]
})
```

### 4.3 Run Tests

Run the full test suite to verify your implementation:

```bash
# Standard commands (use project-specific if different)
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage report
npm test -- path/to/file    # Run specific test file
```

**What to check:**
- All tests pass (especially your new ones)
- No regressions in existing tests
- Coverage meets requirements (80%+ for new code)

**If tests fail:**
1. Read the error message carefully
2. Fix the failing test or implementation
3. Re-run tests
4. Don't proceed until all tests pass

### 4.4 Run Type Check

For TypeScript projects, verify types before proceeding:

```bash
npm run type-check          # or: npx tsc --noEmit
```

**Common type errors and fixes:**

| Error | Fix |
|-------|-----|
| `Property does not exist` | Add the property to the interface or check for typos |
| `Type X is not assignable to Y` | Fix the type mismatch or add proper type casting |
| `Cannot find module` | Check import path or add missing dependency |
| `Argument of type X is not assignable` | Update function signature or caller |

**Don't proceed with type errors.** They often indicate real bugs.

### 4.5 Handle Failures

If tests or type checking fail repeatedly:

1. **Don't force it** — Repeated failures signal a deeper issue
2. **Check your plan** — Did you miss something in the Files section?
3. **Revisit exploration** — Maybe you need more context
4. **Scope down** — Can you complete a smaller portion of the task?

**If blocked:**
```typescript
// Update TodoWrite to reflect the blocker
TodoWrite({
  todos: [
    { content: "Create login endpoint", activeForm: "Creating login endpoint", status: "completed" },
    { content: "Fix type error in auth middleware", activeForm: "Fixing type error", status: "in_progress" },
    // Don't mark as completed if you can't finish it
  ]
})
```

If you can't complete the task:
- Don't commit partial/broken code
- Document the blocker in STATE.txt
- Stop the iteration — the next iteration will pick it up

### Implementation Checklist

Before proceeding to Review:

- [ ] All planned files created/modified
- [ ] Code follows existing patterns
- [ ] Tests written for all planned scenarios
- [ ] `npm test` passes
- [ ] `npm run type-check` passes (TypeScript)
- [ ] TodoWrite sub-tasks marked as completed

## Step 5: Review

Before committing, spawn a review agent:

```typescript
Task({
  subagent_type: 'general-purpose',
  description: 'Review code changes',
  prompt: `Review changes for: [TASK]

Files: [list]

Check: bugs, test coverage, patterns, security, performance.

Respond: CRITICAL (must fix), SUGGESTIONS (optional), or APPROVED.`
})
```

- **CRITICAL**: Fix issues and re-review
- **SUGGESTIONS**: Address if quick
- **APPROVED**: Proceed to commit

## Step 6: Commit

1. Stage changes: `git add [files]`
2. Commit with conventional message:
   ```
   type(scope): brief description
   ```
3. Append to `.ai/ralph/index.md`:
   ```markdown
   ## {sha} — {commit message}
   - files: {changed files}
   - tests: {count} passing
   - notes: {key decisions}
   - next: {logical follow-up}
   ```
4. Update `SPEC.md` - check off completed task: `- [x]`
5. Update `STATE.txt` with completion details

## Hard Rules

- ONE task per iteration (batched checkbox = one task)
- Plan BEFORE coding
- Tests MUST pass before commit
- No commit = no index entry
- Mark SPEC task complete only after commit
