## Goal
Create PhaseIndicator component that shows current phase with pulsing animation for active phases.

## Files
- src/components/PhaseIndicator.tsx - new component
- tests/PhaseIndicator.test.tsx - unit tests

## Design
PhaseIndicator displays the current phase with:
- Pulsing animation (using usePulse hook) for non-done phases
- Phase-specific icons: ◐ reading, ✎ editing, ⚡ running, ● thinking, ✓ done, ○ idle
- Color based on phase state (cyan for active, green for done, gray for idle)
- Text shows phase label with visual pulse effect (dimmed text toggle)

Pattern: `│ {icon} {phase label}` where icon pulses between bright/dim

## Tests
- Renders correct icon for each phase
- Renders phase label text
- Shows pulsing effect for non-done phases
- No pulsing for done phase
- Uses correct colors from ELEMENT_COLORS/COLORS

## Exit Criteria
- Component renders all phases correctly
- Pulsing animation works for active phases
- Tests pass with good coverage
- Changes committed
