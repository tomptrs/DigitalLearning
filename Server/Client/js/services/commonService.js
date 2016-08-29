app.factory("commonService",function($rootScope){
    var obj = {
        
       User:{
           id:"",
           email:""
            } ,
        
        ActiveLes:{
            code:"",
            id:""
        },
        
        ActiveVraag:{
            vraagnummer:""
        }
    }
    

    return obj;
});