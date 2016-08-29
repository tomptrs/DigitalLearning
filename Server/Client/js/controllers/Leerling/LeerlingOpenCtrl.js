app.controller('LeerlingOpenCtrl', function ($scope,vraagService) {
    
    $scope.antwoord = "";
    
    $scope.Verstuur = function(){
       // if(currentVraag.vraagId != null)
        console.log("verstuur antwoord :" + vraagService.currentVraagId);
        console.log(vraagService.currentLesId + " " + vraagService.currentVraagId)
        //PROBLEEM: weet de huidige les en vraag niet!!
            vraagService.VerstuurAntwoord(vraagService.currentLesId,vraagService.currentVraagId,$scope.antwoord);
    }
    
    var init = function(){
        console.log("Toon OPEN vraag");
        console.log("vraagService.currentVraagId");
    }
        
    init();
});