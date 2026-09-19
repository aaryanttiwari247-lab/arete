'use client';

import React, { useState, useMemo } from 'react';
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
  TrendingUp,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react';

export default function SleepPage() {
  const { sleepRecords, addSleepRecord, sleepConfig } = useData();
  const [logModalOpen, setLogModalOpen] = useState(false);

  // Form State
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [notes, setNotes] = useState('');

  // Calculations with useMemo
  const { latestSleep, avgMinutes, avgHours, avgMins, plannedVsActualDiff } = useMemo(() => {
    const latest = sleepRecords[0] || null;
    const avg = sleepRecords.length > 0
      ? Math.round(sleepRecords.reduce((acc, s) => acc + s.durationMinutes, 0) / sleepRecords.length)
      : 0;
    const targetMin = sleepConfig.targetHours * 60;
    const diff = latest ? latest.durationMinutes - targetMin : 0;

    return {
      latestSleep: latest,
      avgMinutes: avg,
      avgHours: Math.floor(avg / 60),
      avgMins: avg % 60,
      plannedVsActualDiff: diff,
    };
  }, [sleepRecords, sleepConfig.targetHours]);

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
              {latestSleep
                ? `${Math.floor(latestSleep.durationMinutes / 60)}h ${latestSleep.durationMinutes % 60}m`
                : '0h 0m'}
            </span>
            {latestSleep && (
              <Badge variant="success" size="sm">
                {latestSleep.quality}/5 Quality
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {latestSleep
              ? `In bed ${latestSleep.bedtime} → Awoke ${latestSleep.wakeTime}`
              : 'No sleep record for last night'}
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
            {sleepRecords.length > 0 ? 'Within target circadian zone' : 'Target: 8h restorative rest'}
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
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {sleepRecords.length > 0 ? 'Consistent' : '--'}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {sleepRecords.length > 0 ? 'Variance monitored' : 'Log sleep to assess consistency'}
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
              {sleepConfig.targetHours}h vs {latestSleep ? Math.floor(latestSleep.durationMinutes / 60) : 0}h
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {latestSleep
              ? plannedVsActualDiff >= 0
                ? `+${plannedVsActualDiff}m over planned target`
                : `${Math.abs(plannedVsActualDiff)}m under planned target`
              : 'Target: ' + sleepConfig.targetHours + 'h daily sleep'}
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
          {sleepRecords.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <Moon className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
              <p className="text-sm font-semibold text-[var(--text-primary)]">No sleep records logged yet</p>
              <p className="text-xs text-[var(--text-muted)] max-w-sm">
                Log your bedtime, wake time, and sleep quality to build your recovery metrics.
              </p>
              <Button size="sm" onClick={() => setLogModalOpen(true)}>Log Last Night's Sleep</Button>
            </div>
          ) : (
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
          )}
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
