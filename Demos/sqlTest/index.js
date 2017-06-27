var express = require("express");
var app = express();
var http = require("http").Server(app);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('day1Test.db');

app.get('/', function(request, response) {
    response.sendFile(__dirname + "/index.html");

});

app.get("/takeNewCandy", function(request, response) {
    console.log(request.query);
    addData(request.query.candyName, request.query.candyColor);
    response.end("New Candy Received");
});

http.listen(process.env.PORT, process.env.IP, function() {
    console.log("someone arrived");
});

function addData(type, color) {
    db.all("SELECT * FROM CANDY", function(err, rows) {
        if (!err) {
            rows.forEach(function(row) {
                console.log(row.first_name, row.last_name);
            });
        }
    });
}


db.close();
