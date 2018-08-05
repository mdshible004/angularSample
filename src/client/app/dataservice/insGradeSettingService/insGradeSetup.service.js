(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('insGradesSetup', insGradesSetup);

        insGradesSetup.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function insGradesSetup($http, $q, logger, apiConfig) {

        var service = {
            
            getAllGrade:getAllGrade
         
        };

        return service;

	

        function getAllGrade(params) {
            
            return $http.get(apiConfig.host+'/getinsGrade/'+params.InstituteID,params)
            .then (success)
            .catch (fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

    }
})();



