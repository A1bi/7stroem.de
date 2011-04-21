<?php
define("NO_SESSION", true);
include('include/main.php');

// authcode
$authcode = "kqecbi50PLZvDkyp";

// parse json request
$request = json_decode(urldecode($_POST['request']), true);
if (!$request) exit("error: bad request");

// check if authcode is correct
if ($request['authcode'] != $authcode) exit("error: authentication failed");

$response = array();

// get game info
$result = $_db->query('SELECT id, players, bet FROM games WHERE id = ?', array($request['game']));
$game = $result->fetch();
if (empty($game['id'])) exit("error: game not found");

switch ($request['request']) {
	case "roundEnded":
		// check number of player - minimum 2, maximum 4
		if ($request['players'] > 4 || $request['players'] < 2) {
			$response['error'] = "invalid number of players";
			break;
		}
		// reward winner
		$result = $_db->query('	UPDATE	users AS u,
										games_players AS gp
								SET		u.credit = u.credit + ?,
										u.won = u.won+1
								WHERE	gp.game = ?
								AND		gp.user = ?
								AND		gp.user = u.id',
				array($game['bet']*$request['players'], $request['game'], $request['winner']));
		if ($result->rowCount() < 1) {
			$response['error'] = "not allowed";
		} elseif ($game['bet'] > 0) {
			// add transaction to database
			$_db->query('INSERT INTO users_transactions VALUES (?, ?, ?, 1, ?)', array($request['winner'], $game['bet'], time(), $game['id']));
		}
		$response['result'] = "ok";
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
		// array for the players who have to be kicked because they don't have the money for the bet
		$response['kick'] = array();
		while ($user = $result->fetch()) {
			$newCredit = $user['credit']-$game['bet'];
			if ($newCredit >= 0) {
				$_db->query('UPDATE users SET credit = ?, rounds = rounds+1 WHERE id = ?', array($newCredit, $user['id']));
			} else {
				$response['kick'][] = $user['id'];
			}
			$players++;
		}
		// check if any players were affected
		if ($players == $game['players']) {
			$response['result'] = "ok";
		} else {
			$response['error'] = "no players";
		}
		break;

	case "playerQuit":
		// get all players of this game
		$result = $_db->query('	DELETE FROM		games_players
								WHERE			game = ?
								AND				user = ?',
				array($game['id'], $request['player']));
		// anyone deleted ?
		if ($result->rowCount() > 0) {
			// update players counter
			$_db->query('UPDATE games SET players = players-1 WHERE id = ?', array($game['id']));
			$response['result'] = "ok";
		} else {
			$response['error'] = "player not found";
		}
		break;
		
	case "changeHost":
		$_db->query('UPDATE games SET host = ? WHERE id = ?', array($request['host'], $game['id']));
		break;

	case "startGame":
		// get all players of this game
		$_db->query('UPDATE games SET started = 1 WHERE id = ?', array($game['id']));
		$response['result'] = "ok";
		break;

	case "finishGame":
		// get all players of this game
		$_db->query('UPDATE games SET finished = 1 WHERE id = ?', array($game['id']));
		$response['result'] = "ok";
		break;

	default:
		$response['error'] = "unknown request";
}

echo json_encode($response);

?>
