(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('periodSetup', periodSetup);

        periodSetup.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function periodSetup($http, $q, logger, apiConfig) {
        var service = {
           
            getperiodByParm:getperiodByParm,
            postClsPeriod:postClsPeriod
        };
        //getPeriodByParms/:MediumID/:ClassID/:DepartmentID/:ShiftID/:InstituteID'
        return service;
        
    function getperiodByParm(params) {

        return $http.get(apiConfig.host + '/getPeriodByParms/' + params.MediumID + '/' + params.ClassID + '/' + params.DepartmentID + '/' + params.ShiftID + '/' + params.InstituteID + '/' + params.SectionID)
        .then(success)
        .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(error) {
            return $q.reject(error);
        }
        
    }
    function postinsmedium(params) {
        
        return $http.post(apiConfig.host+'/setinsMedium',params)
        .then (success)
        .catch (fail);

        function success(response) {
            return response.data;
        }

        function fail(error) {
            return $q.reject(error);
        }
        
    }
    function postClsPeriod(params) {
        
        return $http.post(apiConfig.host+'/setclsPeriod',params)
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