{include file="head.tpl" cssfile="index" title="Das Online-Kartenspiel aus der Eifel"}
		<div class="join box-bg">
			<div class="text">
				Spiele das beliebte Kartenspiel aus der Eifel online gegen deine Freunde!
			</div>
			<a href="/signup" class="box-element txt-ind">jetzt anmelden!</a>
		</div>
		<div class="strike box-bg">
			&nbsp;
		</div>
		<div class="login box-bg">
			<div class="head top">
				Los, einloggen und mitspielen!
			</div>
			<div class="sep box-element">&nbsp;</div>
			<div class="space">
				<form action="login.php" method="post">
				<table>
					<tr>
						<td style="width: 42%;" class="vcen">Benutzername:</td>
						<td><input type="text" name="name" class="field" tabindex="1" /></td>
					</tr>
					<tr>
						<td>Passwort:<div style="font-size: 12px;"><a href="/forgotpass">vergessen?</a></div></td>
						<td><input type="password" name="pass" class="field" tabindex="2" /></td>
					</tr>
				</table>
				<div class="buttons">
					<a href="#" id="fbLogin" onclick="return main.facebook.showAuthDialog('login?fb=1');"><img src="/gfx/signup/fb_login.png" alt="Facebook" title="Ohne Registrierung über Facebook einloggen" /></a>
					<input type="submit" name="login" value="" title="einloggen" class="box-element txt-ind" />
				</div>
				</form>
			</div>
			<div class="head">
				Neu hier?
			</div>
			<div class="sep box-element">&nbsp;</div>
			<div class="space">
				Ein Anmeldung bei 7ström.de ist <strong>kostenlos</strong>, <strong>kinderleicht</strong> und <strong>schnell</strong>.<br />
				Folge einfach den Schritten und in zwei Minuten kannst du bereits dein erstes Spiel beginnen.
				<div><a href="/signup" class="signup box-element txt-ind">schnell anmelden</a></div>
			</div>
		</div>
{include file="foot.tpl"}
