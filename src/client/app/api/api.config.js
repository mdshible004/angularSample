(function () {
    'use strict';

    var app = angular.module('app.apiconfig', ['ui.router']);

	var apiConfig = {};
	//apiConfig.version = '2.0.0';


	/** LOCAL **/
	//apiConfig.host = 'http://api.smartlaunder.com';

	/** test-production **/
	// apiConfig.host = 'http://182.160.100.36:4000/api/onEms';
	// apiConfig.imagehost = 'http://182.160.100.36:4000/';

	/** test-production **/
	apiConfig.host = 'http://localhost:4000/api/onEms';
	apiConfig.imagehost = 'http://localhost:4000/';
	
	
	//apiConfig.client_id = '0kH7FflT9VmMzxd0';
	//apiConfig.client_secret = 'MfF2RRTYseHqWi4JTs3tGvtSEybaqpLy';

	app.value('apiConfig', apiConfig);
	app.config([
		'$httpProvider',
		function($httpProvider){

			/*
			$token = $request->input('_token') ?: $request->header('X-CSRF-TOKEN');
			$httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
			$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
			$httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
			$httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
			$httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
			$httpProvider.defaults.useXDomain = true;
			$httpProvider.defaults.withCredentials = true;
			*/
			$httpProvider.defaults.useXDomain = true;
			$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
			//$httpProvider.defaults.headers.common['etag'] = "W/'6b6-3xpY/cNUY64DgtNOg63bwTLUhoE'";
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
			// $httpProvider.defaults.headers.common['X-XSRF-TOKEN']  = 'eyJpdiI6IkszUW51NUE2T01RQ1cyRm53cnQrZ2c9PSIsInZhbHVlIjoidWVyQk5DSGRsZ2tmS3lRekRVb0ZUQlFKRllYc2d2dUxwTlI4SHlRTXh6Z3hWa2dBY2I2UnBIK1QrbjdhNWVGTEJKeXBFdGdKSDVVYzlQZzFxVlo3ZFE9PSIsIm1hYyI6ImUyNGU0ZDhjNDFmY2FmMDQ1ZGJhMmM0YTViMDRkYzYxZTc4NWYwNDAxZWRhNTNiZDhhOWExNjFhMDRiMTljMDUifQ';
		}
	]);


})();
