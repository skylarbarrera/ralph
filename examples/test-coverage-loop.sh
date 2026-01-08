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
  result=$(claude --permission-mode acceptEdits -p "\\
  1. Run coverage analysis (e.g., jest --coverage, pytest --cov, go test -cover). \\
  2. Find the file with the lowest coverage or most uncovered lines. \\
  3. Write tests for uncovered code paths. \\
  4. Run tests to verify they pass. \\
  5. Check if coverage target of ${TARGET_COVERAGE}% is met. \\
  6. Commit your changes with a clear message. \\
  ONLY ADD TESTS FOR ONE FILE OR FUNCTION AT A TIME. \\
  If coverage target is met, output <promise>COMPLETE</promise>.")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "Coverage target of ${TARGET_COVERAGE}% achieved after $i iterations."
    exit 0
  fi
done

echo "Completed $1 iterations. Check current coverage and run again if needed."
