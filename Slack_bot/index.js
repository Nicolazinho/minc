

// STAGING!!!!! //

var Botkit = require('botkit');
var controller = Botkit.slackbot({
  // debug: true
});
var BeepBoop = require('beepboop-botkit');
var beepboop = BeepBoop.start(controller, {
  // debug: true
});

var q = require('q');
var Sentiment140 = require('sentiment140');
var sentiment140 = new Sentiment140({
  auth: '[nicolas.ritz+sentiment140@gmail.com]'
});

function message_obj(bot, message, req_type) {
  this.message = message;
  this.req_type = req_type;
  this.bot = bot;
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, 'Nice to meet you all :wave:');
});

controller.on('direct_message,direct_mention,mention',function(bot, message) {
  // message.token = bot.config.SlackAccessToken;
  var messageTxt = message.text;
  if (messageTxt.indexOf('help') >= 0) {
    console.log('user asking for help');
    _message = new message_obj(bot, message);
    _message.bot.reply(_message.message,"You have two options to communicate with me:");
    var data = {
      as_user: true,
      attachments: [{
        "fallback": "What messages are hot right now? Eg. #social hot",
        "title": ':fire:What messages are hot right now?',
        "text": "I will tell you which items have most reactions attached to them relatively to their age. For example *#social hot*.",
        "color": "#A8DBA8",
        "mrkdwn_in": ["text"]
      }]
    };
    _message.bot.reply(_message.message, data, function(err, cb){
      console.log('message cb ' + JSON.stringify(cb));
    });
    var data2 = {
      as_user: true,
      attachments: [{
        "fallback": "How is the mood? Eg. #social mood yesterday",
        "title": ':chart_with_upwards_trend:How is the mood?',
        "text": "I will tell you how positive the messages have been on certain days or over a period. For example *#social mood yesterday*, *#everbody mood last week* or *#random mood 04/13/2016 - 04/29/2016*.",
        "color": "#A8DBA8",
        "mrkdwn_in": ["text"]
      }]
    };
    _message.bot.reply(_message.message, data2, function(err, cb){
      console.log('message cb ' + JSON.stringify(cb));
    });
  } else if (messageTxt.indexOf('mood') >= 0) {
    console.log('user asking for mood');
    _message = new message_obj(bot, message, 'mood');
    var hasNumber = /\d/;
    var contains_numbers = hasNumber.test(_message.message.text);
    if (hasNumber.test() || _message.message.text.indexOf("today") > -1 || _message.message.text.indexOf("yesterday") > -1 || _message.message.text.indexOf("week") > -1 || _message.message.text.indexOf("month") > -1 || _message.message.text.indexOf("year") > -1) {
      readable_chan(_message).then(get_channel(_message));
    } else {
      _message.bot.reply(_message.message, "Mood for which timeframe? If you need help please ask 'help'");
    }
  } else if (messageTxt.indexOf('hot') >= 0) {
    console.log('user asking for hot');
    _message = new message_obj(bot, message, 'hot');
    readable_chan(_message).then(get_channel(_message));
  } else if (messageTxt.indexOf('hi') >= 0 || messageTxt.indexOf('hello') >= 0) {
    console.log('user saying hi');
    _message = new message_obj(bot, message);
    // console.log('bot ' + JSON.stringify(bot));
    console.log('message ' + JSON.stringify(message));
    _message.bot.reply(_message.message, "Hi there :grinning:");
  } else {
    _message.bot.reply(_message.message, "Sorry I didn't get that :confused: If you need help please ask 'help'");
  }
});

function get_channel(_message) {
  // console.log('message: ' + JSON.stringify(_message.message));
  var text = _message.message.text;
  if (text.indexOf("<#") > -1 && text.indexOf(">") > -1) {
    _message.req_channel = text.substring(text.lastIndexOf("<#") + 2, text.lastIndexOf(">"));
    // _message.bot.reply(_messagemessage, "_message.req_channel is " + _message.req_channel);
    _message.bot.reply(_message.message, "Let me look that up for you... :mag:");
    if (_message.req_type == 'mood') {
      get_time(_message);
    } else {
      var now = new Date();
      load_hot(_message, 0, now, [], 0, 0);
    }
  } else if (text.indexOf("#") > -1) {
    _message.req_channel = text.substring(text.lastIndexOf("#") + 1, text.len);
    _message.bot.reply(_messagemessage, "I'm sorry but I cannot find channel #" + _message.req_channel);
  } else {
    _message.bot.reply(_message.message, "Please tell me which channel you want me look up by adding a # before it eg. _#social_.");
  }
}

