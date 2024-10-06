MATTIE.menus = MATTIE.menus || {};
MATTIE.windows = MATTIE.windows || {};
MATTIE.scenes = MATTIE.scenes || {};
MATTIE.TextManager = MATTIE.TextManager || {};
MATTIE.CmdManager = MATTIE.CmdManager || {};
MATTIE.modLoader = MATTIE.modLoader || {};
MATTIE.menus.mainMenu = MATTIE.menus.mainMenu || {};

/**
 * @namespace MATTIE.GameInfo
 * @description a namespace containing methods to get game info
 */
MATTIE.GameInfo = {};

/**
 * @description check what difficulty the game is in
 * @returns {string}
 * */
MATTIE.GameInfo.getDifficulty = (data = $gameSwitches) => {
	let difficulty = 'Fear & Hunger';
	if (MATTIE.GameInfo.isHardMode(data)) { // Hard mode
		difficulty = 'Hard Mode'; // funnier name: "Trepidation & Famine"
	} else if (MATTIE.GameInfo.isTerrorAndStarvation(data)) { // terror and starvation
		difficulty = 'Terror And Starvation';
	}
	return difficulty;
};
/**
 * @description provided with a same object get the menu actor's name
 * @param {Object} data
 * @returns {string} menu actor name
 */
MATTIE.GameInfo.getCharName = (data = $gameParty) => data.menuActor()._name;

/**
 * @description provided with a same object check if it is hardmode
 * @param {Object} data
 * @returns {boolean} is hardmode
 */
MATTIE.GameInfo.isHardMode = (data = $gameSwitches) => data._data[2190] === true;

/**
 * @description provided with a same object check if it is t&s
 * @param {Object} data
 * @returns {boolean} is t&s
 */
MATTIE.GameInfo.isTerrorAndStarvation = (data = $gameSwitches) => (!data._data[2190] && data._data[3153] === true);

MATTIE.menus.mainMenu.addBtnToMainMenu(
	TextManager.Mods,
	TextManager.Mods,
	MATTIE.menus.toModMenu.bind(this),
);

// --ENGINE OVERRIDES--

// MATTIE_RPG.Game_Map_Setup = Game_Map.prototype.setup;
// Game_Map.prototype.setup = function(mapId) {
//     /** @description the last map that the player was on */
//     this._lastMapId = mapId;
//     console.log(this._lastMapId);
//     MATTIE_RPG.Game_Map_Setup.call(this, mapId)
// };

MATTIE_RPG.Game_Player_PerformTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
	$gameMap._lastMapId = $gameMap.mapId();
	$gameMap._lastX = $gamePlayer.x;
	$gameMap._lastY = $gamePlayer.y;
	MATTIE_RPG.Game_Player_PerformTransfer.call(this);
};

/** @description check if the spot is passible in any direction */
/** @param {Game_Event} event */
MATTIE.isPassableAnyDir = function (event) {
	const dirs = [2, 4, 6, 8]; // dir 4 dirsections
	for (let index = 0; index < dirs.length; index++) {
		const dir = dirs[index];
		if (
			$gamePlayer.canPass(event.x, event.y, dir)
			&& $gamePlayer.isMapPassable(event.x, event.y, dir)
			&& !$gamePlayer.isCollided(event.x, event.y)
			&& $gameMap.isPassable(event.x, event.y, dir)
		) return true;
	}
	return false;
};

/** @description check if the spot is passible in any direction
 * @param {Game_Event} event
 * @param {int} x how many directions must this is passable in to return true
*/
MATTIE.isPassableXDirs = function (event, x) {
	let count = 0;
	const dirs = [2, 4, 6, 8]; // dir 4 dirsections
	for (let index = 0; index < dirs.length; index++) {
		const dir = dirs[index];
		if (
			$gamePlayer.canPass(event.x, event.y, dir)
			&& $gamePlayer.isMapPassable(event.x, event.y, dir)
			&& !$gamePlayer.isCollided(event.x, event.y)
			&& $gameMap.isPassable(event.x, event.y, dir)
		) count++;
	}
	return count >= x;
};

/**
 * @description get the last map id
 * @returns the id of the last map
 */
Game_Map.prototype.lastMapId = function () {
	return this._lastMapId;
};
/**
 * @description format the key of a self swtich id
 * @param {*} mapId the map id that this event is on
 * @param {*} eventId the event id of this event
 * @param {*} letter the letter of this switch
 * @returns {string[]}
 */
Game_SelfSwitches.prototype.formatKey = function (mapId, eventId, letter) {
	const key = [mapId, eventId, letter];
	return key;
};
