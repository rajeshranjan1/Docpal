

 




 function getPositionAddress(address, callback) {
     var geocoder = new google.maps.Geocoder();
     geocoder.geocode({ 'address': address }, function(results, status) {
         if (status == google.maps.GeocoderStatus.OK) {
             // do something with the geocoded result
             //
             // results[0].geometry.location.latitude
             // results[0].geometry.location.longitude
             //console.log("location is ",results[0].geometry.location);
             callback(results[0].geometry.location.lat(), results[0].geometry.location.lng());

         } else {
             var loc = { latitude: 28.6139391, longitude: 77.20902120000005 };
             callback(28.6139391, 77.20902120000005);
         }
     });
 }


 function getAddress(latitude, longitude) {
     // body...
     var geocoder = new google.maps.Geocoder();

     var latLng = new google.maps.LatLng(latitude, longitude);
     geocoder.geocode({
             latLng: latLng
         },
         function(place) {
             if (place && place.length > 0) {
                 var componentForm = {
                     locality: 'long_name',
                     sublocality_level_1: 'long_name'
                 };
                 var name = "";
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
                 return name;
             } else {
                 return 'Could not found Locality';
             }
         }
     );
 }

 function initMyMap(elem, markerList, zoom, draggable, callback) {

     var markers = [];
     var map = null;

     if (zoom != undefined) {
         initMap(elem, zoom, markerList[0]);
         addMarkerWithTimeout(markerList[0], 200, true, callback);
     } else {
         initMap(elem, 13, markerList[0]);
         drop();
     }


     function initMap(elm, zoom, center) {
         map = new google.maps.Map(elm, {
             zoom: zoom,
             center: center
         });

     };



     function drop() {
         clearMarkers();
         var bounds = new google.maps.LatLngBounds();
         for (var i = 0; i < markerList.length; i++) {
             addMarkerWithTimeout(markerList[i], i * 200);
             bounds.extend(markers[i].getPosition());
         }

         map.fitBounds(bounds);
     }

     //Add mrkers with delay
     function addMarkerWithTimeout(position, timeout, draggable, callback) {
         var dragg = false;
         var animation = google.maps.Animation.BOUNCE;
         if (draggable == true) {
             dragg = true;
             animation = google.maps.Animation.DROP;
         }
         var mark = new google.maps.Marker({
             position: position,
             map: map,
             draggable: dragg,
             animation: animation
         });
         if (callback == undefined) {
             callback = function() {};
         }
         mark.addListener('dragend', function(event) {
             callback(event.latLng);
             $('#draggLocationLat').data('latLng', event.latLng);

         });
         markers.push(mark);

     }

     //clear all the markers
     function clearMarkers() {
         for (var i = 0; i < markers.length; i++) {
             markers[i].setMap(null);
         }
         markers = [];
     }
 };


 //Hide Popups of Filters when clicked anywhere
 $(document).click(function(e) {



     if ($(e.target).closest(".menu-hide").length == 0 || $(e.target).closest(".menu-tab").length == 0) {
         var activeSidebar = $(".menu-tab");

         if (activeSidebar.hasClass("active")) {
             activeSidebar.click();
         } else {

         }

     }

     if ($(e.target).closest(".pop-up-custom").length > 0) {
         return false;
     } else {

         if ($(e.target).closest(".pop-up-custom-div").length > 0) {

         } else {
             $(".pop-up-custom-div").hide();
         }
     }
 });

 $(function() {




     var ink, d, x, y;
     $(document).on("click", ".btn,a[role='button'],li[role='presentation']", function(e) {

         $(this).css("overflow", "hidden");
         if ($(this).css("position") == 'static') {
             $(this).css("position", "relative");

         }

         if ($(this).find(".ink").length === 0) {

             $(this).prepend("<span class='ink'></span>");
         }


         ink = $(this).find(".ink");
         ink.removeClass("animate");

         if (!ink.height() && !ink.width()) {
             d = Math.max($(this).outerWidth(), $(this).outerHeight());
             ink.css({ height: d, width: d });
         }

         x = e.pageX - $(this).offset().left - ink.width() / 2;
         y = e.pageY - $(this).offset().top - ink.height() / 2;

         ink.css({ top: y + 'px', left: x + 'px' }).addClass("animate");
     });
 });
 // doctor profile plus button
 $(document).on('click', '.fonix', function() {
     $(this).parent().hide();
 });
 $(document).on('click', '.openmodal', function() {
     $("#alertmodal").modal('show');
 });

 $(document).on('click', '.follow-btn', function() {
     $("#followmodal").modal('show');
 });

 $(document).on('click', '.following-btn', function() {
     $("#followingmodal").modal('show');

 });

 $(document).on('click', '.plus-btn', function() {

     var getid = $(this).parent("div").next().attr("id");
     $('#' + getid).find('.remove-span').show();
     $('#' + getid).find('.edit-span').show();
     $(this).next().closest("span").toggle();
     $(this).next().next("div").toggle();
     $(this).toggleClass("rotate-up");

 });

 // save doctor button on doctor profile


 $(document).on('click', '#save', function() {
     var isFormValid = true;

     $(".required-filled").each(function() {
         if ($.trim($(this).val()).length == 0) {
             $(this).addClass("highlight");
             isFormValid = false;
         } else {
             $(this).removeClass("highlight");
         }
     });

     if (!isFormValid) {
         alert("Please fill in all the required fields (indicated by *)");
         return isFormValid;
     }
     $(this).hide();
     $(".wrap").show();
     $(".editable-class-new").hide();
     $('.required-elem-class').hide();
     $(".tooltip-class").hide();
     $('.editable-class').attr("readonly", true);
     $(".remove-span").css('display', 'none');
     $(".edit-span").css('display', 'none');
     $(".undo-span").css('display', 'none');
     $('.inner-section2').removeClass('your-class');
     $("#saveedit").click();
     $("#edit").show();
     $('.remove-span').prev().removeClass('your-class');
     $('.icon-cross72')
     $('.add1-span').hide();
     $('.dropdown-time-div').hide();
     $(".dr-profile-image").css("opacity", '1');
     $(".upicon").hide();
     $(".toggle-btn").hide();
     $(".addchangediv").hide();
     $(".dropdown-time-div-4").toggle();
     $(".wrap").removeClass('your-class');
     $(".plus-btn").hide();
     $(".input").hide();
     return false;

 });


 $(document).on('click', '#savebtn', function() {
     $("#editbtn").show();
     $("#savebtn").hide();
 });
 $(document).on('click', '#editbtn', function() {
     $("#savebtn").show();
     $("#editbtn").hide();
 });
 $(document).on('click', '#editbtn', function() {
     $(".wrap").hide();
     $(".editable-class-newtab").show();
     $(".drpdown").show();
 });
 $(document).on('click', '#savebtn', function() {
     $(".wrap").show();
     $(".editable-class-newtab").hide();
     $(".drpdown").hide();
 });

 $(document).on('click', '.item > img', function() {
     $("#myModal321").modal('show');
     $("#image-gallery").modal('show');
     $("#hospital_modal").modal('show');
     $("#lab_modal").modal('show');

 });

 $(document).on('click', '.removeBtn', function() {
     var image = $(this).next('.custom_thumbnail').find('#IMG2').attr('name');
     console.log(image);
     $("#imgName").val(image);
     //confirm
     $("#image-remove").modal('show');
     $("#image-remove").find(".confirm").attr("data-image", image);
 });

 $(document).on('click', '.editImage', function() {

     $("#image-upload").modal('show');
 });


 $(document).on('click', '#gllryImg', function() {

     $("#upload-gallery").modal('show');
 });

 $(document).on('click', '#gallryUpload', function() {
     $("#gallery-img").modal('show');
 });


 $(document).on('click', '#removeAddressBtn', function() {

     var image = $(this).attr('data');
     var index = $(this).attr('data-index');
     var event = $(this).attr('data-event');
     console.log(image, index, event);
     $("#addressIndex").val(index);
     $("#addressId").val(image);

     //confirm
     $("#address-remove").modal('show');
     $("#address-remove").find(".confirm").attr("data-image", image);
 });


 window.fbAsyncInit = function() {
     FB.init({
         appId: '1730855643877876',
         cookie: true,
         xfbml: true,
         version: 'v2.1'
     });

     FB.getLoginStatus(function(response) {

     });

 };

 (function(d, s, id) {
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) return;
         js = d.createElement(s);
         js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
     }
     (document, 'script', 'facebook-jssdk'));

 //User FB login
 function fbloginUser() {
     FB.login(function(response) {
         console.log("___***___", response);
         if (response.authResponse) {
             FB.api('/me', {
                 fields: 'email,last_name,first_name,name,gender'
             }, function(response) {
                 console.log("-->>>", response);
                 console.log(response.email);
                 var fbData = {
                     "fbId": response.id,
                     "name": response.name,
                     "email": response.email,
                     "type": "user",
                     "social_image": "http://graph.facebook.com/" + response.id + "/picture?type=square"
                 };
                 angular.element('.loginCtrl').scope().getAuthUser(fbData);
             });
         } else {
             console.log('User cancelled login or did not fully authorize.');
         }
     }, {
         scope: 'email'
     });
 }
 //Doctor FB
 function fblogin() {
     FB.login(function(response) {
         console.log("___***___", response);
         if (response.authResponse) {
             FB.api('/me', {
                 fields: 'email,last_name,first_name,name,gender'
             }, function(response) {
                 console.log("-->>>", response);
                 console.log(response.email);
                 var fbData = {
                     "fbId": response.id,
                     "name": response.name,
                     "email": response.email,
                     "type": "doctor",
                     "social_image": "http://graph.facebook.com/" + response.id + "/picture?type=square"
                 };
                 angular.element('.loginCtrl').scope().getAuth(fbData);
             });
         } else {
             console.log('User cancelled login or did not fully authorize.');
         }
     }, {
         scope: 'email'
     });
 }

 // clent-secret qb5EyyboEj-ffpb04yXgU3jC
 var googleUser = {};
 try {
     var startApp = function() {
         gapi.load('auth2', function() {
             // Retrieve the singleton for the GoogleAuth library and set up the client.
             if (gapi.auth2.getAuthInstance() != undefined) {
                 try {
                     auth2 = gapi.auth2.getAuthInstance();
                 } catch (e) {
                     // statements
                     console.log(e);
                 }
             } else {
                 try {
                     auth2 = gapi.auth2.init({
                         client_id: '238371248055-oa7fm18ao69n7jnjl6rubld2p4nf4167.apps.googleusercontent.com',
                         cookiepolicy: 'single_host_origin',
                         // Request scopes in addition to 'profile' and 'email'
                         scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.me"
                     });
                 } catch (e) {
                     // statements
                     console.log(e);
                 }
             }

             attachSignin(document.getElementById('googleLoginBtn'));
             attachSignin(document.getElementById('googleLoginBtn2'));
         });
     };
 } catch (e) {
     // statements
     console.log(e);
 }


 function attachSignin(element) {

     auth2.attachClickHandler(element, {},
         function(googleUser) {
             //setUserDetailsForGoogle(googleUser);
             var type = "";
             var loc = window.location.href;
             if (loc.toLowerCase().indexOf("user") >= 0) {
                 type = "user";
             } else if (loc.toLowerCase().indexOf("doctor") >= 0) {
                 type = "doctor";
             }
             console.log(googleUser);
             var email = googleUser.getBasicProfile().getEmail();
             var socialId = googleUser.getBasicProfile().getId();
             var name = googleUser.getBasicProfile().getName();

             var googleData = {
                 "googleId": googleUser.getBasicProfile().getId(),
                 "name": googleUser.getBasicProfile().getName(),
                 "email": googleUser.getBasicProfile().getEmail(),
                 "type": type,
                 "social_image": googleUser.getBasicProfile().getImageUrl()
             };

             console.log(email, socialId, name, type);

             if (type == "doctor") {
                 angular.element('.loginCtrl').scope().getAuth(googleData);
             } else if (type == "user") {
                 angular.element('.loginCtrl').scope().getAuthUser(googleData);
             }
         },
         function(error) {
             //alert(JSON.stringify(error, undefined, 2));
         });
 }


 