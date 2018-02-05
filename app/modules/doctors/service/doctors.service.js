
angular
  .module(ApplicationConfiguration.applicationModuleName).service("followDoctor",["localStorageService","$rootScope","$http",'setAccountData','$filter',function(localStorageService,$rootScope,$http,setAccountData,$filter) {

this.follow = function(infoAllData,data,doctorlist,id,index) {
      
  if(!($.isArray(doctorlist))) {
     var setarray = [];
     setarray.push(doctorlist);
     doctorlist = setarray;
  }
  
  var followData={}, list = {};

  if (data.follower == undefined) {
          
            var setfollow = {
              followId:id,
              type:infoAllData.type
            };

           // console.log(data);

              followData.follower=[];
              followData.follower.push(setfollow);
                localStorageService.set("userAccountdata", data);
                 setAccountData.addUserInfo(data);
            
              if (infoAllData.type == "doctor") {

                  $http.put(restApiUrl + "doctors/" + infoAllData.userId, followData)
                      .then(function(result) {
                       
                          localStorageService.remove("userAccountdata");
                           localStorageService.set("userAccountdata", result.data);
                              setAccountData.addUserInfo(result.data);
                                 
                              var setfollowing = {};
                              setfollowing.type="doctor";
                              setfollowing.followId=infoAllData.userId;
                      
                              //console.log(setfollowing);
                              
                              var data = {
                                  following: setfollowing

                              }
                              if (doctorlist[index].following == undefined) {

                                   doctorlist[index].following = [];
                                 
                                   list.following=[];
                                 list.following.push(setfollowing);
                                  
                   list.followingCount=list.following.length; 
           
           //console.log(list.followingCount);
                                  $http.put(restApiUrl + "doctors/" + id, list)
                                      .then(function(result) {

                                          },
                                          function(error) {
                                              console.log(error)
                                          })
                              } else {

                   list.following=[];
                list.following = doctorlist[index].following;           
                list.following.push(setfollowing);
                 
                list.followingCount = list.following.length;
                   //console.log(list.followingCount);
                                  $http.put(restApiUrl + "doctors/" + id, list)
                                      .then(function(result) {

                                          },
                                          function(error) {
                                              console.log(error)
                                          })
                              }

                          },
                          function(err) {

                          });
              } else {
                
                  $http.put(restApiUrl + "users/" + infoAllData.userId, followData)
                      .then(function(result) {

                              var setfollowing = {};
                              setfollowing.type="users";
                              setfollowing.followId=infoAllData.userId;
                           
                              
                              var data = {
                                  following: setfollowing
                              }
localStorageService.remove("userAccountdata");
                              localStorageService.set("userAccountdata", result.data);
             
                              if (doctorlist[index].following == undefined) {

                                 doctorlist[index].following=[];       
                  
                   list.following=[];
                                 list.following.push(setfollowing);

                   list.followingCount=list.following.length;
                                  console.log(list.followingCount);
                                  $http.put(restApiUrl + "doctors/" + id, list)
                                      .then(function(result) {

                                          },
                                          function(error) {
                                              console.log(error)
                                          });
                              } else {
                            
                            
                            list.following = [];
                                 list.following = doctorlist[index].following;
                list.following.push(setfollowing);
                list.followingCount = list.following.length;
    console.log(list.followingCount);
                                  $http.put(restApiUrl + "doctors/" + id, list)
                                      .then(function(result) {

                                          },
                                          function(error) {
                                              console.log(error)
                                          })
                              }

                          },
                          function(err) {

                          });
              }
             
          } else {
        
             var setfollow = {
              followId:id,
              type:infoAllData.type
                       };

              followData.follower=data.follower;
              followData.follower.push(setfollow);
              console.log(followData);

              data.follower.push(setfollow);
              
               localStorageService.set("userAccountdata", data);
                 setAccountData.addUserInfo(data);

              if (infoAllData.type == "doctor") {
                  $http.put(restApiUrl + "doctors/" + infoAllData.userId, followData)
                      .then(function(result) {
                         
                         localStorageService.remove("userAccountdata");
                              localStorageService.set("userAccountdata", result.data);

                              var setfollowing = {};
                              setfollowing.type="doctor";
                              setfollowing.followId=infoAllData.userId;
                            
                              console.log(setfollowing);
                              var data = {
                                  following: setfollowing
                              }
                
                           
                              
                              if (doctorlist[index].following == undefined) {
                                doctorlist[index].following =[];
                                  
                               list.following = [];
                              list.following.push(setfollowing);
               list.followingCount=list.following.length;
                         
                           
                                  $http.put(restApiUrl + "doctors/" + id, list)
                                      .then(function(result) {
                                           
                                          },
                                          function(error) {
                                              console.log(error)
                                          })
                              } else {
                                     
                                 list.following=[];
                                 list.following= doctorlist[index].following;
                                 list.following.push(setfollowing);
                                 list.followingCount=list.following.length;
                              console.log(list.followingCount);
                                  $http.put(restApiUrl + "doctors/" + id, list)
                                      .then(function(result) {
                                            
                                          },
                                          function(error) {
                                              console.log(error)
                                          })
                              }

                          },
                          function(err) {

                          });
              } else {
               
                  $http.put(restApiUrl + "users/" + infoAllData.userId, setfollow)
                      .then(function(result) {
localStorageService.remove("userAccountdata");
                              localStorageService.set("userAccountdata", result.data);

                             var setfollowing = {};
                              setfollowing.type="doctor";
                              setfollowing.followId=[];
                              setfollowing.followId.push(infoAllData.userId);
                            
                              var data = {
                                  following: setfollowing
                              }

                               
                              if (doctorlist[index].following == undefined) {
                            doctorlist[index].following = [];    
                              
                            doctorlist[index].following=setfollowing;
                             
                              list.following=[];
                              list.following=setfollowing;
                              list.followingCount = doctorlist[index].following.length; 

                                  $http.put(restApiUrl + "doctors/" + id, list)
                                      .then(function(result) {
                                           
                                          },
                                          function(error) {
                                              console.log(error)
                                          })
                              } else {
                                  
    
               list.following=[];
                  list.following= doctorlist[index];
                  list.followingCount = doctorlist[index].following.length;

                                  $http.put(restApiUrl + "doctors/" + id, list)
                                      .then(function(result) {
                                            
                                          },
                                          function(error) {
                                              console.log(error)
                                          })
                              }

                          },
                          function(err) {

                          });
              }
          }
        
      }


      // --------------------------  unfollow -->

      this.unfollow = function (infoAllData,data,doctorlist,id) {
            localStorageService.remove("userAccountdata");
                           localStorageService.set("userAccountdata", data);
                              setAccountData.addUserInfo(data);
     console.log(data.follower);
     console.log(doctorlist.following);
     return false;

     if(infoAllData.type=="doctor") {
           
          $http.put(restApiUrl + "doctors/" + infoAllData.userId, data.follower)
                 .then(function () {
                  console.log("success docor list");
        console.log(doctorlist.following);
          $http.put(restApiUrl + "doctors/" + id, doctorlist.following)
                                      .then(function(result) {
                            console.log("success docor list following");
                                          },
                                          function(error) {
                                              console.log(error)
                                          })
       },
                      function (error) {
                        
                      })
          }
          else {
                
                  $http.put(restApiUrl + "users/" + infoAllData.userId, followData)
                      .then(function(result) {

                         $http.put(restApiUrl + "doctors/" + id, doctorlist.following)
                                      .then(function(result) {

                                          },
                                          function(error) {
                                              console.log(error)
                                          })

                      },
                      function(error){

                      })
                } 

          
      }

      // this.checkfollow = function (id,users,data) {

      // if(!($.isEmptyObject(users))) {
      
                         
      //     if(!($.isEmptyObject(data.follower))) {

      //       var result = $filter('filter')(data.follower, {followId:id})[0];
  
      //                  if(result!= undefined) {
      //                   return true;
      //                  }
      //                        else {
                            
      //                         return false;
      //                        }
      //                                         }
      //                        else {
                              
      //                         return false;
      //                        }
         
        
      //                               }
      //                                   else {

      //                                     return true;
      //                                   }
      //                    }

       this.checkfollow = function (id,users,data) {
       
       var followIDs, i, j, res = [], key, value;
      //console.log(id, data);
          if(!($.isEmptyObject(users))) {
                                       
              if(!($.isEmptyObject(data.follower))) {

                       followIDs =  data.follower ;
                      
                  
                      value = followIDs.map(function(a) {return a.followId;});
                      // console.log(value);
                      // console.log(id);
                     if (value.indexOf(id) > -1) {
                       return true;
                     }
                     else {
                      //console.log("in else");
                      return false;
                     }
              }
              else {
                //console.log("2 false");
                return false;
              }
          }
          else {
            //console.log("3 true");
            return true;
          }
      }
      
    }]);
