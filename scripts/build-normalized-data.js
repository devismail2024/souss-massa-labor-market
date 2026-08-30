const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'normalized');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Helper to clean string
function cleanStr(s) {
  if (s === null || s === undefined) return '';
  return s.toString().trim();
}

// Helper to parse numbers safely
function parseNum(val) {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : parseFloat(val.toString().replace(',', '.').replace(/\s/g, ''));
  return isNaN(num) ? null : num;
}

// -------------------------------------------------------------
// 1. Parse Provincial Indicators 2023 (Sous-milieu)
// -------------------------------------------------------------
function parseProvincial2023() {
  const wb = XLSX.readFile('2023 - Indicateurs clÃ©s par province - SOUS MILIEU.xlsx');
  const sheet = wb.Sheets['Data'];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  // Table 1: Taux d'activité (rows 1-13)
  // Table 2: Taux d'emploi (rows 15-27)
  // Table 3: Taux de chômage (rows 29-41)
  
  const provinces = [
    'Agadir-Ida-Ou-Tanane',
    'Chtouka-Ait Baha',
    'Inezgane-Ait Melloul',
    'Taroudannt',
    'Tata',
    'Tiznit'
  ];
  
  const result = {
    metadata: {
      year: 2023,
      scope: 'Population de 15 ans et plus (Active pour chômage)',
      unit: '%',
      source: 'HCP (ENE 2023)'
    },
    provinces: {}
  };
  
  provinces.forEach(p => {
    result.provinces[p] = {
      name: p,
      activity_rate: { urban: null, urban_sign: '', rural: null, rural_sign: '', total: null, total_sign: '' },
      employment_rate: { urban: null, urban_sign: '', rural: null, rural_sign: '', total: null, total_sign: '' },
      unemployment_rate: { urban: null, urban_sign: '', rural: null, rural_sign: '', total: null, total_sign: '' }
    };
  });
  
  // Table 1: Activity rate (rows 4 to 9 in 1-indexed = 3 to 8 in 0-indexed)
  for (let i = 3; i <= 8; i++) {
    const r = rows[i];
    const prov = cleanStr(r[0]);
    if (result.provinces[prov]) {
      result.provinces[prov].activity_rate = {
        urban: parseNum(r[1]),
        urban_sign: cleanStr(r[2]),
        rural: parseNum(r[3]),
        rural_sign: cleanStr(r[4]),
        total: parseNum(r[5]),
        total_sign: cleanStr(r[6])
      };
    }
  }
  
  // Table 2: Employment rate (rows 18 to 23 in 1-indexed = 17 to 22 in 0-indexed)
  for (let i = 17; i <= 22; i++) {
    const r = rows[i];
    const prov = cleanStr(r[0]);
    if (result.provinces[prov]) {
      result.provinces[prov].employment_rate = {
        urban: parseNum(r[1]),
        urban_sign: cleanStr(r[2]),
        rural: parseNum(r[3]),
        rural_sign: cleanStr(r[4]),
        total: parseNum(r[5]),
        total_sign: cleanStr(r[6])
      };
    }
  }
  
  // Table 3: Unemployment rate (rows 31 to 36 in 1-indexed = 31 to 36 in 0-indexed)
  for (let i = 31; i <= 36; i++) {
    const r = rows[i];
    const prov = cleanStr(r[0]);
    if (result.provinces[prov]) {
      result.provinces[prov].unemployment_rate = {
        urban: parseNum(r[1]),
        urban_sign: cleanStr(r[2]),
        rural: parseNum(r[3]),
        rural_sign: cleanStr(r[4]),
        total: parseNum(r[5]),
        total_sign: cleanStr(r[6])
      };
    }
  }
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'provincial_indicators_2023.json'), JSON.stringify(result, null, 2));
  console.log('Saved provincial_indicators_2023.json');
  return result;
}

