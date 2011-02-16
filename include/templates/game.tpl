{include file="head.tpl" cssfile="game" jsfile="game"}
		<div id="game">
			<div class="table">
				<div class="top">&nbsp;</div>
				<div class="middle">
					<div class="left">&nbsp;</div>
					<div class="center">&nbsp;</div>
					<div class="right">&nbsp;</div>
				</div>
				<div class="bottom">&nbsp;</div>
			</div>
			<div class="players">
				<div class="bottom">
					<div class="stack"></div>
					<div class="hand"></div>
				</div>
				<div class="left">
					<div class="stack"></div>
					<div class="hand"></div>
				</div>
				<div class="top">
					<div class="stack"></div>
					<div class="hand"></div>
				</div>
				<div class="right">
					<div class="stack"></div>
					<div class="hand"></div>
				</div>
			</div>
		</div>
		<div id="panel">
			<div class="box" id="overview">
				<div class="head">Überblick</div>
				<div class="space">
					<table>
						<tr>
							<td>Spieler:</td>
							<td>
								<ul></ul>
								noch <span id="maxplayers">{$maxplayers}</span> freie Plätze im Spiel
							</td>
						</tr>
						<tr>
							<td>Einsatz:</td>
							<td>{$bet} &euro;</td>
						</tr>
						<tr>
							<td>Typ:</td>
							<td>{if $public}öffentlich{else}nur für Freunde{/if}</td>
						</tr>
					</table>
					<div id="startGame">
						<div>
							Bitte warte, bis der Spielleiter das Spiel startet.
						</div>
						<div>
							Sobald du denkst, dass genug Spieler dem Spiel beigetreten sind, kannst du das Spiel starten.
							<div class="hright">
								<img src="/gfx/game/start.png" alt="Spiel starten" title="Spiel starten" id="startGameBtn" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="box" id="strikes">
				<div class="head">Striche</div>
				<div class="space">
					<table>
						<tr class="top head">
							<td style="width: 10%;">Runde</td>
							<td style="width: 20%;"></td>
							<td style="width: 20%;"></td>
							<td style="width: 20%;"></td>
							<td style="width: 20%;"></td>
						</tr>
						<tr>
							<td>1</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</table>
				</div>
			</div>
			<div class="chat">
				<div class="head">Chat</div>
				<div class="log"></div>
				<form action="game.php" method="post">
				<div class="input">
					<input type="text" name="message" value="Nachricht schreiben..." class="inactive" />
				</div>
				</form>
			</div>
		</div>
{include file="foot.tpl"}