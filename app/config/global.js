// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'trDocpal';

    //new module entry
    var applicationModuleVendorDependencies = [
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar',
        'LocalStorageModule',
        'ngFileUpload',
        '720kb.socialshare',
        'toaster',
        'ngImgCrop',
        'ngSanitize'
    ];
    // Add a new vertical module for future use
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();


var modules = {
    DOCTOR: "doctor",
    HOME: "home",
    CORE: "core",
    Problem: "problem"
};


/*var imageServer="http://docpal.in:8050/img";
 var restApiUrl="http://docpal.in:8050/docpal/v1/";*/
// var imageServer = "http://192.168.1.33/docpal//docpal/FrontendDocpal/app/assets";
// For Vishesh Laptop
// var imageServer = "http://ec2-18-195-12-108.eu-central-1.compute.amazonaws.com/Backend-Docpal/upload/img/";
// var restApiUrl = "http://192.168.1.33:8050/docpal/v1/";
// var siteUrlDocpal = "http://192.168.1.33:8050/FrontendDocpal/app/#/";

//Backup
// var imageServer = "http://ec2-18-195-12-108.eu-central-1.compute.amazonaws.com/Backend-Docpal/upload/img/";
// var restApiUrl = "http://ec2-18-195-12-108.eu-central-1.compute.amazonaws.com:8050/docpal/v1/";
// var siteUrlDocpal = "http://ec2-18-195-12-108.eu-central-1.compute.amazonaws.com/FrontendDocpal/app/#/";

var imageServer = "http://ec2-18-195-12-108.eu-central-1.compute.amazonaws.com/Backend-Docpal/upload/img/";
var restApiUrl = "http://ec2-18-195-12-108.eu-central-1.compute.amazonaws.com:8050/docpal/v1/";
var siteUrlDocpal = "http://ec2-18-195-12-108.eu-central-1.compute.amazonaws.com/FrontendDocpal/app/#/";


/*var imageServer="http://54.213.206.102:8050/img";
 var restApiUrl="http://54.213.206.102:8050/docpal/v1/";*/
/*var imageServer="http://docpal.in:8050/img";*/
/*var restApiUrl="http://docpal.in:8050/docpal/v1/";*/


var routes = {
    doctor: {
        getDoctorList: "getSepcialist_get",
        getAnyDetail: "user_post",
        showdetails: "get",
        editdoctor: "doctor_put/id_put"
    },
    core: {
        registerDoctor: "doctors/accounts_post",
        login: "doctors/login/isValid_post",
        userLogin: "users/login/isValid_post",
        doctors: "doctors_get",
        doctorscity: "doctors/location_get",
        doctordetails: "doctors_get",
        checkEmail: "doctors/search/doctor_post",
        checkMobile: "doctors/search/doctor_post",
        Users: "users_get",
    },
    problem: {
        problemlist: "forum_get",
        askProblem: "forum_post",
    },
    user: {
        registerUser: "users/accounts_post",
        users: "user_get"
    },
    hospital: {
    	registerHospital: "hospitals/accounts_post",
    	findClinic:"hospitals/clinic/find_post"
    }

};
var labTest = [
    {"catName": "Thyroid Profile", "catIcon": "icon-Thyroid-profile"},
    {"catName": "Lipid profile", "catIcon": "icon-Lipid-profile"},
    {"catName": "CBC", "catIcon": "icon-Complete-blood-count"},
    {"catName": "X-Ray", "catIcon": "icon-X-ray"},
    {"catName": "Blood Urea", "catIcon": "icon-blood-urea"},
    {"catName": "CRP", "catIcon": "icon-X-ray"},
    {"catName": "Cardiac Check up", "catIcon": "icon-cardiac-check"},
    {"catName": "Pregnancy Test", "catIcon": "icon-pregnancy"},
    {"catName": "CT scan", "catIcon": "icon-X-ray"},
    {"catName": "MRI scan", "catIcon": "icon-mri-scan"},
    {"catName": "HIV 1 & 2", "catIcon": "icon-ribbon"},
    {"catName": "Cardiac test", "catIcon": "icon-Cardiologist"}
];


