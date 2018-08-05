(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('userMenuService', userMenuService);

        userMenuService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */

    function userMenuService($http, $q, logger, apiConfig) {
        var service = {
            getCmnMenuByUser: getCmnMenuByUser,
            getCmnMenuByUserMultiType: getCmnMenuByUserMultiType
        };

        return service;

        function getCmnMenuByUser(params) {
            
            return $http.get(apiConfig.host+'/getCmnMenuByUser/'+params.userID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }

        function getCmnMenuByUserMultiType(params) {

            return $http.get(apiConfig.host + '/getCmnMenuByUserMultiType/' + params.userID + '/' + params.UserTypeID, params)
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
