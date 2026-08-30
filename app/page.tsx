'use client';

import React from 'react';
import { useApp } from '@/lib/app-context';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { GlobalFilterBar } from '@/components/layout/GlobalFilterBar';
import { Footer } from '@/components/layout/Footer';

// Views
import { OverviewView } from '@/components/views/OverviewView';
import { HistoricalView } from '@/components/views/HistoricalView';
import { TerritoriesView } from '@/components/views/TerritoriesView';
import { UrbanRuralView } from '@/components/views/UrbanRuralView';
import { GenderView } from '@/components/views/GenderView';
import { AgeEducationView } from '@/components/views/AgeEducationView';
import { SectorsView } from '@/components/views/SectorsView';
import { JobCreationView } from '@/components/views/JobCreationView';
import { WorkConditionsView } from '@/components/views/WorkConditionsView';
import { DataExplorerView } from '@/components/views/DataExplorerView';
import { ComparisonStudioView } from '@/components/views/ComparisonStudioView';
import { SourcesProvenanceView } from '@/components/views/SourcesProvenanceView';

export default function Home() {
  const { activeView, t, locale, filters } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'historical':
        return <HistoricalView />;
      case 'territories':
        return <TerritoriesView />;
      case 'job_creation':
        return <JobCreationView />;
      case 'urban_rural':
        return <UrbanRuralView />;
      case 'gender':
        return <GenderView />;
      case 'age_education':
        return <AgeEducationView />;
      case 'sectors':
        return <SectorsView />;
      case 'work_conditions':
        return <WorkConditionsView />;
      case 'data_explorer':
        return <DataExplorerView />;
      case 'comparison':
        return <ComparisonStudioView />;
      case 'sources':
        return <SourcesProvenanceView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <GlobalFilterBar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Analytical Canvas */}
        <main className="flex-1 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      <Footer />
    </div>
  );
}
