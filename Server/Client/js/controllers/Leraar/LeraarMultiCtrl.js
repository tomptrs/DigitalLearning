app.controller('LeraarMultiCtrl', function ($scope,vraagService) {
    
      var ctx = document.getElementById("myChart").getContext("2d");
  
      // var myPieChart = new Chart(ctx).Pie([]);

    $scope.mul=[];
    var myPieChart;
  
    
    var init = function(){
        
        console.log("Leraar Multi Controller");
        ctx = document.getElementById("myChart").getContext("2d");
  
  
        // Get the context of the canvas element we want to select
               
    ctx.clearRect(0,0,500,500);

        
    } //END INIT
    
        $scope.$on('GetAntwoorden:', function(event,data) {
            console.log("multi leraar ctrl, multii")

            console.log(data);
            
            
                
                
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
  
        // Get the context of the canvas element we want to select
               
 ctx.clearRect(0,0,500,500);
// For a pie chart
          //  myPieChart.data = $scope.mul;
            if(myPieChart !=null)
                myPieChart.destroy();
 myPieChart = new Chart(ctx).Pie( $scope.mul);
//     myPieChart.data = $scope.mul;            
                 
  
            
        });
    
    
  
    
        
    init();
});