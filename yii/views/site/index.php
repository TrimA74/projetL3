<?php
use yii\helpers\Url;
/* @var $this yii\web\View */

$this->title = 'Home';
?>
<div class="row">

            <div class="col-md-1">
            </div>

            <div class="col-md-10">
                    <?php foreach ($categories as $value) { ?>
                        
                    
                    <div style="background: rgb(250,250,200);">
                        <h2 class="text-center">
                            <a href="<?php echo Url::to(['dataset-category/view','id' => $value->primaryKey]);?> "><br/>
                                <span class="glyphicon glyphicon-tint"></span>
                                    <strong><?php echo $value->title?></strong>
                            </a>
                        <h2/>
                    </div>
                    <div>
                        <blockquote>
                        <p class="text-justify"><?php echo $value->description;?></p>
                        </blockquote>
                    </div>
                    <?php } ?>

            </div>

        </div>
