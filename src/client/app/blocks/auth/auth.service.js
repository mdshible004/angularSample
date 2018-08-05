(function () {
    'use strict';
    /*jshint validthis:true */
    angular
        .module('blocks.auth')
        .factory('authservice', authservice);

    authservice.$inject = ['$http', '$q', '$rootScope', 'apiConfig', '$localStorage', '$state'];
    /* @ngInject */
    function authservice($http, $q, $rootScope, apiConfig, $localStorage, $state) {

		var service = {
            isLoggedIn: false,
            pending: true,
			userRolls: ['Administrator','Moderator', 'General'],
			userRoll: '',
			loginInfo: {},

			ifLoggedIn : ifLoggedIn,
			setLoginInfo: setLoginInfo,
			getLoginInfo: getLoginInfo,
			setUserRoll: setUserRoll,
			getUserRoll: getUserRoll,
			unsetLoginInfo: unsetLoginInfo,
			getUserInfo: getUserInfo,

			oAuthLogin: oAuthLogin,
			visibleTo: visibleTo,
            getToken : getToken
        };

		return service;

        var vm = this; //jshint ignore : line

		function ifLoggedIn(){
			return this.isLoggedIn;
		}
		function setUserRoll( newRoll ){
			var oldRoll = this.userRoll;
			this.userRoll = newRoll;
			$rootScope.$broadcast('userRollChanged', {});
			return this.userRoll;
		}
		function getUserRoll(){
			return this.userRoll;
		}
		function setLoginInfo( info ){
			this.pending = false;
			this.isLoggedIn = true;
			this.loginInfo = info;
			this.setUserRoll( info.groupName );
			// this.userRoll = 'General';//ACL Testing purpose
		}
		function getLoginInfo(){
			return $q.when( this.isLoggedIn ? this.loginInfo : null );
		}
		function unsetLoginInfo(){
			this.pending = false;
			this.isLoggedIn = false;
			this.loginInfo = null ;
			//$localStorage.$reset();
			delete $localStorage.access_token;
			delete $localStorage.refresh_token;
			delete $localStorage.token_type;
			$rootScope.$broadcast('userLoggedOut', {});
		}

		function getUserInfo( targetState, stateParams ){
			var thisService = this;
			return $q(function(resolve, reject){
				var dummyUser = {
					'id': '2',
					'email': 'hungrynaki@gmail.com',
					'firstName': 'hungrynaki',
					'lastName': 'core',
					'groupName': 'Administrator'
				};
				thisService.setLoginInfo( dummyUser );
				$rootScope.$broadcast('userInfoReceived', dummyUser);
				$state.transitionTo( targetState, stateParams );
			});

            /*
			$http.get(apiConfig.host+'/user-self')
			.then(function( res ){
				thisService.setLoginInfo( res.data );
				$rootScope.$broadcast('userInfoReceived', res.data);
				$state.transitionTo( targetState, stateParams );
			})
			.catch(function(err){
				thisService.unsetLoginInfo();
				$rootScope.$broadcast('userLoggedOut', {});
				return $q.reject(err);
			});
            */

		}

        //var token;

        function getToken(token){
           //token = token;
           $localStorage.token_type = token;
        }

		function oAuthLogin( data ){

            //debugger;
			var authServe = this;

			return $q(function( resolve, reject ){
				// var data = {
				// 	access_token: 'fjkmJyAZEYasFFNBlqFfIzUgXgNutrIJp823Rj1s',
				// 	refresh_token: 'E5LgEoDq0vyng0jTShm2rxtZdckYGhtNmKErKfgs',
				// 	token_type: 'Bearer'
				// };
				$localStorage.access_token = data.access_token;
				$localStorage.refresh_token = data.refresh_token;
                //$localStorage.token_type = token;
				$localStorage.userInfo = data;
				authServe.isLoggedIn = true;
				$rootScope.$broadcast('userLoggedIn', data);
				resolve(data);
			});

            /*
			angular.extend( params, {
				grant_type: 'password',
	            client_id: apiConfig.client_id,
	            client_secret: apiConfig.client_secret
	        });

			return $http({
			    method: 'POST',
			    url: apiConfig.host+'/oauth/access_token',
			    data: params,
			    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			    transformRequest: function(obj) {
			        var str = [];
			        for(var p in obj){
						if( obj.hasOwnProperty(p) ){
							str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
						}
					}
			        return str.join('&');
			    }
			})
			.success(function(data) {
				$localStorage.access_token = data.access_token;
				$localStorage.refresh_token = data.refresh_token;
				$localStorage.token_type = data.token_type;
				authServe.isLoggedIn = true;
				$rootScope.$broadcast('userLoggedIn', data);
			})
			.error(function(error) {
				return $q.reject(error);
			});
            */

		}

		function visibleTo( allowedRolls ){
			allowedRolls = allowedRolls || [];
			if( allowedRolls.indexOf('all') !== -1 ||
				allowedRolls.indexOf(this.userRoll) !== -1 ){
				return true;
			}
			return false;
		}
    }

})();
