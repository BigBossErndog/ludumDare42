function handleProgressBar(progress) {
	var num = Math.floor(progress/2);
	loadText.text = num.toString() + "%";
	loadBar.clear();
	loadBar.beginFill(0xffffff, 1);
	loadBar.drawRect(game.world.centerX-50*5, game.world.centerY + 90, num * 5, 50);
	loadBar.endFill();
}