(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('classSettingsService', classSettingsService);

    classSettingsService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function classSettingsService($http, $q, logger, apiConfig) {
        var service = {
            getInstitute: getInstitute,
            getClassByInsID: getClassByInsID,
            getSectionByID: getSectionByID,
            postClass: postClass,
            getUserbyTypeId: getUserbyTypeId,
            getClassRoutineByID: getClassRoutineByID,
            getDashClassRoutine: getDashClassRoutine,
            getDashUserInfo: getDashUserInfo,
            getDashTeacherClassRoutine: getDashTeacherClassRoutine,
            spGetDashNotice: spGetDashNotice,
            spGetCommonClassRoutine: spGetCommonClassRoutine,
            spGetTeacherStudentMyClassRoutine: spGetTeacherStudentMyClassRoutine,
            getTeacherIfExist: getTeacherIfExist
        };

        return service;


        function getInstitute() {

            return $http.get(apiConfig.host + '/getAllInstitute')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getClassByInsID(params) {

            return $http.get(apiConfig.host + '/getClassByInsID/' + params.insID + '/' + params.mediumID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getSectionByID(params) {

            return $http.get(apiConfig.host + '/getSectionByID/' + params.clID + '/' + params.insID + '/' + params.deptID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function postClass(params) {
            return $http.post(apiConfig.host + '/setClassAndSection', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getUserbyTypeId(params) {

            return $http.get(apiConfig.host + '/getUserByUserTypeId/' + params.uId + '/' + params.insID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getClassRoutineByID(params) {

            return $http.get(apiConfig.host + '/spGetClsClassRoutine/' + params.ShiftID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.DayID + '/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getDashClassRoutine(params) {

            return $http.get(apiConfig.host + '/spGetDashClassRoutine/' + params.ShiftID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.SectionID + '/' + params.DepartmentID + '/' + params.DayID + '/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getDashUserInfo(params) {

            return $http.get(apiConfig.host + '/spGetDashUserDetail/' + params.LoggedUserID + '/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getDashTeacherClassRoutine(params) {
            return $http.get(apiConfig.host + '/spGetDashTeacherClassRoutine/' + params.LoggedUserID + '/' + params.DayID + '/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function spGetDashNotice(params) {

            return $http.get(apiConfig.host + '/spGetDashNotice/' + params.LoggedUserTypeID + '/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function spGetCommonClassRoutine(params) {

            return $http.get(apiConfig.host + '/spGetCommonClassRoutine/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function spGetTeacherStudentMyClassRoutine(params) {

            return $http.get(apiConfig.host + '/spGetTeacherStudentMyClassRoutine/' + params.InstituteID + '/' + params.ClassID + '/' + params.TeacherID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getTeacherIfExist(params) {
          
            return $http.get(apiConfig.host + '/getTeacherIfExist/' + params.InstituteID + '/' + params.TeacherID + '/' + params.PeriodID + '/' + params.DayID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }
    }
})();
