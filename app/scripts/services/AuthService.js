/*
Name: sigmaAgent
Description:
Date: 20April2014
Author: Mario::216mario216@gmail.com
*/


'use strict';

angular.module('sigmaAgentApp')
  .factory('AuthService', function(
      $http
  ) {
    var oUser = null;
    return {
    loginCheck: function() {

       var session = sessionStorage.getItem('sigmaAgentIsLogin') || false,
           sPath = window.location.pathname,
           sFileName = sPath.substring(sPath.lastIndexOf('/') + 1);

           console.log(session, typeof session);

      if(!session || session == 'false') {
        if(sFileName == '' || sFileName == 'index.html') {
          return;
        } else {
          window.location = 'index.html';
        }
      } else if(session) {
        if(sFileName == '' || sFileName == 'index.html') {
          window.location = 'agentDashboard.html';
        } else {
          return;
        }
      }
    }
  };
});