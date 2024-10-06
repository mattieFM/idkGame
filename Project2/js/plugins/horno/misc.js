//FUNCTION for potion of delayed sneezing
function delayedSneeze(){
    setTimeout(()=>{MATTIE.msgAPI.displayMsg("Hachoooo!")}, MATTIE.util.randBetween(60000,(60000*5)));
}


//FUNCTION for forgetting mother
function forgetMother(){
    setTimeout(()=>{
        MATTIE.msgAPI.displayMsg("The candle went out...\nGood thing I don't have a \nMother.",0,2,"Actor1",0)
        $gameVariables.setValue(MATTIE.static.vars.forgetMother,1);
    }, MATTIE.util.randBetween(60000*2,(60000*5)));
}



let t= 0;
const prevMoveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function (x) {
    t+=.01;
    prevMoveStraight.call(this,x);
    if(MATTIE.lamp){
        MATTIE.lampEv=$gameMap.event(MATTIE.lamp.data.id)
        MATTIE.lampEv._x=$gamePlayer.x+MATTIE.util.lerpLoop(.8,1.4,t)
        MATTIE.lampEv._y=$gamePlayer.y+MATTIE.util.lerpLoop(.8,1.4,t)
    }
    if(t>2)t=0;
}

//FUNCTION to spawn ghost lantern
async function spawnGhostLantern(){
    if(MATTIE.lamp) despawnGhostLantern();
    let x = $gamePlayer.x;
    let y = $gamePlayer.y+1;
    MATTIE.lamp = await spawnEvent(8,MATTIE.static.prefabWorldId,x,y);
    MATTIE.lamp.allMaps=true;
}

function despawnGhostLantern(){
    MATTIE.lamp.delete();
    MATTIE.lamp=undefined;
    MATTIE.lampEv=undefined;
}


/**
 * @description find the first party member with the state
 * @param {*} id the state id
 * @returns {Game_Actor} the actor with the state.
 */
function findFirstPartyMemberWithState(id){
    return $gameParty.members().filter(member=>member.isStateAffected(id))[0] || ( $gameParty.inBattle() ? $gameTroop.members().filter(member=>member.isStateAffected(id))[0]: undefined);
}

function findAllPartyMemberWithState(id){
    return $gameParty.members().filter(member=>member.isStateAffected(id)) || ( $gameParty.inBattle() ? $gameTroop.members().filter(member=>member.isStateAffected(id)): undefined);
}

//FUNCTION for ghost gun losing power
function ghostGun(){
    if($gameSystem.ghostPower == 0){
        MATTIE.msgAPI.displayMsg(`The ghost gun has no ghosts to fire.`);
    } else {
        $gameSystem.ghostPower=$gameSystem.ghostPower/3;
        MATTIE.msgAPI.displayMsg(`The spirits fired from the gun burn up on impact.\nThe gun now has ${$gameSystem.ghostPower} ghost power.`);
    }
    
}


//FUNCTION for ghost gun
function loadGhostGun(){
    if($gameSystem.ghosts.length>0){
        SceneManager.push(Scene_Ghost_Load);
    } else {
        MATTIE.msgAPI.displayMsg(`You have no ghosts to load into the gun.`)
    }
    
}

//FUNCTION FOR reading the opbamanomicon
function readObama(){
    let targetActor = $gameParty.members().filter(member=>member.isStateAffected(MATTIE.static.states.obamaTarget))[0];
    let currentActor = $gameParty.members().filter(member=>member.isStateAffected(MATTIE.static.states.redTheObominomicon))[0];
    if(targetActor){
        if(!currentActor){
            $gameSystem.hasReadtheObamaBook=true;
            MATTIE.msgAPI.displayMsg(`${targetActor.name()} reads the obominomicon and feel all of its \nforbidden knowledge flow into them.\n`);
            MATTIE.msgAPI.displayMsg(`${targetActor.name()} learns previvify
${targetActor.name()} learns meturt'lation
${targetActor.name()} learns slurt
${targetActor.name()} learns Wondle's Heavy Hacky Sack`);
            MATTIE.msgAPI.displayMsg(`${targetActor.name()} learns chair puddle
${targetActor.name()} learns chimney ass`)
            targetActor.addState(MATTIE.static.states.redTheObominomicon);
            targetActor.removeState(MATTIE.static.states.obamaTarget);
        } else {
            MATTIE.msgAPI.displayMsg(`Limited Edition Obominomicon Already been red by \n${targetActor.name()}. Its pages are now blank.`);
        }
        
    }
}

