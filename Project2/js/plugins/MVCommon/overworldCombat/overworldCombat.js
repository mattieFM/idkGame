var MATTIE = MATTIE || {};

/**
 * tp in direction you are facing
 * @param {*} n 
 * @param {*} transfer 
 */
const rollAnimationID = 9;
const shootAnimationID = 10;
const jumpAnimationID = 51;
let rollInt;
let swingInt;
Game_Player.prototype.isRolling = function () {
    return this.rolling;
}
Game_Player.prototype.ROLL = function (n = .17, ticks = 8) {
    if (!this.rolling) {
        this.rolling = true;
        const amount = n;
        const d = this.direction();


        this.requestAnimation(rollAnimationID);
        this.setTransparent(true)

        let x = 0;
        const prevSpeed = this.realMoveSpeed;
        let prevMoveByInput = this.moveByInput;
        this.moveByInput = () => false
        this.realMoveSpeed = () => 20;
        this.ticks = 0;
        rollInt = setInterval(() => {
            switch (d) {
                case 8: // up
                    if (this.canPass(this._x, this._y - amount))
                        this._y -= amount;
                    break;

                case 6: // right
                    if (this.canPass(this._x + amount, this._y))
                        this._x += amount;
                    break;

                case 4: // left
                    if (this.canPass(this._x - amount, this._y))
                        this._x -= amount;
                    break;
                case 2: // down
                    if (this.canPass(this._x, this._y + amount))
                        this._y += amount;
                    break;

                default:
                    break;
            }
            if (!this.isAnimationPlaying()) {
                this.realMoveSpeed = prevSpeed;
                this.rolling = false;
                this.moveByInput = prevMoveByInput;
                this.setTransparent(false)
                $gamePlayer.gatherFollowers()
                clearInterval(rollInt);
            }
        }, 20)
    }
};

Game_Player.prototype.SHOOT_ANIM = function () {
    this.requestAnimation(shootAnimationID);
}

Game_Player.prototype.projectile = function () {
    let weapon = $gamePlayer.getWeaponEquip();
    projectile = MATTIE.static.projectiles.bullet
    if (MATTIE.static.weapons.boomerangs.includes(weapon)) {
        projectile = MATTIE.static.projectiles.boomerang;
    } else if (MATTIE.static.weapons.guns.includes(weapon)) {
        projectile = MATTIE.static.projectiles.bullet;
    }
    return projectile;
}
Game_Player.prototype.SHOOT = function (ticks = 30, amount = .3) {
    if (!this.shooting) {
        this.shooting = true;
        spawnEvent(this.projectile(), 8, $gamePlayer.x, $gamePlayer.y, null).then(bulletMapEv => {
            console.log(bulletMapEv)
            let bullet = $gameMap.event(bulletMapEv.data.id)
            console.log(bullet)
            if (bullet) {
                this.bulletTicks = 0;
                bullet._moveSpeed = 10;
                let int = setInterval(() => {
                    const d = Input.dir8 || this.direction();
                    switch (d) {
                        case 9: // up right
                            //if (this.canPass(this._x, this._y - amount))
                            bullet._y -= amount;
                            bullet._x += amount;
                            break;
                        case 8: // up
                            //if (this.canPass(this._x, this._y - amount))
                            bullet._y -= amount;
                            break;
                        case 7: // up left
                            //if (this.canPass(this._x, this._y - amount))
                            bullet._y -= amount;
                            bullet._x -= amount;
                            break;
                        case 6: // right
                            //if (this.canPass(this._x + amount, this._y))
                            bullet._x += amount;
                            break;
                        case 4: // left
                            //if (this.canPass(this._x - amount, this._y))
                            bullet._x -= amount;
                            break;
                        case 3: // down right
                            //if (this.canPass(this._x, this._y + amount))
                            bullet._y += amount;
                            bullet._x += amount;
                            break;
                        case 2: // down
                            //if (this.canPass(this._x, this._y + amount))
                            bullet._y += amount;
                            break;
                        case 1: // down left
                            //if (this.canPass(this._x, this._y + amount))
                            bullet._y += amount;
                            bullet._x -= amount;
                            break;
                        default:
                            break;
                    }
                    let target = findAttackableEventsWithinX(10)[0]
                    if (target) {
                        approachPlayer.call(bullet, target, -.5, .5);
                        if (bullet.distanceToPlayer(target) < 1) {
                            target.hit();
                            bulletMapEv.delete();
                            clearInterval(int);
                            this.shooting = false;
                        }
                    }
                    if (this.bulletTicks++ > ticks) {
                        bulletMapEv.delete();
                        clearInterval(int);
                        this.shooting = false;
                    }
                }, 20)
            }

        })
        // $gameMap._interpreter.setWaitMode("movie")
        // Graphics.playVideo('movies/' +"shootAnim.mp4")




    }

};

