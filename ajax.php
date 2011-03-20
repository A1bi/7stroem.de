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
		$response['game'] = format::single($_GET['game'], array("esc"));
		$response['users'] = array();
		while ($user = $result->fetch()) {
			$user = format::complete($user, array("esc"));
			$response['users'][] = array("id" => $user['id'], "name" => $user['name']);
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
