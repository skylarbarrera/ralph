import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { ToolItem, formatDuration } from '../src/components/ToolItem.js';

describe('formatDuration', () => {
  it('formats milliseconds to seconds with one decimal', () => {
    expect(formatDuration(0)).toBe('0.0s');
    expect(formatDuration(100)).toBe('0.1s');
    expect(formatDuration(500)).toBe('0.5s');
    expect(formatDuration(800)).toBe('0.8s');
    expect(formatDuration(1000)).toBe('1.0s');
    expect(formatDuration(1200)).toBe('1.2s');
    expect(formatDuration(4100)).toBe('4.1s');
  });

  it('handles fractional milliseconds', () => {
    expect(formatDuration(1234)).toBe('1.2s');
    expect(formatDuration(1250)).toBe('1.3s');
    expect(formatDuration(1260)).toBe('1.3s');
  });

  it('handles large durations', () => {
    expect(formatDuration(60000)).toBe('60.0s');
    expect(formatDuration(120500)).toBe('120.5s');
  });
});

describe('ToolItem', () => {
  describe('active state', () => {
    it('renders active read tool with verb and name', () => {
      const { lastFrame } = render(
        <ToolItem name="file.ts" category="read" state="active" />
      );
      const output = lastFrame();
      expect(output).toContain('│');
      expect(output).toContain('Reading');
      expect(output).toContain('file.ts');
    });

    it('renders active write tool', () => {
      const { lastFrame } = render(
        <ToolItem name="src/auth.ts" category="write" state="active" />
      );
      const output = lastFrame();
      expect(output).toContain('Editing');
      expect(output).toContain('src/auth.ts');
    });

    it('renders active command tool', () => {
      const { lastFrame } = render(
        <ToolItem name="npm" category="command" state="active" />
      );
      const output = lastFrame();
      expect(output).toContain('Running');
      expect(output).toContain('npm');
    });

    it('renders active meta tool', () => {
      const { lastFrame } = render(
        <ToolItem name="Task" category="meta" state="active" />
      );
      const output = lastFrame();
      expect(output).toContain('Processing');
      expect(output).toContain('Task');
    });
  });

  describe('done state', () => {
    it('renders completed tool with checkmark', () => {
      const { lastFrame } = render(
        <ToolItem name="file.ts" category="read" state="done" />
      );
      const output = lastFrame();
      expect(output).toContain('✓');
      expect(output).toContain('Reading');
      expect(output).toContain('file.ts');
    });

    it('renders completed tool with duration', () => {
      const { lastFrame } = render(
        <ToolItem name="file.ts" category="read" state="done" durationMs={800} />
      );
      const output = lastFrame();
      expect(output).toContain('✓');
      expect(output).toContain('(0.8s)');
    });

    it('renders completed write tool', () => {
      const { lastFrame } = render(
        <ToolItem name="src/utils.ts" category="write" state="done" durationMs={1200} />
      );
      const output = lastFrame();
      expect(output).toContain('✓');
      expect(output).toContain('Editing');
      expect(output).toContain('src/utils.ts');
      expect(output).toContain('(1.2s)');
    });

    it('renders completed command tool', () => {
      const { lastFrame } = render(
        <ToolItem name="npm test" category="command" state="done" durationMs={4100} />
      );
      const output = lastFrame();
      expect(output).toContain('✓');
      expect(output).toContain('Running');
      expect(output).toContain('npm test');
      expect(output).toContain('(4.1s)');
    });
  });

  describe('error state', () => {
    it('renders error tool with error icon', () => {
      const { lastFrame } = render(
        <ToolItem name="failing.ts" category="read" state="error" />
      );
      const output = lastFrame();
      expect(output).toContain('✗');
      expect(output).toContain('Reading');
      expect(output).toContain('failing.ts');
    });

    it('renders error tool with duration', () => {
      const { lastFrame } = render(
        <ToolItem name="failing.ts" category="read" state="error" durationMs={500} />
      );
      const output = lastFrame();
      expect(output).toContain('✗');
      expect(output).toContain('(0.5s)');
    });

    it('renders error command tool', () => {
      const { lastFrame } = render(
        <ToolItem name="npm test" category="command" state="error" durationMs={2000} />
      );
      const output = lastFrame();
      expect(output).toContain('✗');
      expect(output).toContain('Running');
      expect(output).toContain('npm test');
      expect(output).toContain('(2.0s)');
    });
  });

  describe('box-drawing prefix', () => {
    it('always renders box-drawing character', () => {
      const states = ['active', 'done', 'error'] as const;
      for (const state of states) {
        const { lastFrame } = render(
          <ToolItem name="test" category="read" state={state} />
        );
        expect(lastFrame()).toContain('│');
      }
    });
  });

  describe('duration formatting', () => {
    it('omits duration when not provided', () => {
      const { lastFrame } = render(
        <ToolItem name="file.ts" category="read" state="done" />
      );
      const output = lastFrame();
      expect(output).not.toMatch(/\(\d+\.\d+s\)/);
    });

    it('shows duration when provided', () => {
      const { lastFrame } = render(
        <ToolItem name="file.ts" category="read" state="done" durationMs={0} />
      );
      const output = lastFrame();
      expect(output).toContain('(0.0s)');
    });

    it('formats duration with various values', () => {
      const testCases = [
        { ms: 100, expected: '0.1s' },
        { ms: 1000, expected: '1.0s' },
        { ms: 10000, expected: '10.0s' },
      ];

      for (const { ms, expected } of testCases) {
        const { lastFrame } = render(
          <ToolItem name="file.ts" category="read" state="done" durationMs={ms} />
        );
        expect(lastFrame()).toContain(`(${expected})`);
      }
    });
  });
});
