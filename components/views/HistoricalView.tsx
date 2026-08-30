'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatPoints } from '@/lib/formatters';
import { TimeSeriesChart } from '../charts/TimeSeriesChart';
import { DataTable, ColumnDef } from '../ui/DataTable';
import { SegmentControl } from '../ui/SegmentControl';

export const HistoricalView: React.FC = () => {
  const { locale } = useApp();
  const isAr = locale === 'ar';

  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

  interface HistoryRow {
    year: number;
    pop15K: number;
    activeK: number;
    employedK: number;
    unemployedK: number;
    activityRate: number;
    employmentRate: number;
    unemploymentRate: number;
    underempRate?: number;
    servicesShare: number;
    agriShare: number;
  }

  const tableData: HistoryRow[] = years.map(y => {
    const d = regionalData.series[y];
    return {
      year: y,
      pop15K: d.population_15_plus_k.total,
      activeK: d.active_population_k.total,
      employedK: d.employed_population_k.total,
      unemployedK: d.unemployed_population_k.total,
      activityRate: d.activity_rate.total.total,
      employmentRate: d.employment_rate.total.total,
      unemploymentRate: d.unemployment_rate.total.total,
      underempRate: d.underemployment?.rate_pct?.total,
      servicesShare: d.sector_shares_pct.services.total,
      agriShare: d.sector_shares_pct.agriculture.total
    };
  });

  const columns: ColumnDef<HistoryRow>[] = [
    {
      key: 'year',
      header: isAr ? 'السنة' : 'Année',
      render: r => <strong className="font-mono text-amber-700 dark:text-amber-400 font-bold">{r.year}</strong>
    },
    {
      key: 'employedK',
      header: isAr ? 'المشتغلون (ألف)' : 'Emploi (k)',
      align: 'right',
      render: r => <span>{formatNumber(r.employedK, locale)}</span>
    },
    {
      key: 'employmentRate',
      header: isAr ? 'معدل التشغيل' : 'Taux d’Emploi',
      align: 'right',
      render: r => <span className="font-semibold">{formatPercent(r.employmentRate, locale)}</span>
    },
    {
      key: 'activeK',
      header: isAr ? 'النشيطون (ألف)' : 'Actifs (k)',
      align: 'right',
      render: r => <span>{formatNumber(r.activeK, locale)}</span>
    },
    {
      key: 'activityRate',
      header: isAr ? 'معدل النشاط' : 'Taux d’Activité',
      align: 'right',
      render: r => <span>{formatPercent(r.activityRate, locale)}</span>
    },
    {
      key: 'unemploymentRate',
      header: isAr ? 'معدل البطالة' : 'Taux de Chômage',
      align: 'right',
      render: r => (
        <span className={`font-semibold ${r.unemploymentRate > 12 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
          {formatPercent(r.unemploymentRate, locale)}
        </span>
      )
    },
    {
      key: 'underempRate',
      header: isAr ? 'الشغل الناقص' : 'Sous-emploi',
      align: 'right',
      render: r => <span>{r.underempRate ? formatPercent(r.underempRate, locale) : '—'}</span>
    },
    {
      key: 'servicesShare',
      header: isAr ? 'حصة الخدمات' : 'Part Services',
      align: 'right',
      render: r => <span>{formatPercent(r.servicesShare, locale)}</span>
    },
    {
      key: 'agriShare',
      header: isAr ? 'حصة الفلاحة' : 'Part Agri',
      align: 'right',
      render: r => <span>{formatPercent(r.agriShare, locale)}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'المسار التاريخي الشامل لسوق الشغل (2019–2025)' : 'Trajectoire Historique Consolidée (2019–2025)'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr 
            ? 'تتبع تطور المؤشرات الهيكلية للتشغيل والنشاط والبطالة قبل الجائحة، مرحلة التعافي وذروة 2025.'
            : 'Évolution structurelle pré-pandémie (2019), choc Covid (2020), cycle de reprise et consolidation 2025.'}
        </p>
      </div>

      <TimeSeriesChart height={400} />

      <DataTable
        title={isAr ? 'المصفوفة الزمنية السنوية لمؤشرات سوس ماسة' : 'Matrice Chronologique des Indicateurs Régionaux'}
        subtitle={isAr ? 'بيانات البحث الوطني حول التشغيل (المندوبية السامية للتخطيط)' : 'Source: HCP - Enquête Nationale sur l’Emploi'}
        data={tableData}
        columns={columns}
        pageSize={10}
        exportFileName="souss_massa_historique_2019_2025.csv"
      />
    </div>
  );
};
