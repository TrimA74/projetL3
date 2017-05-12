<?php


if (isset($_POST['myFunction']) && $_POST['myFunction'] != '')
{
    $_POST['myFunction']($_POST);
}


function chargeSet($data)
{
    $cat = $data['myParams']['cat'];
    $set = $data['myParams']['set'];
    $chemin = "./data/".$cat."/".$set."/";
    $explode = explode("\n", file_get_contents($chemin.'meta_donnees.csv'));
    $result = array();
    $compteurResult = 0;
    for($i=0; $i<sizeof($explode); $i++)
    {
        $explode[$i] = trim($explode[$i]); //on eneleve les espaces en fin et debut pour bien detecter ensuite les lignes vides
        if($explode[$i]!="")
        {
            $result[$compteurResult] = explode(",", $explode[$i]);
            $compteurResult++;
        }
            
    }
    echo json_encode($result);
    
}

function chargeJsonSet($data)
{
    $cat = $data['myParams']['cat'];
    $set = $data['myParams']['set'];
    echo file_get_contents("./data/".$cat."/".$set."/metadata.json");
}

function chargeJsonCat($data)
{
    $cat = $data['myParams']['cat'];
    echo file_get_contents("./data/".$cat."/metadata.json");
}


function chargeMatrice($data)
{
    $cat = $data['myParams']['cat'];
    $set = $data['myParams']['set'];
    $nomMatrice = $data['myParams']['matrice'];
    $chemin = "./data/".$cat."/".$set."/";
    $result = file_get_contents($chemin.$nomMatrice.'.csv');
    
    //fait dans le js
    /*for($i=0; $i<sizeof($result); $i++)
    {
        if($result[$i]!="")
            $result[$i] = explode(",", $result[$i]);
        else
            unset($result[$i]);
    }*/
    echo json_encode($result);
}


    
    