(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('exameRoutineEntry', exameRoutineEntry);

        exameRoutineEntry.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function exameRoutineEntry($http, $q, logger, apiConfig) {
        var service = {
            postExameRoutineDetail:postExameRoutineDetail,
            getInsExameRoutine:getInsExameRoutine,
            getInsExameRoutineAll:getInsExameRoutineAll,
            postSection:postSection,
            IsdeleteExamRoutineByID: IsdeleteExamRoutineByID,
            getInsExameRoutineMaster: getInsExameRoutineMaster
            
        };

        return service;

   

        function postExameRoutineDetail(params) {
            
            return $http.post(apiConfig.host+'/setExameRoutine',params)
            .then(success)  
            .catch(fail) ;
        
            function success(response) {
                return response.data;
            }
        
            function fail(error) {
                return $q.reject(error);
            }
            
        }


        function getInsExameRoutine(params) {
            
            return $http.get(apiConfig.host+'/getExameRounine/'+params.InstituteID)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }
        function getInsExameRoutineMaster(params) {

            return $http.get(apiConfig.host + '/getExameRounineMaster/' + params.InstituteID + '/' + params.ExamRoutineID)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                return $q.reject(error);
            }

        }

        function getInsExameRoutineAll(params) {
            return $http.get(apiConfig.host+'/getExameRoutineDetail/'+params.InstituteID+'/'+params.ExamRoutineID)
            .then(success)
            .catch(fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }

        function postSection(params) {
            
            return $http.post(apiConfig.host+'/getCmnSection',params)
            .then(success)  
            .catch(fail) ;
        
            function success(response) {
                return response.data;
            }
        
            function fail(error) {
                return $q.reject(error);
            }
            
        }

        function IsdeleteExamRoutineByID(params) {
            
            return $http.delete(apiConfig.host+'/deleteExamRoutineByID/'+params.ExamRoutineID,params)
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



