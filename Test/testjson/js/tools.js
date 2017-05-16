/*  */
var MODTools = (function(){
	var self = {};
	
	/* Récupère les paramètres get de la requête http*/ 
	self.$_GET = function (param) {
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
	};
	
	self.updateSliderHandler = function (j,parameters,cadre) {
		 return function(event) { 
        updateSlider(j,parameters,cadre);
    	};
	};
	
	/* Fonction qui met les données récupérées des csv dans des tableaux */
	self.processDataMatrix = function (allText) {
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
	};

	/* génère un vecteur (tableau) à partir d'une matrice (Sert lors du calcul de l'intégration */
	self.integrationMatrice = function (matriceAIntegrer, delta){
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
	};
	
	/* Autorise les boutons/slider à afficher ou pas en fonction du cadre */
	self.isSliderParameter = function (e,cadre,metadata) {
		if(!e.fichier) { return false; }
		if( cadre==".tensoriel" || (cadre==".fluxGlobal" 
			&& e.matrice != metadata.calculs[cadre.replace('.','')].matriceAIntegrer )){
			return true;
		} else { return false; }
	} 
	
	
	/* On met les lignes spécifiées (lignes fixées dans une matrice donnée) par les sliders dans tabLigne */
	self.getLignesFromSlider = function (parameters,cadre){
		var tabLigne = [];    //les lignes choisies

	    $.each(parameters,function (i,e){
	        if(self.isSliderParameter(e,cadre,metadata) && e!=variableChoisi) {
	        	var ranger = $(cadre).find(".range" + e.valeur);
	            var ligne = ranger.slider('getValue');
	            ligne = Math.round((ligne-e.min)/ ranger.slider('getAttribute').step);
	            tabLigne.push(JSON.parse(JSON.stringify(matrix[e.matrice][ligne])));
	        }
	    });

	    return tabLigne;
	};

	/* On initialise les abscisses en fonction des métadonnées (On calcule la valeur d'abscisse associé au numéro de la valeur calculée) */
	self.initTabx = function (variableChoisi) {
		 var tabX = new Array();
	    var minX = variableChoisi.min;
	    var maxX = variableChoisi.max;

	    var pas = (parseFloat(maxX)-parseFloat(minX))/matrix[variableChoisi.matrice].length; // on calcule le pas en fonction du min et du max des métadonnées et du nombre de données 

	    for(var i=0; i<matrix[variableChoisi.matrice].length; i++){
	        tabX[i] = parseFloat(minX) + i * pas;
	    }

	    return tabX;
	};

	self.getMatrixDeferred = function (parameters,set) {
	    var deferreds = [];

	    // récupération des matrices avec la fonction processData pour récupérer un tableau 2d
	    $.each(parameters,function (i,e){
	        if(e.fichier){
	            deferreds.push($.ajax({
	                url: 'ajax.php',
	                type:'POST',
	                async: true,
	                dataType : 'json', // On désire recevoir du HTML
	                data:
	                {
	                    myFunction:'chargeMatrice',
	                    myParams:{
	                        set:set,
	                        cat:self.$_GET("cat"),
	                        matrice: e.matrice
	                    }
	                },
	                success: function(result)
	                {
	                    matrix[e.matrice] = self.processDataMatrix(result);
	                }
	            }));
	        }
	    });
	    return deferreds;

	}

	return self;
})();