var matrix = new Object();
var variableChoisi= {};
var setCourant;

var plotDiv = document.getElementById('graph');

var metadata;


$( document ).ready(function() {
    /* the preprocessors (if any were loaded) to run over the page again, 
    *** and then MathJax will look for unprocessed mathematics on the page and typeset it, 
    ** leaving unchanged any math that has already been typeset.  */ 
    try {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }
    catch (e) { // ne rien faire si erreur, pas grave 
    }
    /*  */
    $('#btnRetour').on('click', function() {
        window.location.href='index.php';
                
    });

	/** Test MathJax responsive **/
	/*window.MathJax = {
		 menuSettings: {
			autocollapse: true
		 }
	};
	
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.onload = function() {
	  // remote script has loaded
	};
	script.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_CHTML-full';
	document.getElementsByTagName('head')[0].appendChild(script);
	var box = document.getElementById('box');
	var rng = document.getElementById('rngWidth');
	var note = document.getElementById('rngValue');
	rng.onchange = function() {
	  box.style.width = this.value + 'px';
	  MathJax.Extension["auto-collapse"].resizeHandler()
	  note.innerHTML = this.value + 'px';
	}*/
	/************************/
	
	
    $.ajax({
            url : 'ajax.php',
            type: 'POST',
            dataType : 'json',
            data : 
            {
                myFunction:'chargeJsonCat',
                myParams:{
                    cat: MODTools.$_GET("cat")
                }
            },
            success: function(result)
            {
                metadata = result ; 
            }
    });


    /*  */
    $('#selectset').on('change', function() {



        var set = this.value;
        $.ajax({
            url : 'ajax.php',
            type: 'POST',
            dataType : 'json',
            data : 
            {
                myFunction:'chargeJsonSet',
                myParams:{
                    set:set,
                    cat: MODTools.$_GET("cat")
                }
            },
            success: function(result)
            {
                // si on a pas encore mis de set on concatène les objets
               if(typeof(metadata.set) == "undefined" ){
                    metadata.set = {};
                    metadata.set[result.set[0].name] = result.set[0];
               } else { // sinon on cherche si on l'a pas déjà load
                    var isHere = false;
                    $.each(metadata.set,function (i,e){
                        if(e.name == set) {
                            isHere = true;
                        }
                    });
                    if(!isHere){ // si on l'a pas déjà load on l'ajoute dans le tableau de set
                        metadata.set[result.set[0].name] = result.set[0];
                    }
               }
               majApresSet(result.set[0].name);
            }
        });
            
    });

});









/*  */
function updateSlider(elem,parameters) {
    var val = $("#range"+elem).slider('getValue');

    var tabLigne = [];    //les lignes choisies

     // on récupère les lignes des matrices associées aux valeurs des sliders
    tabLigne = MODTools.getLignesFromSlider(parameters);

    // on recalcule la courbe 
    //var tabY = Calcul(matrix[variableChoisi.lettre], tabLigne);
    var tabY = mesFonctions["Calcul"](matrix[variableChoisi.lettre], tabLigne);

    // On initialise les abscisses en fonction des métadonnées
    
    var tabX = MODTools.initTabx(variableChoisi);
    

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
    
    
    //cree canvas pour le mur
    if(metadata.wall.displayWall)
        mesFonctions[metadata.wall.method]();
}





/*  */
function changeParams(parametre,val){
    var parameters = metadata.set[setCourant].parameters;
    variableChoisi = parameters[val];	//numéro de la matrice à mettre en abscisse (défini dans le bouton qui appelle l'évènement)  
    
    $("#parametres").find(".param").css('display', 'block');
    $("#parametres").find("#param"+ parametre).css('display', 'none');
    
    var tabLigne = [];//les lignes choisies

    tabLigne = MODTools.getLignesFromSlider(parameters);
    
    //var tabY = Calcul(matrix[variableChoisi.lettre],tabLigne);
    var tabY = mesFonctions["Calcul"](matrix[variableChoisi.lettre],tabLigne);

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
    $.each(parameters,function (i,e){
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
    
    $.each(parameters,function (i,e){
        if(e.fichier==1 && e!=variableChoisi){
            str+='<p>'+e.nom+' '+e.unite+' = '+e.lettre+' </strong></p>';
        }
    });
    $("#descriptionDataset").html("");
    $("#descriptionDataset").append(str);
    
    
    
    
    
    //cree canvas pour le mur
    if(metadata.wall.displayWall)
        mesFonctions[metadata.wall.method]();
}



function majApresSet(set){
    
    setCourant = set;
    console.log(setCourant);
    console.log(metadata);
    var parameters = metadata.set[setCourant].parameters;

    


    // récupération des matrices avec la fonction processData pour récupérer un tableau 2d
    $.each(parameters,function (i,e){
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
                        cat:MODTools.$_GET("cat"),
                        matrice: e.lettre
                    }
                },
                success: function(result)
                {
                    matrix[e.lettre] = MODTools.processDataMatrix(result);
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

    $.each(parameters,function (i,e){
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
    
    $.each(parameters,function (i,e){
        if(e.fichier){
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
    $.each(parameters,function (i,e){
        if(e.fichier){
            var pas = (e.max-e.min)/(matrix[e.lettre].length-1);
            
            slider = $("#range" + e.lettre).slider({ 
              tooltip: 'always',
              step : pas,
              precision: 3
            });
            slider.on('slideStop',MODTools.updateSliderHandler(e.lettre,parameters));
            $("#rangeN" + e.lettre).on('change',MODTools.updateSliderHandler(e.lettre,parameters));
        }
    });

    var tableaux = [];//les lignes choisis


    $.each(parameters,function (i,e){
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

    str='<label width="100%">Abscissa :</label><p>'+variableChoisi.nom+' '+variableChoisi.unite+' = '+variableChoisi.lettre+'</p>';
    str+='<label width="100%">Ordinate :</label><p>'+parameters[0].nom+' '+parameters[0].unite+' = '+parameters[0].lettre+'</p>';
    str+='<label width="100%">Constant :</label>';


    $.each(parameters,function (i,e){
        if(e.fichier==1 && e!=variableChoisi){
            str+='<p>'+e.nom+' '+e.unite+' = '+e.lettre+' </strong></p>';
        }
    });
    $("#descriptionDataset").html("");
    $("#descriptionDataset").append(str);

    
    var tab = JSON.parse(JSON.stringify(tableaux));
    //var tabY = Calcul(matrix[variableChoisi.lettre],tab);
    var tabY = mesFonctions["Calcul"](matrix[variableChoisi.lettre],tab);
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
    client.open('GET', "data/"+ MODTools.$_GET("cat") +"/"+ set +"/meta_donnees_LaTeX.tex" );
    client.onreadystatechange = function() {
      $("#latexSetInfo").html("<p style=\"font-size:200%;\"> " + client.responseText + "</p>");
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    };
    client.send();
    // Plotly construit le graphique (rq: on remove des bouttons mis par défaut dans la modebar (pour liste des bouttons: https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js) ainsi que le logo)
    Plotly.newPlot(plotDiv, [trace], layout, {modeBarButtonsToRemove: ['sendDataToCloud', 'zoomIn2d', 'zoomOut2d', 'select2d', 'lasso2d', 'resetScale2d', 'toImage', 'hoverClosestCartesian', 'hoverCompareCartesian'], displaylogo: false});

    
    
    
    
    //cree canvas pour le mur
    if(metadata.wall.displayWall)
    {
        mesFonctions[metadata.wall.method]();
    }
    
} 

