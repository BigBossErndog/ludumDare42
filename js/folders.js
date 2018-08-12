var folderNames = ["Hello", "Goodbye", "Japan", "hent@i", "p0rn", "roms", "movies", "games", "stash", "bank details", "pictures", "videos", "Documents", "Program Files", "System32", "hacking tools", "steam", "steam works", "doki doki", "tutorials", "phaser3", "phaserCE", "canvas", "html", "js", "stalk pics", "top secret", "classified", "protected", "ur mom", "stuff"]
class Folder {
	constructor(name, parentFolder) {
		this.children = [];
		this.files = [];
		
		this.type = "folder";
		this.name = name;
		this.parentFolder = parentFolder;
		if (this.parentFolder != null) {
			this.parentFolder.add(this);
		}
		this.destroyed = false;
		this.id = Math.random();
	}
	
	usage() {
		var space = 1;
		
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			space += child.usage();
		}
		for (var i = 0; i < this.files.length; i++) {
			space += this.files[i].size;
		}
		
		return space;
	}
	
	add(folder) {
		this.children.push(folder);
		folder.parentFolder = this;
	}
	
	addFile(file) {
		this.files.push(file);
	}
	
	getPath() {
		if (this.parentFolder == null) return this.name;
		return this.parentFolder.getPath() + "/" + this.name;
	}
	
	getRandomFolder() {
		if (this.children.length == 0){
			return null;
		}
		return this.children[Math.floor(Math.random() * this.children.length)];
	}
	
	remove(folder) {
		for (var i = 0; i < this.children.length; i++) {
			if (folder.id == this.children[i].id) {
				this.children.splice(i, 1);
				return;
			}
		}
	}
	
	removeFile(file) {
		for (var i = 0; i < this.files.length; i++) {
			if (this.files[i].id == file.id) {
				this.files.splice(i, 1);
				return;
			}
		}
	}
}

var virusNames = [];
class File {
	constructor(name, folder) {
		this.size = Math.ceil(Math.random * 10);
		this.name = virusNames[Math.floor(virusNames.length * Math.random())];
		this.parentFolder = folder;
	}
}

class TextFile {
	constructor(loc, name, txt) {
		this.id = Math.random();
		
		this.size = txt.length * 8 + name.length * 8;
		
		this.folder = loc;
		this.folder.addFile(this);
		
		this.destroyed = false;
		this.text = txt;
		
		this.name = name;
	}
	
	destroy() {
		this.destroyed = true;
		this.folder.removeFile(this);
	}
}