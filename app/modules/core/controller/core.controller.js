'use strict';
/**
 * @ngdoc function
 * @name trDocpal.controller:CoreCtrl
 * @description
 * # CoreCtrl
 * Controller of the trDocpal
 */
angular.module(ApplicationConfiguration.applicationModuleName).controller('CoreCtrl',
        ['localStorageService', '$scope', '$state', '$rootScope', '$http', '$stateParams', '$location', '$window', 'Authentication', 'setAccountData', 'Upload', '$timeout', 'follow', 'setfilterService', '$compile', 'toaster', function (localStorageService, $scope, $state, $rootScope, $http, $stateParams, $location, $window, Authentication, setAccountData, Upload, $timeout, follow, setfilterService, $compile, toaster) {
                                        
                var setfilterdata2 = [];
                var servicetype = "";
                var place = "";
                var doctorlist = "";
                var searchType = "";
                $scope.datepicker = "";
                $scope.siteUrlDocpal = siteUrlDocpal;
                $scope.doocFollow = "";
                $scope.logUser = "";
                $scope.newList = {};
                $scope.notification = {}; //New Notification Object
                $scope.notification.doc = [];
                $scope.notification.user = [];
                //folllow logic
                $scope.newFollow = function (docId, event, popup) {
                    var userId, type, i, j, res = [];
                    $scope.countVAl = 0;
                    var myId = Authentication.getUserInfo().userId;
                    if (myId == docId) {
                        return false;
                    }
                    var data = {
                        followerId: myId,
                        followingId: docId,
                        followerType: "doctor"
                    };
                    if (Authentication.getUserInfo().type == 'user') {
                        data.followerType = "user";
                    }
                    $http.post(restApiUrl + "core/follow/", data)
                            .then(function (result) {
                                var FollowerDom = $(event.target).closest(".teeth-icon").find(".follow_no");
                                var count = parseInt(FollowerDom.html()) || 0;

                                if (result.data.status == "Follow") {

                                    if (popup == true) {
                                        $(event.target).html("UnFollow");
                                    } else {
                                        FollowerDom.html(count + 1);

                                        $(event.target).css('color', '#1ba4aa');
                                    }

                                } else {
                                    if (popup == true) {
                                        $(event.target).html("Follow");
                                    } else {
                                        FollowerDom.html(count - 1);

                                        $(event.target).css('color', '#bababa');
                                    }
                                }
                            },
                                    function (err) {
                                        console.log("follow fail");
                                    });

                };

                // function for set following data 
                $scope.setdata = "";
                $scope.loadingData = true;
                $scope.getListFollower = function (follow) {
                    $scope.loadingData = true;
                    $scope.followlist = [];
                    $scope.users = Authentication.getUserInfo();
                    $http.post(restApiUrl + "doctors/all/getFollowers/" + $scope.users.userId, follow)
                            .then(function (result) {
                                $scope.followlist = result.data.status;
                                $scope.loadingData = false;
                            },
                                    function (err) {

                                    });
                }

                $scope.checkIffollow = function (docFollower) {



                    var myData = Authentication.getUserInfo().userId;
                    var followed = false;
                    for (var i = 0; i < docFollower.length; i++) {
                        if (docFollower[i].followId == myData) {
                            followed = true;
                        }
                    }
                    return followed;

                };
                $scope.getMyImage = function () {

                    var userInfo = setAccountData.getUserInfo();

                    var gender = userInfo.gender || "male";
                    var type = userInfo.type || "doctor";
                    var image = userInfo.image;
                    var socialImage = userInfo.social_image;
                    return $scope.getUserImage(type, image, gender, socialImage);
                };

                $scope.getUserImage = function (type, image, gender, socialImage) {
                    var imgPath = "";
                    var gender = gender || 'male';
                    if (image) {
                        imgPath = imageServer + '/' + image;
                    } else if (socialImage) {
                        imgPath = socialImage;
                    } else if (type == 'doctor') {

                        if (gender.toLowerCase() == "male") {
                            imgPath = 'assets/img/Dr1.png';
                        } else {
                            imgPath = "assets/img/femaledoctor.png";
                        }
                    } else if (type == 'user') {
                        if (gender.toLowerCase() == "male") {
                            imgPath = 'assets/img/user_img.png';
                        } else {
                            imgPath = "assets/img/04.png";
                        }
                    }

                    return imgPath;
                }

                var test;

                // var currentState = $location.url().split('/')[1];
                // console.log(currentState);

                $scope.markerList = [{
                        lat: 52.511,
                        lng: 13.447
                    }, {
                        lat: 52.549,
                        lng: 13.422
                    }, {
                        lat: 52.497,
                        lng: 13.396
                    }, {
                        lat: 52.517,
                        lng: 13.394
                    }];

                $scope.fireBug = function (lat, lng, loc, city, state, country, address) {
                    console.log(address);
                };

                $rootScope.setvalueSearchBox = setfilterdata2.searchBy;
                var searchList = "";


                $scope.list = {
                    "docCat": doctorCategory,
                    "labTest": labName
                }
                $scope.setSearchList = [];

                var data2 = {
                    setValue: ""
                };

                $scope.myProblemCount = 0;

                //For Problem Count Fix
                $scope.profileProblemCount = {};
                $scope.profileProblemCount.doctor = 0;
                $scope.profileProblemCount.user = 0;
                //End Count Fix

                $scope.getDoctorList = function (filter) {
                    $scope.doctorlist = [];
                    $("#loadingPlaceholer").css("display", "block");
                    $http.post(restApiUrl + "doctors/list/filter", filter)
                            .then(function (result) {
                                $scope.doctorlist = result.data;
                                $("#loadingPlaceholer").css("display", "none");
                            },
                                    function (err) {
                                        console.log(err);
                                    });
                };
                //Get All cities for DropDown
                $http.get(restApiUrl + "drCities").then(function (success) {
                    $scope.drCities = success.data;
                    //$scope.currentCity = $scope.drCities[0].name;
                    $scope.currentCity = 'Select City';
                },
                function (error) {});
                        
                //Get CMS Pages By Nikhil
                $http.get(restApiUrl + "cmspages").then(function(success){
                    $scope.cmspages = success.data;
                    for (var x = 0; x < success.data.length; x++) {
                        if(success.data[x].name === 'about_us'){
                            $scope.about_us =  success.data[x].description; 
                        }
                        if(success.data[x].name === 'disclaimer'){
                            $scope.disclaimer =  success.data[x].description; 
                        }
                        if(success.data[x].name === 'policy'){
                            $scope.policy =  success.data[x].description; 
                        }
                        if(success.data[x].name === 'terms'){
                            $scope.terms =  success.data[x].description; 
                        }
                        if(success.data[x].name === 'career'){
                            $scope.career =  success.data[x].description; 
                        }
                        if(success.data[x].name === 'contact_us'){
                            $scope.contact_us =  success.data[x].description; 
                        }
                    }
                    
                },
                function(error) {
                    console.log(error);
                });
                
                //Get Teams By Nikhil
                $http.get(restApiUrl + "teams").then(function(success){
                    $scope.teams = success.data;                    
                },
                function(error) {
                    console.log(error);
                });


                //Get Teams By Rajesh
                // $http.get(restApiUrl + "userFeedback").then(function (success) {
                //     $scope.userFeedback = success.data;
                // },
                // function (error) {
                //     console.log(error);
                // });
                
                //Get Careers By Nikhil
                $http.get(restApiUrl + "careers").then(function(success){
                    $scope.careers = success.data;                    
                },
                function(error) {
                    console.log(error);
                });
                
                $scope.sendInquiry  =   function(data){
                    $http.post(restApiUrl + "inquiries", data).then(function(success) {
                        $('input[name=name]').val('');
                        $('input[name=phone]').val('');
                        $('input[name=email]').val('');
                        $('textarea[name=description]').val('');
                        
                        alert('Inquiry submitted successfully. We will contact you as soon as possible !');
                    },
                    function(error) {
                        
                    });
                }
                
                setTimeout(function(){
                    var markerList1 = [];
                    var lngA = {
                        lat: 28.5355161,
                        lng: 77.39102649999995
                    };
                    markerList1.push(lngA);
                    if($("#contact_map").length > 0) {
                        initMyMap($("#contact_map").get(0), markerList1);
                    }
                }, 1000);

                // var markerList1 = [];
                // var lngA = {
                //     lat: '28.5355161',
                //     lng: '77.39102649999995'
                // };
                // markerList1.push(lngA);
                // alert($("#contact_map").length);
                // if($("#contact_map").length > 0) {
                //     initMyMap($("#contact_map").get(0), markerList1);
                // }
                
                $scope.headerShowHide = function () {

                    if (!($.isEmptyObject(Authentication.getUserInfo()))) {
                        return false;
                    } else {
                        return true;
                    }

                };

                $scope.$on('categoryMain', function (ngRepeatFinishedEvent) {

                    $(".categoryMain").owlCarousel({
                        items: 5,
                        nav: true,
                        loop: false,
                        navText: ["<i class='fa fa-prev'></i>", "<i class='fa fa-next'></i>"],
                    });


                });

                $scope.showMore = function () {

                    setfilterdata2.offset = 10 + setfilterdata2.offset;

                    $scope.getFilterList(setfilterdata2, servicetype, place);

                };

                $scope.setSearchBox = function (data) {


                    $rootScope.setvalueSearchBox = data.setvalueSearchBox;
                    setfilterdata2.searchBy = $rootScope.setvalueSearchBox;
                    $scope.getFilterList(setfilterdata2, servicetype, place);
                    // $scope.data.setvalueSearchBox =$rootScope.setvalueSearchBox;
                }

                $scope.data = {
                    setvalueSearchBox: $rootScope.setvalueSearchBox
                }


                $scope.imageServer = imageServer;
                $scope.filters = [{
                        'filterId': 0,
                        'text': 'Doctor',
                        'url': 'doctors',
                        'image': 'assets/img/stethoscope (5).png'
                    }, {
                        'filterId': 1,
                        'text': 'Hospitals',
                        'url': 'hospital_list',
                        'image': 'assets/img/catholic.png'
                    },
                    {
                        'filterId': 2,
                        'text': 'Labs',
                        'url': 'labs',
                        'image': 'assets/img/microscopes2.png'
                    }, {
                        'filterId': 3,
                        'text': 'Problems',
                        'url': 'problemInfo',
                        'image': 'assets/img/speech3.png'
                    }


                ];
                $scope.menuimage = $scope.filters[0].image;
                $scope.select = function (index) {

                    $scope.selectedMenu = index;
                    $scope.menuimage = $scope.filters[index].image;
                };



                $scope.capitalize = function (value) {
                    var data = value.charAt(0).toUpperCase() +
                            value.substring(1);
                    return data;
                };

                $scope.changeType = function (value) {
                    searchType = value;
                    console.log(searchType);
                }

                $scope.timezone = timeZone;
                $scope.docCat = doctorCategory;


                $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                $scope.languages = ['English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Malayalam', 'Odia', 'Punjabi'];
                $scope.hosFac = ['Travel Desk', 'Specialised Dialysis Unit', 'Prayer Room', 'Parking', 'Laundry Services', 'Wifi', 'Emergency Service',
                    'Cafeteria', 'Blood Bank', '24x7 Pharmacy', 'Radiology', 'Pathology', 'Bank/ATM', 'Ambulance', 'Waiting lounge', 'Air ambulance',
                    'Money exchange', 'Insurance', 'Optical outlet', 'Online booking', 'Telemedicine', 'Pharmacy', 'TPA'];
                $scope.labFac = ['Home sample pickup', 'Online Report', 'Credit card', 'Hard copy report delivery', 'Insurance'];
                $scope.labTest = labName;
                $scope.logindata = {};
                $scope.loading = [];
                $scope.user = {};
                $scope.register = "Register";
                $scope.runRoute = function (routeName, data, success, error) {
                    var routeArray = routeName.split("_");
                    var method = routeArray[1];
                    var route = routeArray[0];
                    var completeUrl = restApiUrl + route;
                    switch (method) {
                        case "get":

                            if (!jQuery.isEmptyObject(data)) {

                                completeUrl = completeUrl + "/" + data;
                            }

                            $http.get(completeUrl)
                                    .then(function (response) {
                                        success(response);
                                    }, function (err) {
                                        error(err);
                                    });
                            break;
                        case "post":
                            var result = [];
                            for (var field in data) {
                                if (field.hasOwnProperty(field)) {
                                    var name = data[field];
                                    result[name] = name;
                                }
                            }

                            $http.post(completeUrl, data)
                                    .then(function (response) {
                                        success(response);
                                    }, function (err) {
                                        error(err);
                                    });
                            break;
                        default:
                            "h"
                            break;

                        case "put":
                            var queryString = "",
                                    isEmptyObj = true;

                            for (var obj in data) {
                                if (data.hasOwnProperty(obj)) {
                                    queryString += '&' + obj + '=' + data[obj];
                                    isEmptyObj = false;
                                }
                            }
                            if (!isEmptyObj) {
                                queryString = queryString.replace('&', '?');
                                completeUrl = completeUrl + queryString;

                            }

                            $http.put(completeUrl)
                                    .then(function (response) {
                                        success(response);
                                    }, function (err) {
                                        error(err);
                                    });
                            break;
                    }



                }

                $scope.showsave = false;
                $scope.showChange = false;
                // $scope.changeIcon = function(event) {
                //     $scope.showsave = false;
                //     $scope.showChange = true;
                //     $(event.target).hide();
                //     angular.element('.FileSelect').removeClass('fileIcon').addClass('showFileSelect');
                //     angular.element(".dr-profile-image").css("opacity",'0.5');
                //    angular.element(".upicon").show();

                //    angular.element('.saveNewImage').show();

                // }

                $scope.changeIconSave = function () {
                    $scope.showsave = true;
                    $scope.showChange = false;
                }


                //data to save in the doctors table on register time

                $scope.testMail = function () {
                    $http.post(restApiUrl + "doctors/verify/email")
                            .then(function (response) {
                                success(response);
                            }, function (err) {
                                error(err);
                            });
                }




                $scope.goToRegisterdoctor = function () {
                    $state.go('registorDoctor');
                }

                $scope.goToRegisteruser = function () {
                    $state.go('registorUser');
                }
                
                $scope.goToRegisterhospital = function () {
                    $state.go('registorHospital');
                }

                /* ----------- end  ------- --*/



                // check whether user is log in or not o state change

                $scope.$on('$stateChangeSuccess', function () {


                    $scope.users = Authentication.getUserInfo();
                    $scope.logUser = setAccountData.getUserInfo();



                    if ($.isEmptyObject($scope.users)) {
                        $scope.login = true;
                        $scope.logout = false;
                        $scope.register = true;
                        $scope.loginname = false;

                    } else {
                        $scope.register = false;
                        $scope.logout = true;
                        $scope.login = false;
                        if ($scope.users.type == "user") {
                            $scope.loginuser = true;
                        } else {

                            $scope.logindoctor = true;
                        }
                        $scope.loginname = $scope.users.name;

                    }

                });


                /* ----------- end  ------- --*/



                //--------------------- FUNCTION LOGOUT ---------------------/

                $scope.logout1 = function () {
                    Authentication.removeUserInfo();
                    localStorageService.remove("userInfo");
                    localStorageService.remove("userAccountdata");
                    $scope.login = true;
                    $scope.logout = false;
                    $scope.register = true;
                    $scope.loginname = false;
                    $scope.loginuser = false;
                    $scope.logindoctor = false;
                    var cookies = document.cookie.split(";");
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i];
                        var eqPos = cookie.indexOf("=");
                        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                    $scope.headerShowHide();
                    $state.go("homepage");
                }


                //--------------------Check email  not already in database -----------------

                $scope.noEmail  = false;
                $scope.noMobile = false;
                
                $scope.checkemail = function (user) {
                    $scope.register = "Register";
                    if (user == undefined || (user != undefined && user == '') || (user != undefined && user.indexOf('@') == -1)) {
                        $scope.noEmail = false;
                        $scope.alreadyexist = false;
                        return false;
                    }
                    var email = new Object();
                    email = {
                        email: user
                    }
                    $scope.noEmail = true;
                    $scope.register = "checking email";
                    $scope.runRoute(
                        routes.core.checkEmail, email,
                        function (success) {
                            if (success.data == "true") {
                                $scope.noEmail = true;
                                $scope.alreadyexist = true;
                            } else {
                                $scope.noEmail = false;
                                $scope.alreadyexist = false;
                                $scope.register = "Register";
                            }
                        },
                        function (err) {
                            $scope.register = "Register";
                            console.log("error");
                        }
                    );
                }

                $scope.checkmobile = function (user) {
                    $scope.register = "Register";
                    if (user == undefined || (user != undefined && user == '')) {
                        $scope.Email = false;
                        $scope.alreadyexistmobile = false;
                        return false;
                    } console.log(user);
                    var mobile = new Object();
                    mobile = {
                        mobile: user
                    }
                    $scope.Email = true;
                    $scope.register = "checking mobile";
                    $scope.runRoute(
                            routes.core.checkMobile, mobile,
                            function (success) {
                                console.log(success.data);

                                if (success.data == "true") {

                                    $scope.noEmail = true;
                                    $scope.alreadyexistmobile = true;

                                } else {
                                    $scope.noEmail = false;
                                    $scope.alreadyexistmobile = false;
                                    $scope.register = "Register";
                                }
                            },
                            function (err) {
                                $scope.register = "Register";
                                console.log("error");
                            }
                    );
                }
                
                $scope.checkpwdvalidation   =   function (user) {
                    if(user.match(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/)){
                        $scope.passwordvalidation = false;
                        $scope.noEmail = false;
                    }else{
                        $scope.passwordvalidation = true;
                        $scope.noEmail = true;
                    }
                }
                //-----------------------end-----------------------

                //switch  
                $scope.doctorsignup = true;
                $scope.usersignup = false;
                $scope.switch = function () {
                    $scope.doctorsignup = false;
                    $scope.usersignup = true;
                }


                $scope.sendEmail = function (data, type) {
                    var email = {
                        email: data
                    }
                    if (data != "") {
                        if (type == "user") {
                            $http.post(restApiUrl + "users/verify/email", email).then(function (success) {},
                                    function (error) {

                                    });
                        } else {
                            $http.post(restApiUrl + "doctors/verify/email", email).then(function (success) {},
                                    function (error) {

                                    });
                        }
                    }
                }
                $scope.checkEmail = function () {
                    if ($scope.answers[qId]) { //If it is checked

                    }
                }

                //upload Pic Function
                $scope.uploadFile = function (file, event) {
                    console.log(file);
                    angular.element(".dr-profile-image").css("opacity", '1');
                    angular.element(".upicon").hide();
                    $(event.target).hide();
                    angular.element('.saveNewImage').hide();
                    angular.element('.editImage').show();
                    $scope.users = Authentication.getUserInfo();
                    console.log($scope.users);
                    console.log($scope.users.userId);
                    console.log(file);
                    $scope.showsave = false;
                    file.imgName = file.name;
                    console.log(file);
                    file.upload = Upload.upload({
                        url: restApiUrl + "doctors/" + $scope.users.userId + "/image",
                        data: file,
                    });
                    console.log(restApiUrl + "doctors/" + $scope.users._id + "/image");

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                            console.log(response.data.image);
                            var userDetail = Authentication.getUserInfo();
                            console.log(userDetail);
                            userDetail.image = response.data.image;
                            Authentication.addUserInfo(userDetail);
                            console.log(userDetail.image);
                            $scope.users.image = userDetail.image;
                            $scope.$apply();
                            console.log(Authentication.getUserInfo());
                            $scope.showsave = false;
                            $scope.showChange = false;

                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }



                $scope.uploadCropImage = function (file, name) {
                    var url = "";

                    var imgData = {
                        "file": file,
                        "imgName": name
                    };
                    if ($scope.users.type == "doctor") {
                        url = restApiUrl + "doctors/" + $scope.users.userId + "/image";
                    } else if ($scope.users.type == "user") {
                        url = restApiUrl + "users/" + $scope.users.userId + "/image"
                    }

                    var a = Upload.upload({
                        url: url,
                        data: imgData,
                    });
                    a.then(function (response) {
                        $timeout(function () {
                            //file.result = response.data;

                            var userDetail = Authentication.getUserInfo();
                            var userDetailSetAccount = setAccountData.getUserInfo();
                            console.log(userDetail);
                            userDetail.image = response.data.image;
                            userDetailSetAccount.image = response.data.image;
                            Authentication.addUserInfo(userDetail);
                            setAccountData.addUserInfo(userDetailSetAccount);
                            $scope.users.image = userDetail.image;

                            $scope.$apply();
                            toaster.pop('success', "success", "Image update successful");

                            window.location.reload();
                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status +
                                    ': ' + response.data;
                    }, function (evt) {
                        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                    });
                }




                $scope.uploadUserFile = function (file) {

                    $scope.users = Authentication.getUserInfo();
                    console.log($scope.users.userId);
                    console.log(file);

                    file.imgName = file.name;
                    console.log(file);
                    file.upload = Upload.upload({
                        url: restApiUrl + "users/" + $scope.users.userId + "/image",
                        data: file,
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                            var userDetail = Authentication.getUserInfo();
                            userDetail.image = response.data.image;
                            console.log("new image" + userDetail.image);
                            Authentication.addUserInfo(userDetail);
                            console.log(userDetail);
                            $scope.users.image = userDetail.image;
                            $scope.$apply();
                            $scope.showsave = false;
                            $scope.showChange = false;

                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }

                $scope.sharePost = function () {

                }

                $scope.homepage = function (user) {

                    $scope.filter = {
                        day: [],
                        category: [],
                        fees: {
                            "end": 500,
                            "start": 0
                        },
                        time: {
                            "end": 0,
                            "start": 0
                        },
                        gender: [],
                        language: [],
                        location: [],
                        limit: 10,
                        offset: 0,
                        sort: ''
                    };
                    $scope.filter.location = user.location;

                    $scope.filter.category.push(user.speciality);

                    setfilterService.setfilterdata($scope.filter);
                    $state.go("doctors");

                }



                $scope.checklogin = function () {

                    if ($.isEmptyObject(Authentication.getUserInfo()))
                        return false;
                    else
                        return true;
                }

                //Filter Function
                $scope.doctorlist = [];
                $scope.hospitalDetail = [];
                $scope.labsdata = [];
                $scope.problemgetlists = [];
                var checkindexvalue = 0;
                var setIndex = 0;
                var setarray = [];
                var closest = null;
                var send = 0;


                $scope.getFilterList = function (filter, type, placeHolder) {

                    setfilterdata2 = filter;
                    servicetype = type;
                    place = placeHolder;
                    $rootScope.s1 = {};
                    $rootScope.s1.setvalueSearchBox = filter.searchBy;
                    $(placeHolder).css("display", "block");

                    switch (type) {

                        case 'doctors':
                            {
                                $scope.doctorlist = [];

                                $http.post(restApiUrl + "doctors/list/filter", filter)
                                        .then(function (result) {

                                            if (result.data.length != 0) {

                                                if (!($.isArray(result.data))) {
                                                    $scope.doctorlist.push(result.data);
                                                } else {
                                                    checkindexvalue = parseFloat("28.5238323");

                                                    for (var j = 0; j < result.data.length; j++) {

                                                        if (result.data[j].address != undefined) {


                                                            for (var i = 0; i < result.data[j].address.length; i++) {

                                                                setarray.push(result.data[j].address[i].cordinate[0]);

                                                            }
                                                            $.each(setarray, function () {

                                                                if (closest != null || Math.abs(this - checkindexvalue) < Math.abs(closest - checkindexvalue)) {
                                                                    closest = this;
                                                                    send = setarray.indexOf(closest);

                                                                }
                                                            });
                                                        }

                                                        result.data[j].indexId = send;
                                                        setarray = [];
                                                    }
                                                    $scope.doctorlist = result.data;
                                                }
                                                follow.addUserInfo(result.data);
                                                $(placeHolder).css("display", "none");

                                            }
                                            $(placeHolder).css("display", "none");
                                        },
                                                function (err) {
                                                    console.log(err);
                                                });
                            }
                            break;
                        case 'hospitals':
                            {
                                $scope.hospitalDetail = [];

                                $http.post(restApiUrl + "hospitals/list/filter", filter)
                                        .then(function (result) {

                                            if (!($.isArray(result.data))) {
                                                $scope.hospitalDetail.push(result.data);
                                            } else {

                                                $scope.hospitalDetail = result.data;

                                            }
                                            $(placeHolder).css("display", "none");
                                        },
                                                function (err) {
                                                    console.log(err);
                                                });

                            }
                            break;
                        case 'labs':
                            {
                                $scope.labsdata = [];

                                $http.post(restApiUrl + "labs/list/filter", filter)
                                        .then(function (result) {

                                            if (!($.isArray(result.data))) {
                                                $scope.labsdata.push(result.data);
                                                console.log($scope.labsdata);
                                            } else {
                                                $scope.labsdata = result.data;
                                                console.log($scope.labsdata);
                                            }
                                            $(placeHolder).css("display", "none");
                                        },
                                                function (err) {
                                                    console.log(err);
                                                });

                            }
                            break;
                        case 'problems':
                            {

                                $scope.problemgetlists = [];

                                $http.post(restApiUrl + "forum/list/filter", filter)
                                        .then(function (result) {
                                            if (!($.isArray(result.data))) {
                                                if (result.data.problems != undefined)
                                                    $scope.problemgetlists.push(result.data);
                                                //$scope.problemgetTags = result.data.tags;
                                                console.log(result);
                                                $(placeHolder).css("display", "none");
                                            } else {
                                                $scope.problemgetlists = result.data;
                                                //$scope.problemgetTags = result.data.tags;
                                                console.log(result);
                                                $(placeHolder).css("display", "none");
                                            }
                                        },
                                                function (err) {
                                                    console.log(err);
                                                });

                            }
                            break;
                        default:
                            {
                            }
                            break;
                    }

                }
                $scope.setImageModel = function (data, caption) {
                    $scope.imageServer3 = data;
                    $scope.caption = caption;
                }

                $scope.sortDoctorlist = [];
                $scope.setlistforsearch = [];
                $scope.setDesList = [];

                $scope.sortToPrice = function () {
                    var m = 0;
                    console.log($scope.doctorlist);
                    var beforePrice = 0;
                    for (var i = 0; i < $scope.doctorlist.length; i++) {

                        if ($scope.doctorlist[i].address != undefined) {
                            var price = $scope.doctorlist[i].address[$scope.doctorlist[i].indexId].fee.amount;
                            $scope.setlistforsearch.push(price);
                        } else {
                            $scope.setlistforsearch.push(0);
                        }

                    }
                    //    for (var k=0;k<$scope.setlistforsearch.length;k++) {

                    //             for (var t=0;t<=$scope.setlistforsearch.length;t++) {
                    //       // console.log($scope.setlistforsearch[t]);
                    //        if($scope.setlistforsearch[t]==$scope.setlistforsearch[t]) {
                    //   //   console.log($scope.setlistforsearch[t]);
                    // //    $scope.setDesList.push(t);
                    //     m=t;
                    //   //  console.log(t);

                    //       }
                    //     //        console.log(m)
                    //             }
                    //            console.log(m);
                    //            $scope.setDesList.push(m);
                    //    }

                    // var b = Math.max($scope.setlistforsearch);

                    var b = Math.max.apply(Math, $scope.setlistforsearch);
                    console.log(b);
                    console.log($scope.setlistforsearch.indexOf(b))
                    $scope.setDesList.push(b);

                    // console.log($scope.setDesList);
                    // console.log($scope.setlistforsearch);
                }


                $scope.showModal = false;

                $scope.toggleModal = function (a, b, c) {
                    var data = $("#confirmAlert");
                    data.data("a", a);
                    data.data("b", b);
                    data.data("c", c);
                    $scope.showModal = !$scope.showModal;

                };

                $scope.triggerEvent = function () {

                    $scope.report($("#confirmAlert").data("a"), $("#confirmAlert").data("b"), $("#confirmAlert").data("c"));
                    $scope.showModal = !$scope.showModal;
                }
                $scope.noTriggerEvent = function () {

                    $scope.showModal = !$scope.showModal;
                }

                // send email address for mail password in forget password

                $scope.sendMail = function (email, type) {
                    var data = {
                        "email": email
                    };
                    if (type == "user") {
                        $http.post(restApiUrl + "users/forgotPassword/mail", data).then(function (success) {
                            toaster.pop('success', "success", "Mail is sent to your registered mail");
                        },
                        function (error) {
                            toaster.pop('error', "error", "You have entered wrong email");
                        });
                    }else{
                        $http.post(restApiUrl + "doctors/forgotPassword/mail", data).then(function (result) {
                            toaster.pop('success', "success", "Mail is sent to your registered mail");
                        }, function (err) {
                            toaster.pop('error', "error", "You have entered wrong email");
                        });
                    }
                }

                // update password in forget password

                $scope.updatePassword = function (password) {


                    var data = {
                        "password": "12345"
                    };

                    $http.put(restApiUrl + "doctors/accounts/14effa50-dab7-11e5-bfe1-b742d905af0a", data).then(function () {
                        console.log("sent");
                    }, function (err) {
                        console.log(err);
                    });
                }


                $scope.setSearch = function (dataset, setSearchType) {
                    switch (searchType) {
                        case "problem":
                            $scope.filter = {
                                category: [],
                                location: [],
                                limit: 10,
                                offset: 0,
                                sort: "",
                                searchBy: ""
                            };
                            if ((dataset.setValueType == 'problemCat' || dataset.setValueType == 'doctorCat') && dataset.setvalueSearchBox != '') {
                                $scope.filter.category.push(dataset.setvalueSearchBox)
                            } else if (dataset.setValueType != 'Speciality') {
                                $scope.filter.searchBy = dataset.setvalueSearchBox;
                            } else if (dataset.setValueType == 'Speciality' && dataset.setvalueSearchBox != "" && dataset.setvalueSearchBox != undefined) {
                                $scope.filter.category.push(dataset.setvalueSearchBox);
                            }
                            $scope.filter.location = dataset.location;
                            setfilterService.setfilterdata($scope.filter, "problem");
                            $state.go("problemInfo");
                            $scope.select("3");
                            break;
                        case "lab":
                            $scope.filter = {
                                day: [],
                                test: [],
                                facilities: [],
                                time: {
                                    end: 24,
                                    start: 0
                                },
                                fees: {
                                    end: 2000,
                                    start: 0
                                },
                                location: "",
                                limit: 10,
                                offset: 0,
                                type: "",
                                searchBy: ""
                            };
                            if (dataset.setValueType == 'labsCat' && dataset.setvalueSearchBox != '') {
                                $scope.filter.test.push(dataset.setvalueSearchBox)
                            } else if (dataset.setValueType != 'TestName') {
                                $scope.filter.searchBy = dataset.setvalueSearchBox;
                            } else if (dataset.setValueType == 'TestName' && dataset.setvalueSearchBox != "" && dataset.setvalueSearchBox != undefined) {
                                $scope.filter.test.push(dataset.setvalueSearchBox);
                            }
                            $scope.filter.location = dataset.location;
                            setfilterService.setfilterdata($scope.filter, "lab");
                            $state.go("labs");
                            $scope.select("2");
                            break;
                        case "hospital":
                            $scope.filter = {
                                day: [],
                                speciality: [],
                                facilities: [],
                                time: {
                                    end: 24,
                                    start: 0
                                },
                                location: "",
                                limit: 10,
                                offset: 0,
                                searchBy: ""
                            };
                            if (dataset.setValueType == 'hospitalCat' && dataset.setvalueSearchBox != '') {
                                $scope.filter.speciality.push(dataset.setvalueSearchBox)
                            } else if (dataset.setValueType != 'Speciality') {
                                $scope.filter.searchBy = dataset.setvalueSearchBox;
                            } else if (dataset.setValueType == 'Speciality' && dataset.setvalueSearchBox != "" && dataset.setvalueSearchBox != undefined) {
                                $scope.filter.speciality.push(dataset.setvalueSearchBox);
                            }
                            $scope.filter.location = dataset.location;
                            setfilterService.setfilterdata($scope.filter, "hospital");
                            $state.go("hospital_list");
                            $scope.select("1");
                            break;
                        case "doctor":
                        default:
                            $scope.filter = {
                                day: [],
                                category: [],
                                fees: {
                                    "end": 4000,
                                    "start": 0
                                },
                                time: {
                                    "end": 24,
                                    "start": 0

                                },
                                gender: [],
                                language: [],
                                location: "",
                                limit: 10,
                                offset: 0,
                                sort: '',
                                searchBy: '',
                                services: []
                            };
                            if (dataset.setValueType == 'doctorCat' && dataset.setvalueSearchBox != '') {
                                $scope.filter.category.push(dataset.setvalueSearchBox)
                            } else if (dataset.setValueType != 'Speciality') {
                                $scope.filter.searchBy = dataset.setvalueSearchBox;
                            } else if (dataset.setValueType == 'Speciality' && dataset.setvalueSearchBox != "" && dataset.setvalueSearchBox != undefined) {
                                $scope.filter.category.push(dataset.setvalueSearchBox);
                            }
                            $scope.filter.location = dataset.location;
                            setfilterService.setfilterdata($scope.filter, "doctor");
                            $state.go("doctors");
                            $scope.select("0");
                            break;
                    }
                }


                $scope.setfilter = function (data, type) {
                    angular.element('.width_input li').hide();
                    $scope.user.setvalueSearchBox = data;
                    $scope.user.setValueType = type;
                    $scope.setSearchList = [];
                }

                $scope.isLoggedIn = function () {

                    if (!($.isEmptyObject(Authentication.getUserInfo()))) {
                        //  console.log("false");
                        return false;
                    } else {
                        // console.log("true");
                        return true;
                    }
                };


                var obj = new Array();
                var categoryMainArray = new Array();
                var count = 0;
                for (var i = 0; i <= docCat.length; i++) {
                    if (count <= 1) {
                        obj.push(docCat[i]);
                        count++;
                    } else {
                        count = 0;
                        i--;
                        categoryMainArray.push(obj);
                        obj = [];
                    }
                }
                ;


                var obj1 = new Array();
                var categoryMainLabs = new Array();
                var count1 = 0;
                for (var i = 0; i <= labTest.length; i++) {
                    if (count1 <= 1) {
                        obj1.push(labTest[i]);
                        count1++;
                    } else {
                        count1 = 0;
                        i--;

                        categoryMainLabs.push(obj1);
                        obj1 = [];
                    }
                }
                ;

                var obj2 = new Array();
                var categoryMainHospital = new Array();
                var count1 = 0;
                for (var i = 0; i < docCat.length; i++) {
                    if (count1 <= 1) {
                        obj2.push(docCat[i]);
                        count1++;
                    } else {
                        count1 = 0;
                        i--;

                        categoryMainHospital.push(obj2);
                        obj1 = [];
                    }
                }
                ;



                $scope.categoryMainPage = categoryMainArray;
                $scope.categoryMainPage1 = categoryMainLabs;
                $scope.categoryMainPage2 = categoryMainHospital;
                $scope.changeCity = function (x) {
                    $scope.currentCity = x;
                }
                $scope.allCategory = '';

                $scope.setSearchBoxx = function (data) {
                    $scope.setSearchList = [];

                    for (var i = 0; i < Object.keys(searchList).length; i++) {

                        $scope.searchList = $.grep(searchList[Object.keys(searchList)[i]], function (value, j) {

                            if (value.indexOf(data) == 0 || value.toLowerCase().indexOf(data) == 0) {
                                var setObj = {
                                    type: Object.keys(searchList)[i],
                                    dat: value
                                }
                                $scope.setSearchList.push(setObj);
                            }
                        });
                    }

                }

                $scope.matchCategory = function (key, e) {
                    var callService = true;
                    $scope.newList.list = [];
                    var list = [],
                            name, count = 0;
                    var code = e.keyCode || e.which;
                    if (code == 40 || code == 38) {
                        // mainLi.eq(0).addClass("hovered");
                        callService = false;
                    }

                    if (key != "" && callService === true) {
                        $http.post(restApiUrl + 'doctors/list/category', data2).then(function (success) {
                            console.log(success.data);
                            $scope.allCategory = success.data.tags;

                            for (var i = 0; i < $scope.allCategory.length; i++) {
                                $scope.allCategory = $.grep($scope.allCategory, function (value, j) {
                                    if (value.catgName.indexOf(key) == 0 || value.catgName.toLowerCase().indexOf(key) == 0) {
                                        console.log(value.catgName, key);
                                        var setObj = {
                                            "catg": value.catg,
                                            "catgName": value.catgName
                                        }
                                        $scope.newList.list.push(setObj);
                                        console.log($scope.newList.list);
                                        count = count + 1;
                                    }
                                });
                            }

                            if (count === 1 || count > 1) {
                                list.push($scope.allCategory);
                                $scope.allCategory = $scope.newList.list;
                            } else {
                                $scope.allCategory = [];
                            }
                        }, function (err) {
                            console.log(err);
                        });
                    } else if (key == "") {
                        // $scope.allCategory = [];
                        angular.element('.width_input li').hide();
                    }
                }


                // $scope.userImg = function() {
                //   var users = Authentication.getUserInfo();
                //   var details = setAccountData.getUserInfo();
                //   console.log(details);
                //   console.log(users);
                //   var img;
                //    console.log(users.fbId, users.image);
                //    if( users.fbId !=undefined ) {
                //         img = 'https://graph.facebook.com/'+users.fbId+'/picture'  
                //    } else if ( users.image != undefined) {
                //        if(users.image.length > 0) {
                //         img = imageServer+'/'+users.image+'' ;
                //        }
                //    } else if(users.type == 'doctor') {
                //         img = details.gender= 'Male' ? 'assets/img/Dr1.png' : 'assets/img/femaledoctor.png';
                //    } else if(users.type == 'user') {
                //         img = details.gender == 'Male' ? 'assets/img/user_img.png' : 'assets/img/04.png';
                //    }

                //    return img;    

                // }
                $scope.checkRelevant = function (pObj) {
                    var ifFollowExist = undefined;
                    if ($.isEmptyObject(Authentication.getUserInfo()) || pObj == undefined)
                        return false;
                    else {
                        if ($scope.users.type == 'doctor') {
                            if (pObj.upVotes && pObj.upVotes.length > 0) {
                                for (var f = 0; f < pObj.upVotes.length; f++) {
                                    if (pObj.upVotes[f].userId == Authentication.getUserInfo().userId && pObj.upVotes[f].role == Authentication.getUserInfo().type) {
                                        ifFollowExist = true;
                                    }
                                }
                                if (ifFollowExist == true) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                }

                //ifOwnerProblem
                $scope.ifOwnerProblem = function (pObj) {
                    if ($.isEmptyObject(Authentication.getUserInfo()) || pObj == undefined)
                        return false;
                    else {
                        if (pObj.details.userId == Authentication.getUserInfo().userId) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }

                //if owner Problem Answer
                $scope.ifOwnerProblemAnswer = function (pObj) {
                    if ($.isEmptyObject(Authentication.getUserInfo()) || pObj == undefined)
                        return false;
                    else {
                        if (pObj.repliedBy.userId == Authentication.getUserInfo().userId) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }

                //if owner Problem Comment
                $scope.ifOwnerProblemComment = function (pObj) {
                    if ($.isEmptyObject(Authentication.getUserInfo()) || pObj == undefined)
                        return false;
                    else {
                        if (pObj.details.userId == Authentication.getUserInfo().userId) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }

                //Delete Problem
                $scope.delProblem = function (pObj) {
                    $http.delete(restApiUrl + "forum/" + pObj, '')
                            .then(function (success) {

                            },
                                    function () {
                                        console.log(error);
                                    })
                }

                //Delete Problem Answer
                $scope.delProblemAnswer = function (pId, oId) {
                    $http.post(restApiUrl + "forum/" + pId + "/delAnswer", {"answerId": oId})
                            .then(function (success) {

                            },
                                    function () {
                                        console.log(error);
                                    })
                }

                //Delete Problem comment
                $scope.delProblemComment = function (pId, oId, answerIndex) {
                    $http.post(restApiUrl + "forum/" + pId + "/delComments", {"feedbackId": oId, "answerIndex": answerIndex})
                            .then(function (success) {

                            },
                                    function () {
                                        console.log(error);
                                    })
                }

                //Check Follow
                $scope.checkFollow = function (pObj) {
                    var ifFollowExist = undefined;
                    if ($.isEmptyObject(Authentication.getUserInfo()) || pObj == undefined)
                        return false;
                    else {
                        if (pObj.followers && pObj.followers.length > 0) {
                            for (var f = 0; f < pObj.followers.length; f++) {
                                if (pObj.followers[f].userId == Authentication.getUserInfo().userId && pObj.followers[f].role == Authentication.getUserInfo().type) {
                                    ifFollowExist = true;
                                }
                            }
                            if (ifFollowExist == true) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                }

                //SaveNotification
                $scope.saveNotification = function (obj) {
                    $http.post(restApiUrl + "core/addNotification", obj)
                            .then(function (success) {
                                console.log('addNotification', success);
                            },
                                    function () {
                                        console.log(error);
                                    })
                }

                //Follow Problem
                $scope.followProblem = function (pObj, ifCheck) {
                    if ($.isEmptyObject(Authentication.getUserInfo()))
                        return pObj;
                    //var $elm = $(e.target);
                    var fObj = {
                        "userId": Authentication.getUserInfo().userId,
                        "role": Authentication.getUserInfo().type
                    }

                    var notify = {
                        "repliedBy": {
                            "name": Authentication.getUserInfo().name,
                            "readstatus": 0,
                            "role": Authentication.getUserInfo().type,
                            "userId": Authentication.getUserInfo().userId
                        },
                        "action": "follow",
                        "ownerId": pObj.details.userId,
                        "forumId": pObj._id,
                        "question": pObj.question,
                        "comment": "",
                        "createdDate": new Date()
                    };

                    var ifFollowExist = false;
                    var probFollowers = pObj.followers || [];
                    var fCount = pObj.followNumber || 0;
                    if (probFollowers.length > 0) {
                        for (var f = 0; f < probFollowers.length; f++) {
                            if (probFollowers[f].userId == fObj.userId && probFollowers[f].role == fObj.role) {
                                ifFollowExist = true;
                            }
                        }
                        if (ifFollowExist == true && ifCheck != true) {
                            probFollowers.splice(probFollowers.indexOf(fObj), 1);
                            fCount = fCount - 1;
                        } else if (ifFollowExist != true) {
                            probFollowers.push(fObj);
                            fCount = fCount + 1;
                        }
                    } else {
                        probFollowers.push(fObj);
                        fCount = fCount + 1;
                    }

                    var followObj = {
                        "followers": probFollowers,
                        "followNumber": fCount
                    }

                    pObj.followers = probFollowers;
                    pObj.followNumber = fCount;
                    $http.put(restApiUrl + "forum/" + pObj._id, followObj).then(function (success) {
                        //$elm.next('.followCount').html(fCount);
                        if (ifFollowExist == false) {
                            $scope.saveNotification(notify);
                        }
                    },
                            function () {
                                console.log(error);
                            })
                    return pObj;
                }

                //Relevant Problem
                $scope.relevantProblem = function (pObj, e) {
                    if ($.isEmptyObject(Authentication.getUserInfo()) || Authentication.getUserInfo().type == undefined || Authentication.getUserInfo().type == 'user') {
                        return pObj;
                    }
                    //var $elm = $(e.target);
                    var fObj = {
                        "userId": Authentication.getUserInfo().userId,
                        "role": Authentication.getUserInfo().type
                    }
                    var notify = {
                        "repliedBy": {
                            "name": Authentication.getUserInfo().name,
                            "readstatus": 0,
                            "role": Authentication.getUserInfo().type,
                            "userId": Authentication.getUserInfo().userId
                        },
                        "action": "relevant",
                        "ownerId": pObj.details.userId,
                        "forumId": pObj._id,
                        "question": pObj.question,
                        "comment": "",
                        "createdDate": new Date()
                    };

                    var ifRelExist = false;
                    var probRelevance = pObj.upVotes || [];
                    var fCount = pObj.upVoteDoctor || 0;
                    if (probRelevance.length > 0) {
                        for (var f = 0; f < probRelevance.length; f++) {
                            if (probRelevance[f].userId == fObj.userId && probRelevance[f].role == fObj.role) {
                                ifRelExist = true;
                            }
                        }
                        if (ifRelExist == true) {
                            probRelevance.splice(probRelevance.indexOf(fObj), 1);
                            fCount = fCount - 1;
                        } else {
                            probRelevance.push(fObj);
                            fCount = fCount + 1;
                        }
                    } else {
                        probRelevance.push(fObj);
                        fCount = fCount + 1;
                    }

                    var followObj = {
                        "upVotes": probRelevance,
                        "upVoteDoctor": fCount
                    }
                    pObj.upVotes = probRelevance;
                    pObj.upVoteDoctor = fCount;
                    $http.put(restApiUrl + "forum/" + pObj._id, followObj).then(function (success) {
                        //$elm.next('.relevantCount').html(fCount);
                        if (ifFollowExist == false) {
                            $scope.saveNotification(notify);
                        }
                    },
                            function () {
                                console.log(error);
                            })
                    return pObj;
                }

                /*
                 Get Nearest Address as Per Lat / Lng
                 */
                function deg2rad(deg) {
                    return deg * (Math.PI / 180)
                }
                $scope.getNearAdd = function (filter, address, primaryAdd) {
                    var dis = 0, disInx = 0;
                    if (filter.location != undefined && filter.location.lat && filter.location.lng) {
                        for (var i = address.length - 1; i >= 0; i--) {
                            var R = 6371; // Radius of the earth in km
                            /*var dLat = deg2rad(filter.location.lat-address[i].cordinate[1]);  // deg2rad below
                             var dLon = deg2rad(filter.location.lng-address[i].cordinate[0]); 
                             var a = 
                             Math.sin(dLat/2) * Math.sin(dLat/2) +
                             Math.cos(deg2rad(filter.location.lat)) * Math.cos(deg2rad(address[i].cordinate[1])) * 
                             Math.sin(dLon/2) * Math.sin(dLon/2)
                             ; 
                             var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                             var d = R * c; // Distance in km*/
                            var p = 0.017453292519943295;    // Math.PI / 180
                            var c = Math.cos;
                            var a = 0.5 - c((address[i].cordinate[1] - filter.location.lat) * p) / 2 +
                                    c(filter.location.lat * p) * c(address[i].cordinate[1] * p) *
                                    (1 - c((address[i].cordinate[0] - filter.location.lng) * p)) / 2;

                            var d = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
                            if (d < dis || dis == 0) {
                                dis = d;
                                disInx = i;
                            }
                        }
                    } else {
                        return primaryAdd;
                    }

                    return address[disInx];
                }



            }]);

angular.module(ApplicationConfiguration.applicationModuleName).controller('RegistorCtrl', ['$scope', '$http', '$location', '$state', 'Authentication', function ($scope, $http, $location, $state, Authentication) {
        $scope.Userinfo = Authentication.getUserInfo();
        console.log($scope.Userinfo);
        if ($scope.Userinfo.type == 'doctor') {
            $scope.doctorRegistration = true;
        } else {
            $scope.userRegistration = true;
        }

    }]);



// feedback module by Rajesh
angular.module(ApplicationConfiguration.applicationModuleName).controller('feedbackCltr', ['$scope', '$http', '$location', '$state', 'Authentication', function ($scope, $http, $location, $state, Authentication) {
    //$scope.userFeed = "test";
    $http.get("/FrontendDocpal/app/assets/json/feed.json")
    .then(function(response) {
        $scope.feed = response.data;    
    });

    //To submit feedback form
    $scope.submitFeedbackForm = function(data){
        console.log(data);
        var tmpString   =   '{"patientId": "asadas-11e6-a3b5-a321e7f7d", "patientName": "dummy patient","patientProfilePicLink": "http://sadadad","createdDate": "", "updatedDate": "","feedbackText": "dummy feedback text", "rating": {"helpfulness": 4,"waitTime": 2,"overall": 3},"doctorId": "decfb590-f04a-11e7-aa89-cfaf73b0734f","doctorName": "vishesh dummy patient","doctorProfilePicLink": "http://sadadad", "doctorReply": "dummy doctor reply text"}';
        $http.post(restApiUrl + 'feedback' , tmpString).then(function(success){
            console.log(tmpString);
        });
    }
}]);


// RATING PROCESS

angular.module(ApplicationConfiguration.applicationModuleName)
  .controller('RatingCtrl', function($scope) {
    $scope.rating = 5;
    // $scope.rateFunction = function(rating) {
    //   alert('Rating selected - ' + rating);
    // };
  })
  .directive('starRating',
    function() {
        return {
            restrict : 'A',
            template : '<ul class="rating">'
                     + '    <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
                     + '\u2605'
                     + '</li>'
                     + '</ul>',
            scope : {
                ratingValue : '=',
                max : '=',
                onRatingSelected : '&'
            },
            link : function(scope, elem, attrs) {
                var updateStars = function() {
                    scope.stars = [];
                    for ( var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled : i < scope.ratingValue
                        });
                    }
                };
                
                scope.toggle = function(index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating : index + 1
                    });
                };
                
                scope.$watch('ratingValue',
                    function(oldVal, newVal) {
                        if (newVal) {
                            updateStars();
                        }
                    }
                );
            }
        };
    }
);
