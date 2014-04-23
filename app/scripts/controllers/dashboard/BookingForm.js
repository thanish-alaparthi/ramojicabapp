/*
Name: sigmaAgent
Description:
Date: 20April2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaAgentApp')
	.controller('BookingForm', function($scope, $rootScope, serverService, PrerequisiteService) {
		var scope = $scope;

		scope.vehicleNames = PrerequisiteService.fnGetVehicleNames();
		scope.hours = angular.copy(PrerequisiteService.hours);
		scope.minutes = angular.copy(PrerequisiteService.minutes);
		scope.packages = PrerequisiteService.fnGetPackages();

		scope.bookingDetails = {
			id : '',
			passengerName : '',
			passengerMobile : '',
			passengerAltMobile : '',
			pickupPlace : '',
			dropPlace : '',
			landmark1 : '',
			tariffId : '1',
			comments : '',
			vehicleName : '1',
			pickupDate : '',
			pickupTime : ''
		};

		// set default hour and minutes
		scope.bookingDetails.pickupHours = "10";
		scope.bookingDetails.pickupMinutes = "00";

		// scope.dpCurrentDate = PrerequisiteService.fgGetCurrentDate();
		// scope.dpCurrentPlusSevenDate = PrerequisiteService.fgGetCurrentDate();


		scope.fnSaveBooking = function() {
			if(! scope.fnIsValidBooking()) {
				return;
			}


		};

		scope.fnIsValidBooking = function() {
			var bd = scope.bookingDetails;
			if($.trim(bd.passengerName) == '') {
				alert('Passenger name is required.');
				return false;
			}
			if($.trim(bd.passengerMobile) == '') {
				alert('Passenger mobile is required.');
				return false;
			}
			if($.trim(bd.pickupPlace) == '') {
				alert('Pickup place is required.');
				return false;
			}
			if($.trim(bd.dropPlace) == '') {
				alert('Drop place is required.');
				return false;
			}
			if($.trim(bd.pickupDate) == '') {
				alert('Pickup date is required.');
				return false;
			}
			if($.trim(bd.pickupDate) == '') {
				alert('Pickup date is required.');
				return false;
			}
			if($.trim(bd.pickupTime) == '') {
				alert('Pickup time is required.');
				return false;
			}

			return true;
		};


	});