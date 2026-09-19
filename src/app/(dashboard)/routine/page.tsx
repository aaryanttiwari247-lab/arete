'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { RoutineItem, ActivityCategory, ActivityPriority } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import {
  CalendarDays,
  Plus,
  Clock,
  Trash2,
  Edit2,
  RefreshCw,
  Sparkles,
  Info,
  BookOpen,
  Dumbbell,
  Moon,
  Utensils,
  Droplets,
  Code2,
  BookMarked,
  UserCheck,
} from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat' },
  { id: 0, name: 'Sunday', short: 'Sun' },
];

export default function RoutinePage() {
  const { routineItems, addRoutineItem, updateRoutineItem, deleteRoutineItem } = useData();
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday default
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('study');
  const [priority, setPriority] = useState<ActivityPriority>('medium');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [repeatFrequency, setRepeatFrequency] = useState<'daily' | 'weekly' | 'biweekly'>('weekly');
  const [reminderMinutes, setReminderMinutes] = useState('10');
  const [notes, setNotes] = useState('');

  const currentDayItems = routineItems.filter(item =>
    item.daysOfWeek.includes(selectedDay)
  );

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

  const handleSaveRoutineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedDays.length === 0) return;

    if (editingItem) {
      updateRoutineItem(editingItem.id, {
        title: title.trim(),
        category,
        priority,
        startTime,
        endTime,
        daysOfWeek: selectedDays,
        repeatFrequency,
        reminderMinutes: parseInt(reminderMinutes) || undefined,
        notes: notes.trim() || undefined,
      });
      setEditingItem(null);
    } else {
      addRoutineItem({
        title: title.trim(),
        category,
        priority,
        startTime,
        endTime,
        daysOfWeek: selectedDays,
        repeatFrequency,
        reminderMinutes: parseInt(reminderMinutes) || undefined,
        notes: notes.trim() || undefined,
        active: true,
      });
    }

    setTitle('');
    setNotes('');
    setAddModalOpen(false);
  };

  const handleOpenEdit = (item: RoutineItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setPriority(item.priority);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setSelectedDays(item.daysOfWeek);
    setRepeatFrequency(item.repeatFrequency);
    setReminderMinutes(item.reminderMinutes?.toString() || '10');
    setNotes(item.notes || '');
    setAddModalOpen(true);
  };

  const toggleDaySelection = (dayNum: number) => {
    setSelectedDays(prev =>
      prev.includes(dayNum) ? prev.filter(d => d !== dayNum) : [...prev, dayNum]
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Weekly Routine Builder
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Define your recurring weekly schedule template. Changes here generate your daily schedules without altering today's modified tasks.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingItem(null);
            setTitle('');
            setNotes('');
            setAddModalOpen(true);
          }}
          className="gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recurring Activity</span>
        </Button>
      </div>

      {/* Architecture Separation Notice */}
      <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-start gap-3 text-xs text-[var(--text-secondary)]">
        <Info className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[var(--text-primary)]">
            Template Isolation Architecture
          </p>
          <p className="leading-relaxed">
            DayTrack maintains a strict separation between your <strong>Weekly Routine Template</strong> and <strong>Today's Actual Schedule</strong>. When you reschedule or complete an activity on the Dashboard, your recurring template remains intact.
          </p>
        </div>
      </div>

      {/* 7-DAY NAVIGATION SELECTOR */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
        {DAYS_OF_WEEK.map(day => {
          const isSelected = selectedDay === day.id;
          const dayCount = routineItems.filter(i => i.daysOfWeek.includes(day.id)).length;

          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex flex-col items-center py-2.5 sm:py-3 px-1 rounded-xl transition-all select-none ${
                isSelected
                  ? 'bg-[var(--accent-primary)] text-white shadow-md font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]'
              }`}
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-wider">{day.short}</span>
              <span className="hidden sm:inline text-xs font-bold mt-0.5">{day.name}</span>
              <span
                className={`mt-1 text-[10px] px-1.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {dayCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* DAY TIMELINE / LIST VIEW */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {DAYS_OF_WEEK.find(d => d.id === selectedDay)?.name} Routine Template
              </CardTitle>
              <CardDescription>
                Recurring activities active on {DAYS_OF_WEEK.find(d => d.id === selectedDay)?.name}s.
              </CardDescription>
            </div>
            <Badge variant="outline">{currentDayItems.length} Scheduled</Badge>
          </div>
        </CardHeader>

        <CardContent>
          {currentDayItems.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <CalendarDays className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                No recurring activities for this day
              </p>
              <p className="text-xs text-[var(--text-muted)] max-w-sm">
                Add recurring habits, study blocks, workouts, or recovery periods to keep this day structured.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedDays([selectedDay]);
                  setAddModalOpen(true);
                }}
              >
                Create Activity for {DAYS_OF_WEEK.find(d => d.id === selectedDay)?.name}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentDayItems.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex-shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
                          {item.startTime} – {item.endTime}
                        </span>
                        <Badge category={item.category} size="sm" />
                        <Badge priority={item.priority} size="sm" />
                        <span className="text-[10px] text-[var(--text-muted)] capitalize">
                          {item.repeatFrequency}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] mt-0.5">
                        {item.title}
                      </h4>
                      {item.notes && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">{item.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(item)}
                      className="h-8 px-2 text-xs"
                      title="Edit recurring item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteRoutineItem(item.id)}
                      className="h-8 px-2 text-xs text-rose-400 hover:text-rose-500"
                      title="Delete recurring item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Recurring Activity Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={editingItem ? 'Edit Recurring Routine Item' : 'Add Recurring Activity'}
        description="This activity will recur on your chosen days every week."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveRoutineItem} className="space-y-4">
          <Input
            label="Activity Title"
            placeholder="e.g. Deep Study Block or Gym Upper Body"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Category"
              value={category}
              onChange={e => setCategory(e.target.value as ActivityCategory)}
              options={[
                { value: 'study', label: 'Study' },
                { value: 'workout', label: 'Workout' },
                { value: 'coding', label: 'Coding' },
                { value: 'sleep', label: 'Sleep' },
                { value: 'meal', label: 'Meal' },
                { value: 'water', label: 'Water' },
                { value: 'reading', label: 'Reading' },
                { value: 'personal', label: 'Personal' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={e => setPriority(e.target.value as ActivityPriority)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              required
            />
          </div>

          {/* Days of Week Selection */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
              Active Days of the Week
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map(d => {
                const isDaySelected = selectedDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDaySelection(d.id)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                      isDaySelected
                        ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {d.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Repeat Frequency"
              value={repeatFrequency}
              onChange={e => setRepeatFrequency(e.target.value as any)}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'biweekly', label: 'Bi-Weekly' },
              ]}
            />
            <Input
              label="Reminder (Minutes before)"
              type="number"
              value={reminderMinutes}
              onChange={e => setReminderMinutes(e.target.value)}
            />
          </div>

          <Input
            label="Notes / Instructions (Optional)"
            placeholder="Key targets or materials"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingItem ? 'Update Routine Item' : 'Save to Template'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
