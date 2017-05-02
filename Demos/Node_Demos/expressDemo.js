var express = require("express")();
var http = require("http").Server(express);

express.get('/', function(request, response) {
    response.write("Hi there. Welcome.");
    response.end();
});
express.get("/Lab1/", function(request, response) {
    //stuff for lab 1
    response.sendFile("index.html");
})
http.listen(process.env.PORT, process.env.IP, function() {
    console.log("someone arrived");
})
