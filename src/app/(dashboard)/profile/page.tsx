'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Select } from '@/ui/Select';
import { Badge } from '@/ui/Badge';
import {
  User,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Camera,
} from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, updateUserProfile } = useData();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [age, setAge] = useState(userProfile.age?.toString() || '');
  const [height, setHeight] = useState(userProfile.height?.toString() || '');
  const [weight, setWeight] = useState(userProfile.weight?.toString() || '');
  const [gender, setGender] = useState(userProfile.gender || 'Prefer not to say');
  const [timezone, setTimezone] = useState(userProfile.timezone || 'Asia/Kolkata (IST)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      age: parseInt(age) || undefined,
      height: parseInt(height) || undefined,
      weight: parseInt(weight) || undefined,
      gender,
      timezone,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-3xl select-none">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Personal Profile & Biometrics
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Manage your personal information, physical baselines, and timezone preferences.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <Card className="p-6 space-y-6">
          {/* Avatar & Header Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[var(--border-subtle)] text-center sm:text-left">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-[var(--accent-primary)]/20 border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] flex items-center justify-center font-bold text-3xl shadow-md">
                {(name || 'U').charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] shadow-sm"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{name || 'Your Profile'}</h3>
                <Badge variant="success" size="sm">Active Member</Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)]">{email || 'No email configured'}</p>
              <p className="text-xs text-[var(--text-muted)] font-mono pt-1">
                Account created: {new Date(userProfile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Gender"
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
                  { value: 'America/New_York (EST)', label: 'America/New_York (EST)' },
                  { value: 'America/Los_Angeles (PST)', label: 'America/Los_Angeles (PST)' },
                  { value: 'Europe/London (GMT)', label: 'Europe/London (GMT)' },
                  { value: 'Europe/Paris (CET)', label: 'Europe/Paris (CET)' },
                  { value: 'Asia/Kolkata (IST)', label: 'Asia/Kolkata (IST)' },
                  { value: 'Asia/Tokyo (JST)', label: 'Asia/Tokyo (JST)' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Profile changes saved!
              </span>
            ) : (
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Data stored privately on your device.</span>
              </span>
            )}

            <Button type="submit">Save Profile</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
