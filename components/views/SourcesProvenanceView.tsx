'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { metadataData } from '@/lib/data-service';
import { BookOpen, FileCheck, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SourcesProvenanceView: React.FC = () => {
  const { locale } = useApp();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'التوثيق المنهجي ومصادر البيانات الرسمية' : 'Provenance des Données & Cadre Méthodologique'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'توثيق كامل للدفاتر الإحصائية الصادرة عن المندوبية السامية للتخطيط، معايير المعاينة والملاحظات الفنية.'
            : 'Traçabilité intégrale des 5 classeurs sources HCP, notations conventionnelles et seuils de représentativité.'}
        </p>
      </div>

      {/* Notations Conventionnelles */}
      <div className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-md">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>{isAr ? 'الرموز والملاحظات الإحصائية الاصطلاحية' : 'Signes Conventionnels & Alertes de Fiabilité'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {Object.entries(metadataData.notations).map(([symbol, info]) => (
            <div key={symbol} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded">
                  {symbol}
                </span>
                <strong className="text-slate-900 dark:text-slate-100">{info.label}</strong>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Source Workbooks Documentation */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'الدفاتر الإحصائية الخمسة المعتمدة' : 'Les 5 Classeurs Statistiques Sources'}
        </h3>
        {metadataData.sources.map(src => (
          <div key={src.id} className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{src.name}</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {src.filename}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
              {src.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span><strong>Institution:</strong> {src.institution}</span>
              <span><strong>Couverture:</strong> {src.coverage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
