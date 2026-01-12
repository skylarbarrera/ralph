# Ralph v3.1 - Reduce Template Duplication

Address duplication and bloat issues from v3 integration by establishing clear separation of concerns between ralph.md (coding standards) and SKILL.md (iteration protocol).

## Problem Statement
1. **ralph.md is bloated** - Contains both coding standards AND iteration protocol details (~830 lines)
2. **Duplication** - SKILL.md and ralph.md both describe the iteration protocol
3. **Sync burden** - Skill exists in two places (.claude/skills/ and templates/.claude/skills/)

## Solution Architecture

```
templates/.claude/
├── ralph.md              # Coding standards ONLY (~300 lines)
│                         # - Language preferences
│                         # - Code style, testing, architecture
│                         # - Git commit standards
│                         # - Security, dependencies
│                         # - Anti-patterns, tools, principles
│
├── skills/
│   └── ralph-iterate/
│       └── SKILL.md      # Iteration protocol ONLY (~850 lines)
│                         # - Load context, explore, plan
│                         # - Implement, review, commit
│                         # - All Claude Code native features
│
└── settings.json.example # Hook configuration
```

**Key principle:** ralph.md = "how to write good code", SKILL.md = "how to run an iteration"

## Phase 1: Refactor ralph.md (Lean Standards)

- [ ] Remove iteration protocol sections from ralph.md (keep only coding standards)
- [ ] Remove "Claude Code Native Features" section (move to SKILL.md intro)
- [ ] Remove "Creating SPECs (Interactive)" section (move to SKILL.md or separate doc)
- [ ] Remove "Memory System" section (already in SKILL.md)
- [ ] Remove "Task Completion Criteria" section (in SKILL.md)
- [ ] Remove "Code Review Protocol" section (in SKILL.md)
- [ ] Remove "Sub-Task Tracking Protocol" section (in SKILL.md)
- [ ] Remove "Progress Updates" section (in SKILL.md)
- [ ] Remove "Error Recovery" section (in SKILL.md)
- [ ] Remove "Hooks Configuration" section (reference settings.json.example instead)
- [ ] Keep: Language, Code Style, Testing, Architecture, Git, Performance, Security, Dependencies, Anti-Patterns, Tools, Principles

## Phase 2: Enhance SKILL.md

- [ ] Add "Claude Code Native Features" overview at the top of SKILL.md
- [ ] Add "Creating SPECs" section with AskUserQuestion protocol to SKILL.md
- [ ] Add brief reference to ralph.md for coding standards ("Follow standards in ralph.md")
- [ ] Verify SKILL.md is self-contained for running iterations

## Phase 3: Single Source of Truth

- [ ] Delete .claude/skills/ralph-iterate/SKILL.md (project's own copy)
- [ ] Update .claude/CLAUDE.md to remove Ralph-specific iteration details (keep coding standards)
- [ ] Add note in ralph.md: "For iteration protocol, see /ralph-iterate skill"

## Phase 4: Validation

- [ ] Verify ralph.md is ~300 lines (down from ~830)
- [ ] Verify SKILL.md contains all iteration guidance
- [ ] Run tests to ensure no regressions
- [ ] Test ralph init creates correct structure

## Success Criteria
- ralph.md focused on coding standards only (~300 lines)
- SKILL.md is the single source for iteration protocol
- No duplication between files
- Clear separation: standards vs protocol
- Templates are the authoritative source
