'use client';

import React, { useMemo } from 'react';
import { EChartsWrapper } from './EChartsWrapper';
import { useApp } from '@/lib/app-context';
import { regionalData } from '@/lib/data-service';
import * as echarts from 'echarts';

interface DemographicCohortPlotProps {
  year?: number;
  height?: number | string;
  className?: string;
}

export const DemographicCohortPlot: React.FC<DemographicCohortPlotProps> = ({
  year = 2025,
  height = 360,
  className = ''
}) => {
  const { locale, theme } = useApp();
  const isDark = theme === 'dark';
  const isAr = locale === 'ar';

  const d = regionalData.series[year] || regionalData.series[2025];

  const cohorts = [
    { key: 'age_15_24', label: '15–24 ans', labelAr: '15-24 سنة' },
    { key: 'age_25_34', label: '25–34 ans', labelAr: '25-34 سنة' },
    { key: 'age_35_44', label: '35–44 ans', labelAr: '35-44 سنة' },
    { key: 'age_45_plus', label: '45 ans et plus', labelAr: '45 سنة فما فوق' }
  ];

  const chartOption: echarts.EChartsOption = useMemo(() => {
    const activityRates = [
      d.activity_rate.by_age.age_15_24.total,
      d.activity_rate.by_age.age_25_34.total,
      d.activity_rate.by_age.age_35_44.total,
      d.activity_rate.by_age.age_45_plus.total
    ];

    const employmentRates = [
      d.employment_rate.by_age.age_15_24.total,
      d.employment_rate.by_age.age_25_34.total,
      d.employment_rate.by_age.age_35_44.total,
      d.employment_rate.by_age.age_45_plus.total
    ];

    const unemploymentRates = [
      d.unemployment_rate.by_age.age_15_24.total,
      d.unemployment_rate.by_age.age_25_34.total,
      d.unemployment_rate.by_age.age_35_44.total,
      d.unemployment_rate.by_age.age_45_plus.total
    ];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderColor: isDark ? '#334155' : '#E2E8F0',
        textStyle: { color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 12 }
      },
      legend: {
        bottom: 0,
        textStyle: { color: isDark ? '#CBD5E1' : '#475569', fontSize: 11 }
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '10%',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: cohorts.map(c => isAr ? c.labelAr : c.label),
        axisLine: { lineStyle: { color: isDark ? '#334155' : '#CBD5E1' } },
        axisLabel: { color: isDark ? '#94A3B8' : '#64748B', fontWeight: 'bold' }
      },
      yAxis: {
        type: 'value',
        max: 70,
        axisLabel: {
          color: isDark ? '#94A3B8' : '#64748B',
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#1E293B' : '#F1F5F9',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: isAr ? 'معدل النشاط' : 'Taux d’Activité',
          type: 'bar',
          data: activityRates,
          itemStyle: { color: '#0284C7' }
        },
        {
          name: isAr ? 'معدل التشغيل' : 'Taux d’Emploi',
          type: 'bar',
          data: employmentRates,
          itemStyle: { color: '#059669' }
        },
        {
          name: isAr ? 'معدل البطالة' : 'Taux de Chômage',
          type: 'line',
          data: unemploymentRates,
          symbolSize: 8,
          itemStyle: { color: '#E11D48' },
          lineStyle: { width: 3 }
        }
      ]
    };
  }, [d, isDark, isAr]);

  return (
    <div className={`p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {locale === 'ar' ? `الملامح العمرية للتشغيل والبطالة (${year})` : `Profils par Cohortes d’Âge (${year})`}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {locale === 'ar' ? 'مقارنة معدلات النشاط، التشغيل والبطالة حسب الفئات العمرية' : 'Activité, emploi et chômage selon les 4 tranches d’âge'}
        </p>
      </div>

      <EChartsWrapper option={chartOption} height={height} />
    </div>
  );
};
