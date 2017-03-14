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

// Pour générer des exceptions
function ExceptionUtilisateur(message) {
   this.message = message;
   this.name = "ExceptionUtilisateur";
}

// Récupérations des csv dans des matrices
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

// s'exécute une fois toutes les requètes Ajax terminées
$(document).ajaxStop(function () { 
	//On calcule les ordonnées
	var tabY = Calcul(datasFInit,datasGInit,datasHInit, 15, 6);		// Array Calcul (MatriceAbscisse, Matrice1, Matrice2, indiceMatrice1, indiceMatrice2)
	
	var tabX = new Array();
	// Le tableau X contient les datasFInit.length premiers entiers.
	// x=0 correspond à la première valeur calculée, x=1 à la 2ème ect...
	for(var i=0;i<datasFInit.length;i++){
		tabX[i] = i;
	}
  
	// On définit la courbe à tracer dans le type trace
	var trace = {
		x : tabX,
		y : tabY,
		type : 'scatter'
	};
	
	// On inclut la courbe dans plotly
	Plotly.newPlot('graph',[trace]);
  
});

function Calcul(matriceAbscisse, matrice1, matrice2, indiceM1, indiceM2) {
	var tabOrdonee = new Array(); 	// tableau résultat
	var tabPrecalcul = new Array();
	var nbColonnes = matriceAbscisse[0].length;
	var nbLignes = matriceAbscisse.length;
	
	/* /!\ faire "matrice1.length" peut ralentir le programme /!\*/
	if (indiceM1 < matrice1.length){
		var ligneM1 = matrice1[indiceM1];
	}else{
		throw new ExceptionUtilisateur("L'indice passe en parametre depasse la taille de M1");
	}
	if (indiceM2 < matrice2.length){
		var ligneM2 = matrice2[indiceM2];
	}else{
		throw new ExceptionUtilisateur("L'indice passe en parametre depasse la taille de M2");
	}
	
	/*	//utile lors du débeugage
	var nbColonnesM1 = matrice1[0].length;
	var nbLignesM1 = matrice1.length;
	var nbColonnesM2 = matrice2[0].length;
	var nbLignesM2 = matrice2.length;
	console.log(nbColonnes);
	console.log(nbLignes);
	console.log(nbColonnesM1);
	console.log(nbLignesM1);
	console.log(nbColonnesM2);
	console.log(nbLignesM2);*/
	
	// On précalcule la multiplication des lignes des matrices fixés
	for(var i=0;i<nbColonnes;i++){
		tabPrecalcul[i] = Number(ligneM1[i]) * Number(ligneM2[i]);
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
