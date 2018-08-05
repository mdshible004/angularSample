/// <reference path="../../../../../typings/angularjs/angular.d.ts"/>
(function () {
    'use strict';

    angular
        .module('app.layout')
        .factory('filterurl', FilterUrl);

    FilterUrl.$inject = ['$filter','logger'];
    /* @ngInject */
    function FilterUrl($filter, logger) {

        var service = {
			vm: {},
			url: '',
			take: take,
			reset: reset,
			build: build,
			bindValues: bindValues,
			getVmVal: getVmVal,
            getBindedValues: getBindedValues,
			viewBinded: false,
			config:{
				defaultOffset: 0,
				defaultLimit: 10
			},

			_withList: [],
			_filterList: [],
			_nestedList: [],
            _sortList: [],
			_groupbyVal: '',
            _offsetVal: '<vm.paginationOffset>',
            _limitVal: '<vm.paginationLimit>',

			_with: _with,
            _filter: _filter,
            _nested: _nested,
            _groupby: _groupby,
            _sort: _sort,
            _offset: _offset,
            _limit: _limit
        };
		return service;


		function take( thatVM ){
            this.viewBinded = true; //jshint ignore :line         
            this.reset();//jshint ignore :line 
            this.vm = thatVM;//jshint ignore :line 
            this.vm.paginationOffset = this.config.defaultOffset;//jshint ignore :line 
            this.vm.paginationLimit = this.config.defaultLimit;//jshint ignore :line 

			this.vm.DateConfig = angular.copy({
				format: 'dd-mm-yyyy',
				onSet: function(tStamp) {

					var key, formatedDate;
					/* key => 'startDateSelected' / 'endDateSelected' (from tag's html) */
					key = this.$node.attr('selected-date').slice('3').split('.');
					/* $filter => See Angular API Docs*/
					formatedDate = $filter('date')(tStamp.select, 'yyyy-MM-dd');

					switch( key.length ){
						case 1:
						thatVM[ key[0] ] = formatedDate;
						break;

						case 2:
						thatVM[ key[0] ][ key[1] ] = formatedDate;
						break;
					}
				}
			});
            this.vm.DateConfigCopy = angular.copy(this.vm.DateConfig);//jshint ignore :line 

		}

		function reset(){
            this._withList = [];//jshint ignore :line 
            this._filterList = [];//jshint ignore :line 
            this._nestedList = [];//jshint ignore :line 
            this._groupbyVal = '';//jshint ignore :line 
            this._sortList = [];//jshint ignore :line 
            this._offsetVal = '<vm.paginationOffset>';//jshint ignore :line 
            this._limitVal = '<vm.paginationLimit>';
		}

        function _with(models) {//jshint ignore :line 
			this._withList.push( models );
		}

		function _filter( condition, column, logic, val1, val2, defaultVal ){
			var varIndex;
			if(  logic !== 'between'){
				defaultVal = val2;
				val2 = undefined;
			}
			if( val1 ){
                varIndex = val1.slice(1, -1).split('.')[1];//jshint ignore :line 
                this.vm[varIndex] = defaultVal;//jshint ignore :line 
			}

			if( val2 ){
                varIndex = val2.slice(1, -1).split('.')[1];//jshint ignore :line 
                this.vm[varIndex] = defaultVal;//jshint ignore :line 
			}

            this._filterList.push([//jshint ignore :line 
				condition,
				column,
				logic,
				val1+(val2?':'+val2:'')
			].join('|') );
		}

		function _nested( condition, model, column, logic, val1, val2, defaultVal ){
			var varIndex;
			if(  logic !== 'between'){
				defaultVal = val2;
				val2 = undefined;
			}
			if( val1 ){
				varIndex = val1.slice(1, -1).split('.')[1];
                this.vm[varIndex] = defaultVal;//jshint ignore :line 
			}

			if( val2 ){
				varIndex = val2.slice(1, -1).split('.')[1];
                this.vm[varIndex] = defaultVal;//jshint ignore :line 
			}

            this._nestedList.push([//jshint ignore :line 
				condition,
				model,
				column,
				logic,
				val1+(val2?':'+val2:'')
			].join('|') );
		}

        function _groupby(columnName) {//jshint ignore :line 
			this._groupbyVal = columnName;
		}

		function _sort( order, column ){
            this._sortList.push(order + '|' + column);//jshint ignore :line 
		}

        function _offset(varValue, varName) {//jshint ignore :line 
            this.vm.paginationOffset = varValue;//jshint ignore :line 
            this._offsetVal = varName || this._offsetVal;//jshint ignore :line 
		}

		function _limit( varValue, varName  ){
            this.vm.paginationLimit = varValue;//jshint ignore :line 
            this._limitVal = varName || this._limitVal;//jshint ignore :line 
		}

		function build() {
			var _withString = '',
				_sortString = '',
				_filterString = '',
				_nestedString = '',
				_groupbyString = '',
				_offsetString = '',
				_limitString = '',
				urlParams = [];
			this.url = '';

			if(!this.viewBinded){
				logger.error('Please use \n>>>filterurl.take(this);<<< \n at the top of the controller');
			}

			//	_with
			_withString = this._withList.join(',');
			urlParams.push( _withString ? '_with='+_withString : '' );

			// _filter
            _filterString = this.bindValues(this._filterList).join(',');//jshint ignore :line 
            urlParams.push(_filterString ? '_filter=' + _filterString : '');//jshint ignore :line 

			// _nested
            _nestedString = this.bindValues(this._nestedList).join(',');//jshint ignore :line 
            urlParams.push(_nestedString ? '_nested=' + _nestedString : '');//jshint ignore :line 

			// _groupby
            _groupbyString = this._groupbyVal;//jshint ignore :line 
            urlParams.push(_groupbyString ? '_groupby=' + _groupbyString : '');//jshint ignore :line 

			// _sort
            _sortString = this._sortList.join(',');//jshint ignore :line 
            urlParams.push(_sortString ? '_sort=' + _sortString : '');//jshint ignore :line 

			// _offset
            _offsetString = this.bindValues([this._offsetVal]);//jshint ignore :line 
            urlParams.push(_offsetString ? '_offset=' + _offsetString : '');//jshint ignore :line 

			// _limit
            _limitString = this.bindValues([this._limitVal]);//jshint ignore :line 
            urlParams.push(_limitString ? '_limit=' + _limitString : '');//jshint ignore :line 

            urlParams = urlParams.filter(function (e) { return e ? e : null; });//jshint ignore :line 
            this.url = '/?' + urlParams.join('&');//jshint ignore :line 
			return this.url;
		}

		function bindValues( parts ){
			var temParts=[],
				vmKey,
				bnList,
				tempPart;

			for(var i=0; i<parts.length; i++){
                bnList = this.getBindedValues(parts[i]);//jshint ignore :line 
				tempPart = parts[i];
				for(var j=0; j<bnList.length; j++){
					vmKey = bnList[j].slice(1,-1);
                    tempPart = tempPart.replace(bnList[j], this.getVmVal(vmKey));//jshint ignore :line 
				}
				if(typeof(tempPart) === 'string' && tempPart.indexOf('<') === -1){
					temParts.push(tempPart);
				}
			}
			return temParts;
		}

		function getVmVal(vmKey){

			var sKeys = vmKey.split('.');
			switch (sKeys.length){
				case 2:
                    if (typeof this.vm[sKeys[1]] !== 'undefined') {//jshint ignore :line 
					return this.vm[sKeys[1]];
				}
				break;

				case 3:
				if( typeof this.vm[sKeys[1]] !== 'undefined'){
					return this.vm[sKeys[1]][sKeys[2]];
				}
				break;

				case 4:
				if( typeof this.vm[sKeys[1]][sKeys[2]] !== 'undefined'){
					return this.vm[sKeys[1]][sKeys[2]][sKeys[3]];
				}

			}
			return undefined;
		}

		function getBindedValues( str ){
			var gt = str.match('<');
			var lt = str.match('>');

			if( (gt && lt) && gt.length!==lt.length ){
				console.error('Count: (<) and Count: (>) is not equal.');
				console.warn('Therefore binded values could not be injected');
				return;
			}

			var mid=[], b1, b2, varName, vmVal, sKeys;
			while( str.indexOf('<') !== -1 && str.indexOf('>') !== -1 ){
				b1 = str.indexOf('<');
				b2 = str.indexOf('>');
				varName = str.substring(b1+1, b2);
				sKeys = varName.split('.');
				//this.vm[varName]
				switch (sKeys.length){
					case 2:
					vmVal = this.vm[sKeys[1]];
					break;

					case 3:
					if( this.vm[sKeys[1]] ){
						vmVal = this.vm[sKeys[1]][sKeys[2]];
					}
					break;

					case 4:
					if( this.vm[sKeys[1]][sKeys[2]] ){
						vmVal = this.vm[sKeys[1]][sKeys[2]][sKeys[3]];
					}
					break;

				}
				if( ['',undefined,null].indexOf( vmVal ) === -1 ){
					mid.push( '<'+varName+'>' );
				}
				str = str.substring(b2+1);
			}
			return mid;
		}
	}

})();

/**
EXAMPLE
* vm.salad = 'tomato';

filterurl._with( 'abalchoda' );
filterurl._with( ['bokachoda', 'chagolchoda'] );

filterurl._filter('and', 'column1', 'eq', '<vm.salad>');
filterurl._filter('or', 'column2', 'between', 10, 20);

filterurl._nested('and', 'payments', 'payment_type', 'eql', '<vm.paymentMethod.selected.id>', {selected:undefined});
filterurl._nested('or', 'payments', 'payment_type', 'between', '<vm.paymentMethod.selected.id>', '<vm.paymentMethod.selected.id>',{selected:undefined});

filterurl._sort('asc', 'col1');
filterurl._sort('desc', 'col2');

filterurl._offset(0);
filterurl._limit(5);
filterurl._limit(5, '<vm.paginationLimit>');

console.log( filterurl.build() );
 */
