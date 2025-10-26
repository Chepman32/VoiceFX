/**
 * Typography System - SF Pro Text/Display with dynamic type support
 * Based on iOS Human Interface Guidelines
 */

import {Platform, TextStyle} from 'react-native';

const fontFamily = {
  regular: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Medium',
  }),
  semibold: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto-Bold',
  }),
  bold: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto-Bold',
  }),
} as const;

const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const typography = {
  // Large Titles
  largeTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.37,
  } as TextStyle,

  // Titles
  title1: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.36,
  } as TextStyle,

  title2: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.35,
  } as TextStyle,

  title3: {
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.38,
  } as TextStyle,

  // Headlines
  headline: {
    fontFamily: fontFamily.semibold,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.41,
  } as TextStyle,

  // Body
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.41,
  } as TextStyle,

  bodyEmphasized: {
    fontFamily: fontFamily.semibold,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.41,
  } as TextStyle,

  // Callout
  callout: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.32,
  } as TextStyle,

  calloutEmphasized: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.32,
  } as TextStyle,

  // Subheadline
  subheadline: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.24,
  } as TextStyle,

  subheadlineEmphasized: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.24,
  } as TextStyle,

  // Footnote
  footnote: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.08,
  } as TextStyle,

  footnoteEmphasized: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.08,
  } as TextStyle,

  // Caption
  caption1: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  } as TextStyle,

  caption1Emphasized: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
  } as TextStyle,

  caption2: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.07,
  } as TextStyle,

  caption2Emphasized: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.07,
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;

/**
 * Dynamic Type Scale Multipliers for Accessibility
 * Maps to iOS Dynamic Type content size categories
 */
export const dynamicTypeScale = {
  extraSmall: 0.82,
  small: 0.88,
  medium: 0.95,
  large: 1.0, // Default
  extraLarge: 1.12,
  extraExtraLarge: 1.24,
  extraExtraExtraLarge: 1.35,
  accessibilityMedium: 1.5,
  accessibilityLarge: 1.75,
  accessibilityExtraLarge: 2.0,
  accessibilityExtraExtraLarge: 2.35,
  accessibilityExtraExtraExtraLarge: 2.75,
} as const;

export type DynamicTypeSize = keyof typeof dynamicTypeScale;
