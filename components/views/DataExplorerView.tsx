'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData, jobCreationData, provincialData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatPoints } from '@/lib/formatters';
import { EChartsWrapper } from '../charts/EChartsWrapper';
import { DataTable, ColumnDef } from '../ui/DataTable';
import { SegmentControl } from '../ui/SegmentControl';
import { Database, Filter, Download, BarChart2, Table as TableIcon } from 'lucide-react';
import * as echarts from 'echarts';

type ExplorerCategory = 'rates' | 'populations' | 'sectors' | 'demographics' | 'provinces';

export const DataExplorerView: React.FC = () => {
  const { locale, theme } = useApp();
  const isAr = locale === 'ar';
  const isDark = theme === 'dark';

  const [category, setCategory] = useState<ExplorerCategory>('rates');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [viewFormat, setViewFormat] = useState<'chart' | 'table'>('chart');

  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

  // Build dynamic table data based on active category
  const { tableRows, columns, chartOption } = useMemo(() => {
    let rows: any[] = [];
    let cols: ColumnDef<any>[] = [];
    let option: echarts.EChartsOption = {};

    if (category === 'rates') {
      rows = years.map(y => {
        const d = regionalData.series[y];
        return {
          year: y,
          actTotal: d.activity_rate.total.total,
          actUrban: d.activity_rate.total.urban,
          actRural: d.activity_rate.total.rural,
          empTotal: d.employment_rate.total.total,
          empUrban: d.employment_rate.total.urban,
          empRural: d.employment_rate.total.rural,
          unempTotal: d.unemployment_rate.total.total,
          unempUrban: d.unemployment_rate.total.urban,
          unempRural: d.unemployment_rate.total.rural
        };
      });

      cols = [
        { key: 'year', header: isAr ? 'السنة' : 'Année', render: r => <strong className="font-mono text-amber-700 dark:text-amber-400">{r.year}</strong> },
        { key: 'empTotal', header: isAr ? 'معدل التشغيل (إجمالي)' : 'Taux Emploi (Tot)', align: 'right', render: r => <span className="font-bold">{formatPercent(r.empTotal, locale)}</span> },
        { key: 'empUrban', header: isAr ? 'تشغيل (حضري)' : 'Emploi (Urb)', align: 'right', render: r => <span>{formatPercent(r.empUrban, locale)}</span> },
        { key: 'empRural', header: isAr ? 'تشغيل (قروي)' : 'Emploi (Rur)', align: 'right', render: r => <span>{formatPercent(r.empRural, locale)}</span> },
        { key: 'actTotal', header: isAr ? 'معدل النشاط (إجمالي)' : 'Taux Activité (Tot)', align: 'right', render: r => <span>{formatPercent(r.actTotal, locale)}</span> },
        { key: 'unempTotal', header: isAr ? 'معدل البطالة' : 'Taux Chômage', align: 'right', render: r => <span className="text-rose-600 dark:text-rose-400 font-semibold">{formatPercent(r.unempTotal, locale)}</span> }
      ];

      option = {
        tooltip: { trigger: 'axis', backgroundColor: isDark ? '#1E293B' : '#FFFFFF', textStyle: { color: isDark ? '#FFF' : '#000' } },
        legend: { bottom: 0, textStyle: { color: isDark ? '#CBD5E1' : '#475569' } },
        xAxis: { type: 'category', data: years.map(String) },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
        series: [
          { name: 'Taux Emploi', type: 'line', data: rows.map(r => r.empTotal), itemStyle: { color: '#059669' }, lineStyle: { width: 3 } },
          { name: 'Taux Activité', type: 'line', data: rows.map(r => r.actTotal), itemStyle: { color: '#0284C7' }, lineStyle: { width: 2 } },
          { name: 'Taux Chômage', type: 'line', data: rows.map(r => r.unempTotal), itemStyle: { color: '#E11D48' }, lineStyle: { width: 2 } }
        ]
      };
    } else if (category === 'populations') {
      rows = years.map(y => {
        const d = regionalData.series[y];
        return {
          year: y,
          pop15: d.population_15_plus_k.total,
          active: d.active_population_k.total,
          employed: d.employed_population_k.total,
          unemployed: d.unemployed_population_k.total
        };
      });

      cols = [
        { key: 'year', header: isAr ? 'السنة' : 'Année', render: r => <strong className="font-mono">{r.year}</strong> },
        { key: 'pop15', header: isAr ? 'الساكنة 15+ (ألف)' : 'Pop 15+ (k)', align: 'right', render: r => <span>{formatNumber(r.pop15, locale)}</span> },
        { key: 'active', header: isAr ? 'النشيطون (ألف)' : 'Actifs (k)', align: 'right', render: r => <span>{formatNumber(r.active, locale)}</span> },
        { key: 'employed', header: isAr ? 'المشتغلون (ألف)' : 'Actifs occupés (k)', align: 'right', render: r => <span className="font-bold">{formatNumber(r.employed, locale)}</span> },
        { key: 'unemployed', header: isAr ? 'العاطلون (ألف)' : 'Chômeurs (k)', align: 'right', render: r => <span>{formatNumber(r.unemployed, locale)}</span> }
      ];

      option = {
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0, textStyle: { color: isDark ? '#CBD5E1' : '#475569' } },
        xAxis: { type: 'category', data: years.map(String) },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}k' } },
        series: [
          { name: 'Actifs occupés', type: 'bar', stack: 'pop', data: rows.map(r => r.employed), itemStyle: { color: '#059669' } },
          { name: 'Chômeurs', type: 'bar', stack: 'pop', data: rows.map(r => r.unemployed), itemStyle: { color: '#E11D48' } }
        ]
      };
    } else if (category === 'provinces') {
      const provs = jobCreationData.territories.filter(t => t.type === 'province' || t.type === 'prefecture');
      rows = provs.map(p => ({
        code: p.code,
        name: isAr ? p.name_ar : p.name,
        type: p.type,
        pop15: p.pop_15_plus.y2024,
        emp2025: p.employment_count.y2025,
        rate2025: p.employment_rate.y2025,
        jobsCreated: p.net_jobs_created.total_2023_2025
      }));

      cols = [
        { key: 'name', header: isAr ? 'الإقليم' : 'Territoire', render: r => <strong>{r.name}</strong> },
        { key: 'rate2025', header: isAr ? 'معدل التشغيل 2025' : 'Taux Emploi 2025', align: 'right', render: r => <span>{formatPercent(r.rate2025, locale)}</span> },
        { key: 'emp2025', header: isAr ? 'المشتغلون 2025' : 'Emploi 2025', align: 'right', render: r => <span>{formatNumber(r.emp2025, locale)}</span> },
        { key: 'jobsCreated', header: isAr ? 'المناصب (23-25)' : 'Créations Nettes', align: 'right', render: r => <span className="font-bold text-emerald-600">{formatNumber(r.jobsCreated, locale)}</span> }
      ];

      option = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: rows.map(r => r.name) },
        yAxis: { type: 'value' },
        series: [
          { name: 'Créations nettes', type: 'bar', data: rows.map(r => r.jobsCreated), itemStyle: { color: '#B45309' } }
        ]
      };
    }

    return { tableRows: rows, columns: cols, chartOption: option };
  }, [category, isDark, isAr, locale]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'مستكشف البيانات الشامل (Data Explorer)' : 'Explorateur de Données Multi-Dimensionnel'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'استعلام ديناميكي واستخراج مخصص لجميع المؤشرات مع إمكانية التصدير.'
            : 'Requêtage multidimensionnel du modèle de données de l’Observatoire.'}
        </p>
      </div>

      {/* Control Strip */}
      <div className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <SegmentControl<ExplorerCategory>
          size="sm"
          value={category}
          onChange={setCategory}
          options={[
            { value: 'rates', label: isAr ? 'المعدلات الرئيسية' : 'Taux Structurels' },
            { value: 'populations', label: isAr ? 'أحجام الساكنة' : 'Effectifs & Populations' },
            { value: 'provinces', label: isAr ? 'بيانات الأقاليم' : 'Territoires & Provinces' }
          ]}
        />

        <div className="flex items-center gap-2">
          <SegmentControl<'chart' | 'table'>
            size="sm"
            value={viewFormat}
            onChange={setViewFormat}
            options={[
              { value: 'chart', label: isAr ? 'رسم بياني' : 'Graphique' },
              { value: 'table', label: isAr ? 'جدول بيانات' : 'Tableau' }
            ]}
          />
        </div>
      </div>

      {/* View Output */}
      {viewFormat === 'chart' ? (
        <div className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md">
          <EChartsWrapper option={chartOption} height={380} />
        </div>
      ) : (
        <DataTable
          title={isAr ? 'بيانات المستكشف' : 'Données Extraites'}
          data={tableRows}
          columns={columns}
          pageSize={10}
          exportFileName={`souss_massa_explorer_${category}.csv`}
        />
      )}
    </div>
  );
};
