{include file="head.tpl" cssfile="signup" jsfile="signup" title="Registrieren"}
		<div class="intro">{if $smarty.get.fb == 1}
			Du hast dich erfolgreich mit deinem Facebook-Konto eingeloggt.<br />
			Da du zum ersten Mal hier bist, musst du dir jetzt nur noch einen Spielernamen aussuchen.{else}
			Du willst mitmachen bei 7ström?<br />
			Nimm dir zwei Minuten Zeit, folge diesen fünf Schritten und schon kanns losgehen.{/if}
			<br />Achja.. es ist alles garantiert <b>kostenlos</b>!
		</div>
		<div class="steps">
			<div class="step" id="username">
				<div class="head">
					<div class="finished"></div>
					Schritt 1: Spielername
				</div>
				<div class="contnt collapsed">
					Zuerst musst du dir einen Spielernamen, unter dem du auf 7ström zocken willst, aussuchen.
					<p class="field">Spielername: <input type="text" name="name" /></p>
					<div class="next">
						<input type="submit" name="next" value="weiter" />
						<img src="/gfx/signup/loading.gif" alt="" />
					</div>
				</div>
			</div>
			<div class="step" id="facebook">
				<div class="head">
					<div class="finished"></div>
					Schritt 2: Facebook ?
				</div>
				<div class="contnt collapsed">
					Wenn du ein Facebook-Konto hast, kannst du dich mit diesem bei 7ström einloggen. Die Anmeldung wäre damit bereits abgeschlossen. Klicke dazu einfach auf den folgenden Button:
					<p class="hcen"><img src="/gfx/signup/fb_login.png" alt="Facebook" title="Über Facebook registrieren" /></p>
					<div class="next">
						<input type="submit" name="next" value="überspringen" />
						<img src="/gfx/signup/loading.gif" alt="" />
					</div>
				</div>
			</div>
			<div class="step" id="password">
				<div class="head">
					<div class="finished"></div>
					Schritt 3: Passwort
				</div>
				<div class="contnt collapsed">
					Bitte wähle ein sicheres Passwort mit mindestens 6 Zeichen.
					<table class="field">
						<tr>
							<td>Passwort:</td><td><input type="password" name="pass" /></td>
						</tr>
						<tr>
							<td>Nochmal zur Sicherheit:</td><td><input type="password" name="pass2" /></td>
						</tr>
					</table>
					<div class="next">
						<input type="submit" name="next" value="weiter" />
						<img src="/gfx/signup/loading.gif" alt="" />
					</div>
				</div>
			</div>
			<div class="step" id="email">
				<div class="head">
					<div class="finished"></div>
					Schritt 4: Name und e-mail Adresse
				</div>
				<div class="contnt collapsed">
					Gib hier bitte deine e-mail Adresse an. Über diese kannst du dich später einloggen oder dein Passwort zurücksetzen, falls du es vergessen hast.<br />
					Du kannst zusätzlich deinen echten Namen angeben. Diese Angabe ist freiwillig!
					<table class="field">
						<tr>
							<td>e-mail Adresse:</td><td><input type="text" name="email" /></td>
						</tr>
						<tr>
							<td>Name:</td><td><input type="text" name="name" /></td>
						</tr>
					</table>
					<div class="next">
						<input type="submit" name="next" value="weiter" />
						<img src="/gfx/signup/loading.gif" alt="" />
					</div>
				</div>
			</div>
			<div class="step" id="finish">
				<div class="head">
					<div class="finished"></div>
					Schritt 5: Abschluss
				</div>
				<div class="contnt hcen collapsed">
					<div>Es ist geschafft!</div>
					Bevor du loslegst, solltest du dir besser vorher anschauen, <a href="/hilfe/so-funktionierts">wie alles funktioniert</a>.<br />
					Natürlich kannst du auch sofort <a href="/games">loszocken</a>.
					<p>Viel Spaß beim Spielen!</p>
				</div>
			</div>
			<div class="step bottom"></div>
		</div>
{include file="foot.tpl"}