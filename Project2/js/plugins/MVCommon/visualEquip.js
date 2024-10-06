/**=======================
 * 
 * A plugin built to allow modular sprites and such for instance allowing hats or armor and things to be applied to an existing sprite. 
 *  
 *========================**/


Sprite_Character.prototype.createOverlays = function() {

    
};

//todo: fix hats stuttering if someone is slow

const temp = function(){
    SceneManager._scene._spriteset._characterSprites.forEach(e=>e.createOverlays())
}

MATTIE.visualEquip = {};


// //hat logic
MapEvent.prototype = Object.assign(MapEvent.prototype, Game_CharacterBase.prototype)
Object.defineProperty(MapEvent.prototype, 'mv3d_data', {
    get() {var _this$_mv3d_data;
      (_this$_mv3d_data = this._mv3d_data) !== null && _this$_mv3d_data !== void 0 ? _this$_mv3d_data : this._mv3d_data = {};
      return this._mv3d_data;
    } });
  
  Object.defineProperty(MapEvent.prototype, 'mv3d_temp', {
    get() {
      if (!Object.hasOwn(this, 'mv3d_temp')) Object.defineProperty(this, 'mv3d_temp', {
        value: {},
        enumerable: false,
        configurable: true });
  
      return this.mv3d_temp;
    },
    enumerable: false,
    configurable: true });



MATTIE.visualEquip.despawnHat = function(){
    if(MATTIE.hat){
        const ev = $gameMap.event( MATTIE.hat.data.id);
        if(ev){
            ev.locate(0,0);
            ev.update();
            ev.refresh();
        }

        MATTIE.hat.removeThisEvent();
    }

    
    //MATTIE.hat.mv3d_sprite.dispose();
}

MATTIE.visualEquip.objsQuedForDisposal = {};

const baseOnLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    console.log("Here");
    baseOnLoad.call(this);
    for (let index = 0; index < $gameMap._events.length; index++) {
        const char = $gameMap._events[index];
        if(char){
            if(char.eventId){
                 //TODO: figure out a way to not duplicate hats when menu is closed but also not delete them by accident
                 //this solution seems to be working. by calling it inside on map load rather than on create obj.
                 //not exactly sure why, but we heavily reduce its privalage and how many times it fires by putting it here,
                 //so it is entirely possible the bug still exists and just is rare but we arn't calling it much any more so it seems fixed?
                if(MATTIE.visualEquip.objsQuedForDisposal[char.eventId()]){
                    if(MATTIE.visualEquip.objsQuedForDisposal[char.eventId()].delete){
                        MATTIE.visualEquip.objsQuedForDisposal[char.eventId()].delete()
                    } else if(MATTIE.visualEquip.objsQuedForDisposal[char.eventId()].dispose){
                        MATTIE.visualEquip.objsQuedForDisposal[char.eventId()].dispose();
                    }
                    delete MATTIE.visualEquip.objsQuedForDisposal[char.eventId()];
                }
            }
        }
       
    }
};

const baseOnPerformTrans = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function() {
    MATTIE.visualEquip.objsQuedForDisposal = {};
    baseOnPerformTrans.call(this);
};

MATTIE.visualEquip.hatOffset=[.1,.1,.1,-.3];
MATTIE.visualEquip.note="<mv3d:shape(sprite),alphatest(1),height(-0.1),zoff(1.4),scale(.8),pass(*),DirFix(1)>";
MATTIE.visualEquip.spawnHat = function(eventId,mapId) {
    MATTIE.eventAPI.getEventOnMap(eventId, mapId).then(ev=>{
        let hat2= new MapEvent().copyActionsFromEventOnMap(eventId, mapId);
        hat2 = Object.assign(hat2, ev);
        hat2.setPersist(false);
        hat2.data.x=$gamePlayer.x
        hat2.data.y=$gamePlayer.y
        hat2._x=$gamePlayer.x
        hat2._y=$gamePlayer.y
        hat2._characterName = "items"
        hat2.data.note=MATTIE.visualEquip.note;
        //hat2.data.note="<mv3d:shape(sprite),alphatest(1),height(-0.1),zoff(-.2),doff(.7),scale(1.1),pass(*),DirFix(1)>";

        let wait = ()=>{
            setTimeout(()=>{
                if(SceneManager._scene instanceof Scene_Map){
                    hat2.spawn($gamePlayer.x,$gamePlayer.y)
                    MATTIE.hat = hat2;

                    hat2.atPlayerPos=true;
                    hat2.allMaps=true;

                    


                    //window.mv3d.createCharacterFor(hat2, 31);
                    setTimeout(() => {
                        MATTIE.hat.mv3d_sprite=window.mv3d.characters[window.mv3d.characters.length-1];  
                        MATTIE.visualEquip.objsQuedForDisposal[hat2.data.id] = MATTIE.hat.mv3d_sprite;
                    }, 500);
                } else {
                    wait()
                }
            },100)
        }
        wait();
    })
   
    
}

MATTIE.hatLocationUpdate = function (){
    if(MATTIE.hat){
        if(MATTIE.hat._x){
            setHatPos(MATTIE.visualEquip.hatOffset, MATTIE.hat.data.id, this._x, this._y)
        }
    }
}

const prev = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function (x) {
    prev.call(this,x);
    MATTIE.hatLocationUpdate();
}


//mv3d support
if(typeof window.mv3d != "undefined"){
    const baseGetConfig=mv3d.Character.prototype.getConfig;
    mv3d.Character.prototype.getConfig = function(conf, key, dfault) {
        let baseResult = baseGetConfig.call(this,conf,key,dfault);
        if(this._overrides){
            if(typeof this._overrides[key] != "undefined") {
                return this._overrides[key];
            }
        }
        
        return baseResult;
      }

    const prevCreateChar = window.mv3d.createCharacterFor;
    window.mv3d.createCharacterFor = function(char, order) {
        let baseOut = prevCreateChar.call(this,char,order);
        if(char.eventId){            
            if(MATTIE.eventAPI.dataEvents[char.eventId()]){
                if(char._characterName==MATTIE.eventAPI.dataEvents[char.eventId()]._characterName){
                    console.log(char)
                    console.log(MATTIE.eventAPI.dataEvents[char.eventId()])
                    MATTIE.visualEquip.objsQuedForDisposal[char.eventId()] = baseOut;
                }
            }   
        }
        
        
        return baseOut;
    };

}


setTimeout(() => {
    /** @description the base chance equip method */
    const baseChangeEquip = Game_Actor.prototype.changeEquip;
    /**
     * @description the overridden method to allow the meta <hat:id> tag.
     * @param {int} slotId
     * @param {rm.types.Item} item
     */
    Game_Actor.prototype.changeEquip = function (slotId, item) {
        const otherItem = this.equips()[slotId];
        baseChangeEquip.call(this, slotId, item);

        //unquip existing hat
        if(otherItem)
        if(otherItem.meta.hatId){
            MATTIE.visualEquip.despawnHat();
        }

        //equip new hat
        if(item)
        if(item.meta.hatId){
            //has hat tag
            //assumes hat is on prefab map
            MATTIE.visualEquip.spawnHat(item.meta.hatId, MATTIE.static.prefabWorldId)
        }
    };
}, 5000);


