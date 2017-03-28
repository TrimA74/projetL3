<!DOCTYPE html>

<html>
<head>
	 <meta charset="UTF-8">
	  <meta name="description" content="Free Web tutorials">
	  <meta name="keywords" content="HTML,CSS,XML,JavaScript">
	  <meta name="author" content="John Doe">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="bootstrap.min.css">
		<link rel="stylesheet" href="bootstrap-slider.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
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

	<body style="background: linear-gradient(to bottom right, #99ccff 0%, #ccff99 89%);">

        
        
        
		<header class="container" style="margin-top: 30px; margin-bottom: 25px;">
			<div style="border: 3px solid rgb(50,150,180); padding: 20px; background-color: rgb(250,250,190); -moz-border-radius-topleft: 5px; -moz-border-radius-topright: 5px; -moz-border-radius-bottomright: 5px; -moz-border-radius-bottomleft: 5px;">
				<h1 class="text-center"><strong>Visu Thermique</strong></h1>
			</div>
		</header>

		 <div style="margin-bottom: 25px;"> <!-- gestion pdf -->
			<div class="col-md-2">
			</div>
			<div class="col-md-12" style="margin-bottom: 1%;"> <!-- gestion pdf -->
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
			<div class="col-md-2">
			</div>
		</div>
        
        <div class="container">
        
        <?php
        $chemin = "./data/".$_GET["cat"];
        if ($dir = opendir($chemin)) {
            ?>
           
        
            <div class="row">
				<div class="col-md-3"><!--selecteur du set de donnée-->

					  <label for="selectset"><h3> <span class="glyphicon glyphicon-list-alt"></span>  Choix dataset</h3></label>
				      <select  multiple class="form-control" id="selectset" 
				      style="background-color: rgb(100, 180, 190);color: rgb(255, 255, 255); height: 460px; font-size: 16px;">
				        <optgroup label="<?php echo $_GET["cat"]; ?>">
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
				<div class="col-md-9">
		
					 <h2><span class="glyphicon glyphicon-signal"></span>  Graphique : <span id="nomGraph"></span><h2/>
						<div id="graph"></div>
				</div>
			</div> <!-- end row -->
            
            
            <div class="col-md-12" id="boutons"><!-- les boutons -->

			</div>
			<div class="col-md-12"><!-- les selecteurs -->
				<div class="col-md-4">
					<div style="border-left : 5px solid rgb(250,250,250);  padding-left:20px;">
						<div style="font-size: 18px;" id="descriptionDataset">
						</div>
					</div>
				</div>
                
                
                
				<div class="col-md-8" id="parametres">

			</div>   <!--end selecteur -->
            
        </div> <!-- end conteneur traitement -->

        <footer class="container-fluid" style="margin-bottom: 40px;">
  				<div>
  					<div class="col-md-5">
					</div>
					<div class="col-md-2">
						<button class="btn btn-primary btn-lg" id="btnRetour" 
						style="background-color: rgb(230,235,235); color: rgb(0,0,0);"><span class="glyphicon glyphicon-circle-arrow-left"></span> Retour </button>
        			</div>
        			<div class="col-md-5">
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