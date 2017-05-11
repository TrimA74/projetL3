var datasY = [];
var datasYInit = [];

var matrix = new Object();
var variableChoisi=0;

var plotDiv = document.getElementById('graph');

var data;

var metadata;

$.ajax({
    url : 'ajax.php',
    type: 'POST',
    dataType : 'json',
    data : 
    {
        myFunction:'chargeJson',
        myParams:{
            set:"1",
            cat:$_GET("cat")
        }
    },
    success: function(result)
    {
       metadata = result;
    }
});


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
                    //majApresSet(result,set);
                    majApresSetJson(set);
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

/* On met les lignes spécifiées (lignes fixées dans une matrice donnée) par les sliders dans tabLigne */
function getLignesFromSlider(parameters){
    var tabLigne = [];    //les lignes choisies

    parameters.forEach(function(e,i){
        if(e.fichier==1 && e!=variableChoisi){
            var ligne = $("#range" + e.lettre).slider('getValue');
            ligne = Math.round((ligne-e.min)/ $("#range" + e.lettre).slider('getAttribute').step); 
            tabLigne.push(JSON.parse(JSON.stringify(matrix[e.lettre][ligne])));
        }
    });

    return tabLigne;
}

/* On initialise les abscisses en fonction des métadonnées (On calcule la valeur d'abscisse associé au numéro de la valeur calculée) */
function initTabx(variableChoisi){
    var tabX = new Array();
    var minX = variableChoisi.min;
    var maxX = variableChoisi.max;

    var pas = (parseFloat(maxX)-parseFloat(minX))/matrix[variableChoisi.lettre].length; // on calcule le pas en fonction du min et du max des métadonnées et du nombre de données 

    for(var i=0; i<matrix[variableChoisi.lettre].length; i++){
        tabX[i] = parseFloat(minX) + i * pas;
    }

    return tabX;
}

