add a shape that is sprite but bounded within x rotation away from its origin as in
if a wall points in a direction, it can rotate +-15 deg either way to match the camera before it stops

setMeshForShape will need to be extended
enumShapes will need a new shape
line 16814 update method needs extention
//snippet from that line that shows how we can easily do this
if (this.shape === mv3d.enumShapes.SPRITE) {
          //this.mesh.pitch = mz3d.blendCameraPitch.currentValue()-90;
          //this.mesh.yaw = mz3d.blendCameraYaw.currentValue();
        } else if (this.shape === mv3d.enumShapes.BOARD) {
          if (!this.mesh.billboardMode) {
            this.mesh.yaw = mv3d.blendCameraYaw.currentValue();
            this.mesh.yaw -= this.yaw;
          }
        }