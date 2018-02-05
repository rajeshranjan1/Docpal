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
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {


                $urlRouterProvider.otherwise('/');

                $stateProvider
                        .state(ConfigState.state.home.name, {
                            url: ConfigState.state.home.url,
                            templateUrl: ConfigState.state.home.templateUrl,
                            data: {
                                active: ""
                            }
                        })
                        //doctors state
                        .state(ConfigState.state.doctors.name, {
                            url: ConfigState.state.doctors.url,
                            templateUrl: ConfigState.state.doctors.templateUrl,
                            data: {
                                roles: ['admin'],
                                active: "doctors"
                            }
                        })


                        .state(ConfigState.state.doctorInfo.name, {
                            url: ConfigState.state.doctorInfo.url,
                            templateUrl: ConfigState.state.doctorInfo.templateUrl,
                            data: {
                                notAllowed: true
                            }
                        })
                        .state(ConfigState.state.Mapview.name, {
                            url: ConfigState.state.Mapview.url,
                            templateUrl: ConfigState.state.Mapview.templateUrl,
                            //controller: ConfigState.state.Mapview.controllerName
                        })

                        .state(ConfigState.state.registorDoctor.name, {
                            url: ConfigState.state.registorDoctor.url,
                            templateUrl: ConfigState.state.registorDoctor.templateUrl,
                            //controller: ConfigState.state.registorDoctor.controllerName
                        })

                        .state(ConfigState.state.addProblem.name, {
                            url: ConfigState.state.addProblem.url,
                            templateUrl: ConfigState.state.addProblem.templateUrl,
                            controller: ConfigState.state.addProblem.controllerName
                        })

                        .state(ConfigState.state.problemInfo.name, {
                            url: ConfigState.state.problemInfo.url,
                            templateUrl: ConfigState.state.problemInfo.templateUrl,
                            //controller: ConfigState.state.problemInfo.controllerName,
                            data: {
                                roles: ['admin'],
                                active: "problemInfo"
                            }
                        })
                        .state(ConfigState.state.singledoctorInfo.name, {
                            url: ConfigState.state.singledoctorInfo.url,
                            templateUrl: ConfigState.state.singledoctorInfo.templateUrl,
                            controller: ConfigState.state.singledoctorInfo.controllerName
                        })
                        .state(ConfigState.state.loginInfo.name, {
                            url: ConfigState.state.loginInfo.url,
                            templateUrl: ConfigState.state.loginInfo.templateUrl,
                            //controller: ConfigState.state.loginInfo.controllerName
                        })

                        .state(ConfigState.state.doctorprofileproblem.name, {
                            url: ConfigState.state.doctorprofileproblem.url,
                            templateUrl: ConfigState.state.doctorprofileproblem.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.doctorprofileproblem.controllerName
                        })
                        .state(ConfigState.state.doctorquestionproblem.name, {
                            url: ConfigState.state.doctorquestionproblem.url,
                            templateUrl: ConfigState.state.doctorquestionproblem.templateUrl,
                            //controller: ConfigState.state.doctorquestionproblem.controllerName
                        })

                        .state(ConfigState.state.registor.name, {
                            url: ConfigState.state.registor.url,
                            templateUrl: ConfigState.state.registor.templateUrl,
                            //controller: ConfigState.state.registor.controllerName
                        })

                        .state(ConfigState.state.registorUser.name, {
                            url: ConfigState.state.registorUser.url,
                            templateUrl: ConfigState.state.registorUser.templateUrl,
                            //controller: ConfigState.state.registorUser.controllerName
                        })

                        .state(ConfigState.state.allanswer.name, {
                            url: ConfigState.state.allanswer.url,
                            templateUrl: ConfigState.state.allanswer.templateUrl,
                            //controller: ConfigState.state.allanswer.controllerName
                        })

                        .state(ConfigState.state.problemwithcomment.name, {
                            url: ConfigState.state.problemwithcomment.url,
                            templateUrl: ConfigState.state.problemwithcomment.templateUrl,
                            //controller: ConfigState.state.problemwithcomment.controllerName
                        })

                        .state(ConfigState.state.signupInfo.name, {
                            url: ConfigState.state.signupInfo.url,
                            templateUrl: ConfigState.state.signupInfo.templateUrl,
                            //controller: ConfigState.state.signupInfo.controllerName
                        })
                        .state(ConfigState.state.registorSuccess.name, {
                            url: ConfigState.state.registorSuccess.url,
                            templateUrl: ConfigState.state.registorSuccess.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.registorSuccess.controllerName
                        })

                        .state(ConfigState.state.doctorprofile.name, {
                            url: ConfigState.state.doctorprofile.url,
                            templateUrl: ConfigState.state.doctorprofile.templateUrl,
                            data: {
                                notAllowed: true
                            }
                        })
                        .state(ConfigState.state.homepage.name, {
                            url: ConfigState.state.homepage.url,
                            templateUrl: ConfigState.state.homepage.templateUrl,
                            //controller: ConfigState.state.homepage.controllerName
                        })

                        .state(ConfigState.state.listDoctor.name, {
                            url: ConfigState.state.listDoctor.url,
                            templateUrl: ConfigState.state.listDoctor.templateUrl,
                            //controller: ConfigState.state.listDoctor.controllerName
                        })

                        .state(ConfigState.state.listUser.name, {
                            url: ConfigState.state.listUser.url,
                            templateUrl: ConfigState.state.listUser.templateUrl,
                            //controller: ConfigState.state.listUser.controllerName
                        })

                        .state(ConfigState.state.userLogin.name, {
                            url: ConfigState.state.userLogin.url,
                            templateUrl: ConfigState.state.userLogin.templateUrl,
                            //controller: ConfigState.state.userLogin.controllerName
                        })

                        .state(ConfigState.state.userInfo.name, {
                            url: ConfigState.state.userInfo.url,
                            templateUrl: ConfigState.state.userInfo.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.userInfo.controllerName
                        })

                        .state(ConfigState.state.userProfile.name, {
                            url: ConfigState.state.userProfile.url,
                            templateUrl: ConfigState.state.userProfile.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.userProfile.controllerName
                        })
                        
                        .state(ConfigState.state.addClinic.name, {
                            url: ConfigState.state.addClinic.url,
                            templateUrl: ConfigState.state.addClinic.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.userProfile.controllerName
                        })
                        
                        .state(ConfigState.state.labs.name, {
                            url: ConfigState.state.labs.url,
                            templateUrl: ConfigState.state.labs.templateUrl,
                            //controller: ConfigState.state.labs.controllerName,
                            data: {
                                roles: ['admin'],
                                active: "labs"
                            }
                        })

                        .state(ConfigState.state.hospital_list.name, {
                            url: ConfigState.state.hospital_list.url,
                            templateUrl: ConfigState.state.hospital_list.templateUrl,
                            //controller: ConfigState.state.hospital_list.controllerName,
                            data: {
                                active: "hospitalList"
                            }
                        })
                        .state(ConfigState.state.hospital_profile.name, {
                            url: ConfigState.state.hospital_profile.url,
                            templateUrl: ConfigState.state.hospital_profile.templateUrl,
                            controller: ConfigState.state.hospital_profile.controllerName
                        })
                        .state(ConfigState.state.userProfileProblem.name, {
                            url: ConfigState.state.userProfileProblem.url,
                            templateUrl: ConfigState.state.userProfileProblem.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.userProfileProblem.controllerName
                        })

                        .state(ConfigState.state.doctorprofilegallery.name, {
                            url: ConfigState.state.doctorprofilegallery.url,
                            templateUrl: ConfigState.state.doctorprofilegallery.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.doctorprofilegallery.controllerName
                        })
                        .state(ConfigState.state.doctorprofileAccount.name, {
                            url: ConfigState.state.doctorprofileAccount.url,
                            templateUrl: ConfigState.state.doctorprofileAccount.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.doctorprofileAccount.controllerName
                        })
                        .state(ConfigState.state.doctorFeedback.name, {
                            url: ConfigState.state.doctorFeedback.url,
                            templateUrl: ConfigState.state.doctorFeedback.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.doctorFeedback.controllerName
                        })
                         .state(ConfigState.state.doctorAppointment.name, {
                            url: ConfigState.state.doctorAppointment.url,
                            templateUrl: ConfigState.state.doctorAppointment.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.doctorAppointment.controllerName
                        })
                        .state(ConfigState.state.doctorprofileMap.name, {
                            url: ConfigState.state.doctorprofileMap.url,
                            templateUrl: ConfigState.state.doctorprofileMap.templateUrl,
                            data: {
                                notAllowed: true
                            }
                        })
                        .state(ConfigState.state.Admin_profile.name, {
                            url: ConfigState.state.Admin_profile.url,
                            templateUrl: ConfigState.state.Admin_profile.templateUrl,
                            //controller: ConfigState.state.Admin_profile.controllerName
                        })
                        .state(ConfigState.state.Lab_Admin.name, {
                            url: ConfigState.state.Lab_Admin.url,
                            templateUrl: ConfigState.state.Lab_Admin.templateUrl,
                            //controller: ConfigState.state.Lab_Admin.controllerName
                        })
                        .state(ConfigState.state.Lab_profile.name, {
                            url: ConfigState.state.Lab_profile.url,
                            templateUrl: ConfigState.state.Lab_profile.templateUrl,
                            controller: ConfigState.state.Lab_profile.controllerName
                        })
                        .state(ConfigState.state.forgotpassword.name, {
                            url: ConfigState.state.forgotpassword.url,
                            templateUrl: ConfigState.state.forgotpassword.templateUrl,
                            //controller: ConfigState.state.forgotpassword.controllerName
                        })

                        .state(ConfigState.state.confirmpassword.name, {
                            url: ConfigState.state.confirmpassword.url,
                            templateUrl: ConfigState.state.confirmpassword.templateUrl,
                            //controller: ConfigState.state.confirmpassword.controllerName
                        })
                        .state(ConfigState.state.myProblem.name, {
                            url: ConfigState.state.myProblem.url,
                            templateUrl: ConfigState.state.myProblem.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.myProblem.controllerName
                        })
                        .state(ConfigState.state.userProblem.name, {
                            url: ConfigState.state.userProblem.url,
                            templateUrl: ConfigState.state.userProblem.templateUrl,
                            data: {
                                notAllowed: true
                            }
                            //controller: ConfigState.state.myProblem.controllerName
                        })
                        .state(ConfigState.state.privacyPolicies.name, {
                            url: ConfigState.state.privacyPolicies.url,
                            templateUrl: ConfigState.state.privacyPolicies.templateUrl,
                            onEnter: function () {
                                window.scrollTo(0, 0);
                            },
                            //controller: ConfigState.state.myProblem.controllerName
                        })
                        .state(ConfigState.state.aboutUs.name, {
                            url: ConfigState.state.aboutUs.url,
                            templateUrl: ConfigState.state.aboutUs.templateUrl,
                            //controller: ConfigState.state.myProblem.controllerName
                            onEnter: function () {
                                window.scrollTo(0, 0);
                            },
                        })

                        .state(ConfigState.state.career.name, {
                            url: ConfigState.state.career.url,
                            templateUrl: ConfigState.state.career.templateUrl,
                            //controller: ConfigState.state.myProblem.controllerName
                            onEnter: function () {
                                window.scrollTo(0, 0);
                            },
                        })


                        // 
                        .state(ConfigState.state.userFeedback.name, {
                            url: ConfigState.state.userFeedback.url,
                            templateUrl: ConfigState.state.userFeedback.templateUrl,
                            //controller: ConfigState.state.myProblem.controllerName
                            onEnter: function () {
                                window.scrollTo(0, 0);
                            },
                        })


                        .state(ConfigState.state.apply_job.name, {
                            url: ConfigState.state.apply_job.url,
                            templateUrl: ConfigState.state.apply_job.templateUrl,
                            controller: ConfigState.state.apply_job.controllerName
                        })

                        .state(ConfigState.state.team.name, {
                            url: ConfigState.state.team.url,
                            templateUrl: ConfigState.state.team.templateUrl,
                            //controller: ConfigState.state.myProblem.controllerName
                            onEnter: function () {
                                window.scrollTo(0, 0);
                            },
                        })

                        .state(ConfigState.state.contactUs.name, {
                            url: ConfigState.state.contactUs.url,
                            templateUrl: ConfigState.state.contactUs.templateUrl,
                            //controller: ConfigState.state.myProblem.controllerName
                            onEnter: function () {
                                window.scrollTo(0, 0);
                            },
                        })

                        .state(ConfigState.state.health.name, {
                            url: ConfigState.state.health.url,
                            templateUrl: ConfigState.state.health.templateUrl,
                            //controller: ConfigState.state.myProblem.controllerName
                            onEnter: function () {
                                window.scrollTo(0, 0);
                            },
                        })

                        .state(ConfigState.state.termsOfUse.name, {
                            url: ConfigState.state.termsOfUse.url,
                            templateUrl: ConfigState.state.termsOfUse.templateUrl,
                            //controller: ConfigState.state.myProblem.controllerName
                            onEnter: function () {
                                window.scrollTo(0, 0);
                            },
                        })
                        
                        .state(ConfigState.state.clinicSuggestion.name, {
                            url: ConfigState.state.clinicSuggestion.url,
                            templateUrl: ConfigState.state.clinicSuggestion.templateUrl,
                            params: {
                                size: 0,
                                clinics: {}
                            },
                            controller: ConfigState.state.clinicSuggestion.controllerName
                        })
                        
                // for(var cutomState in ConfigState.state){
                //   $stateProvider.state({
                //      url:ConfigState.state[cutomState].url,
                //      templateUrl: ConfigState.state[cutomState].templateUrl,
                //      //controller: ConfigState.state[cutomState].controllerName

                //   });
                // }

            }]);


