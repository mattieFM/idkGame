var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {};

/**
 * @namespace MATTIE.menuStyler contains functions for styling option menus
 */
MATTIE.menuStyler = {};

MATTIE.menuStyler.addButtonToMenu = function(cmd,cb,enabledCb){
    const BaseWindowMenuCmd = Window_MenuCommand.prototype.addMainCommands
    Window_MenuCommand.prototype.addMainCommands = function() {
        BaseWindowMenuCmd.call(this);
        if(enabledCb()){
            this.addCommand(cmd, cmd, enabledCb());
        }
    };

    const baseCmdHandler = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        baseCmdHandler.call(this);
        if(enabledCb()){
            this._commandWindow.setHandler(cmd, cb.bind(this));
        }
    };
}

