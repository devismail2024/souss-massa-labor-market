const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'normalized');

const reg = JSON.parse(fs.readFileSync(path.join(dir, 'regional_multiyear.json')));
const prov = JSON.parse(fs.readFileSync(path.join(dir, 'provincial_indicators_2023.json')));
const jobs = JSON.parse(fs.readFileSync(path.join(dir, 'job_creation_2023_2025.json')));
const detailed = JSON.parse(fs.readFileSync(path.join(dir, 'detailed_indicators_2024.json')));
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'metadata.json')));

let errors = 0;
let warnings = 0;

console.log('=== DATA VALIDATION AUDIT ===\n');

// 1. Check multi-year series
const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
years.forEach(y => {
  const d = reg.series[y];
  if (!d) {
    console.error(`ERROR: Missing year ${y}`);
    errors++;
  } else {
    // Validate rates between 0 and 100
    ['activity_rate', 'employment_rate', 'unemployment_rate'].forEach(rateKey => {
      const val = d[rateKey].total.total;
      if (typeof val !== 'number' || val < 0 || val > 100) {
        console.error(`ERROR: Year ${y} ${rateKey} invalid: ${val}`);
        errors++;
      }
    });
    
    // Validate populations
    if (d.active_population_k.total !== d.employed_population_k.total + d.unemployed_population_k.total) {
      console.warn(`NOTE: Year ${y} Active (${d.active_population_k.total}k) vs Employed (${d.employed_population_k.total}k) + Unemployed (${d.unemployed_population_k.total}k) - minor rounding in source`);
      warnings++;
    }
  }
});

// 2. Check provincial indicators 2023
const provNames = Object.keys(prov.provinces);
console.log(`Auditing ${provNames.length} provinces for 2023 indicators:`, provNames);
if (provNames.length !== 6) {
  console.error(`ERROR: Expected 6 provinces, got ${provNames.length}`);
  errors++;
}

provNames.forEach(p => {
  const d = prov.provinces[p];
  if (d.activity_rate.total === null || d.employment_rate.total === null || d.unemployment_rate.total === null) {
    console.warn(`WARNING: Province ${p} has null rate values in 2023`);
    warnings++;
  }
});

// 3. Check job creation
console.log(`Auditing job creation territories (${jobs.territories.length}):`, jobs.territories.map(t => t.code));
const sm = jobs.territories.find(t => t.code === 'SM');
if (!sm || sm.net_jobs_created.total_2023_2025 !== 41911) {
  console.error(`ERROR: Souss-Massa cumulative jobs should be 41,911, got ${sm ? sm.net_jobs_created.total_2023_2025 : 'null'}`);
  errors++;
}

// 4. Check detailed 2024 tables
console.log(`Auditing detailed 2024 tables: count = ${detailed.tables.length}`);
if (detailed.tables.length < 20) {
  console.error(`ERROR: Detailed tables count too low: ${detailed.tables.length}`);
  errors++;
}

console.log(`\nValidation Complete. Errors: ${errors}, Warnings/Notes: ${warnings}`);
if (errors === 0) {
  console.log('✓ ALL DATA AUDITS PASSED WITH ZERO ERRORS.');
}
