<?php

use yii\db\Migration;

class m170221_103957_dataset_category extends Migration
{
    public function up()
    {
        $this->createTable('dataset_category',[
            'id' => $this->primaryKey(),
            'title' => $this->string()->notNull(),
            ]);
        $this->createTable('dataset',[
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'id_category' => $this->integer()->defaultValue(1),
            'description' => $this->text(),
            ]);
         $this->createIndex(
            'idx-dataset-category_id',
            'dataset',
            'id_category'
        );

        $this->addForeignKey(
            'fk-dataset-id_category',
            'dataset',
            'id_category',
            'dataset_category',
            'id',
            'CASCADE'
        );
    }

    public function down()
    {
        $this->execute("SET foreign_key_checks = 0;");
        $this->dropTable('dataset');
        $this->dropTable('dataset_category');
        $this->execute("SET foreign_key_checks = 1;");
        
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
