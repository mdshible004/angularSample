(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('insEventSetup', insEventSetup);

        insEventSetup.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function insEventSetup($http, $q, logger, apiConfig) {
        var service = {
            getEventId:getEventId,
            postEvent:postEvent,
            getAllEventId:getAllEventId,
            getAllEventById:getAllEventById,
            IsdeleteEventByID:IsdeleteEventByID,
            getEventType:getEventType,
            deleteEvent:deleteEvent

        };

        return service;

        function getEventId() {
            
            return $http.get(apiConfig.host+'/getEvent')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function postEvent(params) {
            
            return $http.post(apiConfig.host+'/setinsEvent',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllEventId() {
            
            return $http.get(apiConfig.host+'/getInsEvents')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllEventById(params) {
            
            return $http.get(apiConfig.host+'/getEventById/'+params.EventID+'/'+params.insID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }


        function IsdeleteEventByID(params) {
            
            return $http.delete(apiConfig.host+'/deleteEvent/'+params.EventID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
  
        function getEventType() {

            return $http.get(apiConfig.host + '/getInsEventType')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
            function deleteEvent(params) {

            return $http.post(apiConfig.host + '/deleteInsEvent', params)
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
