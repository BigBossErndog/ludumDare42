class OS {
	constructor(game) {
		this.game = game;
		this.windows = [];
		this.rootFolder = new Folder("User", null);
		this.createRandomFolderStructure();
		
		this.desktop = [];
		
		this.osGroup = this.game.add.group();
		this.binIcon = this.createDesktopIcon("Bin", 30, 30, "bin", this.osGroup);
		
		this.fileExplorerIcon = this.createDesktopIcon("File Explorer", 30, 30 + 130, "folder", this.osGroup);
		this.fileExplorerIcon.os = this;
		this.fileExplorerIcon.setTask(function(){
			this.os.createExplorer(this.game.width/2 + Math.round(Math.random() * 400) - 200 - 400/2, this.game.height/2 + Math.round(Math.random() * 400) - 200 - 300/2, this.os.rootFolder);
		});
		
		this.files = [];
		
		this.counter = 0;
		this.virusSpawnRate = 10 * 60;
		this.virusStartSize = 10;
		this.virusStartSpeed = 30;
		this.virusSpawnNumber = 1;
		this.cycles = 0;
		
		this.counter2 = 0;
		
		this.systemIcon = this.createDesktopIcon("System", 30, 40 + 130*2, "system", this.osGroup);
		this.systemIcon.os = this;
		this.systemIcon.setTask(function() {
			this.os.createSystemWindow(this.game.width/2 + Math.round(Math.random() * 200) - 100 - 400/2, this.game.height/2 + Math.round(Math.random() * 200) - 100 - 300/2);
		});
		
		this.readmeIcon = this.createDesktopIcon("README.txt", 30, 30 + 130*3, "txt", this.osGroup);
		this.readmeIcon.os = this;
		this.readmeIcon.setTask(function() {
			this.os.createTxtWindow(Math.round(Math.random() * 400) -200 - 200/2 + this.game.width/2, Math.round(Math.random() * 400) - 200 - 300/2 + this.game.height/2, "\
README\n\
This PC is under attack by viruses.\n\
They appear and spread randomly throughout the system.\n\
Destroy them in the bin.\n\
If you run out of hard disk space all the important data will be lost forever. Stop them at all costs.\
");
		});
		this.timer = {
			c:0,
			s:0,
			m:0,
			h:0
		}
		
		this.maxSpace = Math.pow(1000, 3) * 2;
		this.eventCounter = 0;
		
		this.createTextFile("ninja", "This story was about a ninja that went around interacting with other characters in a virtual world. It was a childish but a lot of fun to make.");
		
		this.createTextFile("chicken", "This was about a chicken who became the science experiment of a scientist who turned him into a mutant anthropomorphic chicken and saved the world.");
		
		this.createTextFile("chess piece", "This was an edgy political story about war. Never finished it.");
		
		this.createTextFile("flipnote", "Making animations was a lot of fun, the ds is probably still my favorite gaming console to date.");
		
		this.createTextFile("pokemon", "Pokemon is great. A fun, friendly and somewhat familiarly realistic world with monsters and ancient lore. I love exploring these worlds.");
		
		this.createTextFile("twitch", "Twitch is fun, I like twitch.");
		
		this.createTextFile("game dev", "I've spent way too much time making games but never actually finishing. Ludum Dare actually forced me to finish one.");
		
		this.createTextFile("ninja parkour", "it was popular to so I made it again and again cos why not. ninjas are cool.");
		
		this.createTextFile("ludum dare", "This is my first Ludum Dare entry, it was a lot of fun");
		
		this.createTextFile("compsci", "Didn't know what to do so I chose compsci cos it's a degree remotely related to game dev that would satisfy my parents. College is still fun tho.");
		
		this.createTextFile("okay", "kay I'm actually really tired now, just gonna keep adding random text talking about myself cos why not.")
		
		this.createTextFile("gaming", "I don't wanna stop gaming");
		
		this.createTextFile("macncheese", "I like mac and cheese, it's not my favorite food tho.");
		
	}
	
	getSpaceLeft() {
		return this.maxSpace - this.rootFolder.usage();
	}
	
	getSpaceUsed() {
		return this.rootFolder.usage();
	}
	
	createDesktopIcon(name, x, y, img, group) {
		var di = new DesktopIcon(
			this.game,
			x,
			y,
			name,
			img,
			group
		)
		this.desktop.push(di);
		return di;
	}
	
	createExplorer(x, y, folder) {
		var ne = new Explorer(this.game, x, y, folder, this)
		this.windows.push(ne);
		return ne;
	}
	
	createSystemWindow(x, y) {
		var nsw = new SystemWindow(this.game, x, y, this);
		this.windows.push(nsw);
		return nsw;
	}
	
	createTxtWindow(x, y, txt) {
		var ntw = new TxtWindow(this.game, x, y, this, txt);
		this.windows.push(ntw);
		return ntw;
	}
	
	createVirus(loc, type) {
		var newVirus = new Virus(
			loc, 
			this.virusStartSize,
			this.virusStartSpeed,
			type
		);
		this.files.push(newVirus);
	}
	
	createTextFile(name, txt, infected) {
		this.files.push(new TextFile(this.getRandomFolder(), name, txt, infected));
	}
	
	createRandomFolderStructure() {
		for (var i = 0; i < 50; i++) {
			var loc = this.getRandomFolder();
			while (loc.children.length > 9) {
				loc = this.getRandomFolder();
			}
			var newFolder = new Folder(this.randomFolderName(), loc);
		}
	}
	
	getRandomFolder() {
		var curFolder = this.rootFolder;
		var done = false;
		while(!done) {
			var rand = Math.random();
			if (curFolder.children.length <= 0) {
				done = true;
			}
			else if (rand < 0.3 && curFolder.children.length < 9) {
				done = true;
			}
			else {
				curFolder = curFolder.children[Math.floor(Math.random() * curFolder.children.length)];
			}
		}
		return curFolder;
	}
	
	randomFolderName() {
		return folderNames[Math.floor(Math.random() * folderNames.length)];
	}
	
	appropriateSize(size) {
		if (size < 1000) {
			return size.toString() + " B";
		}
		
		if (size < Math.pow(1000, 2)) {
			return (size / 1000).toFixed(2).toString() + " KB";
		}
		
		if (size < Math.pow(1000,3)) {
			return (size / Math.pow(1000,2)).toFixed(2).toString() + " MB";
		}
		
		return (size / Math.pow(1000,3)).toFixed(2).toString() + " GB";
	}
	
	handleFiles() {
		for (var i = 0; i < this.files.length; i++) {
			if (this.files[i] instanceof Virus) this.files[i].run(this);
			if (this.files[i].destroyed) {
				this.files[i].folder.removeFile(this.files[i]);
				this.files.splice(i, 1);
				i--;
			}
		}
	}
	
	performEvent() {
		var chance = Math.floor(Math.random() * 10);
		switch (chance) {
			case 0:
				for (var i = 0; i < 3; i++) {
					this.createTxtWindow(Math.round(Math.random() * 400) -200 - 300/2 + this.game.width/2, Math.round(Math.random() * 400) - 200 - 300/2 + this.game.height/2, "get rekt");
				}
				sfx.error.play();
				break;
			case 1:
				this.createTxtWindow(Math.round(Math.random() * 400) -200 - 200/2 + this.game.width/2, Math.round(Math.random() * 400) - 200 - 200/2 + this.game.height/2, "YOU BETTER GET IT COMPLETE");
				sfx.error.play();
				break;
			case 2:
				this.createTxtWindow(Math.round(Math.random() * 400) -200 - 200/2 + this.game.width/2, Math.round(Math.random() * 400) - 200 - 200/2 + this.game.height/2, "YOU ARE RESPONSIBLE FOR EVERYTHING");
				sfx.error.play();
				break;
			case 3:
				this.createTxtWindow(Math.round(Math.random() * 400) -200 - 200/2 + this.game.width/2, Math.round(Math.random() * 400) - 200 - 200/2 + this.game.height/2, "don't let them down");
				sfx.error.play();
				break;
			case 4:
				this.createTxtWindow(Math.round(Math.random() * 400) -200 - 200/2 + this.game.width/2, Math.round(Math.random() * 400) - 200 - 200/2 + this.game.height/2, "I WANT MORE");
				sfx.error.play();
				break;
			case 5:
				this.createTxtWindow(Math.round(Math.random() * 400) -200 - 200/2 + this.game.width/2, Math.round(Math.random() * 400) - 200 - 200/2 + this.game.height/2, "DON'T STOP NOW");
				sfx.error.play();
				break;
			case 6:
				this.createTxtWindow(Math.round(Math.random() * 400) -200 - 200/2 + this.game.width/2, Math.round(Math.random() * 400) - 200 - 200/2 + this.game.height/2, "you can't do it");
				sfx.error.play();
				break;
		}
	}
	
	run() {
		this.counter += 1;
		
		this.game.canvas.style.cursor = "default";
		for (var i = 0; i < this.windows.length; i++) {
			this.windows[i].run();
			if (this.windows[i].destroyed) {
				this.windows[i].destroy();
				this.windows.splice(i, 1);
				i--;
			}
		}
		
		this.handleFiles();
		
		if (this.counter >= this.virusSpawnRate) {
			this.counter = 0;
			for (var i = 0; i < this.virusSpawnNumber; i++) {
				this.createVirus(this.getRandomFolder(), Math.floor(Math.random() * 8));
			}
			this.virusStartSize += 1;
			this.virusStartSize = Math.ceil(this.virusStartSize * 1.5);
			if (this.virusSpawnRate > 0) this.virusSpawnRate -= 2;
			this.cycles += 1;
			if (this.cycles == 10 + this.virusSpawnNumber) {
				this.cycles = 0;
				this.virusSpawnNumber += 1;
			}
		}
		
		if (this.rootFolder.usage() > this.maxSpace) {
			music.computerWorld.stop();
			playerScore = this.timer;
			this.game.state.start("gameOver", true);
		}
		
		this.timer.c += 1;
		if (this.timer.c == 60) {
			this.timer.c = 0;
			this.timer.s += 1;
			if (this.timer.s == 60) {
				this.timer.s = 0;
				this.timer.m += 1;
				if (this.timer.m == 60) {
					this.timer.m = 0;
					this.timer.h += 1;
				}
			}
		}
		
		this.eventCounter += 1;
		if (this.eventCounter == 30 * 60) {
			this.performEvent();
			this.eventCounter = 0;
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
		this.nameText.addColor("#ffffff", 0);
		
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