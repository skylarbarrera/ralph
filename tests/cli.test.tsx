import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseArgs, resolvePrompt, DEFAULT_PROMPT, type CliOptions } from '../src/cli.js';
import { existsSync, readFileSync } from 'fs';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

describe('cli', () => {
  describe('parseArgs', () => {
    it('parses default values', () => {
      const options = parseArgs(['node', 'cli.tsx']);

      expect(options.iterations).toBe(1);
      expect(options.prompt).toBeUndefined();
      expect(options.promptFile).toBeUndefined();
      expect(options.cwd).toBe(process.cwd());
      expect(options.timeoutIdle).toBe(120);
      expect(options.saveJsonl).toBeUndefined();
      expect(options.quiet).toBe(false);
      expect(options.title).toBeUndefined();
    });

    it('parses -n/--iterations option', () => {
      const short = parseArgs(['node', 'cli.tsx', '-n', '5']);
      expect(short.iterations).toBe(5);

      const long = parseArgs(['node', 'cli.tsx', '--iterations', '10']);
      expect(long.iterations).toBe(10);
    });

    it('parses -p/--prompt option', () => {
      const short = parseArgs(['node', 'cli.tsx', '-p', 'Do something']);
      expect(short.prompt).toBe('Do something');

      const long = parseArgs(['node', 'cli.tsx', '--prompt', 'Do another thing']);
      expect(long.prompt).toBe('Do another thing');
    });

    it('parses --prompt-file option', () => {
      const options = parseArgs(['node', 'cli.tsx', '--prompt-file', './my-prompt.txt']);
      expect(options.promptFile).toBe('./my-prompt.txt');
    });

    it('parses --cwd option', () => {
      const options = parseArgs(['node', 'cli.tsx', '--cwd', '/path/to/repo']);
      expect(options.cwd).toBe('/path/to/repo');
    });

    it('parses --timeout-idle option', () => {
      const options = parseArgs(['node', 'cli.tsx', '--timeout-idle', '300']);
      expect(options.timeoutIdle).toBe(300);
    });

    it('parses --save-jsonl option', () => {
      const options = parseArgs(['node', 'cli.tsx', '--save-jsonl', './debug.jsonl']);
      expect(options.saveJsonl).toBe('./debug.jsonl');
    });

    it('parses --quiet option', () => {
      const options = parseArgs(['node', 'cli.tsx', '--quiet']);
      expect(options.quiet).toBe(true);
    });

    it('parses --title option', () => {
      const options = parseArgs(['node', 'cli.tsx', '--title', 'My Custom Title']);
      expect(options.title).toBe('My Custom Title');
    });

    it('parses multiple options together', () => {
      const options = parseArgs([
        'node', 'cli.tsx',
        '-n', '3',
        '-p', 'Run tests',
        '--cwd', '/home/user/project',
        '--timeout-idle', '60',
        '--save-jsonl', './log.jsonl',
        '--quiet',
        '--title', 'Test Run',
      ]);

      expect(options.iterations).toBe(3);
      expect(options.prompt).toBe('Run tests');
      expect(options.cwd).toBe('/home/user/project');
      expect(options.timeoutIdle).toBe(60);
      expect(options.saveJsonl).toBe('./log.jsonl');
      expect(options.quiet).toBe(true);
      expect(options.title).toBe('Test Run');
    });
  });

  describe('resolvePrompt', () => {
    beforeEach(() => {
      vi.mocked(existsSync).mockReset();
      vi.mocked(readFileSync).mockReset();
    });

    it('returns prompt option when provided', () => {
      const options: CliOptions = {
        iterations: 1,
        prompt: 'Custom prompt text',
        cwd: '/test',
        timeoutIdle: 120,
        quiet: false,
      };

      expect(resolvePrompt(options)).toBe('Custom prompt text');
    });

    it('reads prompt from file when promptFile is provided', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue('Prompt from file content');

      const options: CliOptions = {
        iterations: 1,
        promptFile: './prompt.txt',
        cwd: '/test',
        timeoutIdle: 120,
        quiet: false,
      };

      expect(resolvePrompt(options)).toBe('Prompt from file content');
      expect(existsSync).toHaveBeenCalledWith('/test/prompt.txt');
      expect(readFileSync).toHaveBeenCalledWith('/test/prompt.txt', 'utf-8');
    });

    it('throws error when promptFile does not exist', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const options: CliOptions = {
        iterations: 1,
        promptFile: './missing.txt',
        cwd: '/test',
        timeoutIdle: 120,
        quiet: false,
      };

      expect(() => resolvePrompt(options)).toThrow('Prompt file not found: /test/missing.txt');
    });

    it('returns DEFAULT_PROMPT when no prompt options are provided', () => {
      const options: CliOptions = {
        iterations: 1,
        cwd: '/test',
        timeoutIdle: 120,
        quiet: false,
      };

      expect(resolvePrompt(options)).toBe(DEFAULT_PROMPT);
    });

    it('prioritizes prompt over promptFile', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue('File content');

      const options: CliOptions = {
        iterations: 1,
        prompt: 'Direct prompt',
        promptFile: './prompt.txt',
        cwd: '/test',
        timeoutIdle: 120,
        quiet: false,
      };

      expect(resolvePrompt(options)).toBe('Direct prompt');
      expect(readFileSync).not.toHaveBeenCalled();
    });
  });

  describe('DEFAULT_PROMPT', () => {
    it('contains Ralph loop instructions', () => {
      expect(DEFAULT_PROMPT).toContain('Ralph');
      expect(DEFAULT_PROMPT).toContain('PRD.md');
      expect(DEFAULT_PROMPT).toContain('progress.txt');
      expect(DEFAULT_PROMPT).toContain('task');
      expect(DEFAULT_PROMPT.toLowerCase()).toContain('commit');
    });

    it('instructs to work on one task per iteration', () => {
      expect(DEFAULT_PROMPT).toContain('ONE task per iteration');
    });
  });
});
