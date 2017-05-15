var matrix = new Object();
var variableChoisi= {};
var setCourant;



var metadata;

/* MAIN */ 
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
               majApresSet(result.set[0].name,".tensoriel");
            }
        });
            
    });

});






/*  */
function updateSlider(elem,parameters,cadre) {
    var val = $("#range"+elem).slider('getValue');

    // on redessine la courbe 
    var layout = {
        autosize : 'false',
        autorange : 'false',
    }
    
    MODGraph.redrawGraph(layout,cadre,variableChoisi,parameters);
    //cree canvas pour le mur
    if(metadata.wall.displayWall)
        mesFonctions[metadata.wall.method]();
}




/*  */
function changeParams(parametre,val,cadre){
    console.log(cadre);
    var cadreDiv = $(cadre);
    var controllers = cadreDiv.find(".controllers");
    var parameters = metadata.set[setCourant].parameters;

    //numéro de la matrice à mettre en abscisse (défini dans le bouton qui appelle l'évènement) 
    variableChoisi = parameters[val];	 

    // variable de parameters avec l'attribut fichier à 0
    var variableCalcul;
    $.each(parameters,function (i,e){
        if(e.fichier==0){
            variableCalcul = e ;
        }
    });
    // Affiche tous les sliders sauf celui mis en abscisse
    cadreDiv.find(".param").css('display', 'block');
    cadreDiv.find(".param"+ parametre).css('display', 'none');

    var layout = {
        yaxis: {
            title: ''+variableCalcul.nom+' '+variableCalcul.unite,
            autorange : 'true',
        },
        xaxis: {
            title: ''+variableChoisi.nom+' '+variableCalcul.unite,
            showgrid: true,// remove the x-axis grid lines
        },
        showlegend : false
    };

    MODGraph.redrawGraph(layout,cadre,variableChoisi,parameters);
    MODEnv.updateCadre(cadre,parameters,variableCalcul,variableChoisi); 
        

    //cree canvas pour le mur
    if(metadata.wall.displayWall)
        mesFonctions[metadata.wall.method]();
}






/* Fonction qui se déclanche sur l'événement onChange du selecteur de dataset */
function majApresSet(set,cadre){
    
    setCourant = set;
    var parameters = metadata.set[setCourant].parameters;

    /* Latex Set Info*/ 

    var client = new XMLHttpRequest();
    client.open('GET', "data/"+ MODTools.$_GET("cat") +"/"+ set +"/meta_donnees_LaTeX.tex" );
    client.onreadystatechange = function() {
      $("#latexSetInfo").html("<p style=\"font-size:200%;\"> " + client.responseText + "</p>");
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    };
    client.send();

    //cree canvas pour le mur
    if(metadata.wall.displayWall)
    {
        mesFonctions[metadata.wall.method]();
    }
    

    $.when.apply( $ , MODTools.getMatrixDeferred(parameters,set) ).done(function () {
        console.log(matrix);
        $.each(metadata.calculs,function (i,e){
            MODEnv.creationCadreCalcul("." + e.class,parameters);
            MODGraph.createDefaultGraph("."+e.class); 
        });
    }); 
    
      
} 



