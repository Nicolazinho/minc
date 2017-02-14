
angular.module('app', ['ionic','ionic.service.core', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.factory', 'app.controllers', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    //console.log('ionic platform ready');

    // Ionic Keyboard
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // console.log('keyboard is ready');
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    navigator.splashscreen.hide();

    // Cordova Keyboard
    // if(window.cordova && window.Keyboard) {
    //   //console.log('keyboard is ready');
    //   Keyboard.hideFormAccessoryBar(true);
    //   Keyboard.disableScrollingInShrinkView(true);
    // }

    if(window.StatusBar) {
      // console.log('StatusBar is ready');
      //StatusBar.styleDefault();
      //StatusBar.style(1)
      if (cordova.platformId == 'android') {
          StatusBar.backgroundColorByHexString("#00796B");
      } else {
        StatusBar.styleLightContent();
      }
      //StatusBar.hide();
    }

    if(window.cordova.logger) {
      // console.log('logger is ready');
      window.cordova.logger.__onDeviceReady();
    }

    if(typeof analytics !== 'undefined') {
      // console.log("Google Analytics loaded");
      analytics.startTrackerWithId("UA-74755187-1");
      // analytics.debugMode();
    } else {
      console.log("Google Analytics Unavailable");
    }

  });
})