import { Palette } from '../constants/palette.js';
import PixelButton from './PixelButton.js';
import HealthBar from './HealthBar.js';
import HeartsDisplay from './HeartsDisplay.js';

export default class BattleHud {
  constructor(scene, config, callbacks) {
    this.scene = scene;
    this.config = config;

    this.top = scene.add.container(0, 0).setDepth(40);
    this.bottom = scene.add.container(0, 0).setDepth(40);

    const topBack = scene.add.rectangle(195, 48, 390, 96, Palette.background, 0.82)
      .setStrokeStyle(2, Palette.mutedGreen, 0.9);
    const bottomBack = scene.add.rectangle(195, 778, 390, 132, Palette.background, 0.9)
      .setStrokeStyle(2, Palette.mutedGreen, 0.9);
    this.top.add(topBack);
    this.bottom.add(bottomBack);

    this.levelText = scene.add.text(18, 15, `${config.title} - ${config.phase}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: Palette.paleBoneHex,
      resolution: 1,
    });
    this.bossText = scene.add.text(18, 35, `${config.boss.name} / ${config.boss.archetype}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#ffb1c9',
      resolution: 1,
    });
    this.top.add([this.levelText, this.bossText]);

    this.bossBar = new HealthBar(scene, 18, 70, 224, 14, 'BOSS');
    this.shieldBar = new HealthBar(scene, 254, 70, 82, 14, 'SHIELD');

    this.pauseButton = new PixelButton(scene, 360, 43, 42, 36, 'II', callbacks.onPause);
    this.pauseButton.text.setFontSize(18);

    this.hearts = new HeartsDisplay(scene, 28, 766, config.player.hp);
    this.clarityBar = new HealthBar(scene, 126, 770, 128, 16, 'CLARITY');
    this.specialButton = new PixelButton(scene, 301, 787, 148, 44, config.special.name, callbacks.onSpecial);
    this.specialButton.text.setFontSize(13);
  }

  update(player, boss, special) {
    this.hearts.setValue(player.hp);
    this.bossBar.setValue(boss.hp / boss.maxHp, Palette.pink);
    this.shieldBar.setValue(boss.shieldHp / boss.maxShieldHp, Palette.paleBone);
    this.clarityBar.setValue(special.clarity / 100, special.isReady() ? Palette.pink : Palette.mutedGreen);
    this.specialButton.container.setAlpha(special.isReady() ? 1 : 0.58);
  }

  setVisible(visible) {
    this.top.setVisible(visible);
    this.bottom.setVisible(visible);
    this.bossBar.container.setVisible(visible);
    this.shieldBar.container.setVisible(visible);
    this.pauseButton.container.setVisible(visible);
    this.hearts.container.setVisible(visible);
    this.clarityBar.container.setVisible(visible);
    this.specialButton.container.setVisible(visible);
  }
}
