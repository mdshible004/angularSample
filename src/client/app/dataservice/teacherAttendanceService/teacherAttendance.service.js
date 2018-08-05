
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('teacherAttendanceSevice', teacherAttendanceSevice);

    teacherAttendanceSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function teacherAttendanceSevice($http, $q, logger, apiConfig) {
        var service = {
            getInsBranch: getInsBranch,
            getHrmDeviceByParmsforTeacher:getHrmDeviceByParmsforTeacher,
            getInsDepartment: getInsDepartment,
            getTotalHrmDeviceByParmsforTeacher: getTotalHrmDeviceByParmsforTeacher,
            getHrmDeviceByParmsforTeacherManual : getHrmDeviceByParmsforTeacherManual

        };

        return service;

        function getInsBranch(params) {

            return $http.get(apiConfig.host + '/getBranchByInsID/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getInsDepartment() {

            return $http.get(apiConfig.host + '/getCmnDepertment')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getHrmDeviceByParmsforTeacher(params) {

            return $http.get(apiConfig.host + '/gethrmDeviceByParmsforTeacher/' + params.BrunchID + '/' + params.DepartmentID + '/' + params.Date+'/'+params.InstituteID+'/'+params.UserTypeID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getHrmDeviceByParmsforTeacherManual(params) {

            return $http.get(apiConfig.host + '/getHrmTeacherAttendanceManual/' + params.BrunchID + '/' + params.DepartmentID + '/' + params.Date+'/'+params.InstituteID+'/'+params.UserTypeID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getTotalHrmDeviceByParmsforTeacher(params) {

            return $http.get(apiConfig.host + '/getHrmTotalTeacherAttendance/' + params.BrunchID + '/' + params.DepartmentID + '/' + params.Date+'/'+params.InstituteID+'/'+params.UserTypeID, params)
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

