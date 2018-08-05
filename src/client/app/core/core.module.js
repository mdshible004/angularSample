(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngFileUpload', 'ngAnimate', 'ngSanitize', 'ngStorage',
            'blocks.exception', 'blocks.logger', 'blocks.router', 'blocks.auth',
            'ui.router', 'ngplus',
			'app.dataservice'
        ]);
})();
