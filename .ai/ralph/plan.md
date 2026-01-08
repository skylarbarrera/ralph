## Goal
Create a JSONL logger that tees raw Claude output to disk for debugging and replay.

## Files
- src/lib/logger.ts - JSONL logger class with file writing
- tests/logger.test.ts - Unit tests for logger

## Tests
- Creates runs directory if it doesn't exist
- Writes JSONL lines to timestamped file
- Handles multiple log calls correctly
- Properly closes file handle
- Uses correct ISO timestamp format for filename
- Handles write errors gracefully

## Exit Criteria
- Logger creates `./runs/{ISO-timestamp}.jsonl` files
- Creates runs directory automatically if needed
- All tests pass with 80%+ coverage
- No type errors
- Changes committed
