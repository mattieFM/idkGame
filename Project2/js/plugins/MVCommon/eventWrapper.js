//= ============================================================================
// EventWrapper.js
//= ============================================================================

/*:
 * @plugindesc A simple wrapper for creating and handling events in your plugins. Press Help to see usage info.
 * @author Alphaxaon
 *
 * @help // Create a new event
 * var event = new MapEvent();
 *
 * // Copy actions from another event with the specified id
 * event.copyActionsFromEvent(1);
 *
 * // Copy actions from another event that exists on the map with the specified id
 * event.copyActionsFromEventOnMap(1, 4);
 *
 * // Copy actions from a Common Event with the specified id
 * event.copyActionsFromCommonEvent(1);
 *
 * // Spawn the event at the specified coordinates
 * event.spawn(11, 7);
 */

MATTIE.eventAPI = MATTIE.eventAPI || {};
/** @description an array storing all active map events */
MATTIE.eventAPI.dataEvents = MATTIE.eventAPI.dataEvents || {};
let val = 999;


// remove circular references and this will work
const baseMakeSaveContents = DataManager.makeSaveContents
DataManager.makeSaveContents = function() {
    var contents = baseMakeSaveContents.call(this)
	let events = MATTIE.eventAPI.dataEvents;
	Object.keys(events).forEach(key=>{
		const element = events[key];
		events[key] = element.jsonSafe();
	})
    contents.dataEvents = events
    return contents;
};

const baseExtractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
	baseExtractSaveContents.call(this,contents);
	let events = contents.dataEvents;
	Object.keys(events).forEach(key=>{
		const element = events[key];
		events[key] = new MapEvent().loadFromJson(element);
	})
    MATTIE.eventAPI.dataEvents = events || {};
};


class MapEvent {
	/**
     * The constructor for a new map event.
     */
	constructor() {
		const id = this.setId();

		this.data = {
			id,
			name: `EV${id.padZero(3)}`,
			note: '',
			pages: [],
			x: 0,
			y: 0,
			meta: {},
			mapId: $gameMap.mapId(),
			persist: false,
			isRuntime: true,
		};

		this.addPage();
	}

	loadFromJson(json){
		//console.log(json)
		Object.assign(this,json);
		return this;
	}

	/**
	 * @description get a copy of this obj without any circular references
	 */
	jsonSafe(){
		const obj = this;
		if(obj.oldSprite){
			obj.oldSprite = null;
		}
		return obj;
	}

	/**
     * Automatically set the id for the event.
     */
	setId() {
		val++;
		if ($dataMap) {
			if ($dataMap.events) {
				let openIndex = $dataMap.events.length + Object.keys(MATTIE.eventAPI.dataEvents).length - 2;
				do {
					openIndex++;
				} while ($gameMap.event(openIndex));

				val = openIndex;
			}
		}
		return val;
	}

	setPersist(bool) {
		this.data.persist = bool;
	}

	/**
    * Add a new page for the event's actions.
    */
	addPage() {
		this.data.pages.push(this.setDefaultPage());
	}

	/**
		 *
		 * @returns the default page objectt
		 */
	setDefaultPage() {
		return {
			conditions: this.setDefaultConditions(),
			directionFix: true,
			image: MapEvent.setDefaultImage(),
			list: [],
			moveFrequency: 3,
			moveRoute: this.setDefaultMoveRoute(),
			moveSpeed: 3,
			moveType: 0,
			priorityType: 0,
			stepAnime: true, // this makes most things animate
			through: false,
			trigger: 0,
			walkAnime: true,
		};
	}

	/**
     * @description add text command to page
     * @param {*} pageId
     * @param {*} text
     */
	addText(pageId, text) {
		this.addCommand(pageId, 101, ['', 0, 0, 2]);
		this.addCommand(pageId, 401, [text]);
	}

	/**
     * @description add text command to page with a speaker
     * @param {*} pageId
     * @param {*} text
     */
	addSpokenText(pageId, text, speaker) {
		this.addCommand(pageId, 101, ['', 0, 0, 2]);
		this.addCommand(pageId, 401, [MATTIE.msgAPI.formatMsgAndTitle(speaker, text)]);
	}

