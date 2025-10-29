/**
 * Validation Utilities
 * Common validation functions used throughout the app
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate project title
 */
export const isValidProjectTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 100;
};

/**
 * Validate effect name
 */
export const isValidEffectName = (name: string): boolean => {
  return name.trim().length > 0 && name.length <= 50;
};

/**
 * Validate audio duration (in seconds)
 */
export const isValidDuration = (duration: number): boolean => {
  return duration > 0 && duration <= 3600; // Max 1 hour
};

/**
 * Validate file path
 */
export const isValidFilePath = (path: string): boolean => {
  return path.trim().length > 0 && path.startsWith('file://');
};

/**
 * Validate opacity value (0-1)
 */
export const isValidOpacity = (opacity: number): boolean => {
  return opacity >= 0 && opacity <= 1;
};

/**
 * Validate angle (degrees)
 */
export const isValidAngle = (angle: number): boolean => {
  return angle >= -360 && angle <= 360;
};

/**
 * Validate hex color
 */
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(color);
};

/**
 * Validate RGB color
 */
export const isValidRGBColor = (r: number, g: number, b: number): boolean => {
  return (
    r >= 0 && r <= 255 &&
    g >= 0 && g <= 255 &&
    b >= 0 && b <= 255
  );
};

/**
 * Validate tag
 */
export const isValidTag = (tag: string): boolean => {
  return tag.trim().length > 0 && tag.length <= 20 && /^[a-zA-Z0-9-_]+$/.test(tag);
};

/**
 * Validate array of tags
 */
export const isValidTagArray = (tags: string[]): boolean => {
  return tags.length <= 10 && tags.every(isValidTag);
};

/**
 * Validate effect parameters
 */
export const isValidEffectParameters = (params: Record<string, number>): boolean => {
  return Object.values(params).every(value =>
    typeof value === 'number' && !isNaN(value) && isFinite(value)
  );
};

/**
 * Validate date string (ISO 8601)
 */
export const isValidISODate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
};

/**
 * Sanitize string (remove special characters)
 */
export const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, '').trim();
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
};

/**
 * Truncate string with ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + '...';
};

/**
 * Validate and clamp number to range
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Check if value is defined and not null
 */
export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (str: string | undefined | null): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Check if array is empty
 */
export const isArrayEmpty = <T>(arr: T[] | undefined | null): boolean => {
  return !arr || arr.length === 0;
};

/**
 * Validate object has required keys
 */
export const hasRequiredKeys = <T extends object>(
  obj: T,
  keys: (keyof T)[]
): boolean => {
  return keys.every(key => key in obj && isDefined(obj[key]));
};
