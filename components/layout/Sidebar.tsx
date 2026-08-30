'use client';

import React from 'react';
import { useApp, ActiveViewType } from '@/lib/app-context';
import {
  LayoutDashboard,
  TrendingUp,
  Map,
  Compass,
  Users,
  GraduationCap,
  PieChart,
  Briefcase,
  ShieldCheck,
  Search,
  Columns,
  BookOpen
} from 'lucide-react';

interface NavItem {
  id: ActiveViewType;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, t, locale } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: t.navOverview,
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      id: 'historical',
      label: t.navHistorical,
      icon: <TrendingUp className="w-4 h-4 shrink-0" />,
      badge: '2019–25'
    },
    {
      id: 'territories',
      label: t.navTerritories,
      icon: <Map className="w-4 h-4 shrink-0" />,
      badge: '6 Prov.'
    },
    {
      id: 'job_creation',
      label: t.navJobCreation,
      icon: <Briefcase className="w-4 h-4 shrink-0" />,
      badge: '+41.9k'
    },
    {
      id: 'urban_rural',
      label: t.navUrbanRural,
      icon: <Compass className="w-4 h-4 shrink-0" />
    },
    {
      id: 'gender',
      label: t.navGender,
      icon: <Users className="w-4 h-4 shrink-0" />
    },
    {
      id: 'age_education',
      label: t.navAgeEducation,
      icon: <GraduationCap className="w-4 h-4 shrink-0" />
    },
    {
      id: 'sectors',
      label: t.navSectors,
      icon: <PieChart className="w-4 h-4 shrink-0" />
    },
    {
      id: 'work_conditions',
      label: t.navWorkConditions,
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />
    },
    {
      id: 'data_explorer',
      label: t.navExplorer,
      icon: <Search className="w-4 h-4 shrink-0" />
    },
    {
      id: 'comparison',
      label: t.navComparison,
      icon: <Columns className="w-4 h-4 shrink-0" />
    },
    {
      id: 'sources',
      label: t.navSources,
      icon: <BookOpen className="w-4 h-4 shrink-0" />
    }
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 lg:w-64 shrink-0 transition-colors">
      <div className="p-3 lg:p-4 overflow-x-auto lg:overflow-x-visible flex lg:flex-col gap-1">
        <div className="hidden lg:block px-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {locale === 'ar' ? 'وحدات التحليل والاستكشاف' : 'Modules Analytiques'}
        </div>

        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition-all select-none ${
                isActive
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/80 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className={isActive ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="flex-1 text-left rtl:text-right">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive
                      ? 'bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
