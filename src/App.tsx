import React from 'react';
import { Box, Text } from 'ink';
import { IterationHeader } from './components/IterationHeader.js';
import { TaskTitle } from './components/TaskTitle.js';
import { ToolList } from './components/ToolList.js';
import { StatusBar } from './components/StatusBar.js';
import { useClaudeStream, type UseClaudeStreamOptions, type ClaudeStreamState } from './hooks/useClaudeStream.js';

export interface AppProps {
  prompt: string;
  iteration?: number;
  totalIterations?: number;
  cwd?: string;
  idleTimeoutMs?: number;
  saveJsonl?: string | boolean;
  _mockState?: ClaudeStreamState;
}

export function App({
  prompt,
  iteration = 1,
  totalIterations = 1,
  cwd,
  idleTimeoutMs,
  saveJsonl,
  _mockState,
}: AppProps): React.ReactElement {
  const streamOptions: UseClaudeStreamOptions = {
    prompt,
    iteration,
    totalIterations,
    cwd,
    idleTimeoutMs,
    saveJsonl,
  };

  const liveState = useClaudeStream(streamOptions);
  const state = _mockState ?? liveState;

  const elapsedSeconds = Math.floor(state.elapsedMs / 1000);

  return (
    <Box flexDirection="column">
      <IterationHeader
        current={iteration}
        total={totalIterations}
        elapsedSeconds={elapsedSeconds}
      />
      <TaskTitle text={state.taskText ?? undefined} />
      <Box>
        <Text color="cyan">│</Text>
      </Box>
      <ToolList toolGroups={state.toolGroups} activeTools={state.activeTools} />
      {state.error && (
        <Box>
          <Text color="cyan">│ </Text>
          <Text color="red">✗ Error: {state.error.message}</Text>
        </Box>
      )}
      <Box>
        <Text color="cyan">│</Text>
      </Box>
      <StatusBar phase={state.phase} elapsedSeconds={elapsedSeconds} />
    </Box>
  );
}
