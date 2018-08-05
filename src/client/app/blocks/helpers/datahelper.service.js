(function () {
    'use strict';

    angular
        .module('app.layout')
        .factory('datahelper', DataHelper);

    DataHelper.$inject = [ '$q' ];
    /* @ngInject */
    function DataHelper( $q ) {
        var helper = {
            decodeHtmlFromString: decodeHtmlFromString,
            decodeHtmlFromJson: decodeHtmlFromJson,
            goodPromise: goodPromise,
            badPromise: badPromise
        };
		return helper;

        function decodeHtmlFromString( string ){
			return angular.element('<textarea />').html(string).text();
        }
		
		function decodeHtmlFromJson( json ){
			return JSON.parse( decodeHtmlFromString(JSON.stringify(json) ));
        }
		
		function goodPromise( data ){
            return $q(function(resolve) {
                resolve( data );
            });
        }

        function badPromise( data ){
            return $q(function(resolve, reject) {
                reject( data );
            });
        }
    }

})();
