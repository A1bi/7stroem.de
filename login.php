<?php
include('include/main.php');

// checks if login is correct, rewards user once a day
function login($user) {
	global $_db;
	
	if (empty($user['id'])) return false;

	$_SESSION['user']['id'] = $user['id'];
	if (!empty($user['pass'])) {
		$_SESSION['user']['pass'] = $user['pass'];
	}
	// check if user needs to be rewarded
	if ($user['lastreward']+86400 < time()) {
		$_db->query('UPDATE users SET credit = credit + 500, lastreward = ? WHERE id = ?', array(time(), $user['id']));
	}
	$_db->query('UPDATE users SET lastlogin = ? WHERE id = ?', array(time(), $user['id']));

	return true;
}

// logout
if ($_GET['action'] == "logout") {
	unset($_SESSION['user']);
	showInfo("Du hast dich erfolgreich ausgeloggt!<br />Schau nochmal rein :)<br />Bis dann!");

// login via facebook
} else if ($_GET['fb']) {
	if (empty($_GET['error'])) {
		$_fb->login($_GET['code'], "/login?fb=1");

		if ($_fb->getId()) {
			$ok = "true";

			$result = $_db->query('SELECT id, name, lastreward FROM users WHERE fb = ?', array($_fb->getId()));
			$user = $result->fetch();

			// found ?
			if (login($user)) {
				$known = "true";
			// facebook user not found
			} else {
				$known = "false";
			}
		}
	}

	$_tpl->assign("ok", $ok);
	$_tpl->assign("type", "login");
	$_tpl->assign("known", $known);
	$_tpl->display("facebook_popup.tpl");
	exit();

// regular login
} else {
	if (!empty($_POST['name'])) {
		// create md5 hash of given password
		$hash = md5($_POST['pass']);

		// look in database for given user
		$result = $_db->query('SELECT id, lastreward, pass FROM users WHERE name = ? AND pass = ?', array($_POST['name'], $hash));
		$user = $result->fetch();

		if (!login($user)) {
			// user not found
			showError("Benutzername oder Passwort stimmt nicht!<br />Versuchs einfach nochmal.", ".login table td:first", "left center", "right top", "right t");
		}
	}
}

redirectTo("/");
?>
