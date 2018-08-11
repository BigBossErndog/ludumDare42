class Explorer {
	constructor(game, x, y, folder, os) {
		this.game = game;
		this.os = os;
		
		this.x = x;
		this.y = y;
		
		this.group = this.game.add.group();
		
		this.folder = folder;
		this.w = game.add.graphics();
		this.group.add(this.w);
		
		this.width = 400;
		this.height = 350;
		
		this.destroyed = false;
		
		this.rec = {};
		this.rec.mouseStart = {
			x:this.game.input.x,
			y:this.game.input.y
		}
		this.rec.self = {
			x:this.x,
			y:this.y
		}
		
		this.hold = this.getHold();
		
		this.beingDragged = false;
		this.beingResized = false;
		
		this.game.input.onDown.add(this.click, this);
		this.game.input.onUp.add(this.release, this);
		
		this.folders = this.folder.children;
		this.folderSprites = [];
		
		//folder, game, group, explorer, order
		this.parentFolderSprite = null;
		if (this.folder.parentFolder != null) {
			this.parentFolderSprite = new FolderSprite(this.folder.parentFolder, this.game, this.group, this, 0);
			this.parentFolderSprite.setName("../");
			this.parentFolderSprite.undraggable = true;
		}
		
		
		this.resize = {
			left:null,
			right:null,
			up:null
		}
		this.resizeShow = {
			left:false,
			right:false,
			up:false,
			down:false
		}
		
		this.curFolder = this.game.add.text(this.x + 10, this.y + 25, "");
		this.curFolder.font = "Courier New";
		this.curFolder.fontSize = 20;
		this.group.add(this.curFolder);
		this.cutCurFolderText();
	}
	
	cutCurFolderText() {
		this.curFolder.text = this.folder.getPath();
		while (this.curFolder.x + this.curFolder.width > this.x + this.width - 10) {
			this.curFolder.text = this.curFolder.text.substring(0, this.curFolder.text.length - 2);
		}
	}
	
	getHold() {
		var h = {
			x: Math.floor((this.width-4)/110),
			y: Math.floor((this.height-50)/110)
		}
		return h;
	}
	
	bringToTop() {
		this.group = this.game.add.group();
		this.group.add(this.w);
		this.group.add(this.curFolder);
		for (var i = 0; i < this.folderSprites.length; i++) {
			this.folderSprites[i].addToGroup(this.group);
		}
		if (this.parentFolderSprite != null) this.parentFolderSprite.addToGroup(this.group);
	}
	
	click() {
		var bannerRect = new Phaser.Rectangle(this.x, this.y, this.width, 20);
		if (Phaser.Rectangle.contains(bannerRect, this.game.input.x, this.game.input.y)) {
			this.bringToTop();
			
			this.rec.mouseStart = {
				x:this.game.input.x,
				y:this.game.input.y
			}
			
			this.rec.self = {
				x:this.x,
				y:this.y,
				width:this.width,
				height:this.height
			}
			
			this.beingDragged = true;
		}
		
		var xBtn = new Phaser.Rectangle(this.x + this.width - 28, this.y + 2, 26, 18);
		if (Phaser.Rectangle.contains(xBtn, this.game.input.x, this.game.input.y)) {
			this.destroyed = true;
		}
		
		var resizeBox = {
			left: new Phaser.Rectangle(this.x-1, this.y, 2, this.height),
			right: new Phaser.Rectangle(this.x+this.width-1, this.y, 2, this.height),
			up: new Phaser.Rectangle(this.x, this.y-1, this.width, 2),
			down: new Phaser.Rectangle(this.x,this.y+this.height-1,this.width, 2)
		}
		this.resize = {
			left:false,
			right:false,
			up:false,
			down:false
		}
		if (Phaser.Rectangle.contains(resizeBox.left, this.game.input.x, this.game.input.y)) {
			this.resize.left = true;
			this.beingDragged = false;
			this.beingResized = true;
			this.rec.mouseStart = {
				x:this.game.input.x,
				y:this.game.input.y
			}
			this.rec.self = {
				x:this.x,
				y:this.y,
				width:this.width,
				height:this.height
			}
		}
		if (Phaser.Rectangle.contains(resizeBox.right, this.game.input.x, this.game.input.y)) {
			this.resize.right = true;
			this.beingDragged = false;
			this.beingResized = true;
			this.rec.mouseStart = {
				x:this.game.input.x,
				y:this.game.input.y
			}
			this.rec.self = {
				x:this.x,
				y:this.y,
				width:this.width,
				height:this.height
			}
		}
		if (Phaser.Rectangle.contains(resizeBox.up, this.game.input.x, this.game.input.y)) {
			this.resize.up = true;
			this.beingDragged = false;
			this.beingResized = true;
			this.rec.mouseStart = {
				x:this.game.input.x,
				y:this.game.input.y
			}
			this.rec.self = {
				x:this.x,
				y:this.y,
				width:this.width,
				height:this.height
			}
		}
		if (Phaser.Rectangle.contains(resizeBox.down, this.game.input.x, this.game.input.y)) {
			this.resize.down = true;
			this.beingResized = true;
			this.rec.mouseStart = {
				x:this.game.input.x,
				y:this.game.input.y
			}
			this.rec.self = {
				x:this.x,
				y:this.y,
				width:this.width,
				height:this.height
			}
		}
	}
	
	release() {
		this.beingDragged = false;
		this.beingResized = false;
		this.resize = {
			left:false,
			right:false,
			up:false,
			down:false
		}
	}
	
	handleFolders() {
		var curOrderOffset = 0;
		
		for (var i = 0; i < this.folders.length; i++) {
			if (!this.alreadyMadeFolder(this.folders[i])) {
				this.createFolderSprite(this.folders[i]);
			}
		}
		
		if (this.parentFolderSprite != null) {
			this.parentFolderSprite.manage();
			curOrderOffset += 1;
			if (this.parentFolderSprite.clicked) {
				var ne = this.os.createExplorer(this.x, this.y, this.parentFolderSprite.folder);
				ne.width = this.width;
				ne.height = this.height;
				ne.cutCurFolderText();
				this.destroyed = true;
				return;
			}
		}
		
		for (var i = 0; i < this.folderSprites.length; i++) {
			this.folderSprites[i].order = curOrderOffset + i;
			this.folderSprites[i].manage();
			if (this.folderSprites[i].clicked) {
				var ne = this.os.createExplorer(this.x, this.y, this.folderSprites[i].folder);
				ne.width = this.width;
				ne.height = this.height;
				ne.cutCurFolderText();
				this.destroyed = true;
				return;
			}
			if (this.folderSprites[i].destroyed) {
				this.folderSprites[i].destroy();
				this.folderSprites.splice(i, 1);
				i--;
			}
		}
	}
	
	createFolderSprite(folder) {
		this.folderSprites.push(new FolderSprite(
			folder,
			this.game,
			this.group,
			this,
			this.folderSprites.length
		));
	}
	
	alreadyMadeFolder(folder) {
		for (var i = 0; i < this.folderSprites.length; i++) {
			if (this.folderSprites[i].folder.id == folder.id) {
				return true;
			}
		}
		return false;
	}
	
	draw() {
		this.w.clear();
		
		this.w.beginFill(0xffffff, 1);
		this.w.drawRect(this.x, this.y, this.width, this.height);
		this.w.endFill();
		
		this.w.beginFill(0x2169dd, 1);
		this.w.drawRect(this.x, this.y, this.width, 20);
		this.w.endFill();
		
		this.w.beginFill(0xff6868, 1);
		this.w.drawRect(this.x + this.width - 30, this.y, 30, 20);
		this.w.endFill();
	}
	
	drag() {
		var resizeBox = {
			left: new Phaser.Rectangle(this.x-1, this.y, 2, this.height),
			right: new Phaser.Rectangle(this.x+this.width-1, this.y, 2, this.height),
			up: new Phaser.Rectangle(this.x, this.y-1, this.width, 2),
			down: new Phaser.Rectangle(this.x,this.y+this.height-1,this.width, 2)
		}
		this.resizeShow = {
			left:this.resize.left,
			right:this.resize.right,
			up:this.resize.up,
			down:this.resize.down
		}
		if (Phaser.Rectangle.contains(resizeBox.left, this.game.input.x, this.game.input.y)) {
			this.resizeShow.left = true;
		}
		if (Phaser.Rectangle.contains(resizeBox.right, this.game.input.x, this.game.input.y)) {
			this.resizeShow.right = true;
		}
		if (Phaser.Rectangle.contains(resizeBox.up, this.game.input.x, this.game.input.y)) {
			this.resizeShow.up = true;
		}
		if (Phaser.Rectangle.contains(resizeBox.down, this.game.input.x, this.game.input.y)) {
			this.resizeShow.down = true;
		}
		
		if (this.beingDragged) {
			this.x = this.rec.self.x + (this.game.input.x - this.rec.mouseStart.x);
			this.y = this.rec.self.y + (this.game.input.y - this.rec.mouseStart.y);
		}
		if (this.beingResized) {
			this.cutCurFolderText();
		}
		if (this.resizeShow.left) {
			this.game.canvas.style.cursor = "w-resize";
			if (this.beingResized) {
				this.x = this.game.input.x;
				this.width = this.rec.self.width + (this.rec.mouseStart.x - this.game.input.x);
			}
		}
		if (this.resizeShow.right) {
			this.game.canvas.style.cursor = "e-resize";
			if (this.beingResized) {
				this.width = this.rec.self.width + (this.game.input.x - this.rec.mouseStart.x);
			}
		}
		if (this.resizeShow.up) {
			if (this.resize.left) {
				this.game.canvas.style.cursor = "nw-resize";
			}
			else if (this.resize.right) {
				this.game.canvas.style.cursor = "ne-resize";
			}
			else {
				this.game.canvas.style.cursor = "n-resize";
			}
			if (this.beingResized) {
				this.y = this.game.input.y;
				this.height = this.rec.self.height + (this.rec.mouseStart.y - this.game.input.y);
			}
		}
		if (this.resizeShow.down) {
			if (this.resize.left) {
				this.game.canvas.style.cursor = "sw-resize";
			}
			else if (this.resize.right) {
				this.game.canvas.style.cursor = "se-resize";
			}
			else {
				this.game.canvas.style.cursor = "s-resize";
			}
			if (this.beingResized) {
				this.height = this.rec.self.height + (this.game.input.y - this.rec.mouseStart.y);
			}
		}
		
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		if (this.x + this.width > this.game.width) this.x = this.game.width - this.width;
		if (this.y + 25 > this.game.height) this.y = this.game.height - 25;
		if (this.width < 120) {
			this.width = 120;
		}
		if (this.height < 170) {
			this.height = 170;
		}
		this.hold = this.getHold();
	}
	
	destroyFolderSprites() {
		for (var i = 0; i < this.folderSprites.length; i++) {
			this.folderSprites[i].destroy();
		}
	}
	
	destroy() {
		this.w.destroy();
		this.game.input.onDown.remove(this.click);
		this.game.input.onUp.remove(this.release);
		this.destroyFolderSprites();
		if (this.parentFolderSprite != null) {
			this.parentFolderSprite.destroy();
		}
		this.curFolder.destroy();
	}
	
	run() {
		this.drag();
		this.draw();
		this.handleFolders();
		this.curFolder.x = this.x + 10;
		this.curFolder.y = this.y + 25;
	}
}