	/**
     * @description add the move route command to a page
     * @param {*} pageId the id of the page to add the command to
     * @param {*} route the id of the action
     */
	addMoveRoute(pageId, moveCode, wait) {
		this.addCommand(pageId, 205, [0, { list: [{ code: moveCode, indent: null }, { code: 0 }], wait }]);
	}

	/**
     *
     * @param {*} pageId the page Id to add the command to
     * @param {*} tint the tint object
     * @param {*} frames who many frames to tint for
     */
	addTintScreen(pageId, tint, frames, wait) {
		//console.log([tint, frames, wait]);
		this.addCommand(pageId, 223, [tint, frames, wait]);
	}

	/**
     * Set the default event conditions for a page of actions.
     */
	setDefaultConditions() {
		return {
			actorId: 1,
			actorValid: false,
			itemId: 1,
			itemValid: false,
			selfSwitchCh: 'A',
			selfSwitchValid: false,
			switch1Id: 1,
			switch1Valid: false,
			switch2Id: 1,
			switch2Valid: false,
			switch3Id: 1,
			switch3Valid: false,
			switch4Id: 1,
			switch4Valid: false,
			variableValue: 0,
		};
	}

	/**
     * @description add a wait command to a page
     * @param {*} pageId the page id to add the command to
     * @param {*} frames the number of frames to wait
     */
	addWait(pageId, frames) {
		this.addCommand(pageId, 230, [frames]);
	}

	/**
     * Set the default event image for a page of actions.
     */
	static setDefaultImage() {
		return this.generateImage(0, '', 2, 0, 0);
	}

	/**
     *
     * @param {*} index the index of the char, 3 cols per index
     * @param {*} name the name of the char sheet to use
     * @param {*} dir the dir they are facing, 2,4,6,8
     * @param {*} pattern
     * @param {*} tile tile id not sure
     * @returns obj
     */
	static generateImage(index, name, dir, pattern, tile) {
		return {
			characterIndex: index,
			characterName: name,
			direction: dir,
			pattern,
			tileId: tile,
		};
	}

	/**
     * @description change the image of a page
     * @param {*} pageId
     * @param {*} imageObj
     */
	setImage(pageId, imageObj) {
		this.data.pages[pageId].image = imageObj;
	}

	/**
     * @description change the charecter of a page
     * @param {*} pageId
     * @param {string} name string
     */
	setChar(pageId, name) {
		this.data.pages[pageId].image.characterName = name;
	}

	/**
     *
     * @param {*} pageId
     * @param {*} command
     * @param {*} parameters
     */
	addCommand(pageId, command, parameters, indent = 0) {
		this.data.pages[pageId].list.push(this.createCommand(command, parameters, indent));
	}

	/**
     * @description create a command obj from these params
     * @param {*} command the command code
     * @param {*} parameters array of params
     * @param {*} indent optional
     * @returns {rm.types.Event}
     */
	createCommand(command, parameters, indent = 0) {
		const cmd = {};
		cmd.code = command;
		cmd.parameters = parameters;
		cmd.indent = indent;
		cmd.eventId = this.data.id;
		return cmd;
	}

	/**
     * Set the default move route for a page of actions.
     */
	setDefaultMoveRoute() {
		return {
			list: [
				{
					code: 0,
					parameters: [],
				},
			],
			repeat: true,
			skippable: false,
			wait: false,
		};
	}

	/**
     * Set the name of the event.
     *
     * @param name (string)
     */
	setName(name) {
		this.data.name = name;
	}

	/**
     * Set the note of the event.
     *
     * @param note (string)
     */
	setNote(note) {
		this.data.note = note;
	}

	/**
     * Set the map coordinates of the event.
     *
     * @param x (int)
     * @param y (int)
     */
	setPosition(x, y) {
		this.data.x = x;
		this.data.y = y;
	}

	/**
     * Get the last Event object stored in $dataMap.
     */
	getLastEvent() {
		return $dataMap.events[$dataMap.events.length - 1];
	}

	/**
     * Create a new Game_Event object and store it in $gameMap.
     */
	createGameEvent() {
		$dataMap.events[this.data.id] = this.data;
		$gameMap._events[this.data.id] = (new Game_Event($gameMap.mapId(), this.data.id));
		return $gameMap.event(this.data.id);
	}

