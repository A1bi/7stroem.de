<?php
/**
 * 7stroem
 *
 * butler class
 * handles connections to remote game butler servers
 */
class butler {

	// contains butler information
	private $server = array();

	/**
	 * construct
	 * initiates curl lib
	 */
	function __construct($id = -1) {
		// we need curl for this
		loadComponent("curl");
		if ($id > -1) {
			$this->setServer($id);
		}
	}

	/**
	 * retrieves server information from database
	 * 
	 * @global $_db
	 * @param int $id
	 * @return bool
	 */
	function setServer($id) {
		global $_db;

		$result = $_db->query('SELECT id, address, remote_authcode FROM butlers WHERE id = ?', array($id));
		$server = $result->fetch();

		if (empty($server['id'])) {
			return false;
		} else {
			$this->server = $server;
			return true;
		}
	}

	/*
	 * just returns the server id
	 */
	function getId() {
		return $this->server['id'];
	}

	/*
	 * just returns server address
	 */
	function getAddr() {
		return $this->server['address'];
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
		$curl = new curl("http://" . $this->server['address'] . "/server?authcode=" . $this->server['remote_authcode'] . "&request=" . $request . $get);
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
	function createGame($id, $host) {
		return $this->makeRequest("createGame", array("id" => $id, "host" => $host));
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
