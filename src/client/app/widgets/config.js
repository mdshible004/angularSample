(function () {
    'use strict';

	var module = angular.module('app.widgets');

    module.config(function (uiGmapGoogleMapApiProvider) {
		uiGmapGoogleMapApiProvider.configure({
			key: 'AIzaSyASBRkofSm8-LZ2W1FuSYc0CK0uCklxmhw',
			v: '3.23'
		});
	});

    // var core = angular.module('app.reconcile');

    /* cg-busy defaults
	core.value('cgBusyDefaults',{
		message:'Digging into Database..',
		backdrop: false,
		templateUrl: 'my_custom_template.html',
		delay: 300,
		minDuration: 700,
		wrapperClass: 'my-class my-class2'
	});
	*/


})();
