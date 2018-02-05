'use strict';
/**
 * @ngdoc overview
 * @name trDocpal
 * @description
 * # trDocpal
 * @developer Vishal Sr
 * Main module of the application.
 */
angular
  .module(ApplicationConfiguration.applicationModuleName)
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    
    $ocLazyLoadProvider.config({
      debug:true,
      events:true,
    });

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state(ConfigState.state.home.name, {
        url:ConfigState.state.home.url,
        templateUrl: ConfigState.state.home.templateUrl,
        controller: ConfigState.state.home.controllerName
    })
   //doctors state
   .state(ConfigState.state.doctors.name, {
        url:ConfigState.state.doctors.url,
        templateUrl: ConfigState.state.doctors.templateUrl,
        controller: ConfigState.state.doctors.controllerName,
        data:{
        	roles:['admin']
        }
      })

    
   .state(ConfigState.state.doctorInfo.name, {
        url:ConfigState.state.doctorInfo.url,
        templateUrl: ConfigState.state.doctorInfo.templateUrl,
        controller: ConfigState.state.doctorInfo.controllerName
      })
      
  }]);

    
