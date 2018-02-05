'use strict';
/**
 * @ngdoc function
 * @name trDocpal.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the trDocpal
 */
var app = angular.module(ApplicationConfiguration.applicationModuleName);
var _ID = '';
var _answerId = '';
var answerIndex = '';
var set = 1;
var views = 0;
var followquestion = [];

app.controller('problemCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', '$rootScope', 'Authentication', 'problemservices', 'setfilterService', 'setAccountData', function($state, $scope, $location, $http, $stateParams, $rootScope, Authentication, problemservices, setfilterService, setAccountData) {


  //   $scope.menuimage = $scope.filters[2].image;
  var data2 = {};
  $scope.forumdata = {};
  $scope.infoAllData = Authentication.getUserInfo();

  // console.log($rootScope.selectedMenu);
  // doctor profile problem 
  // function for relevent get all data from forum collection with current login Id
  if (Authentication.getUserInfo().userId == undefined) {
    $scope.forumdata = [];
  } else {
    $http.get(restApiUrl + "forum/forumLike/" + Authentication.getUserInfo().userId)
      .then(function(result) {
        $scope.forumdata = result.data;
      });
  }


  //--------------------------------  end -------------------------//

  $scope.showModal = false;
  $scope.toggleModal = function(a, b, c) {
    var data = $("#confirmAlert");

    data.data("a", a);
    data.data("b", b);
    data.data("c", c);

    $scope.showModal = !$scope.showModal;

    // $scope.report(a,b,c);

  };

  $scope.triggerEvent = function() {

    $scope.report($("#confirmAlert").data("a"), $("#confirmAlert").data("b"), $("#confirmAlert").data("c"));
    $scope.showModal = !$scope.showModal;
  }

  $scope.noTriggerEvent = function() {

    $scope.showModal = !$scope.showModal;
  }

  $scope.showProblem = function(id, view) {
    _ID = id;
    views = view
    $state.go('allanswer');
  }


  /*  $scope.checkDoctorRelevent = function(id) {
      debugger;
      $scope.users = Authentication.getUserInfo();

      return problemservices.checkDoctorRelevent($scope.users, $scope.forumdata, id);

    }*/



  $scope.checkloginReport = function(id) {
    //  console.log($scope.forumdata);
    if (!($.isEmptyObject($scope.users))) {
      return problemservices.checkloginreport($scope.users, $scope.forumdata, id);
    } else {
      return true;
    }
  }

  $scope.checkloginfollow = function(id) {

    if ($.isEmptyObject($scope.users))
      return true;
    else {
      if ($.inArray(id, $scope.forumdata.followId) !== -1)
        return true;
      else
        return false;
    }

  }



  $scope.upVote = function(id, count, postedby, ownerID, question) {


    var notify = {
      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "relevant",
      "ownerId": ownerID,
      "forumId": id,
      "question": question,
      "createdDate": new Date()
    }
    var data = {};

    if (!($.isEmptyObject($scope.forumdata))) {
      var userData = {
        userId: Authentication.getUserInfo().userId
      };

      if ($scope.forumdata.formLike != undefined) {
        $scope.forumdata.formLike.push(id);
        userData.formLike = $scope.forumdata.formLike;
      } else {
        var setdata = [];
        setdata.push(id);
        userData.formLike = setdata;
        $scope.forumdata.formLike = setdata;
      }

      userData.notify = notify;

      $http.put(restApiUrl + "forum/forumLike/" + Authentication.getUserInfo().userId, userData)
        .then(function(result) {


            $scope.upVoteDoctor(id, count);

          },

          function(err) {
            console.log(err);
          });
    } else {
      var userData = {
        userId: Authentication.getUserInfo().userId
      };


      var setdata = [];
      setdata.push(id);

      userData.formLike = setdata;
      userData.notify = notify;
      $scope.forumdata.formLike = [];
      $scope.forumdata.formLike.push(id);

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

    var datadoctor = {
      upVoteDoctor: count
    }
    $http.put(restApiUrl + "forum/doctors/" + id + "/upVoteCount", datadoctor).then(function(success) {

      },
      function(error) {

      });

  }



  $scope.followquestion = function(id, ownerId, question, index) {
      var notify = {
        "repliedby": {
          "name": Authentication.getUserInfo().name,
          "readstatus": 0,
          "role": Authentication.getUserInfo().type,
          "userId": Authentication.getUserInfo().userId
        },
        "action": "follow",
        "ownerId": ownerId,
        "forumId": id,
        "question": question,
        "comment": ""
      }
      var setdata = Authentication.getUserInfo();

      if (!($.isEmptyObject($scope.forumdata))) {
        var followquestion = {
          userId: setdata.userId
        }
        var data = [];
        if ($scope.forumdata.followId != undefined && $scope.forumdata.followId.indexOf(id) < 0) {
          data = $scope.forumdata.followId;
          $scope.forumdata.followId.push(id);
          data.push(id);
          var followCount = {
            followNumber: ($scope.problemgetlists[index].followNumber) + 1
          }
        } else {
          $scope.forumdata.followId.splice($scope.forumdata.followId.indexOf(id), 1);
          data.splice(data.indexOf(id), 1);
          var followCount = {
            followNumber: ($scope.problemgetlists[index].followNumber) - 1
          }
        }
        $scope.problemgetlists[index].followNumber = followCount.followNumber;
        followquestion.followId = data;
        followquestion.notify = notify;
        console.log(followquestion);

        $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, followquestion).then(function() {
            
            $http.put(restApiUrl + "forum/" + id, followCount).then(function(success) {


                console.log($scope.problemgetlists[index]);
              },
              function() {
                console.log(error);
              })

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


        $http.post(restApiUrl + "forum/forumLike/" + setdata.userId, followquestion).then(function() {
            $scope.forumdata.followId = [];
            $scope.forumdata.followId.push(id);

            var data = {
              followNumber: ($scope.problemgetlists[index].followNumber) + 1
            }
            $http.put(restApiUrl + "forum/" + id, data).then(function(success) {

                console.log($scope.problemgetlists[index]);
              },
              function() {
                console.log(error);
              })

          },
          function(error) {
            console.log();
          });
      }
    }

  // ---------------------- report services ----------------------------

  $scope.report = function(id, ownerId, question) {
    var notify = {

      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "report",
      "ownerId": ownerId,
      "forumId": id,
      "question": question,
      "createdDate": new Date()
    }
    var setdata = Authentication.getUserInfo();
    if (!($.isEmptyObject($scope.forumdata))) {
      var report = {
        userId: setdata.userId
      };
      var setID = [];
      if ($scope.forumdata.reportId != undefined) {
        setID = $scope.forumdata.reportId;

      }

      setID.push(id);
      $scope.forumdata.reportId = setID;
      report.reportId = setID;
      report.notify = notify;
      $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, report).then(function(success) {
          console.log(success);

        },
        function(error) {

        });
    } else {
      var report = {
        userId: setdata.userId
      };
      var setID = [];
      setID.push(id);
      report.reportId = setID;
      $scope.forumdata.reportId = setID;
      report.notify = notify;
      $http.post(restApiUrl + "forum/forumLike", report).then(function(success) {
          console.log(success);
          //$scope.sendNotification(Authentication.getUserInfo().userId, id, userId, 'report');
        },
        function(error) {

        });
    }
  }

  // Filter WOrk
  /*if($scope.filter == undefined) {
    $scope.filter = {
          category: [],
          location: [],
          limit:10,
          offset:0,
          sort:''
        };
  }*/
  $scope.filter = {
    category: [],
    location: [],
    limit: 10,
    offset: 0,
    sort: ''
  };
  $scope.clearFilter = function() {
    $scope.filter = {
      category: [],
      location: [],
      limit: 10,
      offset: 0,
      sort: ''
    };
    setfilterService.setfilterdata($scope.filter, "problem");
    $scope.getFilterList($scope.filter, 'problems', '#loadingPlaceholerProblem');
  }
  $scope.crossclick = function(data, type) {
    var indexOf = ""
    if (type == 'loc') {
      $scope.filter.location = "";
    }
    if (type == 'category') {
      indexOf = $scope.filter.category.indexOf(data);

      $scope.filter.category.splice(indexOf, '1');
    }
    setfilterService.setfilterdata($scope.filter, "problem");
    $scope.getFilterList($scope.filter, 'problems', '#loadingPlaceholerProblem');

  }
  $scope.setFilterdata = function(data, type) {


      if (type == 'category') {
        if ($.inArray(data, $scope.filter.category) !== -1) {
          $scope.filter.category.splice($scope.filter.category.indexOf(data), '1');
        } else {
          $scope.filter.category.push(data);
        }
      }
      setfilterService.setfilterdata($scope.filter, "problem");
      $scope.getFilterList($scope.filter, 'problems', '#loadingPlaceholerProblem');
    }
    //Check if filter is set and type is same as page type 
  if (setfilterService.getfilterdata()[0] != undefined && setfilterService.getfilterdata()[1] == "problem") {
    $scope.filter = setfilterService.getfilterdata()[0];
  }
  $scope.getFilterList($scope.filter, 'problems', '#loadingPlaceholerProblem');
  //End FIlter
}]);



