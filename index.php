<?php
include('include/main.php');

if (!empty($_user['id'])) {
	redirectTo("/games");
}

$_tpl->display("index.tpl");
?>