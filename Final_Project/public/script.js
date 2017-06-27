var socket = io();
var index = -1;
var chips = 0;
var username = null;
var hand = [];
var players = [];
var middle = [];
var record;
var pnames = [];
var pchips = [];
var precords = [];
var phands = [];
var pbets = [];
var defaultChips;
var user;
var uid;
var password;
var maxLength = 10;
var messages = [];
var pot = 0;

var idref = firebase.database().ref("users/");
socket.on("joinPlayer", function(data) {
    if (index < 0) {
        username = prompt("What is your username?");
        checkIfUserExists(username, data, function(data) {
            socket.emit("joined", data, function(data) {
                parsePlayers(players);
                refAll();
            });
        });
    }
    else {
        parsePlayers(players);
        refAll();
    }

});
socket.on("refresh", function(data){
    parsePlayers(data);
    refAll();
})

function userExistsCallback(userId, exists, data, callback2) {
    if (exists) {
        var ref = firebase.database().ref();
        ref.once("value", function(snapshot) {
                user = snapshot.val().users[userId];
                console.log("user", user)
                chips = user.chips;
                record = user.wins_losses;
                var defaultChips = data.startChips;
                index = data.gameSize;
                players = data.players;
                console.log([userId, data.gameSize, user.chips, user.wins_losses])
                callback2([userId, data.gameSize, user.chips, user.wins_losses]);
            },
            function(error) {
                console.log("Error: " + error.code);
            });
    }
    else {
        submitMessage(username, data.startChips, {
            wins: 0,
            losses: 0
        });
    }
}

function checkIfUserExists(userId, data, callback2) {
    idref.child(userId).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        userExistsCallback(userId, exists, data, callback2);
    });
}

function submitMessage(username, chips, dubsnLs) {
    var entry = firebase.database().ref("users/" + username);
    entry.update({
        // password: password,
        chips: chips,
        wins_losses: dubsnLs
    });
    var op = rootRef.child("data2send");
}

function highestRoller() {
    var topC = pchips[0];
    var topSpot = 0;
    for (var x = 0; x < pchips.length; x++)
        if (pchips[x] > topC) {
            topC = pchips[x];
            topSpot = x;
        }
    var dis = firebase.database().ref('/ids').orderByChild("chips").equalTo(players[topSpot].username).once('value').then(function(snapshot) {
        var ret = snapshot.val().name;
    });
    $("#highRoll").html(dis + " has the most chips with " + topC + " chips.");
}
socket.on("revealMiddle", function(data) {
    showMiddle(data);
    refAll();
});
socket.on("dealHand", function(data) {
    showHand(data);
});
socket.on("solve", function(data) {
    var allHands = data[4];
    console.log("allhands", allHands)
    var players = data[3];
    var winner = players[data[1]].username;
    // data[2] are the hands
    revealAll(data);
    $("#announcements").html(winner + " has won the round with a " + data[0]);
});
socket.on("resetTurn", function(data) {
    $('#betted').prop('disabled', false);
});
socket.on("restart", function(data) {
    $('#betted').prop('disabled', true);
    $('#dealMeIn').prop('disabled', false);
    $("#p1 tr td img").each(function() {
        $(this).attr("src", "http://chetart.com/blog/wp-content/uploads/2012/05/playing-card-back.jpg");
    });
    $(".mid").each(function() {
        $(this).attr("src", "http://chetart.com/blog/wp-content/uploads/2012/05/playing-card-back.jpg");
    });
    submitMessage(data[index].username, data[index].chips, data[index].record);
});
socket.on("newbet", function(data) {
    console.log("newbetdata", data)
    $("#pot").html("Pot: " + data[1]);
    parsePlayers(data[0]);
    refBets(data[0]);
    refChips();
    // displayOthers(data);
});
/*******************CHAT*******************************/
socket.on("smessage", function(data) {
    fillMessages(messages, data)
});

function fillMessages(messages, obj) {
    messages.push(obj);
    if (messages.length > 5) {
        messages.shift();
    }
    for (var x = 1; x <= messages.length; x++) {
        console.log(x)
        document.getElementById("speaker").innerHTML = username;
        document.getElementById("chat" + x + "").innerHTML = messages[x - 1].name + ": " + messages[x - 1].message;
    }
}

function sendChat() {
    var name1 = username //document.getElementById("speaker").innerHTML;

    var object = {
        name: name1,
        message: document.getElementById("input").value
    };
    socket.emit("cmessage", object);
}
/*******************CHAT*******************************/
function revealAll() { //data0=descr data1=winner data2 =cards data3 = players data4 = losinghands
    refPicked();
}

function parsePlayers(opps) {
    var myPlayer = opps.splice(index, 1);
    opps.splice(0, 0, myPlayer[0]);
    console.log(opps);
    for (var x = 0; x < opps.length; x++) {
        pbets[x] = opps[x].betted;
        pnames[x] = opps[x].username;
        pchips[x] = opps[x].chips;
        phands[x] = opps[x].lasthand;

        precords[x] = [opps[x].record.wins, opps[x].record.losses];
    }
    console.log("bets", pbets, "names", pnames, "chips", pchips, "hands", phands, "records", precords);
}

function displayOthers(opps) {
    parsePlayers(opps);
    // for (var)
    //     $.each(players, function() {
    //         $("table tr th #name").each(this, function(name, value) {
    //             console.log(name + '=' + value);
    //         });
    //     });
    /*for (var x = 0; x < players.length; x++) {
        =players.username
        =players.id
        =players.record
        =players.chips
        =players.lasthand
        =bets
    }*/
}

function refAll() {
    refBets();
    refNames();
    refChips();
    refRecords();
    refPicked();
}

function refBets() {
    var count = 0;
    $("#announcements").text("Place your bets");
    console.log("pbets", pbets);
    for (var x = 0; x < pbets.length; x++) {
        $(".bet").each(function() {
            console.log(count, "bets", pbets[count]);
            $(this).text(pbets[count]);
            count++;
        });
    }
}

function refNames() {
    console.log('refnames')
    var count = 0;
    for (var x = 0; x < pnames.length; x++) {
        $(".name").each(function() {
            $(this).text(pnames[count]);
            count++;
        });
    }
}

function refChips() {
    console.log('refchips')
    var count = 0;
    for (var x = 0; x < pchips.length; x++) {
        $(".chips").each(function() {
            $(this).text(pchips[count]);
            count++;
        });
    }
}

function refRecords() {
    var count = 0;
    for (var x = 0; x < precords.length; x++) {
        $(".record").each(function() {
            $(this).text(precords[count][0] + "-" + precords[count][1]);
            count++;
        });
    }
}

function refPicked() {
    console.log('refpicked')
    var count = 0;
    for (var x = 0; x < phands.length; x++) {
        $(".picked").each(function() {
            $(this).text(phands[count]);
            count++;
        });
    }
}

function showHand(cards) {
    var count = 0;
    $("#p1 tr td img").each(function() {
        $(this).attr("src", cards[count].image);
        count++;
    });
}

function test() {
    parsePlayers()
}

function betted() {
    var betAmt = $("#betamount").val();
    $('#betted').prop('disabled', true);
    socket.emit("betted", [index, betAmt]);
}

function dealMeIn() {
    console.log(index);
    $('#betted').prop('disabled', false);
    $('#dealMeIn').prop('disabled', true);
    socket.emit("dealMeIn", index);
}

function showMiddle(cards) {
    var count = 0;
    $(".mid").each(function() {
        $(this).attr("src", cards[count].image);
        count++;
    });
}
