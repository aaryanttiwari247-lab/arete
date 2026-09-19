'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Subject, StudySession, ActivityPriority } from '@/types/models';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Progress } from '@/ui/Progress';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import {
  BookOpen,
  Plus,
  Timer,
  Star,
  Clock,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function StudiesPage() {
  const { subjects, addSubject, studySessions, addStudySession } = useData();

  // Modals state
  const [newSubjectModal, setNewSubjectModal] = useState(false);
  const [logSessionModal, setLogSessionModal] = useState(false);

  // Subject Form
  const [subName, setSubName] = useState('');
  const [subTargetHours, setSubTargetHours] = useState('10');
  const [subPriority, setSubPriority] = useState<ActivityPriority>('high');
  const [subColor, setSubColor] = useState('#38bdf8');

  // Session Form
  const [sessionSubjectId, setSessionSubjectId] = useState(subjects[0]?.id || '');
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [sessionRating, setSessionRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [sessionNotes, setSessionNotes] = useState('');

  // Calculations
  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalTargetHours = subjects.reduce((acc, s) => acc + s.targetHoursPerWeek, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    addSubject({
      name: subName.trim(),
      targetHoursPerWeek: parseFloat(subTargetHours) || 8,
      priority: subPriority,
      color: subColor,
    });

    setSubName('');
    setNewSubjectModal(false);
  };

  const handleLogSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTopic.trim()) return;
    const foundSub = subjects.find(s => s.id === sessionSubjectId) || subjects[0];

    addStudySession({
      subjectId: foundSub.id,
      subjectName: foundSub.name,
      topic: sessionTopic.trim(),
      durationMinutes: parseInt(sessionDuration) || 45,
      date: new Date().toISOString().split('T')[0],
      focusRating: sessionRating,
      notes: sessionNotes.trim() || undefined,
    });

    setSessionTopic('');
    setSessionNotes('');
    setLogSessionModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Academic & Deep Study Tracking
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Track weekly targets, subjects, focus session ratings, and planned vs actual study time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link href="/focus">
            <Button variant="outline" className="gap-2">
              <Timer className="w-4 h-4 text-sky-400" />
              <span>Launch Focus Timer</span>
            </Button>
          </Link>
          <Button onClick={() => setLogSessionModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Log Study Session</span>
          </Button>
        </div>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Weekly Study Hours
            </span>
            <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">{totalStudyHours}h</span>
            <span className="text-xs text-[var(--text-muted)]">/ {totalTargetHours}h target</span>
          </div>
          <Progress
            value={parseFloat(totalStudyHours)}
            max={totalTargetHours || 1}
            size="sm"
            className="mt-3"
          />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Study Consistency
            </span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">94%</span>
            <span className="text-xs text-emerald-400 font-medium">+6% vs last week</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            Highest focus recorded between 14:00 and 16:00
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Average Focus Rating
            </span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">4.7 / 5.0</span>
            <span className="text-xs text-[var(--text-muted)]">Deep flow state</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">
            {studySessions.length} total logged sessions
          </p>
        </Card>
      </div>

      {/* SUBJECTS BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Enrolled Subjects</h3>
          <Button size="sm" variant="outline" onClick={() => setNewSubjectModal(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Subject
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map(sub => {
            const loggedMinutes = studySessions
              .filter(s => s.subjectId === sub.id)
              .reduce((acc, s) => acc + s.durationMinutes, 0);
            const loggedHours = (loggedMinutes / 60).toFixed(1);
            const percent = Math.min(
              Math.round((parseFloat(loggedHours) / sub.targetHoursPerWeek) * 100),
              100
            );

            return (
              <Card key={sub.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                  <Badge priority={sub.priority} size="sm" />
                </div>

                <h4 className="font-semibold text-base text-[var(--text-primary)]">{sub.name}</h4>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>{loggedHours}h completed</span>
                    <span>{sub.targetHoursPerWeek}h target</span>
                  </div>
                  <Progress value={percent} indicatorColor={sub.color} size="sm" />
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">{percent}% of weekly goal</span>
                  <Link href="/focus">
                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-[var(--accent-primary)]">
                      <Timer className="w-3 h-3" />
                      <span>Focus</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* RECENT STUDY SESSIONS LOG */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Study Sessions</CardTitle>
          <CardDescription>
            Chronological log of topics studied with self-assessed focus quality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-[var(--border-subtle)]">
            {studySessions.map(session => (
              <div key={session.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[var(--accent-primary)]">
                      {session.subjectName}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">• {session.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono">
                      {session.durationMinutes} min
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">{session.topic}</h4>
                  {session.notes && (
                    <p className="text-xs text-[var(--text-muted)]">{session.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 self-start sm:self-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= session.focusRating
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

      {/* Modal: New Subject */}
      <Modal
        isOpen={newSubjectModal}
        onClose={() => setNewSubjectModal(false)}
        title="Add New Subject"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <Input
            label="Subject Name"
            placeholder="e.g. Distributed Systems & Cloud Architecture"
            value={subName}
            onChange={e => setSubName(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Hours / Week"
              type="number"
              value={subTargetHours}
              onChange={e => setSubTargetHours(e.target.value)}
              required
            />
            <Select
              label="Priority"
              value={subPriority}
              onChange={e => setSubPriority(e.target.value as ActivityPriority)}
              options={[
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setNewSubjectModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Subject</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Log Session */}
      <Modal
        isOpen={logSessionModal}
        onClose={() => setLogSessionModal(false)}
        title="Log Study Session"
      >
        <form onSubmit={handleLogSession} className="space-y-4">
          <Select
            label="Subject"
            value={sessionSubjectId}
            onChange={e => setSessionSubjectId(e.target.value)}
            options={subjects.map(s => ({ value: s.id, label: s.name }))}
          />

          <Input
            label="Topic Studied"
            placeholder="e.g. Raft Consensus Election Protocol"
            value={sessionTopic}
            onChange={e => setSessionTopic(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duration (Minutes)"
              type="number"
              value={sessionDuration}
              onChange={e => setSessionDuration(e.target.value)}
              required
            />

            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-2">
                Focus Rating (1-5)
              </label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSessionRating(rating as any)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        rating <= sessionRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-[var(--border-subtle)]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Input
            label="Notes / Key Takeaways"
            placeholder="Key insights, questions, or breakthroughs"
            value={sessionNotes}
            onChange={e => setSessionNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setLogSessionModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Session</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
