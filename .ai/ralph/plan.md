## Goal
Integrate new activity components into App.tsx: replace ToolList with ActivityFeed, add PhaseIndicator, show commit in results.

## Files
- src/App.tsx - replace ToolList with ActivityFeed, add PhaseIndicator, pass commit to iteration results
- tests/App.test.tsx - update tests for new components

## Tests
- ActivityFeed renders in place of ToolList
- PhaseIndicator displays correct phase
- Commit info passed to onIterationComplete callback
- All existing tests updated and passing

## Exit Criteria
- App uses ActivityFeed instead of ToolList
- PhaseIndicator visible in App layout
- Commit summary included in iteration results
- All tests pass
- Changes committed
