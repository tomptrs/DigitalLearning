app.factory("authService",function($http,$interval,$rootScope,$timeout,commonServiceLeerling){
    
  
    
    var obj = {
       
        //OLD TEST FUNCTION
            login: function(username,password,callback){
                
                 $timeout(function(){
                var response = { success: username === 'test' && password === 'test' };
                if(!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);
            }, 
        
        //login leraar
        login2:function(mail,pwd,callback){
            $http.post("gebruikers/InlogLeraar",{"email":mail, "password":pwd})                     
                     .then(function(data){ 
                      callback(data);
                       //console.log(data);
                        
                 });
        },
        
        //Save Leerling data locally
        loginLeerling:function(user,code,callback){
            
             $http.post("gebruikers/InlogLeerling",{"code":code})                     
                     .then(function(data){ 
                 
                        console.log(data);
                        commonServiceLeerling.User.code = code;
                 console.log(code);
                        commonServiceLeerling.User.name = user;
                        commonServiceLeerling.User.lesId = data.data.les[0].Id;
                    
                        callback(commonServiceLeerling.User);
     
                 
                 });
        
        },
        
        register:function(email,voornaam,achternaam,pwd){
        
             $http.post('gebruikers/signup', {
                      email: email,
                      paswoord: pwd,
                      voornaam: voornaam,
                      achternaam: achternaam
                  })
                  .success(function(data) {
                      console.log(data);
                  });
        }
        
    };

    return obj;
});