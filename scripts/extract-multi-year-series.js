const XLSX = require('xlsx');
const fs = require('fs');

function parseNum(val) {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : parseFloat(val.toString().replace(',', '.').replace(/\s/g, ''));
  return isNaN(num) ? null : Math.round(num * 10) / 10;
}

const wbEne = XLSX.readFile('ENE-Indicateurs dÃ©sagrÃ©gÃ©s 2019-2024- RÃ©gion #09 -07052025.xlsx');

function dumpKeyMetrics() {
  console.log('=== MULTI-YEAR KEY METRICS SUMMARY ===');
  
  // Let us inspect 2019 to 2024
  ['2019', '2020', '2021', '2022', '2023', 'Data 2024'].forEach(sheetName => {
    const sheet = wbEne.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    console.log(`\n---------------------------------------`);
    console.log(`SHEET: ${sheetName}`);
    console.log(`---------------------------------------`);
    rows.slice(0, 75).forEach((r, idx) => {
      const nonEmpties = r.filter(x => x !== '');
      if (nonEmpties.length > 0) {
        console.log(`[R${idx+1}] ${JSON.stringify(r.slice(0, 8))}`);
      }
    });
  });
}

dumpKeyMetrics();
