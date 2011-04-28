<?php
include('include/main.php');
kickGuests();

if (empty($_GET['action'])) {
	if (empty($_user['fb'])) {
		$_GET['action'] = "email";
	} else {
		$_GET['action'] = "facebook";
	}
}

// facebook
if ($_GET['action'] == "facebook") {
	if ($_GET['finish']) {
		if (empty($_GET['error'])) {
			$_fb->login($_GET['code'], "/settings/facebook?finish=1");
			if ($_fb->getId()) {
				$ok = "true";

				$result = $_db->query('SELECT id, name FROM users WHERE fb = ?', array($_fb->getId()));
				$user = $result->fetch();

				// already connected to someone
				if (!empty($user['id'])) {
					$known = "true";
					$_fb->logout();
					showError("Dieses Facebook-Konto wurde bereits mit einem anderen 7ström-Spieler verknüpft.");

				} else {
					// save in db
					$_db->query('UPDATE users SET fb = ? WHERE id = ?', array($_fb->getId(), $_user['id']));
					showInfo("Dein Facebook-Konto wurde erfolgreich verknüpft.");
					$known = "false";
				}
			}
		}

		$_tpl->assign("ok", $ok);
		$_tpl->assign("type", "settings");
		$_tpl->assign("known", $known);
		$_tpl->display("facebook_popup.tpl");
		exit();
	
	} elseif (!empty($_POST['submit'])) {
		if ($_POST['pass'] != $_POST['pass2']) {
			showError("Die Passwörter stimmen nicht überein.", ":password:first", "right bottom", "left center", "left t");
		} elseif (strlen($_POST['pass']) < 6) {
			showError("Das Passwort muss mindestens 6 Zeichen lang sein.", ":password:first", "right center", "left center", "left t");
		} elseif (!preg_match("/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z]){2,9}$/", $_POST['email'])) {
			showError("Die e-mail Adresse ist nicht korrekt.", ":input:first", "right center", "left center", "left t");
		} else {
			$hash = md5($_POST['pass']);
			$_SESSION['user']['pass'] = $hash;
			$_db->query('UPDATE users SET email = ?, pass = ?, fb = 0 WHERE id = ?', array($_POST['email'], $hash, $_user['id']));
			$_fb->logout();
			showInfo("Die Verknüpfung wurde aufgehoben.");
			redirectTo("/settings/facebook");
		}
		redirectTo();
	}

// email
} elseif ($_GET['action'] == "email") {
	if ($_POST['submit']) {
		if (!preg_match("/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z]){2,9}$/", $_POST['email'])) {
			showError("Die e-mail Adresse ist nicht korrekt.", ":input:first", "right center", "left center", "left t");
		} else {
			showInfo("Die Adresse wurde gespeichert.");
			$_db->query('UPDATE users SET email = ? WHERE id = ?', array($_POST['email'], $_user['id']));
		}
		redirectTo();
	}

// password
} else {
	if ($_POST['submit']) {
		if ($_POST['new'] != $_POST['new2']) {
			showError("Die Passwörter stimmen nicht überein.", ":password:eq(1)", "right bottom", "left center", "left t");
		} elseif (strlen($_POST['new']) < 6) {
			showError("Das Passwort muss mindestens 6 Zeichen lang sein.", ":password:eq(1)", "right center", "left center", "left t");
		} else {
			$new = md5($_POST['new']);
			$old = md5($_POST['old']);
			$result = $_db->query('UPDATE users SET pass = ? WHERE id = ? AND pass = ?', array($new, $_user['id'], $old));
			if ($_db->changes($result)) {
				$_SESSION['user']['pass'] = $new;
				showInfo("Das Passwort wurde geändert.");
			} else {
				showError("Du hast dein altes Passwort nicht korrekt eingegeben.", ":password:eq(0)", "right center", "left center", "left t");
			}
		}
		redirectTo();
	}
}

$_tpl->display("settings.tpl");
?>
