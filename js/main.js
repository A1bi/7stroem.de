$.fn.extend({
	transEnd: function (callback) {
		if (callback && Modernizr.csstransitions) {
			event = "TransitionEnd";
			if ($.browser.webkit) {
				event = "webkitTransitionEnd";
			} else if ($.browser.mozilla) {
				event = "transitionend";
			} else if ($.browser.opera) {
				event = "oTransitionEnd";
			}
			this.bind(event, callback);
			this.bind(event, function () {
				$(this).unbind(event);
			});
		}
		return this;
	},
	checkIE: function (speed) {
		if ($.browser.msie) {
			if (this.css("background-image") != "none") return 0;
			this.find("> div").each(function () {
				if ($(this).css("background-image") != "none") {
					speed = 0;
					return;
				}
			});
		}
		return speed;
	},
	__fadeIn: $.fn.fadeIn,
	fadeIn: function (speed, easing, callback) {
		//if (!Modernizr.csstransitions) {
			return this.__fadeIn(this.checkIE(speed), easing, callback);
		//} else {
			//return this.transEnd(callback).css({"visibility": "hidden", opacity: 0}).show()._addClass("fade in");
		//}
	},
	__fadeOut: $.fn.fadeOut,
	fadeOut: function (speed, easing, callback) {
		//if (!Modernizr.csstransitions) {
			return this.__fadeOut(this.checkIE(speed), easing, callback);
		//} else {
		//	return this.transEnd(callback)._addClass("fade out");
		//}
	},
	__addClass: $.fn.addClass,
	addClass: function (classNames, speed, easing, callback) {
		if (speed && !Modernizr.csstransitions) {
			return this.__addClass(classNames, speed, easing, callback);
		} else {
			return this.transEnd(callback)._addClass(classNames);
		}
	},
	__removeClass: $.fn.removeClass,
	removeClass: function (classNames, speed, easing, callback) {
		if (speed && !Modernizr.csstransitions) {
			return this.__removeClass(classNames, speed, easing, callback);
		} else {
			return this.transEnd(callback)._removeClass(classNames);
		}
	},
	__switchClass: $.fn.switchClass,
	switchClass: function (remove, add, speed, easing, callback) {
		if (speed && !Modernizr.csstransitions) {
			return this.__switchClass(remove, add, speed, easing, callback);
		} else {
			return this.transEnd(callback).__switchClass(remove, add, 0);
		}
	},
	__toggleClass: $.fn.toggleClass,
	toggleClass: function (classNames, speed, easing, callback) {
		if (speed && !Modernizr.csstransitions) {
			return this.__toggleClass(classNames, speed, easing, callback);
		} else {
			return this.transEnd(callback)._toggleClass(classNames);
		}
	}
});

var main = new function () {

	var _this = this;

	this.userbox = new function () {

		this.updateCredit = function () {
			$.getJSON("/ajax.php?action=getCredit", function (data) {
				$(".userbox .credit span").addClass("updating", 400, "", function () {
					$(this).html(data.credit);
					$(this).removeClass("updating", 400);
				});
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
			bubble.show("drop", {direction: aniDirection}, 600).fadeTo(400, 0.9);
		}

		// create timer for automatic hiding
		if (this.autoHide > 0) {
			timeout = setTimeout(function () {
				bubble.fadeOut(800, function () {
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