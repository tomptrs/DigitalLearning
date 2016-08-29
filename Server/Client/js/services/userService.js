app.factory("userService",function($http){
    var obj = {
        
        Login: function(username,pwd){
            return $http.post("gebruikers/post",
                       {"gebruikersnaam":username,
                        "paswoord":pwd
                        });
        }
    };

    return obj;
});