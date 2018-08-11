var game = new Phaser.Game(window.innerWidth, window.innerHeight, "game", null);

var main = {
	preload:function() {
		this.game.load.image("folder", "assets/images/folder.png");
		this.game.load.image("bin", "assets/images/bin.png");
	},
	
	create:function() {
		this.game.stage.backgroundColor = "#87d5ff";
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		//Phaser.Canvas.setImageRenderingBicubic(this.game.canvas);
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//game.scale.setShowAll();
		game.scale.refresh();
		game.stage.disableVisibilityChange = true;
		document.body.style.backgroundColor = "white";
	
		this.os = new OS(this.game);
		
	},
	
	update:function() {
		this.os.run();
	},
	
	render() {
		
	}
}

game.state.add("main", main);
game.state.start("main");