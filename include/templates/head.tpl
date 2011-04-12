<!DOCTYPE html>
<html>
<head>
	<title>7ström{if $title != ""} - {$title}{/if}</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=1009" />
	<link rel="shortcut icon" href="/gfx/favicon.ico" />
	<link rel="apple-touch-icon" href="/gfx/ios_icon.png" />
	<link rel="stylesheet" type="text/css" href="/css/main.css{fileVersion file="/css/main.css"}" />
{if $css != ""}
	<style type="text/css">
{include file=$css}

	</style>
{/if}
{if $cssfile != ""}
	<link rel="stylesheet" type="text/css" href="/css/{$cssfile}.css{fileVersion file="/css/{$cssfile}.css"}" />
{/if}
{if $head != ""}
{include file=$head}
{/if}

	<script src="/js/fw/jquery.js"></script>
	<script src="/js/fw/jquery-ui.js"></script>
	<script src="/js/fw/modernizr.js"></script>
	<script src="/js/main.js"></script>
{if $jsfile != ""}
	<script src="/js/{$jsfile}.js{fileVersion file="/js/{$jsfile}.js"}"></script>
{/if}
{if $js != "" || $bubble != ""}
	<script>
{$js}
{if $bubble != ""}
		var bubble = [];
		bubble['msg'] = "{$bubble.msg}";
		bubble['type'] = "{$bubble.type}";
		{if $bubble.pos != ""}bubble['pos'] = {$bubble.pos};{/if}

{/if}
	</script>
{/if}
</head>

<body>
	<div class="header{if $_user.id != ""} loggedIn{/if}">
		<div class="hspace">
			<a href="/" id="logo">7ström</a>
			<div class="claim">
				Siwweström, Siwweschräm, Sibbeschröm oder wie immer du es gerne nennst ;)
			</div>
			<ul class="navi">
				<li><a href="/">Home</a></li>
				<li><a href="/games">Spiele</a></li>
				<li><a href="/player">Deine Spielerseite</a></li>
				<li><a href="/settings">Einstellungen</a></li>
			</ul>
			<div class="userbox">
				Hallo, {$_user.name|escape}!
				<p>Guthaben: <span class="credit">{$_user.credit}</span> &euro;</p>
				<div class="hright" style="font-size: 12px;"><a href="/logout">ausloggen</a></div>
			</div>
		</div>
		<div class="shadow l">&nbsp;</div>
		<div class="shadow r">&nbsp;</div>
	</div>
	<div class="bubbles"></div>
	<div class="pspace">
		<div class="bg gradient">&nbsp;</div>
		<div class="bg foot">
			<div class="copyright">&copy; Albisigns 2011 - Impressum</div>
		</div>
		<div class="content">
