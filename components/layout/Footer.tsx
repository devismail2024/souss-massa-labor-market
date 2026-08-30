'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { FileCheck, Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, locale, setActiveView } = useApp();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              {t.appName} — {t.appSubtitle}
            </span>
          </div>
          <p className="leading-relaxed">
            {locale === 'ar'
              ? 'منصة ذكاء اقتصادي ترابي تعتمد حصرياً على البيانات الرسمية للمندوبية السامية للتخطيط (HCP) والإحصاء العام للسكان والسكنى 2024.'
              : 'Plateforme d’intelligence territoriale basée exclusivement sur les micro-données et publications de l’Enquête Nationale sur l’Emploi (HCP) et du RGPH 2024.'}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px]">
            <span className="flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {t.lastUpdate}
            </span>
            <span>•</span>
            <span className="font-mono">Notations: [ps] Peu significatif | [ms] Moyennement significatif</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs shrink-0">
          <button
            onClick={() => setActiveView('sources')}
            className="hover:underline text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'توثيق البيانات والمصادر' : 'Provenance & Méthodologie'}</span>
          </button>
          <button
            onClick={() => setActiveView('data_explorer')}
            className="hover:underline text-slate-700 dark:text-slate-300 font-medium"
          >
            <span>{locale === 'ar' ? 'المستكشف' : 'Explorateur'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