var docCat = [
    {"catName": "Opthalmologist/Eye Surgeon", "catIcon": "icon-Ophthalmologist"},
    {"catName": "Dentist", "catIcon": "icon-Dentist"},
    {"catName": "Urologist", "catIcon": "icon-Urologist"},
    {"catName": "Neurologist", "catIcon": "icon-Neurologist"},
    {"catName": "Gynecologist/obstetrician", "catIcon": "icon-GynecologistObstetrician"},
    {"catName": "Ear-nose-throat (ent) Specialist", "catIcon": "icon-Ear-nose-throatentSpecialist"},
    {"catName": "Psychiatrist", "catIcon": "icon-Psychiatrist"},
    {"catName": "Gastroenterologist", "catIcon": "icon-Gastroenterologist"},
    {"catName": "Cardiologist", "catIcon": "icon-Cardiologist"},
    {"catName": "Homeopath", "catIcon": "icon-Homeopath"},
    {"catName": "Ayurveda", "catIcon": "icon-Gastroenterologist"},
    {"catName": "Dermatologist/cosmetologist", "catIcon": "icon-Dermatologist"},
    {"catName": "General", "catIcon": "icon-General"},
    {"catName": "Orthopedist/Orthopedic Surgeon", "catIcon": "icon-General"},
    {"catName": "Allergist/Immunologist", "catIcon": "icon-General"},
    {"catName": "Dietitian/Nutritionists", "catIcon": "icon-General"},
    {"catName": "Endocrinologist/Including Diabetic specialist", "catIcon": "icon-General"},
    {"catName": "Oncologist/Blood Specialist", "catIcon": "icon-General"},
    {"catName": "Pulmonologist/Lung Doctor", "catIcon": "icon-General"},
    {"catName": "Podiatrist/Foot and Ankle specialist", "catIcon": "icon-General"},
    {"catName": "Physiatrist/Physical Medicine", "catIcon": "icon-General"},
    {"catName": "Orthopedist/Orthopedic Surgeon", "catIcon": "icon-General"},
    {"catName": "Neurologist/Incl Headache specialist", "catIcon": "icon-General"},
    {"catName": "Nephrologist/Kidney Doctor", "catIcon": "icon-General"},
    {"catName": "Pediatrician/Child Specialist", "catIcon": "icon-General"},
    {"catName": "Physiotherapist", "catIcon": "icon-General"}
];


var doctorCategory = docCat.map(function (a) {
    return a.catName;
});
var labName = labTest.map(function (a) {
    return a.catName;
});



var timeZone = [{
        "value": "Afghanistan Standard Time",
        "abbr": "AST",
        "offset": 4.5,
        "isdst": false,
        "text": "(UTC+04:30) Kabul"
    }, {
        "value": "West Asia Standard Time",
        "abbr": "WAST",
        "offset": 5,
        "isdst": false,
        "text": "(UTC+05:00) Ashgabat, Tashkent"
    }, {
        "value": "Pakistan Standard Time",
        "abbr": "PST",
        "offset": 5,
        "isdst": false,
        "text": "(UTC+05:00) Islamabad, Karachi"
    }, {
        "value": "India Standard Time",
        "abbr": "IST",
        "offset": 5.5,
        "isdst": false,
        "text": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi"
    }, ];
