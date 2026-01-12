## Goal
Create settings.json.example template with Stop hook configuration that uses the validate-iteration.md prompt to validate Ralph iterations.

## Files
- templates/.claude/settings.json.example - new file with hook configuration

## Tests
- N/A (configuration template file)

## Exit Criteria
- settings.json.example exists in templates/.claude/
- Contains Stop hook with type: prompt
- Hook references scripts/validate-iteration.md
- Includes other common Ralph-related settings
- Changes committed
