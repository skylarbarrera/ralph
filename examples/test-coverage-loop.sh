#!/bin/bash
set -e

# Test Coverage Loop
# This loop continuously improves test coverage until a target is met.
# Customize: Change the coverage tool and target percentage for your project.

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations> [target_coverage]"
  echo "Example: $0 20 80"
  exit 1
fi

TARGET_COVERAGE=${2:-80}  # Default to 80% coverage if not specified

for ((i=1; i<=$1; i++)); do
  result=$(claude --permission-mode acceptEdits -p "@.ai/ralph/index.md \\
  1. Read last 3 entries from index.md for context. \\
  2. Run coverage analysis (e.g., jest --coverage, pytest --cov, go test -cover). \\
  3. Find the file with lowest coverage or most uncovered lines. \\
  4. Write plan to .ai/ralph/plan.md (which file, which functions, test scenarios). \\
  5. Write tests for uncovered code paths. \\
  6. Run tests to verify they pass. \\
  7. Commit your changes with clear message. \\
  8. Append summary to .ai/ralph/index.md (format: ## SHA — task). \\
  9. Check if coverage target of ${TARGET_COVERAGE}% is met. \\
  ONLY ADD TESTS FOR ONE FILE OR FUNCTION AT A TIME. \\
  If coverage target is met, output <promise>COMPLETE</promise>.")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "Coverage target of ${TARGET_COVERAGE}% achieved after $i iterations."
    exit 0
  fi
done

echo "Completed $1 iterations. Check current coverage and run again if needed."
