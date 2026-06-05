import { gameConfig } from './src/config/gameConfig.js';

window.addEventListener('load', () => {
  if (!window.Phaser) {
    throw new Error('Phaser failed to load.');
  }

  new Phaser.Game(gameConfig);
});
