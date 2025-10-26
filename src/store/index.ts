/**
 * Main Zustand Store - Combines all slices
 */

import {create} from 'zustand';
import {createProjectsSlice, ProjectsSlice} from './projectsSlice';
import {createEffectsSlice, EffectsSlice} from './effectsSlice';
import {createPreferencesSlice, PreferencesSlice} from './preferencesSlice';
import {createIAPSlice, IAPSlice} from './iapSlice';

export type AppStore = ProjectsSlice & EffectsSlice & PreferencesSlice & IAPSlice;

export const useStore = create<AppStore>()((...a) => ({
  ...createProjectsSlice(...a),
  ...createEffectsSlice(...a),
  ...createPreferencesSlice(...a),
  ...createIAPSlice(...a),
}));

// Selectors for better performance
export const useProjects = () => useStore(state => state.projects);
export const useCurrentProject = () => useStore(state => state.currentProject);
export const useEffects = () => useStore(state => state.effects);
export const useSelectedEffect = () => useStore(state => state.selectedEffect);
export const usePreferences = () => useStore(state => state.preferences);
export const useIsPro = () => useStore(state => state.isPro);
