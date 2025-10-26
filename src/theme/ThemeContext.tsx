/**
 * Theme Context - Manages theme state and provides theme values
 */

import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {lightColors, darkColors, ColorScheme} from './colors';
import {typography} from './typography';
import {spacing, borderRadius, shadows, layout} from './spacing';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  colors: ColorScheme;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  layout: typeof layout;
  isDark: boolean;
}

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    borderRadius,
    shadows,
    layout,
    isDark,
  };

  return (
    <ThemeContext.Provider value={{theme, themeMode, setThemeMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useColors = (): ColorScheme => {
  const {theme} = useTheme();
  return theme.colors;
};
