import { Palette } from '../constants/palette.js';

export default class HeartsDisplay {
  constructor(scene, x, y, maxHp) {
    this.scene = scene;
    this.maxHp = maxHp;
    this.hearts = [];
    this.container = scene.add.container(x, y).setDepth(40);

    for (let i = 0; i < maxHp; i += 1) {
      const heart = scene.add.image(i * 24, 0, 'level1-broken-heart').setScale(1.2);
      this.hearts.push(heart);
      this.container.add(heart);
    }

    this.label = scene.add.text(-2, -23, 'LUZ', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: Palette.paleBoneHex,
      resolution: 1,
    });
    this.container.add(this.label);
    this.setValue(maxHp);
  }

  setValue(hp) {
    this.hearts.forEach((heart, index) => {
      heart.setAlpha(index < hp ? 1 : 0.26);
      heart.setTint(index < hp ? 0xffffff : Palette.disabled);
    });
  }
}
