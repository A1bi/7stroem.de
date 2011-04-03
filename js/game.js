var game = new function () {

	var _this = this;
	var players = [];
	var playersCount = 0;
	var playersSmallRound = 0;
	var rounds = 0;
	var queue = [];
	this.turn = -1;
	var activeKnock = -1;
	var knockPossible = true;
	var poor = false;
	var flipped = false;
	var blockExit = false;
	var processing = false;

	var positions = [];
	positions[0] = "left";
	positions[1] = "top";
	positions[2] = "left";
	positions[3] = "top";
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
			// add active class so hover event gets triggered
			card.addClass("active");
			// set correct background and fade in
			front = $(".front", card).css("background-position", getBackground()).delay(200).fadeIn(animationTime(200));
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
			// add switch class so the card will move onto stack
			card.switchClass("hand", "stack", animationTime(500, true));
			// also move the front to a random position inside the card container
			pos = {"left": Math.round(Math.random() * 40), "top": Math.round(Math.random() * 40)};
			if ($.browser.webkit) {
				// webkit browser will animate on their own
				card.find("div").css(pos);
			} else {
				card.find("div").animate(pos, {queue: false});
			}
		}

		this.fold = function () {
			if (laid || place == 0) {
				$(".front", card).fadeOut(animationTime(300));
				$(".back", card).fadeIn(animationTime(400));
			}
			if (laid) {
				remove = "stack";
				
			} else {
				remove = "hand";
			}
			card.switchClass(remove, "folded", animationTime(500, true));
		}

		var card = $("<div>").addClass("card hand").append($("<div>").addClass("back"), $("<div>").addClass("front"));

		// add it to the players hand
		dom = $(".players > div").eq(place).find(".cards");
		card.appendTo(dom).css(positions[place], i*50).delay(i*100).fadeIn(animationTime(400));

	}


	// player
	function Player(i, n) {

		this.id = i;
		this.name = n;
		var _this = this;
		this.strikes = 0;
		var place = 0;
		var placeTable = 0;
		var dom;
		var listDom;
		var tableDom;
		var cards = [];

		var removeCards = function () {
			$(".card", dom).fadeOut(animationTime(400), function () {
				$(this).remove();
			});
		}

		var setFlag = function (flag) {
			if (!flag) flag = "";
			flagDom = $(".flag", dom);
			if (flag == "") {
				if (!flagDom.is(":hidden")) {
					flagDom.fadeIn(animationTime(100));
				}
			} else {
				flagDom.html(flag).fadeIn(animationTime(100));
			}
		}

		this.startGame = function (i, p) {
			place = p;
			placeTable = i;
			dom = $(".players > div").eq(place);
			// add player to strikes table
			// +1 because first cell is for round number
			tableDom = $("#strikes .top td").eq(placeTable+1);
			tableDom.html(this.name);
			// set player's name on the table
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
		this.updateStrikes = function (newState) {
			for (i = this.strikes+1; i <= newState; i++) {
				sDom = $("<div>").addClass("strike action");
				if (i % 5 == 0) {
					sDom.addClass("cross");
				} else {
					pos = 100 + Math.round(Math.random() * 7) * 5;
					sDom.css("background-position", "-"+pos+"px -207px").css("left", i*6+"px");
				}
				$("#strikes .sTable tr:last td > div").eq(placeTable).append(sDom);
			}
			this.strikes = newState;
		}

		// show cards in hand
		this.flipHand = function (i, cardid) {
			cards[i].flip(cardid);
			cards[cardid] = cards[i];
		}

		this.roundStarted = function () {
			this.strikes = 0;
			dom.removeClass("out");
			setFlag();
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
				$("#knockSfx").get(0).play();
			}, 100);
			setTimeout(function () {
				knockDom.addClass("down", animationTime(400, true));
			}, 1000);
		}

		this.blindKnocked = function (knocks) {
			$(".knocked div", dom).html("<b>"+knocks+"</b><br />blind");
			this.knocked();
		}

		this.knockFinished = function () {
			$(".knocked", dom).fadeOut(animationTime(400));
			$(".knocked div", dom).html("");
		}

		this.folded = function () {
			for (i = 0; i < 4; i++) {
				cards[i].fold();
			}
		}

		this.poor = function () {
			setFlag("arm");
		}

		this.out = function () {
			dom.addClass("out");
			setFlag("raus");
		}

		this.quit = function () {
			// check if game is not yet started by looking if area is pulled out
			if (!$(".area", dom).is(".shown")) {
				// remove player from list
				listDom.remove();
				
				// increase player counter
				$("#maxplayers").html(parseInt($("#maxplayers").html())+1);

			} else {
				removeCards();
				tableDom.addClass("quit");
				this.roundEnded();
			}

		}

		// add player to list
		listDom = $("<li>").html(n);
		listDom.appendTo($("#overview ul"));
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

		// register host action
		this.registerHostAction = function (action) {
			if (content == null) content = "";
			makeRequest("registerHostAction", "action=" + action);
		}

	}

	var fadeActionBtn = function (action, show, time) {
		if (time == undefined) time = 400;
		if (show) {
			$(".actions ."+action).fadeIn(animationTime(time));
		} else {
			$(".actions ."+action).fadeOut(animationTime(time));
		}
	}

	var toggleActionBtn = function (action, show, time) {
		if ((action == "knock" && !poor && knockPossible && flipped) || action != "knock") {
			fadeActionBtn(action, show, time);
		}
		if (action == "activeKnock" && show) {
			fadeActionBtn("knock", false, time);
		}
	}

	var setTurn = function (player) {
		// set turn
		if (_this.turn != player) {
			if (_this.turn > -1 && players[_this.turn] != null) players[_this.turn].toggleTurn();
			_this.turn = player;
			players[_this.turn].toggleTurn();
		}
	}

	var knocked = function (player) {
		if (player > -1) {
			info = players[player].name + " hat geklopft!";
		} else {
			info = "Jemand ist arm!";
		}
		$(".activeKnock .info").html(info);
		fadeActionBtn("blindKnock", false);
		toggleActionBtn("knock", false);
		activeKnock = player;
		if (player == userid) {
			knockPossible = false;
		} else {
			knockPossible = true;
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
				break;

			case "turn":
				setTurn(action.player);
				
				// finish knock ?
				if (activeKnock > -1) {
					players[activeKnock].knockFinished();
					activeKnock = -1;
					toggleActionBtn("activeKnock", false);
				}
				knock = false;
				if (action.player == userid) {
					knock = true;
				}
				toggleActionBtn("knock", knock);
				break;

			case "knockTurn":
				setTurn(action.player);
				call = false;
				if (action.player == userid) {
					call = true;
				}
				toggleActionBtn("activeKnock", call);
				break;

			// some player has laid on of his cards on his stack
			case "laidStack":
				players[action.player].laidStack(action.content);
				break;

			case "smallRoundStarted":
				playersSmallRound = 0;
				knockPossible = true;
				flipped = false;
				$.each(players, function (key, player) {
					if (player != null) {
						playersSmallRound++;
						player.smallRoundStarted();
					}
				});
				fadeActionBtn("flipHand", true);
				if (!poor) {
					// update strike selection
					knockDom = $(".blindKnock select");
					knockDom.empty();
					for (i = 1; i <= 7-players[userid].strikes; i++) {
						knockDom.append($("<option>").html(i));
					}
					fadeActionBtn("blindKnock", true);
				} else {
					knocked(-1);
				}
				break;

			case "roundStarted":
				// hide new round button
				$("#strikes .newRound").hide();
				blockExit = true;
				rounds++;
				row = $("<tr>");
				for (i = 0; i < 5; i++) {
					cell = $("<td>");
					// add first cell for round number
					if (i == 0) {
						cell.html(rounds);
					} else {
						cell.append($("<div>"));
					}
					row.append(cell);
				}
				$("#panel").addClass("down", animationTime(500, true));
				strikesDom = $("#strikes");
				$("actions", strikesDom).hide();
				$(".sTable", strikesDom).removeClass("smaller").find("table").append(row);
				wait = 700;
				waitFunction = function () {
					$.each(players, function (key, player) {
						if (player != null) player.roundStarted();
					});
					processQueue(true);
				}
				break;

			case "roundEnded":
				logAction(players[action.player].name + " hat diese Runde gewonnen.");
				fadeActionBtn("knock", false, 100);
				$.each(players, function (key, player) {
					if (player != null) player.roundEnded();
				});
				$("#panel").removeClass("down", animationTime(500, true));
				strikesDom = $("#strikes");
				actionsDom = $(".actions", strikesDom);
				$(".sTable", strikesDom).addClass("smaller");
				if (host == userid) {
					$(".newRound", actionsDom).show();
					$(".waiting", actionsDom).hide();
				} else {
					$(".newRound", actionsDom).hide();
					$(".waiting", actionsDom).show();
				}
				actionsDom.show();
				blockExit = false;
				break;

			case "out":
				logAction(players[action.player].name + " ist raus.");
				players[action.player].out();
				break;

			case "smallRoundEnded":
				poor = false;
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
					toggleActionBtn("activeKnock", false);
				}
				players[action.player].folded();
				playersSmallRound--;
				break;

			case "called":
				if (action.player == userid) {
					toggleActionBtn("activeKnock", false);
				}
				break;

			case "knocked":
				knocked(action.player);
				players[action.player].knocked();
				break;

			case "blindKnocked":
				knocked(action.player);
				players[action.player].blindKnocked(action.content);
				fadeActionBtn("blindKnock", false);
				break;

			case "poor":
				if (!poor) poor = true;
				players[action.player].poor();
				break;

			// a player left
			case "playerQuit":
				logAction(players[action.player].name + " hat das Spiel verlassen.");
				players[action.player].quit();
				// remove from list
				delete players[action.player];
				players[action.player] = null;
				playersSmallRound--;
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
		message = players[player].name + ": " + decodeURIComponent(message);
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
			$.each(data.users, function (key, user) {
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
		} else if (activeKnock > 0) {
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

				// got updated number of strikes for user
				case "strikes":
					players[action.player].updateStrikes(parseInt(action.content));
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
				fadeActionBtn("flipHand", false, 200);
				fadeActionBtn("blindKnock", false, 200);
				flipped = true;
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
				case "auth":
					alert("Authentifizierung fehlgeschlagen!");
					break;
				default:
					alert("Es ist ein Fehler bei dieser Aktion aufgetreten. Versuchs noch mal :)");
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
		$("#strikes").delay(500).fadeIn(animationTime(400));
	}


	var start = function () {
		// TODO: bitte warten anzeigen
		if (playersCount < 2) {
			alert("Zu wenig Spieler!");
			return;
		}
		butler.registerHostAction("startGame");
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
		$("#startGame .startBtn").click(start);
		$("#strikes .newRound").click(function () {
			butler.registerHostAction("newRound");
		});
		// chat
		// user focused message field
		$(".chat form input").focus(function () {
			if ($(this).is(".inactive")) {
				$(this).removeClass("inactive").val("");
			}
		});
		// user submitted a message
		$(".chat form").submit(function () {
			message = encodeURIComponent($(this).find("input").val());
			if (message == "") return false;
			$(this).find("input").val("");
			butler.registerAction("chat", message);
			return false;
		});
		// user used c shortcut
		$(document).keyup(function (event) {
			field = $(".players .bottom .chat input");
			if (event.which == 67 && !field.is(":focus")) {
				field.focus();
			}
		})
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
		$(".blindKnock .btn").click(function () {
			butler.registerAction("blindKnock", $(".blindKnock select").val());
		});

		// start game box
		hostChanged();

		/* testing
		players[1] = new Player(1, "Albi");
		players[2] = new Player(2, "Bla");
		players[3] = new Player(3, "Bla2");
		players[4] = new Player(4, "Bla3");
		setTimeout(function () {
			queue.push({"player":"1", "action": "started", "content": ""});
			queue.push({"player":"1", "action": "roundStarted", "content": ""});
			queue.push({"player":"1", "action": "poor", "content": ""});
			queue.push({"player":"1", "action": "smallRoundStarted", "content": ""});
			queue.push({"player":"1", "action": "turn", "content": ""});
			processQueue(true);
		}, 1500);
		setTimeout(function () {
			players[1].flipHand(1, "c9");
			players[1].laidStack("c9");
			players[3].laidStack("h5");
			players[3].laidStack("s7");
			players[3].laidStack("d5");
			players[3].laidStack("d6");
		}, 3000);
		setTimeout(function () {
			//queue.push({"player":"2", "action": "poor", "content": ""});
			//queue.push({"player":"1", "action": "knockTurn", "content": ""});
			players[1].updateStrikes("7");
			//queue.push({"player":"1", "action": "smallRoundEnded", "content": ""});
			//queue.push({"player":"1", "action": "roundEnded", "content": ""});
			processQueue(true);
		}, 4000);*/

	});

}