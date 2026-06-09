// Google Apps Script backend untuk menerima surat teman ke Google Sheets.
// 1. Buat Google Sheet baru.
// 2. Extensions > Apps Script.
// 3. Paste kode ini.
// 4. Deploy > New deployment > Web app.
// 5. Execute as: Me. Who has access: Anyone.
// 6. Copy Web App URL ke LETTERS_API_URL di kedua file HTML.

const SHEET_NAME = 'Letters';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['timestamp', 'name', 'message']);
  }
  return sheet;
}

function doPost(e) {
  const sheet = getSheet_();
  const name = (e.parameter.name || 'Anonymous').toString().trim();
  const message = (e.parameter.message || '').toString().trim();
  if (message) sheet.appendRow([new Date(), name, message]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues().slice(1);
  const letters = rows
    .filter(row => row[2])
    .map(row => ({
      timestamp: row[0],
      name: row[1] || 'Anonymous',
      message: row[2] || ''
    }));
  return ContentService
    .createTextOutput(JSON.stringify({ letters }))
    .setMimeType(ContentService.MimeType.JSON);
}
