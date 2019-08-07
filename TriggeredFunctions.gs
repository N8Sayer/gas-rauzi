// Rename to validateSubmissions moving forward
function moveStory() {
  var date = new Date();
  date = Utilities.formatDate(date, 'PST', 'M/d/yyyy h:mm a');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var sheetData = sheet.getDataRange().getValues();
  var rosterData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Roster').getDataRange().getValues();
  
  sheetData.forEach(function(row, index) {
    var sortedCheck = row[10];
    if (index === 0 || sortedCheck !== "") {
      Logger.log('Row %s sorted', index + 1);
      return;
    }
    var userName = row[9];
    var nameCheck = userNameCheck(userName, rosterData);
    
    if (nameCheck.status === 'error') {
//      Logger.log('Invalid Username');
      row[10] = 'Invalid Username';
      return;
    }
    
    var outputName = nameCheck.username; 
    row[9] = outputName;
    
    // Check to replace return style for better formatting
    var checkSingleReturns = row[4].match(/(^|[^\n])\n(?!\n)/g);
    var checkDoubleReturns = row[4].match(/[\r\n]{2,}/g);
    var hasSingleReturns = checkSingleReturns && checkSingleReturns.length;
    var hasDoubleReturns = checkDoubleReturns && checkDoubleReturns.length;
    if (!hasSingleReturns || !hasDoubleReturns) {
      row[4] = row[4].replace(/[\r\n]+/g, "\r\r");
    }  
    
    var isDuplicate = false;
    sheetData.slice(0, index).forEach(function(secondRow) {
      if (row[1] == secondRow[1] && row[4] == secondRow[4]) {
        isDuplicate = true;
      }
    });
    row[10] = isDuplicate ? "Duplicate" : "Sorted";
    
    if (row[7] === '' && row[10] !== 'Duplicate') {
      var emailBody = row[4] + '\r\r' + ' — ' + row[9];
      var emailAddress = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('E5').getValue();
      var emailStatus = sendBlogEmail(emailAddress,row[3],emailBody);
    }
  });
  sheet.getRange(1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('H1').setValue('Last ran on ' + date);
  SpreadsheetApp.flush();
}


/* DEPRECATED 8/1/2019
function restoreStories() {
  var date = new Date();
  date = Utilities.formatDate(date, 'PST', 'M/d/yyyy h:mm a');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var sheetData = sheet.getDataRange().getValues();
  
  sheetData.forEach(function(row, index) {
    var userName = row[9];
    var nameCheck = userNameCheck(userName);
    if (index === 0) {
      return;
    }
    if (nameCheck.status === 'error') {
      row[10] = 'Invalid Username';
      return;
    }    
    var outputName = nameCheck.username;              
    row[9] = outputName;
    var userSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(outputName);
    if (!userSheet) {
      return;
    }
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    var lastRow = userSheet.getLastRow();
    var output = outputBuilder(row,outputName,lastRow);
    var lastEntry = userSheet.getRange(lastRow,1,1,output.length).getDisplayValues();
    
    if (lastEntry[1] === output[1] && lastEntry[4] === output[4]) { // This line blocks duplicate submissions from populating to the student pages
      row[10] = 'Duplicate';
    } else {
      row[10] = 'Sorted';
      userSheet.getRange(lastRow+1,1,1,output.length).setValues([output]);
    }
    SpreadsheetApp.flush();
    lock.releaseLock();    
  });
} */