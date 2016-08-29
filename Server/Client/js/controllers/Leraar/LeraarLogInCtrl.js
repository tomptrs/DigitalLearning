app.controller('LeraarLogInCtrl', function ($scope,vraagService,$http, authService,$window,commonService) {
    
    $scope.login=function(){
        authService.login2($scope.email,$scope.paswoord,authResult);
       // AuthenticationService.Login("tom","tom",authResult);
         /*$http
                .post('/gebruikers/InlogLeraar', {
                    email: "tom",
                    password: "tom"
                })
                .success(function(data) {
                    console.log(data);
                });*/
        };
    
    
    $scope.register = function(){
        // $window.location.href = '/#'+
        //Go to register window
    };
    
    var authResult = function(response){       
        
        //Navigate to leraardashboard if login is succes        
        
        //Save Gebruiker die ingelogd is
        if(response.data.data != null){
            commonService.User.email = response.data.data[0].Email;
            commonService.User.id = response.data.data[0].Id;
            
        }
        
        //Navigeer naar juiste lokatie
         $window.location.href = '/#'+ response.data.redirect;
        
        
    };
   
    
    var init = function(){
        console.log("Leraar Login");        
       
        
    }
        
    init();
});