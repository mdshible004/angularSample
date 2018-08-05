/* Help configure the state-base ui.router */
(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        var config = {
            docTitle: undefined,
            resolveAlways: {}
        };

        $locationProvider.html5Mode(true);

        this.configure = function(cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;
        RouterHelper.$inject = ['$location', '$rootScope', '$state', 'logger', '$localStorage', 'authservice'];
        /* @ngInject */
        function RouterHelper($location, $rootScope, $state, logger, $localStorage, authservice) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                stateCounts: stateCounts
            };

            init();

            return service;

            ///////////////

            function configureStates(states, otherwisePath) {
                states.forEach(function(state) {
                    state.config.resolve =
                        angular.extend(state.config.resolve || {}, config.resolveAlways);
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                    function(event, toState, toParams, fromState, fromParams, error) {
                        if (handlingStateChangeError) {
                            return;
                        }
                        stateCounts.errors++;
                        handlingStateChangeError = true;
                        var destination = (toState &&
                            (toState.title || toState.name || toState.loadedTemplateUrl)) ||
                            'unknown target';
                        var msg = 'Error routing to ' + destination + '. ' +
                            (error.data || '') + '. <br/>' + (error.statusText || '') +
                            ': ' + (error.status || '');
                        logger.warning(msg, [toState]);
                        $location.path('/');
                    }
                );
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
				loggedInInspector();
            }

            function getStates() { return $state.get(); }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function(event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = config.docTitle + ' ' + (toState.title || '');
                        $rootScope.title = title; // data bind to <title>
						angular.element('body')[0].scrollTop = 0;
                    }
                );
            }
			function loggedInInspector(){
				$rootScope.$on('$stateChangeStart',
				function(event, toState, toParams, fromState, fromParams){
					//console.log($state.get());

					if( authservice.ifLoggedIn() ){
						//Logged in
						if( toState.name === 'login'){
							event.preventDefault();//Bam!!
						}

                        if( toState.hasOwnProperty('acl') ){
							//This state may have some access control
                            if( angular.isArray(toState.acl.allowed) &&
								toState.acl.allowed.length &&
								toState.acl.allowed.indexOf( authservice.userRoll ) === -1 ){
								//Not found in allowed list
								event.preventDefault();
								$state.transitionTo( '404' );
							}
							//DO NOT write "else if"
							if( angular.isArray(toState.acl.disallowed) &&
								toState.acl.disallowed.length &&
								toState.acl.disallowed.indexOf( authservice.userRoll ) !== -1 ){
								//Found in disallowed list
								event.preventDefault();
								$state.transitionTo( '404' );
							}
						}

					}
					else {
						//Not logged in
						if( typeof $localStorage.access_token !== 'undefined'){
							event.preventDefault();
							authservice.getUserInfo( toState, toParams );
						}
						else{
							authservice.unsetLoginInfo();
						}
						if (toState.name !== 'login') {
							//He isn't going to the 'login view' either
							event.preventDefault();//Bam!!
							$state.transitionTo('login');//Pow!!
						}
					}

				});
			}
        }
    }
})();
