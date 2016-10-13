app.factory("vraagService",function($http,$interval,$rootScope){
    
  
    
    var obj = {
       
        //Data die de controllers nodig hebben
        currentLesId:"",
        currentVraagId:"",
        
        StopInterval:function(interval){
            console.log("STOP de interval TTTT");
            $interval.cancel(interval);
        },
        
              
        IsVraagBeschikbaar: function(lesId,code, currentVraagNr){
           // console.log("start interval: Is Vraag Beschikbaar?");
            
             return $interval(function(){
                
               //  console.log("Is vraag beschikbaar")
                 $http.post("lessen/IsVraagBeschikbaar",{"lesId":lesId,"code":code})
                     
                     .then(function(data){  
                        console.log(data)
                
                     if(data.data.error != null){
                         console.log(data.data.error); //Er is geen les actief!!                        
                         //$rootScope.$broadcast('error:',data.data.error);
                     }
                   //  console.log("return from server");
                     
                     if(data.data.vraag !=null){
                     
                        
                        var obj = data.data.vraag[0];
                         //console.log(obj);
                         if(obj.TypeId == 3){
                             obj.bijvragen = data.data.bijvragen;
                             //Ook bijvragen versturen                            
                         }
                        
                         if(obj.nr != -1){
                            currentlesId = 0; //TODO: juiste lesID
                            currentVraagId = obj.VraagNummer;
                            CanNextVraag = true;
                            $rootScope.$broadcast('IsVraagBeschikbaar:',obj);
                        }
                        else{    
                            currentlesId = 999;
                            CanNextVraag = false;
                            $rootScope.$broadcast('IsVraagBeschikbaar:',null);
                        }
                     }
                     else{
                         currentlesId = 999;
                          CanNextVraag = false;
                            $rootScope.$broadcast('IsVraagBeschikbaar:',null);
                     }
                     
                     
                  
                 });
                 
            },1500);
        },
        
        CanNextVraag:false,
        
        //TODO parameter moet lesCode worden ipv lesId
        GetCurrentVraagBeschikbaar:function(lesId){
            console.log("get beschikbare vraag");
            return $http.post("lessen/GetVraagVanLesBeschikbaar",{"lesId":lesId})
        },
        
        VerstuurAntwoord:function(lesId,vraagId, antwoord){
            return $http.post("lessen/SaveAntwoord",{"lesId":lesId, "vraagId":vraagId, "antwoord":antwoord});
        },
        
        GetBijvragen:function(vraagId){
            console.log("Multi vraag, daarom get bijvragen");
            return $http.post("lessen/getbijvraagvanvraag",{"Id":vraagId});
        }
        
        
    };

    return obj;
});