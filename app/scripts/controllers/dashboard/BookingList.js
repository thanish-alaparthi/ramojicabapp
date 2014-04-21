/*
Name: sigmaAgent
Description:
Date: 20April2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaAgentApp')
	.controller('BookingList', function($scope, $rootScope, serverService) {
		var scope = $scope;

		scope.currentMonthGridDetails = [];

		var oData = {
              "bookingStatus" : [4], // send as an array.
              'nextHours' : "3"
            };

		

		scope.setBookingMgmtGrid_Success = function(data) {
			console.log(data.data);
			scope.currentMonthGridDetails = data.data;
		};

		scope.setBookingMgmtGrid_Error = function() {
			alert('failure');
		};

		serverService.sendData('P','dispatcher/getAllBookings', oData, scope.setBookingMgmtGrid_Success, scope.setBookingMgmtGrid_Error);


		scope.gridCurrentMonthData = {
			data: 'currentMonthGridDetails',
			rowHeight: 20,
			columnDefs: [{
				field: 'bookingCode',
				displayName: 'Booking Code'
			}, {
				field: 'vacantTime',
				displayName: 'Booking Date & Time'
			}, {
				field: 'deadMileage',
				displayName: 'Pickup Date & Time',
				cellFilter: 'number'
			}, {
				field: 'startTime',
				displayName: 'Passenger Name'
			}, {
				field: 'dropTime',
				displayName: 'Pickup Place'
			}, {
				field: 'totalKms',
				displayName: 'Drop Place',
				cellFilter: 'number'
			}, {
				field: 'amount',
				displayName: 'Vehicle Name',
				cellFilter: 'number'
			}, {
				field: 'totalKms',
				displayName: 'Status',
				cellFilter: 'number'
			}, {
				field: 'amount',
				displayName: 'Action',
				cellFilter: 'number'
			}],
			enablePaging: false,
			showFooter: false,
			multiSelect: false,
			totalServerItems: 'totalServerItems',
			afterSelectionChange: function(oRow) {
				// console.log(oRow.selectionProvider.selectedItems[0]);
			}
		};

	});