var datasY = [];
Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Test/Fichiers_txt/Y.txt', function(rows){

  rows.forEach(function(e) {
    for(var key in e) {
    var value = e[key];
    datasY.push(Number(value)*2);
    }
  });
  console.log(datasY);
});
Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Test/Fichiers_txt/X.txt', function(rows){
  console.log(rows);
  var datasX = [];
  rows.forEach(function(e) {
    for(var key in e) {
    var value = e[key];
    datasX.push(Number(value));
    }
  });
  console.log(datasX);
  var test = rows.map(function(row){          // set the x-data
        return row['Time'];
      });
      //console.log(test);
    var trace = {
      type: 'scatter',                    // set the chart type
      mode: 'lines',                      // connect points with lines
      x: datasX,
      y: datasY
    };
    //console.log(trace);
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

    Plotly.plot(document.getElementById('graph'), [trace], layout, {showLink: false});
});

// test
  

console.log((1.1111111e-01).toFixed(2)); // 1267650600228229401496703205376