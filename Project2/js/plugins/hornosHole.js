var MATTIE = MATTIE || {};

MATTIE.isDev=true;

/**=======================
 *  Loader for other files
 *========================**/

/**
 * @description open an html file in its own window
 * @param {string} file the url to an html file
 */
Graphics.openFile = function (file) {
	window.open(file, '_blank');
};

/**
 * @description attach a script tag to the html from a specific folder
 * @param {string} scriptName the name of the script
 * @param {string} folderPath the path to the folder the script is in
 */
PluginManager.loadScriptFromFolder = function(scriptName, folderPath) {
    var url = folderPath + scriptName;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};

// Check if the file was already added in the game
MATTIE.isFileAttached = function(file) {
	return PluginManager._scripts.contains(file);
}

/**
 * @param {string} file the js file to load
 * @param {string} folderPath if provided, the path to the folder to load the file from.
 */
MATTIE.loadFile = (file, folderPath=null) => {
   
    if(file.endsWith('.js')) file = file.replace('\.js$',"");
    console.log(file);
    if (!MATTIE.isFileAttached(file)) {
        if(folderPath==null){
            PluginManager.loadScript(file + '.js');
        } else {
            PluginManager.loadScriptFromFolder(file + '.js', folderPath);
        }
        PluginManager._scripts.push(file);
    }
}



(()=>{
    const pluginsFolderPath = "/js/plugins/"
    
    //horno specifc
    MATTIE.loadFile("static", `${pluginsFolderPath}/horno/`);

    //common
    MATTIE.loadFile("errorDisplay", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("titleScreenEditor", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("menuStyler", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("graphics", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("touchCustomiser", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("msgAPI", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("util", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("eventWrapper", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("eventAPI", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("eventHooks", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("preFabAPI", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("itemAPI", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("visualEquip", `${pluginsFolderPath}/MVCommon/`);

    //TODO: get this working
    MATTIE.loadFile("pixi-filters", `${pluginsFolderPath}/MVCommon/`);

    MATTIE.loadFile("filterAPI", `${pluginsFolderPath}/MVCommon/`);
    MATTIE.loadFile("cheatMenu", `${pluginsFolderPath}/MVCommon/common/`);
    MATTIE.loadFile("devMenu", `${pluginsFolderPath}/MVCommon/common/`);
    MATTIE.loadFile("mainMenu", `${pluginsFolderPath}/MVCommon/common/`);
    MATTIE.loadFile("menu", `${pluginsFolderPath}/MVCommon/common/`);
    MATTIE.loadFile("scenes", `${pluginsFolderPath}/MVCommon/common/`);
    MATTIE.loadFile("windows", `${pluginsFolderPath}/MVCommon/common/`);
    MATTIE.loadFile("common", `${pluginsFolderPath}/MVCommon/common/`);
    MATTIE.loadFile("keybinds", `${pluginsFolderPath}/MVCommon/common/`);
   
    
    
    //horno specifc
    MATTIE.loadFile("horno_itemAPI", `${pluginsFolderPath}/horno/`);
    // MATTIE.loadFile("titleScreen", `${pluginsFolderPath}/horno/`);
    MATTIE.loadFile("itemMenu", `${pluginsFolderPath}/horno/`);
    // MATTIE.loadFile("ghostMenu", `${pluginsFolderPath}/horno/`);
    // MATTIE.loadFile("config", `${pluginsFolderPath}/horno/`);
    MATTIE.loadFile("misc", `${pluginsFolderPath}/horno/`);
    // MATTIE.loadFile("battleMenu", `${pluginsFolderPath}/horno/`);
    // MATTIE.loadFile("health", `${pluginsFolderPath}/horno/`);
    


    // //mv3d specific
    // MATTIE.loadFile("jumpAtHeight", `${pluginsFolderPath}/mv3d_mattie/`);
    // MATTIE.loadFile("boundedSprite", `${pluginsFolderPath}/mv3d_mattie/`);
    // MATTIE.loadFile("input", `${pluginsFolderPath}/mv3d_mattie/`);

    // //alimit specific
    // MATTIE.loadFile("hitboxesDynamic", `${pluginsFolderPath}/almitit/`);
    // MATTIE.loadFile("quickFixToCollisionLag", `${pluginsFolderPath}/almitit/`);


    //overworld combat
    MATTIE.loadFile("overworldCombat", `${pluginsFolderPath}/MVCommon/overworldCombat/`);
    MATTIE.loadFile("basicAIs", `${pluginsFolderPath}/MVCommon/overworldCombat/`);

    
})();


