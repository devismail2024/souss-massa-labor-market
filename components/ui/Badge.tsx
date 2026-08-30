import React from 'react';
import { getSignBadgeInfo } from '@/lib/formatters';

interface BadgeProps {
  children?: React.ReactNode;
  sign?: string;
  variant?: 'default' | 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  sign,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  if (sign) {
    const signInfo = getSignBadgeInfo(sign);
    if (!signInfo) return null;
    return (
      <span
        title={signInfo.tooltip}
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${signInfo.badgeClass} cursor-help ${className}`}
      >
        {signInfo.label}
      </span>
    );
  }

  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    neutral: 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700',
    accent: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    warning: 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/60',
    danger: 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
  };

  const sizeStyles = {
    xs: 'px-1 py-0.2 text-[9px] font-mono',
    sm: 'px-1.5 py-0.5 text-[11px]',
    md: 'px-2 py-1 text-xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium border rounded-sm ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
