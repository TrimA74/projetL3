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
  return self;
})();