app.controller('problemShowCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', 'Authentication', 'problemservices', 'setAccountData', function($state, $scope, $location, $http, $stateParams, Authentication, problemservices, setAccountData) {


  _ID = $stateParams.id;
  views = $stateParams.views;
  $scope.isReplied = true;
  if (_ID == '')
    $state.go('problemInfo');
  $scope.infoAllData = Authentication.getUserInfo();
  $scope.user = new Object();
  var routeUrl;
  if (Authentication.getUserInfo().type == 'user')
    routeUrl = 'users';
  else
    routeUrl = 'doctors';
  $scope.user = new Object();

  //Get User Info


  // getting data from helpfull forum
  $http.get(restApiUrl + "forum/forumLike/" + Authentication.getUserInfo().userId)
    .then(function(result) {
      $scope.forumhelp = result.data;

    });


  if(_ID != '')
  $scope.runRoute(routes.problem.problemlist, _ID, function(success) {
    $scope.problem = success.data.length == 0 ? {} : success.data[0];

    //update views count
    // views for the problem function
    /*var data = {
      views: success.data.views + 1
    };
    $http.put(restApiUrl + "forum/" + _ID, data).then(function(success) {

      },
      function(error) {

      });*/

    //Check if The visitor is user/doctor and if Doctor check if he has already replied
    if (Authentication.getUserInfo() != undefined) {

      if (Authentication.getUserInfo()._id.length != 0) {
        if ($scope.problem.answer != undefined) {
          $scope.isReplied = false;
          angular.forEach($scope.problem.answer, function(x, index) {
            if (x.repliedBy._id == Authentication.getUserInfo().userId) {
              $scope.isReplied = true;
            } else
              $scope.isReplied = false;
          });
        } else {
          $scope.isReplied = false;
        }
      }

    }
  });

  $scope.addAnswer = function(id, answer, question, ownerId) {
    var answer = {
      "comment": answer,
      "repliedBy": {
        "name": Authentication.getUserInfo().name,
        "role": Authentication.getUserInfo().type,
        "specialization": setAccountData.getUserInfo().speciality,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "comment",
      "ownerId": ownerId,
      "forumId": id,
      "question": question,
      "createdDate" : new Date()
    };


    $http.put(restApiUrl + "forum/" + $scope.problem._id + "/answer", answer)
      .then(function(result) {
          console.log(result.data);
          $scope.runRoute(routes.problem.problemlist, _ID, function(success) {
              $scope.problem = success.data.length == 0 ? {} : success.data[0];
              $scope.isReplied = true;

              // function to increase no of answer count
              if ($scope.problem.numberOfAnswer == undefined) {
                $scope.problem.numberOfAnswer = 0;
              }

              var data = {
                numberOfAnswer: ($scope.problem.numberOfAnswer) + 1
              }
              $http.put(restApiUrl + "forum/" + $scope.problem._id, data).then(function(success) {

                },
                function(error) {
                  console.log(error)
                })
            },
            function(err) {
              console.log(err);
            });
          $scope.answerText = '';
        },
        function(err) {
          $scope.answerText = '';
        });
  }


  $scope.showFeedback = function(index, answerId) {
    _answerId = answerId;
    answerIndex = index;
    $state.go('problemwithcomment');
  }

  // function for helpfull on answer
  $scope.helpful = function(helpId, commentId, comment, ownerId) {


    var notify = {
      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "answer helpful",
      "ownerId": ownerId,
      "answerId": commentId,
      "answer": comment,
      "forumId": helpId,
      "createdDate": new Date()
    }

    var setlogin = Authentication.getUserInfo();

    $scope.forumhelp = problemservices.sethelpfulData(setlogin, notify, helpId, commentId, comment, ownerId, $scope.forumhelp);
  }


  // check for disable option for helpful
  $scope.checkhelp = function(id) {

    $scope.users = Authentication.getUserInfo();
    return problemservices.checkhelp($scope.users, $scope.forumhelp, id);
  }

  $scope.reportAnswer = function(id, ownerId, question) {

    var notify = {
      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "reportAnswer",
      "ownerId": ownerId,
      "forumId": id,
      "question": question,
      "createdDate": new Date()
    }



    var setdata = Authentication.getUserInfo();
    if (!($.isEmptyObject($scope.forumhelp))) {
      var report = {
        userId: setdata.userId
      };
      var setID = [];
      if ($scope.forumhelp.reportAnswer != undefined) {
        setID = $scope.forumhelp.reportAnswer;
      }
      setID.push(id);
      $scope.forumhelp.reportAnswer = setID;
      report.reportAnswer = setID;
      report.notify = notify;
      $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, report).then(function(success) {
          console.log(success);
        },
        function(error) {

        });



    } else {

      var report = {
        userId: setdata.userId
      };
      var setID = [];
      setID.push(id);
      report.reportAnswer = setID;
      report.notify = notify;
      $scope.forumhelp.reportAnswer = setID;
      $http.post(restApiUrl + "forum/forumLike", report).then(function(success) {
        },
        function(error) {

        });


    }

  }

  $scope.checkloginReport = function(id) {

    if (!($.isEmptyObject($scope.forumhelp))) {
      if (($.isEmptyObject($scope.users)) && ($scope.forumhelp.reportAnswer != undefined))
        return true;
      else {
        if ($.inArray(id, $scope.forumhelp.reportAnswer) !== -1)
          return true;
        else
          return false;
      }
    } else {
      return true;
    }
    // $scope.user=Authentication.getUserInfo();
    // return problemservices.checkloginreport($scope.users,$scope.forumhelp,id);
  }

  $scope.showModal = false;
  $scope.toggleModal = function(a, b, c) {
    var data = $("#confirmAlert");
    data.data("a", a);
    data.data("b", b);
    data.data("c", c);
    $scope.showModal = !$scope.showModal;
  };

  $scope.triggerEvent = function() {

    $scope.reportAnswer($("#confirmAlert").data("a"), $("#confirmAlert").data("b"), $("#confirmAlert").data("c"));
    $scope.showModal = !$scope.showModal;
  }
  $scope.noTriggerEvent = function() {

      $scope.showModal = !$scope.showModal;
    }
    //---------------------------------------- end ------------------------------------// 
}]);

