(function () {
    'use strict';

    angular
        .module('app.insExamMark')
        .controller('insExamMarkController', insExamMarkController);

        insExamMarkController.$inject = ['dailySubWiseAtdSettingsService','subjectSettingsSevice', 'exameRoutineEntry', 'insExameSetting', 'commonService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function insExamMarkController(dailySubWiseAtdSettingsService , subjectSettingsSevice, exameRoutineEntry, insExameSetting, commonService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



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
        $scope.studentsArr=[];
        $scope.openSubjectIndex = function (index) {
            $scope.subjectsindex = index;
            $scope.studentsArr[$scope.subjectsindex].id = $scope.subjectsindex;
        };
        $scope.openSubjectIndexs = function (index) {
            $scope.subjectsindex = index;
            $scope.data[$scope.subjectsindex].id = $scope.subjectsindex;
        };

        vm.ExamMarkID=0;

        vm.showInsExamePassMark = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            $scope.data = [];
            $scope.addExameRoutin = true;
            $scope.createItem = false;
            $scope.addRoutin = false;
            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID

            };
            return insExameSetting.getExamPassMarks(Params)
                .then(function (data) {
                    vm.passmarks = data;
                });

        };

        var isRowSelected = true;
        $scope.permanetToggleSelection = function (index) {
            isRowSelected = !isRowSelected;
        };

        vm.CalculateColumns = function (model) {
            var MCQ = model.MCQ === null || model.MCQ === undefined ? 0 : model.MCQ;
            var Written = model.Written === null || model.Written === undefined ? 0 : model.Written;
            var Practicle = model.Precticle === null || model.Precticle === undefined ? 0 : model.Precticle;
            var Attendance = model.Attendance === null || model.Attendance === undefined ? 0 : model.Attendance;
            model.Total = MCQ + Written + Practicle + Attendance;
        };
        $scope.total = 0;


        vm.showStudent = function (index) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            $scope.index = index;
            $scope.showItem = true;
            var Params = {
                insID: $localStorage.userInfo[0].InstituteID,
                deptID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                midID: vm.MediumID === undefined ? 0 : vm.MediumID,
                shiftID:vm.ShiftID === undefined ? 0 : vm.ShiftID,
                sectionID:vm.SectionID === undefined ? 0 :vm.SectionID,
                subjectID:vm.SubjectID,
                classID: vm.ClassID

            };
            return dailySubWiseAtdSettingsService.getHrmSubWiseAtdDetail(Params)
                .then(function (data) {
                    vm.students = data;
                    $scope.students = data;
                    $scope.studentsArr = [];

                    if ($scope.students !== undefined) {
                        for (var i = 0; i < $scope.students.length; i++) {

                            var value = $scope.students[i];
                            var newrow = [];


                            newrow =
                                {
                                    'ExamMarkID': vm.ExamMarkID,
                                    'ExamID': vm.ExamID,
                                    'ClassID': value.ClassID,
                                    'SectionID':value.SectionID,
                                    'DepartmentID': value.DepartmentID,
                                    'ShiftID': value.ShiftID,
                                    'MediumID': value.MediumID,
                                    'SubjectID': value.SubjectID,
                                    'SubjectName': value.SubjectName,
                                    'StudentID': value.UserID,
                                    'UserFullName' : value.UserFullName,
                                    'RollNo' : value.RollNo,
                                    'Session' : value.Session,
                                    'InstituteID': $localStorage.userInfo[0].InstituteID,
                                    'MCQ': 0,
                                    'Written': 0,
                                    'Precticle': 0,
                                    'Attendance': 0,
                                    'Total': 0,
                                    'IsActive': false,
                                };
                            $scope.studentsArr.push(newrow);

                        }
                    }
                });
        };

       

        vm.postExameMark = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            var examMark = [].concat.apply([], $scope.studentsArr);
            insExameSetting.postexammarks({
                ExamMarkID:vm.ExamMarkID,
                ExamID: vm.ExamID,
                ClassID: vm.ClassID,
                SectionID:vm.SectionID,
                DepartmentID: vm.DepartmentID,
                ShiftID:vm.ShiftID,
                MediumID: vm.MediumID,
              //  SubjectID:parseInt (examMark[0].SubjectID),
                MCQ: examMark[0].MCQ,
                Written: examMark[0].Written,
                Precticle: examMark[0].Precticle,
                Attendance: examMark[0].Attendance,
                Total: examMark[0].Total,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                IsActive: examMark[0].IsActive,
                CreateBy: 0,
                CreateOn: '2017-12-12',
                CreatePc: 'Apple',
                UpdateBy: null,
                UpdateOn: '2017-12-12',
                UpdatePc: 'Apple',
                IsDeleted: 0,
                DeleteBy: null,
                DeleteOn: '2017-12-12',
                DeletePc: 'Apple',
                examMark: examMark,

            })
                .then(function (data) {
                    logger.info('Saved!');
                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
        };


        vm.postEditExameMark = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            var examMark = [].concat.apply([], $scope.data);
            insExameSetting.postexammarks({
                ExamMarkID:examMark[0].ExamMarkID,
                ExamID: vm.ExamID,
                ClassID: vm.ClassID,
                SectionID:vm.SectionID,
                DepartmentID: vm.DepartmentID,
                ShiftID:vm.ShiftID,
                MediumID: vm.MediumID,
                SubjectID: examMark[0].SubjectID,
                MCQ: examMark[0].MCQ,
                Written: examMark[0].Written,
                Precticle: examMark[0].Precticle,
                Attendance: examMark[0].Attendance,
                Total: examMark[0].Total,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                IsActive: examMark[0].IsActive,
                CreateBy: 0,
                CreateOn: '2017-12-12',
                CreatePc: 'Apple',
                UpdateBy: null,
                UpdateOn: '2017-12-12',
                UpdatePc: 'Apple',
                IsDeleted: 0,
                DeleteBy: null,
                DeleteOn: '2017-12-12',
                DeletePc: 'Apple',
                examMark: examMark,

            })
                .then(function (data) {
                    logger.info('Saved!');
                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
        };



        vm.editExamMark = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            $scope.data = [];
            $scope.createItem = false;
            $scope.addExameRoutin = false;
            $scope.addpassmarks = true;
            $scope.createmarks = true;
            $scope.addRoutin=false;
            var Params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                ExamID:vm.ExamID,
                ClassID:vm.ClassID,
                SectionID:vm.SectionID=== undefined ?0 : vm.SectionID,
                DepartmentID:vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                ShiftID:vm.ShiftID=== undefined ? 0 : vm.ShiftID,
                MeduimID:vm.MeduimID=== undefined ? 0: vm.MeduimID,
                SubjectID:vm.SubjectID
            };

            insExameSetting.getInsExamemarkAll(Params)
                .then(function (data) {
                    if (data.length > 0) {

                        vm.dept = { selected: vm.department.filter(function (ob, i) { return (ob.DepartmentID === data[0].DepartmentID); })[0] };
                        vm.med = { selected: vm.medium.filter(function (ob, i) { return (ob.MediumID === data[0].MediumID); })[0] };
                        vm.cls = { selected: vm.class.filter(function (ob, i) { return (ob.ClassID === data[0].ClassID); })[0] };
                        vm.subject = { selected: vm.subjects .filter(function (ob, i) { return (ob.SubjectName === data[0].SubjectName); })[0] };
                        vm.sec = { selected: vm.sections.filter(function (ob, i) { return (ob.SectionID === data[0].SectionID); })[0] };
                        vm.shift = { selected: vm.Shifts.filter(function (ob, i) { return (ob.ShiftID === data[0].ShiftID); })[0] };
                        vm.Exame = { selected: vm.Exames.filter(function (ob, i) { return (ob.ExamID === data[0].ExamID); })[0] };
                      //  vm.Exame = { selected: vm.Exames.filter(function (ob, i) { return (ob.ExamID === data[0].ExamID); })[0] };
                        vm.ExamMarkID = parseInt(data[0].ExamMarkID);

                        for (var i = 0; i < data.length; i++) {

                            var newrow = [];

                            newrow =
                                {
                                    'ExamMarkID': data[i].ExamMarkID,
                                    'ExamID': data[i].ExamID,
                                    'ClassID': data[i].ClassID,
                                    'SectionID':data[i].SectionID,
                                    'DepartmentID': data[i].DepartmentID,
                                    'ShiftID': data[i].ShiftID,
                                    'MeduimID': data[i].MeduimID,
                                    'SubjectID': data[i].SubjectID,
                                    'SubjectName': data[i].SubjectName,
                                    'StudentID': data[i].StudentID,
                                    'UserFullName' : data[i].UserFullName,
                                    'RollNo' : data[i].RollNo,
                                    'Session' : data[i].Session,
                                    'InstituteID': $localStorage.userInfo[0].InstituteID,
                                    'MCQ': data[i].MCQ,
                                    'Written':  data[i].Written,
                                    'Precticle': data[i].Precticle,
                                    'Attendance':data[i].Attendance,
                                    'Total': data[i].Total,
                                    'IsActive': data[i].IsActive
                                };
                            $scope.data.push(newrow);
                        } 
                    }   
                })
                .catch(function (error) { });
        };



        activate();
        function activate() {
            var promises = [getDept(), getMedium(), getClass(), getExame(), getAllInsSub(),getShift()];
            return $q.all(promises).then(function () {
            });
        }


        function getDept() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteDepertment(Params)
                .then(function (data) {
                    vm.department = data;
                    vm.departments = data;
                });
        }


        function getClass() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteClass(Params)
                .then(function (data) {
                    vm.class = data;
                    vm.classs = data;
                });
        }


        function getAllInsSub() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getSub(Params)
                .then(function (data) {
                    vm.subjects = data;
                });
        }

        function getMedium() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteMedium(Params)
                .then(function (data) {
                    vm.medium = data;
                    vm.mediums = data;
                });
        }

        function getExame() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                insID: $localStorage.userInfo[0].InstituteID
            };
            return insExameSetting.getAllExames(Params)
                .then(function (data) {
                    vm.Exames = data;
                    vm.Examss = data;
                });
        }

        vm.ClassSelected = function (classID) {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            var params = {
                instituteId: $localStorage.userInfo[0].InstituteID,
                classID: classID
            };

            commonService.getInstituteSection(params)
                .then(function (data) {
                    vm.sections = data;

                });
        };


        function getShift() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.Shift = data;
                   vm.Shifts = data;
                });
        }



    }
})();
