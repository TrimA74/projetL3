var MODMur = (function () {
  var self = {};

  //fonction utilisé pour les pointillés
  function Norm(xA,yA,xB,yB) {
      return Math.sqrt(Math.pow(xB-xA,2)+Math.pow(yB-yA,2));
  }

  //faire une ligne en pointillés
  self.DashedLine = function (xA,yA,xB,yB,L,l, ctx) {
    Nhatch=Norm(xA,yA,xB,yB)/(L+l);
    x1=xA;y1=yA;
    for (i=0;i < Nhatch; i++) {
    newXY=Hatch(xA,yA,xB,yB,x1,y1,L);
    x2=newXY[0];y2=newXY[1];
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    newXY=Hatch(xA,yA,xB,yB,x2,y2,l);
    x1=newXY[0];
    y1=newXY[1];
    }
  }
  //fonction utilisé pour les pointillés
  function Hatch (xA,yA,xB,yB,x1,y1,l) {
      if(xB-xA!=0)//si la droite n'est pas verticale
      {
          a=(yB-yA)/(xB-xA);b=yA-a*xA;// Equation reduite y=ax+b de (AB): 
          if ((xB-xA)>0) {sgn=1;} else {sgn=-1;}
          x2=sgn*l/Math.sqrt(1+a*a)+x1;
          y2=a*x2+b;
          if (Norm(x1,y1,x2,y2)>Norm(x1,y1,xB,yB)) {x2=xB;y2=yB;}
      }else//droite verticale
      {
          if ((yB-yA)>0) {sgn=1;} else {sgn=-1;}
          x2=xA;
          y2= y1+(l/sgn);
      }
      return [x2,y2];
  }
  //crée l'élement canvas dans l'HTML
  self.creeCanvas = function (){
    var largeurCanvas = $("#dessinMur")[0].clientWidth*90/100;
    var hauteurCanvas = largeurCanvas;
    $("#dessinMur").append('<canvas id="canvasMur" width="'+largeurCanvas+'" height="'+hauteurCanvas+'"><p>Désolé, votre navigateur ne supporte pas Canvas. Mettez-vous à jour</p></canvas>');
  }
  
  
    self.afficheMurHydrique = function(largeurCanvas, img, ratioDiffusivite){
        
        
        var largeurMur = largeurCanvas*60/100;
        
        var rapportHauteurImg = img.height/img.width;
        var hauteur = rapportHauteurImg * largeurMur;
        
        var largeurCote  = (20/100)*largeurCanvas //outside et inside
        var largeurTriangleFleche  = (5/100)*largeurCanvas
        var margeFleche  = (5/100)*largeurCanvas    //marge entre le mur et le debut ou le triangle dela fleche
        var separationParallele  = (1/100)*largeurCanvas //espacement entre les 2 segments paralleles (sur le bord haut et bas du mur)
        var decalageParallele  = (2/100)*largeurCanvas     //ce qui permet l'inclinaison des paralleles
        
        var hauteurCote = hauteurCanvas*(15/100);
        
        var hauteurParallele = decalageParallele*(150/100);     //de combien depasse la parallele au-dessus et au-dessous du bord
        var moitieHauteurFleche = largeurTriangleFleche*(30/100);   //hauteur de la demi-fleche
        
        largeurACouperMin = largeurMur*60/100;
        
        var largeurACouper = largeurACouperMin + ratioDiffusivite * (largeurMur-largeurACouperMin);
        var hauteurACouper = rapportHauteurImg * largeurACouper;
        
        
        var canvas  = document.querySelector('#canvasMur');
        var context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width, canvas.height);
        
        //coloration des rectangle
        //rectangle du mur: image des fissures
        
        //context.drawImage(img,largeurCote,hauteurCote, largeurMur, hauteur);
        context.drawImage(img,0,0,largeurACouper,hauteurACouper,largeurCote,hauteurCote, largeurMur, hauteur);
       
        
        
        
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
        context.lineWidth = "5";
        context.strokeStyle = "black";
        //traits gauche et droite
        context.moveTo(largeurCote, hauteurCote);
        context.lineTo(largeurCote,hauteurCote+hauteur);
        context.moveTo(largeurCote+largeurMur, hauteurCote);
        context.lineTo(largeurCote+largeurMur, hauteurCote+hauteur);

        context.stroke();
        
        
        
        context.beginPath();
        context.lineWidth = "2";
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
    
    return self;
  
})();









