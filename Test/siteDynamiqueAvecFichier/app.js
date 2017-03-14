var datasY = [];
var datasYInit = [];

var matrix = new Object();
var variableChoisi=0;

var plotDiv = document.getElementById('graph');

var data;
/*
* Fonction qui qui mets les données récup des csv dans des tableaux 2d
*/
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


function updateSlider (elem,data) {
    var val = $("#range"+elem).slider('getValue');

    var tabLigne = [];//les lignes choisis
    for(var i=1; i<data.length;i++){
        if(data[i][1] == 0 || variableChoisi==i){
            continue;
        }
        var ligne = $("#range" + data[i][0]).slider('getValue');
        var datas = JSON.parse(JSON.stringify(matrix[data[i][0]][ligne]));
        tabLigne.push(datas);
    }
    var tableaux = JSON.parse(JSON.stringify(tabLigne));
    var tabY = Calcul(matrix[data[variableChoisi][0]],tableaux);
    var tabX = new Array();
    for(var i=0;i<matrix[data[variableChoisi][0]].length;i++){
        tabX[i] = i;
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


function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
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


$('#selectset').on('change', function() {
  //alert( $_GET("cat"));
  var set = this.value;
  $.ajax({
                url: 'ajax.php',
                type:'POST',
                dataType : 'json', // On désire recevoir du HTML
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

function changeParams(parametre,val)
{
    variableChoisi = val;

    var tabLigne = [];//les lignes choisis
    for(var i=1; i<data.length;i++){
        if(data[i][1] == 0 || variableChoisi==i){
            continue;
        }
        var ligne = $("#range" + data[i][0]).slider('getValue');
        var datas = JSON.parse(JSON.stringify(matrix[data[i][0]][ligne]));
        tabLigne.push(datas);
    }
    var tableaux = JSON.parse(JSON.stringify(tabLigne));
    var tabY = Calcul(matrix[data[variableChoisi][0]],tableaux);
    var tabX = new Array();
    for(var i=0;i<matrix[data[variableChoisi][0]].length;i++){
        tabX[i] = i;
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

    $("#parametres").find(".param").css('display', 'block');
    $("#parametres").find("#param"+ parametre).css('display', 'none');
    
}
function generate_handler( j,data ) {
    return function(event) { 
        updateSlider(j,data);
    };
}

function majApresSet(result, set)
{
    data = result;
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
    }
    
    
    
    //gestion boutons
    $("#boutons").children().remove();
    
    str = "<div class='col-md-4'></div>";
    str += "<div class='col-md-4'>";
    str += "<h2> <span class='glyphicon glyphicon-option-horizontal'></span>  Matrice en abscisse</h2>";
    
    for(i=1; i<data.length; i++)
    {   if(data[i][1] == 1)
            str += "<button onclick=\"changeParams($( this ).text(),$( this ).val())\"  value =\""+i+"\"class='btn btn-primary btn-lg' style='background: linear-gradient(to bottom right, #3366ff 0%, #66ff33 100%);'>"+ data[i][0] + "</button>";
    }
    str += "</div>";
	str += "<div class='col-md-4'></div>";
    
    $("#boutons").append(str);
    
    
    
    //gestion parametres
    $("#parametres").children().remove();
    str = "<h2><span class='glyphicon glyphicon-option-vertical'></span>  Autres paramètres <h2/>";
    
    
    
    for(i=1; i<data.length; i++)
    {
        if(data[i][1] == 1)
        {
            str += "<div class='form-horizontal' >";
            str += "<div class='form-group param' id='param" + data[i][0] + "'  style='display:none;'>";
            str += "<label for='amountInput" + data[i][0] + "' class='col-sm-1 control-label'>" + data[i][0] + "</label>";
            str += "<div class='col-sm-2'>";
            str += "<input id='rangeN" + data[i][0] + "'  \
            onchange=\"$('#range" + data[i][0] + "').slider('setValue',this.value);\"  \
            type='number' name='amountInput" + data[i][0] + "' value='"+(data[i][5]/2)+"' \
            min='"+data[i][4]+"' max='"+data[i][5]+"' step='1' class='form-control'/>";
            str += "</div>";
            str += "<div class='col-sm-4'>";
            str += "<input  id='range" + data[i][0] + "' type='text'  \
            name='amountRange' onchange=\"document.getElementsByName('amountInput" + data[i][0] + "')[0].value=this.value;\" \
            data-slider-min='"+data[i][4]+"' data-slider-max='"+data[i][5]+"' step='1' \
            data-slider-value='"+(data[i][5]/2)+"' />";
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
    
            slider = $("#range" + data[i][0]).slider({ 
              tooltip: 'always'
            });
            slider.on('slideStop',generate_handler(data[i][0],data));
            $("#rangeN" + data[i][0]).on('change',generate_handler(data[i][0],data));
        
        }
    }
    
    var tableaux = [];//les lignes choisis
    
    //var i = 1;
    //var j = 0;
    
    //a revoir
    //variableChoisi = 2;
    for(var i =0;i<data.length;i++){
        if(data[i][1]==1){
            variableChoisi = i;
            break;
        }
    }
    /*
    while(i<data.length)
    {
        if(data[i][1] == 1 && variableChoisi!=i)
        {
            var ligne = $("#range" + data[i][0]).slider('getValue');
            console.log(matrix[data[i][0]][ligne]);
            tableaux[j] = matrix[data[i][0]][ligne].slice();
            console.log(tableaux[j]);
            j++;
            console.log(tableaux[j-1]);
        }
        console.log(tableaux);
        i++;
    }
    */
    for(var i=1; i<data.length;i++){
        if(data[i][1] == 0 || variableChoisi==i){
            continue;
        }
        var ligne = $("#range" + data[i][0]).slider('getValue');
        tableaux.push(matrix[data[i][0]][ligne].slice());
    }
    i=2;
    str='<label width="100%">Abscisse :</label><p>'+data[variableChoisi][2]+' '+data[variableChoisi][3]+' = '+data[variableChoisi][0]+'</p>';
    str+='<label width="100%">Ordonnée :</label><p>'+data[1][2]+' '+data[1][3]+' = '+data[1][0]+'</p>';
    str+='<label width="100%">Constante :</label>';
    
    for(;i<data.length;i++){
        if(i!=variableChoisi){
            str+='<p>- '+data[i][2]+' '+data[i][3]+' = '+data[i][0]+' </strong></p>';
        }
    }
    $("#descriptionDataset").html("");
    $("#descriptionDataset").append(str);
    
    var tab = JSON.parse(JSON.stringify(tableaux));
    var tabY = Calcul(matrix[data[variableChoisi][0]],tab);
    var tabX = new Array();
    for(var i=0;i<matrix[data[variableChoisi][0]].length;i++){
        tabX[i] = i;
    }
    var trace = {
        x : tabX,
        y : tabY,
        type : 'scatter'
    };
     var layout = {
      yaxis: {
        title: ''+data[1][2]+' '+data[1][3]},       // set the y axis title
        type : 'linear',
        autorange : 'false',
        range : [0,3],
      xaxis: {
        title: ''+data[variableChoisi][2]+' '+data[variableChoisi][3],
        showgrid: true,  
        type : 'linear',        // remove the x-axis grid lines              // customize the date format to "month, day"
    },   margin: {                           // update the left, bottom, right, top margin
        l: 40, b: 40, r: 10, t: 10
      },
      showlegend : false
    };   
    Plotly.newPlot(plotDiv,[trace],layout);
   
}
/*
$(document).ajaxStop(function () { // Quand on a finit de récup les données
    var tableaux = [];//les lignes choisis
    
    //var i = 1;
    var j = 0;
    for(var i=1; i<data.length;i++){
        if(data[i][1] == 0 || variableChoisi==i){
            continue;
        }
        var ligne = $("#range" + data[i][0]).slider('getValue');
        tableaux[j] = matrix[data[i][0]][ligne].slice();
        j++;
        console.log(tableaux);
    }
    var tab = tableaux.slice(0);
      var tabY = Calcul(matrix[data[variableChoisi][0]],tab);
      var tabX = new Array();
      for(var i=0;i<matrix[data[variableChoisi][0]].length;i++){
        tabX[i] = i;
      }
        var trace = {
            x : tabX,
            y : tabY,
            type : 'scatter'
        };
         var layout = {
          yaxis: {title: ''+data[1][2]+' '+data[1][3]},       // set the y axis title
          xaxis: {title: ''+data[variableChoisi][2]+' '+data[variableChoisi][3],
            showgrid: true,                  // remove the x-axis grid lines              // customize the date format to "month, day"
        },   margin: {                           // update the left, bottom, right, top margin
            l: 60, b: 60, r: 60, t: 60
          },
          showlegend : false
        };   
        Plotly.newPlot(plotDiv,[trace],layout);
      
    });
*/





function Calcul(matriceAbscisse, tableaux) {
	var tabOrdonee = new Array(); 	// tableau résultat
	var tabPrecalcul = new Array();
	//var ligneM1 = matrice1[indiceM1];
	//var ligneM2 = matrice2[indiceM2];
	var nbColonnes = matriceAbscisse[0].length;
	var nbLignes = matriceAbscisse.length;
	
    tabPrecalcul = tableaux[0];


    //console.log(tableaux);
    // On précalcule la multiplication des lignes des matrices fixés
    for(var j=1; j<tableaux.length; j++)
    {
        for(var i=0;i<nbColonnes;i++){
            tabPrecalcul[i] *= Number(tableaux[j][i]);
        }
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
/*
console.log((1.1111111e-01).toFixed(2)); // 1267650600228229401496703205376*/