/**
 * Navigation Types - Type-safe navigation parameters
 */

import {NavigatorScreenParams} from '@react-navigation/native';
import {AudioProject, VoiceEffect} from '@/types/common';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  Editor: {projectId?: string};
  EffectDetail: {effectId: string};
  Settings: undefined;
  Export: {projectId: string};
  Pro: undefined;
};

export type TabParamList = {
  Home: undefined;
  Library: undefined;
  Effects: undefined;
  More: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ProjectDetail: {projectId: string};
};

export type LibraryStackParamList = {
  LibraryScreen: undefined;
  ProjectList: {filter?: 'all' | 'favorites' | 'recent'};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
