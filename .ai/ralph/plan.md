## Goal
Create ActivityFeed.tsx component that renders a rolling activity feed with last N activity items.

## Files
- src/components/ActivityFeed.tsx - main container component
- tests/ActivityFeed.test.tsx - unit tests

## Tests
- Renders nothing when activity log is empty
- Renders thought items with bullet prefix
- Renders tool_start items with spinner
- Renders tool_complete items with checkmark/error icon
- Renders commit items with success icon and hash
- Limits display to maxItems prop (default 20)
- Shows most recent items when log exceeds maxItems

## Exit Criteria
- ActivityFeed renders all activity types correctly
- Tests pass with good coverage
- No linting errors
- Changes committed
