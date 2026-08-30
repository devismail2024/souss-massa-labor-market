import React from 'react';
import { Badge } from './Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  delta?: {
    value: string;
    isPositiveGood?: boolean;
    period?: string;
  };
  secondaryText?: string;
  sign?: string;
  badge?: string;
  variant?: 'default' | 'accent' | 'subtle';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  delta,
  secondaryText,
  sign,
  badge,
  variant = 'default',
  className = ''
}) => {
  return (
    <div
      className={`p-4 border transition-all ${
        variant === 'accent'
          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/50'
          : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
      } rounded-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-tight uppercase">
          {title}
        </span>
        <div className="flex items-center gap-1">
          {badge && <Badge variant="neutral" size="xs">{badge}</Badge>}
          {sign && <Badge sign={sign} />}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tnum">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {(delta || secondaryText) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
          {delta && (
            <span
              className={`font-semibold tnum ${
                delta.value.startsWith('+')
                  ? delta.isPositiveGood !== false ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                  : delta.value.startsWith('-')
                  ? delta.isPositiveGood !== false ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {delta.value} {delta.period && <span className="font-normal text-slate-500 dark:text-slate-400">{delta.period}</span>}
            </span>
          )}
          {secondaryText && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {secondaryText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
