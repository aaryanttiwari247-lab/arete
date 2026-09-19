'use client';

import React, { useRef, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { CheckCheck, Bell, Info, Award, Calendar } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications } = useData();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'reminder':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-4 z-50 theme-transition"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="font-semibold text-sm text-[var(--text-primary)]">Notifications</span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="py-2 divide-y divide-[var(--border-subtle)] max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-muted)]">
            No new notifications
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`py-3 px-2 flex items-start gap-3 rounded-lg cursor-pointer transition-colors ${
                n.read
                  ? 'opacity-60 hover:opacity-100 hover:bg-[var(--accent-subtle)]/30'
                  : 'bg-[var(--accent-subtle)]/20 hover:bg-[var(--accent-subtle)]/40'
              }`}
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">{n.title}</p>
                  <span className="text-[10px] text-[var(--text-muted)]">{n.time}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
