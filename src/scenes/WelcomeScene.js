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

    this.drawBackground();
    this.drawPhoneChrome();
    this.drawTitle();
    this.drawTombstone();
    this.drawForeground();

    this.cta = new PixelButton(this, GAME_WIDTH / 2, 720, 230, 54, 'TAP TO START', () => this.startPlaceholder());
    this.drawHeart(GAME_WIDTH / 2, 779, 4);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.cta.activate());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.cta.activate());
    this.input.on('pointerup', (pointer, targets) => {
      if (targets.length === 0) {
        this.cta.activate();
      }
    });
  }

  startPlaceholder() {
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
    });

    this.add.text(GAME_WIDTH / 2, 716, 'NEXT SCREEN\nCOMING LATER', {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      color: '#e8edc8',
      align: 'center',
      lineSpacing: 4,
      resolution: 1,
    }).setOrigin(0.5);
  }

  drawBackground() {
    const g = this.add.graphics();
    g.fillStyle(Palette.background, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(Palette.sky, 1).fillRect(18, 18, GAME_WIDTH - 36, GAME_HEIGHT - 36);
    g.fillStyle(0x0b150d, 1).fillRect(26, 26, GAME_WIDTH - 52, GAME_HEIGHT - 52);

    for (let y = 32; y < GAME_HEIGHT - 44; y += 24) {
      for (let x = 30; x < GAME_WIDTH - 30; x += 24) {
        if ((x * 13 + y * 7) % 5 === 0) {
          g.fillStyle(0x0f1c12, 0.22).fillRect(x, y, 2, 2);
        }
      }
    }

    this.drawStars();
    this.drawMoon(303, 94);
    this.drawCloud(65, 171, 0.55);
    this.drawCloud(307, 204, 0.65);
    this.drawCloud(87, 337, 0.42);
  }

  drawPhoneChrome() {
    const g = this.add.graphics();
    g.lineStyle(8, Palette.outline, 1).strokeRoundedRect(10, 10, GAME_WIDTH - 20, GAME_HEIGHT - 20, 18);
    g.lineStyle(3, Palette.mutedGreen, 1).strokeRoundedRect(18, 18, GAME_WIDTH - 36, GAME_HEIGHT - 36, 12);
    g.fillStyle(Palette.outline, 1).fillRoundedRect(160, 18, 70, 7, 3);
  }

  drawStars() {
    const starPoints = [
      [66, 53], [116, 84], [167, 54], [229, 78], [91, 121], [294, 132],
      [331, 60], [58, 265], [318, 297], [112, 435], [276, 420], [65, 517],
    ];

    const g = this.add.graphics();
    starPoints.forEach(([x, y], index) => {
      g.fillStyle(index % 3 === 0 ? Palette.pink : Palette.paleBone, 1);
      g.fillRect(x, y - 5, 3, 11);
      g.fillRect(x - 4, y - 1, 11, 3);
    });
  }

  drawMoon(x, y) {
    const g = this.add.graphics();
    g.fillStyle(Palette.paleBone, 1).fillCircle(x, y, 20);
    g.fillStyle(Palette.sky, 1).fillCircle(x - 10, y - 4, 20);
    g.fillStyle(Palette.background, 0.35).fillCircle(x + 6, y + 8, 3);
  }

  drawCloud(x, y, alpha) {
    const g = this.add.graphics();
    g.fillStyle(Palette.mutedGreen, alpha);
    g.fillRect(x - 36, y + 10, 82, 15);
    g.fillRect(x - 22, y, 36, 12);
    g.fillRect(x + 10, y + 4, 48, 14);
    g.fillStyle(Palette.cemeteryGreen, alpha);
    g.fillRect(x - 28, y + 25, 104, 10);
  }

  drawTitle() {
    const shadowStyle = {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '78px',
      fontStyle: 'bold',
      color: '#24301f',
      align: 'center',
      lineSpacing: -18,
      resolution: 1,
    };
    const titleStyle = {
      ...shadowStyle,
      color: '#e8edc8',
      stroke: '#9ba77f',
      strokeThickness: 3,
    };

    this.add.text(GAME_WIDTH / 2 + 5, 148, 'Kill\nMy Ex', shadowStyle).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 142, 'Kill\nMy Ex', titleStyle).setOrigin(0.5);
    this.drawHeart(195, 112, 3);
  }

  drawTombstone() {
    const g = this.add.graphics();
    const x = GAME_WIDTH / 2;
    const y = 405;
    g.fillStyle(Palette.outline, 1).fillRoundedRect(x - 62, y - 86, 124, 154, 42);
    g.fillStyle(Palette.cemeteryGreen, 1).fillRoundedRect(x - 54, y - 78, 108, 146, 38);
    g.fillStyle(Palette.mutedGreen, 1).fillRoundedRect(x - 40, y - 58, 80, 96, 28);
    g.fillStyle(Palette.cemeteryGreen, 1).fillRect(x - 54, y - 12, 108, 80);
    g.lineStyle(3, Palette.outline, 1).strokeRoundedRect(x - 41, y - 58, 82, 108, 24);

    this.add.text(x, y - 29, 'RIP', {
      fontFamily: '"Courier New", monospace',
      fontSize: '27px',
      color: '#07110a',
      align: 'center',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5);

    this.add.text(x, y + 17, 'PATRONES\nTOXICOS', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      color: '#07110a',
      align: 'center',
      lineSpacing: -2,
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5);
  }

  drawForeground() {
    const g = this.add.graphics();
    g.fillStyle(0x101b12, 1).fillRect(22, 586, GAME_WIDTH - 44, 190);
    g.fillStyle(Palette.deepGreen, 1).fillRect(0, 616, GAME_WIDTH, 228);
    g.fillStyle(Palette.cemeteryGreen, 1);

    for (let x = 18; x < GAME_WIDTH; x += 45) {
      g.fillRect(x, 555, 20, 62);
      g.fillCircle(x + 10, 555, 10);
      g.fillStyle(Palette.outline, 1).fillRect(x + 8, 574, 4, 22);
      g.fillRect(x, 584, 20, 4);
      g.fillStyle(Palette.cemeteryGreen, 1);
    }

    for (let x = 0; x < GAME_WIDTH; x += 18) {
      const height = 18 + ((x * 7) % 34);
      g.fillStyle(x % 36 === 0 ? Palette.cemeteryGreen : 0x22301f, 1).fillRect(x, 620 - height, 10, height);
    }

    g.fillStyle(Palette.outline, 0.7);
    g.fillRect(0, 686, GAME_WIDTH, 158);
  }

  drawHeart(x, y, scale) {
    const g = this.add.graphics();
    g.fillStyle(Palette.pinkDark, 1);
    this.heartPixels(g, x + scale, y + scale, scale);
    g.fillStyle(Palette.pink, 1);
    this.heartPixels(g, x, y, scale);
    g.fillStyle(Palette.paleBone, 1).fillRect(x - scale, y - scale * 2, scale, scale);
  }

  heartPixels(g, x, y, s) {
    const rows = [
      '0110110',
      '1111111',
      '1111111',
      '0111110',
      '0011100',
      '0001000',
    ];

    rows.forEach((row, yy) => {
      [...row].forEach((cell, xx) => {
        if (cell === '1') {
          g.fillRect(x + (xx - 3) * s, y + (yy - 3) * s, s, s);
        }
      });
    });
  }
}
