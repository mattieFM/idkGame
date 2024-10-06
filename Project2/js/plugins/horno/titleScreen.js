var MATTIE = MATTIE || {};

MATTIE.titleScreenCtrl.moveCmdBox(245,-55)
MATTIE.titleScreenCtrl.setCmdBoxSize(300,430)
MATTIE.titleScreenCtrl.addBorderToTitleCmdMenu(4, 0x0606c2, .7)
MATTIE.titleScreenCtrl.addBlockWithTextToTitleCmdMenu(0x140f99, 1, "D - 043212", "yellow");
MATTIE.titleScreenCtrl.addTopPadding(2);


// Create a text object
const headerStyle = new PIXI.TextStyle({
    fontFamily: 'helvetica', // Font family
    fontSize: 24,        // Font size
    fontWeight: "bold",
    fill: "#3e3b96",        // Text color
    stroke: '#000000',   // Stroke color (optional)
    strokeThickness: 1,  // Stroke thickness (optional)
    dropShadow: false,    // Enable drop shadow (optional)
    dropShadowColor: '#000000', // Drop shadow color (optional)
    dropShadowBlur: 4,   // Drop shadow blur (optional)
    dropShadowDistance: 4 // Drop shadow distance (optional)
});
MATTIE.headerStyle = headerStyle;

// Create a text object
const priceStyle = new PIXI.TextStyle({
    fontFamily: 'helvetica', // Font family
    fontSize: 24,        // Font size
    fill: "#3e3b96",        // Text color
    stroke: '#000000',   // Stroke color (optional)
    strokeThickness: .7,  // Stroke thickness (optional)
    dropShadow: false,    // Enable drop shadow (optional)
    dropShadowColor: '#000000', // Drop shadow color (optional)
    dropShadowBlur: 4,   // Drop shadow blur (optional)
    dropShadowDistance: 4 // Drop shadow distance (optional)
});
MATTIE.priceStyle = priceStyle;

// Create a text object
const textStyle = new PIXI.TextStyle({
    fontFamily: 'helvetica', // Font family
    fontSize: 18,        // Font size
    fill: "#616161",        // Text color
    stroke: '#000000',   // Stroke color (optional)
    strokeThickness: .6,  // Stroke thickness (optional)
    dropShadow: false,    // Enable drop shadow (optional)
    dropShadowColor: '#000000', // Drop shadow color (optional)
    dropShadowBlur: 4,   // Drop shadow blur (optional)
    dropShadowDistance: 4 // Drop shadow distance (optional)
});
MATTIE.textStyle = textStyle;



const prevWindowInit = Window_TitleCommand.prototype.initialize;
    Window_TitleCommand.prototype.initialize = function() {
        prevWindowInit.call(this);
       
      

        const retailPriceHeader = new PIXI.Text('Retail Value', headerStyle);
        const WSNPriceHeader = new PIXI.Text('WSN Value', headerStyle);

        const retailPrice = new PIXI.Text(`${MATTIE.config.devHours} hrs`, priceStyle);
        const WSNPrice = new PIXI.Text('FREE', priceStyle);

        const info = new PIXI.Text('• 46 items\n• Sculpted by Maddie\n• Not assosiated with the\nTerritories Of Skeent\n• ', textStyle);

        // Set the position of the text
        retailPriceHeader.x = 20;
        retailPriceHeader.y = this.windowHeight()-140;
        retailPrice.x = 17;
        retailPrice.y = this.windowHeight()-110;
        WSNPriceHeader.x = 20;
        WSNPriceHeader.y = this.windowHeight()-70;
        WSNPrice.x = 20;
        WSNPrice.y = this.windowHeight()-40;
        info.x = 20
        info.y = this.windowHeight()-230;
      
        this.addChild(retailPriceHeader)
        this.addChild(WSNPriceHeader)
        this.addChild(retailPrice)
        this.addChild(WSNPrice)
        this.addChild(info)
        
    };




