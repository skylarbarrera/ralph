import React from 'react';
import { Box, Text } from 'ink';

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
      <Text color="cyan">┌─ </Text>
      <Text bold color="white">{label}</Text>
      <Text color="cyan"> {dashes} </Text>
      <Text dimColor>{elapsed}</Text>
    </Box>
  );
}
