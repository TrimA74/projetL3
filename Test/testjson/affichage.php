<!DOCTYPE html>

<html style="width=100%;">
<head>
	 <meta charset="UTF-8">
	  <meta name="description" content="Free Web tutorials">
	  <meta name="keywords" content="HTML,CSS,XML,JavaScript">
	  <meta name="author" content="John Doe">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<link rel="stylesheet" href="css/bootstrap-slider.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <link rel="stylesheet" href="css/style.css">

        <script type="text/x-mathjax-config">
          MathJax.Hub.Config({
            extensions: ["tex2jax.js"],
            jax: ["input/TeX", "output/HTML-CSS"],
            tex2jax: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ],
              displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
              processEscapes: true
            },
            "SVG": { availableFonts: ["TeX"], scale : 70 }
          });
        </script>
        <script type="text/javascript" async
            src="http://os-vps418.infomaniak.ch/vth/MathJax/MathJax.js?config=TeX-AMS_SVG&delayStartupUntil=configured&<?php echo substr( md5(rand()), 0, 7)?>">
        </script>

		<title>Parametric model in Building Physics</title>

	</head>

	<body class="body">
        
        <div class="fondHeader">
		<header  class="container fondHeader">
			<div class="col-md-12 centerTitle">
				<div class="encadrerDuTitre">
					<h2 class="text-center" ><i>Parametric model in Building Physics</i></h2>
				</div>
			</div>
		</header>
        </div>

        
        <?php
        $chemin = "./data/".$_GET["cat"];
        $json = json_decode(file_get_contents($chemin."/metadata.json"),false);
            ?>
        
        <div class="zonePrincipale">
		<div class="container">
        <div class="row">
			<h1 class="text-center"  style="font-size: 260%"><strong><u><?php  echo $json->title ?></u></strong></h1>
        </div>
        <div class="row">
            <div class="col-md-12 rubriquePage">
                    <h2><span class="glyphicon glyphicon-file"></span>  Documentation : <h2/>
                    <div class="mathjax">
                        <?php 
                        echo file_get_contents($chemin."/".$json->latexDescription);
                        ?>    
                    </div>   
            </div>
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
			<div class="col-md-12 infoSetLatex">
				<div class="col-md-3">
					<h3>Set Information : </h3>
				</div>
                <div class="col-md-7 mathjax" id="latexSetInfo"></div>
                <div class="col-md-3"></div>
                <div class="col-md-7" id="tailleGagner"></div>
			</div>
        </div>
                <?php foreach ($json->calculs as $key => $value) { ?>
            <div class="row <?php echo $key; ?>"> <!--Begin Calcule  -->

                <h2 class="titre_calcul"> <?php echo $value->title?>
                <button class="btn btn-primary btn-lg bouton_R_A" ><span class="glyphicon <?php echo ($value->display)? "glyphicon-menu-up": "glyphicon-menu-down"; ?>"></span></button>
            </h2>
                <div class="cadreCalcule" <?php if($value->display == 0){ echo 'style="display:none;"'; } ?> >
  
                    <div class="row">
                            <div class="col-md-12  graph-container">
                    
                                 <h2>
                                    <span class="glyphicon glyphicon-signal"></span>  Graphic : <span class="nomGraph"></span>
                                </h2>
                            </div>
                    </div> 
                    <div class="row controllers" style="display:none;">
                        <div class="col-md-5 rubriquePage" id="boutons">
                            <div class='col-md-8'>
                                <h2> <span class='glyphicon glyphicon-option-horizontal'></span>  Parameters</h2>
                                <div class='buttonsList'>
                                        <!-- les boutons -->
                                </div>
                            </div>
                            <div class='col-md-4 rubriquePage'>
                                
                            </div>
                        </div>
                        <div class="col-md-7" id="parametres">
                            <h2><span class='glyphicon glyphicon-option-vertical'></span>  Other parameters </h2>
                            <div class='form-horizontal variables'>
                            <!-- les sliders -->
                            </div>
                        </div>
                    </div>
                    <div class="row graphinfo">
                        <div class="col-md-12 rubriquePage"><!-- les descriptions -->
                                <div class="form-horizontal">  
                                    <div class="col-md-6">
                                        <div class="descriptionADroite" id="descriptionDataset">
                                            <!-- la description ici -->
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6" id="dessinMur">
                        
                                    </div>
                            
                                </div>

                        </div>   <!--end descriptions -->
                    </div>    
                </div> <!-- fin encadrer calcule -->

            </div> <!--End Calcule flux -->
            <?php }; ?>

            
        </div> <!-- end conteneur traitement -->

        </div> <!--end font blanc-->

        <footer class="container-fluid footerPage">
        	<div class="container">
				<div>
                    <div class="col-md-6">
                       <h4> <span class="glyphicon glyphicon-paperclip"></span>  References : </h4></label>
                        <?php
                        $json = json_decode(file_get_contents($chemin."/metadata.json"),false);
                        foreach ($json->references as $key => $value) {
                            echo '<h5><a href="'.$value->lien.'"  target="_blank" title="ref">'.$value->nom.'</a> </h5>';
                        }
                        ?> 
                    </div>
					
				</div>
				<div><!--bouton retour -->
			    	<div>
						<div class="col-md-12 boutonReturn">
		        			<button class="btn btn-primary btn-lg " id="btnRetour" >
		        			<span class="glyphicon glyphicon-circle-arrow-left"></span> Back </button>
					</div>
			    </div>	
			</div>
		</footer>
        
    <script src="js/jquery.min.js" integrity=""></script>
    
    <!-- Latest compiled and minified JavaScript -->
    <script src="js/bootstrap.min.js"></script>
    <script src="js/bootstrap-slider.min.js"></script>
    <script type="text/javascript" src="js/plotly.js" ></script>
        
    
    <script type="text/javascript" src="js/tools.js" ></script>
    <script type="text/javascript" src="js/fonctions.js" ></script>
    
    <script type="text/javascript" src="js/graph.js" ></script>
    <script type="text/javascript" src="js/env.js" ></script>
    <script type="text/javascript" src="js/mur.js" ></script>
    
    <script type="text/javascript" src="js/app.js" ></script>
    <script>
    //pour des test
    </script>

	</body>
</html>
