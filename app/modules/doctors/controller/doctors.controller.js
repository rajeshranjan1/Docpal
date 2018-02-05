'use strict';
/**
 * @ngdoc function
 * @name trDocpal.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the trDocpal
 */

var app = angular.module(ApplicationConfiguration.applicationModuleName);
var kk = 0;
var setlang = [];
var services = [];
var Specializationfrom = [];
var educationfrom = [];
var experiencefrom = [];
var awards = [];
var membershipfrom = [];
var registration = [];
var check_save = 0; // use to check user save data by enter or click on save button
var getid = "";
var previousid = -1; // for toggle button to hide last id on doctor listing page
var log = 0;
var lat = 0;
var cordinates = [];
var alldata = {};
var lang = [];
var indexId = 0;
var checktoggle = 0; // In availabilty  to check whether user click fitst time 
var doctorGlobaldata = "";
var doctorlist = "";
var checkOnFilter = 0;
var doctorlist = "";
var cordinates = [];

var dataLocation = "";


$(document).on('keydown', '.input-4', function (e) {

    if (e.which == 13) {

        getid = $(this).parents().next().attr('id');

    }
});

app.controller('DoctorCtrl', ['$scope', '$compile', '$location', '$http', '$stateParams', '$state', 'Authentication', '$window', 'setfilterService', 'setAccountData', 'localStorageService', function ($scope, $compile, $location, $http, $stateParams, $state, Authentication, $window, setfilterService, setAccountData, localStorageService) {

        $scope.setvalueSearchBox = "";
        $scope.doctorregistration = true;
        $scope.userregistration = false;
        var filterData = [];
        var checkdoctor = "doctor";
        $scope.showdiv = false;



        var data = "";
        $scope.quantity = 4;
        $scope.selected = 0;
        var checksel = -1;



        /*Filter work*/
        $scope.filter = {
            day: [],
            category: [],
            fees: {
                "end": 5000,
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
            searchBy: ""
        };

        $scope.userDetails = setAccountData.getUserInfo();

        $scope.clearFilter = function () {
            $scope.filter = {
                day: [],
                category: [],
                fees: {
                    "end": 5000,
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
                searchBy: ""
            };

            // time filter
            var $slider = $(".doctorTimeFilterRange");

            $slider.slider("values", 0, 0);
            $slider.slider("values", 1, 24);
            $slider.closest('.progress-li').find(".timeUI").html("12 AM to 11 : 59 PM");

            // fees range filter
            var $slider1 = $("#slider-4");

            $slider1.slider("values", 0, 0);
            $slider1.slider("values", 1, 5000);
            $slider1.closest('.progress-li2').find(".rangeUI").html("0 to 5000")

            setfilterService.setfilterdata($scope.filter, "doctor");
            $scope.getFilterList($scope.filter, 'doctors', '#loadingPlaceholer');
        }



        $scope.setFilterdata = function (data, type) {

            if (type == 'location') {
                $scope.filter.location = data;
            } else if (type == 'category') {
                if ($.inArray(data, $scope.filter.category) !== -1) {
                    $scope.filter.category.splice($scope.filter.category.indexOf(data), '1');
                } else {
                    $scope.filter.category.push(data);
                }
            } else if (type == 'language') {
                if ($.inArray(data, $scope.filter.language) !== -1) {
                    $scope.filter.language.splice($scope.filter.language.indexOf(data), '1');
                } else {
                    $scope.filter.language.push(data);
                }
            } else if (type == 'gender') {
                if ($.inArray(data, $scope.filter.gender) !== -1) {
                    $scope.filter.gender.splice($scope.filter.gender.indexOf(data), '1');
                } else {
                    $scope.filter.gender.push(data);
                }
            } else if (type == 'day') {
                if ($.inArray(data, $scope.filter.day) !== -1) {
                    $scope.filter.day.splice($scope.filter.day.indexOf(data), '1');
                } else {
                    $scope.filter.day.push(data);
                }
            } else if (type == 'fee')
                $scope.filter.fees = data;

            else if (type == 'time')
                $scope.filter.time = data;

            setfilterService.setfilterdata($scope.filter, "doctor");
            $scope.getFilterList($scope.filter, 'doctors', '#loadingPlaceholer');

        }

        $scope.crossclick = function (data, type) {
            var indexno = "";
            if (type == 'loc') {
                $scope.filter.location = "";
            } else if (type == 'cat') {
                indexno = $scope.filter.category.indexOf(data);
                $scope.filter.category.splice(indexno, '1');
            } else if (type == 'lang') {
                console.log(data);
                indexno = $scope.filter.language.indexOf(data);
                $scope.filter.language.splice(indexno, '1');
            } else if (type == 'day') {
                console.log(data);
                indexno = $scope.filter.day.indexOf(data);
                console.log($scope.filter.day);
                $scope.filter.day.splice(indexno, '1');
            } else if (type == 'gender') {
                indexno = $scope.filter.gender.indexOf(data);
                $scope.filter.gender.splice(indexno, '1');
            }
            setfilterService.setfilterdata($scope.filter, "doctor");
            $scope.getFilterList($scope.filter, 'doctors', '#loadingPlaceholer');
        }



        /*End Filter*/
        //    console.log(setfilterService.getfilterdata());
        //Check if filter is set and type is same as page type 
        if (setfilterService.getfilterdata()[0] != undefined && setfilterService.getfilterdata()[1] == "doctor") {
            $scope.filter = setfilterService.getfilterdata()[0];
            try {
                $scope.filter.time.start = 0;
                $scope.filter.time.end = 24;
                $scope.filter.fees.start = 0;
                $scope.filter.fees.end = 5000;
            } catch (e) {
                // statements
                console.log(e);
            }
        }

        $scope.getFilterList($scope.filter, 'doctors', '#loadingPlaceholer');


        $window.onclick = function () {
            $scope.selectedindex = -1;

        };


        $scope.changeaddress = function (id, pid) {
            var data = {
                val: id
            }
            $scope.doctorlist[pid].address = $scope.doctorlist[pid].subAddress[id];

        }



        $scope.adminDelete = function (index, data, accountid) {

            $http.delete(restApiUrl + "doctors/" + data).then(function (success) {

                $scope.doctorlist.splice(index, 1);
                $http.delete(restApiUrl + "doctors/accounts/" + accountid).then(function (success) {

                },
                        function (error) {

                        });
            },
                    function (error) {

                    });
        }




        $scope.updateUrl = function (role) {
            $scope.query.role = role;
            $location.path(ConfigState.state.doctors.url).search($scope.query);
            filterResult();
        }

        $scope.showtags = function (length) {

            if (length > 4)
                return true
            else
                return false;
        }

        //  


        $scope.toggleaddress = function (id) {
            $scope.showdiv[id] = true;
        }

        //
        $scope.checktimelength = function (time) {
            if (!($.isEmptyObject(time)))
                return true;
            else
                return false;
        }




        $scope.checkLanguageLength = function (language) {
            if (!($.isEmptyObject(language)))
                return true;
            else
                return false;
        }


        $scope.showaddress = function (index) {
            return false;
        }

        $scope.changediv = function (index) {

            $scope.selectedindex = index;


        }

        // get data of a doctor and its details


        var checktype = "";
        $scope.toggleMe = function (id, doctorid, type) {

            var allDetails = $("#sec" + doctorid);
            allDetails.html("");

            allDetails.html("<img class='loadingImg' src='assets/img/loading.gif' style='height:0px' width='700px'>");
            allDetails.find(".loadingImg").animate({
                "height": "300px"
            }, 1000);
            $scope.loading[previousid] = false;
            $scope.loading[id] = true;
            $scope.colorful = id;
            if (checktype != type) {
                checktype = type;
                $scope.loading[id] = true;
            } else {
                $scope.loading[id] = true;
            }

            previousid = id;

            var data = doctorid;
            $scope.runRoute(routes.core.doctors, data, function (result) {
                $scope.content = result.data;

                console.log($scope.content);
                console.log($scope.content.registration);


                if ($scope.content.services == undefined && $scope.content.educationfrom == undefined && $scope.content.awards == undefined &&
                        $scope.content.experiencefrom == undefined && $scope.content.membershipFrom == undefined &&
                        $scope.content.registration == undefined) {
                    console.log("1");

                    allDetails.html("");
                    var compiledeHTML = $compile("<div><h3>No data to show</h3></div>")($scope);
                    allDetails.html(compiledeHTML);
                } else {
                    var compiledeHTML = $compile("<div clicker class='innerV' ></div>")($scope);
                    allDetails.html(compiledeHTML);



                    $scope.doctorname = result.data.name;
                    $scope.educationfrom = result.data.educationfrom;
                    $scope.experiance = result.data.experiance;
                    $scope.awards = result.data.awards;
                    $scope.clinic = result.data.clinic;
                    $scope.services = result.data.services;
                    $scope.experiencefrom = result.data.experiencefrom;
                    $scope.Specializationfrom = result.data.Specializationfrom;
                    $scope.membershipFrom = result.data.membershipFrom;
                    $scope.registration = result.data.registration;
                    if (typeof $scope.registration === 'string') {
                        var regTem = $scope.registration;
                        $scope.registration = [];
                        $scope.registration.push(regTem);
                    }
                }

            },
                    function (err) {
                        console.log(err);
                    }
            );
        }

        /// show map on listing of doctor
        $scope.toggleMap = function (id, doctorid, lat, log, type) {


            $("#sec" + doctorid).html("");
            $scope.loading[previousid] = false;
            $scope.loading[id] = true;
            $scope.colorful = id;

            if (checktype != type) {
                checktype = type;
                $scope.loading[id] = true;
            } else {
                $scope.loading[id] = true;
            }
            previousid = id;

            $scope.longitute = log;
            $scope.latitute = lat;

            $("#map").remove();

            var compiledeHTML = $compile("<div class='col-md-12'><div class='line map_line'><div class='map-div'><span class='background-icon'><span class='icon-select4 map-icon-class'><span></span></div><div id='map'></div></div></div>")($scope);


            $("#sec" + doctorid).html(compiledeHTML);

        };

        $scope.togglegallery = function (id, doctorid, type) {
            $("#sec" + doctorid).html("");
            $scope.loading[previousid] = false;
            $scope.loading[id] = true;
            $scope.colorful = id;
            if (checktype != type) {
                checktype = type;
                $scope.loading[id] = true;
            } else {
                $scope.loading[id] = true;
            }
            previousid = id;
            data = doctorid;
            $scope.runRoute(routes.core.doctors, data, function (result) {
                $scope.datagallery = result.data.gallery;
                console.log($scope.datagallery);

                if ($scope.datagallery == "" || $scope.datagallery == undefined) {
                    var compiledeHTML = $compile("<div><h3>No Images to show</h3></div>")($scope);
                    $("#sec" + doctorid).html(compiledeHTML);
                } else {
                    var compiledeHTML = $compile("<div class='col-md-12'><div class='line'><div gallery class='gallery1'></div></div></div>")($scope);
                    $("#sec" + doctorid).html(compiledeHTML);
                    $scope.$on('gallaryLoaded', function (ngRepeatFinishedEvent) {
                        $("#owl-demo").owlCarousel({
                            items: 3,
                            lazyLoad: true,
                            navigation: true
                        });

                        function customDataSuccess(data) {
                            var content = "";
                            for (var i in data["items"]) {
                                var img = data["items"][i].img;
                                var alt = data["items"][i].alt;
                                content += "&lt;img src=\"" + img + "\" alt=\"" + alt + "\"&gt";
                            }
                            $("#owl-demo").html(content);
                        }
                    });

                }
            },
                    function (err) {
                        console.log(err);
                    });
        }

        $scope.toggleupward = function (id) {
            $scope.loading[id] = false;
            checktype = "";
        }

        $scope.setImageModel = function (data, caption) {
            $scope.imageServer3 = data;
            $scope.caption = caption;
        }

        //--------------------- end ---------------------/


        //--------------------- add info doctor ---------------------/

        $scope.addinfodoctor = function (info) {


        }

        //--------------------- end ---------------------/

        $scope.sorting = function () {
            var data = {
                experience: 1
            };

            $http.get(restApiUrl + "doctors/list/sort", data)
                    .then(function (result) {
                        $scope.doctorlist = result.data;


                    },
                            function (err) {

                            });
        }


        $scope.doctorpage = function (data) {
            Authentication.setregistorInfo(data);

            $state.go("singledoctorInfo");
        }

        $scope.disable = false;

        $scope.checkIfObjectExist = function (docId) {
            var i, j, res = [];
            $scope.res = setAccountData.getUserInfo();
            var followIDs = $scope.res.follower;
            if (followIDs.length !== 0 && followIDs !== undefined) {
                for (i = 0; i < followIDs.length; i++) {
                    if (followIDs[i].followId === docId) {
                        console.log("matched" + i);
                        res.push("matched");
                    } else {
                        console.log(" not matched" + i);
                    }
                }
                console.log(res);
                for (j = 0; j < res.length; j++) {
                    console.log(res.length, res[j]);
                    if (res[j] == "matched") {
                        //$scope.disable = true;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }


    }]);

//--------------------- END ----------------------------/




//-------------- controller for the doctor to show header in formation on doctoer profile -----/

app.controller('DoctorInfoCtrl', ['$scope', '$state', '$location', '$http', '$stateParams', 'Authentication', '$modal', 'validation', 'toaster', function ($scope, $state, $location, $http, $stateParams, Authentication, $modal, validation, toaster) {


        $scope.user.location = "";

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };


        $scope.addCurrentAddressLocation = function (lat, lng, loc, city, state, country, addressElem) {


        };
        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.timezone = timeZone;
        $scope.locations = [];



        $scope.edit = false;
        $scope.problems = function () {
            $scope.problemtab = false;
        }

        $scope.changeValue = function (data) {
            $scope.user.location = data.completeaddres;
            dataLocation = data;
        }


        $scope.saveDoctorInfo = function (user) {
            var setdata = {
                lat: 0,
                lng: 0
            };
            if (user.gender == undefined)
                user.gender = "Male";
            $scope.saveinfo = true;
            $scope.doctorinfo = Authentication.getUserInfo();

            var doctorinfo = {
                name: $scope.doctorinfo.name,
                experience: parseFloat(user.experience),
                BloodGroup: user.BloodGroup,
                dob: user.dob,
                gender: user.gender,
                speciality: user.speciality,
                education: user.education,
                addressshow: user.Address,
                selectedaddress: user.Address,
                detailsfilled: 1, // 1 is set for check wheather user filled data or not
                indexId: 0, // this is use to set the default value of address or active
                follower: [],
                subAddress: [],
                updated_on: new Date().toLocaleString()

            }


            var gps = [{
                    "type": "Point",
                    "coordinates": []
                }]


            if (dataLocation == "") {

                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'address': user.location
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        cordinates.push(results[0].geometry.location.lng());
                        cordinates.push(results[0].geometry.location.lat());
                        gps[0].coordinates.push(results[0].geometry.location.lng());
                        gps[0].coordinates.push(results[0].geometry.location.lat());
                        user.gps = gps;
                        $scope.setaddress(doctorinfo, user);

                    } else {
                        $http.put(restApiUrl + "doctors/" + Authentication.getUserInfo().userId, doctorinfo)
                                .then(function (result) {
                                    $scope.user.location = '';
                                    $state.go('doctorprofileproblem');
                                },
                                        function (err) {
                                            $scope.user.location = '';
                                        });

                    }
                });
            } else {

                gps[0].coordinates.push(dataLocation.lng);
                gps[0].coordinates.push(dataLocation.lat);
                user.gps = gps;
                $scope.setaddress(doctorinfo, user);

            }
        }

        $scope.setaddress = function (doctorinfo, user) {
            
            console.log(user);
            $scope.doctorinfo = Authentication.getUserInfo();

            if (dataLocation.completeaddres != undefined) {
                var loc = {
                    city: dataLocation.completeaddres,
                    zipcode: dataLocation.zipCode,
                    state: dataLocation.state,
                    country: dataLocation.country,
                    timezone: dataLocation.timeZone,
                    locality: user.locality,
                }
            } else {
                var loc = {
                    city: user.location,
                    locality: user.locality
                }
            }
            if (dataLocation.lat != undefined) {
                cordinates.push(dataLocation.lng);
                cordinates.push(dataLocation.lat);
            }

            loc.cordinate = cordinates;
            var timingsave = [];
            var savefees = {
                currency: "INR",
                amount: 0
            }

            loc.timing = timingsave;
            loc.fee = savefees;
            loc.clinic = user.clinic,
                    doctorinfo.subAddress.push(loc);
            console.log(doctorinfo);

            $http.put(restApiUrl + "doctors/" + $scope.doctorinfo.userId, doctorinfo)
                    .then(function (result) {

                        // request send for saving address  

                        $http.put(restApiUrl + "doctors/" + $scope.doctorinfo.userId + "/address", loc)
                                .then(function (result) {
                                    $scope.user.location = '';
                                    $state.go('doctorprofileproblem');
                                },
                                        function (err) {
                                            $scope.user.location = '';
                                        });

                    },
                            function (err) {

                            });
        }

        $scope.toggleedit = function () {
            $scope.edit = false;
            $scope.save = true;
        }

        $scope.togglesave = function () {
            $scope.edit = true;
            $scope.save = false;
        }

        //---------------------end-------------------------------//
        $scope.mapaddress = function (address) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://maps.googleapis.com/maps/api/geocode/json",
                data: {
                    'address': address,
                    'sensor': false
                },
                success: function (data) {

                    if (data.results.length) {
                        $scope.longitute = data.results[0].geometry.location.lng;
                        $scope.latitute = data.results[0].geometry.location.lat;
                        lat = data.results[0].geometry.location.lat;
                        log = data.results[0].geometry.location.lng;


                    } else {

                    }
                }
            });
        }
        // date picker 



        //Open Modal
        $scope.open = function (photo) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                scope: $scope,
                controller: 'DoctorInfoCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    },
                    photo: function () {
                        return photo;
                    }
                }
            });
        }

    }]);


