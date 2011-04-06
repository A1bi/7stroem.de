{include file="head.tpl" title="Spiele" cssfile="games"}
	<div class="box1">
		<div class="head">
			Spiele deiner Freunde
		</div>
		<div class="space">
{if $friends != ""}
{include file="games_table.tpl" public=0}
{else}
			Es gibt derzeit kein offenes Spiel deiner Freunde.
{/if}
		</div>
		<div class="bottom">&nbsp;</div>
	</div>
	<div class="box1">
		<div class="head">
			Öffentliche Spiele
		</div>
		<div class="space">
{if $publics != ""}
{include file="games_table.tpl" public=1}
{else}
			Es gibt derzeit keine öffentlichen Spiele.
{/if}
		</div>
		<div class="bottom">&nbsp;</div>
	</div>
	<div class="create">
		<div class="head">
			Spiel eröffnen
		</div>
		<div class="space">
			<div class="instructions">
				Hier kannst du ein eigenes Spiel eröffnen.
				<br />Dabei kannst du einstellen, wie viele Spieler maximal mitspielen dürfen und ob das Spiel öffentlich sein oder nur von deinen Freunden betreten werden soll.
			</div>
			<div>
				<form action="games.php?action=create" method="post">
				<p><strong>Spielart:</strong><br />
				<input type="radio" name="public" value="1" checked="checked" /> öffentlich <input type="radio" name="public" value="0" /> nur gegen Freunde</p>
				<p><strong>Max. Anzahl an Spielern:</strong>
				<select name="maxplayers" class="vcen"><option>2</option><option>3</option><option selected="selected">4</option></select></p>
				<p><strong>Einsatz:</strong>
				<select name="bet" class="vcen">{html_options options=$bets selected=50}</select> &euro;</p>
				<div class="hright">
					<input type="image" src="/gfx/games/create_button.png" name="create" alt="eröffnen" />
				</div>
				</form>
			</div>
		</div>
	</div>
{include file="foot.tpl"}