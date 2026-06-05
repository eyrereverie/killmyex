import { Palette } from '../constants/palette.js';

export default class HealthBar {
  constructor(scene, x, y, width, height, label) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.container = scene.add.container(x, y).setDepth(40);
    this.back = scene.add.graphics();
    this.fill = scene.add.graphics();
    this.text = scene.add.text(0, -14, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: Palette.paleBoneHex,
      resolution: 1,
    }).setOrigin(0, 0.5);

    this.container.add([this.back, this.fill, this.text]);
    this.setValue(1);
  }

  setValue(value, fillColor = Palette.pink) {
    const ratio = Phaser.Math.Clamp(value, 0, 1);
    this.back.clear();
    this.back.fillStyle(Palette.outline, 1);
    this.back.fillRect(0, 0, this.width, this.height);
    this.back.fillStyle(Palette.deepGreen, 1);
    this.back.fillRect(2, 2, this.width - 4, this.height - 4);

    this.fill.clear();
    this.fill.fillStyle(fillColor, 1);
    this.fill.fillRect(3, 3, Math.max(0, (this.width - 6) * ratio), this.height - 6);
  }
}
