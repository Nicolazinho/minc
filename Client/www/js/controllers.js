angular.module('app.controllers', ['ionic', 'chart.js','monospaced.elastic','jett.ionic.filter.bar','akoenig.deckgrid','ngCordova'])

// ADMIN BEGINNING //

.controller('adminCtrl', function($scope,$state,$ionicViewSwitcher,$timeout) {

  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  // $scope.imageStyle = "{'background-image: url(http://res.cloudinary.com/dwrk9yrcg/image/upload/v1459013601/templates/Everyone_Loses_Their_Mind.jpg)}";

  // Moving data
  //
  // var oldRef = fb_base.child("companies/gmail-com/testers");
  // var newRef = fb_base.child("users/testers");
  // oldRef.once('value', function(snap)  {
  //       newRef.set( snap.val(), function(error) {
  //         console.log('success: ' + snap.val());
  //         if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
  //       });
  //  });

  // Admin User

  // fb_base.child('/users/bcd4b8b9-0845-4988-8948-818ce2dce529').set({
  //   "company": 'pinterest-com',
  //   "domain": 'pinterest.com',
  //   "status": 'confirmed',
  //   "email": '123456@pinterest.com'
  // });
  // console.log('new user created');

  //Dummy user
  // 
  // fb_base.createUser({
  //   email: 'acme12345acme1234566@gmail.com',
  //   password: 'acme123456'
  // }, function(error, userData) {
  //   loginObj.$authWithPassword({
  //     email: 'acme12345acme1234566@gmail.com',
  //     password: 'acme123456'
  //   })
  //   .then(function(user) {
  //     fb_base.createNewUser
  //     fb_base.child('/users/' + user.uid).set({
  //       "company": 'gmail-com',
  //       "domain": 'gmail.com',
  //       "status": 'confirmed',
  //       "email": 'acme12345acme1234566@gmail.com'
  //     });
  //     console.log('new user created');
  //   });
  // });

  // Initial mood data
  // 
  var now = new Date();
  for (var i = 30; i > 0; i--) {
    var day = new Date();
    var day_before = new Date();
    day.setDate(now.getDate() - i);
    day_before.setDate(now.getDate() - i - 1);
    day = day_string(day);
    day_before = day_string(day_before);
    checking_day(day, day_before, i);
  }
  function day_string(date) {
    var timestamp_month = date.getMonth() + 1; //months from 1-12
    if (timestamp_month < 10) {
      timestamp_month = '0' + timestamp_month;
    }
    var timestamp_day = date.getDate();
    if (timestamp_day < 10) {
      timestamp_day = '0' + timestamp_day;
    }
    var timestamp_year = date.getFullYear();
    var end = timestamp_year + "-" + timestamp_month + "-" + timestamp_day;
    return end;
  }
  function checking_day(day, day_before, i) {
    $timeout(function() {
      fb_base.child('companies/pinterest-com/Questions/Mood').once("value", function(snapshot) {
        if (snapshot.child(day).exists()) {
          console.log('entry exists');
          var day_neg = snapshot.child(day).child('negative').val();
          var day_neut = snapshot.child(day).child('neutral').val();
          var day_pos = snapshot.child(day).child('positive').val();
          var total = day_neg + day_neut + day_pos;
          if (total >= 10 ) {
            console.log('more then 10 votes exists. Do nothing here');
          } else {
            console.log('less then 10 exists. Generate more');
            create_day(day, day_before);
          }
        } else {
          console.log('entry does not exist');
          create_day(day, day_before);
        }
      });
    }, (100 - i) * 100);
  }
  function create_day(day, day_before) {
    fb_base.child('companies/pinterest-com/Questions/Mood').once("value", function(snapshot) {
      console.log('day_before ' + day_before);
      if (snapshot.child(day_before).exists()) {
        console.log('entry for the day_before exist');
        var neg_old = snapshot.child(day_before).child('negative').val();
        var neg_new = create_entries(neg_old);
        fb_base.child('companies/pinterest-com/Questions/Mood').child(day).child('negative').set(neg_new);
        var neut_old = snapshot.child(day_before).child('neutral').val();
        var neut_new = create_entries(neut_old);
        fb_base.child('companies/pinterest-com/Questions/Mood').child(day).child('neutral').set(neut_new);
        var pos_old = snapshot.child(day_before).child('positive').val();
        var pos_new = create_entries(pos_old);
        fb_base.child('companies/pinterest-com/Questions/Mood').child(day).child('positive').set(pos_new);
        var sum = neut_new + pos_new * 2;
        fb_base.child('companies/pinterest-com/Questions/Mood').child(day).child('sum').set(sum);
      } else {
        console.log('entry for day_before does not exist');
        var neg_new = Math.floor((Math.random() * 50) + 1);
        var neut_new = Math.floor((Math.random() * 50) + 1);
        var pos_new = Math.floor((Math.random() * 50) + 1);
        var sum = neut_new + pos_new * 2;
        fb_base.child('companies/pinterest-com/Questions/Mood').child(day).set({
          "negative": neg_new,
          "neutral": neut_new,
          "positive": pos_new,
          "sum": sum
        }, function(){
          console.log('day ' + day + ' now exists');
        });
      }
    });
  }
  function create_entries(value) {
    var variance = 0.5;
    var upper = value * (1 + variance);
    var lower = value * (1 - variance);
    var new_value = Math.ceil(Math.floor(Math.random() * (upper - lower)) + lower);
    return new_value;
  }

  // Meme upload
  //
  // var meme_base = fb_base.child("companies/pinterest-com/meme_templates");
  // function push_memes() {
    // meme_base.push({
    //   "title": "10 Guy",
    //   "file": "10_Guy.jpg",
    //   'count': 0,
    // });
    // meme_base.push({
    //   "title": "Actual Advice Mallard",
    //   "file": "Actual_Advice_Mallard.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Afraid to Ask Andy",
    //   "file": "Afraid_to_Ask_Andy.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "All the Things",
    //   "file": "All_the_Things.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Almost Politically Correct Redneck",
    //   "file": "Almost_Politically_Correct_Redneck.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Am I The Only One Around Here?",
    //   "file": "Am_I_The_Only_One_Around_Here.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Ancient Aliens",
    //   "file": "Ancient_Aliens.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "And It's Gone",
    //   "file": "And_It_s_Gone.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Annoyed Picard",
    //   "file": "Annoyed_Picard.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Awkward Moment Seal",
    //   "file": "Awkward_Moment_Seal.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Bad Luck Brian",
    //   "file": "Bad_Luck_Brian.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Bear Grylls",
    //   "file": "Bear_Grylls.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Blackjack and Hookers",
    //   "file": "Blackjack_and_Hookers.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Bold Move Cotton",
    //   "file": "Bold_Move_Cotton.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Brace Yourselves",
    //   "file": "Brace_Yourselves.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Captain Hindsight",
    //   "file": "Captain_Hindsight.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "College Freshman",
    //   "file": "College_Freshman.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "College Liberal",
    //   "file": "College_Liberal.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Confession Kid",
    //   "file": "Confession_Kid.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Confessions Bear",
    //   "file": "Confessions_Bear.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Do You Want Ants?",
    //   "file": "Do_You_Want_Ants.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Drunk Baby",
    //   "file": "Drunk_Baby.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Everyone Loses Their Mind",
    //   "file": "Everyone_Loses_Their_Mind.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Evil Plotting Racoon",
    //   "file": "Evil_Plotting_Racoon.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Facepalm",
    //   "file": "Facepalm.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "First Day on the Internet Kid",
    //   "file": "First_Day_on_the_Internet_Kid.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "First World Problem",
    //   "file": "First_World_Problem.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Fuck Me Right?",
    //   "file": "Fuck_Me_Right.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Futurama Fry",
    //   "file": "Futurama_Fry.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Good Girl Gina",
    //   "file": "Good_Girl_Gina.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Good Guy Boss",
    //   "file": "Good_Guy_Boss.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Good Guy Greg",
    //   "file": "Good_Guy_Greg.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Grandma Finds the Internet",
    //   "file": "Grandma_Finds_the_Internet.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Grinds My Gears",
    //   "file": "Grinds_My_Gears.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Grumpy Cat",
    //   "file": "Grumpy_Cat.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "High Expectations Asian Father",
    //   "file": "High_Expectations_Asian_Father.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "I Guarantee It",
    //   "file": "I_Guarantee_It.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "I'll Have You Know",
    //   "file": "I_ll_Have_You_Know.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Insanity Wolf",
    //   "file": "Insanity_Wolf.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Internet Husband",
    //   "file": "Internet_Husband.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Lazy College Senior",
    //   "file": "Lazy_College_Senior.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Matrix Morpheus",
    //   "file": "Matrix_Morpheus.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Maury Lie Detector",
    //   "file": "Maury_Lie_Detector.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Minor Mistake Marvin",
    //   "file": "Minor_Mistake_Marvin.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Most Interesting Man in the World",
    //   "file": "Most_Interesting_Man_in_the_World.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "None of My Business",
    //   "file": "None_of_My_Business.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "One Does Not Simply",
    //   "file": "One_Does_Not_Simply.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Overly Attached Girlfriend",
    //   "file": "Overly_Attached_Girlfriend.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Overly Manly Man",
    //   "file": "Overly_Manly_Man.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Paranoid Parrot",
    //   "file": "Paranoid_Parrot.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Pepperidge Farm Remembers",
    //   "file": "Pepperidge_Farm_Remembers.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Philosoraptor",
    //   "file": "Philosoraptor.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Push It Somewhere Else Patrick",
    //   "file": "Push_It_Somewhere_Else_Patrick.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Satisfied Seal",
    //   "file": "Satisfied_Seal.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Schrute Facts",
    //   "file": "Schrute_Facts.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Scumbag Parents",
    //   "file": "Scumbag_Parents.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Scumbag Steve",
    //   "file": "Scumbag_Steve.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Scumbag Teacher",
    //   "file": "Scumbag_Teacher.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Sheltering Suburban Mom",
    //   "file": "Sheltering_Suburban_Mom.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Skeptical 3rd World Kid",
    //   "file": "Skeptical_3rd_World_Kid.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "So I Got That Goin' For Me Which is Nice",
    //   "file": "So_I_Got_That_Goin_For_Me_Which_is_Nice.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Socially Awesome Awkward Penguin",
    //   "file": "Socially_Awesome_Awkward_Penguin.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Socially Awesome Penguin",
    //   "file": "Socially_Awesome_Penguin.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Socially Awkward Penguin",
    //   "file": "Socially_Awkward_Penguin.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Sophisticated Cat",
    //   "file": "Sophisticated_Cat.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Spider-Man Masterbating",
    //   "file": "Spider-Man_Masterbating.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Success Kid",
    //   "file": "Success_Kid.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Sudden Clarity Clarence",
    //   "file": "Sudden_Clarity_Clarence.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Super Cool Ski Instructor",
    //   "file": "Super_Cool_Ski_Instructor.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Too Damn High",
    //   "file": "Too_Damn_High.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Unpopular Opinion Puffin",
    //   "file": "Unpopular_Opinion_Puffin.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Upvoting Obama",
    //   "file": "Upvoting_Obama.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Willy Wonka",
    //   "file": "Willy_Wonka.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Y'all Got Anymore of",
    //   "file": "Y_all_Got_Anymore_of.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Y U No",
    //   "file": "Y_U_No.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "Yo Dawg",
    //   "file": "Yo_Dawg.jpg",
    //   'count': 0
    // });
    // meme_base.push({
    //   "title": "I Have no Idea What I'm Doing",
    //   "file": "I_Have_no_Idea_What_I_am_Doing.jpg",
    //   'count': 0
    // });
  // }

})

