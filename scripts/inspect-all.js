const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const files = fs.readdirSync('.').filter(f => f.endsWith('.xlsx'));
console.log(`Found ${files.length} Excel files:`, files);

files.forEach(filename => {
  console.log('\n================================================================================');
  console.log(`FILE: ${filename}`);
  console.log('================================================================================');
  const workbook = XLSX.readFile(filename);
  console.log(`Sheet Names (${workbook.SheetNames.length}):`, workbook.SheetNames);
  
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- SHEET: [${sheetName}] ---`);
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
    console.log(`Range: ${sheet['!ref']} (Rows: ${range.e.r + 1}, Cols: ${range.e.c + 1})`);
    
    // Convert to JSON / array of arrays
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: false });
    console.log(`Total rows extracted: ${rows.length}`);
    
    // Print first 25 rows
    console.log('First 25 rows:');
    rows.slice(0, 25).forEach((r, idx) => {
      const rowClean = [...r];
      while (rowClean.length > 0 && (rowClean[rowClean.length - 1] === null || rowClean[rowClean.length - 1] === '')) {
        rowClean.pop();
      }
      if (rowClean.length > 0) {
        console.log(`  Row ${idx + 1}: ${JSON.stringify(rowClean)}`);
      }
    });
    
    // Check if there are footnote rows at the bottom
    if (rows.length > 25) {
      console.log('Last 10 rows:');
      rows.slice(-10).forEach((r, idx) => {
        const rowClean = [...r];
        while (rowClean.length > 0 && (rowClean[rowClean.length - 1] === null || rowClean[rowClean.length - 1] === '')) {
          rowClean.pop();
        }
        if (rowClean.length > 0) {
          console.log(`  Row ${rows.length - 10 + idx + 1}: ${JSON.stringify(rowClean)}`);
        }
      });
    }
  });
});
