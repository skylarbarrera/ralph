import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSpec, type SpecGeneratorOptions } from '../../src/lib/spec-generator.js';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { Writable, Readable } from 'stream';
import * as fs from 'fs';

vi.mock('child_process');
vi.mock('fs');

describe('spec-generator', () => {
  let mockProcess: EventEmitter & {
    stdin: Writable & { write: ReturnType<typeof vi.fn>; end: ReturnType<typeof vi.fn> };
    stdout: EventEmitter;
    stderr: EventEmitter;
    kill: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock process.stdin to return a proper readable stream
    // Add setRawMode if it doesn't exist (test environment)
    if (!(process.stdin as any).setRawMode) {
      (process.stdin as any).setRawMode = () => {};
    }
    vi.spyOn(process.stdin, 'setRawMode' as any).mockImplementation(() => {});
    vi.spyOn(process.stdin, 'resume').mockImplementation(() => process.stdin);
    vi.spyOn(process.stdin, 'pause').mockImplementation(() => process.stdin);
    vi.spyOn(process.stdin, 'pipe').mockImplementation(() => process.stdin as any);
    vi.spyOn(process.stdin, 'unpipe').mockImplementation(() => process.stdin);

    // Create proper writable stream for mock process stdin
    const mockProcessStdin = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });
    (mockProcessStdin as any).write = vi.fn((data, cb) => {
      if (typeof cb === 'function') cb();
      return true;
    });
    (mockProcessStdin as any).end = vi.fn();

    mockProcess = Object.assign(new EventEmitter(), {
      stdin: mockProcessStdin as any,
      stdout: new EventEmitter(),
      stderr: new EventEmitter(),
      kill: vi.fn(),
    });

    vi.mocked(spawn).mockReturnValue(mockProcess as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateSpec', () => {
    it('uses /create-spec skill in interactive mode', async () => {
      const options: SpecGeneratorOptions = {
        description: 'Build a REST API for user management',
        cwd: '/test/path',
        headless: false,
        timeoutMs: 5000,
      };

      // Don't await - we'll trigger close immediately
      const promise = generateSpec(options);

      // Wait a tick for spawn to be called
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(spawn).toHaveBeenCalledWith(
        'claude',
        expect.arrayContaining(['--dangerously-skip-permissions']),
        expect.objectContaining({
          cwd: '/test/path',
          stdio: ['pipe', 'inherit', 'inherit'],
        })
      );

      expect(mockProcess.stdin.write).toHaveBeenCalledWith(
        expect.stringContaining('/create-spec')
      );
      expect(mockProcess.stdin.write).toHaveBeenCalledWith(
        expect.stringContaining('Build a REST API for user management')
      );

      // Simulate SPEC.md not created (to resolve promise)
      mockProcess.emit('close', 1);

      await promise;
    });

    it('uses embedded prompt in headless mode', async () => {
      const options: SpecGeneratorOptions = {
        description: 'Build a CLI tool',
        cwd: '/test/path',
        headless: true,
        timeoutMs: 5000,
      };

      const promise = generateSpec(options);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(spawn).toHaveBeenCalledWith(
        'claude',
        expect.arrayContaining(['--output-format', 'stream-json']),
        expect.objectContaining({
          cwd: '/test/path',
          stdio: ['pipe', 'pipe', 'pipe'],
        })
      );

      // In headless mode, the prompt should NOT include /create-spec
      const spawnCall = vi.mocked(spawn).mock.calls[0];
      const args = spawnCall[1] as string[];
      const promptIndex = args.indexOf('-p');
      const prompt = args[promptIndex + 1];

      expect(prompt).not.toContain('/create-spec');
      expect(prompt).toContain('Build a CLI tool');

      mockProcess.emit('close', 1);
      await promise;
    });

    it('respects model option', async () => {
      const options: SpecGeneratorOptions = {
        description: 'Test',
        cwd: '/test',
        headless: false,
        timeoutMs: 5000,
        model: 'opus',
      };

      const promise = generateSpec(options);
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(spawn).toHaveBeenCalledWith(
        'claude',
        expect.arrayContaining(['--model', 'opus']),
        expect.anything()
      );

      mockProcess.emit('close', 1);
      await promise;
    });
  });

  describe('autonomous mode', () => {
    beforeEach(() => {
      // Mock fs functions for autonomous mode
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('# Test SPEC\n\n- [ ] Task 1');
    });

    it('runs review loop on generated spec', async () => {
      const options: SpecGeneratorOptions = {
        description: 'Build a REST API',
        cwd: '/test',
        headless: false,
        autonomous: true,
        timeoutMs: 5000,
        maxAttempts: 3,
      };

      const promise = generateSpec(options);

      // Wait for initial generation
      await new Promise((resolve) => setTimeout(resolve, 10));

      // First spawn: initial generation (headless)
      expect(spawn).toHaveBeenCalledTimes(1);
      mockProcess.emit('close', 0);

      // Wait for review spawn
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Second spawn: review-spec
      expect(spawn).toHaveBeenCalledTimes(2);
      const reviewCall = vi.mocked(spawn).mock.calls[1];
      expect(reviewCall[1]).toContain('-p');
      const reviewPromptIndex = (reviewCall[1] as string[]).indexOf('-p');
      const reviewPrompt = (reviewCall[1] as string[])[reviewPromptIndex + 1];
      expect(reviewPrompt).toContain('/review-spec');

      // Simulate review passing
      mockProcess.stdout.emit('data', Buffer.from('SPEC Review: PASS\n'));
      mockProcess.emit('close', 0);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.reviewPassed).toBe(true);
      expect(result.attempts).toBe(1);
    });

    it('refines spec on review failure', async () => {
      const options: SpecGeneratorOptions = {
        description: 'Build a REST API',
        cwd: '/test',
        headless: false,
        autonomous: true,
        timeoutMs: 5000,
        maxAttempts: 3,
      };

      const promise = generateSpec(options);

      // Initial generation
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.emit('close', 0);

      // First review (fail)
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.stdout.emit(
        'data',
        Buffer.from('SPEC Review: FAIL\n\n## Format Issues\n\n- Bad checkbox syntax')
      );
      mockProcess.emit('close', 0);

      // Refinement
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.emit('close', 0);

      // Second review (pass)
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.stdout.emit('data', Buffer.from('SPEC Review: PASS\n'));
      mockProcess.emit('close', 0);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.reviewPassed).toBe(true);
      expect(result.attempts).toBe(2);
      expect(spawn).toHaveBeenCalledTimes(4); // gen + review1 + refine + review2
    });

    it('fails after max attempts without passing review', async () => {
      const options: SpecGeneratorOptions = {
        description: 'Build a REST API',
        cwd: '/test',
        headless: false,
        autonomous: true,
        timeoutMs: 5000,
        maxAttempts: 2,
      };

      const promise = generateSpec(options);

      // Initial generation
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.emit('close', 0);

      // First review (fail)
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.stdout.emit('data', Buffer.from('SPEC Review: FAIL\n'));
      mockProcess.emit('close', 0);

      // Refinement
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.emit('close', 0);

      // Second review (fail)
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.stdout.emit('data', Buffer.from('SPEC Review: FAIL\n'));
      mockProcess.emit('close', 0);

      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('Max attempts');
      expect(result.reviewPassed).toBe(false);
      expect(result.attempts).toBe(2);
    });

    it('parses review output correctly', async () => {
      const options: SpecGeneratorOptions = {
        description: 'Build a REST API',
        cwd: '/test',
        headless: true,
        autonomous: true,
        timeoutMs: 5000,
        maxAttempts: 3,
      };

      const promise = generateSpec(options);

      // Initial generation
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.emit('close', 0);

      // Review with detailed feedback
      await new Promise((resolve) => setTimeout(resolve, 10));
      const reviewOutput = `
SPEC Review: FAIL

## Format Issues

### Checkbox Syntax
- Line 42: Uses * [ ] instead of - [ ]

## Content Concerns

### HIGH PRIORITY
1. Missing Prerequisites: Auth needed first

## Recommendations

1. Fix format violations
2. Add auth tasks
`;
      mockProcess.stdout.emit('data', Buffer.from(reviewOutput));
      mockProcess.emit('close', 0);

      // Refinement
      await new Promise((resolve) => setTimeout(resolve, 10));
      const refineCall = vi.mocked(spawn).mock.calls[2];
      const refineArgs = refineCall[1] as string[];
      const refinePromptIndex = refineArgs.indexOf('-p');
      const refinePrompt = refineArgs[refinePromptIndex + 1];

      // Check that concerns are included in refinement prompt
      expect(refinePrompt).toContain('Format issues found');
      expect(refinePrompt).toContain('Content concerns');
      expect(refinePrompt).toContain('Recommendations');

      mockProcess.emit('close', 0);

      // Second review (pass)
      await new Promise((resolve) => setTimeout(resolve, 10));
      mockProcess.stdout.emit('data', Buffer.from('SPEC Review: PASS\n'));
      mockProcess.emit('close', 0);

      await promise;
    });
  });
});
