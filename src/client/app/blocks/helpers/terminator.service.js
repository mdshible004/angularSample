(function () {
    'use strict';

    angular
        .module('app.layout')
        .factory('terminator', Terminator);

    Terminator.$inject = [];
    /* @ngInject */
    function Terminator() {
        var terminator = {
            vm: {},
            selects: [],
            note: note,
            mairala: mairala,
            rise: rise,
            destroy: destroy
        };
		return terminator;

        function note(list, choosen){
            this.vm[list] = [];
            this.vm[choosen] = {};
            this.vm[choosen]['selected'] = undefined;
            this.selects.push({
                'list': list,
                'choosen': choosen
            });
        }

        function mairala(list){
            var start = false;
            for(var i = 0; i<this.selects.length; i++){
                if( this.selects[i].list === list){ start = true; }
                if( start ){
                    this.vm[this.selects[i]['list']] = [];
                    this.vm[this.selects[i]['choosen']].selected = undefined;
                }
            }
        }
        
        function rise(vm){
            this.vm = vm;
            this.selects = [];
        }
		
        function destroy(){
            this.selects = [];
        }

    }

})();
