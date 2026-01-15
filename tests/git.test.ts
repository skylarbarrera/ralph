import { describe, it, expect } from 'vitest';
import { slugifyTitle } from '../src/lib/git.js';

describe('git utilities', () => {
  describe('slugifyTitle', () => {
    it('converts title to lowercase kebab-case', () => {
      expect(slugifyTitle('User Authentication System')).toBe('user-authentication-system');
    });

    it('removes special characters', () => {
      expect(slugifyTitle('Feature: Add OAuth 2.0!')).toBe('feature-add-oauth-20');
    });

    it('handles multiple spaces', () => {
      expect(slugifyTitle('My   Project   Title')).toBe('my-project-title');
    });

    it('handles multiple dashes', () => {
      expect(slugifyTitle('My---Project---Title')).toBe('my-project-title');
    });

    it('trims leading and trailing dashes', () => {
      expect(slugifyTitle('---My Project---')).toBe('my-project');
    });

    it('limits length to 50 characters', () => {
      const longTitle = 'A'.repeat(100);
      expect(slugifyTitle(longTitle).length).toBeLessThanOrEqual(50);
    });

    it('returns empty string for empty input', () => {
      expect(slugifyTitle('')).toBe('');
    });

    it('handles only special characters', () => {
      expect(slugifyTitle('!@#$%^&*()')).toBe('');
    });

    it('handles numbers in title', () => {
      expect(slugifyTitle('Project 2024 v1.0')).toBe('project-2024-v10');
    });

    it('preserves existing dashes', () => {
      expect(slugifyTitle('my-existing-slug')).toBe('my-existing-slug');
    });
  });
});
