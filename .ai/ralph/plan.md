# Plan: Phase 1 - Add Headless Flag

## Goal

Add `--headless` flag to the CLI that outputs JSON events to stdout instead of rendering the Ink UI. This is the foundation for Factory integration.

## Files to Create/Modify

1. **Create:** `src/lib/headless-emitter.ts` - Event type definitions and emit function
2. **Modify:** `src/cli.tsx` - Add `--headless` flag, wire up conditional rendering

## Implementation

### 1. headless-emitter.ts

Create event types as specified in SPEC.md:
- `started` - Session start with SPEC info
- `iteration` - Iteration start with phase
- `tool` - Tool usage events
- `commit` - Git commit detection
- `task_complete` - Task checkbox completion
- `iteration_done` - Iteration end with stats
- `stuck` - No progress detection
- `complete` - All tasks done
- `failed` - Fatal error

Export `emit()` function that writes JSON to stdout.

### 2. CLI changes

- Add `--headless` boolean flag to `run` command
- When `--headless` is true:
  - Skip Ink render
  - Call new headless runner (to be implemented in Phase 2)
  - For Phase 1: Just add flag and emitter, log a placeholder message

## Tests

- `src/lib/__tests__/headless-emitter.test.ts`
  - Test each event type emits valid JSON
  - Test emit() writes to stdout
  - Test timestamp format is ISO 8601

## Exit Criteria

- [ ] `--headless` flag accepted by CLI
- [ ] `headless-emitter.ts` exports RalphEvent type and emit function
- [ ] All existing tests pass
- [ ] New unit tests for headless-emitter pass