//FUNCTION FOR nulNar potions.
function nulNar(){
    const targetActor = findFirstPartyMemberWithState(MATTIE.static.states.nulNarTarget);
    MATTIE.msgAPI.displayMsg("SOOO! You think you can just gain one of my\nSons' powers? Hmmm??? you think you can\nSteal their business acumen?\n",0,2,"5",3);
    MATTIE.msgAPI.displayMsg("well...",0,2,"5",3);
    MATTIE.msgAPI.displayMsg("you're right... You can. Im a ghost.\nHow could I stop you?",0,2,"5",3);
    MATTIE.msgAPI.displayMsg("You feel much better at bartering.");
    targetActor.addState(MATTIE.static.states.nulNarSon);
    targetActor.removeState(MATTIE.static.states.nulNarTarget);
}

//FUNCTION FOR bartering with enemy.
function barterEnemyForWeapon(){
    const targetActor = findFirstPartyMemberWithState(MATTIE.static.states.barterTarget);
    if(targetActor){
        console.log(targetActor);
        targetActor.removeState(MATTIE.static.states.barterTarget);
    }


    MATTIE.msgAPI.getNumberInput(1,"How much do you offer for their weapon?").then(val=>{
        if(!targetActor.barterAmount) targetActor.barterAmount=MATTIE.util.randBetween(0,9);
        console.log(`you offered ${val} enemy wanted ${targetActor.barterAmount}`)
        if(val==targetActor.barterAmount||val==MATTIE.util.randBetween(0,9)){
            console.log("enemy give you their weapon")
            setTimeout(() => {
                alert("The enemy agrees to give you their weapon");
                const param = targetActor.param;
                targetActor.addState(MATTIE.static.states.droppedWeapon);
            }, 1000);
           
        }else{
            setTimeout(() => {
                if(val<targetActor.barterAmount){
                    alert("The enemy wanted more! they reject your offer.");
                } else {
                    alert("The enemy wanted less! they reject your offer.");
                }
                
            }, 1000);
        }
    });
}


function setHatPos(additors, id, x = $gamePlayer._x, y = $gamePlayer._y){
    let d = $gamePlayer.direction();

    switch (d) {
        case 2: //+y
            y+=additors[0];
            break;
        case 4: // -x
            x-=additors[1];
            break;
        case 6: // +x
            x+=additors[2];
            break;
        case 8: //-y
            y-=additors[3];
            break; 
    
        default:
            break;
    }

    const ev = $gameMap.event(id);
    if(ev){
        if(!ev.hasTped){
            ev.hasTped=true
            ev.locate(x,y);
        }
       
        else{
            ev._x=x;
            ev._y=y;
        }
      
    }
    

    
}


//equipment stuffs

//banana milk chalice
let bananaLoaded=false;
function bananaMilkChaliceEquip(){
    $gameSystem.hasChaliceEquipped=true;
    bananaLoaded=true;
    MATTIE.msgAPI.displayMsg("Anything you drink now will taste like\nBanana milk.");
}

function bananaMilkChaliceUnequip(){
    $gameSystem.hasChaliceEquipped=false;
    bananaLoaded=false;
    MATTIE.msgAPI.displayMsg("Anything you drink now no longer taste like\nBanana milk.");
}

