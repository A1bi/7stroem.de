<?php
include('include/main.php');

$name = (!empty($_GET['name'])) ? $_GET['name'] : $_user['name'];
$result = $_db->query('SELECT id, name, realname, registered, rounds, won FROM users WHERE name = ?', array($name));
$user = $result->fetch();
if (empty($user['id'])) {
	showError("Der Spieler konnte nicht gefunden werden.");
	redirectTo("/player");
}

// check if the users are friends
if ($user['id'] != $_user['id']) {
	$result = $_db->query('SELECT friend FROM users_friends WHERE user = ? AND friend = ?', array($_user['id'], $user['id']));
	$tmp = $result->fetch();
	if (!empty($tmp['friend'])) {
		$user['isFriend'] = true;
	// check if request pending
	} else {
		$result = $_db->query('SELECT id, `by` FROM requests WHERE type = 1 AND ((user = :1 AND `by` = :2) OR (`by` = :1 AND user = :2))', array(":1" => $_user['id'], ":2" => $user['id']));
		$tmp = $result->fetch();
		$user['request'] = $tmp;
	}
	unset($tmp);
} else {
	$user['isFriend'] = true;
}

// add comment
if (!empty($_POST['submit'])) {
	$_db->query('INSERT INTO comments VALUES (null, ?, ?, ?, ?)', array($user['id'], $_user['id'], $_POST['comment'], time()));
	redirectTo();

// delete comment
} elseif ($_GET['action'] == "delComment" && $_user['id'] == $user['id']) {
	$result = $_db->query('DELETE FROM comments WHERE id = ? AND user = ?', array($_GET['id'], $_user['id']));
	if ($_db->changes($result)) {
		showInfo("Der Kommentar wurde gelöscht.");
	} else {
		showError("Der Kommentar konnte nicht gelöscht werden.");
	}
	redirectTo("/player");

// add as friend
} elseif ($_GET['action'] == "addFriend") {
	if ($user['isFriend'] || !empty($user['request']['id'])) {
		showError("Du bist mit diesem Spieler bereits befreundet oder es steht noch eine Anfrage aus.");
	} else {
		$_db->query('INSERT INTO requests VALUES (null, 1, ?, ?)', array($user['id'], $_user['id']));
		showInfo("Eine Freundschaftsanfrage wurde gesendet.");
	}
	redirectTo("/player/".$user['name']);

// remove friend
} elseif ($_GET['action'] == "delFriend" && $user['isFriend']) {
	$_db->query('DELETE FROM users_friends WHERE (user = :1 AND friend = :2) OR (friend = :1 AND user = :2)', array(":1" => $_user['id'], ":2" => $user['id']));
	showInfo("Ihr seid nun nicht mehr befreundet.");
	redirectTo("/player/".$user['name']);
}


// formatting / calculating win quota
$user['registered'] = format::single($user['registered'], array("date"));
if ($user['rounds'] > 0) {
	$user['quota'] = round($user['won'] / $user['rounds'] * 100, 1);
} else {
	$user['quota'] = 100;
}

// friends
$result = $_db->query('		SELECT	u.id, u.name, u.realname
							FROM	users AS u,
									users_friends AS f
							WHERE	f.user = ?
							AND		f.friend = u.id
							', array($user['id']));
$user['friends'] = array();
while ($friend = $result->fetch()) {
	$user['friends'][] = $friend;
}

// comments
$result = $_db->query('		SELECT	u.id, u.name, u.realname,
									c.id, c.text, c.time
							FROM	comments AS c,
									users AS u
							WHERE	c.user = ?
							AND		c.by = u.id
							ORDER BY c.id DESC
							', array($user['id']));
$user['comments'] = array();
while ($comment = $result->fetch()) {
	$comment['time'] = format::single($comment['time'], array("date"));
	$user['comments'][] = $comment;
}

$_tpl->assign("user", $user);
$_tpl->display("player.tpl");
?>