export type ThemeMode = 'light' | 'medium' | 'dark';

export type AnimationIntensity = 'low' | 'medium' | 'high';

export interface AppearanceSettings {
  theme: ThemeMode;
  backgroundAnimation: boolean;
  intensity: AnimationIntensity;
  reduceMotion: boolean;
}

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  theme: 'medium', // Highlights the custom slate/gray design system
  backgroundAnimation: true,
  intensity: 'medium',
  reduceMotion: false,
};
