var MODGraph = (function(){
	var self = {};

	self.redrawGraph = function (layout,cadre,variableChoisi,parameters) {
	    var tabLigne = [];//les lignes choisies

		
		// On effectue le bon calcul
	    if (metadata.calculs[cadre.replace('.','')].method == "CalculTensoriel"){
			tabLigne = MODTools.getLignesFromSlider(parameters,cadre);
			
			
		}else if (metadata.calculs[cadre.replace('.','')].method == "CalculIntegrale"){
			var matriceAIntegrer = metadata.calculs.fluxGlobal.matriceAIntegrer;
			// On met dans tab ligne les lignes des matrices fixées par les sliders
			tabLigne = MODTools.getLignesFromSlider(parameters,cadre);	//Les lignes des sliders + la matrice F intégrée
			
			// On veut ensuite ajouter à tabLigne la ligne correspondant à la matrice F intégrée (on somme toute la colonne et on la multiplie par delta)
			// On cherche le delta pour intégrer la matrice matriceAIntegrer (min et max a partir des metadonnées et la longueur de la matrice)
			var min;
			var max;
			$.each(parameters,function (i,e){
				if(e.matrice == matriceAIntegrer){
					min = e.min;
					max = e.max;
				}
			});
			var delta = (max - min)/(matrix[matriceAIntegrer].length-1);    // (valMax-valMin) / nbVal
			// integration matrice revoie un tableau correspondant a la matrice placée en paramètre intégré
			tabLigne.push(MODTools.integrationMatrice(matrix[matriceAIntegrer] , delta));
			
			
		}else if (metadata.calculs[cadre.replace('.','')].method == "CalculDerive"){
			var matriceADeriver = metadata.calculs.fluxLocal.matriceADeriver;
			tabLigne = MODTools.getLignesFromSlider(parameters,cadre);	//Les lignes des sliders + la matrice F intégrée
			
			// On cherche le delta pour dériver la matrice matriceADeriver
			var min;
			var max;
			var valeur;
			$.each(parameters,function (i,e){
				if(e.matrice == matriceADeriver){
					min = e.min;
					max = e.max;
					valeur = e.valeur;
				}
			});
			var delta = (max - min)/(matrix[matriceADeriver].length-1);    // (valMax-valMin) / nbVal
			
			//On récupère la ligne du slider x
			var paramAssociee = parameters.find(function (e) {return e.matrice == metadata.calculs["fluxLocal"].matriceADeriver;});
			
			var ranger = $(cadre).find(".range" + paramAssociee.valeur);
			var ligne = ranger.slider('getValue');
			//console.log( Math.round((ligne-paramAssociee.min)/ ranger.slider('getAttribute').step));
			ligne = Math.round((ligne-paramAssociee.min)/ ranger.slider('getAttribute').step);
			
			
			if (ligne>0){
				//On calcule  f(x) dérivée de F(x) sur la ligne associée
				tabLigne.push(MODTools.DerivationMatrice(matrix[matriceADeriver], ligne, delta));
			}else{
				console.log("Il y a un probleme");
			}
		}
	
	
		// Une fois que tabLigne contient toutes les lignes, on appelle la fonction de calcul correspondant au cadre actuel avec en parametre la matrice correspondant aux abscisses et TabLigne 
	    var tabY = mesFonctions[metadata.calculs[cadre.replace('.','')].method](matrix[variableChoisi.matrice],tabLigne,cadre);

		// On initialise tabX avec la valeur choisie en abscisse
	    var tabX = MODTools.initTabx(variableChoisi);

		//On définit la trace
	    var trace = {
	        x : tabX.slice(),
	        y : tabY.slice(),
	        type : 'scatter'    // type de la trace (pour voir toutes les options possibles: https://plot.ly/javascript/reference/ )
	    };

		// On redessine le graphique
	    var plotDiv = document.getElementById("graph-"+cadre.replace('.',''));
	    plotDiv.data[0] = trace;
	    Plotly.relayout(plotDiv,layout);
	    Plotly.redraw(plotDiv);

	}

	self.createDefaultGraph = function  (cadre) {
	    // Parametres de la trace à tracer dans le layout
	    var trace = {
	        x : [],
	        y : [],
	        type : 'scatter'    // type de la trace (pour voir toutes les options possibles: https://plot.ly/javascript/reference/ )
	    };
	    
	    // Parametres du layout (pour voir toutes les options possibles: https://plot.ly/javascript/reference/#layout )
	    var layout = {
	        yaxis: {    
	            title: '',    // On récupère le titre dans les métadonnées
	            type : 'linear',
	            autorange : true
	        },
	        xaxis: {
	            title: '',
	            showgrid: true,  
	            type : 'linear',
	            autorange : true
	        },   
	        margin: {                
	            l: 60, b: 60, r: 10, t: 10
	        },
	        // Autres options
	        showlegend : false,
	        autosize : true
	    }; 
	    
	    var plotDiv = document.
	        getElementById("graph-"+cadre.replace('.',''));
	    /*Plotly construit le graphique 
	    (rq: on remove des bouttons mis par défaut dans la modebar 
	    (pour liste des bouttons: 
	    https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js) 
	    ainsi que le logo) */
	    Plotly.newPlot(plotDiv, [trace], layout, {
	        modeBarButtonsToRemove: [
	            'sendDataToCloud',
	            'zoomIn2d',
	            'zoomOut2d',
	            'select2d',
	            'lasso2d',
	            'resetScale2d',
	            'toImage',
	            'hoverClosestCartesian',
	            'hoverCompareCartesian'],
	        displaylogo: false
	    });
	}
	return self;

})();