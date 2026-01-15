#!/bin/bash
# Pre-commit hook example: Run tests before allowing commits
# Install: Link this in your Claude Code settings or copy to .git/hooks/pre-commit

set -e

echo "Running pre-commit tests..."

# Detect project type and run appropriate tests
if [ -f "package.json" ]; then
  if grep -q "\"test\"" package.json; then
    npm test
  fi
elif [ -f "requirements.txt" ] || [ -f "setup.py" ]; then
  if command -v pytest &> /dev/null; then
    pytest
  fi
elif [ -f "go.mod" ]; then
  go test ./...
elif [ -f "Cargo.toml" ]; then
  cargo test
fi

echo "✓ Tests passed"
