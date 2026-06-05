import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig.js';
import { Palette } from '../constants/palette.js';
import PixelButton from '../ui/PixelButton.js';

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super('WelcomeScene');
    this.started = false;
  }

  create() {
    this.started = false;
    this.cameras.main.setBackgroundColor(Palette.background);

    this.addBackgroundImage();

    this.cta = new PixelButton(this, GAME_WIDTH / 2, 720, 230, 54, 'TAP TO START', () => this.startLevelOne());

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.cta.activate());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.cta.activate());
    this.input.on('pointerup', (pointer, targets) => {
      if (targets.length === 0) {
        this.cta.activate();
      }
    });
  }

  startLevelOne() {
    if (this.started) {
      return;
    }
    this.started = true;

    this.tweens.add({
      targets: this.cta.container,
      alpha: 0,
      y: 734,
      duration: 180,
      ease: 'Sine.easeOut',
      onComplete: () => this.scene.start('Level1Scene'),
    });
  }

  addBackgroundImage() {
    const background = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'welcomeScreen');
    const scale = Math.max(GAME_WIDTH / background.width, GAME_HEIGHT / background.height);
    background.setScale(scale);
  }
}
