app.directive('starRating', function() {
    return { 
        restrict:'E',
        replace:true,
        templateUrl:'modules/core/view/userFeedback.html'
    }
});

app.directive('searchmenu', function() {
    return { 
        restrict:'E',
        replace:true,
        templateUrl:'modules/core/view/menu.html'
    }
});
app.directive('problemview' , function(){
    return {
        restrict:'E',
        
        templateUrl:'modules/doctors/view/dr_problem.view.html'
    }
});
app.directive('myproblemview' , function(){
    return {
        restrict:'E',
        
        templateUrl:'modules/doctors/view/dr_myproblem.html'
    }
});

app.directive('doctorview' , function(){
	return {
		restrict:'E',
		
		templateUrl:'modules/doctors/view/dr_profile.view.html'
	}
});
app.directive('locationview' , function(){
    return {
        restrict:'E',
        
        templateUrl:'modules/doctors/view/dr_map_location.view.html'
    }
});
app.directive('doctormenu' , function(){
    return {
        restrict:'E',
        
        templateUrl:'modules/doctors/view/doctormenu.html'
    }
});

app.directive('gallaryview' , function(){
    return {
        restrict:'E',
        
        templateUrl:'modules/doctors/view/dr_gallary.view.html'
    }
});

// app.directive('feedbackview' , function(){
//     return {
//         restrict:'E',
        
//         templateUrl:'modules/doctors/view/doctorFeedback.html'
//     }
// });

app.directive('accountview' , function(){
    return {
        restrict:'E',
        
        templateUrl:'modules/doctors/view/dr_account.view.html'
    }
   
});

app.directive('vieweditdoctor',function(){
	return {
		restrict:'E',
		templateUrl:'modules/doctors/view/vieweditdoctor.html'
	}
})

app.directive('suggestionBox', function() {
  return {
    restrict:'E',
    templateUrl:'modules/core/view/viewsuggestion.html'
  }
})

app.filter('capitalize', function() {
  return function(input, scope) {
    if (input!=null)
    input = input.toLowerCase();
 
    return input.substring(0,1).toUpperCase()+input.substring(1);
  }
});


app.directive('map', function () {
   return {
    restrict: 'A',
     scope: {
            lat: "=lat",
            log: "=log",
            address: "=address"
        },      
      link: function(scope, elem, attrs) {
        scope.$watch('lat', function() {
          console.log(scope.lat);
        elem.gmap3({
               map:{
                 options:{
                   center:[scope.lat,scope.log], //location where map has be shown
                   zoom: 15 //zoom level of map
                 }
               },
               marker:{
                 values:[
                   {
                     latLng:[scope.lat,scope.log]
                   }
                 ],
                 
                 options:{
                   draggable: false
                 }
                 ,
               }
             });}); 
           }
    
   };
});

app.directive('locationPickerInfo', function() {
    return {
       restrict: 'E',
      require: 'ngModel',
       template: '<input  type="text" ng-model="ngModel.completeaddres" class="required-filled formcontrolinfo"/>',
    scope: {
      id: '@',
      class: '@',
      placeholder: '@',
      ngModel: '='
    },
      link: function (scope, element, attrs, controller) {
        var input = element.find('input')[0];
      
        controller.$formatters.push(function (value) {
          return value ? value.name : value;
        });


      var autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode']
        });
   
            
        var componentForm = {
          locality: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name'
        };

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          var lat = place.geometry.location.lat();
          var lng = place.geometry.location.lng();
          var name = "";
          var state="";
          var city="";
          var country="";
        
          for (var i = 0; i < place.address_components.length; i++) {

            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
              if (name !== "") {
                name += ", ";
              }
              var val = place.address_components[i][componentForm[addressType]];
              name += val;
            }
            
          }
  
             var stateget=name.split(",");
          scope.$apply(function() {
            controller.$setViewValue({
              lat: lat,
              lng: lng,
              completeaddres:input.value,
              state:stateget[1],
              city:stateget[0],
              country:stateget[2]
            });
          });
        });
      }
    };
  })




