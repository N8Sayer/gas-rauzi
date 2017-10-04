function test() {
   var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
    var form = FormApp.openByUrl(formUrl);
    var items = form.getItems();
    var choices = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getDataRange().getDisplayValues();
    
    for (var x=0; x<items.length; x++) {
      var currentChoice = items[x].asListItem().getChoices()[0].getValue();
      if (items[x].getTitle().toLowerCase().search('prompt') !== -1) {
        choices.forEach(function (row,index) {
          if (row[1] == currentChoice) {
            items[x].asListItem().setChoiceValues([choices[index+1][1]]);
            Logger.log(true);
          }
        });
        x = items.length;
      }
    }
}

function deleter() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  
  for (var x=8; x<sheets.length; x++) {
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheets[x]);
  }
}