function findAngle(gamePlayerX, gamePlayerY, targetX, targetY) {
    // Calculate the dot product of the vectors
    let dotProduct = (gamePlayerX * targetX) + (gamePlayerY * targetY);

    // Calculate the magnitudes (lengths) of the vectors
    let magnitudeA = Math.sqrt(gamePlayerX * gamePlayerX + gamePlayerY * gamePlayerY);
    let magnitudeB = Math.sqrt(targetX * targetX + targetY * targetY);

    // Calculate the cosine of the angle
    let cosTheta = dotProduct / (magnitudeA * magnitudeB);

    // Calculate the angle in radians
    let angleRadians = Math.acos(cosTheta);

    // Convert the angle to degrees
    let angleDegrees = angleRadians * (180 / Math.PI);

    return angleDegrees;
}

function findLocalAngle(gamePlayerX, gamePlayerY, targetX, targetY) {
    // Calculate the difference in coordinates
    let deltaX = targetX - gamePlayerX;
    let deltaY = targetY - gamePlayerY;

    // Calculate the angle in radians using atan2
    let angleRadians = Math.atan2(deltaY, deltaX);

    // Convert the angle to degrees
    let angleDegrees = angleRadians * (180 / Math.PI);

    // Ensure the angle is positive (0 to 360 degrees)
    if (angleDegrees < 0) {
        angleDegrees += 360;
    }

    return angleDegrees;
}

Game_Event.prototype.SWING_WEAPON = function (prefabID = null, amount = .1) {
    if (prefabID == null) {
        prefabID = this.WEAPON().prefabID;
    }
    if (!this.swinging) {
        this.swinging = true;

        //this.requestAnimation(shootAnimationID);
        if (this instanceof Game_Event) {
            this.requestAnimation(MATTIE.static.alertAnim);
        }
        setTimeout(() => {
            spawnEvent(prefabID, 8, this.x, this.y, null).then(swordMapEv => {

                let sword = $gameMap.event(swordMapEv.data.id)
                sword._moveSpeed = 20;
                console.log(sword)
                if (sword) {

                    swingInt = setInterval(() => {
                        const d = this.direction();
                        let targetY = this.y;
                        let targetX = this.x;
                        //sword.setPivotPoint([0,1,0])
                        switch (d) {
                            case 9: // up right
                                //if (this.canPass(this._x, this._y - amount))
                                targetY = this.y - amount;
                                targetX = this.x + amount;
                                break;
                            case 8: // up
                                //if (this.canPass(this._x, this._y - amount))
                                targetY = this.y - amount;
                                break;
                            case 7: // up left
                                //if (this.canPass(this._x, this._y - amount))
                                targetY = this.y - amount;
                                targetX = this.x - amount;
                                break;
                            case 6: // right
                                //if (this.canPass(this._x + amount, this._y))
                                targetX = this.x + amount;
                                break;
                            case 4: // left
                                //if (this.canPass(this._x - amount, this._y))
                                targetX = this.x - amount;
                                break;
                            case 3: // down right
                                //if (this.canPass(this._x, this._y + amount))
                                targetY = this.y + amount;
                                targetX = this.x + amount;
                                break;
                            case 2: // down
                                //if (this.canPass(this._x, this._y + amount))
                                targetY = this.y + amount;
                                break;
                            case 1: // down left
                                //if (this.canPass(this._x, this._y + amount))
                                targetY = this.y + amount;
                                targetX = this.x - amount;
                                break;

                            default:
                                break;
                        }

                        sword._y = this.y + 1
                        sword._x = this.x
                        if(sword.mv3d_sprite && sword.mv3d_sprite.model && sword.mv3d_sprite.model.mesh)
                        sword.mv3d_sprite.model.mesh.yaw = 75 - findLocalAngle(this.x, this.y, targetX, targetY);
                    }, 40)

                    setTimeout(() => {
                        meleeAttack.call(this);
                    }, 100)

                    setTimeout(() => {
                        clearInterval(swingInt);
                        swordMapEv.delete();
                        this.swinging = false;
                    }, 800);
                }
            })
        }, (this instanceof Game_Event) ? 600 : 0);
    }

};