//------------------------ END ---------------------------/



app.controller('singledoctorCtrl', ['$scope', '$state', '$location', '$http', '$stateParams', 'Authentication', 'setAccountData', 'followDoctor', function ($scope, $state, $location, $http, $stateParams, Authentication, setAccountData, followDoctor) {

        var id = $stateParams.id;
        var val = $stateParams.val;

        $scope.docId = id;


        $scope.param = [{
                "type": "Services"
            }, {
                "type": "Specialization"
            }, {
                "type": "Education"
            }, {
                "type": "Experience"
            }, {
                "type": "My Fee"
            }, {
                "type": "Availability"
            }, {
                "type": "Languages"
            }, {
                "type": "Awards"
            }, {
                "type": "Membership"
            }, {
                "type": "Registrations"
            }];

        $scope.selection = [];

        $scope.runRoute(routes.core.doctors, id, function (result) {
            $scope.profile = result.data;
            //console.log("vishal",$scope.profile);
            if (typeof $scope.profile.registration === 'string') {
                var regS1 = $scope.profile.registration;
                $scope.profile.registration = [];
                $scope.profile.registration.push(regS1);
            }

            if ($scope.profile.views == undefined) {
                var data = {
                    views: 0
                }
            } else {
                var data = {
                    views: $scope.profile.views + 1
                }
            }
            $http.put(restApiUrl + "doctors/" + id, data)
                    .then(function (success) {
                        doctorlist = success.data;
                        // console.log("vishal",doctorlist);

                    },
                            function (error) {

                            });
        },
                function (err) {
                    console.log(err);
                }
        );
        $scope.$on('hospitalgallery', function (ngRepeatFinishedEvent) {

            $("#owl-demo1").owlCarousel({
                items: 3,
                lazyLoad: true,
                navigation: true
            });



        });




        $scope.setImageModel = function (data, caption) {
            $scope.imageServer3 = data;
            $scope.caption = caption;
        }
        // function to show time
        $scope.gettime = function (timing) {

            if (timing == undefined) {
                return;
            }
            var tm = "";
            for (var i = 0; i < timing.length; i++) {
                tm += timing[i].days[0] + " - " + timing[i].days[timing[i].lastday] + " \n";
                if (timing[i].time != undefined) {
                    for (var j = 0; j < timing[i].time.length; j++) {
                        var timeSlot = timing[i].time[j];
                        timeSlot.endMinute = (timeSlot.endMinute === undefined || timeSlot.endMinute == 0) ? '00' : timeSlot.endMinute;
                        timeSlot.startMinute = (timeSlot.startMinute === undefined || timeSlot.startMinute == 0) ? '00' : timeSlot.startMinute;
                        tm += timeSlot.startTime + " : " + timeSlot.startMinute + " " + timeSlot.shiftstart + " - " + timeSlot.endTime + " : " + timeSlot.endMinute + " " + timeSlot.shiftend + "\n";
                        //tm += timeSlot.startTime + " " + timeSlot.shiftstart + " - " + timeSlot.endTime + " " + timeSlot.shiftend + "\n";
                    }
                }
            }

            return tm;

        }

        $scope.follow = function (id, index) {


            $scope.infoAllData = Authentication.getUserInfo();

            var senddoctorlist = [];
            $scope.data = setAccountData.getUserInfo();
            senddoctorlist.push(doctorlist);
            index = 0;
            console.log($scope.infoAllData);
            //     followDoctor.follow($scope.infoAllData,$scope.data,senddoctorlist,id,index);

        }



        $scope.reportDoctor = function (user, id) {
            $scope.loginUser = Authentication.getUserInfo();
            user.wrong = $scope.selection;
            if ($scope.loginUser._id != undefined)
                user.userId = $scope.loginUser._id;
            user._id = id;
            $http.post(restApiUrl + "core/report", user)
                    .then(function (success) {
                        window.location.reload();
                    },
                            function (error) {

                            });
        }

        $scope.toggleSelection = function toggleSelection(employeeName) {
            var idx = $scope.selection.indexOf(employeeName);
            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selection.push(employeeName);
            }
        };

    }]);

