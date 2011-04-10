{include file="head.tpl" title="Spielerseite von {$user.name}" cssfile="player"}
	<div class="infos">
		<div class="head">
			{$user.name}
		</div>
		<div class="space">
			<div class="subhead">
				Allgemeine Infos
			</div>
			<table style="width: 100%; margin-bottom: 15px;">
				<tr>
					<td style="width: 40%;">Spielername:</td>
					<td style="width: 60%;">{$user.name}</td>
				</tr>
				{if $user.realname != ""}<tr>
					<td>Echter Name:</td>
					<td>{$user.realname}</td>
				</tr>{/if}
				<tr>
					<td>Dabei seit:</td>
					<td>{$user.registered}</td>
				</tr>
			</table>
			<div class="subhead">
				Spielerfolge
			</div>
			<table style="width: 100%; margin-bottom: 15px;">
				<tr>
					<td style="width: 40%;">Runden gespielt:</td>
					<td style="width: 60%;">{$user.rounds}</td>
				</tr>
				<tr>
					<td>Davon gewonnen:</td>
					<td>{$user.won}</td>
				</tr>
				<tr>
					<td>Siegesquote:</td>
					<td>{$user.quota} %</td>
				</tr>
			</table>
		</div>
	</div>
	<div class="infos" style="margin-top: -30px;">
		<div class="head">
			Freunde
		</div>
		<div class="space">
			bla
		</div>
	</div>
{include file="foot.tpl"}