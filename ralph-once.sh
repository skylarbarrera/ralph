#!/bin/bash

claude --permission-mode acceptEdits "@PRD.md @progress.txt @.ai/ralph/index.md \\
1. Read PRD, progress file, and last 3 entries from index.md. \\
2. Find the next incomplete task. \\
3. Write a plan to .ai/ralph/plan.md (goal, files, tests, exit criteria). \\
4. Implement the task according to the plan. \\
5. Run tests and verify they pass. \\
6. Commit your changes with a clear message. \\
7. Append a summary to .ai/ralph/index.md (format: ## SHA — task). \\
8. Update progress.txt with what you did. \\
ONLY DO ONE TASK AT A TIME."
