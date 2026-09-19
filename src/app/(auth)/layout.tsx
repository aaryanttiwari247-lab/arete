'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Sun, Moon, CloudMoon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, cycleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-md mx-auto w-full pt-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-[var(--text-primary)]">DayTrack</span>
        </Link>

        <button
          onClick={cycleTheme}
          title={`Appearance: ${theme}`}
          className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all text-xs flex items-center gap-1.5"
        >
          {theme === 'light' ? (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          ) : theme === 'medium' ? (
            <CloudMoon className="w-3.5 h-3.5 text-sky-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span className="capitalize">{theme}</span>
        </button>
      </div>

      {/* Main Form Center */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        {children}
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-[var(--text-muted)] py-4">
        Protected by DayTrack security and zero-knowledge client privacy.
      </div>
    </div>
  );
}
