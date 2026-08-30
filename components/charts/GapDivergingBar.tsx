'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { formatPercent, formatPoints } from '@/lib/formatters';

export interface GapItem {
  dimension: string;
  dimensionAr?: string;
  valA: number; // e.g. Men / Urban
  labelA: string;
  labelArA?: string;
  valB: number; // e.g. Women / Rural
  labelB: string;
  labelArB?: string;
  unit?: string;
  notes?: string;
}

interface GapDivergingBarProps {
  title: string;
  subtitle?: string;
  items: GapItem[];
  className?: string;
}

export const GapDivergingBar: React.FC<GapDivergingBarProps> = ({
  title,
  subtitle,
  items,
  className = ''
}) => {
  const { locale } = useApp();
  const isAr = locale === 'ar';

  return (
    <div className={`p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const gap = Math.round((item.valA - item.valB) * 10) / 10;
          const maxVal = Math.max(item.valA, item.valB, 10);
          
          const pctWidthA = Math.min(100, Math.max(5, (item.valA / 80) * 100));
          const pctWidthB = Math.min(100, Math.max(5, (item.valB / 80) * 100));

          return (
            <div key={idx} className="p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? item.dimensionAr || item.dimension : item.dimension}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300">
                    {isAr ? 'الفارق: ' : 'Écart: '}{formatPoints(gap, locale)}
                  </span>
                </div>
              </div>

              {/* Dual progress bars */}
              <div className="space-y-2 text-xs">
                {/* Bar A */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {isAr ? item.labelArA || item.labelA : item.labelA}
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 tnum">
                      {formatPercent(item.valA, locale)}
                    </strong>
                  </div>
                  <div className="w-full h-2 bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                      style={{ width: `${pctWidthA}%` }}
                    />
                  </div>
                </div>

                {/* Bar B */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {isAr ? item.labelArB || item.labelB : item.labelB}
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 tnum">
                      {formatPercent(item.valB, locale)}
                    </strong>
                  </div>
                  <div className="w-full h-2 bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 dark:bg-rose-400 rounded-full"
                      style={{ width: `${pctWidthB}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
