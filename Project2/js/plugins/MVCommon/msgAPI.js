/**
 * @namespace MATTIE.msgAPI
 * @description The api for display in game messages to the player. Basically a glorified wrapper for ShowText command.
 */
MATTIE.msgAPI = MATTIE.msgAPI || {};

// check DreamX exists for compatibility reasons
var DreamX = DreamX || false;

/**
 * @description display a msg in the way funger handles speech
 * @param {string} title the title/char name to display in darkened text
 * @param {string} msg the string msg
 */
MATTIE.msgAPI.displayMsgWithTitle = function (title, msg) {
	MATTIE.msgAPI.displayMsg(MATTIE.msgAPI.formatMsgAndTitle(title, msg));
};

/**
 * @description que a callback to trigger once the gameMessage is no longer busy
 * @param {function} cb
 */
MATTIE.msgAPI.doOnceNotBusy = function (cb) {
	const int = setInterval(() => {
		if (!$gameMessage.isBusy()) {
			clearInterval(int);
			cb();
			$gameMap._interpreter.setWaitMode('message');
		}
	}, 50);
};

/**
 * @description que a callback to trigger once there is a game message on the screen
 * @param {function} cb
 */
MATTIE.msgAPI.doOnceMsgExists = function (cb) {
	const int = setInterval(() => {
		if ($gameMessage.hasText()) {
			clearInterval(int);
			cb();
			$gameMap._interpreter.setWaitMode('message');
		}
	}, 50);
};

/**
 * s
 * @param {*} msg string msg
 * @param {int} background optional
 * Sets the background of the message window;
 * options are 0 (fully opaque), 1 (transparent), 2 (invisible background).
 * The default is 0.
 * @param {int} pos
 * Sets the position of the message window;
 * 0 is top
 * 1 is middle
 * default is 2.
 */
MATTIE.msgAPI.displayMsg = function (msg, background = 0, pos = 2, faceName = null, faceNumber = null) {
	let battleMenuUpdate = false;
	if ($gameParty.inBattle()) battleMenuUpdate = true;
	this.doOnceNotBusy(() => {
		if (faceName)
			$gameMessage.setFaceImage(faceName, faceNumber)
		$gameMessage.setBackground(background);
		$gameMessage.setPositionType(pos);
		$gameMessage.add(msg);
		this.doOnceNotBusy(() => {
			if (battleMenuUpdate) {
				if (!SceneManager._scene._partyCommandWindow.isOpenAndActive() && SceneManager._scene._partyCommandWindow.active) {
					SceneManager._scene._partyCommandWindow.open();
				} else if (!SceneManager._scene._actorCommandWindow.isOpenAndActive() && SceneManager._scene._actorCommandWindow.active) {
					SceneManager._scene._actorCommandWindow.open();
				}
			}
		})
	});
};

/**
 * @description add msg to battle lod
 * @param {*} msg the msg 
 * @param {*} delay delay till it clears in ms 
 */
MATTIE.msgAPI.addToBattleLog = function (msg, delay) {
	BattleManager._logWindow.push("addText", msg)

	setTimeout(() => {
		msg
	}, delay);
	BattleManager._logWindow.push("clear")
}

/**
 * @description get the current msg window if one exists
 * @returns null or msg window
 */
MATTIE.msgAPI.getMsgWindow = function () {
	let windowLayer = SceneManager._scene._windowLayer
	if (windowLayer) {
		let windowLayerChildren = windowLayer.children
		if (windowLayerChildren) {
			let msgWin = windowLayerChildren.filter(e => {
				return (e instanceof Window_Message)
			})[0];
			return msgWin;
		}
	}


}

/**
 * @description draw an image on top of the current face
 */
MATTIE.msgAPI.drawImageOveract = function (name, index) {
	$gameMessage.setFaceImage(name, index);
	let msgWindow = MATTIE.msgAPI.getMsgWindow()
	if (msgWindow) {
		msgWindow.drawMessageFace();
	}

}

/**
 * @description show an animation within an existing msgbox
 * @param {*} startNum the number of image to start at. IE: 1 for 1.png
 * @param {*} endNum the number of image to end at IE: 10 for 10.png
 * @param {*} folder the folder within the faces folder to find your files in. IE: if I have an anim in /faces/anim, then I would enter "/anim/" as the folder
 * @param {*} frameDelay the delay between each frame in milli seconds
 */
MATTIE.msgAPI.showAnim = function (startNum, endNum, folder, frameDelay) {
	for (let index = startNum; index <= endNum; index++) {
		setTimeout(() => {
			MATTIE.msgAPI.drawImageOveract(`${folder}${index}`, 0);
		}, frameDelay * index);

	}

}

/** @description format a string into the form title msg, as though speaking */
MATTIE.msgAPI.formatMsgAndTitle = function (title, msg) {
	return `\\c[7]${title}\\c[0]\n${msg}`;
};

