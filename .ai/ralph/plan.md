## Goal
Create the CLI entry point (src/cli.tsx) using commander for argument parsing and Ink for rendering.

## Files
- src/cli.tsx - CLI entry point with commander options and Ink render
- tests/cli.test.tsx - Unit tests for CLI argument parsing and rendering

## Tests
- Parses -n/--iterations option (default: 1)
- Parses -p/--prompt option
- Parses --prompt-file option (reads from file)
- Parses --cwd option
- Parses --timeout-idle option (default: 120)
- Parses --save-jsonl option
- Parses --quiet option
- Parses --title option
- Default prompt contains Ralph loop instructions
- Renders App component with correct props
- Handles graceful shutdown on SIGINT

## Exit Criteria
- CLI parses all options from PRD
- Default prompt defined for Ralph loop
- Renders Ink App with parsed options
- Handles Ctrl+C gracefully
- Tests pass with 80%+ coverage
- Changes committed
