
(function () {
    'use strict';

    angular
        .module('app.homeWorkEntry')
        .controller('homeWorkEntryController', homeWorkEntryController);

    homeWorkEntryController.$inject = [ 'homeWorkEntry','insExameSetting', 'periodSetup', 'classSettingsService', 'subjectSettingsSevice', 'commonService', 'conversion', 'teacherAttendanceSevice', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage','apiConfig'];
    /* @ngInject */
    function homeWorkEntryController(homeWorkEntry, insExameSetting, periodSetup, classSettingsService, subjectSettingsSevice, commonService, conversion, teacherAttendanceSevice, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage, apiConfig) {

        var vm = this;
        //$scope.disButton = true;
        $scope.imgShowSignature = false;
        $scope.addPassMark = false;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
       
        $scope.showItem = false;
        $scope.createItem = true;
        $scope.lessonPlan = false;
        $scope.listEvent = function () {
           
            $scope.showItem = false;
            $scope.createItem = true;
        };


        $scope.changeGrid = function () {

            $scope.clsPeriod = [];
            $scope.showItem = false;
        };
       
        $scope.clearField = function () {
            
            $state.go($state.current.name, {}, { reload: true });
            
        };

        vm.imgHost = apiConfig.imagehost;
        $scope.syllabusUrlList = [];
        $scope.syllabusUrlList.push({ SyllabusUrlID: 0, SyllabusID: 0, SyllabusUrl: '' });
        //console.log($scope.syllabusUrlList.length)
        $scope.uploadFilesSylUrl = function (file, errFiles) {
       
            $scope.fileList = file;

            if (errFiles.length > 0) {
                logger.error('Max size 1MB required!!!');
                return;
            }

            if ((file !== null && file.$ngfBlobUrl != null) && vm.ImageUrl === undefined) {
                //$scope.Simage = file.$ngfBlobUrl;
                console.log('ok');
            }
            $scope.errFile = errFiles && errFiles[0];

            if ($scope.fileList.length > 0) {
              
                var counts = 0;
                for (var i = 0; i < $scope.fileList.length; i++) {
                  
                    var sfile = $scope.fileList[i];
                    if (sfile) {
                        sfile.upload = Upload.upload({
                            url: apiConfig.imagehost + 'api/onEms/uploads/' + $localStorage.userInfo[0].InstituteName + '/null/null',
                            method: 'POST',
                            data: { file: sfile }
                        });

                        sfile.upload.then(function (response) {
                            $timeout(function () {
                                var data = JSON.parse(response.data);
                                if ($scope.syllabusUrlList.length === 1 && counts === 0) {
                                    $scope.syllabusUrlList[0].SyllabusUrl = data.path;
                                    counts = 1;
                                }
                                else {
                                    $scope.syllabusUrlList.push({ SyllabusUrlID: 0, SyllabusID: 0, SyllabusUrl: '' });
                                    $scope.syllabusUrlList[$scope.syllabusUrlList.length - 1].SyllabusUrl = data.path;
                                }
                            });
                        }, function (response) {
                            if (response.status > 0) {
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }
                        }, function (evt) {
                            sfile.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });

                        $scope.imgShowSignature = true;
                    }
                }
            }

        };

        vm.dateSetup = conversion.NowDateCustom();
        vm.hdateSetup = conversion.NowDateCustom();



        $scope.getHomeWork = function () {
            var a;
            vm.xxx=conversion.getStringToDate(vm.hdateSetup);
            var params = {
              
                InstituteID: vm.institute.selected.InstituteID,
                ClassID: vm.ClassID === undefined ? 0 : vm.ClassID,
                SectionID: vm.SectionID === undefined ? 0 : vm.SectionID,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? 0 : vm.MediumID,
                ShiftID: vm.ShiftID === undefined ? 0 : vm.ShiftID,
                SubjectID: vm.SubjectID === undefined ? 0 : vm.SubjectID,
                HomeWorkDate: vm.xxx
            };
            return homeWorkEntry.getInsHomeWork(params)
                .then(function (data) {
                    
                    if (data.length > 0) {
                        $scope.syllabusUrlList = data;
                        vm.homeWorkSetup = data;
                        vm.Topic = data[0].Topic;
                        vm.TopicDetails = data[0].TopicDetails;
                        vm.a = 0;
                    }
                    else {
                        if (vm.a === 0) {
                            vm.Topic = '';
                            vm.TopicDetails = '';
                            $scope.syllabusUrlList = [];
                            vm.a = 1;
                        }
                        else {
                            $scope.syllabusUrlList = $scope.syllabusUrlList;
                            vm.homeWorkSetup = data;
                            vm.Topic = vm.Topic/*data[0] === undefined ? '' : data[0].Topic*/;
                            vm.TopicDetails = vm.TopicDetails/*data[0] === undefined ? '' : data[0].TopicDetails*/;
                        }
                        
                    }
                    //vm.marks = data;

                    //$scope.marks = data;
                   
                });
        };


        $scope.getHomeWorkByID = function () {
            vm.xx = conversion.getStringToDate(vm.dateSetup);

            var params = {

                InstituteID: vm.institute.selected.InstituteID,
                ClassID: vm.ClassID === undefined ? 0 : vm.ClassID,
                SectionID: vm.SectionID === undefined ? 0 : vm.SectionID,
                DepartmentID: vm.DepartmentID === undefined ? 0 : vm.DepartmentID,
                MediumID: vm.MediumID === undefined ? 0 : vm.MediumID,
                ShiftID: vm.ShiftID === undefined ? null : vm.ShiftID,
                SubjectID: vm.SubjectID === undefined ? 0 : vm.SubjectID,
                Date: vm.xx
            };
            return homeWorkEntry.getHomeWorkByID(params)
                .then(function (data) {
                    $scope.syllabusUrls = data;
                    //vm.marks = data;

                    //$scope.marks = data;
                    $scope.lessonPlan = true;

                });
        };



        vm.PassMarkDetailID = 0;
        vm.PassMarkID = 0;

        vm.postHomeWork = function () {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)) //jshint ignore : line
            //console.log($scope.syllabusUrlList.length)
            if ( (vm.Topic === undefined || vm.Topic === '') && (vm.TopicDetails === undefined || vm.TopicDetails === '')) {
                logger.error('No home work is set to save');
            }
            else {
            //var homeWork = []
            //var homeWork = [].concat.apply([], $scope.subjects);
            vm.hwDate = conversion.getStringToDate(vm.hdateSetup);
            homeWorkEntry.postHomeWork({
                HomeWorkDetailID: vm.homeWorkSetup[0] === undefined ? 0 : vm.homeWorkSetup[0].HomeWorkDetailID,
                HomeWorkID: vm.homeWorkSetup[0] === undefined ? 0 : vm.homeWorkSetup[0].HomeWorkID,
                MediumID: vm.MediumID,
                ClassID: vm.ClassID,
                DepartmentID: vm.DepartmentID === undefined ? null : vm.DepartmentID,
                SectionID: vm.SectionID === undefined ? null : vm.SectionID,
                SubjectID: vm.SubjectID,        //=== undefined ? examMarks[0].SubjectID : vm.SubjectID,           
                ShiftID: vm.ShiftID === undefined ? null : vm.ShiftID,               
                FileURL : 'ABC',
                FileName:  'AbcFile',  //vm.homeWorkSetup.sul.fileName,
                Date: vm.hwDate, 
                Topic: vm.Topic,
                TopicDetails: vm.TopicDetails,
              
                InstituteID: vm.institute.selected.InstituteID,           
                LoggedUserID: $localStorage.userInfo[0].UserID,
                IsDeleted: 0,
                syllabusUrlList: $scope.syllabusUrlList
                //examMarks: examMarks

            })
                .then(function (data) {
                    logger.info('Saved!');
                    $state.go($state.current.name, {}, { reload: true });
                })
                .catch(function (error) { });
            }
        };














        //-------------- Load Option --------------------//

        $scope.ReloadDll = function () {
           
            vm.ShiftID = null;
            vm.shift = undefined;
            vm.shifts = [];
            vm.MediumID = null;
            vm.medium = undefined;
            vm.mediums = [];
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            vm.subject = undefined;
            vm.values = [];
            vm.ExamID = null;
            vm.exam = undefined;
            vm.exames = [];
            
            $scope.showItem = false;
        };

        $scope.ReloadMedium = function (status) {
           
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            vm.ClassID = null;
            vm.class = undefined;
            vm.classes = [];
            vm.SubjectID = null;
            vm.subject = undefined;
            vm.values = [];
        };




        $scope.ReloadClass = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.DepartmentID = null;
            vm.department = undefined;
            vm.departments = [];
            
        };

       
        $scope.ReloadDept = function (status) {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];
            vm.SubjectID = null;
            vm.subject = undefined;          
            vm.values = [];

           
        };

        activate();

        function activate() {
            var promises = [getInstitute('') /*vm.showexams()*/
                
            ];
            return $q.all(promises).then(function () {
            });
        }

        

        $scope.ReloadSec = function () {
            vm.SectionID = null;
            vm.section = undefined;
            vm.sections = [];

           
        };

        vm.ClassSelected = function (ID, Status) {
            if (status === '') {
                vm.SectionID = null;
                vm.section = undefined;
                vm.sections = [];
                $scope.ReloadSec();
            }
            
            var params = {
                instituteId: vm.institute.selected.InstituteID, //$localStorage.userInfo[0].InstituteID,
                classId: vm.ClassID,
                DepartmentID: vm.DepartmentID === null || vm.DepartmentID === undefined ? 0 : vm.DepartmentID
            };
            vm.showSubject(vm.instituteID, params.DepartmentID, vm.MediumID, vm.ClassID);
            commonService.getInstituteSection(params)
                .then(function (data) {
                    if (data.length > 0) {
                        $scope.IsRequiredSec = true;
                        vm.sections = data;
                    }
                    else {
                        $scope.IsRequiredSec = false;
                    }

                });

        };

        $scope.hideList = function () {
            $scope.addPassMark = false;
            //$scope.disButton = true;
        };
        vm.getAllShift = function (InstituteID, status) {
            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteShift(Params)
                .then(function (data) {
                    vm.shifts = data;

                    if (status === 'Edit') {
                        vm.shift = {
                            selected: vm.shifts.filter(function (ob, i) {
                                return (ob.ShiftID === vm.ShiftID);
                            })[0]
                        };
                    }
                });
        };

        vm.instituteID = $localStorage.userInfo[0].InstituteID;
        function getInstitute(status) {
            if (status === '') {
                $scope.ReloadDll();
              
               
            }

            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;

                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.getAllShift(vm.instituteID, status);
                    vm.getmediumNameDdl(vm.instituteID, status);
                    vm.showexams(vm.instituteID);
                   
                   
                });
        }

      

        vm.getmediumNameDdl = function (InstituteID, status) {
            if (status === '') {
                $scope.ReloadMedium(1);
                $scope.ReloadDll(InstituteID);
            }

            var Params = {
                instituteId: InstituteID
            };
            return commonService.getInstituteMediumDdl(Params)
                .then(function (data) {
                    vm.mediums = data;

                    if (status === 'Edit') {
                        vm.medium = {
                            selected: vm.mediums.filter(function (ob, i) {
                                return (ob.MediumID === vm.MediumID);
                            })[0]
                        };
                    }
                });

        };

       


        vm.ClassWiseDepartmentDDL = function (ClassID, status) {
            if (status === '') {
                $scope.ReloadDept(1);
                $scope.ReloadClass(1);
            }

            var Params = {
                InstituteID: vm.instituteID,
                ClassID: ClassID,
                MediumID: vm.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        
                        vm.departments = data;
                        $scope.IsRequired = true;

                        if (status === 'Edit') {
                            vm.department = {
                                selected: vm.departments.filter(function (ob, i) {
                                    return (ob.DepartmentID === vm.DepartmentID);
                                })[0]
                            };
                        }
                    }
                    else {
                        $scope.IsRequired = false;
                        vm.showSubject(vm.instituteID, 0, vm.MediumID, vm.ClassID);
                        if (status === '') {
                            vm.DepartmentID = null;
                            vm.ClassSelected(0, '');
                        }
                        else if (status === 'Edit') {
                            vm.ClassSelected(vm.SectionID, status);
                        }
                    }
                });

        };


        vm.MediumWiseClassDDL = function (MediumID, status) {
            if (status === '') {
                $scope.ReloadClass(1);
            }

            if (vm.MediumID !== null) {
                var Params = {
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: MediumID
                };
                return subjectSettingsSevice.getMediumWiseClassDDL(Params)
                    .then(function (data) {
                        vm.classes = data;

                        if (status === 'Edit') {
                            vm.class = {
                                selected: vm.classes.filter(function (ob, i) {
                                    return (ob.ClassID === vm.ClassID);
                                })[0]
                            };
                        }

                    });
            }
            else {
                logger.error('Select Medium first');
            }
        };



        vm.showexams = function (a) {
            $scope.ReloadDll(a);
            var Params = {
                insID: a
            };
            

            return insExameSetting.getAllExamesDDL(Params)

                    .then(function (data) {
                        vm.exames = data;
                       
                    });
           
        };
        vm.showSubject = function (a,b,c,d) {


            //Generate Token API Pass Call
            //authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line



            $scope.showItem = true;
            var subjectParams = {
                InstituteID: a,
                DepartmentID: b === undefined ? null : b,
                MediumID: c === undefined ? null : c,
                ClassID: d

            };
            return commonService.GetClassWiseSubject(subjectParams)
                .then(function (data) {
                    vm.subjects = data;
                    $scope.subjects = data;

                    vm.values = data;
                    //if ($scope.subjects !== undefined) {
                    //    for (var i = 0; i < $scope.subjects.length; i++) {

                    //        if ($scope.subjects[i].IsActive === 1) {
                    //            vm.values.push($scope.subjects[i]);
                               
                    //        }

                    //    }
                    //}
                });
        };

        
    }
})();

