{include file="head.tpl" cssfile="game" jsfile="game"}
		<div id="game">
			<div id="loading">Spiel wird geladen...</div>
			<div class="table">&nbsp;</div>
			<div class="players">
				<div class="bottom horizontal">
					<div class="area"></div>
					<div class="actions">
						<div class="call action" title="mitgehen">&nbsp;</div>
						<div class="fold action" title="rausgehen">&nbsp;</div>
						<div class="knock action" title="klopfen">&nbsp;</div>
						<div class="blindKnock">
							<div class="number" title="Anzahl an Strichen, die du klopfst">
								<select name="knocks"><option>1</option><option>2</option></select>
							</div>
							<div class="btn action" title="blind klopfen">
								&nbsp;
							</div>
						</div>
						<div class="flipHand action" title="Karten umdrehen">&nbsp;</div>
					</div>
					<div class="cards"></div>
					<div class="knocked"><div class="action"></div></div>
				</div>
				<div class="left vertical">
					<div class="area">
						<div class="name"></div>
						<div class="flag">legt auf</div>
					</div>
					<div class="cards"></div>
					<div class="knocked"><div class="action"></div></div>
				</div>
				<div class="top horizontal">
					<div class="area">
						<div class="name"></div>
						<div class="flag">legt auf</div>
					</div>
					<div class="cards"></div>
					<div class="knocked"><div class="action"></div></div>
				</div>
				<div class="right vertical">
					<div class="area">
						<div class="name"></div>
						<div class="flag">legt auf</div>
					</div>
					<div class="cards"></div>
					<div class="knocked"><div class="action"></div></div>
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
							<div class="startBtn action" title="Spiel starten">&nbsp;</div>
						</div>
					</div>
				</div>
			</div>
			<div class="box" id="strikes">
				<div class="head">Striche</div>
				<div class="space">
					<table class="top head">
							<tr>
								<td style="width: 17%;">Runde</td>
								<td style="width: 20%;"></td>
								<td style="width: 20%;"></td>
								<td style="width: 20%;"></td>
								<td style="width: 20%;"></td>
							</tr>
					</table>
					<div class="sTable">
						<table>
							<colgroup>
								<col style="width: 17%;" />
								<col style="width: 20%;" />
								<col style="width: 20%;" />
								<col style="width: 20%;" />
								<col style="width: 20%;" />
							</colgroup>
						</table>
					</div>
					<div class="actions">
						<div class="waiting">
							<div>Du kannst nun eine neue Runde starten.</div>
							<div>Bitte warte, bis der Spielleiter eine neue Runde startet.</div>
						</div>
						<div class="newRound action">&nbsp;</div>
					</div>
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