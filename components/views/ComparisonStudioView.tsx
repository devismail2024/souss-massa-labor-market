'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData, jobCreationData, provincialData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatPoints, formatDelta } from '@/lib/formatters';
import { SegmentControl } from '../ui/SegmentControl';
import { StatCard } from '../ui/StatCard';
import { Columns, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { TerritoryCode } from '@/types/dataset';

export const ComparisonStudioView: React.FC = () => {
  const { locale } = useApp();
  const isAr = locale === 'ar';

  const [compareMode, setCompareMode] = useState<'territories' | 'years'>('territories');
  const [territoryA, setTerritoryA] = useState<TerritoryCode>('AIO');
  const [territoryB, setTerritoryB] = useState<TerritoryCode>('CAB');
  const [yearA, setYearA] = useState<number>(2019);
  const [yearB, setYearB] = useState<number>(2025);

  const territories = jobCreationData.territories;
  const tA = territories.find(t => t.code === territoryA) || territories[2];
  const tB = territories.find(t => t.code === territoryB) || territories[3];

  const yA = regionalData.series[yearA];
  const yB = regionalData.series[yearB];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'المقارن التحليلي المزدوج' : 'Studio Comparatif Multidimensionnel'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'مقارنة مباشرة بين إقليمين أو سنتين مختلفتين مع احتساب الفوارق الرياضية الدقيقة.'
            : 'Comparez deux territoires ou deux années repères pour évaluer les écarts et trajectoires.'}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SegmentControl<'territories' | 'years'>
          size="sm"
          value={compareMode}
          onChange={setCompareMode}
          options={[
            { value: 'territories', label: isAr ? 'مقارنة الأقاليم' : 'Comparer deux Territoires' },
            { value: 'years', label: isAr ? 'مقارنة السنوات' : 'Comparer deux Années' }
          ]}
        />
      </div>

      {compareMode === 'territories' ? (
        <div className="space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md">
              <label className="text-xs font-bold text-slate-500 block mb-2">{isAr ? 'المجال أ:' : 'Territoire A:'}</label>
              <select
                value={territoryA}
                onChange={e => setTerritoryA(e.target.value as TerritoryCode)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold"
              >
                {territories.map(t => (
                  <option key={t.code} value={t.code}>{isAr ? t.name_ar : t.name}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md">
              <label className="text-xs font-bold text-slate-500 block mb-2">{isAr ? 'المجال ب:' : 'Territoire B:'}</label>
              <select
                value={territoryB}
                onChange={e => setTerritoryB(e.target.value as TerritoryCode)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold"
              >
                {territories.map(t => (
                  <option key={t.code} value={t.code}>{isAr ? t.name_ar : t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Matrix */}
          <div className="p-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
              {isAr ? `${tA.name_ar} مقابل ${tB.name_ar}` : `${tA.name} vs ${tB.name}`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs divide-y sm:divide-y-0 sm:divide-x dark:divide-slate-800">
              <div className="p-2 space-y-3">
                <span className="font-bold text-slate-500 block uppercase tracking-wider">{isAr ? tA.name_ar : tA.name}</span>
                <div>
                  <span className="text-slate-400 block">{isAr ? 'معدل التشغيل 2025:' : 'Taux d’Emploi 2025:'}</span>
                  <strong className="text-lg text-slate-900 dark:text-slate-100">{formatPercent(tA.employment_rate.y2025, locale)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">{isAr ? 'المناصب 2023–2025:' : 'Créations nettes 23–25:'}</span>
                  <strong className="text-lg text-emerald-600">{formatNumber(tA.net_jobs_created.total_2023_2025, locale)}</strong>
                </div>
              </div>

              <div className="p-2 space-y-3">
                <span className="font-bold text-slate-500 block uppercase tracking-wider">{isAr ? tB.name_ar : tB.name}</span>
                <div>
                  <span className="text-slate-400 block">{isAr ? 'معدل التشغيل 2025:' : 'Taux d’Emploi 2025:'}</span>
                  <strong className="text-lg text-slate-900 dark:text-slate-100">{formatPercent(tB.employment_rate.y2025, locale)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">{isAr ? 'المناصب 2023–2025:' : 'Créations nettes 23–25:'}</span>
                  <strong className="text-lg text-emerald-600">{formatNumber(tB.net_jobs_created.total_2023_2025, locale)}</strong>
                </div>
              </div>

              <div className="p-2 space-y-3 bg-amber-50/50 dark:bg-amber-950/20 rounded">
                <span className="font-bold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">{isAr ? 'الفارق (أ - ب)' : 'Écart (A - B)'}</span>
                <div>
                  <span className="text-slate-400 block">{isAr ? 'فارق معدل التشغيل:' : 'Écart Taux Emploi:'}</span>
                  <strong className="text-lg text-amber-900 dark:text-amber-200">
                    {formatPoints(tA.employment_rate.y2025 - tB.employment_rate.y2025, locale)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">{isAr ? 'فارق عدد المناصب:' : 'Différence Postes:'}</span>
                  <strong className="text-lg text-amber-900 dark:text-amber-200">
                    {formatDelta(tA.net_jobs_created.total_2023_2025 - tB.net_jobs_created.total_2023_2025, false, locale)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md">
              <label className="text-xs font-bold text-slate-500 block mb-2">{isAr ? 'السنة الأولى:' : 'Année A:'}</label>
              <select
                value={yearA}
                onChange={e => setYearA(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold"
              >
                {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md">
              <label className="text-xs font-bold text-slate-500 block mb-2">{isAr ? 'السنة الثانية:' : 'Année B:'}</label>
              <select
                value={yearB}
                onChange={e => setYearB(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold"
              >
                {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Year Comparison Matrix */}
          <div className="p-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
              {isAr ? `المقارنة الزمنية: ${yearA} مقابل ${yearB}` : `Trajectoire Régionale: ${yearA} vs ${yearB}`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs divide-y sm:divide-y-0 sm:divide-x dark:divide-slate-800">
              <div className="p-2 space-y-3">
                <span className="font-bold text-slate-500 block uppercase">{yearA}</span>
                <div>
                  <span className="text-slate-400 block">Taux d’Emploi:</span>
                  <strong className="text-lg">{formatPercent(yA.employment_rate.total.total, locale)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Actifs Occupés:</span>
                  <strong className="text-lg">{formatNumber(yA.employed_population_k.total * 1000, locale)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Taux de Chômage:</span>
                  <strong className="text-lg">{formatPercent(yA.unemployment_rate.total.total, locale)}</strong>
                </div>
              </div>

              <div className="p-2 space-y-3">
                <span className="font-bold text-slate-500 block uppercase">{yearB}</span>
                <div>
                  <span className="text-slate-400 block">Taux d’Emploi:</span>
                  <strong className="text-lg">{formatPercent(yB.employment_rate.total.total, locale)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Actifs Occupés:</span>
                  <strong className="text-lg">{formatNumber(yB.employed_population_k.total * 1000, locale)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Taux de Chômage:</span>
                  <strong className="text-lg">{formatPercent(yB.unemployment_rate.total.total, locale)}</strong>
                </div>
              </div>

              <div className="p-2 space-y-3 bg-amber-50/50 dark:bg-amber-950/20 rounded">
                <span className="font-bold text-amber-800 dark:text-amber-300 block uppercase">{isAr ? 'الفارق المحسوب' : 'Évolution (B - A)'}</span>
                <div>
                  <span className="text-slate-400 block">Delta Taux d’Emploi:</span>
                  <strong className="text-lg text-amber-900 dark:text-amber-200">
                    {formatPoints(yB.employment_rate.total.total - yA.employment_rate.total.total, locale)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Création nette d’emplois:</span>
                  <strong className="text-lg text-emerald-600">
                    {formatDelta((yB.employed_population_k.total - yA.employed_population_k.total) * 1000, false, locale)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Delta Chômage:</span>
                  <strong className="text-lg text-amber-900 dark:text-amber-200">
                    {formatPoints(yB.unemployment_rate.total.total - yA.unemployment_rate.total.total, locale)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
