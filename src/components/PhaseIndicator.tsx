import React from 'react';
import { Box, Text } from 'ink';
import type { Phase } from '../lib/state-machine.js';
import { COLORS, ELEMENT_COLORS } from '../lib/colors.js';
import { usePulse } from '../hooks/usePulse.js';

export interface PhaseIndicatorProps {
  phase: Phase;
}

const PHASE_ICONS: Record<Phase, string> = {
  idle: '○',
  reading: '◐',
  editing: '✎',
  running: '⚡',
  thinking: '●',
  done: '✓',
};

const PHASE_LABELS: Record<Phase, string> = {
  idle: 'Waiting',
  reading: 'Reading',
  editing: 'Editing',
  running: 'Running',
  thinking: 'Thinking',
  done: 'Done',
};

export function getPhaseIcon(phase: Phase): string {
  return PHASE_ICONS[phase];
}

export function getPhaseDisplayLabel(phase: Phase): string {
  return PHASE_LABELS[phase];
}

function getPhaseColor(phase: Phase, isPulseBright: boolean): string {
  if (phase === 'done') return COLORS.green;
  if (phase === 'idle') return COLORS.gray;
  return isPulseBright ? COLORS.cyan : COLORS.gray;
}

export function PhaseIndicator({ phase }: PhaseIndicatorProps): React.ReactElement {
  const isActive = phase !== 'done' && phase !== 'idle';
  const pulse = usePulse({ enabled: isActive });

  const icon = getPhaseIcon(phase);
  const label = getPhaseDisplayLabel(phase);
  const color = getPhaseColor(phase, pulse);

  return (
    <Box>
      <Text color={ELEMENT_COLORS.border}>│ </Text>
      <Text color={color}>{icon}</Text>
      <Text> </Text>
      <Text color={color}>{label}</Text>
    </Box>
  );
}
