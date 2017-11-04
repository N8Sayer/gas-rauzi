// Functions remaining to program:
// Create new document from Template instead of rewriting the template
// Remove the limiting function that restricts it to one student
// Filter the list by unique initials:
/* var setter = false;
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
  } */
// Title renaming per student name
// Menu function pointing here
// Ask if she wants this automated
// Pointer variable to folder location in Settings menu

function docOutput() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var classMates = ss.getSheetByName('Roster').getDataRange().getDisplayValues();
//  var doc = DocumentApp.create('BIAB Test Doc');
  var doc = DocumentApp.openByUrl('https://docs.google.com/open?id=1W6eciHA0pP7lGc2EgjtPRRH4JLrBn6rBYXdKnsvGLNM');
  var body = doc.getBody();
  var date = new Date();
  var year = date.getYear();
  
  classMates.forEach(function (student) {
    if (student[3] !== "" && student[3] == 'RLR') {
      var sheetData = ss.getSheetByName(student[3]).getDataRange().getDisplayValues();
      var studentName = student[1];
      body.replaceText("\\(first-name\\)",studentName.split(" ")[0].toUpperCase());
      body.replaceText("\\(last-name\\)",studentName.split(" ")[1].toUpperCase());
      body.replaceText("\\(year\\)",year);
      
      sheetData.forEach(function (row,index) {
        if (index > 0) {          
          var prompt = row[1];
          var title = row[3];
          var story = row[4];
          
          body.insertParagraph(body.getParagraphs().length-1, prompt).setHeading(DocumentApp.ParagraphHeading.HEADING5);
          body.insertParagraph(body.getParagraphs().length-1, title).setHeading(DocumentApp.ParagraphHeading.HEADING6);
          body.insertParagraph(body.getParagraphs().length-1, "");
          body.insertParagraph(body.getParagraphs().length-1, story);
          body.insertPageBreak(body.getParagraphs().length-1);          
        }
      });      
    }
  });
}