(function () {
    'use strict';

    angular
        .module('app.studentSettings')
        .controller('AddStudentController', AddStudentController);

    AddStudentController.$inject = ['commonService', 'conversion', 'userService', 'designationSettings', 'branchSettings', 'branchSettingsSevice', 'teacherAttendanceSevice', 'mailSettings', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', 'pagerService', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function AddStudentController(commonService, conversion, userService, designationSettings, branchSettings, branchSettingsSevice, teacherAttendanceSevice, mailSettings, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, pagerService, $localStorage, apiConfig) {



        var vm = this;
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration



        vm.imgHost = apiConfig.imagehost; 
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        vm.UserTypeID = 3;
        $scope.presentAddressContainer = true;
        $scope.permanentAddressContainer = true;
        $scope.educationInfoContainer = true;
        $scope.guardianInfoContainer = true;
        $scope.jobContarctInfoContainer = true;
        $scope.exprienceInfoContainer = true;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        var CurrentDate = conversion.NowDateCustom();
        var today = conversion.getStringToDate(CurrentDate);
        $('.pane-hScroll').scroll(function () { //jshint ignore : line
            $('.pane-vScroll').width($('.pane-hScroll').width() + $('.pane-hScroll').scrollLeft()); //jshint ignore : line
        });
        $scope.showListBtn = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;
            $scope.presentAddressContainer = false;
            $scope.permanentAddressContainer = false;
            $scope.educationInfoContainer = false;
            $scope.guardianInfoContainer = false;
            $scope.jobContarctInfoContainer = false;
            $scope.exprienceInfoContainer = false;
            $scope.permanentData = [];
            $scope.PresentAddressData = [];
            $scope.EducationData = [];
            $scope.GuardianData = [];
            $scope.JobContractData = [];
            $scope.ExprienceData = [];
            RefreshList(); //jshint ignore : line
        };
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            //$state.go($state.current.name, {}, { reload: true });
            $scope.clearField();
            $scope.showItem = false;
            $scope.createItem = true;
            $scope.presentAddressContainer = true;
            $scope.permanentAddressContainer = true;
            $scope.educationInfoContainer = true;
            $scope.guardianInfoContainer = true;
            $scope.jobContarctInfoContainer = true;
            $scope.exprienceInfoContainer = true;
        };

        $scope.imgShow = false;
        $scope.imgShowFinger = false;
        $scope.imgShowSignature = false;

        $scope.uploadFiles = function (file, errFiles) {
            $scope.f = file;

            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }

            if (file !== null && file.$ngfBlobUrl != null && vm.SignatureUrl === undefined) {
                $scope.Uimage = file.$ngfBlobUrl;
            }
            $scope.errFile = errFiles && errFiles[0];
            if (file) {


            var InstituteName = null;
            var Class = null;
            var Section = null;

            InstituteName = vm.institute.selected.InstituteName;
            //Class = vm.class.selected.ClassName;

            if (vm.SectionID !== null && vm.SectionID !== undefined) {
                Section = vm.section.selected.SectionName;
            }




                file.upload = Upload.upload({
                    url: apiConfig.imagehost + 'api/onEms/uploads/' + InstituteName + '/null/null',
                    method: 'POST',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        var data = JSON.parse(response.data);
                        //$scope.UserimageName = data.path;
                        vm.ImageUrl = data.path;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });

                $scope.imgShow = true;
            }

        };
        $scope.uploadFilesFinger = function (file, errFiles) {
            $scope.f = file;
            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }

            if ((file !== null && file.$ngfBlobUrl != null) && vm.FingerUrl === undefined) {
                $scope.Fimage = file.$ngfBlobUrl;
            }
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: apiConfig.imagehost + 'api/onEms/uploads/' + $localStorage.userInfo[0].InstituteName + '/null/null',
                    method: 'POST',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        var data = JSON.parse(response.data);
                        vm.FingerUrl = data.path;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });

                $scope.imgShowFinger = true;
            }

        };


        //for image
        $scope.uploadFilesSignature = function (file, errFiles) {
            $scope.f = file;

            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }

            if ((file !== null && file.$ngfBlobUrl != null) && vm.ImageUrl === undefined) {
                $scope.Simage = file.$ngfBlobUrl;
            }
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: apiConfig.imagehost + 'api/onEms/uploads/' + $localStorage.userInfo[0].InstituteName + '/null/null',
                    method: 'POST',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        var data = JSON.parse(response.data);
                        vm.SignatureUrl = data.path;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });

                $scope.imgShowSignature = true;
            }

        };
        //for image




        // --------------- Strat Logic For Present Address -------------//
        // $scope.presentAddressindex;
        $scope.openPresentAddressIndex = function (index) {
            $scope.presentAddressindex = index;
            $scope.PresentAddressData[$scope.presentAddressindex][0].id = $scope.presentAddressindex;
        };


        // initialize the array
        $scope.PresentAddressData = [
            // [{'presentAddressJSON':''}]
        ];


        //var isRowSelected = true;
        $scope.presenttoggleSelection = function (field, index) {
            if ($scope.PresentAddressData.length > 0) {
                angular.forEach($scope.PresentAddressData, function (PData, indexes) {
                    if (field.id !== PData[0].id) {
                        PData[0].IsActive = false;
                    }
                });
            }
        };

        vm.instituteSelected = function (e) {
            vm.branches = [];


            var params = {
                instituteId: e
            };

            branchSettingsSevice.getBranchByInstituteId(params)
                .then(function (data) {

                    vm.branches = data;
                });


        };

        //For Present Address add a row in the array
        vm.addNewRowForPressentAddress = function () {
            //debugger;
            // create a blank array
            var newrowPresentAddress = [];

            // if array is blank add a standard item
            if ($scope.PresentAddressData.length === 0) {
                newrowPresentAddress = [
                    {
                        'presentAddressJSON': '',
                        'UserAddressID': 0,
                        'AddressTypeID': 2,
                        'postCode': '',
                        'thana': '',
                        'address': '',
                        'Country': '',
                        'CountryID': 1,
                        'CityID': null,
                        'City': '',
                        'StateID': null,
                        'State': '',
                        'AddressType': '',
                        'IsActive': false,
                        'countrySelected': { CountryID: 1, CountryName: 'Bangladesh' },
                        'IsDeleted': false,
                        StateList: [],
                        citys: []
                    }
                ];

                $scope.getAllState(newrowPresentAddress[0]);

            } else {
                // else cycle thru the first row's columns
                // and add the same number of items
                $scope.PresentAddressData[0].forEach(function (row) {
                    newrowPresentAddress.push(
                        {
                            'presentAddressJSON': '',
                            'UserAddressID': 0,
                            'AddressTypeID': 2,
                            'postCode': '',
                            'thana': '',
                            'address': '',
                            'Country': '',
                            'CountryID': 1,
                            'CityID': null,
                            'City': '',
                            'StateID': null,
                            'State': '',
                            'AddressType': '',
                            'IsActive': false,
                            'countrySelected': { CountryID: 1, CountryName: 'Bangladesh' },
                            'IsDeleted': false,
                            StateList: [],
                            citys: []
                        }
                    );
                });
            }

            $scope.getAllState(newrowPresentAddress[0]);
            // add the new row at the end of the array 
            $scope.PresentAddressData.push(newrowPresentAddress);
        };

        // $scope.merged = [].concat.apply([], $scope.PresentAddressData);
        // console.log($scope.merged);

        // remove the selected row
        $scope.PreAddressremoveRow = function (index) {
            if ($scope.PresentAddressData[index][0].UserAddressID > 0) {
                $scope.PresentAddressData[index][0].IsDeleted = true;
                $scope.removePresentTrIndex = index;
            } else {
                $scope.PresentAddressData.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.PresentAddressData.length === 0) {
                    $scope.PresentAddressData = [];
                }
            }
        };
        // --------------- End Logic For Present Address -------------//

        // --------------- Strat Logic For Permanent Address -------------//
        //$scope.permanentAddressindex;
        $scope.openPermanentAddressIndex = function (index) {
            $scope.permanentAddressindex = index;
            $scope.permanentData[$scope.permanentAddressindex][0].id = $scope.permanentAddressindex;

            //$scope.permanetToggleSelection(index);
        };

        $scope.permanentToggleSelection = function (field, index) {
            if ($scope.permanentData.length > 0) {
                angular.forEach($scope.permanentData, function (PData, indexes) {
                    if (field.id !== PData[0].id) {
                        PData[0].IsActive = false;
                    }
                });
            }
        };
        // initialize the array
        $scope.permanentData = [

        ];

        //For Parmanent Addderss add a row in the array
        vm.addNewRowForPremanentAddress = function () {
            // create a blank array
            var newrowPremanentAddress = [];

            // if array is blank add a standard item
            if ($scope.permanentData.length === 0) {
                newrowPremanentAddress = [
                    {
                        'presentAddressJSON': '',
                        'UserAddressID': 0,
                        'AddressTypeID': 1,
                        'postCode': '',
                        'thana': '',
                        'address': '',
                        'Country': '',
                        'CountryID': 1,
                        'CityID': null,
                        'City': '',
                        'StateID': null,
                        'State': '',
                        'AddressType': '',
                        'IsActive': false,
                        'countrySelected': { CountryID: 1, CountryName: 'Bangladesh' },
                        StateList: [],
                        citys: []
                    }
                ];

                $scope.getAllState(newrowPremanentAddress[0]);

            } else {
                // else cycle thru the first row's columns
                // and add the same number of items
                $scope.permanentData[0].forEach(function (row) {
                    newrowPremanentAddress.push(
                        {
                            'presentAddressJSON': '',
                            'UserAddressID': 0,
                            'AddressTypeID': 1,
                            'postCode': '',
                            'thana': '',
                            'address': '',
                            'Country': '',
                            'CountryID': 1,
                            'CityID': null,
                            'City': '',
                            'StateID': null,
                            'State': '',
                            'AddressType': '',
                            'IsActive': false,
                            'countrySelected': { CountryID: 1, CountryName: 'Bangladesh' },
                            StateList: [],
                            citys: []
                        }
                    );
                });
            }
            // add the new row at the end of the array
            $scope.getAllState(newrowPremanentAddress[0]);

            $scope.permanentData.push(newrowPremanentAddress);
        };

        // remove the selected row
        $scope.ParAddressRemoveRow = function (index) {
            if ($scope.permanentData[index][0].UserAddressID > 0) {
                $scope.permanentData[index][0].IsDeleted = true;
                $scope.removePermanentTrIndex = index;
            } else {
                $scope.permanentData.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.permanentData.length === 0) {
                    $scope.permanentData = [];
                }
            }
        };
        // --------------- End Logic For Permanent Address -------------//

        // --------------- Start Logic For Education Information -------------//
        // initialize the array
        $scope.EducationData = [

        ];

        //For Parmanent Addderss add a row in the array
        vm.addNewRowForEducation = function () {
            // create a blank array
            var newrowEducation = [];

            // if array is blank add a standard item
            if ($scope.EducationData.length === 0) {
                newrowEducation = [
                    {
                        'UserEducationRecordID': 0,
                        'Description': '',
                        'GPA': '',
                        'ExamID': null,
                        'Exam': '',
                        'GradeID': null,
                        'Grade': '',
                        'BoardID': null,
                        'Board': '',
                        'SessionID': null,
                        'Session': '',
                        'YearPass': null,
                        'EducationDuration': null,
                        'Institute': '',
                        'ImageURL': ''
                    }
                ];
            } else {
                // else cycle thru the first row's columns
                // and add the same number of items
                $scope.EducationData[0].forEach(function (row) {
                    newrowEducation.push(
                        {
                            'UserEducationRecordID': 0,
                            'Description': '',
                            'GPA': '',
                            'ExamID': null,
                            'Exam': '',
                            'GradeID': null,
                            'Grade': '',
                            'BoardID': null,
                            'Board': '',
                            'SessionID': null,
                            'Session': '',
                            'YearPass': null,
                            'EducationDuration': null,
                            'Institute': '',
                            'ImageURL': ''
                        }
                    );
                });
            }
            // add the new row at the end of the array 
            $scope.EducationData.push(newrowEducation);
        };

        // remove the selected row
        $scope.EducationRemoveRow = function (index) {
            if ($scope.EducationData[index][0].UserEducationRecordID > 0) {
                $scope.EducationData[index][0].IsDeleted = true;
                $scope.removeEducationTrIndex = index;
            } else {
                // remove the row specified in index
                $scope.EducationData.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.EducationData.length === 0) {
                    $scope.EducationData = [];
                }
            }
        };
        // --------------- End Logic For Education Information -------------//

        // --------------- Start Logic For Guardian Information -------------//
        // initialize the array
        $scope.lastGuardianData = {};
        $scope.GuardianData = [

        ];
        //For Parmanent Addderss add a row in the array
        vm.addNewRowForGuardian = function () {
            // create a blank array
            var newrowGuardian = [];

            // if array is blank add a standard item
            if ($scope.GuardianData.length === 0) {
                newrowGuardian = [
                    {
                        'FamilyID': 0,
                        'RelationID': null,
                        'Relation': '',
                        'isLocal': false,
                        'GuardianID': null,
                        'GurdianTitle': null,
                        'GurdianFirstName': '',
                        'GurdianMiddleName': '',
                        'GurdianLastName': '',
                        'UserFullName': '',
                        'GurdianNickName': '',
                        'EmailID': '',
                        'GurdianMobileNo': '',
                        'PhoneNo': '',
                        'NID': '',
                        'DOB': '',
                        ReligionID: null,
                        ReligionName: ''
                    }
                ];
            } else {
                // else cycle thru the first row's columns
                // and add the same number of items
                $scope.GuardianData[0].forEach(function (row) {
                    newrowGuardian.push(
                        {
                            'FamilyID': 0,
                            'RelationID': null,
                            'Relation': '',
                            'isLocal': false,
                            'GuardianID': null,
                            'GurdianTitle': null,
                            'GurdianFirstName': '',
                            'GurdianMiddleName': '',
                            'GurdianLastName': '',
                            'UserFullName': '',
                            'GurdianNickName': '',
                            'EmailID': '',
                            'GurdianMobileNo': '',
                            'PhoneNo': '',
                            'NID': '',
                            'DOB': '',
                            ReligionID: null,
                            ReligionName: ''
                        }
                    );
                });
            }
            // add the new row at the end of the array 
            $scope.GuardianData.push(newrowGuardian);
        };

        // remove the selected row
        $scope.GuardianRemoveRow = function (index) {
            if ($scope.GuardianData[index][0].FamilyID > 0) {
                $scope.GuardianData[index][0].IsDeleted = true;
                $scope.GuardianSaveArray[index].IsDeleted = true;
                $scope.removeGuardianTrIndex = index;
            } else {
                // remove the row specified in index
                $scope.GuardianData.splice(index, 1);
                $scope.GuardianSaveArray.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.GuardianData.length === 0) {
                    $scope.GuardianData = [];
                }
            }
        };
        // --------------- End Logic For Guardian Information -------------//

        $scope.Guardianindex = null;
        $scope.GuardianDataModel = '';
        $scope.openGuardian = function (model, index) {
            $scope.Guardianindex = index;
            $scope.GuardianDataModel = model[0];
            $scope.checkExistModel = $scope.GuardianSaveArray.length > 0 ? $scope.GuardianSaveArray.filter(function (ob, i) { return (ob.id === index); })[0] : null;
            if ($scope.checkExistModel !== null && $scope.checkExistModel !== undefined) {
                vm.guardianSerup.id = $scope.checkExistModel.id;
                vm.guardianSerup.UserID = $scope.checkExistModel.UserID;
                vm.guardianSerup.UserNo = $scope.checkExistModel.UserNo;
                vm.guardianSerup.UserTypeID = $scope.checkExistModel.UserTypeID;
                vm.guardianSerup.UserTitleID = $scope.checkExistModel.UserTitleID;
                vm.guardianSerup.UserFirstName = $scope.checkExistModel.UserFirstName;
                vm.guardianSerup.UserMiddleName = $scope.checkExistModel.UserMiddleName;
                vm.guardianSerup.UserLastName = $scope.checkExistModel.UserLastName;
                vm.guardianSerup.UserFullName = $scope.checkExistModel.UserFullName;
                vm.guardianSerup.NickName = $scope.checkExistModel.NickName;
                vm.guardianSerup.EmailID = $scope.checkExistModel.EmailID;
                vm.guardianSerup.SkypeID = $scope.checkExistModel.SkypeID;
                vm.guardianSerup.FacebookID = $scope.checkExistModel.FacebookID;
                vm.guardianSerup.WhatsApp = $scope.checkExistModel.WhatsApp;
                vm.guardianSerup.Viber = $scope.checkExistModel.Viber;
                vm.guardianSerup.LinkedIN = $scope.checkExistModel.LinkedIN;
                vm.guardianSerup.ParAddress = $scope.checkExistModel.ParAddress;
                vm.guardianSerup.ParThana = $scope.checkExistModel.ParThana;
                vm.guardianSerup.ParPostCode = $scope.checkExistModel.ParPostCode;
                vm.guardianSerup.ParCountryID = $scope.checkExistModel.ParCountryID;
                vm.guardianSerup.ParStateID = $scope.checkExistModel.ParStateID;
                vm.guardianSerup.ParCityID = $scope.checkExistModel.ParCityID;
                vm.guardianSerup.PreAddress = $scope.checkExistModel.PreAddress;
                vm.guardianSerup.PreThana = $scope.checkExistModel.PreThana;
                vm.guardianSerup.PrePostCode = $scope.checkExistModel.PrePostCode;
                vm.guardianSerup.PreCountryID = $scope.checkExistModel.PreCountryID;
                vm.guardianSerup.PreStateID = $scope.checkExistModel.PreStateID;
                vm.guardianSerup.PreCityID = $scope.checkExistModel.PreCityID;
                vm.guardianSerup.religionID = $scope.checkExistModel.ReligionID;
                vm.guardianSerup.MobileNo = $scope.checkExistModel.MobileNo;
                vm.guardianSerup.PhoneNo = $scope.checkExistModel.PhoneNo;
                vm.guardianSerup.UniqueIdentity = $scope.checkExistModel.UniqueIdentity;
                vm.guardianSerup.bloodgroupID = $scope.checkExistModel.BloodGroupID;
                vm.guardianSerup.Weigth = $scope.checkExistModel.Weigth;
                vm.guardianSerup.Height = $scope.checkExistModel.Height;
                vm.guardianSerup.DOB = $scope.checkExistModel.DOB;
                vm.guardianSerup.BirthCertificate = $scope.checkExistModel.BirthCertificate;
                vm.guardianSerup.PassportNO = $scope.checkExistModel.PassportNO;
                vm.guardianSerup.ImageUrl = $scope.checkExistModel.ImageUrl;
                vm.guardianSerup.SignatureUrl = $scope.checkExistModel.SignatureUrl;
                vm.guardianSerup.FingerUrl = $scope.checkExistModel.FingerUrl;
                vm.guardianSerup.NID = $scope.checkExistModel.NID;
                vm.guardianSerup.OfficeID = $scope.checkExistModel.OfficeID;
                vm.guardianSerup.GenderID = $scope.checkExistModel.GenderID;
                vm.guardianSerup.Remarks = $scope.checkExistModel.Remarks;
                vm.guardianSerup.gender = { selected: vm.genders.filter(function (ob, i) { return (ob.GenderID === $scope.checkExistModel.GenderID); })[0] };
                vm.guardianSerup.bloodgroup = { selected: vm.bloodGroups.filter(function (ob, i) { return (ob.BloodGroupID === $scope.checkExistModel.BloodGroupID); })[0] };
                vm.guardianSerup.religion = { selected: vm.religions.filter(function (ob, i) { return (ob.ReligionID === $scope.checkExistModel.ReligionID); })[0] };
            }
            else {
                vm.guardianSerup = {};
                $scope.Guardianindex = index;
                //Pushing to Guardian array --> id object for genarating dynamicaly checkbox level class and ID value   
                $scope.GuardianData[$scope.Guardianindex][0].id = $scope.Guardianindex;
            }

        };

        vm.ResetGuardian = function () {
            vm.guardianSerup = {};
        };

        // --------------- Start Logic For Exprience Information -------------//
        // initialize the array
        $scope.JobContractData = [

        ];
        //For Parmanent Addderss add a row in the array
        vm.addNewRowForJobContract = function () {
            // create a blank array
            var newrowJobContract = [];

            // if array is blank add a standard item
            if ($scope.JobContractData.length === 0) {
                newrowJobContract = [
                    {
                        'JobContractID': 0,
                        'JobContractTypeID': 0,
                        'RFID': '',
                        'DesignationID': null,
                        'BrunchID': null,
                        'DepartmentID': null,
                        'InstituteID': null,
                        'ContractDate': CurrentDate,
                        'IsActive': false,
                        'ConfirmationDate': '',
                        'JoiningDate': CurrentDate,
                        'IsDeleted': false
                    }
                ];
            } else {
                // else cycle thru the first row's columns
                // and add the same number of items
                $scope.JobContractData[0].forEach(function (row) {
                    newrowJobContract.push(
                        {
                            'JobContractID': 0,
                            'JobContractTypeID': 0,
                            'RFID': '',
                            'DesignationID': null,
                            'BrunchID': null,
                            'DepartmentID': null,
                            'InstituteID': null,
                            'ContractDate': CurrentDate,
                            'IsActive': false,
                            'ConfirmationDate': '',
                            'JoiningDate': CurrentDate,
                            'IsDeleted': false
                        }
                    );
                });
            }
            // add the new row at the end of the array 
            $scope.JobContractData.push(newrowJobContract);
        };

        // remove the selected row
        $scope.JobContractRemoveRow = function (index) {
            if ($scope.JobContractData[index][0].JobContractID > 0) {
                $scope.JobContractData[index][0].IsDeleted = true;
                $scope.removeJobContractTrIndex = index;
            } else {
                // remove the row specified in index
                $scope.JobContractData.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.JobContractData.length === 0) {
                    $scope.JobContractData = [];
                }
            }
        };
        //$scope.JobContactindex;
        $scope.openJob = function (index) {
            $scope.JobContactindex = index;
            //Pushing to Guardian array --> id object for genarating dynamicaly checkbox level class and ID value   
            $scope.JobContractData[$scope.JobContactindex][0].id = $scope.JobContactindex;
        };
        // --------------- End Logic For Job Contract Information -------------//

        // --------------- Start Logic For Job Contract Information -------------//
        // initialize the array
        $scope.ExprienceData = [

        ];
        //For Parmanent Addderss add a row in the array
        vm.addNewRowForExprience = function () {
            // create a blank array
            var newrowExprience = [];

            // if array is blank add a standard item
            if ($scope.ExprienceData.length === 0) {
                newrowExprience = [
                    {
                        'UserExperienceRecordID': 0,
                        'Description': '',
                        'ExperienceID': null,
                        'ExperienceStartDate': CurrentDate,
                        'ExperienceEndDate': CurrentDate,
                        'ExperienceDuration': '',
                        'Institute': '',
                        'InstituteAddress': '',
                        'ImageURL': '',
                        'InstituteID': $scope.InstituteID, //Value Came From Local Storage
                        'IsDeleted': false
                    }
                ];
            } else {
                // else cycle thru the first row's columns
                // and add the same number of items
                $scope.ExprienceData[0].forEach(function (row) {
                    newrowExprience.push(
                        {
                            'UserExperienceRecordID': 0,
                            'Description': '',
                            'ExperienceID': null,
                            'ExperienceStartDate': CurrentDate,
                            'ExperienceEndDate': CurrentDate,
                            'ExperienceDuration': '',
                            'Institute': '',
                            'InstituteAddress': '',
                            'ImageURL': '',
                            'InstituteID': $scope.InstituteID, //Value Came From Local Storage,
                            'IsDeleted': false
                        }
                    );
                });
            }
            // add the new row at the end of the array 
            $scope.ExprienceData.push(newrowExprience);
        };

        // remove the selected row
        $scope.ExperienceRemoveRow = function (index) {
            if ($scope.ExprienceData[index][0].UserExperienceRecordID > 0) {
                $scope.ExprienceData[index][0].IsDeleted = true;
                $scope.removeExprienceTrIndex = index;
            } else {
                // remove the row specified in index
                $scope.ExprienceData.splice(index, 1);
                // if no rows left in the array create a blank array
                if ($scope.ExprienceData.length === 0) {
                    $scope.ExprienceData = [];
                }
            }
        };
        // --------------- End Logic For Exprience Information -------------//

        // Reset Button Logic
        $scope.clearField = function () {
            //vm.userSetup = {};
            $state.go($state.current.name, {}, { reload: true });
        };

        //$scope.gridOptions = {
        //    enableFiltering: true,
        //    flatEntityAccess: true,
        //    showGridFooter: true,
        //    fastWatch: true
        //};

        //$scope.gridOptions.columnDefs = [
        //    { name: 'id' },
        //    { name: 'name' },
        //    { name: 'gender' },
        //    { field: 'age' }
        //];

        //$http.get('/data/10000_complex.json')
        //    .success(function (data) {
        //        for (var i = 0; i < 6; i++) {
        //            data = data.concat(data);
        //        }
        //        $scope.gridOptions.data = data;
        //    });

        //$scope.toggleFlat = function () {
        //    $scope.gridOptions.flatEntityAccess = !$scope.gridOptions.flatEntityAccess;
        //};

        vm.guardianSerup = {
            UserNo: '',
            UserTitleID: null,
            UserFirstName: '',
            UserMiddleName: '',
            UserLastName: '',
            UserFullName: '',
            NickName: '',
            EmailID: '',
            SkypeID: '',
            FacebookID: '',
            WhatsApp: '',
            Viber: '',
            LinkedIN: '',
            ParAddress: '',
            ParThana: '',
            ParPostCode: '',
            ParCountryID: null,
            ParStateID: null,
            ParCityID: null,
            PreAddress: '',
            PreThana: '',
            PrePostCode: '',
            PreCountryID: null,
            PreStateID: null,
            PreCityID: null,
            ReligionID: null,
            MobileNo: '',
            PhoneNo: '',
            UniqueIdentity: '',
            BloodGroupID: null,
            Weigth: 0,
            Height: 0,
            DOB: '',
            BirthCertificate: '',
            PassportNO: '',
            NID: '',
            OfficeID: '',
            GenderID: null,
            Remarks: '',
            IsActive: null,
            StatusID: null,
        };
        $scope.Gfistname = false;
        $scope.Glastname = false;
        //------------- Post User Guardian Setup --------------------//
        $scope.GuardianSaveArray = [];
        $scope.checkExistModel = '';
        vm.postUserSetupGuardian = function () {



            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line



            $scope.checkExistModel = $scope.GuardianSaveArray.filter(function (ob, i) { return (ob.id === $scope.Guardianindex); })[0];
            if ($scope.checkExistModel !== null && $scope.checkExistModel !== undefined) {
                $scope.checkExistModel.UserFirstName = vm.guardianSerup.UserFirstName === undefined ? '' : vm.guardianSerup.UserFirstName;
                $scope.checkExistModel.UserMiddleName = vm.guardianSerup.UserMiddleName === undefined ? '' : vm.guardianSerup.UserMiddleName;
                $scope.checkExistModel.UserLastName = vm.guardianSerup.UserLastName === undefined ? '' : vm.guardianSerup.UserLastName;
                $scope.checkExistModel.UserFullName = vm.guardianSerup.UserFirstName + ' ' + vm.guardianSerup.UserMiddleName + ' ' + vm.guardianSerup.UserLastName;
                $scope.checkExistModel.NickName = vm.guardianSerup.NickName === undefined ? '' : vm.guardianSerup.NickName;
                $scope.checkExistModel.EmailID = vm.guardianSerup.EmailID === undefined ? '' : vm.guardianSerup.EmailID;
                $scope.checkExistModel.ReligionID = vm.guardianSerup.religionID === undefined || vm.guardianSerup.religionID === null ? null : vm.guardianSerup.religionID;
                $scope.checkExistModel.PhoneNo = vm.guardianSerup.PhoneNo === undefined ? '' : vm.guardianSerup.PhoneNo;
                $scope.checkExistModel.UniqueIdentity = vm.guardianSerup.UniqueIdentity === undefined ? '' : vm.guardianSerup.UniqueIdentity;
                $scope.checkExistModel.BloodGroupID = vm.guardianSerup.bloodgroupID === undefined || vm.guardianSerup.bloodgroupID === null ? null : vm.guardianSerup.bloodgroupID;
                $scope.checkExistModel.Weigth = vm.guardianSerup.Weigth === undefined || vm.guardianSerup.Weigth === null ? null : vm.guardianSerup.Weigth;
                $scope.checkExistModel.Height = vm.guardianSerup.Height === undefined || vm.guardianSerup.Height === null ? null : vm.guardianSerup.Height;
                $scope.checkExistModel.DOB = vm.guardianSerup.DOB === undefined || vm.guardianSerup.DOB === null ? '' : vm.guardianSerup.DOB;
                $scope.checkExistModel.BirthCertificate = vm.guardianSerup.BirthCertificate === undefined ? '' : vm.guardianSerup.BirthCertificate;
                $scope.checkExistModel.PassportNO = vm.guardianSerup.PassportNO === undefined ? '' : vm.guardianSerup.PassportNO;
                $scope.checkExistModel.NID = vm.guardianSerup.NID === undefined ? '' : vm.guardianSerup.NID;
                $scope.checkExistModel.GenderID = vm.guardianSerup.GenderID === undefined || vm.guardianSerup.GenderID === null ? null : vm.guardianSerup.GenderID;
                $scope.checkExistModel.Remarks = vm.guardianSerup.Remarks === undefined ? '' : vm.guardianSerup.Remarks;
                $scope.GuardianDataModel.DOB = vm.guardianSerup.DOB === undefined ? '' : vm.guardianSerup.DOB;
                $scope.GuardianDataModel.EmailID = vm.guardianSerup.EmailID === undefined ? '' : vm.guardianSerup.EmailID;
                $scope.GuardianDataModel.GurdianFirstName = vm.guardianSerup.UserFirstName === undefined ? '' : vm.guardianSerup.UserFirstName;
                $scope.GuardianDataModel.GurdianLastName = vm.guardianSerup.UserLastName === undefined ? '' : vm.guardianSerup.UserLastName;
                $scope.GuardianDataModel.GurdianMiddleName = vm.guardianSerup.UserMiddleName === undefined ? '' : vm.guardianSerup.UserMiddleName;
                $scope.GuardianDataModel.GurdianNickName = vm.guardianSerup.NickName === undefined ? '' : vm.guardianSerup.NickName;
                $scope.GuardianDataModel.UserFullName = vm.guardianSerup.UserFirstName + ' ' + vm.guardianSerup.UserMiddleName + ' ' + vm.guardianSerup.UserLastName;
                $scope.GuardianDataModel.NID = vm.guardianSerup.NID === undefined ? '' : vm.guardianSerup.NID;
                $scope.GuardianDataModel.PhoneNo = vm.guardianSerup.PhoneNo === undefined ? '' : vm.guardianSerup.PhoneNo;
                $scope.GuardianDataModel.ReligionID = vm.guardianSerup.religionID === undefined || vm.guardianSerup.religionID === null ? null : vm.guardianSerup.religionID;
                $scope.GuardianDataModel.ReligionName = vm.guardianSerup.religionID === undefined || vm.guardianSerup.religionID === null ? '' : vm.religions.filter(function (ob, i) { return (ob.ReligionID === vm.guardianSerup.religionID); })[0].ReligionName;
            }
            else {
                if (vm.guardianSerup.UserFirstName === '') {
                    $scope.Gfistname = true;
                } else if (vm.guardianSerup.UserLastName === '') {
                    $scope.Glastname = true;
                } else {
                    $scope.checkMiddleName = vm.guardianSerup.UserMiddleName === undefined ? '' : vm.guardianSerup.UserMiddleName;
                    vm.guardianSerup.UserFullName = vm.guardianSerup.UserFirstName + ' ' + $scope.checkMiddleName + ' ' + vm.guardianSerup.UserLastName;

                    $scope.GuardianSaveArray.push({
                        id: $scope.Guardianindex,
                        UserID: 0,
                        UserNo: null,
                        UserTypeID: 5,
                        UserTitleID: null,
                        UserFirstName: vm.guardianSerup.UserFirstName,
                        UserMiddleName: vm.guardianSerup.UserMiddleName === undefined ? '' : vm.guardianSerup.UserMiddleName,
                        UserLastName: vm.guardianSerup.UserLastName,
                        UserFullName: vm.guardianSerup.UserFullName,
                        NickName: vm.guardianSerup.NickName === undefined || vm.guardianSerup.NickName === '' ? '' : vm.guardianSerup.NickName,
                        EmailID: vm.guardianSerup.EmailID === undefined || vm.guardianSerup.EmailID === '' ? '' : vm.guardianSerup.EmailID,
                        SkypeID: '',
                        FacebookID: '',
                        WhatsApp: '',
                        Viber: '',
                        LinkedIN: '',
                        ParAddress: '',
                        ParThana: '',
                        ParPostCode: '',
                        ParCountryID: null,
                        ParStateID: null,
                        ParCityID: null,
                        PreAddress: '',
                        PreThana: '',
                        PrePostCode: '',
                        PreCountryID: null,
                        PreStateID: null,
                        PreCityID: null,
                        ReligionID: vm.guardianSerup.religionID === undefined || vm.guardianSerup.religionID === null ? null : vm.guardianSerup.religionID,
                        MobileNo: '',
                        PhoneNo: vm.guardianSerup.PhoneNo === undefined ? '' : vm.guardianSerup.PhoneNo,
                        UniqueIdentity: vm.guardianSerup.UniqueIdentity === undefined ? '' : vm.guardianSerup.UniqueIdentity,
                        BloodGroupID: vm.guardianSerup.bloodgroupID === undefined || vm.guardianSerup.bloodgroupID === null ? null : vm.guardianSerup.bloodgroupID,
                        Weigth: vm.guardianSerup.Weigth === undefined || vm.guardianSerup.Weigth === null ? null : vm.guardianSerup.Weigth,
                        Height: vm.guardianSerup.Height === undefined || vm.guardianSerup.Height === null ? null : vm.guardianSerup.Height,
                        DOB: vm.guardianSerup.DOB === undefined || vm.guardianSerup.DOB === null ? '' : vm.guardianSerup.DOB,
                        BirthCertificate: vm.guardianSerup.BirthCertificate === undefined ? '' : vm.guardianSerup.BirthCertificate,
                        PassportNO: vm.guardianSerup.PassportNO === undefined ? '' : vm.guardianSerup.PassportNO,
                        ImageUrl: null,
                        SignatureUrl: null,
                        FingerUrl: null,
                        NID: vm.guardianSerup.NID,
                        OfficeID: '',
                        GenderID: vm.guardianSerup.GenderID === undefined || vm.guardianSerup.GenderID === null ? null : vm.guardianSerup.GenderID,
                        Remarks: vm.guardianSerup.Remarks === undefined ? '' : vm.guardianSerup.Remarks,
                        IsDeleted: false
                    });

                    $scope.GuardianDataModel.DOB = vm.guardianSerup.DOB === undefined || vm.guardianSerup.DOB === null ? '' : vm.guardianSerup.DOB;
                    $scope.GuardianDataModel.EmailID = vm.guardianSerup.EmailID === undefined ? '' : vm.guardianSerup.EmailID;
                    $scope.GuardianDataModel.GurdianFirstName = vm.guardianSerup.UserFirstName === undefined ? '' : vm.guardianSerup.UserFirstName;
                    $scope.GuardianDataModel.GurdianLastName = vm.guardianSerup.UserLastName === undefined ? '' : vm.guardianSerup.UserLastName;
                    $scope.GuardianDataModel.GurdianMiddleName = vm.guardianSerup.UserMiddleName === undefined ? '' : vm.guardianSerup.UserMiddleName;
                    $scope.GuardianDataModel.GurdianNickName = vm.guardianSerup.NickName === undefined ? '' : vm.guardianSerup.NickName;
                    $scope.GuardianDataModel.UserFullName = vm.guardianSerup.UserFirstName + ' ' + $scope.GuardianDataModel.GurdianMiddleName + ' ' + vm.guardianSerup.UserLastName;
                    $scope.GuardianDataModel.NID = vm.guardianSerup.NID === undefined ? '' : vm.guardianSerup.NID;
                    $scope.GuardianDataModel.PhoneNo = vm.guardianSerup.PhoneNo === undefined ? '' : vm.guardianSerup.PhoneNo;
                    $scope.GuardianDataModel.ReligionID = vm.guardianSerup.religionID === undefined || vm.guardianSerup.religionID === null ? null : vm.guardianSerup.religionID;
                    $scope.GuardianDataModel.ReligionName = vm.guardianSerup.religionID === undefined || vm.guardianSerup.religionID === null ? '' : vm.religions.filter(function (ob, i) { return (ob.ReligionID === vm.guardianSerup.religionID); })[0].ReligionName;
                }
            }
        };

        //vm.postUserSetupGuardian = function () {
        //    if (vm.guardianSerup.UserFirstName === '') {
        //        //logger.error('Please Input First Name');
        //        $scope.Gfistname = true;
        //    } else if (vm.guardianSerup.UserLastName === '') {
        //        //logger.error('Please Input Last Name');
        //        $scope.Glastname = true;
        //    } else {
        //        vm.guardianSerup.UserFullName = vm.guardianSerup.UserFirstName + ' ' + vm.guardianSerup.UserMiddleName + ' ' + vm.guardianSerup.UserLastName;
        //        userService.postUserGuardian({
        //            UserID: 0,
        //            UserNo: null,
        //            UserTypeID: 5,
        //            UserTitleID: null,
        //            UserFirstName: vm.guardianSerup.UserFirstName,
        //            UserMiddleName: vm.guardianSerup.UserMiddleName,
        //            UserLastName: vm.guardianSerup.UserLastName,
        //            UserFullName: vm.guardianSerup.UserFullName,
        //            NickName: vm.guardianSerup.NickName,
        //            EmailID: vm.guardianSerup.EmailID,
        //            SkypeID: '',
        //            FacebookID: '',
        //            WhatsApp: '',
        //            Viber: '',
        //            LinkedIN: '',
        //            ParAddress: '',
        //            ParThana: '',
        //            ParPostCode: '',
        //            ParCountryID: null,
        //            ParStateID: null,
        //            ParCityID: null,
        //            PreAddress: '',
        //            PreThana: '',
        //            PrePostCode: '',
        //            PreCountryID: null,
        //            PreStateID: null,
        //            PreCityID: null,
        //            ReligionID: vm.guardianSerup.ReligionID,
        //            MobileNo: '',
        //            PhoneNo: vm.guardianSerup.PhoneNo,
        //            UniqueIdentity: vm.guardianSerup.UniqueIdentity,
        //            BloodGroupID: vm.guardianSerup.BloodGroupID,
        //            Weigth: vm.guardianSerup.Weigth,
        //            Height: vm.guardianSerup.Height,
        //            DOB: vm.guardianSerup.DOB,
        //            BirthCertificate: vm.guardianSerup.BirthCertificate,
        //            PassportNO: vm.guardianSerup.PassportNO,
        //            ImageUrl: null,
        //            SignatureUrl: null,
        //            FingerUrl: null,
        //            NID: vm.guardianSerup.NID,
        //            OfficeID: '',
        //            GenderID: vm.guardianSerup.GenderID,
        //            Remarks: vm.guardianSerup.Remarks,
        //            IsActive: null,
        //            StatusID: null,
        //            InstituteID: $localStorage.userInfo[0].InstituteID,
        //            CreateBy: 0,
        //            CreateOn: '2017-11-14',
        //            CreatePc: 'Apple',
        //            UpdateBy: null,
        //            UpdateOn: '2017-11-14',
        //            UpdatePc: 'Apple',
        //            IsDeleted: 0,
        //            DeleteBy: null,
        //            DeleteOn: '2017-11-14',
        //            DeletePc: 'Apple'
        //        })
        //            .then(function (data) {
        //                console.log(data);
        //                vm.lastUser = data[0].ReturnValue;
        //                if (data[0].ReturnValue) {
        //                    logger.info('Saved Successfully');
        //                    //$state.go($state.current.name, {}, {reload: true})
        //                }
        //                var params = {
        //                    userID: vm.lastUser
        //                };
        //                return userService.getUserByID(params)
        //                    .then(function (data) {
        //                        $scope.GuardianData[$scope.Guardianindex][0].GuardianID = data[0].UserID;
        //                        $scope.GuardianData[$scope.Guardianindex][0].UserFullName = data[0].UserFullName;
        //                        $scope.GuardianData[$scope.Guardianindex][0].DOB = data[0].DOB;
        //                        $scope.GuardianData[$scope.Guardianindex][0].ReligionID = data[0].ReligionID;
        //                        $scope.GuardianData[$scope.Guardianindex][0].PhoneNo = data[0].PhoneNo;
        //                        $scope.GuardianData[$scope.Guardianindex][0].NID = data[0].NID;
        //                        $scope.GuardianData[$scope.Guardianindex][0].EmailID = data[0].EmailID;
        //                    });
        //                //logger.info('Saved Successfully');


        //                //$state.transitionTo('deliverypartner.listpartner');
        //            })
        //            .catch(function (error) { });
        //        //console.log(vm.parents);
        //    }
        //};
        vm.userSetup = {
            UserNo: '',
            UserTitleID: null,
            UserFirstName: '',
            UserMiddleName: '',
            UserLastName: '',
            UserFullName: '',
            NickName: '',
            EmailID: '',
            SkypeID: '',
            FacebookID: '',
            WhatsApp: '',
            Viber: '',
            LinkedIN: '',
            ParAddress: '',
            ParThana: '',
            ParPostCode: '',
            ParCountryID: null,
            ParStateID: null,
            ParCityID: null,
            PreAddress: '',
            PreThana: '',
            PrePostCode: '',
            PreCountryID: null,
            PreStateID: null,
            PreCityID: null,
            ReligionID: null,
            MobileNo: '',
            PhoneNo: '',
            UniqueIdentity: '',
            BloodGroupID: null,
            Weigth: 0,
            Height: 0,
            DOB: '',
            BirthCertificate: '',
            PassportNO: '',
            NID: '',
            OfficeID: '',
            GenderID: null,
            Remarks: '',
            IsActive: null,
            StatusID: null,
        };
        vm.UserID = 0;
        //------------- Post User Student Setup --------------------//

        $scope.manageDateSaveArr = function () {
            angular.forEach(vm.guardianInfoArray, function (gd) {
                gd.DOB = gd.DOB === '' || gd.DOB === undefined ? '' : conversion.getStringToDate(gd.DOB);
            });

            angular.forEach(vm.experinceArray, function (ed) {
                ed.ExperienceStartDate = ed.ExperienceStartDate === '' || ed.ExperienceStartDate === undefined ? '' : conversion.getStringToDate(ed.ExperienceStartDate);
                ed.ExperienceEndDate = ed.ExperienceEndDate === '' || ed.ExperienceEndDate === undefined ? '' : conversion.getStringToDate(ed.ExperienceEndDate);
            });

            angular.forEach(vm.jobContractArray, function (jd) {
                jd.ContractDate = jd.ContractDate === '' || jd.ContractDate === undefined ? '' : conversion.getStringToDate(jd.ContractDate);
                jd.ConfirmationDate = jd.ConfirmationDate === '' || jd.ConfirmationDate === undefined ? '' : conversion.getStringToDate(jd.ConfirmationDate);
                jd.JoiningDate = jd.JoiningDate === '' || jd.JoiningDate === undefined ? '' : conversion.getStringToDate(jd.JoiningDate);
            });

            angular.forEach(vm.guardianModalArray, function (gsa) {
                gsa.DOB = gsa.DOB === '' || gsa.DOB === undefined ? '' : conversion.getStringToDate(gsa.DOB);
            });

        };

        $scope.UserTypeSelectedList = [];
        vm.postUserSetupEmployee = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line
            
            vm.ImageUrl = vm.ImageUrl === undefined ? null : vm.ImageUrl;
            vm.FingerUrl = vm.FingerUrl === undefined ? null : vm.FingerUrl;
            vm.SignatureUrl = vm.SignatureUrl === undefined ? null : vm.SignatureUrl;
            vm.userSetup.DOB = vm.userSetup.DOB === '' || vm.userSetup.DOB === undefined || vm.userSetup.DOB === null ? '' : conversion.getStringToDate(vm.userSetup.DOB);

            vm.presentAddressArray = [].concat.apply([], $scope.PresentAddressData);
            vm.permanentAddressArray = [].concat.apply([], $scope.permanentData);
            vm.educationInfoArray = [].concat.apply([], $scope.EducationData);
            vm.guardianInfoArray = [].concat.apply([], $scope.GuardianData);
            vm.jobContractArray = [].concat.apply([], $scope.JobContractData);
            vm.experinceArray = [].concat.apply([], $scope.ExprienceData);
            vm.guardianModalArray = [].concat.apply([], $scope.GuardianSaveArray);
            vm.UserTypeArray = [].concat.apply([], $scope.UserTypeSelectedList);

            $scope.manageDateSaveArr();

            userService.postUserEmployee(vm)
                .then(function (data) {
                    vm.lastUser = data[0].ReturnValue;
                    if (data[0].ReturnValue) {
                        logger.info('Saved Successfully');
                        $state.go($state.current.name, {}, { reload: true });
                    }
                    //var params = {
                    //    userID: vm.lastUser
                    //};
                    //return userService.getUserByID(params)
                    //    .then(function (data) {
                    //        vm.lastPushedUser = data[0];
                    //    });
                })
                .catch(function (error) { });
        };


        //vm.postUserSetupEmployee = function () {

        //    vm.ImageUrl = ($scope.UserimageName === undefined) ? vm.ImageUrl : $scope.UserimageName;
        //    vm.FingerUrl = ($scope.imageFinger === undefined) ? vm.FingerUrl : $scope.imageFinger;
        //    vm.SignatureUrl = ($scope.imageSignature === undefined) ? vm.SignatureUrl : $scope.imageSignature;
        //    var presentAddressArray = [].concat.apply([], $scope.PresentAddressData);
        //    var permanentAddressArray = [].concat.apply([], $scope.permanentData);
        //    var educationInfoArray = [].concat.apply([], $scope.EducationData);
        //    var guardianInfoArray = [].concat.apply([], $scope.GuardianData);
        //    var jobContractArray = [].concat.apply([], $scope.JobContractData);
        //    var experinceArray = [].concat.apply([], $scope.ExprienceData);

        //    if (vm.userSetup) {
        //        if (commonService.require(vm.userSetup.UserFirstName, 'First Name') === 0 || commonService.require(vm.userSetup.UserLastName, 'Last Name') === 0) {
        //            console.log('done');
        //        } else {
        //            debugger;
        //            //vm.userSetup.UserFullName = vm.userSetup.UserFirstName +' '+vm.userSetup.UserMiddleName+' '+vm.userSetup.UserLastName;
        //            userService.postUserEmployee({
        //                UserID: vm.UserID,
        //                UserNo: '',
        //                UserTypeID: 4,
        //                UserTitleID: null,
        //                UserFirstName: vm.userSetup.UserFirstName,
        //                UserMiddleName: vm.userSetup.UserMiddleName,
        //                UserLastName: vm.userSetup.UserLastName,
        //                UserFullName: vm.userSetup.UserFirstName + ' ' + vm.userSetup.UserMiddleName + ' ' + vm.userSetup.UserLastName,
        //                NickName: vm.userSetup.NickName,
        //                EmailID: vm.userSetup.EmailID,
        //                SkypeID: '',
        //                FacebookID: '',
        //                WhatsApp: '',
        //                Viber: '',
        //                LinkedIN: '',
        //                ParAddress: '',
        //                ParThana: '',
        //                ParPostCode: '',
        //                ParCountryID: null,
        //                ParStateID: null,
        //                ParCityID: null,
        //                PreAddress: '',
        //                PreThana: '',
        //                PrePostCode: '',
        //                PreCountryID: null,
        //                PreStateID: null,
        //                PreCityID: null,
        //                ReligionID: vm.userSetup.ReligionID,
        //                MobileNo: '',
        //                PhoneNo: vm.userSetup.PhoneNo,
        //                UniqueIdentity: vm.userSetup.UniqueIdentity,
        //                BloodGroupID: vm.userSetup.BloodGroupID,
        //                Weigth: vm.userSetup.Weigth,
        //                Height: vm.userSetup.Height,
        //                DOB: vm.userSetup.DOB,
        //                BirthCertificate: vm.userSetup.BirthCertificate,
        //                PassportNO: vm.userSetup.PassportNO,
        //                ImageUrl: vm.ImageUrl,
        //                SignatureUrl: vm.SignatureUrl,
        //                FingerUrl: vm.FingerUrl,
        //                NID: vm.userSetup.NID,
        //                OfficeID: '',
        //                GenderID: vm.userSetup.GenderID,
        //                Remarks: vm.userSetup.Remarks,
        //                IsActive: 1,
        //                StatusID: null,
        //                InstituteID: vm.instituteID,
        //                CreateBy: 0,
        //                CreateOn: '2017-11-14',
        //                CreatePc: 'Apple',
        //                UpdateBy: null,
        //                UpdateOn: '2017-11-14',
        //                UpdatePc: 'Apple',
        //                IsDeleted: 0,
        //                DeleteBy: null,
        //                DeleteOn: '2017-11-14',
        //                DeletePc: 'Apple',
        //                presentAddressArr: presentAddressArray,
        //                permanentAddressArr: permanentAddressArray,
        //                educationInfoArr: educationInfoArray,
        //                guardianInfoArr: guardianInfoArray,
        //                jobContractArr: jobContractArray,
        //                experinceArr: experinceArray

        //            })
        //                .then(function (data) {
        //                    console.log(data);
        //                    vm.lastUser = data[0].ReturnValue;
        //                    if (data[0].ReturnValue) {
        //                        logger.info('Saved Successfully');
        //                        $state.go($state.current.name, {}, { reload: true });
        //                    }
        //                    var params = {
        //                        userID: vm.lastUser
        //                    };
        //                    return userService.getUserByID(params)
        //                        .then(function (data) {
        //                            vm.lastPushedUser = data[0];
        //                        });
        //                })
        //                .catch(function (error) { });
        //            //console.log(vm.parents);
        //        }
        //    }
        //};

        // vm.gerders = {};
        $scope.open = function (index) {
            $scope.Guardianindex = index;
            //Pushing to Guardian array --> id object for genarating dynamicaly checkbox level class and ID value   
            $scope.GuardianData[$scope.Guardianindex][0].id = $scope.Guardianindex;
            vm.guardianSerup = {};
        };
        $scope.editModels = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line





            var params = {
                userID: model.UserID
            };
            //Service Request From DataService/itemEntry
            userService.getUserMasterDetailsByID(params)

                .then(function (data) {
                    vm.UserID = data[0].UserID;
                    vm.userSetup.UserFirstName = data[0].UserFirstName;
                    vm.userSetup.UserMiddleName = data[0].UserMiddleName;
                    vm.userSetup.UserLastName = data[0].UserLastName;
                    vm.userSetup.UserFullName = data[0].UserFullName;
                    vm.userSetup.NickName = data[0].NickName;
                    vm.userSetup.DOB = data[0].DOB;
                    vm.userSetup.GenderID = data[0].GenderID;
                    vm.gender = { selected: vm.genders.filter(function (ob, i) { return (ob.GenderID === data[0].GenderID); })[0] };
                    vm.userSetup.ReligionID = data[0].ReligionID;
                    vm.religion = { selected: vm.religions.filter(function (ob, i) { return (ob.ReligionID === data[0].ReligionID); })[0] };
                    vm.userSetup.BloodGroupID = data[0].BloodGroupID;
                    vm.bloodgroup = { selected: vm.bloodGroups.filter(function (ob, i) { return (ob.BloodGroupID === data[0].BloodGroupID); })[0] };
                    vm.instituteID = data[0].InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === data[0].InstituteID); })[0] };
                    vm.userSetup.Height = data[0].Height;
                    vm.userSetup.Weigth = data[0].Weigth;
                    vm.userSetup.NID = data[0].NID;
                    vm.userSetup.PassportNO = data[0].PassportNO;
                    vm.userSetup.BirthCertificate = data[0].BirthCertificate;
                    vm.userSetup.PhoneNo = data[0].PhoneNo;
                    vm.userSetup.EmailID = data[0].EmailID;
                    vm.userSetup.UniqueIdentity = data[0].UniqueIdentity;
                    vm.userSetup.Remarks = data[0].Remarks;
                    vm.presentAddress = data[0].PreAddressInfo;
                    vm.parmanentAddress = data[0].ParAddressInfo;
                    vm.educationInfo = data[0].EducationInfo;
                    vm.familyInfo = data[0].FamilyInfo;
                    $scope.GuardianSaveArray = data[0].guardianModalInfo !== undefined ? data[0].guardianModalInfo : [];
                    vm.jobContractInfo = data[0].JobContractInfo;
                    vm.exprienceInfo = data[0].ExperienceInfo;
                    vm.ImageUrl = data[0].ImageUrl;
                    vm.FingerUrl = data[0].FingerUrl;
                    vm.SignatureUrl = data[0].SignatureUrl;
                    vm.UserID = data[0].UserID;
                    vm.userSetup.UserFirstName = data[0].UserFirstName;
                    vm.userSetup.UserMiddleName = data[0].UserMiddleName;
                    vm.userSetup.UserLastName = data[0].UserLastName;
                    vm.userSetup.UserFullName = data[0].UserFullName;
                    vm.userSetup.NickName = data[0].NickName;
                    vm.userSetup.DOB = data[0].DOB;
                    vm.gender = { selected: vm.genders.filter(function (ob, i) { return (ob.GenderID === data[0].GenderID); })[0] };
                    vm.religion = { selected: vm.religions.filter(function (ob, i) { return (ob.ReligionID === data[0].ReligionID); })[0] };
                    vm.bloodgroup = { selected: vm.bloodGroups.filter(function (ob, i) { return (ob.BloodGroupID === data[0].BloodGroupID); })[0] };
                    vm.userSetup.Height = data[0].Height;
                    vm.userSetup.Weigth = data[0].Weigth;
                    vm.userSetup.NID = data[0].NID;
                    vm.userSetup.PassportNO = data[0].PassportNO;
                    vm.userSetup.BirthCertificate = data[0].BirthCertificate;
                    vm.userSetup.PhoneNo = data[0].PhoneNo;
                    vm.userSetup.EmailID = data[0].EmailID;
                    vm.userSetup.UniqueIdentity = data[0].UniqueIdentity;
                    vm.userSetup.Remarks = data[0].Remarks;

                    if (vm.presentAddress !== undefined) {
                        for (var i = 0; i < vm.presentAddress.length; i++) {

                            var presentAddressValue = vm.presentAddress[i];
                            var newrowPresentAddress = [];
                            if ($scope.PresentAddressData.length === 0) {
                                newrowPresentAddress = [
                                    {
                                        'presentAddressJSON': '',
                                        'UserAddressID': presentAddressValue.UserAddressID,
                                        'AddressTypeID': presentAddressValue.AddressTypeID,
                                        'postCode': presentAddressValue.ParPostCode,
                                        'thana': presentAddressValue.ParThana,
                                        'address': presentAddressValue.Address,
                                        'Country': presentAddressValue.Country,
                                        'CountryID': presentAddressValue.CountryID,
                                        'CityID': presentAddressValue.CityID,
                                        'City': presentAddressValue.City,
                                        'StateID': presentAddressValue.StateID,
                                        'State': presentAddressValue.State,
                                        'AddressType': presentAddressValue.AddressType,
                                        'countrySelected': { CountryID: presentAddressValue.CountryID, CountryName: presentAddressValue.Country },
                                        'statueSelected': { StateID: presentAddressValue.StateID, StateName: presentAddressValue.State },
                                        'citySelected': { CityID: presentAddressValue.CityID, CityName: presentAddressValue.City },
                                        'IsActive': presentAddressValue.IsActive,
                                        'IsDeleted': presentAddressValue.IsDeleted
                                    }
                                ];
                            } else {
                                // else cycle thru the first row's columns
                                // and add the same number of items
                                $scope.PresentAddressData[0].forEach(function (i) {
                                    newrowPresentAddress.push(
                                        {
                                            'presentAddressJSON': '',
                                            'UserAddressID': presentAddressValue.UserAddressID,
                                            'AddressTypeID': presentAddressValue.AddressTypeID,
                                            'postCode': presentAddressValue.ParPostCode,
                                            'thana': presentAddressValue.ParThana,
                                            'address': presentAddressValue.Address,
                                            'Country': presentAddressValue.Country,
                                            'CountryID': presentAddressValue.CountryID,
                                            'CityID': presentAddressValue.CityID,
                                            'City': presentAddressValue.City,
                                            'StateID': presentAddressValue.StateID,
                                            'State': presentAddressValue.State,
                                            'AddressType': presentAddressValue.AddressType,
                                            'countrySelected': { CountryID: presentAddressValue.CountryID, CountryName: presentAddressValue.Country },
                                            'statueSelected': { StateID: presentAddressValue.StateID, StateName: presentAddressValue.State },
                                            'citySelected': { CityID: presentAddressValue.CityID, CityName: presentAddressValue.City },
                                            'IsActive': presentAddressValue.IsActive,
                                            'IsDeleted': presentAddressValue.IsDeleted

                                        }
                                    );
                                });
                            }
                            // add the new row at the end of the array 

                            $scope.PresentAddressData.push(newrowPresentAddress);
                        }
                    }

                    if (vm.parmanentAddress !== undefined) {
                        for (var j = 0; j < vm.parmanentAddress.length; j++) {

                            var premanentAddressValue = vm.parmanentAddress[j];
                            var newrowPremanentAddress = [];
                            if ($scope.permanentData.length === 0) {
                                newrowPremanentAddress = [
                                    {
                                        'presentAddressJSON': '',
                                        'UserAddressID': premanentAddressValue.UserAddressID,
                                        'AddressTypeID': premanentAddressValue.AddressTypeID,
                                        'postCode': premanentAddressValue.ParPostCode,
                                        'thana': premanentAddressValue.ParThana,
                                        'address': premanentAddressValue.Address,
                                        'Country': premanentAddressValue.Country,
                                        'CountryID': premanentAddressValue.CountryID,
                                        'CityID': premanentAddressValue.CityID,
                                        'City': premanentAddressValue.City,
                                        'StateID': premanentAddressValue.StateID,
                                        'State': premanentAddressValue.State,
                                        'AddressType': premanentAddressValue.AddressType,
                                        'countrySelected': { CountryID: premanentAddressValue.CountryID, CountryName: premanentAddressValue.Country },
                                        'statueSelected': { StateID: premanentAddressValue.StateID, StateName: premanentAddressValue.State },
                                        'citySelected': { CityID: premanentAddressValue.CityID, CityName: premanentAddressValue.City },
                                        'IsActive': premanentAddressValue.IsActive,
                                        'IsDeleted': premanentAddressValue.IsDeleted

                                    }
                                ];
                            } else {
                                // else cycle thru the first row's columns
                                // and add the same number of items
                                $scope.permanentData[0].forEach(function (j) {
                                    newrowPremanentAddress.push(
                                        {
                                            'presentAddressJSON': '',
                                            'UserAddressID': premanentAddressValue.UserAddressID,
                                            'AddressTypeID': premanentAddressValue.AddressTypeID,
                                            'postCode': premanentAddressValue.ParPostCode,
                                            'thana': premanentAddressValue.ParThana,
                                            'address': premanentAddressValue.Address,
                                            'Country': premanentAddressValue.Country,
                                            'CountryID': premanentAddressValue.CountryID,
                                            'CityID': premanentAddressValue.CityID,
                                            'City': premanentAddressValue.City,
                                            'StateID': premanentAddressValue.StateID,
                                            'State': premanentAddressValue.State,
                                            'AddressType': premanentAddressValue.AddressType,
                                            'countrySelected': { CountryID: premanentAddressValue.CountryID, CountryName: premanentAddressValue.Country },
                                            'statueSelected': { StateID: premanentAddressValue.StateID, StateName: premanentAddressValue.State },
                                            'citySelected': { CityID: premanentAddressValue.CityID, CityName: premanentAddressValue.City },
                                            'IsActive': premanentAddressValue.IsActive,
                                            'IsDeleted': premanentAddressValue.IsDeleted

                                        }
                                    );
                                });
                            }
                            // add the new row at the end of the array 
                            $scope.permanentData.push(newrowPremanentAddress);
                        }
                    }

                    if (vm.educationInfo !== undefined) {
                        for (var k = 0; k < vm.educationInfo.length; k++) {

                            var EducationValue = vm.educationInfo[k];
                            var newrowEducation = [];
                            if ($scope.EducationData.length === 0) {
                                newrowEducation = [
                                    {
                                        'UserEducationRecordID': EducationValue.UserEducationRecordID,
                                        'Description': EducationValue.Description,
                                        'GPA': parseInt(EducationValue.GPA),
                                        'ExamID': EducationValue.ExamID,
                                        'Exam': EducationValue.Exam,
                                        'ExamSelected': { ExamID: EducationValue.ExamID, ExamName: EducationValue.Exam },
                                        'GradeID': EducationValue.GradeID,
                                        'Grade': EducationValue.Grade,
                                        'GradeSelected': { GradeID: EducationValue.GradeID, GradeName: EducationValue.Grade },
                                        'BoardID': EducationValue.BoardID,
                                        'Board': EducationValue.Board,
                                        'BoardSelected': { BoardID: EducationValue.BoardID, BoardName: EducationValue.Board },
                                        'SessionID': EducationValue.SessionID,
                                        'Session': EducationValue.Session,
                                        'SessionSelected': { SessionID: EducationValue.SessionID, SessionName: EducationValue.Session },
                                        'YearPass': EducationValue.YearPass,
                                        'EducationDuration': EducationValue.EducationDuration,
                                        'Institute': EducationValue.Institute,
                                        'ImageURL': EducationValue.ImageURL,
                                        'IsDeleted': EducationValue.IsDeleted
                                    }
                                ];
                            } else {
                                // else cycle thru the first row's columns
                                // and add the same number of items
                                $scope.EducationData[0].forEach(function (k) {
                                    newrowEducation.push(
                                        {
                                            'UserEducationRecordID': EducationValue.UserEducationRecordID,
                                            'Description': EducationValue.Description,
                                            'GPA': EducationValue.GPA,
                                            'ExamID': EducationValue.ExamID,
                                            'Exam': EducationValue.Exam,
                                            'ExamSelected': { ExamID: EducationValue.ExamID, ExamName: EducationValue.Exam },
                                            'GradeID': EducationValue.GradeID,
                                            'Grade': EducationValue.Grade,
                                            'GradeSelected': { GradeID: EducationValue.GradeID, GradeName: EducationValue.Grade },
                                            'BoardID': EducationValue.BoardID,
                                            'Board': EducationValue.Board,
                                            'BoardSelected': { BoardID: EducationValue.BoardID, BoardName: EducationValue.Board },
                                            'SessionID': EducationValue.SessionID,
                                            'Session': EducationValue.Session,
                                            'SessionSelected': { SessionID: EducationValue.SessionID, SessionName: EducationValue.Session },
                                            'YearPass': EducationValue.YearPass,
                                            'EducationDuration': EducationValue.EducationDuration,
                                            'Institute': EducationValue.Institute,
                                            'ImageURL': EducationValue.ImageURL,
                                            'IsDeleted': EducationValue.IsDeleted
                                        }
                                    );
                                });
                            }
                            // add the new row at the end of the array 
                            $scope.EducationData.push(newrowEducation);
                        }
                    }


                    if (vm.familyInfo !== undefined) {
                        for (var m = 0; m < vm.familyInfo.length; m++) {
                            var model = $scope.GuardianSaveArray[m];
                            model.id = m;
                            model.UserTitleID = model.UserTitleID === 0 ? null : model.UserTitleID;
                            model.ParCountryID = model.ParCountryID === 0 ? null : model.ParCountryID;
                            model.ParStateID = model.ParStateID === 0 ? null : model.ParStateID;
                            model.ParCityID = model.ParCityID === 0 ? null : model.ParCityID;
                            model.PreCountryID = model.PreCountryID === 0 ? null : model.PreCountryID;
                            model.PreStateID = model.PreStateID === 0 ? null : model.PreStateID;
                            model.PreCityID = model.PreCityID === 0 ? null : model.PreCityID;

                            var GuardianValue = vm.familyInfo[m];
                            var newrowGuardian = [];
                            if ($scope.GuardianData.length === 0) {
                                newrowGuardian = [
                                    {
                                        'FamilyID': GuardianValue.FamilyID,
                                        'RelationID': GuardianValue.RelationID,
                                        'Relation': GuardianValue.Relation,
                                        'RelationSelected': { RelationID: GuardianValue.RelationID, RelationName: GuardianValue.Relation },
                                        'isLocal': GuardianValue.IsLocalGuardian,
                                        'GuardianID': GuardianValue.GuardianID,
                                        'GurdianTitle': GuardianValue.GurdianTitle,
                                        'GurdianFirstName': GuardianValue.GurdianFirstName,
                                        'GurdianMiddleName': GuardianValue.GurdianMiddleName,
                                        'GurdianLastName': GuardianValue.GurdianLastName,
                                        'UserFullName': GuardianValue.GurdianFullName,
                                        'GurdianNickName': GuardianValue.GurdianNickName,
                                        'EmailID': GuardianValue.GurdianEmailID,
                                        'GurdianMobileNo': GuardianValue.GurdianMobileNo,
                                        'PhoneNo': GuardianValue.GurdianPhoneNo,
                                        'NID': GuardianValue.GurdianNID,
                                        'DOB': GuardianValue.GurdianDOB,
                                        'IsDeleted': GuardianValue.IsDeleted,
                                        'ReligionID': GuardianValue.ReligionID,
                                        'ReligionName': GuardianValue.ReligionName
                                    }
                                ];
                            } else {
                                // else cycle thru the first row's columns
                                // and add the same number of items
                                $scope.GuardianData[0].forEach(function (m) {
                                    newrowGuardian.push(
                                        {
                                            'FamilyID': GuardianValue.FamilyID,
                                            'RelationID': GuardianValue.RelationID,
                                            'Relation': GuardianValue.Relation,
                                            'RelationSelected': { RelationID: GuardianValue.RelationID, RelationName: GuardianValue.Relation },
                                            'isLocal': GuardianValue.IsLocalGuardian,
                                            'GuardianID': GuardianValue.GuardianID,
                                            'GurdianTitle': GuardianValue.GurdianTitle,
                                            'GurdianFirstName': GuardianValue.GurdianFirstName,
                                            'GurdianMiddleName': GuardianValue.GurdianMiddleName,
                                            'GurdianLastName': GuardianValue.GurdianLastName,
                                            'UserFullName': GuardianValue.GurdianFullName,
                                            'GurdianNickName': GuardianValue.GurdianNickName,
                                            'EmailID': GuardianValue.GurdianEmailID,
                                            'GurdianMobileNo': GuardianValue.GurdianMobileNo,
                                            'PhoneNo': GuardianValue.GurdianPhoneNo,
                                            'NID': GuardianValue.GurdianNID,
                                            'DOB': GuardianValue.GurdianDOB,
                                            'IsDeleted': GuardianValue.IsDeleted,
                                            'ReligionID': GuardianValue.ReligionID,
                                            'ReligionName': GuardianValue.ReligionName
                                        }
                                    );
                                });
                            }
                            // add the new row at the end of the array 
                            $scope.GuardianData.push(newrowGuardian);
                        }
                    }

                    if (vm.jobContractInfo !== undefined) {
                        for (var p = 0; p < vm.jobContractInfo.length; p++) {

                            var jobContractValue = vm.jobContractInfo[p];
                            var newrowJobContract = [];
                            if ($scope.JobContractData.length === 0) {
                                newrowJobContract = [
                                    {
                                        'JobContractID': jobContractValue.JobContractID,
                                        'JobContractTypeID': jobContractValue.JobContractTypeID,
                                        'RFID': jobContractValue.RFID,
                                        'UserID': jobContractValue.UserID,
                                        'UserFullName': jobContractValue.UserFullName,
                                        'DesignationID': jobContractValue.DesignationID,
                                        'DesignationName': jobContractValue.DesignationName,
                                        'DesignationSelected': { DesignationName: jobContractValue.DesignationName, UserDesignationID: jobContractValue.UserDesignationID },
                                        'BrunchID': jobContractValue.BrunchID,
                                        'BrunchName': jobContractValue.BrunchName,
                                        'BranchSelected': { BrunchID: jobContractValue.BrunchID, BrunchName: jobContractValue.BrunchName },
                                        'DepartmentID': jobContractValue.DepartmentID,
                                        'DepartmentName': jobContractValue.DepartmentName,
                                        'DepertmentSelected': { DepartmentID: jobContractValue.DepartmentID, DepartmentName: jobContractValue.DepartmentName },
                                        'InstituteID': jobContractValue.InstituteID,
                                        'InstituteName': jobContractValue.InstituteName,
                                        'InstituteSelected': { InstituteID: jobContractValue.InstituteID, InstituteName: jobContractValue.InstituteName },
                                        'ContractDate': jobContractValue.ContractDate,
                                        'IsActive': jobContractValue.IsActive,
                                        'ConfirmationDate': jobContractValue.ConfirmationDate,
                                        'JoiningDate': jobContractValue.JoiningDate,
                                        'IsDeleted': jobContractValue.IsDeleted
                                    }
                                ];
                            } else {
                                // else cycle thru the first row's columns
                                // and add the same number of items
                                $scope.JobContractData[0].forEach(function (p) {
                                    newrowJobContract.push(
                                        {
                                            'JobContractID': jobContractValue.JobContractID,
                                            'JobContractTypeID': jobContractValue.JobContractTypeID,
                                            'RFID': jobContractValue.RFID,
                                            'UserID': jobContractValue.UserID,
                                            'UserFullName': jobContractValue.UserFullName,
                                            'DesignationID': jobContractValue.DesignationID,
                                            'DesignationName': jobContractValue.DesignationName,
                                            'DesignationSelected': { DesignationName: jobContractValue.DesignationName, UserDesignationID: jobContractValue.UserDesignationID },
                                            'BrunchID': jobContractValue.BrunchID,
                                            'BrunchName': jobContractValue.BrunchName,
                                            'BranchSelected': { BrunchID: jobContractValue.BrunchID, BrunchName: jobContractValue.BrunchName },
                                            'DepartmentID': jobContractValue.DepartmentID,
                                            'DepartmentName': jobContractValue.DepartmentName,
                                            'DepertmentSelected': { DepartmentID: jobContractValue.DepartmentID, DepartmentName: jobContractValue.DepartmentName },
                                            'InstituteID': jobContractValue.InstituteID,
                                            'InstituteName': jobContractValue.InstituteName,
                                            'InstituteSelected': { InstituteID: jobContractValue.InstituteID, InstituteName: jobContractValue.InstituteName },
                                            'ContractDate': jobContractValue.ContractDate,
                                            'IsActive': jobContractValue.IsActive,
                                            'ConfirmationDate': jobContractValue.ConfirmationDate,
                                            'JoiningDate': jobContractValue.JoiningDate,
                                            'IsDeleted': jobContractValue.IsDeleted
                                        }
                                    );
                                });
                            }
                            // add the new row at the end of the array 
                            $scope.JobContractData.push(newrowJobContract);
                        }
                    }

                    if (vm.exprienceInfo !== undefined) {
                        for (var x = 0; x < vm.exprienceInfo.length; x++) {

                            var exprienceValue = vm.exprienceInfo[x];
                            var newrowExprience = [];
                            if ($scope.ExprienceData.length === 0) {
                                newrowExprience = [
                                    {
                                        'UserExperienceRecordID': exprienceValue.UserExperienceRecordID,
                                        'Description': exprienceValue.Description,
                                        'ExperienceID': exprienceValue.ExperienceID,
                                        'Experience': exprienceValue.Experience,
                                        'ExperienceSelected': { ExperienceID: exprienceValue.ExperienceID, ExperienceName: exprienceValue.Experience },
                                        'ExperienceStartDate': exprienceValue.ExperienceStartDate,
                                        'ExperienceEndDate': exprienceValue.ExperienceEndDate,
                                        'ExperienceDuration': exprienceValue.ExperienceDuration,
                                        'Institute': exprienceValue.Institute,
                                        'InstituteAddress': exprienceValue.InstituteAddress,
                                        'ImageURL': exprienceValue.ImageURL,
                                        'InstituteID': exprienceValue.InstituteID,
                                        'IsDeleted': exprienceValue.IsDeleted
                                    }
                                ];
                            } else {
                                // else cycle thru the first row's columns
                                // and add the same number of items
                                $scope.ExprienceData[0].forEach(function (x) {
                                    newrowExprience.push(
                                        {
                                            'UserExperienceRecordID': exprienceValue.UserExperienceRecordID,
                                            'Description': exprienceValue.Description,
                                            'ExperienceID': exprienceValue.ExperienceID,
                                            'Experience': exprienceValue.Experience,
                                            'ExperienceSelected': { ExperienceID: exprienceValue.ExperienceID, ExperienceName: exprienceValue.Experience },
                                            'ExperienceStartDate': exprienceValue.ExperienceStartDate,
                                            'ExperienceEndDate': exprienceValue.ExperienceEndDate,
                                            'ExperienceDuration': exprienceValue.ExperienceDuration,
                                            'Institute': exprienceValue.Institute,
                                            'InstituteAddress': exprienceValue.InstituteAddress,
                                            'ImageURL': exprienceValue.ImageURL,
                                            'InstituteID': exprienceValue.InstituteID,
                                            'IsDeleted': exprienceValue.IsDeleted
                                        }
                                    );
                                });
                            }
                            // add the new row at the end of the array 
                            $scope.ExprienceData.push(newrowExprience);
                        }


                    }

                });
            $scope.showItem = false;
            $scope.createItem = true;
            $scope.presentAddressContainer = true;
            $scope.permanentAddressContainer = true;
            $scope.educationInfoContainer = true;
            $scope.guardianInfoContainer = true;
            $scope.exprienceInfoContainer = true;
            $scope.jobContarctInfoContainer = true;
        };

        //Delete User Student
        $scope.deleteModels = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.deleteMethod)) //jshint ignore : line




            var params = {
                userID: parseInt(model.UserID)
            };
            userService.deleteUserByID(params)
                .then(function (data) {
                    if (data[0].returnvalue) {
                        logger.info('Delete Successfully');
                        $state.go($state.current.name, {}, { reload: true });
                    } else {
                        logger.error('Delete Failed');
                    }
                })
                .catch(function (error) { });
        };

        $scope.getAllState = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            model.StateList = [];
            model.statueSelected = null;
            model.citys = [];
            model.citySelected = null;
            var Params = {
                CountryID: model.CountryID
            };

            return commonService.getState(Params)
                .then(function (data) {
                    //vm.states = data;
                    model.StateList = data;
                });
        };

        $scope.getAllCity = function (model) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            model.citys = [];
            model.citySelected = null;
            var Params = {
                StateID: model.StateID
            };
            return commonService.getCity(Params)
                .then(function (data) {
                    model.citys = data;
                });
        };

        var Year = new Date().getFullYear();
        ////**********Current Date*****************
        //$scope.CurrentDate = new Date();

        //var today = new Date();
        //var dd = today.getDate();
        //var mm = today.getMonth() + 1;
        //var yyyy = today.getFullYear();

        //if (dd < 10) {
        //    dd = '0' + dd;
        //}

        //if (mm < 10) {
        //    mm = '0' + mm;
        //}

        //today = yyyy + '-' + mm + '-' + dd;
        ////**********Current Date*****************

        $scope.ChecPassYear = function (model) {
            if (model.YearPass > Year) {
                logger.error('Passing Year can not be greater than current year!!!!!!!');
                model.YearPass = Year;
            }
        };

        $scope.ValidationOfExpDate = function (model) {
            var EEDate = conversion.getStringToDate(model.ExperienceEndDate);
            var ESDate = conversion.getStringToDate(model.ExperienceStartDate);
            if (EEDate < ESDate || (EEDate > today || ESDate > today)) {
                logger.error('Invalid Input');
                model.ExperienceStartDate = CurrentDate;
                model.ExperienceEndDate = CurrentDate;
            }
        };

        //************************************************Start Grid******************************************************
        //***************Start ServerSide Search********************************************
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
        //***************End ServerSide Search********************************************

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
                getAllEmployee(1);
            },
            firstPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber = 1;
                    getAllEmployee(1);
                }
            },
            nextPage: function () {
                if (this.pageNumber < this.getTotalPages()) {
                    this.pageNumber++;
                    getAllEmployee(1);
                }
            },
            previousPage: function () {
                if (this.pageNumber > 1) {
                    this.pageNumber--;
                    getAllEmployee(1);
                }
            },
            lastPage: function () {
                if (this.pageNumber >= 1) {
                    this.pageNumber = this.getTotalPages();
                    getAllEmployee(1);
                }
            }
        };
        function getAllEmployee(isPaging) {


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
            objcmnParam.typeID = 3;
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
                    { name: 'UserFullName', displayName: 'Student Name', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'EmailID', displayName: 'E-Mail', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'DOB', displayName: 'Date of Birth', cellFilter: 'date:"dd-MM-yyyy"', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'PassportNO', displayName: 'Passport', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'PreAddress', displayName: 'Present Address', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ParAddress', displayName: 'Permanent Address', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'BloodGroupName', displayName: 'Blood Group', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'PhoneNo', displayName: 'Contact No', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'NID', displayName: 'National ID', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'InstituteName', displayName: 'Institute', headerCellClass: $scope.highlightFilteredHeader },
                    { name: 'ReligionName', displayName: 'Religion', headerCellClass: $scope.highlightFilteredHeader },
                    {
                        name: 'Option',
                        displayName: 'Option',
                        width: '15%',
                        pinnedRight: true,
                        enableColumnResizing: false,
                        enableFiltering: false,
                        enableSorting: false,
                        headerCellClass: $scope.highlightFilteredHeader,
                        visible: true,
                        cellTemplate: '<button class="label label-success label-mini" style="background-color:#0aa699">' +
                        '<a href="javascript:void(0);" data-toggle="modal" style="background-color:#0aa699" class="bs-tooltip" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
                        '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></a></button>' +

                        '<button class="label label-danger label-mini" style="text-align:center; background-color:brown; color:white !important">' +
                        '<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                        '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></a></button>'
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

            var funcName = '/getAllEmployee';
            var data = [];
            return userService.getAllUsers(funcName, objcmnParam)
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
        function RefreshList() {
            $scope.pagination.pageNumber = 1;
            getAllEmployee(0);
        }
        //************************************************End Grid******************************************************





        activate();

        function activate() {
            var promises = [getAllRelation(), getAllCountry(), //getAllState(), getAllCity(), 
            getAllReligion(), getAllBloodGroups(), getAllBoard(),
            getAllExam(), getAllGrades(), getAllSession(), getAllGender(), //RefreshList(),
            getAllDesignation(), getAllDepertment(), getAllInstitute(), getExprienceList() //getAllBranch(),
            ];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        function getAllRelation() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return commonService.getRelation()
                .then(function (data) {
                    vm.relations = data;
                });
        }
        function getAllCountry() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            return commonService.getCountry()
                .then(function (data) {
                    vm.countrys = data;
                });
        }

        function getAllReligion() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return commonService.getReligion()
                .then(function (data) {
                    vm.religions = data;
                });
        }
        function getAllBloodGroups() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return commonService.getBloodGroups()
                .then(function (data) {
                    vm.bloodGroups = data;
                });
        }
        function getAllBoard() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return commonService.getBoard()
                .then(function (data) {
                    vm.boards = data;
                });
        }
        function getAllExam() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return commonService.getAcademicExam()
                .then(function (data) {
                    vm.exams = data;
                });
        }
        function getAllGrades() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            return commonService.getGrade()
                .then(function (data) {
                    vm.grades = data;
                });
        }
        function getAllSession() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return commonService.getSession()
                .then(function (data) {
                    vm.sessions = data;
                });
        }
        function getAllGender() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            return commonService.getGender()
                .then(function (data) {
                    vm.genders = data;
                });
        }
        //function getAllEmployee() {
        //    var params = {
        //        typeID: 4,
        //        instituteId: $localStorage.userInfo[0].InstituteID
        //    };
        //    return userService.getUserByTypeID(params)
        //        .then(function (data) {
        //            vm.students = data;
        //        });
        //}
        function getAllDesignation() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line




            return designationSettings.getAllDesignations()
                .then(function (data) {
                    vm.designations = data;
                });
        }
        //function getAllBranch(){
        //    return branchSettings.getAllBranch()
        //    .then(function(data){
        //        vm.branches = data;
        //    });
        //}
        function getAllDepertment() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return teacherAttendanceSevice.getInsDepartment()
                .then(function (data) {
                    vm.depertments = data;
                });
        }
        function getAllInstitute() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    //if (vm.InstituteID !== 1) {
                    //vm.instituteID = vm.InstituteID;
                    vm.userSetup.instituteID = vm.InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };
                    vm.instituteSelected(vm.InstituteID);
                    //}
                });
        }
        function getExprienceList() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            return userService.getUserExprienceList()
                .then(function (data) {
                    vm.expriences = data;
                });
        }
    }
})();