/**
 * @description get a number input from the user
 * @param {*} maxDigits how many digits is the number
 * @returns a promise for the vaule
 */
MATTIE.msgAPI.getNumberInput = function (maxDigits, msg) {
	return new Promise((res) => {
		MATTIE.msgAPI.doOnceNotBusy(() => {
			$gameMessage.setNumberInput(MATTIE.static.vars.reservedForUseInScripts, maxDigits);
			$gameMessage.add(msg);

			MATTIE.msgAPI.doOnceNotBusy(() => res($gameVariables.value(MATTIE.static.vars.reservedForUseInScripts)));
		});
	})
}


/**
 * @param {*} choices array of string msgs
 * @param {*} defaultChoice what index does the user start on
 * @param {*} cancelChoice which index cancels the menu
 * @param {*} cb a function that takes the index response of the use
 * @param {string} msgs displays at the bottom of the screen
 * @param {any[]|string} helps displays at top of screen
 */
MATTIE.msgAPI.showChoices = function (choices, defaultChoice, cancelChoice, cb, msg = null, msgs = [], helps = []) {
	this.doOnceNotBusy(() => {
		let helpsArr = [];
		if (typeof helpsArr !== typeof 'string') {
			helpsArr = helps;
		} else {
			choices.forEach(() => helpsArr.push(helps));
		}

		MATTIE.msgAPI._dreamXCompat(helpsArr);
		MATTIE.msgAPI._dreamXCompat(helpsArr, msgs);

		if (msg != null) $gameMessage.add(msg);
		$gameMessage.setChoices(choices, defaultChoice, cancelChoice);
		$gameMessage.setChoiceCallback((n) => {
			cb(n);
		});
	});
};

/**
 * @description add compatibility for dreamX choice help plugin
 */
MATTIE.msgAPI._dreamXCompat = function (helpsArr, msgs) {
	if (DreamX) {
		if (DreamX.ChoiceHelp) {
			$gameMessage.setChoiceHelps(helpsArr);
			$gameMessage.setChoiceMessages(msgs);
			$gameMessage.setChoiceFaces([]);
		}
	}
};

/**
 * @description show a msg at the footer of the screen, using the gab text plugin
 * @param {string} msg message to display
 * @param {int} ms the milliseconds till the event is hidden
 */
MATTIE.msgAPI.footerMsg = function (msg, force = false) {
	if (typeof msg === typeof 'string') msg = [msg]; // add msg to an array if it is a string
	if (force) {
		Game_Interpreter.prototype.clearGab();
	}
	Game_Interpreter.prototype.setGabText(msg);
	Game_Interpreter.prototype.showGab();
};

//= ============================================================================
// Gab Plugin Message Extension
//= ============================================================================

//= ============================================================================
// Scene_Base
//= ============================================================================

// const baseDrawFace = Window_Base.prototype.drawFace;
// Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
// 	if(MATTIE.msgAPI.overrideFaceDrawer){
// 		width = width || Window_Base._faceWidth;
// 		height = height || Window_Base._faceHeight;
// 		var bitmap = ImageManager.loadFace(faceName);
// 		faceIndex=faceIndex;
// 		var pw = Window_Base._faceWidth;
// 		var ph = Window_Base._faceHeight;
// 		var sw = Math.min(width, pw);
// 		var sh = Math.min(height, ph);
// 		var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
// 		var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
// 		var sx = faceIndex % 4 * pw + (pw - sw) / 2;
// 		var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
// 		this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
// 	}else{
// 		baseDrawFace.call(this,faceName, faceIndex, x, y, width, height);
// 	}
// };

/**
 * @description a function that scans all folders in ./img/faces and then reserves the images in each folder
 */
function reserveAnimatedFaces() {
	let fs = require('fs');
	const baseImgPath = "./img/faces";
	let folders = fs.readdirSync(baseImgPath).filter(result => fs.lstatSync(`${baseImgPath}/${result}`).isDirectory());
	folders.forEach(folder => {
		let pathToFolder = `${baseImgPath}/${folder}`;
		let files = fs.readdirSync(pathToFolder);
		files.forEach(file => {
			const path = `${folder}/${file}`.replace(".png", "")
			if (fs.existsSync(`${baseImgPath}/${path}.png`)) {
				console.log("file Exists")
				ImageManager.loadFace(path)
			}
		})

	})
}


// (() => {
// 	const baseMapLoaded = Scene_Map.prototype.onMapLoaded
// 	Scene_Map.prototype.onMapLoaded = function () {
// 		const val = baseMapLoaded.call(this);
// 		setTimeout(() => {
// 			MATTIE.msgAPI.showAnim(0, 354, "/proWinkster/", 1)
// 		}, 5000);
// 		return val;
// 	}
// })();
