var MODGraph = (function(){
	var self = {};

	self.redrawGraph = function (layout,cadre,variableChoisi,parameters) {
	    var tabLigne = [];//les lignes choisies

		
		// On effectue le bon calcul
	    if (metadata.calculs[cadre.replace('.','')].method == "CalculTensoriel"){
			tabLigne = MODTools.getLignesFromSlider(parameters,cadre);
			
			
		}else if (metadata.calculs[cadre.replace('.','')].method == "CalculIntegrale"){
			var matriceAIntegrer = metadata.calculs.fluxGlobal.matriceAIntegrer;
			tabLigne = MODTools.getLignesFromSlider(parameters,cadre);	//Les lignes des sliders + la matrice F intégrée
			
			// On cherche le delta pour intégrer la matrice matriceAIntegrer
			var min;
			var max;
			$.each(parameters,function (i,e){
				if(e.matrice == matriceAIntegrer){
					min = e.min;
					max = e.max;
				}
			});
			var delta = (max - min)/(matrix[matriceAIntegrer].length-1);    // (valMax-valMin) / nbVal
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
			ligne = Math.round((ligne-paramAssociee.min)/ ranger.slider('getAttribute').step);
			
			
			if (ligne>0){
				//On calcule  f(x) dérivée de F(x) sur la ligne associée
				tabLigne.push(MODTools.DerivationMatrice(matrix[matriceADeriver], ligne, delta));
			}else{
				console.log("Il y a un probleme");
			}
		}

	    var tabY = mesFonctions[metadata.calculs[cadre.replace('.','')].method](matrix[variableChoisi.matrice],tabLigne,cadre);


	    var tabX = MODTools.initTabx(variableChoisi);

	    var trace = {
	        x : tabX.slice(),
	        y : tabY.slice(),
	        type : 'scatter'    // type de la trace (pour voir toutes les options possibles: https://plot.ly/javascript/reference/ )
	    };

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