function readable_chan(_message) {
  console.log('in readable_chan');
  var deferred = q.defer();
  var data = {
    token: _message.bot.config.SlackAccessToken,
    exclude_archived: 0
  }
  _message.bot.api.channels.list(data, function(err, response){
    if (err) {
      deferred.reject('');
    } else {
      response.channels.forEach(function(channeldetails) {
        if (_message.req_channel == channeldetails.id) {
          deferred.resolve(channeldetails.name);
        }
      });
    }
  });
  _message.readable_channel = deferred.promise;
  return deferred.promise;
}

function get_time(_message) {
  var start_day;
  var end_day;
  var display_time;
  var text = _message.message.text;
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var lastmidnight = day_string(now);
  if (text.indexOf("today") > -1) {
    start_day = lastmidnight / 1000;
    end_day = Date.parse(now);
    var month = now.getMonth() + 1;
    display_time = 'for today, ' + month + '/' + now.getDate() + '/' + now.getFullYear();
  } else if (text.indexOf("yesterday") > -1) {
      start_day = (lastmidnight - 86400000) / 1000;
      end_day = lastmidnight / 1000;
      var yesterday = new Date(lastmidnight - 86400000);
      var month = yesterday.getMonth() + 1;
      display_time = 'for yesterday, ' + month + '/' + yesterday.getDate() + '/' + yesterday.getFullYear();
  } else if (text.indexOf("week") > -1 && text.indexOf("this") > -1 ) {
      start_day = day_string(new Date(today.setDate(today.getDate()-today.getDay()))) / 1000;
      end_day = Date.parse(now);
      display_start = new Date(start_day  * 1000);
      display_start_month = display_start.getMonth() + 1;
      display_end = new Date(end_day);
      display_end_month = display_end.getMonth() + 1;
      display_time = 'between ' + display_start_month + '/' + display_start.getDate() + '/' + display_start.getFullYear() + ' and ' + display_end_month + '/' + display_end.getDate() + '/' + display_end.getFullYear();
  } else if (text.indexOf("week") > -1 && text.indexOf("last") > -1 ) {
    var lastSunday = new Date(today.setDate(today.getDate()-today.getDay()));
      start_day = (day_string(lastSunday) - 604800000) / 1000;
      end_day = day_string(lastSunday) / 1000;
      display_start = new Date(start_day  * 1000);
      display_start_month = display_start.getMonth() + 1;
      display_end = new Date((end_day - 86400) * 1000);
      display_end_month = display_end.getMonth() + 1;
      display_time = 'between ' + display_start_month + '/' + display_start.getDate() + '/' + display_start.getFullYear() + ' and ' + display_end_month + '/' + display_end.getDate() + '/' + display_end.getFullYear();
  } else if (text.indexOf("month") > -1 && text.indexOf("this") > -1 ) {
      start_day = day_string(new Date(today.setDate(today.getMonth()-today.getMonth()+1))) / 1000;
      end_day = Date.parse(now);
        display_start = new Date(start_day  * 1000);
        display_start_month = display_start.getMonth() + 1;
        display_end = new Date(end_day);
        display_end_month = display_end.getMonth() + 1;
        display_time = 'between ' + display_start_month + '/' + display_start.getDate() + '/' + display_start.getFullYear() + ' and ' + display_end_month + '/' + display_end.getDate() + '/' + display_end.getFullYear();
      } else if (text.indexOf("week") > -1 && text.indexOf("last") > -1 ) {
  } else if (text.indexOf("month") > -1 && text.indexOf("last") > -1 ) {
    var lastfirst = new Date(today.setDate(today.getMonth()-today.getMonth()+1));
    var last_month = new Date(lastfirst.setDate(-1));
    var beforefirst = new Date(last_month.setDate(last_month.getMonth()-last_month.getMonth()+1));
    start_day = day_string(beforefirst) / 1000;
    end_day = day_string(new Date(today.setDate(today.getMonth()-today.getMonth()+1))) / 1000;
    display_start = new Date(start_day  * 1000);
    display_start_month = display_start.getMonth() + 1;
    display_end = new Date((end_day - 86400) * 1000);
    display_end_month = display_end.getMonth() + 1;
    display_time = 'between ' + display_start_month + '/' + display_start.getDate() + '/' + display_start.getFullYear() + ' and ' + display_end_month + '/' + display_end.getDate() + '/' + display_end.getFullYear();
  } else if (text.indexOf("year") > -1 && text.indexOf("this") > -1 ) {
    start_day = day_string(new Date(new Date().getFullYear(), 0, 1)) / 1000;
    end_day = Date.parse(now);
    display_start = new Date(start_day  * 1000);
    display_start_month = display_start.getMonth() + 1;
    display_end = new Date(end_day);
    display_end_month = display_end.getMonth() + 1;
    display_time = 'between ' + display_start_month + '/' + display_start.getDate() + '/' + display_start.getFullYear() + ' and ' + display_end_month + '/' + display_end.getDate() + '/' + display_end.getFullYear();
  } else if (text.indexOf("year") > -1 && text.indexOf("last") > -1 ) {
    start_day = day_string(new Date(new Date().getFullYear() - 1, 0, 1)) / 1000;
    end_day = day_string(new Date(new Date().getFullYear(), 0, 1)) / 1000;
    display_start = new Date(start_day  * 1000);
    display_start_month = display_start.getMonth() + 1;
    display_end = new Date((end_day - 86400) * 1000);
    display_end_month = display_end.getMonth() + 1;
    display_time = 'between ' + display_start_month + '/' + display_start.getDate() + '/' + display_start.getFullYear() + ' and ' + display_end_month + '/' + display_end.getDate() + '/' + display_end.getFullYear();
  } else if (contains_numbers) {
    if (text.indexOf("/") > -1) {
      var number_array = text.split('/');
      var input_month1 = number_array[0].slice(-2);
      var input_day1 = number_array[1].slice(-2);
      var input_year1 = number_array[2].slice(0, 4);
      start_day = Date.parse(input_month1 + "/" + input_day1 + "/" + input_year1) / 1000;
      if (isNaN(start_day)) {
        _message.bot.reply(_message.message, "Sorry I don't understand your date. Please use the structure 'MM/DD/YYYY' eg. _04/29/2016_ or _04/13/2016 - 04/29/2016_");
        return false;
      }
      if (number_array.length > 3) {
        var input_month2 = number_array[2].slice(-2);
        var input_day2 = number_array[3].slice(-2);
        var input_year2 = number_array[4].slice(0, 4);
        end_day = Date.parse(input_month2 + "/" + input_day2 + "/" + input_year2) / 1000;
      } else {
        end_day = start_day + 86400;
      }
      if (isNaN(end_day)) {
        _message.bot.reply(_message.message, "Sorry I don't understand your date. Please use the structure 'MM/DD/YYYY' eg. _04/29/2016_ or _04/13/2016 - 04/29/2016_");
        return false;
      }
    } else {
      _message.bot.reply(_message.message, "Sorry I don't understand your date. Please use the structure 'MM/DD/YYYY' eg. _04/29/2016_ or _04/13/2016 - 04/29/2016_");
      return false;
    }
  } else {
    _message.bot.reply(_message.message, "I don't understand your timeframe requested. Please use something like _today_, _this week_, _last month_, _04/29/2016_ or _04/13/2016 - 04/29/2016_");
    return false;
  }
  load_history(start_day,end_day,display_time,_message,0,0,true);
}

