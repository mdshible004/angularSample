(function () {
    'use strict';

    var app = angular.module('app');
	app.config(function setupConfig( $httpProvider ) {
		
		authInterceptor.$inject = ['$q', 'apiConfig', '$localStorage', '$rootScope'];
		/* @ngInject */
		function authInterceptor( $q, apiConfig, $localStorage, $rootScope ) {
			
			return {
				request: request,
				response: response,
				requestError: requestError,
				responseError: responseError
			};

			function request (config) {
				config.headers.Authorization = $localStorage.token_type+' '+$localStorage.access_token;
				return config;
			}

			function response(res) {
				return res;
			}
			
			function requestError (rejection ) {
				return( $q.reject( rejection ) );
			}

			function responseError(response) {
				return( $q.reject( response ) );
			}

		}

		$httpProvider.interceptors.push( authInterceptor );

	});

})();