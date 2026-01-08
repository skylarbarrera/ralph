#!/bin/bash
set -e

# Refactoring Loop
# This loop detects code duplication and refactors it into shared utilities.
# Customize: Change the analysis tool or add other code smell detection.

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  echo "Example: $0 15"
  exit 1
fi

# Customize the duplication detection tool
# Examples:
# DETECTION="jscpd ."
# DETECTION="pylint --disable=all --enable=duplicate-code src/"
# DETECTION="flay app/"
DETECTION="jscpd ."  # Change this to your duplication detection tool

for ((i=1; i<=$1; i++)); do
  result=$(claude --permission-mode acceptEdits -p "@.ai/ralph/index.md \\
  1. Read last 3 entries from index.md for context. \\
  2. Run duplication detection: ${DETECTION} \\
  3. Identify ONE instance of code duplication or code smell. \\
  4. Write plan to .ai/ralph/plan.md (what to extract, where, call sites). \\
  5. Refactor it into a shared utility or helper function. \\
  6. Update all call sites to use the new shared code. \\
  7. Run tests to verify nothing broke. \\
  8. Commit the refactoring with clear message. \\
  9. Append summary to .ai/ralph/index.md (format: ## SHA — task). \\
  ONLY REFACTOR ONE DUPLICATION AT A TIME. \\
  If no duplication or code smells are found, output <promise>COMPLETE</promise>.")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "All code duplication cleaned up after $i iterations."
    exit 0
  fi
done

echo "Completed $1 iterations. Run analysis manually to check remaining issues."
