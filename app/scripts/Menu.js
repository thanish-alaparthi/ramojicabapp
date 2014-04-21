/*
Name: sigmaAgent
Description:
Date: 20April2014
Author: Mario::216mario216@gmail.com
*/


'use strict';

angular.module('sigmaAgentApp')
  .controller('Menu', function ($scope, $location) {
    var scope = $scope,
    	sHash = $location.path().replace('/', '');

    scope.activeSelection =  (sHash == '') ?  'bookingForm' : sHash;

    scope.fnOpenSection = function(sSectionType) {
        window.location.hash = '#/' + sSectionType;
        scope.activeSelection = sSectionType;
    };
    scope.fnLogout = function() {
        sessionStorage.setItem('sigmaAgentIsLogin', false);
        console.log('===============',sessionStorage.getItem('sigmaAgentIsLogin'));
        window.location = 'index.html';
    };




  });
