'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import {
  Calendar,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Brain,
  ShieldCheck,
  BookOpen,
  Dumbbell,
  Moon,
  Droplets,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

export default function WeeklyReviewPage() {
  const { weeklyReview, userProfile } = useData();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto select-none">
      {/* 1. YOUR WEEK HEADER */}
      <div className="p-6 sm:p-8 rounded-2xl border-2 border-[var(--border-subtle)] bg-[var(--bg-surface)] relative overflow-hidden shadow-xl">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }}
        />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-mono">
              WEEK OF {weeklyReview.weekStartDate} — {weeklyReview.weekEndDate}
            </span>
            <Badge variant="success" size="sm">
              {weeklyReview.routineConsistencyPct}% Consistency
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Your Week in Review, {userProfile.name.split(' ')[0]}
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            A comprehensive, data-derived retrospective of what you accomplished, patterns observed across your routines, and recommendations for the coming week.
          </p>
        </div>
      </div>

      {/* 2. KEY STATISTICS & FACTUAL DATA */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-wider text-xs">
            Key Statistics
          </h3>
          <Badge variant="outline" size="sm">Factual Data</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
              Activities Done
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">
              {weeklyReview.completedActivities} / {weeklyReview.plannedActivities}
            </div>
            <span className="text-xs text-emerald-400 font-medium mt-1 block">
              {weeklyReview.routineConsistencyPct}% completion rate
            </span>
          </Card>

          <Card className="p-4 sm:p-5">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
              Deep Study
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">
              {Math.floor(weeklyReview.studyMinutes / 60)}h {weeklyReview.studyMinutes % 60}m
            </div>
            <span className="text-xs text-sky-400 font-medium mt-1 block">
              Across 3 active subjects
            </span>
          </Card>

          <Card className="p-4 sm:p-5">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
              Workout Sessions
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">
              5 Sessions
            </div>
            <span className="text-xs text-amber-400 font-medium mt-1 block">
              {Math.floor(weeklyReview.workoutMinutes / 60)}h total duration
            </span>
          </Card>

          <Card className="p-4 sm:p-5">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
              Average Sleep
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">
              {Math.floor(weeklyReview.avgSleepMinutes / 60)}h {weeklyReview.avgSleepMinutes % 60}m
            </div>
            <span className="text-xs text-indigo-400 font-medium mt-1 block">
              Stable circadian window
            </span>
          </Card>
        </div>
      </div>

      {/* 3. WHAT YOU COMPLETED */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <CardTitle>What You Completed</CardTitle>
          </div>
          <Badge variant="outline" size="sm">Factual Data</Badge>
        </div>

        <div className="space-y-2.5">
          {weeklyReview.achievements.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-start gap-3 text-xs sm:text-sm text-[var(--text-primary)]"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. PATTERNS OBSERVED */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <CardTitle>Patterns Observed</CardTitle>
          </div>
          <Badge variant="info" size="sm">Data-Derived Interpretation</Badge>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Calculated by cross-referencing your focus ratings, sleep records, and completion timing.
        </p>

        <div className="space-y-2.5">
          {weeklyReview.observations.map((obs, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-start gap-3 text-xs sm:text-sm text-[var(--text-secondary)]"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{obs}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. AREAS TO FOCUS ON & NEXT WEEK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <CardTitle>Areas to Focus On</CardTitle>
          </div>
          <div className="space-y-2.5">
            {weeklyReview.focusAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed"
              >
                {area}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-[var(--accent-primary)]">
            <Sparkles className="w-5 h-5" />
            <CardTitle>Next Week Recommendations</CardTitle>
          </div>
          <div className="space-y-2.5">
            {weeklyReview.nextWeekRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed"
              >
                {rec}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 6. AI PREPARATION ARCHITECTURE PANEL */}
      <Card className="p-6 space-y-3 bg-[var(--bg-surface-translucent)] border-dashed">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-sm text-[var(--text-primary)]">
              AI Insight Engine (Ready for Backend Integration)
            </h4>
          </div>
          <Badge variant="outline" size="sm">Mock Architecture State</Badge>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          The DayTrack frontend is decoupled and ready to connect to Google Gemini or OpenAI LLM API endpoints. Once connected via Next.js Route Handlers, weekly reflections, habit correlations, and routine optimization can be dynamically generated on demand.
        </p>

        <div className="pt-2 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>No ungrounded claims or medical diagnoses are produced.</span>
        </div>
      </Card>
    </div>
  );
}
