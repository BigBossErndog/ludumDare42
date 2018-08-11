class Folder {
	constructor(name, parentFolder) {
		this.children = [];
		this.type = "folder";
		this.name = name;
		this.parentFolder = parentFolder;
		if (this.parentFolder != null) {
			this.parentFolder.add(this);
		}
		this.id = Math.random();
	}
	
	usage() {
		var space = 0;
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child instanceof File) {
				space += child.size;
			}
			else {
				space += child.usage();
			}
		}
		
		return space;
	}
	
	add(folder) {
		this.children.push(folder);
	}
	
	getPath() {
		if (this.parentFolder == null) return this.name;
		return this.parentFolder.getPath() + "/" + this.name;
	}
	
	remove(folder) {
		for (var i = 0; i < this.children.length; i++) {
			if (folder.id == this.children[i].id) {
				this.children.splice(i, 1);
				return;
			}
		}
	}
}

var virusNames = [];
class File {
	constructor(name, parentFolder) {
		this.size = Math.ceil(Math.random * 10);
		this.name = virusNames[Math.floor(virusNames.length * Math.random())];
		this.parentFolder = parentFolder
	}
}