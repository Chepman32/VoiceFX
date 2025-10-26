/**
 * Preferences Store Slice - Manages user preferences
 */

import {StateCreator} from 'zustand';
import {UserPreferences} from '@/types/common';

export interface PreferencesSlice {
  preferences: UserPreferences;

  // Actions
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setDynamicTypeSize: (size: number) => void;
  toggleHaptics: () => void;
  toggleSoundEffects: () => void;
  toggleAnalytics: () => void;
  completeOnboarding: () => void;
}

export const createPreferencesSlice: StateCreator<PreferencesSlice> = set => ({
  preferences: {
    themeMode: 'system',
    dynamicTypeSize: 1.0,
    hapticsEnabled: true,
    soundEffectsEnabled: true,
    analyticsEnabled: false,
    onboardingCompleted: false,
  },

  setPreferences: preferences =>
    set(state => ({
      preferences: {...state.preferences, ...preferences},
    })),

  setThemeMode: mode =>
    set(state => ({
      preferences: {...state.preferences, themeMode: mode},
    })),

  setDynamicTypeSize: size =>
    set(state => ({
      preferences: {...state.preferences, dynamicTypeSize: size},
    })),

  toggleHaptics: () =>
    set(state => ({
      preferences: {
        ...state.preferences,
        hapticsEnabled: !state.preferences.hapticsEnabled,
      },
    })),

  toggleSoundEffects: () =>
    set(state => ({
      preferences: {
        ...state.preferences,
        soundEffectsEnabled: !state.preferences.soundEffectsEnabled,
      },
    })),

  toggleAnalytics: () =>
    set(state => ({
      preferences: {
        ...state.preferences,
        analyticsEnabled: !state.preferences.analyticsEnabled,
      },
    })),

  completeOnboarding: () =>
    set(state => ({
      preferences: {...state.preferences, onboardingCompleted: true},
    })),
});
