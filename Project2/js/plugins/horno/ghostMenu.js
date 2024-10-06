MATTIE.ghostsAPI = {};

MATTIE.ghostsAPI.randomGhosts = [
    {
        "name": "Sarah",
        "type": "Victorian Mansion",
        "power": 3,
        "desc": "A lovelorn spirit searching \nfor lost love.",
        "id": "G - 53252",
        "description": "Sarah, the ghost of an abandoned Victorian-era\nmansion, roams the halls eternally searching \nfor her lost love who never returned from war,\nher melancholic wails echoing through the \nempty rooms."
    },
    {
        "name": "Captain Blackwood",
        "type": "Shipwreck Shore",
        "power": 4,
        "desc": "A spectral captain mourning his lost crew and treasure.",
        "id": "G - 53253",
        "description": "The spectral figure of Captain Blackwood \nhaunts the shores where his ship \nsank in a storm, forever lamenting the \ncrew he couldn't save and the treasure \nlost to the depths."
    },
    {
        "name": "Emily",
        "type": "Burnt Family Home",
        "power": 2,
        "desc": "A child ghost mourning her lost childhood.",
        "id": "G - 53254",
        "description": "Emily, a young girl who perished in a tragic \nfire, wanders the charred remains of \nher family home, her laughter now replaced \nby mournful whispers as she yearns \nfor the childhood she never got to \nlive."
    },
    {
        "name": "Samuel",
        "type": "Abandoned Company",
        "power": 5,
        "desc": "A betrayed businessman seeking vengeance.",
        "id": "G - 53255",
        "description": "The ghostly apparition of Samuel, \na betrayed businessman, lurks in the shadows of \nthe company he built, seeking vengeance on \nthose who conspired against him and \nleft him destitute in life and \ndeath."
    },
    {
        "name": "Eleanor",
        "type": "Haunted Manor",
        "power": 1,
        "desc": "A lady seeking revenge on her unfaithful lover.",
        "id": "G - 53256",
        "description": "Eleanor, a lady of the manor who died \nunder mysterious circumstances, haunts the \nestate's grand ballroom, forever \ntrapped in a phantom dance with the \nlover who betrayed her."
    },
    {
        "name": "Jasper",
        "type": "Abandoned Carnival",
        "power": 0,
        "desc": "A mischievous jester playing pranks.",
        "id": "G - 53257",
        "description": "The ghost of a mischievous jester named \nJasper roams the abandoned carnival \ngrounds, playing pranks on \nany who dare to trespass on \nthe land where he met his \nuntimely demise."
    },
    {
        "name": "Thomas",
        "type": "Haunted Lighthouse",
        "power": 3,
        "desc": "A guilt-ridden keeper warning of danger.",
        "id": "G - 53258",
        "description": "Thomas, a former lighthouse keeper, \nmanifests as a spectral beacon atop the \ncliffside tower, his restless spirit \ndriven by the guilt of failing \nto prevent a shipwreck that claimed \ncountless lives."
    },
    {
        "name": "Maria",
        "type": "Moonlit Cemetery",
        "power": 4,
        "desc": "A jilted bride searching for closure.",
        "id": "G - 53259",
        "description": "Maria, a forlorn bride left at \nthe altar, wanders the moonlit \ncemetery where she was buried \nin her wedding dress, her \nghostly sobs echoing among \nthe gravestones as she searches \nfor closure."
    },
    {
        "name": "William",
        "type": "Battlefield",
        "power": 2,
        "desc": "A tormented soldier haunted by war.",
        "id": "G - 53260",
        "description": "The ghost of a restless \nsoldier named William wanders \nthe battleground where he fell \nin a long-forgotten war, \nforever haunted by the horrors \nhe witnessed and the comrades \nhe couldn't save."
    },
    {
        "name": "Agatha",
        "type": "Haunted Forest",
        "power": 5,
        "desc": "A vengeful witch cursing intruders.",
        "id": "G - 53261",
        "description": "The ghost of a vengeful witch \nnamed Agatha prowls the \nmist-shrouded forest where she was \nunjustly executed, cursing those who \ndare to disturb her eternal slumber \nwith the wrath of her spectral \nfamiliars."
    }
]


/**
 * @description create a new ghost
 * @param {*} ghostName 
 * @param {*} type 
 * @param {*} power 
 * @param {*} desc 
 * @param {*} id 
 */
// example: MATTIE.ghostsAPI.spawnGhost("CoolName","Specter",3,"named jeff","G - 63463");
MATTIE.ghostsAPI.spawnGhost = (ghostName, type, power, desc,id,helpText) =>{
    $gameSystem.ghosts.push({
        "name":ghostName,
        "type":type,
        "power":power,
        "desc":desc,
        "id":id,
        "description":helpText
    })
}

/**
 * @description remove a ghost with the id equal to the passed id and return the ghost
 * @param {*} id 
 * @returns 
 */
