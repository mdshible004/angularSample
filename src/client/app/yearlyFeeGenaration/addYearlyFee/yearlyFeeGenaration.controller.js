(function () {
    'use strict';

    angular
        .module('app.yearlyFeeGenaration')
        .controller('YearlyFeeGenarationController', YearlyFeeGenarationController);

    YearlyFeeGenarationController.$inject = ['subjectSettingsSevice', 'commonService', 'yearlyFeeGenerationService', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function YearlyFeeGenarationController(subjectSettingsSevice, commonService, yearlyFeeGenerationService, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        var vm = this;
        vm.yearlyData = [];
        vm.jan = [];
        vm.feb = [];
        vm.mar = [];
        vm.apr = [];
        vm.may = [];
        vm.june = [];
        vm.july = [];
        vm.aug = [];
        vm.sep = [];
        vm.oct = [];
        vm.nov = [];
        vm.dec = [];
        $scope.IsShowMonthJan = true;
        $scope.openFeesTabIndex = function (index) {
            $scope.disSave = false;
            $scope.disButton = false;
            $scope.value = index;
            $scope.Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ShiftID: vm.shift === undefined ? 0 : vm.shift.selected.ShiftID,
                MediumID: vm.medium === undefined ? 0 : vm.medium.selected.MediumID,
                ClassID: vm.class === undefined ? 0 : vm.class.selected.ClassID,
                DepartmentID: vm.department === undefined ? 0 : vm.department.selected.DepartmentID,
                MonthID: $scope.value === undefined ? 1 : $scope.value + 1

            };
            yearlyFeeGenerationService.getInsYearlyFees($scope.Params)
                .then(function (data) {
                    vm.yearlyFees = data;
                    vm.matchActive = [];
                    vm.masterExist = [];
                    for (var i = 0; i < data.length; i++) {
                        vm.matchActive[i] = data[i].IsActive;
                        if (parseInt(data[i].FeeGenID) > 0) {
                            vm.masterExist[i] = data[i].FeeGenID;
                        }

                    }
                    switch ($scope.value) {
                        case 0:
                            vm.matchActiveJan = [];
                            vm.matchActiveJan = vm.matchActive;

                            break;
                        case 1:
                            vm.matchActiveFeb = [];
                            vm.matchActiveFeb = vm.matchActive;
                            break;
                        case 2:
                            vm.matchActiveMar = [];
                            vm.matchActiveMar = vm.matchActive;
                            break;
                        case 3:
                            vm.matchActiveApr = [];
                            vm.matchActiveApr = vm.matchActive;
                            break;
                        case 4:
                            vm.matchActiveMay = [];
                            vm.matchActiveMay = vm.matchActive;
                            break;
                        case 5:
                            vm.matchActiveJune = [];
                            vm.matchActiveJune = vm.matchActive;
                            break;
                        case 6:
                            vm.matchActiveJuly = [];
                            vm.matchActiveJuly = vm.matchActive;
                            break;
                        case 7:
                            vm.matchActiveAug = [];
                            vm.matchActiveAug = vm.matchActive;
                            break;
                        case 8:
                            vm.matchActiveSep = [];
                            vm.matchActiveSep = vm.matchActive;
                            break;
                        case 9:
                            vm.matchActiveOct = [];
                            vm.matchActiveOct = vm.matchActive;
                            break;
                        case 10:
                            vm.matchActiveNov = [];
                            vm.matchActiveNov = vm.matchActive;
                            break;
                        case 11:
                            vm.matchActiveDec = [];
                            vm.matchActiveDec = vm.matchActive;
                            break;
                    }
                    vm.ab();
                })
                .catch(function (error) { });
        };




        vm.ab = function () {


            switch ($scope.value) {
                case 0:
                    vm.jan = [];
                    for (var i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValJan = vm.yearlyFees[i];
                        var newRowYearlyFeesValue = [];

                        if (vm.jan.length === 0) {
                            newRowYearlyFeesValue = [{
                                'FeeGenID': yearlyFeesValJan.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValJan.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValJan.FeesSetupID,
                                'FeesTypeID': yearlyFeesValJan.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValJan.InsFeesHeadID,
                                'IsActive': yearlyFeesValJan.IsActive,
                                'Fee': yearlyFeesValJan.Fee,
                                'FeesType': yearlyFeesValJan.FeesType,
                                'FeesHead': yearlyFeesValJan.FeesHead
                            }];
                        }
                        else {
                            vm.jan[0].forEach(function (row) { 
                                newRowYearlyFeesValue.push(
                                    {
                                        'FeeGenID': yearlyFeesValJan.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValJan.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValJan.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValJan.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValJan.InsFeesHeadID,
                                        'IsActive': yearlyFeesValJan.IsActive,
                                        'Fee': yearlyFeesValJan.Fee,
                                        'FeesType': yearlyFeesValJan.FeesType,
                                        'FeesHead': yearlyFeesValJan.FeesHead
                                    }
                                );
                            });
                        }
                        vm.jan.push(newRowYearlyFeesValue);


                    }
                    $scope.totalArr[0] = 0;
                    for (var k = 0; k < vm.jan.length; k++) {
                        if (vm.jan[k][0].IsActive === 1 || vm.jan[k][0].IsActive === true) {
                            $scope.totalArr[0] += vm.jan[k][0].Fee;

                        }

                    }
                    $scope.showItem = true;
                    break;
                case 1:
                    vm.feb = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValFeb = vm.yearlyFees[i];
                        var newRowYearlyFeesValuefeb = [];
                        if (vm.feb.length === 0) {
                            newRowYearlyFeesValuefeb = [{
                                'FeeGenID': yearlyFeesValFeb.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValFeb.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValFeb.FeesSetupID,
                                'FeesTypeID': yearlyFeesValFeb.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValFeb.InsFeesHeadID,
                                'IsActive': yearlyFeesValFeb.IsActive,
                                'Fee': yearlyFeesValFeb.Fee,
                                'FeesType': yearlyFeesValFeb.FeesType,
                                'FeesHead': yearlyFeesValFeb.FeesHead
                            }];
                        }
                        else { 
                            vm.feb[0].forEach(function (row) { 
                                newRowYearlyFeesValuefeb.push(
                                    {
                                        'FeeGenID': yearlyFeesValFeb.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValFeb.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValFeb.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValFeb.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValFeb.InsFeesHeadID,
                                        'IsActive': yearlyFeesValFeb.IsActive,
                                        'Fee': yearlyFeesValFeb.Fee,
                                        'FeesType': yearlyFeesValFeb.FeesType,
                                        'FeesHead': yearlyFeesValFeb.FeesHead
                                    }
                                );
                            });
                        }
                        vm.feb.push(newRowYearlyFeesValuefeb);

                    }
                    $scope.totalArr[1] = 0;
                    for ( k = 0; k < vm.feb.length; k++) { 
                        if (vm.feb[k][0].IsActive === 1 || vm.feb[k][0].IsActive === true) {
                            $scope.totalArr[1] += vm.feb[k][0].Fee;
                        }
                    }
                    break;

                case 2:
                    vm.mar = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValMar = vm.yearlyFees[i];
                        var newRowYearlyFeesValuemar = [];
                        if (vm.mar.length === 0) {
                            newRowYearlyFeesValuemar = [{
                                'FeeGenID': yearlyFeesValMar.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValMar.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValMar.FeesSetupID,
                                'FeesTypeID': yearlyFeesValMar.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValMar.InsFeesHeadID,
                                'IsActive': yearlyFeesValMar.IsActive,
                                'Fee': yearlyFeesValMar.Fee,
                                'FeesType': yearlyFeesValMar.FeesType,
                                'FeesHead': yearlyFeesValMar.FeesHead
                            }];
                        }
                        else {
                            vm.mar[0].forEach(function (row) { 
                                newRowYearlyFeesValuemar.push(
                                    {
                                        'FeeGenID': yearlyFeesValMar.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValMar.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValMar.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValMar.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValMar.InsFeesHeadID,
                                        'IsActive': yearlyFeesValMar.IsActive,
                                        'Fee': yearlyFeesValMar.Fee,
                                        'FeesType': yearlyFeesValMar.FeesType,
                                        'FeesHead': yearlyFeesValMar.FeesHead
                                    }
                                );
                            });
                        }

                        vm.mar.push(newRowYearlyFeesValuemar);
                    }
                    $scope.totalArr[2] = 0;
                    for ( k = 0; k < vm.mar.length; k++) { 
                        if (vm.mar[k][0].IsActive === 1 || vm.mar[k][0].IsActive === true) {
                            $scope.totalArr[2] += vm.mar[k][0].Fee;
                        }
                    }
                    break;

                case 3:
                    vm.apr = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValApr = vm.yearlyFees[i];
                        var newRowYearlyFeesValueapr = [];
                        if (vm.apr.length === 0) {
                            newRowYearlyFeesValueapr = [{
                                'FeeGenID': yearlyFeesValApr.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValApr.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValApr.FeesSetupID,
                                'FeesTypeID': yearlyFeesValApr.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValApr.InsFeesHeadID,
                                'IsActive': yearlyFeesValApr.IsActive,
                                'Fee': yearlyFeesValApr.Fee,
                                'FeesType': yearlyFeesValApr.FeesType,
                                'FeesHead': yearlyFeesValApr.FeesHead
                            }];
                        }
                        else {
                            vm.apr[0].forEach(function (row) { 
                                newRowYearlyFeesValueapr.push(
                                    {
                                        'FeeGenID': yearlyFeesValApr.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValApr.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValApr.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValApr.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValApr.InsFeesHeadID,
                                        'IsActive': yearlyFeesValApr.IsActive,
                                        'Fee': yearlyFeesValApr.Fee,
                                        'FeesType': yearlyFeesValApr.FeesType,
                                        'FeesHead': yearlyFeesValApr.FeesHead
                                    }
                                );
                            });
                        }

                        vm.apr.push(newRowYearlyFeesValueapr);
                    }
                    $scope.totalArr[3] = 0;
                    for ( k = 0; k < vm.apr.length; k++) { 
                        if (vm.apr[k][0].IsActive === 1 || vm.apr[k][0].IsActive === true) {
                            $scope.totalArr[3] += vm.apr[k][0].Fee;
                        }
                    }
                    break;

                case 4:
                    vm.may = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValMay = vm.yearlyFees[i];
                        var newRowYearlyFeesValuemay = [];
                        if (vm.may.length === 0) {
                            newRowYearlyFeesValuemay = [{
                                'FeeGenID': yearlyFeesValMay.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValMay.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValMay.FeesSetupID,
                                'FeesTypeID': yearlyFeesValMay.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValMay.InsFeesHeadID,
                                'IsActive': yearlyFeesValMay.IsActive,
                                'Fee': yearlyFeesValMay.Fee,
                                'FeesType': yearlyFeesValMay.FeesType,
                                'FeesHead': yearlyFeesValMay.FeesHead
                            }];
                        }
                        else {
                            vm.may[0].forEach(function (row) { 
                                newRowYearlyFeesValuemay.push(
                                    {
                                        'FeeGenID': yearlyFeesValMay.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValMay.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValMay.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValMay.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValMay.InsFeesHeadID,
                                        'IsActive': yearlyFeesValMay.IsActive,
                                        'Fee': yearlyFeesValMay.Fee,
                                        'FeesType': yearlyFeesValMay.FeesType,
                                        'FeesHead': yearlyFeesValMay.FeesHead
                                    }
                                );
                            });
                        }
                        vm.may.push(newRowYearlyFeesValuemay);

                    }
                    $scope.totalArr[4] = 0;
                    for ( k = 0; k < vm.may.length; k++) { 
                        if (vm.may[k][0].IsActive === 1 || vm.may[k][0].IsActive === true) {
                            $scope.totalArr[4] += vm.may[k][0].Fee;
                        }
                    }
                    break;

                case 5:
                    vm.june = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValJune = vm.yearlyFees[i];
                        var newRowYearlyFeesValuejune = [];
                        if (vm.june.length === 0) {
                            newRowYearlyFeesValuejune = [{
                                'FeeGenID': yearlyFeesValJune.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValJune.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValJune.FeesSetupID,
                                'FeesTypeID': yearlyFeesValJune.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValJune.InsFeesHeadID,
                                'IsActive': yearlyFeesValJune.IsActive,
                                'Fee': yearlyFeesValJune.Fee,
                                'FeesType': yearlyFeesValJune.FeesType,
                                'FeesHead': yearlyFeesValJune.FeesHead
                            }];
                        }
                        else {
                            vm.june[0].forEach(function (row) { 
                                newRowYearlyFeesValuejune.push(
                                    {
                                        'FeeGenID': yearlyFeesValJune.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValJune.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValJune.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValJune.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValJune.InsFeesHeadID,
                                        'IsActive': yearlyFeesValJune.IsActive,
                                        'Fee': yearlyFeesValJune.Fee,
                                        'FeesType': yearlyFeesValJune.FeesType,
                                        'FeesHead': yearlyFeesValJune.FeesHead
                                    }
                                );
                            });
                        }

                        vm.june.push(newRowYearlyFeesValuejune);
                    }
                    $scope.totalArr[5] = 0;
                    for ( k = 0; k < vm.june.length; k++) { 
                        if (vm.june[k][0].IsActive === 1 || vm.june[k][0].IsActive === true) {
                            $scope.totalArr[5] += vm.june[k][0].Fee;
                        }
                    }
                    break;

                case 6:
                    vm.july = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValJuly = vm.yearlyFees[i];
                        var newRowYearlyFeesValuejuly = [];
                        if (vm.july.length === 0) {
                            newRowYearlyFeesValuejuly = [{
                                'FeeGenID': yearlyFeesValJuly.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValJuly.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValJuly.FeesSetupID,
                                'FeesTypeID': yearlyFeesValJuly.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValJuly.InsFeesHeadID,
                                'IsActive': yearlyFeesValJuly.IsActive,
                                'Fee': yearlyFeesValJuly.Fee,
                                'FeesType': yearlyFeesValJuly.FeesType,
                                'FeesHead': yearlyFeesValJuly.FeesHead
                            }];
                        }
                        else {
                            vm.july[0].forEach(function (row) { 
                                newRowYearlyFeesValuejuly.push(
                                    {
                                        'FeeGenID': yearlyFeesValJuly.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValJuly.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValJuly.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValJuly.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValJuly.InsFeesHeadID,
                                        'IsActive': yearlyFeesValJuly.IsActive,
                                        'Fee': yearlyFeesValJuly.Fee,
                                        'FeesType': yearlyFeesValJuly.FeesType,
                                        'FeesHead': yearlyFeesValJuly.FeesHead
                                    }
                                );
                            });
                        }
                        vm.july.push(newRowYearlyFeesValuejuly);
                    }
                    $scope.totalArr[6] = 0;
                    for ( k = 0; k < vm.july.length; k++) { 
                        if (vm.july[k][0].IsActive === 1 || vm.july[k][0].IsActive === true) {
                            $scope.totalArr[6] += vm.july[k][0].Fee;
                        }
                    }
                    break;
                case 7:
                    vm.aug = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValAug = vm.yearlyFees[i];
                        var newRowYearlyFeesValueaug = [];
                        if (vm.aug.length === 0) {
                            newRowYearlyFeesValueaug = [{
                                'FeeGenID': yearlyFeesValAug.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValAug.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValAug.FeesSetupID,
                                'FeesTypeID': yearlyFeesValAug.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValAug.InsFeesHeadID,
                                'IsActive': yearlyFeesValAug.IsActive,
                                'Fee': yearlyFeesValAug.Fee,
                                'FeesType': yearlyFeesValAug.FeesType,
                                'FeesHead': yearlyFeesValAug.FeesHead
                            }];
                        }
                        else {
                            vm.aug[0].forEach(function (row) { 
                                newRowYearlyFeesValueaug.push(
                                    {
                                        'FeeGenID': yearlyFeesValAug.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValAug.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValAug.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValAug.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValAug.InsFeesHeadID,
                                        'IsActive': yearlyFeesValAug.IsActive,
                                        'Fee': yearlyFeesValAug.Fee,
                                        'FeesType': yearlyFeesValAug.FeesType,
                                        'FeesHead': yearlyFeesValAug.FeesHead
                                    }
                                );
                            });
                        }
                        vm.aug.push(newRowYearlyFeesValueaug);
                    }
                    $scope.totalArr[7] = 0;
                    for ( k = 0; k < vm.aug.length; k++) { 
                        if (vm.aug[k][0].IsActive === 1 || vm.aug[k][0].IsActive === true) {
                            $scope.totalArr[7] += vm.aug[k][0].Fee;
                        }
                    }
                    break;
                case 8:
                    vm.sep = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValSep = vm.yearlyFees[i];
                        var newRowYearlyFeesValuesep = [];
                        if (vm.sep.length === 0) {
                            newRowYearlyFeesValuesep = [{
                                'FeeGenID': yearlyFeesValSep.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValSep.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValSep.FeesSetupID,
                                'FeesTypeID': yearlyFeesValSep.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValSep.InsFeesHeadID,
                                'IsActive': yearlyFeesValSep.IsActive,
                                'Fee': yearlyFeesValSep.Fee,
                                'FeesType': yearlyFeesValSep.FeesType,
                                'FeesHead': yearlyFeesValSep.FeesHead
                            }];
                        }
                        else {
                            vm.sep[0].forEach(function (row) { 
                                newRowYearlyFeesValuesep.push(
                                    {
                                        'FeeGenID': yearlyFeesValSep.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValSep.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValSep.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValSep.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValSep.InsFeesHeadID,
                                        'IsActive': yearlyFeesValSep.IsActive,
                                        'Fee': yearlyFeesValSep.Fee,
                                        'FeesType': yearlyFeesValSep.FeesType,
                                        'FeesHead': yearlyFeesValSep.FeesHead
                                    }
                                );
                            });
                        }
                        vm.sep.push(newRowYearlyFeesValuesep);
                    }
                    $scope.totalArr[8] = 0;
                    for ( k = 0; k < vm.sep.length; k++) { 
                        if (vm.sep[k][0].IsActive === 1 || vm.sep[k][0].IsActive === true) {
                            $scope.totalArr[8] += vm.sep[k][0].Fee;
                        }
                    }
                    break;
                case 9:
                    vm.oct = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValOct = vm.yearlyFees[i];
                        var newRowYearlyFeesValueoct = [];
                        if (vm.oct.length === 0) {
                            newRowYearlyFeesValueoct = [{
                                'FeeGenID': yearlyFeesValOct.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValOct.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValOct.FeesSetupID,
                                'FeesTypeID': yearlyFeesValOct.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValOct.InsFeesHeadID,
                                'IsActive': yearlyFeesValOct.IsActive,
                                'Fee': yearlyFeesValOct.Fee,
                                'FeesType': yearlyFeesValOct.FeesType,
                                'FeesHead': yearlyFeesValOct.FeesHead
                            }];
                        }
                        else {
                            vm.oct[0].forEach(function (row) { 
                                newRowYearlyFeesValueoct.push(
                                    {
                                        'FeeGenID': yearlyFeesValOct.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValOct.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValOct.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValOct.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValOct.InsFeesHeadID,
                                        'IsActive': yearlyFeesValOct.IsActive,
                                        'Fee': yearlyFeesValOct.Fee,
                                        'FeesType': yearlyFeesValOct.FeesType,
                                        'FeesHead': yearlyFeesValOct.FeesHead
                                    }
                                );
                            });
                        }
                        vm.oct.push(newRowYearlyFeesValueoct);
                    }
                    $scope.totalArr[9] = 0;
                    for ( k = 0; k < vm.oct.length; k++) { 
                        if (vm.oct[k][0].IsActive === 1 || vm.oct[k][0].IsActive === true) {
                            $scope.totalArr[9] += vm.oct[k][0].Fee;
                        }
                    }
                    break;
                case 10:
                    vm.nov = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValNov = vm.yearlyFees[i];
                        var newRowYearlyFeesValuenov = [];
                        if (vm.nov.length === 0) {
                            newRowYearlyFeesValuenov = [{
                                'FeeGenID': yearlyFeesValNov.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValNov.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValNov.FeesSetupID,
                                'FeesTypeID': yearlyFeesValNov.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValNov.InsFeesHeadID,
                                'IsActive': yearlyFeesValNov.IsActive,
                                'Fee': yearlyFeesValNov.Fee,
                                'FeesType': yearlyFeesValNov.FeesType,
                                'FeesHead': yearlyFeesValNov.FeesHead
                            }];
                        }
                        else {
                            vm.nov[0].forEach(function (row) {
                                newRowYearlyFeesValuenov.push(
                                    {
                                        'FeeGenID': yearlyFeesValNov.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValNov.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValNov.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValNov.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValNov.InsFeesHeadID,
                                        'IsActive': yearlyFeesValNov.IsActive,
                                        'Fee': yearlyFeesValNov.Fee,
                                        'FeesType': yearlyFeesValNov.FeesType,
                                        'FeesHead': yearlyFeesValNov.FeesHead
                                    }
                                );
                            });
                        }
                        vm.nov.push(newRowYearlyFeesValuenov);
                    }
                    $scope.totalArr[10] = 0;
                    for ( k = 0; k < vm.nov.length; k++) { 
                        if (vm.nov[k][0].IsActive === 1 || vm.nov[k][0].IsActive === true) {
                            $scope.totalArr[10] += vm.nov[k][0].Fee;
                        }
                    }
                    break;
                case 11:
                    vm.dec = [];
                    for (i = 0; i < vm.yearlyFees.length; i++) {
                        var yearlyFeesValDec = vm.yearlyFees[i];
                        var newRowYearlyFeesValuedec = [];
                        if (vm.dec.length === 0) {
                            newRowYearlyFeesValuedec = [{
                                'FeeGenID': yearlyFeesValDec.FeeGenID,
                                'FeeGenDetailID': yearlyFeesValDec.FeeGenDetailID,
                                'FeesSetupID': yearlyFeesValDec.FeesSetupID,
                                'FeesTypeID': yearlyFeesValDec.FeesTypeID,
                                'InsFeesHeadID': yearlyFeesValDec.InsFeesHeadID,
                                'IsActive': yearlyFeesValDec.IsActive,
                                'Fee': yearlyFeesValDec.Fee,
                                'FeesType': yearlyFeesValDec.FeesType,
                                'FeesHead': yearlyFeesValDec.FeesHead
                            }];
                        }
                        else {
                            vm.dec[0].forEach(function (row) {
                                newRowYearlyFeesValuedec.push(
                                    {
                                        'FeeGenID': yearlyFeesValDec.FeeGenID,
                                        'FeeGenDetailID': yearlyFeesValDec.FeeGenDetailID,
                                        'FeesSetupID': yearlyFeesValDec.FeesSetupID,
                                        'FeesTypeID': yearlyFeesValDec.FeesTypeID,
                                        'InsFeesHeadID': yearlyFeesValDec.InsFeesHeadID,
                                        'IsActive': yearlyFeesValDec.IsActive,
                                        'Fee': yearlyFeesValDec.Fee,
                                        'FeesType': yearlyFeesValDec.FeesType,
                                        'FeesHead': yearlyFeesValDec.FeesHead
                                    }
                                );
                            });
                        }
                        vm.dec.push(newRowYearlyFeesValuedec);
                    }
                    $scope.totalArr[11] = 0;
                    for ( k = 0; k < vm.dec.length; k++) { 
                        if (vm.dec[k][0].IsActive === 1 || vm.dec[k][0].IsActive === true) {
                            $scope.totalArr[11] += vm.dec[k][0].Fee;
                        }
                    }
                    break;


            }
        };

        $scope.totalArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        $scope.openFeesDetailsIndex = function (index, e) {
            $scope.FeesDetailsIndex = index;
            $scope.childIndex = e;
            switch ($scope.value) {
                /* jshint ignore:start */
                case 0:
                    (vm.jan[$scope.FeesDetailsIndex][0].IsActive === true || vm.jan[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.jan[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.jan[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.jan[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.jan[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 1:
                    (vm.feb[$scope.FeesDetailsIndex][0].IsActive === true || vm.feb[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.feb[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.feb[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.feb[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.feb[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 2:
                    (vm.mar[$scope.FeesDetailsIndex][0].IsActive === true || vm.mar[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.mar[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.mar[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.mar[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.mar[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 3:
                    (vm.apr[$scope.FeesDetailsIndex][0].IsActive === true || vm.apr[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.apr[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.apr[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.apr[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.apr[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 4:
                    (vm.may[$scope.FeesDetailsIndex][0].IsActive === true || vm.may[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.may[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.may[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.may[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.may[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 5:
                    (vm.june[$scope.FeesDetailsIndex][0].IsActive === true || vm.june[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.june[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.june[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.june[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.june[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 6:
                    (vm.july[$scope.FeesDetailsIndex][0].IsActive === true || vm.july[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.july[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.july[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.july[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.july[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 7:
                    (vm.aug[$scope.FeesDetailsIndex][0].IsActive === true || vm.aug[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.aug[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.aug[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.aug[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.aug[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 8:
                    (vm.sep[$scope.FeesDetailsIndex][0].IsActive === true || vm.sep[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.sep[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.sep[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.sep[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.sep[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 9:
                    (vm.oct[$scope.FeesDetailsIndex][0].IsActive === true || vm.oct[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.oct[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.oct[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.oct[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.oct[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 10:
                    (vm.nov[$scope.FeesDetailsIndex][0].IsActive === true || vm.nov[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.nov[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.nov[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.nov[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.nov[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                case 11:
                    (vm.dec[$scope.FeesDetailsIndex][0].IsActive === true || vm.dec[$scope.FeesDetailsIndex][0].IsActive === 0) ? $scope.totalArr[$scope.value] += vm.dec[$scope.FeesDetailsIndex][0].Fee : $scope.totalArr[$scope.value] -= vm.dec[$scope.FeesDetailsIndex][0].Fee;
                    (e === false || e === 1) ? vm.dec[$scope.FeesDetailsIndex][0].IsActive = 0 : vm.dec[$scope.FeesDetailsIndex][0].IsActive = 1;
                    break;
                /* jshint ignore:end */
            }


        };

        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.showGrid = false;
        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;

        };
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });

        };

        $scope.ClearMonthList = function () {
            switch ($scope.value) {
                case 0:
                    vm.jan = [];
                    vm.matchActiveJan = [];
                    break;
                case 1:
                    vm.feb = [];
                    vm.matchActiveFeb = [];
                    break;
                case 2:
                    vm.mar = [];
                    vm.matchActiveMar = [];
                    break;
                case 3:
                    vm.apr = [];
                    vm.matchActiveApr = [];
                    break;
                case 4:
                    vm.may = [];
                    vm.matchActiveMay = [];
                    break;
                case 5:
                    vm.june = [];
                    vm.matchActiveJune = [];
                    break;
                case 6:
                    vm.july = [];
                    vm.matchActiveJuly = [];
                    break;
                case 7:
                    vm.aug = [];
                    vm.matchActiveAug = [];
                    break;
                case 8:
                    vm.sep = [];
                    vm.matchActiveSep = [];
                    break;
                case 9:
                    vm.oct = [];
                    vm.matchActiveOct = [];
                    break;
                case 10:
                    vm.nov = [];
                    vm.matchActiveNov = [];
                    break;
                case 11:
                    vm.dec = [];
                    vm.matchActiveDec = [];
                    break;
            }
        };

        $scope.func = false;
        vm.getInsYearlyFee = function () {
            $scope.btnDis = false;
            $scope.disSave = false;
            $scope.disButton = false;
            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ShiftID: vm.shift === undefined ? 0 : vm.shift.selected.ShiftID,
                MediumID: vm.medium === undefined ? 0 : vm.medium.selected.MediumID,
                ClassID: vm.class === undefined ? 0 : vm.class.selected.ClassID,
                DepartmentID: vm.department === undefined ? 0 : vm.department.selected.DepartmentID,
                MonthID: 0
            };
            return yearlyFeeGenerationService.getInsYearlyFeesMasterID(Params)
                .then(function (data) {
                    vm.masterIDs = data;
                    $scope.openFeesTabIndex(0);
                    $scope.showItem = true;
                });
        };
        $scope.disSave = false;
        $scope.disButton = false;
        vm.postInsYearlyFee = function () {
            $scope.btnDis = true;
            if (vm.class === undefined) {
                logger.error('Please select Class and fees');
            } else {
                $scope.disSave = true;
                $scope.disButton = true;
                var MonthArray = [];
                var MatchArray = [];
                switch ($scope.value) {
                    case 0:
                        MonthArray = vm.jan;
                        MatchArray = vm.matchActiveJan;
                        break;
                    case 1:
                        MonthArray = vm.feb;
                        MatchArray = vm.matchActiveFeb;
                        break;
                    case 2:
                        MonthArray = vm.mar;
                        MatchArray = vm.matchActiveMar;
                        break;
                    case 3:
                        MonthArray = vm.apr;
                        MatchArray = vm.matchActiveApr;
                        break;
                    case 4:
                        MonthArray = vm.may;
                        MatchArray = vm.matchActiveMay;
                        break;
                    case 5:
                        MonthArray = vm.june;
                        MatchArray = vm.matchActiveJune;
                        break;
                    case 6:
                        MonthArray = vm.july;
                        MatchArray = vm.matchActiveJuly;
                        break;
                    case 7:
                        MonthArray = vm.aug;
                        MatchArray = vm.matchActiveAug;
                        break;
                    case 8:
                        MonthArray = vm.sep;
                        MatchArray = vm.matchActiveSep;
                        break;
                    case 9:
                        MonthArray = vm.oct;
                        MatchArray = vm.matchActiveOct;
                        break;
                    case 10:
                        MonthArray = vm.nov;
                        MatchArray = vm.matchActiveNov;
                        break;
                    case 11:
                        MonthArray = vm.dec;
                        MatchArray = vm.matchActiveDec;
                        break;
                }

                var FeeGen = MonthArray.filter(function (ob, i) {
                    return (ob[0].FeeGenID > 0);
                });
                var FeeGenid = 0;
                if (FeeGen !== undefined && FeeGen !== null && FeeGen.length > 0) {
                    FeeGenid = FeeGen[0][0].FeeGenID;
                }

                yearlyFeeGenerationService.postInsYearlyFees({
                    'FeeGenID': FeeGenid,
                    'InstituteID': $localStorage.userInfo[0].InstituteID,
                    'LoggedUserID': $localStorage.userInfo[0].UserID,
                    'DepartmentID': vm.department === undefined ? 0 : vm.department.selected.DepartmentID,
                    'MediumID': vm.medium === undefined ? 0 : vm.medium.selected.MediumID,
                    'ShiftID': vm.shift === undefined ? 0 : vm.shift.selected.ShiftID,
                    'ClassID': vm.class === undefined ? 0 : vm.class.selected.ClassID,
                    'SectionID': 0,
                    'MonthID': $scope.value + 1,
                    MonthArray: MonthArray,
                    MatchArray: MatchArray
                })
                    .then(function (data) {
                        logger.info('Saved!');
                        $scope.ClearMonthList();
                    })
                    .catch(function (error) { });
            }


        };
        $scope.btnDis = true;
        $scope.DisBtn = function () {
            $scope.btnDis = true;
            $scope.showItem = false;
        };

        activate();

        function activate() {
            var promises = [getAllShift(), getAllMedium()];
            return $q.all(promises).then(function () {
            });
        }

        function getAllShift() {
            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.shifts = data;
                });
        }

        function getAllMedium() {
            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMedium(Params)
                .then(function (data) {
                    vm.mediums = data;
                });
        }

        vm.MediumWiseClassDDL = function (n) {
            if (n !== undefined) {
                var Params = {
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    MediumID: n
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.classes = data;

                    });
            }
            else { logger.error('Select Medium first'); }

        };

        vm.ClassWiseDepartmentDDL = function (m) {
            vm.departments = [];
            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: vm.class.selected.ClassID,
                MediumID: vm.medium.selected.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.departments = data;
                        $scope.IsRequired = true;
                    }
                    else {
                        $scope.IsRequired = false;
                    }

                });

        };

    }

})();
