'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Tabs } from '@/ui/Tabs';
import { Progress } from '@/ui/Progress';
import {
  BarChart3,
  TrendingUp,
  Clock,
  BookOpen,
  Dumbbell,
  Moon,
  Droplets,
  Flame,
  Target,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { studySessions, workoutSessions, sleepRecords, totalWaterToday, habits, goals } = useData();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Weekly data points for visual charts
  const weeklyActivityData = [
    { day: 'Mon', planned: 9, completed: 8, rate: 89 },
    { day: 'Tue', planned: 9, completed: 9, rate: 100 },
    { day: 'Wed', planned: 8, completed: 7, rate: 88 },
    { day: 'Thu', planned: 9, completed: 8, rate: 89 },
    { day: 'Fri', planned: 8, completed: 6, rate: 75 },
    { day: 'Sat', planned: 6, completed: 5, rate: 83 },
    { day: 'Sun', planned: 5, completed: 4, rate: 80 },
  ];

  const plannedVsActualItems = [
    {
      category: 'Academic Study',
      plannedHours: 14.0,
      actualHours: 11.6, // 11h 35m
      icon: <BookOpen className="w-4 h-4 text-sky-400" />,
      color: '#38bdf8',
      summary: '11h 35m completed of 14h planned',
    },
    {
      category: 'Physical Workout',
      plannedHours: 5.0,
      actualHours: 4.16, // 4h 10m
      icon: <Dumbbell className="w-4 h-4 text-amber-400" />,
      color: '#f97316',
      summary: '4h 10m completed of 5h planned',
    },
    {
      category: 'Software Coding',
      plannedHours: 7.0,
      actualHours: 8.33, // 8h 20m
      icon: <Flame className="w-4 h-4 text-violet-400" />,
      color: '#818cf8',
      summary: '8h 20m completed (+1h 20m above baseline)',
    },
    {
      category: 'Sleep & Recovery',
      plannedHours: 56.0,
      actualHours: 52.2,
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
      color: '#a855f7',
      summary: '7h 28m nightly average',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Performance Analytics & Insights
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Objective activity distribution, routine consistency trends, and planned vs actual progress.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Tabs
            activeTab={timeframe}
            onChange={t => setTimeframe(t as any)}
            tabs={[
              { id: 'daily', label: 'Daily' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
            ]}
          />
          <Link href="/weekly-review">
            <Button size="sm" className="gap-1.5">
              <span>Weekly Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Routine Adherence
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">87%</span>
            <span className="text-xs text-emerald-400 font-semibold">+4% vs last week</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            47 of 54 planned activities fulfilled
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Recorded Study Time
            </span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">14h 35m</span>
            <span className="text-xs text-[var(--text-muted)]">across 3 subjects</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Average focus rating: 4.7 / 5.0
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Sleep Consistency
            </span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">7h 28m</span>
            <span className="text-xs text-indigo-400 font-semibold">avg / night</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Variance: ±18 min
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Habit Streaks Active
            </span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">6 of 6</span>
            <span className="text-xs text-orange-400 font-semibold">18d max</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Zero missed days this week
          </p>
        </Card>
      </div>

      {/* 1. INTERACTIVE WEEKLY ACTIVITY COMPLETION CHART */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Daily Activity Execution Rates</CardTitle>
            <CardDescription>
              Percentage of planned routine items completed across each day of the current week.
            </CardDescription>
          </div>
          <Badge variant="info">Weekly Average: 87%</Badge>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4 pb-2">
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 border-b border-[var(--border-subtle)] pb-2">
            {weeklyActivityData.map(item => {
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                    {item.rate}%
                  </span>
                  <div className="w-full max-w-[48px] bg-[var(--bg-surface-elevated)] rounded-t-xl overflow-hidden h-full flex items-end p-0.5">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[var(--accent-primary)] to-sky-400 transition-all duration-500 group-hover:opacity-90 shadow-sm"
                      style={{ height: `${item.rate}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[var(--text-secondary)] mt-1">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 2. PLANNED VS ACTUAL VISUAL COMPARISONS */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Planned vs. Actual Execution</CardTitle>
            <CardDescription>
              Constructive progress evaluation. Missed time is never framed as failure, but as calibration for future routines.
            </CardDescription>
          </div>
          <Badge variant="outline">Constructive Analysis</Badge>
        </div>

        <div className="space-y-6 pt-2">
          {plannedVsActualItems.map(item => {
            const ratio = Math.min(Math.round((item.actualHours / item.plannedHours) * 100), 120);

            return (
              <div key={item.category} className="space-y-2 p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[var(--text-primary)]">{item.category}</h4>
                      <p className="text-xs text-[var(--text-muted)]">{item.summary}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
                      {item.actualHours.toFixed(1)}h / {item.plannedHours.toFixed(1)}h
                    </span>
                    <span className="block text-[10px] text-[var(--text-muted)] uppercase font-mono">
                      {ratio}% ratio
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <Progress value={ratio} max={100} indicatorColor={item.color} size="md" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
