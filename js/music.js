var computerWorld = "6n52s6kbl04e0kt7m1a7g0oj7i0r1o3212400T0w6f1d1c0h1v0T0w2f1d1c0h1v1T0w1f1d1c0h0v1T0w6f1d1c0h0v0T0w4f1d1c0h0v0T2w4d1v0T2w1d1v2b4h4y8zhkl5hmtDy8wh4i8h0Qd3gQlllCpx4h8x43cPcPc00000004ycQ001mlw0000w0000000000100000g0icPcx4h4h8h4h4i00000100000w00000p25iFzzRkOipZ3OE6Edh6jB0Q5o4d0pHjPV9-bilddddddddddddde1AGqqqqqqqqqqqqqpe-1AyJdIE6jIHIaRlO0peGWMLvi6CNUdmy1FK7PFFD-CezijMf4qiv9OGiuvAQAOCej1IaINVUe95two4cC6Ed8qgQxF3jfDcF9Ve9kA-nBQAYP4qioj6FxYm8ikPRkNQo8Dw6nijUByd9fbOqiv8PritldoqyelAqpba7All1G8WGqqIEul1lxH8FzjUZkJCdfzS305c3xk2E5gawl0G1k2Q0E1g2w50a0k0E1hhhhhhhhhhhhhhhhj4wd0q0Q1E3g6wd0gk73XQ00"


function SoundManager(library) {
	this.list = [];
	this.allSongs = library;
	this.volume = 1;
	this.controlVolume = 1;

	this.manage = function() {
		if (this.volume > 1)  {
			this.volume = 1;
		}
		else if (this.volume < 0) {
			this.volume = 0;
		}
		for (var i = 0; i < this.list.length; i++) {
			if (this.list[i].volume > 1) {
				this.list[i].volume = 1;
			}
			else if (this.list[i].volume < 0) {
				this.list[i].volume = 0;
			}
			this.list[i].sound.volume = this.volume * this.controlVolume * this.list[i].volume;
		}
	}

	this.add = function(sound) {
		this.list.push(sound);
		this.allSongs[sound.name] = sound;
	}

	this.fadeIn = function(song, speed, startVol, endVol, endFunc, durFunc) {
		var start = 0;
		var end = 1;
		var isEvt = false;

		if (startVol != null && startVol != undefined) {
			start = startVol;
		}
		if (endVol != null && endVol != undefined) {
			end = endVol;
		}

		if (evt()) {
			song.volume = start;
			isEvt = true;
			nextEvt();
		}
		if (evt()) {
			if (song.volume < end) {
				song.volume += speed;
				if (durFunc != null && durFunc != undefined) {
					durFunc();
				}
			}
			else {
				song.volume = end;

				if (endFunc != null && endFunc != undefined) {
					endFunc();
				}

				nextEvt();
			}
			isEvt = true;
		}

		return isEvt;
	}

	this.fadeOut = function(song, speed, startVol, endVol, endFunc, durFunc) {
		var start = 1;
		var end = 0;
		var isEvt = false;

		if (startVol != null && startVol != undefined) {
			start = startVol;
		}
		if (endVol != null && endVol != undefined) {
			end = endVol;
		}

		if (evt()) {
			song.volume = start;
			isEvt = true;
			nextEvt();
		}
		if (evt()) {
			if (song.volume > end) {
				song.volume -= speed;
				if (durFunc != null && durFunc != undefined) {
					durFunc();
				}
			}
			else {
				song.volume = end;

				if (endFunc != null && endFunc != undefined) {
					endFunc();
				}

				nextEvt();
			}
			isEvt = true;
		}

		return isEvt;
	}

	this.stop = function(song) {
		if (evt()) {
			song.stop();
			nextEvt();
		}
	}

	this.play = function(song, untilDone) {
		if (evt()) {
			song.play();
			nextEvt();
		}

		if (evt()) {
			if (untilDone == true) {
				if (!song.isPlaying) {
					nextEvt();
				}
			}
			else {
				nextEvt();
			}
		}
	}

	this.resetVol = function(song) {
		if (evt()) {
			song.volume = 1;
			nextEvt();
		}
	}
	
	this.pauseAll = function() {
		for (var i = 0; i < this.list.length; i++) {
			if (this.list[i].isPlaying()) {
				this.list[i].pause();
			}
		}
	}
	
	this.resumeAll = function() {
		for (var i = 0; i < this.list.length; i++) {
			if (this.list[i].wasPlaying) {
				this.list[i].play();
			}
		}
	}
}

function Sound(name, manager, loop, allowMultiple) {
	this.key = name;
	this.sound = game.add.audio(name);
	this.manager = manager;

	this.loop = false;
	this.allowMultiple = false;
	this.wasPlaying = false;
	
	if (loop != null && loop != undefined) {
		this.sound.loop = loop;
		this.loop = loop;
		if (allowMultiple != null && allowMultiple != undefined) {
			this.sound.allowMultiple = allowMultiple;
		}
	}

	this.volume = 1;

	this.play = function() {
		this.sound.play();
		this.wasPlaying = true;
	}

	this.stop = function() {
		this.sound.stop();
		this.wasPlaying = false;
	}

	this.pause = function() {
		this.sound.pause();
	}

	this.resume = function() {
		this.sound.resume();
	}

	this.onStopAdd = function(method) {
		this.sound.onStop.add(method, game);
	}

    this.isPlaying = function() {
        return this.sound.isPlaying;
    }

	this.destroy = function() {
		this.sound.destroy();
	}

	manager.add(this);
}

function BeepMusic(songCode, manager) {
	this.key = name;
	this.sound = new beepbox.Synth(songCode);
	this.manager = manager;

	this.volume = 1;
	this.wasPlaying = false;
	this.playing = false;

	this.play = function() {
		this.sound.play();
		this.wasPlaying = true;
		this.playing = true;
	}

	this.stop = function() {
		this.sound.snapToStart();
		this.sound.pause();
		this.wasPlaying = false;
		this.playing = false;
	}
	
	this.pause = function() {
		this.sound.pause();
		this.playing = false;
	}

	this.resume = function() {
		this.sound.resume();
	}

    this.isPlaying = function() {
        return this.playing;
    }
	
	if (manager != null && manager != undefined) {
		manager.add(this);
	}
}