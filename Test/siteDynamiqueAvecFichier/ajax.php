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
    $result = explode("\n", file_get_contents($chemin.'meta_donnees.csv'));
    for($i=0; $i<sizeof($result); $i++)
    {
        if($result[$i]!="")
            $result[$i] = explode(",", $result[$i]);
        else
            unset($result[$i]);
    }
    echo json_encode($result);
    
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


    
    