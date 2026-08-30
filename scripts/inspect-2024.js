const XLSX = require('xlsx');

const file2024 = '2024 - Indicateurs dÃ©sagrÃ©gÃ©s dÃ©taillÃ©s - RÃ©gion.xlsx';
const wb = XLSX.readFile(file2024);

console.log('Sheets in 2024:', wb.SheetNames);
const listSheet = wb.Sheets['Liste des tableaux'];
if (listSheet) {
  const rows = XLSX.utils.sheet_to_json(listSheet, { header: 1 });
  console.log('\n--- 2024 Table List ---');
  rows.forEach(r => {
    if (r[0] || r[1]) console.log(`${r[0] || ''}: ${r[1] || ''}`);
  });
}

const dataSheet = wb.Sheets['Data'];
const rows = XLSX.utils.sheet_to_json(dataSheet, { header: 1, defval: '' });
console.log(`\nData sheet total rows: ${rows.length}`);
rows.forEach((r, idx) => {
  const str = (r[0] || '').toString().trim();
  if (str.length > 5 && !str.match(/^[0-9.,-]+$/) && (r.filter(x => x !== '').length <= 3 || str.startsWith('La ') || str.startsWith('Le ') || str.startsWith('Les ') || str.startsWith('Structure ') || str.startsWith('Taux '))) {
    console.log(`Row ${idx+1}: ${str}`);
  }
});
