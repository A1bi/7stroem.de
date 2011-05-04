{include file="head.tpl" cssfile="index" title="{if !$_user.id}{if $smarty.get.action == "forgotpass"}Passwort vergessen{else}Das Online-Kartenspiel aus der Eifel{/if}{else}Home{/if}"}
{if !$_user.id}
	{if $smarty.get.action == "forgotpass"}
		<div class="forgotPass cBox">
			<div class="head">Passwort vergessen</div>
			<div class="space">
				Du hast dein Passwort vergessen? Kein Problem! Gib hier deine e-mail Adresse ein und wir schicken dir dorthin ein neues Passwort.
				<form method="post" action="/index">
				<p class="hcen">Deine e-mail Adresse: <input type="text" name="email" /></p>
				<p class="hcen"><input type="submit" name="submit" value="abschicken" /></p>
				</form>
			</div>
		</div>
	{else}
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
						<td style="width: 42%;" class="vcen">Spielername:</td>
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
				Eine Anmeldung bei 7ström.de ist <strong>kostenlos</strong>, <strong>kinderleicht</strong> und <strong>schnell</strong>.<br />
				Folge einfach den Schritten und in zwei Minuten kannst du bereits dein erstes Spiel beginnen.
				<div><a href="/signup" class="signup box-element txt-ind">schnell anmelden</a></div>
			</div>
		</div>
	{/if}
{else}
		<div class="welcome">Grüß dich, {$_user.name|escape}!</div>
		<div class="con l">
			<div class="cBox">
				<div class="head">Neues</div>
				<div class="space">
					<div class="bulletin hcen">
						<b>Sorry für die nervigen Fehler, die noch drin sind!</b><br />
						Es wird auf Hochtouren dran gearbeitet und hoffentlich bald behoben.
					</div>
					Moin!
					<p><b>7ström ist da!</b>
					<br />Ja, hat bisschen gedauert, aber jetzt kanns ja losgehen.<br />Hier und da kann noch irgendein Fehler stecken, also bitte sofort melden, wenn ihr was entdeckt. Die Seite befindet sich noch in der Testphase, es kann sich also noch ne Menge ändern und verbessern. Das Ding ist sowieso immer noch nicht ganz fertig.</p>
					<p>Wenn das Ganze anfangs etwas verwirrend sein sollte, lest euch <a href="/hilfe/so-funktionierts">das hier</a> einfach mal durch und es sollte alles schon etwas klarer sein ;)</p>
					<p>Viel Spaß beim Zocken!</p>
				</div>
			</div>
			<div class="cBox" style="margin-top: 20px;">
				<div class="head">Wall of Fame</div>
				<div class="space">
					<em>Kommt, sobald wir genug Spieler haben!</em>
				</div>
			</div>
		</div>
		<div class="con r">
			<div class="requests cBox">
				<div class="head">Anfragen</div>
				<div class="space">
					<table>
					{foreach $requests as $request}
						<tr>
							<td><a href="/player/{$request.name|escape}">{{$request.realname|default:$request.name}|escape}</a></td><td class="hright"><a href="/requests?id={$request.id}&action=accept" title="Freundschaftsanfrage annehmen"><span class="icon add"></span></a> <a href="/requests?id={$request.id}&action=decline" title="Freundschaftsanfrage ablehnen"><span class="icon del"></span></a></td>
						</tr>
					{foreachelse}
						<tr>
							<td><em>Du hast derzeit keine Anfragen.</em></td>
						</tr>
					{/foreach}
					</table>
				</div>
			</div>
			<div class="games cBox">
				<div class="head">Spiele</div>
				<div class="space">
					<table>
						<tr>
							<td><b>{$games.public}</b></td><td>öffentliche Spiele</td>
						</tr>
						<tr>
							<td><b>{$games.friends}</b></td><td>Spiele von Freunden</td>
						</tr>
					</table>
					<p class="hcen"><b><a href="/games">zu allen Spielen</a></b></p>
				</div>
			</div>
		</div>
{/if}
{include file="foot.tpl"}