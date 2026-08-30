'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatPoints } from '@/lib/formatters';
import { GapDivergingBar, GapItem } from '../charts/GapDivergingBar';
import { StatCard } from '../ui/StatCard';
import { Users, UserCheck, AlertCircle } from 'lucide-react';

export const GenderView: React.FC = () => {
  const { locale } = useApp();
  const isAr = locale === 'ar';
  const d2025 = regionalData.series[2025];

  const gapItems: GapItem[] = [
    {
      dimension: 'Taux d’Activité (2025)',
      dimensionAr: 'معدل النشاط (2025)',
      valA: d2025.activity_rate.by_sex.men.total,
      labelA: 'Hommes (ذكور)',
      valB: d2025.activity_rate.by_sex.women.total,
      labelB: 'Femmes (إناث)'
    },
    {
      dimension: 'Taux d’Emploi (2025)',
      dimensionAr: 'معدل التشغيل (2025)',
      valA: d2025.employment_rate.by_sex.men.total,
      labelA: 'Hommes (ذكور)',
      valB: d2025.employment_rate.by_sex.women.total,
      labelB: 'Femmes (إناث)'
    },
    {
      dimension: 'Taux de Chômage (2025)',
      dimensionAr: 'معدل البطالة (2025)',
      valA: d2025.unemployment_rate.by_sex.men.total,
      labelA: 'Hommes (ذكور)',
      valB: d2025.unemployment_rate.by_sex.women.total,
      labelB: 'Femmes (إناث)'
    }
  ];

  const actGap = Math.round((d2025.activity_rate.by_sex.men.total - d2025.activity_rate.by_sex.women.total) * 10) / 10;
  const empGap = Math.round((d2025.employment_rate.by_sex.men.total - d2025.employment_rate.by_sex.women.total) * 10) / 10;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'ديناميكيات النوع الاجتماعي والمناصفة في سوق الشغل' : 'Dynamiques de Genre & Parité dans l’Emploi'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'تحليل فجوات المشاركة الاقتصادية، معدلات النشاط والتشغيل، وعبء البطالة النسوية بسوس ماسة.'
            : 'Diagnostic approfondi des disparités d’insertion, de la féminisation active (18,6%) et du sous-emploi.'}
        </p>
      </div>

      {/* Key Gender Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={isAr ? 'فجوة معدل النشاط' : 'Écart d’Activité'}
          value={`-${actGap}`}
          unit="pts"
          secondaryText={isAr ? 'رجال: 67.6% | نساء: 14.7%' : 'Hommes: 67.6% | Femmes: 14.7%'}
          variant="accent"
        />

        <StatCard
          title={isAr ? 'فجوة معدل التشغيل' : 'Écart d’Emploi'}
          value={`-${empGap}`}
          unit="pts"
          secondaryText={isAr ? 'رجال: 61.8% | نساء: 11.5%' : 'Hommes: 61.8% | Femmes: 11.5%'}
        />

        <StatCard
          title={isAr ? 'نسبة تأنيث الساكنة النشيطة' : 'Taux de Féminisation'}
          value="18.6"
          unit="%"
          secondaryText={isAr ? 'حضري: 20.6% | قروي: 14.4%' : 'Urbain: 20.6% | Rural: 14.4%'}
        />
      </div>

      {/* Diverging Bars */}
      <GapDivergingBar
        title={isAr ? 'مقارنة المؤشرات الهيكلية بين الرجال والنساء (2025)' : 'Comparaison Structurelle Hommes vs Femmes (2025)'}
        subtitle={isAr ? 'المصدر: البحث الوطني حول التشغيل' : 'Source: Haut-Commissariat au Plan - ENE 2025'}
        items={gapItems}
      />
    </div>
  );
};
