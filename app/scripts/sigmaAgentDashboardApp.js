/*
Name: sigmaAgent
Description:
Date: 20April2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaAgentApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngGrid'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/bookingForm', {
        templateUrl: 'views/dashboard/booking.html',
        controller: 'BookingForm'
      })
      .when('/bookingList', {
        templateUrl: 'views/dashboard/bookingList.html',
        controller: 'BookingList'
      })
      .otherwise({
        redirectTo: '/bookingForm'
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
