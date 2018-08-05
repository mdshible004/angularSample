(function () {
    'use strict';

    angular
        .module('blocks.auth')
        .provider('auth', authProvider);

    authProvider.$inject = [];
    /* @ngInject */
    function authProvider() {
        var isLoggedIn = true;
		var loginInfo = {name:'Lal Shalu', address: 'Komola Khet'};
		var userRoll = 'admin';//admin, reconciler, user
		var service = {
			ifLoggedIn : ifLoggedIn,
            setLoginInfo: setLoginInfo,
			getLoginInfo: getLoginInfo,
			setUserRoll: setUserRoll,
			getUserRoll: getUserRoll,
			unsetLoginInfo: unsetLoginInfo,
			$get: function(){
				return this;
			}
        };
		
        return service;
		
		function setUserRoll(newRoll){
			var oldRoll = userRoll;
			userRoll = newRoll;
		}
		function getUserRoll(){
			return userRoll;
		}
		function ifLoggedIn(){
			return isLoggedIn;
		}
		function setLoginInfo( data ){
			loginInfo = data;
		}
		function getLoginInfo(){
			return (isLoggedIn ? loginInfo : null );
		}
		function unsetLoginInfo(){
			loginInfo = null ;
		}
    }
	
})();