/**
 * @description get distance to player
 * @param {*} player 
 */
Game_Event.prototype.distanceToPlayer = function (player = $gamePlayer) {
    return Math.abs(player._x - this._x) + Math.abs(player._y - this._y);
}

Game_Player.prototype.SWING_WEAPON = Game_Event.prototype.SWING_WEAPON;

Input.addKeyBind('c', () => {
    $gamePlayer.ROLL()
}, 'ROLL', 1, 'c', 'c');

class EnemyWeapon {
    constructor(prefabID, damage = 20, range = 2) {
        this.prefabID = prefabID;
        this.damage = damage;
        this.range = range;
    }
}

class SpellAttack {
    constructor(selfAnimationId, targetAnimationId, damage = 20, range = 2,mana=10, targetCb=undefined,selfCb=undefined) {
        if(!targetCb)targetCb="((target)=>{})"
        if(!selfCb)selfCb="((target)=>{})"
        this.selfAnimationId = selfAnimationId;
        this.targetAnimationId = targetAnimationId;
        this.damage = damage;
        this.range = range;
        this.mana=mana;
        /** the name of a function that will be passed the id of the event the spell is hitting. */
        this.targetCb=targetCb;
        this.selfCb=selfCb;
    }
}

/**
 * @description return the prefabId of the Weapon Object that this enemy uses
 */
Game_Event.prototype.WEAPON = function () {
    let weapon = new EnemyWeapon(
        parseInt(this.getNoteValue("weapon", MATTIE.static.prefabs.sword)),
        parseInt(this.getNoteValue("damage", MATTIE.static.enemyBaseDmg))
    )
    return weapon;
}

/**
 * @description return the prefabId of the Weapon Object that this enemy uses
 */
Game_Player.prototype.WEAPON = function () {
    let prefab;
    let weapon = $gamePlayer.getWeaponEquip();
    let range = 2;
    if (MATTIE.static.weapons.swords.includes(weapon)) {
        prefab = MATTIE.static.prefabs.sword;
    } else if (MATTIE.static.weapons.axes.includes(weapon)) {
        prefab = MATTIE.static.prefabs.axe;
    } else if (MATTIE.static.weapons.staffs.includes(weapon)) {
        prefab = MATTIE.static.prefabs.staff;
    } else if (MATTIE.static.weapons.bigSwords.includes(weapon)) {
        prefab = MATTIE.static.prefabs.greatSword;
        range = 4;
    } else if (MATTIE.static.weapons.quills.includes(weapon)) {
        prefab = MATTIE.static.prefabs.quill;
    } else if (MATTIE.static.weapons.r2d2.includes(weapon)) {
        prefab = MATTIE.static.prefabs.r2d2;
    } else if (MATTIE.static.weapons.boomerangs.includes(weapon)) {
        prefab = MATTIE.static.prefabs.boomerang;
    } else if (MATTIE.static.weapons.wandOfScream.includes(weapon)) {
        prefab = MATTIE.static.prefabs.wandOfScream;
    } else if (MATTIE.static.weapons.guns.includes(weapon)) {
        prefab = MATTIE.static.prefabs.gun;
    } else {
        prefab = MATTIE.static.prefabs.fist;
    }
    return new EnemyWeapon(prefab, 0, range);
}

