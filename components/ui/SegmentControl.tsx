import React from 'react';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  badge?: string;
}

interface SegmentControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentControl<T extends string | number>({
  options,
  value,
  onChange,
  size = 'md',
  className = ''
}: SegmentControlProps<T>) {
  return (
    <div
      className={`inline-flex p-0.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-md ${className}`}
    >
      {options.map(opt => {
        const isSelected = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1.5 font-medium transition-all ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs'
            } rounded-[4px] ${
              isSelected
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>{opt.label}</span>
            {opt.badge && (
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  isSelected
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
