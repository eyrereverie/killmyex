import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig.js';
import { Palette } from '../constants/palette.js';
import PlayerInput from '../gameplay/controls/PlayerInput.js';
import Boss from '../gameplay/entities/Boss.js';
import Player from '../gameplay/entities/Player.js';
import Projectile from '../gameplay/entities/Projectile.js';
import PlayerShooter from '../gameplay/systems/PlayerShooter.js';
import BattleStateMachine from '../gameplay/systems/BattleStateMachine.js';
import CollisionSystem from '../gameplay/systems/CollisionSystem.js';
import SpecialPowerSystem from '../gameplay/systems/SpecialPowerSystem.js';
import WaveDirector from '../gameplay/systems/WaveDirector.js';
import { level1Config } from '../gameplay/levels/level1Config.js';
import BattleHud from '../ui/BattleHud.js';
import PixelButton from '../ui/PixelButton.js';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene');
  }

  create() {
    this.configData = level1Config;
    this.state = new BattleStateMachine('intro');
    this.inputHandler = new PlayerInput(this);
    this.cameras.main.setBackgroundColor(Palette.background);
    this.addBackground();

    this.player = new Player(this, GAME_WIDTH / 2, 646, this.configData.player, this.configData.battleBounds);
    this.boss = new Boss(this, GAME_WIDTH / 2, 168, this.configData.boss);
    this.playerShooter = new PlayerShooter(this, this.player, this.configData.shooting);
    this.waveDirector = new WaveDirector(this, this.configData, this.player);
    this.special = new SpecialPowerSystem(this.configData.special);
    this.collisions = new CollisionSystem(this);
    this.hud = new BattleHud(this, this.configData, {
      onPause: () => this.inputHandler.requestPause(),
      onSpecial: () => this.inputHandler.requestSpecial(),
    });

    this.hud.setVisible(false);
    this.setupCollisions();
    this.setupEvents();
    this.showIntro();
  }

  addBackground() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'level1-background').setDepth(0);
    this.add.rectangle(GAME_WIDTH / 2, 418, 342, 572, 0x0d1a10, 0.16)
      .setStrokeStyle(1, Palette.mutedGreen, 0.35)
      .setDepth(1);
  }

  setupEvents() {
    this.events.on('gaslighting-lite', () => {
      this.showFloatingLabel('GASLIGHTING LITE');
      this.cameras.main.shake(260, 0.004);
    });
  }

  setupCollisions() {
    this.collisions.overlap(this.playerShooter.group, this.boss.sprite, (objectA, objectB) => {
      if (!this.state.is('combat')) {
        return;
      }

      const shot = objectA === this.boss.sprite ? objectB : objectA;
      const result = this.boss.applyDamage(shot.damage);
      this.special.addClarity(this.configData.shooting.clarityOnHit);
      Projectile.release(shot);
      if (result.shieldBroke) {
        this.showFloatingLabel('SHIELD BROKEN');
        this.waveDirector.startGaslighting(this.time.now);
      }
      if (result.defeated) {
        this.handleVictory();
      }
    });

    this.collisions.overlap(this.waveDirector.group, this.player.sprite, (bubble) => {
      if (!this.state.is('combat')) {
        return;
      }

      if (this.player.damage(this.time.now)) {
        Projectile.release(bubble);
        this.cameras.main.shake(120, 0.003);
        if (this.player.hp <= 0) {
          this.handleGameOver();
        } else {
          this.revivePlayer();
        }
      }
    });
  }

  showIntro() {
    this.player.sprite.setVisible(false);
    this.boss.sprite.setVisible(false);
    this.boss.shield.setVisible(false);

    this.introLayer = this.add.container(0, 0).setDepth(50);
    this.introLayer.add(this.add.rectangle(195, 422, 390, 844, Palette.background, 0.72));
    this.introLayer.add(this.add.text(195, 280, this.configData.title, {
      fontFamily: '"Courier New", monospace',
      fontSize: '24px',
      color: Palette.paleBoneHex,
      align: 'center',
      resolution: 1,
    }).setOrigin(0.5));
    this.introLayer.add(this.add.text(195, 322, this.configData.phase, {
      fontFamily: '"Courier New", monospace',
      fontSize: '42px',
      color: '#ff5f91',
      align: 'center',
      resolution: 1,
    }).setOrigin(0.5));
    this.introLayer.add(this.add.text(195, 378, `"${this.configData.quote}"`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      color: Palette.paleBoneHex,
      align: 'center',
      resolution: 1,
    }).setOrigin(0.5));
    this.introLayer.add(this.add.image(195, 462, 'level1-test-exe').setScale(1.4));
    this.introLayer.add(this.add.text(195, 526, this.configData.boss.name, {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      color: '#ffb1c9',
      align: 'center',
      resolution: 1,
    }).setOrigin(0.5));

    this.input.keyboard.once('keydown', () => this.showDialogue());
    this.input.once('pointerup', () => this.showDialogue());
    this.time.delayedCall(1800, () => this.showDialogue());
  }

  showDialogue() {
    if (!this.state.is('intro')) {
      return;
    }

    this.state.set('dialogue');
    this.introLayer.destroy();
    this.player.sprite.setVisible(true);
    this.boss.sprite.setVisible(true);
    this.boss.shield.setVisible(true);

    this.dialogueLayer = this.add.container(0, 0).setDepth(50);
    this.dialogueLayer.add(this.add.rectangle(195, 101, 336, 58, Palette.background, 0.92)
      .setStrokeStyle(2, Palette.pink, 0.9));
    this.dialogueLayer.add(this.add.text(195, 101, "You're exaggerating.\nIt wasn't that serious.", {
      fontFamily: '"Courier New", monospace',
      fontSize: '15px',
      color: Palette.paleBoneHex,
      align: 'center',
      lineSpacing: 4,
      resolution: 1,
    }).setOrigin(0.5));

    this.input.keyboard.once('keydown', () => this.startCombat());
    this.input.once('pointerup', () => this.startCombat());
    this.time.delayedCall(1800, () => this.startCombat());
  }

  startCombat() {
    if (!this.state.is('dialogue')) {
      return;
    }

    this.state.set('combat');
    this.dialogueLayer.destroy();
    this.hud.setVisible(true);
    this.waveDirector.start(this.time.now);
  }

  update(time) {
    if (this.inputHandler.consumePauseRequest()) {
      this.togglePause();
    }

    if (!this.state.is('combat')) {
      return;
    }

    this.player.update(time, this.inputHandler);
    this.boss.update();
    if (this.inputHandler.consumeShootRequest()) {
      this.playerShooter.shoot(time);
    }
    this.playerShooter.cleanup();
    this.waveDirector.update(time, (this.boss.hp / this.boss.maxHp) * 100);
    this.waveDirector.cleanup();

    this.special.addClarity(0.018 * (this.game.loop.delta || 16));
    if (this.inputHandler.consumeSpecialRequest()) {
      this.useSpecial(time);
    }

    this.hud.update(this.player, this.boss, this.special);
  }

  useSpecial(time) {
    if (!this.special.consume()) {
      return;
    }

    this.waveDirector.clearBubbles();
    this.player.setSafety(time, this.configData.special.safetyMs);
    this.boss.applyDamage(this.configData.special.shieldDamage);
    if (this.boss.shieldHp <= 0) {
      this.boss.applyDamage(this.configData.special.bossDamage);
    }
    this.drawSpecialRing();
    this.showFloatingLabel(this.configData.special.name);
    if (this.boss.hp <= 0) {
      this.handleVictory();
    }
  }

  drawSpecialRing() {
    const ring = this.add.circle(this.player.sprite.x, this.player.sprite.y, 12)
      .setStrokeStyle(3, Palette.pink, 0.9)
      .setDepth(35);
    this.tweens.add({
      targets: ring,
      radius: 132,
      alpha: 0,
      duration: 460,
      ease: 'Sine.easeOut',
      onComplete: () => ring.destroy(),
    });
  }

  showFloatingLabel(text) {
    const label = this.add.text(195, 246, text, {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      color: '#ffb1c9',
      align: 'center',
      backgroundColor: '#07110acc',
      padding: { x: 8, y: 4 },
      resolution: 1,
    }).setOrigin(0.5).setDepth(60);

    this.tweens.add({
      targets: label,
      y: 222,
      alpha: 0,
      duration: 900,
      ease: 'Sine.easeOut',
      onComplete: () => label.destroy(),
    });
  }

  togglePause() {
    if (this.state.is('combat')) {
      this.state.set('paused');
      this.physics.pause();
      this.waveDirector.stop();
      this.showPauseOverlay();
      return;
    }

    if (this.state.is('paused')) {
      this.resumeCombat();
    }
  }

  showPauseOverlay() {
    this.pauseLayer = this.add.container(0, 0).setDepth(80);
    this.pauseLayer.add(this.add.rectangle(195, 422, 390, 844, Palette.background, 0.7));
    this.pauseLayer.add(this.add.text(195, 326, 'PAUSED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '34px',
      color: Palette.paleBoneHex,
      resolution: 1,
    }).setOrigin(0.5));
    const resume = new PixelButton(this, 195, 402, 180, 48, 'RESUME', () => this.resumeCombat());
    const retry = new PixelButton(this, 195, 466, 180, 48, 'RETRY', () => this.scene.restart());
    this.pauseLayer.add([resume.container, retry.container]);
  }

  resumeCombat() {
    if (!this.state.is('paused')) {
      return;
    }
    this.pauseLayer.destroy();
    this.state.set('combat');
    this.physics.resume();
    this.waveDirector.start(this.time.now);
  }

  revivePlayer() {
    this.waveDirector.clearBubbles();
    this.player.revive(this.time.now, GAME_WIDTH / 2, 646);
    this.showFloatingLabel(`${this.player.hp} HEART${this.player.hp === 1 ? '' : 'S'} LEFT`);
  }

  handleGameOver() {
    if (!this.state.is('combat')) {
      return;
    }
    this.state.set('gameover');
    this.stopBattle();
    this.showEndScreen('GAME OVER', 'RETRY', () => this.scene.restart());
  }

  handleVictory() {
    if (!this.state.is('combat')) {
      return;
    }
    this.state.set('victory');
    this.stopBattle();
    this.boss.defeat(() => {
      this.showEndScreen('LEVEL 1 COMPLETE', 'CONTINUE', () => this.scene.start('WelcomeScene'));
    });
  }

  stopBattle() {
    this.waveDirector.stop();
    this.playerShooter.clear();
    this.waveDirector.clearBubbles();
    this.physics.pause();
  }

  showEndScreen(title, buttonLabel, onButton) {
    const layer = this.add.container(0, 0).setDepth(90);
    layer.add(this.add.rectangle(195, 422, 390, 844, Palette.background, 0.76));
    layer.add(this.add.text(195, 346, title, {
      fontFamily: '"Courier New", monospace',
      fontSize: title.length > 12 ? '26px' : '36px',
      color: Palette.paleBoneHex,
      align: 'center',
      resolution: 1,
    }).setOrigin(0.5));
    if (title !== 'GAME OVER') {
      layer.add(this.add.text(195, 394, `Unlocks ${this.configData.unlocks}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '15px',
        color: '#ffb1c9',
        align: 'center',
        resolution: 1,
      }).setOrigin(0.5));
    }
    const button = new PixelButton(this, 195, 476, 242, 52, buttonLabel, onButton);
    button.text.setFontSize(buttonLabel.length > 12 ? 14 : 22);
    layer.add(button.container);
  }

  shutdown() {
    this.inputHandler?.destroy();
    this.collisions?.destroy();
  }
}
