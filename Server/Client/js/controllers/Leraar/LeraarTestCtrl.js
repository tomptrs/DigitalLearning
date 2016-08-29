app.controller('LeraarTestCtrl', function ($scope,$interval,vraagService) {
    $scope.message = 'Leraar!';
    
    var teller= 0;
    
    //gaat automatisch elke 3 seconden tellen
    /*
    $interval(function(){
        teller++;
        console.log(vraagService.IsVraagBeschikbaar());
        console.log(teller);
        
    },3000);*/
    var promise;
    
    var init = function(){
        promise = vraagService.IsVraagBeschikbaar();       
    };
    
    
    $scope.StopInterval = function(){
       
        vraagService.StopInterval(promise);
        //$interval.cancel(promise);
    };
    
    
    
    init();
});