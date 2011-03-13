function animationTime(time, dependend) {
	if ((dependend && $.browser.webkit) || navigator.platform.indexOf("iPhone") != -1 || navigator.platform.indexOf("iPod") != -1) {
		time = 0;
	}
	return time;
}