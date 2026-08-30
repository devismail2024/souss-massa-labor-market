'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { getProvincesList, jobCreationData, provincialData } from '@/lib/data-service';
import { formatNumber, formatPercent, formatDelta } from '@/lib/formatters';
import { TerritoryCode } from '@/types/dataset';
import { SegmentControl } from '../ui/SegmentControl';
import { MapPin, Users, Briefcase, TrendingUp } from 'lucide-react';

interface TerritorialChoroplethProps {
  onSelectProvince?: (code: TerritoryCode) => void;
  className?: string;
}

type MapMetric = 'jobs' | 'rate_2025' | 'pop_15' | 'unemp_2023';

export const TerritorialChoropleth: React.FC<TerritorialChoroplethProps> = ({
  onSelectProvince,
  className = ''
}) => {
  const { filters, updateFilter, locale } = useApp();
  const [metric, setMetric] = useState<MapMetric>('jobs');
  const [hoveredCode, setHoveredCode] = useState<TerritoryCode | null>(null);

  const provinces = getProvincesList();

  // Province SVG Geometry Definitions (Relative coordinate layout matching true spatial arrangement of Souss-Massa)
  const provinceGeometries: Record<string, { path: string; labelX: number; labelY: number }> = {
    // Agadir-Ida-Ou-Tanane (Coastal North)
    AIO: {
      path: 'M 160 100 L 220 90 L 240 140 L 200 170 L 160 150 Z',
      labelX: 195,
      labelY: 135
    },
    // Inezgane-Ait Melloul (Small coastal plain south of Agadir)
    IAM: {
      path: 'M 160 150 L 200 170 L 195 200 L 155 180 Z',
      labelX: 175,
      labelY: 175
    },
    // Chtouka-Ait Baha (South of Inezgane, agricultural plain)
    CAB: {
      path: 'M 155 180 L 195 200 L 250 210 L 240 270 L 160 260 L 140 220 Z',
      labelX: 195,
      labelY: 235
    },
    // Taroudannt (Vast East-Central province)
    TRDNT: {
      path: 'M 220 90 L 380 70 L 430 140 L 400 230 L 250 210 L 200 170 L 240 140 Z',
      labelX: 320,
      labelY: 155
    },
    // Tiznit (South-West)
    TIZ: {
      path: 'M 140 220 L 160 260 L 240 270 L 230 360 L 130 340 L 100 280 Z',
      labelX: 170,
      labelY: 305
    },
    // Tata (Massive South-East presaharan province)
    TATA: {
      path: 'M 400 230 L 430 140 L 580 180 L 620 320 L 530 400 L 360 370 L 240 270 L 250 210 Z',
      labelX: 460,
      labelY: 280
    }
  };

  const getMetricValue = (code: string): { val: number | null; display: string } => {
    const prov = provinces.find(p => p.code === code);
    if (!prov) return { val: null, display: '—' };
    
    if (metric === 'jobs') {
      const val = prov.net_jobs_created.total_2023_2025;
      return { val, display: `${val > 0 ? '+' : ''}${formatNumber(val, locale)}` };
    }
    if (metric === 'rate_2025') {
      const val = prov.employment_rate.y2025;
      return { val, display: formatPercent(val, locale) };
    }
    if (metric === 'pop_15') {
      const val = prov.pop_15_plus.y2024;
      return { val, display: `${formatNumber(val, locale)} hab.` };
    }
    if (metric === 'unemp_2023') {
      const p2023 = provincialData.provinces[prov.name];
      const val = p2023?.unemployment_rate?.total || null;
      return { val, display: val !== null ? formatPercent(val, locale) : 'ps' };
    }
    return { val: null, display: '—' };
  };

  const getColorForProvince = (code: string, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return '#D97706'; // Vibrant amber
    if (isHovered) return '#F59E0B'; // Light amber
    
    const { val } = getMetricValue(code);
    if (val === null) return '#94A3B8';
    
    if (metric === 'jobs') {
      if (val > 15000) return '#047857'; // High job creation (Taroudannt, Agadir)
      if (val > 10000) return '#059669'; // (Inezgane)
      if (val > 3000) return '#10B981'; // (Chtouka, Tata)
      return '#F43F5E'; // Negative (Tiznit)
    }
    if (metric === 'rate_2025') {
      if (val >= 39) return '#047857';
      if (val >= 35) return '#0D9488';
      return '#0284C7';
    }
    return '#3B82F6';
  };

  const handleSelect = (code: TerritoryCode) => {
    updateFilter('territory', code);
    if (onSelectProvince) onSelectProvince(code);
  };

  const activeFocus = hoveredCode || filters.territory;
  const focusedProv = provinces.find(p => p.code === activeFocus) || provinces[0];

  return (
    <div className={`p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 rounded-md ${className}`}>
      {/* Metric Selector & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            {locale === 'ar' ? 'الخريطة التفاعلية للأقاليم' : 'Cartographie Interactive Souss-Massa'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {locale === 'ar' ? 'انقر على إقليم لاستعراض مؤشراته' : 'Sélectionnez une province pour analyser ses données'}
          </p>
        </div>

        <SegmentControl<MapMetric>
          size="sm"
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'jobs', label: locale === 'ar' ? 'مناصب 23-25' : 'Emplois créés 23–25' },
            { value: 'rate_2025', label: locale === 'ar' ? 'معدل التشغيل 2025' : 'Tx Emploi 2025' },
            { value: 'pop_15', label: locale === 'ar' ? 'الساكنة 15+' : 'Pop 15+' },
            { value: 'unemp_2023', label: locale === 'ar' ? 'البطالة 2023' : 'Chômage 2023' }
          ]}
        />
      </div>

      {/* Main Map & Focus Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Map Container */}
        <div className="lg:col-span-7 relative flex items-center justify-center p-2 bg-slate-50/50 dark:bg-slate-800/20 rounded border border-slate-100 dark:border-slate-800">
          <svg
            viewBox="80 50 560 370"
            className="w-full h-auto max-h-[380px] drop-shadow-sm select-none"
          >
            {provinces.map(prov => {
              const geo = provinceGeometries[prov.code];
              if (!geo) return null;
              const isSelected = filters.territory === prov.code;
              const isHovered = hoveredCode === prov.code;
              const fillColor = getColorForProvince(prov.code, isSelected, isHovered);
              const metricInfo = getMetricValue(prov.code);

              return (
                <g
                  key={prov.code}
                  onClick={() => handleSelect(prov.code)}
                  onMouseEnter={() => setHoveredCode(prov.code)}
                  onMouseLeave={() => setHoveredCode(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  <path
                    d={geo.path}
                    fill={fillColor}
                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.7}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-colors duration-200 hover:brightness-110"
                  />
                  {/* Province Label & Metric */}
                  <text
                    x={geo.labelX}
                    y={geo.labelY - 6}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow"
                  >
                    {prov.code}
                  </text>
                  <text
                    x={geo.labelX}
                    y={geo.labelY + 8}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="600"
                    className="pointer-events-none drop-shadow font-mono"
                  >
                    {metricInfo.display}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Province Detailed Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                  {focusedProv.type}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {locale === 'ar' ? focusedProv.name_ar : focusedProv.name}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 rounded">
                {focusedProv.code}
              </span>
            </div>

            <div className="space-y-2.5 text-xs divide-y divide-slate-200/60 dark:divide-slate-700/60">
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'الساكنة 15+ (RGPH 2024):' : 'Pop. 15 ans et plus (RGPH 2024):'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 tnum">
                  {formatNumber(focusedProv.pop_15_plus.y2024, locale)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'معدل التشغيل 2025:' : 'Taux d’emploi 2025:'}
                </span>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-slate-100 tnum">
                    {formatPercent(focusedProv.employment_rate.y2025, locale)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    (vs 36.0% Souss-Massa)
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'صافي المناصب 2023–2025:' : 'Créations nettes 2023–2025:'}
                </span>
                <span className={`font-bold tnum ${
                  focusedProv.net_jobs_created.total_2023_2025 > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                }`}>
                  {focusedProv.net_jobs_created.total_2023_2025 > 0 ? '+' : ''}
                  {formatNumber(focusedProv.net_jobs_created.total_2023_2025, locale)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'النشيطون المشتغلون 2025:' : 'Actifs occupés 2025:'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 tnum">
                  {formatNumber(focusedProv.employment_count.y2025, locale)}
                </span>
              </div>
            </div>

            <button
              onClick={() => updateFilter('territory', focusedProv.code)}
              className="mt-4 w-full py-1.5 text-xs font-semibold text-center bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 rounded transition-colors"
            >
              {locale === 'ar' ? `تطبيق فلتر ${focusedProv.name_ar}` : `Filtrer sur ${focusedProv.name}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
