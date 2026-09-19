'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Progress } from '@/ui/Progress';
import {
  Clock,
  BookOpen,
  Dumbbell,
  Moon,
  Flame,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function PlannedVsActualPage() {
  const categories = [
    {
      name: 'Academic Deep Study',
      plannedHours: 14.0,
      actualHours: 11.6, // 11h 35m
      icon: <BookOpen className="w-5 h-5 text-sky-400" />,
      color: '#38bdf8',
      summary: '11h 35m achieved across Distributed Systems & Cloud Architecture.',
      observation: 'Consistent 2h blocks in early afternoon yielded highest focus retention.',
    },
    {
      name: 'Physical Workout & Training',
      plannedHours: 5.0,
      actualHours: 4.16, // 4h 10m
      icon: <Dumbbell className="w-5 h-5 text-amber-400" />,
      color: '#f97316',
      summary: '4h 10m completed of 5h planned (5 high-intensity sessions).',
      observation: 'Progressive overload was sustained across all push and pull compound lifts.',
    },
    {
      name: 'Software Coding & Projects',
      plannedHours: 7.0,
      actualHours: 8.33, // 8h 20m
      icon: <Flame className="w-5 h-5 text-violet-400" />,
      color: '#818cf8',
      summary: '8h 20m completed (+1h 20m above baseline schedule).',
      observation: 'Extended evening flow state on Next.js component system architecture.',
    },
    {
      name: 'Nightly Sleep Recovery',
      plannedHours: 56.0,
      actualHours: 52.2, // ~7h 28m avg
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      color: '#a855f7',
      summary: '7h 28m nightly average across all 7 recorded nights.',
      observation: 'Bedtime consistency had a low variance of ±18 minutes.',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Planned vs. Actual Execution
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Objective, constructive analysis comparing planned routine targets with logged reality.
          </p>
        </div>

        <Link href="/analytics">
          <Button variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
            <span>Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Constructive Philosophy Banner */}
      <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-start gap-3 text-xs text-[var(--text-secondary)]">
        <Info className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[var(--text-primary)]">
            Constructive Reflection Philosophy
          </p>
          <p className="leading-relaxed">
            Missed plans are never treated as failures or deficiencies in DayTrack. Unmet estimates provide valuable calibration signals for fine-tuning future weekly routines without self-judgment.
          </p>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-5">
        {categories.map(cat => {
          const ratio = Math.min(Math.round((cat.actualHours / cat.plannedHours) * 100), 125);
          const isSurpassed = cat.actualHours >= cat.plannedHours;

          return (
            <Card key={cat.name} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">{cat.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{cat.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge variant={isSurpassed ? 'success' : 'info'}>
                    {ratio}% Target Met
                  </Badge>
                  <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
                    {cat.actualHours.toFixed(1)}h / {cat.plannedHours.toFixed(1)}h
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <Progress value={ratio} max={100} indicatorColor={cat.color} size="md" />
              </div>

              {/* Data observation */}
              <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-secondary)] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong>Pattern Note:</strong> {cat.observation}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
