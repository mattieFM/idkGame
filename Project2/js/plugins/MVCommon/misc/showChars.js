/**
 * a simple function to show chars if you hide them 
 */
Spriteset_Map.prototype.showCharacters = function() {
    for (var i = 0; i < this._characterSprites.length; i++) {
        var sprite = this._characterSprites[i];
        if (!sprite.isTile()) {
            sprite.show();
        }
    }
};