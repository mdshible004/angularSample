(function () {
    'use strict';

    angular
        .module('app.dateWiseLessonPlan')
        .controller('DateWiseLessonPlanController', DateWiseLessonPlanController);

    DateWiseLessonPlanController.$inject = ['userRegistrationService', 'homeWorkEntry', 'conversion', 'syllabusSevice', 'classSettingsService', 'subjectSettingsSevice', 'exameRoutineEntry', 'insExameSetting', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function DateWiseLessonPlanController(userRegistrationService, homeWorkEntry, conversion, syllabusSevice, classSettingsService, subjectSettingsSevice, exameRoutineEntry, insExameSetting, commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {



        var vm = this;
        vm.dateSetup = conversion.NowDateCustom();
        //Token Generate Decleration
        vm.UserTypeID = $localStorage.userInfo[0].UserTypeID;
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;

        vm.MediumID = $localStorage.userInfo[0].MediumID;
        vm.ClassID = $localStorage.userInfo[0].ClassID;
        vm.DepartmentID = $localStorage.userInfo[0].SDepartmentID;
        vm.ShiftID = $localStorage.userInfo[0].ShiftID;
        vm.SectionID = $localStorage.userInfo[0].SectionID;
        vm.RFID = $localStorage.userInfo[0].RFID;

        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration
        $scope.imgShowSignature = false;


        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.addRoutin = false;

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        $scope.create = function () {
            $scope.createItem = true;
            //$scope.addRoutin = true;
            $scope.addExameRoutin = false;
            $scope.createmarks = false;
            $scope.addpassmarks = false;
        };

        $scope.data = [];
        $scope.subjectArr = [];


        $scope.total = 0;
        $scope.saveBtn = true;
        //$scope.addRoutin = false;

        vm.imgHost = apiConfig.imagehost;
        $scope.changexm = function () {
            $scope.addRoutin = false;
        };
        $scope.change = function () {
            $scope.addRoutin = false;
        };

        vm.getHomeWork = function () {
            // var a;
            vm.xxx = conversion.getStringToDate(vm.dateSetup);
            var params = {

                InstituteID: vm.InstituteID,
                ClassID: vm.ClassID,
                SectionID: vm.SectionID,
                DepartmentID: vm.DepartmentID,
                MediumID: vm.MediumID,
                //ShiftID: vm.ShiftID,
                Date: vm.xxx
            };
            return syllabusSevice.getDateWiseLessonPlan(params)
                .then(function (data) {
                    vm.SylIDs = [];
                    if (data.length > 0) {
                        vm.homeWorkSetup = data;
                        $scope.addRoutin = true;

                        for (var i = 0; i < data.length; i++) {
                            vm.getUrlMasterByID(data[i].SyllabusID);
                            //var Params = {
                            //    SyllabusID: data[i].SyllabusID

                            //};
                            //return syllabusSevice.getUrlMasterByID(Params)
                            //    .then(function (data) {
                            //        vm.SylIDs=data;

                            //    });
                        }
                    }
                    else {
                        logger.error('No data found !!!');
                    }
                });
        };
        vm.getUrlMasterByID = function (id) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            //$scope.showItem = true;
            var Params = {
                SyllabusID: id

            };
            return syllabusSevice.getUrlMasterByID(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        angular.forEach(data, function (row, index) {
                            vm.SylIDs.push({
                                SyllabusUrlID: row.SyllabusUrlID, SyllabusID: row.SyllabusID, SyllabusUrl: row.SyllabusUrl, FileName: row.FileName
                            });
                        });
                    }
                    //$scope.syllabusUrlList.push({ SyllabusUrlID: 0, SyllabusID: 0, SyllabusUrl: '', FileName: '' });
                });

        };
        vm.DetailArray = [];
        $scope.TopicModel = ''; $scope.TopicIndex = null;
        $scope.loadTopicPopUp = function (dataModel, index) {
            $scope.TopicModel = dataModel;
            $scope.TopicIndex = index;
            vm.Topic = dataModel.Topic;
            vm.TopicDetails = dataModel.TopicDetail;
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            $scope.showItem = true;
            var Params = {
                SyllabusDetailID: dataModel.SyllabusDetailID

            };
            return syllabusSevice.getDateWiseLessonPlanDetail(Params)
                .then(function (data) {
                    $scope.syllabusTopicUrlList = data;
                });
        };


        $scope.OpenFile = function (FileName, FilePath) {
            var myWindow = window.open();
            myWindow.document.write('<html><head><title>' + FileName + '</title></head><body height="100%" width="100%"><iframe src="' + vm.imgHost + FilePath + '" height="100%" width="100%"></iframe></body></html>');
        };

        $scope.changeGrid = function () {
            $scope.syllabusUrlList = [];
            $scope.addRoutin = false;
            //getHomeWork();
        };

        $scope.getStudentDDLforGuardian = function () {
            var params = {
                InstituteID: vm.InstituteID,
                LoggedUserID: vm.LoggedUserID
            };

            classSettingsService.getDashUserInfo(params)
                .then(function (data) {
                    // debugger;
                    vm.UserInfoList = data;
                    vm.UID = data[0].UserID;
                    if (data.length === 1) {
                        //vm.user.selected.UserID;
                        vm.user = {
                            selected: vm.UserInfoList.filter(function (ob, i) {
                                return (ob.UserID === vm.UID);
                            })[0]
                        };
                        $scope.studentInfo(vm.UID);
                        $scope.showDDL = false;
                        $scope.dis = true;

                    }
                    else {
                        $scope.showDDL = true;
                        $scope.dis = false;
                    }
                    //$scope.getStudentPeriod();
                });
        };
        $scope.studentInfo = function (uid) {

            $scope.UserID = /*'11112861'*/uid;
            return userRegistrationService.getCmnUserResistrationByUserID($scope.UserID)
                .then(function (data) {
                    //vm.regedusersShow = '';
                    if (data.length > 0) {
                        vm.regedusers = data;
                        vm.InstituteID = data[0].InstituteID;
                        vm.MediumID = data[0].MediumID;
                        vm.ClassID = data[0].ClassID;
                        vm.DepartmentID = data[0].DepartmentID;
                        vm.ShiftID = data[0].ShiftID;
                        vm.SectionID = data[0].SectionID;
                    }

                });

        };
        activate();
        function activate() {
            var promises = [subjectDDL(), getExameDDL(), getUserTypeWiseInfo()];
            return $q.all(promises).then(function () {
            });
        }

        function subjectDDL() {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            $scope.btnDis = false;
            var subjectParams = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                DepartmentID: $localStorage.userInfo[0].SDepartmentID,
                MediumID: $localStorage.userInfo[0].MediumID,
                ClassID: $localStorage.userInfo[0].ClassID

            };

            return subjectSettingsSevice.getSubjectByParms(subjectParams)
                .then(function (data) {
                    vm.subjects = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].IsActive === 1 || data[i].IsActive === true) {
                            vm.subjects.push(data[i]);
                        }
                    }


                });

        }
        //vm.getExameDDL = function (ID, status) {

        function getExameDDL() {
            //Generate Token API Pass Call
            // authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MediumID: $localStorage.userInfo[0].MediumID,
                ClassID: $localStorage.userInfo[0].ClassID
            };
            return insExameSetting.getAllExamesDDL(Params)
                .then(function (data) {
                    vm.Exames = [];
                    //vm.ExamList = [];
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].IsActive === 1 || data[i].IsActive === true) {
                                vm.Exames.push(data[i]);

                            }

                        }
                    }
                });
        }

        function getUserTypeWiseInfo() {
            if (vm.UserTypeID === 3) {
                $scope.studentInfo($localStorage.userInfo[0].UserID);
                //vm.getHomeWork();
                $scope.addRoutin = false;
                $scope.ddlShow = false;
                $scope.IsRequired = false;
            }
            else if (vm.UserTypeID === 5) {
                $scope.IsRequired = true;
                $scope.getStudentDDLforGuardian();
                $scope.ddlShow = true;
            }
            else {
                console.log('Shibli');
            }

        }



    }
})();