app.directive('locality', function() {
    return {
       restrict: 'E',
      require: 'ngModel',
       template: '<input  type="text"  class="formcontrolinfo"/>',
    scope: {
      id: '@',
      class: '@',
      placeholder: '@',
      city : '@'
    },
      link: function (scope, element, attrs, controller) {
        var input = element.find('input')[0];
        if(attrs.city != "Select City")
          element.find('input').val(attrs.city);
        scope.$watch('city',function(argument) {
           // google.maps.event.trigger(autocomplete, 'place_changed');
            if(argument != "Select City"){
              element.find('input').val(argument);
              getPositionAddress(argument+',India',function(lat,lng) {
                 scope.$apply(function() {
                          controller.$setViewValue({
                            lat: lat,
                            lng: lng,
                            completeaddres:argument+',India',
                            state:argument,
                            city:argument,
                            country:'India'
                          });
                        });
              });
            }
            
            return false;
        });
        controller.$formatters.push(function (value) {
          return value ? value.name : value;
        });

        var options = {
   types: ['(locality)'],        // for locality only
   componentRestrictions: {country: 'In'} //India only
};


      var autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode']
        });
   
            
        var componentForm = {
          locality: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name'
        };

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          var lat = place.geometry.location.lat();
          var lng = place.geometry.location.lng();
          var name = "";
          var state="";
          var city="";
          var country="";
        
          for (var i = 0; i < place.address_components.length; i++) {

            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
              if (name !== "") {
                name += ", ";
              }
              var val = place.address_components[i][componentForm[addressType]];
              name += val;
            }
            
          }
  
             var stateget=name.split(",");
          scope.$apply(function() {
            controller.$setViewValue({
              lat: lat,
              lng: lng,
              completeaddres:input.value,
              state:stateget[1],
              city:stateget[0],
              country:stateget[2]
            });
          });
        });
      }
    };
  })



app.directive('allowPattern',['toaster', function(toaster) {
    var keyCodeChar="";
    return {
        restrict: "A",
        compile: function(tElement, tAttrs) {
            return function(scope, element, attrs) {
        // I handle key events
                element.bind("keypress", function(event) {
          //        debugger;
                    var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
                    var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.
                     
          // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                    if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                     console.log(attrs.allowPattern);
                     if(attrs.allowPattern == '[0-9]') {
                   
             toaster.removetoaster('error', "", "please fill the Number only");        
             scope.checknumber();
             
                      }
                     
                     if(attrs.allowPattern.match('[a-z \s]')) {
                       toaster.removetoaster('error', "", "please fill the Number only");
                          scope.checkchar();
                                  }      
                    }
                     else
                      {
                        toaster.removetoaster('error', "", ""); 
                      }

                });
                scope.checknumber =function() {
                  toaster.pop('error', "", "please fill the Number only");              
                }
                 scope.checkchar =function() {
                  toaster.pop('error', "", "please fill the char only");  
                }
            };

        }
    };
}]);

app.directive('capitalized', function() {
    return {
        restrict: "A",
         scope:{
            show:"=ngModel"
          },
        compile: function(tElement, tAttrs) {

         
            return function(scope, element, attrs) {
        // I handle key events
                element.bind("keyup", function(event) {
                    var value= $(this).val();
                    var data=value.charAt(0).toUpperCase() +
               value.substring(1);
               console.log(data);
               scope.show=data;

          // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                   
          
                });
            };
        }
    };
});

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
            
                $timeout(function () {
                
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
  });


// model 
app.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });





app.directive('scrolly', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];

            console.log('loading directive');
            
             angular.element($window).bind('scroll', function () {
              
                if (((raw.scrollTop + raw.offsetHeight)+1000) > raw.scrollHeight) {
                    console.log("I am at the bottom");
                    scope.$apply(attrs.scrolly);
                }
            });
        }
    };
});



app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

// directive for search box 




app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
         
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 10000);
                }
            });
    };
});


