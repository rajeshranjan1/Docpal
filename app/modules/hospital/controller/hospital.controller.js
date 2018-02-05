  'use strict';
  /**
   * @ngdoc function
   * @name trDocpal.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the trDocpal
   */
  var app = angular.module(ApplicationConfiguration.applicationModuleName);

  app.controller('hospitalCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', 'Authentication', 'Upload', '$timeout', function($state, $scope, $location, $http, $stateParams, Authentication, Upload, $timeout) {

      $scope.showDetails = true;
      $scope.showImgUpload = false;
      $scope.menuimage = $scope.filters[1].image;
      $scope.shifts = ["AM", "PM"];
      $scope.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      $scope.timeslotAvail = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      $scope.timining = [{
          "days": ["mon", "tue"],
          "time": [{
              "startTime": "0",
              "endTime": "0"
          }]
      }]
      $scope.findclinictext = "Find Clinic";
      var hosId = '';
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

      $scope.addNewHospital = function() {

          $scope.showDetails = true;
          $scope.showImgUpload = false;
      }



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

      $scope.savehospital = function(data) {

          $scope.showDetails = false;
          $scope.showImgUpload = true;
          $scope.hospital = null


          var start = $scope.timining[0].days[0];
          var end = $scope.timining[0].days[1];

          var st = $scope.days.indexOf(start);
          var ed = $scope.days.indexOf(end);

          $scope.timining[0].days = [];
          for (var j = st; j <= ed; j++) {
              var day = $scope.days[j];
              $scope.timining[0].days.push(day);
          }

          data.timing = $scope.timining;

          var gps = {
              "type": "Point",
              "coordinates": [data.location.lng, data.location.lat]
          };
          data.gps = gps;

          $http.post(restApiUrl + "hospitals", data).then(function(success) {
                  hosId = success.data._id;
                  $scope.showImgUpload = true;
              },
              function(error) {

              });
      }
      
      $scope.changeIcon = function() {
          $scope.showAdd = true;
      }

      $scope.changeGalleryIcon = function() {
          $scope.showGallery = true;
      }


      $scope.savehospitalImage = function(file) {

          $scope.users = Authentication.getUserInfo();
          console.log($scope.users.userId);
          console.log(file);
          //$scope.showAdd=false;
          file.imgName = file.name;
          console.log(file);
          file.upload = Upload.upload({
              url: restApiUrl + "hospitals/" + hosId + "/image",
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

      $scope.savehospitalGallery = function(file, caption) {

          file.imgName = file.name;
          if (caption != undefined)
              file.imgCaption = caption;
          else
              file.imgCaption = '';
          console.log(file);
          file.upload = Upload.upload({
              url: restApiUrl + "hospitals/" + hosId + "/gallery",
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




  }]);

  app.controller('hospitalGetCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', '$compile', 'setfilterService', function($state, $scope, $location, $http, $stateParams, $compile, setfilterService) {


      $scope.showModal = false;
      $scope.toggleModal = function() {
          $scope.showModal = !$scope.showModal;
      };

      $scope.$on('gallarypopup', function(ngRepeatFinishedEvent) {

          loadGallery(true, 'div.thumbnail');


      });

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

          $('#show-next-image, #show-previous-image').click(function() {
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
              $('#image-gallery-caption').text($sel.data('caption'));
              $('#image-gallery-title').text($sel.data('title'));
              $('#image-gallery-image').attr('src', $sel.data('image'));
              disableButtons(counter, $sel.data('image-id'));
          }

          if (setIDs == true) {
              $('[data-image-id]').each(function() {
                  counter++;
                  $(this).attr('data-image-id', counter);
              });
          }

          $(setClickAttr).on('click', function() {
              updateGallery($(this));
              $("#image-gallery").modal('show');
          });
      }

      var data = {};
      /*$http.get(restApiUrl+"hospitals/",data).then(function(success){
      console.log(success.data);
      $scope.hospitalDetail=success.data;
                   $("#loadingPlaceholerHospital").css("display","none");

      },
      function(error){

      });*/

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
                      tm += timeSlot.startTime + " : "+ timeSlot.startMinute + " " + timeSlot.shiftstart + " - " + timeSlot.endTime + " : "+ timeSlot.endMinute + " " + timeSlot.shiftend + "\n";
                  }
              }
          }
          return tm;

      }

      $scope.toggleupward = function(id) {
          $scope.loading[id] = false;
      }


      $scope.toggleMe = function(id, doctorid) {

          var data = {};
          $("#sec" + doctorid).html("");
          $scope.loading[previousid] = false;
          $scope.loading[id] = true;

          previousid = id;

          $http.get(restApiUrl + "hospitals/" + doctorid, data).then(function(result) {
                  $scope.content = result.data;
                  $scope.hospital = result.data;


                  var hosName = $scope.hospital.name;
                  $http.get(restApiUrl + "doctors/hospitals/" + hosName, data).then(function(success) {
                          $scope.doctordetails = success.data;
                          console.log($scope.doctordetails);
                          var compiledeHTML = $compile("<div viewhospitaldata></div>")($scope);
                          $("#sec" + doctorid).html(compiledeHTML);
                      },
                      function(error) {

                      });

              },
              function(err) {
                  console.log(err);
              }
          );
      }

      $scope.toggleMap = function(id, doctorid, lat, log) {

          $("#sec" + doctorid).html("");
          $scope.loading[previousid] = false;
          $scope.loading[id] = true;
          previousid = id;

          $scope.longitute = log;
          $scope.latitute = lat;

          $("#map").remove();

          var compiledeHTML = $compile("<div class='col-md-12'><div class='line map_line'><div class='map-div'><span class='background-icon'><span class='icon-select4 map-icon-class'><span></span></div><div id='map'></div></div></div>")($scope);


          $("#sec" + doctorid).html(compiledeHTML);

      };

      $scope.togglegallery = function(id, hospitalid) {

          var data = {};
          $("#sec" + hospitalid).html("");
          $scope.loading[previousid] = false;
          $scope.loading[id] = true;
          previousid = id;

          $http.get(restApiUrl + "hospitals/" + hospitalid, data).then(function(result) {
                  $scope.datagallery = result.data.gallery;
                  console.log($scope.datagallery);
                  if ($scope.datagallery == "" || $scope.datagallery == undefined) {
                      var compiledeHTML = $compile("<div><h3>No Images to show</h3></div>")($scope);
                      $("#sec" + hospitalid).html(compiledeHTML);
                  } else {
                      var compiledeHTML = $compile("<div class='col-md-12'><div class='line'><div gallery class='gallery1'></div></div></div>")($scope);
                      $("#sec" + hospitalid).html(compiledeHTML);
                      $scope.$on('gallaryLoaded', function(ngRepeatFinishedEvent) {
                          $("#owl-demo").owlCarousel({
                              items: 3,
                              lazyLoad: true,
                              navigation: true
                          });
                      });
                  }
              },
              function(err) {
                  console.log(err);
              });
      }

      // set  image in model 
      $scope.setImageModel = function(data, caption) {
              $scope.imageServer3 = data;
              $scope.caption = caption;
          }
          //Filter Work
      $scope.sliderConfigTime = {
          min: 0,
          max: 24,
          step: 1,
          values: [0, 24]
      };
      $scope.filterData = {};
      $scope.filterData.availability = {};
      $scope.filterData.availability.time = {};
      $scope.filterData.availability.time.start = 0;
      $scope.filterData.availability.time.end = 24;

      //No need of this
      /*if($scope.filter == undefined) {
          $scope.filter = {
              day: [],
              speciality: [],
              facilities: [],
              time: {
                  "end": 0,
                  "start": 0
              },
              location: "",
              limit:10,
              offset:0,
              searchBy:""
          };
      }*/
      $scope.filter = {
          day: [],
          speciality: [],
          facilities: [],
          time: {
              "end": 24,
              "start": 0
          },
          location: "",
          limit: 10,
          offset: 0,
          searchBy: ""
      };


      $scope.setFilterdata = function(data, type) {
          console.log(data);

          if (type == 'location') {
              $scope.filter.location = data;
              $scope.filterData.location = "";
          } else if (type == 'speciality') {
              if ($.inArray(data, $scope.filter.speciality) !== -1) {
                  $scope.filter.speciality.splice($scope.filter.speciality.indexOf(data), '1');
              } else {
                  $scope.filter.speciality.push(data);
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

          console.log($scope.filter);
          setfilterService.setfilterdata($scope.filter,"hospital");
          $scope.getFilterList($scope.filter, 'hospitals', '#loadingPlaceholerHospital');
      }

      $scope.crossclick = function(data, type) {
          var indexOf = ""
          if (type == 'loc') {
              $scope.filter.location = "";
          } else if (type == 'day') {
              indexOf = $scope.filter.day.indexOf(data);

              $scope.filter.day.splice(indexOf, '1');
          } else if (type == 'speciality') {
              indexOf = $scope.filter.speciality.indexOf(data);

              $scope.filter.speciality.splice(indexOf, '1');
          } else if (type == 'facilities') {
              indexOf = $scope.filter.facilities.indexOf(data);

              $scope.filter.facilities.splice(indexOf, '1');
          }
          setfilterService.setfilterdata($scope.filter,"hospital");
          $scope.getFilterList($scope.filter, 'hospitals', '#loadingPlaceholerHospital');

      }

      //Check if filter is set and type is same as page type 
      if (setfilterService.getfilterdata()[0] != undefined && setfilterService.getfilterdata()[1] == "hospital") {
          $scope.filter = setfilterService.getfilterdata()[0];
          try {
            $scope.filter.time.start = 0;
            $scope.filter.time.end = 24;
          } catch(e) {
            // statements
            console.log(e);
          }
      }
      $scope.getFilterList($scope.filter, 'hospitals', '#loadingPlaceholerHospital');
      $scope.clearFilter = function() {
          $scope.filter = {
              day: [],
              speciality: [],
              facilities: [],
              time: {
                  "end": 24,
                  "start": 0
              },
              location: "",
              limit: 10,
              offset: 0,
              searchBy: ""
          };

          // time filter
        var $slider = $(".hospitalTimeFilterRange");

        $slider.slider("values", 0, 0);
        $slider.slider("values", 1, 24);
   
        $slider.closest(".progress-li").find(".hospitalTime").html("12 AM to 11 : 59 PM");
       
          setfilterService.setfilterdata($scope.filter,"hospital");
          $scope.getFilterList($scope.filter, 'hospitals', '#loadingPlaceholerHospital');
      };

  }])

  app.controller('hospitalviewCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', function($state, $scope, $location, $http, $stateParams) {
      var data = {};
      $scope.result = {};
      
      $scope.currpass = true;
      $scope.size = $state.params.size;
      $scope.clinics = $state.params.clinics;
      
      console.log($stateParams);
      var id = $stateParams.id;
      console.log(id);
      $http.get(restApiUrl + "hospitals/" + id, data).then(function(success) {
              console.log(success.data);

              $scope.hosProDetail = success.data;
              //$scope.datagallery = success.data.gallery;


          },
          function(error) {

          });
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
              tm += timing[i].days[0] + " - " + timing[i].days[timing[i].days.length - 1] + " \n";
              if (timing[i].time != undefined) {
                  for (var j = 0; j < timing[i].time.length; j++) {
                      var timeSlot = timing[i].time[j];
                      timeSlot.endMinute = (timeSlot.endMinute === undefined || timeSlot.endMinute == 0) ? '00' : timeSlot.endMinute;
                      timeSlot.startMinute = (timeSlot.startMinute === undefined || timeSlot.startMinute == 0) ? '00' : timeSlot.startMinute;
                      tm += timeSlot.startTime + " : "+ timeSlot.startMinute + " " + timeSlot.shiftstart + " - " + timeSlot.endTime + " : "+ timeSlot.endMinute + " " + timeSlot.shiftend + "\n";
                  }
              }
          }
          return tm;

      }
      debugger;
      $scope.findClinic = function (clinicdata) {
          if (clinicdata.city === undefined || clinicdata.city === "" || clinicdata.city === null) {
              toaster.pop('error', "error", "please fill the city");
              return false;
          }
          if (clinicdata.locality === undefined || clinicdata.locality === "" || clinicdata.locality === null) {
              toaster.pop('error', "error", "please fill the locality");
              return false;
          }
          var completeaddres = clinicdata.locality + ", " + clinicdata.city;
          var location = {
              "completeaddres" : completeaddres
          }
          var postFindClinicData = {
          	location: location,
          };
          $scope.runRoute(routes.hospital.findClinic, postFindClinicData, function (success) {
              if (success && success.data.length == 0) {
            	  console.log("Success but no data revieced");
                  return;
              }
              console.log("Success !!!!!!!!!");
              /*var result = { size: success.data.length, param2:37, etc:'bluebell' };*/
              $scope.size = success.data.length;
              console.log("clinic size   :"+ $scope.size);
              $state.go('clinicSuggestion', {size:success.data.length, clinics:success.data});
          },
          function (err) {
          	console.log("Error Occured while finding clinics via city and locality",err);
              $scope.servernotfound = true;
          });
      }
      
  }]);