 var app = angular.module(ApplicationConfiguration.applicationModuleName);

 var lat = 0;
 var log = 0;
 var useralldata = ""
 app.controller('UserCtrl', ['$scope', '$http', '$location', '$state', 'Authentication', 'toaster', function($scope, $http, $location, $state, Authentication, toaster) {

     $scope.saveUserInfo = function(user) {
         if (user.gender == undefined)
             user.gender = "Male";
         if (user.location != undefined) {
             var geocoder = new google.maps.Geocoder();
             geocoder.geocode({
                 'address': user.location
             }, function(results, status) {
                 if (status == google.maps.GeocoderStatus.OK) {
                     console.log(results);
                     // cordinates.push(results[0].geometry.location.lat());
                     // cordinates.push(results[0].geometry.location.lng());
                     // gps[0].coordinates.push(results[0].geometry.location.lat());
                     // gps[0].coordinates.push(results[0].geometry.location.lng());
                     // user.gps = gps;
                     //$scope.setaddress(doctorinfo,user);

                 } else {

                     console.log("Something got wrong " + status);

                 }
             });
         }




         $scope.saveinfo = true;
         $scope.Userinfo = Authentication.getUserInfo();

         var Userinfo = {

             name: $scope.Userinfo.name,
             experience: user.experience,
             BloodGroup: user.BloodGroup,
             dob: user.dob,
             hospitality: user.hospitality,
             speciality: user.speciality,
             gender: user.gender,
             image: $scope.Userinfo.image,
             detailsfilled: 1, // 1 is set for check wheather user filled data or not
             status: 1

         }
         if (user.location != undefined) {
             var address = {
                 city: user.location.city,
                 zipcode: user.zipCode,
                 state: user.location.state,
                 country: user.location.country,
                 timezone: user.timeZone,
                 latitute: user.location.lat,
                 longitute: user.location.lng,
                 completeaddress: user.location.completeaddres
             }

             Userinfo.address = address;
         }


         $http.put(restApiUrl + "users/" + $scope.Userinfo.userId, Userinfo)
             .then(function(result) {
                     console.log("data-->>" + result.data);
                     $state.go("userProfile");
                 },
                 function(err) {

                 });
        $scope.user.location = "";
     }

     $scope.mapaddress = function(address) {
         $.ajax({
             type: "GET",
             dataType: "json",
             url: "http://maps.googleapis.com/maps/api/geocode/json",
             data: {
                 'address': address,
                 'sensor': false
             },
             success: function(data) {
                 if (data.results.length) {

                     $scope.longitute = data.results[0].geometry.location.lng;
                     $scope.latitute = data.results[0].geometry.location.lat;
                     lat = data.results[0].geometry.location.lat;
                     log = data.results[0].geometry.location.lng;
                     console.log(data.results[0].geometry.location.lat);
                 } else {

                 }
             }
         });
     }


 }]);

 app.controller('GetUserDataCtrl', ['$scope', '$element', '$http', '$location', '$state', 'Authentication', 'setAccountData', 'localStorageService', 'sendMail', 'toaster', function($scope, $element, $http, $location, $state, Authentication, setAccountData, localStorageService, sendMail, toaster) {

     $scope.currpass = false;
     $scope.valid = false;
     $scope.passcheck = false;
     $scope.userAllInfo = {};


     $element.on('keyup', '#pw2', function() {

         if ($element.find('#pw1').val() == $(this).val()) {
             $scope.pwmatch = false;
             $scope.passcheck = false;
         } else {
             $scope.pwmatch = true;
             $scope.passcheck = true;
         }
         $scope.$apply();
     });


     $scope.Userinfo = Authentication.getUserInfo();
     $scope.userAllInfo = Authentication.getUserInfo();
     $http.get(restApiUrl + "users/" + $scope.Userinfo.userId).then(function(result) {
             $scope.userAllInfo = result.data;
             localStorageService.set("userAccountdata", result.data);

             $http.get(restApiUrl + "forum/forumLike/" + $scope.Userinfo.userId)
                 .then(function(result) {
                     $scope.forumdata = result.data;
                     useralldata = result.data;
                 });
         },
         function(error) {

         })


     $scope.showSomething = function(input) {
         return input != "undefined" ? input : 'input';
     };



     $scope.saveUserInfo = function(Userinfo) {
         var setImg = Authentication.getUserInfo();
         //Userinfo.image = setImg.image;

         $http.put(restApiUrl + "users/" + $scope.Userinfo.userId, Userinfo)

         .then(function(result) {
                 console.log(result);
             },
             function(err) {
                 console.log(err);
             });
     }


     $scope.checkpassword = function(data) {
         $scope.doctorinfo = Authentication.getUserInfo();

         if ($scope.doctorinfo.password != data) {
             $scope.currpass = true;
             $scope.passcheck = true;
         } else {
             $scope.currpass = false;
             $scope.passcheck = false;
         }


     }

     $scope.passUpdate = function(data) {
         $scope.passwordsection = false;
         var updatedata = {
             password: data
         }
         $scope.doctorinfo = Authentication.getUserInfo();
         console.log($scope.doctorinfo._id);
         $http.put(restApiUrl + "doctors/accounts/" + $scope.doctorinfo._id, updatedata).then(function(result) {
                 console.log(result);
                 var mailObj = {
                     to: $scope.doctorinfo.email,
                     subject: 'Password Changed',
                     body: 'Your Password has been changed to <b>' + updatedata.password + '</b> Please Logout and Login Again.<br>Regards<br> Docpal Team'
                 }
                 toaster.pop('success', "", "Password changed successfully");
                 sendMail.send(mailObj);
             },
             function(err) {

             });
     }




 }]);




 app.controller('AccountCtrl', ['$scope', '$element', '$compile', '$location', '$http', '$stateParams', '$state', 'Authentication', 'toaster', 'sendMail', function($scope, $element, $compile, $location, $http, $stateParams, $state, Authentication, toaster, sendMail) {
     $scope.currpass = false;
     $scope.valid = false;
     $scope.passcheck = false;
     $scope.passwordsection = null;

     $element.on('keyup', '#pw2', function() {

             if ($element.find('#pw1').val() == $(this).val()) {
                 $scope.pwmatch = false;
                 $scope.passcheck = false;
                 console.log("match");
             } else {
                 $scope.pwmatch = true;
                 $scope.passcheck = true;
             }
             $scope.$apply();
             console.log("press");
         })
         //console.log($element);




     $scope.passUpdate = function(data) {
         var updatedata = {
             password: data
         }
         $scope.doctorinfo = Authentication.getUserInfo();
         $http.put(restApiUrl + "doctors/accounts/" + $scope.doctorinfo._id, updatedata).then(function(result) {
                 console.log(result);
                 $scope.doctorinfo.password = data;
                 $scope.passwordsection = false;
                 var mailObj = {
                     to: $scope.doctorinfo.email,
                     subject: 'Password Changed',
                     body: 'Your Password has been changed to <b>' + updatedata.password + '</b> Please Logout and Login Again.<br>Regards<br> Docpal Team'
                 }
                 toaster.pop('success', "", "Password changed successfully");
                 sendMail.send(mailObj);
             },
             function(err) {
                 toaster.pop('error', "", "Error while updating password");
             });
     }

     $scope.checkpassword = function(data) {
         $scope.doctorinfo = Authentication.getUserInfo();
         console.log($scope.doctorinfo.password);
         if ($scope.doctorinfo.password != data) {
             $scope.currpass = true;
             $scope.passcheck = true;
         } else {
             $scope.currpass = false;
             $scope.passcheck = false;
         }

     }

     $scope.passwordsection = false;
     $scope.changePAssDiv = function() {
         if ($scope.passwordsection == false) {
             $scope.passwordsection = true;
             angular.element('.password-div').css('display', 'block');
         } else {
             $scope.passwordsection = false;
             angular.element('.password-div').css('display', 'none');
         }
     }


 }]);

 app.controller('UserDeleteCtrl', ['$scope', '$location', '$http', '$state', 'Authentication', function($scope, $location, $http, $state, Authentication) {
     var data = {};
     $scope.runRoute(routes.core.Users, data, function(success) {
             console.log(success.data);
             $scope.userlist = success.data;
         },
         function(error) {

         });

     $scope.userDelete = function(index, data) {


         $http.delete(restApiUrl + "users/" + data).then(function(success) {
                 console.log("user");
                 $scope.userlist.splice(index, 1);
                 $http.delete(restApiUrl + "users/accounts/" + accountid).then(function(success) {
                         console.log(success);
                     },
                     function(error) {

                     });
             },
             function(error) {

             });

     }

 }]);

 app.controller('UserProblemCtrl', ['$scope', '$location', '$http', '$state', 'Authentication', 'setAccountData', function($scope, $location, $http, $state, Authentication, setAccountData) {


     $scope.infoAllData = Authentication.getUserInfo();
     $scope.data = setAccountData.getUserInfo();
     $scope.UserInfoProblem = [];

     $http.get(restApiUrl + "forum/forumLike/" + $scope.infoAllData.userId)
         .then(function(result) {

                 $scope.forumdata = result.data;
                 $scope.UserInfo = result.data;

                 console.log($scope.forumdata);
                 if ($scope.forumdata.followId == undefined) {
                     $scope.forumdata.followId = [];
                 }
                 if ($scope.data.follower == undefined) {
                     $scope.data.follower = [];
                 }
                 if ($scope.forumdata.reportId == undefined) {
                     $scope.forumdata.reportId = [];
                 }

                 var data = {
                     "userId": $scope.infoAllData.userId,
                     "forumId": $scope.forumdata.followId,
                     "followsId": $scope.data.follower,
                     "reportId": $scope.forumdata.reportId
                 }
                 console.log(data);
                 $('#loadingPlaceholerProblemUserProfile').css("display", "block");
                 $http.post(restApiUrl + "forum/user/category", data).then(function(success) {

                         if (!($.isArray(success.data))) {
                             $scope.UserInfoProblem.push(success.data);
                         } else {
                             $scope.UserInfoProblem = success.data;
                         }
                         //Get Notifications for Forums
                          var fUserIds = { forumId : []};
                          for (var fi = 0; fi < $scope.UserInfoProblem.length; fi++) {
                            if($scope.checkFollow($scope.UserInfoProblem[fi])){
                              fUserIds.forumId.push($scope.UserInfoProblem[fi]._id);              
                            }
                          }
                          $http.post(restApiUrl + "forum/notification/" + Authentication.getUserInfo().userId, fUserIds).then(function(success) {
                              if (!($.isArray(success.data))) {
                                  $scope.notification.user = [];
                                  $scope.notification.user.push(success.data);
                              } else {
                                  $scope.notification.user = success.data;
                              }
                          },
                          function(error) {

                          });
                          //End Notification Get
                         console.log($scope.UserInfoProblem);
                         $('#loadingPlaceholerProblemUserProfile').css("display", "none");
                     },
                     function(err) {
                         console.log(err);
                     }
                 );
             },
             function(err) {
                 console.log(err);
             }
         );



     $scope.upVote = function(id, count, postedby) {

         var data = {};
         console.log($scope.forumdata);
         if ($scope.forumdata.formLike != undefined) {
             var userData = {
                 userId: $scope.infoAllData.userId
             };
             $scope.forumdata.formLike.push(id);

             userData.formLike = $scope.forumdata.formLike;

             $http.put(restApiUrl + "forum/forumLike/" + $scope.infoAllData.userId, userData)
                 .then(function(result) {
                         $scope.forumdata.formLike.push(id);
                         $scope.upVoteDoctor(id, count);
                     },

                     function(err) {
                         console.log(err);
                     });
         } else {
             var userData = {
                 userId: $scope.infoAllData.userId
             };

             var setFormId = [];
             setFormId.push(id);
             userData.formLike = setFormId;

             $http.post(restApiUrl + "forum/forumLike", userData)
                 .then(function(result) {
                         $scope.upVoteDoctor(id, count);
                     },
                     function(err) {
                         console.log(err);
                     });
         }
     }

     // function to increase the number of count in vote

     $scope.upVoteDoctor = function(id, count) {

         if ($scope.infoAllData.type = "doctor") {
             var datadoctor = {
                 upVoteDoctor: count
             }


             $http.put(restApiUrl + "forum/doctors/" + id + "/upVoteCount", datadoctor).then(function(success) {


                 },
                 function(error) {

                 });

         } else {
             var datauser = {
                 upVoteUser: count
             }
             $http.put(restApiUrl + "forum/users/" + id + "/upVoteCount", datauser).then(function(success) {

                 },
                 function(error) {

                 });
         }

     }

     



     $scope.checkloginReport = function(id) {

         $scope.users = Authentication.getUserInfo();

         if ($.isEmptyObject($scope.users))
             return true;
         else {
             if ($.inArray(id, useralldata.reportId) !== -1)
                 return true;
             else
                 return false;

         }
     }

     $scope.checkloginfollow = function(id) {


         if ($.isEmptyObject($scope.users))
             return true;
         else {
             if ($.inArray(id, useralldata.followId) !== -1)
                 return true;
             else
                 return false;
         }

     }


     $scope.followquestion = function(id, ownerID, question) {
         console.log(id);
         var notify = {
             "repliedby": {
                 "name": $scope.infoAllData.name,
                 "readstatus": 0,
                 "role": $scope.infoAllData.type,
                 "userId": $scope.infoAllData.userId
             },
             "action": "relevant",
             "ownerId": ownerID,
             "forumId": id,
             "question": question,
             "createdDate": new Date()
         }
         var setdata = Authentication.getUserInfo();
         console.log($scope.forumdata);
         if ($scope.forumdata != undefined) {
             var followquestion = {
                 userId: setdata.userId
             }
             var data = [];
             if ($scope.forumdata.followId != undefined) {
                 data = $scope.forumdata.followId;
             }
             data.push(id);
             followquestion.followId = data;
             followquestion.notify = notify;
             console.log(followquestion);
             useralldata.followId = data;
             $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, followquestion).then(function() {
                     console.log("done put request");
                 },
                 function(error) {
                     console.log();

                 })
         } else {
             var followquestion = {
                 userId: setdata.userId
             }
             var data = [];
             data.push(id);
             followquestion.followId = data;
             followquestion.notify = notify;
             useralldata.followId = data;
             console.log("done post request");
             console.log(followquestion);

             $http.post(restApiUrl + "forum/forumLike" + setdata.userId, followquestion).then(function() {


                 },
                 function(error) {
                     console.log();
                 });
         }



     }

     $scope.report = function(id, ownerId, question) {

         var notify = {

             "repliedby": {
                 "name": $scope.infoAllData.name,
                 "readstatus": 0,
                 "role": $scope.infoAllData.type,
                 "userId": $scope.infoAllData.userId
             },
             "action": "report",
             "ownerId": ownerId,
             "forumId": id,
             "question": question
         }
         var setdata = Authentication.getUserInfo();
         if ($.isEmptyObject($scope.forumdata)) {
             var report = {
                 userId: setdata.userId
             };
             var setID = [];
             if ($scope.forumdata.reportId != undefined) {
                 setID = $scope.forumdata.reportId;
                 $scope.forumdata.reportId.push(id);
             }
             setID.push(id);
             report.reportId = setID;

             $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, report).then(function(success) {
                     console.log(success);

                 },
                 function(error) {

                 });
         } else {
             var report = {
                 userId: setdata._id
             };
             var setID = [];
             setID.push(id);
             report.reportId = setID;
             console.log(report);

             $http.post(restApiUrl + "forum/forumLike", report).then(function(success) {
                     console.log(useralldata);

                     useralldata.reportId.push(id);
                     console.log($scope.forumdata);
                 },
                 function(error) {

                 });
         }
     }


     $scope.myUserProblem = function(id) {
         console.log(id);
         var data = {
             "userId": id
         };
         var ret = '';
         $http.post(restApiUrl + "forum/user/myproblem", data).then(function(success) {

                 $scope.myProblemsList = [];
                 if (!($.isArray(success.data))) {
                     $scope.myProblemsList.push(success.data);
                     //   $scope.showMyProblem = true;
                     //   $scope.showdivProblemLoading = false;

                     $scope.myProblemCount = $scope.myProblemsList.length;
                     ret = 1;
                 } else {
                     $scope.showMyProblem = true;
                     $scope.myProblemsList = success.data;
                     $scope.myProblemCount = $scope.myProblemsList.length;

                     ret = 2;
                 }
                 console.log($scope.myProblemCount);
                 $scope.$broadcast('problemEvent', ret);
                 // $('#loadingPlaceholerProblemDrProfile').css("display","none");
             },
             function(err) {
                 console.log(err);
                 return err;
             });
         return ret;
     }
     $scope.myUserProblem(Authentication.getUserInfo().userId);

 }]);


 app.controller('usernotification', ['$scope', '$http', 'Authentication', function($scope, $http, Authentication) {
     $scope.doctorInfoAllData = Authentication.getUserInfo();

     $http.get(restApiUrl + "forum/forumLike/" + $scope.doctorInfoAllData.userId)
         .then(function(result) {
             $scope.forumdata = result.data;
             console.log($scope.forumdata);
             if ($scope.forumdata.formLike == undefined) {
                 $scope.forumdata.formLike = [];
             }
             var data = {
                 forumId: $scope.forumdata.formLike
             }
             console.log(data);

             /*$http.post(restApiUrl + "forum/notification/" + $scope.doctorInfoAllData.userId, data).then(function(success) {
                    
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


 app.controller('userMyProblemCtrl', ['$scope', 'localStorageService', '$http', '$location', '$stateParams', '$compile', 'Authentication', 'Upload', 'setAccountData', '$timeout', '$state', '$window', 'toaster', function($scope, localStorageService, $http, $location, $stateParams, $compile, Authentication, Upload, setAccountData, $timeout, $state, $window, toaster) {

     $scope.doctorInfoAllData = Authentication.getUserInfo();
     var userId1 = Authentication.getUserInfo();
     var ret;
     var data = {
         userId: userId1.userId
     };
     $scope.showdivProblemLoading = false;
     $scope.showMyProblem = false;
     $http.post(restApiUrl + "forum/user/myproblem", data).then(function(success) {
             //$scope.problemgetlists = [];   
             $scope.myProblemsList = [];

             $scope.myProblemsList.push(success.data);
             $scope.myProblemCount = $scope.myProblemsList.length;
             if (!($.isArray(success.data))) {

                 $scope.myProblemsList.push(success.data);
                 ret = 1;

             } else {

                 $scope.showMyProblem = true;
                 $scope.myProblemsList = success.data;
                 $scope.myProblemCount = $scope.myProblemsList.length;

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
         console.log(ret);

         if (ret == 1) {

             $scope.showMyProblem = true;
             $scope.showdivProblemLoading = false;


         } else if (ret == 2) {

             $scope.showMyProblem = true;
             $scope.showdivProblemLoading = false;
             // $('#loadingPlaceholerProblemDrProfile').css("display","none");
         }
         $('#loadingPlaceholerProblemDrProfile').css("display", "none");
         console.log($scope.myProblemsList);
         console.log($scope.myProblemCount);
     });


 }]);