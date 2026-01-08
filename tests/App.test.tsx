import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { App } from '../src/App.js';
import type { ClaudeStreamState } from '../src/hooks/useClaudeStream.js';
import type { ToolGroup, ActiveTool } from '../src/lib/state-machine.js';

vi.mock('../src/hooks/useClaudeStream.js', () => ({
  useClaudeStream: () => ({
    phase: 'idle',
    taskText: null,
    activeTools: [],
    toolGroups: [],
    stats: {
      toolsStarted: 0,
      toolsCompleted: 0,
      toolsErrored: 0,
      reads: 0,
      writes: 0,
      commands: 0,
      metaOps: 0,
    },
    elapsedMs: 0,
    result: null,
    error: null,
    isRunning: false,
  }),
}));

function createMockState(overrides: Partial<ClaudeStreamState> = {}): ClaudeStreamState {
  return {
    phase: 'idle',
    taskText: null,
    activeTools: [],
    toolGroups: [],
    stats: {
      toolsStarted: 0,
      toolsCompleted: 0,
      toolsErrored: 0,
      reads: 0,
      writes: 0,
      commands: 0,
      metaOps: 0,
    },
    elapsedMs: 0,
    result: null,
    error: null,
    isRunning: false,
    ...overrides,
  };
}

describe('App', () => {
  describe('basic rendering', () => {
    it('renders iteration header', () => {
      const { lastFrame } = render(
        <App prompt="test" iteration={1} totalIterations={5} _mockState={createMockState()} />
      );
      const output = lastFrame();
      expect(output).toContain('Iteration 1/5');
      expect(output).toContain('┌─');
    });

    it('renders status bar', () => {
      const { lastFrame } = render(
        <App prompt="test" _mockState={createMockState()} />
      );
      const output = lastFrame();
      expect(output).toContain('└─');
      expect(output).toContain('Waiting...');
    });

    it('renders box-drawing characters for structure', () => {
      const { lastFrame } = render(
        <App prompt="test" _mockState={createMockState()} />
      );
      const output = lastFrame();
      expect(output).toContain('┌');
      expect(output).toContain('│');
      expect(output).toContain('└');
    });
  });

  describe('task text display', () => {
    it('shows task text when available', () => {
      const state = createMockState({
        taskText: 'Implementing JWT authentication',
        phase: 'thinking',
      });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      const output = lastFrame();
      expect(output).toContain('▶');
      expect(output).toContain('Implementing JWT authentication');
    });

    it('handles empty task text', () => {
      const state = createMockState({ taskText: null });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      const output = lastFrame();
      expect(output).not.toContain('▶');
    });
  });

  describe('phase states', () => {
    it('shows idle state', () => {
      const state = createMockState({ phase: 'idle' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).toContain('Waiting...');
    });

    it('shows reading state', () => {
      const state = createMockState({ phase: 'reading' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).toContain('Reading...');
    });

    it('shows editing state', () => {
      const state = createMockState({ phase: 'editing' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).toContain('Editing...');
    });

    it('shows running state', () => {
      const state = createMockState({ phase: 'running' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).toContain('Running...');
    });

    it('shows thinking state', () => {
      const state = createMockState({ phase: 'thinking' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).toContain('Thinking...');
    });

    it('shows done state', () => {
      const state = createMockState({ phase: 'done' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).toContain('Done');
    });
  });

  describe('elapsed time display', () => {
    it('shows elapsed time in header', () => {
      const state = createMockState({ elapsedMs: 42000 });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).toContain('0:42');
      expect(lastFrame()).toContain('elapsed');
    });

    it('shows minutes and seconds for longer durations', () => {
      const state = createMockState({ elapsedMs: 134000 });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).toContain('2:14');
    });
  });

  describe('tool groups display', () => {
    it('renders completed tool groups', () => {
      const toolGroups: ToolGroup[] = [
        {
          category: 'read',
          tools: [
            { id: '1', name: 'Read', category: 'read', durationMs: 800, isError: false },
          ],
          totalDurationMs: 800,
        },
      ];
      const state = createMockState({ toolGroups, phase: 'thinking' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      const output = lastFrame();
      expect(output).toContain('✓');
      expect(output).toContain('Reading');
      expect(output).toContain('(0.8s)');
    });

    it('renders multiple completed groups', () => {
      const toolGroups: ToolGroup[] = [
        {
          category: 'read',
          tools: [
            { id: '1', name: 'Read', category: 'read', durationMs: 800, isError: false },
            { id: '2', name: 'Read', category: 'read', durationMs: 400, isError: false },
          ],
          totalDurationMs: 1200,
        },
        {
          category: 'write',
          tools: [
            { id: '3', name: 'Edit', category: 'write', durationMs: 600, isError: false },
          ],
          totalDurationMs: 600,
        },
      ];
      const state = createMockState({ toolGroups, phase: 'thinking' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      const output = lastFrame();
      expect(output).toContain('Reading 2 files');
      expect(output).toContain('Editing');
    });
  });

  describe('active tools display', () => {
    it('renders active tools with spinner', () => {
      const activeTools: ActiveTool[] = [
        {
          id: '1',
          name: 'Read',
          category: 'read',
          startTime: Date.now(),
          input: { file_path: '/src/auth.ts' },
        },
      ];
      const state = createMockState({ activeTools, phase: 'reading' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      const output = lastFrame();
      expect(output).toContain('Reading');
      expect(output).toContain('auth.ts');
    });

    it('renders multiple active tools', () => {
      const activeTools: ActiveTool[] = [
        {
          id: '1',
          name: 'Read',
          category: 'read',
          startTime: Date.now(),
          input: { file_path: '/a.ts' },
        },
        {
          id: '2',
          name: 'Read',
          category: 'read',
          startTime: Date.now(),
          input: { file_path: '/b.ts' },
        },
      ];
      const state = createMockState({ activeTools, phase: 'reading' });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      const output = lastFrame();
      expect(output).toContain('a.ts');
      expect(output).toContain('b.ts');
    });
  });

  describe('error display', () => {
    it('shows error message when error is present', () => {
      const state = createMockState({
        error: new Error('Connection timed out'),
        phase: 'done',
      });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      const output = lastFrame();
      expect(output).toContain('✗');
      expect(output).toContain('Error');
      expect(output).toContain('Connection timed out');
    });

    it('does not show error when none present', () => {
      const state = createMockState({ error: null });
      const { lastFrame } = render(<App prompt="test" _mockState={state} />);
      expect(lastFrame()).not.toContain('Error:');
    });
  });

  describe('mixed state', () => {
    it('renders full iteration with completed groups and active tools', () => {
      const toolGroups: ToolGroup[] = [
        {
          category: 'read',
          tools: [
            { id: '1', name: 'Read', category: 'read', durationMs: 500, isError: false },
            { id: '2', name: 'Glob', category: 'read', durationMs: 300, isError: false },
          ],
          totalDurationMs: 800,
        },
      ];
      const activeTools: ActiveTool[] = [
        {
          id: '3',
          name: 'Edit',
          category: 'write',
          startTime: Date.now(),
          input: { file_path: '/src/index.ts' },
        },
      ];
      const state = createMockState({
        taskText: 'Adding authentication middleware',
        toolGroups,
        activeTools,
        phase: 'editing',
        elapsedMs: 42000,
      });

      const { lastFrame } = render(
        <App prompt="test" iteration={2} totalIterations={10} _mockState={state} />
      );
      const output = lastFrame();

      expect(output).toContain('Iteration 2/10');
      expect(output).toContain('Adding authentication middleware');
      expect(output).toContain('Reading 2 files');
      expect(output).toContain('Editing');
      expect(output).toContain('index.ts');
      expect(output).toContain('Editing...');
    });
  });

  describe('props', () => {
    it('uses default iteration values', () => {
      const { lastFrame } = render(
        <App prompt="test" _mockState={createMockState()} />
      );
      expect(lastFrame()).toContain('Iteration 1/1');
    });

    it('accepts custom iteration values', () => {
      const { lastFrame } = render(
        <App prompt="test" iteration={5} totalIterations={20} _mockState={createMockState()} />
      );
      expect(lastFrame()).toContain('Iteration 5/20');
    });
  });
});
