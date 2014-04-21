/*
Name: VehiclesService
Description: Service which handles REST Calls for Vehicles
Date: 05Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .factory('PrerequisiteService', function($http, URLService, PreConfigService, $rootScope) {
        var oUser = null,

            oDate = new Date(),
            yyyy = oDate.getFullYear().toString(),
            mm = (oDate.getMonth() + 1).toString(),
            dd = oDate.getDate().toString(),
            currentDate = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]),
            nextYearDate = (parseInt(yyyy) + 1) + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]),

            d1 = new Date(),
            d2 = new Date(d1);
        d2.setHours(d1.getHours() + 1);
        var sDefaultBookingHours = d2.getHours(),
            sDefaultBookingMinutes = d2.getMinutes(),

            sLs = localStorage.getItem('sigmaCabsPrerequisites'),
            oLs = sLs ? JSON.parse(sLs) : {},
            isDataExistsInLocalStorage = ((oLs.hasOwnProperty(currentDate)) ? true : false),

            iApiCount = 0,
            fnEmitSuccess = function(){
                $rootScope.$emit('eventPrerequisitsLoaded');
            };

        return {
            iJc : 0,
            oLs: oLs,
            iApiCount : 0,  // count of successful/Error callback returned.
            iApiLimit : 0,  // Total number of API calls made.
            fnEmitEvent : function(sMyDataToken, isFromError){

                var oThis = this;
                oThis.iApiCount++;

                console.log('No. of Prerequisite API returned:', oThis.iApiCount, '. Total Prerequisite APIs are: ', oThis.iApiLimit, '(',sMyDataToken,')');
                if(isFromError){
                    console.error('################### ERROR in Config Response. clearing localstorage ###############:::', sMyDataToken);

                    oThis.oLs = {};
                }

                if(oThis.iApiCount == oThis.iApiLimit 
                    && oThis.fnStoreJourneyTypes()
                    && oThis.fnSetAllLocations()
                    && oThis.fnSetAttachmentTypes()
                    && oThis.fnStoreReasonsByCategoryId()) {

                    localStorage.setItem('sigmaCabsPrerequisites', JSON.stringify(oThis.oLs));
                    $rootScope.$emit('eventPrerequisitsLoaded');
                }
            },
            fnAddToLocalStorage : function(sType, oResult){
                var oThis = this;
                if(typeof oResult == 'string'){
                    console.warn(sType,' gave empty data for Prerequisite.');
                }

                if(!oThis.oLs.hasOwnProperty(currentDate)){
                    // To remove previous day data
                    oThis.oLs = {};
                    oThis.oLs[currentDate] = {};
                }
                oThis.oLs[currentDate][sType] = oResult;


                // store tariff properly per vehicleType
                if(sType == 'tariff'){
                    oThis.fnStoreTariffData();
                }

                // if(sType == 'journeyTypesOnly' || sType == 'subJourneyTypesOnly'){
                //     oThis.iJc++;
                //     if(oThis.iJc ==2){
                //         oThis.fnStoreJourneyTypes();
                //     }
                // }

                return true;
            },
            fnSuccessCallback : function(data, status,fnHeaders, oXhr, config) {
                var oMe = oXhr.oMe;
                console.log('success ',oXhr.myDataToken, ': ', data, typeof data); 
                if(typeof data == 'string'){
                    oMe.fnEmitEvent(oXhr.myDataToken,true);
                    return;
                }
                if(oMe.fnAddToLocalStorage(oXhr.myDataToken, data.result)) {
                    oMe.fnEmitEvent(oXhr.myDataToken, false);
                }
            },
            fnErrorCallback : function(data, status, fnHeaders, oXhr, config) {
                var oMe = oXhr.oThis;
                console.log('error ',oXhr.myDataToken,': ', data);
                oMe.fnEmitEvent(oXhr.myDataToken, true);
            },
            // call for interrelated configuration/Prequisite data
            fnGetPrerequisites: function() {
                var oThis = this;

                //Note: the call will be made only if data is not present in the local storage on day basis
                $rootScope.$emit('eventPrerequisitsLoaded');
                if (isDataExistsInLocalStorage) {
                    setTimeout(function(){
                        fnEmitSuccess();
                    },0);
                    return;
                }

                console.log('No LocalStore data: getting Prerequisite Data for ' + oThis.currentDate+' from server...');

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllJourneyTypes'),
                    method: 'GET',
                    myDataToken : 'journeyTypesOnly',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllSubJourneyTypes'),
                    method: 'GET',
                    myDataToken : 'subJourneyTypesOnly',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllBookingStates'),
                    method: 'GET',
                    myDataToken : 'bookingStates',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllGrades'),
                    method: 'GET',
                    myDataToken : 'grades',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllTariff'),
                    method: 'GET',
                    myDataToken : 'tariff',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetVehicleNames'),
                    method: 'GET',
                    myDataToken : 'vehicleNames',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                // oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                // $http({
                //     url: URLService.service('RestApiGetStatistics'),
                //     method: 'GET',
                //     myDataToken : 'statistics',
                //     oMe : oThis,
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded'
                //     }
                // }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetTravelType'),
                    method: 'GET',
                    myDataToken : 'travelTypes',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetAllVehicleTypes'),
                    method: 'GET',
                    myDataToken : 'vehicleTypes',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetAllCategories'),
                    method: 'GET',
                    myDataToken : 'customerCategories',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetAllVehicleStates'),
                    method: 'GET',
                    myDataToken : 'vehicleStates',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetAllReasonCategories'),
                    method: 'GET',
                    myDataToken : 'reasonCategories',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetAllReasons'),
                    method: 'GET',
                    myDataToken : 'reasons',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetAllLocations'),
                    method: 'GET',
                    myDataToken : 'allLocations',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetSpecialRequestTypes'),
                    method: 'GET',
                    myDataToken : 'specialRequests',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetAttachmentTypes'),
                    method: 'GET',
                    myDataToken : 'attachmentTypes',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
            },


            defaultBookingHour: sDefaultBookingHours.toString(),    // default booking Hours
            defaultBookingMinutes: '00',    // default booking minutes
            currentDate: currentDate,   // current Date
            nextYearDate: nextYearDate, // Next days date

            priorities: {               //Priorites
                '1': 'Normal',
                '2': 'Important',
                '3': 'High',
                '4': 'Critical'
            },

            hours: {                    // Hours dropdown
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
            loginHours: { // login Hours dropdown
                /*'00': '00',
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
                '13': '13',*/
                '14': '14',
                '15': '15',
                '16': '16',
                '17': '17',
                '18': '18',
                '19': '19',
                '20': '20',
                '21': '21',
                '22': '22',
                '23': '23',
                '24': '24'
            },
            minutes: {              // minutes dropdown
                '00': '00',
                '10': '10',
                '20': '20',
                '30': '30',
                '40': '40',
                '50': '50'
            },

            fnGetMonthsObjects : function() {
                return { 
                  '01' : 'Jan',
                  '02' : 'Feb',
                  '03' : 'Mar',
                  '04' : 'Apr',
                  '05' : 'May',
                  '06' : 'Jun',
                  '07' : 'Jul',
                  '08' : 'Aug',
                  '09' : 'Sep',
                  '10' : 'Oct',
                  '11' : 'Nov',
                  '12' : 'Dec'
                };
            },

            fnGetJourneyTypes : function(){         // Function to return Only Main JourneyTypes
                // filter main journey types i.e. where parentId = 0;
                var aRtn = [],
                    oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].parentId == 0) {
                        aRtn.push(oJt[i]);
                    }
                }
                return aRtn;
            },
            fnGetJourneyTypeBySubJourneyTypeId : function(sId){         // Function to return Only Main JourneyTypes
                // filter main journey types i.e. where parentId = 0;
                var oThis = this,
                    aRtn = [],
                    oJt = oThis.oLs[oThis.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sId && oJt[i].parentId != '0') {
                        return oThis.fnGetJourneyObjectById(oJt[i].parentId);
                    }
                }
                return null;
            },
            fnGetJourneyObjectById : function(sId){         // Function to return Only One JourneyType based on id
                var aRtn = [],
                    oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sId && oJt[i].parentId == '0') {
                        return oJt[i];
                    }
                }
                return null;
            },
            fnGetSubJourneyObjectById : function(sId){         // Function to return Only One JourneyType based on id
                var aRtn = [],
                    oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sId && oJt[i].parentId != '0') {
                        return oJt[i];
                    }
                }
                return null;
            },
            fnGetSubJourneyOnIds : function(sId){
                // this function returns object with key as subjournyId and value as subJourneyObject
                var aRtn = {},
                    oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].parentId != '0') {
                        aRtn[oJt[i].id] = oJt[i];
                    }
                }
                return aRtn;
            },
            fnGetAllJourneyTypes : function(){         // Function to return Only Main JourneyTypes
                return this.oLs[this.currentDate]['journeyTypes'];
            },
            fnGetSubJourneyTypes : function(sParentId){         // Function to return Only sub JourneyTypes
                // filter sub journey types i.e. where parentId = sParentId;
                var aRtn = [],
                    oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].parentId == sParentId) {
                        aRtn.push(oJt[i]);
                    }
                }
                return aRtn;
            },
            fnGetMainJourneyTypeOfSubJourneyType : function(sSubJourneyTypeId){    //function to find out MainJourneyType based on SubJourneyTypeId
                var oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sSubJourneyTypeId && oJt[i].parentId != "0") {
                        return this.fnGetJourneyObjectById(oJt[i].parentId);
                    }
                }

                return null;
            },
            // fnGetJourneyTypeName : function(sId){    //function to get journey type name
            //     var oJt = this.oLs[this.currentDate]['journeyTypes'],
            //         iCount = oJt.length;

            //     for(var i=0;i<iCount;i++){
            //         if(oJt[i].id == sId && oJt[i].parentid != '0') {
            //             return oJt[i].journeyType;
            //         }
            //     }

            //     return null;
            // },
            fnGetMainJourneyTypeObjectBySubJourneyTypeId : function(sSubJourneyTypeId, key){    //function to find out MainJourneyType based on SubJourneyTypeId
                var oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length,
                    sSelId = null;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sSubJourneyTypeId && oJt[i].parentId !=0) {
                        sSelId = oJt[i].parentId;
                        break;
                    }
                }
                if(sSelId){                    
                    return (key) ? this.fnGetJourneyObjectById(sSelId).key : this.fnGetJourneyObjectById(sSelId);
                }

                return null;
            },
            fnGetTariffData : function(){           // function to return TariffData
                return this.oLs[this.currentDate]['tariff'];
            },
            fnStoreJourneyTypes : function() {
                var oThis = this,
                    oJt = oThis.oLs[oThis.currentDate]['journeyTypesOnly'],
                    oSjt = oThis.oLs[oThis.currentDate]['subJourneyTypesOnly'],

                    oNwJt = [];

                    for(var i=0,iC=oJt.length;i<iC;i++){
                        oJt[i].parentId = '0';
                        oJt[i].status = '1';
                        oNwJt.push(oJt[i]);
                    }
                    for(var i=0,iC=oSjt.length;i<iC;i++){
                        oNwJt.push(oSjt[i]);
                    }

                    console.log('>>><<<<<>>><<<',oNwJt);
                    oThis.fnAddToLocalStorage('journeyTypes', oNwJt);

                    return true;
            },
            fnStoreTariffData : function() {
                var oThis = this,
                    aTd = oThis.fnGetTariffData(),
                    aFormatedTd = {},
                    oTariffById = {},
                    oPackage = {},
                    oTariffByVtypeAndJtype = {},
                    oTariffByVtypeAndSubJtype = {};

                for(var k in aTd){
                    var tariffData = aTd[k],
                        tariffDataLength = tariffData.length,
                        oTd = [],
                        sTmpDuration = '',
                        sTmpKms = '',
                        aSubJtypeDone = [];

                    oPackage[k] = {};
                    oTariffByVtypeAndJtype[k] = {};
                    for (var i = 0; i < tariffDataLength; i++) {
                        var oTempPackage = tariffData[i],
                            // as per new change subjourneytype = tariff id
                            tariffId = tariffData[i].id,
                            sTmpSubJtype = '';

                        oTariffById[tariffId] = tariffData[i];
                        oPackage[k][tariffData[i].vehicleType] = oPackage[k][tariffData[i].vehicleType] || [];
                        oTariffById[tariffId]['duration'] = tariffData[i].duration;
                        oTariffById[tariffId]['distance'] = tariffData[i].kms;
                        var tariffRow = {
                            'duration': tariffData[i].duration / 60,
                           //  'displayText' : oThis.fnGetJourneyTypeName(tariffData[i].subJourneyType),
                            'kms' : tariffData[i].kms
                        }

                        oTempPackage.text = parseInt((tariffData[i].duration)/60) + 'hrs - ' + tariffData[i].kms + 'kms - Rs' + tariffData[i].price;
                        oPackage[k][tariffData[i].vehicleType].push(oTempPackage);

                        tariffRow['vehicleType' + tariffData[i].vehicleType] = tariffData[i].price;

                        oTariffByVtypeAndJtype[k][tariffData[i].vehicleType] = oTariffByVtypeAndJtype[k][tariffData[i].vehicleType] || [];
                        oTariffByVtypeAndJtype[k][tariffData[i].vehicleType].push(oTempPackage);
						oTariffByVtypeAndSubJtype[tariffData[i].vehicleType] = oTariffByVtypeAndSubJtype[tariffData[i].vehicleType] || {};
                        oTariffByVtypeAndSubJtype[tariffData[i].vehicleType][tariffData[i].subJourneyType] = oTempPackage;
                        
                        for (var j = 0; j < tariffDataLength; j++) {
                            if(tariffData[i].subJourneyType == tariffData[j].subJourneyType){
                                tariffRow['vehicleType' + tariffData[j].vehicleType] = tariffData[j].price;
                                tariffRow['tariffObj_vehicleType' + tariffData[j].vehicleType] = tariffData[j];                                
                                tariffRow['vt_vehicleType' + tariffData[j].vehicleType] = tariffData[j].id;
                            }
                        }

                        if(aSubJtypeDone.indexOf(tariffData[i].subJourneyType) == -1){
                            tariffRow.subJourneyName = tariffData[i].subJourneyName;
                            oTd.push(tariffRow);
                            aSubJtypeDone.push(tariffData[i].subJourneyType);
                        }
                    }
                    aFormatedTd[k] = oTd;
                }
                oThis.fnAddToLocalStorage('tariffTypeOnJtype', aFormatedTd);
                oThis.fnAddToLocalStorage('tariffById', oTariffById);
                oThis.fnAddToLocalStorage('tariffByVtypeAndJtype', oTariffByVtypeAndJtype);
                oThis.fnAddToLocalStorage('tariffByVtypeAndSubJtype', oTariffByVtypeAndSubJtype);
                oThis.fnAddToLocalStorage('vehilcePackageByJtype', oPackage);
            },
            fnGetTariffByVehicleType : function(sJourneyType){
                var oThis = this;

                return oThis.oLs[oThis.currentDate]['tariffTypeOnJtype'][sJourneyType] || null;
            },

            fnGetTariffByVtypeAndSubJtype : function(sVehicleType, subJourneyType){
                var oThis = this;

                return oThis.oLs[oThis.currentDate]['tariffByVtypeAndSubJtype'][sVehicleType][subJourneyType] || null;
            },

            fnGetTariffByJtypeVType: function(jType, sVehicleType) {
                var oThis = this;

                return this.oLs[this.currentDate]['vehilcePackageByJtype'][jType][sVehicleType] || null;
            },
            fnFormatDate : function(sDate){
                if(!sDate || sDate.length < 10){
                    return this.fnFormatDate(this.currentDate);
                }

                var aD = sDate.split('-');
                return aD[2] + '/' + aD[1] + '/' + aD[0];
            },
            fnFormatDateOnDateObj : function(oDate){
                // takes the date object and returns js date
                var oThis = this;

                if(!oDate){
                    return oThis.fnFormatDate();
                }
                var yyyy = oDate.getFullYear().toString(),
                mm = (oDate.getMonth() + 1).toString(),
                dd = oDate.getDate().toString(),
                hr = oDate.getHours().toString(),
                mn = oDate.getMinutes().toString();

                return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + ' ' + hr + ':' + mn + ':00';

            },
            fnGetAdvancedDate : function(iCount){
                var oThis = this;
                if(!iCount || isNaN(iCount)) {
                    return oThis.fnFormatDate();
                }

                var oDt = new Date(),
                    oDt2 = new Date();

                oDt.setDate(oDt2.getDate()+iCount);

                var yyyy = oDt.getFullYear().toString(),
                    mm = (oDt.getMonth() + 1).toString(),
                    dd = oDt.getDate().toString();

                    return oThis.fnFormatDate(yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]));

            },
            formatToServerDate : function(sDate){
                if(sDate.length < 10){
                    return this.currentDate;
                }

                var aD = sDate.split('/');
                return aD[2] + '-' + aD[1] + '-' + aD[0];
            },

            fnFormatHours : function(sTime){
                if(!sTime || sTime.length < 8){
                    var oD = new Date();
                    return this.fnFormatHours(
                        (oD.getHours()<=9 ? '0'+oD.getHours() : oD.getHours()) 
                        + ':' 
                        + (oD.getMinutes() <=9? '0' + oD.getMinutes() : oD.getMinutes()) 
                        +':00'
                    );
                }
                var aD = sTime.split(':');
                return aD[0];
            },

            fnFormatMinutes : function(sTime){
                if(!sTime || sTime.length < 8){
                    var oD = new Date(),
                        sM = (oD.getMinutes() - (oD.getMinutes()%10) +  (oD.getMinutes()%10 + (10 - oD.getMinutes()%10 ))),
                        sM = (sM<60 ? sM : (sM - 10));

                    return this.fnFormatMinutes(
                        (oD.getHours()<=9 ? '0'+oD.getHours() : oD.getHours()) 
                        + ':' 
                        + sM
                        +':00'
                    );
                }
                var aD = sTime.split(':');
                return aD[1];
            },

            fnFormatMinutesToHoursAndMinutes: function(sMinutes) {
                var hours = Math.floor(((sMinutes * 60) % 86400) / 3600),
                    minutes = Math.floor((((sMinutes * 60) % 86400) % 3600) / 60);

                // prefix 0 if less than 10
                hours = (hours < 10) ? '0' + hours : hours;
                minutes = (minutes < 10) ? '0' + minutes : minutes;

                return hours + ":" + minutes;
            },

            fnDiffInTwoDatesForDisplay: function(oldDate, newDate) {
                // oldDate && newDate should be in milliseconds
                var difference = newDate - oldDate,
                    daysDifference, hoursDifference, minutesDifference,
                    str = '';

                // days
                daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
                difference -= daysDifference * 1000 * 60 * 60 * 24;
                if(daysDifference > 0) {
                    str += daysDifference + 'Days ';
                }

                // hours
                hoursDifference = Math.floor(difference / 1000 / 60 / 60);
                difference -= hoursDifference * 1000 * 60 * 60;
                str += hoursDifference + 'hrs ';

                // minutes
                minutesDifference = Math.floor(difference / 1000 / 60);
                difference -= minutesDifference * 1000 * 60;
                str += minutesDifference + 'mins';

                //var secondsDifference = Math.floor(difference / 1000);

                return str;
            },

            fnFormatRatingAndReturnClassArray: function(rating) {
                var ratingArray = [];
                rating = (isNaN(rating)) ? 0 : Math.round(rating); // check for number
                rating = (rating > 5) ? 5 : rating; // restricting for 5 point scale

                for (var i = 0; i < 5; i++) {
                    var cls = ((rating <= i) ? 'glyphicon-star-empty' : 'glyphicon-star');
                    ratingArray.push({
                        'cls': cls
                    });
                }

                //console.log(ratingArray);
                return ratingArray; // creating array for ng-repeat
            },

            fnGetBookingStatusName : function(sBookingStatusId){
                var aBs = this.oLs[this.currentDate]['bookingStates'],
                    iCount = aBs.length;

                for(var i=0;i<iCount;i++){
                    if(aBs[i].id == sBookingStatusId){
                        return aBs[i].bookingStatus;
                    }
                }
                return null;
            },
            fnGetBookingStatusOnIds : function() {
                // this function returns object with key as bookingStatusId and value as bookingStatus object
                var aBs = this.oLs[this.currentDate]['bookingStates'],
                    iCount = aBs.length,
                    aRtn = {};

                for(var i=0;i<iCount;i++){
                    aRtn[aBs[i].id] = aBs[i];
                }
                return aRtn;  
            },
            fnGetReasonsById : function(sCategoryId){
                var oThis = this;
                
                return oThis.oLs[oThis.currentDate]['reasonsByCategoryId'][sCategoryId];
            },
            fnStoreReasonsByCategoryId : function(){
                var oThis = this,
                    reasonByCat = {},
                    aReasons = oThis.oLs[oThis.currentDate]['reasons'];

                for (var i = 0, reasonsLength = aReasons.length; i < reasonsLength; i++) {
                    if(reasonByCat[aReasons[i].categoryId] == undefined) {
                       reasonByCat[aReasons[i].categoryId] = []; 
                    }
                    reasonByCat[aReasons[i].categoryId].push(aReasons[i]);
                };
                console.log(reasonByCat);

                oThis.fnAddToLocalStorage('reasonsByCategoryId', reasonByCat);

                return true;
            },
            fnSetAllLocations : function(){
                var oThis = this,
                    aLocations = oThis.oLs[oThis.currentDate]['allLocations'];

                oThis.fnAddToLocalStorage('allLocations', aLocations);

                return true;
            },
            fnGetAllLocations : function(){
                var oThis = this,
                    oLoc = oThis.oLs[oThis.currentDate]['allLocations'];

                if (!oLoc) {
                    alert('Problem in getting config data from server. Please contact server team immediately.');
                    return;
                }
                
                return oLoc;
            },
            // fnGetStatistics: function() {
            //     var oThis = this;
            //     //return oThis.oLs[oThis.currentDate]['statistics'];
            //     return oThis.oLs[oThis.currentDate]['statistics']['statistics'];
            // },
            fnGetVehicleNames : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['vehicleNames'];
            },
            fnGetDefaultVehicleName : function(sVt) {
                if(!sVt) {
                    return "";
                }

                var oThis = this,
                    aVNs = oThis.fnGetVehicleNames(),
                    iLen = aVNs.length;

                    for(var i=0;i<iLen;i++){
                        if(aVNs[i].vehicleType == sVt) {
                            return aVNs[i]; 
                        }
                    }

                return "";

            },
            fnGetCustomerCategories : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['customerCategories'];
            },
            fnGetCustomerCategoryById: function(sId) {
                var oThis = this,
                    oVt = oThis.oLs[oThis.currentDate]['customerCategories'],
                    oVtLength = oVt.length;

                for (var i = 0; i < oVtLength; i++) {
                    if (oVt[i].id == sId) {
                        return oVt[i];
                    }
                }
                return null;
            },
            fnGetVehicleTypeById: function(sId) {
                var oThis = this,
                    oVt = oThis.oLs[oThis.currentDate]['vehicleTypes'],
                    oVtLength = oVt.length;
                if (!oVt) {
                    alert('Problem in getting config data from server. Please contact server team immediately.');
                    return;
                }

                for (var i = 0; i < oVtLength; i++) {
                    if (oVt[i].id == sId) {
                        return oVt[i];
                    }
                }
                return null;
            },
            fnGetAllVehicleStatus : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['vehicleStates'];
            },
            fnGetVehicleStatusById: function(sId) {
                var oThis = this,
                    oVt = oThis.oLs[oThis.currentDate]['vehicleStates'],
                    oVtLength = oVt.length;

                for (var i = 0; i < oVtLength; i++) {
                    if (oVt[i].id == sId) {
                        return oVt[i].vehicleStatus;
                    }
                }
                return null;
            },
            fnGetVehicleDisplayTypeById : function(sId){
                var oThis=  this,
                    oVt = oThis.oLs[oThis.currentDate]['vehicleTypes'];
                    if(!oVt){
                        alert('Problem in getting config data from server. Please contact server team immediately.');
                        return;
                    }

                for(var i=0;i<oVt.length;i++){
                    if(oVt[i].id == sId){
                        return oVt[i].vehicleType;
                    }
                }
                return null;
            },
            fnGetVehicleTypesOnIds : function(){
                var oThis=  this,
                    oVt = oThis.oLs[oThis.currentDate]['vehicleTypes'],
                    aRtn = {};
                    
                for(var i=0;i<oVt.length;i++){
                    aRtn[oVt[i].id] = oVt[i];
                }
                
                return aRtn;
            },
            fnGetVehicleNameById : function(sId){
                var oThis = this,
                    oVn = oThis.oLs[oThis.currentDate]['vehicleNames'],
                    oVnLength = oVn.length;
                for(var i=0;i<oVnLength;i++){
                    if(oVn[i].id == sId){
                        return oVn[i];
                    }
                }
                return null;
            },
            fnGetVehicleDisplayNameById: function(sId) {
                var oThis = this,
                    oVn = oThis.oLs[oThis.currentDate]['vehicleNames'],
                    oVnLength = oVn.length;
                for(var i=0;i<oVnLength;i++){
                    if (oVn[i].id == sId) {
                        return oVn[i].vehicleName;
                    }
                }
                return null;
            },
            fnGetVehicleNamesByIds : function() {
                // this function returns an object with key as vehicleId and value as vehicleObject
                var oThis = this,
                    oVn = oThis.oLs[oThis.currentDate]['vehicleNames'],
                    oVnLength = oVn.length,
                    oRtn = {};

                for(var i=0;i<oVnLength;i++){
                    oRtn[oVn[i].id] = oVn[i];
                }
                return oRtn;
            },
            fnGetVehicleConditionTextById: function(sId) {
                var oThis = this,
                    oVcondition = oThis.fnGetVehicleConditionTypes(),
                    oVconditionLength = oVcondition.length;
                for (var i = 0; i < oVconditionLength; i++) {
                    if (oVcondition[i].id == sId) {
                        return oVcondition[i].condition;
                    }
                }
                return null;
            },
            fnGetVehicleStatusTextById: function(sId) {
                var oThis = this,
                    oVs = oThis.fnGetStatusTypes(),
                    oVsLength = oVs.length;
                for (var i = 0; i < oVsLength; i++) {
                    if (oVs[i].id == sId) {
                        return oVs[i].status;
                    }
                }
                return null;
            },
            
            getDispositionTypes : function(sId){
                var aRtn = [{
                    id: PreConfigService.BOOKING_ENQUIRY,
                    dispositionName : 'Enquiry'
                }, {
                    id: PreConfigService.BOOKING_FOLLOW_UP,
                    dispositionName : 'Follow-up'
                }, {
                    id: PreConfigService.BOOKING_REJECTED,
                    dispositionName : 'Rejected'
                }];
                return aRtn;
            },
            fnGetCancelBookingCategory : function(sId){
                var aRtn = [{
                    id: 1, 
                    categoryName : 'Customer'
                }, {
                    id: 2,
                    categoryName : 'Dispatcher'
                }, {
                    id: 3,
                    categoryName : 'Call-Taker'
                }, {
                    id: 4,
                    categoryName : 'Driver'
                }];
                return aRtn;
            },

            fnFormatBookingHistoryData : function(aData, oCustomer){
                var oThis = this,
                    oRtn = [],
                    iCount = aData.length;
                for(var i=0;i<iCount;i++){
                    var oBh = aData[i];
                    oBh.srno = (i+1);
                    oBh.bookingStatusName = oThis.fnGetBookingStatusName(oBh.bookingStatus);
                    oBh.bookingDisplayDate = oThis.fnFormatDate(oBh.bookingDate) +' '+ oThis.fnFormatHours(oBh.bookingTime)+':'+ oThis.fnFormatMinutes(oBh.bookingTime);
                    oBh.pickupDisplayDateAndTime = oThis.fnFormatDate(oBh.pickupDate) + ' ' + oThis.fnFormatHours(oBh.pickupTime) + ':' + oThis.fnFormatMinutes(oBh.pickupTime);
                    oBh.primaryPassenger = oCustomer ? oCustomer.name : '-'
                    oBh.subJourneyTypeName = oThis.fnGetSubJourneyObjectById(oBh.subJourneyType) ? oThis.fnGetSubJourneyObjectById(oBh.subJourneyType)['journeyType'] : "";
                    oBh.vehicleDisplayType = oThis.fnGetVehicleDisplayTypeById(oBh.vehicleType);
                    oBh.vehicleDisplayName = oThis.fnGetVehicleDisplayNameById(oBh.vehicleName) || '';
                    oRtn.push(oBh);
                }
                return oRtn;
            },
            fnGetCallTime : function(){
                var oD = new Date(),
                    sH = oD.getHours(),
                    sM = oD.getMinutes(),
                    sS = oD.getSeconds();

                return ((sH <=9? '0' + sH: sH) + ':' + (sM <=9? '0' + sM: sM) + ':' + (sS <=9? '0' + sS: sS));
            },
            fnGetGradeById : function(sId){
                var oThis = this,
                    oG = oThis.oLs[oThis.currentDate]['grades'];
                for(var i=0;i<oG.length;i++){
                    if(oG[i].id == sId){
                        return oG[i];
                    }
                }
                return null;
            },

            fnGetTravelTypes : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['travelTypes'];
            },
            fnGetVehicleConditionTypes: function() {
                var oData = [{
                    "id": "1",
                    "condition": "ok"
                }, {
                    "id": "2",
                    "condition": "Acceptable"
                }, {
                    "id": "3",
                    "condition": "Need to Change"
                }];
                return oData;
            },
            fnGetStatusTypes: function() {
                var oData = [{
                    "id": "1",
                    "status": "Active"
                }, {
                    "id": "2",
                    "status": "In Active"
                }];
                return oData;
            },
            fnGetTariffById : function(sId){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['tariffById'][sId];
            },

            
            insuranceType: [{
                "title": "Full",
                "type": "1"
            }, {
                "title": "Comprehensive",
                "type": "2"
            }, {
                "title": "Third-Party",
                "type": "3"
            }],
            roadTaxType: [{
                "title": "Quarterly",
                "type": "1"
            }, {
                "title": "Half-Yearly",
                "type": "2"
            }, {
                "title": "Yearly",
                "type": "3"
            }, {
                "title": "Life-Tax",
                "type": "4"
            }],

            fnFormatVehicleAvailabilityData : function(oData, sVehicleType) {
                // returns proper vehicleData array to show in the grid.
                // if send param is supplied than return an object {summary: [properData], color: <Number>}
                var oVt = this.fnGetVehicleTypes(),
                    iCount = oData.length,
                    iVtCount = oVt.length,
                    aR = [],
                    aReturn = [],
                    sColor = '';

                for(var i=0;i<iCount;i++){
                    aReturn[i] = {
                        type : oData[i].state
                    };
                    for(var j=0;j<iVtCount;j++){
                        if(oData[i].state == 'Color Code'){                            
                            if(oData[i][oVt[j].id] < 0){
                                aReturn[i]['vehicleType' + oVt[j].id] = PreConfigService.VEHICLE_NOT_AVAILABLE_COLOR;
                            } else if(oData[i][oVt[j].id] == 0){
                                aReturn[i]['vehicleType' + oVt[j].id] = PreConfigService.VEHICLE_PROBABLILY_AVAILABLE_COLOR;
                            } else if(oData[i][oVt[j].id] > 0){
                                aReturn[i]['vehicleType' + oVt[j].id] = PreConfigService.VEHICLE_AVAILABLE_COLOR;
                            }
                            if(sVehicleType && parseInt(oVt[j].id) == parseInt(sVehicleType)){
                                sColor = aReturn[i]['vehicleType' + oVt[j].id];
                            }
                        } else {
                            aReturn[i]['vehicleType' + oVt[j].id] = oData[i][oVt[j].id];
                        }
                    }
                }
                angular.copy(aReturn,aR);

                return sVehicleType ? {'summary' : aR, 'color': sColor} : {'summary' : aR};
            },

            fnGetGenders : function() {
                return {
                    'm' : 'Male',
                    'f' : 'Female'
                }
            },
            fnGetMaritalStates : function() {
                return {
                    '1' : 'Single',
                    '2' : 'Married',
                    '3' : 'Divorced',
                    "4": "widow / Widower"
                }
            },

            fnSetAttachmentTypes: function() {
                var oThis = this,
                    aAttachTypes = oThis.oLs[oThis.currentDate]['attachmentTypes'],
                    oData = {};

                for (var i = 0; i < aAttachTypes.length; i++) {
                    var obj = aAttachTypes[i];

                    oData[obj.id] = obj;
                }

                oThis.fnAddToLocalStorage('attachmentTypesById', oData);

                return true;
            },
            fnGetAttachmentTypes : function() {
                var oThis = this;

                return oThis.oLs[oThis.currentDate]['attachmentTypes'] || [];
            },
            fnGetAttachmentTypeById : function(sId) {
                var oThis = this;

                return oThis.oLs[oThis.currentDate]['attachmentTypesById'][sId];
            },
            fnGetVehicleManufacturingYears : function(){
                var aRtn = {'' : 'select'},
                    oD = new Date();
                for(var i=(oD.getFullYear() - 15); i <= oD.getFullYear() ; i++){
                    aRtn[i] = i;
                }
                return aRtn;
            },
            fnGetSearchByTypes : function(){
                return [{
                    id : '',
                    title : '----Select----'
                }, {
                    id : '1',
                    title : 'Mobile'
                }, {
                    id : '2',
                    title : 'Booking ID'
                }, {
                    id : '3',
                    title : 'Customer ID'
                }, {
                    id : '4',
                    title : 'Vehicle ID'
                }, {
                    id : '5',
                    title : 'Trip Count'
                }, {
                    id : '6',
                    title : 'Grade'
                }, {
                    id : '7',
                    title : 'Category'
                }];
            },

            fnValidateBookingTime : function(sDate,  sTm) {

                var oThis = this,
                    aDt = sDate.split('-'),
                    aTm = sTm.split(':'),
                   //  sPkTm = sDate + ' ' + sTm,
                    oPkDt = new Date(aDt[0], parseInt(aDt[1])- 1, aDt[2], aTm[0], aTm[1],0,0),
                    oCDt = new Date();

                console.log('oCDt : ',oCDt);
                console.log('oPkDt : ',oPkDt);
                console.log(parseInt(oCDt.getTime() + 1200000) + ' <=' ,oPkDt.getTime());
                if(parseInt(oCDt.getTime() + 1200000)  < oPkDt.getTime() ){
                    return true;
                }

                return false;

            },
            fnGetVacantTimes : function() {
                return [{
                    title : '30min',
                    id: '30'
                }, {
                    title : '45min',
                    id: '45'
                }, {
                    title : '1hr',
                    id: '60'
                }, {
                    title : '1hr 30min',
                    id: '90'
                }, {
                    title : '2hr',
                    id: '120'
                }];
            },

            // fnGetLatLon : function(aPlaces) {
            //     // function returns array of latLon objects as per 
            //     return [];
            // },
            fnGetLocationsByNames : function(aPlaces) {
                // returns locationObjects based on the same order as aPlaces
                var aRtn = [],
                    oThis = this,
                    oLoc = oThis.oLs[oThis.currentDate]['allLocations'];

                for(var i=0;i<oLoc.length;i++){
                    for(var j=0;j<aPlaces.length;j++){
                        if(aPlaces[j] == oLoc[i].location){
                            aRtn.push(oLoc[i]);
                        }
                    }
                }

                return aRtn;
            },
            fnGetSpecialRequestTypes : function() {
                var oThis = this;

                return oThis.oLs[oThis.currentDate]['specialRequests'];
            },
            fnGetSpecialRequestTypesById: function(sReqId) {
                var oThis = this,
                    aSplReq = oThis.oLs[oThis.currentDate]['specialRequests'],
                    sSplReqText = '';

                for (var i = 0; i < aSplReq.length; i++) {
                    if (aSplReq[i].id == sReqId) {
                        sSplReqText = aSplReq[i].value;

                        break;
                    }
                }
                return sSplReqText;
            },
            fnGetFeedbackRatings : function(){
                return {
                    '1' : '1 - Poor',
                    '2' : '2 - Average',
                    '3' : '3 - Good',
                    '4' : '4 - Very Good',
                    '5' : '5 - Excellent'
                };
            },
            fnCheckValidMobile : function(sMobile) {
                // returns last 10 digits of the passed number
                if(!sMobile){
                    return '';
                }

                if(sMobile.length <= 10){
                    return sMobile;
                }

                return sMobile.slice(-10);
            },


            /* Old settings. will be deleted later */
            isPrimaryTraveller: {
                '0': 'No',
                '1': 'Yes'
            },
            paymentModes: {
                '1': 'Cash',
                '2': 'Card'
            },
            userTypes: {
                '1': 'Client',
                '2': 'Owner',
                '3': 'Driver',
                '4': 'Dispatcher',
                '5': 'Call-Taker',
                '6': 'Admin',
                '7': 'Super-Admin',
                '8': 'Quality Analyst',
                '9': 'Team Leader',
                '91': 'Manager'
            },
            userJobCategoriesNames: {
                '1': 'Permanant',
                '2': 'Contract'
            },
            userJobCategories: [{
                'type': '1',
                'title': 'Permanant'
            }, {
                'type': '2',
                'title': 'Contract'
            }],
            
            fnGetVehicleTypes : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['vehicleTypes'];
            },
            vehicleAttachmentTypeNames: {
                '1': '[COV] Operated by Company',
                '2': '[COV] Leased to Driver',
                '3': '[LV] Operated by Company',
                '4': '[LV] Sub-leased to Driver',
                '5': '[AV] Operated by Self [Driver-Owner]',
                '6': '[AV] Operated by Other Driver'
            },
            vehicleAttachmentTypeOptions: [{
                'type': '1',
                'attachmentCategory': 'Company Owned Vehicle [COV]',
                'name': '[COV] Operated by Company'
            }, {
                'type': '2',
                'attachmentCategory': 'Company Owned Vehicle [COV]',
                'name': '[COV] Leased to Driver'
            }, {
                'type': '3',
                'attachmentCategory': 'Leased Vehicle [LV]',
                'name': '[LV] Operated by Company'
            }, {
                'type': '4',
                'attachmentCategory': 'Leased Vehicle [LV]',
                'name': '[LV] Sub-leased to Driver'
            }, {
                'type': '5',
                'attachmentCategory': 'Attached Vehicle [AV]',
                'name': '[AV] Operated by Self [Driver-Owner]'
            }, {
                'type': '6',
                'attachmentCategory': 'Attached Vehicle [AV]',
                'name': '[AV] Operated by Other Driver'
            }],
            carrierTypes: [{
                "title": "No-Carrier",
                "type": "1"
            }, {
                "title": "Open Carrier",
                "type": "2"
            }, {
                "title": "Carrier With Lock",
                "type": "3"
            }],
            permitType: [{
                "title": "Full",
                "type": "1"
            }, {
                "title": "Composite",
                "type": "2"
            }],
            premiumType: [{
                "title": "Full",
                "type": "1"
            }, {
                "title": "Composite",
                "type": "2"
            }],
            dentAndScratchType: [{
                "title": "Dent",
                "type": "1"
            }, {
                "title": "Scratch",
                "type": "2"
            }],
            dentAndScratchSeverityType: [{
                "title": "Low",
                "type": "1"
            }, {
                "title": "Normal",
                "type": "2"
            }, {
                "title": "Heavy",
                "type": "3"
            }],
            billingSystemTypes: [{
                "title": "Company Cutomized",
                "type": "1"
            }, {
                "title": "Regular",
                "type": "2"
            }],
            companyBrandingOptions: [{
                "title": "Yes",
                "type": true
            }, {
                "title": "No",
                "type": false
            }],
            entertainmentOptions: [{
                "title": "Yes",
                "type": true
            }, {
                "title": "No",
                "type": false
            }],
            luggageTypes: [{
                "title": "No-Luggage",
                "type": '1'
            }, {
                "title": "Medium-Luggage",
                "type": '2'
            }, {
                "title": "Heavy-Luggage",
                "type": '3'
            }],
            customerFields: {
                'email': 'Email',
                'altMobile': 'Alt. Mobile',
                'source': 'Source',
                'dob': 'DOB'
            },
            customerFieldTypes: {
                'email': 'text',
                'altMobile': 'text',
                'source': 'text',
                'dob': 'text'
            },
            pickupPlaceTypes: [{
                title: 'Home',
                type: '1'
            }, {
                title: 'Office',
                type: '2'
            }]
             /* EOF : Old settings. will be deleted later */
        }

    });