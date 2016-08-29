app.controller('registerController', function ($scope,vraagService,$http, authService,$window,commonService) {
    
    
    var init = function(){
     console.log("register controller");
    };
    
    
    
    $scope.register = function(){
        console.log($scope.email + " " + $scope.paswoord);
        authService.register($scope.email,$scope.voornaam,$scope.achternaam,$scope.paswoord);
        
        
    };
    
    
    init();
});