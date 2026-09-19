import React from 'react';
import { ActivityCategory, ActivityPriority } from '@/types/models';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'info';
  category?: ActivityCategory;
  priority?: ActivityPriority;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  category,
  priority,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  let customStyles = 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20';

  if (category) {
    switch (category) {
      case 'study':
        customStyles = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        break;
      case 'workout':
        customStyles = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        break;
      case 'sleep':
        customStyles = 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
        break;
      case 'meal':
        customStyles = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        break;
      case 'water':
        customStyles = 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
        break;
      case 'coding':
        customStyles = 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
        break;
      case 'reading':
        customStyles = 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
        break;
      case 'personal':
        customStyles = 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
        break;
      default:
        customStyles = 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        break;
    }
  } else if (priority) {
    switch (priority) {
      case 'urgent':
        customStyles = 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold';
        break;
      case 'high':
        customStyles = 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
        break;
      case 'medium':
        customStyles = 'bg-blue-500/15 text-blue-400 border border-blue-500/25';
        break;
      case 'low':
        customStyles = 'bg-slate-500/15 text-slate-400 border border-slate-500/20';
        break;
    }
  } else {
    switch (variant) {
      case 'outline':
        customStyles = 'border border-[var(--border-subtle)] text-[var(--text-secondary)]';
        break;
      case 'success':
        customStyles = 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
        break;
      case 'warning':
        customStyles = 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
        break;
      case 'danger':
        customStyles = 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
        break;
      case 'info':
        customStyles = 'bg-sky-500/15 text-sky-400 border border-sky-500/30';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full capitalize select-none ${sizeClasses} ${customStyles} ${className}`}
      {...props}
    >
      {children || category || priority}
    </span>
  );
};
