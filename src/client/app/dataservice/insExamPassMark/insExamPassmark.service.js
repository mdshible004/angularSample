(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('passMarksSetUp', passMarksSetUp);

        passMarksSetUp.$inject = ['$http', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function passMarksSetUp($http, $q, logger, apiConfig) {
        var service = {
            // getInstituteId:getInstituteId,
            // getAllExames:getAllExames,
            // postinsexame:postinsexame,
            // getAllGrade:getAllGrade,
            // postinsgrade:postinsgrade
            getExamPassMarks:getExamPassMarks
        };

        return service;



   

        function getExamPassMarks(params) {
            
            return $http.get(apiConfig.host+'/getExamPassMark/'+params.InstituteID,params)
            .then (success)
            .catch (fail);

			function success(response) {
				return response.data;
			}

			function fail(error) {
				return $q.reject(error);
			}
            
        }



        
        

    }
})();