Game_Player.prototype.SPELL = function () {
    let equippedSpell = this.getSpellEquip();
    let spell = null;
    if (equippedSpell && equippedSpell.note) {
        spell = new SpellAttack(
            parseInt(equippedSpell.note.split(`<self:`)[1].split(">")[0]),
            parseInt(equippedSpell.note.split(`<target:`)[1].split(">")[0]),
            $gamePlayer.mat,
            parseInt(equippedSpell.note.split(`<range:`)[1].split(">")[0]),
            parseInt(equippedSpell.note.split(`<mana:`)[1].split(">")[0]),
            equippedSpell.note.split(`<targetCb:`)[1]?equippedSpell.note.split(`<targetCb:`)[1].split(">")[0]:undefined,
            equippedSpell.note.split(`<selfCb:`)[1]?equippedSpell.note.split(`<selfCb:`)[1].split(">")[0]:undefined
        )
    }
    return spell;
}

/**
 * @description perform a melee attack with anim
 * @param {*} anim 
 */
function meleeAttack(anim = MATTIE.static.hitAnimId) {
    if (this instanceof Game_Player) {
        let target = findAttackableEventsWithinX(this.WEAPON().range)[0];
        if (target) {
            target.hit();
        }
    } else {
        if (this.distanceToPlayer() < this.WEAPON().range && !$gamePlayer.isRolling()) {
            let leader = $gameParty.leader();
            leader.setHp(leader.hp - this.WEAPON().damage);
            $gamePlayer.requestAnimation(anim);
        }
    }

}

Game_Event.prototype.hit = function (anim = MATTIE.static.hitAnimId) {
    this.setHp(this.getHp() - $gameParty.leader().atk);
    $gameParty.leader().setMp(Math.ceil($gameParty.leader().mp+$gameParty.leader().atk*MATTIE.static.playerStats.manaRegainedFromHittingFactor))
    this.requestAnimation(anim);
}

function spellAttack() {
    let spell = this.SPELL();
    if (spell) {
        if(spell.mana < $gameParty.leader().mp){
            eval(`${spell.selfCb}()`);
            $gameParty.leader().setMp($gameParty.leader().mp-spell.mana)
            $gamePlayer.requestAnimation(spell.selfAnimationId)
            findAttackableEventsWithinX(spell.range).forEach(target => {
                if (target) {
                    eval(`${spell.targetCb}(${target._eventId})`);
                    target.setHp(target.getHp() - $gameParty.leader().mat);
                    target.requestAnimation(spell.targetAnimationId);
                }
            })
        }
        
    } else {
        MATTIE.msgAPI.displayMsg(`You must equip a spell first\nYou remember leaving a fire spell in your house.`)
    }


}

/**
 * 
 * @returns the id of the item weapon equiped
 */
Game_Player.prototype.getWeaponEquip = function () {
    return $gameParty.leader()._equips[0]._itemId;
}

/**
 * 
 * @returns the id of the spell weapon equiped
 */
Game_Player.prototype.getSpellEquip = function () {
    return $dataArmors[$gameParty.leader()._equips[1]._itemId];
}

Input.addKeyBind('f', () => {
    if (MATTIE.static.weapons.projectileWeapons.includes($gamePlayer.getWeaponEquip())) {
        $gamePlayer.SWING_WEAPON(1);
        $gamePlayer.SHOOT();
    } else {
        $gamePlayer.SWING_WEAPON(1);
    }
}, 'FIGHT', 1, 'f', 'f');

Input.addKeyBind('v', () => {
    $gamePlayer.jumpAtHeight(2, 10, 20)
}, 'JUMP', 1, 'v', 'v');

Input.addKeyBind('r', () => {
    spellAttack.call($gamePlayer);
}, 'SPELL1', 1, 'r', 'r');

/**
 * a simple helperfunction to define dicts to store things in if they dont exist
 */
Game_Event.prototype.initIfNotHp = function () {
    if (!$gameSystem.hps) {
        $gameSystem.hps = {}
    }
    if (!$gameSystem.hps[this._mapId]) {
        $gameSystem.hps[this._mapId] = {}
    }
}

/**
 * 
 * @returns if "<canBeHit>" is in notes 
 */
Game_Event.prototype.canBeHit = function () {
    return this.event().note.includes("<canBeHit>");
}

/**
 * 
 * @param {string} key the key IE: <key:value> to retrive from notes or comments
 * @param {*} defaultVal 
 * @returns 
 */
