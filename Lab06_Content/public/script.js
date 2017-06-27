var name = prompt("What's your name?");
//var name = "robert";
var dir = "R";
var playerNum = 0;
var socket = io();
var playing = false;
var size = 0;
var scale = 10;
var colorKey = ["red", "blue", "green", "yellow", "black", "grey"];
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) {
        console.log("L");
        dir = "L";
        if (playing) {
            socket.emit("ready", playerNum);
            playing = false;
        }
        move();
    }
    else if (event.keyCode == 38) {
        console.log("U");
        dir = "U";
        if (playing) {
            socket.emit("ready", playerNum);
            playing = false;
        }
        move();
    }
    else if (event.keyCode == 39) {
        console.log("R");
        dir = "R";
        if (playing) {
            socket.emit("ready", playerNum);
            playing = false;
        }
        move();
    }
    else if (event.keyCode == 40) {
        console.log("D");
        dir = "D";
        if (playing) {
            socket.emit("ready", playerNum);
            playing = false;
        }
        move();
    }
});
socket.on("assigned", function(data) {
    playerNum = data.num;
    size = data.size;
    if (playerNum < size) {
        colorKey[colorKey.length - 2] = colorKey[playerNum];
    }
    socket.emit("assign", {
        player: playerNum,
        id: name
    });
});
socket.on("joined", function(data) {
    for (var x = 0; x < data[0].length; x++) {
        $("#p1" + (x - 1)).html(data[0][x].name);
        // console.log(x);
        // $("p").slice(0, x + 2).each(function(index) {
        //     this.html(data[0][x].name);
        // });
        // $("s").slice(0, x + 2).html("Online");
    }
    playing = true;
});
socket.on("start", function(data) {
    playing = false;
});
socket.on("full", function(data) {
    console.log("game is full");
    if (data[2] == 2) {
        $("#p1").html(data[0][0].name);
        $("#p2").html(data[0][1].name);
    }
    if (data[2] == 4) {
        $("#p1").html(data[0][0].name);
        $("#p2").html(data[0][1].name);
        $("#p3").html(data[0][2].name);
        $("#p4").html(data[0][3].name);
    }
    $("s").each(function(index) {
        $(this).html("Online");
    });
    playing = false;
});
socket.on("died", function(data) {
    console.log(data);
    drawBoard(data);
    playing = true;
});
socket.on("update", function(data) {
    drawBoard(data);
});
socket.on("turn", function(data) {
    var players = data[0];
    for (var x = 0; x < data[1]; x++) {
        drawPiece(players[x].position.x, players[x].position.y, players[x].num);
    }
});
socket.on("ready", function(data) {

});

function move() {
    socket.emit("move", {
        direction: dir,
        player: playerNum
    });
}

function drawBoard(board) {
    for (var x = 0; x < board.length; x++) {
        for (var y = 0; y < board[0].length; y++) {
            drawPiece(x, y, board[x][y]);
        }
    }
}

function drawPiece(x, y, col) {
    var c = document.getElementById("board");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = colorKey[col];
    ctx.rect(x * scale, y * scale, scale, scale);
    ctx.fill();
}
