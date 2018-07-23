function moveStory(storyRow) {
  var date = new Date();
  date = Utilities.formatDate(date, 'PST', 'M/d/yyyy h:mm a');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var sheetData = sheet.getDataRange().getValues();
  var roster = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Roster');
  var rosterData = roster.getDataRange().getValues();
  
  sheetData.forEach(function(row, index) {
    var sortCheck = row[10];
    var userName = row[9];
    
    if (index > 0 && sortCheck === "") {
      var parsedUserName = userNameCheck(rosterData,userName);
      var outputName = typeof parsedUserName === 'object' ? parsedUserName[1] : parsedUserName;
      row[9] = outputName;
      var userSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(outputName);
      if (userSheet) {
        var lastRow = userSheet.getLastRow();
        var output = outputBuilder(row,userSheet,userName);
        var lastEntry = userSheet.getRange(lastRow,1,1,output.length).getDisplayValues();
        
        if (lastEntry[1] !== output[1] && lastEntry[4] !== output[4]) { // This line blocks duplicate submissions from populating to the student pages
          userSheet.getRange(lastRow+1,1,1,output.length).setValues([output]);
        }
        row[10] = 'Sorted';
        if (row[7] === '') {
          var emailData = buildEmail(row);          
          sendEmail('russ@birdsinabarrel.com',emailData.subject,emailData.body);
        }
      }
    }
  });
  sheet.getDataRange().setValues(sheetData);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('H1').setValue('Last ran on '+date);
}
