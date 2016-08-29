app.controller('LeerlingTekenCtrl', function ($scope,lesService,vraagService) {
    
    $scope.antwoord = "";
    $scope.sizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    $scope.size = 5;
 
    $scope.Verstuur = function(){
       // if(currentVraag.vraagId != null)
      //  console.log("verstuur antwoord :" + vraagService.currentVraagId);
     //   console.log(vraagService.currentLesId + " " + vraagService.currentVraagId)
        
        //Klopt Vraag en Les???
     //   vraagService.VerstuurAntwoord(vraagService.currentLesId,vraagService.currentVraagId,$scope.antwoord);
    };
    
    
    $scope.SavePicture = function(){
        console.log("saving picture");
        var canvas = document.getElementById('colors_sketch');
        var AnswerImageString = canvas.toDataURL() ;//+ "image/jpeg";
        console.log(AnswerImageString); 
        
        canvas.toBlob(function(blob) {
            
  var newImg = document.createElement("img"),
      url = URL.createObjectURL(blob);
            console.log("blob");
            console.log(blob);
             lesService.addAfbeelding(vraagService.currentLesId, vraagService.currentVraagId, blob);

  newImg.onload = function() {
     //no longer need to read the blob so it's revoked
    URL.revokeObjectURL(url);
  };

  newImg.src = url;
  document.body.appendChild(newImg);
        }, 0.95);//, "image/jpeg"
        
        //Send to mysql database!!
       
    };
    
     $scope.BewaarPicture = function () {
           console.log("try to save the pic");
            var canvas = document.getElementById('colors_sketch');
            var AnswerImageString = canvas.toDataURL() ;//+ "image/jpeg";
         console.log(AnswerImageString);
            //uploadAnswer(tmpanswer);
           //var randNr = Math.round(Math.random()*1000);
       //  console.log(randNr);

                  //DOE EEN POST NAAR NODEJS!
         //console.log("lesId" + vraagService.currentLesId + " l" vraagService.currentLesId)
         var promise = lesService.BewaarAfbeelding(vraagService.currentLesId,vraagService.currentVraagId,AnswerImageString);

         //TODO : promise succes opvangen en canvas clearen!
         
/*         $http
            .post('/addDrawing',{
                img:AnswerImageString,
                vraagId:vraagService.currentVraagId,                
                lesId:vraagService.currentLesId
        })
            .success(function(data) {
                //$scope.antwoord =null;
             console.log("image saved..");
                
             //Clear the canvas nadat de afbeelding succesvol is bewaard
                $scope.ClearCanvas();
            });
            */
         
         

};
    
    
    /* Stap5: Scope functions
    -------------------------
    */

    $scope.ClearCanvas = function () {
        var tmp = $('#colors_sketch').sketch();//.prototype.clearPainting();
        tmp.actions = [];
        tmp.redraw();
        
        console.log("cleared Canvas");        
    };
    
    $scope.resize = function () {
        var tmp = $('#colors_sketch').sketch();//.prototype.clearPainting();
        tmp.size=$scope.size;
    };
    
    var init = function(){
        console.log("Toon Teken vraag");
        console.log("vraagService.currentVraagId");
        
        
         jQuery( document ).ready(function( $ ) {
             console.log("start sketch")
            $('#colors_sketch').sketch();
        });
    };
        
    init();
});