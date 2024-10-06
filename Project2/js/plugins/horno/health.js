let healthBar;
/**@type {Window_Bar} */
let manaBar;
const orgCreate = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
    orgCreate.call(this);
    healthBar = new Window_Bar($gameParty.leader().hp, "hp",['#ab1327', '#ab1327','#006080', '#000d5e']);
    this.addWindow(healthBar);
    manaBar = new Window_Bar($gameParty.leader().mp, "mp",['#34bdeb', '#34bdeb','#006080', '#000d5e']);
    this.addWindow(manaBar);
};

setInterval(() => {
    if (healthBar) {
        healthBar.setValue($gameParty.leader().hp)
        healthBar.maxValue = () =>$gameParty.leader().mhp
        healthBar.refresh()
    }
}, 100)


setInterval(() => {
    if (manaBar) {
        manaBar.move(0, 53, manaBar.windowWidth(), manaBar.windowHeight())
        manaBar.setValue($gameParty.leader().mp)
        manaBar.maxValue = () =>$gameParty.leader().mmp;
        manaBar.refresh()
    }
}, 100)