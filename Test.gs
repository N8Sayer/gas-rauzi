function test() {
  var url = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
  var form = FormApp.openByUrl(url);
  Logger.log(url);
}

function deleter() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  
  for (var x=8; x<sheets.length; x++) {
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheets[x]);
  }
}