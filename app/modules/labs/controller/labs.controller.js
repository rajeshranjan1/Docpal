'use strict';
/**
 * @ngdoc function
 * @name trDocpal.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the trDocpal
 */
var app = angular.module(ApplicationConfiguration.applicationModuleName);

app.controller('labCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', 'Authentication', 'Upload', '$timeout', function($state, $scope, $location, $http, $stateParams, Authentication, Upload, $timeout) {
  $scope.showDetails = true;
  $scope.showImgUpload = false;
  $scope.showImgUpload2 = false;
  $scope.menuimage = $scope.filters[3].image;
  //$scope.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  $scope.shifts = ["AM", "PM"];
  $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  $scope.timeslotAvail = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  $scope.timining = [{
      "days": ["mon", "tue"],
      "time": [{
          "startTime": "0",
          "endTime": "0"
        }
      ]
    }

  ]
  $scope.test = [{
    "testName": "",
    "testPrice": 0
  }]
  console.log($scope.test);
  var labId = '';
  $scope.add3 = function() {

    var t = {
      "testName": "",
      "testPrice": 0
    }
    $scope.test.push(t);
  }

  // console.log(timining);
  $scope.moreTime = function(timing) {

    var moreTimeNew = {
      "startTime": "0",
      "endTime": "0",
      "shiftstart": "AM",
      "shiftend": "PM"
    };

    timing.time.push(moreTimeNew);

  };

  $scope.removeDays = function(index) {

    $scope.timining.splice(index, 1);

  };


  $scope.add = function() {

    angular.element(".dropdown-time-div").css('display', 'block');

    angular.element(".dropdown-time-div").css('display', 'block');
    var timnew = {
      "days": ["", ""],
      "time": [{
        "startTime": "0",
        "endTime": "0",
        "shiftstart": "am",
        "shiftend": "pm"

      }]
    };

    $scope.timining.push(timnew);

  };



  $scope.savelabdata = function(data) {
    $scope.showDetails = false;
    $scope.showImgUpload = true;
    var i, j, v, day,
      start = $scope.timining[0].days[0],
      end = $scope.timining[0].days[1],
      st = $scope.days.indexOf(start),
      ed = $scope.days.indexOf(end);

    $scope.timining[0].days = [];
    for (j = st; j <= ed; j++) {
      day = $scope.days[j];
      $scope.timining[0].days.push(day);
    }

    data.timing = $scope.timining;
    var gps = {
      "type": "Point",
      "coordinates": [data.location.lng, data.location.lat]
    };
    data.gps = gps;
    for (i = 0; i < $scope.test.length; i++) {
      $scope.test[i].testPrice = parseInt($scope.test[i].testPrice, 10);
    }
    data.test = $scope.test;
    console.log($scope.test);

    $http.post(restApiUrl + "labs", data).then(function(success) {
        console.log(success.data);
        labId = success.data._id;
        $scope.showImgUpload = true;
      },
      function(error) {
        console.log(error);
      });
  }

  $scope.changeSubmitIcon = function() {
    $scope.showAdd = true;
  }

  $scope.changeLabIcon = function() {
    $scope.showGallery = true;
  }

  $scope.addNewHospital = function() {

    $scope.showDetails = true;
    $scope.showImgUpload = false;
  }

  $scope.saveLabImage = function(file) {


    file.imgName = file.name;
    console.log(file);
    file.upload = Upload.upload({ //$scope.users.userId
      url: restApiUrl + "labs/" + labId + "/image",
      data: file,
    });

    file.upload.then(function(response) {
      $timeout(function() {
        file.result = response.data;
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  }

  $scope.saveLabGallery = function(file, caption) {

    // console.log($scope.users.userId);
    file.imgName = file.name;
    if (caption != undefined)
      file.imgCaption = caption;
    else
      file.imgCaption = '';
    console.log(file);
    file.upload = Upload.upload({ //$scope.users.userId+
      url: restApiUrl + "labs/" + labId + "/gallery",
      data: file
    });


    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response.data);
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  }

  $scope.setImageModel = function(data, caption) {
    $scope.imageServer3 = data;
    $scope.caption = caption;
  }
}]);


app.controller('labGetListCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', 'Authentication', '$compile', 'setfilterService', function($state, $scope, $location, $http, $stateParams, Authentication, $compile, setfilterService) {

  $scope.getLabSum = function(test) {
    var testC = 0;
    var testS = 0;
    $scope.filter.test.forEach(function(Felement, Findex) {
      test.forEach(function(Telement, Tindex) {
        if (Telement.testName == Felement) {
          testC += 1;
          testS += Telement.testPrice;
        }
      });
    });
    if (testC == 0 && testS == 0) {
      testC = test.length;
      test.forEach(function(Telement, Tindex) {
        testS += Telement.testPrice;
      });
    }
    return testS + ' For ' + testC + ' Tests';
  }

  $scope.gettime = function(timing) {

    if (timing == undefined) {
      return;
    }
    var tm = "";
    for (var i = 0; i < timing.length; i++) {
      tm += timing[i].days[0] + " - " + timing[i].days[1] + " \n";
      if (timing[i].time != undefined) {
        for (var j = 0; j < timing[i].time.length; j++) {
          var timeSlot = timing[i].time[j];
          timeSlot.endMinute = (timeSlot.endMinute === undefined || timeSlot.endMinute == 0) ? '00' : timeSlot.endMinute;
          timeSlot.startMinute = (timeSlot.startMinute === undefined || timeSlot.startMinute == 0) ? '00' : timeSlot.startMinute;
          tm += timeSlot.startTime + " : " + timeSlot.startMinute + " " + timeSlot.shiftstart + " - " + timeSlot.endTime + " : " + timeSlot.endMinute + " " + timeSlot.shiftend + "\n";
        }
      }
    }
    return tm;

  }

  var totalcoast = 0;
  $scope.getfee = function(data) {
    console.log(data);
    console.log(data.length);
    totalcoast = 0;
    for (var i = 0; i < data.length; i++) {
      console.log(i, data[i].testName);
      if (data[i].testName != undefined) {
        console.log("Match");
        if ($.inArray(data[i].testName, $scope.filter.test) !== -1) {
          totalcoast = parseInt(totalcoast) + parseInt(data[i].testPrice);
          console.log(data[i].testPrice);
          console.log(totalcoast, typeof totalcoast);
        }
      }
    }
    console.log(totalcoast);
    return totalcoast;
  }

  $scope.toggleupward = function(id) {
    $scope.loading[id] = false;
    checktype = "";

  }

  $scope.toggleMe = function(id, labid) {
    var data = {};
    $("#sec" + labid).html("");
    $scope.loading[previousid] = false;
    $scope.loading[id] = true;
    previousid = id;
    var data = labid;
    var data = {};
    $http.get(restApiUrl + "labs/" + labid, data).then(function(success) {
        $scope.labdata = success.data;
        if ($scope.labdata.about == undefined && $scope.labdata.facility == undefined && $scope.labdata.certificate == undefined && $scope.labdata.test == undefined && $scope.labdata.awards == undefined && $scope.labdata.membership == undefined) {
          // allDetails.html("");
          var compiledeHTML = $compile("<div><h3>No data to show</h3></div>")($scope);
          $("#sec" + labid).html(compiledeHTML);
        } else {
          var compiledeHTML = $compile("<div viewlabprofile></div>")($scope);
          $("#sec" + labid).html(compiledeHTML);
        }
      },
      function(error) {});
  }

  $scope.toggleMap = function(id, labid, lat, log) {
    console.log(lat, log);

    $("#sec" + labid).html("");
    $scope.loading[previousid] = false;
    $scope.loading[id] = true;
    previousid = id;

    $scope.longitute = log;
    $scope.latitute = lat;

    $("#map").remove();

    var compiledeHTML = $compile("<div class='col-md-12'><div class='line'><div class='map-div'><span class='background-icon'><span class='icon-select4 map-icon-class'><span></span></div><div id='map'></div></div></div>")($scope);


    $("#sec" + labid).html(compiledeHTML);



  };

  $scope.togglegallery = function(id, labid) {
    $("#sec" + labid).html("");
    $scope.loading[previousid] = false;
    $scope.loading[id] = true;
    previousid = id;
    var data = {};

    $http.get(restApiUrl + "labs/" + labid, data).then(function(result) {
        $scope.datagallery = result.data.gallery;
        console.log($scope.datagallery);

        if ($scope.datagallery == "" || $scope.datagallery == undefined) {
          var compiledeHTML = $compile("<div><h3>No Images to show</h3></div>")($scope);
          $("#sec" + labid).html(compiledeHTML);
        } else {
          var compiledeHTML = $compile("<div class='col-md-12'><div class='line'><div gallery class='gallery1'></div></div></div>")($scope);
          $("#sec" + labid).html(compiledeHTML);

          $scope.$on('gallaryLoaded', function(ngRepeatFinishedEvent) {
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
      function(err) {
        console.log(err);
      });
  }

  //Filter Work
  $scope.sliderConfigTime = {
    min: 0,
    max: 24,
    step: 1,
    values: [0, 24]
  };
  $scope.sliderConfig = {
    min: 0,
    max: 2000,
    step: 10,
    values: [0, 2000]
  };
  $scope.filterData = {};
  $scope.filterData.fee = {};
  $scope.filterData.availability = {};
  $scope.filterData.availability.time = {};
  $scope.filterData.availability.time.start = 0;
  $scope.filterData.availability.time.end = 24;
  $scope.filterData.fee.start = 0;
  $scope.filterData.fee.end = 2000;

  $scope.filter = {
    day: [],
    test: [],
    facilities: [],
    time: {
      "end": 24,
      "start": 0
    },
    fees: {
      "end": 2000,
      "start": 0
    },
    location: "",
    limit: 10,
    offset: 0,
    type: ""
  };

  $scope.clearFilter = function() {
    $scope.filter = {
      day: [],
      test: [],
      facilities: [],
      time: {
        "end": 24,
        "start": 0
      },
      fees: {
        "end": 2000,
        "start": 0
      },
      location: "",
      limit: 10,
      offset: 0,
      type: ""
    };

        // time filter
        var $slider = $(".labTimeFilterRange");

        $slider.slider("values", 0, 0);
        $slider.slider("values", 1, 24);
   
        $slider.closest(".progress-li").find(".labTime").html("12 AM to 11 : 59 PM");
       // fees filter
        var $slider1 = $("#slider-4");

        $slider1.slider("values", 0, 0);
        $slider1.slider("values", 1, 2000);
        $slider1.closest(".progress-li2").find(".labFeeRange").html("0 to 2000");

    setfilterService.setfilterdata($scope.filter, "lab");
    $scope.getFilterList($scope.filter, 'labs', '#loadingPlaceholerLab');
  }

  $scope.setFilterdata = function(data, type) {


    if (type == 'location') {
      $scope.filter.location = data;

    } else if (type == 'test') {
      if ($.inArray(data, $scope.filter.test) !== -1) {
        $scope.filter.test.splice($scope.filter.test.indexOf(data), '1');
      } else {
        $scope.filter.test.push(data);
      }
    } else if (type == 'facilities') {
      if ($.inArray(data, $scope.filter.facilities) !== -1) {
        $scope.filter.facilities.splice($scope.filter.facilities.indexOf(data), '1');
      } else {
        $scope.filter.facilities.push(data);
      }
    } else if (type == 'day') {
      if ($.inArray(data, $scope.filter.day) !== -1) {
        $scope.filter.day.splice($scope.filter.day.indexOf(data), '1');
      } else {
        $scope.filter.day.push(data);
      }
    } else if (type == 'time')
      $scope.filter.time = data;
    else if (type == 'fees')
      $scope.filter.fees = data;

    console.log($scope.filter);
    setfilterService.setfilterdata($scope.filter, "lab");
    $scope.getFilterList($scope.filter, 'labs', '#loadingPlaceholerLab');
  }

  $scope.crossclick = function(data, type) {
      var indexno = "";
      if (type == 'loc') {
        $scope.filter.location = "";
      } else if (type == 'day') {
        indexno = $scope.filter.day.indexOf(data);
        $scope.filter.day.splice(indexno, '1');
      } else if (type == 'test') {
        indexno = $scope.filter.test.indexOf(data);
        $scope.filter.test.splice(indexno, '1');
      } else if (type == 'facilities') {
        indexno = $scope.filter.facilities.indexOf(data);
        $scope.filter.facilities.splice(indexno, '1');
      }
      setfilterService.setfilterdata($scope.filter, "lab");
      $scope.getFilterList($scope.filter, 'labs', '#loadingPlaceholer');

    }
    //Check if filter is set and type is same as page type 
  if (setfilterService.getfilterdata()[0] != undefined && setfilterService.getfilterdata()[1] == "lab") {
    $scope.filter = setfilterService.getfilterdata()[0];
    try {
      $scope.filter.time.start = 0;
      $scope.filter.time.end = 24;
      $scope.filter.fees.start = 0;
      $scope.filter.fees.end = 2000;
    } catch (e) {
      // statements
      console.log(e);
    }
  }
  $scope.getFilterList($scope.filter, 'labs', '#loadingPlaceholerLab');

}]);

app.controller('labProfCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', 'Authentication', 'Upload', '$timeout', function($state, $scope, $location, $http, $stateParams, Authentication, Upload, $timeout) {

  $scope.quantity = 2;
  var id = $stateParams.id;
  console.log(id);
  $http.get(restApiUrl + "labs/" + id).then(function(success) {
      console.log(success.data);
      $scope.labProDetail = success.data;
      //   console.log($scope.labsdata[]);
    },
    function(error) {

    });

  $scope.$on('gallaryLoaded', function(ngRepeatFinishedEvent) {

    $("#owl-demo").owlCarousel({
      items: 3,
      lazyLoad: true,
      navigation: true
    });


  });

  // set image in modal

  $scope.setImageModel = function(data, caption) {
    $scope.imageServer3 = data;
    $scope.caption = caption;
  }


  $scope.gettime = function(timing) {

    if (timing == undefined) {
      return;
    }
    var tm = "";
    for (var i = 0; i < timing.length; i++) {
      tm += timing[i].days[0] + " - " + timing[i].days[1] + " \n";
      if (timing[i].time != undefined) {
        for (var j = 0; j < timing[i].time.length; j++) {
          var timeSlot = timing[i].time[j];
          timeSlot.endMinute = (timeSlot.endMinute === undefined || timeSlot.endMinute == 0) ? '00' : timeSlot.endMinute;
          timeSlot.startMinute = (timeSlot.startMinute === undefined || timeSlot.startMinute == 0) ? '00' : timeSlot.startMinute;
          tm += timeSlot.startTime + " : " + timeSlot.startMinute + " " + timeSlot.shiftstart + " - " + timeSlot.endTime + " : " + timeSlot.endMinute + " " + timeSlot.shiftend + "\n";
        }
      }
    }
    return tm;

  }
}]);