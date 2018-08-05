(function () {
    'use strict';

    angular
        .module('app.pagination')
        .directive('pagination', pagination);

    pagination.$inject = [];
    /* @ngInject */
	
    function pagination () {
        //Usage: <pagination search-function="search"></pagination>
		
		var directive = {
			restrict: 'E',
            templateUrl: 'app/layout/pagination/template.html',
			link: link
        };
		return directive;
        
		function link(scope, element, attrs) {
			var vm = scope.vm;
			vm.goForward = function(){
				vm.paginationOffset = vm.paginationOffset + vm.paginationLimit;
				vm[attrs.searchFunction]();
			};
			
			vm.goBackward = function(){
				if( vm.paginationOffset === 0 ) { return; }
				vm.paginationOffset = vm.paginationOffset - vm.paginationLimit;
				vm[attrs.searchFunction]();
			};
			
			
		}
    }
})();
