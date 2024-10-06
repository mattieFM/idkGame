MATTIE.eventAPI = MATTIE.eventAPI || {};
/** @description an array storing all active map events */
MATTIE.eventAPI.dataEvents = MATTIE.eventAPI.dataEvents || {};
MATTIE.eventAPI.blankEvent = {};



// stop that
var no;
let mapI=0;
(() => {
	const onMapLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function () {
		if (this._transfer) mapI=0;
		mapI++;
		
		onMapLoaded.call(this);
		MATTIE.eventAPI.cleanup();
		const keys = Object.keys(MATTIE.eventAPI.dataEvents);
		keys.forEach((key) => {
		/** @type {MapEvent} */
			const mapEvent = MATTIE.eventAPI.dataEvents[key];

			// only refresh ones on the same map
			if (mapEvent.data.mapId === $gameMap.mapId() || mapEvent.allMaps) {
				if(mapI<3){
					mapEvent.refresh();
				} else{
					$dataMap.events[mapEvent.data.id] = mapEvent.data;
				}
			}
		});
	};

    /**
     * @description we override this such that it will not return an undefined result ever. Even if another mod fucks up
     * @todo I don't like this way of fixing this bug but does work.
     * @param unsafe, if true does not add anything
     * @returns {Game_Map} the datamap event obj
     */
    MATTIE_RPG.Game_Event_Event = Game_Event.prototype.event;
    Game_Event.prototype.event = function () {
        let val = MATTIE_RPG.Game_Event_Event.call(this);
        if (!val) val = $dataMap.events[1];
        if (!val) val = new MapEvent().data;
        return val;
    };
})();



/** @description the base setup events function */
MATTIE.eventAPI.orgSetupEvent = Game_Map.prototype.setupEvents;
/**
 * @description override the setup events function to attach all runtime events as well
 * @deprecated this would work if not for self switches
 */
Game_Map.prototype.setupEvents = function () {
	MATTIE.eventAPI.orgSetupEvent.call(this);

	const keys = Object.keys(MATTIE.eventAPI.dataEvents);
	keys.forEach((key) => {
		/** @type {MapEvent} */
		const mapEvent = MATTIE.eventAPI.dataEvents[key];
		// mapEvent.removeSpriteFromTilemap();

		// the length of the events array after all base events loaded
		let i = this._events.length;

		// if event is on the currently loaded map, if not do nothing
		if (mapEvent.data.mapId === $gameMap.mapId() || mapEvent.allMaps) {
			// before we can add it as a game event we need to add it as a data event and update its id
			mapEvent.data.id = i;

			$dataMap.events[i] = mapEvent.data;

			// add the event as a new game event
			console.log(`New event at index${i}`);
			this._events[i] = new Game_Event(mapEvent.data.mapId, i);
			i++;
		}
	});
	this.refreshTileEvents()
};
