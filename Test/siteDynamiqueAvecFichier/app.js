var datasY = [];
var datasYInit = [];

var matrix = new Object();
var variableChoisi;

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


function updateSlider (elem) {
    Promise.all([plotDiv]).then(function () {
    plotDiv.data[0].y = datasYInit.slice();
    plotDiv.data[0].y.forEach(function (e,i) {
    plotDiv.data[0].y[i] = e * elem.value;//slider.slider('getValue');
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
  //alert( $_GET("cat"));
  var set = this.value;
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
                    majApresSet(result, set);
                }
            });
            
});

function changeParams(parametre)
{
    variableChoisi = parametre;
    $("#parametres").find(".param").css('display', 'block');
    $("#parametres").find("#param"+ parametre).css('display', 'none');
    
}

//https://raw.githubusercontent.com/TrimA74/projetL3/master/Test/siteDynamiqueAvecFichier/"+ $_GET("cat") +"/"+ set +"/"+ data[i][0] +".csv


function majApresSet(data, set)
{
    for(var i=1; i<data.length; i++)
    {   
        if(data[i][1] == 1)
        {
            $.ajax({
                type: "GET",
                async: false,
                url: "data/"+ $_GET("cat") +"/"+ set +"/"+ data[i][0] +".csv",
                dataType: "text",
                success: function(matrice) {
                    matrix[data[i][0]] = processData(matrice);
                }
             });
        }
    }
    
    
    
    //gestion boutons
    $("#boutons").children().remove();
    
    str = "<div class='col-md-4'></div>";
    str += "<div class='col-md-4'>";
    str += "<h2> <span class='glyphicon glyphicon-option-horizontal'></span>  Matrice en abscisse</h2>";
    
    for(i=1; i<data.length; i++)
    {   if(data[i][1] == 1)
            str += "<button onclick=\"changeParams($( this ).text())\" class='btn btn-primary btn-lg' style='background: linear-gradient(to bottom right, #3366ff 0%, #66ff33 100%);'>"+ data[i][0] + "</button>";
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
            str += "<div class='form-group param' id='param" + data[i][0] + "'  style='display:none;'>";
            str += "<label for='amountInput" + data[i][0] + "' class='col-sm-1 control-label'>" + data[i][0] + "</label>";
            str += "<div class='col-sm-2'>";
            str += "<input type='number' onchange=\"$('#range" + data[i][0] + "').slider('setValue',this.value);updateSlider($( this ));\" name='amountInput" + data[i][0] + "' value='50' min='0' max='100' step='1' class='form-control'/>";
            str += "</div>";
            str += "<div class='col-sm-4'>";
            str += "<input  id='range" + data[i][0] + "' type='text'  name='amountRange' onchange=\"document.getElementsByName('amountInput" + data[i][0] + "')[0].value=this.value;\" data-slider-min='0' data-slider-max='100' step='1' data-slider-value='50' />";
            str += "</div>";
            str += "</div>";
        }
    }
    
     str += "</div>";
     $("#parametres").append(str);
    
    var slider;
    for(i=1; i<data.length; i++)
    {
        if(data[i][1] == 1)
        {
    
            slider = $("#range" + data[i][0]).slider({ 
              tooltip: 'always'
            });
            slider.on('slideStop',updateSlider);
        
        }
    }
    
    var tableaux = new Object;//les lignes choisis
    
    for(i=1; i<data.length; i++)
    {
        if(data[i][1] == 1)
        {
            tableaux[i-1] = matrix[data[i][0]][$("#range" + data[i][0]).slider('getValue')];
        }
    }
    
    $(document).ajaxStop(function () { // Quand on a finit de récup les données
      
      //a revoir
      variableChoisi = data[2][0];
      
      
      var tabY = Calcul(matrix[variableChoisi],tableaux);
      var tabX = new Array();
      for(var i=0;i<matrix[variableChoisi].length;i++){
        tabX[i] = i;
      }
        var trace = {
            x : tabX,
            y : tabY,
            type : 'scatter'
        };
        Plotly.newPlot('graph',[trace]);
      
    });

   
}






function Calcul(matriceAbscisse, tableaux) {
	var tabOrdonee = new Array(); 	// tableau résultat
	var tabPrecalcul = new Array();
	//var ligneM1 = matrice1[indiceM1];
	//var ligneM2 = matrice2[indiceM2];
	var nbColonnes = matriceAbscisse[0].length;
	var nbLignes = matriceAbscisse.length;
	
    tabPrecalcul = tableaux[0];
    console.log(tableaux);
	// On précalcule la multiplication des lignes des matrices fixés
    for(var j=1; j<tableaux.length; j++)
    {
        for(var i=0;i<nbColonnes;i++){
            tabPrecalcul[i] *= Number(tableaux[j][i]);
        }
    }
    
    console.log(tableaux);
    console.log(tabPrecalcul);
	// On initialise le tableau y avec des numbers (pour le +=)
	for(var i=0;i<nbLignes;i++){
		tabOrdonee[i]=0;
	}
	// 
	for(var i=0;i<nbLignes;i++){
		for(var j=0;j<nbColonnes;j++){
			tabOrdonee[i] += Number(tabPrecalcul[j]) * Number(matriceAbscisse[i][j]); 
		}
	}	
	return tabOrdonee;

}
/*
console.log((1.1111111e-01).toFixed(2)); // 1267650600228229401496703205376*/