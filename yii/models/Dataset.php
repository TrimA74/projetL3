<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "dataset".
 *
 * @property integer $id
 * @property string $name
 * @property integer $id_category
 * @property string $description
 *
 * @property DatasetCategory $idCategory
 */
class Dataset extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'dataset';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['id_category'], 'integer'],
            [['description'], 'string'],
            [['name'], 'string', 'max' => 255],
            [['id_category'], 'exist', 'skipOnError' => true, 'targetClass' => DatasetCategory::className(), 'targetAttribute' => ['id_category' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'id_category' => 'Id Category',
            'description' => 'Description',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getIdCategory()
    {
        return $this->hasOne(DatasetCategory::className(), ['id' => 'id_category']);
    }
}
