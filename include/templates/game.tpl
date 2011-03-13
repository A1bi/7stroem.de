{include file="head.tpl" cssfile="game" jsfile="game"}
		<div id="game">
			<div class="table">&nbsp;</div>
			<div class="players">
				<div class="bottom horizontal">
					<div class="area"></div>
					<div class="actions">
						<div class="call action"><img src="/gfx/game/call.png" alt="mitgehen" title="mitgehen" /></div>
						<div class="fold action"><img src="/gfx/game/fold.png" alt="rausgehen" title="rausgehen" /></div>
						<div class="knock action"><img src="/gfx/game/knock.png" alt="klopfen" title="klopfen" /></div>
						<div class="blindKnock action">
							<div class="number">
								<select name="knocks"><option>1</option><option>2</option></select>
							</div>
							<div class="btn">
								<img src="/gfx/game/blind_knock.png" alt="blind klopfen" title="blind klopfen" />
							</div>
						</div>
						<div class="flipHand action"><img src="/gfx/game/flip.png" alt="umdrehen" title="umdrehen" /></div>
					</div>
					<div class="cards"></div>
				</div>
				<div class="left vertical">
					<div class="area">
						<div class="name"></div>
					</div>
					<div class="cards"></div>
				</div>
				<div class="top horizontal">
					<div class="area">
						<div class="name"></div>
					</div>
					<div class="cards"></div>
				</div>
				<div class="right vertical">
					<div class="area">
						<div class="name"></div>
					</div>
					<div class="cards"></div>
				</div>
			</div>
		</div>
		<div id="panel">
			<div class="box" id="overview">
				<div class="head">Übersicht</div>
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