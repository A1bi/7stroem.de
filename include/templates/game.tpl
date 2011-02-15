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
				<div class="top">
					<div class="stack"></div>
					<div class="hand"></div>
				</div>
				<div class="left">
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
								noch <span>4</span> freie Plätze im Spiel
							</td>
						</tr>
						<tr>
							<td>Einsatz:</td>
							<td>0 &euro;</td>
						</tr>
						<tr>
							<td>Typ:</td>
							<td>öffentlich</td>
						</tr>
					</table>
					<div style="margin-top: 10px;">
						Sobald du denkst, dass genug Spieler dem Spiel beigetreten sind, kannst du das Spiel starten.
					</div>
					<div class="hright">
						<img src="/gfx/game/start.png" alt="Spiel starten" title="Spiel starten" id="startGameBtn" />
					</div>
				</div>
			</div>
			<div class="box" id="results">
				<div class="head">Striche</div>
				<div class="space">
					<table>
						<tr class="top head">
							<td style="width: 10%;">Runde</td>
							<td style="width: 20%;">Albi</td>
							<td style="width: 20%;">Alex</td>
							<td style="width: 20%;">Mike</td>
							<td style="width: 20%;">Robert</td>
						</tr>
						<tr>
							<td>1</td>
							<td>III</td>
							<td></td>
							<td>II</td>
							<td>I</td>
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