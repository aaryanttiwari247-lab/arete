'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { DashboardQuickStats } from '@/components/dashboard/StatCard';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { Timer, ArrowRight, PenLine, Flame } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function DashboardPage() {
  const { habits } = useData();

  const activeHabitsStreak = useMemo(() => {
    return habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  }, [habits]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. TOP HERO: TODAY'S PROGRESS CARD */}
      <section aria-label="Today's Progress">
        <ProgressCard />
      </section>

      {/* 2. QUICK ACTION CALLOUTS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/focus"
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Focus Timer</h4>
              <p className="text-xs text-[var(--text-muted)]">25m & 50m deep work sessions</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/daily-review"
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <PenLine className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Daily Review</h4>
              <p className="text-xs text-[var(--text-muted)]">Record mood, energy & reflection</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/habits"
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Habits Active</h4>
              <p className="text-xs text-[var(--text-muted)]">Peak streak: {activeHabitsStreak} days</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
        </Link>
      </section>

      {/* 3. QUICK STATS GRID */}
      <section aria-label="Today's Metrics">
        <DashboardQuickStats />
      </section>

      {/* 4. TODAY'S CHRONOLOGICAL TIMELINE */}
      <section aria-label="Today's Timeline">
        <ActivityTimeline />
      </section>
    </div>
  );
}
