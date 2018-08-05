(function () {
    'use strict';

    angular
        .module('blocks.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$q', 'logger', 'authservice', 'apiConfig', '$scope'];
    /* @ngInject */
    function AuthController($q, logger, authservice, apiConfig, $scope) {
        

    }

})();
