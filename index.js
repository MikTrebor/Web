var express = require("express")();
var http = require("http").Server(express);

// express.use(express.static('web-2018rkim'));

express.get('/', function(request, response) {
    response.sendFile(__dirname + "/index.html");

});
express.get("/Lab*", function(request, response) {
    //stuff for lab 1
    response.sendFile(__dirname + request.originalUrl + "_Content/index.html");
});
http.listen(process.env.PORT, process.env.IP, function() {
    console.log("someone arrived");
});
