'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData } from '@/lib/data-service';
import { formatPercent } from '@/lib/formatters';
import { DemographicCohortPlot } from '../charts/DemographicCohortPlot';
import { StatCard } from '../ui/StatCard';
import { GraduationCap, Users, AlertTriangle } from 'lucide-react';

export const AgeEducationView: React.FC = () => {
  const { locale } = useApp();
  const isAr = locale === 'ar';
  const d2025 = regionalData.series[2025];

  const youthUnemp = d2025.unemployment_rate.by_age.age_15_24.total;
  const dipUnemp = d2025.unemployment_rate.by_diploma.with_diploma?.total || 16.8;
  const noDipUnemp = d2025.unemployment_rate.by_diploma.no_diploma.total;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'الفئات العمرية ومفارقة الشهادات والتأهيل' : 'Cohortes d’Âge & Paradoxe du Diplôme'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'تحليل إدماج الشباب وحاملي الشهادات مقارنة بغير الحاصلين على دبلوم في النسيج الاقتصادي الجهوي.'
            : 'Insertion des jeunes de 15–24 ans et diagnostic du chômage qualifié à Souss-Massa.'}
        </p>
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={isAr ? 'بطالة الشباب (15–24 سنة)' : 'Chômage des Jeunes (15–24 ans)'}
          value={formatPercent(youthUnemp, locale)}
          secondaryText={isAr ? 'حضري: 39.3% | قروي: 26.7%' : 'Urbain: 39.3% | Rural: 26.7%'}
          variant="accent"
        />

        <StatCard
          title={isAr ? 'بطالة حاملي الشهادات' : 'Chômage des Diplômés'}
          value={formatPercent(dipUnemp, locale)}
          secondaryText={isAr ? 'حضري: 17.9% | قروي: 13.1%' : 'Urbain: 17.9% | Rural: 13.1%'}
        />

        <StatCard
          title={isAr ? 'بطالة غير حاملي الشهادات' : 'Chômage Non-Diplômés'}
          value={formatPercent(noDipUnemp, locale)}
          secondaryText={isAr ? 'امتصاص سريع في القطاع غير المهيكل' : 'Insertion rapide travail manuel/informel'}
        />
      </div>

      {/* Cohort Chart Component */}
      <DemographicCohortPlot year={2025} />
    </div>
  );
};
