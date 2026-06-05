export default class Projectile {
  static make(scene, group, x, y, texture, velocityY, options = {}) {
    const sprite = group.get(x, y, texture);
    if (!sprite) {
      return null;
    }

    sprite.setActive(true).setVisible(true);
    sprite.setPosition(x, y).setTexture(texture);
    sprite.body.enable = true;
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocity(options.velocityX ?? 0, velocityY);
    sprite.body.setSize(options.bodyWidth ?? sprite.width, options.bodyHeight ?? sprite.height, true);
    sprite.damage = options.damage ?? 1;
    sprite.labelText = options.labelText ?? '';

    return sprite;
  }

  static release(sprite) {
    if (!sprite) {
      return;
    }

    sprite.setActive(false).setVisible(false);
    sprite.body.stop();
    sprite.body.enable = false;
    if (sprite.labelObject) {
      sprite.labelObject.destroy();
      sprite.labelObject = null;
    }
  }
}
