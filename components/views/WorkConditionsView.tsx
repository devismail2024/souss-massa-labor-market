'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { regionalData, detailedData } from '@/lib/data-service';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { StatCard } from '../ui/StatCard';
import { DataTable, ColumnDef } from '../ui/DataTable';
import { ShieldCheck, Clock, FileWarning, HeartPulse } from 'lucide-react';

export const WorkConditionsView: React.FC = () => {
  const { locale } = useApp();
  const isAr = locale === 'ar';
  const d2025 = regionalData.series[2025];
  const underemp = d2025.underemployment;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {isAr ? 'جودة التشغيل، التغطية الاجتماعية والشغل الناقص' : 'Qualité de l’Emploi, Protection Sociale & Sous-emploi'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isAr
            ? 'مؤشرات التغطية الصحية والتقاعد، طبيعة العقود وساعات العمل، ومعدلات الشغل الناقص بسوس ماسة.'
            : 'Diagnostic des conditions d’activité, statut professionnel et précarité de l’emploi (HCP).'}
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isAr ? 'معدل الشغل الناقص (2025)' : 'Taux de Sous-emploi'}
          value="9.3"
          unit="%"
          secondaryText={isAr ? '79.000 مشتغل في حالة شغل ناقص' : '79 000 actifs occupés (2025)'}
          variant="accent"
        />

        <StatCard
          title={isAr ? 'شغل ناقص مرتبط بالدخل' : 'Sous-emploi Invisible'}
          value="6.9"
          unit="%"
          secondaryText={isAr ? 'عدم ملاءمة الدخل والتكوين' : 'Lié aux revenus et qualification'}
        />

        <StatCard
          title={isAr ? 'التغطية الصحية للأجراء' : 'Assurance Maladie (AMO)'}
          value="41.5"
          unit="%"
          secondaryText={isAr ? 'لدى الأجراء (2024)' : 'Parmi les salariés (2024)'}
        />

        <StatCard
          title={isAr ? 'التغطية بنظام التقاعد' : 'Assurance Retraite'}
          value="37.5"
          unit="%"
          secondaryText={isAr ? 'لدى الأجراء (2024)' : 'Parmi les salariés (2024)'}
        />
      </div>

      {/* Detailed Tables Summary */}
      <div className="p-4 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-md">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          {isAr ? 'خصائص عقود العمل وساعات العمل' : 'Structure des Contrats & Durée du Travail (2024)'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Contrat à Durée Indéterminée (CDI)</span>
            <strong className="text-lg font-bold text-slate-900 dark:text-slate-100">26.2%</strong>
            <span className="text-[10px] text-slate-400 block mt-1">des salariés de la région</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Contrat à Durée Déterminée (CDD)</span>
            <strong className="text-lg font-bold text-slate-900 dark:text-slate-100">13.5%</strong>
            <span className="text-[10px] text-slate-400 block mt-1">des salariés de la région</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800 border-l-2 border-l-amber-500">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Emploi Sans Contrat (Informel)</span>
            <strong className="text-lg font-bold text-amber-800 dark:text-amber-300">60.3%</strong>
            <span className="text-[10px] text-slate-400 block mt-1">contrat verbal ou informel</span>
          </div>
        </div>
      </div>
    </div>
  );
};
