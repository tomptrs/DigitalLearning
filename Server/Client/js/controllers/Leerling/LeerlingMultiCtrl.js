app.controller('LeerlingMultiCtrl', function ($scope,vraagService) {
    
    $scope.antwoord = "";
    
    $scope.Verstuur = function(){
       
       // if(currentVraag.vraagId != null)
        console.log("verstuur antwoord :" + vraagService.currentVraagId);
        console.log(vraagService.currentLesId + " " + vraagService.currentVraagId)
       
            vraagService.VerstuurAntwoord(vraagService.currentLesId,vraagService.currentVraagId,$scope.antwoord);
     //   alert("Antwoord verzonden");
    };
    
     $scope.dialogClose = function(){
        $scope.verstuurd = true;
    }
    
    var init = function(){
        console.log("INIT Multi vraag");
        console.log("vraagService.currentVraagId");
         $scope.verstuurd = false;
    }
    
    
   $scope.toggleSelection = function(item){
      $scope.antwoord = item;
     
    };
        
    init();
});