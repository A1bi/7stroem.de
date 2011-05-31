{include file="head.tpl" title="Spielerseite von {$user.name|escape}" cssfile="player"}
	<div class="fCon">
		<div class="left">
			<div class="cBox infos">
				<div class="head">
					{$user.name|escape}
				</div>
				<div class="space">
					<div class="subhead">
						Allgemeine Infos
					</div>
					<table>
						<tr>
							<td style="width: 40%;">Spielername:</td>
							<td style="width: 60%;">{$user.name|escape}</td>
						</tr>
						{if $user.realname != ""}
						<tr>
							<td>Echter Name:</td>
							<td>{$user.realname|escape}</td>
						</tr>
						{/if}
						<tr>
							<td>Dabei seit:</td>
							<td>{$user.registered}</td>
						</tr>
					</table>
					<div class="subhead">
						Spielerfolge
					</div>
					<table>
						<tr>
							<td style="width: 40%;">Runden gespielt:</td>
							<td style="width: 60%;">{$user.rounds}</td>
						</tr>
						<tr>
							<td>Davon gewonnen:</td>
							<td>{$user.won}</td>
						</tr>
						<tr>
							<td>Siegesquote:</td>
							<td>{$user.quota} %</td>
						</tr>
					</table>
					{if $_user.id != ""}
					{if $user.request.by == $user.id}
					<a href="/requests?id={$user.request.id}&action=accept" class="addFriend">
						<span class="icon add"></span> Anfrage annehmen
					</a>
					{elseif $user.request.by == $_user.id}
					<div class="hcen"><em>Freundschaftsanfrage ausstehend</em></div>
					{elseif !$user.isFriend}
					<a href="?action=addFriend" class="addFriend">
						<span class="icon add"></span> als Freund hinzufügen
					</a>
					{/if}
					{/if}
				</div>
			</div>
			<div class="cBox infos">
				<div class="head">
					Freunde ({$user.friends|count})
				</div>
				<div class="space">
					{foreach $user.friends as $friend}
					<a href="/player/{$friend.name|escape}">{{$friend.realname|default:$friend.name}|escape}</a>{if !$friend@last},{/if}
					{foreachelse}
					<em>Noch keine Freunde hinzugefügt.</em>
					{/foreach}
				</div>
			</div>
			<div class="actions">
				{if $user.isFriend && $_user.id != $user.id}
				<a href="?action=delFriend">als Freund entfernen</a>
				{/if}
			</div>
		</div>
		<div class="cBox comments">
			<div class="head">
				Kommentare von anderen Spielern
			</div>
			<div class="space">
				{foreach $user.comments as $comment}
				<div class="comment">
					<div class="by">
						von <a href="/player/{$comment.name|escape}">{{$comment.realname|default:$comment.name}|escape}</a> - {$comment.time}
						{if $user.id == $_user.id}<a href="?action=delComment&amp;id={$comment.id}" title="Kommentar löschen"><span class="icon del"></span></a>{/if}
					</div>
					<div class="text">
						{$comment.text|nl2br}
					</div>
				</div>
				{foreachelse}
				<div class="comment">
					<em>Noch keine Kommentare hinterlassen.</em>
				</div>
				{/foreach}
				{if $_user.id != ""}
				<div class="post">
				<form method="post" action="{$smarty.server.REQUEST_URI}">
					Auch etwas schreiben:
					<div><textarea name="comment"></textarea></div>
					<div class="hcen"><input type="submit" name="submit" value="speichern" /></div>
				</form>
				</div>
				{/if}
			</div>
		</div>
	</div>
{include file="foot.tpl"}