	/**
     * Create a new Sprite_Character and store it in the current scene's Spriteset_Map.
     *
     * @param event (Game_Event)
	 * @returns the event or an empty event if something went wrong
     */
	createCharacterSprite(event) {
		//console.log('rendering event as sprite:');
		//console.log(event);
		try {
			SceneManager._scene._spriteset._characterSprites.push(new Sprite_Character(event));
			return SceneManager._scene._spriteset._characterSprites[SceneManager._scene._spriteset._characterSprites.length - 1];
		} catch (error) {
			console.error(`${error}An error occured in rendering a runtime sprite`);
			return new Sprite_Character();
		}
	}

	/**
     * Add a sprite to the current scene's Tilemap.
     *
     * @param sprite (Sprite_Character)
     */
	addSpriteToTilemap(sprite) {
		if (this.oldSprite) {
			SceneManager._scene._spriteset._tilemap.removeChild(this.oldSprite);
		}
		SceneManager._scene._spriteset._tilemap.addChild(sprite);
		this.oldSprite = sprite;
	}

	removeSpriteFromTilemap(i=0) {
		try {
			if (this.oldSprite) {
				SceneManager._scene._spriteset._tilemap.removeChild(this.oldSprite);
			}
			
		} catch (error) {
			if(i<10) setTimeout(() => {
				this.removeSpriteFromTilemap(++i)
			}, 500);
		}
		
	}

	/**
     * Copy actions from another event on the same map with the specified id.
     *
     * @param id (int)
     */
	copyActionsFromEvent(id) {
		this.data.pages = $dataMap.events[id].pages;
	}

	/**
     * Copy actions from another event on map with the specified id.
     *
     * @param id (int)
     * @param mapId (int)
	 * @returns self for cmd chaining
     */
	copyActionsFromEventOnMap(id, mapId) {
		const url = 'data/Map%1.json'.format(mapId.padZero(3));
		const xhr = new XMLHttpRequest();

		xhr.open('GET', url, false);
		xhr.overrideMimeType('application/json');

		xhr.onload = function () {
			if (xhr.status < 400) {
				const mapData = JSON.parse(xhr.responseText);

				if (!(id in mapData.events)) {
					//console.error('Error getting event data. Check to make sure an event with that specific id exists on the map.');
				} else {
					this.data.pages = mapData.events[id].pages;
					this.data.note = mapData.events[id].note;
					this.note = mapData.events[id].note;
					//console.log(this)
				}
			}
		}.bind(this);

		xhr.onerror = function () {
			//console.error('Error getting map data. Check to make sure a map with that specific id exists.');
		};

		xhr.send();
		return this;
	}

	/**
     * Copy actions from a Common Event with the specified id.
     *
     * @param id (int)
     */
	copyActionsFromCommonEvent(id) {
		this.data.pages = [];
		this.addPage();

		this.data.pages[0].list = $dataCommonEvents[id].list;
	}

	/**
     * Place the event on the map at the specified coordinates.
     *
     * @param x (int)
     * @param y (int)
     */
	spawn(x, y) {
		if(this.atPlayerPos) {x=$gamePlayer.x; y=$gamePlayer.y;}
		MATTIE.eventAPI.dataEvents[this.data.id] = this;
		if (this.data.mapId === $gameMap.mapId() || this.allMaps) {
			this.setPosition(x, y);
			this.refresh();
			//console.log('New event created!');
		}
	}

	event() {
		return this.data;
	}

	page() {
		//console.log(this.event())

		return this.event().pages[this.event()._pageIndex];
	};
	
	list() {
		return this.page().list;
	};

	removeThisEvent() {
		if (this.data.mapId === $gameMap.mapId() || this.allMaps) {
			$gameMap._events[this.data.id] = null;
			$dataMap.events[this.data.id] = null;
		}
		MATTIE.eventAPI.dataEvents[this.data.id] = undefined;
		delete MATTIE.eventAPI.dataEvents[this.data.id];
	}

