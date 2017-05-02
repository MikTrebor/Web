window.onload = function() {
	document.getElementById("tables").className = "divHide";
	document.getElementById("form").className = "divHide";
	document.getElementById("startButton").className = "divHide";
};
//var leaguename = ["leaguename",	confs,	div1,	div2,	div1teams,	div2teams,
//					0				1		2		3		4			5
//					div1headcolor,	div2headcolor,	div1color,	div2color]
//					6				7				8			9

var nflconfs = ["NFC", "AFC"];
var nfcdivs = ["NFC North", "NFC South", "NFC East", "NFC West"];
var afcdivs = ["AFC North", "AFC South", "AFC East", "AFC West"];
var nfcteams = ["Bears", "Lions", "Packers", "Vikings", "Falcons", "Panthers", "Saints", "Buccaneers", "Cowboys", "Giants", "Eagles", "Redskins", "Cardinals", "Rams", "49ers", "Seahawks"];
var afcteams = ["Ravens", "Bengals", "Browns", "Steelers", "Texans", "Colts", "Jaguars", "Titans", "Bills", "Dolphins", "Patriots", "Jets", "Broncos", "Chiefs", "Raiders", "Chargers"];
var NFL = ["NFL", nflconfs, nfcdivs, afcdivs, nfcteams, afcteams,
			"#003B66", "#D71019", "#C4CED4", "#FF8F8F"];
var nbaconfs = ["West", "East"];
var westdivs = ["Southwest", "Northwest", "Pacific"];
var eastdivs = ["Southeast", "Central", "Atlantic"];
var westteams = ["Mavericks", "Rockets", "Grizzlies", "Pelicans", "Spurs", "Nuggets", "Timberwolves", "Thunder", "Trail Blazers", "Jazz", "Warriors", "Clippers", "Lakers", "Suns", "Kings"];
var eastteams = ["Hawks", "Hornets", "Heat", "Magic", "Wizards", "Bulls", "Cavaliers", "Pistons", "Pacers", "Bucks", "Celtics", "Nets", "Knicks", "76ers", "Raptors"];
var NBA = ["NBA", nbaconfs, westdivs, eastdivs, westteams, eastteams,
			"#ED174B", "#0366AC", "#BB9856", "#C4CED4"];

var nhlconfs = ["West", "East"];
var westerndivs = ["Pacific", "Central"];
var easterndivs = ["Metropolitan", "Atlantic"];
var westernteams = ["Ducks", "Flames", "Oilers", "Kings", "Coyotes", "Sharks", "Canucks", "noteam", "Blackhawks", "Avalanche", "Stars", "Wild", "Predators", "Blues", "Jets", "noteam"];
var easternteams = ["Hurricanes", "Blue Jackets", "Devils", "Islanders", "Rangers", "Flyers", "Penguins", "Capitals", "Bruins", "Sabres", "Red Wings", "Panthers", "Canadiens", "Senators", "Lightning", "Maple Leafs"];
var NHL = ["NHL", nhlconfs, westerndivs, easterndivs, westernteams, easternteams,
			"#103469", "#B90B24", "#BCD8EC", "#FBBCCF"];

var mlbconfs = ["American", "National"];
var aldivs = ["East", "Central", "West"];
var nldivs = ["East", "Central", "West"];
var alteams = ["Red Sox", "Yankees", "Rays", "Blue Jays", "Orioles", "noteam", "Tigers", "Indians", "White Sox", "Royals", "Twins", "noteam", "Rangers", "Mariners", "Angels", "Athletics", "noteam", "noteam"];
var nlteams = ["Phillies", "Braves", "Mets", "Nationals", "Marlins", "noteam", "Brewers", "Cardinals", "Reds", "Pirates", "Cubs", "Astros", "Giants", "Diamondbacks", "Rockies", "Dodgers", "Padres", "noteam"];
var MLB = ["MLB", mlbconfs, aldivs, nldivs, alteams, nlteams,
			"#103469", "#B90B24", "#BCD8EC", "#FBBCCF"];



var curTime = 300;
var mode;
var clickedNum = 0;
var myInt;
var score = 0;
var leagues = [NFL, NBA, NHL, MLB];
var lowerdiv1 = [];
var lowerdiv2 = [];
var irreg = 0;
var illegals = [];

