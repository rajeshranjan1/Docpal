'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
   //$locationProvider.html5Mode(true).hashPrefix('!');
   
  // /$httpProvider.interceptors.push('authInterceptor');
  }
]);


angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope', '$state', 'Authentication',function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
   var stateWithoutFooter = ['registerDoctor',
   '/loginDoctor',
   'userLogin',
   'registerUser',
   'registorSuccess'];
  var $footer = $('#footer2');
   
  $rootScope.$on('$stateChangeStart',function (event, toState, toParams, fromState, fromParams) {

  if(stateWithoutFooter.indexOf(toState.url) > -1){
      $footer.css('display','none');
  }
  if(toState.url == "/loginDoctor" || toState.url == "/userLogin" || toState.url == "/forgotpassword") {
        var validId = Authentication.getUserInfo()._id;
        if(validId){
           $state.go("homepage");
           event.preventDefault();
        }
  }


    if(toState.url == "/loginDoctor") {
       var valid = Authentication.isValiUser;
        if(valid == undefined || valid == false)
          {}
        else
           $state.go(fromState);

    }
    if(toState.url == "/registerDoctor" || toState.url == "/registerUser") {
         console.log($rootScope);
    }

     

      angular.element("#sidebar_dr .menu-hide").removeClass("show");
      angular.element("#sidebar_dr .menu-tab").removeClass('active');
     
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess',function (event, toState, toParams, fromState, fromParams) {
    if (!fromState.data || !fromState.data.ignoreState) {
      $state.previous = {
        state: fromState,
        params: fromParams,
        href: $state.href(fromState, fromParams)
      };
    }
   
     if(toState.data!=undefined){
          var active=toState.data.active;
          switch(active){
            case "doctors":
              $rootScope.selectedMenu = 0; break;
            case "hospitalList":
              $rootScope.selectedMenu = 1; break;
            case "labs":
              $rootScope.selectedMenu = 2; break;
            case "problemInfo":
              $rootScope.selectedMenu = 3; break;
            default :
               break;
          }
     }
     if (toState.data && toState.data.notAllowed) {
      if ($.isEmptyObject(Authentication.getUserInfo())) {
          if(fromState.name == 'userLogin')
            $state.go('userLogin');
          else
            $state.go('loginInfo');
          //window.location = '/#/loginDoctor';
        }
      }
     
    
  });
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
