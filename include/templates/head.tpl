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
