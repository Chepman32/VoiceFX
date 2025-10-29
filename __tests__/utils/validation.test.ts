/**
 * Validation Utilities Tests
 */

import {
  isValidEmail,
  isValidProjectTitle,
  isValidEffectName,
  isValidDuration,
  isValidOpacity,
  isValidAngle,
  isValidHexColor,
  isValidTag,
  clamp,
  isDefined,
  isEmpty,
  sanitizeString,
  truncateString,
} from '@/utils/validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidProjectTitle', () => {
    it('should validate correct title', () => {
      expect(isValidProjectTitle('My Project')).toBe(true);
      expect(isValidProjectTitle('A')).toBe(true);
    });

    it('should reject invalid title', () => {
      expect(isValidProjectTitle('')).toBe(false);
      expect(isValidProjectTitle('   ')).toBe(false);
      expect(isValidProjectTitle('a'.repeat(101))).toBe(false);
    });
  });

  describe('isValidDuration', () => {
    it('should validate correct duration', () => {
      expect(isValidDuration(60)).toBe(true);
      expect(isValidDuration(3600)).toBe(true);
    });

    it('should reject invalid duration', () => {
      expect(isValidDuration(0)).toBe(false);
      expect(isValidDuration(-10)).toBe(false);
      expect(isValidDuration(3601)).toBe(false);
    });
  });

  describe('isValidOpacity', () => {
    it('should validate correct opacity', () => {
      expect(isValidOpacity(0)).toBe(true);
      expect(isValidOpacity(0.5)).toBe(true);
      expect(isValidOpacity(1)).toBe(true);
    });

    it('should reject invalid opacity', () => {
      expect(isValidOpacity(-0.1)).toBe(false);
      expect(isValidOpacity(1.1)).toBe(false);
    });
  });

  describe('isValidAngle', () => {
    it('should validate correct angle', () => {
      expect(isValidAngle(0)).toBe(true);
      expect(isValidAngle(90)).toBe(true);
      expect(isValidAngle(-180)).toBe(true);
    });

    it('should reject invalid angle', () => {
      expect(isValidAngle(361)).toBe(false);
      expect(isValidAngle(-361)).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should validate correct hex color', () => {
      expect(isValidHexColor('#FF0000')).toBe(true);
      expect(isValidHexColor('#F00')).toBe(true);
      expect(isValidHexColor('#FF000080')).toBe(true);
    });

    it('should reject invalid hex color', () => {
      expect(isValidHexColor('FF0000')).toBe(false);
      expect(isValidHexColor('#GG0000')).toBe(false);
      expect(isValidHexColor('#F')).toBe(false);
    });
  });

  describe('isValidTag', () => {
    it('should validate correct tag', () => {
      expect(isValidTag('music')).toBe(true);
      expect(isValidTag('voice-fx')).toBe(true);
      expect(isValidTag('tag_1')).toBe(true);
    });

    it('should reject invalid tag', () => {
      expect(isValidTag('')).toBe(false);
      expect(isValidTag('a'.repeat(21))).toBe(false);
      expect(isValidTag('tag with spaces')).toBe(false);
    });
  });

  describe('clamp', () => {
    it('should clamp value to range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('isDefined', () => {
    it('should check if value is defined', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should check if string is empty', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('text')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should remove special characters', () => {
      expect(sanitizeString('Hello <World>')).toBe('Hello World');
      expect(sanitizeString('  Test  ')).toBe('Test');
    });
  });

  describe('truncateString', () => {
    it('should truncate long strings', () => {
      expect(truncateString('Hello World', 8)).toBe('Hello...');
      expect(truncateString('Short', 10)).toBe('Short');
    });
  });
});
