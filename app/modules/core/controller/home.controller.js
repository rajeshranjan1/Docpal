'use strict';
/**
 * @ngdoc function
 * @name trDocpal.controller:HomesCtrl
 * @description
 * # HomesCtrl
 * Controller of the trDocpal
 */
angular.module(ApplicationConfiguration.applicationModuleName).controller('HomesCtrl', ['$scope', '$http', '$location', '$state', 'Authentication', '$compile', function($scope, $http, $location, $state, Authentication, $compile) {
        /*var searchList = "";
        var data2 = {
            setValue: ""
        };
        $scope.setSearchList = [];*/
        $scope.user.setvalueSearchBox   =   '';
        $scope.user.setValueType        =   undefined;
        $scope.setSearchList            =   [];
        $scope.newList.list             =   [];
        if($scope.selectedMenu == undefined){
            $scope.selectedMenu = 0; 
        }
        try{
            $('.nav-tabs').find('a:eq('+ parseInt($scope.selectedMenu) + ')').tab('show');
        }catch(e){
            console.log("Error in home page sliders",e);
        }
        
        //Get testimonials
        $http.get(restApiUrl + "testimonials").then(function(success){
            $scope.testimonials = success.data;
            $scope.limit        = 5;
        },
        function(error) {
            console.log(error);
        });
        
        //Get how it works
        $http.get(restApiUrl + "howitworks").then(function(success){
            $scope.howitworks = success.data;
            $scope.limit      = 5;
        },
        function(error) {
            console.log(error);
        });
        
        //Get why use docpal
        $http.get(restApiUrl + "whyusedocpals").then(function(success){
            $scope.whyusedocpals = success.data;
            $scope.limit         = 4;
        },
        function(error) {
            console.log(error);
        });
        
        $scope.showMoreCatg =   function(){
            $scope.docCat = doctorCategory;
            
            var html    =   '';
            var j       =   1;
            var tmp     =   $('#temp_value').val();
            var limit   =   parseFloat(tmp) + parseFloat(8);
            html    +=  '<div class="tab-data">';
            html    +=  '<div class="col-md-12 mr-tp-16">';
            
            for (var i = tmp; i <= docCat.length; i++) {
                if (i === limit) {
                    break;
                }
                var catName     =   docCat[i]['catName'];
                var catImage    =   docCat[i]['catImage'];
                var doctorcat   =   'doctorcat';
                var doctor      =   'doctor';
                html    +=  '<div class="col-md-3 pd-lr-8" style="margin-bottom: 10px;">';
                html    +=  '<a href="#" class="doctors-cat" ng-click="user.setValueType='+doctorcat+'; user.setvaluesearchbox='+catName +'; setsearch(user, '+doctor+')">';
                html    +=  '<img src="assets/img/doc'+j+'.png" alt="doc category" class="img-100">';
                html    +=  '<div class="cat-text"><h3>'+ catName +'</h3></div>';
                html    +=  '</a>';
                html    +=  '</div>';
                j++;
            };
            html    +=  '</div>';
            html    +=  '</div>';
            
            $('#search').append($compile(html)($scope));
            $('#temp_value').val(parseFloat(tmp * 2));
        }
        
        /*$http.post(restApiUrl + "doctors/list/category", data2).then(function(success) {
                console.log(success);
                searchList = success.data.tags;
                // $scope.FilterList(success.data.tags);
            },
            function(error) {
            });
        
         $scope.setSearchBoxx = function(data) {

            $scope.setSearchList = [];

            for (var i = 0; i < Object.keys(searchList).length; i++) {

                $scope.searchList = $.grep(searchList[Object.keys(searchList)[i]], function(value, j) {

                    if (value.indexOf(data) == 0 || value.toLowerCase().indexOf(data) == 0) {
                        var setObj = {
                            type: Object.keys(searchList)[i],
                            dat: value
                        }
                        $scope.setSearchList.push(setObj);
                    }
                });
            }

        }*/
}]);