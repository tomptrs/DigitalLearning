app.factory("lesService",function($http,$interval,$rootScope){
    var obj = {
        
        GetAlleLessen: function(userId){
            
             return $http.post("lessen/GetAlleLessen",{"userId":userId});
        },
        
        StartLes:function(id){
            return $http.post("lessen/StartLes",{"id":id});
        },
        
        GetVraagVanLes:function(lesId,vraagId){
            return $http.post("lessen/GetVraagVanLes",{"id":lesId, "vraagId":vraagId});
        },

         GetAllelVragenVanLes:function(lesId){
            return $http.post("lessen/GetVragenVanLes",{"id":lesId});
        },
        
        VragenCurrentLes:[],
        
        CurrentLes:0,
        
        MaakVraagBeschikbaar:function(lesId,vraagId){
            return $http.post("lessen/MaakVraagBeschikbaar",{"id":lesId, "vraagId":vraagId});
        },
        
            //TESTING
         MaakVraagOnBeschikbaar:function(lesId,vraagId){
            return $http.post("lessen/MaakVraagOnBeschikbaar",{"id":lesId, "vraagId":vraagId});
        },
        
        MaakVraagInActief:function(lesId,vraagId){
            return $http.post("lessen/MaakVraagOnBeschikbaar",{"id":lesId, "vraagId":vraagId});
        },
        
        StopLes:function(lesId){
            lesId
             return $http.post("lessen/StopLes",{"lesId":lesId});
            
        },
        
        GetAntwoorden : function(lesId,vraagId){
            //Start POLLING VOOR ANTWOORDEN
             return $interval(function(){
                
                 $http.post("lessen/GetAntwoorden",{"lesId":lesId, "vraagnr":vraagId})
                     
                     .then(function(data){ 
                       // console.log("ANTWOORDEN");
                        //console.log(data.data);
                        var obj = data.data;
                        $rootScope.$broadcast('GetAntwoorden:',obj);
                        
                 });
                 
            },4000);
        },
        
         StopInterval:function(interval){
            
            $interval.cancel(interval);
        },
        
        //Voeg nieuwe les toe en navigeer naar add vragen
        addLes:function(lesNaam,code,userid){
            
              return $http.post("lessen/addLes",{"lesNaam":lesNaam, "code":code,"userId":userid});                     
                    
        },
        
        addVraag:function(lesId,vraagObj){
            console.log("WIE VRAAGT EEN ADD AAN ?????");
            return $http.post("lessen/addVraag",{"lesId":lesId, "vraag":vraagObj});
        },
        
        updateVraag:function(lesId,vraagObj){
            
            return $http.post("lessen/updateVraag",{"lesId":lesId, "vraag":vraagObj});
        },
        
      /*  addAfbeelding:function(lesId,vraagId, afb){
            
            return $http.post("lessen/SaveTekeningBijVraag",{"lesId":lesId,"vraagId":vraagId, "afb":afb});
        },*/
        
        BewaarAfbeelding:function(lesId,vraagId,afb){
            
            return $http.post("lessen/addDrawing",{"lesId":lesId,"vraagId":vraagId, "afb":afb});
        },
        
        RemoveLes:function(lesId){
            return $http.post("lessen/removeLes",{"lesId":lesId});
        },
        
        GetBijVraagVanVraag:function(vraagId){
            return $http.post("lessen/getbijvraagvanvraag",{"vraagId":vraagId});
        },
        
        GetAantalVragenVanLes:function(lesId){
             return $http.post("lessen/GetAantalVragenVanLes",{"id":lesId}) ;
        },
        ToonAantalAntwoorden:function(lesId,vraagId){
             //Start POLLING VOOR ANTWOORDEN
             return $interval(function(){
                
                 $http.post("lessen/ToonAantalAntwoorden",{"lesId":lesId, "vraagnr":vraagId})
                     
                     .then(function(data){                      
                        var obj = data.data;
                        $rootScope.$broadcast('ToonAantalAntwoorden',obj);                        
                 });
                 
            },2000);
        }
        
       
    };

    return obj;
});