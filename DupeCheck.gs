function dupeCheck() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('MAIN');
  var vals = sheet.getDataRange().getDisplayValues();
  vals.forEach(function(val1, index1) {
    vals.forEach(function(val2, index2) {
      if (val1 === val2 && index1 !== index2) {
        Logger.log([index1 + 1, index2 + 1]);
      }
    });
  });
}
