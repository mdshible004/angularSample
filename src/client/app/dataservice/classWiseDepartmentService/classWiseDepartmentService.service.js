(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('classWiseDepartmentService', classWiseDepartmentService);

    classWiseDepartmentService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function classWiseDepartmentService($http, $q, logger, apiConfig) {
        var service = {
            getAllDepartment: getAllDepartment,
            getAllDepartmentById: getAllDepartmentById,
            postClassWiseDepartment: postClassWiseDepartment,
            getAllDepartmentClassWise: getAllDepartmentClassWise
        };

        return service;

        function getAllDepartmentClassWise(params) {

            return $http.get(apiConfig.host + '/getClassWiseDepartment/' + params.InstituteID + '/' + params.ClassID + '/' + params.MediumID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function postClassWiseDepartment(params) {

            return $http.post(apiConfig.host + '/setClassWiseDepartment', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function getAllDepartment() {

            return $http.get(apiConfig.host + '/getDepartment')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function getAllDepartmentById(params) {

            return $http.get(apiConfig.host + '/getDepartmentById/' + params.insID, params)
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
