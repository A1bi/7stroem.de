<!DOCTYPE html>
<html>
<head>
	<title>7ström</title>
	<meta charset="utf-8" />
	<script>
		var ok = {$ok|default:"false"};
		var type = "{$type}";
		var known = {$known|default:"false"};
		function finish() {
			if (type == "signup") {
				window.opener.signup.finishFb(ok, known);
			} else {
				if (ok) {
					if (type == "settings") {
						url = "/settings/facebook";
					} else {
						if (known) {
							url = "/games";
						} else {
							url = "/signup?fb=1";
						}
					}
					window.opener.location.href = url;
				}
			}
			window.close();
		}
	</script>
</head>

<body onload="finish();">
</body>
</html>