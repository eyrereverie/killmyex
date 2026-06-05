import { Palette } from '../constants/palette.js';

export default class PixelButton {
  constructor(scene, x, y, width, height, label, onActivate) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.onActivate = onActivate;
    this.isDown = false;

    this.container = scene.add.container(x, y);
    this.container.setSize(width, height);
    this.container.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    this.box = scene.add.graphics();
    this.text = scene.add.text(0, 1, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '24px',
      color: Palette.paleBoneHex,
      align: 'center',
      resolution: 1,
    });
    this.text.setOrigin(0.5);

    this.container.add([this.box, this.text]);
    this.draw('idle');

    this.container.on('pointerover', () => this.draw('hover'));
    this.container.on('pointerout', () => {
      this.isDown = false;
      this.draw('idle');
    });
    this.container.on('pointerdown', () => {
      this.isDown = true;
      this.draw('down');
    });
    this.container.on('pointerup', () => {
      const wasDown = this.isDown;
      this.isDown = false;
      this.draw('hover');
      if (wasDown) {
        this.activate();
      }
    });
  }

  activate() {
    if (typeof this.onActivate === 'function') {
      this.onActivate();
    }
  }

  draw(state) {
    const fill = state === 'down' ? Palette.cemeteryGreen : Palette.background;
    const border = state === 'hover' ? Palette.pink : Palette.paleBone;
    const inset = state === 'down' ? 3 : 0;

    this.box.clear();
    this.box.fillStyle(Palette.outline, 1);
    this.box.fillRect(-this.width / 2 - 4, -this.height / 2 - 4, this.width + 8, this.height + 8);
    this.box.fillStyle(fill, 1);
    this.box.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.box.lineStyle(4, border, 1);
    this.box.strokeRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4);
    this.box.lineStyle(2, Palette.mutedGreen, 1);
    this.box.strokeRect(-this.width / 2 + 8, -this.height / 2 + 8, this.width - 16, this.height - 16);
    this.text.setY(1 + inset);
  }
}
