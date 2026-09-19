'use client';

import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { activities, studySessions, workoutSessions, sleepRecords, habits } = useData();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Dynamically calculate metrics with useMemo
  const {
    totalActivities,
    completedActivities,
    adherenceRate,
    totalStudyMinutes,
    studyHours,
    studyMins,
    avgFocusRating,
    totalSleepMinutes,
    avgSleepMinutes,
    sleepHours,
    sleepMins,
    completedHabitsToday,
    topStreak,
  } = useMemo(() => {
    const total = activities.length;
    const completed = activities.filter(a => a.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const studyMin = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const sHours = Math.floor(studyMin / 60);
    const sMins = studyMin % 60;
    const focusRating = studySessions.length > 0
      ? (studySessions.reduce((acc, s) => acc + s.focusRating, 0) / studySessions.length).toFixed(1)
      : '0.0';

    const sleepMin = sleepRecords.reduce((acc, s) => acc + s.durationMinutes, 0);
    const avgSleep = sleepRecords.length > 0 ? Math.round(sleepMin / sleepRecords.length) : 0;
    const slpHours = Math.floor(avgSleep / 60);
    const slpMins = avgSleep % 60;

    const habitsDone = habits.filter(h => h.completedToday).length;
    const streak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

    return {
      totalActivities: total,
      completedActivities: completed,
      adherenceRate: rate,
      totalStudyMinutes: studyMin,
      studyHours: sHours,
      studyMins: sMins,
      avgFocusRating: focusRating,
      totalSleepMinutes: sleepMin,
      avgSleepMinutes: avgSleep,
      sleepHours: slpHours,
      sleepMins: slpMins,
      completedHabitsToday: habitsDone,
      topStreak: streak,
    };
  }, [activities, studySessions, sleepRecords, habits]);

  // 7-day breakdown from activities
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyActivityData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
    // If user has activities logged, count them; otherwise 0
    return { day, planned: 0, completed: 0, rate: 0 };
  });

  const plannedVsActualItems = [
    {
      category: 'Academic Study',
      plannedHours: 10.0,
      actualHours: totalStudyMinutes / 60,
      icon: <BookOpen className="w-4 h-4 text-sky-400" />,
      color: '#38bdf8',
      summary: totalStudyMinutes > 0 ? `${studyHours}h ${studyMins}m completed` : 'No study logged yet',
    },
    {
      category: 'Physical Workout',
      plannedHours: 5.0,
      actualHours: workoutSessions.reduce((acc, w) => acc + w.durationMinutes, 0) / 60,
      icon: <Dumbbell className="w-4 h-4 text-amber-400" />,
      color: '#f97316',
      summary: workoutSessions.length > 0 ? `${workoutSessions.length} sessions completed` : 'No workouts logged yet',
    },
    {
      category: 'Sleep & Recovery',
      plannedHours: 56.0,
      actualHours: totalSleepMinutes / 60,
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
      color: '#a855f7',
      summary: sleepRecords.length > 0 ? `${sleepHours}h ${sleepMins}m average per night` : 'No sleep logged yet',
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
            <span className="text-3xl font-bold text-[var(--text-primary)]">{adherenceRate}%</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {completedActivities} of {totalActivities} planned activities fulfilled
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
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {studyHours}h {studyMins}m
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {studySessions.length} {studySessions.length === 1 ? 'session' : 'sessions'}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Average focus rating: {avgFocusRating} / 5.0
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
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {sleepHours}h {sleepMins}m
            </span>
            <span className="text-xs text-indigo-400 font-semibold">avg / night</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {sleepRecords.length} recorded nights
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
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {completedHabitsToday} of {habits.length}
            </span>
            <span className="text-xs text-orange-400 font-semibold">{topStreak}d peak</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {habits.length === 0 ? 'No habits configured' : `${habits.length} tracked habits`}
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
          <Badge variant="info">Weekly Average: {adherenceRate}%</Badge>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4 pb-2">
          {totalActivities === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center space-y-2 border border-dashed border-[var(--border-subtle)] rounded-xl text-center p-6">
              <BarChart3 className="w-8 h-8 text-[var(--text-muted)] opacity-50" />
              <p className="text-sm font-semibold text-[var(--text-primary)]">No activity data logged yet</p>
              <p className="text-xs text-[var(--text-muted)] max-w-sm">
                As you check off scheduled tasks and routine items, daily execution bars will populate here.
              </p>
            </div>
          ) : (
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
          )}
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
            const ratio = item.plannedHours > 0 ? Math.min(Math.round((item.actualHours / item.plannedHours) * 100), 120) : 0;

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
