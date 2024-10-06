
var MATTIE = MATTIE || {};

Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    console.log(item);
    if (item) {
        var rect = this.itemRect(index);
        this._data[index].itemInfo = MATTIE.iteminfoGraphics(rect.x, rect.y, rect.width, rect.height, item.meta.retailprice, item.meta.wsnprice, item.name, item.meta.desc, item.meta.id);
        this.addChild(this._data[index].itemInfo)
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.changePaintOpacity(1);
        this.changeTextColor("#081e8a")
        this.drawItemNumber(item, rect.x, rect.height-50, rect.width);
    }
};
Window_ItemList.prototype.spacing = function() {
    return 20;
};
Window_ItemList.prototype.itemWidth = function() {
    return 122*2;
};

Window_ItemList.prototype.itemHeight = function() {
    return 128*3;
};

Window_ItemList.prototype.maxCols = function() {
    return 3;
};

Window_ItemList.prototype.clearItem = function(index) {
    var rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    if(this._data)
    if(this._data[index])
    if(this._data[index].itemInfo){
        this.removeChild(this._data[index].itemInfo);
    }
};



Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
        case "all":
            return true;
        case 'item':
            return DataManager.isItem(item) && item.itypeId === 1;
        case 'weapon':
            return DataManager.isWeapon(item);
        case 'armor':
            return DataManager.isArmor(item);
        case 'keyItem':
            return DataManager.isItem(item) && item.itypeId === 2;
        default:
            return false;
    }
};

Window_ItemList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems().filter(function(item) {
        return (this.includes(item) && item.name.length>1);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Scene_Item.prototype.createItemWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);

    this._itemWindow.activate();
    this._itemWindow.setCategory('all');
    this._itemWindow.selectLast();
  
};

Window_ItemList.prototype.refresh = function() {
    if(this._data)
    for (let index = 0; index < this._data.length; index++) {
        if(this._data[index])
        if(this._data[index].itemInfo)
        if(this._data[index].itemInfo){
            this.removeChild(this._data[index].itemInfo);
        }
    }

    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};


Window_EquipItem.prototype.itemWidth = function() {
    return 122*2;
};

Window_EquipItem.prototype.itemHeight = function() {
    return 128*2.3;
};

Window_EquipItem.prototype.itemHeight = function() {
    return 128*2.3;
};

Window_ItemList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = 'none';
    this._data = [];
};

Scene_Item.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    SceneManager.pop();
};


Scene_Equip.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._helpWindow = new Window_Help();
    this._helpWindow.height = 0;
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
};


Scene_Item.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ItemCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._helpWindow.height;
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this._categoryWindow.height=0;
    this._categoryWindow.activate=()=>{this._itemWindow.activate()}
    //this.addWindow(this._categoryWindow);
};


//new help menu for horno
Scene_Item.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help_Horno();
    this.addWindow(this._helpWindow);
};

function Window_Help_Horno() {
    this.initialize.apply(this, arguments);
}

Window_Help_Horno.prototype = Object.create(Window_Base.prototype);
Window_Help_Horno.prototype.constructor = Window_Help_Horno;

Window_Help_Horno.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2)*1.8;
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';

    this.drawIcon(2,0,0)
    const banner = new Sprite(ImageManager.loadPicture("banner"));
    this._icon = new Window_Single_Icon()
    this._textZone = new Window_Base( 450, 10, 350, 183)
    Window_Base.prototype.drawTextEx = function(text, x, y) {
        text = "\\}\\}"+text
        if (text) {
            var textState = { index: 0, x: x, y: y, left: x };
            textState.text = this.convertEscapeCharacters(text);
            textState.height = this.calcTextHeight(textState, false);
            this.resetFontSettings();
            while (textState.index < textState.text.length) {
                this.processCharacter(textState);
            }
            return textState.x - x;
        } else {
            return 0;
        }
    };

    this._icon.x=320;
    this._icon.y=90;
    this._icon.scale.x=2
    this._icon.scale.y=2
    this.addChild(banner)
    this.addChild(this._icon)
    this.addChild(this._textZone)
};

Window_Help_Horno.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_Help_Horno.prototype.clear = function() {
    this.setText('');
};

Window_Help_Horno.prototype.setItem = function(item) {
    this.setText(item ? item.description : '');
    this._icon.setItem(item);
};

Window_Help_Horno.prototype.refresh = function() {
    this._icon.refresh();
    this._textZone.contents.clear();
    this._textZone.drawTextEx(this._text, this.textPadding(), 0);
};


function Window_Single_Icon(){
    this.initialize.apply(this, arguments);
}

Window_Single_Icon.prototype = Object.create(Window_Base.prototype);
Window_Single_Icon.prototype.constructor = Window_Single_Icon;


Window_Single_Icon.prototype.initialize = function(numLines) {
    var width = 96;
    var height = 96;
 
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.opacity = 0;
    this._itemId =0;
    this.drawIcon(this._itemId,0,0)
};


Window_Single_Icon.prototype.setItem = function(item) {
        this._itemId = item ? item.iconIndex : 0;
        this.refresh();
}

Window_Single_Icon.prototype.refresh = function() {
    this.contents.clear();
    this.drawIcon(this._itemId,0,0)
}