#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  result=$(claude --permission-mode acceptEdits -p "@PRD.md @progress.txt @.ai/ralph/index.md \\
  1. Read PRD, progress, and last 3 entries from index.md. \\
  2. Find the highest-priority incomplete task. \\
  3. Write plan to .ai/ralph/plan.md (goal, files, tests, exit criteria). \\
  4. Implement the task according to the plan. \\
  5. Run tests and type checks. \\
  6. Commit your changes with clear message. \\
  7. Append summary to .ai/ralph/index.md (format: ## SHA — task). \\
  8. Update PRD marking task complete. \\
  9. Append progress to progress.txt. \\
  ONLY WORK ON A SINGLE TASK. \\
  If the PRD is complete, output <promise>COMPLETE</promise>.")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "PRD complete after $i iterations."
    exit 0
  fi
done
