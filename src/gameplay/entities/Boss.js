import { Palette } from '../../constants/palette.js';

export default class Boss {
  constructor(scene, x, y, config) {
    this.scene = scene;
    this.config = config;
    this.maxHp = config.hp;
    this.hp = config.hp;
    this.maxShieldHp = config.shieldHp;
    this.shieldHp = config.shieldHp;

    this.sprite = scene.physics.add.sprite(x, y, 'level1-test-exe');
    this.sprite.setDepth(16);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setImmovable(true);
    this.sprite.body.setSize(42, 38, true);

    this.shield = scene.add.graphics().setDepth(14);
    this.exposedMarker = scene.add.graphics().setDepth(15);
    this.drawShield();
  }

  update() {
    this.drawShield();
  }

  applyDamage(amount) {
    let shieldBroke = false;
    if (this.shieldHp > 0) {
      const before = this.shieldHp;
      this.shieldHp = Math.max(0, this.shieldHp - amount);
      shieldBroke = before > 0 && this.shieldHp === 0;
      if (shieldBroke) {
        this.sprite.setVisible(true).setAlpha(1).setTint(0xffb1c9);
      }
    } else {
      this.hp = Math.max(0, this.hp - amount);
    }

    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.08,
      scaleY: 0.92,
      duration: 55,
      yoyo: true,
    });
    return { shieldBroke, defeated: this.hp <= 0 };
  }

  drawShield() {
    this.shield.clear();
    this.exposedMarker.clear();
    if (this.shieldHp <= 0) {
      this.exposedMarker.fillStyle(Palette.pink, 0.22);
      this.exposedMarker.fillCircle(this.sprite.x, this.sprite.y, 38);
      this.exposedMarker.lineStyle(2, Palette.pink, 0.85);
      this.exposedMarker.strokeCircle(this.sprite.x, this.sprite.y, 32);
      this.exposedMarker.lineStyle(1, Palette.paleBone, 0.7);
      this.exposedMarker.strokeRect(this.sprite.x - 28, this.sprite.y - 28, 56, 56);
      return;
    }

    const alpha = 0.18 + (this.shieldHp / this.maxShieldHp) * 0.28;
    this.shield.lineStyle(3, Palette.pink, alpha);
    this.shield.strokeCircle(this.sprite.x, this.sprite.y, 42);
    this.shield.lineStyle(1, Palette.paleBone, alpha);
    this.shield.strokeCircle(this.sprite.x, this.sprite.y, 48);
  }

  defeat(onComplete) {
    this.shield.clear();
    this.exposedMarker.clear();
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      y: this.sprite.y + 28,
      angle: 8,
      duration: 520,
      ease: 'Sine.easeIn',
      onComplete,
    });
  }

  destroy() {
    this.shield.destroy();
    this.exposedMarker.destroy();
    this.sprite.destroy();
  }
}
