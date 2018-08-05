(function () {
    'use strict';

    angular
        .module('app.layout')
        .filter('fixedfloat', FixedFloat);

    function FixedFloat() {
        return function(input, range) {
			var result;
			input = parseFloat(input || 0);	//input=>10.4500000
			range = range || 4;				//range=>4
			
			result = input.toFixed( range )*1;	//  10.4500000	=> 10.4500
			result = result.toString()*1;		//  10.4500		=> 10.45
			return result;
		};
    }

})();

/**
Usage:
{{10.06008000000 | fixedfloat}}
{{10.06008000000 | fixedfloat:2}}
*/