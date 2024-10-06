//mv3d altimit getplatform optimization
mv3d.Character.prototype.getPlatform = function (x = this.char._realX, y = this.char._realY, opts = {}) {
    const collider = this.char.collider();
    if (collider.type === 0) {
      x += collider.x - 0.5;y += collider.y - 0.5;
      
      const r = collider.radius * 0.95;
  
      const platform = [
      mv3d.getPlatformForCharacter(this, x, y),
      mv3d.getPlatformForCharacter(this, x, y - r, opts),
      mv3d.getPlatformForCharacter(this, x - r, y, opts),
      mv3d.getPlatformForCharacter(this, x, y + r, opts),
      mv3d.getPlatformForCharacter(this, x + r, y, opts)];
  
      //this is what causes the lag when working with pixel movement
      const diagPlatforms = [];
    //   -Infinity,
    //   mv3d.getPlatformForCharacter(this, x - r * Math.SQRT1_2, y - r * Math.SQRT1_2, opts),
    //   mv3d.getPlatformForCharacter(this, x - r * Math.SQRT1_2, y + r * Math.SQRT1_2, opts),
    //   mv3d.getPlatformForCharacter(this, x + r * Math.SQRT1_2, y + r * Math.SQRT1_2, opts),
    //   mv3d.getPlatformForCharacter(this, x + r * Math.SQRT1_2, y - r * Math.SQRT1_2, opts)].
    //   filter((c) => c.z2 <= this.z);
      return platform.concat(diagPlatforms).reduce((a, b) => a.z2 >= b.z2 ? a : b);
    } else {
      x -= 0.5;y -= 0.5;
      const b = {
        l: collider.aabbox.left * 0.99,
        r: collider.aabbox.right * 0.99,
        t: collider.aabbox.top * 0.99,
        b: collider.aabbox.bottom * 0.99 };
  
      const platform = [
      mv3d.getPlatformForCharacter(this, x, y),
      mv3d.getPlatformForCharacter(this, x + b.l, y + b.t, opts),
      mv3d.getPlatformForCharacter(this, x + b.l, y + b.b, opts),
      mv3d.getPlatformForCharacter(this, x + b.r, y + b.t, opts),
      mv3d.getPlatformForCharacter(this, x + b.r, y + b.b, opts)].
      reduce((a, b) => a.z2 >= b.z2 ? a : b);
      return platform;
    }
  };