//met a jour le canvas du mur pour thermique
var mesFonctions = {
    /* Retourne le tableau des ordonnées généré à partir de la matrice d'abscisse et des lignes fixées dans les autres matrices  */
    CalculIntegrale : function (matriceAbscisse, tableaux, cadre) {
        //A la différence du calcul précédent, on ajoute un facteur C à chaque somme.
        //Si l'utilisateur fixe le paramètre c, alors C = c(i fixé). Si l'utilisateur ne fixe pas le paramètre c, alors C = vecteur c.
        var tabOrdonee = new Array();                   // Tableau contenant le résultat (toutes les ordonnées calculées)
        var tabC = new Array();                         // Tableau contenant les valeurs du slider c
        var tabPrecalcul = new Array();
        var nbColonnes = matriceAbscisse[0].length;     // Théoriquement le même dans toutes les matrices
        var nbLignes = matriceAbscisse.length;          // Nombre de valeurs calculables
        var varProduit = metadata.calculs.fluxGlobal.paramPourIntegration;                        // Nom du parametre à ajouter au produit (ex dans hydrique: "c")
        var parameters = metadata.set[setCourant].parameters;

        // On initialise tabC (valeurs possibles du slider c) avec ce que nous donnent les métadonnées (min et max)
        var parametre = parameters.find(function (e) {
            return e.valeur == varProduit;
        });

        var pas = (parametre.max - parametre.min)/(matrix[parametre.matrice].length-1);    // (valMax-valMin) / nbVal<- nb de lignes de la matrice associé au parametre varProduit (ex: matrice H si varProduit = c)
        for (var i=0; i<matrix[parametre.matrice].length; i++){
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
        
        // Calcul
        for(var i=0;i<nbLignes;i++){            // Pour chaque valeur de y
            for(var j=0;j<nbColonnes;j++){      // On fait la somme des produits de chaque colonnes
                if (variableChoisi.variable == varProduit){       // Si l'utilisateur à choisi le paramètre varProduit
                    tabOrdonee[i] += Number(matriceAbscisse[i][j]) * Number(tabPrecalcul[j]) * Number(tabC[i]); 
                }else{                                          // Si l'utilisateur fixe le paramètre varProduit avec le slider
                    var ligne = $(cadre).find(".range" + varProduit).slider('getValue');    // Récupération de la valeur du slider varProduit
					ligne = Math.round((ligne-parametre.min)/ $(cadre).find(".range" + varProduit).slider('getAttribute').step);	//Récupération de l'indice de cette valeur
                    tabOrdonee[i] += Number((matriceAbscisse[i][j]) * Number(tabPrecalcul[j]) * tabC[ligne]); 
                }
            }
        }   
		//console.log(tabOrdonee);
		
        return tabOrdonee;
    },
	
	
    /* Retourne le tableau des ordonnées généré à partir de la matrice d'abscisse et des lignes fixées dans les autres matrices  */
    CalculTensoriel : function (matriceAbscisse, tableaux, cadre) {
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
        var dataLargeur = parameters.find(function (e) {
            return e.valeur == 'L';
        });        
        //trouver la largeur
        var largeur;
        if(variableChoisi==dataLargeur) //si la variableChoisi est celle de la largeur , on prend la moyenne
        {
            largeur = (Number(dataLargeur.max)+Number(dataLargeur.min))/2;
        }
        else //sinon la valeur du slider
        {
            largeur = $(".range" + dataLargeur.valeur).slider('getValue');
        }
        
        
        //calcul des longueurs
        largeurCanvas = $("#canvasMur")[0].width;
        hauteurCanvas = $("#canvasMur")[0].height; 
        
        var largeurMurBase = largeurCanvas*60/(100*Number(dataLargeur.max));
        var largeurMurMin = largeurMurBase*Number(dataLargeur.min);
        var largeurMurMax = largeurMurMin*Number(dataLargeur.max);
        var largeurMur = largeurMurBase*largeur;
       
        var largeurCote  = (20/100)*largeurCanvas //outside et inside
        var largeurTriangleFleche  = (5/100)*largeurCanvas
        var margeFleche  = (5/100)*largeurCanvas    //marge entre le mur et le debut ou le triangle dela fleche
        var separationParallele  = (1/100)*largeurCanvas //espacement entre les 2 segments paralleles (sur le bord haut et bas du mur)
        var decalageParallele  = (2/100)*largeurCanvas     //ce qui permet l'inclinaison des paralleles
        
        
        var hauteur = hauteurCanvas*(70/100);
        
        var hauteurCote = hauteurCanvas*(15/100);
        var margeMinMAx = hauteurCanvas*(5/100);
        
        var hauteurParallele = decalageParallele*(150/100);     //de combien depasse la parallele au-dessus et au-dessous du bord
        var moitieHauteurFleche = largeurTriangleFleche*(30/100);   //hauteur de la demi-fleche
        
        

        var canvas  = document.querySelector('#canvasMur');
        var context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width, canvas.height);
        
        //coloration des rectangle
        //rectangle du mur
        context.fillStyle = "#AAAAAA";
        context.fillRect(largeurCote, hauteurCote, largeurMurMin, hauteur);
        //rectangle agrandissement du mur
        context.fillStyle = "#CCCCCC";
        context.fillRect(largeurCote+largeurMurMin, hauteurCote, largeurMur-largeurMurMin, hauteur);
        
        //creation limite max et min du mur
        context.lineWidth = 2;
        context.strokeStyle = "black";
        //min
        var x=largeurCote+largeurMurMin;
        var yA=hauteurCote-margeMinMAx;
        var yB=hauteurCote+hauteur+margeMinMAx;
        MODMur.DashedLine(x,yA,x,yB,5,5, context)
        //max
        var x=largeurCote+largeurMurMax;
        var yA=hauteurCote-margeMinMAx;
        var yB=hauteurCote+hauteur+margeMinMAx;
        MODMur.DashedLine(x,yA,x,yB,5,5, context)
        
        
        
        if(largeurCanvas > 270)
        {
            context.font="18px 'Helvetica Neue',Helvetica,Arial,sans-serif";
            //ajout des textes d'environnement
            context.fillStyle = "black";
            context.fillText("Outside", 0, hauteurCote + (20/100)*hauteur);
            context.fillStyle = "black";
            context.fillText("Inside", largeurCote+largeurMurMax+20, hauteurCote + (20/100)*hauteur);
            
            //ajout des textes du mur et isolation
            context.fillStyle = "black";
            context.fillText("Wall", largeurCote+20, hauteurCote + (20/100)*hauteur);
            
            //ajout des textes limites min max
            context.fillStyle = "black";
            context.fillText("min", largeurCote+largeurMurMin-15, yA-5);
            context.fillStyle = "black";
            context.fillText("max", largeurCote+largeurMurMax-15, yA-5);
        }
        
        
        
        
        
        //creation des contours
        context.beginPath();
        context.lineWidth = "2";
        context.strokeStyle = "black";
        //context.strokeRect(100, 60, largeurMur, hauteur);
        
        //traits gauche et droite
        context.moveTo(largeurCote, hauteurCote);
        context.lineTo(largeurCote,hauteurCote+hauteur);
        context.moveTo(largeurCote+largeurMur, hauteurCote);
        context.lineTo(largeurCote+largeurMur, hauteurCote+hauteur);
        
        
        //traits bas
        context.moveTo(largeurCote, hauteurCote+hauteur);
        context.lineTo(largeurCote+(largeurMur/2)-separationParallele,hauteurCote+hauteur);
        
        context.moveTo(largeurCote+(largeurMur/2)-separationParallele-decalageParallele, hauteurCote+hauteur+hauteurParallele);
        context.lineTo(largeurCote+(largeurMur/2)-separationParallele+decalageParallele, hauteurCote+hauteur-hauteurParallele);
        context.moveTo(largeurCote+(largeurMur/2)+separationParallele-decalageParallele, hauteurCote+hauteur+hauteurParallele);
        context.lineTo(largeurCote+(largeurMur/2)+separationParallele+decalageParallele, hauteurCote+hauteur-hauteurParallele);
        
        context.moveTo(largeurCote+(largeurMur/2)+separationParallele, hauteurCote+hauteur);
        context.lineTo(largeurCote+largeurMur,hauteurCote+hauteur);
        
        
        //traits hauts
        context.moveTo(largeurCote, hauteurCote);
        context.lineTo(largeurCote+(largeurMur/2)-separationParallele,hauteurCote);
        
        context.moveTo(largeurCote+(largeurMur/2)-separationParallele-decalageParallele, hauteurCote+hauteurParallele);
        context.lineTo(largeurCote+(largeurMur/2)-separationParallele+decalageParallele, hauteurCote-hauteurParallele);
        
        context.moveTo(largeurCote+(largeurMur/2)+separationParallele-decalageParallele, hauteurCote+hauteurParallele);
        context.lineTo(largeurCote+(largeurMur/2)+separationParallele+decalageParallele, hauteurCote-hauteurParallele);
        
        context.moveTo(largeurCote+(largeurMur/2)+separationParallele, hauteurCote);
        context.lineTo(largeurCote+largeurMur,hauteurCote);
        
        context.stroke();
        
        //la fleche
        context.beginPath();
        context.lineWidth = "3";
        context.strokeStyle = "black";
        context.moveTo(largeurCote-margeFleche, hauteurCote+(hauteur)/2);
        context.lineTo(largeurCote+largeurMurMax+margeFleche,hauteurCote+(hauteur)/2);
        
        context.lineWidth = "1";
        context.moveTo(largeurCote+largeurMurMax+margeFleche+largeurTriangleFleche, hauteurCote+(hauteur)/2);
        context.lineTo(largeurCote+largeurMurMax+margeFleche, hauteurCote+(hauteur)/2+moitieHauteurFleche);
        context.lineTo(largeurCote+largeurMurMax+margeFleche, hauteurCote+(hauteur)/2-moitieHauteurFleche);
        context.fill();
        
        context.stroke();
        
    }, 
    majCanvasHydrique : function(){ //pas encore fonctionnel
        
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
        var dataDiffusivite;
        $.each(parameters,function (i,e){
            if(e.valeur=='c'){
                dataDiffusivite = e ;
            }
        });
        
        //trouver la largeur
        var diffusivite;
        if(variableChoisi==dataDiffusivite) //si la variableChoisi est celle de la largeur , on prend la moyenne
        {
            diffusivite = (Number(dataDiffusivite.max)+Number(dataDiffusivite.min))/2;
        }
        else //sinon la valeur du slider
        {
            diffusivite = $("#range" + dataDiffusivite.valeur).slider('getValue');
        }
        
        //calcul des longueurs
        largeurCanvas = $("#canvasMur")[0].width;
        hauteurCanvas = $("#canvasMur")[0].height; 
        
        var largeurMur = largeurCanvas*60/(100*Number(dataLargeur.max));
       
        var largeurCote  = (20/100)*largeurCanvas //outside et inside
        var largeurTriangleFleche  = (5/100)*largeurCanvas
        var margeFleche  = (5/100)*largeurCanvas    //marge entre le mur et le debut ou le triangle dela fleche
        var separationParallele  = (1/100)*largeurCanvas //espacement entre les 2 segments paralleles (sur le bord haut et bas du mur)
        var decalageParallele  = (2/100)*largeurCanvas     //ce qui permet l'inclinaison des paralleles
        
        
        var hauteur = hauteurCanvas*(70/100);
        
        var hauteurCote = hauteurCanvas*(15/100);
        
        var hauteurParallele = decalageParallele*(150/100);     //de combien depasse la parallele au-dessus et au-dessous du bord
        var moitieHauteurFleche = largeurTriangleFleche*(30/100);   //hauteur de la demi-fleche
        
        
        var canvas  = document.querySelector('#canvasMur');
        var context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width, canvas.height);
        
        //coloration des rectangle
        //rectangle du mur: image des fissures
        var img = new Image();   // Crée un nouvel objet Image
        img.src = 'img/fissures.jpg'; // Définit le chemin vers sa source
        context.drawImage(img,largeurCote,hauteurCote);
       
        
        
        
        if(largeurCanvas > 270)
        {
            context.font="18px 'Helvetica Neue',Helvetica,Arial,sans-serif";
            //ajout des textes d'environnement
            context.fillStyle = "black";
            context.fillText("Outside", 0, hauteurCote + (20/100)*hauteur);
            context.fillStyle = "black";
            context.fillText("Inside", largeurCote+largeurMur+20, hauteurCote + (20/100)*hauteur);
            
            //ajout des textes du mur et isolation
            context.fillStyle = "black";
            context.fillText("Wall", largeurCote+20, hauteurCote + (20/100)*hauteur);
            
        }
        
        
        
        
        
        //creation des contours
        context.beginPath();
        context.lineWidth = "2";
        context.strokeStyle = "black";
        //context.strokeRect(100, 60, largeurMur, hauteur);
        
        //traits gauche et droite
        context.moveTo(largeurCote, hauteurCote);
        context.lineTo(largeurCote,hauteurCote+hauteur);
        context.moveTo(largeurCote+largeurMur, hauteurCote);
        context.lineTo(largeurCote+largeurMur, hauteurCote+hauteur);
        
        
        //traits bas
        context.moveTo(largeurCote, hauteurCote+hauteur);
        context.lineTo(largeurCote+(largeurMur/2)-separationParallele,hauteurCote+hauteur);
        
        context.moveTo(largeurCote+(largeurMur/2)-separationParallele-decalageParallele, hauteurCote+hauteur+hauteurParallele);
        context.lineTo(largeurCote+(largeurMur/2)-separationParallele+decalageParallele, hauteurCote+hauteur-hauteurParallele);
        context.moveTo(largeurCote+(largeurMur/2)+separationParallele-decalageParallele, hauteurCote+hauteur+hauteurParallele);
        context.lineTo(largeurCote+(largeurMur/2)+separationParallele+decalageParallele, hauteurCote+hauteur-hauteurParallele);
        
        context.moveTo(largeurCote+(largeurMur/2)+separationParallele, hauteurCote+hauteur);
        context.lineTo(largeurCote+largeurMur,hauteurCote+hauteur);
        
        
        //traits hauts
        context.moveTo(largeurCote, hauteurCote);
        context.lineTo(largeurCote+(largeurMur/2)-separationParallele,hauteurCote);
        
        context.moveTo(largeurCote+(largeurMur/2)-separationParallele-decalageParallele, hauteurCote+hauteurParallele);
        context.lineTo(largeurCote+(largeurMur/2)-separationParallele+decalageParallele, hauteurCote-hauteurParallele);
        
        context.moveTo(largeurCote+(largeurMur/2)+separationParallele-decalageParallele, hauteurCote+hauteurParallele);
        context.lineTo(largeurCote+(largeurMur/2)+separationParallele+decalageParallele, hauteurCote-hauteurParallele);
        
        context.moveTo(largeurCote+(largeurMur/2)+separationParallele, hauteurCote);
        context.lineTo(largeurCote+largeurMur,hauteurCote);
        
        context.stroke();
        
        //la fleche
        context.beginPath();
        context.lineWidth = "3";
        context.strokeStyle = "black";
        context.moveTo(largeurCote-margeFleche, hauteurCote+(hauteur)/2);
        context.lineTo(largeurCote+largeurMur+margeFleche,hauteurCote+(hauteur)/2);
        
        context.lineWidth = "1";
        context.moveTo(largeurCote+largeurMur+margeFleche+largeurTriangleFleche, hauteurCote+(hauteur)/2);
        context.lineTo(largeurCote+largeurMur+margeFleche, hauteurCote+(hauteur)/2+moitieHauteurFleche);
        context.lineTo(largeurCote+largeurMur+margeFleche, hauteurCote+(hauteur)/2-moitieHauteurFleche);
        context.fill();
        
        context.stroke();
        
    }
    
};