app.controller('beheerLesController', function ($scope,$interval,$window,lesService,commonService) {
    $scope.message = 'beheer les!';
    $scope.lessen = [];
    
   
    var init = function(){
        
        if(!commonService.User.id >0)
        //    $window.location.href = '/#/login'; //UNDO COMMENT!!
        
        //1. Haal alle lessen op van NodeJS Server TODO: van ingelogde persoon!
        console.log("beheerLes: init");
        console.log(commonService.User);
        var promise = lesService.GetAlleLessen(commonService.User.id);
        promise.then(function(data){  
            console.log(data.data);
            $scope.lessen = data.data; 
            
        });
    };
    
     $scope.logout = function(){
       
       $window.location.href = '/#/login';
        
    };
    
    
    $scope.StartLes = function(id){
        
        console.log(id);
        
        //1. Get Les van NodeJS Server en navigeer naar showLes
        var promise  = lesService.StartLes(id);
        promise.then(function(data){
            //Navigeer naar andere pagina!
            console.log("TEST")
           console.log(data);
         //  console.log(data.data.active);
            if(data.data.active == "success"){
                console.log(data.data.les);
               // lesService.VragenCurrentLes = data.data.data
                commonService.ActiveLes.id = data.data.les[0].Id;
                commonService.ActiveLes.code = data.data.les[0].Code;
                $window.location.href = '/#/showVragen';  
            }
            
            // lesService.CurrentLes = id; //SET CURRENT LES
            //lesService.VragenCurrentLes = data.data;            
            //
        });
    };
    
    $scope.addLes = function(){
        //go to service
        //TODO de code wordt op de server aangemaakt:
        
        var promise = lesService.addLes($scope.lesnaam,"code",commonService.User.id);
        promise.then(function(data){
            
            console.log("Nieuwe les toegevoegd");
            commonService.ActiveLes.id = data.data.les[0].Id;
            console.log(data.data.les[0].Id);
            $window.location.href = '/#/leraarAddVraag';           
        });                
    }
    
    $scope.BewerkLes = function(id){
         console.log(id);        
        //Navigate to addvragen
        //De huidige les onthouden!!!!
        commonService.ActiveLes.id = id;
        $window.location.href = '/#/leraarAddVraag';
    }
    
    $scope.VerwijderLes = function(id){
         console.log(id);
        
        /*
        TODO Verwijder LES!
        */
        var promise = lesService.RemoveLes(id);
         promise.then(function(data){
        init();
         });
    };
    
    init();
});