//ghost enable hat equip ghost hat, spectral perm, permance, see ghosts
function seeGhostsEquip(){
    MATTIE.msgAPI.displayMsg("For I moment I thought I saw a ghost\nProbably nothing...", 0, 2, "horno", 0);
    $gameSystem.equippedGhostHat=true;
    $gameSwitches.setValue(MATTIE.static.switches.seeGhosts, true);
}

//disable ghosts hat
//ghost enable hat equip ghost hat, spectral perm, permance, see ghosts
function disableGhostsEquip(){
    MATTIE.msgAPI.displayMsg("Finally.... The ghosts went away", 0, 2, "horno", 0);
    $gameSwitches.setValue(MATTIE.static.switches.seeGhosts, false);
}

function disableGhostsUnequip(){
    if($gameSystem.equippedGhostHat) {
        MATTIE.msgAPI.displayMsg("And so the ghosts return to me.", 0, 2, "horno", 0);
        $gameSwitches.setValue(MATTIE.static.switches.seeGhosts, true);
    }
}

const onMapLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function () {
		onMapLoaded.call(this);
		if($gameSystem.hasChaliceEquipped && !bananaLoaded){
            bananaMilkChaliceEquip();
        }
        setTimeout(() => {
            if($gameSystem.lampOn){
                if(MATTIE.lamp)
                if(MATTIE.lamp.data)
                if(MATTIE.lamp.data.id)
                Game_Interpreter.prototype.pluginCommand('mv3d', [`@e${MATTIE.lamp.data.id}`, "lamp","#faedbb",3,15]);
            }
        }, 500);
        

        // // fix speed of hat
        // if(MATTIE.hat) MATTIE.hat.moveSpeed = $gamePlayer.moveSpeed;
        // if(MATTIE.lamp) MATTIE.lamp.moveSpeed = $gamePlayer.moveSpeed;

    }

/**
 * tp in direction you are facing
 * @param {*} n 
 * @param {*} transfer 
 */
const PHASE = function (n, transfer = false) {
    const amount = n;
    const d = $gamePlayer.direction();

    let { x } = $gamePlayer;
    let { y } = $gamePlayer;
    switch (d) {
    case 8: // up
        y -= amount;
        break;

    case 6: // right
        x += amount;
        break;

    case 4: // left
        x -= amount;
        break;
    case 2: // down
        y += amount;
        break;

    default:
        break;
    }
    $gamePlayer.requestAnimation(256);
    if (!transfer) {
        $gamePlayer.locate(x, y);
    } else {
        $gamePlayer.reserveTransfer($gameMap.mapId(), x, y, d, 2);
    }
};




function silly(){
    // $gameMap.events().forEach(ev=>{
    //     if
    // })
    for (let index = 0; index < $dataAnimations.length; index++) {
        const id = index;
        setTimeout(() => {
            $gamePlayer.requestAnimation(id);
        }, 100*id);
        
        
    }
}

const baseCmd = Game_Interpreter.prototype.command301;

function tryToRun(){
    if(MATTIE.util.randChance(.5)){
        BattleManager.abort();
        Game_Interpreter.prototype.command301 = () => true;
        setTimeout(() => {
            Game_Interpreter.prototype.command301=baseCmd;
        }, 5000);
    }
}




function findAttackableEventsWithinX(x=2){
    return findEventsWithinXTiles(x).filter(event=>event.isCombatAlive())
}
// Function to find all events within 2 tiles of the player
function findEventsWithinXTiles(x=2) {
    const playerX = $gamePlayer._x; // Get player's X position
    const playerY = $gamePlayer._y; // Get player's Y position
    const eventsWithinRange = [];

    // Loop through all events on the current map
    $gameMap.events().forEach(event => {
        const eventX = event._x;
        const eventY = event._y;

        // Calculate the Manhattan distance (grid distance) between the player and the event
        const distance = Math.abs(playerX - eventX) + Math.abs(playerY - eventY);

        // If the distance is 2 tiles or less, add the event to the list
        if (distance <= x) {
            eventsWithinRange.push(event);
        }
    });

    return eventsWithinRange;
}