function day_string(date) {
  var timestamp_month = date.getMonth() + 1; //months from 1-12
  var timestamp_day = date.getDate();
  var timestamp_year = date.getFullYear();
  var end =  Date.parse(timestamp_month + "/" + timestamp_day + "/" + timestamp_year);
  return end;
}

function load_history(start_day,end_day,display_time,_message,sum,counter,first_time) {
  // console.log('loading history with: req_channel ' + _message.req_channel + ' start_day ' + start_day + ' end_day ' + end_day);
  var data = {
    token: _message.bot.config.SlackAccessToken,
    channel: _message.req_channel,
    latest: end_day,
    oldest: start_day,
    inclusive: 1,
    count: 1000
  };
  _message.bot.api.channels.history(data, function(err, response){
    if (err) {
      console.log('_message.bot.api.channels.history ' + JSON.stringify(err, null, 2));
      _message.bot.reply(_message.message,"There was an error :sweat:");
    } else {
      // console.log(JSON.stringify(response, null, 2));
      if (response.messages != '') {
        var len = response.messages.length;
        var split_count = 0;
        response.messages.forEach(function(item) {
          // console.log('item.text ' + item.text);
          check_sentiment(item.text).then(function(sentiment) {
            // console.log('Promise Resolved!', sentiment);
            counter ++;
            split_count ++;
            sum = sum + sentiment;
            if (split_count == len) {
              if (response.has_more) {
                console.log('yes');
                if (first_time) {
                  _message.bot.reply(_message.message,"Wow, there are many messages to look at. :sweat_smile: Hang tight!");
                }
                load_history(item.ts + 1,end,display_time,_message,sum,counter,false);
              } else {
                var average = Math.round(sum / 4 / counter * 100);
                _message.bot.reply(_message.message,"The mood " + display_time + " was " + average + "% positive. :thumbsup:");
              }
            }
          });
        })
      } else {
        _message.bot.reply(_message.message, "I cannot find any entries " + display_time);
      }
    }
  });
}

