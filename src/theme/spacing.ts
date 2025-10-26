/**
 * Spacing System - 8pt grid
 * Consistent spacing values across the application
 */

export const spacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 96,
} as const;

export type SpacingKey = keyof typeof spacing;

/**
 * Border Radius values
 */
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;

/**
 * Shadow definitions for elevation
 */
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

export type ShadowKey = keyof typeof shadows;

/**
 * Layout constants
 */
export const layout = {
  headerHeight: 44,
  tabBarHeight: 49,
  hitSlop: {top: 12, bottom: 12, left: 12, right: 12},
  minTouchTarget: 44,
  screenPadding: spacing.md,
  cardPadding: spacing.md,
  listItemHeight: 60,
} as const;
