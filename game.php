<?php
include('include/main.php');
// no game id given -> kick back to games overview
if (empty($_GET['id']))	redirectTo("games.php");
kickGuests();

function joinError($msg) {
	showError($msg);
	redirectTo("games.php");
}

// get game info from db
$result = $_db->query('SELECT * FROM games WHERE id = ?', array($_GET['id']));
$game = $result->fetch();
// no game found ?
if (empty($game['id']))	{
	joinError("Das Spiel konnte nicht gefunden werden.<br />Wasn da wieder los?");
}

// access ?
if ($game['host'] != $_user['id'] && $game['public'] == 0) {
	$result = $_db->query('SELECT user FROM users_friends WHERE user = ? AND friend = ?', array($_user['id'], $game['host']));
	$friend = $result->fetch();
	if (empty($friend['user'])) {
		joinError("Du hast keinen Zugang zu diesem Spiel!");
	}
}

// check if player has not already joined this game
$result = $_db->query('SELECT user, authcode FROM games_players WHERE game = ? AND user = ?', array($game['id'], $_user['id']));
$user = $result->fetch();
// game has already started ?
if ($game['started']) {
	if (!empty($user['user'])) {
		joinError("Du hast das Spiel verlassen!");
	} else {
		joinError("Sorry, zu spät!<br />Das Spiel hat bereits begonnen!");
	}
}

// game is full ?
if ($game['players'] >= $game['maxplayers']) {
	joinError("Alle Plätze im Spiel sind bereits vergeben!");
}

// credit ?
if ($game['bet'] > $_user['credit']) {
	joinError("Du hast nicht mehr genug Guthaben für dieses Spiel!");
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
