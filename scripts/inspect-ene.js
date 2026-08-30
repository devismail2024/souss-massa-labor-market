const XLSX = require('xlsx');

const fileEne = 'ENE-Indicateurs dÃ©sagrÃ©gÃ©s 2019-2024- RÃ©gion #09 -07052025.xlsx';
const wb = XLSX.readFile(fileEne);

console.log('Sheets in ENE 2019-2024:', wb.SheetNames);

// Check Liste des tableaux
const listSheet = wb.Sheets['Liste des tableaux'];
if (listSheet) {
  const rows = XLSX.utils.sheet_to_json(listSheet, { header: 1 });
  console.log('\n--- Liste des tableaux in ENE 2019-2024 ---');
  rows.forEach(r => {
    if (r[0] && r[1]) console.log(`${r[0]}: ${r[1]}`);
  });
}

// For each year sheet: Data 2024, 2023, 2022, 2021, 2020, 2019
['Data 2024', '2023', '2022', '2021', '2020', '2019'].forEach(sheetName => {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return;
  console.log(`\n================ SHEET: ${sheetName} ================`);
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  console.log(`Total rows: ${data.length}`);
  
  // Find all table headers / sections
  data.forEach((r, idx) => {
    // If first column or second column looks like a title
    const str = (r[0] || r[1] || '').toString().trim();
    if (str.length > 5 && !str.match(/^[0-9.,-]+$/) && (r.filter(x => x !== '').length <= 3 || str.startsWith('La ') || str.startsWith('Le ') || str.startsWith('Les ') || str.startsWith('Structure ') || str.startsWith('Taux '))) {
      console.log(`  Row ${idx+1}: "${str}"`);
    }
  });
});
