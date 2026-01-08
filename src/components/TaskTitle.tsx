import React from 'react';
import { Box, Text } from 'ink';

export interface TaskTitleProps {
  text?: string;
  maxLength?: number;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

export function TaskTitle({ text, maxLength = 60 }: TaskTitleProps): React.ReactElement {
  if (!text) {
    return (
      <Box>
        <Text color="cyan">│</Text>
      </Box>
    );
  }

  const displayText = truncateText(text.trim(), maxLength);

  return (
    <Box>
      <Text color="cyan">│ </Text>
      <Text color="green">▶ </Text>
      <Text color="white">"{displayText}"</Text>
    </Box>
  );
}
