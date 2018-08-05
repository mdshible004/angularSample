(function () {
    'use strict';

    angular
        .module('app.dataservice')
        .factory('conversion', conversion);

    conversion.$inject = ['$http', '$filter', '$q', 'logger', 'apiConfig'];
    /* @ngInject */
    function conversion($http, $filter, $q, logger, apiConfig) {
        var service = {
            getStringToDate: getStringToDate,
            getDateToString: getDateToString,
            fullDateToFormattedDate: fullDateToFormattedDate,
            dateCalculationInDays: dateCalculationInDays,
            //TimeDifferentInMinutes: TimeDifferentInMinutes,
            getMinutesBetweenDates: getMinutesBetweenDates,
            dateCalculationInDate: dateCalculationInDate,
            getDateTimeToTimeSpan: getDateTimeToTimeSpan,
            NowDateCustom: NowDateCustom,
            NowDateDefault: NowDateDefault,
            getDateFromDateTimeSpan: getDateFromDateTimeSpan,
            cmnParams: cmnParams,
            roundNumber: roundNumber,
            NowTime: NowTime,
            GetDateTimeFromTime: GetDateTimeFromTime,
            ChangeDateTime: ChangeDateTime,
            rowTemplate: rowTemplate,
            cellTemplate: cellTemplate,
            DateTimeNow: DateTimeNow,
            DateTimeNow_AddDay: DateTimeNow_AddDay,
            DateTimeNow_AddHour: DateTimeNow_AddHour,
            DateTimeNow_AddMinutes: DateTimeNow_AddMinutes
        };

        return service;

        function getStringToDate(InputString) {
            //debugger
            var newStringToDate = InputString.replace(/[/-]/g, '-');
            var StringToDate = newStringToDate;
            var SplitedDate = StringToDate.split('-');
            var Day = SplitedDate[0];
            var Month = SplitedDate[1];
            var Year = SplitedDate[2];
            var FullFormateDate = Month + '-' + Day + '-' + Year;
            var Output = $filter('date')(new Date(), FullFormateDate);
            return Output;
        }

        function getDateToString(InputDate) {
            //debugger
            var DateToString = InputDate;
            var SplitedDate = DateToString.split('-');
            var Year = SplitedDate[0];
            var Month = SplitedDate[1];
            var Day = SplitedDate[2].split('T');
            var Output = Day[0] + '/' + Month + '/' + Year;
            return Output;
        }

        function fullDateToFormattedDate(value) {

            var month = value.getMonth();
            var newmonth = month + 1;
            var newDate = newmonth + '-' + value.getDate() + '-' + value.getFullYear();
            return newDate;
        }

        function dateCalculationInDays(firstdate, seconddate) {
            //debugger
            var dtFirst = firstdate;
            var dtSecond = seconddate;

            var dtFirstSplit = dtFirst.split('-'),
                dtSecondSplit = dtSecond.split('-'),

                dtFirstNew = new Date(dtFirstSplit[2], dtFirstSplit[1], dtFirstSplit[0]),
                dtSecondNew = new Date(dtSecondSplit[2], dtSecondSplit[1], dtSecondSplit[0]);

            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            var millisBetween = dtSecondNew.getTime() - dtFirstNew.getTime();
            var days = millisBetween / millisecondsPerDay;

            return Math.floor(days);
        }

        //function TimeDifferentInMinutes(start, end) {//Not applicable
        //    //debugger
        //    return moment.utc(moment(end).diff(moment(start))).format('mm'); //jshint ignore : line
        //}

        function getMinutesBetweenDates(startDate, endDate) {
            //debugger
            var diff = startDate.getTime() - endDate.getTime();
            return (diff / 60000);
        }
        // //************************************End Minutes Different between two time (Minute)************************

        function dateCalculationInDate(firstdate, seconddate) {//Not Completed
            //debugger
            var dtFirst = firstdate;
            var dtSecond = seconddate;

            var dtFirstSplit = dtFirst.split('-'),
                dtSecondSplit = dtSecond.split('-'),

                dtFirstNew = new Date(dtFirstSplit[2], dtFirstSplit[1], dtFirstSplit[0]),
                dtSecondNew = new Date(dtSecondSplit[2], dtSecondSplit[1], dtSecondSplit[0]);

            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            var millisBetween = dtSecondNew.getTime() - dtFirstNew.getTime();
            var days = millisBetween / millisecondsPerDay;

            var day = Math.floor(days);

            return day;
        }

        function getDateTimeToTimeSpan(InputDate) {
            //debugger
            var DateToString = InputDate;
            var SplitedDate = DateToString.split('-');
            var Year = SplitedDate[0];
            var Month = SplitedDate[1] - 1;
            var Days = SplitedDate[2].split('T');
            var Day = Days[0];
            var Times = Days[1].split(':');
            var Hour = Times[0];
            var Minute = Times[1];

            var OutputTime = new Date(Year, Month, Day, Hour, Minute, 0);

            return OutputTime;
        }

        function getDateFromDateTimeSpan(InputDate) {

            var OutputTime = ('0' + (InputDate.getMonth() + 1)).slice(-2) + '/' + ('0' + InputDate.getDate()).slice(-2) + '/' + InputDate.getFullYear();
            return OutputTime;
        }

        // this.get24HourFromPM = function (InputTime) {
        //     //debugger
        //     var TimeString = InputTime;
        //     var SplitedTime = TimeString.split(':');
        //     var Hour = SplitedTime[0];
        //     var Minutess = SplitedTime[1];
        //     var Minutes = Minutess.split(' ');
        //     var Minute = Minutes[0];
        //     var AMPM = Minutes[1];

        //     if (AMPM == 'PM') {
        //         Hour = parseInt(Hour) == 12 ? 12 : (parseInt(Hour) + parseInt(12));
        //     }
        //     else {
        //         Hour = parseInt(Hour) == 12 ? 00 : Hour;
        //     }
        //     var Output24 = ('0' + Hour).slice(-2) + ':' + ('0' + Minute).slice(-2);
        //     return Output24;
        // }

        // this.get12HourFrom24 = function (InputTime) {
        //     //debugger
        //     var TimeString = InputTime;
        //     var SplitedTime = TimeString.split(':');
        //     var Hour = SplitedTime[0];
        //     var Minute = SplitedTime[1];
        //     var AMPM = '';
        //     if (parseInt(Hour) > 11) {
        //         Hour = parseInt(Hour) == 12 ? 12 : (parseInt(Hour) - parseInt(12));
        //         AMPM = 'PM';
        //     }
        //     else {
        //         Hour = parseInt(Hour) == 0 ? 12 : Hour;
        //         AMPM = 'AM';
        //     }
        //     var Output12 = ('0' + Hour).slice(-2) + ':' + ('0' + Minute).slice(-2) + ' ' + AMPM;
        //     return Output12;
        // }

        function NowTime() {
            //debugger
            var Dates = new Date();
            var todayD = '01';
            var todayMon = '00';
            var todayY = '1900';
            var todayH = Dates.getHours();
            var todayMin = Dates.getMinutes();

            var Nowtime = new Date(todayY, todayMon, todayD, todayH, todayMin, 0);
            return Nowtime;
        }

        function GetDateTimeFromTime(time) {
            var tArray = time.split(':');
            var Dates = new Date();
            var todayD = '01';
            var todayMon = '00';
            var todayY = '1900';
            var todayH = tArray[0];
            var todayMin = tArray[1];
            var Nowtime = new Date(todayY, todayMon, todayD, todayH, todayMin, 0);
            return Nowtime;
        }

        function ChangeDateTime(IsTrue, Hour, Minute) {
            //debugger
            var ChangeY = 1900;
            var ChangeMon = 0;
            var ChangeD = IsTrue === true ? 2 : 1;
            var Day = ChangeD;
            var ChangeH = Hour;
            var ChangeMin = Minute;

            var ChangedTime = new Date(ChangeY, ChangeMon, Day, ChangeH, ChangeMin, 0);
            return ChangedTime;
        }

        function NowDateCustom() {
            var date = new Date();
            var Nowdate = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
            return Nowdate;
        }

        function NowDateDefault() {
            //debugger
            var date = new Date();
            var Nowdate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            return Nowdate;
        }

        function DateTimeNow() {
            //debugger
            var date = new Date();
            var setdatetiem = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
            return setdatetiem;
        }

        function DateTimeNow_AddHour(Hour) {
            //debugger
            var date = new Date();
            var setdatetiem = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + Hour, date.getMinutes());
            return setdatetiem;
        }

        function DateTimeNow_AddMinutes(Minutes) {
            //debugger
            var date = new Date();
            var setdatetiem = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + Minutes);
            return setdatetiem;
        }

        function DateTimeNow_AddDay(Day) {
            //debugger
            var date = new Date();
            var setdatetiem = new Date(date.getFullYear(), date.getMonth(), date.getDate() + Day, date.getHours(), date.getMinutes());
            return setdatetiem;
        }

        // this.UnlimitedSplite = function (Input) {
        //     //debugger
        //     var ArrayItem = [];

        //     var InputItem = Input;
        //     var SplitedItem = InputItem.split(':');
        //     for (var s = 0; s < SplitedItem.length; s++) {
        //         ArrayItem.push({ Items: SplitedItem[s] });
        //     }
        //     //debugger
        //     return ArrayItem;
        // }

        function roundNumber(number, precision) {
            //debugger
            precision = Math.abs(parseInt(precision)) || 0;
            var multiplier = Math.pow(10, precision);
            return (Math.round(number * multiplier) / multiplier);
        }

        // this.setMaxMin = function (setNum, min, max) {
        //     //debugger
        //     if (angular.isUndefined(setNum) || setNum == null || setNum < min) {
        //         setNum = min;
        //     }
        //     if ((!angular.isUndefined(setNum) || setNum != '' || setNum != null) && (max != 0 && setNum > max)) {
        //         setNum = max;
        //     }
        //     var setnums = setNum.toString();
        //     setnums = setnums.replace(/[-]/g, '');
        //     return parseInt(setnums);
        // }

        function cmnParams(localStorage) {
            //debugger
            var cmnParam = {};
            cmnParam = {
                pageNumber: 1,
                pageSize: 15,
                IsPaging: 0,
                LoggedUserID: localStorage.userInfo[0].UserID,
                InstituteID: localStorage.userInfo[0].InstituteID,
                BranchID: localStorage.userInfo[0].BrunchID,
                menuId: null,
                tTypeId: null,
                DepartmentID: null,
                ItemType: 0,
                ItemGroup: 0,
                id: 0,
                ParamName: '',
                NotiStatus: 'Created',
                CompanyShortName: '',
                SaveOrUpdate: '',
                IsTrue: false,
                IsMail: false,
                IsApproved: false,
                Amount: null,
                UserType: 0,
                selectedCompany: 0,
                SearchProperty: '',
                FromDate: null,
                ToDate: null
            };
            return cmnParam;
        }

        function rowTemplate() {
            var rowTemplate = '<div ng-dblclick="grid.appScope.editModels(row.entity)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>';
            return rowTemplate;
        }

        function cellTemplate() {
            var cellTemplate = //'<button class="label label-info label-mini" style="background-color:#0aa699">' +
                //'<a href="javascript:void(0);" data-toggle="modal" class="bs-tooltip" title="View Info" ng-click="grid.appScope.editModels(row.entity)">' +
                //'<i class="glyphicon glyphicon-eye-open" aria-hidden="true">&nbsp;View</i> </a> </button>' +

                '<button data-toggle="modal" style="background-color:#0aa699; color-white" class="label label-info label-mini" title="Edit Info" ng-click="grid.appScope.editModels(row.entity)">' +
                '<i class="fa fa-edit" aria-hidden="true">&nbsp;Edit</i></button>' +

                '<button class="label label-danger label-mini" data-toggle="modal" class="bs-tooltip" style="background-color:brown; color:white" title="Delete" ng-click="grid.appScope.deleteModels(row.entity)">' +
                '<i class="fa fa-trash" aria-hidden="true">&nbsp;Delete</i></button>';

            return cellTemplate;
        }
    }

})();
