'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BookOpen,
  Dumbbell,
  Utensils,
  Moon,
  Flame,
  Target,
  Timer,
  BarChart3,
  BookMarked,
  Bell,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useData } from '@/context/DataContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { activities, notifications, userProfile } = useData();

  const pendingActivitiesCount = activities.filter(a => a.status === 'pending').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Routine', href: '/routine', icon: <CalendarDays className="w-4 h-4" /> },
    {
      label: 'Activities',
      href: '/activities',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingActivitiesCount > 0 ? pendingActivitiesCount : undefined,
    },
    { label: 'Studies', href: '/studies', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Workout', href: '/workout', icon: <Dumbbell className="w-4 h-4" /> },
    { label: 'Meals & Water', href: '/meals', icon: <Utensils className="w-4 h-4" /> },
    { label: 'Sleep', href: '/sleep', icon: <Moon className="w-4 h-4" /> },
    { label: 'Habits', href: '/habits', icon: <Flame className="w-4 h-4" /> },
    { label: 'Goals', href: '/goals', icon: <Target className="w-4 h-4" /> },
    { label: 'Focus', href: '/focus', icon: <Timer className="w-4 h-4" /> },
    { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Journal', href: '/journal', icon: <BookMarked className="w-4 h-4" /> },
  ];

  const bottomNavItems: NavItem[] = [
    {
      label: 'Notifications',
      href: '/notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
    },
    { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface-translucent)] backdrop-blur-xl h-screen sticky top-0 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border-subtle)]">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">
                DayTrack
              </span>
              <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase font-mono">
                Plan • Track • Improve
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Main Menu
          </p>
        )}
        {mainNavItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[var(--border-subtle)] p-3 space-y-1">
        {bottomNavItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* User Mini Profile */}
        {!collapsed && (
          <div className="pt-2 mt-2 border-t border-[var(--border-subtle)] flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] flex items-center justify-center font-bold text-xs">
              {(userProfile.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                {userProfile.name || 'DayTrack User'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] truncate">
                {userProfile.email || 'Configure profile'}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
