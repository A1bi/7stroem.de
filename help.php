<?php
include('include/main.php');

$pages = array("so-funktionierts" => "firststeps");
$page = "help_" . $pages[$_GET['page']] . ".tpl";
if (!$_tpl->templateExists($page)) {
	showError("Seite nicht gefunden!");
	redirectTo("/");
}
$_tpl->display($page);
?>