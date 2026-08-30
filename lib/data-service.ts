import regionalMultiyear from '@/data/normalized/regional_multiyear.json';
import provincial2023 from '@/data/normalized/provincial_indicators_2023.json';
import jobCreation from '@/data/normalized/job_creation_2023_2025.json';
import detailed2024 from '@/data/normalized/detailed_indicators_2024.json';
import metadataCatalogue from '@/data/normalized/metadata.json';

import {
  RegionalMultiYearDataset,
  Provincial2023Dataset,
  JobCreationDataset,
  Detailed2024Dataset,
  MetadataCatalogue,
  YearRegionalData,
  JobCreationTerritory
} from '@/types/dataset';

export const regionalData: RegionalMultiYearDataset = regionalMultiyear as unknown as RegionalMultiYearDataset;
export const provincialData: Provincial2023Dataset = provincial2023 as unknown as Provincial2023Dataset;
export const jobCreationData: JobCreationDataset = jobCreation as unknown as JobCreationDataset;
export const detailedData: Detailed2024Dataset = detailed2024 as unknown as Detailed2024Dataset;
export const metadataData: MetadataCatalogue = metadataCatalogue as unknown as MetadataCatalogue;

export function getRegionalYearData(year: number): YearRegionalData | undefined {
  return regionalData.series[year];
}

export function getAllYears(): number[] {
  return regionalData.metadata.years;
}

export function getProvincesList(): JobCreationTerritory[] {
  return jobCreationData.territories.filter(t => t.type === 'province' || t.type === 'prefecture');
}

export function getAllTerritories(): JobCreationTerritory[] {
  return jobCreationData.territories;
}

export function getTerritoryByCode(code: string): JobCreationTerritory | undefined {
  return jobCreationData.territories.find(t => t.code === code);
}
