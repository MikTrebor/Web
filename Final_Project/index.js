/*************************Head start*************************/
var express = require("express");
var app = express();
var http = require("http");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require("path");
var Hand = require('pokersolver').Hand;

app.get('/', function(request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.use(express.static(path.join(__dirname, 'public')));
/*************************Head end****************************/

/*************************Code start****************************/
/*Start conditions*/
var start_chips = 100;
/******************/
var middle = [];
var pot = 0;
var players = [
/*{
    username: null,
    chips: 0,
    betted: false,
    record:{wins:0,losses:0},
    lasthand:[]
}*/
/*template*/
];
var hands = [];

var numPlayers = 0;
var deckId = "b9uk65jssqop";
io.on("connection", function(socket) {
    socket.on("test", function() {
        TESTING();
    });
    io.sockets.emit("joinPlayer", {
        gameSize: numPlayers,
        startChips: start_chips,
        players: players,
    });
    socket.on("joined", function(data) {
        var temp = {
            username: data[0],
            chips: data[2],
            betted: 0,
            record: data[3],
            lasthand: [],
            dealt: false
        };
        // console.log(data);
        temp.id = socket.id;
        // temp.key = uid;
        //console.log(temp.id);
        players.splice(data[1], 0, temp);
        hands.splice(data[1], 0, []);
        numPlayers++;
        io.sockets.emit("refresh", players);
    });
    socket.on("betted", function(data) {
        players[data[0]].betted = data[1];
        pot += parseInt(data[1]);
        players[data[0]].chips -= data[1];
        io.sockets.emit("newbet", [players, pot]);
        console.log(players);
        var temp = true;
        for (var x = 0; x < players.length; x++) {
            if (players[x].betted == 0 || !players[x].dealt) {
                temp = false;
            }
        }
        if (temp) { //everyone betted and was dealt
            playRound();
        }
    });
    socket.on("dealMeIn", function(data) {
        players[data].dealt = true;
        // console.log(data, players)
        dealCards(data);

    });
    socket.on("cmessage", function(data) {
        // console.log(data);
        io.sockets.emit("smessage", data);

    });

});

function playRound() {
    if (middle.length < 5) {
        // console.log("middle", middle)
        revealMiddle();
    }
    else {
        announceWinner();
    }
    resetTurn();
}

function resetGame() {
    for (var x = 0; x < players.length; x++) {
        hands[x] = [];
        middle = [];
        players[x].dealt = false;
    }
    pot = 0;
    resetTurn();
    io.sockets.emit("restart", players);
}

function resetTurn() {
    for (var x = 0; x < players.length; x++) {
        players[x].betted = 0;
    }
    io.sockets.emit("resetTurn", players);
}
shuffleDeck();
// TESTING();
var reps = 0;

function TESTING() {
    console.log('testing');
    // shuffleDeck();
    if (reps < 5) {
        revealMiddle();
    }
    if (reps < 2) {
        getHands();
    }
    if (reps >= 5) {
        announceWinner();
    }
    reps++
}

function shuffleDeck() {
    http.get({
        host: 'deckofcardsapi.com',
        path: '/api/deck/new/shuffle/?deck_count=1'
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var parsed = JSON.parse(body);
            deckId = parsed.deck_id;
        });
    });
}

// function getHands() {
//     for (var x = 0; x < players.length; x++) {
//         dealCard(x);
//     }
//     // console.log(hands);
// }

function dealCards(index) { //https://github.com/goldfire/pokersolver and https://deckofcardsapi.com/
    // if (hands[index].length < 2) {
    for (var x = 0; x < 2; x++) {
        drawCard(function(data) {
            //console.log(data);
            hands[index].push(data);
            io.to(players[index].id).emit("dealHand", hands[index]);
        }, 1);
    }
    // }
}

function drawCard(callback, count) {
    http.get({
        host: 'deckofcardsapi.com',
        path: '/api/deck/' + deckId + '/draw/?count=' + count
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var parsed = JSON.parse(body);
            callback(convertRawCard(parsed.cards[0]));
        });
    });
}

function announceWinner() {
    bestHand(function(data) {
        var winningHand = data[0][0];
        var allHands = data[1];
        players[winningHand.id].record.wins += 1;
        players[winningHand.id].chips += pot
        for (var x = 0; x < players.length; x++) {
            if (x != winningHand.id) {
                players[x].record.losses += 1;
            }
            players[x].hand;
        }
        var descr = winningHand.descr;
        var id = winningHand.id;
        io.sockets.emit("solve", [descr, id, hands, players, allHands]);
        resetGame();
    });
}

function bestHand(callback) {
    var temp = [];
    for (var x = 0; x < hands.length; x++) {
        temp.push(evalHand(x));
    }
    var data = [Hand.winners(temp), temp];
    callback(data);
}

function evalHand(id) {
    var temp = [];
    for (var x = 0; x < hands[id].length; x++) {
        temp.push(hands[id][x].code);
    }
    for (var x = 0; x < middle.length; x++) {
        temp.push(middle[x].code);
    }
    var hand = Hand.solve(temp);
    hand.id = id;
    return hand;
}

function revealMiddle() {
    if (middle.length < 3) {
        for (var x = 0; x < 3; x++) {
            drawCard(function(data) {
                middle.push(data);
                //console.log("middle", middle);
                io.sockets.emit("revealMiddle", middle);
            }, 1);
        }
    }
    else if (middle.length < 5) {
        drawCard(function(data) {
            middle.push(data);
            //console.log("middle", middle);
            io.sockets.emit("revealMiddle", middle);
        }, 1);
    }
}

function convertRawCard(rawCard) {
    var processedCard = {
        suit: null,
        value: null,
        code: null,
        image: null
    };
    if (rawCard.suit == "CLUBS") {
        processedCard.suit = "c";
    }
    else if (rawCard.suit == "HEARTS") {
        processedCard.suit = "h";
    }
    else if (rawCard.suit == "DIAMONDS") {
        processedCard.suit = "d";
    }
    else if (rawCard.suit == "SPADES") {
        processedCard.suit = "s";
    }
    if (rawCard.value == "0") {
        processedCard.value = "T";
    }
    else if (rawCard.value == "JACK") {
        processedCard.value = "J";
    }
    else if (rawCard.value == "QUEEN") {
        processedCard.value = "Q";
    }
    else if (rawCard.value == "KING") {
        processedCard.value = "K";
    }
    else if (rawCard.value == "ACE") {
        processedCard.value = "A";
    }
    else {
        processedCard.value = rawCard.value;
    }
    processedCard.image = rawCard.image;
    processedCard.code = processedCard.value + processedCard.suit;
    return processedCard;
}

/*************************Code end****************************/

/************************Foot start************************/
server.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started");
});
/************************Foot end**************************/