class UsageHud {
	constructor(game, group, folder, os) {
		this.game = game;
		this.folder = folder;
		this.os = os;
		this.group = group;
		
		this.box = this.game.add.graphics();
		this.width = 200;
		this.height = 50;
		this.x = this.game.input.x;
		this.y = this.game.input.y;
		
		this.txt = this.game.add.text(this.x + 3, this.y + 3, "");
		this.txt.font = "Courier New";
		this.txt.fontSize = "10";
		
		this.width = this.txt.width + 3;
		this.height = this.txt.height + 3;
		
		this.group.add(this.box);
		this.group.add(this.txt);
	}
	
	draw() {
		this.txt.text = "Usage: " + this.os.appropriateSize(this.folder.usage());
		
		this.width = this.txt.width + 10;
		this.height = this.txt.height + 7;
		this.x = this.game.input.x - this.width;
		this.y = this.game.input.y - this.height - 10;
		if (this.x < 0) {
			this.x = this.game.input.x;
		}
		if (this.y < 0) {
			this.y = this.game.input.y;
		}
		this.txt.x = this.x + 5;
		this.txt.y = this.y + 5;
		
		this.box.clear();
		
		this.box.beginFill(0x000000, 1);
		this.box.drawRect(this.x, this.y, this.width, this.height);
		this.box.endFill();
		this.box.beginFill(0xffffff, 1);
		this.box.drawRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
		this.box.endFill();
	}
	
