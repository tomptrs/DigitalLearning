app.controller('loginController', function ($scope,$location,userService) {
    
    
     var templates =
          [     { name: 'leraar', url: 'Pages/LoginLeraar.html'},
                { name: 'leerling', url: 'Pages/LoginLeerling.html'},
                { name: 'registreer', url: 'Pages/register.html'}
          ];
    
    
    $scope.Login = function(){
      
         var promise = userService.Login($scope.gebruikersNaam,$scope.paswoord);
         promise.then(function(data){
             console.log(data);
             if(data){
                 //navigate to app
                 auth.setUser(data);
                 
                 console.log("navigate");
                 $location.path("about");
             }
         });
       
    };
    
    $scope.leraar = function(){
        console.log("Leraar wil inloggen");
         $scope.template = templates[0];   
    };
    
    $scope.leerling = function(){
        console.log("leerling wil inloggen");
         $scope.template = templates[1];   
    };
    
      $scope.register = function(){
        console.log("register");
         $scope.template = templates[2];   
    };
    
    var init = function(){
        console.log("Login");
    };
    
    
    init();
});