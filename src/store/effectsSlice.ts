/**
 * Effects Store Slice - Manages voice effects
 */

import {StateCreator} from 'zustand';
import {VoiceEffect} from '@/types/common';

export interface EffectsSlice {
  effects: VoiceEffect[];
  selectedEffect: VoiceEffect | null;
  customEffects: VoiceEffect[];

  // Actions
  setEffects: (effects: VoiceEffect[]) => void;
  addEffect: (effect: VoiceEffect) => void;
  updateEffect: (id: string, updates: Partial<VoiceEffect>) => void;
  deleteEffect: (id: string) => void;
  setSelectedEffect: (effect: VoiceEffect | null) => void;
  addCustomEffect: (effect: VoiceEffect) => void;
}

export const createEffectsSlice: StateCreator<EffectsSlice> = set => ({
  effects: [],
  selectedEffect: null,
  customEffects: [],

  setEffects: effects => set({effects}),

  addEffect: effect =>
    set(state => ({
      effects: [...state.effects, effect],
    })),

  updateEffect: (id, updates) =>
    set(state => ({
      effects: state.effects.map(e =>
        e.id === id ? {...e, ...updates, updatedAt: new Date().toISOString()} : e
      ),
      selectedEffect:
        state.selectedEffect?.id === id
          ? {...state.selectedEffect, ...updates}
          : state.selectedEffect,
    })),

  deleteEffect: id =>
    set(state => ({
      effects: state.effects.filter(e => e.id !== id),
      customEffects: state.customEffects.filter(e => e.id !== id),
      selectedEffect: state.selectedEffect?.id === id ? null : state.selectedEffect,
    })),

  setSelectedEffect: effect => set({selectedEffect: effect}),

  addCustomEffect: effect =>
    set(state => ({
      customEffects: [...state.customEffects, effect],
      effects: [...state.effects, effect],
    })),
});
