'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData, jobCreationData, provincialData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatDelta, formatPoints } from '@/lib/formatters';
import { generateAutomatedInsights } from '@/lib/calculations';
import { StatCard } from '../ui/StatCard';
import { MetricCallout } from '../ui/MetricCallout';
import { RegionalPulseMatrix } from '../charts/RegionalPulseMatrix';
import { TimeSeriesChart } from '../charts/TimeSeriesChart';
import { SectorCompositionChart } from '../charts/SectorCompositionChart';
import { TrendingUp, Users, Briefcase, Award, ArrowUpRight } from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { filters, locale, setActiveView, updateFilter } = useApp();
  const d2025 = regionalData.series[2025];
  const d2024 = regionalData.series[2024];

  const insights = generateAutomatedInsights(regionalData, jobCreationData, provincialData);

  const empDiff = (d2025.employed_population_k.total - d2024.employed_population_k.total) * 1000;
  const empRateDiff = Math.round((d2025.employment_rate.total.total - d2024.employment_rate.total.total) * 10) / 10;
  const actRateDiff = Math.round((d2025.activity_rate.total.total - d2024.activity_rate.total.total) * 10) / 10;
  const unempRateDiff = Math.round((d2025.unemployment_rate.total.total - d2024.unemployment_rate.total.total) * 10) / 10;

  const smJobs = jobCreationData.territories.find(t => t.code === 'SM');
  const nationalJobs = jobCreationData.territories.find(t => t.code === 'MAROC');
  const regionalShareOfNational = smJobs && nationalJobs 
    ? Math.round((smJobs.net_jobs_created.total_2023_2025 / nationalJobs.net_jobs_created.total_2023_2025) * 1000) / 10 
    : 55.1;

  return (
    <div className="space-y-6">
      {/* Editorial Lead Banner */}
      <div className="p-6 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/60">
                {locale === 'ar' ? 'تقرير الذكاء الاقتصادي 2025' : 'Situation Économique & Marché du Travail 2025'}
              </span>
              <span className="text-xs text-slate-400 font-mono">HCP / ENE 2025</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {locale === 'ar' ? (
                <>848.000 مشتغل بسوس ماسة و +41.911 منصب صافٍ محدث (2023–2025)</>
              ) : (
                <>848 000 actifs occupés et +41 911 créations nettes d’emplois à Souss-Massa</>
              )}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {locale === 'ar' ? (
                <>
                  تسجل جهة سوس ماسة في سنة 2025 معدل تشغيل يبلغ <strong className="text-slate-900 dark:text-white">36,0%</strong> (+0,6 نقطة مقارنة مع 2024) ومعدل بطالة مستقر في <strong className="text-slate-900 dark:text-white">11,1%</strong>. وساهمت الجهة بنسبة <strong className="text-amber-700 dark:text-amber-400 font-bold">{regionalShareOfNational}%</strong> من مجموع صافي مناصب الشغل المحدثة على الصعيد الوطني بين 2023 و 2025.
                </>
              ) : (
                <>
                  La région enregistre en 2025 un taux d'emploi de <strong className="text-slate-900 dark:text-white">36,0%</strong> (+0,6 pt vs 2024) et un taux de chômage en repli à <strong className="text-slate-900 dark:text-white">11,1%</strong> (-1,2 pt). Souss-Massa concentre <strong className="text-amber-700 dark:text-amber-400 font-bold">{regionalShareOfNational}%</strong> des créations nettes d’emplois du Maroc sur 2023–2025.
                </>
              )}
            </p>
          </div>

          {/* Souss-Massa National Contribution Badge Block */}
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-md shrink-0 lg:w-72">
            <div className="flex items-center gap-2 mb-1 text-amber-800 dark:text-amber-300">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {locale === 'ar' ? 'المحرك الوطني للتشغيل' : 'Moteur Régional'}
              </span>
            </div>
            <div className="text-2xl font-black text-amber-900 dark:text-amber-200 tnum">
              +41 911 <span className="text-xs font-normal font-sans">emplois</span>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1 leading-snug">
              {locale === 'ar'
                ? `ما يعادل ${regionalShareOfNational}% من إجمالي مناصب الشغل بالمغرب (+76.123)`
                : `Soit ${regionalShareOfNational}% des créations nettes nationales (+76 123)`}
            </p>
            <button
              onClick={() => setActiveView('job_creation')}
              className="mt-3 text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>{locale === 'ar' ? 'تفاصيل إحداث المناصب ←' : 'Détail créations nettes →'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Key Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={locale === 'ar' ? 'الساكنة المشتغلة (2025)' : 'Actifs Occupés (2025)'}
          value="848 000"
          unit="personnes"
          delta={{
            value: `+${empDiff.toLocaleString('fr-FR')}`,
            isPositiveGood: true,
            period: 'vs 2024'
          }}
          secondaryText={locale === 'ar' ? 'حضري: 570k | قروي: 277k' : 'Urbain: 570k | Rural: 277k'}
          variant="accent"
        />

        <StatCard
          title={locale === 'ar' ? 'معدل التشغيل (2025)' : 'Taux d’Emploi (2025)'}
          value="36.0"
          unit="%"
          delta={{
            value: formatPoints(empRateDiff, locale),
            isPositiveGood: true,
            period: 'vs 2024'
          }}
          secondaryText={locale === 'ar' ? 'ذكور: 61.8% | إناث: 11.5%' : 'Hommes: 61.8% | Femmes: 11.5%'}
        />

        <StatCard
          title={locale === 'ar' ? 'معدل النشاط (2025)' : 'Taux d’Activité (2025)'}
          value="40.4"
          unit="%"
          delta={{
            value: formatPoints(actRateDiff, locale),
            isPositiveGood: true,
            period: 'vs 2024'
          }}
          secondaryText={locale === 'ar' ? 'مجموع الساكنة النشيطة: 953k' : 'Pop. active: 953 000'}
        />

        <StatCard
          title={locale === 'ar' ? 'معدل البطالة (2025)' : 'Taux de Chômage (2025)'}
          value="11.1"
          unit="%"
          delta={{
            value: formatPoints(unempRateDiff, locale),
            isPositiveGood: true,
            period: 'vs 2024'
          }}
          secondaryText={locale === 'ar' ? 'حضري: 13.1% | قروي: 6.6%' : 'Urbain: 13.1% | Rural: 6.6%'}
        />
      </div>

      {/* Visual Signature: Regional Pulse Matrix */}
      <RegionalPulseMatrix />

      {/* Automated Micro-Insights Grid */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {locale === 'ar' ? 'استنتاجات وحقائق إحصائية مستخلصة' : 'Analyses & Faits Statistiques Clés'}
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Calculs rigoureux ENE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.map(item => (
            <MetricCallout
              key={item.id}
              type={item.type}
              text={locale === 'ar' ? item.textAr : item.textFr}
              metric={item.metric}
              badge={item.badge}
            />
          ))}
        </div>
      </div>

      {/* Charts Dual Composition: Multi-Year Trajectory & Sector Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TimeSeriesChart />
        </div>
        <div className="lg:col-span-5">
          <SectorCompositionChart />
        </div>
      </div>
    </div>
  );
};
