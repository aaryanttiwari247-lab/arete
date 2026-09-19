'use client';

import React, { useState } from 'react';
import { Modal } from '@/ui/Modal';
import { Tabs } from '@/ui/Tabs';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { useData } from '@/context/DataContext';
import { ActivityCategory, ActivityPriority, MealType } from '@/types/models';
import { CheckSquare, Droplets, Utensils, BookOpen } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'water' | 'meal' | 'study'>('activity');
  const { addActivity, addWaterLog, addMeal, subjects, addStudySession } = useData();

  // Activity form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('study');
  const [priority, setPriority] = useState<ActivityPriority>('medium');
  const [startTime, setStartTime] = useState('15:00');
  const [endTime, setEndTime] = useState('16:00');
  const [notes, setNotes] = useState('');

  // Meal form state
  const [mealType, setMealType] = useState<MealType>('snack');
  const [mealTime, setMealTime] = useState('16:00');
  const [foodsInput, setFoodsInput] = useState('');
  const [mealNotes, setMealNotes] = useState('');

  // Study form state
  const [studySubjectId, setStudySubjectId] = useState(subjects[0]?.id || '');
  const [studyTopic, setStudyTopic] = useState('');
  const [studyDuration, setStudyDuration] = useState('45');

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addActivity({
      title: title.trim(),
      category,
      priority,
      status: 'pending',
      startTime,
      endTime,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: 60,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  const handleQuickWater = (ml: number) => {
    addWaterLog(ml);
    onClose();
  };

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
      notes: mealNotes.trim() || undefined,
    });

    setFoodsInput('');
    setMealNotes('');
    onClose();
  };

  const handleCreateStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyTopic.trim()) return;
    const selectedSub = subjects.find(s => s.id === studySubjectId) || subjects[0];

    addStudySession({
      subjectId: selectedSub ? selectedSub.id : 'sub_custom',
      subjectName: selectedSub ? selectedSub.name : 'General Study',
      topic: studyTopic.trim(),
      durationMinutes: parseInt(studyDuration) || 45,
      date: new Date().toISOString().split('T')[0],
      focusRating: 4,
      notes: 'Logged via Quick Add',
    });

    setStudyTopic('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Log & Plan" maxWidth="md">
      <div className="space-y-5">
        <Tabs
          activeTab={activeTab}
          onChange={t => setActiveTab(t as any)}
          tabs={[
            { id: 'activity', label: 'Activity', icon: <CheckSquare className="w-3.5 h-3.5" /> },
            { id: 'water', label: 'Water', icon: <Droplets className="w-3.5 h-3.5" /> },
            { id: 'meal', label: 'Meal', icon: <Utensils className="w-3.5 h-3.5" /> },
            { id: 'study', label: 'Study', icon: <BookOpen className="w-3.5 h-3.5" /> },
          ]}
        />

        {/* 1. ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <form onSubmit={handleCreateActivity} className="space-y-4">
            <Input
              label="Activity Title"
              placeholder="e.g. Distributed Systems Lab"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Category"
                value={category}
                onChange={e => setCategory(e.target.value as ActivityCategory)}
                options={[
                  { value: 'study', label: 'Study' },
                  { value: 'coding', label: 'Coding' },
                  { value: 'workout', label: 'Workout' },
                  { value: 'meal', label: 'Meal' },
                  { value: 'water', label: 'Water' },
                  { value: 'sleep', label: 'Sleep' },
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
              />
              <Input
                label="End Time"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>

            <Input
              label="Notes (Optional)"
              placeholder="Key objectives or details"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add to Schedule</Button>
            </div>
          </form>
        )}

        {/* 2. WATER TAB */}
        {activeTab === 'water' && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-[var(--text-muted)]">
              Quickly record hydration. Every entry tracks toward your daily target.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="py-6 flex flex-col items-center gap-1.5 border-[var(--border-subtle)] hover:border-cyan-400"
                onClick={() => handleQuickWater(250)}
              >
                <Droplets className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-semibold">+250 ml</span>
                <span className="text-[10px] text-[var(--text-muted)]">Standard Glass</span>
              </Button>

              <Button
                variant="outline"
                className="py-6 flex flex-col items-center gap-1.5 border-[var(--border-subtle)] hover:border-cyan-400"
                onClick={() => handleQuickWater(500)}
              >
                <Droplets className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-semibold">+500 ml</span>
                <span className="text-[10px] text-[var(--text-muted)]">Hydration Bottle</span>
              </Button>

              <Button
                variant="outline"
                className="py-6 flex flex-col items-center gap-1.5 border-[var(--border-subtle)] hover:border-cyan-400"
                onClick={() => handleQuickWater(750)}
              >
                <Droplets className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-semibold">+750 ml</span>
                <span className="text-[10px] text-[var(--text-muted)]">Large Sports Flask</span>
              </Button>

              <Button
                variant="outline"
                className="py-6 flex flex-col items-center gap-1.5 border-[var(--border-subtle)] hover:border-cyan-400"
                onClick={() => handleQuickWater(1000)}
              >
                <Droplets className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-semibold">+1.0 Liter</span>
                <span className="text-[10px] text-[var(--text-muted)]">Full Pitcher</span>
              </Button>
            </div>
          </div>
        )}

        {/* 3. MEAL TAB */}
        {activeTab === 'meal' && (
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
              />
            </div>

            <Input
              label="Foods Consumed (comma-separated)"
              placeholder="e.g. Scrambled eggs, Toast, Apple, Almonds"
              value={foodsInput}
              onChange={e => setFoodsInput(e.target.value)}
              helperText="No forced calorie counting — focus on whole foods and nourishment."
              required
            />

            <Input
              label="Notes (Optional)"
              placeholder="e.g. Felt energized afterward"
              value={mealNotes}
              onChange={e => setMealNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Log Meal</Button>
            </div>
          </form>
        )}

        {/* 4. STUDY TAB */}
        {activeTab === 'study' && (
          <form onSubmit={handleCreateStudy} className="space-y-4">
            <Select
              label="Subject"
              value={studySubjectId}
              onChange={e => setStudySubjectId(e.target.value)}
              options={subjects.map(s => ({ value: s.id, label: s.name }))}
            />

            <Input
              label="Topic Studied"
              placeholder="e.g. Tree Traversal Algorithms"
              value={studyTopic}
              onChange={e => setStudyTopic(e.target.value)}
              required
            />

            <Input
              label="Duration (minutes)"
              type="number"
              min="5"
              max="300"
              value={studyDuration}
              onChange={e => setStudyDuration(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Record Study Session</Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
