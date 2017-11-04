function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Setup Menu')
    .addItem('Student Page Setup', 'menuItem1')
    .addSeparator()
    .addItem('Trigger Installer', 'menuItem2')
    .addSeparator()
    .addItem('Student Page Deleter', 'menuItem3')
    .addToUi();  
}

function menuItem1() {
  pageMaster();
}

function menuItem2() {
  triggers();  
}

function menuItem3() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();  
  for (var x=8; x<sheets.length; x++) {
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheets[x]);
  }
}

function triggers() {
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("onFormSubmit")
   .forSpreadsheet(sheet)
   .onFormSubmit()
   .create();
  
  ScriptApp.newTrigger("formUpdate")
   .timeBased()
   .atHour(2)
   .everyDays(1)
   .create();
}

function pageMaster() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var template1 = ss.getSheetByName('Template - Data');
  var names = ss.getSheetByName('Roster').getDataRange().getDisplayValues();
  
  names.forEach(function(row,index) {
    if (index > 0) {
      if (row[3] == "") {
        if (!ss.getSheetByName(row[2])) {
          var userSheet = ss.insertSheet(12,{template: template1});
          userSheet.setName(row[2]);
        }
        
        if (!ss.getSheetByName(row[2] + ' Charts')) {
          var userCharts = ss.insertSheet(row[2] + ' Charts', 11); 
          if (!userSheet) {
            var userSheet = ss.getSheetByName(row[2]);
          }
          chartGet(userSheet,userCharts);                
        }
      }
      else {
        if (!ss.getSheetByName(row[3])) {
          var userSheet = ss.insertSheet(12,{template: template1});
          userSheet.setName(row[3]);
          
          if (!ss.getSheetByName(row[3] + ' Charts')) {
            var userCharts = ss.insertSheet(row[3] + ' Charts', 11); 
            chartGet(userSheet,userCharts);                
          }
        }
      }
    }
  });
  
  var main = ss.getSheetByName('MAIN');
  var formula = formulaMaker(names);
  main.getRange(2,1).setFormula(formula);
}

function chartGet(dataPage,chartPage) {
  var charts = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Template - Individual Charts').getCharts(); 
  var chartOrders = [['O2:O1095'],['O2:O1095','J2:J1095'],['O2:O1095','J2:J1095'],['B2:B1095','J2:J1095'],['O2:O1095','N2:N1095'],['A2:A1095','J2:J1095']];
  
  for (var x=0; x<charts.length; x++) {
    var newChart = charts[x].modify();
    newChart.removeRange(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Template - Individual Charts').getRange('A1'))
            .setOption('width', 600);
    
    chartOrders[x].forEach(function (range) {
      newChart.addRange(dataPage.getRange(range));                            
    });      
    
    var chart = newChart.build();
    chartPage.insertChart(chart);
  }
}