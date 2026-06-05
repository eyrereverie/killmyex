export default class TouchInput {
  constructor(scene, swipeThreshold = 42) {
    this.scene = scene;
    this.swipeThreshold = swipeThreshold;
    this.pointer = null;
    this.startX = 0;
    this.startY = 0;
    this.target = null;
    this.dashVector = new Phaser.Math.Vector2();

    scene.input.on('pointerdown', this.handleDown, this);
    scene.input.on('pointermove', this.handleMove, this);
    scene.input.on('pointerup', this.handleUp, this);
  }

  handleDown(pointer, targets) {
    if (targets.length > 0 || pointer.y < 120 || pointer.y > 724) {
      return;
    }

    this.pointer = pointer;
    this.startX = pointer.x;
    this.startY = pointer.y;
    this.target = { x: pointer.x, y: pointer.y };
  }

  handleMove(pointer) {
    if (this.pointer && pointer.id === this.pointer.id) {
      this.target = { x: pointer.x, y: pointer.y };
    }
  }

  handleUp(pointer) {
    if (!this.pointer || pointer.id !== this.pointer.id) {
      return;
    }

    const dx = pointer.x - this.startX;
    const dy = pointer.y - this.startY;
    const distance = Math.hypot(dx, dy);
    if (distance >= this.swipeThreshold) {
      this.dashVector.set(dx / distance, dy / distance);
    }

    this.pointer = null;
    this.target = null;
  }

  consumeDashVector() {
    if (this.dashVector.lengthSq() === 0) {
      return null;
    }

    const vector = this.dashVector.clone();
    this.dashVector.set(0, 0);
    return vector;
  }

  destroy() {
    this.scene.input.off('pointerdown', this.handleDown, this);
    this.scene.input.off('pointermove', this.handleMove, this);
    this.scene.input.off('pointerup', this.handleUp, this);
  }
}
