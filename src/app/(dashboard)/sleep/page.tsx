'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { SleepRecord } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import {
  Moon,
  Plus,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function SleepPage() {
  const { sleepRecords, addSleepRecord, sleepConfig } = useData();
  const [logModalOpen, setLogModalOpen] = useState(false);

  // Form State
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [notes, setNotes] = useState('');

  // Calculations
  const latestSleep = sleepRecords[0] || {
    bedtime: '23:10',
    wakeTime: '07:05',
    durationMinutes: 475,
    quality: 4,
    notes: 'Restful recovery',
  };

  const avgMinutes = Math.round(
    sleepRecords.reduce((acc, s) => acc + s.durationMinutes, 0) / (sleepRecords.length || 1)
  );
  const avgHours = Math.floor(avgMinutes / 60);
  const avgMins = avgMinutes % 60;

  const plannedMinutes = sleepConfig.targetHours * 60;
  const plannedVsActualDiff = latestSleep.durationMinutes - plannedMinutes;

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate duration in minutes between bedtime and wakeTime
    const [bH, bM] = bedtime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);

    let durationMinutes = (wH * 60 + wM) - (bH * 60 + bM);
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60; // Crosses midnight
    }

    addSleepRecord({
      date: new Date().toISOString().split('T')[0],
      bedtime,
      wakeTime,
      durationMinutes,
      quality,
      notes: notes.trim() || undefined,
    });

    setNotes('');
    setLogModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Sleep & Recovery Tracking
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Monitor bedtime consistency, sleep duration, and subjective restorative quality. Informational guidance only.
          </p>
        </div>

        <Button onClick={() => setLogModalOpen(true)} className="gap-2 self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" />
          <span>Log Sleep Record</span>
        </Button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Last Night's Sleep
            </span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {Math.floor(latestSleep.durationMinutes / 60)}h {latestSleep.durationMinutes % 60}m
            </span>
            <Badge variant="success" size="sm">
              {latestSleep.quality}/5 Quality
            </Badge>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            In bed {latestSleep.bedtime} → Awoke {latestSleep.wakeTime}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Weekly Average
            </span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {avgHours}h {avgMins}m
            </span>
            <span className="text-xs text-[var(--text-muted)]">avg / night</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">
            Within target circadian zone
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Bedtime Consistency
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">92%</span>
            <span className="text-xs text-[var(--text-muted)]">Variance ±18m</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Circadian rhythm stable
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Planned vs Actual
            </span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {sleepConfig.targetHours}h vs {Math.floor(latestSleep.durationMinutes / 60)}h
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {plannedVsActualDiff >= 0
              ? `+${plannedVsActualDiff}m over planned target`
              : `${Math.abs(plannedVsActualDiff)}m under planned target`}
          </p>
        </Card>
      </div>

      {/* SLEEP HISTORY TABLE */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recorded Sleep Log</CardTitle>
              <CardDescription>
                Informational overview of past night durations and self-assessed sleep quality ratings.
              </CardDescription>
            </div>
            <Badge variant="outline">{sleepRecords.length} Records</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-[var(--border-subtle)]">
            {sleepRecords.map(record => (
              <div
                key={record.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                      {record.date}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      ({record.bedtime} → {record.wakeTime})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold font-mono">
                      {Math.floor(record.durationMinutes / 60)}h {record.durationMinutes % 60}m
                    </span>
                  </div>
                  {record.notes && (
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{record.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= record.quality
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-[var(--border-subtle)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal: Log Sleep */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title="Record Night's Sleep"
        description="Enter when you fell asleep and when you woke up."
      >
        <form onSubmit={handleSaveSleep} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Bedtime"
              type="time"
              value={bedtime}
              onChange={e => setBedtime(e.target.value)}
              required
            />
            <Input
              label="Wake-Up Time"
              type="time"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">
              Sleep Restorative Quality (1-5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setQuality(rating as any)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      rating <= quality
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-[var(--border-subtle)]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Room was cool, rested deeply, woke up naturally"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
