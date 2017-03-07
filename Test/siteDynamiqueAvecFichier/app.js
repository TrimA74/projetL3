var datasY = [];
var datasYInit = [];

var plotDiv = document.getElementById('graph');
Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Test/Fichiers_txt/Y.txt', function(rows){

  rows.forEach(function(e) {
    for(var key in e) {
    var value = e[key];
    datasYInit.push(Number(value)*2);
    }
  });
});
Plotly.d3.csv('https://raw.githubusercontent.com/TrimA74/projetL3/master/Test/Fichiers_txt/X.txt', function(rows){
  var datasX = [];
  rows.forEach(function(e) {
    for(var key in e) {
    var value = e[key];
    datasX.push(Number(value));
    }
  });
  datasY = datasYInit.slice();
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
      yaxis: {title: "Température [°c] = t"},       // set the y axis title
      xaxis: {title: "Epaisseur [m] = X",
        showgrid: true,                  // remove the x-axis grid lines              // customize the date format to "month, day"
      },
      margin: {                           // update the left, bottom, right, top margin
        l: 60, b: 60, r: 60, t: 60
      },
      showlegend : false
    };    
    Plotly.plot(plotDiv, [trace], layout, {showLink: false});
});

/*
var slider = $("#rangeX").slider({ 
  tooltip: 'always'
});
slider.on('slideStop',updateSlider);
var sliderT = $("#rangeT").slider({ 
  tooltip: 'always'
});
sliderT.on('slideStop',updateSlider);
var sliderA = $("#rangeA").slider({ 
  tooltip: 'always'
});
sliderA.on('slideStop',updateSlider);

var sliderB = $("#rangeB").slider({ 
  tooltip: 'always'
});
sliderB.on('slideStop',updateSlider);

var sliderNu = $("#rangeNu").slider({ 
  tooltip: 'always'
});
sliderNu.on('slideStop',updateSlider);*/


function updateSlider () {
  Promise.all([plotDiv]).then(function () {
    plotDiv.data[0].y = datasYInit.slice();
    plotDiv.data[0].y.forEach(function (e,i) {
    plotDiv.data[0].y[i] = e * slider.slider('getValue');
    });
    Plotly.redraw(plotDiv);
});
}


function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}


$('#selectset').on('change', function() {
  alert( this.value );
  //alert( $_GET("cat"));
  $.ajax({
                url: 'ajax.php',
                type:'POST',
                dataType : 'json', // On désire recevoir du HTML
                data:
                {
                    myFunction:'chargeSet',
                    myParams:{
                        set:this.value,
                        cat:$_GET("cat")
                    }
                },
                success: function(result)
                {
                    majApresSet(result);
                    console.log(result);
                }
            });
            
});


function majApresSet(data)
{
    //gestion boutons
    $("#boutons").children().remove();
    
    str = "<div class='col-md-4'></div>";
    str += "<div class='col-md-4'>";
    str += "<h2> <span class='glyphicon glyphicon-option-horizontal'></span>  Matrice en abscisse</h2>";
    
    for(i=1; i<data.length; i++)
    {   if(data[i][1] == 1)
            str += "<button class='btn btn-primary btn-lg' style='background: linear-gradient(to bottom right, #3366ff 0%, #66ff33 100%);'>"+ data[i][0] + "</button>";
    }
    str += "</div>";
	str += "<div class='col-md-4'></div>";
    
    $("#boutons").append(str);
    
    
    
    //gestion parametres
    $("#parametres").children().remove();
    str = "<h2><span class='glyphicon glyphicon-option-vertical'></span>  Autres paramètres <h2/>";
    
    for(i=1; i<data.length; i++)
    {
        if(data[i][1] == 1)
        {
            str += "<div class='form-horizontal' >";
            str += "<div class='form-group' id='param" + data[i][0] + "'  style='visibility:hidden;'>";
            str += "<label for='amountInput" + data[i][0] + "' class='col-sm-1 control-label'>" + data[i][0] + "</label>";
            str += "<div class='col-sm-2'>";
            str += "<input type='number' onchange=\"$('#range" + data[i][0] + "').slider('setValue',this.value);updateSlider();\" name='amountInput'" + data[i][0] + "' value='50' min='0' max='100' step='1' class='form-control'/>";
            str += "</div>";
            str += "<div class='col-sm-4'>";
            str += "<input  id='range" + data[i][0] + "' type='text'  name='amountRange' onchange=\"document.getElementsByName('amountInputX')[0].value=this.value;\" data-slider-min='0' data-slider-max='100' step='1' data-slider-value='50' />";
            str += "</div>";
            str += "</div>";
        }
    }
    
     str += "</div>";
     $("#parametres").append(str);
    
    
    console.log("fait");
}
/*
console.log((1.1111111e-01).toFixed(2)); // 1267650600228229401496703205376*/