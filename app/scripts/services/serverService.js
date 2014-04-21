//Data model to communicate with server
angular.module('sigmaAgentApp')
.factory('serverService', function($rootScope, $http){
	var baseUrl = 'http://10.0.1.69/sigmacabs/backend/index.php';//URLService.serviceRoot;
	var serverService = function(data){
		angular.extend(this, data);
	}
	serverService.sendData = function(method, url, data, sucessCallback, errorCallback){
		var methods = {'P':'POST','G':'GET'};
		$http({
				'method': methods[method] || 'POST', 
				'url': baseUrl, 
				'data': {
						'url':url,
						'data':JSON.stringify(data)
					},
				'headers' : {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data, status, headers, config) {
				var errorMesg = "Error in processing your request";
				if (status == 200) {
					//check for the valid format of the data, else through into the error callback
					var isValidData = (data && data.status) || false;
					if ((isValidData) && (data.status == 200)) {
						var data = data.result;
						sucessCallback(data);
					} else if ((isValidData) && (data.status === 500)) {
						if (data.result && data.result.length && data.result[0]) {
							var mesg = data.result[0].message || data.result[0].errorMessage || errorMesg;
							alert(mesg);
						} else {
							alert(errorMesg);
						}
					} else {
						errorCallback(data);
					}
				}
		  })
		  .error(function(data, status, headers, config) {
		  	/*
		  		May be we need to ask for header 401 from server, if login session expires.
		  		So that we can force logout the client.
		  	*/
				if(status == 401){
					$rootScope.$broadcast('forceLogout');
				}
		  	errorCallback(data);
		  })
	};
	serverService.stubData = function(configData, sucessCallback, errorCallback){
		var data = stubService.getStubData(configData);
		sucessCallback(data);
	};
	serverService.showGlobalError = function(){
		/*
			show some global error via some global application error showing mechanism 
			(may be a toaster can be used)
		*/
	}
	return serverService;
});