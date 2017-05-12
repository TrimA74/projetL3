<!DOCTYPE html>
<?php
$json = json_decode(file_get_contents("metadata.json"),false);
?>
<html style=" height: 100%;">
<head>
	  <meta charset="UTF-8">
	  <meta name="description" content="Free Web tutorials">
	  <meta name="keywords" content="HTML,CSS,XML,JavaScript">
	  <meta name="author" content="John Doe">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  	<link rel="stylesheet" href="css/bootstrap.min.css">
	  	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="css/bootstrap-slider.min.css">
		<link rel="stylesheet" href="css/style.css" />
	  	<meta charset="utf-8" />	
		<title><?php echo $json->siteTitle ?></title>

	</head>

	<body class="body">

		<header class="container">

			<div class="grandCadre">
				<h1 class="text-center"><strong><?php echo $json->siteTitle ?></strong></h1>
			</div>

		</header>

        <div class="zonePrincipale">
		<div class="container">
			<div class="row">

				<div class="col-md-1">
				</div>

				<div class="col-md-10">
				<?php
				foreach ($json->categories as $key => $value) {
					?>
					<div class="titreCategorie">
						<h2 class="text-center"><a href="affichage.php?cat=<?php echo $value->lien; ?>"><strong><?php echo $value->title; ?></strong></a><h2/>
					</div>
					<div>
						<div class="texteEncadrer">
						<strong>Description : </strong><br/> 
	                    <?php echo $value->description ?>
	                    </div> 
	                </div>
				<?php } ?>
				</div>

			</div>
        </div>

		<footer class="container-fluid footerIndex">
		</footer>
		
		<script src="js/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>

	</body>

</html>
