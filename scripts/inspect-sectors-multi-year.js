const XLSX = require('xlsx');

const wbEne = XLSX.readFile('ENE-Indicateurs dÃ©sagrÃ©gÃ©s 2019-2024- RÃ©gion #09 -07052025.xlsx');

['2019', '2020', '2021', '2022', '2023', 'Data 2024'].forEach(sheetName => {
  const sheet = wbEne.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  // Find "secteur d'activité" or "secteurs d'activité"
  rows.forEach((r, idx) => {
    const s = (r[0] || '').toString().trim();
    if (s.includes('secteur') && (s.includes('activité') || s.includes('travailleurs'))) {
      console.log(`\nSheet ${sheetName} at row ${idx+1}: "${s}"`);
      for (let j = 0; j <= 8; j++) {
        if (rows[idx+j]) console.log(`  ${JSON.stringify(rows[idx+j].slice(0, 7))}`);
      }
    }
  });
});
