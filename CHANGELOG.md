# Changelog

All notable changes to Ralphie will be documented in this file.

## [1.0.0] - 2025-01-16

### Added
- **Core loop execution** - Run AI in a loop until SPEC is complete
- **SPEC generation** - AI-powered interview to create structured specs
- **Multi-AI support** - Harness abstraction for Claude and Codex
- **Greedy mode** - Complete multiple tasks per iteration (`--greedy`)
- **Headless mode** - JSON output for CI/CD automation (`--headless`)
- **Stuck detection** - Exit when no progress after N iterations
- **Interactive TUI** - Real-time progress display with Ink
- **Project scaffolding** - `ralphie init` sets up project structure
- **SPEC validation** - `ralphie validate` checks format

### Harnesses
- Claude Code (default)
- OpenAI Codex

### Requirements
- Bun runtime
- Claude Code CLI or Codex CLI
- Git
