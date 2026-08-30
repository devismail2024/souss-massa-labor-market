export type MilestoneYear = 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025;

export type MilieuType = 'urban' | 'rural' | 'total';
export type SexType = 'men' | 'women' | 'total';
export type TerritoryCode = 'MAROC' | 'SM' | 'AIO' | 'CAB' | 'IAM' | 'TRDNT' | 'TIZ' | 'TATA';

export interface UrbanRuralTotal<T = number | null> {
  urban: T;
  rural: T;
  total: T;
  urban_sign?: string;
  rural_sign?: string;
  total_sign?: string;
}

export interface YearRegionalData {
  year: number;
  population_15_plus_k: UrbanRuralTotal<number>;
  active_population_k: UrbanRuralTotal<number>;
  employed_population_k: UrbanRuralTotal<number>;
  unemployed_population_k: UrbanRuralTotal<number>;
  inactive_population_k?: UrbanRuralTotal<number>;
  activity_rate: {
    total: UrbanRuralTotal<number>;
    by_sex: {
      men: UrbanRuralTotal<number>;
      women: UrbanRuralTotal<number>;
    };
    by_age: {
      age_15_24: UrbanRuralTotal<number>;
      age_25_34: UrbanRuralTotal<number>;
      age_35_44: UrbanRuralTotal<number>;
      age_45_plus: UrbanRuralTotal<number>;
    };
    by_diploma: {
      no_diploma: UrbanRuralTotal<number>;
      medium_diploma?: UrbanRuralTotal<number>;
      higher_diploma?: UrbanRuralTotal<number>;
      with_diploma?: UrbanRuralTotal<number>;
    };
  };
  employment_rate: {
    total: UrbanRuralTotal<number>;
    by_sex: {
      men: UrbanRuralTotal<number>;
      women: UrbanRuralTotal<number>;
    };
    by_age: {
      age_15_24: UrbanRuralTotal<number>;
      age_25_34: UrbanRuralTotal<number>;
      age_35_44: UrbanRuralTotal<number>;
      age_45_plus: UrbanRuralTotal<number>;
    };
    by_diploma: {
      no_diploma: UrbanRuralTotal<number>;
      medium_diploma?: UrbanRuralTotal<number>;
      higher_diploma?: UrbanRuralTotal<number>;
      with_diploma?: UrbanRuralTotal<number>;
    };
  };
  unemployment_rate: {
    total: UrbanRuralTotal<number>;
    by_sex: {
      men: UrbanRuralTotal<number>;
      women: UrbanRuralTotal<number>;
    };
    by_age: {
      age_15_24: UrbanRuralTotal<number>;
      age_25_34: UrbanRuralTotal<number>;
      age_35_44: UrbanRuralTotal<number>;
      age_45_plus: UrbanRuralTotal<number>;
    };
    by_diploma: {
      no_diploma: UrbanRuralTotal<number>;
      medium_diploma?: UrbanRuralTotal<number>;
      higher_diploma?: UrbanRuralTotal<number>;
      with_diploma?: UrbanRuralTotal<number>;
    };
  };
  sector_shares_pct: {
    agriculture: UrbanRuralTotal<number>;
    industry: UrbanRuralTotal<number>;
    construction: UrbanRuralTotal<number>;
    services: UrbanRuralTotal<number>;
    undetermined?: UrbanRuralTotal<number>;
  };
  underemployment?: {
    count_k?: UrbanRuralTotal<number>;
    rate_pct?: UrbanRuralTotal<number>;
    visible_rate_pct?: UrbanRuralTotal<number>;
    invisible_rate_pct?: UrbanRuralTotal<number>;
  };
  status_pct?: {
    remunerated_share?: UrbanRuralTotal<number>;
    employees?: UrbanRuralTotal<number>;
    self_employed?: UrbanRuralTotal<number>;
  };
}

export interface RegionalMultiYearDataset {
  metadata: {
    region: string;
    region_code: string;
    source: string;
    years: number[];
    last_updated: string;
  };
  series: Record<number, YearRegionalData>;
}

export interface Province2023Metrics {
  name: string;
  activity_rate: UrbanRuralTotal<number | null>;
  employment_rate: UrbanRuralTotal<number | null>;
  unemployment_rate: UrbanRuralTotal<number | null>;
}

export interface Provincial2023Dataset {
  metadata: {
    year: number;
    scope: string;
    unit: string;
    source: string;
  };
  provinces: Record<string, Province2023Metrics>;
}

export interface JobCreationTerritory {
  code: TerritoryCode;
  id: string;
  name: string;
  name_ar: string;
  type: 'national' | 'region' | 'province' | 'prefecture';
  occupied_pop_rgph_2024: number | null;
  pop_15_plus: {
    y2023: number;
    y2024: number;
    y2025_estim: number;
    growth_rate_24_25: number;
  };
  employment_rate: {
    y2023: number;
    y2024: number;
    y2025: number;
  };
  employment_count: {
    y2023: number;
    y2024: number;
    y2025: number;
  };
  net_jobs_created: {
    diff_2023_2024: number;
    diff_2024_2025: number;
    total_2023_2025: number;
  };
}

export interface JobCreationDataset {
  metadata: {
    source: string;
    description: string;
    years: number[];
  };
  territories: JobCreationTerritory[];
}

export interface DetailedTableItem {
  category: string;
  urban: number | null;
  urban_sign?: string;
  rural: number | null;
  rural_sign?: string;
  total: number | null;
  total_sign?: string;
}

export interface DetailedTable {
  title: string;
  startRow: number;
  items: DetailedTableItem[];
  metadata: {
    champ?: string;
    reference?: string;
    unit?: string;
    source?: string;
    notes?: string;
  };
}

export interface Detailed2024Dataset {
  metadata: {
    title: string;
    source: string;
    year: number;
    total_tables: number;
  };
  tables: DetailedTable[];
}

export interface TerritoryMeta {
  id: string;
  code: TerritoryCode;
  name: string;
  name_ar: string;
  type: string;
  capital: string;
  rgph_pop_15_2024: number;
  employment_rate_2025: number;
  employment_count_2025: number;
  net_jobs_2023_2025: number;
  description: string;
}

export interface MetadataCatalogue {
  notations: Record<string, { label: string; description: string }>;
  sources: Array<{
    id: string;
    name: string;
    filename: string;
    institution: string;
    coverage: string;
    description: string;
  }>;
  territories: TerritoryMeta[];
}
