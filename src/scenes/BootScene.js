import { Palette } from '../constants/palette.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('welcomeScreen', 'assets/images/welcome_screen.png');
  }

  create() {
    this.game.canvas.style.imageRendering = 'pixelated';
    this.textures.generate('pixel', {
      data: ['1'],
      pixelWidth: 1,
      palette: { 1: '#ffffff' },
    });
    this.cameras.main.setBackgroundColor(Palette.background);
    this.scene.start('WelcomeScene');
  }
}
