var cheerio = require("cheerio");
var request = require("request");

var url = "https://www.espn.com";

request(url, function(error, response, html) {
    if (!error && response.statusCode == 200) {
        // console.log(html);
        var $ = cheerio.load(html);
        $("a").each(function(index, element) {
            console.log(element.attribs.href);
        });
    }
    else {
        console.log(error);
    }
});