app.controller('getlistCtrl', ['$scope', '$compile', '$state', '$location', '$http', '$stateParams', 'Authentication', 'setAccountData', 'localStorageService', 'follow', 'followDoctor', '$filter', function ($scope, $compile, $state, $location, $http, $stateParams, Authentication, setAccountData, localStorageService, follow, followDoctor, $filter) {

        $scope.colorful = -1;

        var data = {};
        var i = 0;
        $scope.filterData = {};
        $scope.sliderConfig = {
            min: 0,
            max: 5000,
            step: 10,
            values: [0, 5000]
        };
        $scope.timingX = "";
        $scope.addressX = "";
        $scope.sliderConfigTime = {
            min: 0,
            max: 24,
            step: 1,
            values: [0, 24]
        };
        $scope.filterData.fee = {};
        $scope.filterData.availability = {};
        $scope.filterData.availability.time = {};
        $scope.filterData.availability.time.start = 0;
        $scope.filterData.availability.time.end = 24;
        $scope.filterData.fee.start = 0;
        $scope.filterData.fee.end = 5000;

        $scope.results = new Object();
        $scope.addtobox = function (city) {
            $scope.results = city;
            var data = $scope.results;
            $scope.runRoute(routes.core.doctors, data, function (success) {

                $scope.doctorlist = success.data;
                console.log($scope.doctorlist);
                doctorlist = success.data;


            },
                    function (err) {
                        console.log(err);
                    }
            );
        }

        // function to show time
        $scope.gettime1 = function (timing) {

            if (timing == undefined) {
                return;
            }

            var tm = "";
            for (var i = 0; i < timing.length; i++) {
                tm += timing[i].days[0] + " - " + timing[i].days[timing[i].lastday] + "<br>";
                if (timing[i].time != undefined) {
                    for (var j = 0; j < timing[i].time.length; j++) {
                        var timeSlot = timing[i].time[j];
                        timeSlot.endMinute = (timeSlot.endMinute === undefined || timeSlot.endMinute == 0) ? '00' : timeSlot.endMinute;
                        timeSlot.startMinute = (timeSlot.startMinute === undefined || timeSlot.startMinute == 0) ? '00' : timeSlot.startMinute;
                        //tm += timeSlot.startTime + " : "+ timeSlot.startMinute + " " + timeSlot.shiftstart + " - " + timeSlot.endTime + " : "+ timeSlot.endMinute + " " + timeSlot.shiftend + "\n";
                        tm += timeSlot.startTime + " : " + timeSlot.startMinute + " " + timeSlot.shiftstart + " - " + timeSlot.endTime + " : " + timeSlot.endMinute + " " + timeSlot.shiftend + "\n";
                    }
                }

            }
            return tm;
        }


        $scope.selectAddress = function (data) {
            //   console.log(data);
            var checkindexvalue = 0;
            var setIndex = 0;
            var setarray = [];
            var closest = null;
            var send = 0;

            checkindexvalue = parseFloat("28.5238323");

            if (data != undefined) {

                for (var i = 0; i < data.length; i++) {

                    setarray.push(data[i].cordinate[0]);

                }
                $.each(setarray, function () {

                    if (closest == null || Math.abs(this - checkindexvalue) < Math.abs(closest - checkindexvalue)) {
                        closest = this;
                        send = setarray.indexOf(closest);
                    }
                });
            }

            return send;

        }


        $scope.follow = function (id, index) {

            $scope.infoAllData = Authentication.getUserInfo();

            $scope.data = setAccountData.getUserInfo();

            var doctorlist = follow.getUserInfo();

            var followcheck = {
                "followId": id,
                "type": $scope.infoAllData.type
            }



            if ($scope.data.follower != undefined) {



                var result = $filter('filter')($scope.data.follower, {
                    followId: id
                })[0];


                if (result != undefined) {

                    var result2 = $filter('filter')(doctorlist[index].following, {
                        followId: $scope.infoAllData.userId
                    })[0];

                    var s = $scope.data.follower.indexOf(result);

                    $scope.data.follower.splice(s, '1');

                    var following = {
                        "followId": $scope.infoAllData.userId,
                        "type": $scope.infoAllData.type
                    }

                    console.log(doctorlist[index].following);
                    var d = doctorlist[index].following.indexOf(result2);

                    doctorlist[index].following.splice(d, '1');

                    console.log(doctorlist[index].following);

                    followDoctor.unfollow($scope.infoAllData, $scope.data, doctorlist[index], id);
                } else {

                    followDoctor.follow($scope.infoAllData, $scope.data, doctorlist, id, index);

                }
            } else {
                $scope.data.follower = [];
                $scope.data.follower.push(followcheck);
                followDoctor.follow($scope.infoAllData, $scope.data, doctorlist, id, index);
            }

            angular.element('.btnToFollow').attr("disabled", true);
        }

        // check follow of doctor/user to check ng-disabled



        //------------------------------  end -------------------------------//


        $scope.showMore = function () {
            console.log('show more triggered');
        };




    }]);

