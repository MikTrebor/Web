var followers = [];
var followersUsers = [];
var following = [];
var followingUsers = [];
window.onload = function() {
	$("._6jvgy").each(function(index) {
		var status = $("._72gdz", this).text().trim();
		var name = $("._2uju6", this).text().trim();
		var username = $("._gzjax", this).text().trim();
		// console.log(name, username, status)
		if (status == "Follow" && followersUsers.indexOf(username) < 0) {
			followers.push({
				name: name,
				username: username,
				state: status
			});
			followersUsers.push(username);
		}
		if (status == "Following" && followingUsers.indexOf(username) < 0) {
			following.push({
				name: name,
				username: username,
				state: status
			});
			followingUsers.push(username);
		}
		// console.log(index + ": " + $(this).text());
	});
	// console.log(followers, following);
	console.log(followersUsers);
	for (var obj in followers) {
		makeRow(followers[obj]);
	}
	document.getElementById("count").innerHTML = followers.length;
	// for (var obj in following) {
	// 	makeRow(following[obj]);
	// }
};


function makeRow(object) {
	var temp = "";
	if (object.state == "Follow") {
		temp = "followers";
	}
	else {
		temp = "following";
	}
	var table = document.getElementById(temp);
	var row = document.createElement("tr");
	var name = document.createElement("td");
	name.innerHTML = object.name;
	var username = document.createElement("td");
	username.innerHTML = object.username;
	row.appendChild(name);
	row.appendChild(username);
	table.appendChild(row);
}
