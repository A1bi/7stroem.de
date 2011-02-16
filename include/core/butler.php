<?php
/**
 * 7stroem
 *
 * butler class
 * handles connections to remote game butler servers
 */
class butler {

	// contains secret butler authcode
	private static $authcode = "zGLqz2QM5RGQkwld";
	private static $addr = "http://192.168.10.10:4926/";

	/**
	 * construct
	 * initiates curl lib
	 */
	function __construct() {
		// we need curl for this
		loadComponent("curl");
	}

	/**
	 * establishes connection to server and sends request
	 * 
	 * @param string $request
	 * @param array $argmuents
	 * @return bool
	 */
	private function makeRequest($request, $arguments = array()) {
		// form get arguments from $arguments
		foreach ($arguments as $argument => $value) {
			$get .= "&" . $argument . "=" . $value;
		}
		// preparing request
		$curl = new curl(self::$addr . "server?authcode=" . self::$authcode . "&request=" . $request . $get);
		// executing
		$response = $curl->response();
		if ($response == "ok") {
			// success
			return true;
		}
		return false;
	}

	/**
	 * asks the server to create a game
	 *
	 * @param int $id
	 * @return bool
	 */
	function createGame($id) {
		return $this->makeRequest("createGame", array("id" => $id));
	}

	/**
	 * registers a new player with a game
	 * 
	 * @param int $gid
	 * @param int $pid
	 * @param string $authcode
	 * @return bool
	 */
	function registerPlayer($gid, $pid, $authcode) {
		return $this->makeRequest("registerPlayer", array("gId" => $gid, "pId" => $pid, "pAuthcode" => $authcode));
	}

	/**
	 * starts a game by id
	 * 
	 * @param int $gid
	 * @return bool
	 */
	function startGame($gid) {
		return $this->makeRequest("startGame", array("gId" => $gid));
	}
}
?>
