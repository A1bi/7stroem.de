<?php
include('include/main.php');

if (!empty($_user['id'])) {
	
	// get number of games
	$games = array("friends" => array(), "publics" => array());
	// get friends games
	$result = $_db->query('SELECT COUNT(*) AS c
							 FROM games AS g,
								  users_friends AS uf
							WHERE g.host = uf.friend
							  AND uf.user = ?
							  AND g.public = 0
							  AND g.started = 0
							  AND g.finished = 0',
						array($_user['id']));
	$tmp = $result->fetch();
	$games['friends'] = $tmp['c'];
	// get public games
	$result = $_db->query('SELECT COUNT(*) AS c
							 FROM games AS g
							WHERE public = 1
							  AND g.started = 0
							  AND g.finished = 0
							  AND host != ?
						 ORDER BY id DESC',
						array($_user['id']));
	$tmp = $result->fetch();
	$games['public'] = $tmp['c'];
	$_tpl->assign("games", $games);
	
	// get requests
	$result = $_db->query('	SELECT	r.id,
									u.name, u.realname
							FROM	requests AS r,
									users AS u
							WHERE	r.type = 1
							AND		r.`by` = u.id
							AND		r.user = ?',
						array($_user['id']));
	$requests = $result->fetchAll();
	$_tpl->assign("requests", $requests);

} elseif ($_GET['action'] == "forgotpass" && $_POST['submit']) {
	$pass = createId(8);
	$result = $_db->query('UPDATE users SET pass = ? WHERE email = ?', array(md5($pass), $_POST['email']));
	if ($_db->changes($result)) {
		mail($_POST['email'], "Dein neues Passwort", "Dein neues Passwort für 7ström.de:\n".$pass, "Content-type: text/plain; charset=utf-8\r\nFrom: =?UTF-8?Q?7str=C3=B6m?=<noreply@7stroem.de>\r\nMIME-Version: 1.0\r\nContent-type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: quoted-printable\r\n");
		showInfo("Wir haben dir ein neues Passwort zugeschickt.");
		redirectTo("/");
	} else {
		showError("Wir konnten diese e-mail Adresse nicht finden.");
		redirectTo();
	}
}

$_tpl->display("index.tpl");
?>