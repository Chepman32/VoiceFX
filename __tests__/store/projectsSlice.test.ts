/**
 * Projects Slice Tests
 */

import {create} from 'zustand';
import {createProjectsSlice, ProjectsSlice} from '@/store/projectsSlice';
import {AudioProject} from '@/types/common';

describe('ProjectsSlice', () => {
  let store: ReturnType<typeof create<ProjectsSlice>>;

  beforeEach(() => {
    store = create<ProjectsSlice>()(createProjectsSlice);
  });

  const mockProject: AudioProject = {
    id: '1',
    title: 'Test Project',
    duration: 120,
    fileUri: 'file://test.wav',
    effects: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    isFavorite: false,
    tags: ['test'],
  };

  describe('addProject', () => {
    it('should add a new project', () => {
      const state = store.getState();
      state.addProject(mockProject);

      const updatedState = store.getState();
      expect(updatedState.projects).toHaveLength(1);
      expect(updatedState.projects[0]).toEqual(mockProject);
    });

    it('should add project at the beginning', () => {
      const state = store.getState();
      state.addProject(mockProject);

      const newProject = {...mockProject, id: '2', title: 'New Project'};
      state.addProject(newProject);

      const updatedState = store.getState();
      expect(updatedState.projects[0]).toEqual(newProject);
    });
  });

  describe('updateProject', () => {
    beforeEach(() => {
      store.getState().addProject(mockProject);
    });

    it('should update project properties', () => {
      const state = store.getState();
      state.updateProject('1', {title: 'Updated Title'});

      const updatedState = store.getState();
      expect(updatedState.projects[0].title).toBe('Updated Title');
    });

    it('should update project updatedAt timestamp', () => {
      const state = store.getState();
      const originalTime = state.projects[0].updatedAt;

      setTimeout(() => {
        state.updateProject('1', {title: 'Updated'});
        const updatedState = store.getState();
        expect(updatedState.projects[0].updatedAt).not.toBe(originalTime);
      }, 10);
    });
  });

  describe('deleteProject', () => {
    beforeEach(() => {
      store.getState().addProject(mockProject);
    });

    it('should delete a project', () => {
      const state = store.getState();
      state.deleteProject('1');

      const updatedState = store.getState();
      expect(updatedState.projects).toHaveLength(0);
    });

    it('should clear currentProject if deleted', () => {
      const state = store.getState();
      state.setCurrentProject(mockProject);
      state.deleteProject('1');

      const updatedState = store.getState();
      expect(updatedState.currentProject).toBeNull();
    });
  });

  describe('toggleFavorite', () => {
    beforeEach(() => {
      store.getState().addProject(mockProject);
    });

    it('should toggle favorite status', () => {
      const state = store.getState();
      state.toggleFavorite('1');

      const updatedState = store.getState();
      expect(updatedState.projects[0].isFavorite).toBe(true);

      state.toggleFavorite('1');
      const finalState = store.getState();
      expect(finalState.projects[0].isFavorite).toBe(false);
    });
  });

  describe('setCurrentProject', () => {
    it('should set current project', () => {
      const state = store.getState();
      state.setCurrentProject(mockProject);

      const updatedState = store.getState();
      expect(updatedState.currentProject).toEqual(mockProject);
    });

    it('should allow clearing current project', () => {
      const state = store.getState();
      state.setCurrentProject(mockProject);
      state.setCurrentProject(null);

      const updatedState = store.getState();
      expect(updatedState.currentProject).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should set and clear errors', () => {
      const state = store.getState();
      state.setError('Test error');

      expect(store.getState().error).toBe('Test error');

      state.setError(null);
      expect(store.getState().error).toBeNull();
    });

    it('should set loading state', () => {
      const state = store.getState();
      state.setLoading(true);

      expect(store.getState().isLoading).toBe(true);

      state.setLoading(false);
      expect(store.getState().isLoading).toBe(false);
    });
  });
});
