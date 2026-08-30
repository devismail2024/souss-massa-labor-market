'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatPoints } from '@/lib/formatters';
import { GapDivergingBar, GapItem } from '../charts/GapDivergingBar';
import { StatCard } from '../ui/StatCard';
import { SectorCompositionChart } from '../charts/SectorCompositionChart';
import { Compass, Building2, Trees } from 'lucide-react';

export const UrbanRuralView: React.FC = () => {
  const { locale } = useApp();
  const isAr = locale === 'ar';
  const d2025 = regionalData.series[2025];

  const gapItems: GapItem[] = [
    {
      dimension: 'Taux d’Activité (2025)',
      dimensionAr: 'معدل النشاط (2025)',
      valA: d2025.activity_rate.total.urban,
      labelA: 'Milieu Urbain',
      labelArA: 'وسط حضري',
      valB: d2025.activity_rate.total.rural,
      labelB: 'Milieu Rural',
      labelArB: 'وسط قروي'
    },
    {
      dimension: 'Taux d’Emploi (2025)',
      dimensionAr: 'معدل التشغيل (2025)',
      valA: d2025.employment_rate.total.urban,
      labelA: 'Milieu Urbain',
      labelArA: 'وسط حضري',
      valB: d2025.employment_rate.total.rural,
      labelB: 'Milieu Rural',
      labelArB: 'وسط قروي'
    },
    {
      dimension: 'Taux de Chômage (2025)',
      dimensionAr: 'معدل البطالة (2025)',
      valA: d2025.unemployment_rate.total.urban,
      labelA: 'Milieu Urbain',
      labelArA: 'وسط حضري',
      valB: d2025.unemployment_rate.total.rural,
      labelB: 'Milieu Rural',
      labelArB: 'وسط قروي'
    },
    {
      dimension: 'Part des Services dans l’Emploi',
      dimensionAr: 'حصة الخدمات في التشغيل',
      valA: d2025.sector_shares_pct.services.urban,
      labelA: 'Milieu Urbain',
      labelArA: 'وسط حضري',
      valB: d2025.sector_shares_pct.services.rural,
      labelB: 'Milieu Rural',
      labelArB: 'وسط قروي'
    },
    {
      dimension: 'Part de l’Agriculture dans l’Emploi',
      dimensionAr: 'حصة الفلاحة في التشغيل',
      valA: d2025.sector_shares_pct.agriculture.urban,
      labelA: 'Milieu Urbain',
      labelArA: 'وسط حضري',
      valB: d2025.sector_shares_pct.agriculture.rural,
      labelB: 'Milieu Rural',
      labelArB: 'وسط قروي'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'التباين المجالي: الوسط الحضري مقابل الوسط القروي' : 'Fractures Spatiales: Milieu Urbain vs Milieu Rural'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'مقارنة الفوارق الهيكلية في نسب النشاط، التشغيل، البطالة والتركيبة القطاعية بين المدن والأرياف.'
            : 'Analyse comparée des disparités d’insertion, du chômage urbain et de la dépendance agricole rurale.'}
        </p>
      </div>

      {/* Side by side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urban Card */}
        <div className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-md border-l-4 border-l-blue-600">
          <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400">
            <Building2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isAr ? 'الوسط الحضري (سوس ماسة)' : 'Milieu Urbain (Souss-Massa)'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">{isAr ? 'الساكنة النشيطة:' : 'Pop. Active:'}</span>
              <strong className="text-base text-slate-900 dark:text-slate-100 tnum">570 000</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'معدل التشغيل:' : 'Taux d’Emploi:'}</span>
              <strong className="text-base text-slate-900 dark:text-slate-100 tnum">36.8%</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'معدل البطالة:' : 'Taux de Chômage:'}</span>
              <strong className="text-base text-rose-600 dark:text-rose-400 tnum">13.1%</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'هيمنة الخدمات:' : 'Poids Services:'}</span>
              <strong className="text-base text-amber-700 dark:text-amber-400 tnum">61.6%</strong>
            </div>
          </div>
        </div>

        {/* Rural Card */}
        <div className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-md border-l-4 border-l-emerald-600">
          <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400">
            <Trees className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isAr ? 'الوسط القروي (سوس ماسة)' : 'Milieu Rural (Souss-Massa)'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">{isAr ? 'الساكنة النشيطة:' : 'Pop. Active:'}</span>
              <strong className="text-base text-slate-900 dark:text-slate-100 tnum">277 000</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'معدل التشغيل:' : 'Taux d’Emploi:'}</span>
              <strong className="text-base text-slate-900 dark:text-slate-100 tnum">34.4%</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'معدل البطالة:' : 'Taux de Chômage:'}</span>
              <strong className="text-base text-emerald-600 dark:text-emerald-400 tnum">6.6%</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'هيمنة الفلاحة:' : 'Poids Agriculture:'}</span>
              <strong className="text-base text-emerald-700 dark:text-emerald-400 tnum">47.3%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Diverging Bar Component */}
      <GapDivergingBar
        title={isAr ? 'قياس الفوارق المباشرة بين الوسطين الحضري والقروي (2025)' : 'Mesure des Écarts Directs Urbain vs Rural (2025)'}
        subtitle={isAr ? 'الفارق المحسوب بنقاط مئوية (pts)' : 'Écarts calculés rigoureusement en points de pourcentage'}
        items={gapItems}
      />
    </div>
  );
};
