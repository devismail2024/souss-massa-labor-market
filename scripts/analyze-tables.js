const XLSX = require('xlsx');

function analyzeWorkbook(file) {
  console.log(`\n========================================\nFILE: ${file}\n========================================`);
  const wb = XLSX.readFile(file);
  wb.SheetNames.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    console.log(`\n--- Sheet: ${sheetName} (Rows: ${rows.length}) ---`);
    
    let currentTable = null;
    let tableRows = [];
    
    rows.forEach((r, idx) => {
      const firstCell = (r[0] || '').toString().trim();
      const nonEmpties = r.filter(x => x !== '');
      
      // Check if title row
      if (firstCell && !firstCell.match(/^[0-9.,-]+$/) && nonEmpties.length <= 2 && (
        firstCell.startsWith('La ') || firstCell.startsWith('Le ') || firstCell.startsWith('Les ') ||
        firstCell.startsWith('Structure ') || firstCell.startsWith('Taux ') || firstCell.startsWith('Activité') ||
        firstCell.startsWith('Emploi') || firstCell.startsWith('Chômage') || firstCell.startsWith('•') ||
        firstCell.includes("d'activité") || firstCell.includes("d'emploi") || firstCell.includes("de chômage") ||
        firstCell.includes("de travail") || firstCell.includes("secteur") || firstCell.includes("diplôme") ||
        firstCell.includes("statut") || firstCell.includes("sous-emploi") || firstCell.includes("chômeurs") ||
        firstCell.includes("travailleurs") || firstCell.includes("assurance")
      )) {
        if (currentTable && tableRows.length > 0) {
          console.log(`Table [${currentTable}] with ${tableRows.length} data rows`);
        }
        currentTable = firstCell;
        tableRows = [];
      } else if (nonEmpties.length > 0) {
        tableRows.push({ rowIdx: idx + 1, content: nonEmpties });
      }
    });
    if (currentTable && tableRows.length > 0) {
      console.log(`Table [${currentTable}] with ${tableRows.length} data rows`);
    }
  });
}

analyzeWorkbook('2023 - Indicateurs clÃ©s par province - SOUS MILIEU.xlsx');
analyzeWorkbook('2025 - Chiffres clÃ©s dÃ©taillÃ©s - RÃ©gion.xlsx');
analyzeWorkbook('emploi crÃ©es par provinces 23-24-25.xlsx');
analyzeWorkbook('2024 - Indicateurs dÃ©sagrÃ©gÃ©s dÃ©taillÃ©s - RÃ©gion.xlsx');
