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

		var oData = {
              "bookingStatus" : [4], // send as an array.
              'nextHours' : "3"
            };

		

		scope.setBookingMgmtGrid_Success = function(data) {
			console.log(data);
			alert('Success');
		};

		scope.setBookingMgmtGrid_Error = function() {
			alert('failure');
		};

		serverService.sendData('P','dispatcher/getAllBookings', oData, scope.setBookingMgmtGrid_Success, scope.setBookingMgmtGrid_Error);

		scope.currentMonthGridDetails = [{
			'bookingCode': '1',
			'bookingNo': '1',
			'vacantTime': '20',
			'startTime': '11:20 PM',
			'dropTime': '12:20 PM',
			'totalKms': '1120',
			'amount': '1500',
			'deadMileage': '5'
		}];

		scope.gridCurrentMonthData = {
			data: 'currentMonthGridDetails',
			rowHeight: 20,
			columnDefs: [{
				field: 'bookingCode',
				displayName: 'B.No',
				headerTitle: 'Booking No.'
			}, {
				field: 'vacantTime',
				displayName: 'V.T',
				headerTitle: 'Vacant Time'
			}, {
				field: 'deadMileage',
				displayName: 'D.ML',
				headerTitle: 'Dead Mileage',
				cellFilter: 'number'
			}, {
				field: 'startTime',
				displayName: 'S.T',
				headerTitle: 'Start Time'
			}, {
				field: 'dropTime',
				displayName: 'D.T',
				headerTitle: 'Drop Time'
			}, {
				field: 'totalKms',
				displayName: 'T.kms',
				headerTitle: 'Total Kms.',
				cellFilter: 'number'
			}, {
				field: 'amount',
				displayName: 'Amount',
				headerTitle: 'Amount',
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