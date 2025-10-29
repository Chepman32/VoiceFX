/**
 * Formatter Utilities Tests
 */

import {
  formatDuration,
  formatFileSize,
  formatRelativeTime,
  formatPercentage,
  capitalize,
  titleCase,
  truncate,
  pluralize,
  formatOrdinal,
} from '@/utils/formatters';

describe('Formatter Utils', () => {
  describe('formatDuration', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(59)).toBe('0:59');
      expect(formatDuration(60)).toBe('1:00');
      expect(formatDuration(125)).toBe('2:05');
      expect(formatDuration(3661)).toBe('61:01');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes to human-readable', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should handle just now', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');
    });
  });

  describe('formatPercentage', () => {
    it('should format as percentage', () => {
      expect(formatPercentage(0.5)).toBe('50%');
      expect(formatPercentage(0.333, 2)).toBe('33.30%');
      expect(formatPercentage(1)).toBe('100%');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('test string')).toBe('Test string');
    });
  });

  describe('titleCase', () => {
    it('should convert to title case', () => {
      expect(titleCase('hello world')).toBe('Hello World');
      expect(titleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
      expect(truncate('Short', 10)).toBe('Short');
      expect(truncate('Exact', 5)).toBe('Exact');
    });
  });

  describe('pluralize', () => {
    it('should pluralize correctly', () => {
      expect(pluralize(0, 'item')).toBe('0 items');
      expect(pluralize(1, 'item')).toBe('1 item');
      expect(pluralize(2, 'item')).toBe('2 items');
      expect(pluralize(2, 'child', 'children')).toBe('2 children');
    });
  });

  describe('formatOrdinal', () => {
    it('should format ordinal numbers', () => {
      expect(formatOrdinal(1)).toBe('1st');
      expect(formatOrdinal(2)).toBe('2nd');
      expect(formatOrdinal(3)).toBe('3rd');
      expect(formatOrdinal(4)).toBe('4th');
      expect(formatOrdinal(11)).toBe('11th');
      expect(formatOrdinal(21)).toBe('21st');
      expect(formatOrdinal(22)).toBe('22nd');
      expect(formatOrdinal(23)).toBe('23rd');
      expect(formatOrdinal(100)).toBe('100th');
    });
  });
});
