$(function () {
	var updateGames = function (init) {
		$(".updating").show();
		$.getJSON("/games?ajax=1", function (data) {
			$.each(data.games, function (key, value) {
				$("#"+key).html(value);
			});
			$(".games").each(function (key, obj) {
				$(".cats span").eq(key).html(Math.max(0, $(obj).find("tr").length-1));
			});
			if (init == true) {
				var show;
				if ($(".cats span:last").html() > 0) {
					show = "last";
				} else {
					show = "first";
				}
				$(".cats a:"+show+", .games:"+show).addClass("active");
			}
			$(".updating").hide();
			setTimeout(updateGames, 5000);
		});
	}
	$(".cats a").click(function (e) {
		if (!$(this).is(".active")) {
			$(".cats a, .games").toggleClass("active");
		}
		e.preventDefault();
	});
	updateGames(true);
});