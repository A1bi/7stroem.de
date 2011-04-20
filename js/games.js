var updateGames = function () {
	$(".updating").show();
	$.getJSON("/games?ajax=1", function (data) {
		$.each(data.games, function (key, value) {
			$("#"+key+" .space").html(value);
		});
		$(".updating").hide();
		setTimeout(updateGames, 10000);
	});
}
$(function () {
	$(".wGrad").each(function () {
		var space = $(this).prev();
		$(this).show().position({of: space, at: "left bottom", my: "left bottom"}).width(space.outerWidth());
	});
	updateGames();
});