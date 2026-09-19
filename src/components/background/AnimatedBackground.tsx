'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LightBackground } from './LightBackground';
import { MediumBackground } from './MediumBackground';
import { DarkBackground } from './DarkBackground';

export const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden theme-transition"
      style={{ zIndex: 0 }}
    >
      {theme === 'light' && <LightBackground />}
      {theme === 'medium' && <MediumBackground />}
      {theme === 'dark' && <DarkBackground />}
    </div>
  );
};
