var folderNames = ["Hello", "Goodbye", "Japan", "hent@i", "p0rn", "roms", "movies", "games", "stash", "bank details", "pictures", "videos", "Documents", "Program Files", "System32"]
class OS {
	constructor(game) {
		this.game = game;
		this.windows = [];
		this.rootFolder = new Folder("User", null);
		this.createRandomFolderStructure();
		
		this.bg = this.game.add.group();
		this.desktop = [];
		
		this.binIcon = this.createDesktopIcon("Bin", 20, 20, "bin");
		
		this.fileExplorerIcon = this.createDesktopIcon("File Explorer",  20, 20 + 110, "folder");
		this.fileExplorerIcon.os = this;
		this.fileExplorerIcon.setTask(function(){
			this.os.createExplorer(50, 50, this.os.rootFolder);
		});
	}
	
	createDesktopIcon(name, x, y, img) {
		var di = new DesktopIcon(
			this.game,
			x,
			y,
			name,
			img,
			this.bg
		)
		this.desktop.push(di);
		return di;
	}
	
	createExplorer(x, y, folder) {
		var ne = new Explorer(this.game, x, y, folder, this)
		this.windows.push(ne);
		return ne;
	}
	
	createRandomFolderStructure() {
		for (var i = 0; i < 10; i++) {
			var loc = this.getRandomFolder();
			var newFolder = new Folder(this.randomFolderName(), loc);
		}
	}
	
	getRandomFolder() {
		var curFolder = this.rootFolder;
		var done = false;
		while(!done) {
			if (curFolder.children.length <= 0) {
				done = true;
			}
			else if (Math.random() > 0.5) {
				done = true;
			}
			else {
				curFolder = this.rootFolder.children[Math.floor(Math.random() * this.rootFolder.children.length)];
			}
		}
		console.log(curFolder.name);
		return curFolder;
	}
	
	randomFolderName() {
		return folderNames[Math.floor(Math.random() * folderNames.length)];
	}
	
	appropriateSize(size) {
		if (size < 1000) {
			return size.toString() + " B";
		}
		
		if (size < 1000^2) {
			return Math.floor(size / 1000).toString() + " KB";
		}
		
		if (size < 1000^3) {
			return Math.floor(size / 1000^2).toString() + " MB";
		}
	}
	
	run() {
		this.game.canvas.style.cursor = "default";
		for (var i = 0; i < this.windows.length; i++) {
			this.windows[i].run();
			if (this.windows[i].destroyed) {
				this.windows[i].destroy();
				this.windows.splice(i, 1);
				i--;
			}
		}
	}
}


class DesktopIcon {
	constructor(game, x, y, name, img, group) {
		this.game = game;
		this.group = group;
		
		this.x = x;
		this.y = y;
		
		this.sprite = this.game.add.sprite(x, y, img);
		this.sprite.inputEnabled = true;
		
		this.nameText = this.game.add.text(this.x + 100/2, this.y + 75, name);
		this.nameText.font = "Courier New";
		this.nameText.fontSize = 20;
		
		this.nameText.wordWrap = true;
		this.nameText.wordWrapWidth = 100;
		this.nameText.align = "center";
		this.nameText.x = this.x + 100/2 - this.nameText.width/2;
		
		this.group.add(this.sprite);
		this.group.add(this.nameText);
		
		this.func = null;
	}
	
	setTask(func) {
		this.func = func;
		this.sprite.events.onInputDown.add(this.func, this);
	}
	
	getRect() {
		return new Phaser.Rectangle(this.x, this.y, 100, 100);
	}
}