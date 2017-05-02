var cheerio = require("cheerio");
var request = require("request");

var url = "http://www.kuilin.net/cc/clan.php?tag=2RP2YCV0";

var players = [];

request(url, function(error, response, html) {
	if (!error && response.statusCode == 200) {
		// console.log(html);
		var $ = cheerio.load(html);

		// var membersTable = $("table");
		// console.log(membersTable);
		// var id = "";
		// var name = "";
		// var pos = "";
		// var exp = "";
		// var trophies = "";
		// var donates = "";
		// var receives = "";
		// var finalData = {
		// 	id: id,
		// 	name: name,
		// 	pos: pos,
		// 	trophies: parseInt(trophies),
		// 	donates: parseInt(donates),
		// 	receives: parseInt(receives)
		// }
		$('td.bigted').each(function(index, element) {
			console.log(element.prev())
		});
	}
	else {
		console.log(error);
	}
});
