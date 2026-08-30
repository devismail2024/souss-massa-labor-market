'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations, Translations } from './i18n';
import { TerritoryCode } from '@/types/dataset';

export type ActiveViewType = 
  | 'overview'
  | 'historical'
  | 'territories'
  | 'urban_rural'
  | 'gender'
  | 'age_education'
  | 'sectors'
  | 'job_creation'
  | 'work_conditions'
  | 'data_explorer'
  | 'comparison'
  | 'sources';

export interface GlobalFilterState {
  year: number;
  milieu: 'total' | 'urban' | 'rural';
  sex: 'total' | 'men' | 'women';
  territory: TerritoryCode;
}

interface AppContextType {
  activeView: ActiveViewType;
  setActiveView: (view: ActiveViewType) => void;
  filters: GlobalFilterState;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilterState>>;
  updateFilter: <K extends keyof GlobalFilterState>(key: K, value: GlobalFilterState[K]) => void;
  resetFilters: () => void;
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: Translations;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const defaultFilters: GlobalFilterState = {
  year: 2025,
  milieu: 'total',
  sex: 'total',
  territory: 'SM'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveViewType>('overview');
  const [filters, setFilters] = useState<GlobalFilterState>(defaultFilters);
  const [locale, setLocale] = useState<Locale>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Handle system or saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('sm_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('sm_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  const updateFilter = <K extends keyof GlobalFilterState>(key: K, value: GlobalFilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const t = translations[locale];

  // Set RTL or LTR on document
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        locale,
        setLocale,
        t,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
