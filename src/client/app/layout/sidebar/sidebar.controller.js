(function () {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('MenuServiceController', MenuServiceController);

    MenuServiceController.$inject = ['userMenuService', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */

    var vm = this;
    function MenuServiceController(userMenuService, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {

        activate();
        $scope.listMenu = [];

        function activate() {
            var promises = [getCmnMenuByUserMultiType()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        function getMenuByUser() {
            //debugger;
            if ($localStorage.userInfo !== undefined) {
                var params = {
                    userID: $localStorage.userInfo[0].UserID
                };
                return userMenuService.getCmnMenuByUser(params)
                    .then(function (data) {
                        $scope.listMenu = data;
                        $localStorage.listMenu = data;
                        //console.log($scope.listMenu);
                    });
            }
            else {
                console.log('ok');
            }
        }

        function getCmnMenuByUserMultiType() {
            //debugger;
            if ($localStorage.userInfo !== undefined) {
                var params = {
                    userID: $localStorage.userInfo[0].UserID,
                    UserTypeID: $localStorage.userInfo[0].UserTypeID === undefined || $localStorage.userInfo[0].UserTypeID === null ? 0 : $localStorage.userInfo[0].UserTypeID
                };
                return userMenuService.getCmnMenuByUserMultiType(params)
                    .then(function (data) {
                        $scope.listMenu = data;
                        $localStorage.listMenu = data;
                        //console.log($scope.listMenu);
                    });
            }
            else {
                console.log('ok');
            }
        }

        $scope.getmenu = function (menuitm) {
            console.log(menuitm);
            $localStorage.menuItm = menuitm;
        };

    }
})();
