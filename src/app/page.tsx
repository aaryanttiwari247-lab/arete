'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/ui/Button';
import { Card, CardContent } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  BarChart3,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function HomePage() {
  const { theme, cycleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12 max-w-6xl mx-auto w-full select-none">
      {/* Top Navbar */}
      <header className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-[var(--text-primary)]">
              DayTrack
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
              Routine & Wellness OS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cycleTheme}
            className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            Theme: <span className="capitalize font-semibold text-[var(--accent-primary)]">{theme}</span>
          </button>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Open Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="py-16 sm:py-24 space-y-12 text-center sm:text-left flex-1 flex flex-col justify-center">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] text-xs font-semibold border border-[var(--accent-primary)]/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Plan → Track → Understand → Improve</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
            Deliberate living, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-sky-300">
              effortlessly tracked.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            A premium daily routine, productivity, wellness, study, workout, hydration, and sleep system designed for long-term consistency without cognitive overload.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-6 gap-2 shadow-lg">
                <span>Enter DayTrack App</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="secondary" size="lg" className="px-6">
                New User Onboarding
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="lg" className="px-6">
                Theme System
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)]">
              Weekly Routine Template
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Design recurring schedules across Monday through Sunday. Customize individual days without destroying your master routine.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)]">
              Automated Weekly Reviews
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Transparent separation of factual activity logs vs data-derived observations. Pinpoint patterns and optimize your week.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)]">
              3 Distinct Appearance Modes
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Light, Medium (Slate), and Dark themes with GPU-accelerated background ambient physics and full accessibility compliance.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-3">
        <p>© 2026 DayTrack. Built with Next.js, TypeScript & Tailwind CSS.</p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-[var(--text-primary)]">Dashboard</Link>
          <Link href="/routine" className="hover:text-[var(--text-primary)]">Routine</Link>
          <Link href="/settings" className="hover:text-[var(--text-primary)]">Appearance Settings</Link>
          <Link href="/login" className="hover:text-[var(--text-primary)]">Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
