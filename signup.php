<?php
include('include/main.php');

if (!empty($_user['id'])) {
	showError("Bitte logge dich erst aus, um dich neu zu registrieren.");
	redirectTo("/games");
}

function checkUsername($name) {
	global $_db;
	$user = $_db->query('SELECT id FROM users WHERE name = ?', array($_POST['name']))->fetch();
	if (!empty($user['id'])) {
		return false;
	}
	return true;
}

if ($_GET['ajax']) {

	switch ($_POST['action']) {
		case "username":
			if (!checkUsername($_POST['name'])) {
				$result = "error";
			} else {
				$result = "ok";
			}
			break;

		case "save":
			if (checkUsername($_POST['username']) && preg_match("/^[a-zA-Z0-9._-]+$/", $_POST['username']) && strlen($_POST['username']) > 2) {
				// check password and email only if facebook is not given
				if (!$_fb->isLoggedIn() &&
					(!preg_match("/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z]){2,9}$/", $_POST['email']) || strlen($_POST['pass']) < 6)) {
					$result = "error";
				} else {
					if ($_fb->isLoggedIn()) {
						// generate random password for security reasons
						$pass = createId(8);
						$fb = $_fb->getId();
						$info = $_fb->getInfo();
						$realname = $info->name;
					} else {
						$realname = $_POST['name'];
						$pass = $_POST['pass'];
						$fb = 0;
					}
					$pass = md5($pass);
					// insert into db
					$result = $_db->query('INSERT INTO users VALUES (null, ?, ?, ?, ?, ?, ?, 1000, 0, 0, ?)', array($_POST['username'], $realname, $_POST['email'], $pass, $fb, time(), time()));
					if ($result->rowCount() > 0) {
						// login
						$_SESSION['user']["id"] = $_db->id();
						$_SESSION['user']["pass"] = $pass;
						$result = "ok";
					} else {
						$result = "error";
					}
				}
				
			} else {
				$result = "error";
			}
			break;

		default:
			$result = "unknown action";
	}

	echo json_encode(array("result" => $result));

} elseif ($_GET['action'] == "finishFb") {
	if (!empty($_GET['error'])) {
		$ok = "false";
	} else {
		$ok = "true";
		$_fb->login($_GET['code'], "/signup?action=finishFb");

		$result = $_db->query('SELECT id, name FROM users WHERE fb = ?', array($_fb->getId()));
		$user = $result->fetch();

		// found ?
		if (!empty($user['id'])) {
			$known = "true";
			$_fb->logout();
		// facebook user not found
		} else {
			$known = "false";
		}
	}

	$_tpl->assign("ok", $ok);
	$_tpl->assign("type", "signup");
	$_tpl->assign("known", $known);
	$_tpl->display("facebook_popup.tpl");

} else {
	$_tpl->display("signup.tpl");
}

?>