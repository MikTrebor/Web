var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

//Set up display HTML

//Start our server
app.get('/', function(request, response) {
    response.sendFile(__dirname + "/index.html");

});

io.on("connection", function(socket) {
    // console.log(socket);
    socket.on("cmessage", function(data) {
        // console.log(data);
        io.sockets.emit("smessage", data);

    });

});

http.listen(process.env.PORT, process.env.IP, function() {
    console.log("someone arrived");
});
