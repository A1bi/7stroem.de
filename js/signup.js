var signup = new function () {
	var step = 0;
	var fb = false;

	var stepError = function (s, msg) {
		main.showBubble("error", msg, {of: s, at: "right", my: "left", tri: "left t"}, 8000);
		button = s.closest(".step").find(".next input").show();
		button.next().hide();
	}

	var checkUsername = function (sBox) {
		field = sBox.find("input").first();
		if (field.val() == "") {
			stepError(field, "Bitte gib einen Spielernamen ein.");
		} else if (!/^[a-zA-Z0-9._-]+$/.test(field.val())) {
			stepError(field, "Bitte nur Buchstaben, Zahlen und . _ -");
		} else if (field.val().length < 3) {
			stepError(field, "Der Name muss mindestens 3 Zeichen lang sein.");
		} else {
			$.post("/signup.php?ajax=1", {action: "username", name: field.val()}, function (response) {
				if (response.result == "ok") {
					if (fb) {
						save();
					} else {
						nextStep();
					}
				} else {
					stepError(field, "Dieser Spielername ist leider schon vergeben.<br />Versuchs mit einem anderen.");
				}
			}, "json");
		}
	}

	var showFbAuth = function () {
		main.facebook.showAuthDialog('signup?action=finishFb');
	}

	this.finishFb = function (success, known) {
		if (!success) {
			stepError($("#facebook p img"), "Anscheinend hast du abgelehnt..<br />Du kannst den Schritt auch überspringen.");
		} else {
			if (known) {
				stepError($("#facebook p img"), "Dieses Facebook-Konto wurde bereits<br />mit einem anderen Spieler verbunden.");
			} else {
				finishStep($("#password"));
				finishStep($("#email"));
				nextStep();
			}
		}
	}

	var checkPassword = function (sBox) {
		fields = sBox.find("input");
		if (fields.eq(0).val() != fields.eq(1).val()) {
			stepError(fields.eq(0), "Die Passwörter stimmen nicht überein!");
		} else if (fields.eq(0).val().length < 6) {
			stepError(fields.eq(0), "Das Passwort ist zu kurz!<br />Bitte verwende mindestens 6 Zeichen.");
		} else {
			nextStep();
		}
	}

	var save = function () {
		steps = $(".step");
		$.post("/signup.php?ajax=1", {
			action: "save",
			username: steps.eq(0).find("input").first().val(),
			email: steps.eq(3).find("input").eq(0).val(),
			name: steps.eq(3).find("input").eq(1).val(),
			pass: steps.eq(2).find("input").eq(0).val()
		}, function (response) {
			if (response.result == "ok") {
				nextStep();
			} else {
				main.showBubble("error", "Irgendwas ist da schief gelaufen.<br />Bitte versuchs nochmal!");
			}
		}, "json");
	}

	var checkMail = function (sBox) {
		field = sBox.find(".contnt table input").eq(0);
		if (!/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z]){2,9}$/.test(field.val())) {
			stepError(field, "Die e-mail Adresse ist nicht korrekt!");
		} else {
			save();
		}
	}

	var checkStep = function () {
		s = $(this).closest(".step");
		$(this).hide();
		$(this).next().show();

		switch (s.attr("id")) {
			case "username":
				checkUsername(s);
				break;
			case "facebook":
				nextStep();
				break;
			case "password":
				checkPassword(s);
				break;
			case "email":
				checkMail(s);
				break;
		}
	}

	var finishStep = function (sBox) {
		sBox.find(".finished").show();
	}
	
	var hideStep = function (s) {
		sBox = $(".step").eq(s);
		sBox.find(".contnt").addClass("collapsed", 400);
		finishStep(sBox);
	}

	var showStep = function (s, noAnimation) {
		$(".step .contnt").eq(s).removeClass("collapsed", (noAnimation) ? 0 : 400);
	}

	var nextStep = function (noAnimation) {
		hideStep(step);
		while (true) {
			if ($(".step .finished").eq(++step).is(":hidden")) {
				showStep(step);
				break;
			}
		}
	}

	$(function () {
		showStep(0, true);
		$(".next input").click(checkStep);
		fb = main.getGet("fb");
		if (fb) {
			finishStep($("#password"));
			finishStep($("#email"));
			finishStep($("#facebook"));
		} else {
			$("#facebook p img").click(showFbAuth);
		}
	});
}