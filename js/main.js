function animationTime(time, dependend) {
	if ((dependend && $.browser.webkit) || navigator.platform.indexOf("iPhone") != -1 || navigator.platform.indexOf("iPod") != -1) {
		time = 0;
	}
	return time;
}

var main = new function () {

}

function Bubble() {

	this.autoHide = 0;
	var shown = false;
	var type = "";
	var icon = "";
	var aniDirection;

	this.show = function () {
		if (shown) return;
		shown = true;
		bubble.show("drop", {direction: aniDirection}, animationTime(500)).fadeTo(animationTime(400), 0.9);
		if (this.autoHide > 0) {
			bubble.delay(this.autoHide).fadeOut(animationTime(800), function () {
				shown = false;
			});
		}
	}

	this.setPosition = function (of, at, my, tri, offset) {
		if (offset == undefined) offset = 0;

		aniDirection = tri.split(" ")[0];
		if (aniDirection == "bottom") aniDirection = "down";
		else if (aniDirection == "top") aniDirection = "up";

		bubble
		.addClass(tri)
		.position({
			of: of,
			at: at,
			my: my,
			offset: offset
		})
		.css("visibility", "visible").hide();
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

	if (type == undefined) type = "info";
	var bubble = $("<div>").addClass("bubble").append($("<div>").addClass("triangle"));
	var space = $("<div>").addClass("space").appendTo(bubble);
	var content = $("<div>").addClass("text").appendTo(space);
	bubble.appendTo($(".bubbles"));

}