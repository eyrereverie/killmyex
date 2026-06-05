export default class Player {
  constructor(scene, x, y, config, bounds) {
    this.scene = scene;
    this.config = config;
    this.bounds = bounds;
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.invulnerableUntil = 0;
    this.dashingUntil = 0;
    this.revivingUntil = 0;
    this.velocity = new Phaser.Math.Vector2();

    this.sprite = scene.physics.add.sprite(x, y, 'level1-luz');
    this.sprite.setDepth(20);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(18, 24, true);
    this.sprite.setCollideWorldBounds(false);
  }

  update(time, input) {
    if (time < this.revivingUntil) {
      this.sprite.body.setVelocity(0, 0);
      this.sprite.setAlpha(Math.floor(time / 80) % 2 === 0 ? 0.25 : 0.72);
      return;
    }

    this.sprite.body.enable = true;
    const move = input.getMoveVector();
    const touchTarget = input.getTouchTarget();
    const dashVector = input.consumeDashVector(move);

    if (dashVector) {
      this.dashingUntil = time + this.config.dashDurationMs;
      this.invulnerableUntil = Math.max(this.invulnerableUntil, time + this.config.dashInvulnerableMs);
      this.velocity.copy(dashVector).scale(this.config.dashSpeed);
    } else if (time < this.dashingUntil && this.velocity.lengthSq() > 0) {
      this.velocity.scale(0.95);
    } else if (touchTarget) {
      const dx = Phaser.Math.Clamp(touchTarget.x, this.bounds.left, this.bounds.right) - this.sprite.x;
      const dy = Phaser.Math.Clamp(touchTarget.y, this.bounds.top, this.bounds.bottom) - this.sprite.y;
      this.velocity.x = Phaser.Math.Linear(this.velocity.x, dx * 5.5, 0.18);
      this.velocity.y = Phaser.Math.Linear(this.velocity.y, dy * 5.5, 0.18);
      this.velocity.limit(this.config.moveSpeed);
    } else {
      const targetX = move.x * this.config.moveSpeed;
      const targetY = move.y * this.config.moveSpeed;
      this.velocity.x = Phaser.Math.Linear(this.velocity.x, targetX, 0.24);
      this.velocity.y = Phaser.Math.Linear(this.velocity.y, targetY, 0.24);
    }

    this.sprite.body.setVelocity(this.velocity.x, this.velocity.y);
    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, this.bounds.left, this.bounds.right);
    this.sprite.y = Phaser.Math.Clamp(this.sprite.y, this.bounds.top, this.bounds.bottom);
    this.sprite.setAlpha(this.isInvulnerable(time) && Math.floor(time / 90) % 2 === 0 ? 0.55 : 1);
  }

  damage(time, amount = 1) {
    if (this.isInvulnerable(time) || time < this.revivingUntil) {
      return false;
    }

    this.hp = Math.max(0, this.hp - amount);
    this.invulnerableUntil = time + this.config.hitInvulnerableMs;
    this.scene.tweens.add({
      targets: this.sprite,
      tint: 0xff5f91,
      duration: 70,
      yoyo: true,
      onComplete: () => this.sprite.clearTint(),
    });
    return true;
  }

  revive(time, x, y) {
    this.velocity.set(0, 0);
    this.dashingUntil = 0;
    this.revivingUntil = time + this.config.reviveMs;
    this.invulnerableUntil = time + this.config.reviveInvulnerableMs;
    this.sprite.body.stop();
    this.sprite.body.enable = false;
    this.sprite.setPosition(x, y);
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.22,
      scaleY: 1.22,
      duration: 140,
      yoyo: true,
      onComplete: () => {
        this.sprite.setScale(1);
      },
    });
  }

  setSafety(time, durationMs) {
    this.invulnerableUntil = Math.max(this.invulnerableUntil, time + durationMs);
  }

  isInvulnerable(time) {
    return time < this.invulnerableUntil;
  }

  destroy() {
    this.sprite.destroy();
  }
}