function check_sentiment(text_to_check) {
  var clean_text = text_to_check.replace(/[^a-zA-Z ]/g, "");
  var deferred = q.defer();
  var dataSimple = {
    "data": {
        "text": clean_text
    }
  }
  if (clean_text == '' || clean_text == ' ') {
    deferred.resolve(2);
  } else {
    sentiment140.sentiment(dataSimple, function(error, result) {
      if (error) {
        console.log('error: ' + error);
      } else {
        // console.log(clean_text + ' has ' + JSON.stringify(result.polarity));
        deferred.resolve(result.polarity);
      }
    });
  }
  return deferred.promise;
}

function load_hot(_message, start, end, hot_array, messages_counter, hot_counter) {
  // console.log('loading hot');
  var gravity = 1.8;
  var data = {
    token: _message.bot.config.SlackAccessToken,
    channel: _message.req_channel,
    latest: end,
    oldest: start,
    inclusive: 1,
    count: 1000
  };
  _message.bot.api.channels.history(data, function(err, response){
    if (err) {
      console.log('_message.bot.api.channels.history ' + JSON.stringify(err, null, 2));
      _message.bot.reply(_message.message, "There was an error :sweat:");
    } else {
      // console.log(JSON.stringify(response, null, 2));
      if (response.messages == '') {
        _message.bot.reply(_message.message, "I cannot find any entries in that channel :cry:");
      } else {
        var len = response.messages.length;
        response.messages.forEach(function(item) {
          // console.log('item ' + JSON.stringify(item, null, 2));
          if (item.reactions || (item.file && item.file.reactions)) {
            // If item or file has reactions ...
            // console.log('item ' + JSON.stringify(item, null, 2));
            var react_counter = 0;
            var react_sum = 0;
            var reactions_items = [];
            if (item.reactions) {
              // If reaction is directly added to item
              item.reactions.forEach(function(react) {
                // console.log('react-ions ' + JSON.stringify(react));
                react_sum = react_sum + react.count;
                var display_reaction = ":" + react.name + ":";
                var display_count = react.count + "x";
                reactions_items.push({
                  "count": display_count,
                  "name": display_reaction
                });
                react_counter ++;
                if (react_counter == item.reactions.length) {
                  var now = new Date().getTime()/1000.0;
                  var since_h = (now - item.ts) / 3.6e+6;
                  var score = Math.round(1000000 * react_sum / Math.pow((since_h + 2), gravity));
                  if (item.attachments && item.attachments[0] && item.attachments[0].image_url) {
                    var image_url = item.attachments[0].image_url;
                  } else {
                    var image_url = false;
                  }
                  var post_user = (item.user) ? item.user : item.bot_id;
                  // console.log('reactions_items ' + JSON.stringify(reactions_items, null, 2));
                  var newObj = {
                    'text': item.text,
                    'hot_score': score,
                    'ts': item.ts,
                    'user': post_user,
                    'image': image_url,
                    'num_reactions': react_counter,
                    'reactions_items': reactions_items
                  };
                  hot_array.push(newObj);
                }
              });
            } else {
              // If reaction is added to a file
              item.file.reactions.forEach(function(react) {
                react_sum = react_sum + react.count;
                var display_reaction = ":" + react.name + ":";
                var display_count = react.count + "x";
                reactions_items.push({
                  "count": display_count,
                  "name": display_reaction
                });
                react_counter ++;
                if (react_counter == item.file.reactions.length) {
                  var now = new Date().getTime()/1000.0;
                  var since_h = (now - item.ts) / 3.6e+6;
                  var score = Math.round(1000000 * react_sum / Math.pow((since_h + 2), gravity));
                  var image_url = item.file.permalink;
                  var post_user = (item.user) ? item.user : item.bot_id;
                  var newObj = {
                    'text': item.text,
                    'hot_score': score,
                    'ts': item.ts,
                    'user': post_user,
                    'image': image_url,
                    'num_reactions': react_counter,
                    'reactions_items': reactions_items
                  };
                  hot_array.push(newObj);
                }
              });
            }
          }
          messages_counter ++;
          if (messages_counter == len) {
            if (response.has_more) {
              //TKTK do I have to stop at one point? currently checking channel until beginning
              load_hot(_message, 0, item.ts + 1, hot_array, messages_counter, hot_counter);
              return false;
            } else {
              // console.log(JSON.stringify(hot_array, null, 2));
              hot_array.sort(function(a, b) {
                  return parseFloat(b.hot_score) - parseFloat(a.hot_score);
              });
              // console.log(JSON.stringify(hot_array, null, 2));
              if (hot_array.length == 0) {
                _message.bot.reply(_message.message, "No reactions found in that channel.\nOnce we have reactions you can see what messages are hot.");
              } else {
                _message.bot.reply(_message.message, "Currently the 5 hottest messages in <#" + _message.req_channel + "|" + _message.readable_channel + "> are:");
                hot_array.forEach(function(output) {
                  // console.log('output ' + JSON.stringify(output));
                  // console.log('hot_counter ' + hot_counter);
                  if (hot_counter < 5) {
                    hot_counter ++;
                    var link_ts = output.ts * 1000000;
                    readable_user(_message, output.user).then(function(name) {
                      var display_name = '';
                      if (name) {
                        display_name = '<@' + output.user + '|' + name + '>';
                      } else {
                        display_name = '_unknown_';
                      }
                      var reaction_list = '';
                      for (var items in output.reactions_items) {
                        reaction_list += output.reactions_items[items]["count"] + output.reactions_items[items]["name"] + ' ';
                      }
                      var data = {
                        as_user: true,
                        attachments: [{
                          "fallback": output.text + ": https://mincapp.slack.com/archives/" + _message.readable_channel + "/p" + link_ts,
                          "title": output.text,
                          "title_link": "https://mincapp.slack.com/archives/" + _message.readable_channel + "/p" + link_ts,
                          "text": 'By ' + display_name + ' with ' + output.num_reactions + ' reactions:\n' + reaction_list,
                          "image_url": output.image,
                          "color": "#0B486B"
                        }]
                      };
                      _message.bot.reply(_message.message, data, function(err, cb){
                        console.log('message cb ' + JSON.stringify(cb));
                      });
                    });
                  } else {
                    return false;
                  }
                });
              }
            }
          }
        })
      }
    }
  });
}

function readable_user(_message, userID) {
  // console.log('userID ' + userID);
  var deferred2 = q.defer();
  var data = {
    token: _message.bot.config.SlackAccessToken,
    user: userID
  }
  _message.bot.api.users.info(data, function(err, response){
    if (err || !response.user) {
      // console.log(' _message.bot.api.users.info err ' + JSON.stringify(err));
      deferred2.resolve(false);
    } else {
      // console.log('response ' + JSON.stringify(response, null, 2));
      deferred2.resolve(response.user.name);
    }
  });
  return deferred2.promise;
}

