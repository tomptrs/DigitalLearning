app.controller('LeerlingOpenCtrl', function ($scope,vraagService) {
    
    $scope.antwoord = "";
    
    $scope.Verstuur = function(){
       // if(currentVraag.vraagId != null)
        console.log("verstuur antwoord :" + vraagService.currentVraagId);
        console.log(vraagService.currentLesId + " " + vraagService.currentVraagId)
        //PROBLEEM: weet de huidige les en vraag niet!!
            vraagService.VerstuurAntwoord(vraagService.currentLesId,vraagService.currentVraagId,$scope.antwoord);
       
    }
    
    $scope.dialogClose = function(){
        $scope.verstuurd = true;
    }
    
    var init = function(){
        console.log("INIT OPEN vraag");
        console.log("vraagService.currentVraagId");
        $scope.verstuurd = false;
    }
        
    init();
});