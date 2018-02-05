angular
  .module(ApplicationConfiguration.applicationModuleName).service("Authentication",["localStorageService","$rootScope",function(localStorageService,$rootScope){
     var userdata =   localStorageService.get("userInfo") || {};
	 var userdatareg;
	 this.getUserInfo = function(){   
	    	userdata =   localStorageService.get("userInfo") || {};
	    	return userdata;
          
	};
	this.addUserInfo = function(userInfo){
		this.isValidUser = true;
	  	userdata = userInfo;	
		  localStorageService.set("userInfo",userdata);
   	
	};
	this.removeUserInfo = function(){
		this.isValidUser = false;
		userdata="";
	};

	this.setregistorInfo = function(userInfo){
		this.isValidUser = true;
		
		userdatareg=userInfo;
	};
	this.getregistorInfo = function(userInfo){
	
		return userdatareg;
	};
	this.isValidUser = false;

  }]);

  angular
  .module(ApplicationConfiguration.applicationModuleName).service("setAccountData",["localStorageService","$rootScope",function(  localStorageService,$rootScope){
     var userdata =   localStorageService.get("userAccountdata") || {};
	 var userdatareg;
	 this.getUserInfo = function(){   
	    	userdata =   localStorageService.get("userAccountdata") || {};
	    	return userdata;
          
	};
	this.addUserInfo = function(userInfo){
		this.isValidUser = true;
	  	userdata = userInfo;	
		  localStorageService.set("userAccountdata",userdata);
   	
	};
	this.removeUserInfo = function(){
		this.isValidUser = false;
		userdata="";
	};

	
	this.isValidUser = false;

  }]);


  
  angular
  .module(ApplicationConfiguration.applicationModuleName).service("follow",["localStorageService","$rootScope",function(  localStorageService,$rootScope){
   
	 var userdatareg;
	 this.getUserInfo = function(){   
	    
	    	return userdata;
          
	};
	this.addUserInfo = function(userInfo){
		this.isValidUser = true;
	  	userdata = userInfo;	
		
   	
	};
	this.removeUserInfo = function(){
		this.isValidUser = false;
		userdata="";
	};

	
	this.isValidUser = false;

  }]);

angular.module(ApplicationConfiguration.applicationModuleName).service("setfilterService",["localStorageService","$rootScope",function(  localStorageService,$rootScope){

var filterset;
var type = "doctor";
this.getfilterdata = function(){
	return [filterset,type];
}
this.setfilterdata = function(filter,tp){
	this.isValidUser = true;
	filterset = filter;
	type = tp;
}
this.isValidUser = false;
}]);

// --------------------------------- validation
angular.module(ApplicationConfiguration.applicationModuleName).service("validation",["localStorageService","$rootScope",'toaster',function(  localStorageService,$rootScope,toaster){

var filterset;
this.getfilterdata = function(){
	return filterset;
}
this.setVaidateData = function(data){
	console.log(data.experience);
  if(data.experience==""){
  	  toaster.pop('error', "", "please fill the Number only");
  }
}
this.isValidUser = false;
}]);
  
/*Send MAil*/
angular.module(ApplicationConfiguration.applicationModuleName).service("sendMail",["$http",function($http){

this.send = function(mailData){
	$http.post(restApiUrl + "core/sendMail", mailData).then(function(result) {
		console.log('Mail Resp', result);
    },
    function(err) {
    });
}
}]);