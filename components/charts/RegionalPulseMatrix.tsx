'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { getProvincesList, jobCreationData, provincialData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatDelta } from '@/lib/formatters';
import { TerritoryCode } from '@/types/dataset';
import { TrendingUp, TrendingDown, MapPin, Users, Briefcase, Award } from 'lucide-react';

interface RegionalPulseMatrixProps {
  onSelectProvince?: (code: TerritoryCode) => void;
  className?: string;
}

export const RegionalPulseMatrix: React.FC<RegionalPulseMatrixProps> = ({
  onSelectProvince,
  className = ''
}) => {
  const { filters, updateFilter, locale, setActiveView } = useApp();
  const provinces = getProvincesList();
  
  // Total regional jobs
  const smData = jobCreationData.territories.find(t => t.code === 'SM');
  const totalRegionalJobs = smData?.net_jobs_created.total_2023_2025 || 41911;

  const handleSelect = (code: TerritoryCode) => {
    updateFilter('territory', code);
    if (onSelectProvince) {
      onSelectProvince(code);
    }
  };

  return (
    <div className={`border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 rounded-md overflow-hidden ${className}`}>
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              {locale === 'ar' ? 'مصفوفة النبض الإقليمي لسوس ماسة' : 'Pulsar Territorial de Souss-Massa'}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-semibold rounded">
              6 Territoires
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {locale === 'ar' 
              ? 'ديناميكية التشغيل، صافي المناصب المحدثة 2023-2025 ومؤشرات الأقاليم' 
              : 'Dynamique d’emploi, création nette 2023–2025 et contribution au total régional (+41 911 emplois)'}
          </p>
        </div>

        <button
          onClick={() => setActiveView('territories')}
          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>{locale === 'ar' ? 'استكشاف تفصيلي للأقاليم ←' : 'Explorer les profils provinciaux →'}</span>
        </button>
      </div>

      {/* Grid of 6 provinces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-slate-800">
        {provinces.map((prov, idx) => {
          const isSelected = filters.territory === prov.code;
          const shareOfRegionalJobs = Math.round((prov.net_jobs_created.total_2023_2025 / totalRegionalJobs) * 1000) / 10;
          const isPositive = prov.net_jobs_created.total_2023_2025 > 0;
          
          // Provincial 2023 rate data
          const p2023 = provincialData.provinces[prov.name];
          const unempRate2023 = p2023?.unemployment_rate?.total;
          const unempSign = p2023?.unemployment_rate?.total_sign;

          return (
            <div
              key={prov.code}
              onClick={() => handleSelect(prov.code)}
              className={`p-4 cursor-pointer transition-all border-b md:border-b-0 ${
                isSelected
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-inset ring-amber-500/50'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {/* Province Title & Rank */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {locale === 'ar' ? prov.name_ar : prov.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {prov.type} • {locale === 'ar' ? `الساكنة 15+: ${formatNumber(prov.pop_15_plus.y2024, locale)}` : `Pop 15+: ${formatNumber(prov.pop_15_plus.y2024, locale)}`}
                  </span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {prov.code}
                </span>
              </div>

              {/* Core metrics comparison */}
              <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                    {locale === 'ar' ? 'معدل التشغيل 2025' : 'Taux Emploi 2025'}
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100 tnum">
                    {formatPercent(prov.employment_rate.y2025, locale)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {formatDelta(prov.employment_rate.y2025 - prov.employment_rate.y2023, true, locale)} vs 2023
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                    {locale === 'ar' ? 'المناصب 2023-2025' : 'Créations Nettes'}
                  </span>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                    <span className={`text-base font-bold tnum ${
                      isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                    }`}>
                      {prov.net_jobs_created.total_2023_2025 > 0 ? '+' : ''}
                      {formatNumber(prov.net_jobs_created.total_2023_2025, locale)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {shareOfRegionalJobs}% {locale === 'ar' ? 'من الجهة' : 'du total rég.'}
                  </span>
                </div>
              </div>

              {/* Progress bar of contribution */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{locale === 'ar' ? 'المساهمة في التشغيل الجهوي' : 'Poids dans la création d’emplois'}</span>
                  <span className="font-mono font-semibold">{shareOfRegionalJobs}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isPositive ? 'bg-amber-600 dark:bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(4, Math.min(100, Math.abs(shareOfRegionalJobs)))}%` }}
                  />
                </div>
              </div>

              {/* Secondary rates info */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                  {locale === 'ar' ? 'المشتغلون 2025:' : 'Actifs occupés 2025:'}{' '}
                  <strong className="text-slate-800 dark:text-slate-200 tnum">
                    {formatNumber(prov.employment_count.y2025, locale)}
                  </strong>
                </span>
                {unempRate2023 !== undefined && (
                  <span className="text-[10px]">
                    {locale === 'ar' ? 'البطالة 2023:' : 'Chômage 2023:'}{' '}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {formatPercent(unempRate2023, locale)} {unempSign && `(${unempSign})`}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
