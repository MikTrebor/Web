var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('highScores.db');

//Set up display HTML

//Start our server
app.get('/', function(request, response) {
    response.sendFile(__dirname + "/index.html");

});

app.use(express.static(path.join(__dirname, 'public')));

var border = 4;
var empty = 5;
var counter = 0;
var maxPlayers = 2;
var players = [];
var board = [];
var size = 37;
var starts = [{
        position: {
            x: 4,
            y: 4
        },
        direction: "R"
    },
    {
        position: {
            x: size - 3,
            y: size - 3
        },
        direction: "L"
    },
    {
        position: {
            x: 4,
            y: size - 3
        },
        direction: "U"
    },
    {
        position: {
            x: size - 3,
            y: 4
        },
        direction: "D"
    },
    ];
var timer;
var speed = 100;

function addData(name, time) {
    db.all("SELECT * FROM TIMES", function(err, rows) {
        if (!err) {
            rows.forEach(function(row) {
                console.log(row.first_name, row.last_name);
            });
        }
    });
}

function resetBoard() {
    clearInterval(timer);
    for (var x = 0; x < size + 2; x++) {
        board[x] = [];
    }
    for (var x = 0; x < size + 2; x++) {
        board[0][x] = border;
        board[size + 1][x] = border;
        board[x][0] = border;
        board[x][size + 1] = border;
    }
    for (var x = 1; x < size + 1; x++) {
        for (var y = 1; y < size + 1; y++) {
            board[x][y] = empty;
        }
    }
    var inGame = 2;
    if (players.length < maxPlayers) {
        inGame = players.length;
    }
    for (var x = 0; x < inGame; x++) {
        players[x].position = starts[x].position;
        players[x].direction = starts[x].direction;
        addBlock(players[x]);
    }
    io.sockets.emit("update", board);
}

function addBlock(player) {
    board[player.position.x][player.position.y] = player.num;
}

function play() {
    console.log("play");
    timer = setInterval(function() {
        advance();
    }, speed);
}

function death(player) {
    resetBoard();
    for (var x = 0; x < maxPlayers; x++) {
        players[x].ready = false;
    }
    io.sockets.emit("died", board);
}

function advance() {
    for (var x = 0; x < maxPlayers; x++) {
        board[players[x].position.x][players[x].position.y] = players[x].num;
        players[x].position = newCoords(players[x]);
    }
    io.sockets.emit("turn", [players, maxPlayers]);
}

function newCoords(player) {
    var dir = player.direction;
    var x = player.position.x;
    var y = player.position.y;
    var coords = {
        x: 0,
        y: 0
    };
    if (dir == "R") {
        coords = {
            x: x + 1,
            y: y
        };
    }
    else if (dir == "L") {
        coords = {
            x: x - 1,
            y: y
        };

    }
    else if (dir == "U") { //flipped with d
        coords = {
            x: x,
            y: y - 1
        };
    }
    else if (dir == "D") {
        coords = {
            x: x,
            y: y + 1
        };
    }
    if (isSafe(coords.x, coords.y)) {
        return coords;
    }
    else {
        death(player);
        return coords;
    }
}

function isSafe(x, y) {
    return board[x][y] == empty;
}
io.on("connection", function(socket) {
    socket.emit("assigned", {
        num: counter,
        size: size,
        pos: starts[counter]
    });
    socket.on("assign", function(data) {
        players[data.player] = {
            name: data.id,
            num: data.player
        };
        resetBoard();

        console.log(players);
        counter++;
        if (players.length > maxPlayers) {
            socket.emit("full", [players, data.id, maxPlayers]);
        }
        else {
            io.sockets.emit("joined", [players, data.id]);
        }
    });
    socket.on("ready", function(data) {
        console.log("ready", data);
        players[data].ready = true;
        io.sockets.emit("ready", players);
        var allready = true;
        for (var x = 0; x < maxPlayers; x++) {
            if (!players[x].ready) {
                allready = false;
            }
        }
        if (allready) {
            io.sockets.emit("start", players);
            resetBoard();
            play();
        }
    });
    socket.on("move", function(data) {
        players[data.player].direction = data.direction;
    });


});

http.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started");
});
