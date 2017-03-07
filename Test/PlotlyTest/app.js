var datasY = [];
var datasYInit = [];
var datasHInit = [];
var datasGInit = [];
var datasFInit = [];

var plotDiv = document.getElementById('graph');

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(Number(data[j]));
            }
            lines.push(tarr);
        }
    }
    return lines.slice();
}



$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/TrimA74/projetL3/master/Site/data/hydrique/set1/G.csv",
        dataType: "text",
        success: function(data) {datasGInit = processData(data);}
     });
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/TrimA74/projetL3/master/Site/data/hydrique/set1/H.csv",
        dataType: "text",
        success: function(data) {datasHInit = processData(data);}
     });
     $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/TrimA74/projetL3/master/Site/data/hydrique/set1/F.csv",
        dataType: "text",
        success: function(data) {datasFInit = processData(data);}
     });

});
$(document).ajaxStop(function () { // Quand on a finit de récup les données
  console.log(datasHInit[6][16]);
  console.log(datasFInit[6][16]);
  console.log(datasGInit[6][16]);
});

Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Test/Fichiers_txt/X.txt', function(rows){
  var datasX = [];
  rows.forEach(function(e) {
    for(var key in e) {
    var value = e[key];
    datasX.push(Number(value));
    }
  });
  datasY = datasHInit.slice();
  var test = rows.map(function(row){          // set the x-data
        return row['Time'];
      });
    var trace = {
      type: 'scatter',                    // set the chart type
      mode: 'lines',                      // connect points with lines
      x: datasX,
      y: datasY
    };
    var layout = {
      yaxis: {title: "temperature temps"},       // set the y axis title
      xaxis: {
        showgrid: true,                  // remove the x-axis grid lines              // customize the date format to "month, day"
      },
      margin: {                           // update the left, bottom, right, top margin
        l: 60, b: 60, r: 60, t: 60
      },
      showlegend : false
    };    
    Plotly.plot(plotDiv, [trace], layout, {showLink: false});
});


var slider = $("#rangeX").slider({ 
  tooltip: 'always'
});
slider.on('slideStop',updateSlider);


function updateSlider () {
  Promise.all([plotDiv]).then(function () {
    plotDiv.data[0].y = datasYInit.slice();
    plotDiv.data[0].y.forEach(function (e,i) {
      plotDiv.data[0].y[i] = e * slider.slider('getValue');
    });
    Plotly.redraw(plotDiv);
});
}

/*
console.log((1.1111111e-01).toFixed(2)); // 1267650600228229401496703205376*/