// ADMIN END //


// APPLY BEGINNING //


.controller('applyCtrl', function($scope,$state,$firebaseAuth,$ionicPopup,$ionicViewSwitcher){

  if(typeof analytics !== 'undefined') { analytics.trackView('apply'); }
    
  $scope.apply={};
  //webmailers_upload();
  enable_signup_button();
  
  function enable_signup_button() {
    $scope.button_disabled = false;
    $scope.button_disabled2 = false;
    $scope.button_text = "SIGN UP";
    $scope.spinner_style = {
      display: 'none'
    };
  }
  
  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var loginObj = $firebaseAuth(fb_base);

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  $scope.signup = function(){

      $scope.button_disabled = true;
      $scope.button_disabled2 = true;
      $scope.button_text = "";
      $scope.spinner_style = {
        stroke: '#FFC107',
        fill: '#FFC107'
      };
    
      var email = $scope.apply.email;
      var password = $scope.apply.password1;
      var password;
      var domain;
      check_input();
      
      function check_input(){
        //console.log('checking input');
        if (email == undefined || password == undefined || password == '' || email == '') {
          //console.log("Entry empty");
          alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: 'You cannot leave any fields blank'
          });
          enable_signup_button();
        } else if (password.length < 6) {
          //console.log("Passwords too short");
          alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: 'Please enter a longer Password'
          });
          enable_signup_button();
        } else {
          //console.log('all entries look good');
          domain_status();
        }
      }
      
      function domain_status() {
        email = email.toLowerCase();
        domain = email.split("@").pop();

        new Firebase(fb_base + "/applicants/webmailers")
          .orderByValue()
          .equalTo(domain)
          .once('value', function(snap) {
            if (snap.numChildren() == 1) {
              new Firebase(fb_base + "/users/testers")
                .orderByValue()
                .equalTo(email)
                .once('value', function(snap) {
                  if (snap.numChildren() == 1) {
                    console.log(email + ' is tester');
                    createNewUser();
                  } else {
                    console.log(email + ' is no tester');
                    alertPopup = $ionicPopup.alert({
                      title: 'Error',
                      template: "Please use your work email address"
                    });
                    enable_signup_button();
                  }
              });
            } else {
              //console.log('domain NOT blacklisted');
              createNewUser();
            }
        });
      }
      
      function createNewUser() {
        
        fb_base.createUser({
          email: email,
          password: password
        }, function(error, userData) {
          if (error) {
            switch (error.code) {
              case "EMAIL_TAKEN":
                //console.log("The new user account cannot be created because the email is already in use.");
                alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: 'User with that email applied already'
                });
                break;
              case "INVALID_EMAIL":
                //console.log("The specified email is not a valid email.");
                alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: 'Not a valid email address'
                });
                break;
              default:
                //console.log("Error creating user:", error);
                alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: "That's all we know :("
                });
              
            }
            enable_signup_button();
          } else {
            loginObj.$authWithPassword({
                email: email,
                password: password
              })
              .then(function(userData) {
                  //Success callback
                  //console.log('Authentication successful');

                  var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
                  var clear_domain = domain.replace(".", "-");
                  var push = fb_base.child('/users/' + userData.uid).set({
                    "company": clear_domain,
                    "domain": domain,
                    "status": 'applied',
                    "email": email,
                    "token": token
                  });
                  //console.log("Successfully created user account with uid: " + userData.uid);
                  fb_base.child('/applicants/domains/' + clear_domain).push({
                    "user": userData.uid
                  });
                  fb_base.child('/applicants/domains/' + clear_domain + '/counter').transaction(function (current_value) {
                    return (current_value || 0) + 1;
                  });
                  //console.log('New user pushed');
                  
                  enable_signup_button();
                  $scope.apply.email = "";
                  $scope.apply.password1 = "";
                  $ionicViewSwitcher.nextDirection('forward');
                  $state.go('apply_confirmation');

              }, function(error) {
                  //Failure callback
                  //console.log('Authentication failure');
              });
          }
        });
      }
  };

})


// APPLY END //

// APPLY CONFIRMATION BEGINNING //


.controller('apply_confirmationCtrl', function($scope,$state,$ionicViewSwitcher) {  

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

})

.controller('emailCtrl', function($scope,$location){

  if(typeof analytics !== 'undefined') { analytics.trackView('email confirmation'); }
    
  $scope.spinner = true;
  
  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  
  if ( $location.search().hasOwnProperty('tk', 'ui') ) {
     var token = $location.search()['tk'];
     var userid = $location.search()['ui'];
     //console.log('token: ' + token + '. userid: ' + userid);
  }
  
  function err(){
    //console.log('Token invalid');
    $scope.spinner = false;
    $scope.successVisible = false;
    $scope.errorVisible = true; 
  }
  
  function email_confirm(fb_token) {
    if (fb_token == token) {
      //console.log('Token confirmed');
      $scope.spinner = false;
      $scope.successVisible = true;
      $scope.errorVisible = false;
      
        var push = fb_base.child('/users/' + userid).update({
          "status": 'confirmed',
          "token": null
        });
        //console.log("Email address confirmed");
      
    } else {
      err();
    }

  }
  
  new Firebase(fb_base + "/users/" + userid)
    .orderByChild("token")
    .once('value', function(snap) {
      if (snap.val() == null) {
        err();
      } else {
        var fb_token = snap.val().token;
        //console.log('token found');
        email_confirm(fb_token);
      }
    }, function () {
      err();
    });

})


// APPLY CONFIRMATION END //

// LOGIN BEGINNING //


