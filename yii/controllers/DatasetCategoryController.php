<?php

namespace app\controllers;

use app\models\DatasetCategory;

class DatasetCategoryController extends \yii\web\Controller
{
    public function actionIndex()
    {
        return $this->render('index');
    }
    public function actionView($id)
    {
        $category = DatasetCategory::findOne($id);
        $datasets = $category->datasets;
        return $this->render('view',[
        	'category' => $category,
        	'datasets' => $datasets
        	]);
    }

}
