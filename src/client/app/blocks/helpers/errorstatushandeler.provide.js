/// <reference path="../../../../../typings/angularjs/angular.d.ts"/>
(function () {
    'use strict';

    angular
        .module('app.layout')
        .provider('errorstatushandeler', ErrorStatusHandelerProvider);

    ErrorStatusHandelerProvider.$inject = [];
    /* @ngInject */
    function ErrorStatusHandelerProvider() {
    	this.$get = ErrorStatusHandelerService;

    	ErrorStatusHandelerService.$inject = ['logger'];
    	function ErrorStatusHandelerService( logger ){

	        var service = {
				
				checkStatus : checkStatus,
				unauthorized : unauthorized,
				nocontent : nocontent,
				serverError : serverError,
				validationError : validationError,
				developerError : developerError
				
	        };
			return service;
			

			//vm.errorRes = {};

			function checkStatus( res ){

				var response = null;
				switch (res.status) {
					case 0:
			  			response = uncategorizedError(res);
			  			break;
			  		case 204:
			  			response = nocontent(res);
			  			break;
			  		case 400:
			  			response = validationError(res);
			  			break;
					case 401:
				  		response = unauthorized(res);
				  		break;
			  		case 404:
			  			response = notFound(res);
			  			break;
			  		case 500:
			  			response = serverError(res);
			  			break;
			  		default:
			  			response = res;
				}
				return response;	
				
			}

			function uncategorizedError(res){
				logger.error('Uncategorized server error!');
				return res;
			}
			
			function unauthorized(res){
				logger.error(res.data.error_description);
				return res;
			}

			function nocontent(res){
				logger.info('No Data Found');
				return res;
			}

			function notFound(res){
				logger.error('Oops! 404, Not found');
				return res;
			}
			
			function serverError(res){
				logger.error('Oops! 500, Server Error');
				return res;
			}

			function validationError(res){
				
				var errorResponse = res.data;
				var allFields = Object.keys(errorResponse);
				var totalFields = 1 || allFields.length;//just first msg
				for(var field = 0; field<totalFields; field++){
				   for(var msg = 0; msg<errorResponse[ allFields[field] ].length; msg++){
				     logger.error(errorResponse[ allFields[field] ] [msg]);
				   }
				}
				return res;
			}

			function developerError(res){
				return res;
				
			}
    	}
		
	}

})();

/*
not found get(list)->204
not found signal entity->404
validation error -> 400
developer error -> 500* 
*/