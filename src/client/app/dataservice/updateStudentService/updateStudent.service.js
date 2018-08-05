(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('updateStudentService', updateStudentService);

        updateStudentService.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function updateStudentService($http, $q, logger, apiConfig) {
        var service = {
           getMonths : getMonths,
           getHrmSubWiseAtdDetail : getHrmSubWiseAtdDetail,
           getMonthlyAttendence:getMonthlyAttendence,
           getAllSubjectAtd : getAllSubjectAtd,
           postStudentBasicInfo: postStudentBasicInfo,
           getStudentBasicInfoList: getStudentBasicInfoList
            
          
        };

        return service;


         function getMonths() {
            
            return $http.get(apiConfig.host+'/getMonth')
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

         function getHrmSubWiseAtdDetail(params) {
            
            return $http.get(apiConfig.host+'/getHrmSubWiseAtdDetail/'+params.insID +'/'+params.midID+'/'+params.shiftID+'/'+params.classID+'/'+params.sectionID,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        //shid,Mid,cid,secid,monid,RFid
        function getMonthlyAttendence(params) {
            
            return $http.get(apiConfig.host+'/getStudentMonthlyDeviceAttendance/'+params.shid +'/'+params.Mid+'/'+params.cid+'/'+params.secid+'/'+params.monid+'/'+params.RFid,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        ///:shid/:Mid/:cid/:secid/:uid
        function getAllSubjectAtd(params) {
            
            return $http.get(apiConfig.host+'/getHrmSubWiseAtdByStudentID/'+params.shid +'/'+params.Mid+'/'+params.cid+'/'+params.secid+'/'+params.uid+'/'+params.date,params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
      
        // function sendMailer(params) {

        //     return $http.post(apiConfig.host + '/sendMailer', params)
        //         .then(success)
        //         .catch(fail);

        //     function success(response) {
        //         return response.data;
        //     }

        //     function fail(error) {
        //         return $q.reject(error);
        //     }

        // }


        function postStudentBasicInfo(params) {
            
            return $http.post(apiConfig.host+'/setStudentBasicInfo',params)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getStudentBasicInfoList(params) {

            return $http.post(apiConfig.host + '/getClassWiseAllStudent', params)
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
