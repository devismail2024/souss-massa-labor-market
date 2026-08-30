const XLSX = require('xlsx');
const fs = require('fs');

// Let's inspect the exact layout of ENE sheets for 2019 to 2024 and 2025
const wbEne = XLSX.readFile('ENE-Indicateurs dÃ©sagrÃ©gÃ©s 2019-2024- RÃ©gion #09 -07052025.xlsx');
console.log('ENE Sheet names:', wbEne.SheetNames);

['Data 2024', '2023', '2022', '2021', '2020', '2019'].forEach(sheetName => {
  const sheet = wbEne.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  console.log(`\n=== SHEET ${sheetName} (Length: ${json.length}) ===`);
  for (let i = 0; i < Math.min(json.length, 35); i++) {
    const row = json[i].filter(x => x !== '');
    if (row.length > 0) {
      console.log(`[R${i+1}] ${JSON.stringify(json[i].slice(0, 10))}`);
    }
  }
});
