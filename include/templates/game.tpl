{include file="head.tpl" cssfile="game" jsfile="game" head="game_head.tpl"}
		<div id="game" class="onLoad">
			<div class="table"></div>
			<div class="players">
				<div class="bottom horizontal">
					<div class="area">
						<div class="name"></div>
						<div class="flag"></div>
					</div>
					<div class="actions">
						<div class="activeKnock">
							<div class="info"></div>
							<div class="call element" title="mitgehen">&nbsp;</div>
							<div class="fold element" title="rausgehen">&nbsp;</div>
						</div>
						<div class="knock element" title="klopfen">&nbsp;</div>
						<div class="blindKnock">
							<div class="number" title="Anzahl an Strichen, die du klopfst">
								<select name="knocks"></select>
							</div>
							<div class="btn element" title="blind klopfen">
								&nbsp;
							</div>
						</div>
						<div class="flipHand element" title="Karten umdrehen">&nbsp;</div>
					</div>
					<div class="cards"></div>
					<div class="knocked"><div class="element"></div></div>
				</div>
				<div class="left vertical">
					<div class="area">
						<div class="name"></div>
						<div class="flag"></div>
					</div>
					<div class="cards"></div>
					<div class="knocked"><div class="element"></div></div>
				</div>
				<div class="top horizontal">
					<div class="area">
						<div class="name"></div>
						<div class="flag"></div>
					</div>
					<div class="cards"></div>
					<div class="knocked"><div class="element"></div></div>
				</div>
				<div class="right vertical">
					<div class="area">
						<div class="name"></div>
						<div class="flag"></div>
					</div>
					<div class="cards"></div>
					<div class="knocked"><div class="element"></div></div>
				</div>
			</div>
		</div>
		<div id="overview">
			<div class="head">Übersicht</div>
			<div class="space">
				<table>
					<tr>
						<td>Spieler:</td>
						<td>
							<ul></ul>
							<div class="counter">noch <span id="maxplayers">{$maxplayers}</span> freie Plätze im Spiel</div>
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
				<div id="startGame" class="actions">
					<div>
						Bitte warte, bis der Spielleiter das Spiel startet.
					</div>
					<div>
						Sobald du denkst, dass genug Spieler dem Spiel beigetreten sind, kannst du das Spiel starten.
						<div class="startBtn element btn" title="Spiel starten">&nbsp;</div>
					</div>
				</div>
				<div id="startRound" class="actions">
					<div>Bitte warte, bis der Spielleiter eine neue Runde startet.</div>
					<div class="newRound element btn" title="Neue Runde starten">&nbsp;</div>
				</div>
			</div>
			<div class="obg"></div>
		</div>
		<div id="panel" class="onLoad">
			<div id="strikes" class="box">
				<div class="head">Striche</div>
				<div class="space">
					<table class="top head">
						<tr>
							<td class="round">Runde</td>
							<td class="player"></td>
							<td class="player"></td>
							<td class="player"></td>
							<td class="player"></td>
						</tr>
					</table>
					<div class="sTable">
						<table></table>
					</div>
				</div>
			</div>
			<div id="log" class="box">
				<div class="head">Spielprotokoll</div>
				<div class="entries"></div>
				<form action="game.php" method="post">
				<div class="input">
					<input type="text" name="message" value="Chat" class="inactive" />
				</div>
				</form>
			</div>
			<div id="quit" class="element"></div>
		</div>
		<audio preload="auto" id="knockSfx">
			<source src="/sfx/knock.ogg">
			<source src="/sfx/knock.mp3">
		</audio>
{include file="foot.tpl"}