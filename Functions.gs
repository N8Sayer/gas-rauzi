function abbr(range) {
  for (var y=0; y<range.length; y++) {
    if (range[y] == "") {
      range.length = y;
    }
  }  
  for (var x=0; x<range.length; x++) {
    var splits = String(range[x]).split(" ");
    if (splits.length > 0 && range[x] !== "") {
      var newAbbr = splits[0].slice(0,1) + splits[1].slice(0,1);
    }
    range[x] = newAbbr;
  }  
  var count = 2;
  range.forEach(function (name,index) {
    for (var z=index+1; z<range.length; z++) {
      if (name == range[z]) {
        range[index] = name + 1;
        range[z] += count;
        count++;
      }
    }
    count = 2;
  });  
  return range;
}

function outputBuilder(namedValues,sheet,name) {
  var output = [];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('40 Day Form Response');
  var keyValues = sheet.getRange('A1:Z1').getDisplayValues();
  
  for (var x=0; x<keyValues[0].length; x++) {
    output[x] = namedValues[keyValues[0][x]];
  }
  
  output[9] = ['=COUNTA(SPLIT(E:E, " "))+1'];
  output[10] = [String(output[4]).match(/[?!.]\s?/g).length];
  output[11] = ['=J:J/K:K'];
  output[12] = output[2];
  output[13] = ['=J:J/M:M'];
  output[14] = [name];
  output = output.slice(0,15);
  
  return output;
}

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
      formula += uniqueNames[x][3] + "!A2:O";
    }
    else {
      formula += uniqueNames[x][3] + "!A2:O;";
    }
  }
  formula += '},{';
  for (var y=1; y<uniqueNames.length; y++) {
    if (y == uniqueNames.length-1) {
      formula += uniqueNames[y][3] + "!A2:A";
    }
    else {
      formula += uniqueNames[y][3] + "!A2:A;";
    }
  }
  formula += '}<>"")';
  
  return formula;
}

/* DEPRECATED
function sorter() {
  var names = ['SJ','RK','RR','CF','DT','JG','GS','CG'];
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var data = ss.getSheetByName('MAIN').getDataRange().getDisplayValues();
  
  names.forEach(function (name) {
    Logger.log(name);
    var insert = [];
    data.forEach(function (row) {
      if (row[13] == name) {
        insert.push(row);
      }
    });    
    ss.getSheetByName(name).getRange(2,1,insert.length,insert[0].length).setValues(insert);
  });
}

function chartTest() {
  var userSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('C G Charts'); 
  var oldChart = userSheet.getCharts();
  userSheet.removeChart(oldChart[0]);
  var chart = userSheet.newChart()
              .setChartType(Charts.ChartType.AREA)
              .addRange(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('C G').getRange("A2:A"))
              .addRange(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('C G').getRange("I2:I"))
              .setPosition(1,1,0,0)
              .setOption('title', 'Daily Average Word Count Over Time')
              .setOption('legend',{position: 'none'})
              .setOption('selectionMode','multiple')
              .setOption('series',[{ color: '#DC8A77' }])
  .setOption('trendlines',[{ type: 'linear' }])
  .setOption('dataLabels',[{  }])
  .setOption('hAxis.gridlines.count', 40)
  .setOption('annotations.datum', [{ color: '#DC8A77'}])
              .build();
  userSheet.insertChart(chart);
} */