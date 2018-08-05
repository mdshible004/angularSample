(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('resultProcessingSetup', resultProcessingSetup);

    resultProcessingSetup.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function resultProcessingSetup($http, $q, logger, apiConfig) {
        var service = {
            getCmnCtProcessingTypeDDL: getCmnCtProcessingTypeDDL,
            getCmnFinalResultProcessingTypeDDL: getCmnFinalResultProcessingTypeDDL,
            getCmnRollProcessingTypeDDL: getCmnRollProcessingTypeDDL,
            getInsExamListForResult: getInsExamListForResult,
            setInsResultProcessing: setInsResultProcessing,
            getInsResultProcessingMaster: getInsResultProcessingMaster,
            getInsResultProcessingDetail: getInsResultProcessingDetail,
            deleteInsResultProcessing: deleteInsResultProcessing
        };

        return service;

        function getCmnCtProcessingTypeDDL(params) {
            return $http.get(apiConfig.host + '/getCmnCtProcessingTypeDDL', params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getCmnFinalResultProcessingTypeDDL(params) {
            return $http.get(apiConfig.host + '/getCmnFinalResultProcessingTypeDDL', params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        
        function getCmnRollProcessingTypeDDL(params) {
            return $http.get(apiConfig.host + '/getCmnRollProcessingTypeDDL', params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInsExamListForResult(params) {
            return $http.get(apiConfig.host + '/getInsExamListForResult' + '/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.Sequence, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }


        function setInsResultProcessing(params) {
            return $http.post(apiConfig.host + '/setInsResultProcessing', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        } 

        function getInsResultProcessingMaster(params) {
            return $http.get(apiConfig.host + '/getInsResultProcessingMaster' + '/' + params.InstituteID, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInsResultProcessingDetail(params) {
            return $http.get(apiConfig.host + '/getInsResultProcessingDetail' + '/' + params.ProcessingID, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function deleteInsResultProcessing(params) {
            return $http.post(apiConfig.host + '/deleteInsResultProcessing', params)
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
