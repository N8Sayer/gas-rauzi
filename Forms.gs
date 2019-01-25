function moveStory() {
  var date = new Date();
  date = Utilities.formatDate(date, 'PST', 'M/d/yyyy h:mm a');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var sheetData = sheet.getDataRange().getValues();
  
  sheetData.forEach(function(row, index) {
    var sortedCheck = row[10];
    var userName = row[9];
    var nameCheck = userNameCheck(userName);
    
    if (index === 0 || sortedCheck !== "") {
      Logger.log('Row %s sorted', index + 1);
      return;
    }
    if (nameCheck.status === 'error') {
      row[10] = 'Invalid Username';
      Logger.log('Invalid Username');
      return;
    }
    
    var outputName = nameCheck.username;              
    var userSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(outputName);
    if (!userSheet) {
      Logger.log('Usersheet not found for user %s', outputName);
      return;
    }
    row[9] = outputName;
    
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    var lastRow = userSheet.getLastRow();
    var output = outputBuilder(row, outputName, lastRow);
    var lastEntry = userSheet.getRange(lastRow, 1, 1, output.length).getDisplayValues();
    
    if (lastEntry[1] === output[1] && lastEntry[4] === output[4]) { // This line blocks duplicate submissions from populating to the student pages
      row[10] = 'Duplicate';
    } else {
      row[10] = 'Sorted';
      userSheet.getRange(lastRow + 1, 1, 1, output.length).setValues([output]);
    }
    
    if (row[7] === '') {
      var emailBody = row[4].replace(/\n/g, '<br>') + '<br>' + ' — ' + row[9];
      var emailAddress = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('F4').getValue();
      var emailStatus = sendEmail(emailAddress,row[3],emailBody);
    }
    SpreadsheetApp.flush();
    lock.releaseLock();
  });
  sheet.getDataRange().setValues(sheetData);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('H1').setValue('Last ran on '+date);
}

function restoreStories() {
  var date = new Date();
  date = Utilities.formatDate(date, 'PST', 'M/d/yyyy h:mm a');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var sheetData = sheet.getDataRange().getValues();
  
  sheetData.forEach(function(row, index) {
    var userName = row[9];
    var nameCheck = userNameCheck(userName);
    
    if (index > 0 && nameCheck.status !== 'error') {
      var outputName = nameCheck.username;              
      row[9] = outputName;
      var userSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(outputName);
      if (userSheet) {
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
      }
    } else if (index > 0 && nameCheck.status === 'error') {
      row[10] = 'Invalid Username';
    }
  });
}