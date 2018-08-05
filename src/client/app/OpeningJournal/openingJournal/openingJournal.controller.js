(function () {
    'use strict';

    angular
        .module('app.OpeningJournal')
        .controller('OpeningJournalController', OpeningJournalController);


    OpeningJournalController.$inject = ['OpeningjournalService','journalService', 'filterurl', '$q', 'authservice', 'commonService', 'conversion', 'chartOfAccountsService', 'logger', '$scope', '$localStorage', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', 'userAuthenticationService','apiConfig'];
    function OpeningJournalController(OpeningjournalService, journalService, filterurl, $q, authservice, commonService, conversion, chartOfAccountsService, logger, $scope, $localStorage, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, userAuthenticationService, apiConfig) {
        //************************************************************ Declaration + Initialization ************************************************************************************* */

        var vm = this;
        //$scope.printJournal = true
        var params = {};
        //==============for report header information ===
        vm.imgHost = apiConfig.imagehost;
        $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
        $scope.InsEmail = $localStorage.userInfo[0].InsEmail;
        $scope.InsAddress = $localStorage.userInfo[0].InsAddress;
        $scope.InsWeb = $localStorage.userInfo[0].InsWeb;
        $scope.InsPhoneNo = $localStorage.userInfo[0].InsPhoneNo;
        $scope.InstituteNameRep = $localStorage.userInfo[0].InstituteName;

        // ============end report Heasder information===


        $scope.showItemPartyList = false;
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.InstituteName = $localStorage.userInfo[0].InstituteName;
        vm.BrunchID = $localStorage.userInfo[0].BrunchID;
        vm.BrunchName = $localStorage.userInfo[0].BrunchName;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration
        $scope.InsModel = {
            BrunchID: vm.InstituteID,
            BrunchName: vm.InstituteName
        };

        $scope.InsModelBranch = {
            BrunchID: vm.BrunchID,
            BrunchName: vm.BrunchName
        };


        $scope.showAndHideModal = function () {
            $('#myModal').modal('hide'); //jshint ignore : line
        };






        var objcmnParam = {};
        $scope.cmnParam = function () { objcmnParam = conversion.cmnParams($localStorage); };
        $scope.cmnParam();
        vm.LoggedUserID = objcmnParam.LoggedUserID;
        vm.InstituteID = objcmnParam.InstituteID;
        vm.BranchID = objcmnParam.BranchID;
       // vm.JournalID = 11939;  //($scope.OpeningJournalID === null || $scope.OpeningJournalID === undefined ? 0 : $scope.OpeningJournalID );
        $scope.showItem = false;
        $scope.createItem = true;
        //$scope.detailGrid = true;
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
                getAllJournal(0);
            }
            else {
                $scope.showItem = false;
                $scope.createItem = true;
                $scope.detailGrid = true;
                $scope.clearField();
            }
        };
        //**********************************************************Load Section************************************************************************************* */
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



        vm.loadChequePopOnChangeVType = function (SelectID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            //debugger;
            if (SelectID === 3 || SelectID === 5) {

                if (vm.BA !== undefined) {
                    vm.AccountID = vm.AccountID === undefined ? null : null;
                    vm.BA.selected = vm.BA.selected === undefined ? null : null;
                }

                vm.IsShowBA = true;
                vm.AccountID = null;
                vm.loadBankAccountNo('');
                vm.ChequeSetup = {};
            }
            else {
                vm.IsShowBA = false;
            }
        };









        // ---------------------   Generate   Start--------------------
        //Hasnat

        //
        loadCOAList();
        vm.JournalDetailList = [];
        vm.JournalDetail = [];
        vm.Generate = function () {       
            $scope.detailGrid = true;
            vm.lengthCheck = $scope.COASelectedList;
            $scope.MultiCOAID = {};

            $scope.MultiCOAID.ID = '';
           
            angular.forEach(vm.lengthCheck, function (ntc) {
                $scope.MultiCOAID.ID += ',' + ntc.COAID;
            });
            $scope.MultiCOAID = $scope.MultiCOAID.ID.slice(1, $scope.MultiCOAID.ID.length);
          
            console.log($scope.MultiCOAID);
            objcmnParam = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MultiCOAID: $scope.MultiCOAID
            };

            OpeningjournalService.spGetAccJournalDetailByCOAIDForMultiCheck(objcmnParam)
                .then(function (data) {
                    vm.DrAndCrAmount = data;

                    console.log(vm.DrAndCrAmount);
                    if (vm.JournalDetailList.length === 0) {
                        loadCOAList();

                        vm.JournalDetailList = [];
                        vm.MultiCheckDetails = $scope.COASelectedList;
                        console.log(vm.MultiCheckDetails);
                        if (vm.DrAndCrAmount.length > 0) {
                            //angular.forEach(data, function (detail) {
                            for (var i = 0; i < vm.DrAndCrAmount.length; i++) {

                                vm.JournalDetailList.push({
                                    JournalID: 0,
                                    JournalDetailID: vm.DrAndCrAmount[i].JournalDetailID,
                                    COAID: vm.DrAndCrAmount[i].COAID,
                                    CL: { selected: vm.DrAndCrAmount.filter(function (ob, i) { return (ob.COAID === vm.DrAndCrAmount[i].COAID); })[i] },       //{ selected: vm.MultiCheckDetails[i].COAName },    
                                    UserID: 0,
                                    UserName: '',
                                    CostCenterID: vm.BranchList.length === 0 ? $scope.InsModel.BrunchID : vm.BranchList[0].BrunchID,
                                    BR: { selected: vm.BranchList.length === 0 ? $scope.InsModel : $scope.InsModelBranch },
                                    DrAmount: vm.DrAndCrAmount[i].DrAmount, //detail.DrAmount === 0 ? null : detail.DrAmount,
                                    CrAmount: vm.DrAndCrAmount[i].CrAmount   //detail.CrAmount === 0 ? null : detail.CrAmount
                                });

                            }

                            $scope.subTotalDrCrAmt();
                        }

                    }

                    //else {
                    //    //&& model.USR !== undefined after model.CL
                    //    if ((model.COAID !== null && model.CL !== undefined) && (model.CrAmount != null || model.DrAmount != null)) {    //&& model.UserID !== '' && model.CostCenterID !== null && model.BR !== undefined
                    //        vm.JournalDetailList.reverse();
                    //        //vm.JournalDetailList.push({ JournalID: 0, JournalDetailID: 0, COAID: $scope.IsDefaultCash.length === 0 ? null : $scope.isDefaultCashCheck.COAID, CL: { selected: $scope.IsDefaultCash.length === 0 ? null : $scope.isDefaultCashCheck }, UserID: '', CostCenterID: vm.BranchList.length === 0 ? $scope.InsModel.BrunchID : vm.BranchList[0].BrunchID, BR: { selected: vm.BranchList.length === 0 ? $scope.InsModel: vm.BranchList[0] }, DrAmount: null, CrAmount: null });
                    //        vm.JournalDetailList.push({ JournalID: 0, JournalDetailID: 0, COAID: null, UserID: '', CostCenterID: vm.BranchList.length === 0 ? $scope.InsModel.BrunchID : vm.BranchList[0].BrunchID, BR: { selected: vm.BranchList.length === 0 ? $scope.InsModel : vm.BranchList[0] }, DrAmount: null, CrAmount: null });
                    //        vm.JournalDetailList.reverse();
                    //    }
                    //    else {
                    //        logger.error('Invalid input');
                    //    }
                    //}

                });
            

        };
         // ---------------------   Generate   END --------------------




        
        loadCOAList();
        vm.JournalDetailList = [];
        vm.JournalDetail = [];
        vm.addToList = function (model) {
            console.log($scope.COAID);
            console.log($scope.CL);
            
            //debugger;
            if (vm.JournalDetailList.length === 0) {
                loadCOAList();
                
                vm.JournalDetailList = [];

                //vm.JournalDetailList.push({ JournalID: 0, JournalDetailID: 0, COAID: $scope.COAID, CL: $scope.CL, UserID: '', CostCenterID: vm.BranchList.length === 0 ? $scope.InsModel.BrunchID : vm.BranchList[0].BrunchID, BR: { selected: vm.BranchList.length === 0 ? $scope.InsModel : $scope.InsModelBranch }, DrAmount: null, CrAmount: null });
                vm.MultiCheckDetails = $scope.COASelectedList;
                if (vm.MultiCheckDetails.length > 0) {
                    //angular.forEach(data, function (detail) {
                    for (var i = 0; i < vm.MultiCheckDetails.length; i++) {
                        vm.JournalDetailList.push({
                            JournalID: 0,
                            JournalDetailID: 0,
                            COAID: vm.MultiCheckDetails[i].COAID,

                            
                            CL: { selected: vm.MultiCheckDetails[i].filter(function (ob, i) { return (ob.COAID === vm.MultiCheckDetails[i].COAID); })[0] },
                            UserID: 0,
                            
                            UserName: '',

                            CostCenterID: vm.BranchList.length === 0 ? $scope.InsModel.BrunchID : vm.BranchList[0].BrunchID,

                             BR: { selected: vm.BranchList.length === 0 ? $scope.InsModel : $scope.InsModelBranch },
                            DrAmount: null, //detail.DrAmount === 0 ? null : detail.DrAmount,
                            CrAmount: null   //detail.CrAmount === 0 ? null : detail.CrAmount
                        });
                    }
                        
                    //});

                    $scope.subTotalDrCrAmt();
                }
                
            }
           
            else {
                //&& model.USR !== undefined after model.CL
                if ((model.COAID !== null && model.CL !== undefined) && (model.CrAmount != null || model.DrAmount != null)) {    //&& model.UserID !== '' && model.CostCenterID !== null && model.BR !== undefined
                    vm.JournalDetailList.reverse();
                    //vm.JournalDetailList.push({ JournalID: 0, JournalDetailID: 0, COAID: $scope.IsDefaultCash.length === 0 ? null : $scope.isDefaultCashCheck.COAID, CL: { selected: $scope.IsDefaultCash.length === 0 ? null : $scope.isDefaultCashCheck }, UserID: '', CostCenterID: vm.BranchList.length === 0 ? $scope.InsModel.BrunchID : vm.BranchList[0].BrunchID, BR: { selected: vm.BranchList.length === 0 ? $scope.InsModel: vm.BranchList[0] }, DrAmount: null, CrAmount: null });
                    vm.JournalDetailList.push({ JournalID: 0, JournalDetailID: 0, COAID: null, UserID: '', CostCenterID: vm.BranchList.length === 0 ? $scope.InsModel.BrunchID : vm.BranchList[0].BrunchID, BR: { selected: vm.BranchList.length === 0 ? $scope.InsModel : vm.BranchList[0] }, DrAmount: null, CrAmount: null });
                    vm.JournalDetailList.reverse();
                }
                else {
                    logger.error('Invalid input');
                }
            }
        };




        //vm.addToList();

        vm.EnterToTab = function (mode, index) {
            //debugger;
            //event.preventDefault();            
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



            //debugger;
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
            vm.JournalTypeID = 19; //vm.JournalTypeID === null || vm.JournalTypeID === undefined ? '' : vm.JournalTypeID;
            vm.CurrencyID = vm.CurrencyID === null || vm.CurrencyID === undefined ? '' : vm.CurrencyID;
            vm.Narration = vm.Narration === '' || vm.Narration === undefined ? '' : vm.Narration;
            vm.AccountID = vm.AccountID === null || vm.AccountID === undefined ? null : vm.AccountID;
        };



        $scope.manageDetailList = function () {
            //debugger;
            angular.forEach(vm.JournalDetailList, function (model) {
                if (model.COAID !== null && (model.CrAmount !== null || model.DrAmount !== null) && (model.CostCenterID !== null || model.CostCenterID !== undefined)) {
                    vm.JournalDetail.push({
                        JournalID: ($scope.OpeningJournalID === null || $scope.OpeningJournalID === undefined ? 0 : $scope.OpeningJournalID),
                        JournalDetailID: model.JournalDetailID,
                        COAID: model.COAID === null || model.COAID === undefined ? null : model.COAID,
                        UserID: model.UserID === null || model.UserID === undefined || model.UserID === '' ? null : model.UserID,
                        CostCenterID: model.CostCenterID === null || model.CostCenterID === undefined ? null : model.CostCenterID,
                        DrAmount: model.DrAmount === null ? 0 : model.DrAmount,
                        CrAmount: model.CrAmount === null ? 0 : model.CrAmount,

                    });
                }
            });
        };

      
        
        vm.Save = function () {
            
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line
           
                $scope.manageMaster();             
                $scope.manageDetailList();
                vm.COASelectedList = $scope.COASelectedList;
                console.log(vm.COASelectedList);
                var FuncName = '/postAccJournalMasterDetailMulti';
                return OpeningjournalService.InsertJournalDataWithDetails(FuncName, vm)
                    .then(function (data) {
                        if (data[0].ReturnValue > 0) {
                            if (vm.JournalID === 0) {
                                logger.info('Saved Successfully');
                            }
                            else {
                                logger.info('Update Successfully');
                            }

                            $scope.clearField();
                        }
                    });
            //}
            //else {
            //    logger.error('Debit and Credit amount must be same, Please check and try again..........');
               
            //}
        };

        $scope.DetailIndex = null;
        $scope.DetailModel = '';


        vm.getDetailRowtoSetPartyDrp = function (model, index) {
            $scope.DetailIndex = index;
            $scope.DetailModel = model;
        };


        vm.saveParty = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            //debugger;
            if (vm.PartySetup !== undefined) {
                vm.PartySetup.UserID = vm.PartySetup.UserID === undefined ? 0 : vm.PartySetup.UserID;
            }
            else {
                vm.PartySetup.UserID = 0;
            }
            vm.PartySetup.UserTypeID = 19;
            vm.PartySetup.UserFullName = vm.PartySetup.UserFullName === '' || vm.PartySetup.UserFullName === undefined ? '' : vm.PartySetup.UserFullName;
            vm.PartySetup.PhoneNo = vm.PartySetup.PhoneNo === '' || vm.PartySetup.PhoneNo === undefined ? '' : vm.PartySetup.PhoneNo;
            vm.PartySetup.EmailID = vm.PartySetup.EmailID === '' || vm.PartySetup.EmailID === undefined ? '' : vm.PartySetup.EmailID;
            vm.PartySetup.PreAddress = vm.PartySetup.PreAddress === '' || vm.PartySetup.PreAddress === undefined ? '' : vm.PartySetup.PreAddress;
            vm.PartySetup.LoggedUserID = objcmnParam.LoggedUserID;
            vm.PartySetup.InstituteID = objcmnParam.InstituteID;
            var FuncName = '/postCmnUserJournal';
            return journalService.InsertJournalData(FuncName, vm.PartySetup)
                .then(function (data) {
                    if (data[0].UserID !== '' && data[0].UserName !== '') {
                        if ($scope.DetailIndex !== null) {
                            //vm.UserList.push({ UserID: data[0].UserID, UserFullName: data[0].UserName });
                            vm.JournalDetailList[$scope.DetailIndex].UserName = data[0].UserName;
                            vm.JournalDetailList[$scope.DetailIndex].UserID = data[0].UserID;
                            $scope.ClearPartyModal();
                            //$scope.USR =  vm.PartySetup.UserFullName
                        }
                    }
                    else {
                        logger.error('Error Occuring, Please Check');
                    }
                });
        };

        $scope.editModels = function (model) {
            $scope.cmnParam();
            objcmnParam.JournalID = model.JournalID;
            $scope.getMasterByID(objcmnParam);
            $scope.getDetailByID(objcmnParam);
        };
 
        $scope.getMasterByID = function (objcmnParam) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var FuncName = '/getJournalMasterByID';
            return journalService.InsertJournalData(FuncName, objcmnParam)
                .then(function (data) {
                    if (data !== null) {
                        vm.JournalID = data[0].JournalID;
                        vm.CustomCode = data[0].CustomCode;
                        vm.ManualVoucherNo = data[0].ManualVoucherNo;
                        vm.JournalDate = data[0].JournalDate === null || data[0].JournalDate === '' ? '' : conversion.getDateToString(data[0].JournalDate);
                        vm.JournalTypeID = data[0].JournalTypeID;
                        vm.Type = { selected: vm.JournalTypeList.filter(function (ob, i) { return (ob.JournalTypeID === data[0].JournalTypeID); })[0] };
                        if (data[0].AccountID !== null) {
                            var PartyIDs = '';
                            vm.IsShowBA = true;
                            vm.AccountID = data[0].AccountID;
                            vm.loadBankAccountNo('Edit');

                            vm.ChequeSetup.ChequeID = data[0].ChequeID;
                            vm.ChequeSetup.PartyID = data[0].PartyID;
                            vm.ChequeSetup.USR = {
                                selected: vm.UserList.filter(function (ob, i) {
                                    return (ob.UserID === (PartyIDs = data[0].PartyID === null ? '' : data[0].PartyID.toString()));
                                })[0]
                            };
                            vm.ChequeSetup.ChequeNo = data[0].ChequeNo;
                            vm.ChequeSetup.ChequeDisburseDate = data[0].ChequeDisburseDate === null || data[0].ChequeDisburseDate === '' ? '' : conversion.getDateToString(data[0].ChequeDisburseDate);
                            vm.ChequeSetup.ChequeIssueDate = data[0].ChequeIssueDate === null || data[0].ChequeIssueDate === '' ? '' : conversion.getDateToString(data[0].ChequeIssueDate);
                            vm.ChequeSetup.ChequeAmount = data[0].ChequeAmount;
                            $scope.IsUp = 6;
                        }
                        else {
                            console.log('abc');
                        }

                        vm.CurrencyID = data[0].CurrencyID;
                        vm.Curr = { selected: vm.CurrencyList.filter(function (ob, i) { return (ob.CurrencyID === data[0].CurrencyID); })[0] };
                        vm.Narration = data[0].Narration;

                        $scope.showItem = false;
                        $scope.createItem = true;
                        $scope.detailGrid = true;
                        $scope.IsVisible = false;
                    }
                    else {
                        logger.error('Error Occured, Please Check');
                    }
                });
        };

        $scope.getDetailByID = function (objcmnParam) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            //$scope.isDefaultCashCheck


       
            var FuncName = '/getJournalDetailByID';
            return journalService.InsertJournalData(FuncName, objcmnParam)
                .then(function (data) {
                    var UserIDs = '';
                    vm.JournalDetailList = [];
                    vm.addToList();
                    loadCOAList();
                    //console.log($scope.IsDefaultCash.length)

                    if (data.length > 0) {
                        angular.forEach(data, function (detail) {
                            vm.JournalDetailList.push({
                                JournalID: detail.JournalID,
                                JournalDetailID: detail.JournalDetailID,
                                COAID: detail.COAID,

                                //CL: { selected: $scope.IsDefaultCash.length != 0 ? $scope.isDefaultCashCheck : vm.COAList.filter(function (ob, i) { return (ob.COAID === detail.COAID); })[0] },
                                CL: { selected: vm.COAList.filter(function (ob, i) { return (ob.COAID === detail.COAID); })[0] },
                                UserID: detail.UserID,
                                //USR: {
                                //    selected: vm.UserList.filter(function (ob, i) { return (ob.UserID === (UserIDs = detail.UserID === null ? '' : detail.UserID.toString())); })[0]
                                //},
                                //UserID: detail.UserID,
                                UserName: detail.UserName,

                                CostCenterID: detail.CostCenterID,

                                BR: { selected: vm.BranchList.length===0? $scope.InsModel : vm.BranchList.filter(function (ob, i) { return (ob.BrunchID === detail.CostCenterID); })[0] },
                                DrAmount: detail.DrAmount === 0 ? null : detail.DrAmount,
                                CrAmount: detail.CrAmount === 0 ? null : detail.CrAmount
                            });
                        });

                        $scope.subTotalDrCrAmt();
                    }

                });
        };

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
                        getAllJournal(0);
                    }
                    else {
                        logger.error('Data cant be deleted, Please Check and try again!!!');
                    }
                });
        };

        //**********************************************************Clear/Reset************************************************************************************* */
       

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
            $state.go($state.current.name, {}, { reload: true });
        }




        //************************************************Start Grid******************************************************
        //*************ServerSide Search****************
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
        //*************ServerSide Search****************

        //var objcmnParam = {};
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
                getAllJournal(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    getAllJournal(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    getAllJournal(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    getAllJournal(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    getAllJournal(1);
                }
            }
        };
        function getAllJournal(isPaging) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            $scope.gridOptions.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';
            //$scope.cmnParam();            
            objcmnParam.pageNumber = ($scope.pagination.pageNumber - 1) * $scope.pagination.pageSize;
            objcmnParam.pageSize = $scope.pagination.pageSize;
            objcmnParam.IsPaging = isPaging;
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
                    { name: 'JournalID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'JournalTypeID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'AccountID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'CurrencyID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'CustomCode', displayName: 'Voucher No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ManualVoucherNo', displayName: 'Manual Voucher No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'JournalDate', displayName: 'JournalDate', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'JournalTypeName', displayName: 'Journal Type', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'AccountNo', displayName: 'Account No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'Currency', displayName: 'Currency', headerCellClass: $scope.highlightFilteredHeader },
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
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#0aa699; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>' +


                        '<button class="label label-success label-mini" style="background-color:#0e710f">' +
                        '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#0e710f; color:white" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.printJournals(row.entity, 1)">' +
                        '<i class="fa fa-print" aria-hidden="true">&nbsp;Print</i></a></button>'
                    }
                ],
                //enableGridMenu: true,
                //enableSelectAll: true,
                exporterCsvFilename: 'Journal.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: 'Journal List', style: 'headerStyle' },
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
                exporterExcelFilename: 'Journal.xlsx',
                exporterExcelSheetName: 'Sheet1'
            };

            var funcName = '/getJournalMaster';
            return journalService.InsertJournalData(funcName, objcmnParam)
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
        //************************************************End Grid******************************************************

       

  // ___________________ Print start ___________________________

        $scope.printJournals = function (model) {
            //vm.JournalID = model.JournalID;
           
            
             //vm.JournalID = model.JournalID;
           
           params.JournalID =   model.JournalID;          
           params.InstituteID = $localStorage.userInfo[0].InstituteID; 
          
      journalService.spGetAccJournalDetailsForPrint(params)

                .then(function (data) {
                    $scope.JournalDetailsForReport = data;
                    $scope.voucherNo = data[0].ManualVoucherNo;
                   
                    $scope.JournalDate = data[0].JournalDate;
                    $scope.AccountNo = data[0].AccountNo;
                    $scope.COAName = data[0].COAName;
                    $scope.TotalAmount = data[0].totalAmount;
          });
          
           setTimeout(function () {

              
              
                var content = document.getElementById('print').innerHTML;
                var mywindow = window.open('', 'Print', 'height=1000,width=2000');
                var is_chrome = Boolean(mywindow.chrome);
                mywindow.document.write('<html><head><title></title>');
                mywindow.document.write('</head><body >');
                mywindow.document.write(content);
                mywindow.document.write('</body> <br/><br/>');
                mywindow.document.write('<footer style="position: fixed;bottom: 0;"> <font color="green">Powered By :</font><font color="blue"> onAir International Ltd. </font><br><font color="green">Web URL:</font><font color="blue">  www.onems.live </font></footer>');
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
                return true;
            }, 400);

        };
        
 // ___________________ Print End ___________________________






        //************************************************Start Grid Party ******************************************************
        //*************ServerSide Search****************
        $scope.SearchProperty = '';
        $scope.IsCallFromSearch = false;
        $scope.SearchCancelList = function () {
            $scope.SearchProperty = '';
            $scope.SearchNow($scope.SearchProperty);
        };

        $scope.SearchNow = function (searchstring) {
            //debugger;
            $scope.IsCallFromSearch = searchstring === '' ? false : true;
            $scope.SearchProperty = searchstring.toString();
            $scope.paginationList.pageNumber = 2;
            $scope.paginationList.firstPage();
        };


        //*************ServerSide Search****************

        //var objcmnParam = {};
        $scope.gridOptionsList = [];
        $scope.paginationList = {
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

                    this.pageSize = $scope.paginationList.totalItems;
                }
                else {
                    this.pageSize = this.ddlpageSize;
                }

                this.pageNumber = 1;
                vm.getAllParty(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    vm.getAllParty(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    vm.getAllParty(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    vm.getAllParty(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    vm.getAllParty(1);
                }
            }
        };
        vm.getAllParty = function (isPaging) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            $scope.gridOptionsList.enableFiltering = true;

            $scope.loaderMore = true;
            $scope.lblMessage = 'loading please wait....!';
            $scope.result = 'color-red';


            //$scope.cmnParam();
            objcmnParam.InstituteID = $localStorage.userInfo[0].InstituteID; 
            objcmnParam.UserID = 0;
            objcmnParam.UserTypeID = 19;
            objcmnParam.LoggedUserID = $localStorage.userInfo[0].UserID;
            objcmnParam.pageNumber = ($scope.paginationList.pageNumber - 1) * $scope.paginationList.pageSize;
            objcmnParam.pageSize = $scope.paginationList.pageSize;
            objcmnParam.IsPaging = isPaging;




            $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };
            $scope.gridOptionsList = {
                useExternalPagination: true,
                useExternalSorting: true,
                enableFiltering: true,
                enableRowSelection: true,
                enableSelectAll: true,
                showFooter: true,
                enableGridMenu: true,
                rowTemplate: '<div ng-dblclick="grid.appScope.getInstituteByID(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
                columnDefs: [
                    { name: 'InstituteID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserID', visible: false, headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'UserFullName', displayName: 'Party Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LoginPhone', displayName: 'Phone No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'LoginEmail', displayName: 'Email', headerCellClass: $scope.highlightFilteredHeader },
                    
                  

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
                        

                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" style="background-color:#0aa699; color:white"  class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.setUserInJournalDetail(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Select</i></a></button>'
                    }
                ],
                //enableGridMenu: true,
                //enableSelectAll: true,
                //---------------------------
                exporterCsvFilename: 'ProductList.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: 'Product List', style: 'headerStyle' },
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
                exporterExcelFilename: 'Product.xlsx',
                exporterExcelSheetName: 'Sheet1',

                exporterAllDataFn: function () {
                    var getPage = 0;
                    var paginationOptions = {};
                    return getPage(1, $scope.gridOptionsList.totalItems, paginationOptions.sort)
                        .then(function () {
                            $scope.gridOptionsList.useExternalPagination = false;
                            $scope.gridOptionsList.useExternalSorting = false;
                            getPage = null;
                        });
                },
            };


           

            return userAuthenticationService.getUserAuthenticationByUserID(objcmnParam)

                .then(function (data) {
                    if (data.length > 0) {

                        $scope.paginationList.totalItems = data[0].RecordTotal;
                        $scope.gridOptionsList.data = data;
                        //$scope.showItem = false;
                        //$('#myModal').modal('show'); //jshint ignore : line
                    }
                    else {
                        logger.error('Your desired data not found');
                    }
                });

        };
                
        $scope.getPartyList = function (model, index) {
            //$scope.UpdateItem = false;
            //$('#myModal1').modal('show');
            vm.getDetailRowtoSetPartyDrp(model, index);
            $scope.paginationList.pageNumber = 1;
            vm.getAllParty(0);

            //$scope.createItem = false;
            //$scope.showItem = true;

        };

         //************************************************Start Grid******************************************************

        $scope.setUserInJournalDetail = function (model) {
          
            $('#myModal').modal('hide'); //jshint ignore : line
           

            if ($scope.DetailModel === undefined) {
                vm.ChequeSetup.UserFullName = model.UserFullName;
                vm.ChequeSetup.UserID = model.UserID;
            }
            else {
                $scope.DetailModel.UserName = model.UserFullName;
                $scope.DetailModel.UserID = model.UserID;
            }
           
        };


        //------------------------------//
        //$scope.getUserTypeListByID = function (objcmnParam) {
        //    //debugger;
        //    noticeSettingsSevice.SpGetInsNoticeUserList(objcmnParam)
        //        .then(function (data) {
        //            if (data.length > 0) {
        //                $scope.UserTypeSelectedList = data;
        //                angular.forEach(vm.noticesFor, function (nf) {
        //                    nf.selected = false;
        //                });

        //                angular.forEach($scope.UserTypeSelectedList, function (UTSL) {
        //                    angular.forEach(vm.noticesFor, function (nf) {
        //                        if (UTSL.UserTypeID === nf.UserTypeID) {
        //                            nf.selected = true;
        //                        }
        //                    });
        //                });
        //            }
        //        })
        //        .catch(function (error) { });
        //};


        activate();

        function activate() {
            var promises = [loadVoucherList(), loadCurrencyList(), loadCOAList(), loadBranchList(), loadPartyList(), getAllChartOfAccountParentDDL(), OpeningBalance()];//jshint ignore : line
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }
      

        function OpeningBalance() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                JournalTypeID: 19
            };

            return OpeningjournalService.GetAccJournalMasterForOpeningBalance(params)
                .then(function (data) {
                    vm.openingBalance = data;
                    if (data.length > 0) {
                        //$scope.OpeningJournalID = data[0].JournalID;
                        $scope.DrOpeningBalance = (data[0].DrAmount === null || data[0].DrAmount === undefined ? 0 : data[0].DrAmount); // data[0].DrAmount;
                        $scope.CrOpeningBalance = (data[0].CrAmount === null || data[0].CrAmount === undefined ? 0 : data[0].CrAmount); //  data[0].CrAmount;
                        $scope.OpeningBalance = (data[0].Balance === null || data[0].Balance === undefined ? 0 : data[0].Balance); //  data[0].CrAmount;  
                        vm.CustomCode = data[0].VoucherNo;
                        vm.JournalID = (data[0].JournalID === null || data[0].JournalID === undefined ? 0 : data[0].JournalID); //data[0].JournalID

                    }
                    else {
                        $scope.DrOpeningBalance = 0.00;
                        $scope.CrOpeningBalance = 0.00;
                        $scope.OpeningBalance = 0.00;
                        vm.CustomCode = 1010;
                        vm.JournalID = 0;
                    }
                   
                });


        }


        function loadVoucherList() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return journalService.getVoucherList()
                .then(function (data) {
                    vm.JournalTypeList = data;
                });
        }

        function loadCurrencyList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            //debugger;
            return journalService.getCurrencyList()
                .then(function (data) {
                    vm.CurrencyList = data;
                });
        }

        function loadCOAList() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return journalService.getCOAList()
                .then(function (data) {
                    vm.COAList = data;
                    $scope.COAListDetails = data;
                    $scope.COAID = vm.COAList.filter(function (ob, i) { return (ob.IsDefaultCash === true); })[0].COAID;
                    $scope.CL =  { selected: vm.COAList.filter(function (ob, i) { return (ob.COAID === vm.COAList.filter(function (ob, i) { return (ob.IsDefaultCash === true); })[0].COAID); })[0] };

                    
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
                    vm.addToList();
                   
                });
        }

        function getAllChartOfAccountParentDDL() {
            params = {
                InstituteID: $localStorage.userInfo[0].InstituteID
            };

            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return OpeningjournalService.AccChartOfAccountParentDDL(params)
                .then(function (data) {
                   
                    vm.COAParent = data;
                    
                });
           
        }

        $scope.getAllCOAForMultiCheckDDL = function (COAID) {
            params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                COAID: COAID

            };
            console.log(params);

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return OpeningjournalService.AccChartOfAccountByCOAMultiSelect(params)
                .then(function (data) {
                    //debugger;
                    vm.noticesFor = data;
                });
        };


       

        //*******************************************Multi Checked DropDown***************************************        
        $scope.setSlid = function (type) {
            //debugger;
            $('.wrapper .list').slideToggle('fast'); //jshint ignore : line
            $scope.ShowItemList = $scope.ShowItemList === true ? false : true;
        };

        $scope.ShowItemList = false;
        $scope.COASelectedList = [];

        $scope.getSelectedItems = function (item) {
            //debugger;
            if (item.selected === false) {
                var CSelectList = $scope.COASelectedList.filter(function (ob, i) { return (ob.COAID === item.COAID); })[0];
                if (CSelectList !== undefined) {
                    if (CSelectList.ListCOAID > 0) {
                        CSelectList.IsDelete = true;
                    }
                    else { 
                        $scope.COASelectedList.splice($scope.COASelectedList.indexOf(CSelectList), 1);
                    }
                }
            }
            else if (item.selected === true) {
                var PSelectList = $scope.COASelectedList.filter(function (ob, i) { return (ob.COAID === item.COAID); })[0];
                if (PSelectList === undefined) {
                    $scope.COASelectedList.push({
                        COAMultiCheckID: 0,
                        COAID: item.COAID,
                        COAName: item.COAName,
                        selected: item.selected,
                        IsDelete: false
                    });
                }
                else {
                    PSelectList.selected = true;
                    PSelectList.IsDelete = false;
                }
            }
           // console.log($scope.COASelectedList.length)
            $scope.showTopOMultiCheck(item);
            //return item.selected;
        };

        $scope.CheckedAll = false; $scope.UnCheckedAll = false;
        $scope.setSelectedItemsChecked = function (CheckedAll) {
            if (CheckedAll === true) {
                $scope.UnCheckedAll = false;
                angular.forEach(vm.noticesFor, function (ntc) {
                    ntc.selected = CheckedAll;
                    $scope.getSelectedItems(ntc);
                });
            }
            else {
                angular.forEach(vm.noticesFor, function (ntc) {
                    ntc.selected = false;
                    $scope.getSelectedItems(ntc);
                });
            }
        };

        $scope.CheckedName = {};
        
        $scope.CheckedName.ID = '';
       
        $scope.CheckedName.Name = '';
        $scope.showTopOMultiCheck = function (ntc) {
            if (ntc.selected === true) {
                var P = false;
                P = $scope.CheckedName.ID.includes(ntc.COAID);
                
                if (P === false) {
                    $scope.CheckedName.Name += ', ' + ntc.COAName;
                    $scope.CheckedName.ID += ', ' + ntc.COAID;
                    
                }
            }
            else {
                if (ntc.selected === false) {
                    var S = false;
                    S = $scope.CheckedName.ID.includes(ntc.COAID);
                    if (S === true) {
                        $scope.CheckedName.Name = $scope.CheckedName.Name.replace(', ' + ntc.COAName, '');
                        $scope.CheckedName.ID = $scope.CheckedName.ID.replace(', ' + ntc.COAID, '');
                    }
                }
            }
            $scope.SetIsCheckedAll();
            //$scope.lengthCheck = $scope.CheckedName.ID;
            //console.log($scope.lengthCheck.length);
        };

        $scope.SetIsCheckedAll = function () {
            var IsCheckedAll = vm.noticesFor.filter(function (ob, i) { return (ob.selected === undefined || ob.selected === false); })[0];
            if (IsCheckedAll !== undefined && (IsCheckedAll.selected === undefined || IsCheckedAll.selected === false)) {
                $scope.CheckedAll = false;
            }
            else {
                $scope.CheckedAll = true;
            }
        };
        //*******************************************Multi Checked DropDown***************************************



        
    }
})();
