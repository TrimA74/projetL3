<!DOCTYPE html>

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
		<link rel="stylesheet" href="style.css" />
		<meta charset="utf-8" />
		<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
  tex2jax: 
  {inlineMath: 
  	[['$','$'], ['\\(','\\)']]
  },
   CommonHTML: {
    scale: 70	
  }

  });
</script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML">
</script>
		<title>Visu-thermique</title>

	</head>

	<body class="body">
        
		<header>
			<div class="col-md-12 centerTitle">
				<div class="encadrerDuTitre">
					<h2 class="text-center" style="font-size: 215%"><i>Visu Thermique</i></h2>
				</div>
			</div>
		</header>

        
        <div class="zonePrincipale">
		<div class="container">
			<h1 class="text-center"  style="font-size: 260%"><strong><u><?php  echo $_GET["cat"] ?></u></strong></h1>
			<div class="col-md-12 rubriquePage">
					<h2><span class="glyphicon glyphicon-file"></span>  Documentation : <h2/>
					\begin{align}
					  c \frac{\partial u}{\partial t} & = \frac{\partial u}{\partial x} \left( \, d \frac{\partial u}{\partial x} \, \right) \,,
					& t & \ > \ 0\,, \;&  x & \ \in \ \big[ \, 0, \, 1 \, \big] \,, \\[3pt]
					  d \, \frac{\partial u}{\partial x} & = \mathrm{Bi} \cdot \left( \, u - u_{\,L} \, \right)  \,,
					& t & \ > \ 0\,, \,& x & = 0 \,, \\[3pt]
					 -d \, \frac{\partial u}{\partial x} & = \mathrm{Bi} \cdot \left( \, u - u_{\,R} \, \right)  \,,
					& t & \ > \ 0\,, \,&   x & = 1 \,, \\[3pt]
					 u & = 1 \,,
					& t & = 0\,, \,& x & \ \in \ \big[ \, 0, \, 1 \, \big] \,.
					\end{align}
			</div>
        
        <?php
        $chemin = "./data/".$_GET["cat"];
        if ($dir = opendir($chemin)) {
            ?>
           
        <div class="row">
            <div class="col-md-5">
					<label for="selectset"><h2> <span class="glyphicon glyphicon-list-alt"></span>  Choix dataset</h2></label>
				      <select class="form-control selDataSet" id="selectset">
                            <?php
                            while($file = readdir($dir)) {
                                if(is_dir($chemin."/".$file) and $file!="." and $file!="..")
                                {
                                    echo "<option>".$file."</option>";
                                }
                            }
                            ?>
				      </select>
<?php                 
    closedir($dir);
    }
?>
                </div>

				<div class="col-md-7">
				</div>
				<div class="col-md-12 rubriquePage">
		
					 <h2><span class="glyphicon glyphicon-signal"></span>  Graphique : <span id="nomGraph"></span></h2>
						<div id="graph"></div>
				</div>
			</div> <!-- end row -->
            
            
            <div class="col-md-12 rubriquePage" id="boutons"><!-- les boutons -->

			</div>
			<div class="col-md-12 rubriquePage"><!-- les selecteurs -->
				<div class="form-horizontal">
                    <div class="col-md-8" id="parametres">
                        <!-- les slider ici -->
                    </div>
                    
                    <div class="col-md-4">
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
					<h4> <span class="glyphicon glyphicon-paperclip"></span>  Reférences : </h4></label>
					<h5><a href="../Documentation/Etude_des_technologie.pdf" title="Pdf">Lien documentation pdf</a> </h5>
					<h5><a href="https://fr.wikipedia.org/wiki/Thermique"  title="Pdf">Lien Site thermique</a> </h5>
					<h5><a href="https://fr.wiktionary.org/wiki/hydrique" title="Pdf">Lien Site hydrique</a> </h5>
				</div>
				<div><!--bouton retour -->
			    	<div>
			  			<div class="col-md-5">
						</div>
						<div class="col-md-2">
		        			<button class="btn btn-primary btn-lg boutonReturn" id="btnRetour" >
		        			<span class="glyphicon glyphicon-circle-arrow-left"></span> Retour </button>
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
