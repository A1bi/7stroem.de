{include file="head.tpl" cssfile="index"}
		<div class="join">
			<div class="text">
				Spiele das beliebte Kartenspiel aus der Eifel online gegen deine Freunde!
			</div>
			<div class="signup">
				<a href="/signup"><img src="/gfx/index/join_signup.png" alt="jetzt anmelden!" title="jetzt anmelden!" /></a>
			</div>
		</div>
		<div class="strike">
			&nbsp;
		</div>
		<div class="login">
			<div class="head top">
				Los, einloggen und mitspielen!
			</div>
			<div class="sep">&nbsp;</div>
			<div class="space">
				<form action="login.php" method="post">
				<table style="width: 100%;">
					<tr>
						<td style="width: 42%;" class="vcen">Benutzername:</td>
						<td><input type="text" name="name" class="field" tabindex="1" /></td>
					</tr>
					<tr>
						<td>Passwort:<div style="font-size: 12px;"><a href="/forgotpass">vergessen?</a></div></td>
						<td><input type="password" name="pass" class="field" tabindex="2" /></td>
					</tr>
				</table>
				<div style="margin: 5px; height: 35px; width: 97%; position: relative;">
					<div style="position: absolute; left: 10px; top: 2px;">
						<a href="#" onclick="return main.facebook.showAuthDialog('login?fb=1');"><img src="/gfx/signup/fb_login.png" alt="Facebook" title="Ohne Registrierung über Facebook einloggen" /></a>
					</div>
					<div style="position: absolute; right: 0px;">
						<input type="image" src="/gfx/index/login_submit.png" alt="login" title="login" />
					</div>
				</div>
				</form>
			</div>
			<div class="head">
				Neu hier?
			</div>
			<div class="sep">&nbsp;</div>
			<div class="space">
				Ein Anmeldung bei 7ström.de ist <strong>kostenlos</strong>, <strong>kinderleicht</strong> und <strong>schnell</strong>.<br />
				Folge einfach den Schritten und in zwei Minuten kannst du bereits dein erstes Spiel beginnen.
				<div class="hcen" style="margin: 13px;">
					<a href="/signup"><img src="/gfx/index/login_signup.png" alt="schnell anmelden" title="schnell anmelden" /></a>
				</div>
			</div>
		</div>
{include file="foot.tpl"}
