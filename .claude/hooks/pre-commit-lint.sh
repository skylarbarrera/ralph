#!/bin/bash
# Pre-commit hook example: Run linting before allowing commits
# Install: Link this in your Claude Code settings or copy to .git/hooks/pre-commit

set -e

echo "Running pre-commit linting..."

# Detect project type and run appropriate linter
if [ -f "package.json" ]; then
  if grep -q "\"lint\"" package.json; then
    npm run lint
  fi
elif [ -f "requirements.txt" ] || [ -f "setup.py" ]; then
  if command -v pylint &> /dev/null; then
    pylint src/ || true
  fi
  if command -v mypy &> /dev/null; then
    mypy src/ || true
  fi
fi

echo "✓ Linting passed"
