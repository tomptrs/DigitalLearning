app.controller('LeerlingCloudCtrl', function ($scope,vraagService) {
    
    $scope.antwoord = "";
    
    $scope.Verstuur = function(){
       // if(currentVraag.vraagId != null)
        console.log("verstuur antwoord :" + vraagService.currentVraagId);
        console.log(vraagService.currentLesId + " " + vraagService.currentVraagId)
        
        //Klopt Vraag en Les???
        vraagService.VerstuurAntwoord(vraagService.currentLesId,vraagService.currentVraagId,$scope.antwoord);
        $scope.verstuurd = true;
    }
    
    $scope.dialogClose = function(){
        $scope.verstuurd = true;
    }
    
    var init = function(){
        console.log("INIT Cloud vraag");
        console.log("vraagService.currentVraagId");
        $scope.verstuurd = false;
    }
        
    init();
});