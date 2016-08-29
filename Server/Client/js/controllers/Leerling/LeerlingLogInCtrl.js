app.controller('LeerlingLogInCtrl', function ($scope,vraagService, authService,$window,commonServiceLeerling) {
    
       $scope.login=function(){
           
            authService.loginLeerling($scope.naam,$scope.code,authResult);      
        };
    
    var authResult = function(response){       
         //Navigate to showVragen if login is succes        
            console.log(response);
        
            if( commonServiceLeerling.User.code != ""){
                
                console.log(commonServiceLeerling.User);
                
               $window.location.href = '/#/leerlingShowVraag';
        }
        
    };
   
   
    
    var init = function(){
        console.log("Leerling Login");
       
    }
        
    init();
});