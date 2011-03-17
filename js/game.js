var game = new function () {

	var _this = this;
	var players = [];
	var playersCount = 0;
	var rounds = 0;
	var queue = [];
	this.turn = -1;
	var knocked = -1;
	var blockExit = false;
	var processing = false;

	var positions = [];
	positions[0] = {left: 0};
	positions[1] = {top: 0};
	positions[2] = {left: 0};
	positions[3] = {top: 0};
	var suits = [];
	suits['h'] = 0;
	suits['d'] = 1;
	suits['s'] = 2;
	suits['c'] = 3;


	function Card(p, i) {

		var place = p;
		var id;
		var dom;
		var laid = false;

		var getBackground = function () {
			suit = suits[id.substr(0, 1)];
			number = id.substr(1)-3;

			switch (place) {
				case 0:
					x = number * 87;
					y = suit * 129;
					break;
				case 1:
					x = 647 - (suit+1) * 129;
					y = number * 87;
					break;
				case 2:
					x = 700 - (number+1) * 87;
					y = 647 - (suit+1) * 129;
					break;
				case 3:
					x = suit * 129;
					y = (7-number) * 87 + 4;
					break;
			}

			return "-" + x + "px -" + y + "px";
		}

		this.flip = function (i) {
			if (id != undefined) return false;
			id = i;
			// set correct background and fade in
			front = $(".front", card).css("background-position", getBackground()).delay(animationTime(200)).fadeIn(animationTime(400));
			// hide back
			$(".back", card).delay(300).fadeOut(animationTime(100));
			if (place == 0) {
				// register click and hover events only for this player
				card.click(function () {
					_this.layStack(id);
				});
			}
			return true;
		}

		this.layStack = function () {
			laid = true;
			// remove click events
			card.unbind("click");
			// increase z to lay the card on top of the other cards
			card.css({"z-index": $(".stack", dom).length+6});
			card.switchClass("hand", "stack", animationTime(500, true));
		}

		this.fold = function () {
			if (laid) {
				remove = "stack";
				$(".front", card).fadeOut(animationTime(300));
				$(".back", card).fadeIn(animationTime(400));
			} else {
				remove = "hand";
			}
			card.switchClass(remove, "folded", animationTime(500, true));
		}

		var card = $("<div>").addClass("card hand").append($("<div>").addClass("back"), $("<div>").addClass("front"));

		// add it to the players hand
		pos = positions[place];
		// TODO: den kram hier weg
		$.each(pos, function (key, value) {
			eval("pos."+key+" = i*50");
			return false;
		});
		dom = $(".players > div").eq(place).find(".cards");
		card.appendTo(dom).css(pos).delay(i*100).fadeIn(animationTime(400));

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

		var removeCards = function () {
			$(".card", dom).fadeOut(animationTime(400), function () {
				$(this).remove();
			});
		}

		this.startGame = function (i, p) {
			place = p;
			placeTable = i + 1;
			dom = $(".players > div").eq(place);
			// add player to strikes table
			// +1 because first cell is for round number
			$("#strikes .top > td").eq(placeTable).html(this.name);
			// set player's name on the table
			// -1 because we have no name at the bottom so the first name box is missing
			$(".name", dom).html(this.name);
		}

		// set or unset that it is this player's turn
		this.toggleTurn = function () {
			$(".name", dom).toggleClass("turn", animationTime(500, true));
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

		this.roundStarted = function () {
			strikes = 0;
			dom.removeClass("out");
			// pull out player area
			$(".area", dom).addClass("shown", animationTime(500, true));
		}

		this.roundEnded = function () {
			// pull back player area
			$(".area", dom).removeClass("shown", animationTime(500, true));
		}

		// 
		this.smallRoundStarted = function () {
			// give cards
			for (i = 0; i < 4; i++) {
				cards[i] = new Card(place, i);
			}
		}

		this.smallRoundEnded = function () {
			removeCards();
			this.knockFinished();
		}

		this.knocked = function () {
			knockDom = $(".knocked", dom);
			$("div", knockDom).removeClass("down");
			knockDom.removeClass("down").fadeIn(animationTime(200));
			setTimeout(function () {
				$("div", knockDom).addClass("down", animationTime(100, true), "easeInQuint");
			}, 0);
			setTimeout(function () {
				knockDom.addClass("down", animationTime(400, true));
			}, 1000);
		}

		this.knockFinished = function () {
			$(".knocked", dom).fadeOut(animationTime(400));
		}

		this.folded = function () {
			for (i = 0; i < 4; i++) {
				cards[i].fold();
			}
		}

		this.out = function () {
			dom.addClass("out");
		}

		this.quit = function () {
			if (!$(".area", dom).is(".shown")) {
				// remove player from list
				$("#overview ul li").each(function () {
					if ($(this).html() == _this.name) {
						$(this).remove();
					}
				});
				
				// increase player counter
				$("#maxplayers").html(parseInt($("#maxplayers").html())+1);

			} else {
				removeCards();
				this.roundEnded();
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
			if (content == null) content = "";
			makeRequest("registerAction", "action=" + action + "&content=" + content);
		}

		// start the game
		this.startGame = function () {
			makeRequest("start");
		}

	}

	var toggleActionBtn = function (action, show) {
		if (show) {
			$(".actions ."+action).fadeIn(animationTime(400));
		} else {
			$(".actions ."+action).fadeOut(animationTime(400));
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

			// game has started
			case "started":
				finishStart();
				wait = 700;
				break;

			case "turn":
				// set turn
				if (_this.turn != action.player) {
					if (_this.turn > -1 && players[_this.turn] != null) players[_this.turn].toggleTurn();
					_this.turn = action.player;
					players[_this.turn].toggleTurn();
				}
				if (knocked == action.player) {
					players[action.player].knockFinished();
					knocked = -1;
				}
				// show knock button
				if ($(".blindKnock").is(":hidden") || knocked != -1) {
					if (action.player == userid) {
						if (knocked != -1) {
							toggleActionBtn("call", true);
							toggleActionBtn("fold", true);
						} else {
							toggleActionBtn("knock", true);
						}
					} else {
						if (!$(".call").is(":hidden")) {
							toggleActionBtn("call", false);
							toggleActionBtn("fold", false);
						}
						toggleActionBtn("knock", false);
					}
				}
				break;

			// some player has laid on of his cards on his stack
			case "laidStack":
				players[action.player].laidStack(action.content);
				break;

			case "smallRoundStarted":
				toggleActionBtn("flipHand", true);
				toggleActionBtn("blindKnock", true);
				$.each(players, function (key, player) {
					if (player != null) player.smallRoundStarted();
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
				$.each(players, function (key, player) {
					if (player != null) player.roundStarted();
				});
				wait = 700;
				break;

			case "roundEnded":
				logAction(players[action.player].name + " hat diese Runde gewonnen.");
				$("#panel").removeClass("down", animationTime(500, true));
				break;

			case "out":
				logAction(players[action.player].name + " ist raus.");
				players[action.player].out();
				break;

			case "smallRoundEnded":
				knocked = -1;
				$(".actions > div").fadeOut(animationTime(400));
				wait = 2000;
				waitFunction = function () {
					$.each(players, function (key, player) {
						if (player != null) player.smallRoundEnded();
					});
					processQueue(true);
				};
				break;

			case "folded":
				if (action.player == userid) {
					toggleActionBtn("knock", false);
					toggleActionBtn("fold", false);
				}
				players[action.player].folded();
				break;

			case "knocked":
				if (!$(".blindKnock").is(":hidden")) {
					$(".blindKnock").fadeOut(animationTime(400));
				}
				knocked = action.player;
				players[action.player].knocked();
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
		message = players[player].name + ": " + decodeURI(message);
		logAction(message, "message");
	}

	var logAction = function (content, style) {
		dom = $("<div>").html(content);
		if (style != undefined) {
			dom.addClass(style);
		}
		$(".chat .log").append(dom);
		$(".chat .log").attr({scrollTop: $(".chat .log").attr("scrollHeight")});
	}

	// get new player info and add those players
	// avoids too many ajax request at a time
	var updatePlayerInfo = function (log) {
		$.getJSON("ajax.php?action=getUserInfo&game=" + gameid, function (data) {
			$.each(data, function (key, user) {
				// only add player if he does not exist yet
				if (players[user.id] == null) {
					players[user.id] = new Player(user.id, user.name);
					playersCount++;
					if (log || user.id == username) {
						logAction(user.name + " hat das Spiel betreten.");
					}
				}
			});
		});
	}

	// user wants to lay a card on stack
	this.layStack = function (cardid) {
		if (this.turn != userid) {
			alert("Du bist nicht am Zug!");
		} else if (knocked != -1) {
			alert("Du musst erst entscheiden, ob du mitgehst oder rausgehst!");
		} else {
			butler.registerAction("layStack", cardid);
		}
	}

	// register all actions (is called by the script we got from the butler)
	var registerActions = function (actions) {
		playersJoined = false;
		finished = false;

		// go through all actions
		$.each(actions, function (key, action) {
			// which action is it ?
			switch (action.action) {

				// a player joined
				case "playerJoined":
					// only update players once
					if (!playersJoined) {
						updatePlayerInfo(true);
						playersJoined = true;
					}
					break;

				// a player left
				case "playerQuit":
					logAction(players[action.player].name + " hat das Spiel verlassen.");
					players[action.player].quit();
					// remove from list
					delete players[action.player];
					players[action.player] = null;
					break;

				// got updated number of strikes for user
				case "strikes":
					players[action.player].updateStrikes(action.content);
					break;

				// received new chat message
				case "chat":
					logChat(action.player, action.content);
					break;

				// host has changed to another player
				case "hostChanged":
					host = action.player;
					logAction(players[host].name + " ist der neue Leiter des Spiels.");
					hostChanged();
					break;

				// game has finished because only this player is left
				case "finished":
					finished = true;
					blockExit = false;
					alert("Spiel ist beendet!");
					break;

				// everything else has to be queued
				default:
					queue.push(action);
					break;
					
			}

		});

		processQueue(false);

		// next request
		if (!finished) butler.getActions();

	}

	// process the response we got from the butler
	this.processResponse = function (response) {
		// everything went okay ?
		if (response.result == "ok") {

			// we received actions
			if (response.actions != null) {
				old = butler.lastAction;
				// set new lastAction
				butler.lastAction = response.lastAction;
				// first connection to server -> just update player info
				if (old == 0) {
					updatePlayerInfo(false);
					butler.getActions();
				} else {
					registerActions(response.actions);
				}
			// we received the player's cards'
			} else if (response.cards != null) {
				toggleActionBtn("flipHand", false);
				toggleActionBtn("blindKnock", false);
				if (this.turn == userid) {
					toggleActionBtn("knock", true);
				}
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

	var hostChanged = function () {
		dom = $("#startGame > div");
		if (host == userid) {
			dom.last().show();
			dom.first().hide();
		} else {
			dom.last().hide();
			dom.first().show();
		}
	}

	var finishStart = function () {
		$("#overview").fadeOut(animationTime(400));
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
		$("#panel").addClass("down", animationTime(500, true));
		$("#strikes").delay(500).fadeIn(animationTime(400));
	}


	var start = function () {
		// TODO: bitte warten anzeigen
		if (playersCount < 2) {
			alert("Zu wenig Spieler!");
			return;
		}
		butler.startGame();
	}

	// hide loading sign and initiate butler connection
	$(window).load(function () {
		$("#loading").hide();

		// show panel
		$("#panel").delay(200).fadeIn(animationTime(400));
		
		// initiate butler
		butler.getActions();
	});

	// initialize game
	$(function () {

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
		hostChanged();

		/* testing
		players[1] = new Player(1, "Albi");
		players[2] = new Player(2, "Bla");
		players[3] = new Player(3, "Bla2");
		players[4] = new Player(4, "Bla3");
		setTimeout(finishStart, 1000);
		setTimeout(function () {
			players[1].startGame(0, 0);
			players[2].startGame(1, 1);
			players[3].startGame(2, 2);
			players[4].startGame(3, 3);
			toggleActionBtn("flipHand", true);
			players[1].smallRoundStarted();
			players[2].smallRoundStarted();
			players[3].smallRoundStarted();
			players[4].smallRoundStarted();
			players[4].roundStarted();
			players[3].roundStarted();
			players[1].roundStarted();
			players[2].roundStarted();
		}, 1500);
		setTimeout(function () {
			players[1].flipHand(1, "c9");
			players[1].laidStack("c9");
			players[2].laidStack("h5");
			players[3].laidStack("s7");
			players[4].laidStack("d5");
			players[4].toggleTurn();
		}, 3000);
		setTimeout(function () {
			players[2].knocked();
		}, 4000);
		setTimeout(function () {
			players[2].knocked();
		}, 6000);*/

	});

}