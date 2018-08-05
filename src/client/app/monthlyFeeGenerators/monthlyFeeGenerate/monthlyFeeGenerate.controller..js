(function () {
    'use strict';

    angular
        .module('app.monthlyFeeGenerators')
        .controller('monthlyFeeGenerateController', monthlyFeeGenerateController);

    monthlyFeeGenerateController.$inject = ['userRegistrationService', 'FeeService', 'monthlyFeeService', 'subjectSettingsSevice', 'bankAccountService', 'commonService', 'studentAtdReportSettingsService', 'dailySubWiseAtdSettingsService', 'shiftSettings', 'mediumsetting', 'classSettings', 'sectionSettingsSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function monthlyFeeGenerateController(userRegistrationService, FeeService, monthlyFeeService, subjectSettingsSevice, bankAccountService, commonService, studentAtdReportSettingsService, dailySubWiseAtdSettingsService, shiftSettings, mediumsetting, classSettings, sectionSettingsSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

        var vm = this;

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.BranchID = $localStorage.userInfo[0].BrunchID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration
        $scope.CurrYear = new Date().getFullYear().toString();
        vm.CollectionPaymentID = 0;
        vm.CollectionID = 0;
        $scope.InstituteID = $localStorage.userInfo[0].InstituteID;
        $scope.InstituteName = $localStorage.userInfo[0].InstituteName;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.IsFine = $localStorage.userInfo[0].IsFine;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        vm.imgHost = apiConfig.imagehost;
        $scope.InstituteLogoUrl = vm.imgHost + $scope.InstituteLogo;
        // Create and Show list Container Hide or Show Logic
        $scope.showStudentFeesInfo = false;
        $scope.createItem = true;
        $scope.feesDetail = false;
        $scope.invoice = false;
        $scope.regedusersFirst = [];
        $scope.IsShowQT = 0;
        vm.totalPayableFees = 0;
        vm.totalAmount = 0;
        vm.DueOrAdvance = 0;
        $scope.showListBtn = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showGenerateFee = true;
            $scope.feesDetail = false;
            vm.paidAmounts = 0;
        };

        $scope.showMonthlyInfo = function () {
            $scope.feesDetails = [];
            $scope.fineDetails = [];
            $scope.showStudentFeesInfo = true;
            $scope.createItem = false;
            $scope.feesDetail = false;
            studentMonthlyFeesInfo();
        };

        $scope.HoldFromMonthID = null;
        $scope.HoldToMonthID = null;

        $scope.MonthFromToValidation = function () {
            var FMID = vm.FromMonthID === undefined || vm.FromMonthID === null ? 0 : vm.FromMonthID;
            var TMID = vm.monthID === undefined || vm.monthID === null ? 0 : vm.monthID;
            if (FMID > TMID && FMID !== 0 && TMID !== 0) {
                vm.FromMonthID = vm.monthID;
                vm.Fmon = { selected: vm.months.filter(function (ob, i) { return (ob.MonthID === vm.monthID); })[0] };
            }
        };

        $scope.MnthName = '';
        $scope.FromMonthName = '';
        $scope.ToMonthName = '';
        $scope.SetMonthName = function () {
            var MonthModel = '';
            if (vm.monthID !== null && vm.monthID !== undefined) {
                MonthModel = vm.months.filter(function (ob, i) { return (ob.MonthID === vm.monthID); })[0];
                if (MonthModel !== undefined && MonthModel !== null) {
                    $scope.ToMonthName = MonthModel.MonthName;
                }
            }

            if (vm.FromMonthID !== null && vm.FromMonthID !== undefined) {
                MonthModel = vm.months.filter(function (ob, i) { return (ob.MonthID === vm.FromMonthID); })[0];
                if (MonthModel !== undefined && MonthModel !== null) {
                    $scope.FromMonthName = MonthModel.MonthName;
                }
            }

            if ((vm.FromMonthID === undefined || vm.FromMonthID === null) || (vm.FromMonthID === vm.monthID)) {
                $scope.MnthName = 'For the month of ' + $scope.ToMonthName;
            }
            else {
                $scope.MnthName = 'From: ' + $scope.FromMonthName + ' To: ' + $scope.ToMonthName;
            }

        };
        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.feesDetails = [

        ];
        //For Present Address add a row in the array
        vm.addNewRowForMonthlyFee = function () {
            // create a blank array
            var newrowMonthlyFees = [];

            // if array is blank add a standard item
            if ($scope.feesDetails.length === 0) {
                newrowMonthlyFees = [
                    {
                        'FeeGenID': '',
                        'ShiftID': null,
                        'MediumID': null,
                        'DepartmentID': null,
                        'ClassID': null,
                        'MonthID': null,
                        'FeeGenDetailID': '',
                        'FeesSetupID': null,
                        'FeesTypeID': null,
                        'FeesType': '',
                        'FeesHeadID': null,
                        'FeesHead': '',
                        'Fee': 0,
                        'CollectionFeesID': 0,
                        'IsDeleted': false
                    }
                ];
            } else {
                // else cycle thru the first row's columns
                // and add the same number of items
                $scope.feesDetails[0].forEach(function (row) {
                    newrowMonthlyFees.push(
                        {
                            'FeeGenID': '',
                            'ShiftID': null,
                            'MediumID': null,
                            'DepartmentID': null,
                            'ClassID': null,
                            'MonthID': null,
                            'FeeGenDetailID': '',
                            'FeesSetupID': null,
                            'FeesTypeID': null,
                            'FeesType': '',
                            'FeesHeadID': null,
                            'FeesHead': '',
                            'Fee': 0,
                            'CollectionFeesID': 0,
                            'IsDeleted': false


                        }
                    );
                });
            }
            // add the new row at the end of the array 
            $scope.feesDetails.push(newrowMonthlyFees);
        };

        // remove the selected row
        $scope.FeesDetailsRemoveRow = function (index) {
            if ($scope.feesDetails[index][0].CollectionFeesID > 0) {
                $scope.feesDetails[index][0].IsDeleted = true;
                //$scope.removePresentTrIndex = index;
            } else {
                $scope.feesDetails.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.feesDetails.length === 0) {
                    $scope.feesDetails = [];
                }
            }
        };
        // --------------- End Logic For Present Address -------------//

        vm.getStudents = function () {
            //debugger;

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            if (vm.classID === undefined) {
                commonService.droupDownRequire(vm.classID, 'Class');
            } else {
                $('#myModal').modal('show'); //jshint ignore : line
                $scope.showStudentFeesInfo = false;
                $scope.feesDetails = [];
                vm.monthlyFees = [];
                var Params = {
                    shiftID: (vm.shiftID === undefined) ? null : vm.shiftID,
                    mediumID: (vm.mediumID === undefined) ? null : vm.mediumID,
                    classID: (vm.classID === undefined) ? null : vm.classID,
                    depertmentID: (vm.depertmentID === undefined) ? null : vm.depertmentID,
                    instituteID: $localStorage.userInfo[0].InstituteID
                };
                return monthlyFeeService.getMonthlyFee(Params)
                    .then(function (data) {
                        if (data.length > 0) {
                            vm.StudentList = data;
                        }
                    });
            }
        };

        $scope.UserID = 0;

        $scope.SetRFID = function (RFID, UserID) {
            //debugger
            $scope.RFID = RFID;
            $scope.UserID = UserID;
        };

        $scope.SetOnBlurRFID = function (RFID, OnEnter) {
            if (RFID !== undefined && RFID !== '') {
                var Params = {
                    InstituteID: $localStorage.userInfo[0].InstituteID,
                    RFID: RFID
                };
                return monthlyFeeService.getUserInfo(Params)
                    .then(function (data) {
                        //debugger;
                        if (data.length > 0) {
                            vm.shiftID = data[0].ShiftID;
                            vm.mediumID = data[0].MediumID;
                            vm.classID = data[0].ClassID;
                            vm.depertmentID = data[0].DepartmentID;
                            $scope.UserID = data[0].UserID;

                            if (OnEnter.keyCode === 13) {
                                OnEnter.preventDefault();
                                vm.generateFee();
                            }
                        }
                    });
            }
        };



        vm.generateFee = function () {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            if (vm.monthID === undefined) {
                commonService.droupDownRequire(vm.monthID, 'Month');
            } else {
                $scope.feesDetails = [];
                $scope.showStudentFeesInfo = false;
                vm.monthlyFees = [];
                var Params = {
                    shiftID: (vm.shiftID === undefined) ? null : vm.shiftID,
                    mediumID: (vm.mediumID === undefined) ? null : vm.mediumID,
                    classID: (vm.classID === undefined) ? null : vm.classID,
                    depertmentID: (vm.depertmentID === undefined) ? null : vm.depertmentID,
                    monthID: (vm.monthID === undefined) ? null : vm.monthID,
                    FromMonthID: (vm.FromMonthID === undefined) ? null : vm.FromMonthID,
                    instituteID: $localStorage.userInfo[0].InstituteID,
                    UserID: $scope.UserID
                };

                monthlyFeeService.getConfirmationToExecute(Params)
                    .then(function (data) {
                        if (data[0].ReturnValue === 1) {
                            $scope.CallGenerateFee(Params);
                            $scope.SetMonthName();
                        } else {
                            if (vm.monthID <= data[0].MonthID) {
                                logger.info('Already Paid!');
                            }
                            else if (vm.monthID > data[0].MonthID) {
                                var DataMonthID = null;
                                if (data[0].MonthID === 12) {
                                    DataMonthID = 1;
                                }
                                else {
                                    DataMonthID = data[0].MonthID + 1;
                                }

                                var ProceedMonth = vm.months.filter(function (ob, i) { return (ob.MonthID === DataMonthID); })[0];
                                logger.info('Your fees generation can be proceed from the month of ' + ProceedMonth.MonthName + '!!!');
                                vm.Fmon = { selected: vm.months.filter(function (ob, i) { return (ob.MonthID === DataMonthID); })[0] };
                                vm.FromMonthID = DataMonthID;
                                Params.FromMonthID = DataMonthID;
                                $scope.CallGenerateFee(Params);
                                $scope.SetMonthName();
                            }
                        }

                    });

            }
        };

        $scope.CallGenerateFee = function (Params) {
            monthlyFeeService.getMonthWiseFee(Params)
                .then(function (data) {
                    vm.monthWiseFee = data;

                    if (vm.monthWiseFee !== undefined) {
                        for (var i = 0; i < vm.monthWiseFee.length; i++) {

                            var monthWiseFeesValue = vm.monthWiseFee[i];
                            // create a blank array
                            var newrowMonthlyFees = [];
                            // if array is blank add a standard item
                            if ($scope.feesDetails.length === 0) {
                                newrowMonthlyFees = [
                                    {
                                        'FeeGenID': monthWiseFeesValue.FeeGenID,
                                        'ShiftID': monthWiseFeesValue.ShiftID,
                                        'MediumID': monthWiseFeesValue.MediumID,
                                        'DepartmentID': monthWiseFeesValue.DepartmentID,
                                        'ClassID': monthWiseFeesValue.ClassID,
                                        'MonthID': monthWiseFeesValue.MonthID,
                                        'FeeGenDetailID': monthWiseFeesValue.FeeGenDetailID,
                                        'FeesSetupID': monthWiseFeesValue.FeesSetupID,
                                        'FeesTypeID': monthWiseFeesValue.FeesTypeID,
                                        'FeesType': monthWiseFeesValue.FeesType,
                                        'FeesHeadID': monthWiseFeesValue.FeesHeadID,
                                        'FeesHead': monthWiseFeesValue.FeesHead,
                                        'Fee': monthWiseFeesValue.Fee,
                                        'feesTypeSelected': { FeesType: monthWiseFeesValue.FeesType, FeesTypeID: monthWiseFeesValue.FeesTypeID },
                                        'feesHeadSelected': { FeesHead: monthWiseFeesValue.FeesHead, FeesHeadID: monthWiseFeesValue.FeesHeadID },
                                        'feesHeadddl': vm.allFeesHead.filter(function (ob, i) { return (ob.FeesTypeID === monthWiseFeesValue.FeesTypeID); }),
                                        'CollectionFeesID': 0,
                                        'IsDeleted': monthWiseFeesValue.IsDeleted,
                                        'NoOfMonth': monthWiseFeesValue.NoOfMonth,
                                        'TotalFees': monthWiseFeesValue.Fee * monthWiseFeesValue.NoOfMonth,
                                        'COAID': monthWiseFeesValue.COAID
                                    }
                                ];
                            } else {
                                // else cycle thru the first row's columns
                                // and add the same number of items
                                $scope.feesDetails[0].forEach(function (row) {
                                    newrowMonthlyFees.push(
                                        {
                                            'FeeGenID': monthWiseFeesValue.FeeGenID,
                                            'ShiftID': monthWiseFeesValue.ShiftID,
                                            'MediumID': monthWiseFeesValue.MediumID,
                                            'DepartmentID': monthWiseFeesValue.DepartmentID,
                                            'ClassID': monthWiseFeesValue.ClassID,
                                            'MonthID': monthWiseFeesValue.MonthID,
                                            'FeeGenDetailID': monthWiseFeesValue.FeeGenDetailID,
                                            'FeesSetupID': monthWiseFeesValue.FeesSetupID,
                                            'FeesTypeID': monthWiseFeesValue.FeesTypeID,
                                            'FeesType': monthWiseFeesValue.FeesType,
                                            'FeesHeadID': monthWiseFeesValue.FeesHeadID,
                                            'FeesHead': monthWiseFeesValue.FeesHead,
                                            'Fee': monthWiseFeesValue.Fee,
                                            'feesTypeSelected': { FeesType: monthWiseFeesValue.FeesType, FeesTypeID: monthWiseFeesValue.FeesTypeID },
                                            'feesHeadSelected': { FeesHead: monthWiseFeesValue.FeesHead, FeesHeadID: monthWiseFeesValue.FeesHeadID },
                                            'feesHeadddl': vm.allFeesHead.filter(function (ob, i) { return (ob.FeesTypeID === monthWiseFeesValue.FeesTypeID); }),
                                            'CollectionFeesID': 0,
                                            'IsDeleted': monthWiseFeesValue.IsDeleted,
                                            'NoOfMonth': monthWiseFeesValue.NoOfMonth,
                                            'TotalFees': monthWiseFeesValue.Fee * monthWiseFeesValue.NoOfMonth,
                                            'COAID': monthWiseFeesValue.COAID
                                        }
                                    );
                                });
                            }
                            // add the new row at the end of the array 
                            $scope.feesDetails.push(newrowMonthlyFees);

                        }

                        $scope.feesDetailsContainer();
                    }
                });
        };

        $scope.SetTotalFees = function (field) {
            field.TotalFees = field.Fee * field.NoOfMonth;
        };

        //CollectionID, UserID, Scholarship, Discount, BalanceAmount, TotalFee, TotalPayment, ReturnAmount, DiscountIsPercent, MonthName, PreviousBalance
        $scope.editModels = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            $scope.feesDetail = true;
            $scope.showStudentFeesInfo = false;
            //$scope.IsShowQT = 0;
            $scope.feesDetails = [];
            vm.CollectionID = parseFloat(model.CollectionID);
            var Params = {
                CollectionID: model.CollectionID,
                InstituteID: $localStorage.userInfo[0].InstituteID
            };
            return monthlyFeeService.getStudentAccCollectionFee(Params)
                .then(function (data) {
                    //debugger;
                    vm.monthWiseFee = data;

                    if (vm.monthWiseFee !== undefined) {
                        for (var i = 0; i < vm.monthWiseFee.length; i++) {

                            var monthWiseFeesValue = vm.monthWiseFee[i];
                            // create a blank array
                            var newrowMonthlyFees = [];
                            // if array is blank add a standard item
                            if ($scope.feesDetails.length === 0) {
                                newrowMonthlyFees = [
                                    {
                                        'FeeGenID': monthWiseFeesValue.FeeGenID,
                                        'ShiftID': monthWiseFeesValue.ShiftID,
                                        'MediumID': monthWiseFeesValue.MediumID,
                                        'DepartmentID': monthWiseFeesValue.DepartmentID,
                                        'ClassID': monthWiseFeesValue.ClassID,
                                        'MonthID': monthWiseFeesValue.MonthID,
                                        'FeeGenDetailID': monthWiseFeesValue.FeeGenDetailID,
                                        'FeesSetupID': monthWiseFeesValue.FeesSetupID,
                                        'FeesTypeID': monthWiseFeesValue.FeesTypeID,
                                        'FeesType': monthWiseFeesValue.FeesType,
                                        'FeesHeadID': monthWiseFeesValue.FeesHeadID,
                                        'FeesHead': monthWiseFeesValue.FeesHead,
                                        'Fee': monthWiseFeesValue.Fee,
                                        'feesTypeSelected': { FeesType: monthWiseFeesValue.FeesType, FeesTypeID: monthWiseFeesValue.FeesTypeID },
                                        'feesHeadSelected': { FeesHead: monthWiseFeesValue.FeesHead, FeesHeadID: monthWiseFeesValue.FeesHeadID },
                                        'feesHeadddl': vm.allFeesHead.filter(function (ob, i) { return (ob.FeesTypeID === monthWiseFeesValue.FeesTypeID); }),
                                        'CollectionFeesID': parseInt(monthWiseFeesValue.CollectionFeesID),
                                        'NoOfMonth': monthWiseFeesValue.NoOfMonth,
                                        'TotalFees': monthWiseFeesValue.TotalFees,
                                        'COAID': monthWiseFeesValue.COAID
                                    }
                                ];
                            } else {
                                // else cycle thru the first row's columns
                                // and add the same number of items
                                $scope.feesDetails[0].forEach(function (row) {
                                    newrowMonthlyFees.push(
                                        {
                                            'FeeGenID': monthWiseFeesValue.FeeGenID,
                                            'ShiftID': monthWiseFeesValue.ShiftID,
                                            'MediumID': monthWiseFeesValue.MediumID,
                                            'DepartmentID': monthWiseFeesValue.DepartmentID,
                                            'ClassID': monthWiseFeesValue.ClassID,
                                            'MonthID': monthWiseFeesValue.MonthID,
                                            'FeeGenDetailID': monthWiseFeesValue.FeeGenDetailID,
                                            'FeesSetupID': monthWiseFeesValue.FeesSetupID,
                                            'FeesTypeID': monthWiseFeesValue.FeesTypeID,
                                            'FeesType': monthWiseFeesValue.FeesType,
                                            'FeesHeadID': monthWiseFeesValue.FeesHeadID,
                                            'FeesHead': monthWiseFeesValue.FeesHead,
                                            'Fee': monthWiseFeesValue.Fee,
                                            'feesTypeSelected': { FeesType: monthWiseFeesValue.FeesType, FeesTypeID: monthWiseFeesValue.FeesTypeID },
                                            'feesHeadSelected': { FeesHead: monthWiseFeesValue.FeesHead, FeesHeadID: monthWiseFeesValue.FeesHeadID },
                                            'feesHeadddl': vm.allFeesHead.filter(function (ob, i) { return (ob.FeesTypeID === monthWiseFeesValue.FeesTypeID); }),
                                            'CollectionFeesID': parseInt(monthWiseFeesValue.CollectionFeesID),
                                            'NoOfMonth': monthWiseFeesValue.NoOfMonth,
                                            'TotalFees': monthWiseFeesValue.TotalFees,
                                            'COAID': monthWiseFeesValue.COAID
                                        }
                                    );
                                });
                            }
                            // add the new row at the end of the array 
                            $scope.feesDetails.push(newrowMonthlyFees);

                        }
                    }

                    $scope.fineDetails = [];
                    $scope.createItem = true;
                    $scope.feesDetail = true;

                    if (vm.IsFine === true) {
                        // Get Student Account Collection Fine

                        //var Params = {
                        //    CollectionID: model.CollectionID,
                        //    InstituteID: $localStorage.userInfo[0].InstituteID
                        //};
                        monthlyFeeService.getStudentAccFeesCollectionFine(Params)
                            .then(function (data) {
                                vm.fineDetails = data;
                                if (vm.fineDetails !== undefined) {
                                    for (var i = 0; i < vm.fineDetails.length; i++) {
                                        var fineValue = vm.fineDetails[i];
                                        // create a blank array
                                        var newrowMonthlyFine = [];
                                        //calculate Fine
                                        var fineableDay = fineValue.Days / fineValue.MinimumDays;
                                        vm.finableDays = isNaN(fineableDay) ? 0 : fineableDay;
                                        vm.TotalFineAmount = Math.round(vm.finableDays * fineValue.FineAmount * 100) / 100;
                                        // if array is blank add a standard item
                                        if ($scope.fineDetails.length === 0) {
                                            newrowMonthlyFine = [
                                                {
                                                    'InsFineID': fineValue.InsFineID,
                                                    'FineHeadID': fineValue.FineHeadID,
                                                    'FineHead': fineValue.FineHead,
                                                    'MinimumDays': fineValue.MinimumDays,
                                                    'FineAmount': fineValue.FineAmount,
                                                    'Days': fineValue.Days,
                                                    'fineTypeSelected': { FineHeadID: fineValue.FineHeadID, FineHead: fineValue.FineHead },
                                                    'finableDays': vm.finableDays,
                                                    'TotalFineAmount': vm.TotalFineAmount,
                                                    'CollectionFineD': parseInt(fineValue.CollectionFineD),
                                                    'COAID': fineValue.COAID
                                                }
                                            ];
                                        } else {
                                            // else cycle thru the first row's columns
                                            // and add the same number of items
                                            $scope.fineDetails[0].forEach(function (row) {
                                                newrowMonthlyFine.push(
                                                    {
                                                        'InsFineID': fineValue.InsFineID,
                                                        'FineHeadID': fineValue.FineHeadID,
                                                        'FineHead': fineValue.FineHead,
                                                        'MinimumDays': fineValue.MinimumDays,
                                                        'FineAmount': fineValue.FineAmount,
                                                        'Days': fineValue.Days,
                                                        'fineTypeSelected': { FineHeadID: fineValue.FineHeadID, FineHead: fineValue.FineHead },
                                                        'finableDays': vm.finableDays,
                                                        'TotalFineAmount': vm.TotalFineAmount,
                                                        'CollectionFineD': parseInt(fineValue.CollectionFineD),
                                                        'COAID': fineValue.COAID
                                                    }
                                                );
                                            });
                                        }
                                        // add the new row at the end of the array 
                                        $scope.fineDetails.push(newrowMonthlyFine);
                                        calculateTotalFees();
                                    }
                                }
                            });
                    }

                    userRegistrationService.getCmnUserResistrationByUserID(model.UserID)
                        .then(function (data) {
                            //debugger;
                            vm.regedusers = data;
                            vm.indexLenth = data.length;

                            if (data.length > 0) {
                                $scope.regedusersFirst = [];
                                $scope.regedusersFirst.push({ UserName: vm.regedusers[vm.indexLenth - 1].UserName, Class: vm.regedusers[vm.indexLenth - 1].Class, Section: vm.regedusers[vm.indexLenth - 1].Section, RollNo: vm.regedusers[vm.indexLenth - 1].RollNo, Session: vm.regedusers[vm.indexLenth - 1].Session, Shift: vm.regedusers[vm.indexLenth - 1].Shift, Department: vm.regedusers[vm.indexLenth - 1].Department, ImageUrl: vm.regedusers[vm.indexLenth - 1].ImageUrl });
                                $scope.IsShowQT = $scope.regedusersFirst.length > 0 ? 1 : 0;

                                vm.shiftID = data[0].ShiftID;
                                vm.shift = {
                                    selected: vm.shifts.filter(function (ob, i) {
                                        return (ob.ShiftID === data[0].ShiftID);
                                    })[0]
                                };

                                vm.mediumID = data[0].MediumID;
                                vm.medium = {
                                    selected: vm.mediums.filter(function (ob, i) {
                                        return (ob.MediumID === data[0].MediumID);
                                    })[0]
                                };

                                vm.classID = data[0].ClassID;
                                vm.depertmentID = data[0].DepartmentID;
                                vm.getAllClass('Edit');
                                vm.getAllDepertment('Edit');
                            }
                        });

                    //var Params = {
                    //    CollectionID: model.CollectionID,
                    //    InstituteID: $localStorage.userInfo[0].InstituteID
                    //};
                    monthlyFeeService.getCollectionDetail(Params)
                        .then(function (data) {
                            //debugger;
                            if (data.length > 0) {
                                $scope.CollectionMonthDetail = data;
                            }
                        });

                    vm.UserID = model.UserID;
                    vm.monthID = model.MonthID;
                    vm.mon = {
                        selected: vm.months.filter(function (ob, i) {
                            return (ob.MonthID === model.MonthID);
                        })[0]
                    };
                    vm.FromMonthID = model.FromMonthID;
                    vm.Fmon = {
                        selected: vm.months.filter(function (ob, i) {
                            return (ob.MonthID === model.FromMonthID);
                        })[0]
                    };
                    //debugger;
                    vm.previousDue = model.PreviousBalance;
                    vm.isAdvance = model.BalanceAmount > 0 && model.ReturnAmount === 0 ? true : false;
                    vm.css = model.ReturnAmount === 0 && model.BalanceAmount === 0 ? 'yellow' : vm.css;
                    vm.amountStatus = model.ReturnAmount === 0 && model.BalanceAmount === 0 ? 'Return' : vm.amountStatus;
                    vm.discountAmounts = model.Discount;
                    vm.isPercent = model.IsPercent;
                    vm.DueOrAdvanceWithDiscount = model.AmountWithDiscount;
                    vm.TotalFees = model.TotalFee;
                    vm.scholarshipAmmount = model.Scholarship;
                    vm.paidAmounts = model.TotalPayment;
                    //vm.payment = { 'PaymentMethodName': 'Cash', 'PaymentMethodID': '1' };
                    if (model.PaymentMethodID !== null) {
                        vm.PaymentMethodID = model.PaymentMethodID.toString();
                        vm.paymentMethod = {
                            selected: vm.paymentMethods.filter(function (ob, i) {
                                return (ob.PaymentMethodID === vm.PaymentMethodID);
                            })[0]
                        };
                    }

                    if (model.CurrencyID !== null) {
                        vm.CurrencyID = model.CurrencyID;
                        vm.currency = {
                            selected: vm.currencys.filter(function (ob, i) {
                                return (ob.CurrencyID === vm.CurrencyID);
                            })[0]
                        };
                    }

                    vm.YearName = model.YearName;
                    vm.year = {
                        selected: vm.YearList.filter(function (ob, i) {
                            return (ob.YearName === vm.YearName);
                        })[0]
                    };

                    vm.CollectionPaymentID = model.CollectionPaymentID === null ? 0 : model.CollectionPaymentID;
                    vm.AccountNo = model.AccountNo === null ? '' : model.AccountNo;
                    vm.MAccountNo = model.MAccountNo === null ? '' : model.MAccountNo;
                    vm.TransactionNo = model.TransactionNo === null ? '' : model.TransactionNo;
                    vm.CardNo = model.CardNo === null ? '' : model.CardNo;
                    vm.ChequeNo = model.ChequeNo === null ? '' : model.ChequeNo;

                    if (model.BankID !== null) {
                        vm.BankID = model.BankID;
                        $scope.getAllBank('Edit');
                    }

                    if (model.MBankID !== null) {
                        vm.MBankID = model.MBankID;
                        vm.Mbank = {
                            selected: vm.AllMBanks.filter(function (ob, i) {
                                return (ob.MBankID === vm.MBankID);
                            })[0]
                        };
                    }

                    $scope.SetMonthName();

                    calculateTotalFees();


                });
        };

        $scope.fineDetails = [

        ];
        //For Present Address add a row in the array
        vm.addNewRowForFineFee = function () {
            // create a blank array
            var newrowMonthlyFine = [];

            // if array is blank add a standard item
            if ($scope.fineDetails.length === 0) {
                newrowMonthlyFine = [
                    {
                        'InsFineID': null,
                        'FineHeadID': null,
                        'FineHead': '',
                        'MinimumDays': null,
                        'FineAmount': null,
                        'Days': null,
                        'finableDays': null,
                        'TotalFineAmount': null,
                        'COAID': null
                    }
                ];
            } else {
                // else cycle thru the first row's columns
                // and add the same number of items
                $scope.fineDetails[0].forEach(function (row) {
                    newrowMonthlyFine.push(
                        {
                            'InsFineID': null,
                            'FineHeadID': null,
                            'FineHead': '',
                            'MinimumDays': null,
                            'FineAmount': null,
                            'Days': null,
                            'finableDays': null,
                            'TotalFineAmount': null,
                            'COAID': null
                        }
                    );
                });
            }
            // add the new row at the end of the array 
            $scope.fineDetails.push(newrowMonthlyFine);
        };

        //$scope.NextParam = '';

        $scope.feesDetailsContainer = function () {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            //$scope.IsVisible = $scope.IsVisible ? false : true;
            vm.UserID = $scope.UserID;
            vm.paidAmounts = 0;
            vm.discountAmounts = 0;
            vm.isPercent = false;
            $scope.fineDetails = [];
            $scope.createItem = true;
            $scope.feesDetail = true;
            //$scope.IsShowQT = 0;
            var Params = {
                shiftID: vm.shiftID === undefined ? 0 : vm.shiftID,
                mediumID: vm.mediumID === undefined ? 0 : vm.mediumID,
                classID: vm.classID === undefined ? 0 : vm.classID,
                depertmentID: vm.depertmentID === undefined ? 0 : vm.depertmentID,
                studentID: $scope.UserID,
                instituteID: $localStorage.userInfo[0].InstituteID,
                monthID: vm.monthID === undefined ? 0 : vm.monthID
            };
            //$scope.NextParam = Params;
            monthlyFeeService.getPreviousDue(Params)
                .then(function (data) {
                    if (data.length !== 0) {
                        vm.previousDue = data[0].PreviousDue;
                    } else {
                        vm.previousDue = 0;
                    }
                    $scope.CallServiceTogetFees(Params);
                    calculateTotalFees();
                });
        };

        $scope.CallServiceTogetFees = function (Params) {

            monthlyFeeService.getScholarship(Params)
                .then(function (data) {
                    //debugger;
                    vm.studentScholarship = data[0];
                    calculateTotalFees();
                });

            if ($scope.IsFine === true) {
                monthlyFeeService.getLateAndAbsent(Params)
                    .then(function (data) {
                        vm.fineDetails = data;
                        // $scope.fineDetails = [];
                        if (vm.fineDetails !== undefined) {
                            for (var i = 0; i < vm.fineDetails.length; i++) {
                                var fineValue = vm.fineDetails[i];
                                // create a blank array
                                var newrowMonthlyFine = [];
                                //calculate Fine
                                vm.finableDays = Math.round(fineValue.Days / fineValue.MinimumDays);
                                vm.TotalFineAmount = Math.round(vm.finableDays * fineValue.FineAmount * 100) / 100;
                                // if array is blank add a standard item
                                if ($scope.fineDetails.length === 0) {
                                    newrowMonthlyFine = [
                                        {
                                            'InsFineID': fineValue.InsFineID,
                                            'FineHeadID': fineValue.FineHeadID,
                                            'FineHead': fineValue.FineHead,
                                            'MinimumDays': fineValue.MinimumDays,
                                            'FineAmount': fineValue.FineAmount,
                                            'Days': fineValue.Days,
                                            'fineTypeSelected': { FineHeadID: fineValue.FineHeadID, FineHead: fineValue.FineHead },
                                            'finableDays': vm.finableDays,
                                            'TotalFineAmount': vm.TotalFineAmount,
                                            'CollectionFineD': 0,
                                            'COAID': fineValue.COAID
                                        }
                                    ];
                                } else {
                                    // else cycle thru the first row's columns
                                    // and add the same number of items
                                    $scope.fineDetails[0].forEach(function (row) {
                                        newrowMonthlyFine.push(
                                            {
                                                'InsFineID': fineValue.InsFineID,
                                                'FineHeadID': fineValue.FineHeadID,
                                                'FineHead': fineValue.FineHead,
                                                'MinimumDays': fineValue.MinimumDays,
                                                'FineAmount': fineValue.FineAmount,
                                                'Days': fineValue.Days,
                                                'fineTypeSelected': { FineHeadID: fineValue.FineHeadID, FineHead: fineValue.FineHead },
                                                'finableDays': vm.finableDays,
                                                'TotalFineAmount': vm.TotalFineAmount,
                                                'CollectionFineD': 0,
                                                'COAID': fineValue.COAID
                                            }
                                        );
                                    });
                                }
                                // add the new row at the end of the array 
                                $scope.fineDetails.push(newrowMonthlyFine);
                                calculateTotalFees();
                            }
                        }
                    });
            }

            userRegistrationService.getCmnUserResistrationByUserID(vm.UserID)
                .then(function (data) {
                    //debugger;
                    if (data.length > 0) {
                        vm.regedusers = data;
                        vm.indexLenth = data.length;
                        $scope.regedusersFirst = [];
                        $scope.regedusersFirst.push({ UserName: vm.regedusers[vm.indexLenth - 1].UserName, Class: vm.regedusers[vm.indexLenth - 1].Class, Section: vm.regedusers[vm.indexLenth - 1].Section, RollNo: vm.regedusers[vm.indexLenth - 1].RollNo, Session: vm.regedusers[vm.indexLenth - 1].Session, Shift: vm.regedusers[vm.indexLenth - 1].Shift, Department: vm.regedusers[vm.indexLenth - 1].Department, ImageUrl: vm.regedusers[vm.indexLenth - 1].ImageUrl });
                        $scope.IsShowQT = $scope.regedusersFirst.length > 0 ? 1 : 0;
                    }
                });
        };

        //Ispercent Value Switch Function
        vm.isPercent = false;
        vm.isPercentValueSwitch = function (a) {
            vm.isPercent = a;
            calculateTotalFees();
        };
        function calculateTotalFees() {
            //debugger;
            vm.TotalFees = 0;
            vm.tuitionFee = 0;
            vm.subTotal = 0;
            vm.TotalFine = 0;
            vm.DueOrAdvance = 0;
            // vm.isAdvance;

            if (vm.paidAmounts !== undefined) {
                vm.paidAmount = vm.paidAmounts;
            } else {
                vm.paidAmount = 0;
            }

            var feeDetailsArray = [].concat.apply([], $scope.feesDetails);
            var fineDetailsArray = [].concat.apply([], $scope.fineDetails);
            //Fees Total Calculation
            feeDetailsArray.filter(function (v, i) {
                vm.TotalFees += parseFloat(v.TotalFees);
                if (v.FeesType === 'Tuition') {
                    vm.tuitionFee = v.TotalFees;
                }
            });
            //Fine Total Calculation
            if (vm.IsFine === true) {
                fineDetailsArray.filter(function (v, i) {
                    vm.TotalFine += parseFloat(v.TotalFineAmount);
                });
            }
            //calculate Scholarship
            vm.scholarshipAmmount = 0;
            vm.scholarshipType = '';
            vm.parcentOrAmount = '';
            if (vm.studentScholarship !== undefined) {
                if (vm.studentScholarship.IsParcent === true) {
                    if (vm.studentScholarship.IsOnTotal === true) {
                        vm.scholarshipAmmount = parseFloat((vm.TotalFees * vm.studentScholarship.Amount) / 100).toFixed(2);
                        vm.scholarshipType = 'on Total';
                        vm.parcentOrAmount = vm.studentScholarship.Amount + ' %';
                    } else if (vm.studentScholarship.IsOnTution === true) {
                        vm.scholarshipAmmount = parseFloat((vm.tuitionFee * vm.studentScholarship.Amount) / 100).toFixed(2);
                        vm.scholarshipType = 'on Tuition Fee';
                        vm.parcentOrAmount = vm.studentScholarship.Amount + ' Tk';
                    }
                } else {
                    if (vm.studentScholarship.IsOnTotal === true) {
                        vm.scholarshipAmmount = vm.studentScholarship.Amount;
                        vm.scholarshipType = 'on Total';
                        vm.parcentOrAmount = vm.studentScholarship.Amount + ' Tk';
                        vm.tutionFeeAmmount = vm.TotalFees - vm.studentScholarship.Amount;
                    } else if (vm.studentScholarship.IsOnTution === true) {
                        vm.scholarshipAmmount = vm.studentScholarship.Amount;
                        vm.scholarshipType = 'on Tuition Fee';
                        vm.parcentOrAmount = vm.studentScholarship.Amount + ' Tk';
                    }
                }
            }
            //Subtotal Calculation
            vm.subTotal = vm.TotalFees - vm.scholarshipAmmount;
            //Total Payable Fees Calculation
            vm.totalPayableFees = parseFloat(vm.subTotal + vm.TotalFine - vm.previousDue).toFixed(2);
            //Discount Calculation

            if (vm.discountAmounts !== undefined) {
                if (vm.isPercent === true) {
                    vm.DueOrAdvanceWithDiscount = (parseFloat((vm.totalPayableFees * parseFloat(vm.discountAmounts)) / 100).toFixed(2));
                    vm.DueOrAdvanceWithDiscount = vm.DueOrAdvanceWithDiscount < 0 ? (vm.DueOrAdvanceWithDiscount * -1) : vm.DueOrAdvanceWithDiscount;
                } else {
                    vm.DueOrAdvanceWithDiscount = parseFloat(vm.discountAmounts);
                }
            } else {
                vm.discountAmounts = 0;
            }
            //debugger;
            //Total Payable Fees with Discount Calculation
            vm.totalAmount = vm.totalPayableFees - vm.DueOrAdvanceWithDiscount;
            //Total Due or Advance Calculation
            vm.DueOrAdvance = parseFloat(vm.paidAmount - (vm.totalPayableFees - vm.DueOrAdvanceWithDiscount)).toFixed(2);
            if (vm.DueOrAdvance > 0 && vm.isAdvance === false || vm.DueOrAdvance > 0 && vm.isAdvance === undefined) {
                vm.css = 'yellow';
                vm.amountStatus = 'Return';
                vm.returnAmount = vm.DueOrAdvance;
                vm.balanceAmount = 0;
            }
            else if (parseInt(vm.DueOrAdvance) === 0 && (vm.isAdvance === false || vm.isAdvance === undefined)) {
                vm.css = 'yellow';
                vm.amountStatus = 'Return';
                vm.returnAmount = vm.DueOrAdvance;
                vm.balanceAmount = 0;
            }
            else if (vm.DueOrAdvance < 0) {
                vm.css = 'red';
                vm.amountStatus = 'Due';
                vm.balanceAmount = vm.DueOrAdvance;
                vm.returnAmount = 0;
            } else if (vm.DueOrAdvance > 0 && vm.isAdvance === true) {
                vm.css = 'green';
                vm.amountStatus = 'Advance';
                vm.balanceAmount = vm.DueOrAdvance;
                vm.returnAmount = 0;
            }
            assignWatchers();
        }

        var allWatchers = [];
        function assignWatchers() {

            setTimeout(function () {
                if (allWatchers.length !== 0) {
                    return;
                }

                allWatchers.push($scope.$watch('vm.TotalFees', function () {
                    allWatchers = deassignWatchers();
                    calculateTotalFees();
                }, true));
                allWatchers.push($scope.$watch('vm.paidAmount', function () {
                    allWatchers = deassignWatchers();
                    calculateTotalFees();
                }, true));

            }, 50);

        }
        function deassignWatchers() {
            while (allWatchers.length > 0) {
                allWatchers.pop()();
            }
            return allWatchers;
        }
        deassignWatchers();

        //CurrentDate Logic
        $scope.CurrentDate = new Date();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        $scope.OnDate = today;
        //Set Total Fees

        $scope.SetMonthsArrayToSave = [];
        $scope.CollectionMonthDetail = [];
        $scope.SetMonthsArray = function () {
            //debugger;
            $scope.SetMonthsArrayToSave = [];
            $scope.CollectionMonthDetail = [];
            if (vm.FromMonthID === undefined || vm.FromMonthID === null) {
                $scope.SetMonthsArrayToSave = vm.months.filter(function (ob, i) { return (ob.MonthID === vm.monthID); });
            }
            else {
                $scope.SetMonthsArrayToSave = vm.months.filter(function (ob, i) { return (ob.MonthID >= vm.FromMonthID && ob.MonthID <= vm.monthID); });
            }
            angular.forEach($scope.SetMonthsArrayToSave, function (MD) {
                $scope.CollectionMonthDetail.push({
                    CollectionID: vm.CollectionID,
                    CollectionDetailID: 0,
                    MonthID: MD.MonthID,
                    InstituteID: $localStorage.userInfo[0].InstituteID
                });
            });
        };

        vm.setMonthlyFeesCollection = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line

            if (vm.CollectionID === 0) {
                $scope.SetMonthsArray();
            }

            var feesDetails = [].concat.apply([], $scope.feesDetails);
            var fineDetails = [].concat.apply([], $scope.fineDetails);

            monthlyFeeService.setAccFeesCollection({
                CollectionID: vm.CollectionID,
                MonthlyFeeID: null,
                CollectionDate: $scope.OnDate,
                depertmentID: vm.depertmentID === undefined ? null : vm.depertmentID,
                mediumID: vm.mediumID === undefined ? null : vm.mediumID,
                classID: vm.classID === undefined ? null : vm.classID,
                SectionID: null,
                shiftID: vm.shiftID === undefined ? null : vm.shiftID,
                studentID: parseInt(vm.UserID),
                FromMonthID: vm.FromMonthID === undefined || vm.FromMonthID === null ? vm.monthID : vm.FromMonthID,
                monthID: vm.monthID,
                CurrencyID: vm.CurrencyID === undefined ? 1 : vm.CurrencyID,
                Fee: vm.TotalFees,
                Fine: vm.TotalFine,
                Discount: vm.discountAmounts,
                AmountWithDiscount: vm.DueOrAdvanceWithDiscount,
                IsPercent: vm.isPercent,
                COAIDDiscount: vm.DueOrAdvanceWithDiscount > 0 ? 3 : null,
                Scholarship: vm.scholarshipAmmount,
                COAIDScholarship: vm.scholarshipAmmount > 0 ? 2 : null,
                PreviousBalance: vm.previousDue,
                TotalFee: vm.totalAmount,
                TotalPayment: parseFloat(vm.paidAmount),
                COAID: 1,
                COAIDPrevBalance: 5,
                ReturnAmount: vm.returnAmount,
                BalanceAmount: vm.balanceAmount,
                COAIDBalanceAmount: vm.balanceAmount !== 0 ? 4 : null,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                LoggedUserID: $localStorage.userInfo[0].UserID,
                Remarks: 'good',
                BranchID: vm.BranchID,
                MenuID: vm.menuId,
                FeesDetails: feesDetails,
                FineDetails: fineDetails,
                MonthDetail: $scope.CollectionMonthDetail,
                CollectionPaymentID: vm.CollectionPaymentID,
                PaymentMethodID: parseInt(vm.PaymentMethodID),
                CardNo: vm.CardNo === undefined ? '' : vm.CardNo,
                ChequeNo: vm.ChequeNo === undefined ? '' : vm.ChequeNo,
                AccountNo: vm.AccountNo === undefined ? '' : vm.AccountNo,
                MAccountNo: vm.MAccountNo === undefined ? '' : vm.MAccountNo,
                TransactionNo: vm.TransactionNo === undefined ? '' : vm.TransactionNo,
                BankID: vm.BankID === undefined ? null : vm.BankID,
                MBankID: vm.MMBankID === undefined ? null : vm.MBankID,
                YearName: vm.YearName,
                Amount: parseFloat(vm.paidAmount)
            })
                .then(function (data) {
                    if (data[0].CollectionID > 0) {
                        logger.info('Payment Successfully');
                        //if (data.JournalID > 0) {
                        //$scope.SaveJDetail(data);
                        //}
                        $state.go($state.current.name, {}, { reload: true });
                    }
                })
                .catch(function (error) { });
        };

        $scope.SaveJDetail = function (model) {
            //debugger;
            //if (model.IsJournalComplete === 'No') {
            var params = {
                CollectionID: model.CollectionID,
                JournalID: model.JournalID,
                MenuID: vm.menuId,
                BranchID: vm.BranchID
            };
            monthlyFeeService.setJournalDetail(params)
                .then(function (data) {
                    if (data[0].ReturnValue > 0) {
                        //$state.go($state.current.name, {}, { reload: true });
                        logger.info(model.Toltip + ' successfully....');
                        studentMonthlyFeesInfo();
                    }
                })
                .catch(function (error) { });
        };

        vm.printDiv = function printElem(print) {
            //debugger;            
            var content = document.getElementById(print).innerHTML;
            var mywindow = window.open('', 'Print', 'height=1000,width=2000');

            var is_chrome = Boolean(mywindow.chrome);
            mywindow.document.write('<html><head><title></title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(content);
            mywindow.document.write('</body> <br/><br/>');
            mywindow.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Powered By:</font><font color="blue"> onAir International Ltd. </font></footer>');
            mywindow.document.write('</html>');

            if (is_chrome) {
                setTimeout(function () { // wait until all resources loaded 
                    mywindow.document.close(); // necessary for IE >= 10
                    mywindow.focus(); // necessary for IE >= 10
                    mywindow.print(); // change window to winPrint
                    mywindow.close(); // change window to winPrint
                }, 250);
            } else {
                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10

                mywindow.print();
                mywindow.close();
            }
        };

        $scope.itemEvent = function () {
            //$scope.createItem = true;
            //$scope.showStudentFeesInfo = false;
            //$scope.IsShowQT = 0;
            $scope.clearField();
        };

        $scope.getAllBank = function (status) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var funcName = '/getAllBanks';
            return bankAccountService.getModels(funcName)
                .then(function (data) {
                    vm.AllBanks = data;

                    if (status === 'Edit') {
                        vm.bank = {
                            selected: vm.AllBanks.filter(function (ob, i) {
                                return (ob.BankID === vm.BankID);
                            })[0]
                        };
                    }
                });
        };

        vm.AllMBanks = [];
        $scope.getAllMBank = function () {
            vm.AllMBanks = [];
            vm.AllMBanks.push(
                { MBankID: 1, MBankName: 'BKash' },
                { MBankID: 2, MBankName: 'Rocket' },
                { MBankID: 3, MBankName: 'QCash' },
                { MBankID: 4, MBankName: 'MCash' },
                { MBankID: 5, MBankName: 'UCash' },
                { MBankID: 6, MBankName: 'SureCash' }
            );
        };
        $scope.getAllMBank();

        $scope.CallPaymentModal = function (PayID, status) {
            if (PayID !== undefined && PayID !== null && PayID !== '1') {
                $('#ModalPaymentExtension').modal('show'); //jshint ignore : line

                if (PayID === '2' || PayID === '3') {
                    $scope.getAllBank('');
                }

                if (status === 0) {
                    $scope.ResetPaymentModal();
                }
            }
        };

        $scope.ResetPaymentModal = function () {
            vm.CardNo = undefined;
            vm.ChequeNo = undefined;
            vm.AccountNo = undefined;
            vm.MAccountNo = undefined;
            vm.TransactionNo = undefined;
            vm.BankID = undefined;
            vm.MBankID = undefined;
            vm.bank = undefined;
            vm.Mbank = undefined;
        };

        $scope.setYear = function () {
            vm.YearName = $scope.CurrYear;
            vm.year = {
                selected: vm.YearList.filter(function (ob, i) {
                    return (ob.YearName === vm.YearName);
                })[0]
            };
        };
        
        //function studentMonthlyFeesInfo() {
        //    var Params = {
        //        instituteId: $localStorage.userInfo[0].InstituteID
        //    };
        //    return monthlyFeeService.getStudentMonthlyFeesInfo(Params)
        //        .then(function (data) {
        //            vm.monthlyFeesInfo = data;
        //        });
        //}

        //************************************************Start Grid******************************************************
        //Start Server Side Search
        $scope.SearchProperty = '';
        $scope.IsCallFromSearch = false;
        $scope.SearchCancel = function () {
            $scope.SearchProperty = '';
            $scope.SearchNow($scope.SearchProperty);
        };

        $scope.SearchNow = function (searchstring) {
            //debugger;
            $scope.IsCallFromSearch = searchstring === '' ? false : true;
            $scope.SearchProperty = searchstring.toString();
            $scope.pagination.pageNumber = 2;
            $scope.pagination.firstPage();
        };
        //Start Server Side Search

        var objcmnParam = {};
        $scope.gridOptions = [];
        $scope.pagination = {
            paginationPageSizes: [15, 25, 50, 75, 100, 500, 1000, 'All'],
            ddlpageSize: 15,
            pageNumber: 1,
            pageSize: 15,
            totalItems: 0,

            getTotalPages: function () {
                return Math.ceil(this.totalItems / this.pageSize);
            },
            pageSizeChange: function () {
                if (this.ddlpageSize === 'All') {

                    this.pageSize = $scope.pagination.totalItems;
                }
                else {
                    this.pageSize = this.ddlpageSize;
                }

                this.pageNumber = 1;
                studentMonthlyFeesInfos(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    studentMonthlyFeesInfos(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    studentMonthlyFeesInfos(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    studentMonthlyFeesInfos(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    studentMonthlyFeesInfos(1);
                }
            }
        };
        function studentMonthlyFeesInfos(isPaging) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.gridOptions.enableFiltering = true;
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.SearchProperty = $scope.IsCallFromSearch === true ? $scope.SearchProperty : '';

            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };
            $scope.gridOptions = {
                useExternalPagination: true,
                useExternalSorting: true,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                showFooter: true,
                enableGridMenu: true,
                rowTemplate: '<div ng-dblclick="grid.appScope.editModels(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    //{ name: 'AccountID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'BankID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'COAID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    //{ name: 'AccountTypeID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'UserName',
                        displayName: 'Student',
                        width: '18%', height: '50%',
                        headerCellClass: $scope.highlightFilteredHeader,
                        cellTemplate: '<div title="User: {{row.entity.UserName}}, Class : {{row.entity.Class}}, Roll : {{row.entity.RollNo}}, Student ID : {{row.entity.RFID}} & Section : {{row.entity.Section}}" style="margin-bottom:9px">' +
                        '<p class="label Htag">{{row.entity.UserName}}, Class : {{row.entity.Class}}, Roll : {{row.entity.RollNo}}, Student ID : {{row.entity.RFID}}, Section : {{row.entity.Section}}</p>' +
                        '</div>'
                    },
                    { name: 'Fee', displayName: 'Fee', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'fine', displayName: 'fine', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Discount', displayName: 'Discount', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Scholarship', displayName: 'Scholarship', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'TotalFee', displayName: 'Total Fee', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'TotalPayment', displayName: 'Total Payment', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ReturnAmount', displayName: 'Return Amount', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'IsJournalComplete', displayName: 'Journal Complete', headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '18%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#428bca; color: white" >' +
                        '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#428bca; color: white" class="bs-tooltip" title="{{row.entity.Toltip}}" ng-click="grid.appScope.SaveJDetail(row.entity)">' +
                        '<i class="{{row.entity.JSU}}" aria-hidden="true"></i></a></button>' +
                        '<button class="label label-success label-mini" style="background-color:#0aa699; color: white">' +
                        '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#0aa699; color: white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true"></i></a></button>' +
                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true"></i></a></button>'
                    }
                ],
                //enableGridMenu: true,
                //enableSelectAll: true,
                exporterCsvFilename: 'BankAccount.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: 'Account List', style: 'headerStyle' },
                exporterPdfFooter: function (currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function (docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'landscape',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                exporterCsvLinkElement: angular.element(document.querySelectorAll('.custom-csv-link-location')),
                exporterExcelFilename: 'BankAccount.xlsx',
                exporterExcelSheetName: 'Sheet1'
            };

            return monthlyFeeService.getStudentMonthlyFeesInfo(objcmnParam)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.pagination.totalItems = data[0].RecordTotal;
                        $scope.gridOptions.data = data;
                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                    $scope.loaderMore = false;
                });
        }
        function studentMonthlyFeesInfo() {
            $scope.pagination.pageNumber = 1;
            studentMonthlyFeesInfos(0);
        }
        //************************************************End Grid******************************************************


        activate();
        function activate() {
            var promises = [getAllYear(), getAllShift(), getAllMedium(), getAllMonth(), getPaymentMethod(), getCurrency(), getAllInsFeesHead(), getAllFeesType()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        function getAllYear() {
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return commonService.getCmnYear()
                .then(function (data) {
                    //data.push({ ShiftID: 0, ShiftName: 'None' });
                    vm.YearList = data;
                    vm.YearName = $scope.CurrYear;
                    vm.year = {
                        selected: vm.YearList.filter(function (ob, i) {
                            return (ob.YearName === vm.YearName);
                        })[0]
                    };
                });
        }

        function getAllShift() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    //data.push({ ShiftID: 0, ShiftName: 'None' });
                    vm.shifts = data;
                });
        }

        function getAllMedium() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    //data.push({ MediumID: 0, MameName: 'None' });
                    vm.mediums = data;
                });
        }
        vm.getAllClass = function (status) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MediumID: vm.mediumID
            };
            return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                .then(function (data) {
                    //data.push({ ClassID: 0, ClassName: 'None' });
                    vm.classes = data;
                    if (status === 'Edit') {
                        vm.class = {
                            selected: vm.classes.filter(function (ob, i) {
                                return (ob.ClassID === vm.classID);
                            })[0]
                        };
                    }
                });
        };
        vm.getAllDepertment = function (status) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ClassID: vm.classID,
                MediumID: vm.mediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    //data.push({ DepartmentID: 0, DepartmentName: 'None' });
                    vm.depertments = data;
                    if (status === 'Edit') {
                        vm.depertment = {
                            selected: vm.depertments.filter(function (ob, i) {
                                return (ob.DepartmentID === vm.depertmentID);
                            })[0]
                        };
                    }
                });
        };

        function getAllMonth() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            return studentAtdReportSettingsService.getMonths()
                .then(function (data) {
                    //data.push({ MonthID: 0, MonthName: 'None' });
                    vm.months = data;
                });
        }
        function getPaymentMethod() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            return commonService.getPaymentMethod()
                .then(function (data) {
                    vm.paymentMethods = data;
                });
        }
        function getCurrency() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return commonService.getCurrency()
                .then(function (data) {
                    //data.push({ CurrencyID: 0, Currency: 'None' });
                    vm.currencys = data;
                    vm.CurrencyID = 1;
                    vm.currency = { selected: vm.currencys.filter(function (ob, i) { return (ob.CurrencyID === 1); })[0] };
                });
        }

        function getAllInsFeesHead() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            //vm.FeesTypeID = FeesTypeID;
            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                FeesTypeID: 0
            };

            monthlyFeeService.getFeesHeadByFeesTypeID(params)
                .then(function (data) {
                    vm.allFeesHead = data;
                });

        }

        function getAllFeesType() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            FeeService.getFeesType()
                .then(function (data) {
                    //debugger;
                    vm.FeesTypeList = data;
                });
        }

        vm.feesTypeSelected = function (val, model) {
            //debugger;
            if (model !== undefined) {
                var IfExistselected = model.feesHeadddl.filter(function (ob, i) { return (ob.FeesTypeID === model.FeesTypeID); })[0];
                if (IfExistselected === undefined) {
                    model.feesHeadSelected = undefined;
                    model.feesHeadddl = vm.allFeesHead.filter(function (ob, i) { return (ob.FeesTypeID === model.FeesTypeID); });
                }
            }
        };

        //vm.feesTypeSelected = function (FeesTypeID) {


        //    //Generate Token API Pass Call
        //    authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



        //    vm.FeesTypeID = FeesTypeID;
        //    var params = {
        //        instituteId: $localStorage.userInfo[0].InstituteID,
        //        FeesTypeID: FeesTypeID
        //    };

        //    monthlyFeeService.getFeesHeadByFeesTypeID(params)
        //        .then(function (data) {
        //            vm.feesHead = data;
        //        });

        //};

        vm.feesHeadTypeSelected = function (model) {

            //debugger;
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                FeesTypeID: model.FeesTypeID,
                FeesHeadID: model.FeesHeadID
            };

            monthlyFeeService.getFeeByFeesId(params)
                .then(function (data) {
                    var FeeSetupID = 0;
                    if (data.length > 0) {
                        vm.fees = data[0].Fee;
                        FeeSetupID = parseInt(data[0].FeesSetupID);
                    } else {
                        vm.fees = 0;
                    }
                    model.Fee = vm.fees;
                    model.TotalFees = vm.fees * model.NoOfMonth;
                    model.FeesSetupID = FeeSetupID;
                    //$scope.feesDetails.slice(-1)[0][0].Fee = vm.fees;
                });

        };
    }
})();
