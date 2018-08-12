
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
		this.txt.fontSize = 20;
		
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

class FileUsageHud {
	constructor(game, group, file, os) {
		this.game = game;
		this.file = file;
		this.os = os;
		this.group = group;
		
		this.box = this.game.add.graphics();
		this.width = 200;
		this.height = 50;
		this.x = this.game.input.x;
		this.y = this.game.input.y;
		
		this.txt = this.game.add.text(this.x + 3, this.y + 3, "");
		this.txt.font = "Courier New";
		this.txt.fontSize = 20;
		
		this.width = this.txt.width + 3;
		this.height = this.txt.height + 3;
		
		this.group.add(this.box);
		this.group.add(this.txt);
	}
	
	draw() {
		this.txt.text = "Size: " + this.os.appropriateSize(this.file.size);
		
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
					music.computerWorld.pause();
					alert("Unable to delete folder. (Dev Note: Deleting folders is cheating.)");
					music.computerWorld.play();
				}
			}
			else if (!this.undraggable) {
				let cancel = false;
				for (var i = 0; i < this.explorer.folderSprites.length; i++) {
					let f = this.explorer.folderSprites[i];
					f.sprite.alpha = 1;
					f.alpha = 1;
					if (!cancel) {
						if (f.folder.id != this.folder.id && this.overlaps(f.createRect())) {
							this.folder.parentFolder.remove(this.folder);
							f.folder.add(this.folder);
							this.destroyed = true;
							console.log(this.folder.name + " moved to " + this.folder.parentFolder.getPath());
							cancel = true;
						}
					}
				}
				if (this.explorer.parentFolderSprite != null) {
					this.explorer.parentFolderSprite.alpha = 1;
					this.explorer.parentFolderSprite.sprite.alpha = 1;
					if (!cancel && this.overlaps(this.explorer.parentFolderSprite.createRect())) {
						this.folder.parentFolder.remove(this.folder);
						this.explorer.parentFolderSprite.folder.add(this.folder);
						this.destroyed = true;
						console.log(this.folder.name + " moved to " + this.folder.parentFolder.getPath());
					}
				}
			}
		}
		this.explorer.os.binIcon.sprite.alpha = 1;
		this.alpha = 1;
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
		if (this.destroyed) return;
		if (this.beingDragged) {
			this.destroyUsageHud();
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
				this.x = this.explorer.x + 10 + (this.order % this.explorer.hold.x) * 110 + this.explorer.scroll.x;
				this.y = this.explorer.y + 50 + Math.floor(this.order/this.explorer.hold.x) * 125 + this.explorer.scroll.y;
			}
			
			let cancel = false;
			for (var i = 0; i < this.explorer.folderSprites.length; i++) {
				let f = this.explorer.folderSprites[i];
				f.alpha = 1;
				f.sprite.alpha = 1;
				if (f.folder.id != this.folder.id && !cancel && this.overlaps(f.createRect())) {
					f.alpha = 0.5;
					f.sprite.alpha = 0.5;
					cancel = true;
				}
			}
			if (this.explorer.parentFolderSprite != null) {
				this.explorer.parentFolderSprite.alpha = 1;
				this.explorer.parentFolderSprite.sprite.alpha = 1;
				if (!cancel && this.overlaps(this.explorer.parentFolderSprite.createRect())) {
					this.explorer.parentFolderSprite.alpha = 0.5;
					this.explorer.parentFolderSprite.sprite.alpha = 0.5;
				}
			}
			this.alpha = 0.5;
		}
		else {
			this.x = this.explorer.x + 10 + (this.order % this.explorer.hold.x) * 110 + this.explorer.scroll.x;
			this.y = this.explorer.y + 50 + Math.floor(this.order/this.explorer.hold.x) * 125 + this.explorer.scroll.y;
		}
		
		this.nameText.x = this.x + 100/2 - this.nameText.width/2;
		this.nameText.y = this.y + 75;
		this.sprite.x = this.x;
		this.sprite.y = this.y;
		this.nameText.alpha = this.alpha;
		this.sprite.alpha = this.alpha;
		
		
		if ((this.y + this.height + 20 > this.explorer.y + this.explorer.height || this.y < this.explorer.y + 30) && ((this.undraggable || !this.beingDragged))) {
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

class VirusSprite {
	constructor(virus, game, group, explorer, order) {
		this.game = game;
		this.group = group;
		this.explorer = explorer;
		this.order = order;
		this.x = this.explorer.x + this.order * 110;
		this.y = this.explorer.y + 20;
		this.width = 100;
		this.height = 100;
		
		this.file = virus;
		
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
		
		this.sprite = this.game.add.sprite(this.x, this.y, "viruses");
		this.sprite.animations.frame = this.file.type;
		
		this.sprite.inputEnabled = true;
		this.sprite.events.onInputOver.add(this.createUsageHud, this);
		this.sprite.events.onInputOut.add(this.destroyUsageHud, this);
		this.sprite.events.onInputDown.add(this.clickThis, this);
		this.sprite.events.onInputUp.add(this.releaseThis, this);
		
		this.nameText = this.game.add.text(this.x + 100/2, this.y + 75, this.file.name + ".vir");
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
					this.file.destroy();
					this.destroyed = true;
					sfx.zap1.play();
				}
			}
		}
		this.explorer.os.binIcon.sprite.alpha = 1;
	}
	
	createUsageHud() {
		this.usageHud = new FileUsageHud(this.game, this.group, this.file, this.explorer.os);
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
			this.x = this.rec.self.x + (this.game.input.x - this.rec.mouseStart.x);
			this.y = this.rec.self.y + (this.game.input.y - this.rec.mouseStart.y);
			if (this.overlaps(this.explorer.os.binIcon.getRect())) {
				this.explorer.os.binIcon.sprite.alpha = 0.5;
			}
			else {
				this.explorer.os.binIcon.sprite.alpha = 1;
			}
			this.alpha = 0.5;
		}
		else {
			this.alpha = 1;
			this.x = this.explorer.x + 10 + (this.order % this.explorer.hold.x) * 110 + this.explorer.scroll.x;
			this.y = this.explorer.y + 50 + Math.floor(this.order/this.explorer.hold.x) * 125 + this.explorer.scroll.y;
		}
		
		this.nameText.x = this.x + 100/2 - this.nameText.width/2;
		this.nameText.y = this.y + 75;
		this.sprite.x = this.x + Math.round(Math.random() * 3);
		this.sprite.y = this.y + Math.round(Math.random() * 3);
		this.nameText.alpha = this.alpha;
		this.sprite.alpha = this.alpha;
		
		
		if ((this.y + this.height + 20 > this.explorer.y + this.explorer.height || this.y < this.explorer.y + 30) && !this.beingDragged) {
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

class TextFileSprite {
	constructor(virus, game, group, explorer, order) {
		this.game = game;
		this.group = group;
		this.explorer = explorer;
		this.order = order;
		this.x = this.explorer.x + this.order * 110;
		this.y = this.explorer.y + 20;
		this.width = 100;
		this.height = 100;
		
		this.file = virus;
		
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
		
		this.sprite = this.game.add.sprite(this.x, this.y, "txt");
		this.sprite.animations.frame = this.file.type;
		
		this.sprite.inputEnabled = true;
		this.sprite.events.onInputOver.add(this.createUsageHud, this);
		this.sprite.events.onInputOut.add(this.destroyUsageHud, this);
		this.sprite.events.onInputDown.add(this.clickThis, this);
		this.sprite.events.onInputUp.add(this.releaseThis, this);
		
		this.nameText = this.game.add.text(this.x + 100/2, this.y + 75, this.file.name);
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
			this.explorer.os.createTxtWindow(Math.round(Math.random() * 400) - 200/2 - 400/2, Math.round(Math.random() * 400) - 200/2 - 400/2, this.file.text);
		}
		else {
			if (!this.overlapOwnExplorer()) {
				if (this.overlaps(this.explorer.os.binIcon.getRect())) {
					this.file.destroy();
					this.destroyed = true;
					sfx.trash.play();
				}
			}
			else {
				let cancel = false;
				for (var i = 0; i < this.explorer.folderSprites.length; i++) {
					let f = this.explorer.folderSprites[i];
					f.alpha = 1;
					f.sprite.alpha = 1;
					if (!cancel && this.overlaps(f.createRect())) {
						this.file.folder.removeFile(this.file);
						f.folder.addFile(this.file);
						this.file.folder = f.folder;
						cancel = true;
						this.destroyed = true;
						console.log(this.file.folder.name);
					}
				}
				if (this.explorer.parentFolderSprite != null) {
					this.explorer.parentFolderSprite.alpha = 1;
					this.explorer.parentFolderSprite.sprite.alpha = 1;
					if (!cancel && this.overlaps(this.explorer.parentFolderSprite.createRect())) {
						this.file.folder.removeFile(this.file);
						this.explorer.parentFolderSprite.folder.addFile(this.file);
						this.file.folder = this.explorer.parentFolderSprite.folder;
						this.destroyed = true;
					}
				}
			}
		}
		this.explorer.os.binIcon.sprite.alpha = 1;
	}
	
	createUsageHud() {
		this.usageHud = new FileUsageHud(this.game, this.group, this.file, this.explorer.os);
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
			this.x = this.rec.self.x + (this.game.input.x - this.rec.mouseStart.x);
			this.y = this.rec.self.y + (this.game.input.y - this.rec.mouseStart.y);
			if (this.overlaps(this.explorer.os.binIcon.getRect())) {
				this.explorer.os.binIcon.sprite.alpha = 0.5;
			}
			else {
				this.explorer.os.binIcon.sprite.alpha = 1;
			}
			
			let cancel = false;
			for (var i = 0; i < this.explorer.folderSprites.length; i++) {
				let f = this.explorer.folderSprites[i];
				f.alpha = 1;
				f.sprite.alpha = 1;
				if (!cancel && this.overlaps(f.createRect())) {
					f.alpha = 0.5;
					f.sprite.alpha = 0.5;
					cancel = true;
				}
			}
			if (this.explorer.parentFolderSprite != null) {
				this.explorer.parentFolderSprite.alpha = 1;
				this.explorer.parentFolderSprite.sprite.alpha = 1;
				if (!cancel && this.overlaps(this.explorer.parentFolderSprite.createRect())) {
					this.explorer.parentFolderSprite.alpha = 0.5;
					this.explorer.parentFolderSprite.sprite.alpha = 0.5;
				}
			}
			this.alpha = 0.5;
		}
		else {
			this.alpha = 1;
			this.x = this.explorer.x + 10 + (this.order % this.explorer.hold.x) * 110 + this.explorer.scroll.x;
			this.y = this.explorer.y + 50 + Math.floor(this.order/this.explorer.hold.x) * 125 + this.explorer.scroll.y;
		}
		
		this.nameText.x = this.x + 100/2 - this.nameText.width/2;
		this.nameText.y = this.y + 75;
		this.sprite.x = this.x;
		this.sprite.y = this.y;
		this.nameText.alpha = this.alpha;
		this.sprite.alpha = this.alpha;
		
		if ((this.y + this.height + 20 > this.explorer.y + this.explorer.height || this.y < this.explorer.y + 30) && !this.beingDragged) {
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