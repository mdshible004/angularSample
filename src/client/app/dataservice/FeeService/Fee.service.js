(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('FeeService', FeeService);

    FeeService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function FeeService($http, $q, logger, apiConfig) {
        var service = {
            getFeesType: getFeesType,
            SaveFees: SaveFees,
            getAllClass: getAllClass,
            getFeesByID: getFeesByID,
            UpdateFees: UpdateFees,
            deleteFeeByID: deleteFeeByID,
        };

        return service;



        function getFeesType() {
            return $http.get(apiConfig.host + '/getFeesType')
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }



        function SaveFees(params) {

            return $http.post(apiConfig.host + '/setFees', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function getAllClass(params) {
            return $http.get(apiConfig.host + '/getALLFees/' + params.InstituteID, params)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }


        function getFeesByID(params) {
            return $http.get(apiConfig.host + '/getAllFeesByID/' + params.InstituteID + '/' + params.FeeID, params)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }




        function UpdateFees(params) {

            return $http.post(apiConfig.host + '/setFees', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function deleteFeeByID(params) {
            return $http.get(apiConfig.host + '/deleteFeeByID/' + params.classID, params)
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
