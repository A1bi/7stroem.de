<?php
include('include/main.php');
// TODO: error messages for user
// TODO: non public access
// no game id given -> kick back to games overview
if (empty($_GET['id']))	redirectTo("games.php");
kickGuests();

function joinError($msg) {
	showError($msg);
	redirectTo("games.php");
}

// get game info from db
$result = $_db->query('SELECT * FROM games WHERE id = ? AND (public = 1 OR host = ?)', array($_GET['id'], $_user['id']));
$game = $result->fetch();
// no game found ?
if (empty($game['id']))	{
	joinError("Das Spiel konnte nicht gefunden werden.<br />Wasn da wieder los?");
}
// game has already started ?
if ($game['started']) {
	joinError("Sorry, zu spät!<br />Das Spiel hat bereits begonnen!");
}
// game is full ?
if ($game['players'] >= $game['maxplayers']) {
	joinError("Alle Plätze im Spiel sind bereits vergeben!");
}

// check if player has not already joined this game
$result = $_db->query('SELECT user, authcode FROM games_players WHERE game = ? AND user = ?', array($game['id'], $_user['id']));
$user = $result->fetch();
// player can rejoin the lobby before game has started
if (!empty($user['user']) && $game['started']) {
	joinError("Du bist diesem Spiel bereits begetreten!<br />Schau mal in deinem Browser nach, ob du es nicht irgendwo geöffnet oder warte einen Moment.");
}

// initiate butler connection
loadComponent("butler");
$butler = new butler;

// TODO: authcode nicht mehr speichern sondern neu generieren und beim butler registrieren
if (empty($user['user'])) {
	// join game
	$authcode = createId(6);
	if ($butler->registerPlayer($game['id'], $_user['id'], $authcode)) {
		$_db->query('INSERT INTO games_players VALUES (?, ?, ?)', array($game['id'], $_user['id'], $authcode));
		$_db->query('UPDATE games SET players = players+1 WHERE id = ?', array($game['id']));
	// some error occurred while trying to registerPlayer with butler
	} else {
		joinError("Sorry, wir konnten dich zu dem Spiel nicht hinzufügen!<br />Irgendwas ist da schief gelaufen.");
	}
} else {
	$authcode = $user['authcode'];
}

// prepare templates
$_tpl->assign(array(
	"username" => $_user['name'], "userid" => $_user['id'], "authcode" => $authcode, "gameid" => $game['id'],
	"maxplayers" => $game['maxplayers'], "public" => $game['public'], "bet" => formatCredit($game['bet']), "host" => $game['host']
));
$jsvars = $_tpl->fetch("game_js.tpl");
$_tpl->assign("js", $jsvars);
$_tpl->display("game.tpl");
?>
