import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { JsonlLogger, createLogger } from '../src/lib/logger.js';

const TEST_RUNS_DIR = './test-runs-temp';

describe('JsonlLogger', () => {
  beforeEach(() => {
    if (existsSync(TEST_RUNS_DIR)) {
      rmSync(TEST_RUNS_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(TEST_RUNS_DIR)) {
      rmSync(TEST_RUNS_DIR, { recursive: true });
    }
  });

  describe('constructor', () => {
    it('creates runs directory if it does not exist', async () => {
      expect(existsSync(TEST_RUNS_DIR)).toBe(false);
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR });
      expect(existsSync(TEST_RUNS_DIR)).toBe(true);
      await logger.close();
    });

    it('uses existing runs directory', async () => {
      mkdirSync(TEST_RUNS_DIR, { recursive: true });
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR });
      expect(existsSync(TEST_RUNS_DIR)).toBe(true);
      await logger.close();
    });

    it('generates ISO timestamp filename by default', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR });
      const filepath = logger.getFilepath();
      expect(filepath).toMatch(/test-runs-temp\/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.jsonl$/);
      await logger.close();
    });

    it('uses custom filename when provided', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'custom.jsonl' });
      expect(logger.getFilepath()).toBe(join(TEST_RUNS_DIR, 'custom.jsonl'));
      await logger.close();
    });
  });

  describe('log', () => {
    it('writes raw lines to file', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      logger.log('line 1');
      logger.log('line 2');
      await logger.close();

      const content = readFileSync(join(TEST_RUNS_DIR, 'test.jsonl'), 'utf-8');
      expect(content).toBe('line 1\nline 2\n');
    });

    it('handles empty lines', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      logger.log('');
      logger.log('nonempty');
      await logger.close();

      const content = readFileSync(join(TEST_RUNS_DIR, 'test.jsonl'), 'utf-8');
      expect(content).toBe('\nnonempty\n');
    });

    it('does not write after close', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      logger.log('before');
      await logger.close();
      logger.log('after');

      const content = readFileSync(join(TEST_RUNS_DIR, 'test.jsonl'), 'utf-8');
      expect(content).toBe('before\n');
    });
  });

  describe('logObject', () => {
    it('writes JSON serialized objects', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      logger.logObject({ type: 'test', value: 123 });
      logger.logObject({ array: [1, 2, 3] });
      await logger.close();

      const content = readFileSync(join(TEST_RUNS_DIR, 'test.jsonl'), 'utf-8');
      const lines = content.trim().split('\n');
      expect(JSON.parse(lines[0])).toEqual({ type: 'test', value: 123 });
      expect(JSON.parse(lines[1])).toEqual({ array: [1, 2, 3] });
    });

    it('handles nested objects', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      const complex = {
        message: { content: [{ type: 'text', text: 'hello' }] },
        meta: { deep: { nested: true } },
      };
      logger.logObject(complex);
      await logger.close();

      const content = readFileSync(join(TEST_RUNS_DIR, 'test.jsonl'), 'utf-8');
      expect(JSON.parse(content.trim())).toEqual(complex);
    });

    it('silently ignores circular references', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      const circular: Record<string, unknown> = { name: 'test' };
      circular.self = circular;

      logger.logObject(circular);
      logger.logObject({ valid: true });
      await logger.close();

      const content = readFileSync(join(TEST_RUNS_DIR, 'test.jsonl'), 'utf-8');
      expect(content).toBe('{"valid":true}\n');
    });

    it('does not write after close', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      logger.logObject({ before: true });
      await logger.close();
      logger.logObject({ after: true });

      const content = readFileSync(join(TEST_RUNS_DIR, 'test.jsonl'), 'utf-8');
      expect(content).toBe('{"before":true}\n');
    });
  });

  describe('getFilepath', () => {
    it('returns the full filepath', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'output.jsonl' });
      expect(logger.getFilepath()).toBe(join(TEST_RUNS_DIR, 'output.jsonl'));
      await logger.close();
    });
  });

  describe('close', () => {
    it('resolves immediately if already closed', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      await logger.close();
      await logger.close(); // Should not throw
    });

    it('sets closed state', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      expect(logger.isClosed()).toBe(false);
      await logger.close();
      expect(logger.isClosed()).toBe(true);
    });
  });

  describe('isClosed', () => {
    it('returns false initially', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      expect(logger.isClosed()).toBe(false);
      await logger.close();
    });

    it('returns true after close', async () => {
      const logger = new JsonlLogger({ runsDir: TEST_RUNS_DIR, filename: 'test.jsonl' });
      await logger.close();
      expect(logger.isClosed()).toBe(true);
    });
  });
});

describe('createLogger', () => {
  beforeEach(() => {
    if (existsSync(TEST_RUNS_DIR)) {
      rmSync(TEST_RUNS_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(TEST_RUNS_DIR)) {
      rmSync(TEST_RUNS_DIR, { recursive: true });
    }
  });

  it('creates a JsonlLogger instance', async () => {
    const logger = createLogger({ runsDir: TEST_RUNS_DIR });
    expect(logger).toBeInstanceOf(JsonlLogger);
    await logger.close();
  });

  it('passes options to constructor', async () => {
    const logger = createLogger({ runsDir: TEST_RUNS_DIR, filename: 'factory.jsonl' });
    expect(logger.getFilepath()).toBe(join(TEST_RUNS_DIR, 'factory.jsonl'));
    await logger.close();
  });
});
