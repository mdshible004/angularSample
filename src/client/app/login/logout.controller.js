(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('logoutController', logoutController);

    logoutController.$inject = ['authservice', '$state'];
    /* @ngInject */
    function logoutController(authservice, $state) {
        var vm = this;//jshint ignore :line 
        vm.logout = function(){
			authservice.unsetLoginInfo();
			$state.transitionTo('login');
		};
        

    }

})();