.controller('loginCtrl', function($scope,$firebaseAuth,$state,$ionicPopup,$ionicViewSwitcher) {

  if(typeof analytics !== 'undefined') { analytics.trackView('login'); }

  $scope.login = {};
	$scope.button_value = 'LOG IN';
	$scope.button_disabled = false;
	$scope.spinner_style = {
    display: 'none'
  };
	var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var loginObj = $firebaseAuth(fb_base);

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  $scope.forgot = function($event) {
    $scope.data = {};
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.email_PW">',
      title: 'Forgot your password?',
      subTitle: "Enter you email address and we'll send you password reset instructions",
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>OK</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.email_PW) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              reset_PW($scope.data.email_PW);
            }
          }
        }
      ]
    });
  };

  function reset_PW(ea) {
    fb_base.resetPassword({
      email: ea
    }, function(error) {
      if (error) {
        switch (error.code) {
          case "INVALID_USER":
            //console.log("The specified user account does not exist.");
            alertPopup = $ionicPopup.alert({
              title: 'Error recognizing your email',
              template: 'Please try again'
            });
            break;
          default:
            //console.log("Error resetting password:", error);
            alertPopup = $ionicPopup.alert({
              title: 'Error on our side',
              template: 'Please try again later'
            });
        }
      } else {
        //console.log("Password reset email sent successfully!");
        alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: 'Check your email for reset instructions'
        });
      }
    });
  }
  
	$scope.signin = function(){
	  $scope.button_value = ' ';
	  $scope.button_disabled = true;
	  $scope.spinner_style = {
      stroke: '#FFC107',
      fill: '#FFC107'
    };
	  var email = $scope.login.email_logging;
		var password = $scope.login.password;
		check_input();
        
    function check_input(){
      //console.log('checking input');
      if (email == undefined || password == undefined || password == '' || email == '') {
        //console.log("Entry empty");
        alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'You cannot leave any fields blank'
        });
        $scope.button_value = 'LOG IN';
        $scope.button_disabled = false;
        $scope.spinner_style = {
          display: 'none'
        };
      } else {
        //console.log('all entries look good');
        logging();
      }
    }

    function settingUp(user, email, domain) {
      window.localStorage['userID'] = user.uid;
      window.localStorage['ldap'] = email.split('@')[0] + '@';
      window.localStorage['domain'] = domain;
      $scope.login.email_logging = '';
      $scope.login.password = '';
      $scope.button_value = 'LOG IN';
      $scope.button_disabled = false;
      $scope.spinner_style = {
        display: 'none'
      };
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('tab.discussions');
    }

    function logging(){
      email = email.toLowerCase();
      var domain = email.split('@')[1].replace('.', '-');
    	loginObj.$authWithPassword({
            email: email,
            password: password
        })
        .then(function(user) {
            //console.log('Authentication successful');
            fb_base.child('users/' + user.uid + '/status').once("value", function(snapshot) {
              if (snapshot.val() != "confirmed") {
                // console.log('user not confirmed yet');
                var alertPopup = $ionicPopup.alert({
                  title: 'Email address not confirmed',
                  template: 'Please click the link in your confirmation email.'
                });
                $scope.button_value = 'LOG IN';
                $scope.button_disabled = false;
                $scope.spinner_style = {
                  display: 'none'
                };
              } else {
                fb_base.child('applicants/domains').child(domain).once("value", function(snapshot) {
                  if (snapshot.child('whitelisted').exists() && snapshot.child('whitelisted').val()) {
                    fb_base.child('companies/company_names').once("value", function(snapshot) {
                      if (snapshot.child(domain).exists()) {
                        // console.log('domain ' + domain + ' has a company name: ' + snapshot.child(domain).val());
                        var result = snapshot.child(domain).val();
                        window.localStorage['company'] = result;
                        window.localStorage['email'] = email;
                        settingUp(user, email, domain);
                      } else {
                        // something went wrong. this should not happen!
                        window.localStorage['company'] = 'Your company';
                        settingUp(user, email, domain);
                      }
                    });
                  } else {
                    // console.log('company not whitelisted yet');
                    // TKTK
                    var alertPopup = $ionicPopup.alert({
                      title: 'Minc is not available',
                      template: 'Not enough employees at your company have signed up. Invite more of your peers!'
                    });
                    $scope.button_value = 'LOG IN';
                    $scope.button_disabled = false;
                    $scope.spinner_style = {
                      display: 'none'
                    };
                  }
                })
              }
            });

        }, function(error) {
            //Failure callback
            //console.log('Authentication failure');
            var alertPopup = $ionicPopup.alert({
              title: 'Login unsuccessful',
              template: 'Please try again'
            });
            $scope.button_value = 'LOG IN';
            $scope.button_disabled = false;
            $scope.spinner_style = {
              display: 'none'
            };
        });
        
    }

	};

})


// LOGIN END //

// TAB BEGINNING //


.controller('tabCtrl', 
  function($scope,$state,$ionicViewSwitcher,$ionicSideMenuDelegate,$window) {

    var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");

    $scope.company_name = window.localStorage['company'];
    $scope.go = function(where, direction) {
      $ionicViewSwitcher.nextDirection(direction);
      $state.go(where);
    }

    $scope._platform = ionic.Platform.platform();

    $scope.invite = function(){
      // console.log('invite called');
      var subject = encodeURIComponent("Join me on Minc");
      var body  = encodeURIComponent("I have been using Minc and I think you should join too! It's a mobile app for company-wide open discussions. Find more information at http://www.Minc.co/");
      $window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
    }

})

// TAB END //

// DISCUSSIONS BEGINNING //


