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

$_base = $_SERVER['DOCUMENT_ROOT'];

// load template engine
loadComponent("templates");

// database
loadComponent("database");
$_db = new database;

/*
// exclude internet explorer browsers < 7.0
if (preg_match("#MSIE [1-6]#", $_SERVER['HTTP_USER_AGENT'])) {
	echo 'Der Internet Explorer wird von PVshowcase nicht unterst&uuml;tzt. Bitte laden Sie sich kostenlos <a href="http://mozilla-europe.org">Mozilla Firefox</a> herunter.';
	exit();
}
*/

?>
