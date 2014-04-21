    /*
    Name: VehiclesService
    Description: Service which handles REST Calls for Vehicles
    Date: 05Jan2014
    Author: Mario::216mario216@gmail.com
    */

    'use strict';

    angular.module('sigmaAgentApp')
        .factory('PrerequisiteService', function($http, $rootScope) {

            return {
                fnGetVehicleNames : function() {
                    return [{
                        "id": "1",
                        "vehicleName": "Indica",
                        "vehicleType": "1",
                        "tariffType": "1",
                        "status": "1"
                    }, {
                        "id": "2",
                        "vehicleName": "Vista",
                        "vehicleType": "1",
                        "tariffType": "1",
                        "status": "1"
                    }, {
                        "id": "3",
                        "vehicleName": "Indigo",
                        "vehicleType": "2",
                        "tariffType": "2",
                        "status": "1"
                    }, {
                        "id": "4",
                        "vehicleName": "Verito",
                        "vehicleType": "2",
                        "tariffType": "2",
                        "status": "1"
                    }, {
                        "id": "5",
                        "vehicleName": "Tavera",
                        "vehicleType": "3",
                        "tariffType": "3",
                        "status": "1"
                    }, {
                        "id": "6",
                        "vehicleName": "Xylo",
                        "vehicleType": "4",
                        "tariffType": "4",
                        "status": "1"
                    }, {
                        "id": "7",
                        "vehicleName": "Innova",
                        "vehicleType": "4",
                        "tariffType": "4",
                        "status": "1"
                    }];
                },
                fnGetPackages : function() {
                    return [{
                        'id' : '1',
                        'packageName' : 'City to Ramoji'
                    }, {
                        'id' : '2',
                        'packageName' : 'Ramoji to City'
                    }, {
                        'id' : '3',
                        'packageName' : 'Ramoji to Outskirts'
                    }, {
                        'id' : '4',
                        'packageName' : 'Outskirts to Ramoji'
                    }, {
                        'id' : '5',
                        'packageName' : 'Airport to Ramoji'
                    }, {
                        'id' : '6',
                        'packageName' : 'Ramoji to Airport'
                    }];
                }
            }
    });