
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('leaveService', leaveService);

    leaveService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function leaveService($http, $q, logger, apiConfig) {
        var service = {
            getHolidaysByInstituteId: getHolidaysByInstituteId,
            getCmnYear: getCmnYear,
            setCmnHolidays: setCmnHolidays,
            getHolidaysListByInstituteId: getHolidaysListByInstituteId,
            deleteHrmHoliday: deleteHrmHoliday,
            getLeaveTypeByInstituteId: getLeaveTypeByInstituteId,
            setHrmLeaveApplication: setHrmLeaveApplication,
            getHrmLeaveUserByUserID: getHrmLeaveUserByUserID,
            getHrmLeaveApplication: getHrmLeaveApplication,
            deleteHrmLeaveApplication : deleteHrmLeaveApplication

        };

        return service;


        function getCmnYear() {
            return $http.get(apiConfig.host + '/getCmnYear')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function setCmnHolidays(params) {
            return $http.post(apiConfig.host + '/setHrmHoliday', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getHolidaysByInstituteId(params) {
            return $http.get(apiConfig.host + '/getHolidayByInsId/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getLeaveTypeByInstituteId(params) {
            return $http.get(apiConfig.host + '/getLeaveTypeByInsId/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getHolidaysListByInstituteId(params) {
            return $http.post(apiConfig.host + '/getHrmHolidayList', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function deleteHrmHoliday(params) {
            return $http.post(apiConfig.host + '/deleteHolidaySetup', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function setHrmLeaveApplication(params) {
            return $http.post(apiConfig.host + '/setHrmLeaveApplication', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getHrmLeaveUserByUserID(params) {
            return $http.post(apiConfig.host + '/getHrmLeaveUserByUserID', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getHrmLeaveApplication(params) {
            return $http.post(apiConfig.host + '/getHrmLeaveApplication', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function deleteHrmLeaveApplication(params) {
            return $http.post(apiConfig.host + '/deleteHrmLeaveApplication', params)
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

