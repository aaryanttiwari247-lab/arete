'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Meal, MealType } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import {
  Utensils,
  Droplets,
  Plus,
  Trash2,
  Sliders,
} from 'lucide-react';

export default function MealsAndWaterPage() {
  const {
    meals,
    addMeal,
    deleteMeal,
    waterLogs,
    waterTarget,
    addWaterLog,
    setWaterTarget,
    totalWaterToday,
  } = useData();

  // Modals state
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [customWaterModal, setCustomWaterModal] = useState(false);

  // Meal Form
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [mealTime, setMealTime] = useState('08:30');
  const [foodsInput, setFoodsInput] = useState('');
  const [notes, setNotes] = useState('');

  // Target Form
  const [newTarget, setNewTarget] = useState(waterTarget.toString());
  const [customMl, setCustomMl] = useState('350');

  // Water calculations
  const waterPercent = Math.min(Math.round((totalWaterToday / waterTarget) * 100), 100);
  const waterLiters = (totalWaterToday / 1000).toFixed(2);
  const targetLiters = (waterTarget / 1000).toFixed(1);

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const foods = foodsInput
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    if (foods.length === 0) return;

    addMeal({
      type: mealType,
      time: mealTime,
      date: new Date().toISOString().split('T')[0],
      foods,
      notes: notes.trim() || undefined,
    });

    setFoodsInput('');
    setNotes('');
    setMealModalOpen(false);
  };

  const handleUpdateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(newTarget);
    if (parsed > 500 && parsed < 6000) {
      setWaterTarget(parsed);
      setTargetModalOpen(false);
    }
  };

  const handleCustomWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = parseInt(customMl);
    if (ml > 0) {
      addWaterLog(ml);
      setCustomWaterModal(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Meals & Hydration
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Mindful whole-foods logging and visual hydration tracking without forced calorie counts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button onClick={() => setMealModalOpen(true)} className="gap-2 shadow-md">
            <Plus className="w-4 h-4" />
            <span>Log Meal</span>
          </Button>
        </div>
      </div>

      {/* 1. VISUAL WATER TRACKER CARD */}
      <Card className="p-6 overflow-hidden relative border-2 border-[var(--border-subtle)]">
        <div
          className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Interactive Bottle / Gauge */}
          <div className="flex items-center gap-6">
            {/* Visual Glass/Gauge */}
            <div className="relative w-20 h-36 rounded-2xl border-2 border-cyan-400/40 bg-[var(--bg-surface-elevated)] p-1 overflow-hidden shadow-inner flex flex-col justify-end flex-shrink-0">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-cyan-500 to-sky-400 transition-all duration-700 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{ height: `${waterPercent}%` }}
              >
                {waterPercent > 15 && `${waterPercent}%`}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Water Consumed
                </span>
                <Badge variant="info" size="sm">{waterPercent}% Target</Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-[var(--text-primary)]">
                  {waterLiters} L
                </h3>
                <span className="text-sm text-[var(--text-muted)]">/ {targetLiters} L Target</span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
                Hydration target is personal guidance, not a medical requirement.
              </p>

              <button
                onClick={() => setTargetModalOpen(true)}
                className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1 font-medium"
              >
                <Sliders className="w-3 h-3" />
                <span>Adjust daily goal ({waterTarget} ml)</span>
              </button>
            </div>
          </div>

          {/* Right: Quick Add Buttons */}
          <div className="space-y-3 w-full lg:w-auto">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block text-center lg:text-left">
              Quick Hydration Add
            </span>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWaterLog(250)}
                className="hover:border-cyan-400"
              >
                +250 ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWaterLog(500)}
                className="hover:border-cyan-400"
              >
                +500 ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWaterLog(750)}
                className="hover:border-cyan-400"
              >
                +750 ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addWaterLog(1000)}
                className="hover:border-cyan-400"
              >
                +1.0 L
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCustomWaterModal(true)}
              >
                + Custom
              </Button>
            </div>

            {/* Today's Water Timeline */}
            <div className="flex items-center gap-2 pt-2 overflow-x-auto text-[11px] text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                Today's logs:
              </span>
              {waterLogs.length === 0 ? (
                <span className="text-[11px] text-[var(--text-muted)] italic">
                  No water logged today. Click a preset above to record hydration.
                </span>
              ) : (
                waterLogs.map(wl => (
                  <span
                    key={wl.id}
                    className="px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] whitespace-nowrap"
                  >
                    {wl.time} • {wl.amountMl}ml
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 2. MEALS LOG SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Today's Meals</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Focus on vitality and nutrition without stressful calorie counting.
            </p>
          </div>
          <Badge variant="outline">{meals.length} Meals Logged</Badge>
        </div>

        {meals.length === 0 ? (
          <Card className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <Utensils className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
            <h4 className="text-base font-semibold text-[var(--text-primary)]">No meals logged today</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              Track your breakfast, lunch, dinner, or snacks to ensure mindful nutrition throughout your day.
            </p>
            <Button size="sm" onClick={() => setMealModalOpen(true)}>Log Your First Meal</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meals.map(meal => (
              <Card key={meal.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm capitalize text-[var(--text-primary)]">
                        {meal.type}
                      </h4>
                      <span className="text-xs text-[var(--text-muted)]">{meal.time}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMeal(meal.id)}
                    className="h-7 w-7 p-0 text-rose-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

              {/* Food items pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {meal.foods.map((food, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium"
                  >
                    {food}
                  </span>
                ))}
              </div>

              {meal.notes && (
                <p className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                  {meal.notes}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>

      {/* Modal: Log Meal */}
      <Modal
        isOpen={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        title="Record Meal & Whole Foods"
      >
        <form onSubmit={handleCreateMeal} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Meal Type"
              value={mealType}
              onChange={e => setMealType(e.target.value as MealType)}
              options={[
                { value: 'breakfast', label: 'Breakfast' },
                { value: 'lunch', label: 'Lunch' },
                { value: 'snack', label: 'Snack' },
                { value: 'dinner', label: 'Dinner' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <Input
              label="Time"
              type="time"
              value={mealTime}
              onChange={e => setMealTime(e.target.value)}
              required
            />
          </div>

          <Input
            label="Foods Consumed (comma-separated)"
            placeholder="e.g. Scrambled Eggs, Avocado Toast, Blueberries"
            value={foodsInput}
            onChange={e => setFoodsInput(e.target.value)}
            helperText="Separate items with commas. Calorie counts are never required."
            required
            autoFocus
          />

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Hydrated with matcha; felt sustained"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setMealModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Log Meal</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Adjust Target */}
      <Modal
        isOpen={targetModalOpen}
        onClose={() => setTargetModalOpen(false)}
        title="Adjust Hydration Goal"
        description="Configure your personal daily target. This is informational guidance only."
      >
        <form onSubmit={handleUpdateTarget} className="space-y-4">
          <Input
            label="Daily Target (ml)"
            type="number"
            min="1000"
            max="5000"
            step="100"
            value={newTarget}
            onChange={e => setNewTarget(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setTargetModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Target</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Custom Water Amount */}
      <Modal
        isOpen={customWaterModal}
        onClose={() => setCustomWaterModal(false)}
        title="Log Custom Water Intake"
      >
        <form onSubmit={handleCustomWaterSubmit} className="space-y-4">
          <Input
            label="Amount (ml)"
            type="number"
            min="50"
            max="3000"
            step="50"
            value={customMl}
            onChange={e => setCustomMl(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setCustomWaterModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to Log</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