	refresh() {
		if(this.allMaps){this.data.allMaps=true};
		try {
			if(this.atPlayerPos) this.setPosition($gamePlayer.x, $gamePlayer.y);
			const event = this.createGameEvent();
			const sprite = this.createCharacterSprite(event);
			if(this.atPlayerPos) {$gameMap.event(this.data.id).locate($gamePlayer.x, $gamePlayer.y);}
			else {$gameMap.event(this.data.id).locate(this.data.x, this.data.y)};
			this.addSpriteToTilemap(sprite);
		} catch (error) {
			console.error(error);
		}
	}

	partialRefresh(){
		if(this.allMaps){this.data.allMaps=true};
		if(this.atPlayerPos) this.setPosition($gamePlayer.x, $gamePlayer.y);
		if(this.atPlayerPos) {$gameMap.event(this.data.id).locate($gamePlayer.x, $gamePlayer.y);}
		else {$gameMap.event(this.data.id).locate(this.data.x, this.data.y)};
		const event = this.createGameEvent();
	}

	/**
     * @description return an array of all command codes on page
     * @param {*} page page index
     */
	getListOfCommandCodesOnPage(page) {
		return this.data.pages[page].list.map((cmd) => cmd.code);
	}

	/**
     * @description returns the index of the first occurence of the command code on the page
     * @param {*} commandCode command code
     * @param {*} page page index
     */
	indexOfCommandOnPage(page, commandCode) {
		const list = this.getListOfCommandCodesOnPage(page);
		return list.indexOf(commandCode);
	}

	/**
     * @description add
     * @param {*} index the index in the list of commands to add this command after
     * @param {*} command the command obj to add
     * @param {int} pageIndex the page index of the page to add the command to
     */
	addCommandAfterIndex(pageIndex, index, command) {
		const page = this.data.pages[pageIndex];
		const secondHalf = page.list.slice(index + 1);
		page.list = page.list.slice(0, index + 1);
		page.list.push(command);
		page.list = page.list.concat(secondHalf);
		this.data.pages[pageIndex] = page;
	}

	/**
     * @description check a self switch of this event
     * @param {*} letter the letter of the self switch
     * @returns {boolean} whether the switch is true or false
     */
	checkSelfSwitch(letter) {
		return $gameSelfSwitches.value($gameSelfSwitches.formatKey(this.data.mapId, this.data.id, letter));
	}
}

(function () {
	// override the function that triggers when the scene map is fully loaded

	MATTIE.eventAPI.cleanup = function () {
		if (!$dataMap) return;

		// Get all existing event ids
		const eventIds = [];
		const persistingIds = [];
		const eventsForDeletion = [];
		const keys = Object.keys(MATTIE.eventAPI.dataEvents);
		for (let index = 0; index < keys.length; index++) {
			const key = keys[index];
			const event = MATTIE.eventAPI.dataEvents[key];
			//console.log(event);
			//console.log(`map = ${$gameMap.mapId()}`);
			if (event) {
				if (event.data.mapId == $gameMap.mapId() || this.allMaps) {
					//console.log('event on map');
					if (!event.data.persist) {
						eventIds.push(event.data.id);
						eventsForDeletion.push(event);
					}
				}
				if (event.data.persist) {
					persistingIds.push(event.data.id);
				}
			}
		}

		//console.log('persisding ids');
		//console.log(persistingIds);

		$dataMap.events.forEach((object) => {
			// if (object === null) { return; }

			// eventIds.push(object.id);
		});

		// Clear self switches for non-existing events
		for (const key in $gameSelfSwitches._data) {
			if (key) {
				const ids = key.split(',');
				const mapId = Number(ids[0]);
				const eventId = Number(ids[1]);

				// this line is someone else's code IDK IDC enough to fix it /shrug
				// eslint-disable-next-line no-continue
				if (mapId != $gameMap._mapId) { continue; }

				if (eventIds.contains(eventId) && !persistingIds.contains(eventId)) {
					delete $gameSelfSwitches._data[key];
					//console.log(`cleaned up switch:${key} from event: ${eventId}`);
				}
			}
		}

		// remove all events qued for deletion
		// eventsForDeletion.forEach((evd) => {
		// 	evd.removeThisEvent();
		// });
	};
}());
