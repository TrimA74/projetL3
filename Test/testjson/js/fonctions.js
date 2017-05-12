//met a jour le canvas du mur pour thermique
var mesFonctions = {
    /* Retourne le tableau des ordonnées généré à partir de la matrice d'abscisse et des lignes fixées dans les autres matrices  */
    CalculIntegrale : function (matriceAbscisse, tableaux, parameters) {
        //A la différence du calcul précédent, on ajoute un facteur C à chaque somme.
        //Si l'utilisateur fixe le paramètre c, alors C = c(i fixé). Si l'utilisateur ne fixe pas le paramètre c, alors C = vecteur c.
        var tabOrdonee = new Array();                   // Tableau contenant le résultat (toutes les ordonnées calculées)
        var tabC = new Array();                         // Tableau contenant les valeurs du slider c
        var tabPrecalcul = new Array();
        var nbColonnes = matriceAbscisse[0].length;     // Théoriquement le même dans toutes les matrices
        var nbLignes = matriceAbscisse.length;          // Nombre de valeurs calculables
        var varProduit = "u";                           // Nom du parametre à ajouter au produit (ex dans hydrique: "c")

        // On initialise tabC (valeurs possibles du slider c) avec ce que nous donnent les métadonnées (min et max)
        var min;
        var max;
        $.each(parameters,function (i,e){
            if(e.lettre==varProduit){
                min = e.min;
                max = e.max;
            }
        });
        var pas = (max - min)/(matrix[varProduit].length-1);    // (valMax-valMin) / nbVal<- nb de lignes de la matrice associé au parametre varProduit (ex: matrice H si varProduit = c)
        for (var i=0; i<matrix[varProduit].length; i++){
            tabC[i] = i*pas;
        }
        
        
        // On précalcule la multiplication des lignes des matrices fixés
        tabPrecalcul = tableaux[0];             // Pour éviter de recalculer plusieurs fois la même chose, on stocke dans un tableau le résultat des produits des lignes déjà fixées
        for(var j=1; j<tableaux.length; j++)    // Pour chaque ligne à précalculer
        {
            for(var i=0;i<nbColonnes;i++){
                tabPrecalcul[i] *= Number(tableaux[j][i]);
            }
        }
        //console.log(tableaux);
        
        
        // On initialise le tableau y avec la valeur spécifiée dans les métadonnées
        for(var i=0;i<nbLignes;i++){
            tabOrdonee[i] = Number(variableChoisi.valInit);
        }
        //console.log(tabOrdonee);
        
        
        // Calcul
        for(var i=0;i<nbLignes;i++){            // Pour chaque valeur de y
            for(var j=0;j<nbColonnes;j++){      // On fait la somme des produits de chaque colonnes
                if (variableChoisi.lettre == varProduit){       // Si l'utilisateur à choisi le paramètre varProduit
                    tabOrdonee[i] += Number(matriceAbscisse[i][j]) * Number(tabPrecalcul[j]) * Number(tabC[i]); 
                }else{                                          // Si l'utilisateur fixe le paramètre varProduit avec le slider
                    var valSlider = $("#range" + varProduit).slider('getValue');    // Récupération de la valeur du slider varProduit
                    tabOrdonee[i] += Number((matriceAbscisse[i][j]) * Number(tabPrecalcul[j]) * valSlider); 
                }
            }
        }   

        return tabOrdonee;
    },
    /* Retourne le tableau des ordonnées généré à partir de la matrice d'abscisse et des lignes fixées dans les autres matrices  */
    Calcul : function (matriceAbscisse, tableaux) {
        var tabOrdonee = new Array();                   // Tableau contenant le résultat (toutes les ordonnées calculées)
        var tabPrecalcul = new Array();
        var nbColonnes = matriceAbscisse[0].length;     // Théoriquement le même dans toutes les matrices
        var nbLignes = matriceAbscisse.length;          // Nombre de valeurs calculables
        
        tabPrecalcul = tableaux[0];     // Pour éviter de recalculer plusieurs fois la même chose, on stocke dans un tableau le résultat des produits des lignes déjà fixées

        // On précalcule la multiplication des lignes des matrices fixés
        for(var j=1; j<tableaux.length; j++)    //pour chaque ligne à précalculer
        {
            for(var i=0;i<nbColonnes;i++){
                tabPrecalcul[i] *= Number(tableaux[j][i]);
            }
        }
        
        
        // On initialise le tableau y avec la valeur spécifiée dans les métadonnées
        for(var i=0;i<nbLignes;i++){
            tabOrdonee[i] = Number(variableChoisi.valInit);
        }
        
        // Calcul
        for(var i=0;i<nbLignes;i++){    // Pour chaque valeur de y
            for(var j=0;j<nbColonnes;j++){      // On fait la somme des produits de chaque colonnes
                tabOrdonee[i] += Number(matriceAbscisse[i][j]) * Number(tabPrecalcul[j]); 
            }
        }   
        
        return tabOrdonee;

    },
    majCanvasThermique : function(){
        
        var parameters = metadata.set[setCourant].parameters;
        
        /*******************************
            gestion du dessin du mur
        *******************************/
        //cree canvas si il n'existe pas encore
        if($("#canvasMur").length==0)
        {
            MODMur.creeCanvas();
        }
        

        //pour avoir les max et min de la largeur dans la fonction du canvas
        var dataLargeur;
        $.each(parameters,function (i,e){
            if(e.lettre=='L'){
                dataLargeur = e ;
            }
        });
        
        //trouver la largeur
        var largeur;
        if(variableChoisi==dataLargeur) //si la variableChoisi est celle de la largeur , on prend la moyenne
        {
            largeur = (Number(dataLargeur.max)+Number(dataLargeur.min))/2;
        }
        else //sinon la valeur du slider
        {
            largeur = $("#range" + dataLargeur.lettre).slider('getValue');
        }
        
            
        
        var largeurMurBase = 200;
        var largeurMurMin = largeurMurBase*Number(dataLargeur.min);
        var largeurMurMax = largeurMurMin*Number(dataLargeur.max);
        var largeurMur = largeurMurBase*largeur;
        var hauteur = 300;
        

        var canvas  = document.querySelector('#canvasMur');
        var context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width, canvas.height);
        
        //coloration des rectangle
        //rectangle du mur
        context.fillStyle = "#AAAAAA";
        context.fillRect(100, 60, largeurMurMin, hauteur);
        //rectangle agrandissement du mur
        context.fillStyle = "#CCCCCC";
        context.fillRect(100+largeurMurMin, 60, largeurMur-largeurMurMin, hauteur);
        
        context.font="18px 'Helvetica Neue',Helvetica,Arial,sans-serif";
        //ajout des textes d'environnement
        context.fillStyle = "black";
        context.fillText("exterieur", 0, 110);
        context.fillStyle = "black";
        context.fillText("interieur", 100+largeurMurMax+20, 110);
        
        //ajout des textes du mur et isolation
        context.fillStyle = "black";
        context.fillText("Wall", 100+20, 90);
        
        //creation limite max et min du mur
        context.lineWidth = 2;
        context.strokeStyle = "black";
        //min
        var x=100+largeurMurMin;
        var yA=30;
        var yB=60+hauteur+30;
        MODMur.DashedLine(x,yA,x,yB,5,5, context)
        //max
        var x=100+largeurMurMax;
        var yA=30;
        var yB=60+hauteur+30;
        MODMur.DashedLine(x,yA,x,yB,5,5, context)
        
        //ajout des textes limites min max
        context.fillStyle = "black";
        context.fillText("min", 100+largeurMurMin-10, yA-5);
        context.fillStyle = "black";
        context.fillText("max", 100+largeurMurMax-10, yA-5);
        
        //creation des contours
        context.beginPath();
        context.lineWidth = "2";
        context.strokeStyle = "black";
        //context.strokeRect(100, 60, largeurMur, hauteur);
        
        //traits gauche et droite
        context.moveTo(100, 60);
        context.lineTo(100,60+hauteur);
        context.moveTo(100+largeurMur, 60);
        context.lineTo(100+largeurMur, 60+hauteur);
        
        
        //traits bas
        context.moveTo(100, 60+hauteur);
        context.lineTo(100+(largeurMur/2)-5,60+hauteur);
        
        context.moveTo(100+(largeurMur/2)-5-10, 60+hauteur+20);
        context.lineTo(100+(largeurMur/2)-5+10, 60+hauteur-20);
        context.moveTo(100+(largeurMur/2)+5-10, 60+hauteur+20);
        context.lineTo(100+(largeurMur/2)+5+10, 60+hauteur-20);
        
        context.moveTo(100+(largeurMur/2)+5, 60+hauteur);
        context.lineTo(100+largeurMur,60+hauteur);
        
        
        //traits hauts
        context.moveTo(100, 60);
        context.lineTo(100+(largeurMur/2)-5,60);
        
        context.moveTo(100+(largeurMur/2)-5-10, 60+20);
        context.lineTo(100+(largeurMur/2)-5+10, 60-20);
        
        context.moveTo(100+(largeurMur/2)+5-10, 60+20);
        context.lineTo(100+(largeurMur/2)+5+10, 60-20);
        
        context.moveTo(100+(largeurMur/2)+5, 60);
        context.lineTo(100+largeurMur,60);
        
        context.stroke();
        
        //la fleche
        context.beginPath();
        context.lineWidth = "3";
        context.strokeStyle = "black";
        context.moveTo(50, 60+(hauteur)/2);
        context.lineTo(100+largeurMur+60,60+(hauteur)/2);
        
        context.lineWidth = "1";
        context.moveTo(100+largeurMur+80, 60+(hauteur)/2);
        context.lineTo(100+largeurMur+50, 60+(hauteur)/2+10);
        context.lineTo(100+largeurMur+50, 60+(hauteur)/2-10);
        context.fill();
        
        context.stroke();
        
    }
};