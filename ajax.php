<?php
include('include/main.php');

$response = array();

switch ($_GET['action']) {

	// get user info
	case "getUserInfo":
		$result = $_db->query('SELECT u.id, u.name
								 FROM users AS u,
									  games_players AS g
								WHERE g.game = ?
								  AND g.user = u.id',
				array($_GET['game']));
		while ($user = $result->fetch()) {
			// TODO: escape
			$response[] = array("id" => $user['id'], "name" => $user['name']);
		}

		break;

	// start a game
	// TODO: security !!! check if permitted!!!
	case "startGame":
		// initiate butler
		loadComponent("butler");
		$butler = new butler;

		if ($butler->startGame($_GET['id'])) {
			$response['result'] = "ok";
		} else {
			$response['result'] = "error";
		}
		break;

	default:
		$response['error'] = "unknown action";
		break;
}

// prevent caching by browser
header('Cache-Control: no-cache, must-revalidate');
header('Expires: 0');

// show json response
echo json_encode($response);

?>
