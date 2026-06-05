import Projectile from '../entities/Projectile.js';

export default class WaveDirector {
  constructor(scene, config, player) {
    this.scene = scene;
    this.config = config;
    this.player = player;
    this.enabled = false;
    this.gaslightingActive = false;
    this.gaslightingTriggered = false;
    this.nextSpawnAt = 0;
    this.nextGasSpawnAt = 0;
    this.bubbleIndex = 0;
    this.group = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 48,
    });
  }

  start(time = 0) {
    this.enabled = true;
    this.nextSpawnAt = time + 500;
  }

  stop() {
    this.enabled = false;
    this.gaslightingActive = false;
  }

  update(time, bossHpPercent) {
    if (!this.enabled) {
      return;
    }

    if (!this.gaslightingTriggered && bossHpPercent <= this.config.waves.gaslightingHpThreshold) {
      this.startGaslighting(time);
    }

    if (this.gaslightingActive && time >= this.gaslightingEndsAt) {
      this.gaslightingActive = false;
    }

    if (this.gaslightingActive) {
      if (time >= this.nextGasSpawnAt) {
        this.spawnGaslighting(time);
        this.nextGasSpawnAt = time + this.config.waves.gaslightingIntervalMs;
      }
      return;
    }

    if (time >= this.nextSpawnAt) {
      this.spawnBasic(time);
      this.nextSpawnAt = time + this.config.waves.basicIntervalMs;
    }
  }

  startGaslighting(time) {
    this.gaslightingTriggered = true;
    this.gaslightingActive = true;
    this.gaslightingEndsAt = time + this.config.waves.gaslightingDurationMs;
    this.nextGasSpawnAt = time;
    this.scene.events.emit('gaslighting-lite');
  }

  spawnBasic(time) {
    const lanes = [76, 138, 195, 252, 314];
    const mode = Math.floor(time / this.config.waves.basicIntervalMs) % 3;
    if (mode === 0) {
      this.spawnBubble(lanes[this.bubbleIndex % lanes.length], -20, 92);
    } else if (mode === 1) {
      this.spawnBubble(lanes[1], -20, 82);
      this.spawnBubble(lanes[3], -44, 82);
    } else {
      lanes.forEach((x, index) => {
        if (index !== this.bubbleIndex % lanes.length) {
          this.scene.time.delayedCall(index * 110, () => this.spawnBubble(x, -20, 74));
        }
      });
    }
    this.bubbleIndex += 1;
  }

  spawnGaslighting() {
    const x = Phaser.Math.Clamp(this.player.sprite.x + Phaser.Math.Between(-92, 92), 46, 344);
    this.spawnBubble(x, -24, 142, true);
    this.spawnBubble(390 - x, -54, 126, true);
  }

  spawnBubble(x, y, speed, fast = false) {
    const text = this.config.bubbleTexts[this.bubbleIndex % this.config.bubbleTexts.length];
    const texture = fast ? 'level1-skull-bubble' : 'level1-toxic-bubble';
    const bubble = Projectile.make(this.scene, this.group, x, y, texture, speed, {
      bodyWidth: 20,
      bodyHeight: 20,
      labelText: text,
    });
    if (!bubble) {
      return;
    }

    bubble.labelObject = this.scene.add.text(x, y - 17, text, {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      color: '#e8edc8',
      align: 'center',
      backgroundColor: '#07110aaa',
      padding: { x: 3, y: 1 },
      resolution: 1,
    }).setOrigin(0.5).setDepth(13);
  }

  cleanup() {
    this.group.children.each((bubble) => {
      if (!bubble.active) {
        return;
      }

      if (bubble.labelObject) {
        bubble.labelObject.setPosition(bubble.x, bubble.y - 17);
      }

      if (bubble.y > 740) {
        Projectile.release(bubble);
      }
    });
  }

  clearBubbles() {
    this.group.children.each((bubble) => Projectile.release(bubble));
  }
}
