(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('dashBoardController', dashBoardController);

    dashBoardController.$inject = ['monthlyFeeService', 'commonService', 'classSettingsService', '$q', 'authservice', 'logger', '$scope', '$rootScope', '$localStorage', '$state', '$compile'];
    /* @ngInject */
    function dashBoardController(monthlyFeeService, commonService, classSettingsService, $q, authservice, logger, $scope, $rootScope, $localStorage, $state, $compile) {

        var vm = this;//jshint ignore : line
        //Token Generate Decleration
        vm.LoggedUserID = $localStorage.userInfo[0].UserID;
        vm.InstituteID = $localStorage.userInfo[0].InstituteID;
        vm.UserTypeID = $localStorage.userInfo[0].UserTypeID;
        vm.getMethod = 'GET';
        vm.postMethod = 'POST';
        vm.putMethod = 'PUT';
        vm.deleteMethod = 'DELETE';
        vm.menuId = 1;
        //Token Generate Decleration
        vm.MediumID = $localStorage.userInfo[0].MediumID;
        vm.ClassID = $localStorage.userInfo[0].ClassID;
        vm.DepartmentID = $localStorage.userInfo[0].DepartmentID === null ? $localStorage.userInfo[0].SDepartmentID : $localStorage.userInfo[0].DepartmentID;
        vm.ShiftID = $localStorage.userInfo[0].ShiftID;
        vm.SectionID = $localStorage.userInfo[0].SectionID;
        vm.DayID = 1;
        vm.UserInfoList = [];
        vm.title = 'Dashboard';
        vm.abc = $localStorage;
        vm.b = $state.current.name;
        vm.RoutinDetail = [];
        //vm.LoggedUserID = 11112850; //11112850, 11112849
        //vm.UserTypeID = 4;            

        $scope.item = 0;
        //-------------------- slider script start ---------------------//
        var carousel = document.getElementById('carousel');
        var slides = 3;
        var speed = 100000; // 5 seconds

        function carouselHide(num) {
            //debugger;
            indicators[num].setAttribute('data-state', '');
            slides[num].setAttribute('data-state', '');

            slides[num].style.opacity = 0;
        }

        function carouselShow(num) {
            //debugger;
            indicators[num].checked = true;
            indicators[num].setAttribute('data-state', 'active');
            slides[num].setAttribute('data-state', 'active');

            slides[num].style.opacity = 1;
        }

        function setSlide(slide) {
            //debugger;
            return function () {
                // Reset all slides
                for (var i = 0; i < indicators.length; i++) {
                    indicators[i].setAttribute('data-state', '');
                    slides[i].setAttribute('data-state', '');

                    carouselHide(i);
                }

                // Set defined slide as active
                indicators[slide].setAttribute('data-state', 'active');
                slides[slide].setAttribute('data-state', 'active');
                carouselShow(slide);

                // Stop the auto-switcher
                clearInterval(switcher);
            };
        }

        function switchSlide() {
            //debugger;
            var nextSlide = 0;

            // Reset all slides
            for (var i = 0; i < indicators.length; i++) {
                // If current slide is active & NOT equal to last slide then increment nextSlide
                if ((indicators[i].getAttribute('data-state') === 'active') && (i !== (indicators.length - 1))) {
                    nextSlide = i + 1;
                }

                // Remove all active states & hide
                carouselHide(i);
            }

            // Set next slide as active & show the next slide
            carouselShow(nextSlide);
        }

        if (carousel) {
            var slides = carousel.querySelectorAll('.slide');  //jshint ignore :line 
            var indicators = carousel.querySelectorAll('.indicator'); //jshint ignore :line 

            var switcher = setInterval(function () { //jshint ignore :line 
                switchSlide();
            }, speed);

            for (var i = 0; i < indicators.length; i++) {
                indicators[i].addEventListener('click', setSlide(i)); //jshint ignore :line 
            }
        }
        //-------------------- slider script end ---------------------//

        //CurrentDate Logic
        $scope.CurrentDate = new Date();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        $scope.OnDate = today;
        vm.Month = mm;

        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize
            }
        };

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'Hungarian';
        /* event source that pulls from google.com */
        $scope.eventSource = {
            url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic',
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
        };
        /* event source that contains custom events on the scope */
        $scope.events = [
            { title: 'All Day Event', start: new Date(y, m, 1) },
            { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
            { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
            { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
            { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
            { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
        ];
        /* event source that calls a function on every view switch */
        $scope.eventsF = function (start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{ title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed'] }];
            callback(events);
        };

        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            events: [
                { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
            ]
        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function (date, jsEvent, view) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };
        /* alert on Drop */
        $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function (sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function (value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
        /* add custom event*/
        $scope.addEvent = function () {
            $scope.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
            });
        };
        /* remove event */
        $scope.remove = function (index) {
            $scope.events.splice(index, 1);
        };
        /* Change View */
        var uiCalendarConfig;
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        // $scope.renderCalendar = function(calendar) {
        //   $timeout(function() {
        //     if(uiCalendarConfig.calendars[calendar]){
        //       uiCalendarConfig.calendars[calendar].fullCalendar('render');
        //     }
        //   });
        // };
        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };

        $scope.changeLang = function () {
            if ($scope.changeTo === 'Hungarian') {
                $scope.uiConfig.calendar.dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
                $scope.uiConfig.calendar.dayNamesShort = ['Vas', 'Hét', 'Kedd', 'Sze', 'Csüt', 'Pén', 'Szo'];
                $scope.changeTo = 'English';
            } else {
                $scope.uiConfig.calendar.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                $scope.uiConfig.calendar.dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                $scope.changeTo = 'Hungarian';
            }
        };
        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

        // Tabable Routin
        $scope.tab = 1;
        $scope.setTab = function (DayID) {
            $scope.tab = DayID;
            vm.DayID = DayID;
            if (vm.UserTypeID === 4) {
                $scope.getTeacherPeriod();
            }
            else {
                $scope.getStudentPeriod();
            }
        };
        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };

        $scope.spSetToDayAndToMonthsExpense = function () {
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            commonService.spSetToDayAndToMonthsExpense()
                .then(function (data) {
                    //debugger;
                    $scope.ToDaysExpense = data[0].ToDaysExpense;
                    $scope.ToMonthsExpense = data[0].ToMonthsExpense;
                });
        };
        $scope.spSetToDayAndToMonthsExpense();

        $scope.getStudentInfo = function () {
            var params = {
                InstituteID: vm.InstituteID,
                LoggedUserID: vm.LoggedUserID
            };

            classSettingsService.getDashUserInfo(params)
                .then(function (data) {
                    vm.UserInfoList = data;

                    vm.MediumID = data[0].MediumID;
                    vm.ClassID = data[0].ClassID;
                    vm.DepartmentID = data[0].DepartmentID;
                    vm.ShiftID = data[0].ShiftID;
                    vm.SectionID = data[0].SectionID;

                    $scope.getStudentPeriod();
                });
        };

        $scope.getStudentPeriodByddl = function (UserID) {
            if (UserID !== undefined) {
                var model = vm.UserInfoList.filter(function (ob, i) { return (ob.UserID === UserID); })[0];
                vm.MediumID = model.MediumID;
                vm.ClassID = model.ClassID;
                vm.DepartmentID = model.DepartmentID;
                vm.ShiftID = model.ShiftID;
                vm.SectionID = model.SectionID;
                vm.RoutinDetail = [];
                $scope.getStudentPeriod();
            }
            else {
                vm.RoutinDetail = [];
            }
        };

        $scope.getStudentPeriod = function () {
            //vm.MediumID = 1142;
            //vm.ClassID = 1;
            //vm.DepartmentID = 1;
            //vm.ShiftID = 1195;
            //vm.SectionID = 1;

            var params = {
                MediumID: vm.MediumID,
                ClassID: vm.ClassID,
                DepartmentID: vm.DepartmentID,
                ShiftID: vm.ShiftID,
                InstituteID: vm.InstituteID, //$localStorage.userInfo[0].InstituteID,
                SectionID: vm.SectionID,
                DayID: vm.DayID
            };
            classSettingsService.getDashClassRoutine(params)
                .then(function (data) {
                    vm.RoutinDetail = [];
                    angular.forEach(data, function (row) {
                        vm.RoutinDetail.push(
                            {
                                'PeriodName': row.PeriodName,
                                'TeacherName': row.TeacherName,
                                'SubjectName': row.SubjectName,
                                'StartTime': row.StartTime,
                                'EndTime': row.EndTime
                            }
                        );
                    });
                });
        };

        $scope.getTeacherPeriod = function () {
            var params = {
                LoggedUserID: vm.LoggedUserID,
                InstituteID: vm.InstituteID,
                DayID: vm.DayID
            };
            classSettingsService.getDashTeacherClassRoutine(params)
                .then(function (data) {
                    vm.RoutinDetail = [];
                    angular.forEach(data, function (row) {
                        vm.RoutinDetail.push(
                            {
                                'PeriodName': row.PeriodName,
                                'TeacherName': row.TeacherName,
                                'SubjectName': row.SubjectName,
                                'StartTime': row.StartTime,
                                'EndTime': row.EndTime,
                                'ClassName': row.ClassName
                            }
                        );
                    });
                });
        };

        $scope.loadModalWithBody = function (model) {
            $scope.NoticeHead = model.NoticeHead;
            $scope.NoticeBody = model.NoticeBody;
        };

        $scope.NoticeHeadBodyList = [{ NoticeClass: '', NoticeList: [] }];
        $scope.getAllNotice = function () {
            var params = {
                LoggedUserTypeID: vm.UserTypeID,
                InstituteID: vm.InstituteID
            };
            classSettingsService.spGetDashNotice(params)
                .then(function (data) {
                    //debugger;
                    vm.NoticeList = [];
                    if (data.length > 0) {
                        vm.NoticeList = data;
                        angular.forEach(vm.NoticeList, function (row, index) {
                            row.SLID = index + 1;
                        });

                        if (vm.NoticeList.length > 0) {
                            var count = 4;
                            var loopCount = Math.ceil(vm.NoticeList.length / count);
                            var getcount = 0;
                            var PrevIndex = 0;

                            for (var i = 0; i < loopCount; i++) {
                                if (getcount === 0) {
                                    $scope.NoticeHeadBodyList[getcount].NoticeClass = 'active';
                                    $scope.NoticeHeadBodyList[getcount].NoticeList = vm.NoticeList.filter(function (ob, i) {
                                        return (ob.SLID > PrevIndex && ob.SLID <= count);
                                    });
                                    PrevIndex = count;
                                    count += $scope.NoticeHeadBodyList[getcount].NoticeList.length;
                                    getcount += 1;
                                }
                                //else {
                                //    $scope.NoticeHeadBodyList.push({ NoticeClass: '', NoticeList: [] });
                                //    $scope.NoticeHeadBodyList[getcount].NoticeClass = '';
                                //    $scope.NoticeHeadBodyList[getcount].NoticeList = vm.NoticeList.filter(function (ob, i) { return (ob.SLID > PrevIndex && ob.SLID <= count); });
                                //    PrevIndex = count;
                                //    count += $scope.NoticeHeadBodyList[getcount].NoticeList.length;
                                //    getcount += 1;
                                //}
                            }

                        }
                    }
                });
        };

        $scope.NStartPosition = 0;
        $scope.NEndingPosition = 4;
        $scope.HoldNStartPosition = 0;
        $scope.HoldNEndingPosition = 4;
        $scope.NextNotice = function () {
            //debugger;
            if (vm.NoticeList.length > 0) {
                $scope.HoldNStartPosition = $scope.NStartPosition;
                $scope.HoldNEndingPosition = $scope.NEndingPosition;

                $scope.NStartPosition += 4;
                $scope.NEndingPosition += 4;
                if ($scope.NStartPosition <= vm.NoticeList.length) {
                    $scope.NoticeHeadBodyList[0].NoticeClass = 'active';
                    $scope.NoticeHeadBodyList[0].NoticeList = vm.NoticeList.filter(function (ob, i) {
                        return (ob.SLID > $scope.NStartPosition && ob.SLID <= $scope.NEndingPosition);
                    });
                }
                else {
                    $scope.NStartPosition = $scope.HoldNStartPosition;
                    $scope.NEndingPosition = $scope.HoldNEndingPosition;
                }
            }
        };

        $scope.PrevNotice = function () {
            //debugger;
            if (vm.NoticeList.length > 0) {
                $scope.HoldNStartPosition = $scope.NStartPosition;
                $scope.HoldNEndingPosition = $scope.NEndingPosition;

                $scope.NStartPosition -= 4;
                $scope.NEndingPosition -= 4;

                if ($scope.NStartPosition >= 0) {
                    $scope.NoticeHeadBodyList[0].NoticeClass = 'active';
                    $scope.NoticeHeadBodyList[0].NoticeList = vm.NoticeList.filter(function (ob, i) {
                        return (ob.SLID > $scope.NStartPosition && ob.SLID <= $scope.NEndingPosition);
                    });
                }
                else {
                    $scope.NStartPosition = $scope.HoldNStartPosition;
                    $scope.NEndingPosition = $scope.HoldNEndingPosition;
                }
            }
        };

        //***********************************************************Custom Calendar**************************************************************
        $scope.getDates = new Date();
        $scope.ToDay = $scope.getDates.getDate();
        $scope.ToMonth = $scope.getDates.getMonth() + 1;
        $scope.ToYear = $scope.getDates.getFullYear();
        $scope.ToDate = (('0' + $scope.ToMonth).slice(-2) + '-' + ('0' + $scope.ToDay).slice(-2) + '-' + $scope.ToYear).toString();
        $scope.ToMonthName = '';
        $scope.ToYearName = '';
        $scope.HoldMonth = $scope.ToMonth;
        $scope.HoldYear = $scope.ToYear;


        $scope.CalendarDayNameList = [{ DayID: 1, DayName: 'Saturday' }, { DayID: 2, DayName: 'Sunday' }, { DayID: 3, DayName: 'Monday' }, { DayID: 4, DayName: 'Tuesday' }, { DayID: 5, DayName: 'Wednesday' }, { DayID: 6, DayName: 'Thursday' }, { DayID: 7, DayName: 'Friday' }];
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        $scope.CalendarDateList = [];
        $scope.DaySeriesSetupList = [];
        $scope.SeriesModel = '';
        $scope.getCalendarList = function (StartDate, EndDate) {
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line
            var params = {
                StartDate: StartDate,
                EndDate: EndDate,
                InstituteID: vm.InstituteID
            };
            commonService.spGetDashBoardCalendar(params)
                .then(function (data) {
                    //debugger;                    
                    if (data.length > 0) {
                        $scope.CalendarDateList = [];
                        $scope.ToMonthName = monthNames[$scope.ToMonth - 1];
                        $scope.ToYearName = $scope.ToYear.toString();

                        $scope.DaySeriesSetupList = data;
                        var IncDays = 1;
                        $scope.SeriesModel = '';
                        for (var i = 0; i <= 5; i++) {
                            $scope.CalendarDateList.push({
                                DaysSeries: []
                            });
                            $scope.SeriesModel = $scope.CalendarDateList[i].DaysSeries;

                            angular.forEach($scope.CalendarDayNameList, function (row) {
                                var DayModel = $scope.DaySeriesSetupList.filter(function (js, j) { return (js.DayName === row.DayName && js.Day === IncDays); })[0];

                                if (DayModel === undefined) {
                                    $scope.SeriesModel.push({
                                        Date: null,
                                        CDate: null,
                                        Day: '',
                                        DayName: '',
                                        Month: '',
                                        MonthName: '',
                                        Year: '',
                                        IsHoliday: false,
                                        IsWeekend: false,
                                        IsEvent: false,
                                        IsEventClassOff: false,
                                        IsDayOff: 0,
                                        HolidayDetail: '',
                                        HoliName: '',
                                        HoliDetail: '',
                                        HoliShow: '',
                                        WeekendName: '',
                                        EventDetail: '',
                                        EveName: '',
                                        EveDetail: '',
                                        EveShow: '',
                                        EventDuration: ''
                                    });
                                }
                                else {
                                    $scope.SeriesModel.push({
                                        Date: DayModel.Date,
                                        CDate: DayModel.CDate,
                                        Day: DayModel.Day,
                                        DayName: DayModel.DayName,
                                        Month: DayModel.Month,
                                        MonthName: DayModel.MonthName,
                                        Year: DayModel.Year,
                                        IsHoliday: DayModel.IsHoliday,
                                        IsWeekend: DayModel.IsWeekend,
                                        IsEvent: DayModel.IsEvent,
                                        IsEventClassOff: DayModel.IsEventClassOff,
                                        IsDayOff: DayModel.IsDayOff,
                                        HolidayDetail: DayModel.HolidayDetail,
                                        HoliName: DayModel.HolidayDetail !== '' && DayModel.HolidayDetail !== null ? DayModel.HolidayDetail.split(':')[0].trim() : '',
                                        HoliDetail: DayModel.HolidayDetail !== '' && DayModel.HolidayDetail !== null ? DayModel.HolidayDetail.split(':')[1].trim() : '',
                                        HoliShow: DayModel.HolidayDetail !== '' && DayModel.HolidayDetail !== null ? DayModel.HolidayDetail.split(':')[0].trim().slice(0, 6) : '',
                                        WeekendName: DayModel.WeekendName,
                                        EventDetail: DayModel.EventDetail,
                                        EveName: DayModel.EventDetail !== '' && DayModel.EventDetail !== null ? DayModel.EventDetail.split(':')[0].trim() : '',
                                        EveDetail: DayModel.EventDetail !== '' && DayModel.EventDetail !== null ? DayModel.EventDetail.split(':')[1].trim() : '',
                                        EveShow: DayModel.EventDetail !== '' && DayModel.EventDetail !== null ? DayModel.EventDetail.split(':')[0].trim().slice(0, 6) : '',
                                        EventDuration: DayModel.EventDuration
                                    });

                                    IncDays += 1;
                                }
                            });
                        }
                        //debugger;
                        var LastIndexList = $scope.CalendarDateList[$scope.CalendarDateList.length - 1].DaysSeries;
                        var CheckIfBlank = 0;
                        angular.forEach(LastIndexList, function (row) {
                            if (row.Day !== '') {
                                CheckIfBlank = 1;
                            }
                        });

                        if (CheckIfBlank === 0) {
                            $scope.CalendarDateList.splice($scope.CalendarDateList.length - 1, 1);
                        }
                    }
                    else {
                        $scope.ToMonth = $scope.HoldMonth;
                        $scope.ToYear = $scope.HoldYear;
                    }
                });
        };

        //debugger;
        $scope.CallToday = function () {
            $scope.getDates = new Date();
            $scope.ToDay = $scope.getDates.getDate();
            $scope.ToMonth = $scope.getDates.getMonth() + 1;
            $scope.ToYear = $scope.getDates.getFullYear();
            $scope.ToDate = (('0' + $scope.ToMonth).slice(-2) + '-' + ('0' + $scope.ToDay).slice(-2) + '-' + $scope.ToYear).toString();
            $scope.HoldMonth = $scope.ToMonth;
            $scope.HoldYear = $scope.ToYear;

            $scope.FirstOfMonth = ($scope.ToMonth + '-01-' + $scope.ToYear).toString();
            $scope.MonthLastDay = new Date($scope.ToYear, $scope.ToMonth, 0).getDate();
            $scope.LastOfMonth = ($scope.ToMonth + '-' + $scope.MonthLastDay + '-' + $scope.ToYear).toString();

            $scope.getCalendarList($scope.FirstOfMonth, $scope.LastOfMonth);
        };
        $scope.CallToday();

        $scope.NextMonthCalendar = function () {
            $scope.HoldMonth = $scope.ToMonth;
            $scope.HoldYear = $scope.ToYear;
            if ($scope.ToMonth === 12) {
                $scope.ToMonth = 1;
                $scope.ToYear += 1;
            }
            else {
                $scope.ToMonth += 1;
            }

            $scope.FirstOfMonth = ($scope.ToMonth + '-01-' + $scope.ToYear).toString();
            $scope.MonthLastDay = new Date($scope.ToYear, $scope.ToMonth, 0).getDate();
            $scope.LastOfMonth = ($scope.ToMonth + '-' + $scope.MonthLastDay + '-' + $scope.ToYear).toString();
            $scope.getCalendarList($scope.FirstOfMonth, $scope.LastOfMonth);
        };

        $scope.PreviousMonthCalendar = function () {
            //debugger;
            $scope.HoldMonth = $scope.ToMonth;
            $scope.HoldYear = $scope.ToYear;
            if ($scope.ToMonth === 1) {
                $scope.ToMonth = 12;
                $scope.ToYear -= 1;
            }
            else {
                $scope.ToMonth -= 1;
            }

            $scope.FirstOfMonth = ($scope.ToMonth + '-01-' + $scope.ToYear).toString();
            $scope.MonthLastDay = new Date($scope.ToYear, $scope.ToMonth, 0).getDate();
            $scope.LastOfMonth = ($scope.ToMonth + '-' + $scope.MonthLastDay + '-' + $scope.ToYear).toString();
            $scope.getCalendarList($scope.FirstOfMonth, $scope.LastOfMonth);
        };

        $scope.loadModalCalendar = function (Names, Detail, Dates) {
            $scope.clndrName = Names;
            $scope.clndrDetail = Detail;
            $scope.clndrDate = Dates;
        };
        //***********************************************************Custom Calendar**************************************************************
        //debugger;

        activate();

        function activate() {
            var promises = [getUserTypeWiseInfo(), getLoginInfo(), getTotalStudent(), getTotalTeacher(), getTotalCollectionAndDue()];
            return $q.all(promises).then(function () {
                logger.info('Activated Dashboard View');
            });
        }

        function getLoginInfo() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line



            return authservice.getLoginInfo().then(function (data) {
                //console.log(data);
            });
        }
        function getTotalStudent() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line


            var params = {
                CurrentDate: $scope.OnDate,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                UserTypeID: 3
            };
            return commonService.getTotalStudentAndTotalAttendence(params)
                .then(function (data) {
                    vm.totalPresentAndAbsent = data[0];

                });
        }
        function getTotalTeacher() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                CurrentDate: $scope.OnDate,
                InstituteID: $localStorage.userInfo[0].InstituteID,
                UserTypeID: 4
            };
            return commonService.getTotalTeacherAndTotalAttendence(params)
                .then(function (data) {
                    vm.teacherPresentAndAbsent = data[0];
                });
        }
        function getTotalCollectionAndDue() {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)); //jshint ignore : line

            var params = {
                InstituteID: $localStorage.userInfo[0].InstituteID,
                MonthID: vm.Month
            };
            return monthlyFeeService.getTotalCollectionAndTotalDue(params)
                .then(function (data) {
                    //debugger;
                    vm.totalCollectionAndDue = data[0];
                });
        }

        function getUserTypeWiseInfo() {
            if (vm.UserTypeID === 1) {
                console.log('');
                //$scope.getStudentPeriod();//delete
            }
            else if (vm.UserTypeID === 2) {
                //$scope.getStudentPeriod();//delete
                console.log('');
            }
            else if (vm.UserTypeID === 3) {
                $scope.getStudentPeriod();
            }
            else if (vm.UserTypeID === 4) {
                $scope.getTeacherPeriod();
            }
            else if (vm.UserTypeID === 5) {
                $scope.getStudentInfo();
            }
            else if (vm.UserTypeID === 6) {
                console.log('');
            }
            else if (vm.UserTypeID === 7) {
                console.log('');
            }
            else if (vm.UserTypeID === 8) {
                console.log('');
            }
            else if (vm.UserTypeID === 9) {
                console.log('');
            }

            $scope.getAllNotice();
        }
    }
})();
