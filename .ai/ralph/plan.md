## Goal
Create TaskTitle Ink component that displays the first assistant text chunk as the task description.

## Files
- src/components/TaskTitle.tsx - new component displaying `▶ "First assistant text chunk..."`
- tests/TaskTitle.test.tsx - unit tests for component rendering

## Tests
- Renders text with play icon (▶) and quotes
- Truncates long text with ellipsis at configurable max length
- Handles empty text gracefully
- Handles undefined/null text
- Renders proper indentation with box-drawing prefix (│)

## Exit Criteria
- Component renders per PRD spec: `│ ▶ "Implementing JWT authentication for the API..."`
- Text truncation works for long messages
- Tests pass with good coverage
- No type errors
