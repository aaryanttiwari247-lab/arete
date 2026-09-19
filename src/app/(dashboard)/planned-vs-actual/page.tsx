'use client';

import React, { useMemo } from 'react';
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
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

import { useData } from '@/context/DataContext';

export default function PlannedVsActualPage() {
  const { studySessions, workoutSessions, sleepRecords, subjects } = useData();

  const {
    plannedStudyHours,
    plannedWorkoutHours,
    plannedSleepHours,
    actualStudyHours,
    actualWorkoutHours,
    actualSleepHours,
    hasAnyData,
  } = useMemo(() => {
    const totalStudy = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalWorkout = workoutSessions.reduce((acc, w) => acc + w.durationMinutes, 0);
    const totalSleep = sleepRecords.reduce((acc, s) => acc + s.durationMinutes, 0);

    const plannedStudy = subjects.reduce((acc, s) => acc + s.targetHoursPerWeek, 0) || 10;
    const plannedWorkout = 5.0;
    const plannedSleep = 56.0;

    return {
      plannedStudyHours: plannedStudy,
      plannedWorkoutHours: plannedWorkout,
      plannedSleepHours: plannedSleep,
      actualStudyHours: totalStudy / 60,
      actualWorkoutHours: totalWorkout / 60,
      actualSleepHours: totalSleep / 60,
      hasAnyData: totalStudy > 0 || totalWorkout > 0 || totalSleep > 0,
    };
  }, [studySessions, workoutSessions, sleepRecords, subjects]);

  const categories = [
    {
      name: 'Academic Deep Study',
      plannedHours: plannedStudyHours,
      actualHours: actualStudyHours,
      icon: <BookOpen className="w-5 h-5 text-sky-400" />,
      color: '#38bdf8',
      summary: actualStudyHours > 0
        ? `${actualStudyHours.toFixed(1)}h completed across logged subjects.`
        : 'No study hours logged yet.',
      observation: actualStudyHours > 0
        ? 'Sessions logged with high focus retention.'
        : 'Schedule dedicated study blocks in Weekly Routine to track adherence.',
    },
    {
      name: 'Physical Workout & Training',
      plannedHours: plannedWorkoutHours,
      actualHours: actualWorkoutHours,
      icon: <Dumbbell className="w-5 h-5 text-amber-400" />,
      color: '#f97316',
      summary: actualWorkoutHours > 0
        ? `${workoutSessions.length} sessions logged (${actualWorkoutHours.toFixed(1)}h total).`
        : 'No workout sessions logged yet.',
      observation: actualWorkoutHours > 0
        ? 'Consistent active duration recorded.'
        : 'Log workouts with sets or simple active duration.',
    },
    {
      name: 'Nightly Sleep Recovery',
      plannedHours: plannedSleepHours,
      actualHours: actualSleepHours,
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      color: '#a855f7',
      summary: actualSleepHours > 0
        ? `${(actualSleepHours / (sleepRecords.length || 1)).toFixed(1)}h average per night.`
        : 'No sleep records logged yet.',
      observation: actualSleepHours > 0
        ? 'Sleep data recorded across nights.'
        : 'Log nightly bedtimes and wake times to calibrate recovery.',
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
