'use strict';

angular.module('sigmaAgentApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/sigmaLoginAgent.html',
        controller: 'LoginAgent'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($location, AuthService, $rootScope,$route) {
 
     $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      AuthService.loginCheck();
      });
     $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
         //Change page title, based on Route information
         $rootScope.title = $route.current.title;
         $rootScope.path = '/bookingForm';
     });
   
  });
