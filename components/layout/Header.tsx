'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { Sun, Moon, Globe, Database, FileText, BarChart2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { locale, setLocale, theme, toggleTheme, t, setActiveView } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div 
          onClick={() => setActiveView('overview')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded bg-amber-700 dark:bg-amber-600 flex items-center justify-center text-white font-bold text-sm tracking-widest shadow-xs">
            SM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                {t.appName}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-900/60">
                {t.regionBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct link to Data Explorer */}
          <button
            onClick={() => setActiveView('data_explorer')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{locale === 'ar' ? 'مستكشف البيانات' : 'Data Explorer'}</span>
          </button>

          {/* Sources button */}
          <button
            onClick={() => setActiveView('sources')}
            title="Consulter les sources et la méthodologie"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'المصادر' : 'Sources'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-0.5 text-xs">
            <button
              onClick={() => setLocale('fr')}
              className={`px-2 py-1 rounded-[3px] font-semibold transition-all ${
                locale === 'fr'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLocale('ar')}
              className={`px-2 py-1 rounded-[3px] font-semibold transition-all ${
                locale === 'ar'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
