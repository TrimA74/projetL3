var datasY = [];
var datasYInit = [];
var datasHInit = [];
var datasGInit = [];
var datasFInit = [];

var plotDiv = document.getElementById('graph');
/*
Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Site/data/hydrique/set1/H.csv', function(rows){
  var tmp = [];
  for(var key in rows[0]) {
    tmp.push(Number(key));
  }
  datasHInit.push(tmp);
  rows.forEach(function(e) {
    var tmp = [];
    for(var key in e) {
      var value = e[key];
      tmp.push(Number(value));
    }
      datasHInit.push(tmp);
  });
});
*/
Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Site/data/hydrique/set1/G.csv', function(rows){
  console.log(rows);
  var tmp = [];
  for(var key in rows[0]) {
    tmp.push(Number(key));
  }
  datasGInit.push(tmp);
  rows.forEach(function(e) {
    var tmp = [];
    for(var key in e) {
      var value = e[key];
      tmp.push(Number(value));
    }
      datasGInit.push(tmp);
  });
  //console.log(datasGInit);
});
/*
Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Site/data/hydrique/set1/F.csv', function(rows){
  var tmp = [];
  for(var key in rows[0]) {
    tmp.push(Number(key));
  }
  datasFInit.push(tmp);
  rows.forEach(function(e) {
    var tmp = [];
    for(var key in e) {
      var value = e[key];
      tmp.push(Number(value));
    }
      datasFInit.push(tmp);
  });
});
*/
Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Test/Fichiers_txt/X.txt', function(rows){
  var datasX = [];
  rows.forEach(function(e) {
    for(var key in e) {
    var value = e[key];
    datasX.push(Number(value));
    }
  });
  datasY = datasHInit.slice();
  console.log(datasY);
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