//for put request

// start of doctor information  edit controller


app.controller('doctorProfileCtrl', ['$scope', 'localStorageService', '$http', '$location', '$stateParams', '$compile', 'Authentication', 'Upload', 'setAccountData', '$timeout', '$state', '$window', 'toaster', function ($scope, localStorageService, $http, $location, $stateParams, $compile, Authentication, Upload, setAccountData, $timeout, $state, $window, toaster) {


        $scope.find = true;
        $scope.save = false;



        $scope.doctor = {
            services: []
        };

        $scope.seturl = $state.current.url;
        $scope.idd = "";
        $scope.currpass = false;
        $scope.valid = false;
        $scope.passcheck = false;
        $scope.$on('gallarypopup', function (ngRepeatFinishedEvent) {

            loadGallery(true, 'div.thumbnail');

        });

        $scope.names = [];
        // set data for serach list
        var typeSet = ""; // set data for id
        $scope.userLog = Authentication.getUserInfo();
        $scope.getDataForLIst = function (data, type) {
            var data = {
                "type": type,
                "serviceText": data[0]
            };
            $http.post(restApiUrl + "doctors/list/services", data).then(function (result) {
                console.log(result);
                var compiledeHTML = $compile("<suggestion-box></suggestion-box>")($scope);
                $("#" + type).html(compiledeHTML);
                typeSet = type;
                $scope.names = result.data.tags;
            },
                    function (err) {

                    });
        }

        $scope.block = function (data) {
            $scope.infoAllData = Authentication.getUserInfo();
            $scope.data = setAccountData.getUserInfo();
            console.log($scope.infoAllData);
            console.log($scope.data);

        }

        $scope.setValueInBox = function (data) {
            $scope.doctor.services = [];
            $scope.doctor.services.push(data);
            $("#" + typeSet).html("");
        }



        function disableButtons(counter_max, counter_current) {
            $('#show-previous-image, #show-next-image').show();
            if (counter_max == counter_current) {
                $('#show-next-image').hide();
            } else if (counter_current == 1) {
                $('#show-previous-image').hide();
            }
        }




        /**
         *
         * @param setIDs        Sets IDs when DOM is loaded. If using a PHP counter, set to false.
         * @param setClickAttr  Sets the attribute for the click handler.
         */

        function loadGallery(setIDs, setClickAttr) {
            var current_image,
                    selector,
                    counter = 0;

            $('#show-next-image, #show-previous-image').click(function () {
                if ($(this).attr('id') == 'show-previous-image') {
                    current_image--;
                } else {
                    current_image++;
                }

                selector = $('[data-image-id="' + current_image + '"]');
                updateGallery(selector);
            });

            function updateGallery(selector) {
                var $sel = selector;
                current_image = $sel.data('image-id');
                console.log($sel.data('title'));
                $('#image-gallery-caption').text($sel.data('caption'));
                $('.modal-header #image-gallery-title').text($sel.data('title'));
                $('#image-gallery-image').attr('src', $sel.data('image'));
                disableButtons(counter, $sel.data('image-id'));
            }

            if (setIDs == true) {
                $('[data-image-id]').each(function () {
                    counter++;
                    $(this).attr('data-image-id', counter);
                });
            }

            $(setClickAttr).on('click', function () {

                updateGallery($(this));
                $("#image-gallery").modal('show');
            });

        }




        $scope.savedata = function () {

            check_save = 1;
            angular.element(".remove-span").css('display', 'none');
            angular.element(".edit-span").css('display', 'none');
            angular.element(".undo-span").css('display', 'none');
            //angular.element(".save-btn").css('display', 'none');
            angular.element(".plus-btn").css('display', 'none');
            //angular.element("#edit").css('display', 'block');
            angular.element(".add-anchor").css('display', 'none');
            angular.element(".dropdown-time-div-notedit").css('display', 'block');
            angular.element(".input--hoshi").css('display', 'none');
            angular.element("#other").removeAttr('checked');

            checktoggle = 0;
        }

        $scope.doctorInfoAllData = Authentication.getUserInfo();

        $scope.ShowMap = function (address) {

            if (address.cordinate[0] == 28.6139391) {

                getPositionAddress(address.city, function (lat, long) {

                    address.cordinate[1] = lat;
                    address.cordinate[0] = long;
                    var cordinate = [{
                            lat: address.cordinate[1],
                            lng: address.cordinate[0]
                        }];
                    var zoom = 13;
                    $("#mapModal").modal('show');
                    var myF = function (latlng) {

                        address.cordinate[0] = latlng.lng();
                        address.cordinate[1] = latlng.lat();
                    };
                    setTimeout(function () {
                        initMyMap($("#mid").get(0), cordinate, zoom, true, myF);
                    }, 200);

                });
            } else {
                var cordinate = [{
                        lat: address.cordinate[1],
                        lng: address.cordinate[0]
                    }];
                var zoom = 13;
                $("#mapModal").modal('show');
                var myF = function (latlng) {

                    address.cordinate[1] = latlng.lat();
                    address.cordinate[0] = latlng.lng();
                };
                setTimeout(function () {
                    initMyMap($("#mid").get(0), cordinate, zoom, true, myF);
                }, 200);

            }


            //$("#mapModal").find("#mid").attr("markerList",cordinate);
        };

        $http.get(restApiUrl + "doctors/" + $scope.doctorInfoAllData.userId, $scope.doctorInfoAllData)
                .then(function (result) {
                    $scope.doctorheaderdata = result.data;
                    var markerList1 = [];
                    //var genD = $scope.doctorInfoAllData.gender;
                    $scope.doctorInfoAllData = result.data;
                    if (typeof result.data.registration === "string") {
                        var regS = result.data.registration;
                        $scope.doctorInfoAllData.registration = [];
                        $scope.doctorInfoAllData.registration.push(regS);
                        $scope.doctorheaderdata.registration = [];
                        $scope.doctorheaderdata.registration.push(regS);
                    }
                    //$scope.doctorInfoAllData.gender =  genD;
                    localStorageService.remove("userAccountdata");
                    localStorageService.set("userAccountdata", result.data);
                    //setAccountData.addUserInfo(result.data);
                    try {
                        for (var i = $scope.doctorheaderdata.address.length - 1; i >= 0; i--) {

                            var lat = $scope.doctorheaderdata.address[i].cordinate[1];
                            var log = $scope.doctorheaderdata.address[i].cordinate[0];
                            var lngA = {
                                lat: lat,
                                lng: log
                            };
                            markerList1.push(lngA);
                        }
                        ;
                    } catch (e) {
                        // statements
                        console.log(e);
                    }
                    if ($("#menu1").length > 0) {
                        initMyMap($("#menu1").get(0), markerList1);
                    }

                    // $scope.markerListShow = markerList1;
                    if ($scope.doctorheaderdata.language != undefined) {
                        lang = $scope.doctorheaderdata.language;
                    }



                    try {
                        if ($scope.doctorInfoAllData.indexId == undefined) {
                            indexId = 0;
                            $scope.timining = $scope.doctorInfoAllData.address[indexId].timing;
                            $scope.doctorInfoAllData.address[indexId].fee.amount = $scope.doctorInfoAllData.address[indexId].fee.amount;
                            $scope.longitute = $scope.doctorInfoAllData.address[indexId].cordinate[0];
                            $scope.latitute = $scope.doctorInfoAllData.address[indexId].cordinate[1];
                            $scope.subaddress = $scope.doctorInfoAllData.subAddress;
                        } else {
                            indexId = $scope.doctorInfoAllData.indexId;
                            $scope.timining = $scope.doctorInfoAllData.address[indexId].timing;
                            $scope.doctorInfoAllData.address[indexId].fee.amount = $scope.doctorInfoAllData.address[indexId].fee.amount;
                            $scope.longitute = $scope.doctorInfoAllData.address[indexId].cordinate[0];
                            $scope.latitute = $scope.doctorInfoAllData.address[indexId].cordinate[1];
                        }
                        $scope.subaddress = $scope.doctorInfoAllData.subAddress;
                    } catch (e) {
                        // statements
                        console.log(e);
                    }
                },
                        function (err) {

                        });

        $scope.uploadGalleryFile = function (file, name, caption) {
            var imgCaption;
            if (caption != undefined)
                imgCaption = caption;
            else
                imgCaption = '';
            var imgData = {
                "file": file,
                "imgName": name,
                "imgCaption": imgCaption
            };


            var a = Upload.upload({
                url: restApiUrl + "doctors/" + $scope.users.userId + "/gallery",
                data: imgData,
            });
            a.then(function (response) {
                $timeout(function () {

                    toaster.pop('success', "success", "Gallery Image uploaded successfully");

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




        $scope.setDefaultMap = function () {
            $scope.longitute = $scope.doctorInfoAllData.address[indexId].cordinate[0];
            $scope.latitute = $scope.doctorInfoAllData.address[indexId].cordinate[1];
        }

        $scope.problems = function () {
            $state.go('doctorprofileproblem');
        }

        $scope.home = function (data) {
            $state.go('doctorprofile');
        }

        $scope.deleteaddress = function (id) {
            var addressId = $('#addressId').val(),
                    removeId = $('#addressIndex').val();
            console.log(id, addressId, removeId, indexId);
            if (addressId != "") {
                $http.delete(restApiUrl + "doctors/" + id + "/" + addressId).then(function (success) {

                    if (indexId > removeId) {
                        $scope.doctorInfoAllData.indexId = indexId - 1;
                        indexId = $scope.doctorInfoAllData.indexId;

                        $scope.doctorInfoAllData.address.splice(removeId, 1);
                    } else {
                        $scope.doctorInfoAllData.address.splice(removeId, 1);
                    }

                    angular.element('#address-remove').modal('hide');
                },
                        function (error) {

                        });
            } else {
                angular.element('#address-remove').modal('hide');
            }



        }



        $scope.formData = {};
        $scope.formData.languages = [];

        $scope.languages = ['English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Malayalam', 'Odia', 'Punjabi'];


        if ($scope.language != undefined) {
            lang = $scope.language;
        }
        var data = $scope.idd;

        $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        $scope.shifts = ["AM", "PM"];

        $scope.timeslotAvail = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        $scope.timining = [{
                "days": ["mon", "tue"],
                "lastday": 1,
                "time": [{
                        "startTime": "0",
                        "endTime": "0"
                    }]
            }]


        $scope.mapaddress = function (address) {

            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://maps.googleapis.com/maps/api/geocode/json",
                data: {
                    'address': address,
                    'sensor': false
                },
                success: function (data) {
                    if (data.results.length) {
                        $scope.longitute = data.results[0].geometry.location.lng;
                        $scope.latitute = data.results[0].geometry.location.lat;
                        lat = data.results[0].geometry.location.lat;
                        log = data.results[0].geometry.location.lng;


                    } else {

                    }
                }
            });
            $scope.find = false;
            $scope.save = true;
        }


        $scope.getlastweekday = function (data) {

            var da = data.length - 1;
            $scope.lastday = da;

        }

        $scope.moreTime = function (timing) {

            var moreTimeNew = {
                "startTime": "0",
                "endTime": "0",
                "shiftstart": "AM",
                "shiftend": "PM"
            };

            timing.time.push(moreTimeNew);

        };


        $scope.savelocation = function (data) {

            var gps = {
                "type": "Point",
                "coordinates": []
            }

            var loc = {
                city: data
            };

            var cordinates = [];
            cordinates.push(log);
            cordinates.push(lat);
            var timingsave = [];

            var savefees = {
                currency: "INR",
                amount: 0
            };

            gps.coordinates.push(log);
            gps.coordinates.push(lat);
            loc.cordinate = cordinates;
            loc.timing = timingsave;
            loc.fee = savefees;
            loc.gps = gps;


            $scope.doctorinfo = Authentication.getUserInfo();
            $http.put(restApiUrl + "doctors/" + $scope.doctorinfo.userId + "/address", loc)
                    .then(function (result) {

                        $scope.doctorInfoAllData.address.push(loc);
                        console.log(loc);
                        $state.go('doctorprofile');
                    },
                            function (err) {

                            });

            angular.element('#ome').trigger('click');

        }

        $scope.deleteTime = function (timing, index) {

            console.log(timing, index, timing.time.length);
            if (timing.time.length == 1) {

                return;
            }
            timing.time.splice(index, 1);

        };
        $scope.removeDays = function (index, address) {

            address.timing.splice(index, 1);

        };


        $scope.add = function (address) {

            angular.element(".dropdown-time-div").css('display', 'block');
            angular.element(".dropdown-time-div").css('display', 'block');
            var timnew = {
                "days": ["mon", "tue"],
                "lastday": 1,
                "time": [{
                        "startTime": "0",
                        "startMinute": 0,
                        "endTime": "0",
                        "endMinute": 0,
                        "shiftstart": "am",
                        "shiftend": "pm"
                    }]
            };
            address.timing.push(timnew);
        };



        $scope.addfees = function (fee) {

            if ($scope.doctorInfoAllData.address[indexId].fee == undefined) {
                $scope.doctorInfoAllData.address[indexId].fee.amount = new Object();
                $scope.doctorInfoAllData.address[indexId].fee.amount = fee;
            } else {
                $scope.doctorInfoAllData.address[indexId].fee.amount = fee;
            }


        }

        //----------------------  end  -------------------------//


        //check the length


        $scope.stateChanged = function (data) {

            var a = lang.indexOf(data);


            if (a > -1) {
                lang.splice(a, '1');
                $scope.doctorInfoAllData.language = lang;

            } else {
                lang.push(data);
                $scope.doctorInfoAllData.language = lang;

                co++;

            }


        }


        $scope.isSelected = function (l) {

            if ($scope.doctorInfoAllData.language != undefined) {
                if ($scope.doctorInfoAllData.language.indexOf(l) > -1)
                    return true;
                else
                    return false;
            }
        }




        $scope.editdoctor = function (user) {

            for (var i = 0; i < $scope.timining.length; i++) {

                var st = $scope.days.indexOf($scope.timining[i].days[0]);
                var ed = $scope.days.indexOf($scope.timining[i].days[$scope.timining[i].days.length - 1]);
                $scope.doctorInfoAllData.address[indexId].timing[i].days = [];
                for (var j = st; j <= ed; j++) {
                    $scope.doctorInfoAllData.address[indexId].timing[i].days.push($scope.days[j]);
                }
                $scope.doctorInfoAllData.address[indexId].timing[i].lastday = $scope.doctorInfoAllData.address[indexId].timing[i].days.length - 1;
            }



            // to delete the empty timing
            for (var index = 0; index < $scope.doctorInfoAllData.address[indexId].timing.length; index++) {

                if ($scope.doctorInfoAllData.address[indexId].timing[index].days[0] == '' || $scope.doctorInfoAllData.address[indexId].timing[index].days[1] == '') {

                    $scope.removeDays(index);
                    continue;
                } else {
                    for (var indexTime = 0; indexTime < $scope.doctorInfoAllData.address[indexId].timing[index].time.length; indexTime++) {
                        if ($scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].startTime == 0 || $scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].endTime == 0) {
                            //remove time olny
                            $scope.deleteTime($scope.doctorInfoAllData.address[indexId].timing[index], indexTime);
                        }
                    }
                }
            }
            var userid = Authentication.getUserInfo();
            $scope.doctorInfoAllData.image = userid.image;

            if (user == undefined) {
                user = {};

            }

            $scope.doctorinfo = Authentication.getUserInfo();

            var data = $scope.idd;

            if (services.length != 0) {

                for (i = 0; i < services.length; i++) {

                    var a = $scope.doctorInfoAllData.services.indexOf(services[i]);

                    $scope.doctorInfoAllData.services.splice(a, '1');
                }
                services = [];
            }

            if (Specializationfrom.length != 0) {

                for (i = 0; i < Specializationfrom.length; i++) {
                    var a = $scope.doctorInfoAllData.Specializationfrom.indexOf(Specializationfrom[i]);

                    $scope.doctorInfoAllData.Specializationfrom.splice(a, '1');
                }
                Specializationfrom = [];
            }

            if (setlang.length != 0) {
                for (i = 0; i < setlang.length; i++) {
                    var a = $scope.doctorInfoAllData.language.indexOf(setlang[i]);
                    $scope.doctorInfoAllData.language.splice(a, '1');
                }
                setlang = [];
            }

            if (educationfrom.length != 0) {

                for (i = 0; i < educationfrom.length; i++) {
                    var a = $scope.doctorInfoAllData.educationfrom.indexOf(educationfrom[i]);

                    $scope.doctorInfoAllData.educationfrom.splice(a, '1');
                }
                educationfrom = [];
            }

            if (experiencefrom.length != 0) {

                for (i = 0; i < experiencefrom.length; i++) {
                    var a = $scope.doctorInfoAllData.experiencefrom.indexOf(experiencefrom[i]);

                    $scope.doctorInfoAllData.experiencefrom.splice(a, '1');
                }
                experiencefrom = [];
            }

            if (awards.length != 0) {


                for (i = 0; i < awards.length; i++) {
                    var a = $scope.doctorInfoAllData.awards.indexOf(awards[i]);

                    $scope.doctorInfoAllData.awards.splice(a, '1');
                }
                awards = [];
            }

            if (membershipfrom.length != 0) {
                for (i = 0; i < membershipfrom.length; i++) {
                    var a = $scope.doctorInfoAllData.membershipFrom.indexOf(membershipfrom[i]);
                    $scope.doctorInfoAllData.membershipFrom.splice(a, '1');
                }
                membershipfrom = [];
            }
            //Registration NEw Code
            if (registration.length != 0) {
                for (i = 0; i < registration.length; i++) {
                    var a = $scope.doctorInfoAllData.registration.indexOf(registration[i]);
                    $scope.doctorInfoAllData.registration.splice(a, '1');
                }
                registration = [];
            }
            /*eND*/


            if (user.language != undefined) {
                for (var i = 0; i < user.language.length; i++) {
                    $scope.doctorInfoAllData.language.push(user.language[i]);
                }
                $scope.doctor.language = "";
            }
            if (user.name != undefined)
                $scope.doctorInfoAllData.name = user.name;

            if (user.education != undefined)
                $scope.doctorInfoAllData.education = user.education;

            if (user.experiance != undefined)
                $scope.doctorInfoAllData.experience = user.experiance;

            if (user.speciality != undefined)
                $scope.doctorInfoAllData.speciality = user.speciality;

            if (user.clinic != undefined)
                $scope.doctorInfoAllData.clinic = user.clinic;


            if (user.workingtime != undefined)
                $scope.doctorInfoAllData.workingtime = user.workingtime;

            if (user.workingday != undefined)
                $scope.doctorInfoAllData.workingday = user.workingday;




            if (user.address != undefined)
                $scope.doctorInfoAllData.address = user.address;

            if (user.longitute != undefined)
                $scope.doctorInfoAllData.longitute = user.longitute;

            if (user.latitute != undefined)
                $scope.doctorInfoAllData.latitute = user.latitute;


            if (user.services != undefined) {
                if ($scope.doctorInfoAllData.services == undefined) {

                    $scope.doctorInfoAllData.services = new Object();
                    $scope.doctorInfoAllData.services = user.services;

                } else {

                    for (var i = 0; i < user.services.length; i++) {

                        $scope.doctorInfoAllData.services.push(user.services[i]);

                    }
                }
                $scope.doctor.services = "";

            }
            if ($scope.doctorInfoAllData.timing != undefined) {
                $scope.doctorInfoAllData.address[$scope.doctorInfoAllData.indexId].timing = $scope.timining;

            } else {
                $scope.doctorInfoAllData.timing = new Object();
                $scope.doctorInfoAllData.timing = $scope.timining;
            }



            if (user.experiencefrom != undefined) {

                if ($scope.doctorInfoAllData.experiencefrom == undefined) {
                    $scope.doctorInfoAllData.experiencefrom = new Object();
                    $scope.doctorInfoAllData.experiencefrom = user.experiencefrom;

                } else {
                    for (var i = 0; i < user.experiencefrom.length; i++) {
                        $scope.doctorInfoAllData.experiencefrom.push(user.experiencefrom[i]);

                    }
                }
                $scope.doctor.experiencefrom = "";

            }

            if (user.educationfrom != undefined) {

                if ($scope.doctorInfoAllData.educationfrom == undefined) {
                    $scope.doctorInfoAllData.educationfrom = new Object();
                    $scope.doctorInfoAllData.educationfrom = user.educationfrom;
                } else {
                    for (var i = 0; i < user.educationfrom.length; i++) {
                        $scope.doctorInfoAllData.educationfrom.push(user.educationfrom[i]);

                    }
                }
                $scope.doctor.educationfrom = "";
            }

            if (user.awards != undefined) {

                if ($scope.doctorInfoAllData.awards == undefined) {
                    $scope.doctorInfoAllData.awards = new Object();
                    $scope.doctorInfoAllData.awards = user.awards;
                } else {
                    for (var i = 0; i < user.awards.length; i++) {
                        $scope.doctorInfoAllData.awards.push(user.awards[i]);
                    }
                }
                $scope.doctor.awards = "";
            }

            if (user.Specializationfrom != undefined) {
                if ($scope.doctorInfoAllData.Specializationfrom == undefined) {
                    $scope.doctorInfoAllData.Specializationfrom = new Object();
                    $scope.doctorInfoAllData.Specializationfrom = user.Specializationfrom;
                } else {
                    for (var i = 0; i < user.Specializationfrom.length; i++) {
                        $scope.doctorInfoAllData.Specializationfrom.push(user.Specializationfrom[i]);
                    }

                }
                $scope.doctor.Specializationfrom = "";

            }

            if (user.membershipfrom != undefined) {
                if ($scope.doctorInfoAllData.membershipFrom == undefined) {
                    $scope.doctorInfoAllData.membershipFrom = new Object();
                    $scope.doctorInfoAllData.membershipFrom = user.membershipfrom;
                } else {
                    for (var i = 0; i < user.membershipfrom.length; i++) {
                        $scope.doctorInfoAllData.membershipFrom.push(user.membershipfrom[i]);
                    }
                }
                $scope.doctor.membershipfrom = "";

            }

            if ($scope.doctorInfoAllData.indexId == undefined) {
                $scope.doctorInfoAllData.indexId = 0;
            }

            /*Registration NEw code*/
            if (user.registration != undefined) {
                if ($scope.doctorInfoAllData.registration == undefined) {
                    $scope.doctorInfoAllData.registration = new Object();
                    $scope.doctorInfoAllData.registration = user.registration;
                } else {
                    if (typeof $scope.doctorInfoAllData.registration === "string") {
                        var regS = $scope.doctorInfoAllData.registration;
                        $scope.doctorInfoAllData.registration = [];
                        $scope.doctorInfoAllData.registration.push(regS);
                    }
                    for (var i = 0; i < user.registration.length; i++) {
                        $scope.doctorInfoAllData.registration.push(user.registration[i]);
                    }
                }
                $scope.doctor.registration = "";

            }
            /*End*/

            var dId = $scope.doctorInfoAllData._id;
            delete $scope.doctorInfoAllData._id;
            $scope.doctorInfoAllData.subAddress = $scope.doctorInfoAllData.address;
            $scope.doctorInfoAllData.updated_on = new Date().toLocaleString();            
            $scope.doctorInfoAllData.experience = parseFloat($scope.doctorInfoAllData.experience) || 0;

            $http.put(restApiUrl + "doctors/" + Authentication.getUserInfo().userId, $scope.doctorInfoAllData)
                    .then(function (result) {
                        console.log(result.data);

                        if (check_save == '0') {

                            $('#' + getid).find('.remove-span').show();
                            $('#' + getid).find('.edit-span').show();
                        } else {
                            check_save = '0';

                        }
                    },
                            function (err) {

                            });



        }

        //--------------------------------end------------------------------//

        // ---------------------------------------- save account details-----------------//

        $scope.saveAccountData = function (data) {
            $scope.doctorinfo = Authentication.getUserInfo();
            console.log(data);

            $http.put(restApiUrl + "doctors/" + $scope.doctorinfo.userId, data)
                    .then(function (result) {
                        console.log(result.data);


                    },
                            function (err) {

                            });
        }

        //--------------------------------end------------------------------------//


        //account setting function


        //-----------------edit data of doctor edit page ----------------
        $scope.setservices = function (data, user) {
            console.log(data);
            if (data != undefined) {
                var a = $scope.doctorInfoAllData.services.indexOf(user);
                $scope.doctorInfoAllData.services[a] = data;
            }

        }

        $scope.setSpecializationfrom = function (data, user) {

            if (data != undefined) {

                var a = $scope.doctorInfoAllData.Specializationfrom.indexOf(user);
                $scope.doctorInfoAllData.Specializationfrom[a] = data;
                console.log($scope.doctorInfoAllData.Specializationfrom);
            }

        }

        $scope.seteducationfrom = function (data, user) {

            if (data != undefined) {
                var a = $scope.doctorInfoAllData.educationfrom.indexOf(user);
                $scope.doctorInfoAllData.educationfrom[a] = data;
                console.log($scope.doctorInfoAllData.educationfrom);
            }

        }


        $scope.setexperiancefrom = function (data, user) {

            if (data != undefined) {
                var a = $scope.doctorInfoAllData.experiencefrom.indexOf(user);
                $scope.doctorInfoAllData.experiencefrom[a] = data;
                console.log($scope.doctorInfoAllData.experiencefrom);
            }

        }


        $scope.setawards = function (data, user) {

            if (data != undefined) {
                var a = $scope.doctorInfoAllData.awards.indexOf(user);
                $scope.doctorInfoAllData.awards[a] = data;
                console.log($scope.doctorInfoAllData.awards);
            }

        }


        $scope.setmemberships = function (data, user) {
            if (data != undefined) {
                var a = $scope.doctorInfoAllData.membershipFrom.indexOf(user);
                $scope.doctorInfoAllData.membershipFrom[a] = data;
            }
        }

        $scope.setregistration = function (data, user) {
            if (data != undefined) {
                var a = $scope.doctorInfoAllData.registration.indexOf(user);
                $scope.doctorInfoAllData.registration[a] = data;
            }
            /*if (data != undefined) {
             
             $scope.doctorInfoAllData.registration = data;
             
             }*/

        }




        //delete data from edit page doctor
        $scope.deletelang = function (user, b) {

            var a = setlang.indexOf(user);

            if (b == 0) {
                setlang.splice(a, '1');

                console.log(setlang);
            } else {
                setlang.push(user);
                console.log(setlang);
            }

        }


        $scope.deleteservices = function (user, b) {

            var a = services.indexOf(user);

            if (b == 0) {
                services.splice(a, '1');

                console.log(services)
            } else {
                services.push(user);
                console.log(services);
            }

        }

        $scope.deleteSpecializationfrom = function (data, user, b) {
            var a = Specializationfrom.indexOf(user);
            if (b == 0) {
                Specializationfrom.splice(a, '1');

            } else {
                Specializationfrom.push(user);
            }


        }

        $scope.deleteeducationfrom = function (data, user, b) {
            var a = educationfrom.indexOf(user);
            if (b == 0) {
                educationfrom.splice(a, '1');

            } else {
                educationfrom.push(user);
            }

        }


        $scope.deleteexperiancefrom = function (data, user, b) {
            var a = experiencefrom.indexOf(user);

            if (b == 0) {
                experiencefrom.splice(a, '1');

            } else {
                experiencefrom.push(user);
            }


        }


        $scope.deleteawards = function (data, user, b) {

            var a = awards.indexOf(user);
            if (b == 0) {
                awards.splice(a, '1');

            } else {
                awards.push(user);
            }
        }


        $scope.deletememberships = function (data, user, b) {
            var a = membershipfrom.indexOf(user);
            if (b == 0) {
                membershipfrom.splice(a, '1');

            } else {
                membershipfrom.push(user);
            }
        }




        //------------------------end of delete functions-------------------------//

        // function for account password
        $scope.checkpassword = function (data) {

            $scope.doctorinfo = Authentication.getUserInfo();

            if ($scope.doctorinfo.password != data) {

                $scope.currpass = true;
                $scope.passcheck = true;
            } else {
                $scope.currpass = false;
                $scope.passcheck = false;
            }

        }


        //-------------------------------------- end --------------------------------




        //     function to save address from google map3.net

        $scope.address = function (address) {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "http://maps.googleapis.com/maps/api/geocode/json",
                data: {
                    'address': address,
                    'sensor': false
                },
                success: function (data) {
                    if (data.results.length) {
                        $scope.longitute = data.results[0].geometry.location.lat;
                        $scope.latitute = data.results[0].geometry.location.lng;
                        $scope.doctor.longitute = data.results[0].geometry.location.lat;
                        $scope.doctor.latitute = data.results[0].geometry.location.lng;
                        console.log(data.results[0].geometry.location.lat);
                    } else {

                    }
                }
            });
        }

        //--------------------------------end------------------------------//

        //---------------------------------------save address---------------------//

        $scope.changeaddress = function (data) {
            indexId = data;
            console.log(indexId);
            if ($scope.doctorInfoAllData.indexId != undefined) {
                $scope.doctorInfoAllData.indexId = data;
            } else {
                $scope.doctorInfoAllData.indexId = new Object();
                $scope.doctorInfoAllData.indexId = data;
            }
            $scope.timining = $scope.doctorInfoAllData.address[indexId].timing;

            $scope.doctorInfoAllData.fee = $scope.doctorInfoAllData.address[indexId].fee.amount;
            $scope.longitute = $scope.doctorInfoAllData.address[indexId].cordinate[0];
            $scope.latitute = $scope.doctorInfoAllData.address[indexId].cordinate[1];
        }



        //Funtion for Add more Location
        $scope.clickMap = function (address) {
            var index = address.length + 1;
            var data = {
                "clinic": "",
                "city": "",
                "timing": [],
                "cordinate": [77.20902120000005, 28.6139391],
                "fee": {
                    "currency": "INR",
                    "amount": 0
                },
                "locality": ""
            }
            $scope.doctorinfo = Authentication.getUserInfo();
            $scope.doctorInfoAllData.subAddress.push(data);
            $scope.doctorInfoAllData.address.push(data);
            var filteraddr = $scope.doctorInfoAllData.subAddress;
            console.log(data);
            var data2 = {
                "subAddress": filteraddr
            };

            //request send for saving address  
            $http.put(restApiUrl + "doctors/" + $scope.doctorinfo.userId + "/address", data)
                    .then(function (result) {
                        $scope.newADDId = result.data.addressId;
                    },
                            function (err) {
                                console.log(err);
                            });
            console.log(filteraddr);
            $http.put(restApiUrl + "doctors/" + $scope.doctorinfo.userId, data2)
                    .then(function (result) {
                        console.log(result.data);
                        $scope.doctorInfoAllData.address = result.data.address;
                        $scope.doctorInfoAllData.subAddress = result.data.subAddress;
                    },
                            function (err) {
                                console.log(err);
                            });
        }


        $scope.deleteImage = function (id) {
            var img = $("#imgName").val();
            var data = {
                "image": img
            };
            $http.post(restApiUrl + "doctors/" + Authentication.getUserInfo().userId + "/gallery/delete", data).then(function (success) {
                toaster.pop('success', "success", "Image delete successfully");
                window.location.reload();
            },
                    function (error) {
                        console.log(error);
                        toaster.pop('error', "", "Image is not deleted");
                    });
        }

        $scope.unFollow = function (id, type, userId, userType) {
            console.log(id, type, userId, userType);
            //var id2 = "d29fd931-c459-a367-696f-b9de4ef6b4f3";
            var data = [{
                    "follower": {
                        "_id": userId,
                        "type": "doctor"
                    },
                    "following": {
                        "_id": id,
                        "type": type
                    }
                }];
            $http.post(restApiUrl + "doctors/follow/unfollow/" + Authentication.getUserInfo().userId, data).then(function (success) {
                console.log(success);
            },
                    function (err) {
                        console.log(err);
                    })
        }

        $scope.saveEditAddress = function (id, address, event, indexId) {
            var thisAdd;
            if (address.fee != undefined && address.fee.amount != undefined)
                address.fee.amount = parseFloat(address.fee.amount);
            for (var i = 0; i < address.timing.length; i++) {
                var st = $scope.days.indexOf(address.timing[i].days[0]);
                var ed = $scope.days.indexOf(address.timing[i].days[address.timing[i].days.length - 1]);
                console.log($scope.doctorInfoAllData.address[indexId].timing);
                if ($scope.doctorInfoAllData.address[indexId].timing.length > 0) {
                    $scope.doctorInfoAllData.address[indexId].timing[i].days = [];
                    for (var j = st; j <= ed; j++) {
                        $scope.doctorInfoAllData.address[indexId].timing[i].days.push($scope.days[j]);
                    }
                    $scope.doctorInfoAllData.address[indexId].timing[i].lastday = $scope.doctorInfoAllData.address[indexId].timing[i].days.length - 1;
                }
            }
            //address.timing = $scope.timining;

            // to delete the empty timing
            for (var index = 0; index < $scope.doctorInfoAllData.address[indexId].timing.length; index++) {
                console.log($scope.doctorInfoAllData.address[indexId].timing[index].days[0]);
                if ($scope.doctorInfoAllData.address[indexId].timing[index].days[0] == '' || $scope.doctorInfoAllData.address[indexId].timing[index].days[1] == '' || $scope.doctorInfoAllData.address[indexId].timing[index].days[0] == undefined) {
                    $scope.removeDays(index);
                    continue;
                } else {
                    for (var indexTime = 0; indexTime < $scope.doctorInfoAllData.address[indexId].timing[index].time.length; indexTime++) {
                        $scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].startTime = parseInt($scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].startTime);
                        $scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].endTime = parseInt($scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].endTime);
                        console.log($scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].startTime);
                        if ($scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].startTime == 0 || $scope.doctorInfoAllData.address[indexId].timing[index].time[indexTime].endTime == 0) {
                            //remove time olny
                            $scope.deleteTime($scope.doctorInfoAllData.address[indexId].timing[index], indexTime);
                        }
                    }
                }
            }

            if (address.addressId == undefined) {
                thisAdd = $scope.newADDId;
            } else if ($scope.newADDId == undefined) {
                thisAdd = address.addressId;
            } else {
                thisAdd = address.addressId;
            }
            $http.put(restApiUrl + "doctors/" + setAccountData.getUserInfo()._id + "/" + thisAdd, address).then(function (success) {
                console.log(success);
                $(event.target).parent().prevAll('.editAddr').show();
                $(event.target).parent().hide();
                $scope.doctorInfoAllData.subAddress = $scope.doctorInfoAllData.address;
                var data2 = {
                    "subAddress": $scope.doctorInfoAllData.subAddress
                };

                $http.put(restApiUrl + "doctors/" + setAccountData.getUserInfo()._id, data2).then(function (success) {
                    console.log(success);
                },
                        function (err) {
                            console.log(err);
                        });
            },
                    function (err) {
                        console.log(err);
                    });

        }


        $scope.setIndexAddress = function (index) {
            console.log(index);
            var data = {
                "indexId": index
            };
            $http.put(restApiUrl + "doctors/" + $scope.doctorInfoAllData._id, data).then(function (success) {
                console.log(success);

                $scope.doctorInfoAllData.indexId = index;

            },
                    function (err) {
                        console.log(err);
                    });

            console.log($scope.doctorInfoAllData.indexId);
        }

    }]);


