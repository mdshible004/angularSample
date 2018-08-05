(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('FeeSetupService', FeeSetupService);

    FeeSetupService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function FeeSetupService($http, $q, logger, apiConfig) {
        var service = {
            getFeesType: getFeesType,
            SaveFees: SaveFees,
            getAllClass: getAllClass,
            getFeesByID: getFeesByID,
            UpdateFees: UpdateFees,
            SetFeeSetup: SetFeeSetup
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
            return $http.get(apiConfig.host + '/loadFees/' + params.InstituteID + '/' + params.ShiftID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.FeesTypeID, params)
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
            return $http.get(apiConfig.host + '/getAllFeesByID/' + params.classID, params)
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



        function SetFeeSetup(params) {

            return $http.post(apiConfig.host + '/setFeeSetup', params)
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
