/**
 * Color System - Accessible palette with semantic tokens
 * Follows WCAG AA standards for text contrast
 */

export const lightColors = {
  // Primary palette
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // Neutral palette
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  backgroundTertiary: '#E5E5EA',

  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  textDisabled: '#C7C7CC',

  // Borders
  border: '#C6C6C8',
  borderLight: '#E5E5EA',

  // Semantic colors
  success: '#34C759',
  successLight: '#52D869',
  successDark: '#28A745',

  warning: '#FF9500',
  warningLight: '#FFB340',
  warningDark: '#E68500',

  error: '#FF3B30',
  errorLight: '#FF6961',
  errorDark: '#D32F2F',

  info: '#5AC8FA',
  infoLight: '#89D9FB',
  infoDark: '#0A84FF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  overlayHeavy: 'rgba(0, 0, 0, 0.6)',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
} as const;

export const darkColors = {
  // Primary palette
  primary: '#0A84FF',
  primaryLight: '#64D2FF',
  primaryDark: '#0066CC',

  // Neutral palette
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',

  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',

  // Text
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  textDisabled: '#48484A',

  // Borders
  border: '#38383A',
  borderLight: '#48484A',

  // Semantic colors
  success: '#32D74B',
  successLight: '#52E766',
  successDark: '#28A03F',

  warning: '#FF9F0A',
  warningLight: '#FFB340',
  warningDark: '#E68900',

  error: '#FF453A',
  errorLight: '#FF6961',
  errorDark: '#D32F2F',

  info: '#64D2FF',
  infoLight: '#89DBFF',
  infoDark: '#0A84FF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  overlayHeavy: 'rgba(0, 0, 0, 0.8)',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorScheme = typeof lightColors;
export type ColorName = keyof ColorScheme;
