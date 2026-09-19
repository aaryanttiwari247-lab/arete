'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/ui/Card';
import { useData } from '@/context/DataContext';
import { CheckCircle2, CircleDashed, Clock, Sparkles } from 'lucide-react';

export const ProgressCard: React.FC = () => {
  const { activities } = useData();

  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const { total, completed, remaining, percentage, strokeDashoffset } = useMemo(() => {
    const total = activities.length;
    const completed = activities.filter(a => a.status === 'completed').length;
    const remaining = activities.filter(a => a.status === 'pending' || a.status === 'rescheduled').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return { total, completed, remaining, percentage, strokeDashoffset };
  }, [activities, circumference]);

  return (
    <Card className="relative overflow-hidden border-2 border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }}
      />
      <CardContent className="p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Metrics & Overview */}
        <div className="space-y-4 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today&apos;s Execution</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {percentage}% Completed
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              {total === 0
                ? "No activities scheduled for today yet. Tap 'Add Activity' above to start your day."
                : completed === total
                ? "Phenomenal! You've accomplished all scheduled activities for today."
                : `${completed} of ${total} planned activities completed so far.`}
            </p>
          </div>

          {/* Breakdown Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Done</span>
                <span className="text-xs font-bold text-[var(--text-primary)]">{completed}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <CircleDashed className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Pending</span>
                <span className="text-xs font-bold text-[var(--text-primary)]">{remaining}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <Clock className="w-4 h-4 text-sky-400" />
              <div className="text-left">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Planned</span>
                <span className="text-xs font-bold text-[var(--text-primary)]">{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Circular Progress Visualization */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="text-[var(--border-subtle)]"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="text-[var(--accent-primary)] transition-all duration-700 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[var(--text-primary)]">{percentage}%</span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Progress
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
