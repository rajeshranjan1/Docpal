
app.directive('viewhospitaldata', function() {
	
    return {
    	 
         templateUrl: 'modules/hospital/view/viewhospitalprofile.html'

    }

});

app.directive('viewlabprofile',function(){
  return {
    templateUrl:'modules/labs/view/viewlabdetails.html'
  }
});

app.directive('locationPicker', function() {
    return {
       restrict: 'E',
      require: 'ngModel',
       template: '<input id="{{ id }}" type="text" class="form-control" placeholder="{{ placeholder }}" />',
      scope: {
        id: '@',
        class: '@',
        placeholder: '@',
      },
      link: function(scope, element, attrs, controller) {
        var input = element.find('input')[0];
      
        controller.$formatters.push(function (value) {
          return value ? value.name : value;
        });
        
       /* controller.$render = function () {
          input.value = controller.$modelValue.name;
        };
*/
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
          //$scope.user.country =place.address_components[2];
          console.log(place.address_components[2]);
          for (var i = 0; i < place.address_components.length; i++) {
            console.log( place.address_components);
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
              if (name !== "") {
                name += ", ";
              }

              var val = place.address_components[i][componentForm[addressType]];
              name += val;
            }
          }

          scope.$apply(function() {
            controller.$setViewValue({
              name: name,
              lat: lat,
              lng: lng,
              completeaddres:input.value,
              state:componentForm.administrative_area_level_1
            });
          });
        });
      }
    };
  })
