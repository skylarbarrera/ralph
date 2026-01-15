import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { PhaseIndicator, getPhaseIcon, getPhaseDisplayLabel } from '../src/components/PhaseIndicator.js';
import type { Phase } from '../src/lib/state-machine.js';

vi.mock('../src/hooks/usePulse.js', () => ({
  usePulse: vi.fn(() => true),
}));

import { usePulse } from '../src/hooks/usePulse.js';

const mockedUsePulse = vi.mocked(usePulse);

describe('PhaseIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUsePulse.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('phase icons', () => {
    it('shows ○ icon for idle phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="idle" />);
      expect(lastFrame()).toContain('○');
    });

    it('shows ◐ icon for reading phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="reading" />);
      expect(lastFrame()).toContain('◐');
    });

    it('shows ✎ icon for editing phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="editing" />);
      expect(lastFrame()).toContain('✎');
    });

    it('shows ⚡ icon for running phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="running" />);
      expect(lastFrame()).toContain('⚡');
    });

    it('shows ● icon for thinking phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="thinking" />);
      expect(lastFrame()).toContain('●');
    });

    it('shows ✓ icon for done phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="done" />);
      expect(lastFrame()).toContain('✓');
    });
  });

  describe('phase labels', () => {
    it('shows Waiting for idle phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="idle" />);
      expect(lastFrame()).toContain('Waiting');
    });

    it('shows Reading for reading phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="reading" />);
      expect(lastFrame()).toContain('Reading');
    });

    it('shows Editing for editing phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="editing" />);
      expect(lastFrame()).toContain('Editing');
    });

    it('shows Running for running phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="running" />);
      expect(lastFrame()).toContain('Running');
    });

    it('shows Thinking for thinking phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="thinking" />);
      expect(lastFrame()).toContain('Thinking');
    });

    it('shows Done for done phase', () => {
      const { lastFrame } = render(<PhaseIndicator phase="done" />);
      expect(lastFrame()).toContain('Done');
    });
  });

  describe('visual layout', () => {
    it('renders border character', () => {
      const { lastFrame } = render(<PhaseIndicator phase="reading" />);
      expect(lastFrame()).toContain('│');
    });

    it('has border followed by icon and label', () => {
      const { lastFrame } = render(<PhaseIndicator phase="reading" />);
      const output = lastFrame() ?? '';
      expect(output).toMatch(/│.*◐.*Reading/);
    });
  });

  describe('pulsing behavior', () => {
    it('enables pulsing for reading phase', () => {
      render(<PhaseIndicator phase="reading" />);
      expect(mockedUsePulse).toHaveBeenCalledWith({ enabled: true });
    });

    it('enables pulsing for editing phase', () => {
      render(<PhaseIndicator phase="editing" />);
      expect(mockedUsePulse).toHaveBeenCalledWith({ enabled: true });
    });

    it('enables pulsing for running phase', () => {
      render(<PhaseIndicator phase="running" />);
      expect(mockedUsePulse).toHaveBeenCalledWith({ enabled: true });
    });

    it('enables pulsing for thinking phase', () => {
      render(<PhaseIndicator phase="thinking" />);
      expect(mockedUsePulse).toHaveBeenCalledWith({ enabled: true });
    });

    it('disables pulsing for done phase', () => {
      render(<PhaseIndicator phase="done" />);
      expect(mockedUsePulse).toHaveBeenCalledWith({ enabled: false });
    });

    it('disables pulsing for idle phase', () => {
      render(<PhaseIndicator phase="idle" />);
      expect(mockedUsePulse).toHaveBeenCalledWith({ enabled: false });
    });
  });

  describe('helper functions', () => {
    describe('getPhaseIcon', () => {
      it('returns correct icon for each phase', () => {
        expect(getPhaseIcon('idle')).toBe('○');
        expect(getPhaseIcon('reading')).toBe('◐');
        expect(getPhaseIcon('editing')).toBe('✎');
        expect(getPhaseIcon('running')).toBe('⚡');
        expect(getPhaseIcon('thinking')).toBe('●');
        expect(getPhaseIcon('done')).toBe('✓');
      });
    });

    describe('getPhaseDisplayLabel', () => {
      it('returns correct label for each phase', () => {
        expect(getPhaseDisplayLabel('idle')).toBe('Waiting');
        expect(getPhaseDisplayLabel('reading')).toBe('Reading');
        expect(getPhaseDisplayLabel('editing')).toBe('Editing');
        expect(getPhaseDisplayLabel('running')).toBe('Running');
        expect(getPhaseDisplayLabel('thinking')).toBe('Thinking');
        expect(getPhaseDisplayLabel('done')).toBe('Done');
      });
    });
  });

  describe('all phases render correctly', () => {
    const phases: Phase[] = ['idle', 'reading', 'editing', 'running', 'thinking', 'done'];

    it.each(phases)('renders %s phase without error', (phase) => {
      const { lastFrame } = render(<PhaseIndicator phase={phase} />);
      expect(lastFrame()).toBeTruthy();
    });
  });
});
