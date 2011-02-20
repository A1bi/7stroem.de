var game = new function () {

	var _this = this;
	var players = [];
	var playersCount = 0;
	var rounds = 0;
	var queue = [];
	this.turn = -1;
	var processing = false;

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
	function Player(i, n) {

		this.id = i;
		this.name = n;
		var strikes = 0;
		var place = 0;
		var placeTable = 0;
		var dom;

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
			} else if (place-1 > 0) {
				$("div", namebox).html(this.name);
			}
		}

		var getCard = function (card) {
			suit = suits[card.substr(0, 1)];
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
				// back for other players
				if (cards == null) {
					card = card.addClass("back");
				// front for this player
				} else {
					// append an invisible container to later get the card id from
					cardid = $("<div>").addClass(newCards[i]).html(newCards[i]);
					// set correct background and click and hover events
					card = card.append(cardid).css("background-position", getCard(newCards[i])).click(function () {
						if (_this.turn == userid) {
							butler.registerAction("layStack", $("div", this).first().html());
						} else {
							alert("Du bist nicht am Zug!");
						}
					}).hover(function () {
						$(this).toggleClass("highlight");
					});
				}
				// add it to the players hand
				$(".hand", dom).append(card.css(direction[place], i*70+"px").delay(i*100).fadeIn());
			}
		}

		// user has laid a card on his stack
		this.laidStack = function (cardid) {
			// delete from own hand
			if (place == 0) {
				$(".hand .card > ."+cardid, dom).parent().remove();
			// delete a randomly selected card from other player's hand
			} else {
				randomcard = Math.round(Math.random() * ($(".hand .card", dom).length-1));
				$(".hand .card", dom).eq(randomcard).remove();
			}
			card = $("<div>").addClass("card").css("background-position", getCard(cardid)).css(direction[place], $(".stack .card", dom).length*20+"px").css("display", "block");
			if (card != null) {
				$(".stack", dom).append(card);
			}
		}

		// update the players entry in strikes table
		this.updateStrikes = function (strikes) {
			$("#strikes table tr:last td").eq(placeTable).html(strikes);
		}

		// 
		this.smallRoundStarted = function () {
			
		}

		this.smallRoundEnded = function () {
			$(".card", dom).fadeOut("fast", function () {
				$(this).remove();
			});
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
				$.each(players, function (key, player) {
					if (player != null) {
						player.smallRoundStarted();
					}
				});
				wait = 500;
				break;

			case "roundStarted":
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
				if (players[user.id] == null) {
					players[user.id] = new Player(user.id, user.name);
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
					// only update players once
					if (playersJoined == 0) {
						updatePlayerInfo();
						playersJoined = 1;
					}

					playersCount++;
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
			return "Achtung! Wenn du diese Seite verlässt, beendest du damit auch dieses Spiel und verlierst deinen Einsatz! Möchtest du dieses Spiel wirklich beenden?";
		});
		// user actions
		actionsBox = $(".bottom .actions");
		actions = ["fold", "call", "knock"];
		$.each(actions, function (key, action) {
			$("."+action, actionsBox).click(function () {
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
		//setTimeout(finishStart, 1300);

	}

}

// initiate
$(window).load(game.init);