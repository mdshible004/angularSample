(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('loginController', loginController);

    loginController.$inject = ['loginService', 'conversion', 'commonService', 'studentAttendanceSevice', '$q', 'logger', 'authservice', 'apiConfig', '$scope', '$state', '$localStorage'];
    /* @ngInject */
    function loginController(loginService, conversion, commonService, studentAttendanceSevice, $q, logger, authservice, apiConfig, $scope, $state, $localStorage) {
        var vm = this;
        vm.dataPending = true;
        vm.logg = authservice.isLoggedIn;
        vm.uInfo = {};

        $scope.$on('userLoggedIn', function (event, data) {
            vm.dataPending = authservice.pending;
            vm.logg = true;
        });
        $scope.$on('userInfoReceived', function (event, data) {
            vm.dataPending = authservice.pending;
            vm.logg = true;
            vm.uInfo = data;
            var LoginUsername = $localStorage.userInfo[0].UserFullName;
            vm.LoginUsername = LoginUsername.split(' ');
            vm.imgHost = apiConfig.imagehost;
            vm.loginUserImage = $localStorage.userInfo[0].ImageUrl;
            $scope.InstituteName = $localStorage.userInfo[0].InstituteName;
            $scope.InstituteLogo = $localStorage.userInfo[0].InstituteLogo;
            vm.imgHost = apiConfig.imagehost;
            $scope.InstituteLogoUrl = vm.imgHost + $scope.InstituteLogo;

            vm.LoggedUserID = $localStorage.userInfo[0].UserID;
            vm.InstituteID = $localStorage.userInfo[0].InstituteID;
            vm.UserTypeID = $localStorage.userInfo[0].UserTypeID;
            vm.getMethod = 'GET';
            vm.postMethod = 'POST';
            vm.putMethod = 'PUT';
            vm.deleteMethod = 'DELETE';
            vm.menuId = $localStorage.menuItm.MenuID;

            $scope.setProfil();
            $scope.ViewAsDDL();
            getInstitutePurchaseSMS();
        });
        $scope.$on('userLoggedOut', function (event, data) {
            vm.dataPending = authservice.pending;
            vm.logg = false;
        });

        vm.submitLoginForm = function () {
            //console.log(apiConfig.client_id);
            var params = {
                username: vm.loginForm.username,
                password: vm.loginForm.password
            };
            loginService.getLoginInformation(params)

                .then(function (data) {
                    if (data.length > 0) {

                        if (vm.loginForm.password === data[0].Password) {
                            data.access_token = 'fjkmJyAZEYasFFNBlqFfIzUgXgNutrIJp823Rj1s';
                            data.refresh_token = 'E5LgEoDq0vyng0jTShm2rxtZdckYGhtNmKErKfgs';
                            authservice.oAuthLogin(data);
                            authservice.getUserInfo('dashboard');
                            window.location.reload(true);

                        } else {
                            logger.error('!Oops Password Not Match');
                        }
                    } else {
                        logger.error('Please Insert UserName Or Password');
                    }

                    //console.log(data);
                });
        };

        $scope.UserTypeList = [];
        $scope.SelectedType = '';
        $scope.ViewAsDDL = function () {

            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line

            return commonService.getDashBoardCmnUserType(vm)
                .then(function (data) {
                    //debugger;
                    $scope.UserTypeList = data;
                    $scope.SelectedType = $scope.UserTypeList.filter(function (js, j) { return (js.UserTypeID === vm.UserTypeID); })[0];
                });
        };

        $scope.setSelectType = function (model) {
            //debugger;            
            if ($scope.SelectedType.UserTypeID !== model.UserTypeID) {
                $scope.SelectedType = model;
                $localStorage.userInfo[0].UserTypeID = model.UserTypeID;
                $localStorage.userInfo[0].UserType = model.UserTypeName;
                location.reload();
            }
        };

        $scope.lStorage = '';
        $scope.setProfil = function () {
            //debugger;
            $scope.lStorage = $localStorage.userInfo[0];
            $scope.UserID = $scope.lStorage.UserID;
            $scope.UserTypeID = $scope.lStorage.UserTypeID;
            $scope.FirstName = $scope.lStorage.FirstName;
            $scope.LastName = $scope.lStorage.LastName;
            $scope.FullName = $scope.lStorage.UserFullName;
            $scope.Email = $scope.lStorage.EmailID;
            $scope.UserType = $scope.lStorage.UserType;
            $scope.Class = $scope.lStorage.ClassName;
            $scope.SDepartment = $scope.lStorage.SDepartmentName;
            $scope.TDepartment = $scope.lStorage.DepartmentName;
            $scope.Section = $scope.lStorage.SectionName;
            $scope.UserImage = vm.imgHost + $scope.lStorage.ImageUrl;
            $scope.Medium = $scope.lStorage.MediumName;
            $scope.Shift = $scope.lStorage.ShiftName;
            $scope.Branch = $scope.lStorage.SBrunchName;
            $scope.TBranch = $scope.lStorage.BrunchName;
            $scope.Roll = $scope.lStorage.RollNo;
            $scope.StudentNo = $scope.lStorage.StudentNo;
            $scope.Password = $scope.lStorage.Password;
            $scope.UserName = $scope.lStorage.UserName;
            $scope.InstituteID = $scope.lStorage.InstituteID;
        };
        //$scope.IsProfile = true; $scope.titleName = '';
        //$scope.ProfileView = function () {
        //    $scope.IsProfile = true;
        //    $scope.titleName = $scope.IsProfile === true ? 'Profile' : 'Change Password';
        //    $('#modalProfile').modal('show');            
        //}

        $scope.ChangePasswordView = function () {
            $scope.resetChangePass();
            $('#modalProfile').modal('hide'); //jshint ignore :line 
            $('#modalChangePass').modal('show'); //jshint ignore :line 
            $scope.resetChangePass();
        };

        $scope.IsCorrect = false;
        $scope.PassMismatch = '';
        $scope.checkCurrentPassword = function (pass) {
            $scope.IsCorrect = $scope.Password === pass ? false : true;
            $scope.PassMismatch = $scope.IsCorrect === true ? 'Current Password is invalid' : '';
            $scope.newPassword = '';
            $scope.confirmPassword = '';
        };

        $scope.checkConfirmPassword = function (pass) {
            if ($scope.confirmPassword !== undefined && $scope.confirmPassword !== '') {
                $scope.IsCorrect = $scope.newPassword === pass ? false : true;
                $scope.PassMismatch = $scope.IsCorrect === true ? 'Password mismatch' : '';
            }
        };

        $scope.ChangePasswordDone = function () {
            var params = {
                UserID: $scope.UserID,
                LoginID: $scope.UserName,
                ResetPassword: $scope.confirmPassword,
                InstituteID: $scope.InstituteID
            };
            loginService.resetPassword(params)
                .then(function (data) {
                    if (data[0].result === 1) {
                        if ($scope.IsResetPass === false) {
                            $scope.lStorage.Password = $scope.confirmPassword;
                            $scope.Password = $scope.confirmPassword;
                            $('#modalChangePass').modal('hide'); //jshint ignore :line 
                        }
                        logger.info('Password reset successfully!!!!');
                        $scope.resetChangePass();
                        $scope.clickOk();
                    } else {
                        logger.error('Password cant be reset, please check and try again!!!!');
                    }
                });
        };

        $scope.resetChangePass = function () {
            $scope.currentPassword = '';
            $scope.newPassword = '';
            $scope.confirmPassword = '';
            $scope.IsCorrect = false;
            $scope.PassMismatch = '';
        };
        $scope.loggSign = false;
        $scope.forgetPopOne = function () {
            //debugger;
            $scope.loggSign = true;
            $('#forgetModalOne').modal({ show: true, backdrop: 'static', keyboard: false }); //jshint ignore :line 

        };

        $scope.IsUserEmailPhone = true;
        $scope.IsSendCode = false;
        $scope.IsCodeExecute = false;
        $scope.PasswordResend = '';
        $scope.LoginIDResend = '';
        $scope.LoginEmailResend = '';
        $scope.LoginPhoneResend = '';
        $scope.CodeResend = '';
        $scope.RadioLabelEmail = '';
        $scope.RadioLabelPhone = '';
        $scope.IsEmail = false;
        $scope.IsPhone = false;
        $scope.IsDont = false;
        $scope.IsDontHave = false;
        $scope.IsResetPass = false;
        $scope.InsLogoUrl = '';
        $scope.InsName = '';

        $scope.getUserEmailPhoneIfExist = function (model) {
            //debugger;
            var params = {
                UserEmailPhone: model.toString()
            };
            loginService.getUserEmailPhoneIfExist(params)
                .then(function (data) {
                    //debugger;
                    if (data[0].result === 1) {
                        $scope.PasswordResend = data[0].Password;
                        $scope.LoginIDResend = data[0].LoginID;
                        $scope.LoginEmailResend = data[0].LoginEmail;
                        $scope.RadioLabelEmail = $scope.LoginEmailResend !== null ? $scope.LoginEmailResend.slice(0, 4) + '******@' + '****.com' : '';
                        $scope.LoginPhoneResend = data[0].LoginPhone;
                        $scope.RadioLabelPhone = $scope.LoginPhoneResend !== null ? $scope.LoginPhoneResend.slice(0, 5) + '****' + $scope.LoginPhoneResend.slice(-2) : '';
                        $scope.CodeResend = data[0].sendingCode;
                        $scope.InsLogoUrl = vm.imgHost + data[0].InstituteLogo;
                        $scope.IsUserEmailPhone = false;
                        $scope.IsSendCode = true;
                        $scope.InstituteID = data[0].InstituteID;
                        $scope.UserID = data[0].UserID;
                        $scope.UserName = data[0].LoginID;
                        $scope.InsName = data[0].InstituteName;
                    } else {
                        logger.error('Invalid input!!!!');
                    }
                });
        };

        $scope.checkedOne = function (model) {
            //debugger;
            //var checkedRadio = false;
            var checkedRadio = document.getElementById(model).checked;
            if (model === 'isEmail') {
                $scope.IsEmail = checkedRadio;
                $scope.IsPhone = false;
                $scope.IsDont = false;
            }
            else if (model === 'isPhone') {
                $scope.IsEmail = false;
                $scope.IsPhone = checkedRadio;
                $scope.IsDont = false;
            }
            else if (model === 'isDont') {
                $scope.IsEmail = false;
                $scope.IsPhone = false;
                $scope.IsDont = checkedRadio;
            }
        };

        $scope.sendVarificationCode = function () {
            //debugger;
            if ($scope.IsDont === true) {
                $scope.IsDontHave = true;
                $scope.IsCodeExecute = false;
            }
            else {
                $scope.varificationCode = '';
                $scope.IsCodeExecute = true;
                $scope.IsDontHave = false;
                if ($scope.IsEmail === true) {
                    $scope.sendMail();
                }
                else if ($scope.IsPhone === true) {
                    vm.sendCodeViaSMS();
                }
            }

            $scope.IsUserEmailPhone = false;
            $scope.IsSendCode = false;
        };

        $scope.VCode = null;
        $scope.VCodeSendTime = null;
        $scope.sendMail = function () {
            var params = {
                EmailID: $scope.LoginEmailResend,
                CodeSet: $scope.CodeResend
            };
            loginService.sendCodeThrouMail(params)
                .then(function (dataset) {
                    //debugger;
                    if (dataset.Message === 'Sent') {
                        $scope.VCode = dataset.RandomNo;
                        $scope.VCodeSendTime = conversion.DateTimeNow_AddMinutes(30);
                        $scope.IsResendCode = false;
                        logger.info('Varification code send successfully, please check your mail');
                    } else {
                        logger.error('some error occured, please check your connection!!!!');
                        $scope.IsResendCode = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    $scope.IsResendCode = true;
                    logger.error('some error occured, please check your connection!!!!');
                });
        };


        vm.sendCodeViaSMS = function () {
            var smsAccessToken = vm.insSMSToken;
            $scope.VCode = Math.floor(Math.random() * 899999 + 100000);
            var params = {
                to: $scope.LoginPhoneResend,
                message: $scope.VCode,
                token: smsAccessToken
            };
            axios.post('http://sms.greenweb.com.bd/api.php?token=' + params.token + '&to=' + params.to + '&message=' + params.message)  //jshint ignore : line
                .then(function (response) {
                    if (response.status === 200) {
                        $scope.VCodeSendTime = conversion.DateTimeNow_AddMinutes(30);
                        $scope.IsResendCode = false;
                        logger.info('Varification code send successfully, please check your phone');
                        //logger.info('All SMS Sent Successfuly');
                    } else {
                        logger.error('some error occured, please check your connection!!!!');
                        $scope.IsResendCode = true;
                    }
                });

            getTokenWiseSMSResult();
        };

        function getInstitutePurchaseSMS() {
            //Generate Token API Pass Call
            authservice.getToken(generateSecurityToken(vm.InstituteID, vm.LoggedUserID, vm.menuId, vm.getMethod)) //jshint ignore : line
            var Params = {
                instituteId: $localStorage.userInfo[0].InstituteID
            };
            return studentAttendanceSevice.getInstitutePurchaseSMS(Params)
                .then(function (data) {
                    if (data.length > 0) {
                        vm.insPurchaseSMS = data[0].TotalSMS;
                        vm.insSMSToken = data[0].InsToken;
                        getTokenWiseSMSResult();
                    }
                });
        }

        function getTokenWiseSMSResult() {
            var params = {
                token: vm.insSMSToken //vm.insSMSToken
            };
            axios.get('http://sms.greenweb.com.bd/g_api.php?token=' + params.token + '&tokensms')  //jshint ignore : line
                .then(function (response) {
                    if (response.status === 200) {
                        $scope.totalSepenSMSResult.counter = parseInt(response.data);
                    }
                });
        }


        $scope.permitResetPassword = function (model) {
            var CDateTime = conversion.DateTimeNow();
            if ($scope.VCode === parseInt(model) && CDateTime <= $scope.VCodeSendTime) {
                $scope.IsResetPass = true;
                $scope.IsCodeExecute = false;
                $scope.IsResendCode = false;
            }
            else {
                if ($scope.VCode !== parseInt(model)) {
                    logger.error('Invalid Varification Code!!!');
                }
                else {
                    if (CDateTime > $scope.VCodeSendTime) {
                        logger.error('Varification Code Expired!!!');
                    }
                }
                $scope.IsResendCode = true;
            }
        };

        $scope.clickOk = function () {
            $scope.IsResendCode = false;
            $scope.IsUserEmailPhone = true;
            $scope.IsSendCode = false;
            $scope.IsCodeExecute = false;
            $scope.PasswordResend = '';
            $scope.LoginIDResend = '';
            $scope.LoginEmailResend = '';
            $scope.LoginPhoneResend = '';
            $scope.CodeResend = '';
            $scope.RadioLabelEmail = '';
            $scope.RadioLabelPhone = '';
            $scope.IsEmail = false;
            $scope.IsPhone = false;
            $scope.IsDont = false;
            $scope.IsDontHave = false;
            $scope.InsLogoUrl = '';
            $scope.loggSign = false;
            $scope.IsResetPass = false;
            $scope.UserEmailPhoneModel = '';
            $('#forgetModalOne').modal('hide'); //jshint ignore :line 
        };

        vm.logout = function () {
            authservice.unsetLoginInfo();
        };

    }

})();
