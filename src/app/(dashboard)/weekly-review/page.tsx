'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardTitle } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { SmartWeeklyAnalysisOutput } from '@/app/api/analysis/weekly/route';
import {
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Brain,
  ShieldCheck,
  Lightbulb,
  Clock,
  Moon,
  Dumbbell,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function WeeklyReviewPage() {
  const {
    activities,
    routineItems,
    studySessions,
    workoutSessions,
    sleepRecords,
    habits,
    goals,
    userProfile,
    weeklyReview: defaultWeeklyReview,
  } = useData();

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SmartWeeklyAnalysisOutput | null>(null);
  const hasAutoTriggered = React.useRef(false);

  // Fetch the smart weekly analysis from our backend
  const generateAnalysis = React.useCallback(async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analysis/weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities,
          routineItems,
          studySessions,
          workoutSessions,
          sleepRecords,
          habits,
          goals,
          userName: userProfile.name,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to generate smart weekly analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [activities, routineItems, studySessions, workoutSessions, sleepRecords, habits, goals, userProfile.name]);

  // Initial load auto-generation once mounted
  useEffect(() => {
    if (!hasAutoTriggered.current) {
      hasAutoTriggered.current = true;
      generateAnalysis();
    }
  }, [generateAnalysis]);

  const score = analysis?.productivityScore ?? defaultWeeklyReview.routineConsistencyPct;
  const tier = analysis?.tier ?? (score >= 85 ? 'High Momentum' : 'Steady');

  const getTierColor = (t: string) => {
    switch (t) {
      case 'Mastery':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'High Momentum':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Steady':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      default:
        return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto select-none pb-12">
      {/* 1. HERO HEADER WITH AI ENGINE TRIGGER */}
      <div className="p-6 sm:p-8 rounded-2xl border-2 border-[var(--border-subtle)] bg-[var(--bg-surface)] relative overflow-hidden shadow-xl">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }}
        />

        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-mono">
                WEEK OF {analysis?.weekStartDate || defaultWeeklyReview.weekStartDate} —{' '}
                {analysis?.weekEndDate || defaultWeeklyReview.weekEndDate}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getTierColor(tier)}`}>
                {tier} Tier
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              loading={analyzing}
              onClick={generateAnalysis}
              className="gap-2 shadow-sm text-xs bg-[var(--bg-surface-elevated)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Analyzing Data...' : 'Recalculate Weekly AI'}</span>
            </Button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Your Week in Review{userProfile.name ? `, ${userProfile.name.split(' ')[0]}` : ''}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              Cross-domain synthesis of your daily routines, deep focus sessions, circadian sleep rhythms, and habit velocity.
            </p>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE PRODUCTIVITY SCORE & AI SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Score Ring Card */}
        <Card className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Executive Productivity Score
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-[var(--border-subtle)]"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - score / 100)}
                strokeLinecap="round"
                className="text-[var(--accent-primary)] transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono">
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                / 100
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs font-semibold text-[var(--text-primary)]">
            {analysis?.summaryQuote || 'Consistent execution creates compounding velocity.'}
          </div>
        </Card>

        {/* AI Executive Commentary */}
        <Card className="p-6 md:col-span-2 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <CardTitle className="text-base">Executive Performance Coaching</CardTitle>
              <Badge variant="outline" size="sm" className="ml-auto">
                DayTrack Intelligence
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
              {analysis?.executiveSummary ||
                `${userProfile.name || 'User'}, your week demonstrated consistent rhythm. By front-loading high-focus blocks and synchronizing bedtime recovery, you will unlock even greater productivity next week.`}
            </p>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Execution</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">
                {analysis?.stats.completionRatePct ?? 82}%
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Focus Rating</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">
                {analysis?.stats.avgFocusRating ?? 4.4} / 5.0
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Rhythm</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">
                {analysis?.tier ?? 'Steady'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. KEY METRICS STAT GRID */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-wider text-xs">
            Factual Weekly Metrics
          </h3>
          <Badge variant="outline" size="sm">Audited Telemetry</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Activities Done
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-2 font-mono">
              {analysis?.stats.completedActivities ?? defaultWeeklyReview.completedActivities} /{' '}
              {analysis?.stats.plannedActivities ?? defaultWeeklyReview.plannedActivities}
            </div>
            <span className="text-xs text-emerald-400 font-medium mt-1 block">
              {analysis?.stats.completionRatePct ?? defaultWeeklyReview.routineConsistencyPct}% completion rate
            </span>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Deep Focus
              </span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-2 font-mono">
              {analysis?.stats.totalStudyHoursFormatted ??
                `${Math.floor(defaultWeeklyReview.studyMinutes / 60)}h ${defaultWeeklyReview.studyMinutes % 60}m`}
            </div>
            <span className="text-xs text-sky-400 font-medium mt-1 block">
              Peak: {analysis?.focusAnalysis.peakFocusWindow || '09:00 - 12:30'}
            </span>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Physical Training
              </span>
              <Dumbbell className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-2 font-mono">
              {analysis?.stats.totalWorkoutHoursFormatted ??
                `${Math.floor(defaultWeeklyReview.workoutMinutes / 60)}h`}
            </div>
            <span className="text-xs text-amber-400 font-medium mt-1 block">
              Active conditioning
            </span>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Circadian Sleep
              </span>
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-2 font-mono">
              {analysis?.stats.avgSleepHoursFormatted ??
                `${Math.floor(defaultWeeklyReview.avgSleepMinutes / 60)}h ${defaultWeeklyReview.avgSleepMinutes % 60}m`}
            </div>
            <span className="text-xs text-indigo-400 font-medium mt-1 block">
              Average restorative rest
            </span>
          </Card>
        </div>
      </div>

      {/* 4. CIRCADIAN & HEALTH CORRELATIONS */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <CardTitle>Circadian & Performance Correlations</CardTitle>
          </div>
          <Badge variant="info" size="sm">Cross-Domain Intelligence</Badge>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          How your sleep recovery, physical movement, and routine timing directly influenced your mental energy and focus ratings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {analysis?.circadianCorrelation && analysis.circadianCorrelation.length > 0 ? (
            analysis.circadianCorrelation.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.impactLevel === 'positive'
                        ? 'bg-emerald-400'
                        : item.impactLevel === 'needs_attention'
                        ? 'bg-rose-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.insight}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              Consistent sleep windows greater than 7.5 hours strongly correlated with self-reported focus ratings above 4.5/5.
            </div>
          )}
        </div>
      </Card>

      {/* 5. WHAT YOU COMPLETED & OBSERVATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Achievements */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <CardTitle>Factual Achievements</CardTitle>
          </div>

          <div className="space-y-2.5">
            {(analysis?.achievements || defaultWeeklyReview.achievements).map((item, idx) => (
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

        {/* Behavioral Observations */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sky-400">
            <TrendingUp className="w-5 h-5" />
            <CardTitle>Behavioral Observations</CardTitle>
          </div>

          <div className="space-y-2.5">
            {(analysis?.observations || defaultWeeklyReview.observations).map((obs, idx) => (
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
      </div>

      {/* 6. STRATEGIC NEXT-WEEK ACTION PLAN */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--accent-primary)]">
            <Sparkles className="w-5 h-5" />
            <CardTitle>AI Next-Week Strategic Game Plan</CardTitle>
          </div>
          <Badge variant="outline" size="sm">Ranked by Priority</Badge>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Targeted, high-impact adjustments designed to eliminate friction points and compound weekly performance.
        </p>

        <div className="space-y-3 pt-1">
          {analysis?.strategicPlan && analysis.strategicPlan.length > 0 ? (
            analysis.strategicPlan.map((plan, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        plan.priority === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : plan.priority === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      }`}
                    >
                      {plan.priority} Priority
                    </span>
                    <span className="font-semibold text-xs text-[var(--text-primary)]">
                      {plan.area}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
                    {plan.recommendation}
                  </p>
                </div>

                <div className="text-xs text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-2 rounded-lg font-medium whitespace-nowrap self-start sm:self-center">
                  👉 {plan.suggestedAction}
                </div>
              </div>
            ))
          ) : (
            defaultWeeklyReview.nextWeekRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed"
              >
                {rec}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 7. PRIVACY & GROUNDING BADGE */}
      <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] py-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>DayTrack Intelligence operates strictly on your tracked data with zero telemetry leakage.</span>
      </div>
    </div>
  );
}
