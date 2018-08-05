(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('relationSettings', relationSettings);

        relationSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function relationSettings($http, $q, logger, apiConfig) {
        var service = {
            postrelation:postrelation,
            getAllRelations:getAllRelations,
            getRelationByID:getRelationByID,
            deleteRelation:deleteRelation
			
        };

        return service;

		function postrelation(params) {
            
            return $http.post(apiConfig.host+'/setRelation',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllRelations() {
            
            return $http.get(apiConfig.host+'/getRelation')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getRelationByID(params) {
            
            return $http.get(apiConfig.host+'/getRelationByID/'+params.relationID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
         function deleteRelation(params) {
            
            return $http.post(apiConfig.host+'/deleteRelation',params)
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
