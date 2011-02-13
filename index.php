<?php
include('include/main.php');

if (!empty($_SESSION['user']['id'])) {
	redirectTo("games.php");
}

$_tpl->assign("title", "Das Online-Kartenspiel aus der Eifel");
$_tpl->display("index.tpl");
?>