﻿<!DOCTYPE html>

<html style="width=100%;">
<head>
	 <meta charset="UTF-8">
	  <meta name="description" content="Free Web tutorials">
	  <meta name="keywords" content="HTML,CSS,XML,JavaScript">
	  <meta name="author" content="John Doe">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="bootstrap.min.css">
		<link rel="stylesheet" href="bootstrap-slider.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <link rel="stylesheet" href="style.css">
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({"HTML-CSS": { preferredFont: "TeX", availableFonts: ["STIX","TeX"] },
            tex2jax: { inlineMath: [ ["$", "$"], ["\\\\(","\\\\)"] ], displayMath: [ ["$$","$$"], ["\\[", "\\]"] ], processEscapes: true, ignoreClass: "tex2jax_ignore|dno" },
            TeX: { noUndefined: { attributes: { mathcolor: "red", mathbackground: "#FFEEEE", mathsize: "90%" } } },
            messageStyle: "none"
        });
</script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_SVG">
</script>
		<title>Parametric model in Building Physics</title>

	</head>

	<body class="body">
        
		<header  class="container">
			<div class="col-md-12 centerTitle">
				<div class="encadrerDuTitre">
					<h2 class="text-center" style="font-size: 215%"><i>Parametric model in Building Physics</i></h2>
				</div>
			</div>
		</header>

        
        <?php
        $chemin = "./data/".$_GET["cat"];
        $json = json_decode(file_get_contents($chemin."/metadata.json"),false);
            ?>
        
        <div class="zonePrincipale">
		<div class="container">
			<h1 class="text-center"  style="font-size: 260%"><strong><u><?php  echo $json->title ?></u></strong></h1>
			<div class="col-md-12 rubriquePage">
					<h2><span class="glyphicon glyphicon-file"></span>  Documentation : <h2/>
					<?php 
                    echo file_get_contents($chemin."/".$json->latexDescription);
                    ?>
			</div>
        
        
           
        <div class="row">
            <div class="col-md-5">
					<label for="selectset"><h2> <span class="glyphicon glyphicon-list-alt"></span>  Dataset selection</h2></label>
				      <select class="form-control selDataSet" id="selectset">
                        <option></option>
                            <?php
                                    if ($dir = opendir($chemin)) {
                            while($file = readdir($dir)) {
                                if(is_dir($chemin."/".$file) and $file!="." and $file!="..")
                                {
                                    
                                    echo "<option>".$file."</option>";
                                }
                            }
                            closedir($dir);
                            }
                            ?>
				      </select>
                </div>
				<div class="col-md-7">
				</div>
				<div class="col-md-12">
				<div class="col-md-3">
					<h3>&emsp;&emsp;Set Information : </h3>
				</div>
				<div class="col-md-7" id="latexSetInfo">
				</div>
				</div>
                
                <div class="col-md-12" id="dessinMur">
		
				</div>
                
                
				<div class="col-md-12 rubriquePage">
		
					 <h2><span class="glyphicon glyphicon-signal"></span>  Graphic : <span id="nomGraph"></span></h2>
						<div id="graph"></div>
				</div>
			</div> <!-- end row -->
            
            <div class="row">
                <div class="col-md-6 rubriquePage" id="boutons"><!-- les boutons --></div>
                <div class="col-md-6" id="parametres">
                        <!-- les slider ici -->
                    </div>
            </div>
                
            <div class="col-md-12 rubriquePage"><!-- les selecteurs -->
                <div class="form-horizontal">
                    
                    <div class="col-md-6">
                        <div class="descriptionADroite" id="descriptionDataset">
                            <!-- la description ici -->
                        </div>
                    </div>
                    
                    
                    
                    
                </div>

            </div>   <!--end selecteur -->
        </div> <!-- end conteneur traitement -->
        </div> <!--end font blanc-->

        <footer class="container-fluid footerPage">
        	<div class="container">
				<div>
					<h4> <span class="glyphicon glyphicon-paperclip"></span>  References : </h4></label>
                    <?php
                    $json = json_decode(file_get_contents($chemin."/metadata.json"),false);
                    foreach ($json->references as $key => $value) {
                        echo '<h5><a href="'.$value->lien.'"  target="_blank" title="ref">'.$value->nom.'</a> </h5>';
                    }
                    ?>
				</div>
				<div><!--bouton retour -->
			    	<div>
			  			<div class="col-md-5">
						</div>
						<div class="col-md-2">
		        			<button class="btn btn-primary btn-lg boutonReturn" id="btnRetour" >
		        			<span class="glyphicon glyphicon-circle-arrow-left"></span> Back </button>
		      			</div>
			        	<div class="col-md-5">
						</div>
					</div>
			    </div>	
			</div>
		</footer>
        
    <script src="jquery.min.js" integrity=""></script>
    
    <!-- Latest compiled and minified JavaScript -->
    <script src="bootstrap.min.js"></script>
    <script src="bootstrap-slider.min.js"></script>
        
    
    <script type="text/javascript" src="plotly.js" ></script>
    <script type="text/javascript" src="app.js" ></script>
    <script>
    //pour des test
    </script>

	</body>
</html>