app.controller('notification', ['$scope', '$http', 'Authentication', function ($scope, $http, Authentication) {
        $scope.doctorInfoAllData = Authentication.getUserInfo();
        $http.get(restApiUrl + "forum/forumLike/" + $scope.doctorInfoAllData.userId)
                .then(function (result) {
                    $scope.forumdata = result.data;

                    if ($scope.forumdata.formLike == undefined) {
                        $scope.forumdata.formLike = [];
                    }

                    var data = {
                        forumId: $scope.forumdata.formLike
                    }

                    /*$http.post(restApiUrl + "forum/notification/" + Authentication.getUserInfo().userId, data).then(function(success) {
                     
                     if (!($.isArray(success.data))) {
                     $scope.notification = [];
                     $scope.notification.push(success.data);
                     } else {
                     $scope.notification = success.data;
                     }
                     },
                     function(error) {
                     
                     });*/
                });
    }]);




/*app.controller('myProblemCtrl', ['$scope', 'localStorageService', '$http', '$location', '$stateParams', '$compile', 'Authentication', 'Upload', 'setAccountData', '$timeout', '$state', '$window', 'toaster', function($scope, localStorageService, $http, $location, $stateParams, $compile, Authentication, Upload, setAccountData, $timeout, $state, $window, toaster) {
 
 $scope.doctorInfoAllData = Authentication.getUserInfo();
 var userId1 = Authentication.getUserInfo();
 var ret;
 
 
 var data = {
 userId: userId1.userId,
 "category": userId.category,
 "followDoctorId": [],
 "followForumId": [],
 "reportId": []
 };
 $scope.showdivProblemLoading = false;
 $scope.showMyProblem = false;
 console.log("myProblemsList");
 $http.post(restApiUrl + "forum/doctor/category", data).then(function(success) {
 //$scope.problemgetlists = [];
 $scope.myProblemsList = [];
 //$scope.myProblemCount = $scope.myProblemsList.length;
 $scope.myProblemsList.push(success.data);
 
 if (!($.isArray(success.data))) {
 
 $scope.myProblemsList.push(success.data);
 //  ret = 1;
 
 } else {
 
 $scope.showMyProblem = true;
 $scope.myProblemsList = success.data;
 //$scope.myProblemCount = $scope.myProblemsList.length;
 
 ret = 2;
 }
 
 $scope.$broadcast('problemEvent', ret);
 
 $('#loadingPlaceholerProblemDrProfile').css("display", "none");
 
 },
 function(err) {
 console.log(err);
 return err;
 });
 $scope.$on('problemEvent', function(e, ret) {
 if (ret == 1) {
 $scope.showMyProblem = true;
 $scope.showdivProblemLoading = false;
 } else if (ret == 2) {
 $scope.showMyProblem = true;
 $scope.showdivProblemLoading = false;
 // $('#loadingPlaceholerProblemDrProfile').css("display","none");
 }
 $('#loadingPlaceholerProblemDrProfile').css("display", "none");
 console.log($scope.myProblemCount);
 });
 }]);*/


 // feedback controller by Rajesh
