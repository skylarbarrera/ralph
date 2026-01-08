#!/bin/bash
set -e

# PR Review Loop
# After each task, create a branch, commit, and open a PR for review.
# Useful for teams or when you want manual approval before merging to main.

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  echo "Example: $0 10"
  exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "Error: GitHub CLI (gh) is not installed."
  echo "Install: https://cli.github.com/"
  exit 1
fi

# Check if we're in a git repo with remote
if ! git remote get-url origin &> /dev/null; then
  echo "Error: No git remote 'origin' found."
  echo "Add a remote: git remote add origin <url>"
  exit 1
fi

MAIN_BRANCH=$(git rev-parse --abbrev-ref HEAD)

for ((i=1; i<=$1; i++)); do
  result=$(claude --permission-mode acceptEdits -p "@PRD.md @progress.txt \\
  1. Read PRD and progress file to find the next incomplete task. \\
  2. Create a feature branch: git checkout -b feature/task-$i \\
  3. Implement the task. \\
  4. Run tests and linting. \\
  5. Commit your changes with a clear conventional commit message. \\
  6. Push the branch: git push -u origin feature/task-$i \\
  7. Create a PR: gh pr create --title 'Task: <description>' --body '<details>' \\
  8. Update progress.txt with task completion and PR link. \\
  9. Switch back to main: git checkout ${MAIN_BRANCH} \\
  ONLY WORK ON A SINGLE TASK. \\
  If the PRD is complete, output <promise>COMPLETE</promise>.")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "PRD complete after $i iterations. All PRs created."
    exit 0
  fi

  # Small delay to avoid rate limiting
  sleep 2
done

echo "Completed $1 iterations. Check open PRs: gh pr list"
