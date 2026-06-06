import Projectile from '../entities/Projectile.js';

export default class PlayerShooter {
  constructor(scene, player, config) {
    this.scene = scene;
    this.player = player;
    this.config = config;
    this.group = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 28,
    });
    this.lastShotAt = 0;
  }

  shoot(time) {
    if (!this.player.canShoot || !this.player.sprite.active || !this.player.sprite.visible) {
      return false;
    }

    if (time - this.lastShotAt < this.config.fireIntervalMs) {
      return false;
    }

    this.lastShotAt = time;
    const shot = Projectile.make(this.scene, this.group, this.player.sprite.x, this.player.sprite.y - 18, 'level1-light-shot', -this.config.projectileSpeed, {
      damage: this.config.damage,
      bodyWidth: 6,
      bodyHeight: 14,
    });
    return Boolean(shot);
  }

  cleanup() {
    this.group.children.each((shot) => {
      if (shot.active && shot.y < -20) {
        Projectile.release(shot);
      }
    });
  }

  clear() {
    this.group.children.each((shot) => Projectile.release(shot));
  }
}
