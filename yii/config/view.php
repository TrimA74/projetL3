<?php

return [
    'class' => 'yii\web\View',
            'renderers' => [
                'twig' => [
                    'class' => 'yii\twig\ViewRenderer',
                    'cachePath' => '@runtime/Twig/cache',
                    // Array of twig options:
                    'options' => [
                        'auto_reload' => true,
                    ],
                    'globals' => [
                        'html' => '\yii\helpers\Html',
                        'Url' => ['class' => '\yii\helpers\Url'],
                    ],
                    'uses' => ['yii\bootstrap'],
                ],
                // ...
            ],
];