MATTIE.ghostsAPI.removeGhost = (id) =>{
    for (let index = 0; index < $gameSystem.ghosts.length; index++) {
        const ghost = $gameSystem.ghosts[index];
        if(ghost.id === id){
            $gameSystem.ghosts.splice(index, 1);
            return ghost
        }
        
    }
}


(()=>{
    const onMapLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function () {
        onMapLoaded.call(this);
		if(!$gameSystem.ghosts) $gameSystem.ghosts=[];
        if(!$gameSystem.ghostPower) $gameSystem.ghostPower=0;
        if(!$gameSystem.ghostLampPower) $gameSystem.ghostLampPower=0;
        
    }
})();


function Window_Ghosts() {
    this.initialize.apply(this, arguments);
}

Window_Ghosts.prototype = Object.create(Window_ItemList.prototype);
Window_Ghosts.prototype.constructor = Window_Ghosts;

Window_Ghosts.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
};

Window_Ghosts.prototype.makeItemList = function() {
    this._data = $gameSystem.ghosts;
};

Window_Ghosts.prototype.drawItem = function(index) {
    var item = this._data[index];
    //console.log(item);
    if (item) {
        var rect = this.itemRect(index);
        this._data[index].itemInfo = MATTIE.iteminfoGraphics(rect.x, rect.y, rect.width, rect.height, item.power, item.type, item.name, item.desc, item.id, "Power:", "Type:");
        this.addChild(this._data[index].itemInfo)
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.changePaintOpacity(1);
        this.changeTextColor("#081e8a")
    }
};

Window_Ghosts.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

Window_Ghosts.prototype.isCurrentItemEnabled = function() {
    return true;
};


function Scene_Ghost() {
    this.initialize.apply(this, arguments);
}

Scene_Ghost.prototype = Object.create(Scene_Item.prototype);
Scene_Ghost.prototype.constructor = Scene_Ghost;

Scene_Ghost.prototype.initialize = function() {
    Scene_Item.prototype.initialize.call(this);
};

Scene_Ghost.prototype.displayChoices = function(){
    let cbs = [];
    let choices = [];
    if($gameParty.hasItem(MATTIE.static.items.ghostGun, true)){
        choices.push("feed the ghost gun")
        cbs.push(()=>{
            $gameSystem.ghostPower+=this._itemWindow.item().power;
            MATTIE.msgAPI.displayMsg(`You stuff the ghost into the gun\nThe gun now has ${$gameSystem.ghostPower} ghost power\n`)
        })
    }

    if($gameParty.hasItem(MATTIE.static.items.ghostLamp, true)){
        choices.push("feed the lamp")
        cbs.push(()=>{
            $gameSystem.ghostLampPower+=this._itemWindow.item().power;
            MATTIE.msgAPI.displayMsg(`You stuff the ghost into the Lamp\nThe lamp now has ${$gameSystem.ghostLampPower} ghost power\n`)
        })
    }

    choices.push("set free")
    cbs.push(()=>{
        MATTIE.msgAPI.displayMsg(`The ghost escapes into the air.`)
        if(MATTIE.util.randChance(.5)){
            MATTIE.msgAPI.displayMsg(`It vanishes into a bright white light`);
        }else {
            MATTIE.msgAPI.displayMsg(`A pit opens from the ground and swallows the spirit.\n`);
        }
    })

    choices.push("consume")
    cbs.push(()=>{
        MATTIE.msgAPI.displayMsg(`You grab the spirit in your hand and take a bite out of\nit.`)
        MATTIE.msgAPI.displayMsg(`You feel stronger`);
        //TODO: add mechanic here
    })

    choices.push("cancel")
    cbs.push(()=>{})

    let cancelIndex = choices.length-1;

    MATTIE.msgAPI.showChoices(choices,0,cancelIndex,(n)=>{
        cbs[n]();
        if(n!=3){
            MATTIE.ghostsAPI.removeGhost(this._itemWindow.item().id);
        }
    })
}

Scene_Ghost.prototype.onItemOk = function() {
    // if($gameParty.hasItem($dataItems[MATTIE.static.items.ghostGun]))
    SceneManager.push(Scene_Map);
    this.displayChoices();
    
};

Scene_Ghost.prototype.createItemWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_Ghosts(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);

    this._itemWindow.activate();
    this._itemWindow.setCategory('all');
    this._itemWindow.selectLast();
};



function Scene_Ghost_Load() {
    this.initialize.apply(this, arguments);
}

Scene_Ghost_Load.prototype = Object.create(Scene_Ghost.prototype);
Scene_Ghost_Load.prototype.constructor = Scene_Ghost_Load;

Scene_Ghost_Load.prototype.initialize = function() {
    Scene_Ghost.prototype.initialize.call(this);
};

Scene_Ghost_Load.prototype.onItemOk = function() {
    SceneManager.pop();
    this.displayChoices();
}