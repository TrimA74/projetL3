<?php
  /*  $chemin = "./data";
    if ($dir = opendir("./data")) {
        while($file = readdir($dir)) {
            if(is_dir($chemin."/".$file) and $file!="." and $file!="..")
            {
                echo $file."<br/>";
                $chemintmp = $chemin."/".$file;
                echo file_get_contents($chemintmp."/description.txt");
                echo "<br/><br/>";
            }
        }
        closedir($dir);
    }
    test pul auto
    */
?>

<!DOCTYPE html>

<html>
<head>
	  <meta charset="UTF-8">
	  <meta name="description" content="Free Web tutorials">
	  <meta name="keywords" content="HTML,CSS,XML,JavaScript">
	  <meta name="author" content="John Doe">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  	<link rel="stylesheet" href="bootstrap.min.css">
	  	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<link rel="stylesheet" href="bootstrap-slider.min.css">
	  	<meta charset="utf-8" />	
		<title>Visu-thermique</title>

	</head>

	<body style="background: linear-gradient(to bottom right, #99ccff 0%, #ccff99 89%);">

		<header class="container" style="margin-top: 30px;">

			<div style="border: 3px solid rgb(50,150,180); padding: 20px; background-color: rgb(250,250,190); -moz-border-radius-topleft: 5px; -moz-border-radius-topright: 5px; -moz-border-radius-bottomright: 5px; -moz-border-radius-bottomleft: 5px;">
				<h1 class="text-center"><strong>Visu Thermique</strong></h1>
			</div>

		</header>

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
            
				<div style="padding:1px; background-color: rgb(250,250,250); border:0px solid #656ab0; -moz-border-radius:9px; -khtml-border-radius:9px; -webkit-border-radius:9px; border-radius:9px;margin-bottom: 20px; margin-top: 50px;">
					<h2 class="text-center"><a href="Page1.html"><strong><?php echo $file; ?></strong></a><h2/>
				</div>
                
<?php $chemintmp = $chemin."/".$file; ?>
                
                <div>

                    <div style="padding:8px; padding-left:10px; border:1px dotted rgb(250,250,250); border-left:4px solid rgb(50,150,180); margin-left:20px;margin-right:20px;font-size: 18px; background-color: rgb(220,220,220);">
                    <strong>Description : </strong><br/> 
                    <?php echo file_get_contents($chemintmp."/description.txt"); ?>
                    </div>
                    
                </div>
                
<?php   
        }
    }
closedir($dir);
} ?>

			</div>

		</div>


		<footer class="container-fluid"  style=" margin-top: 50px;">
		</footer>
		
		<script src="bootstrap.min.js"></script>

	</body>

</html>

<!-- rejex : sed -i -re 's/\t/;/g' *.txt | sed -i -re 's/( )//g' *txt -->
<!-- site web : http://os-vps418.infomaniak.ch/vth/projetL3/ -->
