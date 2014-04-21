/*
Name: sigmaAgent
Description:
Date: 20April2014
Author: Mario::216mario216@gmail.com
*/


'use strict';

angular.module('sigmaAgentApp')
  .controller('LoginAgent', function (
        $scope
    ) {
    var scope = $scope;

    scope.loginPassword = '';
    scope.loginUserName = '';

    scope.session = sessionStorage.getItem('sigmaAgentIsLogin');

    scope.fnSignIn = function() {
    	if($.trim(scope.loginPassword) == '' || $.trim(scope.loginUserName) == ''){
    		alert('Username & Password is required.');
    		return;
    	}

        sessionStorage.setItem('sigmaAgentIsLogin', true);
        window.location = 'agentDashboard.html';

    };

  });
