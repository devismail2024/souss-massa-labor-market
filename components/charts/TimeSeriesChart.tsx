'use client';

import React, { useMemo, useState } from 'react';
import { EChartsWrapper } from './EChartsWrapper';
import { useApp } from '@/lib/app-context';
import { regionalData } from '@/lib/data-service';
import { SegmentControl } from '../ui/SegmentControl';
import { formatPercent, formatThousands, formatDelta } from '@/lib/formatters';
import * as echarts from 'echarts';

type MetricKey = 'employment_rate' | 'activity_rate' | 'unemployment_rate' | 'employed_pop' | 'active_pop';

interface TimeSeriesChartProps {
  title?: string;
  subtitle?: string;
  defaultMetric?: MetricKey;
  height?: number | string;
  className?: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  title,
  subtitle,
  defaultMetric = 'employment_rate',
  height = 360,
  className = ''
}) => {
  const { locale, theme, filters } = useApp();
  const [metric, setMetric] = useState<MetricKey>(defaultMetric);
  const [showUrbanRuralBreakdown, setShowUrbanRuralBreakdown] = useState(true);

  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

  const seriesData = useMemo(() => {
    const totalVals: number[] = [];
    const urbanVals: number[] = [];
    const ruralVals: number[] = [];

    years.forEach(y => {
      const d = regionalData.series[y];
      if (!d) return;

      if (metric === 'employment_rate') {
        totalVals.push(d.employment_rate.total.total);
        urbanVals.push(d.employment_rate.total.urban);
        ruralVals.push(d.employment_rate.total.rural);
      } else if (metric === 'activity_rate') {
        totalVals.push(d.activity_rate.total.total);
        urbanVals.push(d.activity_rate.total.urban);
        ruralVals.push(d.activity_rate.total.rural);
      } else if (metric === 'unemployment_rate') {
        totalVals.push(d.unemployment_rate.total.total);
        urbanVals.push(d.unemployment_rate.total.urban);
        ruralVals.push(d.unemployment_rate.total.rural);
      } else if (metric === 'employed_pop') {
        totalVals.push(d.employed_population_k.total);
        urbanVals.push(d.employed_population_k.urban);
        ruralVals.push(d.employed_population_k.rural);
      } else if (metric === 'active_pop') {
        totalVals.push(d.active_population_k.total);
        urbanVals.push(d.active_population_k.urban);
        ruralVals.push(d.active_population_k.rural);
      }
    });

    return { totalVals, urbanVals, ruralVals };
  }, [metric]);

  const isRate = metric.includes('rate');
  const isDark = theme === 'dark';

  const chartOption: echarts.EChartsOption = useMemo(() => {
    const isAr = locale === 'ar';

    const series: echarts.SeriesOption[] = [
      {
        name: isAr ? 'المجموع الجهوي' : 'Ensemble Souss-Massa',
        type: 'line',
        data: seriesData.totalVals,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#B45309' }, // Souss warm amber
        lineStyle: { width: 3.5 },
        emphasis: { scale: 1.4 },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ],
          symbolSize: 35,
          itemStyle: { color: '#D97706' }
        }
      }
    ];

    if (showUrbanRuralBreakdown) {
      series.push(
        {
          name: isAr ? 'وسط حضري' : 'Milieu Urbain',
          type: 'line',
          data: seriesData.urbanVals,
          smooth: true,
          symbol: 'diamond',
          symbolSize: 6,
          itemStyle: { color: '#2563EB' },
          lineStyle: { width: 2, type: 'dashed' }
        },
        {
          name: isAr ? 'وسط قروي' : 'Milieu Rural',
          type: 'line',
          data: seriesData.ruralVals,
          smooth: true,
          symbol: 'triangle',
          symbolSize: 6,
          itemStyle: { color: '#059669' },
          lineStyle: { width: 2, type: 'dotted' }
        }
      );
    }

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderColor: isDark ? '#334155' : '#E2E8F0',
        textStyle: { color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 12 },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return '';
          const year = params[0].axisValue;
          let html = `<div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid ${isDark ? '#334155' : '#E2E8F0'};padding-bottom:4px;">${year}</div>`;
          params.forEach((item: any) => {
            const formatted = isRate ? `${item.value}%` : `${item.value.toLocaleString()} k`;
            html += `<div style="display:flex;justify-content:space-between;gap:16px;margin-top:2px;">
              <span style="display:flex;align-items:center;gap:6px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};"></span>
                <span>${item.seriesName}</span>
              </span>
              <strong style="font-family:monospace;">${formatted}</strong>
            </div>`;
          });
          return html;
        }
      },
      legend: {
        bottom: 0,
        textStyle: { color: isDark ? '#CBD5E1' : '#475569', fontSize: 11 }
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '12%',
        bottom: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: years.map(String),
        axisLine: { lineStyle: { color: isDark ? '#334155' : '#CBD5E1' } },
        axisLabel: { color: isDark ? '#94A3B8' : '#64748B', fontWeight: 'bold' }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          color: isDark ? '#94A3B8' : '#64748B',
          formatter: (val: number) => isRate ? `${val}%` : `${val}k`
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#1E293B' : '#F1F5F9',
            type: 'dashed'
          }
        }
      },
      series
    };
  }, [seriesData, showUrbanRuralBreakdown, isRate, isDark, locale]);

  return (
    <div className={`p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md ${className}`}>
      {/* Header & metric switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {title || (locale === 'ar' ? 'المسار الزمني للمؤشرات (2019-2025)' : 'Évolution Temporelle Consolidée (2019–2025)')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle || (locale === 'ar' ? 'سلسلة متجانسة من البحث الوطني حول التشغيل (HCP)' : 'Série harmonisée HCP (Enquête Nationale sur l’Emploi)')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SegmentControl<MetricKey>
            size="sm"
            value={metric}
            onChange={setMetric}
            options={[
              { value: 'employment_rate', label: locale === 'ar' ? 'معدل التشغيل' : 'Taux d’Emploi' },
              { value: 'activity_rate', label: locale === 'ar' ? 'معدل النشاط' : 'Taux d’Activité' },
              { value: 'unemployment_rate', label: locale === 'ar' ? 'معدل البطالة' : 'Taux de Chômage' },
              { value: 'employed_pop', label: locale === 'ar' ? 'المشتغلون (بالآلاف)' : 'Emploi (k)' }
            ]}
          />

          <button
            onClick={() => setShowUrbanRuralBreakdown(prev => !prev)}
            className={`px-2.5 py-1 text-xs font-medium border rounded transition-colors ${
              showUrbanRuralBreakdown
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {locale === 'ar' ? 'تفصيل حضري / قروي' : 'Urbain / Rural'}
          </button>
        </div>
      </div>

      <EChartsWrapper option={chartOption} height={height} />
    </div>
  );
};