// -------------------------------------------------------------
// 2. Parse Job Creation 2023-2025
// -------------------------------------------------------------
function parseJobCreation() {
  const wb = XLSX.readFile('emploi crÃ©es par provinces 23-24-25.xlsx');
  const sheet = wb.Sheets['Feuil1'];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  const zonesMap = {
    'MAROC': { id: 'MAROC', name: 'Maroc', name_ar: 'المغرب', type: 'national' },
    'SM': { id: 'SM', name: 'Souss-Massa', name_ar: 'سوس ماسة', type: 'region' },
    'AIO': { id: 'AIO', name: 'Agadir-Ida-Ou-Tanane', name_ar: 'أكادير إداوتنان', type: 'province' },
    'CAB': { id: 'CAB', name: 'Chtouka-Ait Baha', name_ar: 'شتوكة آيت باها', type: 'province' },
    'IAM': { id: 'IAM', name: 'Inezgane-Ait Melloul', name_ar: 'إنزكان آيت ملول', type: 'prefecture' },
    'TRDNT': { id: 'TRDNT', name: 'Taroudannt', name_ar: 'تارودانت', type: 'province' },
    'TIZ': { id: 'TIZ', name: 'Tiznit', name_ar: 'تيزنيت', type: 'province' },
    'TATA': { id: 'TATA', name: 'Tata', name_ar: 'طاطا', type: 'province' }
  };
  
  const territories = [];
  
  // Rows 4 to 11 in 1-indexed = 3 to 10 in 0-indexed
  for (let i = 3; i <= 10; i++) {
    const r = rows[i];
    const code = cleanStr(r[8]);
    if (zonesMap[code]) {
      const occupied_pop_rgph_2024 = parseNum(r[4]);
      const pop15_2023 = parseNum(r[9]);
      const pop15_2024 = parseNum(r[10]);
      const growth_rate_24_25 = parseNum(r[11]);
      const pop15_2025_estim = parseNum(r[12]);
      const employment_rate_2023 = parseNum(r[13]);
      const employment_2023 = parseNum(r[14]);
      const employment_2024 = parseNum(r[15]);
      const employment_rate_2024 = parseNum(r[16]);
      const employment_rate_2025 = parseNum(r[17]);
      const employment_2025 = parseNum(r[18]);
      const jobs_created_23_24 = parseNum(r[19]);
      const jobs_created_24_25 = parseNum(r[20]);
      const jobs_created_23_25 = parseNum(r[21]);
      
      territories.push({
        code,
        ...zonesMap[code],
        occupied_pop_rgph_2024,
        pop_15_plus: {
          y2023: pop15_2023,
          y2024: pop15_2024,
          y2025_estim: pop15_2025_estim,
          growth_rate_24_25
        },
        employment_rate: {
          y2023: employment_rate_2023,
          y2024: employment_rate_2024,
          y2025: employment_rate_2025
        },
        employment_count: {
          y2023: employment_2023,
          y2024: employment_2024,
          y2025: employment_2025
        },
        net_jobs_created: {
          diff_2023_2024: jobs_created_23_24,
          diff_2024_2025: jobs_created_24_25,
          total_2023_2025: jobs_created_23_25
        }
      });
    }
  }
  
  const result = {
    metadata: {
      source: 'HCP (RGPH 2024 & ENE 2023-2025)',
      description: 'Création nette d’emplois et effectifs par province 2023-2025',
      years: [2023, 2024, 2025]
    },
    territories
  };
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'job_creation_2023_2025.json'), JSON.stringify(result, null, 2));
  console.log('Saved job_creation_2023_2025.json');
  return result;
}

