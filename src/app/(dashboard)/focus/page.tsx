'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { Select } from '@/ui/Select';
import { Input } from '@/ui/Input';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Coffee,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function FocusTimerPage() {
  const { subjects, addStudySession } = useData();

  // Mode: 25-5, 50-10, custom
  const [timerMode, setTimerMode] = useState<'25-5' | '50-10' | 'custom'>('25-5');
  const [isBreak, setIsBreak] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('30');

  // Work & Break durations in seconds
  const getInitialSeconds = () => {
    if (timerMode === '25-5') return (isBreak ? 5 : 25) * 60;
    if (timerMode === '50-10') return (isBreak ? 10 : 50) * 60;
    return (parseInt(customMinutes) || 30) * 60;
  };

  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Association with subject
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [topic, setTopic] = useState('Deep Architecture & Systems Design');

  useEffect(() => {
    const s = getInitialSeconds();
    setTotalSeconds(s);
    setSecondsRemaining(s);
    setIsRunning(false);
    setSessionCompleted(false);
  }, [timerMode, isBreak]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      setSessionCompleted(true);
      handleAutoSaveSession();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const handleAutoSaveSession = () => {
    if (!isBreak) {
      const selectedSub = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
      const durationMins = Math.round(totalSeconds / 60);

      addStudySession({
        subjectId: selectedSub ? selectedSub.id : 'sub_custom',
        subjectName: selectedSub ? selectedSub.name : 'Deep Focus Block',
        topic: topic.trim() || 'Deep Focus Session',
        durationMinutes: durationMins,
        date: new Date().toISOString().split('T')[0],
        focusRating: 5,
        notes: `Focus timer completed in ${timerMode} mode`,
      });
    }
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
    setSessionCompleted(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const s = getInitialSeconds();
    setSecondsRemaining(s);
    setSessionCompleted(false);
  };

  const handleSwitchToBreak = () => {
    setIsBreak(!isBreak);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl mx-auto select-none">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Flow State Focus Timer
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Timed interval sessions with automatic study log integration and ambient visual cues.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => { setTimerMode('25-5'); setIsBreak(false); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            timerMode === '25-5'
              ? 'bg-[var(--accent-primary)] text-white shadow-md'
              : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          25 min / 5 min Break
        </button>

        <button
          onClick={() => { setTimerMode('50-10'); setIsBreak(false); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            timerMode === '50-10'
              ? 'bg-[var(--accent-primary)] text-white shadow-md'
              : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          50 min / 10 min Break
        </button>

        <button
          onClick={() => { setTimerMode('custom'); setIsBreak(false); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            timerMode === 'custom'
              ? 'bg-[var(--accent-primary)] text-white shadow-md'
              : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Custom Interval
        </button>
      </div>

      {/* Main Focus Card with Circular Timer */}
      <Card className="p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2">
          {isBreak ? (
            <Badge variant="warning" size="md">
              <Coffee className="w-3.5 h-3.5 mr-1" />
              Restorative Break
            </Badge>
          ) : (
            <Badge variant="info" size="md">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Deep Focus Session
            </Badge>
          )}
        </div>

        {/* Circular SVG Timer */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="text-[var(--border-subtle)]"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className={`transition-all duration-500 ease-out ${
                isBreak ? 'text-amber-400' : 'text-[var(--accent-primary)]'
              }`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Time Display Inside Circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-[var(--text-primary)]">
              {formattedTime}
            </span>
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              {isRunning ? 'Session Active' : isBreak ? 'Break Paused' : 'Ready to Focus'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            onClick={handleToggleTimer}
            className="w-36 gap-2 shadow-lg"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{secondsRemaining < totalSeconds ? 'Resume' : 'Start'}</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            className="p-3"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5 text-[var(--text-muted)]" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleSwitchToBreak}
            className="gap-2 text-xs"
          >
            {isBreak ? (
              <>
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Switch to Focus</span>
              </>
            ) : (
              <>
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>Take Break</span>
              </>
            )}
          </Button>
        </div>

        {sessionCompleted && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>
              Session finished and automatically saved to your Study Analytics log!
            </span>
          </div>
        )}
      </Card>

      {/* Associated Subject & Topic Settings */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
          Session Association & Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Associate With Subject"
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            options={subjects.map(s => ({ value: s.id, label: s.name }))}
          />
          <Input
            label="Topic / Milestone"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Distributed Algorithms"
          />
        </div>
      </Card>
    </div>
  );
}
