const XLSX = require('xlsx');

const wb = XLSX.readFile('ENE-Indicateurs dÃ©sagrÃ©gÃ©s 2019-2024- RÃ©gion #09 -07052025.xlsx');

function dumpSheetTables(sheetName) {
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  console.log(`\n============================\nSHEET: ${sheetName} (Rows: ${rows.length})\n============================`);
  
  let i = 0;
  while (i < rows.length) {
    const row = rows[i];
    const firstCell = (row[0] || '').toString().trim();
    if (firstCell && (firstCell.startsWith('La ') || firstCell.startsWith('Le ') || firstCell.startsWith('Les ') || firstCell.startsWith('Structure ') || firstCell.startsWith('Taux '))) {
      console.log(`\nTable at row ${i+1}: "${firstCell}"`);
      // Print next 10 rows
      for (let j = 1; j <= 12 && i + j < rows.length; j++) {
        const nextRow = rows[i+j].filter(x => x !== '');
        if (nextRow.length > 0) {
          console.log(`  +${j} (R${i+j+1}): ${JSON.stringify(rows[i+j].slice(0, 8))}`);
        }
      }
    }
    i++;
  }
}

['Data 2024', '2023', '2022', '2021', '2020', '2019'].forEach(dumpSheetTables);