.controller('discussionsCtrl', 
  function($rootScope,$scope,$firebaseAuth,$state,$ionicPopup,$firebaseArray,$ionicPopover,$ionicActionSheet,$ionicFilterBar,$timeout,$ionicTabsDelegate,$ionicViewSwitcher,$ionicSideMenuDelegate,$ionicScrollDelegate,$ionicModal,$ionicSlideBoxDelegate,$ionicLoading) {

  if(typeof analytics !== 'undefined') { analytics.trackView('discussions'); }

  $scope.list = [];
  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var authData = fb_base.getAuth();
  var initial_posts_limit = 10;
  var step = 10;
  var new_posts_limit = initial_posts_limit;
  var domain_cleared = window.localStorage['domain'];
  var ref_posts = fb_base.child('companies/' + domain_cleared + '/Posts');
  var ref;
  var userID = window.localStorage['userID'];
  var ref2 = fb_base.child("users/" + userID + '/Favorites');
  var timestamp = Firebase.ServerValue.TIMESTAMP;
  $scope._data = {};
  $scope.sortList = [
    { text: "Hot", value: "score" },
    { text: "New", value: "date" },
    { text: "Top", value: "votes" },
    { text: "Controversial", value: "commentInt" }
  ];
  $scope.searching = false;

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.go = function(where, direction) {
    $scope.modal.hide();
    $scope.modal.remove();
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  $scope._platform = ionic.Platform.platform();
  
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.sortby = function () {
    //console.log('sortby called. newSorter: ' + newSorter);
    $scope.moreDataCanBeLoaded = false;
    $scope.list = [];
    $scope.spinner_face = true;
    var root_sorter = $rootScope.viewer;
    if (typeof $scope._data.selected == 'undefined' && typeof root_sorter !== 'undefined') {
      $scope._data = {
        selected: root_sorter
      };
    } else if (typeof $scope._data.selected == 'undefined' && typeof root_sorter == 'undefined') {
      $scope._data = {
        selected: 'score'
      };
    }
    if (ref != undefined) {
      // console.log('ref called off');
      ref.off();
    }
    ref = ref_posts.orderByChild($scope._data.selected);
    if ($scope._data.selected == 'score') {
      ref.startAt(1).endAt(100000);
      $scope.sorter = "-" + $scope._data.selected;
      $scope.sort_display = 'Hot';
      $rootScope.viewer = $scope._data.selected;
    } else if ($scope._data.selected == 'date') {
      $scope.sorter = "-" + $scope._data.selected;
      $scope.sort_display = 'New';
      $rootScope.viewer = $scope._data.selected;
    } else if ($scope._data.selected == 'votes') {
      ref.startAt(1).endAt(100000);
      $scope.sorter = "-" + $scope._data.selected;
      $scope.sort_display = 'Top';
      $rootScope.viewer = $scope._data.selected;
    } else if ($scope._data.selected == 'commentInt') {
      ref.startAt(1).endAt(100000);
      $scope.sorter = "-" + $scope._data.selected;
      $scope.sort_display = 'Controversial';
      $rootScope.viewer = $scope._data.selected;
    }
    settingScope(initial_posts_limit);
    $ionicScrollDelegate.scrollTop();
    if ($scope.popover) {
      // console.log('popover was open. Closing...')
      $scope.popover.hide();
    }
  }

  if(!authData || domain_cleared === null) {
    //console.log('no user found');
    $state.go('apply');
  } else {
    //console.log('user found');
    $scope.moreDataCanBeLoaded = true;
    $scope.spinner_face = true;
    $scope.sortby();
    // settingScope(new_posts_limit);
  }

  function settingScope(limit) {
    // console.log('settingScope called with limit ' + limit);
    ref.limitToLast(limit).on('value', function(snap) {
      // console.log('got snap of ref');
      // console.log('ref: ' + JSON.stringify(snap.val(), null, 2));
      if (snap.val() == null) {
        $scope.moreDataCanBeLoaded = false;
        return
      }
      var all_posts = [];
      var i = 0;
      angular.forEach(snap.val(), function(value, key) {
        all_posts[snap.numChildren() -1-i] = value;
        all_posts[snap.numChildren() -1-i].id = key;
        if(!all_posts[snap.numChildren() -1-i].name) {
          all_posts[snap.numChildren() -1-i].name = 'anonymous';
        }
        if(value.imgFile) {
          all_posts[snap.numChildren() -1-i].imgsrc = 'http://res.cloudinary.com/dwrk9yrcg/image/upload/c_limit,w_400/v1459453394/uploads/' + value.imgFile;
          if (value.postType == 'meme') {
            all_posts[snap.numChildren() -1-i].content_hide = true;
          }
        }
        function isFav(i,key) {
          //console.log('checking if favorite');
          ref2.child(key).once('value', function(snapshot) {
            if (snapshot.exists()) {
              all_posts[snap.numChildren() -1-i].fav = true;
            } else {
              all_posts[snap.numChildren() -1-i].fav = false;
            }
            if (i == snap.numChildren() - 1) {
              $timeout(function() {
                $scope.spinner_face = false;
              });
              // console.log('$scope.list update');
              $scope.list = all_posts;
              ref.once("value", function(snapshot2) {
                // Deadling with infinite scrolling
                //console.log('snapshot2.numChildren() ' + snapshot2.numChildren());
                if (new_posts_limit >= snapshot2.numChildren()) {
                  $timeout(function() {
                    $scope.moreDataCanBeLoaded = false;
                  });
                  // console.log('no more data to load');
                } else {
                  $timeout(function() {
                    $scope.moreDataCanBeLoaded = true;
                  });
                  // console.log('More data to load');
                }               
              });
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          });
        }
        isFav(i,key)
        i++;
      });
    }, function (err) {
      console.log('error ' + err);
    });  
  }
    
  $scope.timeSince = function(date) {
    var seconds = Math.floor((new Date().getTime()/1000) - date/1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval + "y";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + "m";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + "m";
    }
    return "<1m";
  };
  
  $scope.addFavorite = function(item_id, item_author) {
    ref2.once("value", function(snapshot) {
      var ref_item_votes = fb_base.child('companies/' + domain_cleared + '/Posts/' + item_id + '/votes');
      if (snapshot.child(item_id).exists()) {
        ref2.child(item_id).remove();
        ref_item_votes.transaction(function (current_value) {
          return (current_value || 0) - 1;
        });
      } else {
        ref2.child(item_id).set("true");
        ref_item_votes.transaction(function (current_value) {
          return (current_value || 0) + 1;
        });
        if (item_author != userID) {
          fb_base.child('users').child(item_author).child('news').push({
            'type': 'upvote',
            'content_type': 'Post',
            'date': timestamp,
            'id': item_id
          });
        }
      }
    });
  };
  
  $scope.pressed = function(content, id) {
    $ionicActionSheet.show({
       destructiveText: 'Flag as inappropriate?',
       titleText: content,
       cancelText: 'Cancel',
       destructiveButtonClicked: function() {
            flagged(id);
            return true;
          },
       cancel: function(index) {
         return true;
       }
   });
  };
  
  function flagged(id) {
    var ref_flagged = fb_base.child('companies/' + domain_cleared + '/Posts/' + id + '/flagged');
    ref_flagged.transaction(function (current_value) {
      return (current_value || 0) + 1;
    });
    var alertPopup = $ionicPopup.alert({
      title: 'Thank you for reporting',
      template: 'We will take a look at this soon'
    });
  }
  
  $scope.entryDetails = function(item_id) {
    var result = { 'postID': item_id };
    $ionicViewSwitcher.nextDirection('forward');
    $state.go('post_details', result);
  };
  
  $scope.loadMoreData = function() {
    // console.log('load more data called');
    ref.limitToLast(new_posts_limit).off();
    new_posts_limit = new_posts_limit + step;
    settingScope(new_posts_limit);
  };

  $scope.search = function () {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    $scope.searching = true;
    $rootScope.hideTabs = true;
    ref.limitToLast(new_posts_limit).off();
    settingScope(1000);
    setTimeout(function(){
      $scope.moreDataCanBeLoaded = false;
      $ionicFilterBar.show({
        items: $scope.list,
        update: function (filteredItems, filterText) {
          $scope.list = filteredItems;
          ref.limitToLast(1000).off();
        },
        cancel: function() {
          $scope.moreDataCanBeLoaded = true;
          $scope.searching = false;
          $rootScope.hideTabs = false;
          $scope.sortby();
        },
      });
      $ionicLoading.hide();
    }, 1000);
  };

  $ionicModal.fromTemplateUrl('templates/newpost_modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

  $scope.openModal = function(){
    // console.log('model opening');
    $scope.modal.show();
  }

  $scope.closeModal = function(){
    // console.log('model closing');
    $scope.modal.hide();
  }

  $scope.lockSlide = function () {
    $ionicSlideBoxDelegate.enableSlide( false );
  }

  $scope.$on('$destroy',function(){
    // console.log('model destroying');
    $scope.modal.remove();
  });

})

// DISCUSSIONS END //


// MOOD BEGINNING //


.controller('moodCtrl', 
  function($scope,$firebaseAuth,$state,$ionicPopup,$firebaseArray,$ionicPopover,$timeout,$ionicTabsDelegate,$ionicViewSwitcher,$ionicSideMenuDelegate) {
    
  if(typeof analytics !== 'undefined') { analytics.trackView('mood'); }

  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var authData = fb_base.getAuth();
  var timeframe = 'week';
  var yesterday;
  var time_scale = [];
  var data_company = [];
  var data_user = [];
  $scope.spinner_face = true;
  $scope.result_face = false;
  $scope.question_face = false;

  $scope.average_company = '0';
  $scope.average_user = '0';

  var domain_cleared = window.localStorage['domain'];
  var company_base = fb_base.child('companies').child(domain_cleared).child('Questions').child('Mood');
  var userID = window.localStorage['userID'];
  var user_base = fb_base.child('users').child(userID).child('Questions').child('Mood');
  var user_baseArray = $firebaseArray(user_base);
  user_baseArray.$loaded().then(votesYesterday);

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  function day_string(date) {
    var timestamp_month = date.getMonth() + 1; //months from 1-12
    if (timestamp_month < 10) {
      timestamp_month = '0' + timestamp_month;
    }
    var timestamp_day = date.getDate();
    if (timestamp_day < 10) {
      timestamp_day = '0' + timestamp_day;
    }
    var timestamp_year = date.getFullYear();
    var end = timestamp_year + "-" + timestamp_month + "-" + timestamp_day;
    return end;
  }

  if(!authData && !domain_cleared) {
    //console.log('no user found');
    $state.go('login');
  } else {
    now = new Date();
    yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    yesterday = day_string(yesterday);
  }

  $scope.set_time = function(time) {
    $scope.var = time;
    timeframe = time;
    set_time_label();
    $scope.load_chart();
  }

  function set_time_label() {
    var days_array = [];
    var range;
    timestamp = new Date();
    var t_0 = new Date( yesterday.replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1") );
    if (timeframe == 'month') {
      range = 31;
      data_company = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
      data_user = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
      for (i=0;i<range;i++) {
        if (i == 0) {
          days_array[i] = yesterday;
        } else {
          var temp_date = new Date(t_0.getTime());
          temp_date.setDate(t_0.getDate() - i);
          temp_date = day_string(temp_date);
          days_array[i] = temp_date;
        }
        if (i%8 == 0) {
          var label = days_array[i].split('-');
          label = label[1] + '/' + label[2];
          time_scale[range-1-i] = label;
        } else {
          time_scale[range-1-i] = '';
        }
      }
      $scope.labels = time_scale;
    } else {
      range = 7;
      time_scale = time_scale.slice(0, range);
      for (i=0; i<range; i++) {
        if (i == 0) {
          days_array[i] = yesterday;
        } else {
          var temp_date = new Date(t_0.getTime());
          temp_date.setDate(t_0.getDate() - i);
          temp_date = day_string(temp_date);
          days_array[i] = temp_date;
        }
        var label = days_array[i].split('-');
        label = label[1] + '/' + label[2];
        time_scale[range-1-i] = label;
      }
      $scope.labels = time_scale;
    }

    // Company values
    var sum_company = 0;
    var counter = 0;
    data_company = [];
    company_base.limitToLast(range).once('value', function(snapshot) {
      var number_children = snapshot.numChildren();
      snapshot.forEach(function(snap) {
        counter++;
        for (var i = range-1; i >= 0; i--) {
          if (days_array[i] == snap.key()) {
            var sum = snap.val().sum || 0;
            var positive = snap.val().positive || 0;
            var neutral = snap.val().neutral || 0;
            var negative = snap.val().negative || 0;
            var value = sum / ( positive + neutral + negative );
            data_company[range-1-i] = value;
            sum_company = sum_company + value;
          }
        }
        if (counter == number_children) {
          // fill 1 values for empty entries
          for (var j = range-1; j >= 0; j--) {
            if (typeof data_company[j] !== 'number') {
              data_company[j] = 1;
              sum_company = sum_company + 1;
            }
          };
          var average = Math.round((sum_company / range)*50);
          $timeout(function() {
            $scope.average_company = average;
            data_company = data_company.slice(0, range);
          });
        }
      });
    });

    // User values
    var sum_user = 0;
    var counter2 = 0;
    data_user = [];
    user_base.limitToLast(range).once('value', function(snapshot) {
      var number_children2 = snapshot.numChildren();
      snapshot.forEach(function(snap) {
        counter2++;
        for (var i = range-1; i >= 0; i--) {
          if (days_array[i] == snap.val().day) {
            var mood = snap.val().mood * 1.5 / 2 + 0.25;
            // var mood = (snap.val().mood + 1) * 0.75 -1 ;
            data_user[range-1-i] = mood;
            sum_user = sum_user + mood;
          }
        }
        if (counter2 == number_children2) {
          // fill 1 values for empty entries
          for (var i = range-1; i >= 0; i--) {
            if (typeof data_user[i] !== 'number') {
              data_user[i] = 1;
              sum_user = sum_user + 1;
            }
          };
          var average2 = Math.round((sum_user / range)*50);
          $timeout(function() {
            $scope.average_user = average2;
            data_user = data_user.slice(0, range);
          });
        }
      });
    });
  }

  $scope.load_chart = function() {
    // set_time_label();
    if (timeframe == 'month') {
      $scope.options = {
        showLabels: false
      }
      $scope.data = [
        ($scope.graph.company) ? data_company : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ($scope.graph.user) ? data_user : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
    } else {
      $scope.data = [
        ($scope.graph.company) ? data_company : [0, 0, 0, 0, 0, 0, 0],
        ($scope.graph.user) ? data_user : [0, 0, 0, 0, 0, 0, 0]
      ];
    }
    $scope.colours = [{
          "fillColor": "rgba(0,150,136,0.2)",
          "strokeColor": "rgba(0,150,136,1)",
        },{
          "fillColor": "rgba(255,193,7,0.2)",
          "strokeColor": "rgba(255,193,7,1)",
        }];
    $scope.options = {
      //scaleShowGridLines : false,
      scaleShowVerticalLines: false,
      scaleShowLabels: false,
      pointDot: false,
      scaleOverride : true,
      scaleStartValue : 0,
      scaleSteps : 5,
      scaleStepWidth : 0.5,
      showTooltips: false,
      xLabelRotation: 0
    };
  };  

  function votesYesterday() {
    var mood_submits = user_base.orderByKey().limitToLast(1);
    mood_submits.once('value', function(all_snapshot){
      if (all_snapshot.val() != null) {
        all_snapshot.forEach(function(snapshot) {
          $timeout(function() {
            if (snapshot.child('day').val() == yesterday) {
              $timeout(function() {
                //console.log('Mood entry for yesterday found');
                $scope.spinner_face = false;
                $scope.question_face = false;
                $scope.result_face = true;
                $scope.graph = {
                  user: true,
                  company: true
                }
                $scope.var = 'week';
                set_time_label();
                $scope.load_chart();
              });
            } else {
              //console.log('No mood entry for yesterday');
              $scope.spinner_face = false;
              $scope.question_face = true;
              $scope.result_face = false;
            }
          });
        });
      } else {
        //console.log('No mood entry for yesterday');
        $scope.spinner_face = false;
        $scope.question_face = true;
        $scope.result_face = false;
      }
    });
  }
  
  $scope.mood_track = function(direction) {
    fb_timestamp = Firebase.ServerValue.TIMESTAMP;
    var mood_day = company_base.child(yesterday);
    if (direction == 2) {
      mood_day.child('positive').transaction(function (current_value) {
        return (current_value || 0) + 1;
      });
      mood_day.child('sum').transaction(function (current_value) {
        return (current_value || 0) + 2;
      });
      user_base.push({
        "date": fb_timestamp,
        "day": yesterday,
        'mood': direction
      });
    } else if (direction == 1) {
      mood_day.child('neutral').transaction(function (current_value) {
        return (current_value || 0) + 1;
      });
      mood_day.child('sum').transaction(function (current_value) {
        return (current_value || 0) + 1;
      });
      user_base.push({
        "date": fb_timestamp,
        "day": yesterday,
        'mood': direction
      });
    } else if (direction == 0) {
      mood_day.child('negative').transaction(function (current_value) {
        return (current_value || 0) + 1;
      });
      user_base.push({
        "date": fb_timestamp,
        "day": yesterday,
        'mood': direction
      });
    }
    // $scope.question_face = "animated flipOutY";
    // $scope.result_face = "animated flipInY";
    set_time_label();
    votesYesterday();
    $scope.question_face = false;
    $scope.result_face = true;
  };
  
})


// MOOD END //

// NEW POST BEGINNING //


.controller('newpostCtrl',
  function($rootScope,$scope,$firebaseAuth,$state,$ionicPopup,$firebaseArray,$ionicNavBarDelegate,$ionicViewSwitcher) {
    
  if(typeof analytics !== 'undefined') { analytics.trackView('new post'); }

  // ?
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
    
  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var authData = fb_base.getAuth();
  var domain_cleared = window.localStorage['domain'];
  var email = window.localStorage['email'];
  var ldap = window.localStorage['ldap'];
  var author_name = ldap;
  var ldap_ui_text = 'as ' + ldap;

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  $scope._platform = ionic.Platform.platform();
  
  if(!authData) {
    //console.log('no user found');
    $state.go('login');
  } else {
    $scope.newpost = {};
    var timestamp = Firebase.ServerValue.TIMESTAMP;
    $scope.author_icon = "ion-eye";
    $scope.author_name = 'as ' + ldap;
  }
          
  $scope.push_message = function(){
    var post = $scope.newpost.post_submit;
    var pushing = fb_base.child('companies/' + domain_cleared + '/Posts').push({
      "author": authData.uid,
      "commentInt": 0,
      "content": post,
      "date": timestamp,
      "flagged": 0,
      "name": author_name,
      "score": 0,
      "votes": 0
    });
    fb_base.child('users/' + authData.uid + '/Posts/' + pushing.key()).set(true);
    $scope.newpost.post_submit = '';
    $ionicViewSwitcher.nextDirection('exit');
    $rootScope.viewer = 'date';
    $state.go('tab.discussions');
  };
  
  $scope.author_toggle = function(){
    $scope.author_icon = $scope.author_icon === "ion-eye" ? "ion-eye-disabled" : "ion-eye";
    $scope.author_name = $scope.author_name === ldap_ui_text ? "anonymously" : ldap_ui_text;
    author_name = author_name === ldap ? "" : ldap;
  };

})


// NEW POST END //


// NEW PIC BEGINNING //


.controller('new_picCtrl',
  function($rootScope,$scope,$firebaseAuth,$state,$ionicViewSwitcher,$timeout,$cordovaImagePicker,$cordovaFileTransfer,$cordovaProgress,$ionicLoading,$window) {

  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var authData = fb_base.getAuth();
  var domain_cleared = window.localStorage['domain'];
  var ldap = window.localStorage['ldap'];
  var author_name = ldap;
  var ldap_ui_text = 'as ' + ldap;
  var timestamp;
  var filePath = '';

  if(!authData || !domain_cleared) {
    //console.log('no user found');
    $state.go('login');
  } else {
    // console.log('user found');
    $scope.newpost = {};
    $scope.author_icon = "ion-eye";
    $scope.author_name = 'as ' + ldap;
    timestamp = Firebase.ServerValue.TIMESTAMP;
    load_pic();
  }

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  $scope._platform = ionic.Platform.platform();

  function load_pic(){
    console.log('starting to load a pic');
    var options = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 70
    };
    $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      console.log('Image URI: ' + results[0]);
      if (results == '') {
        $state.go('tab.discussions');
      } else {
        // console.log('URI ' + results[0]);
        filePath = results[0];
        $scope._source = results[0];
        var img = document.getElementById('pic_preview');
        img.onload = function() {
          var max_width = 0.95 * $window.innerWidth;
          var max_height = 0.60 * $window.innerHeight;
          var org_height = img.naturalHeight; //3
          var org_width = img.naturalWidth; //2
          var ratio = org_height / org_width; //1.5
          if (org_width < org_height) {
            // console.log('pic is portrait');
            if (img.height > max_height) {
              // console.log('pic is too tall');
              var new_width = max_height / ratio;
              document.getElementById('pic_preview').height = max_height;
              document.getElementById('pic_preview').width = new_width;
            }
          } else {
            // console.log('pic is landscape');
            document.getElementById('pic_preview').width = max_width;
          }
        };
        // $scope.imageStyle = {'background-image':'url("' + results[0] + '")'};
      }
    }, function(error) {
      console.log('error: ' + error);
    });
  }

  $scope.upload = function() {
    // console.log('uploading image');
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    var server = "https://api.cloudinary.com/v1_1/dwrk9yrcg/image/upload";
    var options = {
      params : { 'upload_preset': 'REMOVED'}
    };
    $cordovaFileTransfer.upload(server, filePath, options)
    .then(function(result) {
      // console.log('upload success');
      var response = JSON.stringify(result.response).replace(/\\"/g, '"');
      response = response.substr(1, response.length-2);
      var obj = JSON.parse(response);
      var id = obj.public_id;
      id = id.substring(id.indexOf("/") + 1);
      var file_format = "." + obj.format;
      var file_name = id + file_format;
      // console.log('file_name ' + file_name);
      push_pic(file_name);
    }, function (error) {
      // pushing.remove();
      // console.log('error ' + JSON.stringify(error));
    });
  }

  function push_pic(file_name) {
    // console.log('posting');
    var pushing = fb_base.child('companies/' + domain_cleared + '/Posts').push({
      "author": authData.uid,
      "commentInt": 0,
      "content": $scope.newpost.headline,
      "date": timestamp,
      "flagged": 0,
      "name": author_name,
      "score": 0,
      "votes": 0,
      "imgFile": file_name
    });
    fb_base.child('users/' + authData.uid + '/Posts/' + pushing.key()).set(true);
    $scope.newpost.headline = '';
    // $scope.imageStyle = "{'background-image: url('')}";
    $scope._source = '';
    filePath = '';
    $ionicLoading.hide();
    $ionicViewSwitcher.nextDirection('exit');
    $rootScope.viewer = 'date';
    $state.go('tab.discussions');
  };

  $scope.author_toggle = function(){
    $scope.author_icon = $scope.author_icon === "ion-eye" ? "ion-eye-disabled" : "ion-eye";
    $scope.author_name = $scope.author_name === ldap_ui_text ? "anonymously" : ldap_ui_text;
    author_name = author_name === ldap ? "" : ldap;
  };

})


// NEW PIC END //



// NEW MEME TEMPLATE BEGINNING //


.controller('newmeme_templateCtrl',
  function($scope,$firebaseAuth,$state,$ionicViewSwitcher,$timeout,$firebaseArray,$ionicScrollDelegate,$cordovaFile,$cordovaImagePicker,$ionicPopup) {
    
  if(typeof analytics !== 'undefined') { analytics.trackView('new meme template'); }
    
  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var authData = fb_base.getAuth();
  var domain_cleared = window.localStorage['domain'];
  var meme_base;
  $scope.pictures = {};
  var step = 50;
  var new_posts_limit = step;
  $scope.filters =  '';
  $scope.moreDataCanBeLoaded = false;

  $scope.$watch("filters", function(newValue, oldValue) {
    $ionicScrollDelegate.scrollTop();
  });

  $scope.loadall = function(){
    new_posts_limit = 1000;
    settingScope();
  }

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  $scope._platform = ionic.Platform.platform();
  
  if(!authData || !domain_cleared) {
    //console.log('no user found');
    $state.go('login');
  } else {
    meme_base = fb_base.child('companies').child(domain_cleared).child('meme_templates');
    $scope.spinner_face = true;
    settingScope();
  }

  function settingScope() {
    meme_base.orderByChild('count').limitToLast(new_posts_limit).once('value', function(snap) {
      var all_memes = [];
      var i = 0;
      var child_amount = snap.numChildren();
      snap.forEach(function(childSnapshot) {
        if (childSnapshot.child("file").exists()) {
          all_memes[child_amount - 1 - i] = childSnapshot.val();
          all_memes[child_amount - 1 - i]._id = childSnapshot.key();
          // var format = childSnapshot.val().file.slice(childSnapshot.val().file.lastIndexOf(".") + 1, childSnapshot.val().file.length);
          all_memes[child_amount - 1 - i]._link = "http://res.cloudinary.com/dwrk9yrcg/image/upload/t_media_lib_thumb/templates/" + childSnapshot.val().file;
          if (i == child_amount - 1) {
            $scope.pictures = all_memes;
            $timeout(function() {
              $scope.spinner_face = false;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              // console.log('scroll complete called');
            });
            meme_base.once("value", function(snapshot2) {
              // Deadling with infinite scrolling
              if (new_posts_limit >= snapshot2.numChildren()) {
                $timeout(function() {
                  $scope.moreDataCanBeLoaded = false;
                });
                // console.log('no more data to load');
              } else {
                $timeout(function() {
                  $scope.moreDataCanBeLoaded = true;
                });
                // console.log('More data to load');
              }               
            });
          }
        }
        i++;
      });
    });
  }

  $scope.memeSelect = function(_ID, cloudinary_name) {
    var _format = cloudinary_name.slice(cloudinary_name.lastIndexOf(".") + 1, cloudinary_name.length);
    var result = { 
      'memeID': _ID,
      'format': _format
    };
    // console.log('meme id ' + meme_name);
    $ionicViewSwitcher.nextDirection('forward');
    $state.go('newmeme_copy', result);
  };

  $scope.loadMoreData = function() {
    // console.log('load more data called');
    new_posts_limit = new_posts_limit + step;
    settingScope();
  };

  $scope.newTemplate = function() {
    var options = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 70
    };
    $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      // console.log('Image URI: ' + results);
      if (results != '') {
        $scope.data = {};
        var myPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="data._name">',
          title: 'Give it a name',
          subTitle: "This will help you and your coworkers to find this template in the future.",
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>OK</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data._name) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  uploading_template($scope.data._name, results[0]);
                }
              }
            }
          ]
        });
      }
    }, function(error) {
      console.log('error: ' + error);
    });
  }

  function uploading_template(memeName, filePath){
    var pushing = meme_base.push({
      "title": memeName,
      "count": 0
    });
    var old_path = filePath.slice(0,filePath.lastIndexOf("/") + 1);
    // console.log('old_path ' + old_path);
    var old_file_name = filePath.slice(filePath.lastIndexOf("/") + 1,filePath.length);
    // console.log('old_file_name ' + old_file_name);
    var old_file_format = filePath.slice(filePath.lastIndexOf(".") + 1,filePath.length);
    // console.log('old_file_format ' + old_file_format);
    // var new_path = cordova.file.dataDirectory + 'meme_templates/' + pushing.key() + '.' + old_file_format;
    $cordovaFile.copyFile(old_path, old_file_name, cordova.file.dataDirectory + 'meme_templates/', pushing.key() + '.' + old_file_format)
    .then(function (success) {
      // console.log('success copy pic: ' + JSON.stringify(success));
      var result = { 
        'memeID': pushing.key(),
        'format': old_file_format
      };
      $ionicViewSwitcher.nextDirection('forward');
      $state.go('newmeme_copy', result);
    }, function (error) {
      // pushing.remove();
      console.log('error ' + JSON.stringify(error));
    });
  }

})


