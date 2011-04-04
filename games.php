<?php
include('include/main.php');
kickGuests();
// prepare for butler connections
loadComponent("butler");

// user wants to create a new game
if ($_GET['action'] == "create") {
	$butler = new butler;

	// check and correct given values
	$public = ($_POST['public'] == 0) ? 0 : 1;
	// bet less than 1 cent or more than user's credit ?
	if (intval($_POST['bet']) < 1 || intval($_POST['bet']) > $_user['credit']) {
		$bet = $_user['credit'];
	} else {
		$bet = intval($_POST['bet']);
	}
	$maxplayers = (intval($_POST['maxplayers']) < 2 || intval($_POST['maxplayers']) > 4) ? 4 : intval($_POST['maxplayers']);

	// create db entry
	$_db->query('INSERT INTO games VALUES (null, ?, 0, ?, ?, 0, ?, ?)', array($public, $maxplayers, $bet, time(), $_user['id']));
	$id = $_db->id();
	// create game on server
	if (!$butler->createGame($id, $_user['id'])) {
		// could not create -> remove entry from db
		$_db->query('DELETE FROM games WHERE id = ?', array($id));
		showError("Da ist was schief gelaufen..<br />Wir konnten das Spiel nicht für dich eröffnen.<br />Versuchs einfach nochmal :)", ".create", "right bottom", "right top", "top r", "-40 -20");
		redirectTo("games.php");
	} else {
		// redirect to game
		redirectTo("game.php?id=".$id);
	}

} else {

	// get friends games
	$result = $_db->query('SELECT g.*,
								  u.name,
								  u.id AS userid
							 FROM games AS g,
								  users_friends AS uf,
								  users AS u
							WHERE g.host = uf.friend
							  AND uf.user = ?
							  AND uf.friend = u.id
							  AND g.public = 0
							  AND g.started = 0',
						array($_user['id']));

	$i = 1;
	while ($game = $result->fetch()) {
		$_tpl->assign(array("i" => $i, "id" => $game['id'], "username" => $game['name'], "bet" => formatCredit($game['bet']), "maxplayers" => $game['maxplayers'], "players" => $game['players'], "userid" => $game['userid']));
		$friends .= $_tpl->fetch("games_row.tpl");
		$i++;
	}

	// get public games
	$result = $_db->query('SELECT g.*,
								  u.name,
								  u.id AS userid
							 FROM games AS g,
								  users AS u
							WHERE g.host = u.id
							  AND public = 1
							  AND g.started = 0
							  AND host != ?',
						array($_user['id']));

	$i = 1;
	while ($game = $result->fetch()) {
		$_tpl->assign(array("i" => $i, "id" => $game['id'], "username" => $game['name'], "bet" => formatCredit($game['bet']), "maxplayers" => $game['maxplayers'], "players" => $game['players'], "userid" => $game['userid']));
		$publics .= $_tpl->fetch("games_row.tpl");
		$i++;
	}

	$_tpl->assign("friends", $friends);
	$_tpl->assign("publics", $publics);

	// bets
	$bet = 10;
	$bets = array();
	$bets[0] = 0;
	while ($bet <= $_user['credit']) {
		$bets[$bet] = formatCredit($bet);
		if ($bet >= 100) {
			$bet = $bet + 100;
		} elseif ($bet > 1000) {
			break;
		} else {
			switch ($bet) {
				case 10:
					$bet = 20;
					break;
				case 20:
					$bet = 30;
					break;
				case 30:
					$bet = 50;
					break;
				case 50:
					$bet = 100;
					break;
			}
		}
	}
	$_tpl->assign("bets", $bets);

	$_tpl->display("games.tpl");

}
?>