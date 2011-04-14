var main = new function () {

	var _this = this;

	this.animationTime = function (time, dependend) {
		if ((dependend && Modernizr.csstransitions) || navigator.platform.indexOf("iPhone") != -1 || navigator.platform.indexOf("iPod") != -1) {
			time = 0;
		}
		return time;
	}

	this.userbox = new function () {

		this.updateCredit = function () {
			$.getJSON("/ajax.php?action=getCredit", function (data) {
				dom = $(".userbox .credit span").addClass("updating", _this.animationTime(400, true));
				setTimeout(function () {
					dom.html(data.credit);
					dom.removeClass("updating", _this.animationTime(400, true));
				}, 500);
			});

		}

	}

	this.facebook = new function () {

		this.showAuthDialog = function (uri) {
			fb = window.open("https://www.facebook.com/dialog/oauth?client_id=211597832188896&display=popup&redirect_uri=http://"+window.location.host+"/"+uri, "fb", "dependent=yes,width=550px,height=320px,status=no,scrollbars=no,resizable=no");
			fb.focus();
			return false;
		}
	}

	this.showBubble = function (type, content, pos, hide) {
		if (hide == undefined) {
			if (pos == undefined) {
				hide = 4000;
			} else {
				hide = 0;
			}
		}
		if (pos == undefined || pos == "") {
			pos = {
				of: $("#logo"), at: "left bottom", my: "left top", tri: "top l", offset: "20 0"
			};
		}
		bubble = new Bubble;
		bubble.setType(type);
		bubble.setContent(content);
		bubble.pos = pos;
		bubble.autoHide = hide;
		bubble.destroy = true;
		bubble.show();
	}

	this.getGet = function (key) {
		gets = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (i = 0; i < gets.length; i++) {
			parts = gets[i].split('=');
			if (parts[0] != key) continue;
			return parts[1];
		}
	}

	$(function () {
		// check if errors present
		if (window.bubble != undefined) {
			if (bubble['pos'] != undefined) {
				bubble['pos'].of = $(bubble['pos'].of);
			}
			_this.showBubble(bubble['type'], bubble['msg'], bubble['pos'], bubble['autoHide']);
		}
	});

}

function Bubble() {

	var _this = this;
	this.autoHide = 0;
	this.pos = null;
	var triSet = false;
	var shown = false;
	this.destroy = false;
	var type = "";
	var icon = "";
	var aniDirection;
	var timeout;

	this.show = function () {
		// disable collision detection
		this.pos.collision = "none";

		// set triangle if not yet done
		if (!triSet) {
			// set a default offset
			if (this.pos.offset == undefined || this.pos.offset == "") this.pos.offset = "0 0";
			// split x and y offset
			offs = this.pos.offset.split(" ");

			tri = this.pos.tri.split(" ");
			aniDirection = tri[0];
			if (aniDirection == "bottom" || aniDirection == "top") {
				if (aniDirection == "bottom") {
					aniDirection = "down";
				} else if (aniDirection == "top") {
					aniDirection = "up";
				}
				this.pos.offset = offs[0] + " " + ( parseInt(offs[1]) + ((tri[0] == "top") ? 24 : -24) );
			} else {
				this.pos.offset = ( parseInt(offs[0]) + ((tri[0] == "left") ? 24 : -24) ) + " " + offs[1];
			}
			bubble.addClass(this.pos.tri);
			triSet = true;
		}

		bubble.position(this.pos);

		if (shown) {
			clearTimeout(timeout);
		} else {
			bubble.css("visibility", "visible").hide();
			if (type == undefined) this.setType("info");
			shown = true;
			bubble.show("drop", {direction: aniDirection}, main.animationTime(600)).fadeTo(main.animationTime(400), 0.9);
		}

		// create timer for automatic hiding
		if (this.autoHide > 0) {
			timeout = setTimeout(function () {
				bubble.fadeOut(main.animationTime(800), function () {
					if (_this.destroy) {
						bubble.remove();
					} else {
						bubble.css("visibility", "hidden").show();
					}
				});
				shown = false;
			}, this.autoHide);
		}
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