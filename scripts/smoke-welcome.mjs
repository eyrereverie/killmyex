import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { createStaticServer, listen } from './static-server.mjs';

const port = 4173;
const server = createStaticServer({ port });

await listen(server, { port });

let browser;

try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  const browserMessages = [];
  page.on('console', (message) => browserMessages.push(`${message.type()}: ${message.text()}`));
  page.on('pageerror', (error) => browserMessages.push(`pageerror: ${error.message}`));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  const canvas = page.locator('canvas');
  await canvas.waitFor();
  await page.waitForTimeout(600);

  const size = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      width: canvas.width,
      height: canvas.height,
    };
  });

  if (size.width !== 390 || size.height !== 844) {
    throw new Error(`Expected a 390 x 844 canvas, got ${size.width} x ${size.height}.`);
  }

  const before = await canvas.screenshot();
  const uniqueBytes = new Set(before).size;
  if (before.length < 5000 || uniqueBytes < 50) {
    throw new Error(
      `Canvas rendered, but it looks unexpectedly blank. Screenshot bytes: ${before.length}, unique bytes: ${uniqueBytes}. Browser messages: ${browserMessages.join(' | ') || 'none'}`
    );
  }

  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);

  const beforeHash = createHash('sha256').update(before).digest('hex');
  const afterHash = createHash('sha256').update(await canvas.screenshot()).digest('hex');
  if (afterHash === beforeHash) {
    throw new Error('Pressing Enter did not change the welcome screen.');
  }

  await page.waitForFunction(() => window.killMyExGame?.scene.getScene('Level1Scene')?.scene.settings.active);
  try {
    await page.waitForFunction(() => window.killMyExGame?.scene.getScene('Level1Scene')?.state?.state === 'combat', {
      timeout: 5000,
    });
  } catch (error) {
    const debugState = await page.evaluate(() => {
      const scene = window.killMyExGame?.scene.getScene('Level1Scene');
      return {
        active: scene?.scene.settings.active,
        state: scene?.state?.state,
        clockNow: scene?.time?.now,
        events: scene?.time?.getAllEvents?.().length,
      };
    });
    throw new Error(
      `Timed out waiting for Level 1 combat. Debug: ${JSON.stringify(debugState)}. Browser messages: ${browserMessages.join(' | ') || 'none'}. Original: ${error.message}`
    );
  }

  const levelState = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    return {
      active: scene.scene.settings.active,
      state: scene.state?.state,
      playerVisible: scene.player?.sprite.visible,
      hudVisible: scene.hud?.top.visible,
      playerX: scene.player?.sprite.x,
      playerY: scene.player?.sprite.y,
      bossHp: scene.boss?.hp,
      shieldHp: scene.boss?.shieldHp,
    };
  });

  if (!levelState.active || levelState.state !== 'combat' || !levelState.playerVisible || !levelState.hudVisible) {
    throw new Error(`Expected Level 1 combat to be active. State: ${JSON.stringify(levelState)}.`);
  }

  await canvas.click({ position: { x: 195, y: 646 } });
  await page.waitForTimeout(900);
  const shieldWithoutShooting = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    return scene.boss.shieldHp;
  });

  if (shieldWithoutShooting !== levelState.shieldHp) {
    throw new Error(`Expected shield to stay unchanged without Space shooting. Before: ${levelState.shieldHp}, after: ${shieldWithoutShooting}.`);
  }

  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(220);
  }

  await page.waitForTimeout(1700);
  const brokenShieldState = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    return {
      shieldHp: scene.boss.shieldHp,
      bossVisible: scene.boss.sprite.visible,
      bossAlpha: scene.boss.sprite.alpha,
      exposedVisible: scene.boss.exposedMarker.visible,
      activeShots: scene.playerShooter.group.countActive(true),
      shots: scene.playerShooter.group.getChildren()
        .filter((shot) => shot.active)
        .slice(0, 4)
        .map((shot) => ({ x: Math.round(shot.x), y: Math.round(shot.y), vy: Math.round(shot.body.velocity.y) })),
      time: Math.round(scene.time.now),
      shootKeyDown: scene.inputHandler.keys.shoot.isDown,
    };
  });

  if (brokenShieldState.shieldHp !== 0 || !brokenShieldState.bossVisible || brokenShieldState.bossAlpha <= 0 || !brokenShieldState.exposedVisible) {
    throw new Error(`Expected Space shooting to break the shield while boss stays visible. State: ${JSON.stringify(brokenShieldState)}.`);
  }

  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(450);
  await page.keyboard.up('ArrowLeft');

  const movedPlayer = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    return {
      x: scene.player.sprite.x,
      y: scene.player.sprite.y,
      shieldHp: scene.boss.shieldHp,
    };
  });

  if (movedPlayer.x >= levelState.playerX - 10) {
    throw new Error(`Expected keyboard movement to move Luz left. Before: ${levelState.playerX}, after: ${movedPlayer.x}.`);
  }

  const reviveStartState = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    scene.player.damage(scene.time.now);
    scene.revivePlayer();
    return {
      hp: scene.player.hp,
      x: scene.player.sprite.x,
      y: scene.player.sprite.y,
      bodyEnabled: scene.player.sprite.body.enable,
      visible: scene.player.sprite.visible,
      canMove: scene.player.canMove,
      canShoot: scene.player.canShoot,
      isRespawning: scene.player.isRespawning,
      state: scene.state.state,
    };
  });

  if (reviveStartState.hp !== 2 || reviveStartState.x !== 195 || reviveStartState.y !== 646 || reviveStartState.bodyEnabled || reviveStartState.visible || reviveStartState.canMove || reviveStartState.canShoot || !reviveStartState.isRespawning || reviveStartState.state !== 'combat') {
    throw new Error(`Expected Luz to enter respawn delay after losing one heart. State: ${JSON.stringify(reviveStartState)}.`);
  }

  await page.waitForTimeout(850);

  const reviveCompleteState = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    return {
      hp: scene.player.hp,
      x: scene.player.sprite.x,
      y: scene.player.sprite.y,
      bodyEnabled: scene.player.sprite.body.enable,
      visible: scene.player.sprite.visible,
      active: scene.player.sprite.active,
      alpha: scene.player.sprite.alpha,
      canMove: scene.player.canMove,
      canShoot: scene.player.canShoot,
      isAlive: scene.player.isAlive,
      isRespawning: scene.player.isRespawning,
      state: scene.state.state,
    };
  });

  if (reviveCompleteState.hp !== 2 || reviveCompleteState.x !== 195 || reviveCompleteState.y !== 646 || !reviveCompleteState.bodyEnabled || !reviveCompleteState.visible || !reviveCompleteState.active || reviveCompleteState.alpha <= 0 || !reviveCompleteState.canMove || !reviveCompleteState.canShoot || !reviveCompleteState.isAlive || reviveCompleteState.isRespawning || reviveCompleteState.state !== 'combat') {
    throw new Error(`Expected Luz to be visible and active after respawn. State: ${JSON.stringify(reviveCompleteState)}.`);
  }

  await page.keyboard.press('Space');
  await page.waitForTimeout(120);

  const postRespawnShotState = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    return {
      activeShots: scene.playerShooter.group.countActive(true),
      canShoot: scene.player.canShoot,
      visible: scene.player.sprite.visible,
    };
  });

  if (postRespawnShotState.activeShots < 1 || !postRespawnShotState.canShoot || !postRespawnShotState.visible) {
    throw new Error(`Expected Luz to shoot after respawning. State: ${JSON.stringify(postRespawnShotState)}.`);
  }

  const secondHitState = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    scene.player.invulnerableUntil = 0;
    scene.player.damage(scene.time.now);
    scene.revivePlayer();
    return {
      hp: scene.player.hp,
      bodyEnabled: scene.player.sprite.body.enable,
      visible: scene.player.sprite.visible,
      canMove: scene.player.canMove,
      canShoot: scene.player.canShoot,
      isRespawning: scene.player.isRespawning,
    };
  });

  if (secondHitState.hp !== 1 || secondHitState.bodyEnabled || secondHitState.visible || secondHitState.canMove || secondHitState.canShoot || !secondHitState.isRespawning) {
    throw new Error(`Expected Luz to be hittable again and enter a second respawn. State: ${JSON.stringify(secondHitState)}.`);
  }

  await page.evaluate(() => window.killMyExGame.scene.getScene('Level1Scene').scene.restart());
  await page.waitForFunction(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    return scene?.state?.state === 'intro' && scene.player?.hp === scene.player?.maxHp;
  });

  const restartState = await page.evaluate(() => {
    const scene = window.killMyExGame.scene.getScene('Level1Scene');
    return {
      hp: scene.player.hp,
      maxHp: scene.player.maxHp,
      x: scene.player.sprite.x,
      y: scene.player.sprite.y,
      visible: scene.player.sprite.visible,
      active: scene.player.sprite.active,
      bodyEnabled: scene.player.sprite.body.enable,
      canMove: scene.player.canMove,
      canShoot: scene.player.canShoot,
      isAlive: scene.player.isAlive,
      isRespawning: scene.player.isRespawning,
      physicsPaused: scene.physics.world.isPaused,
      state: scene.state.state,
    };
  });

  if (restartState.hp !== 3 || restartState.maxHp !== 3 || restartState.x !== 195 || restartState.y !== 646 || restartState.visible || !restartState.active || !restartState.bodyEnabled || !restartState.canMove || !restartState.canShoot || !restartState.isAlive || restartState.isRespawning || restartState.physicsPaused || restartState.state !== 'intro') {
    throw new Error(`Expected retry/restart to reset Luz completely. State: ${JSON.stringify(restartState)}.`);
  }

  console.log('Welcome and Level 1 smoke test passed.');
} finally {
  if (browser) {
    await browser.close();
  }
  await new Promise((resolveClose) => server.close(resolveClose));
}
