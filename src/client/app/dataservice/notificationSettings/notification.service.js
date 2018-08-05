(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('notificationSettings', notificationSettings);

        notificationSettings.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function notificationSettings($http, $q, logger, apiConfig) {
        var service = {
            getAllNotification:getAllNotification,
            postNotificationInformation:postNotificationInformation,
            getAllNotificationTypeName:getAllNotificationTypeName,
            getAllNotificationById:getAllNotificationById,
            getAllNotifications :getAllNotifications,
            deleteInstNotification: deleteInstNotification,
            getNotification: getNotification

        };

        return service;


        function getNotification(params) {

            return $http.post(apiConfig.host + '/getAllNotificationUI', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getAllNotification(params) {

            return $http.post(apiConfig.host + '/getNotification', params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        } 
      
        function postNotificationInformation(params) {
            
            return $http.post(apiConfig.host+'/setNotification',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getAllNotificationTypeName() {
            
            return $http.get(apiConfig.host+'/getNotificationTypeName')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
         }
        function getAllNotificationById(params) {
            
            return $http.get(apiConfig.host+'/getNotificationById/'+params.InsNotificationSetupID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
     
         function getAllNotifications() {
            
            return $http.get(apiConfig.host+'/getNotificationType')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        } 
        function deleteInstNotification(params) {
        
        return $http.post(apiConfig.host+'/deleteInsNotification',params)
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
