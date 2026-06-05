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
    this.createLevelOneTextures();
    this.cameras.main.setBackgroundColor(Palette.background);
    this.scene.start('WelcomeScene');
  }

  createLevelOneTextures() {
    this.createBackground();
    this.createLuz();
    this.createTestExe();
    this.createLightShot();
    this.createToxicBubble();
    this.createSkullBubble();
    this.createGlitchBurst();
    this.createBrokenHeart();
  }

  createBackground() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x07110a, 0x07110a, 0x162417, 0x0b160d, 1);
    graphics.fillRect(0, 0, 390, 844);
    graphics.fillStyle(0x243625, 0.8);
    graphics.fillEllipse(80, 142, 180, 36);
    graphics.fillEllipse(284, 116, 210, 42);
    graphics.fillStyle(0x030603, 0.65);
    for (let x = 26; x < 390; x += 52) {
      graphics.fillRect(x, 590 + (x % 3) * 18, 24, 74);
      graphics.fillCircle(x + 12, 590 + (x % 3) * 18, 12);
    }
    graphics.fillStyle(0x34432f, 0.55);
    graphics.fillRect(0, 674, 390, 170);
    graphics.lineStyle(1, 0x56634a, 0.24);
    for (let y = 160; y < 704; y += 42) {
      graphics.lineBetween(20, y, 370, y + 18);
    }
    graphics.generateTexture('level1-background', 390, 844);
    graphics.destroy();
  }

  createLuz() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff5f91, 1);
    graphics.fillRect(7, 2, 18, 10);
    graphics.fillRect(5, 8, 22, 8);
    graphics.fillStyle(0xe8edc8, 1);
    graphics.fillRect(10, 12, 12, 9);
    graphics.fillStyle(0x172516, 1);
    graphics.fillRect(11, 15, 3, 3);
    graphics.fillRect(19, 15, 3, 3);
    graphics.fillStyle(0xb7355b, 1);
    graphics.fillRect(11, 22, 10, 10);
    graphics.fillStyle(0x0f1410, 1);
    graphics.fillRect(8, 31, 6, 1);
    graphics.fillRect(19, 31, 6, 1);
    graphics.generateTexture('level1-luz', 32, 32);
    graphics.destroy();
  }

  createTestExe() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xe8edc8, 1);
    graphics.fillRect(13, 8, 22, 24);
    graphics.fillStyle(0x34432f, 1);
    graphics.fillRect(10, 4, 28, 9);
    graphics.fillStyle(0x030603, 1);
    graphics.fillRect(13, 15, 9, 5);
    graphics.fillRect(26, 15, 9, 5);
    graphics.fillRect(22, 17, 4, 2);
    graphics.fillStyle(0xb7355b, 1);
    graphics.fillRect(17, 26, 14, 3);
    graphics.lineStyle(2, 0xff5f91, 0.7);
    graphics.strokeRect(8, 2, 32, 34);
    graphics.generateTexture('level1-test-exe', 48, 48);
    graphics.destroy();
  }

  createLightShot() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xe8edc8, 1);
    graphics.fillRect(6, 0, 4, 16);
    graphics.fillStyle(0xff5f91, 0.85);
    graphics.fillRect(4, 3, 8, 10);
    graphics.generateTexture('level1-light-shot', 16, 16);
    graphics.destroy();
  }

  createToxicBubble() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff5f91, 0.82);
    graphics.fillCircle(12, 12, 11);
    graphics.lineStyle(2, 0xe8edc8, 0.8);
    graphics.strokeCircle(12, 12, 9);
    graphics.fillStyle(0x07110a, 0.45);
    graphics.fillCircle(8, 8, 3);
    graphics.generateTexture('level1-toxic-bubble', 24, 24);
    graphics.destroy();
  }

  createSkullBubble() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffb1c9, 0.92);
    graphics.fillCircle(12, 12, 11);
    graphics.fillStyle(0x07110a, 1);
    graphics.fillRect(7, 9, 4, 4);
    graphics.fillRect(14, 9, 4, 4);
    graphics.fillRect(10, 16, 5, 2);
    graphics.generateTexture('level1-skull-bubble', 24, 24);
    graphics.destroy();
  }

  createGlitchBurst() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff5f91, 1);
    graphics.fillRect(0, 7, 24, 3);
    graphics.fillRect(8, 0, 4, 24);
    graphics.fillStyle(0xe8edc8, 1);
    graphics.fillRect(4, 13, 16, 2);
    graphics.generateTexture('level1-glitch-burst', 24, 24);
    graphics.destroy();
  }

  createBrokenHeart() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff5f91, 1);
    graphics.fillCircle(6, 6, 5);
    graphics.fillCircle(14, 6, 5);
    graphics.fillTriangle(2, 8, 18, 8, 10, 20);
    graphics.lineStyle(2, 0x07110a, 1);
    graphics.lineBetween(10, 2, 8, 9);
    graphics.lineBetween(8, 9, 12, 13);
    graphics.lineBetween(12, 13, 10, 20);
    graphics.generateTexture('level1-broken-heart', 20, 20);
    graphics.destroy();
  }
}
