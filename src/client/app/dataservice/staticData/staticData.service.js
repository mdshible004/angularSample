(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('staticdataservice', staticdataservice);

    staticdataservice.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function staticdataservice($http, $q, logger, api) {
        var service = {
        	categoryName : categoryName,
        };
		return service;

		function categoryName() {
			return [
				{
					id: '1',
					name: 'A'
				},
				{
					id: '2',
					name: 'B'
				},
				{
					id: '3',
					name: 'Science'
				},
				{
					id: '4',
					name: 'Commerce'
				},
				{
					id: '5',
					name: 'Arts'
				},
			];
		}


        function fakeOptions(startWith, totalOptions){
			startWith = startWith || 'fake data';
			totalOptions = totalOptions || 3;
			var opts = [];
			for(var i = 1; i <= totalOptions; i++ ){
				opts.push({
					id: i,
					name: startWith+i
				});
			}
			return opts;
        }
    }
})();
