/*
Een vraag in de database = 
Id, Stelling, TypeId, LesId, VraagNummer, Active

EenVraag = 
    {
        "Stelling":"",
        "TypeId":1,
        "LesId":"",
        "VraagNummer":"",
        "Active" : false
    };
    */

app.controller('addVragenController', function ($scope,$interval,$window,lesService,commonService) {
    $scope.message = 'Add Vraag';
    $scope.lessen = [];    
    $scope.vragen = [];

    
    
   //TODO: Add Vraag
    var init = function(){
       console.log("Add vraag");
        //1. Haal alle vragen op van huidige les van NodeJS Server
        /*
        var promise = lesService.GetAlleLessen();
        promise.then(function(data){             
            $scope.lessen = data.data; 
            
        });
        */
        
        var promise = lesService.GetAllelVragenVanLes(commonService.ActiveLes.id);
         promise.then(function(data){
            
            //Push into client side vragen lijst!
             for(var i= 0; i< data.data.vragen.length;i++){
                 var multi = false;
               
                 if(data.data.vragen[i].TypeId == 3){
                    
                     var gevonden = false;
                     var plaats = -1;
                     for(var j=0;j<$scope.vragen.length;j++){
                         
                         if(data.data.vragen[i].Id == $scope.vragen[j].id){
                             gevonden = true;
                             plaats = j;
                            
                         }
                     }
                         
                         if(!gevonden){
                            
                              $scope.vragen.push({"id": data.data.vragen[i].Id,"Stelling":data.data.vragen[i].VraagStelling, "TypeId":data.data.vragen[i].TypeId,"VraagNummer":data.data.vragen[i].VraagNummer, "multi":[{"Stelling":data.data.vragen[i].BijvraagStelling}]});
                         }
                         else{//enkel multi invullen
                            // $scope.vragen[j].multi.push({"Stelling": data.data.vragen[i].BijvraagStelling})
                             $scope.vragen[plaats].multi.push({"Stelling":data.data.vragen[i].BijvraagStelling});
                         }
                 }
                 
                 else{ //GEEN MULTI VRAAG!
                     $scope.vragen.push({"id": data.data.vragen[i].Id,"Stelling":data.data.vragen[i].VraagStelling, "TypeId":data.data.vragen[i].TypeId,"VraagNummer":data.data.vragen[i].VraagNummer, "multi":[]});
                 }
    
             }
         });
       
    };
    
    
    $scope.dashboard = function(){
         $window.location.href = '/#/lesdashboard';  
    };
    
    
    $scope.add = function(){
        console.log("add");
         $scope.vragen.push({"Stelling":"", "TypeId":"2","VraagNummer":"", "multi":[]});
    }
    
    $scope.remove = function(index) {
					$scope.vragen.splice(index, 1);
				};
    
     $scope.update = function(index) {
		var vraag = $scope.vragen[index];
        console.log("update vraag");
        console.log(vraag);
        lesService.updateVraag(commonService.ActiveLes.id, vraag);
	};
    
    
    $scope.bewaar = function(index){
        console.log("BEWAAR")
        var vraag = $scope.vragen[index];
        console.log("bewaar vraag");
        console.log(vraag);
        
        lesService.addVraag(commonService.ActiveLes.id, vraag);
        
    };
    
    /*
    Things to do met multiple choice vraag!
    */


     $scope.addStellingMultiple = function(index){
            console.log(index);
            console.log( $scope.vragen[index]);
            $scope.vragen[index].multi.push({"Stelling":"vul hier je stelling in"});
     };
    
    
    
    
    
    init();
});