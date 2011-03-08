<?php
define("NO_SESSION", true);
include('include/main.php');

// authcode
$authcode = "kqecbi50PLZvDkyp";

// parse json request
$request = json_decode($_GET['request'], true);
if (!$request) exit("error: bad request");

// check if authcode is correct
if ($request['authcode'] != $authcode) exit("error: authentication failed");

// get game info
$result = $_db->query('SELECT id, players, bet FROM games WHERE id = ?', array($request['game']));
$game = $result->fetch();
if (empty($game['id'])) exit("error: game not found");

switch ($request['request']) {
	case "roundEnded":
		// check number of player - minimum 2, maximum 4
		if ($request['players'] > 4 || $request['players'] < 2) {
			exit("error: invalid number of players");
		}
		// reward winner
		$result = $_db->query('	UPDATE	users AS u,
										games_players AS gp
								SET		u.credit = u.credit + ?
								WHERE	gp.game = ?
								AND		gp.user = ?
								AND		gp.user = u.id',
				array($game['bet']*$request['players'], $request['game'], $request['winner']));
		if ($result->rowCount() < 1) {
			echo "error: not allowed";
		} else {
			// add transaction to database
			$_db->query('INSERT INTO users_transactions VALUES (?, ?, ?, 1, ?)', array($request['winner'], $game['bet'], time(), $game['id']));
			echo "ok";
		}
		break;

	case "roundStarted":
		// get all players of this game
		$result = $_db->query('	SELECT	u.id,
										u.credit
								FROM	users AS u,
										games_players AS gp
								WHERE	gp.game = ?
								AND		gp.user = u.id',
				array($game['id']));
		$players = 0;
		while ($user = $result->fetch()) {
			$newCredit = $user['credit']-$game['bet'];
			if ($newCredit >= 0) {
				$_db->query('UPDATE users SET credit = ? WHERE id = ?', array($newCredit, $user['id']));
			// TODO: falls user keine kohle mehr hat, was dann ???
			} else {

			}
			$players++;
		}
		// check if any players were affected
		if ($players == $game['players']) {
			echo "ok";
		} else {
			echo "error: no players";
		}
		break;

	default:
		echo "error: request unknown";
}

?>
