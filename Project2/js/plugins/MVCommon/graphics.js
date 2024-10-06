var MATTIE = MATTIE || {}

MATTIE.graphics = {};

/**
 * @description return a sprite of a rounded rectangle filled 
 * @param {*} x 
 * @param {*} y 
 * @param {*} width 
 * @param {*} height 
 * @param {*} cornerRadius 
 * @param {*} clr 
 * @returns 
 */
MATTIE.graphics.roundedRect = function(x,y,width,height,cornerRadius,clr,alpha, lineWidth=0, lineClr=0, lineAlpha=0){
    // Create a graphics object
    const graphics = new PIXI.Graphics();

    // Set the line style (optional)
    if(lineWidth>0)graphics.lineStyle(lineWidth, lineClr, lineAlpha); // width, color, alpha

    graphics.beginFill(clr,alpha);


    graphics.drawRoundedRect(x, y, width, height, cornerRadius);

    // End fill
    graphics.endFill();

    return graphics;
}


MATTIE.graphics.rectWithOnlyTopRounded = function(x,y,width,height,cornerRadius,clr,alpha){
    // Create a graphics object
    const graphics = new PIXI.Graphics();

    graphics.beginFill(clr,alpha);

    graphics.drawRoundedRect(x, y, width, height, cornerRadius);
    graphics.drawRect(x, y+20, width, height, cornerRadius);

    // End fill
    graphics.endFill();

    return graphics;
}

MATTIE.graphics.test = function(){
    // Load your texture
    const sprite = new Sprite(ImageManager.loadPicture('test'));
    sprite.x=0
    sprite.y=0

    

    // Create a container for the rounded rectangle and texture
    const container = new PIXI.Container();

    // Create a rounded rectangle graphics
    const graphics = new PIXI.Graphics();
    
    const cornerRadius = 20;
    graphics.beginFill(0xFFFFFF); // White color
    graphics.drawRoundedRect(0, 0, 200, 300, cornerRadius);
    graphics.endFill();



    // Apply the mask to the sprite
    sprite.mask = graphics;

    // Add the sprite to the container
    container.addChild(sprite);

    // Set the position of the container
    container.x = 100;
    container.y = 100;

    return sprite;
}