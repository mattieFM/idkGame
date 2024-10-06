// --UTIL--
function updateKeys(keys) {
	Object.keys(keys).forEach((key) => {
		Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; // add our key to the list of watched keys
	});
}

function updateKey(key) {
	if (key.includes('&')) {
		const keys = key.split('&');
		keys.forEach((element) => {
			Input.keyMapper[element.toUpperCase().charCodeAt(0)] = element; // add our key to the list of watched keys
		});
	} else {
		Input.keyMapper[key.toUpperCase().charCodeAt(0)] = key; // add our key to the list of watched keys
	}
}
/**
 * @namespace Input
 * @description the input object of RPG maker, note: only the added methods and functions will display in this documentation
 */

/**
 * @param {int} scope
 * -2 = in dev mode
 * -1 = never
 * 0 = global
 * 1 = on scene_map
 * 2 = on scene_battle
 * 3 = on scene_menu
 * 4 = not on scene_map
 */
Input.checkScope = function (scope) {
	switch (scope) {
	case -1:
		return false;
	case 0:
		return true;
	case 1:
		return SceneManager._scene instanceof Scene_Map;
	case 2:
		return SceneManager._scene instanceof Scene_Battle;
	case 3:
		return SceneManager._scene instanceof Scene_Menu;
	case 4:
		return !(SceneManager._scene instanceof Scene_Map);
	case -2:
		return MATTIE.isDev;
	default:
		return false;
	}
};

const keys = {};
let i = 128;

MATTIE_RPG.commandWasd = Scene_KeyConfig.prototype.commandWasd;
Scene_KeyConfig.prototype.commandWasd = function () {
	MATTIE_RPG.commandWasd.call(this);
	Object.keys(keys).forEach((name) => {
		const keyObj = keys[name];
		if (keyObj.wasdDefualt) { keyObj.key = keyObj.wasdDefualt; }
	});
};

MATTIE_RPG.commandDefualt = Scene_KeyConfig.prototype.commandDefault;
Scene_KeyConfig.prototype.commandDefault = function () {
	MATTIE_RPG.commandDefualt.call(this);
	Object.keys(keys).forEach((name) => {
		const keyObj = keys[name];
		if (keyObj.defaultKey) { keyObj.key = keyObj.defaultKey; }
	});
};

/**
 *
 * @param {string} key (optional) always bind to this key on boot
 * @param {Function} cb the call back to run
 * @param {string} name the name of this command
 * @param {int} scope the scope of this command
 * @param {string} wasdDefualt the default key in wasd layout
 * @param {string} defaultKey the default key in defualt layout
 */
Input.addKeyBind = function (key, cb, name = '', scope = 0, wasdDefualt = null, defaultKey = null, hidden = false) {
	if (typeof key === 'number') key = String.fromCharCode(key);
	if (typeof defaultKey === 'number') key = String.fromCharCode(defaultKey);
	if (!key) {
		if ((defaultKey && !Input.keyMapper[defaultKey.toUpperCase().charCodeAt(0)]
		|| (defaultKey && Input.keyMapper[defaultKey.toUpperCase().charCodeAt(0)] == defaultKey) && defaultKey != null) && !defaultKey.includes('&')) {
			key = defaultKey;
		} else {
			key = String.fromCharCode(i);
		}
	}

	// setup default keybinds
	if (wasdDefualt) {
		if (typeof wasdDefualt !== 'number') {
			if (!wasdDefualt.includes('&')) { ConfigManager.wasdMap[wasdDefualt.toUpperCase().charCodeAt(0)] = wasdDefualt; }
		} else {
			ConfigManager.wasdMap[wasdDefualt] = String.fromCharCode(wasdDefualt);
		}
	}
	if (defaultKey) {
		if (typeof defaultKey !== 'number') {
			if (!defaultKey.includes('&')) { ConfigManager.defaultMap[defaultKey.toUpperCase().charCodeAt(0)] = defaultKey; }
		} else {
			ConfigManager.defaultMap[defaultKey] = String.fromCharCode(defaultKey);
		}
	}

	if (name != '') {
		const tempFunc = Window_KeyConfig.prototype.actionKey;
		const tempFunc2 = Window_KeyAction.prototype.makeCommandList;

		if ((scope != -2 || MATTIE.isDev) && !hidden) {
			// this is so that keys can be rebound
			Window_KeyConfig.prototype.actionKey = function (action) {
				if (action === key || action == wasdDefualt || action == defaultKey) return name;
				return tempFunc.call(this, action);
			};
			// this is so that keys can be rebound
			Window_KeyAction.prototype.makeCommandList = function () {
				tempFunc2.call(this);
				this.addCommand(name, 'ok', true, key);
			};
		}
	}
	i++;

	keys[name] = {
		wasdDefualt,
		defaultKey,
		key,
		cb: () => { if (Input.checkScope(scope))cb(); },
	};
	updateKey(key, name);
};
MATTIE.Prev_Input_Update = Input.update;
Input.update = function () {
	MATTIE.Prev_Input_Update.call(this);
	Object.keys(keys).forEach((name) => {
		const obj = keys[name];
		let key = obj.key;
		const cb = obj.cb;
		if (typeof key === 'number') key = String.fromCharCode(key);
		if (key.contains('&')) {
			/** @type {any[]} */
			const combinedKeys = key.split('&');

			const pressed = (() => {
				for (let index = 0; index < combinedKeys.length - 1; index++) {
					const element = combinedKeys[index];
					if (!Input.isPressed(element)) return false;
				}
				return Input.isRepeated(combinedKeys[combinedKeys.length - 1]);
			})();
			if (pressed) {
				cb();
			}
		} else if (Input.isRepeated(key)) {
			cb();
		}
	});
};