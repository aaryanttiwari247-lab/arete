'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { DailyReview } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import {
  Smile,
  Zap,
  Activity,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function DailyReviewPage() {
  const { dailyReviews, saveDailyReview } = useData();

  const todayStr = new Date().toISOString().split('T')[0];
  const existingTodayReview = dailyReviews.find(r => r.date === todayStr);

  const [mood, setMood] = useState<number>(existingTodayReview?.mood || 5);
  const [energy, setEnergy] = useState<number>(existingTodayReview?.energy || 4);
  const [stress, setStress] = useState<number>(existingTodayReview?.stress || 2);
  const [wentWell, setWentWell] = useState<string>(existingTodayReview?.wentWell || '');
  const [couldImprove, setCouldImprove] = useState<string>(existingTodayReview?.couldImprove || '');
  const [tomorrowFocus, setTomorrowFocus] = useState<string>(existingTodayReview?.tomorrowFocus || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();

    saveDailyReview({
      date: todayStr,
      mood,
      energy,
      stress,
      wentWell: wentWell.trim(),
      couldImprove: couldImprove.trim(),
      tomorrowFocus: tomorrowFocus.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getRatingLabel = (val: number, type: 'mood' | 'energy' | 'stress') => {
    if (type === 'mood') {
      const labels = ['Low', 'Slightly Down', 'Neutral', 'Good', 'Exceptional'];
      return labels[val - 1];
    }
    if (type === 'energy') {
      const labels = ['Exhausted', 'Sluggish', 'Steady', 'High Energy', 'Peak Vitality'];
      return labels[val - 1];
    }
    const labels = ['Zero Stress', 'Mild', 'Moderate', 'Elevated', 'High Pressure'];
    return labels[val - 1];
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto select-none">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          End-of-Day Reflection & Review
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Close your day with deliberate evaluation: assess cognitive energy, celebrate wins, and orient tomorrow's focus.
        </p>
      </div>

      <form onSubmit={handleSaveReview} className="space-y-6">
        {/* 1. SLIDERS: MOOD, ENERGY, STRESS */}
        <Card className="p-6 space-y-6">
          <CardTitle className="text-lg">Vitality & State Check</CardTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mood */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Smile className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Mood</span>
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {mood} / 5 • {getRatingLabel(mood, 'mood')}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={mood}
                onChange={e => setMood(Number(e.target.value))}
                className="w-full accent-[var(--accent-primary)] cursor-pointer"
              />
            </div>

            {/* Energy */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Energy</span>
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {energy} / 5 • {getRatingLabel(energy, 'energy')}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energy}
                onChange={e => setEnergy(Number(e.target.value))}
                className="w-full accent-[var(--accent-primary)] cursor-pointer"
              />
            </div>

            {/* Stress */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Stress Level</span>
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {stress} / 5 • {getRatingLabel(stress, 'stress')}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={stress}
                onChange={e => setStress(Number(e.target.value))}
                className="w-full accent-[var(--accent-primary)] cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* 2. THE 3 REFLECTION PROMPTS */}
        <Card className="p-6 space-y-5">
          <CardTitle className="text-lg">Daily Debrief</CardTitle>

          <div className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] block mb-1.5">
                What went well today?
              </label>
              <textarea
                rows={3}
                placeholder="Accomplishments, deep focus milestones, wholesome choices..."
                value={wentWell}
                onChange={e => setWentWell(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] block mb-1.5">
                What could be improved?
              </label>
              <textarea
                rows={3}
                placeholder="Frictions, distractions, schedule delays, or energy dips..."
                value={couldImprove}
                onChange={e => setCouldImprove(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] block mb-1.5">
                What do I want to focus on tomorrow?
              </label>
              <textarea
                rows={3}
                placeholder="Top 1-2 non-negotiable priorities for tomorrow's execution..."
                value={tomorrowFocus}
                onChange={e => setTomorrowFocus(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Reflection recorded successfully!
              </span>
            ) : (
              <span className="text-xs text-[var(--text-muted)]">
                Takes ~2 minutes to record every evening.
              </span>
            )}
            <Button type="submit">Save Daily Review</Button>
          </div>
        </Card>
      </form>

      {/* PAST REVIEWS ARCHIVE */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Past Reflections</h3>

        <div className="space-y-4">
          {dailyReviews.length === 0 ? (
            <Card className="p-8 text-center flex flex-col items-center justify-center space-y-3">
              <Calendar className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
              <h4 className="text-base font-semibold text-[var(--text-primary)]">No reflections recorded yet</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-sm">
                Complete your first end-of-day reflection above to record energy levels, wins, and tomorrow's focus.
              </p>
            </Card>
          ) : (
            dailyReviews.map(review => (
              <Card key={review.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                      {review.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="info" size="sm">Mood: {review.mood}/5</Badge>
                    <Badge variant="success" size="sm">Energy: {review.energy}/5</Badge>
                    <Badge variant="outline" size="sm">Stress: {review.stress}/5</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] space-y-1">
                    <span className="font-semibold text-emerald-400 block">Went Well:</span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{review.wentWell}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] space-y-1">
                    <span className="font-semibold text-amber-400 block">Could Improve:</span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{review.couldImprove}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] space-y-1">
                    <span className="font-semibold text-sky-400 block">Tomorrow Focus:</span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{review.tomorrowFocus}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
