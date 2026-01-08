import React from 'react';
import { Box, Text } from 'ink';
import { ELEMENT_COLORS } from '../lib/colors.js';

export interface IterationHeaderProps {
  current: number;
  total: number;
  elapsedSeconds: number;
}

export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function IterationHeader({ current, total, elapsedSeconds }: IterationHeaderProps): React.ReactElement {
  const label = `Iteration ${current}/${total}`;
  const elapsed = `${formatElapsedTime(elapsedSeconds)} elapsed`;
  const minWidth = 50;
  const contentLength = label.length + elapsed.length + 6;
  const dashCount = Math.max(4, minWidth - contentLength);
  const dashes = '─'.repeat(dashCount);

  return (
    <Box>
      <Text color={ELEMENT_COLORS.border}>┌─ </Text>
      <Text bold color={ELEMENT_COLORS.text}>{label}</Text>
      <Text color={ELEMENT_COLORS.border}> {dashes} </Text>
      <Text color={ELEMENT_COLORS.muted}>{elapsed}</Text>
    </Box>
  );
}
