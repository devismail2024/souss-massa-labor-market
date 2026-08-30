const fs = require('fs');
const XLSX = require('xlsx');

function dumpFile(filename) {
  console.log('================================================================================');
  console.log(`FILE: ${filename}`);
  console.log('================================================================================');
  const wb = XLSX.readFile(filename);
  wb.SheetNames.forEach(sheetName => {
    console.log(`\n================ SHEET: [${sheetName}] ================`);
    const sheet = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: false });
    data.forEach((row, idx) => {
      const clean = [...row];
      while (clean.length > 0 && (clean[clean.length - 1] === null || clean[clean.length - 1] === '')) {
        clean.pop();
      }
      if (clean.length > 0) {
        console.log(`[R${(idx + 1).toString().padStart(3, '0')}] ${JSON.stringify(clean)}`);
      }
    });
  });
}

const files = fs.readdirSync('.').filter(f => f.endsWith('.xlsx'));
files.forEach(f => dumpFile(f));
