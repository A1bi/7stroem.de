<?php
/**
 * 7stroem
 *
 * facebook class
 * handles facebook api requests
 */

loadComponent("curl");

class facebook {

	// contains secret butler authcode
	private static $app_id = "211597832188896";
	private static $app_secret = "1b3360af4d75806b7c75099663e04597";
	
	private $userid = 0;
	private $token;
	
	function __construct() {
		if (!empty($_SESSION['user']['fb']['id'])) {
			if ($_SESSION['user']['fb']['expires'] <= time()) {
				$this->logout();
			} else {
				$this->userid = $_SESSION['user']['fb']['id'];
				$this->token = $_SESSION['user']['fb']['token'];
			}
		}
	}
	
	function isLoggedIn() {
		return ($this->userid > 0);
	}
	
	function getId() {
		return $this->userid;
	}

	private function setId($id) {
		$_SESSION['user']['fb']['id'] = $id;
		$this->userid = $id;
	}

	function getInfo($section = "") {
		$url = "https://graph.facebook.com/me";
		if (!empty($section)) {
			$url .= "/".$section;
		}
		$curl = new curl($url."?".$this->token);
		return json_decode($curl->response());
	}
	
	private function authenticate($code, $uri) {
		// get access token
		$url = "https://graph.facebook.com/oauth/access_token?client_id=".self::$app_id."&client_secret=".self::$app_secret."&redirect_uri=".urlencode("http://".$_SERVER['HTTP_HOST'].$uri)."&code=".$code;
		$curl = new curl($url);
		$parts = explode("&", $curl->response());
		$expire = explode("=", $parts[1]);
		$this->token = $parts[0];
		$_SESSION['user']['fb']['token'] = $this->token;
		$_SESSION['user']['fb']['expires'] = time()+$expire[1];
	}

	function login($code, $uri) {
		// authenticate
		$this->authenticate($code, $uri);
		// get facebook user id
		$info = $this->getInfo();
		$this->setId($info->id);
	}

	function logout() {
		unset($_SESSION['user']['fb']);
	}
	 
}
?>