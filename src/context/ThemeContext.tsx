'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { AppearanceSettings, DEFAULT_APPEARANCE_SETTINGS, ThemeMode, AnimationIntensity } from '@/types/theme';

interface ThemeContextType {
  settings: AppearanceSettings;
  theme: ThemeMode;
  backgroundAnimation: boolean;
  intensity: AnimationIntensity;
  reduceMotion: boolean;
  setTheme: (theme: ThemeMode) => void;
  setBackgroundAnimation: (enabled: boolean) => void;
  setIntensity: (intensity: AnimationIntensity) => void;
  setReduceMotion: (enabled: boolean) => void;
  cycleTheme: () => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'daytrack_appearance_settings';

function applyDomAttributes(s: AppearanceSettings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', s.theme);
  root.setAttribute('data-animation', s.backgroundAnimation ? 'on' : 'off');
  root.setAttribute('data-intensity', s.intensity);
  root.setAttribute('data-reduced-motion', s.reduceMotion ? 'true' : 'false');

  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  if (metaScheme) {
    metaScheme.setAttribute('content', s.theme === 'light' ? 'light' : 'dark');
  }
}

function getInitialSettings(): AppearanceSettings {
  if (typeof window === 'undefined') return DEFAULT_APPEARANCE_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = { ...DEFAULT_APPEARANCE_SETTINGS, ...JSON.parse(saved) };
      applyDomAttributes(parsed);
      return parsed;
    }
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionMedia.matches) {
      const reduced = { ...DEFAULT_APPEARANCE_SETTINGS, reduceMotion: true };
      applyDomAttributes(reduced);
      return reduced;
    }
  } catch {
    // Ignore storage parsing errors
  }
  applyDomAttributes(DEFAULT_APPEARANCE_SETTINGS);
  return DEFAULT_APPEARANCE_SETTINGS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(getInitialSettings);

  const updateSettings = useCallback((partial: Partial<AppearanceSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      applyDomAttributes(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      updateSettings({ reduceMotion: e.matches });
    };

    motionMedia.addEventListener('change', handleMotionChange);
    return () => motionMedia.removeEventListener('change', handleMotionChange);
  }, [updateSettings]);

  const setTheme = useCallback((theme: ThemeMode) => updateSettings({ theme }), [updateSettings]);
  const setBackgroundAnimation = useCallback((backgroundAnimation: boolean) => updateSettings({ backgroundAnimation }), [updateSettings]);
  const setIntensity = useCallback((intensity: AnimationIntensity) => updateSettings({ intensity }), [updateSettings]);
  const setReduceMotion = useCallback((reduceMotion: boolean) => updateSettings({ reduceMotion }), [updateSettings]);

  const cycleTheme = useCallback(() => {
    setSettings(prev => {
      const sequence: ThemeMode[] = ['light', 'medium', 'dark'];
      const nextIndex = (sequence.indexOf(prev.theme) + 1) % sequence.length;
      const nextTheme = sequence[nextIndex];
      const next = { ...prev, theme: nextTheme };
      applyDomAttributes(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_APPEARANCE_SETTINGS);
    applyDomAttributes(DEFAULT_APPEARANCE_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPEARANCE_SETTINGS));
    } catch {
      // Ignore
    }
  }, []);

  const contextValue = useMemo<ThemeContextType>(() => ({
    settings,
    theme: settings.theme,
    backgroundAnimation: settings.backgroundAnimation,
    intensity: settings.intensity,
    reduceMotion: settings.reduceMotion,
    setTheme,
    setBackgroundAnimation,
    setIntensity,
    setReduceMotion,
    cycleTheme,
    resetToDefaults,
  }), [
    settings,
    setTheme,
    setBackgroundAnimation,
    setIntensity,
    setReduceMotion,
    cycleTheme,
    resetToDefaults,
  ]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
