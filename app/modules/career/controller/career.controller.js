'use strict';
/**
 * @ngdoc function
 * @name trDocpal.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the trDocpal
 */
var app = angular.module(ApplicationConfiguration.applicationModuleName);

app.controller('careerviewCtrl', ['$state', '$scope', '$location', '$http', '$stateParams', 'Upload', 'toaster', function ($state, $scope, $location, $http, $stateParams, Upload, toaster) {
    var data = {};
    var id = $stateParams.id;
    $http.get(restApiUrl + "careers/" + id, data).then(function (success) {
        $scope.jobDetail = success.data;
    },
    function (error) {

    });
    
    $scope.applyForPost  =   function(items, profile){
        var newdata =   {"job_profile": profile};        
        var data    =   $.extend(true, items, newdata); 
        var file    =   data.file;
        
        $http.post(restApiUrl + "appliedjobs", data).then(function(response) {
            
            $('input[name=name]').val('');
            $('input[name=mobile]').val('');
            $('input[name=email]').val('');
            $('textarea[name=message]').val('');

            toaster.pop('success', "success", "Your detail has been submitted succesfully. We will contact you as soon as possible !");
            
            var lastInsertid    =   response.data._id;
            
            file.imgName = file.name;
            file.upload = Upload.upload({
                url: restApiUrl + "appliedjobs/" + lastInsertid + "/image",
                data: {resume: file},
            });
        },
        function(error) {

        });
    }
}]);