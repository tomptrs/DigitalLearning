app.controller('LeerlingTestCtrl', function ($scope,$interval,vraagService) {
    $scope.message = 'leerling!';
    
    var teller= 0;
    
    var init = function(){
       // vraagService.IsVraagBeschikbaar();
    }
        
    init();
});