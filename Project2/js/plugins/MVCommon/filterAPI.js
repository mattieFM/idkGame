var MATTIE = MATTIE || {};


MATTIE.filterAPI = {};


/**
 * @description add a PIXI.js filter to the game map screen
 * @param {number} id the id of the filter (you define this) used for removing the filter later
 * @param {PIXI.Filter} filter the filter itself
 */
MATTIE.filterAPI.addFilterToGameMapScreen = (id, filter) =>{
    if(SceneManager._scene instanceof Scene_Map){
        let mapSprite = SceneManager._scene.children.filter(child=>child instanceof Spriteset_Map)[0];
        filter.id=id;
        if(!mapSprite.filters) mapSprite.filters = [];
        mapSprite.filters = [filter, ...mapSprite.filters];
    }  
}

/**
 * @description clear all filters applied to game map screen
 */
MATTIE.filterAPI.clearAllGameMapScreenFilters = () =>{
    if(SceneManager._scene instanceof Scene_Map){
        let mapSprite = SceneManager._scene.children.filter(child=>child instanceof Spriteset_Map)[0];
        mapSprite.filters = [];
    }  
}

MATTIE.filterAPI.addFilterToGameMapScreenDemo = () =>{
    MATTIE.filterAPI.addFilterToGameMapScreen(0, new PIXI.filters.NoiseFilter(1));
}