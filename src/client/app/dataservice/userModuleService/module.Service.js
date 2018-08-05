(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('userModuleService', userModuleService);

    userModuleService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */

    function userModuleService($http, $q, logger, apiConfig) {
        var service = {
            getCmnModuleByUser: getCmnModuleByUser
        };

        return service;

        function getCmnModuleByUser(params) {

            return $http.get(apiConfig.host + '/getCmnMenuByUser/' + params.userID, params)
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
