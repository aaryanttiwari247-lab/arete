'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Activity, ActivityCategory } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import {
  CheckCircle2,
  Circle,
  CalendarClock,
  Edit2,
  Trash2,
  BookOpen,
  Dumbbell,
  Utensils,
  Moon,
  Droplets,
  Code2,
  BookMarked,
  UserCheck,
  Sparkles,
  Clock,
  FastForward,
} from 'lucide-react';

export const ActivityTimeline: React.FC = () => {
  const { activities, completeActivity, deleteActivity, skipActivity, rescheduleActivity, updateActivity } = useData();

  // Modals state
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [reschedulingActivity, setReschedulingActivity] = useState<Activity | null>(null);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'study':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'workout':
        return <Dumbbell className="w-4 h-4 text-amber-400" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'coding':
        return <Code2 className="w-4 h-4 text-violet-400" />;
      case 'reading':
        return <BookMarked className="w-4 h-4 text-pink-400" />;
      case 'personal':
        return <UserCheck className="w-4 h-4 text-teal-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleOpenReschedule = (act: Activity) => {
    setReschedulingActivity(act);
    setNewStartTime(act.startTime);
    setNewEndTime(act.endTime);
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (reschedulingActivity && newStartTime) {
      rescheduleActivity(reschedulingActivity.id, newStartTime, newEndTime || newStartTime);
      setReschedulingActivity(null);
    }
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingActivity(act);
    setEditTitle(act.title);
    setEditNotes(act.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity && editTitle.trim()) {
      updateActivity(editingActivity.id, {
        title: editTitle.trim(),
        notes: editNotes.trim() || undefined,
      });
      setEditingActivity(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Today&apos;s Schedule & Timeline</CardTitle>
            <CardDescription>
              Chronological breakdown of today&apos;s planned execution. Changes here do not alter your master recurring routine.
            </CardDescription>
          </div>
          <Badge variant="outline">{activities.length} Activities</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] flex items-center justify-center">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-[var(--text-primary)]">Your day is clear</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-xs">
              No scheduled activities for today yet. Create an activity or sync from your Weekly Routine.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border-subtle)]">
            {activities.map((activity, idx) => {
              const isCompleted = activity.status === 'completed';
              const isSkipped = activity.status === 'skipped';
              const isRescheduled = activity.status === 'rescheduled';

              return (
                <div key={activity.id} className="relative group">
                  {/* Timeline node icon */}
                  <button
                    onClick={() => completeActivity(activity.id)}
                    title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all bg-[var(--bg-surface)] border-2 ${
                      isCompleted
                        ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
                        : isSkipped
                        ? 'border-slate-500 text-slate-500'
                        : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Activity Card */}
                  <div
                    className={`rounded-xl border p-4 transition-all duration-200 theme-transition ${
                      isCompleted
                        ? 'bg-[var(--bg-surface-elevated)]/60 border-[var(--border-subtle)]/70 opacity-80'
                        : isSkipped
                        ? 'bg-[var(--bg-surface-elevated)]/40 border-dashed border-[var(--border-subtle)] opacity-50'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex-shrink-0">
                          {getCategoryIcon(activity.category)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
                              {activity.startTime} {activity.endTime && `– ${activity.endTime}`}
                            </span>
                            <Badge category={activity.category} size="sm" />
                            <Badge priority={activity.priority} size="sm" />
                            {isSkipped && <Badge variant="warning" size="sm">Skipped</Badge>}
                            {isRescheduled && <Badge variant="info" size="sm">Rescheduled</Badge>}
                          </div>

                          <h4
                            className={`text-sm sm:text-base font-semibold mt-0.5 text-[var(--text-primary)] ${
                              isCompleted ? 'line-through text-[var(--text-muted)]' : ''
                            }`}
                          >
                            {activity.title}
                          </h4>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => completeActivity(activity.id)}
                          className="h-8 px-2 text-xs"
                          title={isCompleted ? 'Mark incomplete' : 'Complete'}
                        >
                          {isCompleted ? 'Undo' : 'Done'}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenReschedule(activity)}
                          className="h-8 px-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          title="Reschedule activity"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(activity)}
                          className="h-8 px-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          title="Edit activity"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => skipActivity(activity.id)}
                          className="h-8 px-2 text-xs text-[var(--text-muted)] hover:text-amber-400"
                          title="Skip activity for today"
                        >
                          <FastForward className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteActivity(activity.id)}
                          className="h-8 px-2 text-xs text-[var(--text-muted)] hover:text-rose-400"
                          title="Delete from today's schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {activity.notes && (
                      <p className="mt-2 text-xs text-[var(--text-secondary)] pl-11 leading-relaxed">
                        {activity.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!reschedulingActivity}
        onClose={() => setReschedulingActivity(null)}
        title="Reschedule Activity for Today"
        description="Adjust the start and end time for this activity. Your master weekly routine is unchanged."
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="New Start Time"
              type="time"
              value={newStartTime}
              onChange={e => setNewStartTime(e.target.value)}
              required
            />
            <Input
              label="New End Time"
              type="time"
              value={newEndTime}
              onChange={e => setNewEndTime(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setReschedulingActivity(null)}>
              Cancel
            </Button>
            <Button type="submit">Update Time</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Activity Modal */}
      <Modal
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        title="Edit Activity Details"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Activity Title"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            required
          />
          <Input
            label="Notes"
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setEditingActivity(null)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
