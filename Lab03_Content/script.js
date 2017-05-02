window.onload = function() {
	makeDecks();
};
var deckId = 0;
var leftRaw = [];
var rightRaw = [];
var leftDeck = [];
var rightDeck = [];
var leftTrash = [];
var rightTrash = [];
var winnings = [];
var gameOver = false;
$(window).keypress(function(e) {
	if (e.which === 32) {
		playTurn();
		//Your code goes here

	}
});

function convert(raw_deck) {
	var temp = [];
	console.log(raw_deck)
	for (var x = 0; x < raw_deck.length; x++) {
		temp.push([raw_deck[x].image, raw_deck[x].value, raw_deck[x].suit]);
	}
	return temp;
}

function makeDecks() {
	// console.log("some code works");
	// var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImVhNjk3YWI2LWQ4NGYtNGUxNi1hMjA4LWI3MmYxODk2MjJmZiIsImlhdCI6MTQ4ODc4MDE2Miwic3ViIjoiZGV2ZWxvcGVyL2QxN2YzMTMwLWVkNmQtNWU0Zi0yZTg1LWNkYjAwYjJlZjk4YyIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjk2LjI0MS4xMTQuMjI1Il0sInR5cGUiOiJjbGllbnQifV19.6I3IeQ8qlYx1ksK90CtrFDZu3AN6F18Vvw6GqoxgXRlzdW4tJ1B2Dxg5amFMOws4PjFgX8VDAVDraWrF1vtPmg";
	// var myTag = $("#clantag").val();
	var data2Send = {
		count: 26
	};
	$.ajax({
		url: "https://deckofcardsapi.com/api/deck/new/shuffle/?count=2",
		Accept: 'application/json',
		// authorization: 'Bearer ' + token,

		success: function(response) {
			// console.log(response);
			deckId = response.deck_id;

			$.ajax({
				url: "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/",
				dataType: 'json',
				Accept: 'application/json',
				// authorization: 'Bearer ' + token,
				// error: alert("No Cards Left"),
				success: function(response) {
					// console.log(response);
					leftRaw = response.cards;
					leftDeck = convert(leftRaw);
				},
				data: data2Send
			});
			$.ajax({
				url: "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/",
				dataType: 'json',
				Accept: 'application/json',
				// authorization: 'Bearer ' + token,
				// error: alert("No Cards Left"),
				success: function(response) {
					// console.log(response);
					rightRaw = response.cards;
					rightDeck = convert(rightRaw);
				},
				data: data2Send
			});
		}
	});
}

function playTurn() {
	if (!gameOver) {
		var leftData = drawCard(leftDeck);
		var rightData = drawCard(rightDeck);
		// var leftCard = leftData[0];
		// var rightCard = rightData[0];
		if (leftDeck.length == 0) {
			if (leftTrash.length == 0) {
				$('#outcome').html("Right Wins the War!")
				console.log("rightwinner")
				gameOver = true;
			}
			else {
				leftDeck = shuffle(leftTrash);
				leftTrash = [];
			}
		}
		else if (rightDeck.length == 0) {
			if (rightTrash.length == 0) {
				$('#outcome').html("Left Wins the War!")
				console.log("lefttwinner")
				gameOver = true;
			}
			else {
				rightDeck = shuffle(rightTrash);
				rightTrash = [];
			}
		}
		battle(leftData, rightData);
	}
}

function drawCard(deck) {
	return deck.shift();
}

function battle(left_data, right_data) {
	var leftPower = getStrength(left_data[1], left_data[2]);
	var rightPower = getStrength(right_data[1], right_data[2]);
	winnings = [];
	$("#left").attr("src", left_data[0]);
	$("#right").attr("src", right_data[0]);
	$('#left_score').html(leftPower);
	$('#right_score').html(rightPower);
	if (leftPower > rightPower) {
		winnings.push(left_data, right_data);
		leftTrash = leftTrash.concat(winnings);
		$('#outcome').html("Left Wins!");
	}
	else if (rightPower > leftPower) {
		winnings.push(left_data, right_data);
		rightTrash = rightTrash.concat(winnings);
		$('#outcome').html("Right Wins!");
	}
	else {
		winnings.push(left_data, right_data);
		rightTrash = rightTrash.concat(winnings);
		$('#outcome').html("I declare war!");
	}
	console.log(leftDeck.length, leftTrash.length, rightDeck.length, rightTrash.length)
	$('#left_count').html(leftDeck.length + leftTrash.length);
	$('#right_count').html(rightDeck.length + rightTrash.length);
}

function shuffle(array) {
	//from: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	var currentIndex = array.length,
		temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function getStrength(value, suit) {
	console.log(suit);
	var temp = 0;
	if (isNaN(value)) {
		if (value == 'ACE') {
			temp = 1;
		}
		else if (value == 'JACK') {
			temp = 11;
		}
		else if (value == 'QUEEN') {
			temp = 12;
		}
		else {
			temp = 13;
		}
	}
	else {
		temp = parseInt(value, 10);
	}
	if (suit == 'HEARTS') {
		temp += 0.2;
	}
	else if (suit == 'CLUBS') {
		temp += 0.4;
	}
	else if (suit == 'DIAMONDS') {
		temp += 0.6;
	}
	else { //'SPADES'
		temp += 0.8;
	}
	console.log(temp)
	return temp;


}
