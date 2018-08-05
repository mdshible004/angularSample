(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('approvalService', approvalService);

    approvalService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function approvalService($http, $q, logger, apiConfig) {
     var service = {};
     return service;
    }
})();
