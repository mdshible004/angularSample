
(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('monthlyFeeService', monthlyFeeService);

        monthlyFeeService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function monthlyFeeService($http, $q, logger, apiConfig) {
        var service = {
            getMonthlyFee:getMonthlyFee,
            getScholarship : getScholarship,
            getMonthWiseFee: getMonthWiseFee,
            getLateAndAbsent : getLateAndAbsent,
            getPreviousDue:getPreviousDue,
            setAccFeesCollection : setAccFeesCollection,
            getFeesHeadByFeesTypeID : getFeesHeadByFeesTypeID,
            getFeeByFeesId:getFeeByFeesId,
            getStudentMonthlyFeesInfo : getStudentMonthlyFeesInfo,
            getStudentYearlyFeesSummeryInfo : getStudentYearlyFeesSummeryInfo,
            getStudentAccCollectionFee : getStudentAccCollectionFee,
            getStudentAccFeesCollectionFine : getStudentAccFeesCollectionFine,
            getTotalCollectionAndTotalDue: getTotalCollectionAndTotalDue,
            getUserInfo: getUserInfo,
            getConfirmationToExecute: getConfirmationToExecute,
            getCollectionDetail: getCollectionDetail,
            setJournalDetail: setJournalDetail
        };

        return service;

        
        function getMonthlyFee(params) {
            //debugger
            return $http.get(apiConfig.host + '/getMonthlyFee/' + params.instituteID + '/' + params.shiftID + '/' + params.mediumID + '/' + params.classID + '/' + params.depertmentID + '/' + params.monthID)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getMonthWiseFee(params) {
            
            return $http.get(apiConfig.host + '/getMonthWiseFees/' + params.instituteID + '/' + params.shiftID + '/' + params.depertmentID + '/' + params.mediumID + '/' + params.classID + '/' + params.monthID + '/' + params.FromMonthID)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function getConfirmationToExecute(params) {

            return $http.get(apiConfig.host + '/getFeesGenerateConfirmation/' + params.UserID + '/'+ params.instituteID + '/' + params.shiftID + '/' + params.depertmentID + '/' + params.mediumID + '/' + params.classID + '/' + params.monthID + '/' + params.FromMonthID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getScholarship(params) {          
            return $http.get(apiConfig.host+'/getScholarship/'+params.instituteID+'/'+params.shiftID+'/'+params.depertmentID+'/'+params.mediumID+'/'+params.classID+'/'+params.studentID)
            .then(success)
            .catch(fail);
        
            function success(response) {
                return response.data;
            }
        
            function fail(error) {
                return $q.reject(error);
            }
            
        }
        function getLateAndAbsent(params) {
            
            return $http.get(apiConfig.host+'/getLateAndAbsent/'+params.instituteID)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getPreviousDue(params) {
            
            return $http.get(apiConfig.host+'/getPreviousDue/'+params.instituteID+'/'+params.shiftID+'/'+params.depertmentID+'/'+params.mediumID+'/'+params.classID+'/'+params.studentID+'/'+params.monthID)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getUserInfo(params) {

            return $http.get(apiConfig.host + '/getUserInfo/' + params.InstituteID + '/' + params.RFID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }
        function setAccFeesCollection(params) {
            
            return $http.post(apiConfig.host+'/setAccFeesCollection',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function setJournalDetail(params) {

            return $http.post(apiConfig.host + '/setJournalDetail', params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getFeesHeadByFeesTypeID(params) {
            
            return $http.get(apiConfig.host+'/getFeesHeadByFeesTypeID/'+params.instituteId+'/'+params.FeesTypeID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getFeeByFeesId(params) {
            
            return $http.get(apiConfig.host+'/getFeeByFeesId/'+params.instituteId+'/'+params.FeesHeadID+'/'+params.FeesTypeID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getStudentMonthlyFeesInfo(params) {
            
            return $http.post(apiConfig.host+'/getStudentMonthlyFeesInfo',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getStudentYearlyFeesSummeryInfo(params) {
            
            return $http.get(apiConfig.host+'/getStudentMonthlyFeesInfo/'+params.instituteId,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getStudentAccCollectionFee(params) {
            
            return $http.get(apiConfig.host+'/getStudentAccFeesCollectionFee/'+params.InstituteID+'/'+params.CollectionID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function getCollectionDetail(params) {

            return $http.get(apiConfig.host + '/getCollectionDetail/' + params.InstituteID + '/' + params.CollectionID, params)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getStudentAccFeesCollectionFine(params) {
            
            return $http.get(apiConfig.host+'/getStudentAccFeesCollectionFine/'+params.InstituteID+'/'+params.CollectionID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getTotalCollectionAndTotalDue(params) {
            
            return $http.get(apiConfig.host+'/getTotalCollectionAndTotalDue/'+params.InstituteID+'/'+params.MonthID,params)
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

// function getScholarship(params) {
    
//     return $http.get(apiConfig.host+'/getScholarship/'+params.instituteID+'/'+params.studentID+'/'+params.monthID)
//     .then(success)
//     .catch(fail);

//     function success(response) {
//         return response.data;
//     }

//     function fail(error) {
//         return $q.reject(error);
//     }
    
// }
