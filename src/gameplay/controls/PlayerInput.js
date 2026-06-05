import TouchInput from './TouchInput.js';

export default class PlayerInput {
  constructor(scene) {
    this.scene = scene;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
      dash: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      special: Phaser.Input.Keyboard.KeyCodes.E,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
    this.touch = new TouchInput(scene);
    this.shootQueued = false;
    this.specialButtonPressed = false;
    this.pauseButtonPressed = false;

    this.keys.shoot.on('down', () => {
      this.shootQueued = true;
    });
  }

  getMoveVector() {
    const x = (this.cursors.left.isDown || this.keys.a.isDown ? -1 : 0) +
      (this.cursors.right.isDown || this.keys.d.isDown ? 1 : 0);
    const y = (this.cursors.up.isDown || this.keys.w.isDown ? -1 : 0) +
      (this.cursors.down.isDown || this.keys.s.isDown ? 1 : 0);
    const vector = new Phaser.Math.Vector2(x, y);
    if (vector.lengthSq() > 0) {
      vector.normalize();
    }
    return vector;
  }

  getTouchTarget() {
    return this.touch.target;
  }

  consumeDashVector(fallbackVector) {
    const touchDash = this.touch.consumeDashVector();
    if (touchDash) {
      return touchDash;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.dash)) {
      if (fallbackVector.lengthSq() > 0) {
        return fallbackVector.clone().normalize();
      }
      return new Phaser.Math.Vector2(0, -1);
    }

    return null;
  }

  consumeShootRequest() {
    const requested = this.shootQueued;
    this.shootQueued = false;
    return requested;
  }

  consumeSpecialRequest() {
    const requested = this.specialButtonPressed || Phaser.Input.Keyboard.JustDown(this.keys.special);
    this.specialButtonPressed = false;
    return requested;
  }

  consumePauseRequest() {
    const requested = this.pauseButtonPressed || Phaser.Input.Keyboard.JustDown(this.keys.pause);
    this.pauseButtonPressed = false;
    return requested;
  }

  requestSpecial() {
    this.specialButtonPressed = true;
  }

  requestPause() {
    this.pauseButtonPressed = true;
  }

  destroy() {
    this.touch.destroy();
  }
}
