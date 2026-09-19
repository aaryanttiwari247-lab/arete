'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_APPEARANCE_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Load saved settings from localStorage & listen for system preferences
  useEffect(() => {
    setMounted(true);
    let initialSettings = DEFAULT_APPEARANCE_SETTINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        initialSettings = { ...DEFAULT_APPEARANCE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage errors
    }

    // Check system prefers-reduced-motion
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionMedia.matches && !localStorage.getItem(STORAGE_KEY)) {
      initialSettings.reduceMotion = true;
    }

    setSettings(initialSettings);
    applyDomAttributes(initialSettings);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => {
        const next = { ...prev, reduceMotion: e.matches };
        applyDomAttributes(next);
        return next;
      });
    };

    motionMedia.addEventListener('change', handleMotionChange);
    return () => motionMedia.removeEventListener('change', handleMotionChange);
  }, []);

  const applyDomAttributes = (s: AppearanceSettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', s.theme);
    root.setAttribute('data-animation', s.backgroundAnimation ? 'on' : 'off');
    root.setAttribute('data-intensity', s.intensity);
    root.setAttribute('data-reduced-motion', s.reduceMotion ? 'true' : 'false');
    
    // Update meta color-scheme
    const metaScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaScheme) {
      metaScheme.setAttribute('content', s.theme === 'light' ? 'light' : 'dark');
    }
  };

  const updateSettings = (partial: Partial<AppearanceSettings>) => {
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
  };

  const setTheme = (theme: ThemeMode) => updateSettings({ theme });
  const setBackgroundAnimation = (backgroundAnimation: boolean) => updateSettings({ backgroundAnimation });
  const setIntensity = (intensity: AnimationIntensity) => updateSettings({ intensity });
  const setReduceMotion = (reduceMotion: boolean) => updateSettings({ reduceMotion });

  const cycleTheme = () => {
    const sequence: ThemeMode[] = ['light', 'medium', 'dark'];
    const nextIndex = (sequence.indexOf(settings.theme) + 1) % sequence.length;
    setTheme(sequence[nextIndex]);
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_APPEARANCE_SETTINGS);
    applyDomAttributes(DEFAULT_APPEARANCE_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPEARANCE_SETTINGS));
    } catch {
      // Ignore
    }
  };

  // Avoid flash by keeping styles attached even before hydration
  return (
    <ThemeContext.Provider
      value={{
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
      }}
    >
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
