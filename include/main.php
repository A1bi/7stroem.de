<?php

// enable error reporting
ini_set('display_errors','on');
error_reporting(E_ALL ^ E_NOTICE);

/**
 * redirects to given url
 *
 * @param string $url
 */
function redirectTo($url = "") {
	if (empty($url)) $url = $_SERVER['REQUEST_URI'];
	header("Location: " . $url);
	exit();
}

/**
 * includes the given component
 *
 * @param string $core
 */
function loadComponent($component) {
	global $_base;
	
	$component = "./include/core/" . $component . ".php";
	// component exists?
	if (file_exists($component)) {
		require_once($component);
	}
}

/**
 * creates a random id with the given amount of digits
 *
 * @param int $digits
 * @return string
 */
function createId($digits) {
	$items = "abcdefghijkmnpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
	for ($i = 0; $i < $digits; $i++) {
		$item = mt_rand(1, strlen($items));
		$id .= $items{$item};
	}
	return $id;
}

// TODO: daraus ne template funktion machen
/**
 * turns cents in euros and adds a zero if needed
 *
 * @param int $credit
 * @return string
 */
function formatCredit($credit) {
	$credit = str_replace(".", ",", ($credit/100));
	// add zero to the end if needed
	if (substr($credit, -2, 1) == ",") {
		$credit .= "0";
	}
	return $credit;
}

/**
 * kicks not logged in users back to login page
 */
function kickGuests() {
	if (empty($_SESSION['user']['id'])) {
		redirectTo("index.php");
	}
}

function createBubble($msg, $type, $of = "", $at = "", $my = "", $tri = "", $off = "") {
	$_SESSION['bubble'] = array();
	$_SESSION['bubble']['msg'] = $msg;
	$_SESSION['bubble']['type'] = $type;
	if (!empty($of)) {
		$pos = array("of" => $of, "at" => $at, "my" => $my, "tri" => $tri, "offset" => $off);
		$_SESSION['bubble']['pos'] = json_encode($pos);
	}
}

/**
 * saves an error in the session and displays it on the next page
 */
function showError($msg, $of = "", $at = "", $my = "", $tri = "", $off = "") {
	createBubble($msg, "error", $of, $at, $my, $tri, $off);
}

function showInfo($msg, $of = "", $at = "", $my = "", $tri = "", $off = "") {
	createBubble($msg, "info", $of, $at, $my, $tri, $off);
}

$_base = $_SERVER['DOCUMENT_ROOT'];

// components to load
$comps = array("templates", "format", "database");
foreach ($comps as $comp) {
	loadComponent($comp);
}
// initiate database object
$_db = new database;

/*
// exclude internet explorer browsers < 7.0
if (preg_match("#MSIE [1-6]#", $_SERVER['HTTP_USER_AGENT'])) {
	echo 'Der Internet Explorer wird von PVshowcase nicht unterst&uuml;tzt. Bitte laden Sie sich kostenlos <a href="http://mozilla-europe.org">Mozilla Firefox</a> herunter.';
	exit();
}
*/

/**
 * user session management
 */

if (!defined("NO_SESSION")) {
	// start session
	ini_set("session.use_only_cookies", 1);
	session_name("7stroem_sess");
	session_set_cookie_params(0, "/");
	session_start();

	// check if logged in
	if (!empty($_SESSION['user']['id'])) {
		// look in database for given user
		$result = $_db->query('SELECT id, name, credit FROM users WHERE id = ? AND pass = ?', array($_SESSION['user']['id'], $_SESSION['user']['pass']));
		$user = $result->fetch();

		// found ?
		if (!empty($user['id'])) {
			// mark as logged in for templates
			$_tpl->assign("_username", $user['name']);
			$_tpl->assign("_userid", $user['id']);
			$_user = $user;
			// format credit
			$credit = formatCredit($user['credit']);
			$_tpl->assign("_usercredit", $credit);
		} else {
			// not correct -> delete session
			unset($_SESSION['user']);
		}
	}

	// check if error present
	if (is_array($_SESSION['bubble'])) {
		$_tpl->assign("bubble", $_SESSION['bubble']);
		unset($_SESSION['bubble']);
	}
}

?>
