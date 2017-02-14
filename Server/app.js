
'use strict';

var express = require('express');
var http = require('http');
var https = require('https');
var Firebase = require("firebase");
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
// var logging = require('winston');

//var search = require('./flashlight/app.js');
// Next line commented out to save server ressources
// var hot = require('./hot.js');
var mailgun = require('./mailgun.js');

var app = express();
app.use("/public", express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json()); 
app.use('/', express.static('guri_guri'));

app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', function(req, res){ 
  var ea = req.body.ea;
  var ref = new Firebase("https://glaring-fire-1308.firebaseio.com");
  ref.authWithCustomToken("REMOVED", function(error, authData) {
    //console.log("Authenticated successfully with payload:", authData);
    ref.child('/users/launchUpdate').push({
      "email": ea,
      "date": Firebase.ServerValue.TIMESTAMP
    });
  });
  res.send(true);
});

app.get('/email_confirm', function(req, res) {
  
  var ui = req.query.ui;
  var tk = req.query.tk;
  var ea = req.query.ea;
  var ref = new Firebase("https://glaring-fire-1308.firebaseio.com");

  ref.authWithCustomToken("REMOVED", function(error, authData) {
    if (error) {
      res.sendFile(__dirname + '/public/server_error.html');
    } else {
      //console.log("Authenticated successfully with payload:", authData);
      ref.child('users/' + ui).once('value', function(snap) {
        if (snap.val() == null) {
          res.sendFile(__dirname + '/public/email_error.html');
        } else {
          if (tk == snap.val().token && ea == snap.val().email) {
            ref.child('/users/' + ui).update({
              "status": 'confirmed',
              "token": null
            });
            ref.child('applicants/domains/' + snap.val().company).once('value', function(snapshot) {
              if (snapshot.val().whitelisted == true) {
                res.sendFile(__dirname + '/public/email_success.html');
              } else {
                res.sendFile(__dirname + '/public/email_waiting.html');
              }
            });
          } else {
            res.sendFile(__dirname + '/public/email_error.html');
          }
        }
      });      
    }
  });

});

app.get('/slack', function (req, res) {
  res.sendFile(__dirname + '/guri_guri/slack.html');
});

app.get('/slack-error', function (req, res) {
  res.sendFile(__dirname + '/guri_guri/slack_error.html');
});

app.get('/privacy', function (req, res) {
  res.sendFile(__dirname + '/public/privacy.html');
});

app.get('/robots.txt', function (req, res) {
  res.sendFile(__dirname + '/public/robots.txt');
});

app.get('/sitemap', function (req, res) {
  res.sendFile(__dirname + '/public/sitemap.xml');
});

app.use("*",function(req,res){
  res.sendFile(__dirname + "/public/404.html");
});

// [START server]
// Start the server
var server = app.listen(process.env.PORT || 8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
// [END server]