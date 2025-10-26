/**
 * Common type definitions
 */

export interface VoiceEffect {
  id: string;
  name: string;
  type: 'pitch' | 'formant' | 'reverb' | 'echo' | 'distortion' | 'custom';
  parameters: Record<string, number>;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AudioProject {
  id: string;
  title: string;
  duration: number;
  fileUri: string;
  thumbnailUri?: string;
  effects: VoiceEffect[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
}

export interface ExportFormat {
  format: 'pdf' | 'markdown' | 'json' | 'audio';
  quality?: 'low' | 'medium' | 'high';
  includeMetadata: boolean;
}

export interface NotificationSchedule {
  id: string;
  title: string;
  body: string;
  scheduledDate: string;
  isRecurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
}

export interface UserPreferences {
  themeMode: 'light' | 'dark' | 'system';
  dynamicTypeSize: number;
  hapticsEnabled: boolean;
  soundEffectsEnabled: boolean;
  analyticsEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface IAPProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  type: 'consumable' | 'non-consumable' | 'subscription';
  isPurchased: boolean;
}
