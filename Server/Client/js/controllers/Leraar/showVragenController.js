app.controller('showVragenController', function ($scope,$interval,$window,lesService,vraagService,commonService) {
    
    $scope.message = 'show les!';
    $scope.vragen = [];
    $scope.vraag = null;
    $scope.stelling="";
    $scope.CanNotNext = true; //Variable to enable/disable next button
    $scope.vraagNummer = 1;
    $scope.antwoorden = [];
    $scope.words = [];
    $scope.activeLesCode = commonService.ActiveLes.code;
    $scope.bijvragen=[];
    var currentType="";
    $scope.aantalVragen = 0;
    $scope.multiple = [];
    var templates =
          [     { name: 'open', url: 'Pages/Leraar/LeraarOpen.html'},
                { name: 'cloud', url: 'Pages/Leraar/LeraarCloud.html'},    
                { name: 'teken', url: 'Pages/Leraar/LeraarTeken.html'},    
                { name: 'multi', url: 'Pages/Leraar/LeraarMulti.html'},    
          ];
    
   var promiseAntwoorden; //promise for polling antwoorden
    var promiseAantalAntwoorden;
    $scope.aantalAntwoorden = 0;
    
    $scope.VolgendeVraag = function(){
        
        /*
        Eerst vorige vraag deactiveren!
        */
        //Volgende vraag oproepen
        GoToAnotherQuestion();

        $scope.DeActivateVraag($scope.vraagNummer);
        
        if($scope.vraagNummer < $scope.aantalVragen)
            $scope.vraagNummer++;
        else{
            alert("Dit was de laatste vraag!");
        }
        GetVraag();   
        
    };
    
    $scope.VorigeVraag = function(){
        
        GoToAnotherQuestion();
        
        $scope.DeActivateVraag($scope.vraagNummer);
        
        $scope.vraagNummer--;
        if($scope.vraagNummer < 1)
            $scope.vraagNummer = 1;
        GetVraag();
    };
    
    $scope.DeActivateVraag =function(vraagnr){
        //GoToAnotherQuestion();
        
        var promise = lesService.MaakVraagOnBeschikbaar(commonService.ActiveLes.id,vraagnr);
        promise.then(function(data){
            console.log("heb vraag Inactief gemaakt");           
        });
    }
    
    $scope.MaakVraagBeschikbaar = function(){
        console.log($scope.vraagNummer);
        var promise = lesService.MaakVraagBeschikbaar(commonService.ActiveLes.id,commonService.ActiveVraag.vraagnummer);
        promise.then(function(data){
            console.log("heb vraag beschikbaar gemaakt");           
             $scope.vraag = data.data.vraag[0];
            $scope.stelling = data.data.vraag[0].Stelling;
           
        });
        
         promiseAantalAntwoorden = lesService.ToonAantalAntwoorden(commonService.ActiveLes.id ,$scope.vraagNummer);
    };
    
    $scope.MaakVraagOnBeschikbaar= function(){
       GoToAnotherQuestion();
      var promise = lesService.MaakVraagOnBeschikbaar(commonService.ActiveLes.id,commonService.ActiveVraag.vraagnummer);
        promise.then(function(data){
            console.log("heb vraag onbeschikbaar gemaakt");
             $scope.vraag = data.data.vraag[0];
            $scope.stelling = data.data.vraag[0].Stelling;
        });
    };
    
    function GoToAnotherQuestion(){
         lesService.StopInterval(promiseAantalAntwoorden);
        lesService.StopInterval(promiseAntwoorden);
          $scope.antwoorden = [];
        $scope.aantalAntwoorden = 0;
    }
    
    /*
    Navigeer naar dashboard, maar vragen inactief en verwijder alle antwoorden
    */
    $scope.StopLes = function(){
         $scope.MaakVraagOnBeschikbaar();
        lesService.StopInterval(promiseAantalAntwoorden);
         var promise = lesService.StopLes(commonService.ActiveLes.id);
        promise.then(function(data){
           
            /*
            navigate naar lesdashboard
            */
            
              $window.location.href = '/#/lesdashboard';  
            
        });
    };
    
    
    GetVraag = function(){
        
         console.log("GET VRAAG");
         var promise = lesService.GetVraagVanLes(commonService.ActiveLes.id,$scope.vraagNummer);
        promise.then(function(data){
           
            /*
            Afhankelijk van het type vraag moeten de antwoorden op een bepaalde manier getoond worden
            */
            
            console.log("Get Vraag !!!");
            console.log(data);
            commonService.ActiveVraag.vraagnummer = data.data.vraag[0].VraagNummer;
            $scope.vraag = data.data;
            $scope.stelling = data.data.vraag[0].Stelling;
            currentType = data.data.vraag[0].TypeId;
            
            if(data.data.vraag[0].TypeId == 1){ //open
                 console.log("een open vraag");
                $scope.template = templates[0]; 
                
            }
            if(data.data.vraag[0].TypeId == 2){ //cloud
                 console.log("een cloud vraag");
                $scope.template = templates[1]; 
                
            }
             if(data.data.vraag[0].TypeId == 3){ //multi
                 console.log("een multi vraag");
                $scope.template = templates[3]; 
                  console.log("clear graph");
                
               
                 
                 //ER LOOPT IETS MIS MET DE BIJVRAGEN!!
                 //Get de bijvragen!!
                // console.log(data.data.vraag[0].Id);
               //  var vraagId = data.data.vraag[0].Id
               $scope.bijvragen = data.data.bijvragen;
                 //Bijvragen komen automatisch!!
                 /*var promiseMulti = lesService.GetBijVraagVanVraag(vraagId);
                    promiseMulti.then(function(data){
                        console.log(data.data.vraag);
                        $scope.bijvragen = data.data.vraag;
    
                    });*/
                    
                    
                 
                
            }
            if(data.data.vraag[0].TypeId == 4){ //teken
                 console.log("een teken vraag");
                $scope.template = templates[2]; 
                
            }
        });
        
        
       
    }
    
    $scope.GetAntwoorden = function(){
        
        console.log(" lesnr:" + commonService.ActiveLes.id + " vraagnr:" +$scope.vraagNummer)//DIT IS MIS!
        promiseAntwoorden = lesService.GetAntwoorden(commonService.ActiveLes.id ,$scope.vraagNummer);
        /*promise.then(function(data){
            console.log("Antwoorden");
            console.log(data.data);
        });*/
    }
    
     var getRandomSpan = function(){
         return Math.floor((Math.random()*15)+5);
       }
     
     $scope.$on("ToonAantalAntwoorden",function(event,data){
        
           $scope.aantalAntwoorden = data.antwoorden[0].aantal;
         
     });
    var aantal = 0;
    //GET ANTWOORDEN IN CONTROLLER KOMENDE VAN SERVICE
     $scope.$on('GetAntwoorden:', function(event,data) {     
         
         if(data != null){            
            
            $scope.antwoorden = data.antwoorden;
             
            if(currentType == 2){ // cloud antwoorden!!
                
                $scope.words = [];
                angular.forEach($scope.antwoorden, function(value, key) {
                        console.log(value.Antw);
                    
                $scope.words.push({
                          text: value.Antw,
                          weight: getRandomSpan()
                      });
        
                    console.log("cloud" + $scope.words);
                    
            });
            } // end cloud antwoorden
            
             if(currentType == 3){ //Multiple choice antwoorden
                
             /*    console.log("multiple choice antwoorden");
                
                 $scope.mul =[];// [{waarde:"",aantal:0}];
                 //init array
                  angular.forEach($scope.antwoorden, function(value, key) {
                 
                      var gevonden = false;
                      for(var i=0;i<$scope.mul.length;i++){
                          if(value.Antw == $scope.mul[i].label)
                              {
                                  $scope.mul[i].value++;
                                  gevonden = true;
                              }
                      }
                      if(!gevonden)
                          $scope.mul.push({label:value.Antw,value:1});
                    });
                 
                 console.log($scope.mul);
                 
                 //TESTING FOR CHART
                  var data = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
]
        // Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");
                 
                 ctx.clearRect(0,0,500,500);
        // For a pie chart
var myPieChart = new Chart(ctx).Pie( $scope.mul);
                 
                 
                 
         */    }
             
            if(currentType == 4){ //TEKEN ANTWOORDEN
               
                console.log("teken antw:");
                 $scope.afbeeldingen = [];
                console.log($scope.antwoorden);
                
                    $scope.afbeeldingen = [];
                    angular.forEach($scope.antwoorden, function(value, key) {
                        console.log(value.afbeelding);
                        $scope.afbeeldingen.push(value.afbeelding);
                    });
               
                }

               
         }
                     
           //  }); 
            });                     
      
  /* }
     }
     });
    */
     $scope.$on('error:', function(event,data) {
         console.log("error detected!");
         lesService.StopInterval(promiseAntwoorden);
     });
    
    $scope.StopInterval = function()
    {
        console.log("stop");
        lesService.StopInterval(promiseAntwoorden);
    }
    
    
  
    
    var init = function(){
        
       
        GetVraag();
        
        var p  = lesService.GetAantalVragenVanLes(commonService.ActiveLes.id);
         p.then(function(data){
/*             console.log("Aantal vragen = ?");
             console.log(data);
             console.log(data.data.vragen[0].aantal);
             */
             $scope.aantalVragen = data.data.vragen[0].aantal;
             
             
         });
                      
        //Get aantal vragen van de les
        
        
       //$scope.vragen = lesService.GetVragenCurrentLes;
      /*  console.log("vraagnummer " + $scope.vraagNummer );
        var promise = lesService.GetVraagVanLes(lesService.GetCurrentLes,$scope.vraagNummer);
        promise.then(function(data){
            console.log(data.data);
            $scope.vraag = data.data;
        });*/
        
        //TODO: dit moet de leerling doen. Start Monitoring CanNotNext
       /* var promise = vraagService.IsVraagBeschikbaar(lesService.GetCurrentLes,2);
        promise.then(function(data){
            console.log(data.data);
        });*/
    };
    
    
    
    
    
    init();
});