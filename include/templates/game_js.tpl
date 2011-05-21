		game.setProperties({
			id: {$gameid},
			user: {$userid},
			butler: {
				id: {$butlerid},
				addr: "{$butleraddr}"
			},
			authcode: "{$authcode}",
			host: {$host}
		});