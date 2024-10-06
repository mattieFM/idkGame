/**
 * @check if within x of player
 * @param {*} x 
 * @returns 
 */
Game_Event.prototype.isNearThePlayer = function(x=20) {
    var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
    var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
    return sx + sy < x;
};

/**
 * @description the ai to be called every frame on Game_Event for a slime
 */
function slimeAI(){
    /**@type {Game_CharacterBase}*/
    let event=this
    if(!this.aiNumber)this.aiNumber=0;
    if(!this.target)this.target = {x:parseInt(`${$gamePlayer.x}`),y:parseInt(`${$gamePlayer.y}`)};

    if(this.isNearThePlayer(10))
    if(!event.aiStarting){
        let lastMoveSpeed = this.realMoveSpeed;
        this.realMoveSpeed=()=>5;
        this.aiStarting=true;
        if(this.isNearThePlayer(4)){
            if(this.aiNumber>35){
                this.aiNumber=0;
                this.target = {x:parseInt(`${$gamePlayer.x}`),y:parseInt(`${$gamePlayer.y}`)};
            } else if(this.aiNumber>30){
                fleePlayer.call(this,this.target);
                if(MATTIE.util.randChance(.1)){
                    this.aiNumber=20;
                }
            } else if(this.aiNumber>20){
                approachPlayer.call(this,this.target,-.3,.3);
                if(MATTIE.util.randChance(.1)){
                    this.aiNumber=30;
                }
                if(MATTIE.util.randChance(.2)){
                    this.SWING_WEAPON();
                }
            } else{
                rotateAroundPoint.call(this,this.target,.1*(this.aiNumber>10==0?-1:1),2);
            }
        } else {
            this.target = {x:parseInt(`${$gamePlayer.x}`),y:parseInt(`${$gamePlayer.y}`)};
            approachPlayer.call(this);
        }
        
        setTimeout(() => {
            applyTouchDamageToPlayer()
            this.realMoveSpeed=lastMoveSpeed;
            this.aiStarting=false;
            this.aiNumber++;
        }, 100);
    }
}

/**
 * @description ensure entites that are moving still call their collision events on the player
 */
function applyTouchDamageToPlayer(){
    $gamePlayer.checkEventTriggerHere([1,2])
}

function approachPlayer(target=$gamePlayer,minPerTick = -.1,maxPerTick = .1){
    console.log("approach")
    let deltaX = MATTIE.util.clamp(target.x-this._x,minPerTick,maxPerTick);
    let deltaY = MATTIE.util.clamp(target.y-this._y,minPerTick,maxPerTick);
    this._x+=deltaX
    this._y+=deltaY
    this.turnTowardCharacter(target)
}

function fleePlayer(target=$gamePlayer,minPerTick = -.1,maxPerTick = .1){
    console.log("flee")
    let deltaX = MATTIE.util.clamp(this._x-target.x,minPerTick,maxPerTick);
    let deltaY = MATTIE.util.clamp(this._y,minPerTick-target.y,maxPerTick);
    this._x+=deltaX
    this._y+=deltaY
    this.turnTowardCharacter(target)
}

function rotateAroundPoint(gamePlayer, speed, distance) {
    // Calculate the current angle (assume gamePlayer has x and y properties)
    let angle = Math.atan2(this._y - gamePlayer.y, this._x - gamePlayer.x);

    // Increment the angle by the speed
    angle += speed;

   
    // Calculate the new x and y using the angle and distance
    this._x = gamePlayer.x + Math.cos(angle) * distance;
    this._y = gamePlayer.y + Math.sin(angle) * distance;
    this.turnTowardCharacter($gamePlayer)
}