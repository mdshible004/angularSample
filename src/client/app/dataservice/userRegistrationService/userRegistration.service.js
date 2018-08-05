
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('userRegistrationService', userRegistrationService);

    userRegistrationService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function userRegistrationService($http, $q, logger, apiConfig) {
        var service = {
            getAllStudent: getAllStudent,
            getCmnUserResistrationByUserID: getCmnUserResistrationByUserID,
            postCmnUserResistration: postCmnUserResistration
        };

        return service;

        function getAllStudent(params) {

            return $http.post(apiConfig.host + '/getAllStudentByInsID', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getCmnUserResistrationByUserID(params) {

            var userID = parseInt(params);

            return $http.get(apiConfig.host + '/getCmnUserResistrationByUserID/' + userID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function postCmnUserResistration(params) {

            return $http.post(apiConfig.host + '/postCmnUserResistration', params)
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

