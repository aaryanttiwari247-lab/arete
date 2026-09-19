'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Habit, ActivityCategory } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import {
  Flame,
  Plus,
  CheckCircle2,
  Circle,
  Trophy,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function HabitsPage() {
  const { habits, toggleHabitToday, addHabit } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('reading');
  const [color, setColor] = useState('#818cf8');

  const totalCompletedToday = habits.filter(h => h.completedToday).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      category,
      frequency: 'daily',
      targetDays: [1, 2, 3, 4, 5, 6, 0],
      color,
    });

    setName('');
    setModalOpen(false);
  };

  // Mock 28 days for the calendar heatmap visual
  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Daily Habits & Streaks
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Build compounding consistency across reading, meditation, hydration, workouts, coding, and studies.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-2 self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </Button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Today's Completion
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {totalCompletedToday} / {habits.length}
            </span>
            <span className="text-xs text-[var(--text-muted)]">habits</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">
            {Math.round((totalCompletedToday / (habits.length || 1)) * 100)}% daily rate
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Top Active Streak
            </span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {habits.reduce((max, h) => Math.max(max, h.currentStreak), 0)} Days
            </span>
            <span className="text-xs text-[var(--text-muted)]">unbroken</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Hydration & Meditation leading
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              All-Time Record
            </span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{bestStreak} Days</span>
            <span className="text-xs text-[var(--text-muted)]">longest streak</span>
          </div>
          <p className="text-[11px] text-sky-400 mt-2 font-medium">
            Personal milestone reached
          </p>
        </Card>
      </div>

      {/* HABITS GRID WITH CALENDAR HEATMAPS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Active Habits</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map(habit => {
            const isCompleted = habit.completedToday;

            return (
              <Card key={habit.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <h4 className="font-semibold text-base text-[var(--text-primary)]">
                        {habit.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <Badge category={habit.category} size="sm" />
                      <span>•</span>
                      <span className="flex items-center gap-1 text-orange-400 font-semibold">
                        <Flame className="w-3.5 h-3.5" />
                        {habit.currentStreak} day streak
                      </span>
                      <span>(Best: {habit.longestStreak}d)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Check Off</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 28-DAY CALENDAR HEATMAP GRID */}
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    <span>Last 28 Days</span>
                    <span>Monthly View</span>
                  </div>
                  <div className="grid grid-cols-14 gap-1 sm:gap-1.5">
                    {days.map(d => {
                      // Deterministic mock fill pattern based on streak
                      const filled = d > 28 - habit.currentStreak || (d % 3 !== 0 && d < 20);
                      return (
                        <div
                          key={d}
                          title={`Day ${d}: ${filled ? 'Completed' : 'Missed'}`}
                          className="h-3 rounded-sm transition-all"
                          style={{
                            backgroundColor: filled ? habit.color : 'var(--border-subtle)',
                            opacity: filled ? 0.85 : 0.35,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal: New Habit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Habit"
        description="Establish a positive daily ritual to compound over time."
      >
        <form onSubmit={handleCreateHabit} className="space-y-4">
          <Input
            label="Habit Name"
            placeholder="e.g. 20 Minutes Deep Reading"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={category}
              onChange={e => setCategory(e.target.value as ActivityCategory)}
              options={[
                { value: 'reading', label: 'Reading' },
                { value: 'meditation', label: 'Meditation' },
                { value: 'water', label: 'Water' },
                { value: 'workout', label: 'Workout' },
                { value: 'coding', label: 'Coding' },
                { value: 'study', label: 'Study' },
                { value: 'personal', label: 'Personal' },
              ]}
            />

            <div>
              <label className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] block mb-1.5">
                Accent Color
              </label>
              <div className="flex items-center gap-2 pt-1">
                {['#38bdf8', '#818cf8', '#f97316', '#10b981', '#a855f7', '#ec4899'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      color === c ? 'scale-125 border-white shadow-md' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Habit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
