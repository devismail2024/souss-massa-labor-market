const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function cleanStr(s) {
  if (s === null || s === undefined) return '';
  return s.toString().trim();
}

function parseNum(val) {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : parseFloat(val.toString().replace(',', '.').replace(/\s/g, ''));
  return isNaN(num) ? null : Math.round(num * 100) / 100; // retain up to 2 decimal places
}

const wbEne = XLSX.readFile('ENE-Indicateurs dÃ©sagrÃ©gÃ©s 2019-2024- RÃ©gion #09 -07052025.xlsx');

// Let's inspect how tables are named and structured across sheets
function extractYearTables(sheetName, yearLabel) {
  const sheet = wbEne.Sheets[sheetName];
  if (!sheet) return null;
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  const tables = [];
  let currentTable = null;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const firstCell = cleanStr(row[0]);
    
    // Check if this row is a table title
    if (firstCell && (
      firstCell.startsWith('La ') || firstCell.startsWith('Le ') || 
      firstCell.startsWith('Les ') || firstCell.startsWith('Structure ') || 
      firstCell.startsWith('Taux ') || firstCell.startsWith("L'âge")
    )) {
      if (currentTable) {
        tables.push(currentTable);
      }
      currentTable = {
        title: firstCell,
        startRow: i + 1,
        headers: [],
        dataRows: [],
        metadata: {}
      };
    } else if (currentTable) {
      // Check for metadata at the bottom of the table
      if (firstCell.startsWith('Champ :')) {
        currentTable.metadata.champ = firstCell.replace('Champ :', '').trim();
      } else if (firstCell.startsWith('Référence :')) {
        currentTable.metadata.reference = firstCell.replace('Référence :', '').trim();
      } else if (firstCell.startsWith('Unité :') || firstCell.startsWith('Unités :')) {
        currentTable.metadata.unit = firstCell.replace(/Unités?\s*:/, '').trim();
      } else if (firstCell.startsWith('Source :')) {
        currentTable.metadata.source = firstCell.replace('Source :', '').trim();
      } else if (firstCell.includes('résultat trop peu significatif') || firstCell.includes('résultat moyennement significatif') || firstCell === 'ps :' || firstCell === 'ms :') {
        currentTable.metadata.notes = (currentTable.metadata.notes || '') + ' ' + firstCell;
      } else {
        const nonEmpties = row.filter(x => x !== '');
        if (nonEmpties.length > 0) {
          // If headers not yet captured
          if (currentTable.headers.length === 0 && (row.includes('Urbain') || row.includes('Ensemble') || row.includes('Chiffre') || row.includes(2019) || row.includes(2020))) {
            currentTable.headers.push(row);
          } else if (currentTable.headers.length === 1 && (row.includes('Chiffre') || row.includes('Signe') || row.includes('Urbain'))) {
            currentTable.headers.push(row);
          } else {
            currentTable.dataRows.push(row);
          }
        }
      }
    }
  }
  if (currentTable) {
    tables.push(currentTable);
  }
  
  return tables;
}

const years = [
  { sheet: '2019', year: 2019 },
  { sheet: '2020', year: 2020 },
  { sheet: '2021', year: 2021 },
  { sheet: '2022', year: 2022 },
  { sheet: '2023', year: 2023 },
  { sheet: 'Data 2024', year: 2024 }
];

const summary = {};
years.forEach(y => {
  const t = extractYearTables(y.sheet, y.year);
  summary[y.year] = { sheet: y.sheet, tableCount: t ? t.length : 0, titles: t ? t.map(x => x.title) : [] };
  console.log(`Year ${y.year} (${y.sheet}): extracted ${t ? t.length : 0} tables`);
});

fs.writeFileSync('/tmp/extracted_tables_summary.json', JSON.stringify(summary, null, 2));