// All the states config goes here
var ConfigState = {
    "core": {
        "css": [],
        "js": []
    },
    "state": {
        "doctors": {
            "name": "doctors",
            "url": "/doctors",
            "controllerName": "",
            "templateUrl": "modules/doctors/view/drprofile.html"
        },
        "home": {
            "name": "home",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctors-in-your-city-custom",
            "controllerName": "HomeCtrl",
            "templateUrl": "modules/home/view/home.view.html"
        },
        "doctorInfo": {
            "name": "doctorInfo",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorInfo",
            "controllerName": "DoctorInfoCtrl",
            "templateUrl": "modules/doctors/view/info.html"
        },
        "Mapview": {
            "name": "Mapview",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/Mapview",
            "controllerName": "DoctorInfoCtrl",
            "templateUrl": "modules/doctors/view/Mapview.html"
        },
        "doctorprofileproblem": {
            "name": "doctorprofileproblem",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorprofileproblem",
            "controllerName": "doctorProfileCtrl",
            "templateUrl": "modules/doctors/view/doctorprofileproblem.html"
        },
        "doctorquestionproblem": {
            "name": "doctorquestionproblem",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorquestionproblem",
            "controllerName": "doctorProfileCtrl",
            "templateUrl": "modules/doctors/view/doctorquestionproblem.html"
        },
        "doctorprofile": {
            "name": "doctorprofile",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorprofile",
            "controllerName": "",
            "templateUrl": "modules/doctors/view/doctorprofile.html"
        },
        "homepage": {
            "name": "homepage",
            "css": [],
            "js": [],
            "url": "/",
            "controllerName": "HomesCtrl",
            "templateUrl": "modules/core/view/newHome.html"
        },
        "doctorprofilegallery": {
            "name": "doctorprofilegallery",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorprofilegallery",
            "controllerName": "DoctorInfoCtrl",
            "templateUrl": "modules/doctors/view/doctorprofilegallery.html"
        },
        "doctorprofileAccount": {
            "name": "doctorprofileAccount",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorprofileAccount",
            "controllerName": "DoctorInfoCtrl",
            "templateUrl": "modules/doctors/view/doctorprofileAccount.html"
        },
         "doctorFeedback": {
            "name": "doctorFeedback",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorFeedback",
            "controllerName": "DoctorInfoCtrl",
            "templateUrl": "modules/doctors/view/doctorFeedback.html"
        },
          "doctorAppointment": {
            "name": "doctorAppointment",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorAppointment",
            "controllerName": "DoctorInfoCtrl",
            "templateUrl": "modules/doctors/view/doctorAppointment.html"
        },
        "doctorprofileMap": {
            "name": "doctorprofileMap",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/doctorprofileMap",
            "controllerName": "DoctorInfoCtrl",
            "templateUrl": "modules/doctors/view/doctorprofileMap.html"
        },
        "problemInfo": {
            "name": "problemInfo",
            "css": [],
            "js": ['modules/controllers/problemController.js'],
            "url": "/problemList",
            "controllerName": "DoctorInfoCtrl",
            "templateUrl": "modules/problem/view/problemlist.html"
        },
        "singledoctorInfo": {
            "name": "singledoctorInfo",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/singledoctorInfo/:id?val",
            "controllerName": "singledoctorCtrl",
            "templateUrl": "modules/doctors/view/viewprofile.html"
        },
        "loginInfo": {
            "name": "loginInfo",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/loginDoctor",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/doctorLogin.html"
        },
        "userLogin": {
            "name": "userLogin",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/userLogin",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/userLogin.html"
        },
        "forgotpassword": {
            "name": "forgotpassword",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/forgotpassword",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/forgotpassword.html"
        },
        "confirmpassword": {
            "name": "confirmpassword",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/confirmpassword/:id/:val",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/confirmpassword.html"
        },
        "allanswer": {
            "name": "allanswer",
            "css": [],
            "js": ['modules/problem/controllers/problem.controller.js'],
            "url": "/problemShow/:id",
            "controllerName": "problemShowCtrl",
            "templateUrl": "modules/problem/view/problemallanswer.html"
        },
        "problemwithcomment": {
            "name": "problemwithcomment",
            "css": [],
            "js": ['modules/problem/controllers/problem.controller.js'],
            "url": "/problemComment",
            "controllerName": "problemShowThreadedCtrl",
            "templateUrl": "modules/problem/view/problemwithcomment.html"
        },
        "signupInfo": {
            "name": "signupInfo",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/registortry",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/addinfodoctor.html"
        },
        "registor": {
            "name": "registor",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/register",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/signup.html"
        },
        "registorUser": {
            "name": "registorUser",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/registerUser",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/userSignup.html"
        },
        "registorDoctor": {
            "name": "registorDoctor",
            "css": [],
            "js": ['modules/controllers/coreController.js'],
            "url": "/registerDoctor",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/doctorSignup.html"
        },
        "registorSuccess": {
            "name": "registorSuccess",
            "css": [],
            "js": ['modules/core/controllers/DoctorCtrl.js'],
            "url": "/registorSuccess",
            "controllerName": "loginCtrl",
            "templateUrl": "modules/core/view/registersuccess.html"
        },
        "listDoctor": {
            "name": "listDoctor",
            "css": [],
            "js": ['modules/core/controllers/doctorController.js'],
            "url": "/listDoctor",
            "controllerName": "DoctorCtrl",
            "templateUrl": "modules/core/view/listDoctor.html"
        },
        "listUser": {
            "name": "listUser",
            "css": [],
            "js": ['modules/core/controllers/doctorController.js'],
            "url": "/listUser",
            "controllerName": "UserDeleteCtrl",
            "templateUrl": "modules/core/view/listUser.html"
        },
        "userInfo": {
            "name": "userInfo",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/userInfo",
            "controllerName": "UserCtrl",
            "templateUrl": "modules/user/view/userInfo.html"
        },
        "userProfile": {
            "name": "userProfile",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/userProfile",
            "controllerName": "UserCtrl",
            "templateUrl": "modules/user/view/userprofile.html"
        },
        "userProfileProblem": {
            "name": "userProfileProblem",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/userProfileProblem",
            "controllerName": "UserCtrl",
            "templateUrl": "modules/user/view/userprofileProblem.html"
        },
        "addProblem": {
            "name": "addProblem",
            "css": [],
            "js": ['modules/problem/controllers/problem.controller.js'],
            "url": "/addProblem",
            "controllerName": "problemAddCtrl",
            "templateUrl": "modules/problem/view/addproblem.html"
        },
        "labs": {
            "name": "labs",
            "css": [],
            "js": ['modules/labs/controllers/labs.controller.js'],
            "url": "/labs",
            "controllerName": "labGetListCtrl",
            "templateUrl": "modules/labs/view/labs.html"
        },
        "Lab_Admin": {
            "name": "Lab_Admin",
            "css": [],
            "js": ['modules/labs/controllers/labs.controller.js'],
            "url": "/Lab_Panel",
            "controllerName": "labCtrl",
            "templateUrl": "modules/labs/view/Lab_Admin.html"
        },
        "Lab_profile": {
            "name": "Lab_profile",
            "css": [],
            "js": ['modules/labs/controllers/labs.controller.js'],
            "url": "/Lab_profile/:id",
            "controllerName": "labProfCtrl",
            "templateUrl": "modules/labs/view/Lab_profile.html"
        },
        "hospital_list": {
            "name": "hospital_list",
            "css": [],
            "js": [],
            "url": "/hospital_list",
            "controllerName": "hospitalGetCtrl",
            "templateUrl": "modules/hospital/view/hospital_doctors.html"
        },
        "hospital_profile": {
            "name": "hospital_profile",
            "css": [],
            "js": ['modules/hospital/controller/hospitalController.js'],
            "url": "/hospital_profile/id:id",
            "controllerName": "hospitalviewCtrl",
            "templateUrl": "modules/hospital/view/hospital_profile.html"
        },
        "Admin_profile": {
            "name": "Admin_profile",
            "css": [],
            "js": ['modules/hospital/controller/hospitalController.js'],
            "url": "/Hospital_Panel",
            "controllerName": "hospitalCtrl",
            "templateUrl": "modules/hospital/view/Admin_profile.html"
        },
        "homeP": {
            "name": "homeP",
            "css": [],
            "js": ['modules/hospital/controller/hospitalController.js'],
            "url": "/hm",
            "controllerName": "hospitalCtrl",
            "templateUrl": "modules/core/view/newHome.html"
        },
        "myProblem": {
            "name": "myProblem",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/myProblem",
            "controllerName": "myProblemCtrl",
            "templateUrl": "modules/doctors/view/doctorProblem.html"
        },
        "userProblem": {
            "name": "userProblem",
            "css": [],
            "js": ['modules/controllers/doctorController.js'],
            "url": "/userProblem",
            "controllerName": "userMyProblemCtrl",
            "templateUrl": "modules/user/view/userProblem.html"
        },
        "privacyPolicies": {
            "name": "privacyPolicies",
            "css": [],
            "js": ['modules/controllers/coreController.js'],
            "url": "/privacyPolicies",
            "controllerName": "CoreCtrl",
            "templateUrl": "modules/core/view/privacy.html"
        },
        "aboutUs":{
                    "name":"aboutUs",
                        "css":[],
                        "js":['modules/controllers/coreController.js' ],
                        "url":"/aboutUs",
                        "controllerName":"CoreCtrl",
                    "templateUrl":"modules/core/view/about.html"
        },
        "career":{
                    "name":"career",
                        "css":[],
                        "js":['modules/controllers/coreController.js' ],
                        "url":"/career",
                        "controllerName":"CoreCtrl",
                    "templateUrl":"modules/core/view/career.html"
        },

        "userFeedback":{
                    "name":"userFeedback",
                        "css":[],
                        "js":['modules/controllers/coreController.js' ],
                        "url":"/userFeedback",
                        "controllerName":"CoreCtrl",
                    "templateUrl":"modules/core/view/userFeedback.html"
        },

        "apply_job": {
            "name": "apply_job",
            "css": [],
            "js": ['modules/career/controller/careerController.js'],
            "url": "/apply_job/id:id",
            "controllerName": "careerviewCtrl",
            "templateUrl": "modules/career/view/apply.html"
        },
        "team":{
                    "name":"team",
                        "css":[],
                        "js":['modules/controllers/coreController.js' ],
                        "url":"/team",
                        "controllerName":"CoreCtrl",
                    "templateUrl":"modules/core/view/team.html"
        },
        "contactUs":{
                    "name":"contactUs",
                        "css":[],
                        "js":['modules/controllers/coreController.js' ],
                        "url":"/contactUs",
                        "controllerName":"CoreCtrl",
                    "templateUrl":"modules/core/view/contactus.html"
        },
        "health":{
                    "name":"health",
                        "css":[],
                        "js":['modules/controllers/coreController.js' ],
                        "url":"/health",
                        "controllerName":"CoreCtrl",
                    "templateUrl":"modules/core/view/health.html"
        },
        "termsOfUse":{
                        "name":"termsOfUse",
                            "css":[],
                            "js":['modules/controllers/coreController.js' ],
                            "url":"/termsOfUse",
                            "controllerName":"CoreCtrl",
                        "templateUrl":"modules/core/view/termsofuse.html"
        },
        "addClinic": {
            "name": "addClinic",
            "css": [],
            "js": ['modules/hospital/controller/hospitalController.js'],
            "url": "/addClinic",
            "controllerName": "hospitalCtrl",
            "templateUrl": "modules/hospital/view/add-clinic.html"
        },
        "clinicSuggestion": {
            "name": "clinicSuggestion",
            "css": [],
            "js": ['modules/controllers/hospitalController.js'],
            "url": "/clinicSuggestion",
            "controllerName": "hospitalviewCtrl",
            "templateUrl": "modules/hospital/view/clinic-suggestion.html"
        }


    }

};
