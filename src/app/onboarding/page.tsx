'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { Badge } from '@/ui/Badge';
import { useData } from '@/context/DataContext';
import {
  Sparkles,
  User,
  ShieldCheck,
  CheckCircle2,
  Moon,
  Target,
  Calendar,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Code2,
  Dumbbell,
  Utensils,
  Droplets,
  BookMarked,
  Smile,
  Heart,
  Briefcase,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const {
    userProfile,
    updateUserProfile,
    trackingPrefs,
    updateTrackingPrefs,
    sleepConfig,
    updateSleepConfig,
  } = useData();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 2: Profile state
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age?.toString() || '26');
  const [height, setHeight] = useState(userProfile.height?.toString() || '178');
  const [weight, setWeight] = useState(userProfile.weight?.toString() || '72');
  const [gender, setGender] = useState(userProfile.gender || 'Non-binary');
  const [timezone, setTimezone] = useState(userProfile.timezone || 'America/New_York (EST)');

  // Step 3: Tracking categories state
  const [prefs, setPrefs] = useState({ ...trackingPrefs });

  // Step 4: Sleep schedule state
  const [bedtime, setBedtime] = useState(sleepConfig.targetBedtime || '23:00');
  const [wakeTime, setWakeTime] = useState(sleepConfig.targetWakeTime || '07:00');

  // Step 5: Goals state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Study consistently',
    'Exercise regularly',
    'Learn coding',
    'Improve sleep consistency',
  ]);

  // Step 6: Routine sample options
  const [routinePreset, setRoutinePreset] = useState<'balanced' | 'student' | 'fitness' | 'minimal'>('balanced');

  const trackingOptions = [
    { key: 'studies', label: 'Studies', icon: <BookOpen className="w-4 h-4 text-blue-400" /> },
    { key: 'coding', label: 'Coding', icon: <Code2 className="w-4 h-4 text-violet-400" /> },
    { key: 'workout', label: 'Workout', icon: <Dumbbell className="w-4 h-4 text-amber-400" /> },
    { key: 'sleep', label: 'Sleep', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
    { key: 'meals', label: 'Meals', icon: <Utensils className="w-4 h-4 text-emerald-400" /> },
    { key: 'water', label: 'Water', icon: <Droplets className="w-4 h-4 text-cyan-400" /> },
    { key: 'reading', label: 'Reading', icon: <BookMarked className="w-4 h-4 text-pink-400" /> },
    { key: 'meditation', label: 'Meditation', icon: <Smile className="w-4 h-4 text-teal-400" /> },
    { key: 'hobbies', label: 'Hobbies', icon: <Heart className="w-4 h-4 text-rose-400" /> },
    { key: 'personalTasks', label: 'Personal tasks', icon: <Briefcase className="w-4 h-4 text-slate-400" /> },
  ];

  const goalOptions = [
    'Study consistently',
    'Exercise regularly',
    'Improve sleep consistency',
    'Learn coding',
    'Read more',
    'Maintain a routine',
    'Hit hydration targets',
    'Daily mindful reflection',
  ];

  const handleNext = () => {
    if (step === 2) {
      updateUserProfile({
        name,
        age: parseInt(age) || undefined,
        height: parseInt(height) || undefined,
        weight: parseInt(weight) || undefined,
        gender,
        timezone,
      });
    } else if (step === 3) {
      updateTrackingPrefs(prefs);
    } else if (step === 4) {
      updateSleepConfig({
        targetBedtime: bedtime,
        targetWakeTime: wakeTime,
        targetHours: 8,
      });
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleToggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 select-none">
      <div className="w-full max-w-xl space-y-6">
        {/* Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
            <span className="uppercase tracking-wider">Step {step} of {totalSteps}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent-primary)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <Card className="p-6 sm:p-8 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)] text-white flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                Welcome to DayTrack
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
                DayTrack is your personal operating system for daily routines, deep productivity, habits, studies, workouts, meals, and sleep.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-2 text-left">
              <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Our Core Philosophy: Plan → Track → Understand → Improve</span>
              </div>
              <p className="leading-relaxed">
                You configure your recurring weekly routine, track what you actually do, and receive automated weekly insights grounded in real data.
              </p>
            </div>

            <div className="pt-2">
              <Button onClick={handleNext} size="lg" className="w-full gap-2">
                <span>Begin Profile Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: BASIC PROFILE */}
        {step === 2 && (
          <Card className="p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Basic Profile</h3>
              <p className="text-xs text-[var(--text-muted)]">
                This helps DayTrack calculate baseline sleep, workout, and hydration goals.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[var(--accent-subtle)]/40 border border-[var(--accent-primary)]/20 flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
              <span>
                Your biometric and personal data is private, stored securely, and never monetized or shared.
              </span>
            </div>

            <div className="space-y-3.5">
              <Input
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Age"
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                />
                <Input
                  label="Height (cm)"
                  type="number"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Gender (Optional)"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  options={[
                    { value: 'Non-binary', label: 'Non-binary' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                />

                <Select
                  label="Timezone"
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  options={[
                    { value: 'America/New_York (EST)', label: 'New York (EST)' },
                    { value: 'America/Los_Angeles (PST)', label: 'Los Angeles (PST)' },
                    { value: 'Europe/London (GMT)', label: 'London (GMT)' },
                    { value: 'Europe/Paris (CET)', label: 'Paris (CET)' },
                    { value: 'Asia/Kolkata (IST)', label: 'India (IST)' },
                    { value: 'Asia/Tokyo (JST)', label: 'Tokyo (JST)' },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: WHAT TO TRACK */}
        {step === 3 && (
          <Card className="p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                What would you like to track?
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Select all modules relevant to your daily routine. You can toggle these anytime in Settings.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {trackingOptions.map(opt => {
                const isChecked = (prefs as any)[opt.key];
                return (
                  <div
                    key={opt.key}
                    onClick={() => setPrefs(prev => ({ ...prev, [opt.key]: !isChecked }))}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between select-none ${
                      isChecked
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                        {opt.icon}
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {opt.label}
                      </span>
                    </div>
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-[var(--border-subtle)]" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: SLEEP SCHEDULE */}
        {step === 4 && (
          <Card className="p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Typical Sleep Schedule
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Setting your circadian anchors anchors your entire morning and evening timeline.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Moon className="w-4 h-4" />
                  <span className="text-xs font-semibold">Target Bedtime</span>
                </div>
                <Input
                  type="time"
                  value={bedtime}
                  onChange={e => setBedtime(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold">Wake-Up Time</span>
                </div>
                <Input
                  type="time"
                  value={wakeTime}
                  onChange={e => setWakeTime(e.target.value)}
                />
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] text-center">
              Planned Duration: 8 hours restorative recovery
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 5: PERSONAL GOALS */}
        {step === 5 && (
          <Card className="p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Personal Goals</h3>
              <p className="text-xs text-[var(--text-muted)]">
                What key habits or milestones do you want to build consistency around?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goalOptions.map(goal => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <div
                    key={goal}
                    onClick={() => handleToggleGoal(goal)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between select-none text-xs font-semibold ${
                      isSelected
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 text-[var(--text-primary)] shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-[var(--border-subtle)] flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 6: CREATE WEEKLY ROUTINE PRESET */}
        {step === 6 && (
          <Card className="p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Initialize Weekly Routine
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Choose a baseline routine template. You will be able to edit, drag, and fine-tune every recurring day in the Routine Builder.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'balanced',
                  title: 'Balanced High-Performer (Recommended)',
                  desc: 'Morning workout, deep study blocks, afternoon engineering, evening reading & consistent 8h sleep.',
                },
                {
                  id: 'student',
                  title: 'Academic Focus & Deep Study',
                  desc: 'Higher study target hours, spaced repetition review blocks, and library sessions.',
                },
                {
                  id: 'fitness',
                  title: 'Athletic & Nutrition Focused',
                  desc: 'Dedicated hypertrophy / cardio splits, structured meal logs, and hydration tracking.',
                },
              ].map(preset => (
                <div
                  key={preset.id}
                  onClick={() => setRoutinePreset(preset.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    routinePreset === preset.id
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]/40 shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">{preset.title}</h4>
                    {routinePreset === preset.id && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{preset.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext} className="gap-2 shadow-lg">
                <span>Complete Onboarding</span>
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