app.controller('problemShowThreadedCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', 'Authentication', 'problemservices', 'setAccountData', function($state, $scope, $location, $http, $stateParams, Authentication, problemservices, setAccountData) {
  if (_ID == '')
    $state.go('problemInfo');
  $scope.infoAllData = Authentication.getUserInfo();
  var routeUrl;
  if (Authentication.getUserInfo().type == 'user')
    routeUrl = 'users';
  else
    routeUrl = 'doctors';
  $scope.user = new Object();
  $http.get(restApiUrl + "forum/forumLike/" + Authentication.getUserInfo().userId)
    .then(function(result) {
      $scope.forumhelp = result.data;
    });
  //Get User Info
  $scope.user = Authentication.getUserInfo();

  //Get Problem Details
  if(_ID != '')
  $scope.runRoute(routes.problem.problemlist, _ID, function(success) {
      $scope.problem = success.data.length == 0 ? {} : success.data[0];
    },
    function(err) {
      console.log(err);
    });

  $scope.toggleModal = function(a, b, c) {
    var data = $("#confirmAlert");
    data.data("a", a);
    data.data("b", b);
    data.data("c", c);
    $scope.showModal = !$scope.showModal;
  };

  $scope.triggerEvent = function() {
    $scope.reportFeedbacks($("#confirmAlert").data("a"), $("#confirmAlert").data("b"), $("#confirmAlert").data("c"));
    $scope.showModal = !$scope.showModal;
  }

  $scope.noTriggerEvent = function() {
    $scope.showModal = !$scope.showModal;
  }

  $scope.answerIndex = answerIndex;

  //Add Comment Function
  $scope.addComment = function(id, data, question, ownerId) {
    $scope.answerText = '';
    var feedback = {
      "comment": data,
      "details": {
        "date": new Date(),
        "name": Authentication.getUserInfo().name,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "feedback",
      "ownerId": ownerId,
      "forumId": id,
      "question": question,
      "createdDate" : new Date()
    };

    //Update Request
    $http.put(restApiUrl + "forum/" + $scope.problem._id + "/" + _answerId + "/feedback", feedback)
      .then(function(result) {
          $scope.data2 = "";
          $scope.runRoute(routes.problem.problemlist, _ID, function(success) {
              $scope.problem = success.data.length == 0 ? {} : success.data[0];
            },
            function(err) {
              console.log(err);
            });
        },
        function(err) {
          console.log(err);
        });
  }

  //-------Report Comments---------------\
  $scope.reportFeedbacks = function(id, ownerId, question) {
    var notify = {
      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "report Feedback",
      "ownerId": ownerId,
      "forumId": id,
      "question": question,
      "createdDate": new Date()
    }
    var setdata = Authentication.getUserInfo();
    if (!($.isEmptyObject($scope.forumhelp))) {
      var report = {
        userId: setdata.userId
      };
      var setID = [];
      if ($scope.forumhelp.reportFeedback != undefined)
        setID = $scope.forumhelp.feedback;

      setID.push(id);
      report.reportFeedback = setID;
      $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, report).then(function(success) {
          
        },
        function(error) {

        });
    } else {
      var report = {
        userId: setdata.userId
      };
      var setID = [];
      setID.push(id);
      report.reportFeedback = setID;
      console.log(report);
      $http.post(restApiUrl + "forum/forumLike", report).then(function(success) {
          console.log(success);
        },
        function(error) {

        });
    }
  }


  //check login id has set the feed back
  $scope.checkfeedbackLogin = function(id) {
    if (!($.isEmptyObject($scope.forumhelp))) {
      if ($.isEmptyObject($scope.users))
        return true;
      else {
        if ($.inArray(id, $scope.forumhelp.feedback) !== -1)
          return true;
        else
          return false;
      }
    }
  }

  ////-----------Report-------------------------

  $scope.report = function(id, ownerId, question) {
    var notify = {

      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "reportAnswer",
      "ownerId": ownerId,
      "forumId": id,
      "question": question,
      "createdDate": new Date()
    }

    var setdata = Authentication.getUserInfo();

    var data = problemservices.report(notify, $scope.forumhelp, setdata, id, ownerId, question);
    $scope.forumhelp = data;
  }

  $scope.checkloginReport = function(id) {
    if (!($.isEmptyObject($scope.forumhelp))) {
      if (($.isEmptyObject($scope.users)) && ($scope.forumhelp.reportAnswer != undefined))
        return true;
      else {
        if ($.inArray(id, $scope.forumhelp.reportAnswer) !== -1)
          return true;
        else
          return false;
      }
    } else {
      return true;
    }

  }

  $scope.helpful = function(helpId, commentId, comment, ownerId) {


    var notify = {
      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "answer helpful",
      "ownerId": ownerId,
      "forumId": commentId,
      "question": comment,
      "createdDate": new Date()
    }

    var setlogin = Authentication.getUserInfo();
    $scope.forumhelp = problemservices.sethelpfulData(setlogin, notify, helpId, commentId, comment, ownerId, $scope.forumhelp);

    console.log($scope.forumhelp);


  }

  $scope.checkhelp = function(id) {
    $scope.users = Authentication.getUserInfo();
    return problemservices.checkhelp($scope.users, $scope.forumhelp, id);
    console.log(problemservices.checkhelp($scope.users, $scope.forumhelp, id));
  }

  $scope.showModal = false;

  $scope.toggleModal = function(a, b, c) {
    var data = $("#confirmAlert");

    data.data("a", a);
    data.data("b", b);
    data.data("c", c);
    console.log(data.data);

    $scope.showModal = !$scope.showModal;


  };

  $scope.triggerEvent = function() {
    $scope.reportFeedbacks($("#confirmAlert").data("a"), $("#confirmAlert").data("b"), $("#confirmAlert").data("c"));
    $scope.showModal = !$scope.showModal;
  }

  $scope.noTriggerEvent = function() {

    $scope.showModal = !$scope.showModal;
  }

  $scope.reportAnswercomment = function(id, ownerId, question) {

    var notify = {
      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "reportAnswer",
      "ownerId": ownerId,
      "forumId": id,
      "question": question,
      "createdDate": new Date()
    }



    var setdata = Authentication.getUserInfo();
    console.log($scope.forumhelp.reportAnswer);
    if (!($.isEmptyObject($scope.forumhelp))) {
      var report = {
        userId: setdata.userId
      };
      var setID = [];
      if ($scope.forumhelp.reportAnswer != undefined) {
        setID = $scope.forumhelp.reportAnswer;
      }
      setID.push(id);
      $scope.forumhelp.reportAnswer = setID;
      report.reportAnswer = setID;
      report.notify = notify;


      $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, report).then(function(success) {
          console.log(success);
        },
        function(error) {

        });



    } else {

      var report = {
        userId: setdata.userId
      };
      var setID = [];
      setID.push(id);
      report.reportAnswer = setID;
      report.notify = notify;
      $scope.forumhelp.reportAnswer = setID;

      console.log(report);
      $http.post(restApiUrl + "forum/forumLike", report).then(function(success) {
          console.log(success);

        },
        function(error) {

        });


    }

  }

}]);

