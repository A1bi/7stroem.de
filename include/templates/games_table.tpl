			<table class="playertable">
				<tr class="top">
					<td style="width: 5%;">&nbsp;</td>
					<td style="width: 40%;">Spiel erstellt von</td>
					<td style="width: 20%;">Einsatz</td>
					<td style="width: 25%;">aktive Spieler</td>
					<td style="width: 10%;">&nbsp;</td>
				</tr>
{if $public == 1}
{$publics}
{else}
{$friends}
{/if}
			</table>