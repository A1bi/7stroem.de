var game = new function () {

	var players = [];
	var playersCount = 0;
	var turn;
	var direction = [];
	direction[0] = "left";
	direction[1] = "top";
	direction[2] = "left";
	direction[3] = "top";
	var suits = []
	suits['h'] = 0;
	suits['d'] = 1;
	suits['s'] = 2;
	suits['c'] = 3;


	// player
	function Player(i, n, p) {

		this.id = i;
		this.name = n;
		var strikes = 0;
		var place = p;

		this.startGame = function () {
			$("#strikes .top > td").eq(place+1).html(this.name);
		}

		var getCard = function (card) {
			suit = suits[card.substr(0, 1)];
			//alert(card);
			number = card.substr(1);

			switch (place) {
				case 0:
					x = (number-3) * 111;
					y = suit * 164;
					break;
				case 1:
					x = 824 - (suit+1) * 164;
					y = (number-3) * 111;
					break;
				case 2:
					x = 890 - (number-2) * 111;
					y = suit * 164;
					break;
				case 3:
					x = suit * 164;
					y = 892 - (number-2) * 111;
					break;
			}

			return "-" + x + "px -" + y + "px";
		}

		this.giveCards = function (cards) {
			if (cards != null) {
				newCards = cards.split(",");
			}

			for (i = 0; i < 4; i++) {
				card = $("<div>").addClass("card");
				if (cards == null) {
					card = card.addClass("back");
				} else {
					card = card.css("background-position", getCard(newCards[i]));
				}
				$(".hand").eq(place).append(card.css(direction[place], i*70+"px").delay(i*100).fadeIn());
			}
		}

		// add player to list
		$("#overview ul").append($("<li>").html(n));
		// decrease player counter
		$("#maxplayers").html(parseInt($("#maxplayers").html())-1);

	}

	
	// butler
	var butler = new function () {

		// the butler's address to connect to
		var addr = "192.168.10.10:4926";
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
		message = message.replace(/\{038;\}/g, "&amp;");
		message = message.replace(/\{063;\}/g, "?");
		message = message.replace(/\{035;\}/g, "#");
		$(".chat .log").append($("<div>").addClass("message").html(players[player].name + ": " + decodeURI(message)));
		$(".chat .log").attr({scrollTop: $(".chat .log").attr("scrollHeight")});
	}

	// get new player info and add those players
	// avoids too many ajax request at a time
	var updatePlayerInfo = function () {
		$.getJSON("ajax.php?action=getUserInfo&game=" + gameid, function (data) {
			$.each(data, function (key, user) {
				// only add player if he does not exist yet
				if (players[user.id] == null) {
					players[user.id] = new Player(user.id, user.name, playersCount);
				}
			});
		});
	}

	// register all actions (is called by the script we got from the butler)
	this.registerActions = function (actions) {
		// set new lastAction
		butler.lastAction = actions.lastAction;
		playersJoined = 0;

		// go through all actions
		$.each(actions.actions, function (key, action) {
			// which action is it ?
			switch (action.action) {

				// a player joined
				case "playerJoined":
					// ignore player at this computer
					if (action.player == userid) {
						players[action.player] = new Player(action.player, username, 0);
					} else if (playersJoined == 0) {
						updatePlayerInfo();
						playersJoined = 1;
					}

					playersCount++;
					break;

				// game has started
				case "started":
					finishStart();
					break;

				// cards given
				case "giveCards":
					
					$.each(players, function (key, player) {
						if (player != null) {
							if (player.id == userid) {
								player.giveCards(action.content);
							} else {
								player.giveCards();
							}
						}
					});
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

	var finishStart = function () {
		$("#overview").fadeOut();
		$("#panel").animate({"top": "800px"}, function () {
			$(".card").fadeIn();
			$("#strikes").fadeIn();

			$.each(players, function (key, player) {
				if (player != null) {
					player.startGame();
				}
			});

		});
	}


	var start = function () {
		// TODO: bitte warten anzeigen
		if (playersCount < 2) {
		//	alert("Zu wenig Spieler!");
		//	return;
		}
		$.getJSON("ajax.php?action=startGame&id=" + gameid, function (data) {
			if (data.result == "ok") {
				finishStart();
			}
		});
	}

	// initializes game
	this.init = function () {

		// register events
		$("#startGameBtn").click(start);
		$(".chat form input").focus(function () {
			if ($(this).is(".inactive")) {
				$(this).removeClass("inactive").val("");
			}
		});
		$(".chat form").submit(function () {
			message = $(this).find("input").val();
			$(this).find("input").val("");
			// escape ? and & so they won't end the get argument
			message = message.replace(/&/g, "{038;}");
			message = message.replace(/\?/g, "{063;}");
			message = message.replace(/#/g, "{035;}");
			butler.registerAction("chat", message);
			return false;
		});
		// warn user before leaving this page
		$(window).bind("beforeunload", function() {
			return "Achtung! Wenn du diese Seite verlässt, beendest du damit auch dieses Spiel und verlierst deinen Einsatz! Möchtest du dieses Spiel wirklich beenden?";
		});

		// start game box
		if (host == userid) {
			$("#startGame > div").last().show();
		} else {
			$("#startGame > div").first().show();
		}

		// show panel
		$("#panel").delay(200).fadeIn();

		// initiate butler
		butler.getActions();

	}

}

// initiate
$(window).load(game.init);