angular.module(ApplicationConfiguration.applicationModuleName).controller('doctorFeedCltr', ['$scope', '$http', '$location', '$state', 'Authentication', function ($scope, $http, $location, $state, Authentication) {
    // $http({
    //     method : "get",
    //     url : "/FrontendDocpal/app/assets/json/feed.json"
    // })
    // .then(function(response) {
    //     $scope.feed = response.data;
    // });

    //var tmpString = '/?doctorId=decfb590-f04a-11e7-aa89-cfaf73b0734f';

    $http.get('http://ec2-18-195-12-108.eu-central-1.compute.amazonaws.com:8050/docpal/v1/feedback/?doctorId=decfb590-f04a-11e7-aa89-cfaf73b0734f')
    .then(function(response){
        $scope.doctorFeedbacks = response.data;
       // alert('hi');
        console.log(response.data);
    });

 

}]);

// FEEDBACK FORM VALIDATION

angular.module(ApplicationConfiguration.applicationModuleName).controller('formValidateCltr', ['$scope', function ($scope, ) {


}]);







// DATA TABLE
// angular.module(ApplicationConfiguration.applicationModuleName).controller('tableCtrl', function ($scope,$http) {
//     $http.get('/FrontendDocpal/app/assets/json/table.json')
//     .then(function(response){
//         $scope.patient = response.data;

