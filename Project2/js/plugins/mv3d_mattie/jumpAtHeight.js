// jump

Game_CharacterBase.prototype.jumpAtHeight = function (zPlus, timeMult, totalTimeDiv) {
  const totalTime = timeMult*zPlus
  const loops = totalTime / totalTimeDiv;
    for (let index = 0; index < loops; index++) {
      const delay = index*1;
      setTimeout(() => {
        this.z+=(zPlus/loops);
      }, delay);
    }
};

//colW sets colider radius
const newCmds = ["colR","pivP","dRoll","bounds","dYaw","dPitch"];
const baseConfig = Game_Character.prototype.mv3d_configure;
Game_Character.prototype.mv3d_configure = function (data, time = null){
  try {
    const selfTargetStr = window.mv3d.getTargetString(this);
    const self = window.mv3d.targetChar(selfTargetStr);
  
  
  
    const targetStr = data.split(" ")[0];
    var target = window.mv3d.targetChar(targetStr) || self;
    const split = data.split(',');
    let newCmdsList = split.filter(e=>newCmds.some(f=>e.includes(f)));
    let otherCmds = split.filter(e=>!(newCmds.some(f=>e.includes(f))));
    newCmdsList.forEach(e => {
      let baseCmd = e.split('(')[0];
      if(baseCmd.includes(newCmds[0])){
        //colR
        target._collider.radius=parseFloat(e.split('(')[1].split(")")[0]);
      
      } else if (baseCmd.includes(newCmds[1])){
        //pivit point
        const params = e.split('(')[1].split(")")[0].split('-').map(e=>parseFloat(e.replace("+","-")));
        target.setPivotPoint(params)
      
      } else if (baseCmd.includes(newCmds[2])){ 
        //direct roll
        target.directRoll(e.split('(')[1].split(")")[0],time)
      } else if (baseCmd.includes(newCmds[3])){ 
        //bounds
        target.mv3d_sprite.model.bounds=parseFloat(e.split('(')[1].split(")")[0]);
      } else if (baseCmd.includes(newCmds[4])){ 
        //direct yaw
        target.directYaw(e.split('(')[1].split(")")[0],time)
      } else if (baseCmd.includes(newCmds[5])){ 
        //direct pitch
        target.directPitch(e.split('(')[1].split(")")[0],time)
      }
    });
    baseConfig.call(this, otherCmds.join(","), time);
  } catch (error) {
    baseConfig.call(this, data, time);
  }
  
}


Game_Character.prototype.directRoll = function (roll,t=1){
  const msPerFrame = 1000/60;
  const parsedNum = parseFloat(roll.replace("+","").replace("-",""))
  const numPerFrame = parsedNum/t;
  for (let frame = 0; frame < t; frame++) {
    setTimeout(() => {
      if( this.mv3d_sprite){
        if(this.mv3d_sprite.model){
          if(this.mv3d_sprite.model.mesh){
      if(roll.startsWith("+")){
        this.mv3d_sprite.model.mesh.roll+=numPerFrame;
      } else if(roll.startsWith("-")){
        this.mv3d_sprite.model.mesh.roll-=numPerFrame;
      } else {
        this.mv3d_sprite.model.mesh.roll=numPerFrame;
      }  }}}
    }, frame*msPerFrame); 
  }
}

Game_Character.prototype.directYaw = function (roll,t=1){
  const msPerFrame = 1000/60;
  const parsedNum = parseFloat(roll.replace("+","").replace("-",""))
  const numPerFrame = parsedNum/t;
  for (let frame = 0; frame < t; frame++) {
    setTimeout(() => {
      if( this.mv3d_sprite){
        if(this.mv3d_sprite.model){
          if(this.mv3d_sprite.model.mesh){
      if(roll.startsWith("+")){
        this.mv3d_sprite.model.mesh.yaw+=numPerFrame;
      } else if(roll.startsWith("-")){
        this.mv3d_sprite.model.mesh.yaw-=numPerFrame;
      } else {
        this.mv3d_sprite.model.mesh.yaw=numPerFrame;
      }  }}}
    }, frame*msPerFrame); 
  }
}

Game_Character.prototype.directPitch= function (roll,t=1){
  const msPerFrame = 1000/60;
  const parsedNum = parseFloat(roll.replace("+","").replace("-",""))
  const numPerFrame = parsedNum/t;
  for (let frame = 0; frame < t; frame++) {
    setTimeout(() => {
      if( this.mv3d_sprite){
        if(this.mv3d_sprite.model){
          if(this.mv3d_sprite.model.mesh){
      if(roll.startsWith("+")){
        this.mv3d_sprite.model.mesh.pitch+=numPerFrame;
      } else if(roll.startsWith("-")){
        this.mv3d_sprite.model.mesh.pitch-=numPerFrame;
      } else {
        this.mv3d_sprite.model.mesh.pitch=numPerFrame;
      }  }}}
    }, frame*msPerFrame); 
  }
}

Game_Character.prototype.setPivotPoint = function (args){

  const point = new BABYLON.Vector3()
  point._x=args[0];
  point._y=args[1];
  point._z=args[2];
  if( this.mv3d_sprite){
    if(this.mv3d_sprite.model){
      if(this.mv3d_sprite.model){
        this.mv3d_sprite.model.mesh.setPivotPoint(point, BABYLON.Space.LOCAL)
      }
    }
  }
  
}