import React from 'react';
import { Box, Text } from 'ink';
import { usePulse } from '../hooks/usePulse.js';
import { ELEMENT_COLORS } from '../lib/colors.js';

export interface TaskTitleProps {
  text?: string;
  maxLength?: number;
  isPending?: boolean;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

export function TaskTitle({ text, maxLength = 60, isPending = false }: TaskTitleProps): React.ReactElement {
  const pulse = usePulse({ enabled: isPending });
  const iconColor = isPending && !pulse ? ELEMENT_COLORS.muted : ELEMENT_COLORS.success;

  if (!text) {
    return (
      <Box>
        <Text color={ELEMENT_COLORS.border}>│</Text>
      </Box>
    );
  }

  const displayText = truncateText(text.trim(), maxLength);

  return (
    <Box>
      <Text color={ELEMENT_COLORS.border}>│ </Text>
      <Text color={iconColor}>▶ </Text>
      <Text color={ELEMENT_COLORS.text}>"{displayText}"</Text>
    </Box>
  );
}
