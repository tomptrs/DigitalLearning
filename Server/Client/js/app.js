var app = angular.module("app", ['ngRoute','angular-jqcloud']);
//angular.module("homeController", []);

app.run(['$rootScope', '$location', function ($rootScope, $location, vraagService) {
    var history = [];
    
    $rootScope.$on('$routeChangeStart', function (event) {
       
       
    });
   
}]);

app.config(function ($routeProvider) {
    $routeProvider

    
            // route for the login page
        .when('/login', {       
            templateUrl: 'Pages/login.html',
            controller: 'loginController'
        })
    
     .when('/register', {       
            templateUrl: 'Pages/register.html',
            controller: 'registerController'
        })

        // route for the home page
        .when('/home', {       
            templateUrl: 'Pages/home.html',
            controller: 'homeController'
        })

        .when('/lesdashboard', {       
            templateUrl: 'Pages/Leraar/beheerLessen.html',
            controller: 'beheerLesController'
        })
    
     .when('/showVragen', {       
            templateUrl: 'Pages/Leraar/showVragen.html',
            controller: 'showVragenController'
        })
    /*
    TESTING
    */
    // route for the home page
        .when('/leraar', {       
            templateUrl: 'Pages/Leraar/testvraag.html',
            controller: 'LeraarTestCtrl'
        })
    
    // route for the home page
        .when('/leerling', {       
            templateUrl: 'Pages/Leerling/LeerlingTestvraag.html',
            controller: 'LeerlingTestCtrl'
        })
    
     .when('/leerlingShowVraag', {       
            templateUrl: 'Pages/Leerling/showVraagLeerling.html',
            controller: 'showVraagLeerlingCtrl',
            onExit: ['$commonService', function($commonService){
                alert("leaving");//do what u want to do here
            }]
        })
    
     .when('/leraarAddVraag', {       
            templateUrl: 'Pages/Leraar/MaakVragen.html',
            controller: 'addVragenController'
        })
    
    /*
    EINDE TESTING
    */

        // route for the about page
        .when('/about', {
            templateUrl: 'Pages/about.html',
            controller: 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl: 'Pages/contact.html',
            controller: 'contactController'
        })
    
    .otherwise({
        redirectTo: '/login'
      });
});


//Model for user


