var MODEnv = (function () {
	var self = {};

	self.creationCadreCalcul = function (cadre,parameters){
	    var cadreDiv = $(cadre);
	    var controllers = cadreDiv.find(".controllers");
	    controllers.show(); // on affiche la div des controlleurs qui contiendra les bouttons et les sliders


	    /*********************************
	    ***     GESTION BOUTTONS       ***
	    *********************************/

	    var buttons = controllers.find(".buttonsList");
	    //console.log(buttons);

	    // On vide le contenu du bouton
	    buttons.html("");
	    var str = "";

	    //Pour chaque bouton, on le remplit avec les bonnes valeurs en fonction du paramètre que l'utilisateur a sélectionné
	    $.each(parameters,function (i,e){
	        if(e.fichier){
	           str += "<button onclick=\"changeParams($( this ).text(),$( this ).val(),'"+cadre+"');$('"+cadre+"').find('.buttonsList > button').css('background-color','rgb(200,200,200)');$(this).css('background-color','#337ab7');\"  value =\""+i+"\"class='btn btn-primary btn-lg boutonAbscisse' >"+ e.lettre+ "</button>"; 
	        }
	    });
	    buttons.append(str);
	    
	    
	    
	    /*******************************************
	    ***     GESTION PARAMETRES/SLIDERS       ***
	    ********************************************/
	    var variables = controllers.find(".variables");
	    variables.html("");
	    
	    str ="";
	    /* création de la structure html des sliders */  
	    
	    $.each(parameters,function (i,e){
	        if(e.fichier){
	            var step = (e.max-e.min) / (matrix[e.lettre].length-1);
	            
	            str += "<div class='form-group param param" + e.lettre + "' style='display:none; '>";
	            str += "<label for='amountInput" + e.lettre + "' class='col-sm-1 control-label'>" + e.lettre + "</label>";
	            str += "<div class='col-sm-2'>";
	            str += "<input  \
	            onchange=\"$("+cadre+").find('.range" + e.lettre + "').slider('setValue',this.value);\"  \
	            type='number' name='amountInput" + e.lettre + "' value='"+(e.max/2)+"' \
	            min='"+e.min+"' max='"+e.max+"' step='"+ step +"' class='form-control rangeN"+e.lettre+"'/>";
	            str += "</div>";
	            str += "<div class='col-sm-7'>";
	            str += "<div class='col-sm-3'>";
	            str += "<span class='minSlider' >"+ Math.round(Number(e.min)*1000)/1000 +"</span> ";
	            str += "</div>";
	            str += "<div class='col-sm-7'>";
	            str += "<input class='range"+e.lettre+"' type='text'  \
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
	    
	    variables.append(str);
	    var slider;

	    /* création finiale des sliders + ajout de l'événement slideStop sur chacun d'eux pour lier l'input à côté du slider*/ 
	    $.each(parameters,function (i,e){
	        if(e.fichier){
	            var pas = (e.max-e.min)/(matrix[e.lettre].length-1);
	            
	            slider = variables.find(".range" + e.lettre).slider({ 
	              tooltip: 'always',
	              step : pas,
	              precision: 3
	            });
	            slider.on('slideStop',MODTools.updateSliderHandler(e.lettre,parameters,cadre));
	            variables.find(".rangeN" + e.lettre).on('change',MODTools.updateSliderHandler(e.lettre,parameters,cadre));
	        }
	    });


	    cadreDiv
	        .find(".graph-container")
	        .append("<div id='graph-"+cadre.replace('.','')+"' class='graph'></div>");

	    cadreDiv.find("#nomGraph").text("Please select variable to put on abscissa");
	}

	self.updateCadre = function (cadre,parameters,variableCalcul,variableChoisi){
	    var cadreDiv = $(cadre);
	    //modification du nom du graph
	    cadreDiv
	        .find(".nomGraph")
	        .text(variableCalcul.nom + " depending on  " + variableChoisi.nom);

	    /*****************************************************************/
	    /****  Modification des abscisses, ordonnées et constantes *******/ 
	    /*****************************************************************/
	    var description = cadreDiv.find(".graphinfo").find(".descriptionADroite");
	    str='<label width="100%">Abscissa :</label>';
	        str+= '<p>'+variableChoisi.nom+' '+variableChoisi.unite+' = '+variableChoisi.lettre+'</p>';
	    str+='<label width="100%">Ordinate :</label>';
	        str+='<p>'+variableCalcul.nom+' '+variableChoisi.unite+' = '+variableCalcul.lettre+'</p>';
	    str+='<label width="100%">Constant :</label>';

	    /* Affichage des constantes (slider ) */ 
	    $.each(parameters,function (i,e){
	        if(e.fichier==1 && e!=variableChoisi){
	            str+='<p>'+e.nom+' '+e.unite+' = '+e.lettre+' </strong></p>';
	        }
	    });
	    description.html("");
	    description.append(str);
	}


	return self;
})();