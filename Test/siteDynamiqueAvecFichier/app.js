var datasY = [];
var datasYInit = [];

var matrix = new Object();
var variableChoisi=0;
var json = new Object();

$.ajax({
    url : 'ajax.php',
    type : 'POST',
    datatype : 'json',
    data : {
        myFunction:'chargeJson',
        myParams:{
            cat:$_GET("cat")
        }
    },
    success : function (result) {
        json = JSON.parse(result);
    }

})

var plotDiv = document.getElementById('graph');

var data;
try {
MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
catch (e) {
}
/*  */
$('#btnRetour').on('click', function() {
    window.location.href='index.php';
            
});


/*  */
$('#selectset').on('change', function() {
  //alert( $_GET("cat"));
  var set = this.value;
  $.ajax({
                url: 'ajax.php',
                type:'POST',
                dataType : 'json',
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


/* Fonction qui met les données récupérées des csv dans des tableaux */
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


/*  */
function updateSlider (elem,data) {
    var val = $("#range"+elem).slider('getValue');

    var tabLigne = [];//les lignes choisis
    for(var i=1; i<data.length;i++){
        if(data[i][1] == 0 || variableChoisi==i){
            continue;
        }
        var ligne = $("#range" + data[i][0]).slider('getValue');
        ligne = (ligne-data[i][4])/ $("#range" + data[i][0]).slider('getAttribute').step; 
        ligne = Math.round(ligne);

        var datas = JSON.parse(JSON.stringify(matrix[data[i][0]][ligne]));
        tabLigne.push(datas);
    }
    var tableaux = JSON.parse(JSON.stringify(tabLigne));
    var tabY = Calcul(matrix[data[variableChoisi][0]], tableaux, data);
    var tabX = new Array();
    var minX = data[variableChoisi][4];
    var maxX = data[variableChoisi][5];
    for(var i=0; i<matrix[data[variableChoisi][0]].length; i++){
        tabX[i] = parseFloat(data[variableChoisi][4]) + i*(parseFloat(data[variableChoisi][5])-parseFloat(data[variableChoisi][4]))/matrix[data[variableChoisi][0]].length;
    }
    Promise.all([plotDiv]).then(function () {
    var update = {
        autosize : 'false',
    }
    plotDiv.data[0].y = tabY.slice();
    plotDiv.data[0].x = tabX.slice();
    Plotly.relayout(plotDiv,update);
    Plotly.redraw(plotDiv);
});
}


/*  */
function $_GET(param) {
	var vars = {};
    var url = window.location.href.replace( location.hash, '' );
    url = decodeURI(url);
	url.replace( 
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


/*  */
function changeParams(parametre,val){
    variableChoisi = val;	//numéro de la matrice à mettre en abscisse (défini dans le bouton qui appelle l'évènement)  
    
    $("#parametres").find(".param").css('display', 'block');
    $("#parametres").find("#param"+ parametre).css('display', 'none');
    
    var tabLigne = [];//les lignes choisis
    for(var i=1; i<data.length;i++){
        if(data[i][1] == 0 || variableChoisi==i){
            continue;
        }
        var ligne = $("#range" + data[i][0]).slider('getValue');
        ligne = (ligne-data[i][4])/ $("#range" + data[i][0]).slider('getAttribute').step;  
        ligne = Math.round(ligne);
        
        var datas = matrix[data[i][0]][ligne].slice();
        tabLigne.push(datas);
    }
    
    var tableaux = JSON.parse(JSON.stringify(tabLigne));
    var tabY = Calcul(matrix[data[variableChoisi][0]],tableaux, data);
    var tabX = new Array();
    for(var i=0;i<matrix[data[variableChoisi][0]].length;i++){
        tabX[i] = parseFloat(data[variableChoisi][4]) + i*(parseFloat(data[variableChoisi][5])-parseFloat(data[variableChoisi][4]))/matrix[data[variableChoisi][0]].length;
    }
    var layout = {
      yaxis: {
        title: ''+data[1][2]+' '+data[1][3],
        autorange : 'false',
        range : [0,3],
    },
      xaxis: {
          
        title: ''+data[variableChoisi][2]+' '+data[variableChoisi][3],
        showgrid: true,        // remove the x-axis grid lines              // customize the date format to "month, day"
    },   margin: {                           // update the left, bottom, right, top margin
        l: 60, b: 60, r: 10, t: 10
      },
      showlegend : false
    };
    Promise.all([plotDiv]).then(function () {
        plotDiv.data[0].y = tabY.slice();
        plotDiv.data[0].x = tabX.slice();
        Plotly.relayout(plotDiv,layout);
        Plotly.redraw(plotDiv);

    });


    
    var variableCalcul;
    for(var i = 0; i<data.length; i++)
    {
        if(data[i][1] == 0)
            variableCalcul = i;
    }
        
    //modification du nom du graph
    $("#nomGraph").text(data[variableCalcul][2] + " depending on  " + data[variableChoisi][2]);
    
    
    //modification description
    str='<label width="100%">Abscissa :</label><p>'+data[variableChoisi][2]+' '+data[variableChoisi][3]+' = '+data[variableChoisi][0]+'</p>';
    str+='<label width="100%">Ordinate :</label><p>'+data[variableCalcul][2]+' '+data[variableCalcul][3]+' = '+data[variableCalcul][0]+'</p>';
    str+='<label width="100%">Constant :</label>';
    
    for(var i = 1;i<data.length;i++){
        if(i!=variableChoisi && data[i][1]!=0){
            str+='<p>- '+data[i][2]+' '+data[i][3]+' = '+data[i][0]+' </strong></p>';
        }
    }
    $("#descriptionDataset").html("");
    $("#descriptionDataset").append(str);
}


/*  */
function generate_handler( j,data ) {
    return function(event) { 
        updateSlider(j,data);
    };
}

function creeCanvasThermique(dataLargeur, dataDiffusivite)
{
    var largeurMur = 200;
    var hauteur = 300;
    
    var largeurIsolationMax = (3/4)*largeurMur;
    var largeurIsolationMin = 0;
    
    var largeurIsolation = largeurIsolationMax;
    
    
    
    //diffusivite = (data[i][4]+data[i][5])/2;
    largeur = (dataLargeur[4]+dataLargeur[5])/2;
    //il faut calculer un pourcentage
    
    
    $("#dessinMur").append('<canvas id="canvasMur" width="1000" height="350"><p>Désolé, votre navigateur ne supporte pas Canvas. Mettez-vous à jour</p></canvas>');
    var canvas  = document.querySelector('#canvasMur');
    var context = canvas.getContext('2d');
    
    //coloration des rectangle
    //rectangle du mur
    context.fillStyle = "#FFFFFF";
    context.fillRect(100, 10, largeurMur, hauteur);
    //rectangle de l'isolation
    context.fillStyle = "#DDDDDD";
    context.fillRect(100+largeurMur, 10, largeurIsolation, hauteur);
    
    
    //ajout des textes d'environnement
    context.fillStyle = "black";
    context.fillText("exterieur", 0, 50);
    context.fillStyle = "black";
    context.fillText("interieur", 100+largeurMur+largeurIsolation+20, 50);
    
    //ajout des textes du mur et isolation
    context.fillStyle = "black";
    context.fillText("Load material", 100+20, 30);
    context.fillStyle = "black";
    context.fillText("Insulation", 100+largeurMur+20, 30);
    
    
    //creation des contours des rectangles
    context.lineWidth = "5";
    context.strokeStyle = "black";
    context.strokeRect(100, 10, largeurMur, hauteur);
    context.strokeRect(100+largeurMur, 10, largeurIsolation, hauteur);
    
    //la fleche
    context.beginPath();
    context.lineWidth = "3";
    context.strokeStyle = "black";
    context.moveTo(50, hauteur/2+5);
    context.lineTo(100+largeurMur+largeurIsolation+60,hauteur/2+5);
    
    context.lineWidth = "1";
    context.moveTo(100+largeurMur+largeurIsolation+80, hauteur/2+5);
    context.lineTo(100+largeurMur+largeurIsolation+50,hauteur/2+5+10);
    context.lineTo(100+largeurMur+largeurIsolation+50,hauteur/2+5-10);
    context.fill();
    
    context.stroke();
    
}


/*  */
function majApresSet(result, set){
    
    
    
    data = result;
    
    //trouver la largeur et la diffusivité moyenne (pour le dessin de base)
    var largeur;
    var diffusivite;
    for(var i=0; i<data.length; i++)
    {
        if(data[i][0]=="x")
            largeur = data[i];
        else if(data[i][0]=="nu")
            diffusivite = data[i];
    }
    
    //cree canvas
    creeCanvasThermique(largeur, diffusivite);
    
    for(var i=1; i<data.length; i++)
    {   
        if(data[i][1] == 1)
        {
            $.ajax({
                        url: 'ajax.php',
                        type:'POST',
                        async: false,
                        dataType : 'json', // On désire recevoir du HTML
                        data:
                        {
                            myFunction:'chargeMatrice',
                            myParams:{
                                set:set,
                                cat:$_GET("cat"),
                                matrice: data[i][0]
                            }
                        },
                        success: function(result)
                        {
                            matrix[data[i][0]] = processData(result);
                        }
                    });
        }
    }

    
    
    /* ancienne manniere de faire avant de traiter le cas des espaces dans le nom de dossier
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
    }*/
    
    
    
     
    for(var i =0;i<data.length;i++){
        if(data[i][1]==1){
            variableChoisi = i;
            break;
        }
    }
    
    
    //gestion @boutons
    $("#boutons").children().remove();
    
    str = "<div class='col-md-8'>";
    str += "<h2> <span class='glyphicon glyphicon-option-horizontal'></span>  Parameters<h2/>";
    str += "<div class='buttonsList'>"
    for(i=1; i<data.length; i++)
    {   if(data[i][1] == 1)
            str += "<button onclick=\"changeParams($( this ).text(),$( this ).val());$('.buttonsList > button').css('background-color','rgb(200,200,200)');$(this).css('background-color','#337ab7');\"  value =\""+i+"\"class='btn btn-primary btn-lg boutonAbscisse' >"+ data[i][0] + "</button>";
    }
    str += "</div>";
    str += "</div>";
	str += "<div class='col-md-4 rubriquePage'></div>";
    
    $("#boutons").append(str);
    
    
    
    //gestion parametres
    $("#parametres").children().remove();
    str = "<h2><span class='glyphicon glyphicon-option-vertical'></span>  Other parameters <h2/>";
    str += "<div class='form-horizontal'>";
    
    
    //affichage des slider (pour le moment de simple input) avec tout ce qui va avec
    for(i=1; i<data.length; i++)
    {
        
        if(data[i][1] == 1 )
        {
            var step = (data[i][5]-data[i][4]) / (matrix[data[i][0]].length-1);
            
            str += "<div class='form-group param' id='param" + data[i][0] + "' style='display:none; '>";
            str += "<label for='amountInput" + data[i][0] + "' class='col-sm-1 control-label'>" + data[i][0] + "</label>";
            str += "<div class='col-sm-2'>";
            str += "<input id='rangeN" + data[i][0] + "'  \
            onchange=\"$('#range" + data[i][0] + "').slider('setValue',this.value);\"  \
            type='number' name='amountInput" + data[i][0] + "' value='"+(data[i][5]/2)+"' \
            min='"+data[i][4]+"' max='"+data[i][5]+"' step='"+ step +"' class='form-control'/>";
            str += "</div>";
            str += "<div class='col-sm-9'>";
            str += "<div class='col-sm-1'>";
            str += "<span class='minSlider' >"+ Math.round(Number(data[i][4])*1000)/1000 +"</span> ";
            str += "</div>";
            str += "<div class='col-sm-7'>";
            str += "<input  id='range" + data[i][0] + "' type='text'  \
            name='amountRange' onchange=\"document.getElementsByName('amountInput" + data[i][0] + "')[0].value=this.value;\" \
            data-slider-min='"+data[i][4]+"' data-slider-max='"+data[i][5]+"' step='10' \
            data-slider-value='"+(data[i][5]/2)+"' />";
            str += "</div>";
            str += "<div class='col-sm-1'>";
            str += "<span class='minMaxSlider'>"+ Math.round(Number(data[i][5]) *1000)/1000+"</span>";
            str += "</div>";
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
            
            var pas = (data[i][5]-data[i][4])/(matrix[data[i][0]].length-1);
            
            slider = $("#range" + data[i][0]).slider({ 
              tooltip: 'always',
              step : pas,
              precision: 3
            });
            slider.on('slideStop',generate_handler(data[i][0],data));
            $("#rangeN" + data[i][0]).on('change',generate_handler(data[i][0],data));
        
        }
    }
    var tableaux = [];//les lignes choisis

       
    for(var i=1; i<data.length;i++){
        if(data[i][1] == 0 || variableChoisi==i){
            continue;
        }

        var ligne = $("#range" + data[i][0]).slider('getValue');
        ligne = (ligne-data[i][4])/ $("#range" + data[i][0]).slider('getAttribute').step; 
        ligne = Math.round(ligne);
        
        tableaux.push(matrix[data[i][0]][ligne].slice());
        
    }
    i=2;
    str='<label width="100%">Abscissa :</label><p>'+data[variableChoisi][2]+' '+data[variableChoisi][3]+' = '+data[variableChoisi][0]+'</p>';
    str+='<label width="100%">Ordinate :</label><p>'+data[1][2]+' '+data[1][3]+' = '+data[1][0]+'</p>';
    str+='<label width="100%">Constant :</label>';
    
    for(;i<data.length;i++){
        if(i!=variableChoisi){
            str+='<p>'+data[i][2]+' '+data[i][3]+' = '+data[i][0]+' </strong></p>';
        }
    }
    $("#descriptionDataset").html("");
    $("#descriptionDataset").append(str);
    
    var tab = JSON.parse(JSON.stringify(tableaux));
    var tabY = Calcul(matrix[data[variableChoisi][0]],tab, data);
    var tabX = new Array();
	
    for(var i=0;i<matrix[data[variableChoisi][0]].length;i++){
        tabX[i] = i;
    }
	
	// Parametres de la trace à tracer dans le layout
    var trace = {
        x : tabX,
        y : tabY,
        type : 'scatter'	// type de la trace (pour voir toutes les options possibles: https://plot.ly/javascript/reference/ )
    };
	
	// Parametres du layout (pour voir toutes les options possibles: https://plot.ly/javascript/reference/#layout )
    var layout = {
		yaxis: {	
			title: ''+data[1][2]+' '+data[1][3],    // On récupère le titre dans les métadonnées
			type : 'linear',
			/*autorange : true,
			range : [0,3]*/
		},
		xaxis: {
			title: ''+data[variableChoisi][2]+' '+data[variableChoisi][3],
			showgrid: true,  
			type : 'linear',
			autorange : true
		},   
		margin: {                
			l: 40, b: 40, r: 10, t: 10
		},
		// Autres options
		showlegend : false,
		autosize : true
    }; 
       
    
    var client = new XMLHttpRequest();
    client.open('GET', "data/"+ $_GET("cat") +"/"+ set +"/meta_donnees_LaTeX.tex" );
    client.onreadystatechange = function() {
      $("#latexSetInfo").html("<p style=\"font-size:200%;\"> " + client.responseText + "</p>");
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }
    client.send();
    // Plotly construit le graphique (rq: on remove des bouttons mis par défaut dans la modebar (pour liste des bouttons: https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js) ainsi que le logo)
    Plotly.newPlot(plotDiv, [trace], layout, {modeBarButtonsToRemove: ['sendDataToCloud', 'zoomIn2d', 'zoomOut2d', 'select2d', 'lasso2d', 'resetScale2d', 'toImage', 'hoverClosestCartesian', 'hoverCompareCartesian'], displaylogo: false});
}


/* Retourne le tableau des ordonnées généré à partir de la matrice d'abscisse et des lignes fixées dans les autres matrices  */
function Calcul(matriceAbscisse, tableaux, metadonnees) {
	var tabOrdonee = new Array(); 					// Tableau contenant le résultat (toutes les ordonnées calculées)
	var tabPrecalcul = new Array();
	var nbColonnes = matriceAbscisse[0].length;		// Théoriquement le même dans toutes les matrices
	var nbLignes = matriceAbscisse.length;			// Nombre de valeurs calculables
	
    tabPrecalcul = tableaux[0];		// Pour éviter de recalculer plusieurs fois la même chose, on stocke dans un tableau le résultat des produits des lignes déjà fixées

    // On précalcule la multiplication des lignes des matrices fixés
    for(var j=1; j<tableaux.length; j++)	//pour chaque ligne à précalculer
    {
        for(var i=0;i<nbColonnes;i++){
            tabPrecalcul[i] *= Number(tableaux[j][i]);
        }
    }
    
    
	// On initialise le tableau y avec la valeur spécifiée dans les métadonnées
	for(var i=0;i<nbLignes;i++){
		tabOrdonee[i] = Number(metadonnees[variableChoisi][6]);
	}
	
	// Calcul
	for(var i=0;i<nbLignes;i++){	// Pour chaque valeur de y
		for(var j=0;j<nbColonnes;j++){		// On fait la somme des produits de chaque colonnes
			tabOrdonee[i] += Number(matriceAbscisse[i][j]) * Number(tabPrecalcul[j]); 
		}
	}	
    
	return tabOrdonee;

}

