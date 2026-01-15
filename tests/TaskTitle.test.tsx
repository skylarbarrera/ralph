import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { TaskTitle, truncateText } from '../src/components/TaskTitle.js';

describe('truncateText', () => {
  it('returns text unchanged if shorter than maxLength', () => {
    expect(truncateText('hello', 10)).toBe('hello');
    expect(truncateText('test', 4)).toBe('test');
  });

  it('returns text unchanged if equal to maxLength', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });

  it('truncates and adds ellipsis when text exceeds maxLength', () => {
    expect(truncateText('hello world', 8)).toBe('hello...');
    expect(truncateText('abcdefghij', 7)).toBe('abcd...');
  });

  it('handles edge case of very short maxLength', () => {
    expect(truncateText('hello', 3)).toBe('...');
    expect(truncateText('hello', 4)).toBe('h...');
  });

  it('handles empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });
});

describe('TaskTitle', () => {
  it('renders text with play icon and quotes', () => {
    const { lastFrame } = render(<TaskTitle text="Implementing feature" />);
    const output = lastFrame();
    expect(output).toContain('▶');
    expect(output).toContain('"Implementing feature"');
  });

  it('renders box-drawing prefix', () => {
    const { lastFrame } = render(<TaskTitle text="Test" />);
    const output = lastFrame();
    expect(output).toContain('│');
  });

  it('truncates long text with default maxLength', () => {
    const longText = 'A'.repeat(100);
    const { lastFrame } = render(<TaskTitle text={longText} />);
    const output = lastFrame();
    expect(output).toContain('...');
    expect(output).not.toContain('A'.repeat(100));
  });

  it('respects custom maxLength', () => {
    const { lastFrame } = render(<TaskTitle text="Hello World" maxLength={8} />);
    const output = lastFrame();
    expect(output).toContain('"Hello..."');
  });

  it('handles empty string text', () => {
    const { lastFrame } = render(<TaskTitle text="" />);
    const output = lastFrame();
    expect(output).toContain('│');
    expect(output).not.toContain('▶');
  });

  it('handles undefined text', () => {
    const { lastFrame } = render(<TaskTitle />);
    const output = lastFrame();
    expect(output).toContain('│');
    expect(output).not.toContain('▶');
  });

  it('handles null-ish text', () => {
    const { lastFrame } = render(<TaskTitle text={undefined} />);
    const output = lastFrame();
    expect(output).toContain('│');
    expect(output).not.toContain('▶');
  });

  it('trims whitespace from text', () => {
    const { lastFrame } = render(<TaskTitle text="  Hello World  " />);
    const output = lastFrame();
    expect(output).toContain('"Hello World"');
    expect(output).not.toContain('"  Hello');
  });

  it('handles single-line text correctly', () => {
    const { lastFrame } = render(<TaskTitle text="Simple task" />);
    const output = lastFrame();
    expect(output).toContain('│');
    expect(output).toContain('▶');
    expect(output).toContain('"Simple task"');
  });

  it('handles text exactly at maxLength', () => {
    const text = 'A'.repeat(60);
    const { lastFrame } = render(<TaskTitle text={text} maxLength={60} />);
    const output = lastFrame();
    expect(output).toContain(`"${text}"`);
    expect(output).not.toContain('...');
  });

  it('handles text one char over maxLength', () => {
    const text = 'A'.repeat(61);
    const { lastFrame } = render(<TaskTitle text={text} maxLength={60} />);
    const output = lastFrame();
    expect(output).toContain('...');
  });

  describe('isPending prop', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('renders with isPending=false by default', () => {
      const { lastFrame } = render(<TaskTitle text="Test task" />);
      const output = lastFrame();
      expect(output).toContain('▶');
      expect(output).toContain('"Test task"');
    });

    it('renders with isPending=true', () => {
      const { lastFrame } = render(<TaskTitle text="Test task" isPending={true} />);
      const output = lastFrame();
      expect(output).toContain('▶');
      expect(output).toContain('"Test task"');
    });

    it('renders play icon when not pending', () => {
      const { lastFrame } = render(<TaskTitle text="Test task" isPending={false} />);
      const output = lastFrame();
      expect(output).toContain('▶');
    });

    it('shows pulse effect when pending (icon color alternates over time)', () => {
      const { lastFrame, rerender } = render(<TaskTitle text="Test task" isPending={true} />);
      const initialOutput = lastFrame();
      expect(initialOutput).toContain('▶');

      vi.advanceTimersByTime(500);
      rerender(<TaskTitle text="Test task" isPending={true} />);
      const afterPulseOutput = lastFrame();
      expect(afterPulseOutput).toContain('▶');
    });

    it('does not pulse when isPending is false', () => {
      const { lastFrame, rerender } = render(<TaskTitle text="Test task" isPending={false} />);
      const initialOutput = lastFrame();
      expect(initialOutput).toContain('▶');

      vi.advanceTimersByTime(500);
      rerender(<TaskTitle text="Test task" isPending={false} />);
      const afterTimeOutput = lastFrame();
      expect(afterTimeOutput).toContain('▶');
    });

    it('uses ELEMENT_COLORS for border styling', () => {
      const { lastFrame } = render(<TaskTitle text="Test" />);
      const output = lastFrame();
      expect(output).toContain('│');
    });
  });
});
