var focusedWindow = null;

var scrollSpeed = 0;
function mouseWheel(event) {
	// if (focusedWindow != null) {
		// if (focusedWindow.destroyed) {
			// focusedWindow = null;
		// }
		// else {
			// if (game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
				// focusedWindow.scroll.y += 20;
			// }
			// else {
				// focusedWindow.scroll.y -= 20;
			// }
		// }
	// }
	if (game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
		scrollSpeed = 1;
	}
	else {
		scrollSpeed = -1;
	}
}

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
		this.height = 300;
		
		this.scroll = {
			x:0,
			y:0
		}
		
		this.destroyed = false;
		this.focused = true;
		
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
		
		this.files = this.folder.files;
		this.fileSprites = [];
		
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
		
		this.bringToTop();
		this.handleFolders();
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
			y: Math.floor((this.height-50)/140)
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
		for (var i = 0; i < this.fileSprites.length; i++) {
			this.fileSprites[i].addToGroup(this.group);
		}
		if (this.parentFolderSprite != null) this.parentFolderSprite.addToGroup(this.group);
		
		this.focused = true;
		focusedWindow = this;
	}
	
	click() {
		this.focused = false;
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
			this.focused = true;
		}
		
		var xBtn = new Phaser.Rectangle(this.x + this.width - 28, this.y + 2, 26, 18);
		if (Phaser.Rectangle.contains(xBtn, this.game.input.x, this.game.input.y)) {
			this.destroyed = true;
		}
		
		var resizeBox = {
			left: new Phaser.Rectangle(this.x-2, this.y-2, 4, this.height+4),
			right: new Phaser.Rectangle(this.x+this.width-2, this.y-2, 4, this.height+4),
			up: new Phaser.Rectangle(this.x-2, this.y-2, this.width+4, 4),
			down: new Phaser.Rectangle(this.x-2,this.y+this.height-2,this.width+4, 4)
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
			this.focused = true;
			this.bringToTop();
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
			this.focused = true;
			this.bringToTop();
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
			this.focused = true;
			this.bringToTop();
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
			this.focused = true;
			this.bringToTop();
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
			this.folderSprites[i].order = curOrderOffset;
			curOrderOffset += 1;
			this.folderSprites[i].manage();
			if (this.folderSprites[i].clicked) {
				var ne = this.os.createExplorer(this.x, this.y, this.folderSprites[i].folder);
				ne.width = this.width;
				ne.height = this.height;
				ne.cutCurFolderText();
				this.destroyed = true;
				return;
			}
			if (this.folderSprites[i].destroyed || this.folderSprites[i].folder.destroyed || this.folderSprites[i].folder.parentFolder == null || this.folderSprites[i].folder.parentFolder.id != this.folder.id) {
				this.folderSprites[i].destroy();
				this.folderSprites.splice(i, 1);
				i--;
				curOrderOffset -= 1;
			}
		}
		
		for (var i = 0; i < this.files.length; i++) {
			if (!this.alreadyMadeFile(this.files[i])) {
				if (this.files[i] instanceof Virus) {
					this.createVirusSprite(this.files[i]);
				}
				else if (this.files[i] instanceof TextFile) {
					this.createTextFileSprite(this.files[i]);
				}
			}
		}
		
		for (var i = 0; i < this.fileSprites.length; i++) {
			var curFile = this.fileSprites[i];
			curFile.order = curOrderOffset;
			curOrderOffset += 1;
			curFile.manage();
			if (curFile.destroyed || curFile.file.folder.id != this.folder.id || curFile.file.destroyed) {
				curFile.destroy();
				this.fileSprites.splice(i, 1);
				i--;
				curOrderOffset -= 1;
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
	
	createVirusSprite(virus) {
		this.fileSprites.push(new VirusSprite(
			virus,
			this.game,
			this.group,
			this,
			this.fileSprites.length + this.folderSprites.length
		));
	}
	
	createTextFileSprite(file) {
		this.fileSprites.push(new TextFileSprite(
			file,
			this.game,
			this.group,
			this,
			this.fileSprites.length + this.folderSprites.length
		));
	}
	
	alreadyMadeFile(file) {
		for (var i = 0; i < this.fileSprites.length; i++) {
			if (this.fileSprites[i].file.id == file.id) {
				return true;
			}
		}
		return false;
	}
	
	draw() {
		this.w.clear();
		
		this.w.beginFill(0x000000, 0.1);
		this.w.drawRect(this.x + 10, this.y + 10, this.width, this.height);
		this.w.endFill();
		
		this.w.beginFill(0xffffff, 1);
		this.w.drawRect(this.x, this.y, this.width, this.height);
		this.w.endFill();
		
		this.w.beginFill(0x2169dd, 1);
		this.w.drawRect(this.x, this.y, this.width, 20);
		this.w.endFill();
		
		this.w.beginFill(0xff6868, 1);
		this.w.drawRect(this.x + this.width - 30, this.y, 30, 20);
		this.w.endFill();
		
		var num = (Math.floor((this.folderSprites.length + this.fileSprites.length)/this.hold.x) * 120);
		if (this.fileSprites.length > 0) {
			num = (Math.floor((this.fileSprites.length + this.folderSprites.length)/this.hold.x) * 120);
		}
		
		var barHeight = ((this.height - 20) / ((this.folderSprites.length + this.fileSprites.length)/this.hold.x));
		var barY = this.y + 20;
		barY = barY + ((this.height-20-barHeight) * ((-this.scroll.y) / num));
		if (num > 0) {
			this.w.beginFill(0xdddddd, 1);
			this.w.drawRect(this.x + this.width - 7,  barY, 7, barHeight);
			this.w.endFill();
		}
		
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
	
	destroyFileSprites() {
		for (var i = 0; i < this.fileSprites.length; i++) {
			this.fileSprites[i].destroy();
		}
	}
	
	destroy() {
		this.w.destroy();
		this.game.input.onDown.remove(this.click);
		this.game.input.onUp.remove(this.release);
		this.destroyFolderSprites();
		this.destroyFileSprites();
		if (this.parentFolderSprite != null) {
			this.parentFolderSprite.destroy();
		}
		this.curFolder.destroy();
	}
	
	run() {
		let windowRect = new Phaser.Rectangle(this.x, this.y + 20, this.width, this.height - 20);
		if (Phaser.Rectangle.contains(windowRect, this.game.input.x, this.game.input.y)) {
			this.scroll.y += scrollSpeed * 20;
		}
		
		this.hold = this.getHold();
		
		if (!this.destroyed) {
			
			var num = -(Math.floor((this.folderSprites.length-1)/this.hold.x) * 120);
			if (this.fileSprites.length > 0) {
				num = -(Math.floor((this.fileSprites.length + this.folderSprites.length - 2)/this.hold.x) * 120);
			}
			if (this.scroll.y < num) {
				this.scroll.y = num;
			}
			if (this.scroll.y > 0) {
				this.scroll.y = 0;
			}
		}
		
		this.drag();
		this.draw();
		this.handleFolders();
		this.curFolder.x = this.x + 10;
		this.curFolder.y = this.y + 25;
	}
}

class SystemWindow {
	constructor(game, x, y, os) {
		this.game = game;
		this.os = os;
		
		this.x = x;
		this.y = y;
		
		this.group = this.game.add.group();
		
		this.w = game.add.graphics();
		this.group.add(this.w);
		
		this.destroyed = false;
		
		this.width = 400;
		this.height = 300;
		
		this.rec = {};
		this.rec.mouseStart = {
			x:this.game.input.x,
			y:this.game.input,y
		}
		this.rec.self = {
			x:this.x,
			y:this.y
		}
		
		this.game.input.onDown.add(this.click, this);
		this.game.input.onUp.add(this.release, this);
		
		this.scroll = {
			x:0,
			y:0
		}
		
		this.txt = this.game.add.text(this.x + 20, this.y + 30, "");
		this.txt.font = "Courier New";
		this.txt.fontSize = 20;
		this.txt.wordWrap = true;
		this.txt.wordWrapWidth = this.width - 40;
		this.group.add(this.txt);
	}
	
	click() {
		this.focused = false;
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
			this.focused = true;
		}
		
		var xBtn = new Phaser.Rectangle(this.x + this.width - 28, this.y + 2, 26, 18);
		if (Phaser.Rectangle.contains(xBtn, this.game.input.x, this.game.input.y)) {
			this.destroyed = true;
		}
	}
	
	release() {
		this.beingDragged = false;
	}
	
	bringToTop() {
		this.group = this.game.add.group();
		this.group.add(this.w);
		this.group.add(this.txt);
		
		this.focused = true;
		focusedWindow = this;
	}
	
	draw() {
		this.w.clear();
		
		this.w.beginFill(0x000000, 0.1);
		this.w.drawRect(this.x + 10, this.y + 10, this.width, this.height);
		this.w.endFill();
		
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
	
	handleText() {
		this.txt.x = this.x + 20;
		this.txt.y = this.y + 30;
		this.txt.text = "System Information\n\n";
		this.txt.text += "Hard Disk Space Used: \n" + this.os.appropriateSize(this.os.getSpaceUsed()) + " / " + this.os.appropriateSize(this.os.maxSpace) + "\n";
		this.txt.text += "Hard Disk Space Available: \n" + this.os.appropriateSize(this.os.getSpaceLeft()) + "\n\n";
		this.txt.text += "Time: " + this.os.timer.h + "h " + this.os.timer.m + "m " + this.os.timer.s + "s ";
	}
	
	drag() {
		if (this.beingDragged) {
			this.x = this.rec.self.x + (this.game.input.x - this.rec.mouseStart.x);
			this.y = this.rec.self.y + (this.game.input.y - this.rec.mouseStart.y);
		}
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		if (this.x + this.width > this.game.width) this.x = this.game.width - this.width;
		if (this.y + 25 > this.game.height) this.y = this.game.height - 25;
	}
	
	destroy() {
		this.w.destroy();
		this.txt.destroy();
	}
	
	run() {
		this.drag();
		this.handleText();
		this.draw();
	}
}



class TxtWindow {
	constructor(game, x, y, os, t) {
		this.game = game;
		this.os = os;
		
		this.x = x;
		this.y = y;
		
		this.group = this.game.add.group();
		
		this.w = game.add.graphics();
		this.group.add(this.w);
		
		this.destroyed = false;
		
		this.width = 400;
		this.height = 350;
		
		this.rec = {};
		this.rec.mouseStart = {
			x:this.game.input.x,
			y:this.game.input,y
		}
		this.rec.self = {
			x:this.x,
			y:this.y
		}
		
		this.game.input.onDown.add(this.click, this);
		this.game.input.onUp.add(this.release, this);
		
		this.scroll = {
			x:0,
			y:0
		}
		
		this.text = t;
		
		this.txt = this.game.add.text(this.x + 20, this.y + 30, this.text);
		this.txt.font = "Courier New";
		this.txt.fontSize = 20;
		this.txt.wordWrap = true;
		this.txt.wordWrapWidth = this.width - 40;
		this.group.add(this.txt);
	}
	
	setText(txt) {
		this.text = txt;
		this.txt.text = this.text;
	}
	
	click() {
		this.focused = false;
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
			this.focused = true;
		}
		
		var xBtn = new Phaser.Rectangle(this.x + this.width - 28, this.y + 2, 26, 18);
		if (Phaser.Rectangle.contains(xBtn, this.game.input.x, this.game.input.y)) {
			this.destroyed = true;
		}
	}
	
	release() {
		this.beingDragged = false;
	}
	
	bringToTop() {
		this.group = this.game.add.group();
		this.group.add(this.w);
		this.group.add(this.txt);
		
		this.focused = true;
		focusedWindow = this;
	}
	
	draw() {
		this.w.clear();
		
		this.w.beginFill(0x000000, 0.1);
		this.w.drawRect(this.x + 10, this.y + 10, this.width, this.height);
		this.w.endFill();
		
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
	
	handleText() {
		this.txt.x = this.x + 20;
		this.txt.y = this.y + 30;
	}
	
	drag() {
		if (this.beingDragged) {
			this.x = this.rec.self.x + (this.game.input.x - this.rec.mouseStart.x);
			this.y = this.rec.self.y + (this.game.input.y - this.rec.mouseStart.y);
		}
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		if (this.x + this.width > this.game.width) this.x = this.game.width - this.width;
		if (this.y + 25 > this.game.height) this.y = this.game.height - 25;
	}
	
	destroy() {
		this.w.destroy();
		this.txt.destroy();
	}
	
	run() {
		this.drag();
		this.handleText();
		this.draw();
	}
}