// -------------------------------------------------------------
// 3. Parse 2025 Regional Key Figures
// -------------------------------------------------------------
function parseRegional2025() {
  const wb = XLSX.readFile('2025 - Chiffres clÃ©s dÃ©taillÃ©s - RÃ©gion.xlsx');
  const sheet = wb.Sheets['Data'];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  const data2025 = {
    year: 2025,
    activity: {
      active_population_k: { urban: parseNum(rows[5][1]), rural: parseNum(rows[5][3]), total: parseNum(rows[5][5]) },
      feminisation_rate_pct: { urban: parseNum(rows[6][1]), rural: parseNum(rows[6][3]), total: parseNum(rows[6][5]) },
      activity_rate_pct: {
        total: { urban: parseNum(rows[7][1]), rural: parseNum(rows[7][3]), total: parseNum(rows[7][5]) },
        by_sex: {
          men: { urban: parseNum(rows[9][1]), rural: parseNum(rows[9][3]), total: parseNum(rows[9][5]) },
          women: { urban: parseNum(rows[10][1]), rural: parseNum(rows[10][3]), total: parseNum(rows[10][5]) }
        },
        by_age: {
          age_15_24: { urban: parseNum(rows[12][1]), rural: parseNum(rows[12][3]), total: parseNum(rows[12][5]) },
          age_25_34: { urban: parseNum(rows[13][1]), rural: parseNum(rows[13][3]), total: parseNum(rows[13][5]) },
          age_35_44: { urban: parseNum(rows[14][1]), rural: parseNum(rows[14][3]), total: parseNum(rows[14][5]) },
          age_45_plus: { urban: parseNum(rows[15][1]), rural: parseNum(rows[15][3]), total: parseNum(rows[15][5]) }
        },
        by_diploma: {
          no_diploma: { urban: parseNum(rows[17][1]), rural: parseNum(rows[17][3]), total: parseNum(rows[17][5]) },
          with_diploma: { urban: parseNum(rows[18][1]), rural: parseNum(rows[18][3]), total: parseNum(rows[18][5]) }
        }
      }
    },
    employment: {
      employed_population_k: { urban: parseNum(rows[20][1]), rural: parseNum(rows[20][3]), total: parseNum(rows[20][5]) },
      employment_rate_pct: {
        total: { urban: parseNum(rows[21][1]), rural: parseNum(rows[21][3]), total: parseNum(rows[21][5]) },
        by_sex: {
          men: { urban: parseNum(rows[23][1]), rural: parseNum(rows[23][3]), total: parseNum(rows[23][5]) },
          women: { urban: parseNum(rows[24][1]), rural: parseNum(rows[24][3]), total: parseNum(rows[24][5]) }
        }
      },
      sector_shares_pct: {
        agriculture: { urban: parseNum(rows[26][1]), rural: parseNum(rows[26][3]), total: parseNum(rows[26][5]) },
        industry: { urban: parseNum(rows[27][1]), rural: parseNum(rows[27][3]), total: parseNum(rows[27][5]) },
        construction: { urban: parseNum(rows[28][1]), rural: parseNum(rows[28][3]), total: parseNum(rows[28][5]) },
        services: { urban: parseNum(rows[29][1]), rural: parseNum(rows[29][3]), total: parseNum(rows[29][5]) },
        undetermined: { urban: parseNum(rows[30][1]), rural: parseNum(rows[30][3]), total: parseNum(rows[30][5]) }
      },
      status_pct: {
        remunerated_share: { urban: parseNum(rows[31][1]), rural: parseNum(rows[31][3]), total: parseNum(rows[31][5]) },
        employees: { urban: parseNum(rows[32][1]), rural: parseNum(rows[32][3]), total: parseNum(rows[32][5]) },
        self_employed: { urban: parseNum(rows[33][1]), rural: parseNum(rows[33][3]), total: parseNum(rows[33][5]) }
      },
      underemployment: {
        count_k: { urban: parseNum(rows[34][1]), rural: parseNum(rows[34][3]), total: parseNum(rows[34][5]) },
        rate_pct: { urban: parseNum(rows[35][1]), rural: parseNum(rows[35][3]), total: parseNum(rows[35][5]) },
        visible_rate_pct: { urban: parseNum(rows[37][1]), rural: parseNum(rows[37][3]), total: parseNum(rows[37][5]) },
        invisible_rate_pct: { urban: parseNum(rows[38][1]), rural: parseNum(rows[38][3]), total: parseNum(rows[38][5]) }
      }
    },
    unemployment: {
      unemployed_population_k: { urban: parseNum(rows[40][1]), rural: parseNum(rows[40][3]), total: parseNum(rows[40][5]) },
      feminisation_rate_pct: {
        urban: parseNum(rows[41][1]),
        rural: parseNum(rows[41][3]),
        rural_sign: cleanStr(rows[41][4]),
        total: parseNum(rows[41][5])
      },
      unemployment_rate_pct: {
        total: { urban: parseNum(rows[42][1]), rural: parseNum(rows[42][3]), total: parseNum(rows[42][5]) },
        by_sex: {
          men: { urban: parseNum(rows[44][1]), rural: parseNum(rows[44][3]), total: parseNum(rows[44][5]) },
          women: {
            urban: parseNum(rows[45][1]),
            rural: parseNum(rows[45][3]),
            rural_sign: cleanStr(rows[45][4]),
            total: parseNum(rows[45][5])
          }
        },
        by_age: {
          age_15_24: { urban: parseNum(rows[47][1]), rural: parseNum(rows[47][3]), total: parseNum(rows[47][5]) },
          age_25_34: { urban: parseNum(rows[48][1]), rural: parseNum(rows[48][3]), total: parseNum(rows[48][5]) },
          age_35_44: {
            urban: parseNum(rows[49][1]),
            rural: parseNum(rows[49][3]),
            rural_sign: cleanStr(rows[49][4]),
            total: parseNum(rows[49][5])
          },
          age_45_plus: {
            urban: parseNum(rows[50][1]),
            urban_sign: cleanStr(rows[50][2]),
            rural: parseNum(rows[50][3]),
            rural_sign: cleanStr(rows[50][4]),
            total: parseNum(rows[50][5])
          }
        },
        by_diploma: {
          no_diploma: {
            urban: parseNum(rows[52][1]),
            rural: parseNum(rows[52][3]),
            rural_sign: cleanStr(rows[52][4]),
            total: parseNum(rows[52][5])
          },
          with_diploma: { urban: parseNum(rows[53][1]), rural: parseNum(rows[53][3]), total: parseNum(rows[53][5]) }
        }
      }
    }
  };
  
  return data2025;
}

parseProvincial2023();
parseJobCreation();
const r2025 = parseRegional2025();
console.log('Parsed 2025 regional data sample:', r2025.employment.employed_population_k);
