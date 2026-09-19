'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Activity, ActivityCategory, ActivityPriority } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Trash2,
  XCircle,
  BookOpen,
  Dumbbell,
  Moon,
  Utensils,
  Droplets,
  Code2,
  BookMarked,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function ActivitiesPage() {
  const { activities, addActivity, updateActivity, deleteActivity, completeActivity, skipActivity } = useData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'skipped'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority' | 'title'>('time');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ActivityCategory>('study');
  const [formPriority, setFormPriority] = useState<ActivityPriority>('medium');
  const [formStartTime, setFormStartTime] = useState('14:00');
  const [formEndTime, setFormEndTime] = useState('15:00');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');

  // Filter & Search Logic
  const filteredActivities = activities
    .filter(a => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesNotes = a.notes ? a.notes.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesNotes) return false;
      }

      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'time') return a.startTime.localeCompare(b.startTime);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'priority') {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

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

  const handleOpenAdd = () => {
    setEditingActivity(null);
    setFormTitle('');
    setFormCategory('study');
    setFormPriority('medium');
    setFormStartTime('14:00');
    setFormEndTime('15:00');
    setFormNotes('');
    setAddModalOpen(true);
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingActivity(act);
    setFormTitle(act.title);
    setFormCategory(act.category);
    setFormPriority(act.priority);
    setFormStartTime(act.startTime);
    setFormEndTime(act.endTime);
    setFormDate(act.date);
    setFormNotes(act.notes || '');
    setAddModalOpen(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingActivity) {
      updateActivity(editingActivity.id, {
        title: formTitle.trim(),
        category: formCategory,
        priority: formPriority,
        startTime: formStartTime,
        endTime: formEndTime,
        date: formDate,
        notes: formNotes.trim() || undefined,
      });
    } else {
      addActivity({
        title: formTitle.trim(),
        category: formCategory,
        priority: formPriority,
        status: 'pending',
        startTime: formStartTime,
        endTime: formEndTime,
        date: formDate,
        durationMinutes: 60,
        notes: formNotes.trim() || undefined,
      });
    }

    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Activities Management
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Search, filter, organize, and track execution across all scheduled activities.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" />
          <span>New Activity</span>
        </Button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              placeholder="Search activities by title or notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </select>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="all">All Categories</option>
              <option value="study">Study</option>
              <option value="coding">Coding</option>
              <option value="workout">Workout</option>
              <option value="meal">Meal</option>
              <option value="water">Water</option>
              <option value="sleep">Sleep</option>
              <option value="reading">Reading</option>
              <option value="personal">Personal</option>
            </select>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="time">Sort by Time</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ACTIVITIES LIST */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Records</CardTitle>
            <Badge variant="outline">{filteredActivities.length} Matches</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] flex items-center justify-center">
                <Filter className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)]">
                No matching activities found
              </h4>
              <p className="text-xs text-[var(--text-muted)] max-w-xs">
                Try adjusting your search query or filter settings, or add a new activity.
              </p>
              <Button size="sm" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map(activity => {
                const isCompleted = activity.status === 'completed';
                const isSkipped = activity.status === 'skipped';

                return (
                  <div
                    key={activity.id}
                    className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <button
                        onClick={() => completeActivity(activity.id)}
                        className={`mt-0.5 sm:mt-0 p-1 rounded-full transition-colors ${
                          isCompleted
                            ? 'text-emerald-500'
                            : isSkipped
                            ? 'text-slate-500'
                            : 'text-[var(--text-muted)] hover:text-[var(--accent-primary)]'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex-shrink-0">
                        {getCategoryIcon(activity.category)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
                            {activity.startTime} – {activity.endTime}
                          </span>
                          <Badge category={activity.category} size="sm" />
                          <Badge priority={activity.priority} size="sm" />
                          {isSkipped && <Badge variant="warning" size="sm">Skipped</Badge>}
                        </div>

                        <h4
                          className={`text-sm sm:text-base font-semibold mt-0.5 text-[var(--text-primary)] ${
                            isCompleted ? 'line-through text-[var(--text-muted)]' : ''
                          }`}
                        >
                          {activity.title}
                        </h4>

                        {activity.notes && (
                          <p className="text-xs text-[var(--text-muted)] mt-1">{activity.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(activity)}
                        className="h-8 px-2 text-xs"
                        title="Edit Activity"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => skipActivity(activity.id)}
                        className="h-8 px-2 text-xs text-amber-400 hover:text-amber-500"
                        title="Skip Activity"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteActivity(activity.id)}
                        className="h-8 px-2 text-xs text-rose-400 hover:text-rose-500"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Activity Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={editingActivity ? 'Edit Activity' : 'Create New Activity'}
        description="Schedule a specific activity for your day."
        maxWidth="md"
      >
        <form onSubmit={handleSaveActivity} className="space-y-4">
          <Input
            label="Activity Title"
            placeholder="e.g. Distributed Algorithms Review"
            value={formTitle}
            onChange={e => setFormTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={formCategory}
              onChange={e => setFormCategory(e.target.value as ActivityCategory)}
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
              value={formPriority}
              onChange={e => setFormPriority(e.target.value as ActivityPriority)}
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
              value={formStartTime}
              onChange={e => setFormStartTime(e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={formEndTime}
              onChange={e => setFormEndTime(e.target.value)}
              required
            />
          </div>

          <Input
            label="Date"
            type="date"
            value={formDate}
            onChange={e => setFormDate(e.target.value)}
            required
          />

          <Input
            label="Notes (Optional)"
            placeholder="Objectives or reminders"
            value={formNotes}
            onChange={e => setFormNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingActivity ? 'Save Changes' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
