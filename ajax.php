<?php
include('include/main.php');

$response = array();

// works as a kind of proxy for the butler - needed for browsers who do not support CORS
if ($_GET['proxyButler']) {

	if (empty($_GET['server'])) {
		$response['result'] = "error";
		break;
	}
	// extend maximum execution time
	ini_set("max_execution_time", "60");
	loadComponent("curl");
	loadComponent("butler");
	$butler = new butler($_GET['server']);

	unset($_GET['proxyButler'], $_GET['server']);
	$curl = new curl("http://" . $butler->getAddr() . "/player");
	$curl->setGetArgs($_GET);

	echo $curl->response();
	exit;


} else {

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

		// get user credit
		case "getCredit":
			$response['credit'] = formatCredit($_user['credit']);
			break;

		case "pollSession":
			$response['result'] = "ok";
			break;

		default:
			$response['error'] = "unknown action";
			break;
	}

}

// prevent caching by browser
header('Cache-Control: no-cache, must-revalidate');
header('Expires: 0');

// show json response
echo json_encode($response);

?>