Game_Event.prototype.getNoteValue = function (key, defaultVal) {
    let note = this.event().note;
    let comments = MATTIE.util.getAllEventComments(this._eventId);
    let all = [note, ...comments];
    let val;

    let filtered = all.filter(text => text.includes(`<${key}:`));
    if (filtered.length > 0) {
        val = filtered[0].split(`<${key}:`)[1].split(">")[0];
    } else {
        val = defaultVal
    }
    return val
}

/**
 * 
 * @returns the id of the death animation specified by
 * <deaathId:4>
 * else the default one in static
 */
Game_Event.prototype.deathAnimation = function () {
    let id;
    try {
        id = parseFloat(this.getNoteValue("deathId"));
    } catch (error) {
        id = MATTIE.static.deathAnimId;
    }
    return id
}

/**
 * simple helper function, wait till an animation is not longer playing then call the cb
 * @param {*} cb 
 */
Game_Event.prototype.waitTillAnimNotPlaying = function (cb) {
    let int = setInterval(() => {
        if (!this.isAnimationPlaying()) {
            clearInterval(int);
            cb();
        }
    }, 20);
}

/**
 * play the onDeath notes command if one exists
 * IE: <onDeath:console.log("ill play this")>
 */
Game_Event.prototype.onDeath = function () {
    try {
        cmd = this.getNoteValue("onDeath");
        if (cmd) eval(cmd);
    } catch (error) {
        console.log('tried to run on death cmd')
        console.log(error)
    }
}

/**
 * kill this event (for overworld combat)
 * this will play the callback included in
 * <onDeath:console.log("ill play this")>
 */
Game_Event.prototype.die = function () {
    this.waitTillAnimNotPlaying(() => {
        this.requestAnimation(this.deathAnimation());
        setTimeout(() => {
            this.waitTillAnimNotPlaying(() => {
                this.onDeath();
                this.erase();
            })
        }, 300);
    })
}

/**
 * @returns the saved hp value from $gameSystem
 */
Game_Event.prototype.getStoredHp = function () {
    this.initIfNotHp();
    return $gameSystem.hps[this._mapId][this._eventId];
}

/**
 * get the hp of this event (for overworld combat)
 * @param {number} hp 
 */
Game_Event.prototype.getHp = function () {
    this.initIfNotHp()
    this.setHp(this.getStoredHp() || parseFloat(this.getNoteValue("hp")))
    return this.hp;
}

/**
 * set the hp of this event (for overworld combat)
 * @param {number} hp 
 */
Game_Event.prototype.setHp = function (hp) {
    let oldHp = this.hp;
    this.hp = hp;
    this.initIfNotHp()
    $gameSystem.hps[this._mapId][this._eventId] = hp;

    //no dieing twice, events are now shadows they do not live twice.
    if (hp < 0 && oldHp > 0) {
        this.die();
    }
}


//override the refresf function making it so they will be ereased if they are dead
Game_Event.prototype.refresh = function () {
    var newPageIndex = (this._erased || this.canBeHit() && this.getHp() <= 0) ? -1 : this.findProperPageIndex();
    if (this._pageIndex !== newPageIndex) {
        this._pageIndex = newPageIndex;
        this.setupPage();
    }
};

/**
 * run the command in
 * <combat:console.log("combatFunc")>
 */
Game_Event.prototype.runCombatFunc = function () {
    try {
        cmd = this.getNoteValue("combat");
        if (cmd) eval(cmd);
    } catch (error) {
        // console.log('tried to run combat cmd')
        // console.log(error)
    }
}

/**
 * @description true if this entity should still be doing combat things IE: alive and able to be killed in overworld
 * @returns 
 */
Game_Event.prototype.isCombatAlive = function () {
    return (!this._erased && this.canBeHit() && this.getHp() > 0)
}

Game_Event.prototype.overworldCombatUpdate = function () {
    if (this.isCombatAlive()) this.runCombatFunc();
}
//--------
//Add a step to update for calling the overworld combat update
//--------
const Game_Event_Update_Base = Game_Event.prototype.update;
Game_Event.prototype.update = function () {
    Game_Event_Update_Base.call(this);
    this.overworldCombatUpdate();
};