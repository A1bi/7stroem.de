{include file="head.tpl" cssfile="settings" title="Einstellungen"}
		<div class="cBox">
			<div class="head">Einstellungen</div>
			<div class="space">
				<div class="cats">
					{if $_user.fb == ""}<a href="/settings/email"{if $smarty.get.action == "email"} class="active"{/if}>e-mail Adresse</a> | <a href="/settings/password"{if $smarty.get.action == "password"} class="active"{/if}>Passwort</a> | {/if}<a href="/settings/facebook"{if $smarty.get.action == "facebook"} class="active"{/if}>Facebook</a>
				</div>
				<div style="margin: 20px auto; width: 95%;">
					{if $smarty.get.action == "password"}
					Hier kannst du dein Passwort ändern. Gib dazu dein altes sowie zweimal dein neues ein.
					<form method="post" action="/settings/password">
					<table style="width: 100%; margin-top: 10px;">
						<tr>
							<td style="width: 30%;">Altes Passwort:</td><td><input type="password" name="old" /></td>
						</tr>
						<tr>
							<td>Dein neues Passwort:</td><td><input type="password" name="new" /></td>
						</tr>
						<tr>
							<td>Nochmal zur Sicherheit:</td><td><input type="password" name="new2" /></td>
						</tr>
					</table>
					<p class="hcen">
						<input type="submit" name="submit" value="ändern" />
					</p>
					</form>
					{elseif $smarty.get.action == "facebook"}
						{if $_user.fb == ""}
					Dein Konto bei 7ström ist derzeit mit keinem Konto bei Facebook verbunden. Wenn du möchtest, kannst du dies mit einem Klick auf den folgenden Button nachholen:
					<p class="hcen"><a href="#" onclick="return main.facebook.showAuthDialog('settings/facebook?finish=1');"><img src="/gfx/signup/fb_login.png" alt="Facebook" title="Mit Facebook verknüpfen" /></a></p>
						{else}
							{if $smarty.get.delFb == 1}
					Um die Facebook-Verknüpfung aufzuheben, musst du eine e-mail Adresse und ein Passwort für dein 7ström-Konto festlegen, damit du dich später auch weiterhin bei 7ström anmelden kannst.
					<form method="post" action="/settings/facebook">
					<table style="width: 100%; margin-top: 10px;">
						<tr>
							<td style="width: 30%;">e-mail Adresse:</td><td><input type="text" name="email" /></td>
						</tr>
						<tr>
							<td>Passwort:</td><td><input type="password" name="pass" /></td>
						</tr>
						<tr>
							<td>Nochmal zur Sicherheit:</td><td><input type="password" name="pass2" /></td>
						</tr>
					</table>
					<p class="hcen">
						<input type="submit" name="submit" value="Verknüpfung aufheben" />
					</p>
					</form>
							{else}
					Dein Konto bei 7ström ist mit deinem Facebook-Konto verknüpft. Wenn du das nicht mehr möchtest, kannst du diese Verknüpfung <a href="?delFb=1">hier</a> aufheben.
							{/if}
						{/if}
					{else}
					Hier kannst du deine e-mail Adresse ändern.
					<form method="post" action="/settings/email">
					<table style="width: 100%; margin-top: 10px;">
						<tr>
							<td style="width: 30%;">e-mail Adresse:</td><td><input type="text" name="email" value="{$_user.email|escape}" /></td>
						</tr>
					</table>
					<p class="hcen">
						<input type="submit" name="submit" value="ändern" />
					</p>
					</form>
					{/if}
				</div>
			</div>
		</div>
{include file="foot.tpl"}