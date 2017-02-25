var nflconfs = ["NFC", "AFC"];
var nfcdivs = ["NFC North", "NFC South", "NFC East", "NFC West"]
var afcdivs = ["AFC North", "AFC South", "AFC East", "AFC West"];
var nfcteams = ["Bears", "Lions", "Packers", "Vikings", "Falcons", "Panthers", "Saints", "Buccaneers", "Cowboys", "Giants", "Eagles", "Redskins", "Cardinals", "Rams", "49ers", "Seahawks"];
var afcteams = ["Ravens", "Bengals", "Browns", "Steelers", "Texans", "Colts", "Jaguars", "Titans", "Bills", "Dolphins", "Patriots", "Jets", "Broncos", "Chiefs", "Raiders", "Chargers"];
var NFL = ["NFL", nflconfs, nfcdivs, afcdivs, nfcteams, afcteams,
document.getElementById("NFLStart"), "#003B66", "#D71019", "#C4CED4", "#FF8F8F"];

var nbaconfs = ["West", "East"]
var westdivs = ["Southwest", "Northwest", "Pacific"];
var eastdivs = ["Southeast", "Central", "Atlantic"];
var westteams = ["Mavericks", "Rockets", "Grizzlies", "Pelicans", "Spurs", "Nuggets", "Timberwolves", "Thunder", "Trail Blazers", "Jazz", "Warriors", "Clippers", "Lakers", "Suns", "Kings"];
var eastteams = ["Hawks", "Hornets", "Heat", "Magic", "Wizards", "Bulls", "Cavaliers", "Pistons", "Pacers", "Bucks", "Celtics", "Nets", "Knicks", "76ers", "Raptors"];
var NBA = ["NBA", nbaconfs, westdivs, eastdivs, westteams, eastteams,
document.getElementById("NBStart"), "#ED174B", "#0366AC", "#BB9856", "#C4CED4"];

window.onload = function() {
	document.getElementById("tables").className = "divHide";
	document.getElementById("form").className = "divHide";
	document.getElementById("startButton").className = "divHide";
}

var curTime = 5;
var mode;
var clickedNum = 0;
var numAnswered;
var myInt;
var score = 0;
var leagues = [NFL, NBA];

function startGame() {
	if (clickedNum == 0) {
		document.getElementById("tables").className = "divShow";
		document.getElementById("form").className = "divShow";
		document.getElementById("startButton").innerHTML = "Reset"
		document.getElementById("timer").innerHTML = numToTime(curTime);
		myInt = window.setInterval(decrementTime, 1000);
		window.setInterval(checkInput, 1);
		clickedNum++;
	}
	else if (clickedNum == 1) {
		document.getElementById("team").disabled = true;
		clearInterval(myInt);
		console.log("second click");
		document.getElementById("startButton").innerHTML = "Start";
		clickedNum++;
	}
	else {
		window.location.reload();
	}
}

function scoreGame() {
	return "Score: " + score + " out of " + mode[4].length * 2 + " teams";
}

function checkInput() {
	var input = document.getElementById("team").value + "";
	input = input.toLowerCase();
	input = input.charAt(0).toUpperCase() + input.slice(1);

	if ((mode[4].indexOf(input) >= 0) || (mode[5].indexOf(input) >= 0)) {
		if (document.getElementById(input).innerHTML == "") {
			score++;
			document.getElementById(input).innerHTML = input;
			document.getElementById("form").reset()
			if (score == mode[4].length * 2) {
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
	console.log("mode:" + mode);
	var div1table = document.getElementById("div1table");
	var div2table = document.getElementById("div2table");
	div1table.innerHTML = "";
	div2table.innerHTML = "";

	fillTable(div1table, mode[2], mode[4], mode[7], mode[9]);
	fillTable(div2table, mode[3], mode[5], mode[8], mode[10]);


	document.getElementById("NFLStart").className = "divHide";
	document.getElementById("NBAStart").className = "divHide";

	document.getElementById("startButton").className = "divShow";
	document.getElementById("team").className = "divShow";
	document.getElementById("timer").innerHTML = "Press Start to begin"
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
		teamCell.style.backgroundColor = color;
		var team = document.createElement("b");
		team.id = teams[y * 4 + rowNum];
		teamCell.appendChild(team);
		row.appendChild(teamCell);
	}
	return row;
}
