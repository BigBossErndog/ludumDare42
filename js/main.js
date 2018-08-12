var gameDim = {
	width:1280,
	height:720
}

var music = {};
var sfx = {};

var musicManager = new SoundManager(this.music);
var sfxManager = new SoundManager(this.sfx);

music.computerWorld = new BeepMusic(computerWorld, this.musicManager);

music.whiteNoise = new BeepMusic("6n11s0kbl00e00t6m0a7g00j7i0r1o30T0w1f1d1c0h0v0T2w1d0v4b4gp170arxZ00", musicManager);

var game = new Phaser.Game(gameDim.width, gameDim.height, "game", null);
window.onwheel = function(){ return false; }

var boot = {
	preload: function() {
		this.game.load.image("folder", "assets/images/folder.png");
		this.game.load.image("bin", "assets/images/bin.png");
		this.game.load.image("system", "assets/images/system.png");
		this.game.load.spritesheet("viruses", "assets/images/viruses.png", 100, 100, 4);
		this.game.load.image("txt", "assets/images/txt.png");
	},
	
	create: function() {
		this.game.state.start("main", true);
	},
	
	update: function() {
		
	}
}

var main = {
	preload:function() {
		
	},
	
	create:function() {
		this.game.input.mouse.mouseWheelCallback = mouseWheel;
		this.game.stage.backgroundColor = "#e8ab92";
		game.renderer.renderSession.roundPixels = true;
		//Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
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
		music.computerWorld.play();
		
		this.bAlpha = 1;
		
		this.blackScreen = this.game.add.graphics();
		this.blackScreen.clear();
		this.blackScreen.beginFill(0x000000, this.bAlpha);
		this.blackScreen.drawRect(0, 0, this.game.width, this.game.height);
		this.blackScreen.endFill();
	},
	
	update:function() {
		this.os.run();
		musicManager.manage();
		sfxManager.manage();
		scrollSpeed = 0;
		
		if (this.blackScreen != null) {
			if (this.bAlpha > 0) {
				this.blackScreen.clear();
				
				this.blackScreen.beginFill(0x000000, this.bAlpha);
				this.blackScreen.drawRect(0, 0, this.game.width, this.game.height);
				this.blackScreen.endFill();
		
				this.bAlpha -= 0.01;
				if (this.bAlpha <= 0) {
					this.blackScreen.destroy();
					this.blackScreen = null;
				}
			}
		}
	},
	
	render() {
		
	}
}

var gameOver = {
	preload: function() {
		
	},
	
	create: function() {
		this.game.stage.backgroundColor = "#2424a0";
		music.whiteNoise.play();
		
		this.smiley = this.game.add.text(100, 100, ":(");
		this.smiley.font = "Courier New";
		this.smiley.fontSize = 200;
		this.smiley.addColor("#ffffff", 0);
		
		this.txt = this.game.add.text(100, 400, "Your PC ran into a problem and needs to restart. We'll restart it for you.");
		this.txt.wordWrap = true;
		this.txt.wordWrapWidth = game.width - 200;
		this.txt.addColor("#ffffff", 0);
		this.txt.font = "Courier New";
		
		this.counter = 5 * 60;
	},
	
	update: function() {
		this.counter -= 1;
		if (this.counter <= 0) {
			music.whiteNoise.stop();
			this.game.state.start("boot");
		}
	}
}

game.state.add("main", main);
game.state.add("gameOver", gameOver);
game.state.add("boot", boot);
game.state.start("gameOver");