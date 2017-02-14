//Score = (P-1) / (T+2)^G
//P = points of an item (and -1 is to negate submitters vote)
//T = time since submission (in hours)
//G = Gravity, defaults to 1.8 in news.arc

var Firebase = require("firebase");
var CronJob = require('cron').CronJob;

var FBref = new Firebase("https://glaring-fire-1308.firebaseio.com");
var gravity = 1.8;

function set_prio(company_key) {
    var now = new Date();
    FBref.child('companies/' + company_key + '/Posts').once('value', function(posts) {
        posts.forEach(function(snap) {
            var votes = snap.val().votes;
            var date = snap.val().date;
            var since_h = (now - date) / 3.6e+6;
            var priority = Math.round(1000000 * votes / Math.pow((since_h + 2), gravity));
            FBref.child('companies/' + company_key + '/Posts').child(snap.key()).child('score').set(priority);
        });
    });
    
    //FBref.child('Posts').child(childSnapshot.key()).setPriority(priority);
    //FBref.child('companies/' + child_key + '/Posts').child(childSnapshot.key()).child('score').set(priority);
}

new CronJob('*/30 * * * * *', function() {

    FBref.authWithCustomToken("REMOVED", function(error, authData) {
      if (error) {
        //console.log('Error authenticating');
      } else {
        //console.log("Success authenticating");
        FBref.child('companies').once('value', function(snapshot) {
            snapshot.forEach(function(child) {
                if (child.key() != "company_names") {
                    set_prio(child.key());
                }
            });
        });   
      }
    });
    
    

}, null, true, 'America/Los_Angeles');
