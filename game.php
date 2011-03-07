<?php
include('include/main.php');
// TODO: error messages for user
// TODO: non public access
// no game id given -> kick back to games overview
if (empty($_GET['id']))	redirectTo("games.php");
kickGuests();

// get game info from db
$result = $_db->query('SELECT * FROM games WHERE id = ? AND (public = 1 OR host = ?)', array($_GET['id'], $_user['id']));
$game = $result->fetch();
// no game found ?
if (empty($game['id']))	redirectTo("games.php");
// game has already started ?
if ($game['started']) redirectTo("games.php");
// game is full ?
if ($game['players'] >= $game['maxplayers']) redirectTo("games.php");

// check if player has not already joined this game
$result = $_db->query('SELECT user, authcode FROM games_players WHERE game = ? AND user = ?', array($game['id'], $_user['id']));
$user = $result->fetch();
// player can rejoin the lobby before game has started
if (!empty($user['user']) && $game['started']) redirectTo("games.php");

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
		redirectTo("games.php");
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
