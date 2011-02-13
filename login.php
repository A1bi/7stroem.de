<?php
include('include/main.php');

// logout
if ($_GET['action'] == "logout") {
	unset($_SESSION['user']);

// login
} else {
	if (!empty($_POST['name'])) {
		// create md5 hash of given password
		$hash = md5($_POST['pass']);

		// look in database for given user
		$result = $_db->query('SELECT id FROM users WHERE name = ? AND pass = ?', array($_POST['name'], $hash));
		$user = $result->fetch();

		// found ?
		if (!empty($user['id'])) {
			// store in session
			$_SESSION['user'] = array("id" => $user['id'], "pass" => $hash);
			redirectTo("games.php");
		}
	}
}
redirectTo("index.php");
?>
