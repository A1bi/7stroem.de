<?php
/**
 * initiates smarty template engine
 */

require($_base.'/include/core/smarty/Smarty.class.php');

// init object
global $_tpl;
$_tpl = new Smarty();

// configure
$_tpl->setTemplateDir($_base.'/include/templates');
$_tpl->setCompileDir($_base.'/include/templates/compiled');
$_tpl->setCacheDir($_base.'/include/templates/cache');
$_tpl->setConfigDir($_base.'/include/templates/configs');

?>
