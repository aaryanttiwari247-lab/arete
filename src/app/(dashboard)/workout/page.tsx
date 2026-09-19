'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { WorkoutSession, WorkoutExercise, ExerciseSet } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import { Tabs } from '@/ui/Tabs';
import {
  Dumbbell,
  Plus,
  Trash2,
  Clock,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function WorkoutPage() {
  const { workoutSessions, addWorkoutSession } = useData();
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [activeTrackingMode, setActiveTrackingMode] = useState<'simple' | 'advanced'>('simple');

  // Form states
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  const totalWorkoutMinutes = useMemo(() => {
    return workoutSessions.reduce((acc, w) => acc + w.durationMinutes, 0);
  }, [workoutSessions]);

  const handleAddExercise = () => {
    const newEx: WorkoutExercise = {
      id: `ex_${Date.now()}`,
      name: 'New Exercise',
      sets: [{ setNumber: 1, reps: 10, weightKg: 20, completed: false }],
    };
    setExercises(prev => [...prev, newEx]);
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises(prev =>
      prev.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const nextSetNum = ex.sets.length + 1;
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              setNumber: nextSetNum,
              reps: lastSet ? lastSet.reps : 10,
              weightKg: lastSet ? lastSet.weightKg : 20,
              completed: false,
            },
          ],
        };
      })
    );
  };

  const handleSetChange = (
    exerciseId: string,
    setIndex: number,
    field: keyof ExerciseSet,
    val: string | number | boolean | undefined
  ) => {
    setExercises(prev =>
      prev.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const newSets = [...ex.sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: val };
        return { ...ex, sets: newSets };
      })
    );
  };

  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addWorkoutSession({
      title: title.trim(),
      type: activeTrackingMode,
      durationMinutes: parseInt(durationMinutes) || 45,
      date: new Date().toISOString().split('T')[0],
      completed: true,
      notes: notes.trim() || undefined,
      exercises: activeTrackingMode === 'advanced' ? exercises : undefined,
    });

    setTitle('');
    setNotes('');
    setLogModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Workout & Fitness Tracking
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Log your functional strength and mobility sessions. Switch seamlessly between simple and advanced set-by-set tracking.
          </p>
        </div>

        <Button onClick={() => setLogModalOpen(true)} className="gap-2 self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" />
          <span>Log Workout</span>
        </Button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Sessions Completed
            </span>
            <Dumbbell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {workoutSessions.length}
            </span>
            <span className="text-xs text-[var(--text-muted)]">this week</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">
            Progressive overload recorded
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Total Active Time
            </span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {totalWorkoutMinutes}m
            </span>
            <span className="text-xs text-[var(--text-muted)]">total duration</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Average {(totalWorkoutMinutes / (workoutSessions.length || 1)).toFixed(0)} min / session
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Weekly Consistency
            </span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {workoutSessions.length} Sessions
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {workoutSessions.length > 0 ? 'Consistent training recorded' : 'Log workouts to build fitness routines'}
          </p>
        </Card>
      </div>

      {/* SESSIONS LIST */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Workout History</h3>

        {workoutSessions.length === 0 ? (
          <Card className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <Dumbbell className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
            <h4 className="text-base font-semibold text-[var(--text-primary)]">No workouts logged yet</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              Log your training sessions, split routines, sets, and weights to measure progressive overload.
            </p>
            <Button size="sm" onClick={() => setLogModalOpen(true)}>Log Your First Workout</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {workoutSessions.map(session => (
              <Card key={session.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base text-[var(--text-primary)]">
                        {session.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
                        <span>{session.date}</span>
                        <span>•</span>
                        <span>{session.durationMinutes} min</span>
                        <span>•</span>
                        <Badge variant={session.type === 'advanced' ? 'info' : 'outline'} size="sm">
                          {session.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-center text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </div>
                </div>

                {session.notes && (
                  <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
                    {session.notes}
                  </p>
                )}

                {/* Advanced Sets breakdown if present */}
                {session.exercises && session.exercises.length > 0 && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-[var(--border-subtle)]">
                    <h5 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Exercises & Sets Recorded
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {session.exercises.map(ex => (
                        <div
                          key={ex.id}
                          className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs space-y-2"
                        >
                          <div className="font-semibold text-[var(--text-primary)]">{ex.name}</div>
                          <div className="space-y-1">
                            {ex.sets.map(s => (
                              <div
                                key={s.setNumber}
                                className="flex items-center justify-between text-[var(--text-muted)] font-mono"
                              >
                                <span>Set {s.setNumber}: {s.reps} reps</span>
                                {s.weightKg && <span>{s.weightKg} kg</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Log Workout */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title="Log Workout Session"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveWorkout} className="space-y-4">
          <Tabs
            activeTab={activeTrackingMode}
            onChange={t => setActiveTrackingMode(t as 'simple' | 'advanced')}
            tabs={[
              { id: 'simple', label: 'Simple Mode (Fast)' },
              { id: 'advanced', label: 'Advanced Mode (Sets & Reps)' },
            ]}
          />

          <Input
            label="Workout Title / Type"
            placeholder="e.g. Upper Body Push & Mobility"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Duration (Minutes)"
            type="number"
            value={durationMinutes}
            onChange={e => setDurationMinutes(e.target.value)}
            required
          />

          {/* Advanced Mode: Exercise & Sets Builder */}
          {activeTrackingMode === 'advanced' && (
            <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Exercises & Sets
                </span>
                <Button type="button" size="sm" variant="outline" onClick={handleAddExercise}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Exercise
                </Button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {exercises.map((ex, exIdx) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        value={ex.name}
                        onChange={e => {
                          const val = e.target.value;
                          setExercises(prev =>
                            prev.map(item => (item.id === ex.id ? { ...item, name: val } : item))
                          );
                        }}
                        className="text-xs font-semibold"
                        placeholder="Exercise name"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddSet(ex.id)}
                        className="text-xs whitespace-nowrap"
                      >
                        + Set
                      </Button>
                    </div>

                    <div className="space-y-1.5 pl-1">
                      {ex.sets.map((s, sIdx) => (
                        <div key={s.setNumber} className="flex items-center gap-2 text-xs">
                          <span className="w-12 text-[var(--text-muted)] font-mono">
                            Set {s.setNumber}
                          </span>
                          <input
                            type="number"
                            placeholder="Reps"
                            value={s.reps}
                            onChange={e =>
                              handleSetChange(ex.id, sIdx, 'reps', parseInt(e.target.value) || 0)
                            }
                            className="w-16 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)]"
                          />
                          <span className="text-[var(--text-muted)]">reps @</span>
                          <input
                            type="number"
                            placeholder="kg"
                            value={s.weightKg || ''}
                            onChange={e =>
                              handleSetChange(
                                ex.id,
                                sIdx,
                                'weightKg',
                                parseFloat(e.target.value) || undefined
                              )
                            }
                            className="w-16 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)]"
                          />
                          <span className="text-[var(--text-muted)]">kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Input
            label="Notes (Optional)"
            placeholder="Felt strong, clean form, energy rating"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Workout</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
