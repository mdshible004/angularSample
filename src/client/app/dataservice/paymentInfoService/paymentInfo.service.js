
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('paymentInfoSevice', paymentInfoSevice);

    paymentInfoSevice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function paymentInfoSevice($http, $q, logger, apiConfig) {
        var service = {
            getPaymentInfoByUserID: getPaymentInfoByUserID,
            getNetReceive: getNetReceive
        };

        return service;


        function getPaymentInfoByUserID(params) {

            return $http.get(apiConfig.host + '/getPaymentInfoByUserID/' + params.InstituteID + '/' + params.UserID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }



        function getNetReceive(params) {

            return $http.get(apiConfig.host + '/getNetReceive/' + params.InstituteID + '/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.SectionID + '/' + params.ShiftID + '/' + params.UserID, params)
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