// NEW MEME TEMPLATE END //



// NEW MEME COPY BEGINNING //


.controller('newmeme_copyCtrl',
  function($rootScope,$scope,$firebaseAuth,$state,$ionicViewSwitcher,$timeout,$firebaseArray,$ionicScrollDelegate,$stateParams,$q,$cordovaFile,$cordovaFileTransfer,$window,$ionicLoading) {

  var memeID = $stateParams.memeID;
  var format = $stateParams.format;
  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var fb_meme;
  var authData = fb_base.getAuth();
  var domain_cleared = window.localStorage['domain'];
  var ldap = window.localStorage['ldap'];
  var author_name = ldap;
  var ldap_ui_text = 'as ' + ldap;
  var timestamp;

  if(!authData || !domain_cleared) {
    //console.log('no user found');
    $state.go('login');
  } else if (memeID === null) {
    $state.go('newmeme_template');
  } else {
    $scope.meme_text = {};
    $scope.author_icon = "ion-eye";
    $scope.author_name = 'as ' + ldap;
    fb_meme = fb_base.child('companies').child(domain_cleared).child('meme_templates').child(memeID);
    timestamp = Firebase.ServerValue.TIMESTAMP;
    // console.log('memeID ' + memeID);
    // console.log('format ' + format);
    var _promise = fileloading();
    _promise.then(function(file_resp) {
      // console.log('success with ' + file_resp);
      $scope._source = file_resp;
      canvasing();
    }, function(reason) {
      console.log('Failed because ' + reason);
      $state.go('newmeme_template');
    });
  }

  $scope._platform = ionic.Platform.platform();

  function template_upload() {
    // console.log('uploading in the background');
    fb_meme.child('file').once('value', function(dataSnapshot) {
      if(!dataSnapshot.exists()){
        // console.log('picture not listed in firebase yet');
        var server = "https://api.cloudinary.com/v1_1/dwrk9yrcg/image/upload";
        var options = {
          params : { 'upload_preset': 'ighiyaht'}
        };
        var filePath = cordova.file.dataDirectory + 'meme_templates/' + memeID + '.' + format;
        $cordovaFileTransfer.upload(server, filePath, options)
        .then(function(result) {
          // console.log('upload success');
          var response = JSON.stringify(result.response).replace(/\\"/g, '"');
          response = response.substr(1, response.length-2);
          var obj = JSON.parse(response);
          var id = obj.public_id;
          id = id.substring(id.indexOf("/") + 1);
          var file_format = "." + obj.format;
          var file_name = id + file_format;
          // console.log('file_name ' + file_name);
          fb_meme.child("file").set(file_name);
        });
      } else {
        // console.log('file already listed in Firebase');
      }
    });
  }

  function fileloading() {
    var file_link = $q.defer();
    // console.log('loading file for ' + memeID);
    $cordovaFile.checkFile(cordova.file.dataDirectory, 'meme_templates/' + memeID + '.' + format)
    .then(function (success) {
      // console.log(memeID + ' found locally');
      file_link.resolve(cordova.file.dataDirectory + 'meme_templates/' + memeID + '.' + format);
      template_upload();
    }, function (error) {
      // console.log(memeID + ' not found locally. Downloading...');
      fb_meme.once('value', function(dataSnapshot) {
        var file_name = dataSnapshot.val().file;
        var url = "http://res.cloudinary.com/dwrk9yrcg/image/upload/v1459013605/templates/" + file_name;
        var targetPath = cordova.file.dataDirectory + 'meme_templates/' + memeID + '.' + format;
        var trustHosts = true;
        var options = {};
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(function(result) {
          // console.log(memeID + ' downloaded');
          file_link.resolve(cordova.file.dataDirectory + 'meme_templates/' + memeID + '.' + format);
        }, function(err) {
          console.log('file not saved. Error message: ' + JSON.stringify(err));
          file_link.reject();
        });
      });
    });
    return file_link.promise;
  }

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  function canvasing(){
    var memeHeight;
    var memeWidth;
    //  Grab the nodes
    var img = document.getElementById('start-image');
    var topText = document.getElementById('top-text');
    var bottomText = document.getElementById('bottom-text');
    var canvas = document.getElementById('memecanvas');
    var ctx = canvas.getContext('2d');
    // When the image has loaded...
    img.onload = function() {
      var max_width = 0.95 * $window.innerWidth;
      var max_height = 0.60 * $window.innerHeight;
      var org_height = img.height;
      var org_width = img.width;
      if (img.width < img.height) {
        // console.log('pic is portrait');
        if (img.height > max_height) {
          // console.log('pic is too tall');
          var new_width = max_height * org_width / org_height;
          document.getElementById('start-image').height = max_height;
          document.getElementById('start-image').width = new_width;
        }
      } else {
        // console.log('pic is landscape');
        document.getElementById('start-image').width = max_width;
      }
      memeHeight = img.offsetHeight;
      memeWidth = img.offsetWidth;
      // console.log('memeHeight ' + memeHeight);
      // console.log('memeWidth ' + memeWidth);
      canvas.width = memeWidth;
      canvas.height = memeHeight;
      drawMeme();
    };

    topText.addEventListener('keydown', drawMeme);
    topText.addEventListener('keyup', drawMeme);
    topText.addEventListener('change', drawMeme);
    bottomText.addEventListener('keydown', drawMeme);
    bottomText.addEventListener('keyup', drawMeme);
    bottomText.addEventListener('change', drawMeme);

    function drawMeme() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, memeWidth, memeHeight);
      ctx.lineWidth  = 4;
      var font_size = 20;
      ctx.font = font_size + 'pt impact';
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.lineJoin = 'round';
      var maxWidth = memeWidth * 0.9;
      var lineHeight = font_size * 1.5;

      var text1 = document.getElementById('top-text').value;
      text1 = text1.toUpperCase();
      x = memeWidth / 2;
      y = 15;
      wrapText(ctx, text1, x, y, maxWidth, lineHeight, false);

      ctx.textBaseline = 'bottom';
      var text2 = document.getElementById('bottom-text').value;
      text2 = text2.toUpperCase();
      y = memeHeight - 15;
      wrapText(ctx, text2, x, y, maxWidth, lineHeight, true);
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight, fromBottom) {
      var pushMethod = (fromBottom)?'unshift':'push';
      lineHeight = (fromBottom)?-lineHeight:lineHeight;
      var lines = [];
      var y = y;
      var line = '';
      var words = text.split(' ');
      for (var n = 0; n < words.length; n++) {
        var testLine = line + ' ' + words[n];
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth) {
          lines[pushMethod](line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines[pushMethod](line);

      for (var k in lines) {
        context.strokeText(lines[k], x, y + lineHeight * k);
        context.fillText(lines[k], x, y + lineHeight * k);
      }
    }

  }

  $scope.upload = function() {
    // console.log('uploading image');
    var filePath = document.getElementById('memecanvas').toDataURL();
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    var server = "https://api.cloudinary.com/v1_1/dwrk9yrcg/image/upload";
    var options = {
      params : { 'upload_preset': 'REMOVED'}
    };
    $cordovaFileTransfer.upload(server, filePath, options)
    .then(function(result) {
      // console.log('upload success');
      var response = JSON.stringify(result.response).replace(/\\"/g, '"');
      response = response.substr(1, response.length-2);
      var obj = JSON.parse(response);
      var id = obj.public_id;
      id = id.substring(id.indexOf("/") + 1);
      var file_format = "." + obj.format;
      var file_name = id + file_format;
      // console.log('file_name ' + file_name);
      push_pic(file_name);
    }, function (error) {
      pushing.remove();
      // console.log('error ' + JSON.stringify(error));
    });
  }

  function push_pic(file_name) {
    // console.log('posting');
    var topText = $scope.meme_text.top;
    var bottomText = $scope.meme_text.bottom;
    var _copy = '';
    if (topText && !bottomText) {
      _copy = topText;
    } else if (!topText && bottomText) {
      _copy = bottomText;
    } else if (topText && bottomText) {
      if (topText == '' || bottomText == '') {
        _copy = topText + bottomText;
      } else {
        _copy = topText + ' - ' + bottomText;
      }
    }
    var pushing = fb_base.child('companies/' + domain_cleared + '/Posts').push({
      "author": authData.uid,
      "commentInt": 0,
      "content": _copy,
      "date": timestamp,
      "flagged": 0,
      "name": author_name,
      "score": 0,
      "votes": 0,
      "imgFile": file_name,
      'postType': 'meme'
    });
    fb_base.child('users/' + authData.uid + '/Posts/' + pushing.key()).set(true);
    fb_base.child('companies/' + domain_cleared + '/meme_templates/' + memeID + '/count').transaction(function (current_value) {
      return (current_value || 0) + 1;
    });
    $scope.meme_text.top = '';
    $scope.meme_text.bottom = '';
    $scope._source = '';
    $rootScope.viewer = 'date';
    $ionicLoading.hide();
    $ionicViewSwitcher.nextDirection('exit');
    $state.go('tab.discussions');
  };

  $scope.author_toggle = function(){
    $scope.author_icon = $scope.author_icon === "ion-eye" ? "ion-eye-disabled" : "ion-eye";
    $scope.author_name = $scope.author_name === ldap_ui_text ? "anonymously" : ldap_ui_text;
    author_name = author_name === ldap ? "" : ldap;
  };

})


// NEW MEME COPY END //



// POST DETAILS BEGINNING //


.controller('post_detailsCtrl', 
  function($scope,$firebaseAuth,$state,$ionicPopup,$firebaseArray,$stateParams,$ionicScrollDelegate,$ionicActionSheet,$ionicViewSwitcher,$timeout) {
    
  if(typeof analytics !== 'undefined') { analytics.trackView('post'); }

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
  
  $scope.comments = [];
  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var userID = window.localStorage['userID'];
  var ref_comments = fb_base.child("users/" + userID + '/Comments');
  var ref_fav = fb_base.child("users/" + userID + '/Favorites');
  var ref_comment_fav = fb_base.child("users/" + userID + '/CommentFavorites');
  var authData = fb_base.getAuth();
  var initial_posts_limit = 10;
  var step = 10;
  var new_posts_limit = initial_posts_limit;
  var postID = $stateParams.postID;
  var domain_cleared = window.localStorage['domain'];
  var ref_post = fb_base.child('companies/' + domain_cleared + '/Posts/' + postID);
  var ref_post_comments = ref_post.child('Comments');
  var email = window.localStorage['email'];
  var ldap = window.localStorage['ldap'];
  var ldap_ui_text = 'as ' + ldap;
  var author_name = ldap;
  var timestamp = Firebase.ServerValue.TIMESTAMP;

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  $scope._platform = ionic.Platform.platform();

  if(!authData) {
    //console.log('no user found');
    $state.go('login');
  } else if (postID == null) {
    //console.log('item ID not found');
    $state.go('tab.discussions','exit');
  } else {
    $scope.author_icon = "ion-eye";
    var timestamp = Firebase.ServerValue.TIMESTAMP;
    $scope.moreDataCanBeLoaded = true;
    $scope.author_name = 'as ' + ldap;
    var profile_icon = ldap.charAt(0);
    if (!profile_icon.match(/[a-z]/i)) {
      profile_icon = '#';
    }
    ref_post.on("value", function(snapshot) {
      if (snapshot.child("postType").val() == 'meme') {
        $scope.post_content = '';
      } else {
        $scope.post_content = snapshot.child("content").val();
      }
      if (snapshot.child("imgFile").exists()) {
        $scope.post_img = 'http://res.cloudinary.com/dwrk9yrcg/image/upload/c_limit,w_400/v1459453394/uploads/' + snapshot.child("imgFile").val();
      }
      $scope.post_author = snapshot.child("name").val();
      $scope.post_likes = snapshot.child("votes").val();
      $scope.post_author_ID = snapshot.child("author").val();
      $scope.post_comments = snapshot.child("commentInt").val();
      ref_fav.once("value", function(snapshot) {
        if (snapshot.child(postID).exists()) {
          // console.log('item now liked');
          $scope.fav = true;
        } else {
          // console.log('item not longer liked');
          $scope.fav = false;
        }
      });
    });
    settingScope(initial_posts_limit);
  }
  
  function settingScope(limit) {
    // console.log('settingScope called with limit ' + limit);
    ref_post_comments.limitToFirst(limit).on('value', function(snap) {
      // console.log('got snap of ref');
      // console.log('ref: ' + JSON.stringify(snap.val(), null, 2));
      if (snap.val() == null) {
        $scope.moreDataCanBeLoaded = false;
        return
      }
      var all_posts = [];
      var i = 0;
      angular.forEach(snap.val(), function(value, key) {
        all_posts[i] = value;
        all_posts[i].id = key;
        if(value.imgFile) {
          all_posts[i].imgsrc = 'http://res.cloudinary.com/dwrk9yrcg/image/upload/c_limit,w_400/v1459453394/uploads/' + value.imgFile;
          if (value.postType == 'meme') {
            all_posts[i].content_hide = true;
          }
        }
        function isFav(i,key) {
          //console.log('checking if favorite');
          ref_comment_fav.child(key).once('value', function(snapshot) {
            if (snapshot.exists()) {
              all_posts[i].fav = true;
            } else {
              all_posts[i].fav = false;
            }
            if (i == snap.numChildren() - 1) {
              $timeout(function() {
                $scope.spinner_face = false;
              });
              // console.log('$scope.list update');
              $scope.comments = all_posts;
              ref_post_comments.once("value", function(snapshot2) {
                // Deadling with infinite scrolling
                //console.log('snapshot2.numChildren() ' + snapshot2.numChildren());
                if (new_posts_limit >= snapshot2.numChildren()) {
                  $timeout(function() {
                    $scope.moreDataCanBeLoaded = false;
                  });
                  // console.log('no more data to load');
                } else {
                  $timeout(function() {
                    $scope.moreDataCanBeLoaded = true;
                  });
                  // console.log('More data to load');
                }               
              });
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          });
        }
        isFav(i,key)
        i++;
      });
    }, function (err) {
      console.log('error ' + err);
    });  
  }

  $scope.timeSince = function(date) {
    var seconds = Math.floor((new Date().getTime()/1000) - date/1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval + "y";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + "m";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + "m";
    }
    return "<1m";
  };
  
  $scope.toggle_Favorite = function(item_author) {
    // console.log('toggling post');
    var ref_post_votes = ref_post.child('votes');
    ref_fav.once("value", function(snapshot) {
      // console.log('ref_fav once found');
      if (snapshot.child(postID).exists()) {
        // console.log('child exists');
        ref_fav.child(postID).remove();
        ref_post_votes.transaction(function (current_value) {
          return (current_value || 0) - 1;
        });
        // console.log('child removed');
      } else {
        // console.log('child does not exist');
        ref_fav.child(postID).set("true");
        ref_post_votes.transaction(function (current_value) {
          return (current_value || 0) + 1;
        });
        // console.log('child added');
        if (item_author != userID) {
          fb_base.child('users').child(item_author).child('news').push({
            'type': 'upvote',
            'content_type': 'Post',
            'date': timestamp,
            'id': postID
          });
        }
      }
    });
    // console.log('toggling post DONE');
  };
  
  $scope.addFavorite = function(item_id, item_author) {
    var ref_comment_fav_ids = ref_comment_fav.child(item_id);
    var ref_post_comment_votes = ref_post.child('Comments/' + item_id + '/votes')
    ref_comment_fav.once("value", function(snapshot) {
      if (snapshot.child(item_id).exists()) {
        ref_comment_fav_ids.remove();
        ref_post_comment_votes.transaction(function (current_value) {
          return (current_value || 0) - 1;
        });
      } else {
        ref_comment_fav_ids.set("true");
        ref_post_comment_votes.transaction(function (current_value) {
          return (current_value || 0) + 1;
        });
        if (item_author != userID) {
          fb_base.child('users').child(item_author).child('news').push({
            'type': 'upvote',
            'content_type': 'Comment',
            'date': timestamp,
            'id': item_id
          });
        }
      }
    });
  };

  $scope.pressed = function(content, id) {
    $ionicActionSheet.show({
       destructiveText: 'Flag as inappropriate?',
       titleText: content,
       cancelText: 'Cancel',
       destructiveButtonClicked: function() {
            flagged(id);
            return true;
          },
       cancel: function(index) {
         return true;
       }
   });
  };
  
  function flagged(id) {
    var ref_post_comments_flags = ref_post.child('Comments/' + id + '/flagged');
    ref_post_comments_flags.transaction(function (current_value) {
      return (current_value || 0) + 1;
    });
    var alertPopup = $ionicPopup.alert({
      title: 'Thank you for reporting',
      template: 'We will take a look at this soon'
    });
  }
  
  $scope.entryDetails = function(item_id) {
    var result = { 'postID': item_id };
    $ionicViewSwitcher.nextDirection('forward');
    $state.go('post_details', result);
  };

  $scope.loadMoreData = function() {
    // console.log('load more data called');
    ref_post_comments.limitToLast(new_posts_limit).off();
    new_posts_limit = new_posts_limit + step;
    settingScope(new_posts_limit);
  };
  
  $scope.source_pic = function(image, name) {
    var source;
    if (name.indexOf("@") == -1) {
      source = "lib/animal_icons/" + image + ".png";
    } else {
      var image_cap = image.toUpperCase();
      source = "lib/avatar_letters/" + image_cap + ".png";
    }
    return source;
  };
  
  $scope.author_toggle = function(){
    $scope.author_icon = $scope.author_icon === "ion-eye" ? "ion-eye-disabled" : "ion-eye";
    $scope.author_name = $scope.author_name === ldap_ui_text ? "anonymously" : ldap_ui_text;
    author_name = author_name === ldap ? "" : ldap;
  };

  $scope.$on('elastic:resize', function(event, element, oldHeight, newHeight) {
    var height = 50;
    if (!$scope.comment_submit || $scope.comment_submit === '') {
      // sub_footer.style.height =  height + "px";
    } else {
      if (newHeight < height) (newHeight = height);
      newHeight = newHeight + 1;
      sub_footer.style.height =  newHeight + "px";
    }
  });
  
  $scope.push_message = function(){
    var post = $scope.comment_submit;
    if (post == '') {
      return
    }
    if (author_name == ''){
      var icons = ["bat_128px","bear_128px","bee_128px","bird_128px","bug_128px","butterfly_128px","camel_128px",
"cat_128px", "cheetah_128px", "chicken_128px", "coala_128px", "cow_128px", "crocodile_128px", "dinosaur_128px", "dog_128px",
"dolphin_128px", "dove_128px", "duck_128px", "eagle_128px", "elephant_128px", "fish_128px", "flamingo_128px",
"fox_128px", "frog_128px", "giraffe_128px" , "gorilla_128px", "horse_128px", "kangoroo_128px", "leopard_128px", "lion_128px",
"monkey_128px", "mouse_128px", "panda_128px", "parrot_128px" , "penguin_128px", "shark_128px", "sheep_128px", "snake_128px",
"spider_128px", "squirrel_128px", "star_fish_128px", "tiger_128px", "turtle_128px", "wolf_128px", "zebra_128px"];
      profile_icon = icons[Math.floor(Math.random() * icons.length)];
      
      var adjective;
      var noun;
      var request_adj = new XMLHttpRequest();
      request_adj.open("GET", "lib/fancy_names/adjectives.txt");
      request_adj.send();
      request_adj.onload = function() {
          var fileContent = this.responseText;
          var fileContentLines = fileContent.split( '\n' );
          var randomLineIndex = Math.floor( Math.random() * fileContentLines.length );
          adjective = fileContentLines[ randomLineIndex ];
          adjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
          
          var request_noun = new XMLHttpRequest();
          request_noun.open("GET", "lib/fancy_names/nouns.txt");
          request_noun.send();
          request_noun.onload = function() {
              var fileContent = this.responseText;
              var fileContentLines = fileContent.split( '\n' );
              var randomLineIndex = Math.floor( Math.random() * fileContentLines.length );
              noun = fileContentLines[ randomLineIndex ];
              noun = noun.charAt(0).toUpperCase() + noun.slice(1);
              author_name = adjective + " " + noun;
              pushing(post);
              author_name = '';
          };
      };
    } else {
      pushing(post);
    }
  };
  
  function pushing(post) {
    var pushing = ref_post_comments.push({
      "author": authData.uid,
      "content": post,
      "date": timestamp,
      "flagged": 0,
      "image": profile_icon,
      "name": author_name,
      "parentKey": postID,
      "votes": 0
    });
    ref_comments.child(pushing.key()).set(true);
    ref_post.child('commentInt').transaction(function (current_value) {
      return (current_value || 0) + 1;
    });
    if ($scope.post_author_ID != userID) {
      fb_base.child('users').child($scope.post_author_ID).child('news').push({
        'type': 'comment',
        'content_type': 'Post',
        'date': timestamp,
        'id': postID
      });
    }
    $scope.comment_submit = '';
    $ionicScrollDelegate.scrollBottom();
  }

  $scope.$on('$destroy',function(){
    // console.log('model destroying');
    ref_post_comments.limitToFirst(new_posts_limit).off();
  });

})

// POST DETAILS END //


// CHANGE PASSWORD BEGINN //


.controller('changepwCtrl', 
  function($scope,$firebaseAuth,$state,$ionicPopup,$ionicViewSwitcher) {

  if(typeof analytics !== 'undefined') { analytics.trackView('change password'); }

  $scope.pws = {};
  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var loginObj = $firebaseAuth(fb_base);
  var authData = fb_base.getAuth();
  enable_signup_button();

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  $scope._platform = ionic.Platform.platform();
    
  function enable_signup_button() {
    $scope.button_value = 'CHANGE';
    $scope.button_disabled = false;
    $scope.spinner_style = "display:none;";
  }

  if(!authData) {
    // console.log('no user found');
    $state.go('login'); 
  }
  
  $scope.changepw = function(){
    $scope.button_value = ' ';
    $scope.button_disabled = true;
    $scope.spinner_style = "spinner-energized;";
    var _oldpw = $scope.pws.oldpw;
    var _newpw1 = $scope.pws.newpw1;
    var _newpw2 = $scope.pws.newpw2;
    //console.log('_oldpw: ' + _oldpw + ' _newpw1: ' + _newpw1 + ' _newpw2: ' + _newpw2);
    var email = window.localStorage['email'];
    check_input();
        
    function check_input(){
      //console.log('checking input');
      if (_oldpw == undefined || _newpw1 == undefined || _newpw2 == undefined) {
        //console.log("Entry empty");
        alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'You cannot leave any fields blank'
        });
        enable_signup_button();
      } else if (_newpw1 != _newpw2) {
        //console.log("Passwords do not match");
        alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Your new password does not match'
        });
        enable_signup_button();
      } else if (_newpw1.length < 6) {
        //console.log("New password is too short");
        alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Please enter a longer password'
        });
        enable_signup_button();
      } else {
        //console.log('all entries look good');
        logging();
      }
    }

    function logging(){
      
      fb_base.changePassword({
        email: email,
        oldPassword: _oldpw,
        newPassword: _newpw1
      }, function(error) {
        if (error) {
          switch (error.code) {
            case "INVALID_PASSWORD":
              //console.log("The specified user account password is incorrect.");
              var alertPopup = $ionicPopup.alert({
                title: 'Current password not correct',
                template: 'Please re-enter the current password'
              });
              $scope._oldpw = '';
              enable_signup_button();
              break;
            default:
              //console.log("Error changing password:", error);
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please try again later'
              });
              enable_signup_button();
          }
        } else {
          //console.log("User password changed successfully!");
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: 'Your password is changed now'
          });
          $scope._oldpw = '';
          $scope._newpw1 = '';
          $scope._newpw2 = '';
          $ionicViewSwitcher.nextDirection('exit');
          $state.go('tab.discussions');
        }
      });
        
    }

  };

})


