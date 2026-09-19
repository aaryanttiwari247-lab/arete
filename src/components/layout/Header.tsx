'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { Sun, Moon, CloudMoon, Plus, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/ui/Button';
import { QuickAddModal } from './QuickAddModal';
import { NotificationPanel } from './NotificationPanel';

export const Header: React.FC = () => {
  const { theme, cycleTheme } = useTheme();
  const { userProfile, notifications } = useData();
  const [greeting, setGreeting] = useState('Good day');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    setCurrentDateStr(new Date().toLocaleDateString(undefined, options));
  }, []);

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (theme === 'medium') return <CloudMoon className="w-4 h-4 text-sky-400" />;
    return <Moon className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <>
      <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-translucent)] backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 theme-transition select-none">
        {/* Left: Dynamic Greeting & Date */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
              {greeting}, {userProfile.name.split(' ')[0]}
            </h1>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[var(--text-muted)]" />
            <span className="hidden sm:inline-block text-xs text-[var(--text-muted)]">
              {currentDateStr}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] hidden md:block">
            Stay deliberate. Consistency compounds over time.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Theme Cycle Button */}
          <button
            onClick={cycleTheme}
            aria-label={`Current appearance: ${theme}. Click to switch.`}
            title={`Switch appearance (Current: ${theme})`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all active:scale-95 text-xs font-medium"
          >
            {getThemeIcon()}
            <span className="capitalize hidden sm:inline">{theme}</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </div>

          {/* Quick Add Button */}
          <Button
            size="sm"
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Activity</span>
          </Button>

          {/* User Profile Avatar Link */}
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-bold text-xs flex items-center justify-center hover:ring-2 hover:ring-[var(--accent-ring)] transition-all"
            title="User Profile"
          >
            {userProfile.name.charAt(0)}
          </Link>
        </div>
      </header>

      {/* Quick Add Modal */}
      <QuickAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </>
  );
};
