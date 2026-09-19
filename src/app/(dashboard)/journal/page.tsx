'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Modal } from '@/ui/Modal';
import { Input } from '@/ui/Input';
import { BookMarked, Plus, Calendar, Tag } from 'lucide-react';

export default function JournalPage() {
  const { journalEntries, addJournalEntry } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      content: content.trim(),
      tags,
    });

    setTitle('');
    setContent('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Personal Journal & Reflections
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            A quiet space to record free-form thoughts, creative ideas, and cognitive breakthroughs.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-2 self-start sm:self-auto shadow-md">
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </Button>
      </div>

      {/* ENTRIES LIST */}
      <div className="space-y-4">
        {journalEntries.length === 0 ? (
          <Card className="p-10 text-center flex flex-col items-center justify-center">
            <BookMarked className="w-12 h-12 text-[var(--text-muted)] opacity-50 mb-3" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">No journal entries yet</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mb-4">
              Capture your insights, daily reflections, and thoughts here. All entries stay organized and private.
            </p>
            <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Write First Entry</span>
            </Button>
          </Card>
        ) : (
          journalEntries.map(entry => (
            <Card key={entry.id} className="p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{entry.title}</h3>
                <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {entry.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>

              {entry.tags.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  <Tag className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Modal: New Journal Entry */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Journal Entry"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateEntry} className="space-y-4">
          <Input
            label="Entry Title"
            placeholder="e.g. Observations on Attention and Energy"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] block mb-1.5">
              Journal Content
            </label>
            <textarea
              rows={6}
              placeholder="Write freely..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
              required
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            placeholder="Productivity, Health, Reflection"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish to Journal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
