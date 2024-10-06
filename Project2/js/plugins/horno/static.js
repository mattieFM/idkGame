MATTIE.static = {
    prefabWorldId:8,
    states:{
        barterTarget:4,
        obamaTarget:7,
        redTheObominomicon:8,
        nulNarSon:6,
        nulNarTarget:5,
        droppedWeapon:11,
        genericTarget:13,
    },
    vars:{
        reservedForUseInScripts:6,
        forgetMother:12
    },
    switches:{
        seeGhosts:19
    },
    prefabs:{
        sword:20,
        axe:21,
        staff:22,
        gun:23,
        greatSword:24,
        fist:0,
        quill:26,
        r2d2:27,
        boomerang:28,
        wandOfScream:29
    },
    weapons:{
        projectileWeapons:[],
        guns:[9,5],
        swords:[6],
        bigSwords:[7],
        staffs:[],
        axes:[],
        quills:[4],
        r2d2:[1],
        boomerangs:[2],
        wandOfScream:[3]

    },
    projectiles:{
        bullet:19,
        boomerang:28,
    },
    animations:{
        fireSelf:49,
        fireEnemy:66,
    },
    playerStats:{
        /**the atk is multiplied by this to restore mana per hit */
        manaRegainedFromHittingFactor:.2
    }
    
}

MATTIE.static.weapons.projectileWeapons = [...MATTIE.static.weapons.guns, ...MATTIE.static.weapons.boomerangs]

/**
 * list of common event ids, use $gameTemp.reserveCommonEvent to call these
 */
MATTIE.static.commonEvents = {};
/** @description the command for putting out the torch */
MATTIE.static.commonEvents.putOutTorch=32;
/** prefabs for all hats */
MATTIE.static.hats =
{
    
}

setTimeout(() => {
    /** obj of items */
    MATTIE.static.items = {};
    /** the itembase of the ghost gun weapon id 5 */
    MATTIE.static.items.ghostGun = $dataWeapons[5]; 
    MATTIE.static.items.ghostLamp= $dataItems[1]; 
}, 5000);


//hat of ghostly permanance
MATTIE.static.hats.seeGhostsHat = {id:1,mapId:MATTIE.static.prefabWorldId}

//hat of see no ghost
MATTIE.static.hats.bitchHat = {id:2,mapId:MATTIE.static.prefabWorldId}

//hat of ????
MATTIE.static.hats.scaryScull = {id:3,mapId:MATTIE.static.prefabWorldId}

/** the base damage of enemies if none was provided */
MATTIE.static.enemyBaseDmg=20;

// commandIds
MATTIE.static.commands = {};
MATTIE.static.hitAnimId=1;
MATTIE.static.fireSpellAnimation=66
MATTIE.static.deathAnimId=5;
MATTIE.static.alertAnim=121;
MATTIE.static.commands.transferId = 201;
MATTIE.static.commands.battleProcessingId = 301;
MATTIE.static.commands.ifWin = 601;
MATTIE.static.commands.selfSwitch = 123;
MATTIE.static.commands.commonEventid = 117;
/** @description the id of the show choices command */
MATTIE.static.commands.showChoices = 102;
/** @description the id of the comment command */
MATTIE.static.commands.commentId = 108;
/** @description the id of the when command */
MATTIE.static.commands.when = 402;
/** @description the id of the script command */
MATTIE.static.commands.script = 355;