//         $scope.CheckUncheckHeader = function () {
//             $scope.IsAllChecked = true;
//            // console.log(response.data.length);
//             for (var i = 0; i < $scope.patient.length; i++) {
//                 if (!$scope.patient[i].Selected) {
//                     $scope.IsAllChecked = false;
//                     break;
//                 }
//             };
//         };
//         $scope.CheckUncheckHeader();

//         $scope.CheckUncheckAll = function () {
//             for (var i = 0; i < $scope.patient.length; i++) {
//                 $scope.patient[i].Selected = $scope.IsAllChecked;
//             }
//         };

//     });

//     $scope.dataTableOpt = {
//         "aLengthMenu": [[10, 50, 100, -1], [10, 50, 100, 'All']],
//     };
// });


// CALENDAR CONTROLLER
// angular.module('calApp', ['mwl.calendar', 'ngAnimate', 'ui.bootstrap', 'colorpicker.module']);
// angular
//   .module('calApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
// angular.module(ApplicationConfiguration.applicationModuleName).controller('KitchenSinkCtrl', function(moment, alert, calendarConfig) {

//     var vm = this;

//     //These variables MUST be set as a minimum for the calendar to work
//     vm.calendarView = 'month';
//     vm.viewDate = new Date();
//     var actions = [{
//       label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
//       onClick: function(args) {
//         alert.show('Edited', args.calendarEvent);
//       }
//     }, {
//       label: '<i class=\'glyphicon glyphicon-remove\'></i>',
//       onClick: function(args) {
//         alert.show('Deleted', args.calendarEvent);
//       }
//     }];
//     vm.events = [
//       {
//         title: 'An event',
//         color: calendarConfig.colorTypes.warning,
//         startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
//         endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
//         draggable: true,
//         resizable: true,
//         actions: actions
//       }, {
//         title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
//         color: calendarConfig.colorTypes.info,
//         startsAt: moment().subtract(1, 'day').toDate(),
//         endsAt: moment().add(5, 'days').toDate(),
//         draggable: true,
//         resizable: true,
//         actions: actions
//       }, {
//         title: 'This is a really long event title that occurs on every year',
//         color: calendarConfig.colorTypes.important,
//         startsAt: moment().startOf('day').add(7, 'hours').toDate(),
//         endsAt: moment().startOf('day').add(19, 'hours').toDate(),
//         recursOn: 'year',
//         draggable: true,
//         resizable: true,
//         actions: actions
//       }
//     ];

