var game = new function () {

	var _this = this;
	var players = [];
	var playersCount = 0;
	var rounds = 0;
	var queue = [];
	this.turn = -1;
	var blockExit = false;
	var processing = false;

	var positions = [];
	positions[0] = [];
	positions[1] = [];
	positions[2] = [];
	positions[3] = [];
	positions[0]['hand'] = {left: 0, bottom: 0};
	positions[1]['hand'] = {top: 0, left: 0};
	positions[2]['hand'] = {left: 0, top: 0};
	positions[3]['hand'] = {top: 0, right: 0};
	positions[0]['stack'] = {bottom: 200, left: 100};
	positions[1]['stack'] = {left: 260, top: 90};
	positions[2]['stack'] = {top: 200, left: 100};
	positions[3]['stack'] = {right: 260, top: 90};
	var suits = []
	suits['h'] = 0;
	suits['d'] = 1;
	suits['s'] = 2;
	suits['c'] = 3;


	function Card(p, i) {

		var place = p;
		var id;
		var dom;

		var getBackground = function () {
			suit = suits[id.substr(0, 1)];
			number = id.substr(1);

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

		this.flip = function (i) {
			if (id != undefined) return false;
			id = i;
			// set correct background and fade in
			$(".front", card).css("background-position", getBackground()).delay(100).fadeIn("fast");
			if (place == 0) {
				// register click and hover events only for this player
				card.click(function () {
					if (_this.turn == userid) {
						butler.registerAction("layStack", id);
					} else {
						alert("Du bist nicht am Zug!");
					}
				// highlight card on mouseover
				}).hover(function () {
					$(this).toggleClass("highlight");
				});
			}
			return true;
		}

		this.layStack = function () {
			// delete from own hand
			card.removeClass("hand").addClass("stack");
			pos = positions[place]['stack'];
			card.css({"z-index": $(".stack", dom).length+6}).animate(pos);
		}

		var card = $("<div>").addClass("card hand").append($("<div>").addClass("back"), $("<div>").addClass("front"));

		// add it to the players hand
		pos = positions[place]['hand'];
		$.each(pos, function (key, value) {
			eval("pos."+key+" = i*70");
			return false;
		});
		dom = $(".players > div").eq(place).find(".cards");
		card.appendTo(dom).css(pos).delay(i*100).fadeIn();

	}


	// player
	function Player(i, n) {

		this.id = i;
		this.name = n;
		var _this = this;
		var strikes = 0;
		var place = 0;
		var placeTable = 0;
		var dom;
		var cards = [];

		this.startGame = function (i, p) {
			place = p;
			placeTable = i + 1;
			dom = $(".players > div").eq(place);
			// add player to strikes table
			// +1 because first cell is for round number
			$("#strikes .top > td").eq(placeTable).html(this.name);
			// set player's name on the table
			// -1 because we have no name at the bottom so the first name box is missing
			namebox = $(".players .name").eq(place-1);
			if (place == 2) {
				namebox.html(this.name);
			// vertical players have an inner div
			} else if (place-1 > -1) {
				$("div", namebox).html(this.name);
			}
		}

		// user has laid a card on his stack
		this.laidStack = function (cardid) {
			if (place == 0) {
				cards[cardid].layStack();
			} else {
				// flip a randomly selected card
				i = Math.round(Math.random() * 3);
				while (true) {
					// check if not already flipped
					if (cards[i].flip(cardid)) {
						cards[i].layStack();
						break;
					}
					i = (i >= 3) ? 0 : i+1;
				}
			}
		}

		// update the players entry in strikes table
		this.updateStrikes = function (strikes) {
			$("#strikes table tr:last td").eq(placeTable).html(strikes);
		}

		// show cards in hand
		this.flipHand = function (i, cardid) {
			cards[i].flip(cardid);
			cards[cardid] = cards[i];
		}

		// 
		this.smallRoundStarted = function () {
			// give cards
			for (i = 0; i < 4; i++) {
				cards[i] = new Card(place, i);
			}
		}

		this.smallRoundEnded = function () {
			$(".card", dom).fadeOut("fast", function () {
				$(this).remove();
			});
		}

		this.quit = function () {
			// remove player from list
			$("#overview ul li").each(function () {
				if ($(this).html() == _this.name) {
					$(this).remove();
				}
			});

			// increase player counter
			$("#maxplayers").html(parseInt($("#maxplayers").html())+1);
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
			if (content == null) content = "";
			makeRequest("registerAction", "action=" + action + "&content=" + content);
		}

	}

	var processQueue = function (next) {
		if (processing && !next) {
			return;
		}
		processing = true;
		if (queue.length == 0) {
			processing = false;
			return;
		}
		wait = 0;
		waitFunction = null;

		action = queue[0];
		queue.shift();
		
		switch (action.action) {

			case "turn":
				// set turn
				_this.turn = action.player;
				// show knock button
				if (action.player == userid) {
					$(".actions .knock").fadeIn("fast");
				} else {
					$(".actions .knock").fadeOut("fast");
				}
				break;

			// some player has laid on of his cards on his stack
			case "laidStack":
				players[action.player].laidStack(action.content);
				break;

			case "smallRoundStarted":
				$(".bottom .actions").fadeIn("fast");
				$(".bottom .flipHand").fadeIn("fast");
				$.each(players, function (key, player) {
					if (player != null) {
						player.smallRoundStarted();
					}
				});
				wait = 500;
				break;

			case "roundStarted":
				blockExit = true;
				rounds++;
				row = $("<tr>");
				for (i = 0; i < 5; i++) {
					cell = $("<td>");
					// add first cell for round number
					if (i == 0) {
						cell.html(rounds);
					}
					row.append(cell);
				}
				$("#strikes table").append(row);
				break;

			case "smallRoundEnded":
				$(".bottom .actions").fadeOut("fast");
				wait = 2000;
				waitFunction = function () {
					$.each(players, function (key, player) {
						if (player != null) {
							player.smallRoundEnded();
						}
					});
					processQueue(true);
				};
				break;

			case "folded":
				if (action.player == userid) {
					$(".bottom .actions").fadeOut("fast");
				}
				break;

		}

		if (wait != 0) {
			if (waitFunction == null) {
				waitFunction = function () {
					processQueue(true);
				};
			}
			setTimeout(waitFunction, wait);
		} else {
			processQueue(true);
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
				if (players[user.id] == 0) {
					players[user.id] = new Player(user.id, user.name);
				}
			});
		});
	}

	// register all actions (is called by the script we got from the butler)
	var registerActions = function (actions) {
		playersJoined = 0;

		// go through all actions
		$.each(actions, function (key, action) {
			// which action is it ?
			switch (action.action) {

				// a player joined
				case "playerJoined":
					players[action.player] = 0;
					// only update players once
					if (playersJoined == 0) {
						updatePlayerInfo();
						playersJoined = 1;
					}
					playersCount++;
					break;

				// a player left
				case "playerQuit":
					players[action.player].quit();
					// remove from list
					delete players[action.player];
					players.splice(players.indexOf(action.player), 1);
					break;

				// game has started
				case "started":
					finishStart();
					break;

				// got updated number of strikes for user
				case "strikes":
					players[action.player].updateStrikes(action.content);
					break;

				// received new chat message
				case "chat":
					logChat(action.player, action.content);
					break;

				// everything else has to be queued
				default:
					queue.push(action);
					break;
					
			}

		});

		processQueue(false);

		// next request
		butler.getActions();

	}

	// process the response we got from the butler
	this.processResponse = function (response) {
		// everything went okay ?
		if (response.result == "ok") {

			// we received actions
			if (response.actions != null) {
				// set new lastAction
				butler.lastAction = response.lastAction;
				registerActions(response.actions);
			// we received the player's cards'
			} else if (response.cards != null) {
				$(".flipHand").fadeOut("fast");
				// show player his cards
				for (i = 0; i < 4; i++) {
					players[userid].flipHand(i, response.cards[i]);
				}
			}

		// an error occurred ?
		} else if (response.result == "error") {
			switch (response.error.id) {
				case "admit":
					alert("Du musst bekennen!");
					break;
				default:
					alert("unknown error");
			}
		}
	}

	var finishStart = function () {
		$("#overview").fadeOut();
		i = 0;
		$.each(players, function (key, player) {
			if (player != null) {
				if (player.id == userid) {
					me = i;
					return false;
				}
				i++;
			}
		});
		i = 0;
		$.each(players, function (key, player) {
			if (player != null) {
				pos = i - me;
				if (pos < 0) {
					pos = 4-pos*-1;
				}
				player.startGame(i, pos);
				i++;
			}
		});
		$("#panel").animate({"top": "800px"}, function () {
			$("#strikes").fadeIn();
		});
	}


	var start = function () {
		// TODO: bitte warten anzeigen
		if (playersCount < 2) {
			alert("Zu wenig Spieler!");
			return;
		}
		$.getJSON("ajax.php?action=startGame&id=" + gameid, function (data) {
			if (data.result != "ok") {
				alert("Fehler!");
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
			if (blockExit) {
				return "Achtung! Wenn du diese Seite verlässt, beendest du damit auch dieses Spiel und verlierst deinen Einsatz! Möchtest du dieses Spiel wirklich beenden?";
			}
		});
		// user actions
		actionsBox = $(".bottom .actions");
		actions = ["fold", "call", "knock", "flipHand"];
		$.each(actions, function (key, action) {
			$("."+action).click(function () {
				butler.registerAction(action);
			});
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

		/* testing
		players[1] = new Player(1, "Albi");
		players[2] = new Player(2, "Bla");
		players[3] = new Player(3, "Bla2");
		players[4] = new Player(4, "Bla3");
		setTimeout(finishStart, 1000);
		players[1].startGame(0, 0);
		players[2].startGame(1, 1);
		players[3].startGame(2, 2);
		players[4].startGame(3, 3);
		players[1].smallRoundStarted();
		players[2].smallRoundStarted();
		players[3].smallRoundStarted();
		players[4].smallRoundStarted();
		setTimeout(function () {
			players[1].flipHand(1, "c10");
			players[1].laidStack("c10");
			players[2].laidStack("d8");
			players[3].laidStack("h5");
			players[4].laidStack("d7");
		}, 2000);
		*/

	}

}

// initiate
$(window).load(game.init);