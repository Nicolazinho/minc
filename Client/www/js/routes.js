angular.module('app.routes', [])

.config(function($ionicFilterBarConfigProvider){
    $ionicFilterBarConfigProvider.theme('light');
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $stateProvider

    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html',
      controller: 'welcomeCtrl'
    })
  
    .state('apply', {
      url: '/apply',
      templateUrl: 'templates/apply.html',
      controller: 'applyCtrl'
    })
    
    .state('apply_confirmation', {
      url: '/apply_confirmation',
      templateUrl: 'templates/apply_confirmation.html',
      controller: 'apply_confirmationCtrl'
    })
 
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
    
    .state('newpost', {
      url: '/newpost',
      templateUrl: 'templates/newpost.html',
      controller: 'newpostCtrl'    
    })

    .state('new_pic', {
      url: '/new_pic',
      templateUrl: 'templates/new_pic.html',
      controller: 'new_picCtrl'    
    })

    .state('newmeme_template', {
      url: '/newmeme_template',
      templateUrl: 'templates/newmeme_template.html',
      controller: 'newmeme_templateCtrl'    
    })

    .state('newmeme_copy', {
      url: '/newmeme_copy',
      templateUrl: 'templates/newmeme_copy.html',
      params: { 
        'memeID': null,
        'format': null
      },
      controller: 'newmeme_copyCtrl'
    })

    .state('changePW', {
      url: '/changePW',
      templateUrl: 'templates/changePW.html',
      controller: 'changepwCtrl'    
    })
      
    .state('post_details', {
      url: '/post_details',
      templateUrl: 'templates/post_details.html',
      params: { 'postID': null },
      controller: 'post_detailsCtrl'
    })

    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'tabCtrl'
    })
     
    .state('tab.discussions', {
      url: '/discussions',
      views: {
        'tab-discussions': {
          templateUrl: 'templates/discussions.html',
          controller: 'discussionsCtrl'
         }
       }
    })
       
    .state('tab.mood', {
      url: '/mood',
       views: {
         'tab-mood': {
           templateUrl: 'templates/mood.html',
           controller: 'moodCtrl'
         }
       }
    })

    .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'settingsCtrl'    
    })

    .state('notifications', {
      url: '/notifications',
      templateUrl: 'templates/notifications.html',
      controller: 'notificationsCtrl'    
    })

    .state('admin', {
      url: '/admin',
      templateUrl: 'templates/admin.html',
      controller: 'adminCtrl'    
    })
        
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/discussions');
  // $urlRouterProvider.otherwise('/tab/latest');

  $ionicConfigProvider.tabs.position('bottom');

});