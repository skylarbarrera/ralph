#!/bin/bash
set -e

# Linting Loop
# This loop fixes linting errors one at a time until the codebase is clean.
# Customize: Change the linter command for your project (eslint, pylint, rubocop, etc.).

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  echo "Example: $0 30"
  exit 1
fi

# Customize this for your linter
# Examples:
# LINTER="npm run lint"
# LINTER="eslint ."
# LINTER="pylint src/"
# LINTER="rubocop"
LINTER="npm run lint"  # Change this to your linter command

for ((i=1; i<=$1; i++)); do
  result=$(claude --permission-mode acceptEdits -p "@.ai/ralph/index.md \\
  1. Read last 3 entries from index.md for context. \\
  2. Run the linter: ${LINTER} \\
  3. Identify ONE linting error or warning. \\
  4. Write plan to .ai/ralph/plan.md (which error, how to fix, verification). \\
  5. Fix that error by modifying the code. \\
  6. Run the linter again to verify the fix. \\
  7. Commit the fix with clear message. \\
  8. Append summary to .ai/ralph/index.md (format: ## SHA — task). \\
  ONLY FIX ONE ERROR AT A TIME. \\
  If there are no linting errors, output <promise>COMPLETE</promise>.")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "All linting errors fixed after $i iterations."
    exit 0
  fi
done

echo "Completed $1 iterations. Run linter manually to check remaining issues."
