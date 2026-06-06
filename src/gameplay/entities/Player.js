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
    this.isAlive = true;
    this.isRespawning = false;
    this.canMove = true;
    this.canShoot = true;
    this.velocity = new Phaser.Math.Vector2();

    this.sprite = scene.physics.add.sprite(x, y, 'level1-luz');
    this.sprite.setDepth(20);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(18, 24, true);
    this.sprite.setCollideWorldBounds(false);
    this.resetForBattle(x, y);
  }

  update(time, input) {
    if (this.isRespawning) {
      if (time >= this.revivingUntil) {
        this.completeRevive(time);
      } else {
        this.sprite.body.stop();
      }
      return;
    }

    if (!this.isAlive || !this.canMove) {
      this.sprite.body.setVelocity(0, 0);
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
    if (!this.canTakeDamage(time)) {
      return false;
    }

    this.hp = Math.max(0, this.hp - amount);
    this.isAlive = this.hp > 0;
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
    if (this.hp <= 0) {
      return;
    }

    this.velocity.set(0, 0);
    this.dashingUntil = 0;
    this.revivingUntil = time + this.config.reviveMs;
    this.invulnerableUntil = time + this.config.reviveInvulnerableMs;
    this.isAlive = true;
    this.isRespawning = true;
    this.canMove = false;
    this.canShoot = false;
    this.sprite.body.stop();
    this.sprite.body.enable = false;
    this.sprite.setActive(true);
    this.sprite.setVisible(false);
    this.sprite.setAlpha(0);
    this.sprite.clearTint();
    this.sprite.setPosition(x, y);

    // Respawn is completed both by this timer and by update() as a guard, so Luz
    // cannot stay invisible if one path is skipped during a pause or scene tick.
    this.scene.time.delayedCall(this.config.reviveMs, () => this.completeRevive(this.scene.time.now));
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

  completeRevive(time) {
    if (!this.isRespawning || this.hp <= 0) {
      return;
    }

    this.isRespawning = false;
    this.isAlive = true;
    this.canMove = true;
    this.canShoot = true;
    this.velocity.set(0, 0);
    this.dashingUntil = 0;
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.setAlpha(1);
    this.sprite.setScale(1);
    this.sprite.clearTint();
    this.sprite.body.enable = true;
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(18, 24, true);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.body.setVelocity(0, 0);
    this.invulnerableUntil = Math.max(this.invulnerableUntil, time + this.config.hitInvulnerableMs);
  }

  resetForBattle(x, y) {
    this.hp = this.maxHp;
    this.invulnerableUntil = 0;
    this.dashingUntil = 0;
    this.revivingUntil = 0;
    this.isAlive = true;
    this.isRespawning = false;
    this.canMove = true;
    this.canShoot = true;
    this.velocity.set(0, 0);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.setAlpha(1);
    this.sprite.setScale(1);
    this.sprite.clearTint();
    this.sprite.setPosition(x, y);
    this.sprite.body.enable = true;
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(18, 24, true);
    this.sprite.body.reset(x, y);
    this.sprite.body.setVelocity(0, 0);
  }

  setSafety(time, durationMs) {
    this.invulnerableUntil = Math.max(this.invulnerableUntil, time + durationMs);
  }

  canTakeDamage(time) {
    return this.isAlive
      && !this.isRespawning
      && this.sprite.active
      && this.sprite.visible
      && this.sprite.body.enable
      && !this.isInvulnerable(time);
  }

  isInvulnerable(time) {
    return time < this.invulnerableUntil;
  }

  destroy() {
    this.sprite.destroy();
  }
}
