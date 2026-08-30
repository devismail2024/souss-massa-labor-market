'use client';

import React, { useMemo, useState } from 'react';
import { EChartsWrapper } from './EChartsWrapper';
import { useApp } from '@/lib/app-context';
import { regionalData } from '@/lib/data-service';
import { SegmentControl } from '../ui/SegmentControl';
import { formatPercent } from '@/lib/formatters';
import * as echarts from 'echarts';

interface SectorCompositionChartProps {
  height?: number | string;
  className?: string;
}

export const SectorCompositionChart: React.FC<SectorCompositionChartProps> = ({
  height = 360,
  className = ''
}) => {
  const { locale, theme, filters } = useApp();
  const [viewMode, setViewMode] = useState<'multiyear' | 'milieu2025'>('multiyear');

  const isDark = theme === 'dark';
  const isAr = locale === 'ar';

  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

  const chartOption: echarts.EChartsOption = useMemo(() => {
    const sectorColors = {
      services: '#B45309',       // Warm terracotta / amber
      agriculture: '#059669',    // Souss emerald
      construction: '#2563EB',   // Infrastructure royal blue
      industry: '#64748B'        // Slate industrial
    };

    if (viewMode === 'multiyear') {
      const services = years.map(y => regionalData.series[y]?.sector_shares_pct.services.total || 0);
      const agriculture = years.map(y => regionalData.series[y]?.sector_shares_pct.agriculture.total || 0);
      const construction = years.map(y => regionalData.series[y]?.sector_shares_pct.construction.total || 0);
      const industry = years.map(y => regionalData.series[y]?.sector_shares_pct.industry.total || 0);

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E2E8F0',
          textStyle: { color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 12 },
          formatter: (params: any) => {
            if (!Array.isArray(params)) return '';
            const year = params[0].axisValue;
            let html = `<div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid ${isDark ? '#334155' : '#E2E8F0'};padding-bottom:4px;">Structure Sectorielle ${year}</div>`;
            params.forEach((item: any) => {
              html += `<div style="display:flex;justify-content:space-between;gap:16px;margin-top:2px;">
                <span style="display:flex;align-items:center;gap:6px;">
                  <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${item.color};"></span>
                  <span>${item.seriesName}</span>
                </span>
                <strong style="font-family:monospace;">${item.value}%</strong>
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
          top: '8%',
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
          max: 100,
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
            name: isAr ? 'الخدمات' : 'Services',
            type: 'bar',
            stack: 'total',
            data: services,
            itemStyle: { color: sectorColors.services }
          },
          {
            name: isAr ? 'الفلاحة والصيد' : 'Agriculture & Pêche',
            type: 'bar',
            stack: 'total',
            data: agriculture,
            itemStyle: { color: sectorColors.agriculture }
          },
          {
            name: isAr ? 'البناء والأشغال (BTP)' : 'BTP / Construction',
            type: 'bar',
            stack: 'total',
            data: construction,
            itemStyle: { color: sectorColors.construction }
          },
          {
            name: isAr ? 'الصناعة والحرف' : 'Industrie & Artisanat',
            type: 'bar',
            stack: 'total',
            data: industry,
            itemStyle: { color: sectorColors.industry }
          }
        ]
      };
    } else {
      // 2025 Milieu Comparison (Urban vs Rural vs Total)
      const d2025 = regionalData.series[2025];
      const categories = [isAr ? 'حضري' : 'Urbain', isAr ? 'قروي' : 'Rural', isAr ? 'مجموع الجهة' : 'Ensemble'];
      
      const s = d2025.sector_shares_pct;
      const services = [s.services.urban, s.services.rural, s.services.total];
      const agriculture = [s.agriculture.urban, s.agriculture.rural, s.agriculture.total];
      const btp = [s.construction.urban, s.construction.rural, s.construction.total];
      const industry = [s.industry.urban, s.industry.rural, s.industry.total];

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
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
          top: '8%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLine: { lineStyle: { color: isDark ? '#334155' : '#CBD5E1' } },
          axisLabel: { color: isDark ? '#94A3B8' : '#64748B', fontWeight: 'bold' }
        },
        yAxis: {
          type: 'value',
          max: 100,
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
            name: isAr ? 'الخدمات' : 'Services',
            type: 'bar',
            stack: 'milieu',
            data: services,
            itemStyle: { color: sectorColors.services }
          },
          {
            name: isAr ? 'الفلاحة والصيد' : 'Agriculture & Pêche',
            type: 'bar',
            stack: 'milieu',
            data: agriculture,
            itemStyle: { color: sectorColors.agriculture }
          },
          {
            name: isAr ? 'البناء والأشغال (BTP)' : 'BTP / Construction',
            type: 'bar',
            stack: 'milieu',
            data: btp,
            itemStyle: { color: sectorColors.construction }
          },
          {
            name: isAr ? 'الصناعة والحرف' : 'Industrie & Artisanat',
            type: 'bar',
            stack: 'milieu',
            data: industry,
            itemStyle: { color: sectorColors.industry }
          }
        ]
      };
    }
  }, [viewMode, isDark, isAr]);

  return (
    <div className={`p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {locale === 'ar' ? 'البنية القطاعية للتشغيل' : 'Structure Sectorielle de l’Emploi (100%)'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {locale === 'ar' ? 'توزيع المشتغلين حسب القطاعات الاقتصادية الكبرى' : 'Répartition des actifs occupés selon les 4 grands secteurs'}
          </p>
        </div>

        <SegmentControl<'multiyear' | 'milieu2025'>
          size="sm"
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: 'multiyear', label: locale === 'ar' ? 'تطور 2019-2025' : 'Évolution 2019–2025' },
            { value: 'milieu2025', label: locale === 'ar' ? 'مقارنة الأوساط 2025' : 'Milieux (Urbain/Rural) 2025' }
          ]}
        />
      </div>

      <EChartsWrapper option={chartOption} height={height} />
    </div>
  );
};
