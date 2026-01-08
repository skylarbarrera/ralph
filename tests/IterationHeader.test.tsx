import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { IterationHeader, formatElapsedTime } from '../src/components/IterationHeader.js';

describe('formatElapsedTime', () => {
  it('formats seconds only', () => {
    expect(formatElapsedTime(0)).toBe('0:00');
    expect(formatElapsedTime(5)).toBe('0:05');
    expect(formatElapsedTime(42)).toBe('0:42');
    expect(formatElapsedTime(59)).toBe('0:59');
  });

  it('formats minutes and seconds', () => {
    expect(formatElapsedTime(60)).toBe('1:00');
    expect(formatElapsedTime(90)).toBe('1:30');
    expect(formatElapsedTime(125)).toBe('2:05');
    expect(formatElapsedTime(3599)).toBe('59:59');
  });

  it('formats hours, minutes, and seconds', () => {
    expect(formatElapsedTime(3600)).toBe('1:00:00');
    expect(formatElapsedTime(3661)).toBe('1:01:01');
    expect(formatElapsedTime(7325)).toBe('2:02:05');
    expect(formatElapsedTime(36000)).toBe('10:00:00');
  });

  it('handles fractional seconds by flooring', () => {
    expect(formatElapsedTime(0.5)).toBe('0:00');
    expect(formatElapsedTime(5.9)).toBe('0:05');
    expect(formatElapsedTime(65.7)).toBe('1:05');
  });
});

describe('IterationHeader', () => {
  it('renders iteration count correctly', () => {
    const { lastFrame } = render(
      <IterationHeader current={1} total={10} elapsedSeconds={0} />
    );
    const output = lastFrame();
    expect(output).toContain('Iteration 1/10');
  });

  it('renders different iteration numbers', () => {
    const { lastFrame } = render(
      <IterationHeader current={5} total={20} elapsedSeconds={0} />
    );
    const output = lastFrame();
    expect(output).toContain('Iteration 5/20');
  });

  it('renders elapsed time in seconds', () => {
    const { lastFrame } = render(
      <IterationHeader current={1} total={10} elapsedSeconds={42} />
    );
    const output = lastFrame();
    expect(output).toContain('0:42 elapsed');
  });

  it('renders elapsed time in minutes', () => {
    const { lastFrame } = render(
      <IterationHeader current={1} total={10} elapsedSeconds={134} />
    );
    const output = lastFrame();
    expect(output).toContain('2:14 elapsed');
  });

  it('renders elapsed time in hours', () => {
    const { lastFrame } = render(
      <IterationHeader current={1} total={10} elapsedSeconds={3725} />
    );
    const output = lastFrame();
    expect(output).toContain('1:02:05 elapsed');
  });

  it('renders box-drawing character', () => {
    const { lastFrame } = render(
      <IterationHeader current={1} total={10} elapsedSeconds={0} />
    );
    const output = lastFrame();
    expect(output).toContain('┌─');
    expect(output).toContain('─');
  });

  it('handles edge case of iteration 0', () => {
    const { lastFrame } = render(
      <IterationHeader current={0} total={10} elapsedSeconds={0} />
    );
    const output = lastFrame();
    expect(output).toContain('Iteration 0/10');
  });

  it('handles large iteration numbers', () => {
    const { lastFrame } = render(
      <IterationHeader current={999} total={1000} elapsedSeconds={0} />
    );
    const output = lastFrame();
    expect(output).toContain('Iteration 999/1000');
  });

  it('handles zero total iterations', () => {
    const { lastFrame } = render(
      <IterationHeader current={0} total={0} elapsedSeconds={0} />
    );
    const output = lastFrame();
    expect(output).toContain('Iteration 0/0');
  });
});
