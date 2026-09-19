'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Plus, BarChart3, User } from 'lucide-react';
import { QuickAddModal } from './QuickAddModal';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-translucent)] backdrop-blur-xl z-40 px-4 flex items-center justify-around select-none">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            pathname === '/dashboard'
              ? 'text-[var(--accent-primary)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          href="/routine"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            pathname === '/routine'
              ? 'text-[var(--accent-primary)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Routine</span>
        </Link>

        {/* Center Floating Add Button */}
        <button
          onClick={() => setQuickAddOpen(true)}
          className="-mt-5 w-12 h-12 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          aria-label="Quick Add"
        >
          <Plus className="w-6 h-6" />
        </button>

        <Link
          href="/analytics"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            pathname === '/analytics'
              ? 'text-[var(--accent-primary)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            pathname === '/profile'
              ? 'text-[var(--accent-primary)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Link>
      </nav>

      <QuickAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </>
  );
};
