(function () {
    'use strict';

    var app = angular.module('app');
	app.config(function setupConfig( $httpProvider ) {
		
		apiInterceptor.$inject = ['$q', 'errorstatushandeler'];
		/* @ngInject */
		function apiInterceptor( $q, errorstatushandeler ) {
			
			return {
				request: request,
				response: response,
				requestError: requestError,
				responseError: responseError
			};

			function request (config) {
				// console.log(arguments);
				return config;
			}

			function response(res) {
				
				return errorstatushandeler.checkStatus(res);
			}
			
			function requestError (rejection ) {
				// console.log(arguments);
				return( $q.reject( rejection ) );
			}

			function responseError(response) {
				
				return( $q.reject( errorstatushandeler.checkStatus(response) ) );
			}

		}

		$httpProvider.interceptors.push( apiInterceptor );

	});

})();