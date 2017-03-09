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
  var tabY = Calcul(datasFInit,datasGInit[15],datasHInit[5]);
  var tabX = new Array();
  for(var i=0;i<datasFInit.length;i++){
	tabX[i] = i;
  }
	var trace = {
		x : tabX,
		y : tabY,
		type : 'scatter'
	};
	Plotly.newPlot('graph',[trace]);
  
});

function Calcul(matriceAbscisse, matrice1, matrice2) {
	var tabOrdonee = new Array(); 	// tableau résultat
	var tabPrecalcul = new Array();
	//var ligneM1 = matrice1[indiceM1];
	//var ligneM2 = matrice2[indiceM2];
	var nbColonnes = matriceAbscisse[0].length;
	var nbLignes = matriceAbscisse.length;
	
	// On précalcule la multiplication des lignes des matrices fixés
	for(var i=0;i<nbColonnes;i++){
		tabPrecalcul[i] = Number(matrice1[i]) * Number(matrice2[i]);
	}
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