//     vm.cellIsOpen = true;

//     vm.addEvent = function() {
//       vm.events.push({
//         title: 'New event',
//         startsAt: moment().startOf('day').toDate(),
//         endsAt: moment().endOf('day').toDate(),
//         color: calendarConfig.colorTypes.important,
//         draggable: true,
//         resizable: true
//       });
//     };

//     vm.eventClicked = function(event) {
//       alert.show('Clicked', event);
//     };

//     vm.eventEdited = function(event) {
//       alert.show('Edited', event);
//     };

//     vm.eventDeleted = function(event) {
//       alert.show('Deleted', event);
//     };

//     vm.eventTimesChanged = function(event) {
//       alert.show('Dropped or resized', event);
//     };

//     vm.toggle = function($event, field, event) {
//       $event.preventDefault();
//       $event.stopPropagation();
//       event[field] = !event[field];
//     };

//     vm.timespanClicked = function(date, cell) {

//       if (vm.calendarView === 'month') {
//         if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
//           vm.cellIsOpen = false;
//         } else {
//           vm.cellIsOpen = true;
//           vm.viewDate = date;
//         }
//       } else if (vm.calendarView === 'year') {
//         if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
//           vm.cellIsOpen = false;
//         } else {
//           vm.cellIsOpen = true;
//           vm.viewDate = date;
//         }
//       }

//     };

//   });


// angular
//   .module('calApp')
//   .factory('alert', function ($uibModal) {

//     function show(action, event) {
//       return $uibModal.open({
//         templateUrl: 'modalContent.html',
//         controller: function () {
//           var vm = this;
//           vm.action = action;
//           vm.event = event;
//         },
//         controllerAs: 'vm'
//       });
//     }

//     return {
//       show: show
//     };

//   });




