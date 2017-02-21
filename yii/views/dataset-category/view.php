<h2>Catégorie <?php echo $category->title?></h2>
<?php foreach ($datasets as  $value) {
		
		?>
		<p>Dataset <?php echo $value->name ?></p>
		<?php
}