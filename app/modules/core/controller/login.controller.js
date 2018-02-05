var app = angular.module(ApplicationConfiguration.applicationModuleName);

app.controller('loginCtrl', ['localStorageService', '$scope', '$http', '$state', 'Authentication', 'toaster', 'setAccountData', function (localStorageService, $scope, $http, $state, Authentication, toaster, setAccountData) {
        $scope.logintext = "Log In";
        $scope.image = {};
        $scope.findclinictext = "Find Clinic";
        // angular.element(".footer-home").css('display', 'none');
        var logindata = {};
        $scope.logindata = {};
        $scope.user = {}; // fix for bug 83.. replication of data

        $scope.login = function (logindata) {

            if (logindata.email === undefined || logindata.email === "" || logindata.email === null) {
                toaster.pop('error', "error", "please fill the username");
                return false;
            }
            if (logindata.password === undefined || logindata.password === "" || logindata.password === null) {
                toaster.pop('error', "error", "please fill the password");
                return false;
            }
            if (logindata.type == "user") {
                toaster.pop('error', "error", "A user is already registred with this account");
                return false;
            }
            var postLoginData = {
                password: logindata.password,
                type: "doctor"
            };

            if (logindata.email.indexOf('@') === -1) {
                postLoginData.username = logindata.email;
            } else {
                postLoginData.email = logindata.email;

            }

            $scope.doctorRegistration = true;
            $scope.login2 = true;
            $scope.logintext = "Sending request please wait";
            $scope.runRoute(routes.core.login, postLoginData,
                    function (success) {
                        var dumydata = {};
                        $http.get(restApiUrl + "doctors/" + success.data.userId, dumydata).then(function (result) {
                            var doctor_status = result.data.status;
                            if (doctor_status === 0) {
                                $scope.accountdeactive = true;
                                $scope.logintext = "Login";
                                $scope.login2 = false;
                            }else{
                                $scope.doctorLogIn(success);
                            }
                        },
                        function (err) {
                            $scope.logintext = "Login";
                        });
                        
                    },
                    function (err) {
                        $scope.servernotfound = true;
                        $scope.logintext = "Login";
                        $scope.login2 = false;

                    }
            );
        }

        $scope.doctorLogIn = function (success) {
            var details, i;
            var setWithImg = {};
            setWithImg = success.data;

            $scope.users = Authentication.addUserInfo(success.data);
            $scope.checkType = success.data.type;
            setWithImg.type = success.data.type;

            var dumydata = {};
            $http.get(restApiUrl + "doctors/" + success.data.userId, dumydata)
                    .then(function (result) {
                        setWithImg.image = result.data.image;

                        details = result.data;

                        // var follower = { "follower" : details.follower}; 

                        Authentication.addUserInfo(setWithImg);
                        setAccountData.addUserInfo(result.data);


                        $scope.docFollow = {"follower": result.data.follower};
                        setAccountData.addUserInfo(result.data);

                        if (result.data.detailsfilled == 1) {
                            $scope.doctorRegistration = true;
                            $scope.login2 = true;
                            var dumydata = {};
                            $('#doctorReg').modal('hide');
                            $('.create-account').removeAttr('disabled');
                            $scope.logindata.email  =   '';
                            $scope.logindata.password  =   '';
                            $state.go('doctorprofileproblem');
                        } else {
                            $scope.doctorRegistration = true;
                            $scope.login2 = true;
                            var dumydata = {};
                            $('#doctorReg').modal('hide');
                            $scope.logindata.email  =   '';
                            $scope.logindata.password  =   '';
                            $('.create-account').removeAttr('disabled');
                            $state.go('registorSuccess');
                        }

                    },
                    function (err) {
                        $scope.logintext = "Login";
                    });
        }

        $scope.userLogin = function (logindata) {

            if (logindata.email === undefined || logindata.email === "" || logindata.email === null) {
                toaster.pop('error', "error", "please fill the username");
                return false;
            }
            if (logindata.password === undefined || logindata.password === '') {
                toaster.pop('error', "error", "please fill the password");
                return false;
            }

            if (logindata.type === "doctor") {
                toaster.pop('error', "error", "This user is already registred as doctor");
                return false;
            }

            var postLoginData = {
                password: logindata.password,
                type: "user"
            };


            if (logindata.email.indexOf('@') === -1) {
                postLoginData.username = logindata.email;
            } else {
                postLoginData.email = logindata.email;

            }

            $scope.login2 = true;
            $scope.logintext = "Sending request please wait";

            $scope.runRoute(routes.core.userLogin, postLoginData, function (success) {
                if (success && success.data.length == 0) {
                    $scope.usernotfound = true;
                    $scope.login2 = false;
                    $scope.logintext = "Login";
                    return;
                }
                
                //By Nikhil
                var dumydata = {};
                $http.get(restApiUrl + "users/" + success.data.userId, dumydata).then(function (result) {
                    var user_status = result.data.status;
                    if (user_status === 0) {
                        $scope.accountdeactive = true;
                        $scope.logintext = "Login";
                        $scope.login2 = false;
                        return false;
                    }else{
                        
                        $scope.users = Authentication.addUserInfo(success.data);
                        $scope.checkType = success.data.type;
                        var dumydata = {};
                        var setImageUrl = {};
                        setImageUrl = success.data;

                        $http.get(restApiUrl + "users/" + success.data.userId, dumydata)
                            .then(function (result) {
                                $scope.image = result.data.image;
                                setImageUrl.image = result.data.image;
                                $scope.user.image = setImageUrl;
                                Authentication.addUserInfo(setImageUrl);
                                setAccountData.addUserInfo(result.data);

                                if (result.data.detailsfilled == 1) {
                                    $('.create-account').removeAttr('disabled');
                                    $scope.logindata.email  =   '';
                                    $scope.logindata.password  =   '';
                                    $('#loginSignUpModal').modal('hide');
                                    $state.go('userProfile');                                        

                                } else if (setImageUrl.image == undefined) {
                                    $('.create-account').removeAttr('disabled');
                                    $scope.logindata.email  =   '';
                                    $scope.logindata.password  =   '';
                                    $('#loginSignUpModal').modal('hide');
                                    localStorageService.set("userInfo", success.data);
                                    $state.go('registorSuccess');
                                }
                                },
                        function (err) {
                            $scope.logintext = "Login";
                        });
                    }
                },
                function (err) {
                    $scope.logintext = "Login";
                });
            },
            function (err) {

                $scope.servernotfound = true;
                $scope.logintext = "Login";
            }
            );
        }

        $scope.registorDoctor = function (user) {
            $scope.noEmail = true;
            var userId = new Object();
            userId = "";
            user.type = new Object();
            user.type = "doctor";
            user.email = user.email.toLowerCase();
            var postdata = {
                name: user.name,
                email: user.email.toLowerCase(),
                mobile: user.mobile,
                address: [],
                subAddress: [],
                status: 1,
                created_at: new Date().toLocaleString()
            }
            $scope.runRoute(routes.core.registerDoctor, user, function (success) {
                Authentication.setregistorInfo(success.data);
                var id = success.data._id;
                $http.post(restApiUrl + "doctors/" + postdata.name, postdata).then(function (success) {
                    var setdata = {};
                    // var setUsernamedata={};
                    // setUsernamedata.username.
                    var Id = new Object();
                    setdata.userId = success.data._id;
                    setdata.username = success.data.username;
                    var setName = {};
                    setName.username = success.data.username;

                    $http.put(restApiUrl + "doctors/accounts/" + id, setdata).then(
                        function (success) {
                            $scope.verification = true;
                            $scope.logindata.fname      =   '';     $('input[name=fname]').val('');
                            $scope.logindata.lname      =   '';     $('input[name=lname]').val('');
                            $scope.logindata.mobile     =   '';     $('input[name=mobile]').val('');
                            $scope.logindata.email      =   '';     $('input[name=email]').val('');
                            $scope.logindata.password   =   '';     $('input[name=password]').val('');
                            $scope.logindata.termscond  =   '';     $('#input-9').prop('checked', false);
                        },
                        function (error) {
                            console.log(error);
                            $scope.verification = true;
                        });

                    $http.put(restApiUrl + "doctors/" + setdata.userId, setName).then(
                        function (success) {
                            $scope.verification = true;                            
                        },
                        function (error) {
                            console.log(error);
                            $scope.verification = true;
                        });
                },
                function (error) {});
            },
            function (err) {
                console.log("error");
            }
            );
        }

        $scope.registorUser = function (user) {
            $scope.noEmail = true;
            var userId = new Object();
            userId = "";
            user.type = new Object();
            user.type = "user";
            user.email = user.email.toLowerCase();
            var postdata = {
                name: user.firstname,
                lastname: user.lastname,
                email: user.email.toLowerCase(),
                mobile: user.mobile,
                gender: user.gender,
                status: 1,
                created_at: new Date().toLocaleString()
            }
            $scope.runRoute(
                    routes.user.registerUser, user,
                    function (success) {
                        Authentication.setregistorInfo(success.data);
                        var id = success.data._id;
                        $http.post(restApiUrl + "users/" + postdata.name, postdata).then(function (success) {
                            var setdata = {};
                            var userId = new Object();
                            setdata.userId = success.data._id;
                            setdata.username = success.data.username;

                            var setName = {};
                            setName.username = success.data.username;

                            $http.put(restApiUrl + "users/accounts/" + id, setdata).then(
                                    function (success) {
                                        $scope.verification = true;
                                        $scope.logindata.firstname  =   '';     $('input[name=firstname]').val('');
                                        $scope.logindata.lastname   =   '';     $('input[name=lastname]').val('');
                                        $scope.logindata.mobile     =   '';     $('input[name=mobile]').val('');
                                        $scope.logindata.email      =   '';     $('input[name=email]').val('');
                                        $scope.logindata.password   =   '';     $('input[name=password]').val('');
                                        $scope.logindata.termscond  =   '';     $('#input-9').prop('checked', false);
                                    },
                                    function (error) {
                                        console.log(error);

                                    });

                            $http.put(restApiUrl + "users/" + setdata.userId, setName).then(
                                    function (success) {
                                        $scope.verification = true;
                                    },
                                    function (error) {
                                        console.log(error);
                                        $scope.verification = true;
                                    });
                        },
                                function (error) {

                                });
                    },
                    function (error) {
                        console.log(err);
                    });
        }
        //debugger;
        
        $scope.hospitalLogin = function (logindata) {
            if (logindata.email === undefined || logindata.email === "" || logindata.email === null) {
                toaster.pop('error', "error", "please fill the username");
                return false;
            }
            if (logindata.password === undefined || logindata.password === '') {
                toaster.pop('error', "error", "please fill the password");
                return false;
            }
            if (logindata.type === "doctor") {
                toaster.pop('error', "error", "This user is already registred as doctor");
                return false;
            }
            if (logindata.type === "user") {
                toaster.pop('error', "error", "This user is already registred");
                return false;
            }
            var postLoginData = {
                password: logindata.password,
                type: "hospital"
            };
            if (logindata.email.indexOf('@') === -1) {
                postLoginData.username = logindata.email;
            } else {
                postLoginData.email = logindata.email;

            }
            $scope.login2 = true;
            $scope.logintext = "Sending request please wait";

            $scope.runRoute(routes.core.userLogin, postLoginData, function (success) {
                if (success && success.data.length == 0) {
                    $scope.usernotfound = true;
                    $scope.login2 = false;
                    $scope.logintext = "Login";
                    return;
                }
                
                var dumydata = {};
                $http.get(restApiUrl + "users/" + success.data.userId, dumydata).then(function (result) {
                    var user_status = result.data.status;
                    if (user_status === 0) {
                        $scope.accountdeactive = true;
                        $scope.logintext = "Login";
                        $scope.login2 = false;
                        return false;
                    }else{
                        
                        $scope.users = Authentication.addUserInfo(success.data);
                        $scope.checkType = success.data.type;
                        var dumydata = {};
                        var setImageUrl = {};
                        setImageUrl = success.data;

                        $http.get(restApiUrl + "users/" + success.data.userId, dumydata)
                            .then(function (result) {
                                $scope.image = result.data.image;
                                setImageUrl.image = result.data.image;
                                $scope.user.image = setImageUrl;
                                Authentication.addUserInfo(setImageUrl);
                                setAccountData.addUserInfo(result.data);

                                if (result.data.detailsfilled == 1) {
                                    $('.create-account').removeAttr('disabled');
                                    $scope.logindata.email  =   '';
                                    $scope.logindata.password  =   '';
                                    $('#hospitalLogin').modal('hide');
                                    $state.go('addClinic');                                        

                                } else if (setImageUrl.image == undefined) {
                                    $('.create-account').removeAttr('disabled');
                                    $scope.logindata.email  =   '';
                                    $scope.logindata.password  =   '';
                                    $('#hospitalLogin').modal('hide');
                                    localStorageService.set("userInfo", success.data);
                                    $state.go('addClinic');
                                }
                                },
                        function (err) {
                            $scope.logintext = "Login";
                        });
                    }
                },
                function (err) {
                    $scope.logintext = "Login";
                });
            },
            function (err) {

                $scope.servernotfound = true;
                $scope.logintext = "Login";
            }
            );
        }
        
        
        $scope.registorHospital = function (hospital) { console.log(hospital);
            $scope.noEmail  = true;
            var userId  = new Object();
            userId      = "";
            hospital.type   = new Object();
            hospital.type   = "hospital";
            hospital.email  = hospital.email.toLowerCase();
            var postdata = {
                name:   hospital.name,
                email:  hospital.email.toLowerCase(),
                mobile: hospital.mobile,
                username: hospital.username,
                status: 1,
                created_at: new Date().toLocaleString()
            }
            $scope.runRoute(routes.hospital.registerHospital, hospital, function (success) {
                Authentication.setregistorInfo(success.data);
                var id = success.data._id;
                $http.post(restApiUrl + "hospitals/" + postdata.name, postdata).then(function (success) {
                    var setdata         = {};
                    var Id              = new Object();
                    setdata.userId      = success.data._id;
                    setdata.username    = success.data.username;
                    var setName         = {};
                    setName.username    = success.data.username;

                    $http.put(restApiUrl + "hospitals/accounts/" + id, setdata).then(
                        function (success) {
                            $scope.verification = true;
                            $scope.logindata.name       =   '';     $('input[name=name]').val('');
                            $scope.logindata.mobile     =   '';     $('input[name=mobile]').val('');
                            $scope.logindata.email      =   '';     $('input[name=email]').val('');
                            $scope.logindata.password   =   '';     $('input[name=password]').val('');
                            $scope.logindata.termscond  =   '';     $('#input-9').prop('checked', false);
                        },
                        function (error) {
                            console.log(error);
                        });

                    $http.put(restApiUrl + "users/" + setdata.userId, setName).then(
                        function (success) {
                        	var setHospitaldata         = {};
                            setHospitaldata._id      = success.data._id;
                            setHospitaldata.username    = success.data.username;
                            setHospitaldata.name = hospital.name;
                            setHospitaldata.status = 1;
                            
                            $http.put(restApiUrl + "hospitals/" + setHospitaldata._id, setHospitaldata).then(function (success) {
                            	$scope.verification = true;
                            	$('#hospitalLogin').modal('hide');
                                localStorageService.set("userInfo", success.data);
                                $state.go('addClinic');
                            },
                            function (error) {
                                console.log("Failed To Create Hospital Object In DB");
                            });
                        },
                        function (error) {
                            console.log(error);
                            $scope.verification = true;
                        });
                },
                function (error) {

                });
            },
            function (error) {
                console.log(error);
            });
        }
        
        
        $scope.getAuth = function (data) {
            $scope.loginType = 1;
            if (data.password == undefined) {
                //Random pwd for Social Login
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                var textPwd = '';
                for (var i = 0; i < 8; i++)
                    textPwd += possible.charAt(Math.floor(Math.random() * possible.length));
                data.password = textPwd;
            }
            $http.post(restApiUrl + "doctors/auth/facebook", data).then(function (success) {
                $scope.doctorLogIn(success);
            },
                    function (error) {
                        console.log(error);
                        $scope.servernotfound = true;
                        $scope.logintext = "Login";
                        $scope.login2 = false;
                    });
        }

        $scope.getAuthUser = function (data) {
            $scope.loginType = 1;
            if (data.password == undefined) {
                //Random pwd for Social Login
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
                var textPwd = '';
                for (var i = 0; i < 8; i++)
                    textPwd += possible.charAt(Math.floor(Math.random() * possible.length));
                data.password = textPwd;
            }
            $http.post(restApiUrl + "users/auth/facebook", data).then(function (success) {
                $scope.userLogin(success.data);
            },
                    function (error) {
                        console.log(error);
                        $scope.servernotfound = true;
                        $scope.logintext = "Login";
                        $scope.login2 = false;
                    });
        }

        $scope.updatePassword = function (pswd, confirmpassword) {
            console.log(pswd, confirmpassword);

            if (pswd === confirmpassword) {

                var a, str, data, id, passswd;
                a = $state.href('confirmpassword', $state.params, {absolute: true});
                console.log(a);
                str = a.split('/');
                id = str[5];
                passswd = str[6];
                data = {"password": pswd};

                $http.put(restApiUrl + "doctors/newPassword/" + id + "/" + passswd, data).then(function (success) {

                    console.log(success);
                    toaster.pop('success', "success", "Password has been changed successfully");
                },
                        function (error) {
                            console.log(error);
                            toaster.pop('error', "error", "Somethng went wrong");
                        });
            } else {
                toaster.pop('error', "error", "Password does not match");
            }
        }

    }]);