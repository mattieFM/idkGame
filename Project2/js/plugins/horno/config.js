var MATTIE = MATTIE || {};

MATTIE.config = {};

MATTIE.config.devHours = "~56";

//Add Ghost menu to menu
MATTIE.menuStyler.addButtonToMenu("Ghosts", (()=>SceneManager.push(Scene_Ghost)), ()=>$gameSwitches.value(MATTIE.static.switches.seeGhosts));