const bounds = 15;

const baseModelUpdate = window.mv3d.Model.prototype.update
window.mv3d.Model.prototype.update = function(){
    //baseModelUpdate.call(this);
        if(this.bounds){
            let targetYaw = mv3d.blendCameraYaw.currentValue();
            targetYaw -= this.yaw;
            // this.mesh.pitch = mz3d.blendCameraPitch.currentValue()-90;

            let allowedYaw = MATTIE.util.clamp(targetYaw-this.character.getConfig('yaw', 0), -this.bounds, this.bounds);
            this.mesh.yaw = this.character.getConfig('yaw', 0) + allowedYaw
        } 
}