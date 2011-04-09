<!DOCTYPE html>
<html>
<head>
	<title>7ström</title>
	<meta charset="utf-8" />
	<script>
		var ok = {$ok};
		var type = "{$type}";
		var known = {$known|default:"false"};
		function finish() {
			if (type == "login") {
				if (ok) {
					if (known) {
						url = "/games";
					} else {
						url = "/signup?fb=1";
					}
					window.opener.location.href = url;
				}
			} else if (type == "signup") {
				window.opener.signup.finishFb(ok, known);
			}
			window.close();
		}
	</script>
</head>

<body onload="finish();">
</body>
</html>