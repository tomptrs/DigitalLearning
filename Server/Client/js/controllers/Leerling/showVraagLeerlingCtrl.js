app.controller('showVraagLeerlingCtrl', function ($scope,$interval,vraagService,commonServiceLeerling,$window) {
    $scope.message = 'leerling!';
    $scope.vraag = "";
    $scope.CanNotNextVraag  = false;
    $scope.open = false;
    $scope.vraagObject= null;
    
    var hebbijvragen = false;
    var teller= 0;
    var currentLes = null;
    var currentVraag = null;
    var promise;
    
    //TODO: update templates!
     var templates =
          [     { name: 'wait', url: 'Pages/Leerling/LeerlingWait.html'},  //0
                { name: 'open', url: 'Pages/Leerling/LeerlingOpen.html'},   //1
                { name: 'cloud', url: 'Pages/Leerling/LeerlingCloud.html'}, //2
                { name: 'teken', url: 'Pages/Leerling/LeerlingTeken.html'}, //3
                { name: 'multi', url: 'Pages/Leerling/LeerlingMulti.html'}, //4
          
           
          ];
    
    
    var init = function(){        
        //TODO : get currentLes        
       //Get current vraag = vraag die beschikbaar is!, stuur code mee door
        promise = vraagService.IsVraagBeschikbaar(commonServiceLeerling.User.lesId,commonServiceLeerling.User.code); 
      
        //vraagService.IsVraagBeschikbaar(commonServiceLeerling.User.lesId,commonServiceLeerling.User.code); 
        
    }
    
    $scope.logout = function(){
       //Stop Polling
       //Eerst Refresh doen!
        
       vraagService.StopInterval(promise);
       $window.location.reload();
        $window.location.href = '/#/login';
        
    };
    
    $scope.$on("error:",function(event,data){
       // console.log("IN ERROR");
        
        vraagService.StopInterval(promise); //STOP INTERVAL
         $window.location.reload();
         $window.location.href = '/#/login';
    });
    
    $scope.$on('IsVraagBeschikbaar:', function(event,data) {
     
      //  console.log("is vraag beschikbaar??tp");
       // console.log(data);
        if(data != null){
            
           // console.log("vergelijk vraagnummers");
        //    console.log("vorige " + vraagService.currentVraagId + "nieuwe " + data.VraagNummer  )
           
            //nu werkt onbeschikbaar terug beschikbaar maken niet meer!!
            
        //    console.log("CHECK VRAAGOBJECT");
        //    console.log($scope.vraagObject);
            //if(vraagService.currentVraagId != data.VraagNummer)  //if lus is nodig anders wordt de watch altijd aangeroepen
            //{   
            //    console.log(data);
               if($scope.vraagObject == null ||  data.Id != $scope.vraagObject.Id)
                   {
            $scope.vraagObject = data;
            $scope.vraag = data.Stelling; //HIERDOOR KOM IK IN DE WATCH
             
            
            vraagService.currentVraagId = data.VraagNummer;
            
            vraagService.currentLesId = data.LesId; //TODO: DYNAMISCH MAKEN!!
           
                
                if(data.TypeId == 3) //multi vraag
                    {
                     //   console.log("BIJVRAGEN");
                    //    console.log(data);
                        
                        if(!hebbijvragen){
                        //GetBijvragen! 
                        var promiseExtra = vraagService.GetBijvragen(data.Id);
                        promiseExtra.then(function(data){
                          //  console.log("Heb ik de bijvragen??")
                            $scope.bijvragen = data.data.vraag;
                         //   console.log(data.data.vraag);
                            
                            for(var i =0;i<$scope.bijvragen.length; i++)
                                $scope.bijvragen[i].selectedStuff = false;
                            
                            hebbijvragen = true;
                        });
                        } //end hebbijvragen
                        
                    }
                        
                    }
            
        }
        else{
            hebbijvragen = false;
          // console.log("TODO: Waarom duurt het wat langer voor template[0] = wachten te tonen??")
            $scope.vraag = "";
            $scope.template = templates[0]; 
        }
   });
    
    $scope.$watch("vraag", function(waarde)
    {
     //   console.log("WATCH");
     //   console.log($scope.vraag)
     //   console.log(waarde);
       
        if($scope.vraag !=null){
            
       //     console.log("ik zit in verschillend van null");
        //    console.log($scope.vraag); // eerste maal krijg je een foutmelding..
       
    
           // if($scope.vraagObject != null)
            // if($scope.vraagObject == null ||  data.Id != $scope.vraagObject.Id)
              //  {
            
            
            //    console.log("En het type is: " + $scope.vraagObject.TypeId);
        
                if($scope.vraagObject.TypeId == 2){ //cloud
                    $scope.template = templates[2];            
                }
                else if($scope.vraagObject.TypeId == 1){ //OPEN
                    $scope.template = templates[1];  
                }
                else if($scope.vraagObject.TypeId == 4){ //TEKEN
                    $scope.template = templates[3];  
                }
                else if($scope.vraagObject.TypeId == 3){ //Multi
                    $scope.template = templates[4]; 
                    
                    //Moet ik ook bijvragen tonen!
                }
                else{
                    $scope.template = templates[0];
                }
            //    console.log("de getoonde template= ");
            //    console.log($scope.template);
         //   }
            
            
        }       //END != null
        else{
            if($scope.vraagObject!= null)
                $scope.vraagObject.Id = 99999;
            $scope.template = templates[0]; 
            $scope.vraag = "Wacht op volgende vraag";
        }
      
        
        
    });
    
    $scope.StopInterval = function()
    {
      //  console.log("stop");
        vraagService.StopInterval(promise);
    }
        
    init();
});