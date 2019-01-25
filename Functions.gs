// Appends the extra stats onto forms before they are moved to the correct student sheet
function outputBuilder(values, name, row) {
  var prevRow = row;
  row = row + 1;
  var output = [];  
  for (var x=0; x<values.length; x++) {
    output[x] = values[x];
  }  
  output[9] = ['=COUNTA(SPLIT(E:E, " "))'];
  output[10] = output[4].match(/[?!.]\s?/g) ? [output[4].match(/[?!.]\s?/g).length] : 0;
  output[11] = ['=ROUND(J:J/K:K)'];
  output[12] = output[5];
  output[13] = ['=J:J/M:M'];
  output[14] = [name];
  if (row === 2) {
    output[15] = [name];
  } else {
    output[15] = ['=IF(COUNT(FILTER($A$2:$A' + prevRow + ', TEXT($A$2:$A' + prevRow + ', "m/d/yyyy") = TEXT($A' + row + ', "m/d/yyyy"))), "", "' + name + '")'];    
  }
  return output;
}

// Creates the custom formula used on MAIN to display all of the student data for the Group Charts to feed off of 
function formulaMaker(names) { 
  var uniqueNames = [];
  var setter = false;
  for (var a=0; a<names.length; a++) {
    for (var b=0; b<uniqueNames.length; b++) {
      if (names[a] == uniqueNames[b]) {
        setter = true;
        b = uniqueNames.length;
      }
    }
    if (!setter) {
      uniqueNames.push(names[a]);
    }
    setter = false;
  }
  
  var formula = '=FILTER({';
  
  for (var x=1; x<uniqueNames.length; x++) {
    if (x == uniqueNames.length-1) {
      formula += "'" + uniqueNames[x][2] + "'" + "!A2:P";
    }
    else {
      formula += "'" + uniqueNames[x][2] + "'" + "!A2:P;";
    }
  }
  formula += '},{';
  for (var y=1; y<uniqueNames.length; y++) {
    if (y == uniqueNames.length-1) {
      formula += "'" + uniqueNames[y][2] + "'" + "!A2:A";
    }
    else {
      formula += "'" + uniqueNames[y][2] + "'" + "!A2:A;";
    }
  }
  formula += '}<>"")';
  
  return formula;
}

// Email when form is submitted
function buildEmail(userRow,dailyEmail) {
  var sheetName = SpreadsheetApp.getActiveSpreadsheet().getName();
  
  var date = userRow[0];
  var day = userRow[1];
  var userName = userRow[9];  
  var subject = '40 Days Workout for ' + sheetName + ' -- ' + day + ' -- ' + userName;
  
  var prompt = userRow[2];
  var title = userRow[3];
  var textBody = userRow[4].replace(/\n/g, '<br>');
  var howLong = userRow[5];
  var postThis = userRow[7] === '' ? 'Go Ahead' : userRow[7];
  var comments = userRow[8];
  var body = 
    '<strong>' + day + ':</strong> ' + prompt + '<br><br>' + 
    '<strong>Post this?</strong> ' + postThis + '<br><br>' +
    '<strong>By:</strong> ' + userName;
  if (!dailyEmail) {
    body += '<hr>';
  }
  else {
    body += '<br><br>';
  }
  body += 
    '<strong>' + title + '</strong><br><br>' + 
    textBody + '<br>';
  if (!dailyEmail) {
    body +='<hr>';
  }
  else {
    body += '<br>';
  }
  body +=
    '<strong>How long?</strong> ' + howLong + ' minutes<br><br>' +
    '<strong>Comments:</strong> ' + comments;    
        
  var output = {
    subject: subject,
    body: body
  };
  return output;
}

function dailyEmailUpdate() {
  var now = new Date();
  var dayStart = new Date(now.getYear(),now.getMonth(),now.getDate()-1,2,0,0);
  var dayEnd = new Date(now.getYear(),now.getMonth(),now.getDate(),2,0,0);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var sheetData = sheet.getDataRange().getValues();
  var dayData = [];
  var incorrectNames = [];
  var dayName;
  sheetData.forEach(function(row,index) {
    var dateTime = new Date(row[0]);
    var userName = row[9];
    if (index > 0 && dateTime.getTime() >= dayStart.getTime() && dateTime.getTime() <= dayEnd.getTime()) {
      var emailData = buildEmail(row,'daily');
      dayData.push(emailData.body);
      if (!dayName) {
        dayName = row[1];
      }
      var nameCheck = userNameCheck(userName);
      if (nameCheck.username !== userName) {
        var displayInfo = 'Row('+(index+1)+'): ';
        if (nameCheck.status === 'email') {
          displayInfo += 'Incorrectly Submitted Username: ' + userName + ', Corrected Username: ' + nameCheck.username;
        } else if (nameCheck.status === 'error') {
          displayInfo += 'Incorrectly Submitted Username: ' + userName + ', Could Not Correct';
        } else {
          displayInfo += nameCheck.username;
        }
        incorrectNames.push(displayInfo);
      }
    }
  });
  var body = '<h3>Incorrect Submissions</h3>' + incorrectNames.join('<br>') + '<br><br>';
  body += '<hr>' + dayData.join('<hr><br><br><hr>') + '<hr>';
  var emailList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('G5').getValue();
  sendEmail(emailList, '40 Days Summary for ' + dayName + ' - ' + SpreadsheetApp.getActiveSpreadsheet().getName(), body);
}

function sendEmail(recipients,subject,body) {
  var sendingEmailAddress = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('F5').getValue();
  MailApp.sendEmail({
    to: recipients, 
    name: sendingEmailAddress,
    replyTo: sendingEmailAddress,
    subject: subject, 
    htmlBody: body
  });
  return 'Email sent';    
}

function userNameCheck(name) {
  var roster = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Roster');
  var rosterData = roster.getDataRange().getValues();
  
  var output;
  var lowerName = name.toLowerCase();
  rosterData.forEach(function(row, index) {
    if (index > 0 && !output) {
      var rosterName = row[2].toLowerCase();
      var emailAddress = row[0];
      if (lowerName == rosterName) {
        output = {
          username: name,
          status: 'valid'
        }
      }
      else if (emailAddress.toLowerCase().search(lowerName) > -1) {
        output = {
          username: row[2],
          status: 'email'
        }
      }
    }
  });
  
  return output || { username: name, status: 'error'};
}

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

function test() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var sheetData = sheet.getDataRange().getValues();
  var roster = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Roster');
  var rosterData = roster.getDataRange().getValues();
  sheetData.forEach(function(row) {
    Logger.log(userNameCheck(rosterData,row[9]));
  });
}