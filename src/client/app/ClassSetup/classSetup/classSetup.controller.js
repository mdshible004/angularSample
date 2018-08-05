(function () {
    'use strict';

    angular
        .module('app.classSetup')
        .controller('ClassSetupController', ClassSetupController);

    ClassSetupController.$inject = ['classSettingsService', 'commonService', 'subjectSettingsSevice', 'filterurl', '$filter', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', '$localStorage', 'uiGridConstants'];
    /* @ngInject */
    function ClassSetupController(classSettingsService, commonService, subjectSettingsSevice, filterurl, $filter, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, $localStorage, uiGridConstants) {

        var vm = this;//jshint ignore : line

        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration


        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.LoggedUserID = parseInt($localStorage.userInfo[0].UserID);
        // Create and Show list Container Hide or Show Logic
        $scope.showItem = false;
        $scope.showSection = false;
        $scope.createItem = true;


        $scope.itemEvent = function () {
            //$scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.showItem = true;
            $scope.createItem = false;
            $scope.showSection = false;

        };
        $scope.listEvent = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.showItem = false;
            $scope.createItem = true;
        };
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.deptWiseSect = [];

        //$scope.teacherArr;
        //$scope.Classindex;
        $scope.openClassIndex = function (index) {
            $scope.Classindex = index;
            $scope.teacherArr[$scope.Classindex].Cid = $scope.Classindex;
        };

        $scope.switch = function (e) {
            if (e === 1) {
                $scope.teacherArr[$scope.Classindex].IsActive = 0;
            } else {
                $scope.teacherArr[$scope.Classindex].IsActive = 1;
            }
        };

        $scope.hideClassList = function () {
            $scope.teacherArr = [];
            $scope.SectionArrayToSave = [];
            $scope.section = [];
            $scope.showItem = false;
        };

        vm.showClass = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            //  $scope.createItem = false;
            if (vm.instituteID === undefined) {
                logger.error('Please select Institute');
            } else {
                $scope.teacherArr = [];
                $scope.SectionArrayToSave = [];
                getUsersByUserTypeID();
                var Params = {
                    insID: vm.institute.selected.InstituteID,
                    mediumID: vm.MediumID
                };
                classSettingsService.getClassByInsID(Params)
                    .then(function (data) {
                        if (data !== null) {
                            $scope.classByInsID = data;
                            $scope.showItem = true;
                            if ($scope.classByInsID !== undefined) {
                                for (var i = 0; i < $scope.classByInsID.length; i++) {
                                    var value = $scope.classByInsID[i];
                                    var newrow = [];
                                    newrow =
                                        {
                                            'ClassID': value.ClassID,
                                            'InsCategoryID': value.InsCategoryID,
                                            'ClassName': value.ClassName,
                                            'InsClassID': value.InsClassID,
                                            'InstituteID': value.InstituteID,
                                            'MediumID': value.MediumID,
                                            'TotalSeat': value.TotalSeat,
                                            'ClassTeacherID': value.ClassTeacherID,
                                            'IsActive': value.IsActive,
                                            'ClassTeacher': value.ClassTeacher,
                                            'TeacherSelected': { ClassTeacher: value.ClassTeacher, ClassTeacherID: value.ClassTeacherID },
                                            'IsSelected': value.ClassTeacherID === 0 || value.ClassTeacherID === null || value.ClassTeacherID === undefined ? true : false
                                        };
                                    $scope.teacherArr.push(newrow);

                                    if ($scope.classByInsID[i].SectionArray !== undefined) {
                                        angular.forEach($scope.classByInsID[i].SectionArray, function (sec) {//jshint ignore : line
                                            $scope.SectionArrayToSave.push({
                                                ClassID: value.ClassID,
                                                CustomName: sec.CustomName,
                                                InsClassID: sec.InsClassID,
                                                InsSectionID: sec.InsSectionID,
                                                InstituteID: value.InstituteID,
                                                IsActive: sec.IsActive === true ? 1 : 0,
                                                SectionID: sec.SectionID,
                                                SectionName: sec.SectionName,
                                                Sid: i,
                                                Sln: i,
                                                TotalSeat: sec.TotalSeat,
                                                TeacherSelected: { ClassTeacher: sec.ClassTeacher, ClassTeacherID: sec.ClassTeacherID },
                                                ClassTeacherID: sec.ClassTeacherID,
                                                DepartmentID: sec.DepartmentID,
                                                DepartmentName: sec.DepartmentName
                                            });
                                        });

                                    }
                                }
                            }
                        }
                    });
            }
        };
        //$scope.section;
        //$scope.Sectionindex;
        $scope.openSectionIndex = function (index) {
            $scope.Sectionindex = index;
            $scope.section[$scope.Sectionindex].Sid = $scope.Sectionindex;
        };
        $scope.switcht = function (e) {

            ////debugger;
            if (e === 1) {
                $scope.section[$scope.Sectionindex].IsActive = 0;

                $scope.section[$scope.Sectionindex].ClassTeacherID = null;
                $scope.section[$scope.Sectionindex].TeacherSelected = undefined;
                $scope.section[$scope.Sectionindex].TotalSeat = 0;
                $scope.section[$scope.Sectionindex].DepartmentID = 0;

            } else {
                $scope.section[$scope.Sectionindex].IsActive = 1;
                $scope.section[$scope.Sectionindex].ClassTeacherID = $scope.classModel.ClassTeacherID;
                $scope.section[$scope.Sectionindex].TeacherSelected = $scope.classModel.TeacherSelected;
                $scope.section[$scope.Sectionindex].DepartmentID = vm.DepartmentID !== null && vm.DepartmentID !== undefined ? vm.DepartmentID : 0;
            }


        };

        $scope.changeTableMode = function () {
            $scope.section = [];
        };

        //$scope.index;
        $scope.teachIndex = null;
        $scope.SectionArrayToSave = [];
        $scope.checkExistModel = [];
        $scope.classModel = '';
        vm.getSection = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            $scope.section = [];
            if (vm.DepartmentID === null || vm.DepartmentID === undefined) {

                $scope.checkExistModel = $scope.SectionArrayToSave.length > 0 ? $scope.SectionArrayToSave.filter(function (ob, i) { return (ob.Sln === $scope.teachIndex && ob.DepartmentID === 0); }) : [];

                if ($scope.checkExistModel !== undefined && $scope.checkExistModel.length > 0) {
                    $scope.section = $scope.checkExistModel.sort(function (a, b) {
                        return a.SectionID - b.SectionID;
                    });
                }
                else {
                    var Params = {
                        insID: vm.institute.selected.InstituteID,
                        clID: $scope.classByInsID[$scope.teachIndex].InsClassID,
                        deptID: 0
                    };

                    classSettingsService.getSectionByID(Params)

                        .then(function (data) {
                            // //debugger;
                            $scope.techArr = $scope.teacherArr[$scope.teachIndex];
                            $scope.section = data;
                            angular.forEach($scope.section, function (sec) {
                                sec.Sln = $scope.teachIndex;
                                sec.ClassID = $scope.classModel.ClassID;
                            });
                        });
                }
            }
            else {
                $scope.checkExistModelActiveDept = [];
                $scope.FullArray = [];
                $scope.FullArray = $scope.SectionArrayToSave.length > 0 ? $scope.SectionArrayToSave.filter(function (ob, i) { return (ob.Sln === $scope.teachIndex); }) : [];

                //$scope.checkExistModelActiveDept = $scope.FullArray.length > 0 ? $scope.FullArray.filter(function (ob, i) { return (ob.DepartmentID === vm.DepartmentID); }) : [];

                //if ($scope.checkExistModelActiveDept.length > 0) {
                //    $scope.checkExistModel = $scope.SectionArrayToSave.length > 0 ? $scope.SectionArrayToSave.filter(function (ob, i) { return (ob.Sln === $scope.teachIndex && (ob.DepartmentID === vm.DepartmentID || ob.IsActive === 0)); }) : [];
                //}
                //else {
                //    $scope.checkExistModel = [];
                //}

                //if ($scope.checkExistModel !== undefined && $scope.checkExistModel.length > 0) {
                //    $scope.section = $scope.checkExistModel.sort(function (a, b) {
                //        return a.SectionID - b.SectionID;
                //    });
                //}
                //else {
                var Params = {                                      //jshint ignore : line
                    insID: vm.institute.selected.InstituteID,
                    clID: $scope.classByInsID[$scope.teachIndex].ClassID,
                    deptID: vm.DepartmentID
                };

                classSettingsService.getSectionByID(Params)

                    .then(function (data) {
                        // //debugger;
                        $scope.techArr = $scope.teacherArr[$scope.teachIndex];
                        $scope.section = data;
                        angular.forEach($scope.section, function (sec) {
                            sec.Sln = $scope.teachIndex;
                            sec.ClassID = $scope.classModel.ClassID;
                            sec.ClassTeacherID = parseInt(sec.ClassTeacherID);
                            sec.InsSectionID = parseInt(sec.InsSectionID);

                            angular.forEach($scope.FullArray, function (FA) {
                                if (FA.ClassID === sec.ClassID && FA.InsClassID === sec.InsClassID && FA.InsSectionID === sec.InsSectionID && FA.SectionID === sec.SectionID && FA.DepartmentID === vm.DepartmentID) {
                                    ////debugger;
                                    sec.ClassID = FA.ClassID;
                                    sec.CustomName = FA.CustomName;
                                    sec.InsClassID = FA.InsClassID;
                                    sec.InsSectionID = FA.InsSectionID;
                                    sec.InstituteID = FA.InstituteID;
                                    sec.IsActive = FA.IsActive;
                                    sec.SectionID = FA.SectionID;
                                    sec.SectionName = FA.SectionName;
                                    sec.Sid = FA.Sid;
                                    sec.Sln = FA.Sln;
                                    sec.TotalSeat = FA.TotalSeat;
                                    sec.ClassTeacherID = FA.ClassTeacherID;
                                    sec.TeacherSelected = FA.TeacherSelected;
                                    sec.DepartmentID = FA.DepartmentID;
                                }
                            });
                        });
                    });
                //}
            }

            $scope.showItem = true;
            $scope.showSection = true;
        };

        $scope.PushSection = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            ////debugger;
            if (vm.DepartmentID === null || vm.DepartmentID === undefined) {

                $scope.checkExistModel = $scope.SectionArrayToSave.filter(function (ob, i) { return (ob.Sln === $scope.teachIndex); });

                if ($scope.checkExistModel !== undefined && $scope.checkExistModel.length > 0) {
                    angular.forEach($scope.checkExistModel, function (SATS) {
                        angular.forEach($scope.section, function (sec) {
                            if (SATS.ClassID === sec.ClassID && SATS.InsClassID === sec.InsClassID && SATS.InsSectionID === sec.InsSectionID && SATS.SectionID === sec.SectionID && SATS.DepartmentID === sec.DepartmentID) {
                                SATS.TotalSeat = sec.TotalSeat;
                                SATS.CustomName = sec.CustomName;
                                SATS.IsActive = sec.IsActive;
                                SATS.ClassTeacherID = sec.ClassTeacherID;
                                SATS.TeacherSelected = sec.TeacherSelected;
                                SATS.DepartmentID = sec.DepartmentID;
                            }
                        });


                    });
                }
                else {
                    angular.forEach($scope.section, function (sec) {
                        $scope.SectionArrayToSave.push({
                            ClassID: sec.ClassID,
                            CustomName: sec.CustomName,
                            InsClassID: sec.InsClassID,
                            InsSectionID: sec.InsSectionID,
                            InstituteID: sec.InstituteID,
                            IsActive: sec.IsActive,
                            SectionID: sec.SectionID,
                            SectionName: sec.SectionName,
                            Sid: sec.Sid,
                            Sln: sec.Sln,
                            TotalSeat: sec.TotalSeat,
                            ClassTeacherID: sec.ClassTeacherID,
                            TeacherSelected: sec.TeacherSelected,
                            DepartmentID: sec.DepartmentID
                        });
                    });
                }
            }
            else {
                $scope.checkExistModel = $scope.SectionArrayToSave.filter(function (ob, i) { return (ob.Sln === $scope.teachIndex); });

                $scope.checkExistModelActiveDept = $scope.checkExistModel.length > 0 ? $scope.checkExistModel.filter(function (ob, i) { return (ob.DepartmentID === vm.DepartmentID); }) : [];

                if ($scope.checkExistModelActiveDept !== undefined && $scope.checkExistModelActiveDept.length > 0) {
                    angular.forEach($scope.checkExistModelActiveDept, function (SATS) {
                        angular.forEach($scope.section, function (sec) {
                            if (SATS.ClassID === sec.ClassID && SATS.InsClassID === sec.InsClassID && SATS.InsSectionID === sec.InsSectionID && SATS.SectionID === sec.SectionID && SATS.DepartmentID === sec.DepartmentID) {
                                SATS.TotalSeat = sec.TotalSeat;
                                SATS.CustomName = sec.CustomName;
                                SATS.IsActive = sec.IsActive;
                                SATS.ClassTeacherID = sec.ClassTeacherID;
                                SATS.TeacherSelected = sec.TeacherSelected;
                                SATS.DepartmentID = sec.DepartmentID;
                            }
                            else {
                                var IfExist = $scope.SectionArrayToSave.filter(function (ob, i) { return (ob.ClassID === sec.ClassID && ob.InsClassID === sec.InsClassID && ob.InsSectionID === sec.InsSectionID && ob.SectionID === sec.SectionID && ob.DepartmentID === sec.DepartmentID) }); //jshint ignore : line
                                if (IfExist === undefined || IfExist.length === 0) {
                                    $scope.SectionArrayToSave.push({
                                        ClassID: sec.ClassID,
                                        CustomName: sec.CustomName,
                                        InsClassID: sec.InsClassID,
                                        InsSectionID: sec.InsSectionID,
                                        InstituteID: sec.InstituteID,
                                        IsActive: sec.IsActive,
                                        SectionID: sec.SectionID,
                                        SectionName: sec.SectionName,
                                        Sid: sec.Sid,
                                        Sln: sec.Sln,
                                        TotalSeat: sec.TotalSeat,
                                        ClassTeacherID: sec.ClassTeacherID,
                                        TeacherSelected: sec.TeacherSelected,
                                        DepartmentID: sec.DepartmentID
                                    });
                                }
                            }
                        });

                    });
                }
                else {

                    $scope.checkExistModelActiveDept = $scope.section.filter(function (ob, i) { return (ob.DepartmentID === vm.DepartmentID); });

                    angular.forEach($scope.checkExistModelActiveDept, function (sec) {
                        $scope.SectionArrayToSave.push({
                            ClassID: sec.ClassID,
                            CustomName: sec.CustomName,
                            InsClassID: sec.InsClassID,
                            InsSectionID: sec.InsSectionID,
                            InstituteID: sec.InstituteID,
                            IsActive: sec.IsActive,
                            SectionID: sec.SectionID,
                            SectionName: sec.SectionName,
                            Sid: sec.Sid,
                            Sln: sec.Sln,
                            TotalSeat: sec.TotalSeat,
                            ClassTeacherID: sec.ClassTeacherID,
                            TeacherSelected: sec.TeacherSelected,
                            DepartmentID: sec.DepartmentID
                        });
                    });
                }
            }
            $scope.setClassTotalSeat();
        };

        $scope.setClassTotalSeat = function () {
            var ttlSeat = 0;
            angular.forEach($scope.SectionArrayToSave, function (sec) {
                if (sec.Sln === $scope.teachIndex) {
                    ttlSeat += sec.TotalSeat === null ? 0 : sec.TotalSeat; //jshint ignore : line
                }
            });
            $scope.classModel.TotalSeat = ttlSeat;
            $scope.section = [];
        };

        $scope.deptWiseSect = [];
        $scope.DeptWiseSectList = function () {
            //debugger;            
            if (vm.departments.length > 0) {
                var tempDwsl = $scope.SectionArrayToSave.filter(function (ob, i) { return (ob.DepartmentID > 0 && ob.Sln === $scope.teachIndex && ob.IsActive === 1) });//jshint ignore : line
                var holdDwsl = tempDwsl;
                if (tempDwsl.length > 0) {
                    angular.forEach(tempDwsl, function (row) {
                        if ($scope.deptWiseSect.length > 0) {
                            var checkDept = $scope.deptWiseSect.filter(function (ob, i) { return (ob.DepartmentID === row.DepartmentID); })[0];
                            if (checkDept === undefined) {
                                $scope.deptWiseSect.push({
                                    DepartmentID: row.DepartmentID,
                                    DepartmentName: vm.departments.filter(function (ob, i) { return (ob.DepartmentID === row.DepartmentID); })[0].DepartmentName,
                                    SectionID: 0,
                                    SectionName: ''
                                });
                            }
                        }
                        else {
                            $scope.deptWiseSect.push({
                                DepartmentID: row.DepartmentID,
                                DepartmentName: vm.departments.filter(function (ob, i) { return (ob.DepartmentID === row.DepartmentID); })[0].DepartmentName,
                                SectionID: 0,
                                SectionName: ''
                            });
                        }
                    });

                    angular.forEach($scope.deptWiseSect, function (row) {
                        var tempsectList = holdDwsl.filter(function (ob, i) { return (ob.DepartmentID === row.DepartmentID); });
                        if (tempsectList.length > 0) {
                            angular.forEach(tempsectList, function (sec) {
                                row.SectionName += ', ' + sec.SectionName;
                            });
                            if (row.SectionName.substring(0, 2) === ', ') {
                                row.SectionName = row.SectionName.substring(1);
                            }
                        }
                    });

                    $scope.deptWiseSect.sort(function (a, b) {
                        return a.DepartmentID - b.DepartmentID;
                    });
                }
            }
        };

        $scope.ClassWiseDepartmentDDL = function (model, index) {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            $scope.deptWiseSect = [];
            $scope.classModel = model;
            $scope.teachIndex = index;
            $scope.section = [];
            vm.departments = [];
            vm.department = undefined;
            vm.DepartmentID = null;
            var Params = {
                InstituteID: vm.instituteID,
                ClassID: model.ClassID,
                MediumID: vm.MediumID
            };
            return subjectSettingsSevice.getClassWiseDepartmentDDL(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.departments = data;
                        $scope.IsRequired = true;
                        //debugger;
                        $scope.DeptWiseSectList();
                    }
                    else {
                        $scope.IsRequired = false;
                    }

                });

        };

        $scope.sectionArray = [];
        vm.Save = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line


            $scope.sectionArray = [];
            if ($scope.SectionArrayToSave.length > 0 && $scope.teacherArr.length > 0) {
                var sectAr = [];
                $scope.sectionArray = $scope.SectionArrayToSave.filter(function (ob, i) { return (ob.IsActive === 1 && parseInt(ob.InsSectionID) === 0) }); //jshint ignore : line
                sectAr = $scope.SectionArrayToSave.filter(function (ob, i) { return (parseInt(ob.InsSectionID) > 0) }); //jshint ignore : line
                if (sectAr.length > 0) {
                    angular.forEach(sectAr, function (sec) {
                        $scope.sectionArray.push({
                            ClassID: sec.ClassID,
                            CustomName: sec.CustomName,
                            InsClassID: sec.InsClassID,
                            InsSectionID: sec.InsSectionID,
                            InstituteID: sec.InstituteID,
                            IsActive: sec.IsActive,
                            SectionID: sec.SectionID,
                            SectionName: sec.SectionName,
                            Sid: sec.Sid,
                            Sln: sec.Sln,
                            TotalSeat: sec.TotalSeat,
                            ClassTeacherID: sec.ClassTeacherID,
                            DepartmentID: sec.DepartmentID,
                        });
                    });
                    //$scope.sectionArray.push(sectAr);
                }

                vm.SecArray = $scope.sectionArray;
                vm.ClsArray = $scope.teacherArr;
                classSettingsService.postClass(vm)
                    .then(function (data) {
                        ////debugger;
                        logger.info('Saved Successfully!!!!');
                        $state.go($state.current.name, {}, { reload: true });
                    })
                    .catch(function (error) { });
            } else {
                logger.info('Please Select Your Institute and Section');
            }
        };






        activate();

        function activate() {
            var promises = [getInstitute()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }


        function getInstitute() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return classSettingsService.getInstitute()
                .then(function (data) {
                    vm.institutes = data;

                    vm.instituteID = $localStorage.userInfo[0].InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.instituteID); })[0] };
                    vm.instituteSelected(vm.instituteID);
                });
        }

        function getUsersByUserTypeID() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var Params = {
                insID: vm.institute.selected.InstituteID,
                uId: 4
            };
            classSettingsService.getUserbyTypeId(Params)

                .then(function (data) {

                    $scope.users = data;

                });
        }

        vm.instituteSelected = function (InstituteID) {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            InstituteID = InstituteID;
            vm.medium = [];
            vm.med = undefined;

            var params = {
                instituteId: InstituteID
            };

            commonService.getInstituteMediumDdl(params)
                .then(function (data) {
                    vm.medium = data;
                    var IsD = vm.medium.filter(function (ob, i) { return (ob.IsDefault === true) })[0]; //jshint ignore : line

                    vm.med = IsD === undefined ? undefined : { selected: vm.medium.filter(function (ob, i) { return (ob.IsDefault === true) })[0] }; //jshint ignore : line
                    vm.MediumID = IsD === undefined ? null : vm.med.selected.MediumID;
                });
        };
    }
})();
