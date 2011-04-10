<?php
include('include/main.php');
kickGuests();

$name = (!empty($_GET['name'])) ? $_GET['name'] : $_user['name'];
$result = $_db->query('SELECT id, name, realname, registered, rounds, won FROM users WHERE name = ?', array($name));
$user = $result->fetch();
if (empty($user['id'])) {
	showError("Der Spieler konnte nicht gefunden werden.");
	redirectTo("/player");
}

$user['registered'] = format::single($user['registered'], array("date"));
if ($user['rounds'] > 0) {
	$user['quota'] = round($user['won'] / $user['rounds'] * 100, 1);
} else {
	$user['quota'] = 100;
}
$_tpl->assign("user", $user);
$_tpl->display("player.tpl");
?>