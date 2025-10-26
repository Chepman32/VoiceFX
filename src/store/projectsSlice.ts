/**
 * Projects Store Slice - Manages audio projects
 */

import {StateCreator} from 'zustand';
import {AudioProject} from '@/types/common';

export interface ProjectsSlice {
  projects: AudioProject[];
  currentProject: AudioProject | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: AudioProject[]) => void;
  addProject: (project: AudioProject) => void;
  updateProject: (id: string, updates: Partial<AudioProject>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: AudioProject | null) => void;
  toggleFavorite: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const createProjectsSlice: StateCreator<ProjectsSlice> = set => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  setProjects: projects => set({projects}),

  addProject: project =>
    set(state => ({
      projects: [project, ...state.projects],
    })),

  updateProject: (id, updates) =>
    set(state => ({
      projects: state.projects.map(p =>
        p.id === id ? {...p, ...updates, updatedAt: new Date().toISOString()} : p
      ),
      currentProject:
        state.currentProject?.id === id
          ? {...state.currentProject, ...updates, updatedAt: new Date().toISOString()}
          : state.currentProject,
    })),

  deleteProject: id =>
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),

  setCurrentProject: project => set({currentProject: project}),

  toggleFavorite: id =>
    set(state => ({
      projects: state.projects.map(p =>
        p.id === id ? {...p, isFavorite: !p.isFavorite} : p
      ),
    })),

  setLoading: isLoading => set({isLoading}),
  setError: error => set({error}),
});
