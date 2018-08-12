var virusNames = ["bob", "sanic", "virus", "kappa", "trojan", "monika", "mario", "zelda", "pokemon", "love", "money", "p0rn", "mom", "daddy", "big daddy", "despacito2", "bigboi", "mommy", "$$$", "freeMoney", "butt", "ninja", "fan", "college"];
class Virus {
	constructor(loc, startSize, speed, type) {
		this.id = Math.random();
		this.size = startSize;
		this.counter = 0;
		this.counter2 = 0;
		this.actionCounter = 0;
		this.actionSpeed = 5 * 60;
		
		this.folder = loc;
		this.folder.addFile(this);
		
		this.destroyed = false;
		
		this.growthSpeed = speed;
		this.movementSpeed = Math.floor((5 + Math.random()*10) * 60);
		
		this.age = 1;
		
		this.type = type;
		
		this.name = virusNames[Math.floor(Math.random() * virusNames.length)];
	}
	
	run(os) {
		this.counter += 1;
		
		if (this.counter >= this.growthSpeed) {
			this.size += 1;
			this.size = Math.ceil(this.size * 1.1);
			this.counter = 0;
			this.age += 1;
		}
		
		this.counter2 += 1;
		if (this.counter2 >= this.movementSpeed) {
			this.counter2 = 0;
			this.movementSpeed = Math.floor((5 + Math.random()*10) * 60);
			if (Math.random() > 0.5) {
				if (this.folder.children.length == 0) {
					this.moveUp();
				}
				else {
					this.moveDown();
				}
			}
			else if (this.folder.parentFolder == null) {
				this.moveDown();
			}
			else {
				this.moveUp();
			}
			console.log("Virus moved to: " + this.folder.getPath());
		}
		
		this.actionCounter += 1;
		if (this.actionCounter == this.actionSpeed) {
			this.actionCounter = 0;
			this.performAction(os);
		}
	}
	
	performAction(os) {
		var chance = Math.floor(Math.random() * 500);
		switch (chance) {
			case 0:
				os.createTxtWindow(Math.round(Math.random() * 500) -250 - 200/2 + os.game.width/2, Math.round(Math.random() * 500) - 250 - 200/2 + os.game.height/2, "I HATE YOU");
				sfx.error.play();
				break;
			case 1:
				os.createTxtWindow(Math.round(Math.random() * 500) -250 - 200/2 + os.game.width/2, Math.round(Math.random() * 500) - 250 - 200/2 + os.game.height/2, "I KNOW WHAT YOU DID");
				sfx.error.play();
				break;
			case 2:
				os.createTxtWindow(Math.round(Math.random() * 500) -250 - 200/2 + os.game.width/2, Math.round(Math.random() * 500) - 250 - 200/2 + os.game.height/2, "THEY WILL NEVER FORGIVE YOU");
				sfx.error.play();
				break;
			case 3:
				os.createTxtWindow(Math.round(Math.random() * 500) -250 - 200/2 + os.game.width/2, Math.round(Math.random() * 500) - 250 - 200/2 + os.game.height/2, "YOU WILL NEVER PUT IT TOGETHER");
				sfx.error.play();
				break;
			case 4:
				os.createTxtWindow(Math.round(Math.random() * 500) -250 - 200/2 + os.game.width/2, Math.round(Math.random() * 500) - 250 - 200/2 + os.game.height/2, "I KNOW YOU HAVE IT");
				sfx.error.play();
				break;
			case 5:
				case 2:
				os.createTxtWindow(Math.round(Math.random() * 500) -250 - 200/2 + os.game.width/2, Math.round(Math.random() * 500) - 250 - 200/2 + os.game.height/2, "GIVE IT TO US GIVE IT TO US GIVE IT TO US GIVE IT TO US GIVE IT TO US GIVE IT TO US GIVE IT TO US GIVE IT TO US GIVE IT TO US GIVE IT TO US");
				sfx.error.play();
				break;
		}
		
	}
	
	moveUp() {
		if (this.folder.parentFolder == null) return;
		
		this.folder.removeFile(this);
		this.folder.parentFolder.addFile(this);
		this.folder = this.folder.parentFolder;
	}
	
	moveDown() {
		if (this.folder.children.length == 0) return;
		
		var loc = this.folder.getRandomFolder();
		this.folder.removeFile(this);
		loc.addFile(this);
		this.folder = loc;
	}
	
	destroy() {
		this.destroyed = true;
		this.folder.removeFile(this);
	}
}