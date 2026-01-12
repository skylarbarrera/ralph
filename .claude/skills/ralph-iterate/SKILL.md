---
name: ralph-iterate
description: Execute one Ralph iteration - load context, explore codebase, plan implementation, write code with tests, review changes, and commit. Use this skill to run a single autonomous coding iteration following the Ralph protocol.
context: fork
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task, TodoWrite, LSP
---

# Ralph Iteration Protocol

Execute ONE complete Ralph iteration: read SPEC, plan, implement, test, review, commit.

## Step 1: Load Context

1. Read `SPEC.md` to find the next incomplete task (unchecked `- [ ]`)
2. Read `STATE.txt` if unsure what's been completed
3. Read last 3-5 entries from `.ai/ralph/index.md` for recent context
4. Use **TodoWrite** to break the SPEC task into sub-tasks (if 3+ steps)

## Step 2: Explore (if needed)

For unfamiliar code, spawn parallel exploration agents:

```typescript
Task({
  subagent_type: 'Explore',
  description: 'Find [pattern/feature]',
  prompt: 'Find [what you need]. Report file paths and key patterns.'
})
```

Spawn 2-3 agents in parallel for different concerns (architecture, tests, conventions).

**Skip exploration when:**
- Working on files you've modified recently
- Simple changes to isolated functions
- Task specifies exact file paths

## Step 3: Plan

Write plan to `.ai/ralph/plan.md`:

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

## Step 4: Implement

1. Write the code following existing patterns
2. Write tests alongside implementation
3. Run tests: `npm test` (or project-specific command)
4. Run type check: `npm run type-check` (if TypeScript)
5. Fix any failures before proceeding

Update TodoWrite status as you complete sub-tasks.

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
