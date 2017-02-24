window.onload = function() {
	createTable();
}
var curTime = 300;
var clicked = false;
var mode;

function startGame() {
	console.log("button clicked");
	if (!clicked) {
		document.getElementById("timer").innerHTML = numToTime(curTime);
		window.setInterval(decrementTime, 1000);
		//	window.setInterval(checkInput, 10);
		clicked = true
	}
}

function checkInput() {
	console.log("checking input");
	var input = document.getElementById("league").innerHTML;
	console.log("input:" + input);
	if (mode == "NFL") {
		if ((afcteams.indexOf(input) >= 0) || (nfcteams.indexOf(input) >= 0)) {
			document.getElementById(input).innerHTML = input;
		}
	}
	else {
		if ((westteams.indexOf(input) >= 0) || (eastteams.indexOf(input) >= 0)) {
			document.getElementById(input).innerHTML = input;
		}
	}
}

function numToTime(num) {
	if (num % 60 == 0) {
		return Math.round(num / 60) + ":" + "00";
	}
	else {
		return (Math.round(num / 60) - 1) + ":" + (num % 60);
	}
}

function decrementTime() {
	console.log("decrementtTime was called");
	curTime--;
	document.getElementById("timer").innerHTML = numToTime(curTime);
	checkInput();
}

var NFL = "NFL";
var nfcdivs = ["NFC North", "NFC South", "NFC East", "NFC West"]
var afcdivs = ["AFC North", "AFC South", "AFC East", "AFC West"];
var nfcteams = ["Bears", "Lions", "Packers", "Vikings", "Falcons", "Panthers", "Saints", "Buccaneers", "Cowboys", "Giants", "Eagles", "Redskins", "Cardinals", "Rams", "49ers", "Seahawks"];
var afcteams = ["Ravens", "Bengals", "Browns", "Steelers", "Texans", "Colts", "Jaguars", "Titans", "Bills", "Dolphins", "Patriots", "Jets", "Broncos", "Chiefs", "Raiders", "Chargers"];

var NBA = "NBA";
var westdivs = ["Southwest", "Northwest", "Pacific"];
var eastdivs = ["Southeast", "Central", "Atlantic"];
var westteams = ["Mavericks", "Rockets", "Grizzlies", "Pelicans", "Spurs", "Nuggets", "Timberwolves", "Thunder", "Trail Blazers", "Jazz", "Warriors", "Clippers", "Lakers", "Suns", "Kings"];
var eastteams = ["Hawks", "Hornets", "Heat", "Magic", "Wizards", "Bulls", "Cavaliers", "Pistons", "Pacers", "Bucks", "Celtics", "Nets", "Knicks", "76ers", "Raptors"];



function createTable(league) {
	mode = league;
	var div1table = document.getElementById("div1table");
	var div2table = document.getElementById("div2table");
	div1table.innerHTML = "";
	div2table.innerHTML = "";
	if (league + "" == "NFL") {
		fillTable(div1table, nfcdivs, nfcteams, "NFC");
		fillTable(div2table, afcdivs, afcteams, "AFC");
	}
	if (league + "" == "NBA") {
		fillTable(div1table, westdivs, westteams, "West");
		fillTable(div2table, eastdivs, eastteams, "East");
	}
}

function fillTable(table, divs, teams, type) {
	table.appendChild(makeHeader(divs, type + "head", teams));
	for (var x = 0; x < teams.length / divs.length; x++) {
		table.appendChild(makeRow(teams, x, divs.length, type));
	}
}

function makeHeader(divs, type, teams) {
	var header = document.createElement("tr");
	header.className = type;
	for (var x = 0; x < divs.length; x++) {
		var col = document.createElement("th");
		var head = document.createElement("h2");
		head.innerHTML = divs[x];
		col.appendChild(head);
		header.appendChild(col);
	}
	return header; //new
}

function makeRow(teams, rowNum, divCount, type) {
	var row = document.createElement("tr");
	row.className = type;
	console.log("divs" + divCount);
	for (var y = 0; y < divCount; y++) {
		var teamCell = document.createElement("td");
		var team = document.createElement("b");
		team.id = teams[y * 4 + rowNum];
		//team.innerHTML = teams[y * 4 + rowNum];

		teamCell.appendChild(team);
		row.appendChild(teamCell);
	}
	return row;
}
