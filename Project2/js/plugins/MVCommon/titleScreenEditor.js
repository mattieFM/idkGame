var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};

/**
 * @namespace MATTIE.titleScreenCtrl contains functions for rearranging the title screen
 */
MATTIE.titleScreenCtrl = {};


//override the init function to add 2 vars
MATTIE_RPG.Window_TitleCommand_init = Window_TitleCommand.prototype.initialize;
Window_TitleCommand.prototype.initialize = function() {
    MATTIE_RPG.Window_TitleCommand_init.call(this);
    this.editedX=0;
    this.editedY=0;
};

/**
 * @description move the cmd box of the title screen reletive to its default position
 * @param {number} x
 * @param {number} y
 */
MATTIE.titleScreenCtrl.moveCmdBox = function(x, y){
    Window_TitleCommand.prototype.updatePlacement = function() {
        this.editedX+=x;
        this.editedY+=y;
        this.x = (Graphics.boxWidth - this.width) / 2 + x;
        this.y = Graphics.boxHeight - this.height - 96 + y;
    };
}

/**
 * @description set the length of the command box
 * @param {number} x width leave as 0 to remain dynamic
 * @param {number} y height
 */
MATTIE.titleScreenCtrl.setCmdBoxSize = function(x,y){

    Window_TitleCommand.prototype.windowHeight = function() {
        return y;
    };

    if(x>0)
    Window_TitleCommand.prototype.windowWidth = function() {
        return x;
    };
}

/**
 * @description add a border to the cmd buttons on the main menu
 * @param {*} width 
 * @param {*} clr 
 * @param {*} opacity 
 */
MATTIE.titleScreenCtrl.addBorderToTitleCmdMenu = function(width,clr, opacity) {
    const prevWindowInit = Window_TitleCommand.prototype.initialize;
    Window_TitleCommand.prototype.initialize = function() {
        prevWindowInit.call(this);
        const sprite = MATTIE.graphics.roundedRect(0,0,this.windowWidth(),this.windowHeight(), 15, 0xffffff, 0, width, clr, opacity);
        this.addChildAt(sprite, 1)
       
    };
}

/**
 * @description add a curved block to the menu
 * @param {*} clr 
 * @param {*} opacity 
 */
MATTIE.titleScreenCtrl.addBlockToTitleCmdMenu = function(clr, opacity) {
    const prevWindowInit = Window_TitleCommand.prototype.initialize;
    Window_TitleCommand.prototype.initialize = function() {
        prevWindowInit.call(this);
        this.addChildAt(MATTIE.graphics.rectWithOnlyTopRounded(7,7,this.windowWidth()-14,this.windowHeight()/10, 15, clr, opacity), 2)
        
    };
}
MATTIE.yellowHeaderStyle = new PIXI.TextStyle({
    fontFamily: 'Arial', // Font family
    fontSize: 36,        // Font size
    fill: "yellow",        // Text color
    fontWeight: 'bold',  // Font weight (optional)
    stroke: '#000000',   // Stroke color (optional)
    strokeThickness: 2,  // Stroke thickness (optional)
    dropShadow: true,    // Enable drop shadow (optional)
    dropShadowColor: '#000000', // Drop shadow color (optional)
    dropShadowBlur: 4,   // Drop shadow blur (optional)
    dropShadowDistance: 4 // Drop shadow distance (optional)
});

/**
 * @description add a curved block to the menu
 * @param {*} clr 
 * @param {*} opacity 
 */
MATTIE.titleScreenCtrl.addBlockWithTextToTitleCmdMenu = function(clr, opacity, textContent, textClr) {
    const prevWindowInit = Window_TitleCommand.prototype.initialize;
    Window_TitleCommand.prototype.initialize = function() {
        prevWindowInit.call(this);
        const block = MATTIE.graphics.rectWithOnlyTopRounded(7,7,this.windowWidth()-14,this.windowHeight()/10, 15, clr, opacity);
        // Create a text object


        const text = new PIXI.Text(textContent, MATTIE.yellowHeaderStyle);

        // Set the position of the text
        text.x = 20;
        text.y = 16;
        block.addChild(text)
        this.addChildAt(block, 2)
        
    };
}


MATTIE.titleScreenCtrl.addTopPadding = function(x){
    Window_TitleCommand.prototype.makeCommandList = function() {
        for (let index = 0; index < x; index++) {
            this.addCommand("",   '');
        }
        this.addCommand(TextManager.newGame,   'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        this.addCommand(TextManager.options,   'options');
    };

    Window_TitleCommand.prototype.activate = function() {
        Window_Base.prototype.activate.call(this);
        this.select(x);
    };
}