'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { getProvincesList } from '@/lib/data-service';
import { RotateCcw, Filter, Calendar, MapPin, Layers } from 'lucide-react';
import { TerritoryCode } from '@/types/dataset';

export const GlobalFilterBar: React.FC = () => {
  const { filters, updateFilter, resetFilters, t, locale } = useApp();
  const provinces = getProvincesList();

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

  return (
    <div className="bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Filter Title & Active Indicators */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
          <Filter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
            {t.filtersLabel} :
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Year selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <select
              value={filters.year}
              onChange={e => updateFilter('year', Number(e.target.value))}
              aria-label={t.filterYear}
              className="bg-transparent text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {y} {y === 2025 ? (locale === 'ar' ? '(الأحدث)' : '(Dernière année)') : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Territory selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <select
              value={filters.territory}
              onChange={e => updateFilter('territory', e.target.value as TerritoryCode)}
              aria-label={t.filterProvince}
              className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="SM" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {locale === 'ar' ? 'جهة سوس ماسة (مجموع الجهة)' : 'Souss-Massa (Total Région)'}
              </option>
              {provinces.map(p => (
                <option key={p.code} value={p.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {locale === 'ar' ? p.name_ar : p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Milieu selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1">
            <Layers className="w-3 h-3 text-slate-400" />
            <select
              value={filters.milieu}
              onChange={e => updateFilter('milieu', e.target.value as any)}
              aria-label={t.filterMilieu}
              className="bg-transparent text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="total" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {t.allMilieus}
              </option>
              <option value="urban" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {t.urban}
              </option>
              <option value="rural" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {t.rural}
              </option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            title={t.resetFilters}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">{t.resetFilters}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
