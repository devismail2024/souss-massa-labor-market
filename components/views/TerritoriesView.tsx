'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { getProvincesList, provincialData, jobCreationData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatPoints, formatDelta } from '@/lib/formatters';
import { TerritorialChoropleth } from '../charts/TerritorialChoropleth';
import { DataTable, ColumnDef } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { StatCard } from '../ui/StatCard';
import { TerritoryCode } from '@/types/dataset';
import { MapPin, TrendingUp, Users, Award } from 'lucide-react';

export const TerritoriesView: React.FC = () => {
  const { locale, filters, updateFilter } = useApp();
  const isAr = locale === 'ar';

  const provinces = getProvincesList();
  const selectedProv = provinces.find(p => p.code === filters.territory) || provinces[0];

  interface ProvRow {
    code: TerritoryCode;
    name: string;
    nameAr: string;
    type: string;
    pop15_2024: number;
    empRate2025: number;
    empCount2025: number;
    netJobs2023_2025: number;
    shareOfRegion: number;
    actRate2023?: number | null;
    unempRate2023?: number | null;
    unempSign2023?: string;
  }

  const smData = jobCreationData.territories.find(t => t.code === 'SM');
  const regionalTotalJobs = smData?.net_jobs_created.total_2023_2025 || 41911;

  const tableData: ProvRow[] = provinces.map(p => {
    const p2023 = provincialData.provinces[p.name];
    const share = Math.round((p.net_jobs_created.total_2023_2025 / regionalTotalJobs) * 1000) / 10;
    return {
      code: p.code,
      name: p.name,
      nameAr: p.name_ar,
      type: p.type,
      pop15_2024: p.pop_15_plus.y2024,
      empRate2025: p.employment_rate.y2025,
      empCount2025: p.employment_count.y2025,
      netJobs2023_2025: p.net_jobs_created.total_2023_2025,
      shareOfRegion: share,
      actRate2023: p2023?.activity_rate?.total,
      unempRate2023: p2023?.unemployment_rate?.total,
      unempSign2023: p2023?.unemployment_rate?.total_sign
    };
  });

  const columns: ColumnDef<ProvRow>[] = [
    {
      key: 'name',
      header: isAr ? 'الإقليم / العمالة' : 'Territoire',
      render: r => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
            {r.code}
          </span>
          <div>
            <strong className="text-slate-900 dark:text-slate-100 font-bold">
              {isAr ? r.nameAr : r.name}
            </strong>
            <span className="text-[10px] text-slate-400 block">{r.type}</span>
          </div>
        </div>
      )
    },
    {
      key: 'empRate2025',
      header: isAr ? 'معدل التشغيل 2025' : 'Taux d’Emploi 2025',
      align: 'right',
      render: r => (
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {formatPercent(r.empRate2025, locale)}
        </span>
      )
    },
    {
      key: 'empCount2025',
      header: isAr ? 'المشتغلون 2025' : 'Actifs Occupés 2025',
      align: 'right',
      render: r => <span>{formatNumber(r.empCount2025, locale)}</span>
    },
    {
      key: 'netJobs2023_2025',
      header: isAr ? 'صافي المناصب (23-25)' : 'Créations Nettes (23–25)',
      align: 'right',
      render: r => (
        <span className={`font-bold ${r.netJobs2023_2025 > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
          {r.netJobs2023_2025 > 0 ? '+' : ''}{formatNumber(r.netJobs2023_2025, locale)}
        </span>
      )
    },
    {
      key: 'shareOfRegion',
      header: isAr ? 'الحصة من الجهة' : 'Part Régionale',
      align: 'right',
      render: r => <span className="font-mono font-semibold">{r.shareOfRegion}%</span>
    },
    {
      key: 'pop15_2024',
      header: isAr ? 'الساكنة 15+ (2024)' : 'Pop. 15+ (2024)',
      align: 'right',
      render: r => <span>{formatNumber(r.pop15_2024, locale)}</span>
    },
    {
      key: 'unempRate2023',
      header: isAr ? 'البطالة 2023' : 'Chômage 2023',
      align: 'right',
      render: r => (
        <div className="flex items-center justify-end gap-1">
          <span>{r.unempRate2023 !== null && r.unempRate2023 !== undefined ? formatPercent(r.unempRate2023, locale) : '—'}</span>
          {r.unempSign2023 && <Badge sign={r.unempSign2023} />}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'الذكاء الإقليمي والتحليل الترابي (6 أقاليم وعمالات)' : 'Intelligence Territoriale & Profils Provinciaux'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr 
            ? 'مقارنة ديناميكيات التشغيل والساكنة ومعدلات النشاط والبطالة حسب كل إقليم من أقاليم جهة سوس ماسة.'
            : 'Analyse comparative des 6 préfectures et provinces: démographie RGPH 2024, taux d’emploi 2025 et créations nettes.'}
        </p>
      </div>

      {/* Interactive Choropleth Map Component */}
      <TerritorialChoropleth />

      {/* Full Analytical Table */}
      <DataTable
        title={isAr ? 'جدول المقارنة الإقليمية الشاملة' : 'Tableau de Synthèse des 6 Provinces & Préfectures'}
        subtitle={isAr ? 'المصدر: الإحصاء العام للسكان 2024 والبحث الوطني حول التشغيل' : 'Source: HCP - RGPH 2024 & Enquête Nationale sur l’Emploi 2023–2025'}
        data={tableData}
        columns={columns}
        pageSize={6}
        exportFileName="souss_massa_provinces.csv"
      />
    </div>
  );
};
