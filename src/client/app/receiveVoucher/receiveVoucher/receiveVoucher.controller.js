(function () {
    'use strict';

    angular
        .module('app.receiveVoucher')
        .controller('ReceiveVoucherController', ReceiveVoucherController);


    ReceiveVoucherController.$inject = ['journalService', 'filterurl', '$q', 'authservice', 'commonService', 'conversion', 'chartOfAccountsService', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants'];

    function ReceiveVoucherController(journalService, filterurl, $q, authservice, commonService, conversion, chartOfAccountsService, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants) {
        //**************************************************************** Declaration + Initialization ************************************************************************************* */

        var vm = this; //jshint ignore : line


        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration



        var objcmnParam = {};
        $scope.cmnParam = function () {
            objcmnParam = conversion.cmnParams($localStorage);
        };
        $scope.cmnParam();
        vm.LoggedUserID = objcmnParam.LoggedUserID;
        vm.InstituteID = objcmnParam.InstituteID;
        vm.BranchID = objcmnParam.BranchID;
        vm.JournalID = 0;
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.detailGrid = true;
        $scope.IsVisible = false;
        $scope.IsUp = 7;
        vm.JournalDate = conversion.NowDateCustom();
        vm.IsShowBA = false;

        //**********************************************************HTML Show/Hide ************************************************************************************* */
        $scope.itemEvent = function () {
            $scope.IsVisible = $scope.IsVisible ? false : true;
            if ($scope.IsVisible === true) {
                $scope.showItem = true;
                $scope.createItem = false;
                $scope.detailGrid = false;
            } else {
                $scope.showItem = false;
                $scope.createItem = true;
                $scope.detailGrid = true;
                $scope.clearField();
            }
        };
        //**********************************************************Load Section************************************************************************************* */


        $scope.showRecVouch = function () {
            if ($localStorage.userInfo[0].InstituteID === undefined) {
                logger.error('Please Select an Institute');
                return;
            } else {
                //  $scope.UpdateItem = false;
                $('#myModal').modal('show'); //jshint ignore :line
                $scope.pagination.pageNumber = 1;
                vm.getStudentDetailsInfo(0);
            }
        };



        //************************************************Start UI Grid******************************************************

        $scope.showPayVouch = function () {

            if ($localStorage.userInfo[0].InstituteID === undefined) {
                logger.error('Please Select an Institute');
                return;
            } else {
                //  $scope.UpdateItem = false;
                $('#myModal').modal('show'); //jshint ignore :line
                $scope.pagination.pageNumber = 1;
                vm.getStudentDetailsInfo(0);
            }
        };


        var objcmnParam = {}; //jshint ignore : line
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
                } else {
                    this.pageSize = this.ddlpageSize;
                }

                this.pageNumber = 1;
                vm.getStudentDetailsInfo(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getStudentDetailsInfo(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getStudentDetailsInfo(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getStudentDetailsInfo(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getStudentDetailsInfo(1);
                }
            }
        };
        vm.getStudentDetailsInfo = function (isPaging) {
            $scope.gridOptions.enableFiltering = true;
            $scope.pagination.pageNumber = $scope.pagination.pageNumber === undefined ? 1 : $scope.pagination.pageNumber;
            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            objcmnParam.instituteId = $localStorage.userInfo[0].InstituteID;
            objcmnParam.p2 = 0;
            objcmnParam.p3 = 0;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
            objcmnParam.SearchProperty = null;

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
                rowTemplate: '<div ng-dblclick=grid.appScope.selectedEvent(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [

                    {
                        name: 'PaymentNo',
                        displayName: 'Receive No',
                        headerCellClass: $scope.highlightFilteredHeader
                    },
                    {
                        name: 'BrunchName',
                        displayName: 'Brunch',
                        headerCellClass: $scope.highlightFilteredHeader
                    },
                    {
                        name: 'JournalDate',
                        displayName: 'Journal Date',
                        headerCellClass: $scope.highlightFilteredHeader
                    },
                    {
                        name: 'UserName',
                        displayName: 'Payment To',
                        headerCellClass: $scope.highlightFilteredHeader
                    },
                    //{ name: 'ShiftName', displayName: 'Shift', headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'Remarks',
                        displayName: 'Remarks',
                        headerCellClass: $scope.highlightFilteredHeader
                    },

                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '16%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>'
                    }
                ],
                exporterAllDataFn: function () {
                    var getPage = 0;
                    var paginationOptions = {};
                    return getPage(1, $scope.gridOptions.totalItems, paginationOptions.sort)
                        .then(function () {
                            $scope.gridOptions.useExternalPagination = false;
                            $scope.gridOptions.useExternalSorting = false;
                            getPage = null;
                        });
                },
            };


            return journalService.getReceiveVoucher(objcmnParam)

                .then(function (data) {
                    angular.forEach(data, function (d) {
                        d.ImageUrl = d.ImageUrl === null || d.ImageUrl === '' ? 'images/profiles/no-user-image.png' : vm.imgHost + d.ImageUrl;
                    });

                    if (data.length === 0) {
                        $scope.gridOptions.data = [];
                        logger.error('No data found.............');


                    } else {
                        $scope.pagination.totalItems = data[0].length;
                        $scope.gridOptions.data = data;
                        $scope.loaderMore = false;
                    }


                });
        };


        //************************************************End Grid******************************************************




        vm.loadHeadType = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return chartOfAccountsService.getChartOfAccountTypeByInsID(objcmnParam)
                .then(function (data) {
                    vm.coaType = data;
                });
        };

        vm.loadParentHeadOnChangeHeadType = function (headtypeID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line


            objcmnParam.Insid = objcmnParam.InstituteID;
            objcmnParam.COATypeID = headtypeID;
            return chartOfAccountsService.getChartOfAccountByTypeID(objcmnParam)
                .then(function (data) {
                    vm.coaByTypeID = data;
                });
        };

        vm.loadChequeModal = function () {
            $('#modalCheque').modal('show'); //jshint ignore : line
            vm.ChequeSetup.ChequeIssueDate = vm.JournalDate;
        };

        $scope.SetDetailArray = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (vm.JournalID === 0 && vm.ChequeSetup !== undefined) {
                vm.JournalDetailList = [];
                if (vm.JournalTypeID === 3) {
                    //------------Start Dabit
                    vm.JournalDetailList.push({
                        JournalID: vm.JournalID,
                        JournalDetailID: 0,
                        COAID: null,
                        CL: {
                            selected: null
                        },
                        UserID: vm.ChequeSetup.PartyID,
                        USR: {
                            selected: vm.UserList.filter(function (ob, i) {
                                return (ob.UserID === vm.ChequeSetup.PartyID.toString());
                            })[0]
                        },
                        CostCenterID: null,
                        BR: {
                            selected: null
                        },
                        DrAmount: vm.ChequeSetup.ChequeAmount === 0 ? null : vm.ChequeSetup.ChequeAmount,
                        CrAmount: 0
                    });
                    //------------End Dabit
                    //------------Start Credit
                    vm.JournalDetailList.push({
                        JournalID: vm.JournalID,
                        JournalDetailID: 0,
                        COAID: vm.BankAccountList.filter(function (ob, i) {
                            return (ob.AccountID === vm.AccountID);
                        })[0].COAID,
                        CL: {
                            selected: vm.COAList.filter(function (ob, i) {
                                return (ob.COAID === vm.BankAccountList.filter(function (ob, i) {
                                    return (ob.AccountID === vm.AccountID);
                                })[0].COAID);
                            })[0]
                        }, //jshint ignore : line
                        UserID: null,
                        USR: {
                            selected: null
                        },
                        CostCenterID: null,
                        BR: {
                            selected: null
                        },
                        DrAmount: 0,
                        CrAmount: vm.ChequeSetup.ChequeAmount === 0 ? null : vm.ChequeSetup.ChequeAmount
                    });
                    //------------End Credit
                } else if (vm.JournalTypeID === 5) {
                    //------------Start Dabit
                    vm.JournalDetailList.push({
                        JournalID: vm.JournalID,
                        JournalDetailID: 0,
                        COAID: null,
                        CL: {
                            selected: vm.COAList.filter(function (ob, i) {
                                return (ob.COAID === vm.BankAccountList.filter(function (ob, i) {
                                    return (ob.AccountID === vm.AccountID);
                                })[0].COAID);
                            })[0]
                        }, //jshint ignore : line
                        UserID: null,
                        USR: {
                            selected: null
                        },
                        CostCenterID: null,
                        BR: {
                            selected: null
                        },
                        DrAmount: vm.ChequeSetup.ChequeAmount === 0 ? null : vm.ChequeSetup.ChequeAmount,
                        CrAmount: 0
                    });
                    //------------End Dabit
                    //------------Start Credit
                    vm.JournalDetailList.push({
                        JournalID: vm.JournalID,
                        JournalDetailID: 0,
                        COAID: vm.BankAccountList.filter(function (ob, i) {
                            return (ob.AccountID === vm.AccountID);
                        })[0].COAID, //jshint ignore : line
                        CL: {
                            selected: null
                        },
                        UserID: vm.ChequeSetup.PartyID,
                        USR: {
                            selected: vm.UserList.filter(function (ob, i) {
                                return (ob.UserID === vm.ChequeSetup.PartyID.toString());
                            })[0]
                        },
                        DrAmount: 0,
                        CrAmount: vm.ChequeSetup.ChequeAmount === 0 ? null : vm.ChequeSetup.ChequeAmount
                    });
                    //------------End Credit
                }
            } else {
                vm.JournalDetailList = [];
                if (vm.JournalTypeID === 3) {
                    //------------Start Dabit
                    vm.JournalDetailList.push({
                        JournalID: vm.JournalID,
                        JournalDetailID: 0,
                        COAID: null,
                        CL: {
                            selected: null
                        },
                        UserID: vm.ChequeSetup.PartyID,
                        USR: {
                            selected: vm.UserList.filter(function (ob, i) {
                                return (ob.UserID === vm.ChequeSetup.PartyID.toString());
                            })[0]
                        },
                        CostCenterID: null,
                        BR: {
                            selected: null
                        },
                        DrAmount: vm.ChequeSetup.ChequeAmount === 0 ? null : vm.ChequeSetup.ChequeAmount,
                        CrAmount: 0
                    });
                    //------------End Dabit
                    //------------Start Credit
                    vm.JournalDetailList.push({
                        JournalID: vm.JournalID,
                        JournalDetailID: 0,
                        COAID: vm.BankAccountList.filter(function (ob, i) {
                            return (ob.AccountID === vm.AccountID);
                        })[0].COAID, //jshint ignore : line
                        CL: {
                            selected: vm.COAList.filter(function (ob, i) {
                                return (ob.COAID === vm.BankAccountList.filter(function (ob, i) {
                                    return (ob.AccountID === vm.AccountID);
                                })[0].COAID);
                            })[0]
                        }, //jshint ignore : line
                        UserID: null,
                        USR: {
                            selected: null
                        },
                        CostCenterID: null,
                        BR: {
                            selected: null
                        },
                        DrAmount: 0,
                        CrAmount: vm.ChequeSetup.ChequeAmount === 0 ? null : vm.ChequeSetup.ChequeAmount
                    });
                    //------------End Credit
                } else if (vm.JournalTypeID === 5) {
                    //------------Start Dabit
                    vm.JournalDetailList.push({
                        JournalID: vm.JournalID,
                        JournalDetailID: 0,
                        COAID: null,
                        CL: {
                            selected: vm.COAList.filter(function (ob, i) {
                                return (ob.COAID === vm.BankAccountList.filter(function (ob, i) {
                                    return (ob.AccountID === vm.AccountID);
                                })[0].COAID);
                            })[0]
                        }, //jshint ignore : line
                        UserID: null,
                        USR: {
                            selected: null
                        },
                        CostCenterID: null,
                        BR: {
                            selected: null
                        },
                        DrAmount: vm.ChequeSetup.ChequeAmount === 0 ? null : vm.ChequeSetup.ChequeAmount,
                        CrAmount: 0
                    });
                    //------------End Dabit
                    //------------Start Credit
                    vm.JournalDetailList.push({
                        JournalID: vm.JournalID,
                        JournalDetailID: 0,
                        COAID: vm.BankAccountList.filter(function (ob, i) {
                            return (ob.AccountID === vm.AccountID);
                        })[0].COAID, //jshint ignore : line
                        CL: {
                            selected: null
                        },
                        UserID: vm.ChequeSetup.PartyID,
                        USR: {
                            selected: vm.UserList.filter(function (ob, i) {
                                return (ob.UserID === vm.ChequeSetup.PartyID.toString());
                            })[0]
                        },
                        DrAmount: 0,
                        CrAmount: vm.ChequeSetup.ChequeAmount === 0 ? null : vm.ChequeSetup.ChequeAmount
                    });
                    //------------End Credit
                }
            }

            $scope.subTotalDrCrAmt();
        };

        vm.loadChequePopOnChangeVType = function (SelectID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            if (SelectID === 3 || SelectID === 5) {

                if (vm.BA !== undefined) {
                    vm.AccountID = vm.AccountID === undefined ? null : null;
                    vm.BA.selected = vm.BA.selected === undefined ? null : null;
                }

                vm.IsShowBA = true;
                vm.AccountID = null;
                vm.loadBankAccountNo('');
                vm.ChequeSetup = {};
            } else {
                vm.IsShowBA = false;
            }
        };

        vm.loadBankAccountNo = function (modelState) {


            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return journalService.getBankAccountList()
                .then(function (data) {
                    vm.BankAccountList = data;
                    if (modelState === 'Edit') {
                        vm.BA = {
                            selected: vm.BankAccountList.filter(function (ob, i) {
                                return (ob.AccountID === vm.AccountID);
                            })[0]
                        };
                    }
                });
        };

        vm.JournalDetailList = [];
        vm.JournalDetail = [];
        vm.addToList = function (model) {
            if (vm.JournalDetailList.length === 0) {
                vm.JournalDetailList = [];
                vm.JournalDetailList.push({
                    JournalID: 0,
                    JournalDetailID: 0,
                    COAID: null,
                    UserID: '',
                    CostCenterID: null,
                    DrAmount: null,
                    CrAmount: null,
                    EntryType: 'Receive'
                });
            } else {
                if (model.COAID !== null && model.DrAmount != null) {
                    vm.JournalDetailList.reverse();
                    vm.JournalDetailList.push({
                        JournalID: 0,
                        JournalDetailID: 0,
                        COAID: null,
                        UserID: '',
                        CostCenterID: null,
                        DrAmount: null,
                        CrAmount: null,
                        EntryType: 'Receive'
                    });
                    vm.JournalDetailList.reverse();
                } else {
                    logger.error('Invalid input');
                }
            }
        };
        vm.addToList();

        vm.EnterToTab = function (mode, index) {

            $("" + mode + "" + "[tabindex=" + index + "]").focus(); //jshint ignore : line

        };

        vm.SetDr = function (model) {
            model.CrAmount = null;
            $scope.subTotalDrCrAmt();
        };
        vm.SetCr = function (model) {
            model.DrAmount = null;
            $scope.subTotalDrCrAmt();
        };

        $scope.subTotalDrCrAmt = function () {
            var ttlDr = 0;
            var ttlCr = 0;
            var TtlDr = 0;
            var TtlCr = 0;
            angular.forEach(vm.JournalDetailList, function (JDL) {
                ttlDr = ttlDr + (TtlDr = JDL.DrAmount === null || JDL.DrAmount === undefined ? 0 : JDL.DrAmount);
                ttlCr = ttlCr + (TtlCr = JDL.CrAmount === null || JDL.CrAmount === undefined ? 0 : JDL.CrAmount);
                $scope.ttlDrAmount = ttlDr;
                $scope.ttlCrAmount = ttlCr;
            });
        };


        vm.deleteDetailRows = function (model, index) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            if (index !== 0) {
                vm.JournalDetailList.splice(index, 1);
            } else {
                if (model.CL !== undefined) {
                    model.CL.selected = undefined;
                }
                if (model.USR !== undefined) {
                    model.USR.selected = undefined;
                }
                if (model.BR !== undefined) {
                    model.BR.selected = undefined;
                }
                model.COAID = null;
                model.UserID = '';
                model.CostCenterID = null;
                model.CrAmount = null;
                model.DrAmount = null;

            }
            $scope.subTotalDrCrAmt();
        };

        $scope.manageMaster = function () {
            vm.CustomCode = vm.CustomCode === '' || vm.CustomCode === undefined ? '' : vm.CustomCode;
            vm.ManualVoucherNo = vm.ManualVoucherNo === '' || vm.ManualVoucherNo === undefined ? '' : vm.ManualVoucherNo;
            vm.JournalDate = vm.JournalDate === '' || vm.JournalDate === undefined ? null : conversion.getStringToDate(vm.JournalDate);
            vm.JournalTypeID = vm.JournalTypeID === null || vm.JournalTypeID === undefined ? '' : vm.JournalTypeID;
            vm.CurrencyID = vm.CurrencyID === null || vm.CurrencyID === undefined ? '' : vm.CurrencyID;
            vm.Narration = vm.Narration === '' || vm.Narration === undefined ? '' : vm.Narration;
            vm.AccountID = vm.AccountID === null || vm.AccountID === undefined ? null : vm.AccountID;
        };

        $scope.manageChequeModal = function () {
            if (vm.ChequeSetup !== undefined) {
                vm.ChequeSetup.ChequeID = vm.ChequeSetup.ChequeID === undefined ? 0 : vm.ChequeSetup.ChequeID;
            } else {
                vm.ChequeSetup.ChequeID = 0;
            }
            vm.ChequeSetup.JournalID = vm.JournalID;
            vm.ChequeSetup.ChequeNo = vm.ChequeSetup.ChequeNo === '' || vm.ChequeSetup.ChequeNo === undefined ? '' : vm.ChequeSetup.ChequeNo;
            vm.ChequeSetup.AccountID = vm.AccountID === null || vm.AccountID === undefined ? null : vm.AccountID;
            vm.ChequeSetup.PartyID = vm.ChequeSetup.PartyID === null || vm.ChequeSetup.PartyID === undefined ? null : vm.ChequeSetup.PartyID;
            vm.ChequeSetup.ChequeDisburseDate = vm.ChequeSetup.ChequeDisburseDate === null || vm.ChequeSetup.ChequeDisburseDate === undefined ? null : conversion.getStringToDate(vm.ChequeSetup.ChequeDisburseDate);
            vm.ChequeSetup.ChequeIssueDate = vm.ChequeSetup.ChequeIssueDate === null || vm.ChequeSetup.ChequeIssueDate === undefined ? null : conversion.getStringToDate(vm.ChequeSetup.ChequeIssueDate);
            vm.ChequeSetup.ChequeAmount = vm.ChequeSetup.ChequeAmount === null || vm.ChequeSetup.ChequeAmount === undefined ? null : vm.ChequeSetup.ChequeAmount;

            if (vm.ChequeSetup.PartyID !== null && vm.ChequeSetup.ChequeNo !== '' && vm.ChequeSetup.ChequeDisburseDate !== null && vm.ChequeSetup.ChequeIssueDate !== '') {
                vm.PostChequeSetup = vm.ChequeSetup;
            } else {
                vm.PostChequeSetup = null;
            }
        };

        $scope.manageDetailList = function () {
            angular.forEach(vm.JournalDetailList, function (model) {
                if (model.COAID != null && (model.CrAmount != null || model.DrAmount != null)) {
                    vm.JournalDetail.push({
                        JournalID: model.JournalID,
                        JournalDetailID: model.JournalDetailID,
                        COAID: model.COAID === null || model.COAID === undefined ? null : model.COAID,
                        UserID: model.UserID === null || model.UserID === undefined ? null : model.UserID,
                        CostCenterID: model.CostCenterID === null || model.CostCenterID === undefined ? null : model.CostCenterID,
                        DrAmount: model.DrAmount === null ? 0 : model.DrAmount,
                        CrAmount: model.CrAmount === null ? 0 : model.CrAmount
                    });
                }
            });
        };



        //debugger;
        vm.Save = function () {

            journalService.setPaymentReceiveVoucherRecord({
                JournalID: 0,
                CustomCode: '',
                ManualVoucherNo: vm.ReceiveNo,
                JournalDate: conversion.getStringToDate(vm.selectedDate),
                JournalTypeID: 0,
                AccountID: null,
                CurrencyID: 1, //default BDT
                Narration: vm.Narration === undefined ? '' : vm.Narration,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                BranchID: vm.BrunchID,
                LoggedUserID: vm.RecFromID,
                TransactionID: 0,
                MenuID: parseInt($localStorage.menuItm.MenuID),
                COAMID: vm.ReceiveToID, // not save in DB need to discuss
                //detail
                AccInfo: vm.JournalDetailList,
                Journal_Detail_ID_For_Sum: vm.Journal_Detail_ID_For_Sum,
                Journal_MasterID: vm.Journal_MasterID,
                Journal_Detail_COAID_For_Sum: vm.Journal_Detail_COAID_For_Sum

            }).
                then(function (data) {
                    logger.info('Saved!');
                    $scope.clearField();
                })
                .catch(function (error) { });
        };


        $scope.DetailIndex = null;
        $scope.DetailModel = '';




        vm.saveParty = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            if (vm.PartySetup !== undefined) {
                vm.PartySetup.UserID = vm.PartySetup.UserID === undefined ? 0 : vm.PartySetup.UserID;
            } else {
                vm.PartySetup.UserID = 0;
            }
            vm.PartySetup.UserTypeID = 19;
            vm.PartySetup.UserFullName = vm.PartySetup.UserFullName === '' || vm.PartySetup.UserFullName === undefined ? '' : vm.PartySetup.UserFullName;
            vm.PartySetup.PhoneNo = vm.PartySetup.PhoneNo === '' || vm.PartySetup.PhoneNo === undefined ? '' : vm.PartySetup.PhoneNo;
            vm.PartySetup.EmailID = vm.PartySetup.EmailID === '' || vm.PartySetup.EmailID === undefined ? '' : vm.PartySetup.EmailID;
            vm.PartySetup.PreAddress = vm.PartySetup.PreAddress === '' || vm.PartySetup.PreAddress === undefined ? '' : vm.PartySetup.PreAddress;
            vm.PartySetup.LoggedUserID = $localStorage.userInfo[0].UserID;
            vm.PartySetup.InstituteID = $localStorage.userInfo[0].InstituteID;
            var FuncName = '/postCmnUserJournal';
            return journalService.InsertJournalData(FuncName, vm.PartySetup)
                .then(function (data) {
                    if (data[0].UserID !== '' && data[0].UserName !== '') {

                        vm.CurrencyList.push({
                            UserID: data[0].UserID,
                            UserFullName: data[0].UserName
                        });
                        vm.Curr = {
                            selected: vm.CurrencyList.filter(function (ob, i) {
                                return (ob.UserID === data[0].UserID);
                            })[0]
                        };
                        vm.RecFromID = data[0].UserID;
                        $scope.ClearPartyModal();

                    } else {
                        logger.error('Error Occuring, Please Check');
                    }
                });
        };



        //grid Edit Button Click
        $scope.editModels = function (model) {
            $scope.cmnParam();
            objcmnParam.JournalID = model.JournalID;
            $scope.getMasterByID(objcmnParam);
            $scope.getDetailByID(objcmnParam);
            //CLOSE UI grid Modal
            $('#myModal').modal('hide'); //jshint ignore : line         

        };




        $scope.getMasterByID = function (objcmnParam) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var FuncName = '/getJournalMasterByID';
            return journalService.InsertJournalData(FuncName, objcmnParam)
                .then(function (data) {
                    if (data[0] !== null) {

                        vm.ReceiveNo = data[0].ManualVoucherNo;
                        vm.brunch = {
                            selected: vm.branches.filter(function (ob, i) {
                                return (ob.BrunchID === data[0].BranchID);
                            })[0]
                        };
                        vm.BrunchID = vm.brunch.selected.BrunchID;
                        vm.selectedDate = formatDate(data[0].JournalDate);
                        vm.Narration = data[0].Narration;
                        vm.Journal_MasterID = data[0].JournalID;
                    } else {
                        logger.error('Error Occured, Please Check');
                    }
                });
        };



        $scope.getDetailByID = function (objcmnParam) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            //debugger;
            var FuncName = '/getJournalDetailByID';
            return journalService.InsertJournalData(FuncName, objcmnParam)
                .then(function (data) {
                    var UserIDs = '';
                    vm.JournalDetailList = [];
                    vm.addToList();
                    if (data.length > 0) {
                        angular.forEach(data, function (detail) {
                            //JournalID: 0, JournalDetailID: 0, COAID: null, UserID: '', CostCenterID: null, DrAmount: null, CrAmount: null, EntryType: 'Payment'

                            if (detail.DrAmount !== 0) {
                                vm.JournalDetailList.push({
                                    JournalID: detail.JournalID,
                                    JournalDetailID: detail.JournalDetailID,
                                    COAID: detail.COAID,
                                    UserID: detail.UserID,
                                    CostCenterID: detail.CostCenterID,
                                    DrAmount: (detail.DrAmount === 0) ? null : detail.DrAmount,
                                    CL: {
                                        selected: vm.COAList.filter(function (ob, i) {
                                            return (ob.COAID === detail.COAID);
                                        })[0]
                                    },
                                    EntryType: 'Payment',

                                });
                            } else {
                                vm.Journal_Detail_ID_For_Sum = detail.JournalDetailID;
                                vm.Journal_Detail_COAID_For_Sum = detail.COAID;

                                //Receive From 
                                vm.Curr = {
                                    selected: vm.CurrencyList.filter(function (ob, i) {
                                        return (ob.UserID === detail.UserID.toString());
                                    })[0]
                                };
                                vm.RecFromID = vm.Curr.selected.UserID;
                            }

                        });

                        $scope.subTotalDrCrAmt();
                    }
                    //Receive To 
                    vm.Type = {
                        selected: vm.JournalTypeList.filter(function (ob, i) {
                            return (ob.AccountNo === data[0].AccountNo);
                        })[0]
                    };
                    vm.ReceiveToID = vm.Type.selected.AccountNo;
                });
        };




        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) {
                month = '0' + month;
            }
            if (day.length < 2) {
                day = '0' + day;
            }

            return [day, month, year].join('-');
        }



        $scope.deleteModels = function (model) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)); //jshint ignore : line


            $scope.cmnParam();
            objcmnParam.JournalID = model.JournalID;
            var FuncName = '/deleteJournalByID';
            return journalService.InsertJournalData(FuncName, objcmnParam)
                .then(function (data) {
                    if (data[0].ReturnValue > 0) {
                        logger.info('Data deleted successfully!!!');
                        vm.getStudentDetailsInfo(0);
                    } else {
                        logger.error('Data cant be deleted, Please Check and try again!!!');
                    }
                });
        };




        //**********************************************************Clear/Reset************************************************************************************* */
        $scope.ClearChequeModal = function () {
            // debugger;
            vm.IsShowBA = false;
            vm.ChequeSetup.ChequeID = 0;
            vm.ChequeSetup.PartyID = '';
            vm.ChequeSetup.USR = {
                selected: null
            };
            vm.ChequeSetup.ChequeNo = '';
            vm.ChequeSetup.ChequeDisburseDate = '';
            vm.ChequeSetup.ChequeIssueDate = '';
            vm.AccountID = null;
            vm.BA = {
                selected: null
            };
            $scope.IsUp = 7;
        };

        $scope.ClearPartyModal = function () {
            vm.PartySetup.UserID = undefined;
            vm.PartySetup.UserTypeID = 19;
            vm.PartySetup.UserFullName = undefined;
            vm.PartySetup.PhoneNo = undefined;
            vm.PartySetup.EmailID = undefined;
            vm.PartySetup.PreAddress = undefined;
        };
        // Reset Button Logic
        $scope.clearField = function () {
            clear();
            $scope.showItem = false;
        };
        // clearing data 
        function clear() {
            $state.go($state.current.name, {}, {
                reload: true
            });
        }




        activate();

        function activate() {
            var promises = [loadVoucherList(), loadCurrencyList(), loadCOAList(), loadBranchList(), loadPartyList(), loadInstituteBranch()];
            return $q.all(promises).then(function () { });
        }

        function loadVoucherList() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID
            };

            return journalService.getAccLedgVoucher(params)
                .then(function (data) {
                    vm.JournalTypeList = data;
                });
        }


        function loadCurrencyList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            //debugger;
            return journalService.getPartyList()
                .then(function (data) {
                    vm.CurrencyList = data;
                });
        }


        //debugger;
        function loadInstituteBranch() {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };

            return commonService.getInstituteBrunchDdl(params)
                .then(function (data4) {
                    vm.branches = data4;
                });
        }




        function loadCOAList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return journalService.getCOAList()
                .then(function (data) {
                    vm.COAList = data;
                });
        }

        function loadPartyList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return journalService.getPartyList()
                .then(function (data) {
                    vm.UserList = data;
                });
        }

        function loadBranchList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return journalService.getBranchList(vm)
                .then(function (data) {
                    vm.BranchList = data;
                });
        }



    }
})();
