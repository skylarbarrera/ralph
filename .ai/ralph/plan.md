## Goal
Add pulse effect to TaskTitle component for pending state indication.

## Files
- src/components/TaskTitle.tsx - add isPending prop and usePulse integration
- tests/TaskTitle.test.tsx - add tests for pending state and pulse effect

## Tests
- TaskTitle shows play icon with normal color when not pending
- TaskTitle shows pulsing effect when isPending=true (color alternates)
- TaskTitle uses ELEMENT_COLORS for consistent styling
- Pulse effect is disabled when isPending=false

## Exit Criteria
- TaskTitle has isPending prop that enables pulse animation
- Uses usePulse hook for animation
- Uses ELEMENT_COLORS from colors module
- All existing tests still pass
- New tests for pending state pass
- Changes committed