app.controller('problemAddCtrl', ['$state', '$scope', 'Upload', '$location', '$http', '$stateParams', 'Authentication', 'setAccountData', function($state, $scope, Upload, $location, $http, $stateParams, Authentication, setAccountData) {
  $scope.period = ["hours", "days", "months", "years"];
  $scope.problemtype = ["eye", "dental", "skin/hair", "heart", "stomach", "mind", "ENT", "Gynec", "Nervous", "kidney"];
  $scope.val = '1';
  $scope.data = {};
  $scope.problemTypes = {
    "eye": {
      "Opthalmologist": {
        "tags": ["eye"]
      }
    },
    "dental": {
      "Dentist": {
        "tags": ["teeth", "jaws"]
      }
    },
    "skin/hair": {
      "Dermatologist/cosmetologist": {
        "tags": ["hair", "skin"]
      }
    },
    "heart": {
      "Cardiologist": {
        "tags": ["heart"]
      }
    },
    "stomach": {
      "Gastroenterologist": {
        "tags": ["gas", "liver", "stomach"]
      }
    },
    "mind": {
      "Psychiatrist": {
        "tags": ["mind", "behaviour"]
      }
    },
    "ENT": {
      "Ear-nose-throat (ent) Specialist": {
        "tags": ["ear", "nose", "throat"]
      }
    },
    "Gynec": {
      "Gynecologist/obstetrician": {
        "tags": ["gynec", "obesity", "baby"]
      }
    },
    "Nervous": {
      "Neurologist": {
        "tags": ["nervous", "brain"]
      }
    },
    "kidney": {
      "Urologist": {
        "tags": ["kidney"]
      }
    }
  };


  $scope.setrow = 1;
  $scope.incrow = function() {
    console.log(set);
    var va = set + 1;
    set = va;
    return va;
  }


  $scope.infoAllData = Authentication.getUserInfo();
  if (Authentication.getUserInfo()._id == null)
    $state.go('userLogin');
  $scope.user = new Object();
  var routeUrl;
  if (Authentication.getUserInfo().type == 'user')
    routeUrl = 'users';
  else
    routeUrl = 'doctors';
  $scope.user = new Object();

  $http.get(restApiUrl + "" + routeUrl + "/" + Authentication.getUserInfo().userId, Authentication.getUserInfo())
    .then(function(result) {
        $scope.user = result.data;

      },
      function(err) {
        console.log(err);
      });
  var allproblem = {};
  var problemgetlist = "";
  $scope.tags = [];
  $scope.relations = [{
    "name": "my mother",
    "gender": "Female"
  }, {
    "name": "my father",
    "gender": "Male"
  }, {
    "name": "my brother",
    "gender": "Male"
  }, {
    "name": "my sister",
    "gender": "Female"
  }, {
    "name": "myself",
    "gender": ""
  }];
  var tagsList = [
    "dentist",
    "fever",
    "blood",
    "cold",
    "eye"
  ];
  var data = {};
  $scope.relationChange = function() {
    $scope.relation = JSON.parse($scope.relation1);
    if ($scope.relation.name == 'myself')
      $scope.relation.gender = $scope.user.gender;
    $scope.show1 = true;
  }

  $scope.delTag = function(id) {
    console.log(id);
    $scope.tags.splice(id, 1);
  }

  $scope.onProblemKeyUp = function(e, text) {
    if (e.keyCode == 32) {
      var splitText = text.split(/\s+/);
      var keyword = splitText.pop();
      angular.forEach(tagsList, function(tags) {
        if ((tags.toLowerCase() == keyword.toLowerCase()) && ($scope.tags.indexOf(tags) == -1)) {
          $scope.tags.push(tags);
        }
      });
      console.log($scope.tags);
    }
  }

  /*************** Add Problem ******************/
  $scope.myCroppedImage = '';
  $scope.myImage = {};
  $scope.addproblem = function(data, imgData, imgObj) {
    var problem = {};
    problem.details = {
      "userId": Authentication.getUserInfo().userId,
      "role": Authentication.getUserInfo().type,
      "For": {
        "relation": $scope.relation.name,
        "gender": $scope.relation.gender,
        "age": data.age,
        "period": data.period + " " + data.duration
      }
    };
    problem.followNumber = 0;
    if (data.isPrivate != undefined)
      problem.isPrivate = '' + data.isPrivate + '';
    else
      problem.isPrivate = "false";
    problem.question = data.question;
    problem.createdDate = new Date();
    problem.upVoteDoctor = 0;
    problem.views = 0;
    problem.upVoteUser = 0;
    if (imgObj.name != undefined) {
      problem.image = {};
      problem.image.data = imgData;
      problem.image.name = imgObj.name;
    }
    if ($scope.problemTypes[data.problem] != undefined) {
      problem.category = Object.keys($scope.problemTypes[data.problem])[0];
      problem.tags = $scope.problemTypes[data.problem][problem.category].tags;
    }
    if (data.category != undefined)
      problem.category = data.category;
    $scope.runRoute(routes.problem.askProblem, problem, function(success) {
        if (problem.image != undefined) {
          $http.put(restApiUrl + "forum/" + success.data._id + "/image", problem).then(function() {

          }, function(error) {

          });
        }
        $scope.myCroppedImage = '';
        $scope.myImage = {};
        $scope.$parent.select("3");
        $state.go('problemInfo');
      },
      function(err) {
        console.log(err);
      });
  };
  $scope.showImgUpload = false;
  //Handle file select
  $scope.handleFileSelect = function(evt) {
    var file = evt.currentTarget.files[0];
    $scope.myImage.name = file.name;
    var reader = new FileReader();
    reader.onload = function(evt) {
      $scope.$apply(function($scope) {
        $scope.myImage.data = evt.target.result;
        $scope.showImgUpload = true;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput')).on('change', $scope.handleFileSelect);

}]);

app.controller('problemDoctorCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', 'Authentication', 'setAccountData', 'problemservices', function($state, $scope, $location, $http, $stateParams, Authentication, setAccountData, problemservices) {

  $scope.showdiv = false;
  $scope.showdivProblemLoading = true;
  $scope.showdivProblem = false;
  $scope.infoAllData = Authentication.getUserInfo();

  $http.get(restApiUrl + "forum/forumLike/" + Authentication.getUserInfo().userId)
    .then(function(result) {



      $scope.data = Authentication.getUserInfo();


      $scope.forumdata = result.data;
      if (Authentication.getUserInfo().speciality == undefined) {
        Authentication.getUserInfo().speciality = "";
      }
      if ($scope.data.follower == undefined) {
        $scope.data.follower = [];
      }
      if ($scope.forumdata.followId == undefined) {
        $scope.forumdata.followId = [];
      }
      if ($scope.forumdata.reportId == undefined) {
        $scope.forumdata.reportId = [];
      }
      var data = {
        userId: Authentication.getUserInfo().userId,
        "category": setAccountData.getUserInfo().speciality,
        "followDoctorId": $scope.data.follower,
        "followForumId": $scope.forumdata.followId,
        "reportId": $scope.forumdata.reportId
      };
      console.log(data);
      $('#loadingPlaceholerProblemDrProfile').css("display", "block");
      $http.post(restApiUrl + "forum/doctor/category", data).then(function(success) {

          $scope.problemgetlists = [];
          if (success.data == "") {
            $scope.showdivProblem = true;
            $scope.showdivProblemLoading = false;
          } else if (!($.isArray(success.data))) {
            $scope.problemgetlists.push(success.data);
            $scope.showdivProblemLoading = false;
          } else {
            $scope.problemgetlists = success.data;
            $scope.showdivProblemLoading = false;
          }

          //Get Notifications for Forums
          var fIds = { forumId : []};
          for (var fi = 0; fi < $scope.problemgetlists.length; fi++) {
            if($scope.checkFollow($scope.problemgetlists[fi])){
              fIds.forumId.push($scope.problemgetlists[fi]._id);              
            }
          }
          $http.post(restApiUrl + "forum/notification/" + Authentication.getUserInfo().userId, fIds).then(function(success) {

              if (!($.isArray(success.data))) {
                  $scope.notification.doc = [];
                  $scope.notification.doc.push(success.data);
              } else {
                  $scope.notification.doc = success.data;
              }
          },
          function(error) {

          });
          //End Notification Get

          $scope.profileProblemCount.doctor = $scope.problemgetlists.length;
          //    $scope.showdivProblemLoading =false; 
          $('#loadingPlaceholerProblemDrProfile').css("display", "none");
        },
        function(err) {
          console.log(err);
        }
      );

    });

  $scope.noproblemshow = function() {
    //  console.log("dsdsalkjdas");
  }


  $scope.checkloginReport = function(id) {

    $scope.users = Authentication.getUserInfo();
    if (!($.isEmptyObject($scope.users))) {
      return problemservices.checkloginreport($scope.users, $scope.forumdata, id);
    } else {
      return true;
    }
  }

    // report     

  $scope.report = function(id, ownerId, question) {


    var notify = {

      "repliedby": {
        "name": Authentication.getUserInfo().name,
        "readstatus": 0,
        "role": Authentication.getUserInfo().type,
        "userId": Authentication.getUserInfo().userId
      },
      "action": "report",
      "ownerId": ownerId,
      "forumId": id,
      "question": question,
      "createdDate": new Date()
    }

    var setdata = Authentication.getUserInfo();
    var data = problemservices.report(notify, $scope.forumdata, setdata, id, ownerId, question);

    console.log(data);
    $scope.forumdata = data;

  }


}]);