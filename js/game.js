var game = new function () {

	var players = [];
	var playersCount = 1;


	// player
	function Player(i, n, p) {

		this.id = i;
		this.name = n;
		this.strikes = 0;
		this.place = p;

		// add player to list
		$("#overview ul").append($("<li>").html(n));
		// decrease player counter
		$("#overview span").html(parseInt($("#overview span").html())-1);

	}

	
	// butler
	var butler = new function () {

		// the butler's address to connect to
		var addr = "127.0.0.1:4926";
		// number of last action we got from the butler
		this.lastAction = 0;

		// connect to server and make a request
		var makeRequest = function (request, arguments) {
			// get javascript with data from butler
			url = "http://" + addr + "/player?gId=" + gameid + "&pId=" + userid + "&authcode=" + authcode + "&request=" + request + "&" + arguments;
			$.getScript(url);
		}
		
		// receive all actions since lastAction
		this.getActions = function () {
			makeRequest("getActions", "since=" + this.lastAction);
		}

		// register an action
		this.registerAction = function (action, content) {
			makeRequest("registerAction", "action=" + action + "&content=" + content);
		}

	}

	// received a chat message -> write it into chat box
	var logChat = function (player, message) {
		$(".chat .log").append($("<div>").addClass("message").html(players[player].name + ": " + message));
		$(".chat .log").attr({scrollTop: $(".chat .log").attr("scrollHeight")});
	}

	// register all actions (is called by the script we got from the butler)
	this.registerActions = function (actions) {
		// set new lastAction
		butler.lastAction = actions.lastAction;

		// go through all actions
		$.each(actions.actions, function (key, action) {
			// which action is it ?
			switch (action.action) {

				// a player joined
				case "playerJoined":
					// ignore player at this computer
					if (action.player == userid) break;
					players[action.player] = new Player(action.player, "username", 0);
					playersCount++;
					break;
					
				// received new chat message
				case "chat":
					logChat(action.player, action.content);
					break;
			}
		});

		// next request
		butler.getActions();

	}


	var start = function () {
		if (playersCount < 2) {
			alert("Zu wenig Spieler!");
			return;
		}
		//$("#panel").animate({"top": "700px"});
	}

	// initializes game
	this.init = function () {

		// create player
		players[userid] = new Player(userid, username, 0);

		// register events
		$("#startGameBtn").click(start);
		$(".chat form input").focus(function () {
			if ($(this).is(".inactive")) {
				$(this).removeClass("inactive").val("");
			}
		});
		$(".chat form").submit(function () {
			butler.registerAction("chat", $(this).find("input").val());
			$(this).find("input").val("");
			return false;
		});
		// warn user before leaving this page
		$(window).bind("beforeunload", function() {
			return "Achtung! Wenn du diese Seite verlässt, beendest du damit auch dieses Spiel und verlierst deinen Einsatz! Möchtest du dieses Spiel wirklich beenden?";
		});

		// show panel
		$("#game").fadeIn();
		$("#panel").delay(200).fadeIn();

		// initiate butler
		butler.getActions();

	}

}

// initiate
$(window).load(game.init);