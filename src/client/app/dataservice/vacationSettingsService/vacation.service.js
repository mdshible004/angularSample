
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('vacationSettingsService', vacationSettingsService);

        vacationSettingsService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function vacationSettingsService($http, $q, logger, apiConfig) {
        var service = {
            setInsVacation:setInsVacation,
            getCmnVacation:getCmnVacation,
            getVacationById:getVacationById,
            deleteVacation: deleteVacation
            
        };

        return service;

        // ddl service

        function getCmnVacation() {
            
            return $http.get(apiConfig.host+'/getVacation')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        // post service
     
        function setInsVacation(params) {
            
            return $http.post(apiConfig.host+'/setVacation',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        
        // get service

        function getVacationById(params) {
            
            return $http.get(apiConfig.host+'/getVacationId/'+params.VacationID+'/'+params.InsID,params)
            .then(success)
            .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
            
        }
        function deleteVacation(params) {

            return $http.post(apiConfig.host + '/deleteVacation', params)
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

