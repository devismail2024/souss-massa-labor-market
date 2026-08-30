'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData } from '@/lib/data-service';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { SectorCompositionChart } from '../charts/SectorCompositionChart';
import { DataTable, ColumnDef } from '../ui/DataTable';
import { StatCard } from '../ui/StatCard';
import { Briefcase, Factory, Wheat, Wrench } from 'lucide-react';

export const SectorsView: React.FC = () => {
  const { locale } = useApp();
  const isAr = locale === 'ar';
  const d2025 = regionalData.series[2025];
  const s = d2025.sector_shares_pct;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'البنية والتحولات القطاعية لاقتصاد سوس ماسة' : 'Secteurs d’Activité & Mutations Économiques'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'توزيع المشتغلين حسب القطاعات الأربعة الكبرى: الخدمات، الفلاحة، البناء والصناعة.'
            : 'Évolution de la répartition sectorielle de l’emploi régional (2019–2025).'}
        </p>
      </div>

      {/* 4 Sector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isAr ? 'الخدمات' : 'Services (Tertiaire)'}
          value={formatPercent(s.services.total, locale)}
          secondaryText={isAr ? 'حضري: 61.6% | قروي: 27.7%' : 'Urbain: 61.6% | Rural: 27.7%'}
          variant="accent"
        />

        <StatCard
          title={isAr ? 'الفلاحة والغابات والصيد' : 'Agriculture & Pêche'}
          value={formatPercent(s.agriculture.total, locale)}
          secondaryText={isAr ? 'حضري: 12.5% | قروي: 47.3%' : 'Urbain: 12.5% | Rural: 47.3%'}
        />

        <StatCard
          title={isAr ? 'البناء والأشغال العمومية' : 'BTP / Construction'}
          value={formatPercent(s.construction.total, locale)}
          secondaryText={isAr ? 'حضري: 11.9% | قروي: 17.3%' : 'Urbain: 11.9% | Rural: 17.3%'}
        />

        <StatCard
          title={isAr ? 'الصناعة والحرف' : 'Industrie & Artisanat'}
          value={formatPercent(s.industry.total, locale)}
          secondaryText={isAr ? 'حضري: 14.0% | قروي: 7.6%' : 'Urbain: 14.0% | Rural: 7.6%'}
        />
      </div>

      {/* Sector Charts */}
      <SectorCompositionChart height={380} />
    </div>
  );
};
