<?php
include('include/main.php');
// TODO: error messages for user
// no game id given -> kick back to games overview
if (empty($_GET['id']))	redirectTo("games.php");
kickGuests();

$_tpl->display("game.tpl");
exit();

// get game info from db
$result = $_db->query('SELECT * FROM games WHERE id = ? AND (public = 1 OR creator = ?)', array($_GET['id'], $_user['id']));
$game = $result->fetch();
// no game found ?
if (empty($game['id']))	redirectTo("games.php");
// game has already started ?
if ($game['started']) redirectTo("games.php");
// game is full ?
if ($game['players'] >= $game['maxplayers']) redirectTo("games.php");

// check if player has not already joined this game
$result = $_db->query('SELECT user FROM games_players WHERE game = ? AND user = ?', array($game['id'], $_user['id']));
$user = $result->fetch();
if (!empty($user['user'])) redirectTo("games.php");

// initiate butler connection
loadComponent("butler");
$butler = new butler;

// join game
$authcode = createId(6);
if ($butler->registerPlayer($game['id'], $_user['id'], $authcode)) {
	$_db->query('INSERT INTO games_players VALUES (?, ?)', array($game['id'], $_user['id']));
	$_db->query('UPDATE games SET player = player+1 WHERE id = ?', array($game['id']));
// some error occurred while trying to registerPlayer with butler
} else {
	redirectTo("games.php");
}

echo "ok";
?>
