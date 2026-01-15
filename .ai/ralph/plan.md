# Plan: Phase 2 - Headless Runner

## Goal
Create `src/lib/headless-runner.ts` that provides a non-React alternative to the Ink-based UI for running Ralph iterations. This enables factory/orchestrator integration by emitting JSON events to stdout instead of rendering a terminal UI.

## Files to Create/Modify
1. **Create**: `src/lib/headless-runner.ts` - main headless runner implementation
2. **Modify**: `src/cli.tsx` - wire up the headless runner in `executeHeadlessRun`
3. **Create**: `tests/lib/headless-runner.test.ts` - unit tests

## Implementation Approach

### headless-runner.ts
- Re-use `StreamParser` for parsing Claude's stream-json output
- Re-use `StateMachine` for tracking tool execution and state
- Use `spawn` directly (not the React hook) to manage the claude process
- Emit events via `headless-emitter.ts` functions instead of updating React state
- Support stuck detection (track iterations without task completion)
- Proper exit codes (0=complete, 1=stuck, 2=max iterations, 3=error)

### Key Events to Emit
- `started` - at start with task count from SPEC.md
- `iteration` - at start of each iteration
- `tool` - for each tool start (read/write/bash)
- `commit` - when git commit detected
- `task_complete` - when SPEC tasks get checked off
- `iteration_done` - at end of each iteration with stats
- `stuck` - when no progress for N iterations
- `complete` - when all tasks done
- `failed` - on errors

## Tests
1. Test event emission sequence
2. Test stuck detection threshold
3. Test exit codes
4. Test task completion tracking
5. Test tool event emission

## Exit Criteria
- `ralph run --headless` outputs JSONL events to stdout
- Stuck detection works with threshold
- Exit codes are correct
- Tests pass with good coverage
