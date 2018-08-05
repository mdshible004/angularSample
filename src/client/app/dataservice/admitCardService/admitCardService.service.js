(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('admitCardSetup', admitCardSetup);

    admitCardSetup.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function admitCardSetup($http, $q, logger, apiConfig) {
        var service = {
           
            SetInsAdmitCard: SetInsAdmitCard,
            getStudentAdmitCard: getStudentAdmitCard
            
        };
       
        return service;
        
        function SetInsAdmitCard(params) {

            return $http.post(apiConfig.host + '/SetInsAdmitCard', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function getStudentAdmitCard(params) {

            return $http.post(apiConfig.host + '/getStudentAdmitCard', params)
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