// CHANGE PASSWORD END //



// SETTINGS BEGINN //


.controller('settingsCtrl', 
  function($scope,$firebaseAuth,$state,$ionicViewSwitcher) {

  if(typeof analytics !== 'undefined') { analytics.trackView('settings'); }

  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var authData = fb_base.getAuth();

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  if(!authData) {
    // console.log('no user found');
    $state.go('login'); 
  }

  $scope._platform = ionic.Platform.platform();

  $scope.logout = function($event) {
    //console.log('logging out');
    window.localStorage['email'] = '';
    window.localStorage['userID'] = '';
    window.localStorage['ldap'] = '';
    window.localStorage['domain'] = '';
    window.localStorage['company'] = '';
    $state.go('login');
    fb_base.unauth();
  };

})


// SETTINGS END //



// NOTIFICATIONS BEGINN //


.controller('notificationsCtrl', 
  function($scope,$firebaseAuth,$state,$ionicViewSwitcher) {

  if(typeof analytics !== 'undefined') { analytics.trackView('notifications'); }

  var fb_base = new Firebase("https://glaring-fire-1308.firebaseio.com");
  var authData = fb_base.getAuth();

  $scope._platform = ionic.Platform.platform();

  $scope.go = function(where, direction) {
    $ionicViewSwitcher.nextDirection(direction);
    $state.go(where);
  }

  if(!authData) {
    // console.log('no user found');
    $state.go('login'); 
  }

});


// NOTIFICATIONS END //

