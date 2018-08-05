(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('bankAccountService', bankAccountService);

    bankAccountService.$inject = ['$http', '$q', 'logger', 'apiConfig','authservice'];
    /* @ngInject */
    function bankAccountService($http, $q, logger, apiConfig,authservice) {

        var service = {
            getModels: getModels,
            getModelsByID: getModelsByID,
            postModels: postModels
        };

        return service;

        function getModels(funcName) {
            
            return $http.get(apiConfig.host + funcName)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getModelsByID(funcName, Params) {

            return $http.post(apiConfig.host + funcName, Params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function postModels(funcName, Params) {

            return $http.post(apiConfig.host + funcName, Params)
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
