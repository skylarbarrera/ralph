import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import {
  ToolCategory,
  ToolState,
  getToolIcon,
  getCategoryVerb,
} from '../lib/tool-categories.js';

export interface ToolItemProps {
  name: string;
  category: ToolCategory;
  state: ToolState;
  durationMs?: number;
}

export function formatDuration(ms: number): string {
  const seconds = ms / 1000;
  return `${seconds.toFixed(1)}s`;
}

const CATEGORY_COLORS: Record<ToolCategory, string> = {
  read: 'cyan',
  write: 'yellow',
  command: 'magenta',
  meta: 'gray',
};

export function ToolItem({ name, category, state, durationMs }: ToolItemProps): React.ReactElement {
  const icon = getToolIcon(category, state);
  const verb = getCategoryVerb(category);
  const color = CATEGORY_COLORS[category];

  const iconColor = state === 'done' ? 'green' : state === 'error' ? 'red' : color;
  const textColor = state === 'error' ? 'red' : 'white';

  const showSpinner = state === 'active';
  const duration = durationMs !== undefined ? ` (${formatDuration(durationMs)})` : '';

  return (
    <Box>
      <Text color="cyan">│ </Text>
      {showSpinner ? (
        <Text color={color}>
          <Spinner type="dots" />
        </Text>
      ) : (
        <Text color={iconColor}>{icon}</Text>
      )}
      <Text> </Text>
      <Text color={textColor}>
        {verb} ({name}){duration}
      </Text>
    </Box>
  );
}