/*  */
function updateSlider (elem,parameters) {
    var val = $("#range"+elem).slider('getValue');

    var tabLigne = [];    //les lignes choisies

     // on récupère les lignes des matrices associées aux valeurs des sliders
    tabLigne = getLignesFromSlider(parameters);

    // on recalcule la courbe 
    var tabY = Calcul(matrix[variableChoisi.lettre], tabLigne);

    // On initialise les abscisses en fonction des métadonnées
    
    var tabX = initTabx(variableChoisi);
    

    // on redessine la courbe 
    Promise.all([plotDiv]).then(function () {
        var layout = {
            autosize : 'false',
            autorange : 'false',
        }
        plotDiv.data[0].y = tabY.slice();
        plotDiv.data[0].x = tabX.slice();
        Plotly.relayout(plotDiv,layout);
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
    var parameters = metadata.set[0].parameters;
    variableChoisi = parameters[val];	//numéro de la matrice à mettre en abscisse (défini dans le bouton qui appelle l'évènement)  
    
    $("#parametres").find(".param").css('display', 'block');
    $("#parametres").find("#param"+ parametre).css('display', 'none');
    
    var tabLigne = [];//les lignes choisies

    tabLigne = getLignesFromSlider(parameters);
    
    var tabY = Calcul(matrix[variableChoisi.lettre],tabLigne);

    var tabX = new Array();
    for(var i=0; i<matrix[variableChoisi.lettre].length; i++){
        tabX[i] = parseFloat(variableChoisi.min) + i*(parseFloat(variableChoisi.max)-parseFloat(variableChoisi.min))/matrix[variableChoisi.lettre].length;
    }



    var layout = {
      yaxis: {
        title: ''+parameters[0].nom+' '+parameters[0].unite,
        autorange : 'true',
        //range : [0,3],
    },
      xaxis: {
          
        title: ''+variableChoisi.nom+' '+parameters[0].unite,
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


    // variable de parameters avec l'attribut fichier à 0
    var variableCalcul;
    parameters.forEach(function(e,i){
        if(e.fichier==0){
            variableCalcul = e ;
        }
    });
        
    //modification du nom du graph
    $("#nomGraph").text(variableCalcul.nom + " depending on  " + variableChoisi.nom);
    
    
    //modification description
    str='<label width="100%">Abscissa :</label><p>'+variableChoisi.nom+' '+variableChoisi.unite+' = '+variableChoisi.lettre+'</p>';
    str+='<label width="100%">Ordinate :</label><p>'+variableCalcul.nom+' '+variableChoisi.unite+' = '+variableCalcul.lettre+'</p>';
    str+='<label width="100%">Constant :</label>';
    
    parameters.forEach(function (e,i){
        if(e.fichier==1 && e!=variableChoisi){
            str+='<p>'+e.nom+' '+e.unite+' = '+e.lettre+' </strong></p>';
        }
    });
    $("#descriptionDataset").html("");
    $("#descriptionDataset").append(str);
}


/*  */
function generate_handler( j,parameters ) {
    return function(event) { 
        updateSlider(j,parameters);
    };
}

function creeCanvasThermique(dataLargeur, dataDiffusivite){
    var largeurMur = 200;
    var hauteur = 300;
    
    
    
    
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
    
    
    //ajout des textes d'environnement
    context.fillStyle = "black";
    context.fillText("exterieur", 0, 50);
    context.fillStyle = "black";
    context.fillText("interieur", 100+largeurMur+20, 50);
    
    //ajout des textes du mur et isolation
    context.fillStyle = "black";
    context.fillText("Wall", 100+20, 30);
    
    
    //creation des contours des rectangles
    context.lineWidth = "5";
    context.strokeStyle = "black";
    context.strokeRect(100, 10, largeurMur, hauteur);
    
    //la fleche
    context.beginPath();
    context.lineWidth = "3";
    context.strokeStyle = "black";
    context.moveTo(50, hauteur/2+5);
    context.lineTo(100+largeurMur+60,hauteur/2+5);
    
    context.lineWidth = "1";
    context.moveTo(100+largeurMur+80, hauteur/2+5);
    context.lineTo(100+largeurMur+50,hauteur/2+5+10);
    context.lineTo(100+largeurMur+50,hauteur/2+5-10);
    context.fill();
    
    context.stroke();
    
}


/*  */
function majApresSet(result, set){
    
    
    console.log(metadata);
    var parameters = metadata.set[0].parameters;
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
    //creeCanvasThermique(largeur, diffusivite);

    /* PARTIE JSON */ 
    parameters.forEach(function (e,i) {
        if(e.fichier){
            console.log(e);
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
                        matrice: e.lettre
                    }
                },
                success: function(result)
                {
                    matrix[e.lettre] = processData(result);
                }
            });
        }
    });
    /* PARTIE CSV */ 
    /*
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
    */
    console.log(matrix);
    
    
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
    
    
    
    /* PARTIE CSV */ /*
    for(var i =0;i<data.length;i++){
        if(data[i][1]==1){
            variableChoisi = i;
            break;
        }
    } */

    /* PARTIE JSON */ 
    parameters.forEach(function (e,i) {
        if(e.fichier){
            variableChoisi = e;break;
        }
    });
    
    
    //gestion @boutons
    $("#boutons").children().remove();
    
    str = "<div class='col-md-8'>";
    str += "<h2> <span class='glyphicon glyphicon-option-horizontal'></span>  Parameters<h2/>";
    str += "<div class='buttonsList'>"
    /* PARTIE CSV */ /*
    for(i=1; i<data.length; i++)
    {   if(data[i][1] == 1)
            str += "<button onclick=\"changeParams($( this ).text(),$( this ).val());$('.buttonsList > button').css('background-color','rgb(200,200,200)');$(this).css('background-color','#337ab7');\"  value =\""+i+"\"class='btn btn-primary btn-lg boutonAbscisse' >"+ data[i][0] + "</button>";
    } */
    /* PARTIE JSON */ 
    parameters.forEach(function (e,i) {
        if(e.fichier){
           str += "<button onclick=\"changeParams($( this ).text(),$( this ).val());$('.buttonsList > button').css('background-color','rgb(200,200,200)');$(this).css('background-color','#337ab7');\"  value =\""+i+"\"class='btn btn-primary btn-lg boutonAbscisse' >"+ e.lettre+ "</button>"; 
        }
    });
    str += "</div>";
    str += "</div>";
	str += "<div class='col-md-4 rubriquePage'></div>";
    
    $("#boutons").append(str);
    
    
    
    //gestion parametres
    $("#parametres").children().remove();
    str = "<h2><span class='glyphicon glyphicon-option-vertical'></span>  Other parameters <h2/>";
    str += "<div class='form-horizontal'>";
    
    /* PARTIE CSV */ 
    //affichage des slider (pour le moment de simple input) avec tout ce qui va avec
    /* for(i=1; i<data.length; i++)
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
    } */

    /* PARTIE JSON */
    /* création de la structure html des sliders */  
    parameters.forEach(function (e,i) {
        if(e.lettre=1){
            var step = (e.max-e.min) / (matrix[e.lettre].length-1);
            
            str += "<div class='form-group param' id='param" + e.lettre + "' style='display:none; '>";
            str += "<label for='amountInput" + e.lettre + "' class='col-sm-1 control-label'>" + e.lettre + "</label>";
            str += "<div class='col-sm-2'>";
            str += "<input id='rangeN" + e.lettre + "'  \
            onchange=\"$('#range" + e.lettre + "').slider('setValue',this.value);\"  \
            type='number' name='amountInput" + e.lettre + "' value='"+(e.max/2)+"' \
            min='"+e.min+"' max='"+e.max+"' step='"+ step +"' class='form-control'/>";
            str += "</div>";
            str += "<div class='col-sm-9'>";
            str += "<div class='col-sm-1'>";
            str += "<span class='minSlider' >"+ Math.round(Number(e.min)*1000)/1000 +"</span> ";
            str += "</div>";
            str += "<div class='col-sm-7'>";
            str += "<input  id='range" + e.lettre + "' type='text'  \
            name='amountRange' onchange=\"document.getElementsByName('amountInput" + e.lettre + "')[0].value=this.value;\" \
            data-slider-min='"+e.min+"' data-slider-max='"+e.max+"' step='10' \
            data-slider-value='"+(e.max/2)+"' />";
            str += "</div>";
            str += "<div class='col-sm-1'>";
            str += "<span class='minMaxSlider'>"+ Math.round(Number(e.max) *1000)/1000+"</span>";
            str += "</div>";
            str += "</div>";
            str += "</div>";  
        }
    });
    
     str += "</div>";
     $("#parametres").append(str);
    
    var slider;
    /* PARTIE CSV */ /*
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
    } */
    /* PARTIE JSON */ 
    /* création finial des sliders + ajout de l'événement slideStop sur chacun d'eux pour lier l'input à côté du slider*/ 
    parameters.forEach(function (e,i) {
        if(e.fichier){
            var pas = (e.max-e.min)/(matrix[e.lettre].length-1);
            
            slider = $("#range" + e.lettre).slider({ 
              tooltip: 'always',
              step : pas,
              precision: 3
            });
            console.log(parameters);
            slider.on('slideStop',generate_handler(e.lettre,parameters));
            $("#rangeN" + e.lettre).on('change',generate_handler(e.lettre,parameters));
        }
    });

    var tableaux = [];//les lignes choisis

    /* PARTIE CSV */  /*
    for(var i=1; i<data.length;i++){
        if(data[i][1] == 0 || variableChoisi==i){
            continue;
        }

        var ligne = $("#range" + data[i][0]).slider('getValue');
        ligne = (ligne-data[i][4])/ $("#range" + data[i][0]).slider('getAttribute').step; 
        ligne = Math.round(ligne);
        
        tableaux.push(matrix[data[i][0]][ligne].slice());
        
    } */ 
    /* PARTIE JSON */ 

    parameters.forEach(function (e,i) {
        if(e.fichier==1 && parameters[i].lettre!=variableChoisi.lettre){
            var ligne = $("#range" + e.lettre).slider('getValue');
            ligne = (ligne-e.min)/ $("#range" + e.lettre).slider('getAttribute').step; 
            ligne = Math.round(ligne);
            tableaux.push(matrix[e.lettre][ligne].slice());
        }
    });
    /**************************************************************/
    /****  Affichage des abscisses, ordonnées et constantes *******/ 
    /**************************************************************/
    /* PARTIE CSV */ /*
    str='<label width="100%">Abscissa :</label><p>'+data[variableChoisi][2]+' '+data[variableChoisi][3]+' = '+data[variableChoisi][0]+'</p>';
    str+='<label width="100%">Ordinate :</label><p>'+data[1][2]+' '+data[1][3]+' = '+data[1][0]+'</p>';
    str+='<label width="100%">Constant :</label>'; */

    /* PARTIE JSON */ 
    str='<label width="100%">Abscissa :</label><p>'+variableChoisi.nom+' '+variableChoisi.unite+' = '+variableChoisi.lettre+'</p>';
    str+='<label width="100%">Ordinate :</label><p>'+parameters[0].nom+' '+parameters[0].unite+' = '+parameters[0].lettre+'</p>';
    str+='<label width="100%">Constant :</label>';



    /* PARTIE CSV */ /*
    for(var i=2;i<data.length;i++){
        if(i!=variableChoisi){
            str+='<p>'+data[i][2]+' '+data[i][3]+' = '+data[i][0]+' </strong></p>';
        }
    } */
    /* PARTIE JSON */ 
    parameters.forEach(function (e,i){
        if(e.fichier==1 && e!=variableChoisi){
            str+='<p>'+e.nom+' '+e.unite+' = '+e.lettre+' </strong></p>';
        }
    });
    $("#descriptionDataset").html("");
    $("#descriptionDataset").append(str);
    
    /* PARTIE CSV */ /*
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
    }; */
    
    /* PARTIE JSON */ 
    var tab = JSON.parse(JSON.stringify(tableaux));
    var tabY = Calcul(matrix[variableChoisi.lettre],tab);
    var tabX = new Array();

    for(var i=0;i<matrix[variableChoisi.lettre].length;i++){
        tabX[i] = i;
    }
    // Parametres de la trace à tracer dans le layout
    var trace = {
        x : tabX,
        y : tabY,
        type : 'scatter'    // type de la trace (pour voir toutes les options possibles: https://plot.ly/javascript/reference/ )
    };
    
    // Parametres du layout (pour voir toutes les options possibles: https://plot.ly/javascript/reference/#layout )
    var layout = {
        yaxis: {    
            title: ''+parameters[0].nom+' '+parameters[0].unite,    // On récupère le titre dans les métadonnées
            type : 'linear',
            /*autorange : true,
            range : [0,3]*/
        },
        xaxis: {
            title: ''+variableChoisi.nom+' '+variableChoisi.unite,
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
function Calcul(matriceAbscisse, tableaux) {
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
		tabOrdonee[i] = Number(variableChoisi.valInit);
	}
	
	// Calcul
	for(var i=0;i<nbLignes;i++){	// Pour chaque valeur de y
		for(var j=0;j<nbColonnes;j++){		// On fait la somme des produits de chaque colonnes
			tabOrdonee[i] += Number(matriceAbscisse[i][j]) * Number(tabPrecalcul[j]); 
		}
	}	
    
	return tabOrdonee;

}

function majApresSetJson (set){

    var parameters = metadata.set[0].parameters;
    //data = result;

    //trouver la largeur et la diffusivité moyenne (pour le dessin de base)
    var largeur;
    var diffusivite;/*
    for(var i=0; i<data.length; i++)
    {
        if(data[i][0]=="x")
            largeur = data[i];
        else if(data[i][0]=="nu")
            diffusivite = data[i];
    }*/

    //cree canvas
    //creeCanvasThermique(largeur, diffusivite);

    parameters.forEach(function (e,i) {
        if(e.fichier){
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
                        matrice: e.lettre
                    }
                },
                success: function(result)
                {
                    matrix[e.lettre] = processData(result);
                }
            });
        }
    });
    // recherche de la variable à mettre en abscisse
    var i=0;
    do {
        i++;
    }while(parameters[i].fichier!=1 && i < parameters.length)
    variableChoisi =  parameters[i];

    //gestion @boutons
    $("#boutons").children().remove();
    
    str = "<div class='col-md-8'>";
    str += "<h2> <span class='glyphicon glyphicon-option-horizontal'></span>  Parameters<h2/>";
    str += "<div class='buttonsList'>";

    parameters.forEach(function (e,i) {
        if(e.fichier){
           str += "<button onclick=\"changeParams($( this ).text(),$( this ).val());$('.buttonsList > button').css('background-color','rgb(200,200,200)');$(this).css('background-color','#337ab7');\"  value =\""+i+"\"class='btn btn-primary btn-lg boutonAbscisse' >"+ e.lettre+ "</button>"; 
        }
    });
    str += "</div>";
    str += "</div>";
    str += "<div class='col-md-4 rubriquePage'></div>";
    
    $("#boutons").append(str);
    
    
    
    //gestion parametres
    $("#parametres").children().remove();
    str = "<h2><span class='glyphicon glyphicon-option-vertical'></span>  Other parameters <h2/>";
    str += "<div class='form-horizontal'>";

    /* création de la structure html des sliders */  
    
    parameters.forEach(function (e,i) {
        if(e.fichier){
            console.log(e.lettre);
            var step = (e.max-e.min) / (matrix[e.lettre].length-1);
            
            str += "<div class='form-group param' id='param" + e.lettre + "' style='display:none; '>";
            str += "<label for='amountInput" + e.lettre + "' class='col-sm-1 control-label'>" + e.lettre + "</label>";
            str += "<div class='col-sm-2'>";
            str += "<input id='rangeN" + e.lettre + "'  \
            onchange=\"$('#range" + e.lettre + "').slider('setValue',this.value);\"  \
            type='number' name='amountInput" + e.lettre + "' value='"+(e.max/2)+"' \
            min='"+e.min+"' max='"+e.max+"' step='"+ step +"' class='form-control'/>";
            str += "</div>";
            str += "<div class='col-sm-9'>";
            str += "<div class='col-sm-1'>";
            str += "<span class='minSlider' >"+ Math.round(Number(e.min)*1000)/1000 +"</span> ";
            str += "</div>";
            str += "<div class='col-sm-7'>";
            str += "<input  id='range" + e.lettre + "' type='text'  \
            name='amountRange' onchange=\"document.getElementsByName('amountInput" + e.lettre + "')[0].value=this.value;\" \
            data-slider-min='"+e.min+"' data-slider-max='"+e.max+"' step='10' \
            data-slider-value='"+(e.max/2)+"' />";
            str += "</div>";
            str += "<div class='col-sm-1'>";
            str += "<span class='minMaxSlider'>"+ Math.round(Number(e.max) *1000)/1000+"</span>";
            str += "</div>";
            str += "</div>";
            str += "</div>";  
        }
    });
    
     str += "</div>";
     $("#parametres").append(str);
    
    var slider;

    /* création finial des sliders + ajout de l'événement slideStop sur chacun d'eux pour lier l'input à côté du slider*/ 
    parameters.forEach(function (e,i) {
        if(e.fichier){
            var pas = (e.max-e.min)/(matrix[e.lettre].length-1);
            
            slider = $("#range" + e.lettre).slider({ 
              tooltip: 'always',
              step : pas,
              precision: 3
            });
            slider.on('slideStop',generate_handler(e.lettre,parameters));
            $("#rangeN" + e.lettre).on('change',generate_handler(e.lettre,parameters));
        }
    });

    var tableaux = [];//les lignes choisis


    parameters.forEach(function (e,i) {
        if(e.fichier==1 && parameters[i].lettre!=variableChoisi.lettre){
            var ligne = $("#range" + e.lettre).slider('getValue');
            ligne = (ligne-e.min)/ $("#range" + e.lettre).slider('getAttribute').step; 
            ligne = Math.round(ligne);
            tableaux.push(matrix[e.lettre][ligne].slice());
        }
    });

    /**************************************************************/
    /****  Affichage des abscisses, ordonnées et constantes *******/ 
    /**************************************************************/

    /* PARTIE JSON */ 
    str='<label width="100%">Abscissa :</label><p>'+variableChoisi.nom+' '+variableChoisi.unite+' = '+variableChoisi.lettre+'</p>';
    str+='<label width="100%">Ordinate :</label><p>'+parameters[0].nom+' '+parameters[0].unite+' = '+parameters[0].lettre+'</p>';
    str+='<label width="100%">Constant :</label>';


    /* PARTIE JSON */ 
    parameters.forEach(function (e,i){
        if(e.fichier==1 && e!=variableChoisi){
            str+='<p>'+e.nom+' '+e.unite+' = '+e.lettre+' </strong></p>';
        }
    });
    $("#descriptionDataset").html("");
    $("#descriptionDataset").append(str);

    
    var tab = JSON.parse(JSON.stringify(tableaux));
    var tabY = Calcul(matrix[variableChoisi.lettre],tab);
    var tabX = new Array();

    for(var i=0;i<matrix[variableChoisi.lettre].length;i++){
        tabX[i] = i;
    }
    // Parametres de la trace à tracer dans le layout
    var trace = {
        x : tabX,
        y : tabY,
        type : 'scatter'    // type de la trace (pour voir toutes les options possibles: https://plot.ly/javascript/reference/ )
    };
    
    // Parametres du layout (pour voir toutes les options possibles: https://plot.ly/javascript/reference/#layout )
    var layout = {
        yaxis: {    
            title: ''+parameters[0].nom+' '+parameters[0].unite,    // On récupère le titre dans les métadonnées
            type : 'linear',
            autorange : true
        },
        xaxis: {
            title: ''+variableChoisi.nom+' '+variableChoisi.unite,
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

