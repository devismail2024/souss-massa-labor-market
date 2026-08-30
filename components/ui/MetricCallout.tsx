import React from 'react';
import { Sparkles, Info, AlertTriangle, TrendingUp } from 'lucide-react';

interface MetricCalloutProps {
  title?: string;
  text: string;
  type?: 'positive' | 'warning' | 'neutral' | 'highlight';
  metric?: string;
  badge?: string;
  sourceNote?: string;
  className?: string;
}

export const MetricCallout: React.FC<MetricCalloutProps> = ({
  title,
  text,
  type = 'neutral',
  metric,
  badge,
  sourceNote,
  className = ''
}) => {
  const styles = {
    positive: 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200',
    warning: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200',
    highlight: 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200',
    neutral: 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200'
  };

  const icons = {
    positive: <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    highlight: <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />,
    neutral: <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
  };

  return (
    <div className={`p-3.5 border rounded-md ${styles[type]} ${className}`}>
      <div className="flex items-start gap-2.5">
        {icons[type]}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            {title && <span className="text-xs font-bold tracking-tight">{title}</span>}
            {badge && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed opacity-90">{text}</p>
          {(metric || sourceNote) && (
            <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 text-[11px]">
              {metric && <span className="font-semibold font-mono">{metric}</span>}
              {sourceNote && <span className="text-[10px] opacity-70 italic">{sourceNote}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
