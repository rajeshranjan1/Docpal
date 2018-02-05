angular
  .module(ApplicationConfiguration.applicationModuleName).service('problemservices',['$http','$rootScope',function($http,$rootScope){
    var setdata="";
    this.sethelpfulData = function (setlogin,notify,helpId,commentId,comment,ownerId,forumhelp){

     if ($.isEmptyObject(forumhelp)) {

              var userData = {
                  userId: setlogin.userId
              };
              var setdata = [];
              setdata.push(helpId);
              forumhelp.AnswerID=setdata;
              userData.AnswerID = setdata;
              userData.notify = notify;
              
              $http.post(restApiUrl + "forum/forumLike", userData).then(function(success) {
                    scope.forumhelp.AnswerID.push(helpId);
                      console.log(success);

                  },
                  function(error) {

                  });
                 return forumhelp;

          } else {

              var userData = {
                  userId: setlogin.userId
              };
              var setdata = [];

              if (forumhelp.AnswerID != undefined) {
                  setdata = forumhelp.AnswerID;
                  forumhelp.AnswerID.push(helpId);
              }
              setdata.push(helpId);
              forumhelp.AnswerID=setdata;
              userData.AnswerID = setdata;
              userData.notify = notify;
              console.log(userData);
              $http.put(restApiUrl + "forum/forumLike/" + setlogin.userId, userData).then(function(success) {
                      console.log(success);
                      console.log("success");
                  },
                  function(error) {

                  });
              return forumhelp;
          }
    };
    this.checkloginreport = function (users,forumdata,id) { 
           
           if(!($.isEmptyObject(users)) && !($.isEmptyObject(forumdata))) {             
      if (($.isEmptyObject(users)) && (forumdata.reportId != undefined))
              return true;
          else {
              if ($.inArray(id, forumdata.reportId) !== -1)
                  return true;
              else
                  return false;

             }
        }
                      else {
                        return true;
                      }

    };
    this.checkhelp = function (users,forumhelp,id) {
       
                 if(!($.isEmptyObject(users)) && !($.isEmptyObject(forumhelp))) {
          if (($.isEmptyObject(users)) && (forumhelp.AnswerID != undefined))
              return true;
          else {
              if ($.inArray(id, forumhelp.AnswerID) !== -1)
                  return true;
              else
                  return false;
              }
                       }
      

    };

    this.report = function (notify,forumdata,setdata,id, ownerId, question) {


  if (!($.isEmptyObject(forumdata))) {
     console.log(forumdata.reportId);
              var report = {
                  userId: setdata.userId
              };
              var setID = [];
              if (forumdata.reportId != undefined) {
                  setID = forumdata.reportId;
              }
              setID.push(id);
              $scope.forumhelp.reportAnswer=setID;
              forumdata.reportId=setID;
              report.reportId = setID;
              report.notify = notify;
              console.log(forumdata.reportId);
              return false;
           $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, report).then(function(success) {
                      console.log(success);
                   
                  },
                  function(error) {

                  });

              return forumdata;

          } else {
           
              var report = {
                  userId: setdata.userId
              };
              var setID = [];
              setID.push(id);
              
              report.reportId = setID;
              
              report.notify = notify;            
              forumdata.reportId = report;
              $http.post(restApiUrl + "forum/forumLike", report).then(function(success) {
                      console.log(success);
                     
                  },
                  function(error) {

                  });

              return forumdata;
            }  

        }

        this.checkDoctorRelevent = function (users,forumdata,id) {
          if(!($.isEmptyObject(users)) && !($.isEmptyObject(forumdata))) {
           if (($.isEmptyObject(users)) && (forumdata.formLike != undefined))
              return true;
          else {
              if (users.type == 'doctor') {

                      if ($.inArray(id, forumdata.formLike) !== -1)
                        return true;
                          else
                            return false;
              } else
                  return true;
               }
      }
      else
      {
        return true;
      }
  }

        this.checkloginfollow = function (users,forumdata,id) {
           if (($.isEmptyObject(users)) && (forumdata.followId != undefined))
                  return true;
              else {
                  if ($.inArray(id, forumdata.followId) !== -1)
                      return true;
                  else
                      return false;
              }

        }


        this.reportAnswer = function (id, ownerId, question) {

          var notify = {           
              "repliedby": {
                  "name": $scope.infoAllData.name,
                  "readstatus": 0,
                  "role": $scope.infoAllData.type,
                  "userId": $scope.infoAllData.userId
              },
              "action": "reportAnswer",
              "ownerId": ownerId,
              "forumId": id,
              "question": question,
              "createdDate": new Date()
          }
  
          var setdata = Authentication.getUserInfo();
      console.log($scope.forumhelp.reportAnswer);
           if (!($.isEmptyObject($scope.forumhelp))) {
              var report = {
                  userId: setdata.userId
              };
              var setID = [];
              if ($scope.forumhelp.reportAnswer != undefined) {
                  setID = $scope.forumhelp.reportAnswer;
              }
              setID.push(id);
              $scope.forumhelp.reportAnswer=setID;
              report.reportAnswer = setID;
              report.notify = notify;
               
           $http.put(restApiUrl + "forum/forumLike/" + setdata.userId, report).then(function(success) {
                      console.log(success);             
                  },
                  function(error) {

                  });

          } else {
           
              var report = {
                  userId: setdata.userId
              };
              var setID = [];
              setID.push(id);
              report.reportAnswer = setID;
              report.notify = notify;      
              $scope.forumhelp.reportAnswer = setID;
             
           console.log(report);
              $http.post(restApiUrl + "forum/forumLike", report).then(function(success) {
                      console.log(success);
                     
                  },
                  function(error) {

                  });            
            }  
         
         }
}]);