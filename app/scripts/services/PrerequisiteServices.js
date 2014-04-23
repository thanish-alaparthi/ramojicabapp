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
                fnGetVehicleNames: function() {
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
                fnGetPackages: function() {
                    return [{
                        'id': '1',
                        'packageName': 'City to Ramoji'
                    }, {
                        'id': '2',
                        'packageName': 'Ramoji to City'
                    }, {
                        'id': '3',
                        'packageName': 'Ramoji to Outskirts'
                    }, {
                        'id': '4',
                        'packageName': 'Outskirts to Ramoji'
                    }, {
                        'id': '5',
                        'packageName': 'Airport to Ramoji'
                    }, {
                        'id': '6',
                        'packageName': 'Ramoji to Airport'
                    }];
                },
                fgGetCurrentDate: function() {
                    var oDt = new Date(),
                        sDt = oDt.getFullYear() + '-' + (oDt.getMonth() <= 9 ? '0' + oDt.getMonth() : oDt.getMonth()) + '-' + (oDt.getDate() <= 9 ? '0' + oDt.getDate() : oDt.getDate());

                    return sDt;
                },
                // Hours dropdown
                hours: {
                    '00': '00',
                    '01': '01',
                    '02': '02',
                    '03': '03',
                    '04': '04',
                    '05': '05',
                    '06': '06',
                    '07': '07',
                    '08': '08',
                    '09': '09',
                    '10': '10',
                    '11': '11',
                    '12': '12',
                    '13': '13',
                    '14': '14',
                    '15': '15',
                    '16': '16',
                    '17': '17',
                    '18': '18',
                    '19': '19',
                    '20': '20',
                    '21': '21',
                    '22': '22',
                    '23': '23'
                },
                // minutes dropdown
                minutes: {
                    '00': '00',
                    '15': '15',
                    '30': '30',
                    '45': '45'
                },
            }
        });