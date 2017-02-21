<?php

use yii\db\Migration;

class m170221_103957_dataset_category extends Migration
{
    
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
        $this->createTable('dataset_category',[
            'id' => $this->primaryKey(),
            'title' => $this->string()->notNull(),
            'description' => $this->text(),
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
        $this->insert('dataset_category', [
            'title' => 'Thermique',
            'description' => "Le modèle physique prend en compte la diffusion d'thérmique à travers un mur. Les conditions de bords sont fixes d'un 
            côté et oscillantes d'un autre. La solution est calculée en fonction de l'espace, 
            du temps et de A et de B.",
        ]);
        $this->insert('dataset_category', [
            'title' => 'Hydrique',
            'description' => "Le modèle physique prend en compte la diffusion d'humidité à travers un mur. Les conditions de bords sont fixes d'un côté 
            et oscillantes d'un autre. La solution est calculée en fonction de l'espace, 
            du temps et de la diffusion du matériau.",
        ]);

        $this->insert('dataset', [
            'name' => '1 thermicos',
            'id_category' => '1' ,
            'description' => 'la petite description du dataset thermicos',
            ]);
    }

    public function safeDown()
    {
        $this->execute("SET foreign_key_checks = 0;");
        $this->dropForeignKey('fk-dataset-id_category','dataset');
        $this->dropIndex('idx-dataset-category_id','dataset');
        $this->dropTable('dataset');
        $this->dropTable('dataset_category');
        $this->execute("SET foreign_key_checks = 1;");
        
    }
    
}
