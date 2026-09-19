'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Switch } from '@/ui/Switch';
import { Tabs } from '@/ui/Tabs';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import {
  Palette,
  Bell,
  ShieldCheck,
  Lock,
  LogOut,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { logout, resetAllData } = useData();
  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'privacy' | 'security'>('appearance');

  // Notification settings state
  const [routineReminders, setRoutineReminders] = useState(true);
  const [hydrationAlerts, setHydrationAlerts] = useState(true);
  const [eveningReflection, setEveningReflection] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Reset confirmation state
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) return;
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleResetData = () => {
    resetAllData();
    setResetConfirm(false);
    alert('All application data has been successfully reset to default demo records.');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(localStorage, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `daytrack_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl select-none">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Application Settings & Preferences
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Manage your appearance modes, notification cadence, data privacy, and account security.
        </p>
      </div>

      {/* Main Settings Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={t => setActiveTab(t as any)}
        tabs={[
          { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
          { id: 'privacy', label: 'Privacy & Data', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'security', label: 'Security & Auth', icon: <Lock className="w-4 h-4" /> },
        ]}
      />

      {/* 1. APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <AppearanceSettings />
      )}

      {/* 2. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Cadence</CardTitle>
              <CardDescription>
                Configure which routine milestones trigger system notices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 divide-y divide-[var(--border-subtle)]">
              <div className="pt-2">
                <Switch
                  checked={routineReminders}
                  onChange={setRoutineReminders}
                  label="Upcoming Routine Activity Alerts"
                  description="Send reminders 10 minutes prior to scheduled study, coding, and workout blocks."
                />
              </div>

              <div className="pt-4">
                <Switch
                  checked={hydrationAlerts}
                  onChange={setHydrationAlerts}
                  label="Daily Hydration Checkpoints"
                  description="Gentle afternoon reminders if water intake is behind target."
                />
              </div>

              <div className="pt-4">
                <Switch
                  checked={eveningReflection}
                  onChange={setEveningReflection}
                  label="Evening Reflection Prompt (21:30)"
                  description="A fast 2-minute prompt to log your mood, energy, and review your day."
                />
              </div>

              <div className="pt-4">
                <Switch
                  checked={weeklyDigest}
                  onChange={setWeeklyDigest}
                  label="Automatic Sunday Weekly Digest"
                  description="Notifies you when your automatic weekly analysis and consistency report are ready."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3. PRIVACY & DATA TAB */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client-Side Privacy Controls</CardTitle>
              <CardDescription>
                DayTrack is built with privacy-first architecture. Your routines and health logs belong to you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Zero Commercial Tracking Policy</span>
                </div>
                <p className="leading-relaxed">
                  We do not sell personal data, advertise to users, or share biometric records with third parties. All current data is stored securely in your browser's persistent storage and will link cleanly to PostgreSQL encryption when backend migration is initiated.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Export All Activity Data (JSON)
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Download a full offline archive of your routines, study hours, habits, and journals.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2">
                  <Download className="w-4 h-4" />
                  <span>Export JSON</span>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
                <div>
                  <h4 className="text-sm font-semibold text-rose-400">
                    Reset to Default Demo Records
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Clears local modifications and re-seeds the application with the Alex Morgan demo profile.
                  </p>
                </div>
                {resetConfirm ? (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="danger" onClick={handleResetData}>
                      Confirm Reset
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setResetConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setResetConfirm(true)} className="gap-2 text-rose-400">
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Data</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 4. SECURITY & AUTH TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account authentication credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                />

                {passwordSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Password updated successfully!</span>
                  </div>
                )}

                <Button type="submit" size="sm">Update Password</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-rose-500/20">
            <CardHeader>
              <CardTitle className="text-rose-400">Account Session & Danger Zone</CardTitle>
              <CardDescription>
                Sign out of this session or permanently delete your account profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">Sign Out</h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    End your active session on this device.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
                <div>
                  <h4 className="text-sm font-semibold text-rose-400">Delete Account</h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Permanently delete your profile and all historical logs.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you wish to delete your account? This action cannot be undone.')) {
                      handleResetData();
                      handleLogout();
                    }
                  }}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
