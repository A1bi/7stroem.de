<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<title>7ström{if $title != ""} - {$title}{/if}</title>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<meta name="viewport" content="width=1009" />
	<link rel="stylesheet" type="text/css" href="/css/main.css{fileVersion file="/css/main.css"}" />
{if $css != ""}
	<style type="text/css">
{include file=$css}

	</style>
{/if}
{if $cssfile != ""}
	<link rel="stylesheet" type="text/css" href="/css/{$cssfile}.css{fileVersion file="/css/{$cssfile}.css"}" />
{/if}
	<script type="text/javascript" src="/js/fw/jquery.js"></script>
	<script type="text/javascript" src="/js/fw/jquery-ui.js"></script>
	<script type="text/javascript" src="/js/main.js"></script>
{if $jsfile != ""}
	<script type="text/javascript" src="/js/{$jsfile}.js{fileVersion file="/js/{$jsfile}.js"}"></script>
{/if}
{if $js != ""}
	<script type="text/javascript">
{$js}

	</script>
{/if}
</head>

<body>
	<div class="header">
		<div class="left">
			<div class="claim">
				Siwweström, Siwweschräm, Sibbeschröm oder wie immer du es gerne nennst ;)
			</div>
		</div>
		<div class="right">
{if $_userid != ""}{include file="head_userbox.tpl"}{/if}

		</div>
		<div class="shadow_left">&nbsp;</div>
		<div class="shadow_right">&nbsp;</div>
		<div class="shadow_bottom">&nbsp;</div>
	</div>
	<div class="bubbles"></div>
	<div class="pspace">
		<div class="bg">&nbsp;</div>
		<div class="foot">
			<div class="copyright">&copy; Albisigns 2011 - Impressum</div>
		</div>
		<div class="content">
