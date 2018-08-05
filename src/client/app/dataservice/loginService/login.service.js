(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('loginService', loginService);

        loginService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function loginService($http, $q, logger, apiConfig) {
        var service = {
            getLoginInformation: getLoginInformation,
            resetPassword: resetPassword,
            getUserEmailPhoneIfExist: getUserEmailPhoneIfExist,
            sendCodeThrouMail: sendCodeThrouMail
        };

        return service;


        function getLoginInformation(params) {
            
            return $http.get(apiConfig.host+'/getLoginInformation/'+params.username+'/'+params.password)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function resetPassword(params) {
            return $http.get(apiConfig.host + '/resetPassword/' + params.UserID + '/' + params.LoginID + '/' + params.ResetPassword + '/' + params.InstituteID)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }

        function getUserEmailPhoneIfExist(params) {
            return $http.get(apiConfig.host + '/getUserEmailPhoneIfExist/' + params.UserEmailPhone)
                .then(success)
                .catch(fail);
            function success(response) {
                return response.data;
            }
            function fail(error) {
                return $q.reject(error);
            }
        }

        function sendCodeThrouMail(params) {
            return $http.get(apiConfig.host + '/sendCodeThrouMail/' + params.EmailID + '/' + params.CodeSet)
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
