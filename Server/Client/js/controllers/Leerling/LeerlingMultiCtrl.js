app.controller('LeerlingMultiCtrl', function ($scope,vraagService) {
    
    $scope.antwoord = "";
    
    $scope.Verstuur = function(){
       
       // if(currentVraag.vraagId != null)
        console.log("verstuur antwoord :" + vraagService.currentVraagId);
        console.log(vraagService.currentLesId + " " + vraagService.currentVraagId)
       
            vraagService.VerstuurAntwoord(vraagService.currentLesId,vraagService.currentVraagId,$scope.antwoord);
        alert("Antwoord verzonden");
    };
    
    
    
    var init = function(){
        console.log("Toon Multi vraag");
        console.log("vraagService.currentVraagId");
    }
    
    
   $scope.toggleSelection = function(item){
      $scope.antwoord = item;
       $scope.Verstuur();
    };
        
    init();
});