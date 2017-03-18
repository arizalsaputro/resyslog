var app = angular.module('pakuapps', ['ui.router','ngMaterial','firebase','ngProgress','base64','angular-web-notification','chart.js']);

app.config(['$stateProvider', '$urlRouterProvider','$mdThemingProvider',function ($stateProvider, $urlRouterProvider,$mdThemingProvider) {
   	
   	$mdThemingProvider.theme('default')
		    .primaryPalette('teal')
		    .accentPalette('indigo');

   	$stateProvider
    .state('login', {
	    url: '/login',
	    templateUrl: 'view/login/login.html',
	    controller :'loginCtrl' ,
      data : {
        pageTitle : 'Masuk'
      },
      resolve: {
          "currentAuth": ["DBAuthHelper", function(DBAuthHelper) {
            return DBAuthHelper.getAuth().$waitForAuth();
          }]
        }
    })

    .state('dash',{
    	templateUrl : 'view/dash.html',
    	controller: 'dashCtrl',
       abstract :true,
      data : {
        pageTitle : 'Halaman Utama'
      },
      resolve: {
        "currentAuth": ["DBAuthHelper", function(DBAuthHelper) {
          return DBAuthHelper.getAuth().$requireAuth();
        }]
      }
    })

    .state('dash.inventaris',{
      url: '/inventaris',
      views : {
        'view-dash':{
          templateUrl: 'view/inventaris/inventaris.html',
          controller: 'inventarisCtrl'
        }
      }
    })

    .state('dash.pengadaan',{
      url: '/pengadaan',
      views : {
        'view-dash':{
          templateUrl: 'view/pengadaan/pengadaan.html',
          controller: 'pengadaanCtrl'
        }
      }
    })

    .state('dash.permintaan',{
      url: '/permintaan',
      views : {
        'view-dash':{
          templateUrl: 'view/permintaan/permintaan.html',
          controller: 'permintaanCtrl'
        }
      }
    })

    .state('dash.distribusi',{
      url: '/distribusi',
      views : {
        'view-dash':{
          templateUrl: 'view/distribusi/distribusi.html',
          controller: 'distribusiCtrl'
        }
      }
    })
  

    .state('dash.recommender',{
      url: '/recommender',
      views : {
        'view-dash':{
          templateUrl: 'view/recommender/recommender.html',
          controller: 'recommenderCtrl'
        }
      }
    })

    .state('dash.kotama',{
      url: '/kotama',
      views : {
        'view-dash':{
          templateUrl: 'view/operasi/kotama.html',
          controller: 'kotamaCtrl'
        }
      }
    })





    .state('dash.statis',{
      url: '/statistic',
      views : {
        'view-dash':{
          templateUrl: 'view/statis/statistik.html',
          controller: 'statisCtrl'
        }
      }
    })

   ;

  //$urlRouterProvider.otherwise('/order');
}]);

app.run(function ($state,$rootScope) {
      $state.go("dash.inventaris");
	    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        if (error === "AUTH_REQUIRED") {
          $state.go("login");
        }
      });
});

