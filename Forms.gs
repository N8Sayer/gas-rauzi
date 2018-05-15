function moveStory(storyRow) {
  var date = new Date();
  date = Utilities.formatDate(date, 'PST', 'M/d/yyyy h:mm a');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var sheetData = sheet.getDataRange().getValues();
  
  sheetData.forEach(function(row, index) {
    var sortCheck = row[10];
    var userName = row[9];
    
    if (index > 0 && sortCheck === "") {
      Logger.log(userName);
      var userSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(userName);
      if (userSheet) {
        var lastRow = userSheet.getLastRow();
        
        var output = outputBuilder(row,userSheet,userName);
        var lastEntry = userSheet.getRange(lastRow,1,1,output.length).getDisplayValues();
        
        if (lastEntry[1] !== output[1] && lastEntry[4] !== output[4]) { // This line blocks duplicate submissions from populating to the student pages
          userSheet.getRange(lastRow+1,1,1,output.length).setValues([output]);
        }
        row[10] = 'Sorted';
      }
    }
  });
  sheet.getDataRange().setValues(sheetData);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('H1').setValue('Last ran on '+date);
}


// This is just a specialized onFormSubmit which sorts incoming submissions to the appropriate student page, and blocks duplicate entries. 
function onFormSubmit(evt) {
  var key = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Roster').getDataRange().getDisplayValues();
  var output = [];
  
  key.forEach(function (row) {
    if (row[0].toLowerCase() == String(evt.namedValues['EMAIL ADDRESS']).toLowerCase()) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(row[2]); 
      var lastRow = sheet.getLastRow();
      var output = outputBuilder(evt.namedValues,sheet,row[3]);
      var lastEntry = sheet.getRange(lastRow,1,1,output.length).getDisplayValues();
      
      if (lastEntry[1] !== output[1] && lastEntry[4] !== output[4]) { // This line blocks duplicate submissions from populating to the student pages
        sheet.getRange(lastRow+1,1,1,output.length).setValues([output]);
      }
    }
  });
}

/**
 * Test function for Spreadsheet Form Submit trigger functions.
 * Loops through content of sheet, creating simulated Form Submit Events.
 *
 * Check for updates: https://stackoverflow.com/a/16089067/1677912
 *
 * See https://developers.google.com/apps-script/guides/triggers/events#google_sheets_events
 */
function test_onFormSubmit() {
  var dataRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response').getDataRange();
  var data = dataRange.getValues();
  var headers = data[0];
  // Start at row 1, skipping headers in row 0
  for (var row=1; row < data.length; row++) {
    var e = {};
    e.values = data[row].filter(Boolean);  // filter: https://stackoverflow.com/a/19888749
    e.range = dataRange.offset(row,0,1,data[0].length);
    e.namedValues = {};
    // Loop through headers to create namedValues object
    // NOTE: all namedValues are arrays.
    for (var col=0; col<headers.length; col++) {
      e.namedValues[headers[col]] = [data[row][col]];
    }
    //Logger.log(e);              
    // Pass the simulated event to onFormSubmit
    onFormSubmit(e);
  }  
}

/* DEPRECATED
function formUpdate() {
  var date = new Date();
  
  if (date.getDay() !== 0) {
    var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
    var form = FormApp.openByUrl(formUrl);
    var items = form.getItems();
    var choices = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getDataRange().getDisplayValues();
    
    for (var x=0; x<items.length; x++) {
      if (items[x].getTitle().toLowerCase().search('prompt') !== -1) {
        var currentChoice = items[x].asListItem().getChoices()[0].getValue();
        choices.forEach(function (row,index) {
          if (row[1] == currentChoice) {
            items[x].asListItem().setChoiceValues([choices[index+1][1]]);
          }
        });
        x = items.length;
      }
    }
  }
}*/