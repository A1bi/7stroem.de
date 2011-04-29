			{if $games|@count > 0}
			<table class="playertable">
				<tr>
					<td style="width: 5%;">&nbsp;</td>
					<td style="width: 40%;">Spiel erstellt von</td>
					<td style="width: 20%;">Einsatz</td>
					<td style="width: 25%;">aktive Spieler</td>
					<td style="width: 10%;">&nbsp;</td>
				</tr>
				{foreach $games as $game}
				<tr class="r{$game@iteration mod 2}">
					<td>{$game@iteration}.</td>
					<td><a href="/player/{$game.username|escape}">{$game.username|escape}</a></td>
					<td>{$game.bet} &euro;</td>
					<td>{$game.players} / {$game.maxplayers}</td>
					<td><a href="/games/{$game.id}">beitreten</a></td>
				</tr>
				{/foreach}
			</table>
			{else}
			<div class="nogames">Es stehen derzeit keine Spiele zur Verfügung.</div>
			{/if}