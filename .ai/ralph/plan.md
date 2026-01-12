## Goal
Add AskUserQuestion protocol to templates/.claude/ralph.md for structured SPEC creation interviews with 3 question batches.

## Files
- templates/.claude/ralph.md - add new "Creating SPECs (Interactive)" section before "Writing SPECs"

## Changes
Add new section with:
1. Introduction explaining when to use AskUserQuestion for SPEC creation
2. Three question batches:
   - Technical foundation (language, framework, architecture)
   - Feature scope (core features, data storage, integrations)
   - Quality gates (testing, security, performance requirements)
3. Example AskUserQuestion tool call with structured options
4. Flow description of interview → SPEC generation

## Tests
- N/A (documentation-only change)

## Exit Criteria
- New "Creating SPECs (Interactive)" section added to templates/.claude/ralph.md
- Section defines 3 question batches with specific options
- Changes committed
