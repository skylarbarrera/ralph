## Goal
Create the IterationHeader Ink component that displays iteration progress with elapsed time.

## Files
- src/components/IterationHeader.tsx - New component: `┌─ Iteration 1/10 ──── 0:42 elapsed`
- tests/IterationHeader.test.tsx - Unit tests for rendering

## Tests
- Renders current/total iteration numbers correctly
- Formats elapsed time correctly (seconds, minutes:seconds, hours:minutes:seconds)
- Handles edge cases (iteration 0, large numbers)
- Renders with proper box-drawing characters

## Exit Criteria
- Component renders iteration header matching PRD design
- Tests pass with 80%+ coverage
- TypeScript compiles without errors
- Changes committed
