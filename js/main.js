var gameDim = {
	width:1280,
	height:720
}

var music = {};
var sfx = {};

var musicManager = new SoundManager(this.music);
var sfxManager = new SoundManager(this.sfx);

music.computerWorld = new BeepMusic(computerWorld, this.musicManager);

var playerScore;

var bgData;
function createBGGradient(game, color1, color2, width, height, group) {
	bgData = game.add.bitmapData(width, height);
	var g = bgData.addToWorld();
	
	var y = 0;
	for  (var i = 0; i < height/2; i++) {
		var c = Phaser.Color.interpolateColor(color1, color2, height/2, i);
		
		bgData.rect(0, y, width, y+2, Phaser.Color.getWebRGB(c));
		
		y += 2;
	}
	
	if (group != null && group != undefined) {
		group.add(g);
	}
	
	return g;
}

var game = new Phaser.Game(gameDim.width, gameDim.height, "game", null);
window.onwheel = function(){ return false; }

var logoHead = null;
var loadBar = null;
var loadText = null;
var madeBy;

var preboot = {
	preload: function() {
		this.game.load.image("logoHead", "assets/images/logoHead300.png");
	},
	create: function() {
		this.game.input.mouse.mouseWheelCallback = mouseWheel;
		this.game.stage.backgroundColor = "#000000";
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
	},
	
	update: function() {
		this.game.state.start("boot", false);
	}
	
}

var boot = {
	preload: function() {
		logoHead = game.add.sprite(game.width/2-150,game.height/2-300,"logoHead");
		loadBar = game.add.graphics();
		loadText = game.add.text(game.world.centerX, game.world.centerY + 200, "0%");
		loadText.addColor("#ffffff", 0);
		loadText.anchor.x = 0.5;
		loadText.font = "Courier";
		loadText.fontSize = 50;
		
		madeBy = game.add.text(game.world.centerX, game.world.centerY, "Made By BigBossErndog\nLudum Dare 42");
		madeBy.align = "center";
		madeBy.anchor.x = 0.5;
		madeBy.font = "Courier";
		madeBy.fontSize = 20;
		madeBy.addColor("#ffffff", 0);
		
		this.game.load.image("folder", "assets/images/folder.png");
		this.game.load.image("bin", "assets/images/bin.png");
		this.game.load.image("system", "assets/images/system.png");
		this.game.load.spritesheet("viruses", "assets/images/viruses.png", 100, 100, 4);
		this.game.load.image("txt", "assets/images/txt.png");
		
		this.game.load.audio("hit1", "assets/sfx/hit1.ogg");
		this.game.load.audio("zap1", "assets/sfx/zap1.ogg");
		this.game.load.audio("trash", "assets/sfx/trash.ogg");
		this.game.load.audio("error", "assets/sfx/error.ogg");
		
		this.game.load.onFileComplete.add(handleProgressBar, this);
	},
	
	create: function() {
		//hello();
		this.game.input.mouse.mouseWheelCallback = mouseWheel;
		this.game.stage.backgroundColor = "#000000";
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
		
		this.counter = 5 * 60;
	},
	
	update: function() {
		this.counter -= 1;
		num = 50 +  (50 - Math.floor(((this.counter - 15) / (5 * 60)) * 50));
		
		
		if (num > 100) num = 100;
		if (this.counter < 0) {
			if (this.game.input.activePointer.justPressed(100)) this.game.state.start("main", true);
			loadText.text = "Click to Begin";
		}
		else {
			loadText.text = num + "%";
		}
		
		loadBar.clear();
		loadBar.beginFill(0xffffff, 1);
		loadBar.drawRect(game.world.centerX-50*5, game.world.centerY + 90, num * 5, 50);
		loadBar.endFill();
	}
}

var main = {
	preload:function() {
		
	},
	
	create:function() {
		this.game.input.mouse.mouseWheelCallback = mouseWheel;
		this.game.stage.backgroundColor = "#330049";
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
	
		music.computerWorld.play();
		
		this.bAlpha = 1;
		
		// this.bgGroup = this.game.add.group();
		// this.bgGradient = createBGGradient(this.game, 0x330049, 0x000000, gameDim.width, gameDim.height, this.bgGroup);
		
		this.os = new OS(this.game);
		
		this.blackScreen = this.game.add.graphics();
		this.blackScreen.clear();
		this.blackScreen.beginFill(0x000000, this.bAlpha);
		this.blackScreen.drawRect(0, 0, this.game.width, this.game.height);
		this.blackScreen.endFill();
		
		sfx.zap1 = new Sound(this.game, "zap1", sfxManager);
		sfx.trash = new Sound(this.game, "trash", sfxManager);
		sfx.error = new Sound(this.game, "error", sfxManager);
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
				
				this.blackScreen.y -= 1;
				this.blackScreen.y = Math.floor(this.blackScreen.y * 1.05);
		
				this.bAlpha -= 0.005;
				if (this.bAlpha <= 0 || this.blackScreen.y < -game.height) {
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
		
		this.smiley = this.game.add.text(100, 100, ":(");
		this.smiley.font = "Courier New";
		this.smiley.fontSize = 200;
		this.smiley.addColor("#ffffff", 0);
		
		this.txt = this.game.add.text(100, 400, "Your PC ran into a problem and needs to restart. We'll restart it for you.\n");
		this.txt.wordWrap = true;
		this.txt.wordWrapWidth = game.width - 200;
		this.txt.addColor("#ffffff", 0);
		this.txt.font = "Courier New";
		this.txt.text += "You lasted for " + playerScore.h + "h " + playerScore.m + "m " + playerScore.s + "s";
		sfx.hit1 = new Sound(this.game, "hit1", sfxManager);
		sfx.hit1.play();
		
		this.counter = 5 * 60;
	},
	
	update: function() {
		this.counter -= 1;
		if (this.counter <= 0) {
			this.game.state.start("boot", true);
		}
		sfxManager.manage();
	}
}

game.state.add("main", main);
game.state.add("gameOver", gameOver);
game.state.add("boot", boot);
game.state.add("preboot", preboot);
game.state.start("preboot");