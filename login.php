<?php
include('include/main.php');

// logout
if ($_GET['action'] == "logout") {
	unset($_SESSION['user']);
	showInfo("Du hast dich erfolgreich ausgeloggt!<br />Schau nochmal rein :)<br />Bis dann!");

} else if ($_GET['fb']) {
	if (!empty($_GET['error'])) {
		$ok = "false";
	} else {
		$ok = "true";
		$_fb->login($_GET['code'], "/login?fb=1");

		$result = $_db->query('SELECT id, name FROM users WHERE fb = ?', array($_fb->getId()));
		$user = $result->fetch();

		// found ?
		if (!empty($user['id'])) {
			$known = "true";
			// store in session
			$_SESSION['user']['id'] = $user['id'];
			showInfo("Grüß dich, ".htmlspecialchars($user['name'])."!");

		// facebook user not found
		} else {
			$known = "false";
			showInfo("Du hast dich erfolgreich mit deinem Facebook-Konto eingeloggt.<br />Da du zum ersten Mal hier bist, musst du dir jetzt noch einen Spielernamen aussuchen.");
		}
	}

	$_tpl->assign("ok", $ok);
	$_tpl->assign("type", "login");
	$_tpl->assign("known", $known);
	$_tpl->display("facebook_popup.tpl");
	exit();

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
			$_SESSION['user']['id'] = $user['id'];
			$_SESSION['user']['pass'] = $hash;
			showInfo("Grüß dich, ".htmlspecialchars($_POST['name'])."!");
			redirectTo("/games");

		// not found - login incorrect
		} else {
			showError("Benutzername oder Passwort stimmt nicht!<br />Versuchs einfach nochmal.", ".login table td:first", "left center", "right top", "right t");
		}
	}
}
redirectTo("/");
?>