function startGame() {
	if (clickedNum == 0) {
		console.log(lowerdiv1);
		console.log(lowerdiv2);
		for (var s in mode[4]) {
			lowerdiv1.push(mode[4][s].toLowerCase().replace(" ", ""));
			if (mode[4][s].toLowerCase().replace(" ", "") == "noteam") {
				irreg++;
			}
		}
		for (var s in mode[5]) {
			lowerdiv2.push(mode[5][s].toLowerCase().replace(" ", ""));
			if (mode[5][s].toLowerCase().replace(" ", "") == "noteam") {
				irreg++;
			}
		}
		document.getElementById("tables").className = "divShow";
		document.getElementById("form").className = "divShow";
		document.getElementById("startButton").innerHTML = "Reset";
		document.getElementById("timer").innerHTML = numToTime(curTime);
		myInt = window.setInterval(decrementTime, 1000);
		window.setInterval(checkInput, 1);
		clickedNum++;
	}
	else if (clickedNum == 1) {
		document.getElementById("team").disabled = true;
		clearInterval(myInt);
		document.getElementById("startButton").innerHTML = "Start";
		clickedNum++;
	}
	else {
		window.location.reload();
	}
}

function scoreGame() {
	document.getElementById("team").disabled = true;
	return "Score: " + score + " out of " + (mode[4].length + mode[5].length - irreg) + " teams";
}

function checkInput() {
	var input = document.getElementById("team").value + "";
	input = input.toLowerCase().replace(" ", "");
	if (input != "" && input != "noteam" && illegals.indexOf(input) == -1) {

		var indiv1 = lowerdiv1.indexOf(input);
		var indiv2 = lowerdiv2.indexOf(input);
		if (indiv1 != -1 || indiv2 != -1) {
			if (indiv1 > indiv2) {
				document.getElementById(input).innerHTML = mode[4][indiv1];
			}
			else if (indiv2 > indiv1) {
				document.getElementById(input).innerHTML = mode[5][indiv2];
			}
			illegals.push(input);
			score++;
			document.getElementById("form").reset();
			if (score == (mode[4].length + mode[5].length - irreg)) {
				document.getElementById("timer").innerHTML = scoreGame();
				clearInterval(myInt);
			}
		}
	}
}

function numToTime(num) {
	if (num > 0) {
		if (num % 60 == 0) {
			return Math.floor(num / 60) + ":00";
		}
		else if (num % 60 < 10) {
			return Math.floor(num / 60) + ":0" + (num % 60);
		}
		else if (num % 60 >= 10) {
			return Math.floor(num / 60) + ":" + (num % 60);
		}
	}
	return scoreGame();
}

function decrementTime() {
	curTime--;
	document.getElementById("timer").innerHTML = numToTime(curTime);
}

function createTable(league) {
	mode = league;
	var div1table = document.getElementById("div1table");
	var div2table = document.getElementById("div2table");
	div1table.innerHTML = "";
	div2table.innerHTML = "";
	fillTable(div1table, mode[2], mode[4], mode[6], mode[8]);
	fillTable(div2table, mode[3], mode[5], mode[7], mode[9]);
	for (var x = 0; x < leagues.length; x++) {
		var curleague = document.getElementById(leagues[x][0] + "Start");
		curleague.className = "divHide";
	}
	document.getElementById("startButton").className = "divShow";
	document.getElementById("team").className = "divShow";
	document.getElementById("timer").innerHTML = "Press Start to begin";
}

function fillTable(table, divs, teams, headcolor, bodycolor) {
	table.appendChild(makeHeader(divs, headcolor, teams));
	for (var x = 0; x < teams.length / divs.length; x++) {
		table.appendChild(makeRow(teams, x, divs.length, bodycolor));
	}
}

function makeHeader(divs, color, teams) {
	var header = document.createElement("tr");
	for (var x = 0; x < divs.length; x++) {
		var col = document.createElement("th");
		col.style.backgroundColor = color;
		var head = document.createElement("h2");
		head.innerHTML = divs[x];
		col.appendChild(head);
		header.appendChild(col);
	}
	return header;
}

function makeRow(teams, rowNum, divCount, color) {
	var row = document.createElement("tr");
	for (var y = 0; y < divCount; y++) {
		var teamCell = document.createElement("td");
		var team = document.createElement("b");
		team.id = teams[y * (teams.length / divCount) + rowNum].toLowerCase().replace(" ", "");
		if (teams[y * (teams.length / divCount) + rowNum] == "noteam") {
			teamCell.style.backgroundColor = "grey";
		}
		else {
			teamCell.style.backgroundColor = color;
		}
		teamCell.appendChild(team);
		row.appendChild(teamCell);
	}
	return row;
}
