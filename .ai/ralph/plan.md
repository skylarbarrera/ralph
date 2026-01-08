## Goal
Create the main App.tsx Ink component that composes all UI components and manages iteration state.

## Files
- src/App.tsx - Main Ink component composing IterationHeader, TaskTitle, ToolList, StatusBar
- tests/App.test.tsx - Unit tests for App component

## Tests
- Renders all child components (IterationHeader, TaskTitle, ToolList, StatusBar)
- Displays iteration progress correctly
- Shows task text from useClaudeStream
- Handles loading/idle state
- Handles error state
- Handles completion state

## Exit Criteria
- App.tsx composes all existing components
- Uses useClaudeStream hook for state management
- Displays proper UI for each phase (idle, reading, editing, running, thinking, done)
- Tests pass with good coverage
- Changes committed
