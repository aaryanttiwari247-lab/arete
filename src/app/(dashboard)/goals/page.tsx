'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Goal, GoalMilestone } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Progress } from '@/ui/Progress';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trophy,
} from 'lucide-react';

export default function GoalsPage() {
  const { goals, toggleGoalMilestone, addGoal } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [category, setCategory] = useState('Engineering & Career');
  const [milestonesText, setMilestonesText] = useState('');

  const avgProgress = Math.round(
    goals.reduce((acc, g) => acc + g.progress, 0) / (goals.length || 1)
  );

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones: GoalMilestone[] = milestonesText
      .split(',')
      .map((m, idx) => ({
        id: `ms_${Date.now()}_${idx}`,
        title: m.trim(),
        completed: false,
      }))
      .filter(m => Boolean(m.title));

    addGoal({
      title: title.trim(),
      description: description.trim(),
      deadline,
      category,
      milestones,
    });

    setTitle('');
    setDescription('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Long-Term Objectives & Milestones
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Break multi-month visions into tangible progressive checkpoints.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-2 self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </Button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Active Objectives
            </span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{goals.length}</span>
            <span className="text-xs text-[var(--text-muted)]">goals in flight</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            High strategic alignment
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Average Progress
            </span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{avgProgress}%</span>
            <span className="text-xs text-emerald-400 font-medium">On schedule</span>
          </div>
          <Progress value={avgProgress} size="sm" className="mt-3" />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Total Milestones Done
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {goals.reduce((acc, g) => acc + g.milestones.filter(m => m.completed).length, 0)}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              / {goals.reduce((acc, g) => acc + g.milestones.length, 0)} milestones
            </span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">
            Steady forward momentum
          </p>
        </Card>
      </div>

      {/* GOALS CARDS */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <Card className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <Target className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
            <h4 className="text-base font-semibold text-[var(--text-primary)]">No goals configured yet</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              Define your high-level objectives and progressive milestones across career, wellness, skills, and personal milestones.
            </p>
            <Button size="sm" onClick={() => setModalOpen(true)}>Create Your First Goal</Button>
          </Card>
        ) : (
          goals.map(goal => (
          <Card key={goal.id} className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">
                    {goal.category}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Target: {goal.deadline}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{goal.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
                  {goal.description}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-3xl font-black text-[var(--text-primary)]">{goal.progress}%</span>
                <span className="block text-[10px] uppercase font-mono text-[var(--text-muted)]">
                  Completed
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <Progress value={goal.progress} size="md" />
            </div>

            {/* Interactive Milestones Checklist */}
            <div className="space-y-2.5 pt-2">
              <h5 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Milestones & Checkpoints (Click to toggle)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goal.milestones.map(milestone => (
                  <button
                    key={milestone.id}
                    type="button"
                    onClick={() => toggleGoalMilestone(goal.id, milestone.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all select-none ${
                      milestone.completed
                        ? 'bg-[var(--accent-subtle)]/30 border-[var(--accent-primary)]/30 text-[var(--text-primary)]'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        milestone.completed ? 'line-through text-[var(--text-muted)]' : ''
                      }`}
                    >
                      {milestone.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )))}
      </div>

      {/* Modal: New Goal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Long-Term Goal"
        description="Establish an overarching milestone with progressive checkpoints."
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g. Master Full Stack Cloud Architecture"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Description"
            placeholder="Why is this important and what does success look like?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Deadline"
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              required
            />
            <Input
              label="Category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            />
          </div>

          <Input
            label="Milestones (comma-separated)"
            placeholder="Phase 1, Phase 2, Phase 3"
            value={milestonesText}
            onChange={e => setMilestonesText(e.target.value)}
            helperText="Separate each milestone with a comma."
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
