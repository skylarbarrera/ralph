## Goal
Create ToolItem.tsx component to display a single tool with spinner/checkmark and duration.

## Files
- src/components/ToolItem.tsx - new component showing tool status with icon, name, and duration
- tests/ToolItem.test.tsx - unit tests for the component

## Tests
- Renders active tool with spinner icon and category-appropriate color
- Renders completed tool with checkmark and duration
- Renders error tool with error icon and red color
- Shows tool display name (e.g., filename for Read/Edit, command for Bash)
- Formats duration correctly (e.g., "0.8s", "1.2s")
- Handles different tool categories (read, write, command, meta)
- Renders box-drawing prefix character for visual continuity

## Exit Criteria
- Component renders active, done, and error states correctly
- Uses ink-spinner for active tools
- Uses icons from tool-categories.ts (✓ done, ✗ error, category icon for active)
- Duration displays in seconds with one decimal place
- Tests pass with good coverage
- Changes committed
