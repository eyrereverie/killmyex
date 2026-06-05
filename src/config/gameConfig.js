import BootScene from '../scenes/BootScene.js';
import Level1Scene from '../scenes/Level1Scene.js';
import WelcomeScene from '../scenes/WelcomeScene.js';
import { Palette } from '../constants/palette.js';

export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: Palette.backgroundHex,
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [BootScene, WelcomeScene, Level1Scene],
};
