(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('OpeningjournalService', OpeningjournalService);

    OpeningjournalService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function OpeningjournalService($http, $q, logger, apiConfig) {
        var service = {

            getVoucherList: getVoucherList,
            getCurrencyList: getCurrencyList,
            getCOAList: getCOAList,
            getPartyList: getPartyList,
            InsertJournalDataWithDetails: InsertJournalDataWithDetails,
            getBankAccountList: getBankAccountList,
            getBranchList: getBranchList,
            getAccLedgVoucher: getAccLedgVoucher,
            setPaymentReceiveVoucherRecord: setPaymentReceiveVoucherRecord,
            getPaymentVoucher: getPaymentVoucher,
            getReceiveVoucher: getReceiveVoucher,
            spGetAccJournalDetailsForPrint: spGetAccJournalDetailsForPrint,
            AccChartOfAccountParentDDL: AccChartOfAccountParentDDL,
            AccChartOfAccountByCOAMultiSelect: AccChartOfAccountByCOAMultiSelect,
            spGetAccJournalDetailByCOAIDForMultiCheck: spGetAccJournalDetailByCOAIDForMultiCheck,
            GetAccJournalMasterForOpeningBalance: GetAccJournalMasterForOpeningBalance

        };

        return service;

        function GetAccJournalMasterForOpeningBalance(param) {

            return $http.post(apiConfig.host + '/GetAccJournalMasterForOpeningBalance', param)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function spGetAccJournalDetailByCOAIDForMultiCheck(param) {

            return $http.post(apiConfig.host + '/GetAccJournalDetailByCOAIDForMultiCheck', param)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }

        function AccChartOfAccountParentDDL(params) {

            return $http.get(apiConfig.host + '/GetAccChartOfAccountParentDDL/' + params.InstituteID, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function AccChartOfAccountByCOAMultiSelect(params) {

            return $http.get(apiConfig.host + '/GetAccChartOfAccountByCOAMultiSelect/' + params.InstituteID + '/' + params.COAID, params)
                .then (success)
                .catch (fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }



           function spGetAccJournalDetailsForPrint(params) {
            
            return $http.get(apiConfig.host+'/spGetAccJournalDetailsForPrint/'+ params.JournalID + '/' + params.InstituteID,params)
            .then (success)
            .catch (fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }


        function setPaymentReceiveVoucherRecord(params) {
            
            return $http.post(apiConfig.host + '/setPaymentReceiveVoucher', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getAccLedgVoucher(params) {
            return $http.get(apiConfig.host + '/getAccLedgerVouch/' + params.InstituteID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getVoucherList() {

            return $http.get(apiConfig.host + '/getAllVoucher')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getCurrencyList() {

            return $http.get(apiConfig.host + '/getAllCurrency')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getCOAList() {

            return $http.get(apiConfig.host + '/getAllChartOfAccounts')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getPartyList() {

            return $http.get(apiConfig.host + '/getAllUser')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function InsertJournalDataWithDetails(FuncName, params) {

            return $http.post(apiConfig.host + FuncName, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getBankAccountList() {

            return $http.get(apiConfig.host + '/getAccBankAccount')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getBranchList(param) {

            return $http.post(apiConfig.host + '/getAllBranch', param)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        function getPaymentVoucher(params) {


            return $http.get(apiConfig.host + '/getPaymentVoucher/' + params.instituteId + '/' + params.p2 + '/' + params.p3, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }
        }


        
        function getReceiveVoucher(params) {

            //debugger;
            return $http.get(apiConfig.host + '/getReceiveVoucher/' + params.instituteId + '/' + params.p2 + '/' + params.p3+ '/' + params.LoggedUserID+ '/' + params.pageNumber+ '/' + params.pageSize+ '/' + params.IsPaging+ '/' + params.SearchProperty, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }


        }
        

    }

})();
