app.controller('registerController', function ($scope,vraagService,$http, authService,$window,commonService) {
    
    
    var init = function(){
     console.log("register controller");
    };
    
    
    
    $scope.register = function(){
        authService.register($scope.email,$scope.voornaam,$scope.achternaam,$scope.paswoord);
        
        
    };
    
    
    init();
});