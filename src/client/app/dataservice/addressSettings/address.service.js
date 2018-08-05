(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('addressSettings', addressSettings);

    addressSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function addressSettings($http, $q, logger, apiConfig) {
        var service = {
            postAdressInformation: postAdressInformation,
            getallstates: getallstates,
            getAllAdress: getAllAdress,
            getCityById: getCityById,
            deleteAddress: deleteAddress

        };

        return service;

        function getallstates() {

            return $http.get(apiConfig.host + '/getallstate')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getAllAdress() {

            return $http.get(apiConfig.host + '/getAdress')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getCityById(params) {

            return $http.get(apiConfig.host + '/getCityById/' + params.cityID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }



        function postAdressInformation(params) {

            return $http.post(apiConfig.host + '/setAdress', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function deleteAddress(params) {

            return $http.post(apiConfig.host + '/deleteAddress', params)
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
