'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Badge } from '@/ui/Badge';
import { CheckCheck, Award, Calendar, Info } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, clearAllNotifications } = useData();

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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Notifications & System Alerts
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Activity reminders, habit streak notices, and weekly analysis digests.
          </p>
        </div>

        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllNotifications}
            className="gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <Badge variant="outline">{notifications.filter(n => !n.read).length} Unread</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-[var(--border-subtle)]">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-sm text-[var(--text-muted)]">
                You're completely caught up. No new notifications.
              </div>
            ) : (
              notifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => markNotificationRead(item.id)}
                  className={`py-4 px-3 flex items-start gap-4 rounded-xl cursor-pointer transition-colors ${
                    item.read
                      ? 'opacity-60 hover:opacity-100 hover:bg-[var(--accent-subtle)]/20'
                      : 'bg-[var(--accent-subtle)]/30 hover:bg-[var(--accent-subtle)]/50'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex-shrink-0">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                        {item.title}
                      </h4>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
