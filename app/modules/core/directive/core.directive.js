function get(){
  alert("g");
}

app.directive('searchMenu', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'modules/core/view/menu.html'
    }
});

app.directive('clicker', function() {
	
    return {
        templateUrl: "modules/doctors/view/doctardetails.html"

    }


});
app.directive('hospital', function() {
    
    return {
        templateUrl: "modules/doctors/view/doctardetails.html"
    }
});

app.directive('usernotification', function(){
  return {
    templateUrl:"modules/user/view/usernotification.html"
  }
});

app.directive('gallery',function(){
  return {
    require: 'ngModel',
    templateUrl:'modules/core/view/gallery.html'
  }
});

app.directive('userheader',function(){
  return {
  
    templateUrl:'modules/user/view/userheader.html'
  }
});




app.directive('autoComplete',['$timeout',function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
}]);


app.directive('user',function(){
    return {
      restrict: 'EA',
        replace: true,
        templateUrl:'modules/user/view/userheader.html'
    }
   
});

app.directive('slideToggle', function() {  
  return {
    restrict: 'A',      
    scope:{
      isOpen: "=slideToggle"
    },  
    link: function(scope, element, attr) {
      var slideDuration = parseInt(attr.slideToggleDuration)
      
      scope.$watch('isOpen', function(newVal,oldVal){
        if(newVal !== oldVal){ 
          element.stop().slideToggle(slideDuration);
        }
      });
    }
  };  
});

app.filter('slice', function() {
  return function(arr, start) {
    return (arr || []).slice(start);
  };
});

app.directive("slider", function() {
    return {
        restrict: 'A',
        scope: {
            config: "=config",
            price: "=model"
        },
        link: function(scope, elem, attrs) {
            var setModel = function(value) {
                scope.model = value;   
            }
            
            $(elem).slider({
                range: true,
                min: scope.config.min,
                max: scope.config.max,
                step: scope.config.step,
                values: scope.config.values,
                slide: function(event, ui) { 
                    scope.$apply(function() {
                        scope.price.start = ui.values[0];
                        scope.price.end = ui.values[1];
                    });
                }
            });
        }
    }
});

/********************************
usage 
<search-address placeholder="input" show="loc+city" callback="fireBug(lat,lng,loc,city,state,country,address)" id = "unique" class="formcontrolinfo" ">
where FireBug is a controller function
show : to show in search box after click in adreess
/********************************/

app.directive('searchAddress', function() {
    return {
       restrict: 'E',
       require: 'ngModel',
       template: '<input  type="text" placeholder="{{placeholder}}" id="{{id}}" class="{{class}}"/>',
      scope: {
        id: '@',
        class: '@',
        placeholder: '@',
        onChangeCallback:"&callback"
      },
      link: function (scope, element, attrs, controller) {
        var input = element.find('input')[0];
      
        var options = {
         types: ['geocode'],        // for locality only
         componentRestrictions: {country: 'In'} //India only
        };
//types: ['geocode']

        var autocomplete = new google.maps.places.Autocomplete(input, options);
            
        var componentForm = {
          locality: 'long_name',
          administrative_area_level_1: 'long_name',
          country: 'long_name',
          sublocality_level_1:'long_name'
        };


        // adding listionor on selection change
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          var address = place.formatted_address;
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
              state=stateget[2].trim();
              city=stateget[1].trim();
              loc=stateget[0].trim();
              country = stateget[3].trim();
              var callbackArgs = {
                lat:lat,
                lng:lng,
                loc:loc,
                city:city,
                state:state,
                country:country,
                address:address
              }

              //show
              var toShow = attrs.show;
              var input = "";
              toShow = toShow.split("+");
              for (var i = 0; i < toShow.length ; i++) {
                 console.log("\npart:"+toShow[i]+" , value: "+eval(toShow[i]));
                 input+=eval(toShow[i])+" ,"
              };
              element.find("input")[0].value = input.slice(0,-1);
              scope.onChangeCallback(callbackArgs);

        });

      }
    };
  });

/*******************************************
$scope.markerList = [
                {lat: 52.511, lng: 13.447},
                {lat: 52.549, lng: 13.422},
                {lat: 52.497, lng: 13.396},
                {lat: 52.517, lng: 13.394}
              ];
  <map-view markerList="{{markerList}}"></map-view>

******************************************/

app.directive("mapView", function() {
    return {
        restrict: 'E',
        scope: {
  
        },
        link: function(scope, elem, attrs) {

          var markerList = JSON.parse(attrs.markerlist);
          initMyMap(elem.get(0),markerList);
          
      }
    }
});

app.directive("modal", function() {
    return {
        restrict: 'AE',
        scope: {
            config: "=config",
            price: "=model"
        },
        templateUrl: 'modules/core/view/modal.html',
        link: function(scope, elem, attrs) {
            var setModel = function(value) {
                scope.model = value;   
            }
            
            $(elem).slider({
                range: true,
                min: scope.config.min,
                max: scope.config.max,
                step: scope.config.step,
                values: scope.config.values,
                slide: function(event, ui) { 
                    scope.$apply(function() {
                        scope.price.start = ui.values[0];
                        scope.price.end = ui.values[1];
                    });
                }
            });
        }
    }
});
