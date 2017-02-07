Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Test/PlotlyTest/jeuTestPlotLy.csv', function(rows){
  console.log(rows);
  var test = rows.map(function(row){          // set the x-data
        return row['Time'];
      });
      console.log(test);
    var trace = {
      type: 'scatter',                    // set the chart type
      mode: 'lines',                      // connect points with lines
      x: rows.map(function(row){          // set the x-data
        return row['Time'];
      }),
      y: rows.map(function(row){          // set the x-data
        return row['T'];
      })
    };
    console.log(trace);
    var layout = {
      yaxis: {title: "temperature temps"},       // set the y axis title
      xaxis: {
        showgrid: false,                  // remove the x-axis grid lines
        tickformat: "%B, %Y"              // customize the date format to "month, day"
      },
      margin: {                           // update the left, bottom, right, top margin
        l: 40, b: 10, r: 10, t: 20
      },
      showlegend : false
    };

    Plotly.plot(document.getElementById('graph'), [trace], layout, {showLink: false});
});

// test
  

console.log((1.1111111e-01).toFixed(2)); // 1267650600228229401496703205376