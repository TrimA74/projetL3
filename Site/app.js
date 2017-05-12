var matrix = new Object();
var variableChoisi=0;
var setCourant;

var plotDiv = document.getElementById('graph');

var metadata;

/* the preprocessors (if any were loaded) to run over the page again, 
*** and then MathJax will look for unprocessed mathematics on the page and typeset it, 
** leaving unchanged any math that has already been typeset.  */ 
try {
MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
catch (e) {
}
/*  */
$('#btnRetour').on('click', function() {
    window.location.href='index.php';
            
});

$.ajax({
        url : 'ajax.php',
        type: 'POST',
        dataType : 'json',
        data : 
        {
            myFunction:'chargeJsonCat',
            myParams:{
                cat:$_GET("cat")
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
                cat:$_GET("cat")
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

//met a jour le canvas du mur pour thermique
var mesFonctions = {
    majCanvasThermique : function(){
        
        var parameters = metadata.set[setCourant].parameters;
        
        /*******************************
            gestion du dessin du mur
        *******************************/
        //cree canvas si il n'existe pas encore
        if($("#canvasMur").length==0)
        {
            creeCanvas();
        }
        

        //pour avoir les max et min de la largeur dans la fonction du canvas
        var dataLargeur;
        $.each(parameters,function (i,e){
            if(e.lettre=='L'){
                dataLargeur = e ;
            }
        });
        
        //trouver la largeur
        var largeur;
        if(variableChoisi==dataLargeur) //si la variableChoisi est celle de la largeur , on prend la moyenne
        {
            largeur = (Number(dataLargeur.max)+Number(dataLargeur.min))/2;
        }
        else //sinon la valeur du slider
        {
            largeur = $("#range" + dataLargeur.lettre).slider('getValue');
        }
        
            
        
        var largeurMurBase = 200;
        var largeurMurMin = largeurMurBase*Number(dataLargeur.min);
        var largeurMurMax = largeurMurMin*Number(dataLargeur.max);
        var largeurMur = largeurMurBase*largeur;
        var hauteur = 300;
        

        var canvas  = document.querySelector('#canvasMur');
        var context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width, canvas.height);
        
        //coloration des rectangle
        //rectangle du mur
        context.fillStyle = "#AAAAAA";
        context.fillRect(100, 60, largeurMurMin, hauteur);
        //rectangle agrandissement du mur
        context.fillStyle = "#CCCCCC";
        context.fillRect(100+largeurMurMin, 60, largeurMur-largeurMurMin, hauteur);
        
        context.font="18px 'Helvetica Neue',Helvetica,Arial,sans-serif";
        //ajout des textes d'environnement
        context.fillStyle = "black";
        context.fillText("exterieur", 0, 110);
        context.fillStyle = "black";
        context.fillText("interieur", 100+largeurMurMax+20, 110);
        
        //ajout des textes du mur et isolation
        context.fillStyle = "black";
        context.fillText("Wall", 100+20, 90);
        
        //creation limite max et min du mur
        context.lineWidth = 2;
        context.strokeStyle = "black";
        //min
        var x=100+largeurMurMin;
        var yA=30;
        var yB=60+hauteur+30;
        DashedLine(x,yA,x,yB,5,5, context)
        //max
        var x=100+largeurMurMax;
        var yA=30;
        var yB=60+hauteur+30;
        DashedLine(x,yA,x,yB,5,5, context)
        
        //ajout des textes limites min max
        context.fillStyle = "black";
        context.fillText("min", 100+largeurMurMin-10, yA-5);
        context.fillStyle = "black";
        context.fillText("max", 100+largeurMurMax-10, yA-5);
        
        //creation des contours
        context.beginPath();
        context.lineWidth = "2";
        context.strokeStyle = "black";
        //context.strokeRect(100, 60, largeurMur, hauteur);
        
        //traits gauche et droite
        context.moveTo(100, 60);
        context.lineTo(100,60+hauteur);
        context.moveTo(100+largeurMur, 60);
        context.lineTo(100+largeurMur, 60+hauteur);
        
        
        //traits bas
        context.moveTo(100, 60+hauteur);
        context.lineTo(100+(largeurMur/2)-5,60+hauteur);
        
        context.moveTo(100+(largeurMur/2)-5-10, 60+hauteur+20);
        context.lineTo(100+(largeurMur/2)-5+10, 60+hauteur-20);
        context.moveTo(100+(largeurMur/2)+5-10, 60+hauteur+20);
        context.lineTo(100+(largeurMur/2)+5+10, 60+hauteur-20);
        
        context.moveTo(100+(largeurMur/2)+5, 60+hauteur);
        context.lineTo(100+largeurMur,60+hauteur);
        
        
        //traits hauts
        context.moveTo(100, 60);
        context.lineTo(100+(largeurMur/2)-5,60);
        
        context.moveTo(100+(largeurMur/2)-5-10, 60+20);
        context.lineTo(100+(largeurMur/2)-5+10, 60-20);
        
        context.moveTo(100+(largeurMur/2)+5-10, 60+20);
        context.lineTo(100+(largeurMur/2)+5+10, 60-20);
        
        context.moveTo(100+(largeurMur/2)+5, 60);
        context.lineTo(100+largeurMur,60);
        
        context.stroke();
        
        //la fleche
        context.beginPath();
        context.lineWidth = "3";
        context.strokeStyle = "black";
        context.moveTo(50, 60+(hauteur)/2);
        context.lineTo(100+largeurMur+60,60+(hauteur)/2);
        
        context.lineWidth = "1";
        context.moveTo(100+largeurMur+80, 60+(hauteur)/2);
        context.lineTo(100+largeurMur+50, 60+(hauteur)/2+10);
        context.lineTo(100+largeurMur+50, 60+(hauteur)/2-10);
        context.fill();
        
        context.stroke();
        
    }
};


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

    $.each(parameters,function (i,e){
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
function updateSlider(elem,parameters) {
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
    
    
    //cree canvas pour le mur
    if(metadata.wall.displayWall)
        mesFonctions[metadata.wall.method]();
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
    var parameters = metadata.set[setCourant].parameters;
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


/*  */
function generate_handler( j,parameters ) {
    return function(event) { 
        updateSlider(j,parameters);
    };
}

//fonction utilisé pour les pointillés
function Norm(xA,yA,xB,yB) {
    return Math.sqrt(Math.pow(xB-xA,2)+Math.pow(yB-yA,2));
}

//faire une ligne en pointillés
function DashedLine(xA,yA,xB,yB,L,l, ctx) {
 Nhatch=Norm(xA,yA,xB,yB)/(L+l);
 x1=xA;y1=yA;
 for (i=0;i < Nhatch; i++) {
  newXY=Hatch(xA,yA,xB,yB,x1,y1,L);
  x2=newXY[0];y2=newXY[1];
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  newXY=Hatch(xA,yA,xB,yB,x2,y2,l);
  x1=newXY[0];
  y1=newXY[1];
 }
}

//fonction utilisé pour les pointillés
function Hatch(xA,yA,xB,yB,x1,y1,l) {
    if(xB-xA!=0)//si la droite n'est pas verticale
    {
        a=(yB-yA)/(xB-xA);b=yA-a*xA;// Equation reduite y=ax+b de (AB): 
        if ((xB-xA)>0) {sgn=1;} else {sgn=-1;}
        x2=sgn*l/Math.sqrt(1+a*a)+x1;
        y2=a*x2+b;

        if (Norm(x1,y1,x2,y2)>Norm(x1,y1,xB,yB)) {x2=xB;y2=yB;}
    }else//droite verticale
    {
        if ((yB-yA)>0) {sgn=1;} else {sgn=-1;}
        x2=xA;
        y2= y1+(l/sgn);
    }
    return [x2,y2];
}

//crée l'élement canvas dans l'HTML
function creeCanvas(){
    $("#dessinMur").append('<canvas id="canvasMur" width="1000" height="400"><p>Désolé, votre navigateur ne supporte pas Canvas. Mettez-vous à jour</p></canvas>');
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


/* Retourne le tableau des ordonnées généré à partir de la matrice d'abscisse et des lignes fixées dans les autres matrices  */
function CalculIntegrale(matriceAbscisse, tableaux, parameters) {
	//A la différence du calcul précédent, on ajoute un facteur C à chaque somme.
	//Si l'utilisateur fixe le paramètre c, alors C = c(i fixé). Si l'utilisateur ne fixe pas le paramètre c, alors C = vecteur c.
	var tabOrdonee = new Array(); 					// Tableau contenant le résultat (toutes les ordonnées calculées)
	var tabC = new Array();							// Tableau contenant les valeurs du slider c
	var tabPrecalcul = new Array();
	var nbColonnes = matriceAbscisse[0].length;		// Théoriquement le même dans toutes les matrices
	var nbLignes = matriceAbscisse.length;			// Nombre de valeurs calculables
	var varProduit = "u";							// Nom du parametre à ajouter au produit (ex dans hydrique: "c")

	// On initialise tabC (valeurs possibles du slider c) avec ce que nous donnent les métadonnées (min et max)
	var min;
	var max;
	$.each(parameters,function (i,e){
        if(e.lettre==varProduit){
            min = e.min;
			max = e.max;
        }
    });
	var pas = (max - min)/(matrix[varProduit].length-1);	// (valMax-valMin) / nbVal<- nb de lignes de la matrice associé au parametre varProduit (ex: matrice H si varProduit = c)
	for (var i=0; i<matrix[varProduit].length; i++){
		tabC[i] = i*pas;
	}
	
	
    // On précalcule la multiplication des lignes des matrices fixés
	tabPrecalcul = tableaux[0];				// Pour éviter de recalculer plusieurs fois la même chose, on stocke dans un tableau le résultat des produits des lignes déjà fixées
    for(var j=1; j<tableaux.length; j++)	// Pour chaque ligne à précalculer
    {
        for(var i=0;i<nbColonnes;i++){
            tabPrecalcul[i] *= Number(tableaux[j][i]);
        }
    }
	//console.log(tableaux);
    
	
	// On initialise le tableau y avec la valeur spécifiée dans les métadonnées
	for(var i=0;i<nbLignes;i++){
		tabOrdonee[i] = Number(variableChoisi.valInit);
	}
	//console.log(tabOrdonee);
	
	
	// Calcul
	for(var i=0;i<nbLignes;i++){			// Pour chaque valeur de y
		for(var j=0;j<nbColonnes;j++){		// On fait la somme des produits de chaque colonnes
			if (variableChoisi.lettre == varProduit){		// Si l'utilisateur à choisi le paramètre varProduit
				tabOrdonee[i] += Number(matriceAbscisse[i][j]) * Number(tabPrecalcul[j]) * Number(tabC[i]); 
			}else{											// Si l'utilisateur fixe le paramètre varProduit avec le slider
				var valSlider = $("#range" + varProduit).slider('getValue');	// Récupération de la valeur du slider varProduit
				tabOrdonee[i] += Number((matriceAbscisse[i][j]) * Number(tabPrecalcul[j]) * valSlider); 
			}
		}
	}	

	return tabOrdonee;
}


/* génère un vecteur (tableau) à partir d'une matrice (Sert lors du calcul de l'intégration */
function integrationMatrice(matriceAIntegrer, delta){
	var tabRetour = new Array();
	//console.log(delta);
	//console.log(matriceAIntegrer);
	
	for (var i = 0; i<matriceAIntegrer[0].length; i++){		//On initialise tabRetour à 0 (pour le +=)
		tabRetour[i] = Number(0);
	}

	for (var i = 0; i<matriceAIntegrer[0].length; i++){		//Pour chaque colonne de la matrice
		for (var j = 0; j<matriceAIntegrer.length; j++){	//On additionne les valeurs de toutes les lignes
			tabRetour[i] += matriceAIntegrer[j][i];
		}
		tabRetour[i] *= delta;		//On multiplie ensuite chaque somme par delta
	}
	//console.log(tabRetour);
	return tabRetour;
}

function majApresSet(set){
    
    setCourant = set;
    console.log(setCourant);
    console.log(metadata);
    var parameters = metadata.set[setCourant].parameters;

    //cree canvas pour le mur
    if(metadata.wall.displayWall)
        mesFonctions[metadata.wall.method]();



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
            slider.on('slideStop',generate_handler(e.lettre,parameters));
            $("#rangeN" + e.lettre).on('change',generate_handler(e.lettre,parameters));
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
    };
    client.send();
    // Plotly construit le graphique (rq: on remove des bouttons mis par défaut dans la modebar (pour liste des bouttons: https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js) ainsi que le logo)
    Plotly.newPlot(plotDiv, [trace], layout, {modeBarButtonsToRemove: ['sendDataToCloud', 'zoomIn2d', 'zoomOut2d', 'select2d', 'lasso2d', 'resetScale2d', 'toImage', 'hoverClosestCartesian', 'hoverCompareCartesian'], displaylogo: false});
} 

