var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");

var error = function(err, response, body) {
    // console.log(response.headers.status);
    console.log('ERROR [%s]', err);
    console.log(err);
};
var success = function(data) {
    var res = JSON.parse(data);

    for (var x = 0; x < res.length; x++) {
        console.log("ID:", res[x].id);
        console.log("Text:", res[x].text);
        console.log("Replied?", res[x].is_quote_status);
        console.log("Retweeted?", res[x].retweeted);
        console.log("Liked?", res[x].favorited);
        act(res[x].id, res[x].text, res[x].is_quote_status, res[x].retweeted, res[x].favorited);
        console.log();
    }
    // console.log('Data [%s]', data);
};

var Twitter = require('twitter-node-client').Twitter;

//Get this data from your twitter apps dashboard
var config = {
    "consumerKey": "UkbBQ9Uct0m8ln5CcOgTQYzQO",
    "consumerSecret": "CTclvn5hQB0e599PjLyBMCyvFngtX5xhXiD0VAWUD9Hx4ywXki",
    "accessToken": "4483830316-UuKJpyz1BVIkfune5qKckr23UjMfOtq5TCQjxIZ",
    "accessTokenSecret": "OvxDULt1bK2uTCbanesMFyuAcdCrVpTtPpYNP6fdBGSI8",
    "callBackUrl": "https://www.twitter.com"
};

var twitter = new Twitter(config);

//Example calls

twitter.getUserTimeline({
        user_id: 2806661296,
        count: '15',
        exclude_replies: true,
        include_rts: false
    }, error,
    success);

doRetweet("867199082808397800", false, true);

function act(id, text, replied, retweeted, favorited) {
    var objectives = hasObjective(text);
    console.log(objectives);
    // doReply(id, replied, objectives.reply);
    doFavorite(id, favorited, objectives.favorite);
    doRetweet(id, retweeted, objectives.retweet);
}

function hasObjective(text) {
    var objectives = {
        favorite: false,
        reply: false,
        retweet: false
    };
    if (text.match(/like/i) || text.match(/fav/i)) {
        objectives.favorite = true;
    }
    if (text.match(/reply/i)) {
        objectives.reply = true;
    }
    if (text.match(/retweet/i) || text.match(/rt/i)) {
        objectives.retweet = true;
    }
    return objectives;
}

function doReply(id, did, need) {
    if (need && !did) {
        console.log("need to reply");
    }
}

function doFavorite(id, did, need) {
    if (need && !did) {
        twitter.postCustomApiCall("/favorites/create", id, error, success);
    }
}

function doRetweet(id, did, need) {
    if (need && !did) {
        console.log("try to rt");
        twitter.postRetweet("/statuses/retweet/" + id + ".json", id, error, success);
    }
}
