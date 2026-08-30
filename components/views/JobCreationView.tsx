'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { jobCreationData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatDelta } from '@/lib/formatters';
import { EChartsWrapper } from '../charts/EChartsWrapper';
import { DataTable, ColumnDef } from '../ui/DataTable';
import { StatCard } from '../ui/StatCard';
import { TrendingUp, Award, Layers, BarChart3 } from 'lucide-react';
import * as echarts from 'echarts';

export const JobCreationView: React.FC = () => {
  const { locale, theme } = useApp();
  const isAr = locale === 'ar';
  const isDark = theme === 'dark';

  const smData = jobCreationData.territories.find(t => t.code === 'SM');
  const marocData = jobCreationData.territories.find(t => t.code === 'MAROC');
  const provinces = jobCreationData.territories.filter(t => t.type === 'province' || t.type === 'prefecture');

  const totalRegionalJobs = smData?.net_jobs_created.total_2023_2025 || 41911;
  const nationalShare = Math.round((totalRegionalJobs / (marocData?.net_jobs_created.total_2023_2025 || 76123)) * 1000) / 10;

  // Chart: Provincial Net Job Creation Bar Chart
  const chartOption: echarts.EChartsOption = useMemo(() => {
    const sorted = [...provinces].sort((a, b) => b.net_jobs_created.total_2023_2025 - a.net_jobs_created.total_2023_2025);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderColor: isDark ? '#334155' : '#E2E8F0',
        textStyle: { color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 12 },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return '';
          const p = params[0];
          const item = sorted[p.dataIndex];
          return `<div style="font-weight:bold;margin-bottom:4px;">${isAr ? item.name_ar : item.name}</div>
            <div>2023–2024: <strong>${item.net_jobs_created.diff_2023_2024 > 0 ? '+' : ''}${item.net_jobs_created.diff_2023_2024.toLocaleString()}</strong></div>
            <div>2024–2025: <strong>${item.net_jobs_created.diff_2024_2025 > 0 ? '+' : ''}${item.net_jobs_created.diff_2024_2025.toLocaleString()}</strong></div>
            <div style="margin-top:4px;border-top:1px solid #eee;padding-top:4px;font-weight:bold;color:${p.color};">
              Total 2023–2025: ${item.net_jobs_created.total_2023_2025 > 0 ? '+' : ''}${item.net_jobs_created.total_2023_2025.toLocaleString()} emplois
            </div>`;
        }
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
        data: sorted.map(p => isAr ? p.name_ar : p.name),
        axisLine: { lineStyle: { color: isDark ? '#334155' : '#CBD5E1' } },
        axisLabel: {
          color: isDark ? '#94A3B8' : '#64748B',
          interval: 0,
          rotate: 15,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: isDark ? '#94A3B8' : '#64748B' },
        splitLine: { lineStyle: { color: isDark ? '#1E293B' : '#F1F5F9', type: 'dashed' } }
      },
      series: [
        {
          name: isAr ? 'صافي مناصب الشغل 2023–2025' : 'Créations Nettes 2023–2025',
          type: 'bar',
          data: sorted.map(p => ({
            value: p.net_jobs_created.total_2023_2025,
            itemStyle: {
              color: p.net_jobs_created.total_2023_2025 > 0 ? '#059669' : '#E11D48'
            }
          })),
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => `${params.value > 0 ? '+' : ''}${params.value.toLocaleString()}`,
            color: isDark ? '#CBD5E1' : '#475569',
            fontSize: 10,
            fontFamily: 'monospace'
          }
        }
      ]
    };
  }, [provinces, isDark, isAr]);

  const columns: ColumnDef<any>[] = [
    {
      key: 'name',
      header: isAr ? 'المجال الترابي' : 'Territoire',
      render: r => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
            {r.code}
          </span>
          <strong className="text-slate-900 dark:text-slate-100">{isAr ? r.name_ar : r.name}</strong>
        </div>
      )
    },
    {
      key: 'emp2023',
      header: isAr ? 'تشغيل 2023' : 'Emploi 2023',
      align: 'right',
      render: r => <span>{formatNumber(r.employment_count.y2023, locale)}</span>
    },
    {
      key: 'emp2024',
      header: isAr ? 'تشغيل 2024' : 'Emploi 2024',
      align: 'right',
      render: r => <span>{formatNumber(r.employment_count.y2024, locale)}</span>
    },
    {
      key: 'emp2025',
      header: isAr ? 'تشغيل 2025' : 'Emploi 2025',
      align: 'right',
      render: r => <span className="font-semibold">{formatNumber(r.employment_count.y2025, locale)}</span>
    },
    {
      key: 'diff23_24',
      header: isAr ? 'تغير 23-24' : 'Diff. 23–24',
      align: 'right',
      render: r => (
        <span className={r.net_jobs_created.diff_2023_2024 > 0 ? 'text-emerald-700 dark:text-emerald-400 font-mono' : 'text-rose-700 dark:text-rose-400 font-mono'}>
          {r.net_jobs_created.diff_2023_2024 > 0 ? '+' : ''}{formatNumber(r.net_jobs_created.diff_2023_2024, locale)}
        </span>
      )
    },
    {
      key: 'diff24_25',
      header: isAr ? 'تغير 24-25' : 'Diff. 24–25',
      align: 'right',
      render: r => (
        <span className={r.net_jobs_created.diff_2024_2025 > 0 ? 'text-emerald-700 dark:text-emerald-400 font-mono' : 'text-rose-700 dark:text-rose-400 font-mono'}>
          {r.net_jobs_created.diff_2024_2025 > 0 ? '+' : ''}{formatNumber(r.net_jobs_created.diff_2024_2025, locale)}
        </span>
      )
    },
    {
      key: 'total23_25',
      header: isAr ? 'صافي 2023–2025' : 'Cumul 2023–2025',
      align: 'right',
      render: r => (
        <span className={`font-bold font-mono ${r.net_jobs_created.total_2023_2025 > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
          {r.net_jobs_created.total_2023_2025 > 0 ? '+' : ''}{formatNumber(r.net_jobs_created.total_2023_2025, locale)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'ديناميكية إحداث مناصب الشغل (2023–2025)' : 'Dynamique de Création Nette d’Emplois (2023–2025)'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'تحليل تطور صافي مناصب الشغل المحدثة لكل إقليم ومقارنتها بالمستوى الوطني والجهوي.'
            : 'Modélisation basée sur le RGPH 2024 et les taux d’emploi annuels de l’ENE (HCP).'}
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={isAr ? 'مجموع مناصب سوس ماسة (2023–2025)' : 'Créations Nettes Souss-Massa'}
          value="+41 911"
          unit="postes"
          delta={{
            value: '+13 829',
            isPositiveGood: true,
            period: 'en 2024–2025'
          }}
          secondaryText={isAr ? '+28.082 في 2023-2024' : '+28 082 en 2023–2024'}
          variant="accent"
        />

        <StatCard
          title={isAr ? 'المساهمة في الصعيد الوطني' : 'Contribution Nationale'}
          value={`${nationalShare}%`}
          unit="du Maroc"
          secondaryText={isAr ? 'من أصل +76.123 منصب بالمغرب' : 'Sur un total Maroc de +76 123 emplois'}
        />

        <StatCard
          title={isAr ? 'الإقليم الأكثر إحداثاً للمناصب' : 'Premier Moteur Provincial'}
          value="Taroudannt"
          unit="+17 298"
          secondaryText={isAr ? 'متبوع بأكادير إداوتنان (+16.398)' : 'Suivi par Agadir (+16 398)'}
        />
      </div>

      {/* Bar chart of job creation by province */}
      <div className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
          {isAr ? 'ترتيب الأقاليم حسب صافي مناصب الشغل المحدثة (2023–2025)' : 'Classement Provincial des Créations Nettes d’Emplois (2023–2025)'}
        </h3>
        <EChartsWrapper option={chartOption} height={340} />
      </div>

      {/* Full detailed job creation table */}
      <DataTable
        title={isAr ? 'المصفوفة الكاملة للتشغيل وإحداث المناصب حسب الأقاليم (2023–2025)' : 'Matrice Détaillée Emploi & Création de Postes par Province (2023–2025)'}
        subtitle="Source: HCP - RGPH 2024 / ENE 2023–2025"
        data={jobCreationData.territories}
        columns={columns}
        pageSize={8}
        exportFileName="souss_massa_creation_emplois_2023_2025.csv"
      />
    </div>
  );
};
