(function () {
    'use strict';

    angular
        .module('app.mySyllabus')
        .controller('MySyllabusController', MySyllabusController);

    MySyllabusController.$inject = ['syllabusSevice', 'classSettingsService', 'subjectSettingsSevice', 'exameRoutineEntry', 'insExameSetting', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage', 'apiConfig'];
    /* @ngInject */
    function MySyllabusController(syllabusSevice, classSettingsService, subjectSettingsSevice, exameRoutineEntry, insExameSetting, commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {



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
        $scope.imgShowSignature = false;


        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.addRoutin = true;
        $scope.addExameRoutin = false;
        $scope.addpassmarks = false;
        $scope.editRoutint = false;
        $scope.createmarks = false;
        $scope.itemEvent = function () {
            $scope.showItem = true;
            $scope.createItem = true;
            $scope.addRoutin = true;

        };


        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };


        $scope.create = function () {
            $scope.createItem = true;
            $scope.addRoutin = true;
            $scope.addExameRoutin = false;
            $scope.createmarks = false;
            $scope.addpassmarks = false;
        };

        $scope.data = [];
        $scope.subjectArr = [];


        $scope.total = 0;
        $scope.saveBtn = true;
        $scope.addRoutin = false;

        vm.imgHost = apiConfig.imagehost; 

        vm.PassMarkDetailID = 0;
        vm.PassMarkID = 0;

       
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

       
        $scope.changexm = function () {
            $scope.addRoutin = false;
        };

        vm.getAcademicClassDayForMySyllabus = function () {
            $scope.showItem1 = false;
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            //$scope.addExameRoutin = true;
            $scope.createItem = true;

            var Params = {
                InstituteID : $localStorage.userInfo[0].InstituteID,
                MediumID : $localStorage.userInfo[0].MediumID,
                ClassID : $localStorage.userInfo[0].ClassID,
                DepartmentID: $localStorage.userInfo[0].SDepartmentID,
                SectionID: $localStorage.userInfo[0].SectionID === 0  ? null : $localStorage.userInfo[0].SectionID,
                SubjectID : vm.SubjectID === undefined ? null : vm.SubjectID,
                ExamID : vm.ExamID === undefined ? null : vm.ExamID,
                FromDate : vm.formDateSetup,
                ToDate : vm.toDateSetup

            };
            return syllabusSevice.getAcademicClassDayForMySyllabus(Params)
                .then(function (data) {
                        $scope.addRoutin = true;
                        vm.classDays = data;
                        vm.getUrlMasterByID(data[0].SyllabusID);

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
                SyllabusID: dataModel.SyllabusID,
                SyllabusDetailID: dataModel.SyllabusDetailID

            };
            return syllabusSevice.getUrlTopicDetailByID(Params)
                .then(function (data) {
                    $scope.syllabusTopicUrlList = data;
                    //$scope.syllabusTopicUrlList.push({ SyllabusTopicUrlDetailID: 0, SyllabusDetailID: 0, ContentUrl: '', FileName: '' });
                });
        };
        

        vm.getUrlMasterByID = function (id) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            $scope.showItem = true;
            var Params = {
                SyllabusID: id

            };
            return syllabusSevice.getUrlMasterByID(Params)
                .then(function (data) {
                    $scope.syllabusUrlList = data;
                    
                });

        };

        $scope.OpenFile = function (FileName, FilePath) {
            var myWindow = window.open();
            myWindow.document.write('<html><head><title>' + FileName + '</title></head><body height="100%" width="100%"><iframe src="' + vm.imgHost + FilePath + '" height="100%" width="100%"></iframe></body></html>');
        };

        $scope.changeGrid = function () {
            $scope.syllabusUrlList = [];
            $scope.addRoutin = false;
        };

        activate();
        function activate() {
            var promises = [subjectDDL(), getExameDDL()];
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

        function getExameDDL () {
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



    }
})();
