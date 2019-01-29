// This function creates stylized Google docs based off of the templateID and folderID found on the Settings Tab
// This is to be run after the class has reached completion, and will generate a booklet for each student.
function docOutput() {
  // This chunk gets the fileId for the template, and the output folderID. 
  // Then it grabs the corresponding Template file and Folder and assigns them permanent variables.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var settings = ss.getSheetByName('Settings').getDataRange().getDisplayValues();
  var fileId = settings[1][4];
  var folderId = settings[1][5];
  var template = DriveApp.getFileById(fileId);
  var driveFolder = DriveApp.getFolderById(folderId);
  
  var promptTopics = settings.filter(function(row, index) {
    return index > 0 && row[0] !== "";
  }).map(function(row, index) {
    return [row[0],row[1]];
  });
  
  // This section pulls in all the student information from the Roster Tab. It also grabs the current date to get current year.
  var classMates = ss.getSheetByName('Roster').getDataRange().getDisplayValues();  
  var date = new Date();
  var year = date.getYear();
  
  // This section scans through the student roster for duplicate Usernames
  // This is done because one student used multiple email addresses to submit
  var uniqueNames = [];
  var setter = false;
  for (var a=1; a<classMates.length; a++) {
    for (var b=0; b<uniqueNames.length; b++) {
      if (classMates[a][2] == uniqueNames[b][2]) {
        setter = true;
        b = uniqueNames.length;
      }
    }
    if (!setter) {
      uniqueNames.push(classMates[a]);
    }
    setter = false;
  }
  
  // This is the section that creates the stylized Google Docs for each student
  uniqueNames.forEach(function (student) {  
    // Make a copy of the template file, then open that copy and get the Body from it.
    var newDoc = template.makeCopy('Birds in a Barrel Summary - '+student[1], driveFolder);
    var docId = newDoc.getId();
    var doc = DocumentApp.openById(docId);
    var body = doc.getBody();
    
    // Declare a ton of empty variables for accessings later when creating the Standings page
    var wordCount = 0;
    var timeCount = 0;
    
    // Get the current student's sheet, and declare student name
    var sheetData = ss.getSheetByName(student[2]).getDataRange().getDisplayValues();
    var studentName = student[1];
    
    // This section assumes no duplicate entries have made it through the onFormSubmit, and declares the total days of submissions to be = to the length of the sheet.
    var days = sheetData.length - 1;
    
    // Replacing all the stand-in text on Pg. 2, and putting in a Page Break after the Table of Contents.
    var splitName = studentName.split(" ");
    var firstName = splitName[0] || "";
    var lastName = splitName[1] || "";
    body.replaceText("\\(FIRST-NAME\\)",firstName.toUpperCase());
    body.replaceText("\\(LAST-NAME\\)",lastName.toUpperCase());
    body.replaceText("\\(YEAR\\)",year);
    body.replaceText("\\(DAYS\\)",days);
    body.appendPageBreak();
          
    // Here's where each story is added, and the associated stats for that story are stored for the Standings page later.
    sheetData.forEach(function (row,index) {
      // Always skips the header row
      if (index === 0) {    
        return;
      }
      function promptCheck(promptDay) {
        promptDay = promptDay.match(/\d+/g)[0];
        var output;
        promptTopics.forEach(function(promptRow) {
          var promptNum = promptRow[0].match(/\d+/g)[0];
          if (promptNum == promptDay) {
            output = promptRow[1];
          }
        });
        return output;
      }
      
      var prompt = promptCheck(row[1]);  
      var title = row[3];
      var story = row[4];
      wordCount += parseInt(row[9]);
      timeCount += parseInt(row[10],10);
      
      // This section is all to stylize the Prompt header above each story.
      var parStyle = {};
      parStyle[DocumentApp.Attribute.FONT_FAMILY] = 'Avenir';
      parStyle[DocumentApp.Attribute.FONT_SIZE] = 12;
      parStyle[DocumentApp.Attribute.BOLD] = true;
      parStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#1F3864';
      parStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
      body.appendParagraph(prompt).setAttributes(parStyle);
      
      // Append the title, and a blank row.
      body.appendParagraph(title).setHeading(DocumentApp.ParagraphHeading.HEADING1);
      body.appendParagraph('');
      
      // Justify the body of the story
      var par2Style = {};
      par2Style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.JUSTIFY;
      body.appendParagraph(story).setAttributes(par2Style);
      
      // Page break after each story
      body.appendPageBreak();      
    });
    
    // Last few settings to properly add in the Standings page at the end
    body.appendParagraph('STANDINGS').setHeading(DocumentApp.ParagraphHeading.HEADING5);
    
    var average = wordCount/days;
    var text = 'DAYS: ' + days + ' OF 40\n' +
      'AVERAGE WRITE: '+ Math.round(average) +' WORDS\n' +
      'TOTAL WORD COUNT: '+ wordCount + '\n' +
      'AVERAGE WPM :' + Math.round(wordCount/timeCount);
    
    var style = {};
    style[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
    style[DocumentApp.Attribute.FONT_SIZE] = 14;
    style[DocumentApp.Attribute.BOLD] = true;
    style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#1F3864';
    
    body.appendParagraph(text).setAttributes(style);  
  });
}