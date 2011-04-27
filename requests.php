<?php
include('include/main.php');
kickGuests();

if (empty($_GET['id'])) redirectTo("/");
$result = $_db->query('SELECT * FROM requests WHERE id = ? AND user = ?', array($_GET['id'], $_user['id']));
$request = $result->fetch();
if (empty($request['id'])) redirectTo("/");

function delRequest($id) {
	global $_db;
	$_db->query('DELETE FROM requests WHERE id = ?', array($id));
}

// accept a request
if ($_GET['action'] == "accept") {
	$_db->query('INSERT INTO users_friends VALUES (:1, :2), (:2, :1)', array(":1" => $_user['id'], ":2" => $request['by']));
	delRequest($request['id']);
	redirectTo($_SERVER['HTTP_REFERER']);
}
?>