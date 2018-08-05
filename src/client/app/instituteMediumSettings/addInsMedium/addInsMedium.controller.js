(function () {
    'use strict';

    angular
        .module('app.instituteMediumSettings')
        .controller('instituteMediumSettingsController', instituteMediumSettingsController);

    instituteMediumSettingsController.$inject = ['mailSettings', 'insmediumsetting', 'filterurl', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$state', 'Upload', '$timeout', '$http', '$interval', 'uiGridConstants', '$localStorage'];
    /* @ngInject */
    function instituteMediumSettingsController(mailSettings, insmediumsetting, filterurl, $q, authservice, logger, $scope, $rootScope, $state, Upload, $timeout, $http, $interval, uiGridConstants, $localStorage) {



        var vm = this;
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = $localStorage.menuItm.MenuID;
        //Token Generate Decleration




        // // Create and Show list Container Hide or Show Logic
        $scope.showMedium = false;
        $scope.createItem = true;

        $scope.DisBtn = function () {
            $scope.btnDis = true;
            $scope.showMedium = false;
        };

        // Reset Button Logic
        $scope.clearField = function () {
            $state.go($state.current.name, {}, { reload: true });
        };

        $scope.openMediumIndex = function (index) {
            $scope.mediumindex = index;
            $scope.mediums[$scope.mediumindex].id = $scope.mediumindex;
        };

        $scope.switch = function (e) {
            if (e === 1) {
                $scope.mediums[$scope.mediumindex].IsActive = 0;
            } else {
                $scope.mediums[$scope.mediumindex].IsActive = 1;
            }

        };

        vm.mediumReset = function () {
            $scope.mediums = [];
            $scope.showMedium = false;

        };

        vm.saveMedium = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.postMethod)); //jshint ignore : line



            var mediumsArr = [];
            if ($scope.mediums !== undefined) {
                for (var i = 0; i < $scope.mediums.length; i++) {
                    if ($scope.mediums[i].IsActive === 0 && $scope.mediums[i].InstMediumID === null) {
                        console.log('Shibli');
                    } else {
                        mediumsArr.push($scope.mediums[i]);
                    }
                }
                insmediumsetting.postinsmedium({
                    InstMediumID: null,
                    InstituteID: vm.institute.selected.InstituteID,
                    MediumID: null,
                    IsActive: 0,
                    CreateBy: 0,
                    CreateOn: '2017-01-01',
                    CreatePc: null,
                    UpdateBy: null,
                    UpdateOn: '2017-01-01',
                    UpdatePc: null,
                    IsDeleted: 0,
                    DeleteBy: null,
                    DeleteOn: '2017-01-01',
                    DeletePc: null,
                    mediumsArr: mediumsArr
                })
                    .then(function (data) {
                        logger.info('Saved!');
                        $state.go($state.current.name, {}, { reload: true });
                    })
                    .catch(function (error) { });
            } else {
                logger.error('Please Select Institute first');
            }

        };
        $scope.showMedium = false;
        vm.showmedium = function () {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            if (vm.institute === undefined || vm.institute.selected === undefined) {
                logger.error('Please select Institute');
            }
            else {
                var Params = {
                    insID: vm.institute.selected.InstituteID
                };
                insmediumsetting.getAllMediums(Params)

                    .then(function (data) {
                        $scope.mediums = data;
                        $scope.showMedium = true;
                        $scope.showMedium = true;

                    });
            }

        };

        activate();

        function activate() {
            var promises = [getAllInstitute()];
            return $q.all(promises).then(function () {
                // logger.info('Activated Order List View');
            });
        }

        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        function getAllInstitute() {


            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            return mailSettings.getAllInstitutes()
                .then(function (data) {
                    vm.institutes = data;
                    vm.instituteID = vm.InstituteID;
                    vm.institute = { selected: vm.institutes.filter(function (ob, i) { return (ob.InstituteID === vm.InstituteID); })[0] };

                });
        }

    }
})();
