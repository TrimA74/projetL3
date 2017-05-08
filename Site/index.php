<!DOCTYPE html>

<html style=" height: 100%;">
<head>
	  <meta charset="UTF-8">
	  <meta name="description" content="Free Web tutorials">
	  <meta name="keywords" content="HTML,CSS,XML,JavaScript">
	  <meta name="author" content="John Doe">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  	<link rel="stylesheet" href="bootstrap.min.css">
	  	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="bootstrap-slider.min.css">
		<link rel="stylesheet" href="style.css" />
	  	<meta charset="utf-8" />	
		<title>Parametric model in Building Physics</title>

	</head>

	<body class="body">

		<header class="container">

			<div class="grandCadre">
				<h1 class="text-center"><strong>Parametric model in Building Physics</strong></h1>
			</div>

		</header>

        <div class="zonePrincipale">
		<div class="container">
			<div class="row">

			<div class="col-md-1">
			</div>

			<div class="col-md-10">
<?php
$chemin = "./data";
if ($dir = opendir("./data")) {
    while($file = readdir($dir)) {
        if(is_dir($chemin."/".$file) and $file!="." and $file!="..")
        { ?>
            
				<div class="titreCategorie">
					<h2 class="text-center"><a href="affichage.php?cat=<?php echo $file; ?>"><strong><?php echo $file; ?></strong></a><h2/>
				</div>
                
<?php $chemintmp = $chemin."/".$file; 

            if(file_exists($chemintmp."/description.txt"))
            {   ?>
                
                <div>

					<div class="texteEncadrer">
					<strong>Description : </strong><br/> 
                    <?php echo file_get_contents($chemintmp."/description.txt"); ?>
                    </div>
                    
                </div>
                
<?php   
            }
        }
    }
closedir($dir);
} ?>

			</div>

		</div>
        </div>

		<footer class="container-fluid footerIndex">
		</footer>
		
		<script src="bootstrap.min.js"></script>

	</body>

</html>
