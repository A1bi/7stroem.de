var main = new function () {

	this.animationTime = function (time, dependend) {
		if ((dependend && Modernizr.csstransitions) || navigator.platform.indexOf("iPhone") != -1 || navigator.platform.indexOf("iPod") != -1) {
			time = 0;
		}
		return time;
	}

	this.userbox = new function () {

		this.updateCredit = function () {
			$.getJSON("ajax.php?action=getCredit", function (data) {
				dom = $(".userbox .credit").addClass("updating", main.animationTime(400, true));
				setTimeout(function () {
					dom.html(data.credit);
					dom.removeClass("updating", main.animationTime(400, true));
				}, 405);
			});

		}

	}

	this.showBubble = function (type, content, pos, hide) {
		bubble = new Bubble;
		bubble.setType(type);
		bubble.setContent(content);
		bubble.setPosition(pos);
		bubble.autoHide = hide;
		bubble.show();
	}

	$(function () {
		// check if errors present
		if (window.bubble != undefined) {
			if (bubble['autoHide'] == undefined) {
				if (bubble['pos'] == undefined) {
					bubble['autoHide'] = 4000;
				} else {
					bubble['autoHide'] = 0;
				}
			}
			if (bubble['pos'] == undefined) {
				bubble['pos'] = {
					of: $(".header .left"), at: "left bottom", my: "left top", tri: "top l", offset: "50 0"
				};
			} else {
				bubble['pos'].of = $(bubble['pos'].of);
			}
			main.showBubble(bubble['type'], bubble['msg'], bubble['pos'], bubble['autoHide']);
		}
	});

}

function Bubble() {

	this.autoHide = 0;
	var shown = false;
	var type = "";
	var icon = "";
	var aniDirection;
	var timeout;

	this.show = function () {
		if (shown) {
			clearTimeout(timeout);
		} else {
			if (type == undefined) this.setType("info");
			shown = true;
			bubble.show("drop", {direction: aniDirection}, main.animationTime(600)).fadeTo(main.animationTime(400), 0.9);
		}
		if (this.autoHide > 0) {
			timeout = setTimeout(function () {
				bubble.fadeOut(main.animationTime(800));
				shown = false;
			}, this.autoHide);
		}
	}

	this.setPosition = function (posObj) {

		aniDirection = posObj.tri.split(" ")[0];
		posObj.collision = "none";
		if (aniDirection == "bottom") aniDirection = "down";
		else if (aniDirection == "top") aniDirection = "up";

		bubble.addClass(posObj.tri).position(posObj).css("visibility", "visible").hide();
	}

	this.setIcon = function (i) {
		if (i == icon) return;
		icon = i;
		switch (i) {
			case "chat":
				y = 0;
				break;
			case "error":
				y = 25;
				break;
		}
		space.append($("<div>").addClass("icon").css("background-position", "0 -"+y+"px"));
		space.addClass("i");
	}

	this.get = function () {
		return bubble;
	}

	this.setContent = function (con) {
		content.html(con);
	}

	this.setType = function (t) {
		if (t == type) return;
		bubble.removeClass(type).addClass(t);
		type = t;
		if (type == "error") {
			this.setIcon(type);
		}
	}

	var bubble = $("<div>").addClass("bubble").append($("<div>").addClass("triangle"));
	var space = $("<div>").addClass("space").appendTo(bubble);
	var content = $("<div>").addClass("text").appendTo(space);
	bubble.appendTo($(".bubbles"));

}