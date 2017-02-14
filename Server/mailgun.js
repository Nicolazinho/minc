
var Firebase = require("firebase");

var FBref = new Firebase("https://glaring-fire-1308.firebaseio.com");

var api_key = 'REMOVED';
var domain = 'email.minc.co';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

// function set_prio(company_key) {
//     var now = new Date();
//     FBref.child('companies/' + company_key + '/Posts').once('value', function(posts) {
//         posts.forEach(function(snap) {
//             var votes = snap.val().votes;
//             var date = snap.val().date;
//             var since_h = (now - date) / 3.6e+6;
//             var priority = Math.round(1000000 * votes / Math.pow((since_h + 2), gravity));
//             FBref.child('companies/' + company_key + '/Posts').child(snap.key()).child('score').set(priority);
//         });
//     });
    

// }

FBref.authWithCustomToken("REMOVED", function(error, authData) {
  if (error) {
    //console.log('Error authenticating');
  } else {
    //console.log("Success authenticating");
    FBref.child('users').on('child_added', function(snapshot) {
        if(snapshot.val().email && snapshot.val().token && snapshot.val().status == 'applied') {
            var data = {
              from: 'Minc <welcome@minc.co>',
              to: snapshot.val().email,
              subject: 'Please confirm your email for Minc',
              body: 'Welcome to Minc! Please click http://www.minc.co/email_confirm?tk=' + snapshot.val().token + '&ui=' + snapshot.key() + '&ea=' + snapshot.val().email + ' to confirm your email address.',
              html: 'Welcome to Minc!<p>Please click <a href="http://www.minc.co/email_confirm?tk=' + snapshot.val().token + '&ui=' + snapshot.key() + '&ea=' + snapshot.val().email + '">here</a> to confirm your email address.<p>'
            };
            mailgun.messages().send(data, function (error, body) {
              console.log(body);
            });
        }
    });   
  }
});