	hide() {
		this.box.clear();
	}
	
	destroy() {
		this.box.destroy();
		this.txt.destroy();
	}
}

class FolderSprite {
	constructor(folder, game, group, explorer, order) {
		this.game = game;
		this.group = group;
		this.explorer = explorer;
		this.order = order;
		this.x = this.explorer.x + this.order * 110;
		this.y = this.explorer.y + 20;
		this.width = 100;
		this.height = 100;
		
		this.folder = folder;
		
		this.usageHud = null;
		
		this.destroyed = false;
		this.clicked = false;
		this.undraggable = false;
		
		this.rec = {};
		this.rec.self = {
			x:this.x,
			y:this.y
		}
		this.rec.mouseStart = {
			x:this.game.input.x,
			y:this.game.input.y
		}
		
		this.sprite = this.game.add.sprite(this.x, this.y, "folder");
		this.sprite.inputEnabled = true;
		this.sprite.events.onInputOver.add(this.createUsageHud, this);
		this.sprite.events.onInputOut.add(this.destroyUsageHud, this);
		this.sprite.events.onInputDown.add(this.clickThis, this);
		this.sprite.events.onInputUp.add(this.releaseThis, this);
		this.sprite.cropRect = new Phaser.Rectangle(this.x, this.y, 100, 100);
		
		this.nameText = this.game.add.text(this.x + 100/2, this.y + 75, this.folder.name);
		this.nameText.font = "Courier New";
		this.nameText.fontSize = 20;
		this.nameText.x = this.x + 100/2 - this.nameText.width/2;
		
		this.nameText.wordWrap = true;
		this.nameText.wordWrapWidth = 100;
		this.nameText.align = "center";
		
		this.group.add(this.sprite);
		this.group.add(this.nameText);
		
		this.beingDragged = false;
		this.alpha = 1;
	}
	
