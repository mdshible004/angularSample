(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('FineService', FineService);

    FineService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function FineService($http, $q, logger, apiConfig) {
        var service = {
            getFineType: getFineType,
            SaveFine: SaveFine,
            getAllFine: getAllFine,
            getFineByID: getFineByID,
            UpdateFine: UpdateFine,
            deleteFineByID: deleteFineByID,
            getDue: getDue
        };

        return service;



        function getDue(params) {

            return $http.get(apiConfig.host + '/getDue/' + params.MonthID + '/' + params.InstituteID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }





        function SaveFine(params) {

            return $http.post(apiConfig.host + '/setFine', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function getAllFine(Params) {
            return $http.get(apiConfig.host + '/getALLFine/' + Params.InstituteID, Params)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }


        function getFineByID(params) {
            return $http.get(apiConfig.host + '/getAllFineByID/' + params.InstituteID + '/' + params.FineID, params)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }





        function getFineType() {
            return $http.get(apiConfig.host + '/getFineType')
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }






        function deleteFineByID(params) {
            return $http.get(apiConfig.host + '/deleteFineByID/' + params.classID, params)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }



        function UpdateFine(params) {

            return $http.post(apiConfig.host + '/setFine', params)
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
