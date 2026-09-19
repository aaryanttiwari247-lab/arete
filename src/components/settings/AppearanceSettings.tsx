'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Sun, Moon, CloudMoon, Sparkles, Sliders, Eye, RotateCcw } from 'lucide-react';
import { AnimationIntensity } from '@/types/theme';

export const AppearanceSettings: React.FC = () => {
  const {
    theme,
    backgroundAnimation,
    intensity,
    reduceMotion,
    setTheme,
    setBackgroundAnimation,
    setIntensity,
    setReduceMotion,
    resetToDefaults,
  } = useTheme();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Appearance & Theme System
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Customize DayTrack&apos;s visual atmosphere, background motion, and contrast. All preferences persist automatically.
        </p>
      </div>

      {/* 1. THEME MODE */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Appearance Mode</CardTitle>
              <CardDescription>
                Choose between three carefully crafted color systems. Medium is a dedicated slate environment, not just another dark theme.
              </CardDescription>
            </div>
            <Badge variant="info">Current: {theme}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LIGHT */}
            <div
              onClick={() => setTheme('light')}
              role="radio"
              aria-checked={theme === 'light'}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setTheme('light')}
              className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all select-none ${
                theme === 'light'
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-md ring-2 ring-[var(--accent-ring)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-primary)]">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    theme === 'light'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-subtle)]'
                  }`}
                >
                  {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                Bright neutral canvas, white cards, dark typography, and soft pastel moving ambient blobs.
              </p>
              {/* Color Swatch Preview */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
                <span className="w-4 h-4 rounded-full bg-[#f8fafc] border border-slate-300" title="Canvas" />
                <span className="w-4 h-4 rounded-full bg-[#ffffff] border border-slate-300" title="Surface" />
                <span className="w-4 h-4 rounded-full bg-[#0f172a]" title="Typography" />
                <span className="w-4 h-4 rounded-full bg-[#2563eb]" title="Accent" />
              </div>
            </div>

            {/* MEDIUM */}
            <div
              onClick={() => setTheme('medium')}
              role="radio"
              aria-checked={theme === 'medium'}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setTheme('medium')}
              className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all select-none ${
                theme === 'medium'
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-md ring-2 ring-[var(--accent-ring)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-primary)]">
                  <CloudMoon className="w-4 h-4 text-sky-400" />
                  <span>Medium (Slate)</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    theme === 'medium'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-subtle)]'
                  }`}
                >
                  {theme === 'medium' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                Medium-dark slate environment, lighter cards, comfortable text contrast, and soft twilight glow.
              </p>
              {/* Color Swatch Preview */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
                <span className="w-4 h-4 rounded-full bg-[#1e293b]" title="Canvas" />
                <span className="w-4 h-4 rounded-full bg-[#334155]" title="Surface" />
                <span className="w-4 h-4 rounded-full bg-[#f8fafc]" title="Typography" />
                <span className="w-4 h-4 rounded-full bg-[#38bdf8]" title="Accent" />
              </div>
            </div>

            {/* DARK */}
            <div
              onClick={() => setTheme('dark')}
              role="radio"
              aria-checked={theme === 'dark'}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setTheme('dark')}
              className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all select-none ${
                theme === 'dark'
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-md ring-2 ring-[var(--accent-ring)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-primary)]">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    theme === 'dark'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-subtle)]'
                  }`}
                >
                  {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                Deep charcoal/near-black canvas, elevated surfaces, high contrast, subtle grid, and cosmic glow.
              </p>
              {/* Color Swatch Preview */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
                <span className="w-4 h-4 rounded-full bg-[#090d16]" title="Canvas" />
                <span className="w-4 h-4 rounded-full bg-[#131a28]" title="Surface" />
                <span className="w-4 h-4 rounded-full bg-[#f8fafc]" title="Typography" />
                <span className="w-4 h-4 rounded-full bg-[#6366f1]" title="Accent" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. BACKGROUND ANIMATION TOGGLE */}
      <Card>
        <CardHeader>
          <CardTitle>Background Animation (Sand Clock)</CardTitle>
          <CardDescription>
            Animated glass hourglass showing how time flies, with trickling sand streams, accumulating mounds, and floating stardust.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setBackgroundAnimation(false)}
              role="radio"
              aria-checked={!backgroundAnimation}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setBackgroundAnimation(false)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                !backgroundAnimation
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-sm ring-1 ring-[var(--accent-ring)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Off</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Static background with subtle contours</p>
              </div>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  !backgroundAnimation
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                    : 'border-[var(--border-subtle)]'
                }`}
              >
                {!backgroundAnimation && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>

            <div
              onClick={() => setBackgroundAnimation(true)}
              role="radio"
              aria-checked={backgroundAnimation}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setBackgroundAnimation(true)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                backgroundAnimation
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-sm ring-1 ring-[var(--accent-ring)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>On (Recommended)</span>
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Sand clock with flowing grains and floating time particles</p>
              </div>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  backgroundAnimation
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                    : 'border-[var(--border-subtle)]'
                }`}
              >
                {backgroundAnimation && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. ANIMATION INTENSITY */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Animation Intensity</CardTitle>
              <CardDescription>
                Controls the movement speed, scale, and luminosity of the background blobs.
              </CardDescription>
            </div>
            <Sliders className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['low', 'medium', 'high'] as AnimationIntensity[]).map(lvl => {
              const isSelected = intensity === lvl;
              const descriptions = {
                low: 'Ultra subtle, slow 60s cycles, lowest opacity',
                medium: 'Balanced 30s ambient pace, natural glow',
                high: 'Richer luminous presence, 20s fluid cycle',
              };

              return (
                <div
                  key={lvl}
                  onClick={() => setIntensity(lvl)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setIntensity(lvl)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all capitalize select-none ${
                    isSelected
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-sm ring-1 ring-[var(--accent-ring)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{lvl}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                          : 'border-[var(--border-subtle)]'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{descriptions[lvl]}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. REDUCE MOTION (ACCESSIBILITY) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reduce Motion</CardTitle>
              <CardDescription>
                When enabled, freezes all decorative background movement, reduces transitions, and respects prefers-reduced-motion.
              </CardDescription>
            </div>
            <Eye className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setReduceMotion(false)}
              role="radio"
              aria-checked={!reduceMotion}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setReduceMotion(false)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                !reduceMotion
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-sm ring-1 ring-[var(--accent-ring)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Off</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Smooth animated transitions enabled</p>
              </div>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  !reduceMotion
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                    : 'border-[var(--border-subtle)]'
                }`}
              >
                {!reduceMotion && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>

            <div
              onClick={() => setReduceMotion(true)}
              role="radio"
              aria-checked={reduceMotion}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setReduceMotion(true)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                reduceMotion
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-sm ring-1 ring-[var(--accent-ring)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">On (Accessible)</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Instant transitions, freezes decorative motion</p>
              </div>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  reduceMotion
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                    : 'border-[var(--border-subtle)]'
                }`}
              >
                {reduceMotion && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. LIVE PREVIEW & RESET */}
      <Card className="bg-[var(--bg-surface-translucent)] backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Component Preview</CardTitle>
              <CardDescription>
                Demonstrating typography contrast, elevation, badges, and accent buttons in real time.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Defaults
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[var(--text-primary)]">
                  DayTrack Active Theme: {theme.toUpperCase()}
                </span>
                <Badge category="coding">Verified</Badge>
                <Badge priority="high">High Contrast</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Surfaces, borders, and typography remain strictly legible across all ambient conditions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">Primary Action</Button>
              <Button size="sm" variant="secondary">Secondary</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