	clickThis() {
		this.rec.self = {
			x:this.x,
			y:this.y
		}
		this.rec.mouseStart = {
			x:this.game.input.x,
			y:this.game.input.y
		}
		this.sprite.alpha = 0.5;
		this.beingDragged = true;
		
		this.explorer.bringToTop();
		
		this.sprite.bringToTop();
		this.nameText.bringToTop();
	}
	
	releaseThis() {
		this.beingDragged = false;
		if (Math.round(this.game.input.x/5) == Math.round(this.rec.mouseStart.x/5) && Math.round(this.game.input.y/5) == Math.round(this.rec.mouseStart.y/5)) {
			this.clicked = true;
		}
		else {
			if (!this.overlapOwnExplorer()) {
				if (this.overlaps(this.explorer.os.binIcon.getRect())) {
					this.folder.parentFolder.remove(this.folder);
					this.destroyed = true;
				}
			}
		}
		this.explorer.os.binIcon.sprite.alpha = 1;
	}
	
	createUsageHud() {
		this.usageHud = new UsageHud(this.game, this.group, this.folder, this.explorer.os);
	}
	
	destroyUsageHud() {
		if (this.usageHud != null) {
			this.usageHud.destroy();
			this.usageHud = null;
		}
	}
	
	createRect() {
		return new Phaser.Rectangle(this.x, this.y, 100, 100);
	}
	
	setName(name) {
		this.nameText.text = name;
	}
	
	manage() {
		if (this.beingDragged) {
			this.destroyUsageHud();
			this.alpha = 0.5;
			if (!this.undraggable) {
				this.x = this.rec.self.x + (this.game.input.x - this.rec.mouseStart.x);
				this.y = this.rec.self.y + (this.game.input.y - this.rec.mouseStart.y);
				if (this.overlaps(this.explorer.os.binIcon.getRect())) {
					this.explorer.os.binIcon.sprite.alpha = 0.5;
				}
				else {
					this.explorer.os.binIcon.sprite.alpha = 1;
				}
			}
			else {
				this.x = this.explorer.x + 4 + (this.order % this.explorer.hold.x) * 110;
				this.y = this.explorer.y + 50 + Math.floor(this.order/this.explorer.hold.x) * 110;
			}
		}
		else {
			this.alpha = 1;
			this.x = this.explorer.x + 4 + (this.order % this.explorer.hold.x) * 110;
			this.y = this.explorer.y + 50 + Math.floor(this.order/this.explorer.hold.x) * 110;
		}
		
		this.nameText.x = this.x + 100/2 - this.nameText.width/2;
		this.nameText.y = this.y + 75;
		this.sprite.x = this.x;
		this.sprite.y = this.y;
		this.nameText.alpha = this.alpha;
		this.sprite.alpha = this.alpha;
		
		
		if (Math.floor(this.order/this.explorer.hold.x) + 1 > this.explorer.hold.y) {
			this.sprite.kill();
			this.nameText.kill();
			this.destroyUsageHud();
		}
		else {
			this.sprite.revive();
			this.nameText.revive();
		}
		if (this.usageHud != null) this.usageHud.draw();
	}
	
	addToGroup(g) {
		if (this.sprite == null) return;
		this.group = g;
		g.add(this.sprite);
		g.add(this.nameText);
	}
	
	destroy() {
		this.destroyUsageHud();
		this.sprite.destroy();
		this.sprite = null;
		this.nameText.destroy();
	}
	
	overlapOwnExplorer() {
		var exRect = new Phaser.Rectangle(this.explorer.x, this.explorer.y, this.explorer.width, this.explorer.height);
		var thisRect = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
		return thisRect.intersects(exRect);
	}
	
	overlaps(rect) {
		var thisRect = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
		return thisRect.intersects(rect);
	}
}