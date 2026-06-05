# Kill My Ex — Level 1 Implementation Plan

## Goal

Implement `Level 1 — Denial` as the first playable Phaser battle level, following `DESIGN_DOCUMENT.md`, `level_design/LEVEL_1.md`, and the visual direction in:

- `image_sources/level_1.png`
- `image_sources/level_1_characters.png`

This phase should create reusable gameplay foundations for later levels: battle scene flow, player controls, automatic shooting, physics/collision, enemy projectiles, health, boss/shield state, special powers, HUD, pause, victory, and game-over handling.

## Current Starting Point

The project currently has:

- Phaser app shell at `390 x 844`.
- `BootScene` and `WelcomeScene`.
- Shared `palette.js`.
- Reusable `PixelButton`.
- Smoke test for the welcome screen.

Gameplay systems are not yet implemented, so Level 1 should introduce them in small modules instead of placing all behavior inside one scene.

## Source Requirements

### Design Document

Keep these controls and game rules:

- Desktop movement: `WASD` and arrow keys.
- Desktop dash: `Space`.
- Desktop special power: `E`.
- Desktop pause: `Esc`.
- Mobile movement: drag-follow movement.
- Mobile dash: quick swipe.
- Mobile special power: tap special button.
- Mobile pause: tap pause button.
- Shooting is automatic.
- Movement is responsive, slightly floaty, readable, and not too fast.
- Dash is a short burst with brief invincibility.
- The player focuses on dodging, positioning, and timing rather than manual shooting.

### Level 1 Design

Implement:

- Level: `Level 1 — Denial`.
- Quote: `It wasn't that bad.`
- Boss: `test.exe / The Denier`.
- Boss phrase: `You're exaggerating. It wasn't that serious.`
- Objective: survive, break the first emotional shield, and reduce boss HP to `0%`.
- Main projectiles: slow dismissive text bubbles.
- Shield: boss starts with a weak minimization shield.
- Special pattern: `Gaslighting Lite`, a short faster bubble pattern with light screen shake.
- Special power: `Zero Contact`, clearing bubbles, damaging the shield, and creating a short safety window.
- Completion: unlocks `Level 2 — Confusion` in future progression.

## Visual Direction

Use the reference images as implementation guidance:

- Dark green cemetery / toxic-memory background with muted clouds and grave silhouettes.
- Pink emotional projectiles and UI accents.
- Luz: small pink-haired player sprite, roughly `32x32`; collision centered around body, not full hair silhouette.
- test.exe: sunglasses boss sprite, roughly `48x48`; visible at top-center during combat.
- Projectiles: `16x16` light shot, toxic bubble, skull bubble, and glitch burst motifs.
- Level 1 battle layout:
  - Boss near top.
  - Player near bottom.
  - Top HUD with hearts, boss name/HP, and pause.
  - Bottom HUD with player HP, clarity/resource, and `CONTACT ZERO` / `ZERO CONTACT` special button.
- Keep projectiles slow, spaced, and readable for a tutorial fight.

## Asset Plan

Treat `image_sources/` as design reference, not runtime dependency.

Runtime assets should live under `assets/`.

Create or extract:

```text
assets/images/level_1/
  background.png
  luz.png
  test_exe.png
  light_shot.png
  toxic_bubble.png
  skull_bubble.png
  glitch_burst.png
  broken_heart.png
```

Preferred approach:

1. Extract clean sprite crops from `image_sources/level_1_characters.png` where feasible.
2. If extraction creates noisy crops, use the references to create simple Phaser-generated placeholder pixel textures first.
3. Keep each asset separated and replaceable so later art cleanup does not require code changes.

Do not rely on the full reference sheet at runtime.

## Proposed Code Structure

Add reusable gameplay modules:

```text
src/
  scenes/
    Level1Scene.js
  gameplay/
    controls/
      PlayerInput.js
      TouchInput.js
    entities/
      Player.js
      Boss.js
      Projectile.js
    systems/
      AutoShooter.js
      CollisionSystem.js
      HealthSystem.js
      WaveDirector.js
      SpecialPowerSystem.js
      BattleStateMachine.js
    levels/
      level1Config.js
  ui/
    BattleHud.js
    HealthBar.js
    HeartsDisplay.js
```

Keep level-specific data in `level1Config.js`; keep reusable rules in systems/classes.

Example level config shape:

```js
export const level1Config = {
  id: 'level-1',
  title: 'LEVEL 1 - DENIAL',
  quote: "It wasn't that bad.",
  boss: {
    name: 'test.exe',
    archetype: 'The Denier',
    hp: 100,
    shieldHp: 30,
  },
  player: {
    hp: 3,
    clarity: 0,
    moveSpeed: 190,
    dashSpeed: 430,
    dashDurationMs: 140,
    dashInvulnerableMs: 300,
  },
  shooting: {
    fireIntervalMs: 280,
    projectileSpeed: 360,
    damage: 3,
  },
  special: {
    name: 'ZERO CONTACT',
    clarityCost: 100,
    safetyMs: 900,
    shieldDamage: 12,
    bossDamage: 6,
  },
};
```

## Scene Flow

### 1. Route Into Level 1

For the MVP, update the welcome CTA to start `Level1Scene` directly after activation.

Later, this route can be changed to dashboard or level selection without altering Level 1 internals.

### 2. Level Intro State

Show a short intro screen/panel inside `Level1Scene`:

- `LEVEL 1`
- `DENIAL`
- `It wasn't that bad.`
- Boss preview: `test.exe`

Keep it quick:

- Continue on tap/click/keyboard.
- Auto-continue after a short delay is acceptable if interaction is also supported.

### 3. Boss Dialogue State

Show boss near top/center with dialogue bubbles:

- `No fue para tanto.` or English equivalent from level design.
- `You're exaggerating.`

Use one language consistently with the current project direction. If the game text remains mixed for now, prefer exact Level 1 design strings for gameplay-critical labels.

### 4. Combat State

Start actual battle:

- Player spawns near lower center.
- Boss remains top center.
- Auto-shooter begins firing upward.
- Boss spawns slow emotional bubbles downward.
- Boss shield absorbs player shots before boss HP can drop.
- HUD updates in real time.

### 5. Gaslighting Lite State

Trigger once after either:

- Boss shield breaks, or
- boss reaches a configured HP threshold such as `60%`.

Behavior:

- Show label: `Gaslighting Lite`.
- Spawn faster bubbles for a short burst.
- Add light camera shake.
- Keep pattern tutorial-friendly: readable lanes and avoid unavoidable walls.

### 6. Pattern Break / Safety State

When `Zero Contact` is used:

- Clear all active emotional bubbles.
- Damage shield first, then boss if shield is gone.
- Give Luz brief invulnerability / safety.
- Add a simple visual flash or expanding ring.

### 7. Victory State

When boss HP reaches `0`:

- Stop spawning projectiles.
- Clear projectiles.
- Play boss defeat pose or simple fall/fade.
- Show result screen:
  - `FASE 1 COMPLETADA` or `LEVEL 1 COMPLETE`.
  - Unlock message for Level 2.
  - `Continue` button placeholder.

### 8. Game Over State

When Luz HP reaches `0`:

- Stop player input and spawning.
- Show `GAME OVER`.
- Add `Retry` button that restarts `Level1Scene`.

## Gameplay Systems

### Player Controls

Implement `PlayerInput` as an abstraction over keyboard and touch:

- Expose normalized movement vector.
- Expose dash requests.
- Expose special requests.
- Expose pause requests.

Keyboard:

- Combine `WASD` and arrow keys.
- Normalize diagonal movement.
- `Space` requests dash.
- `E` requests special.
- `Esc` toggles pause.

Touch:

- Drag-follow movement: Luz follows the active pointer with smoothing.
- Quick swipe requests dash in swipe direction.
- Special button taps request special.
- Pause button taps request pause.

Movement feel:

- Use velocity-based Arcade physics.
- Apply light smoothing so movement feels floaty but still responsive.
- Clamp player to battle bounds and keep the bottom HUD safe from overlap.

### Automatic Shooting

Implement `AutoShooter`:

- Fires while combat is active.
- Shoots vertical light shots upward.
- Uses a fixed interval.
- Reuses inactive projectile objects via Phaser groups/pools.
- Damages boss shield first, then boss HP.

### Boss and Shield

Implement `Boss` with:

- HP.
- Shield HP.
- Shield visual state.
- Hit feedback.
- Defeat state.

Rules:

- Player shots hit shield until shield HP is `0`.
- When shield breaks, show a brief visual effect and allow boss HP damage.
- Zero Contact damages shield before boss HP.

### Emotional Bubbles

Implement enemy projectile classes or a reusable `Projectile` factory:

- Slow downward bubbles with readable speed.
- Optional text label bubble variants.
- Damage Luz for one heart on hit.
- Destroy or release back to pool on hit or leaving screen.

Projectile examples:

- `It wasn't that bad.`
- `You're too sensitive.`
- `You're exaggerating.`
- `We were just talking.`

### Wave Director

Implement `WaveDirector` as reusable pattern orchestration:

- Accept a level config.
- Spawn pattern events by phase/time/HP threshold.
- Support start, pause, resume, stop, and cleanup.

Level 1 patterns:

- Basic single bubble lanes.
- Gentle mirrored pairs.
- Slow staggered rows.
- Gaslighting Lite burst with faster bubbles and light shake.

### Collision and Damage

Use Phaser Arcade physics:

- Player shots vs boss.
- Enemy bubbles vs player.
- Enemy bubbles vs world bounds.

Damage rules:

- Luz starts with `3` hearts.
- On hit, lose one heart.
- Apply short invulnerability after damage.
- Ignore damage during dash invulnerability and Zero Contact safety window.

### Clarity / Special Resource

Implement clarity as a reusable resource:

- Starts at `0`.
- Builds from surviving, shooting shield/boss, or collecting future pickups.
- At `100%`, special becomes available.
- `Zero Contact` consumes clarity.

For Level 1, keep clarity generous so the player learns the special power.

## HUD

Create `BattleHud` from reusable pieces:

- Top HUD:
  - Level name.
  - Boss name: `test.exe`.
  - Archetype: `The Denier`.
  - Boss HP/shield bar.
  - Pause icon/button.
- Bottom HUD:
  - Luz label or portrait.
  - Hearts / HP.
  - Clarity bar.
  - Special button.
  - Current power name: `ZERO CONTACT`.

HUD must stay readable at `390 x 844` and must not overlap active gameplay in a confusing way.

## Pause

Implement a pause overlay:

- Triggered by `Esc` or pause button.
- Pauses gameplay updates, timers, and physics.
- Shows `PAUSED`, `Resume`, and `Retry`.
- Keeps visual style consistent with existing `PixelButton`.

## Reusability Targets

Build Level 1 so future levels can reuse:

- `Player`.
- `PlayerInput`.
- `AutoShooter`.
- `Projectile`.
- `Boss`.
- `BattleHud`.
- `WaveDirector`.
- `SpecialPowerSystem`.
- `BattleStateMachine`.
- `HealthBar` and `HeartsDisplay`.

Level-specific differences should live in config:

- Boss name/archetype.
- HP/shield values.
- Projectile text/visual types.
- Pattern schedule.
- Special power name/effect.
- Background art.
- Victory unlock target.

## Implementation Steps

### Phase 1 — Assets and Boot Loading

1. Add Level 1 runtime asset files or generated placeholder textures.
2. Update `BootScene` to preload Level 1 assets.
3. Register any generated fallback textures for bullets, bubbles, UI pips, and hit flashes.

### Phase 2 — Scene Registration and Routing

1. Add `Level1Scene`.
2. Register it in `gameConfig.js`.
3. Route `WelcomeScene` activation to `Level1Scene`.
4. Keep the route easy to replace with dashboard/level selection later.

### Phase 3 — Core Player Foundation

1. Implement `Player`.
2. Implement keyboard movement.
3. Implement drag-follow touch movement.
4. Implement dash with invulnerability.
5. Clamp movement to battle bounds.

### Phase 4 — Shooting and Boss Shield

1. Implement pooled player shots.
2. Implement boss entity.
3. Implement shield HP and shield break.
4. Add shot-vs-boss collision.
5. Add basic hit feedback and HUD updates.

### Phase 5 — Enemy Projectiles and Waves

1. Implement emotional bubble projectile pool.
2. Implement basic downward patterns.
3. Add bubble-vs-player collision.
4. Add player HP, hit invulnerability, and game over.

### Phase 6 — Special Power

1. Implement clarity resource.
2. Add special availability state.
3. Implement `Zero Contact`.
4. Wire `E` and special button.
5. Add bubble clear, shield/boss damage, and safety timing.

### Phase 7 — Gaslighting Lite

1. Add triggered short pattern state.
2. Increase bubble speed briefly.
3. Add light camera shake.
4. Ensure pattern remains avoidable and readable.

### Phase 8 — HUD, Pause, Victory, Retry

1. Implement `BattleHud`.
2. Implement pause overlay.
3. Implement victory screen.
4. Implement retry flow.
5. Ensure cleanup on restart.

### Phase 9 — Testing and Polish

1. Add or update smoke tests for Level 1.
2. Verify canvas renders nonblank.
3. Verify starting from welcome reaches Level 1.
4. Verify keyboard movement changes player position.
5. Verify shooting damages shield/boss.
6. Verify taking hits lowers hearts.
7. Verify Zero Contact clears bubbles.
8. Verify game over retry and victory screen.
9. Verify no major UI overlap on `390 x 844`.

## Acceptance Criteria

Level 1 is complete when:

- The player can start from the welcome screen and reach Level 1.
- Level intro and boss dialogue appear before combat.
- Luz moves with keyboard and touch drag-follow.
- Luz auto-shoots upward.
- Dash works with brief invulnerability.
- test.exe has shield HP and boss HP.
- Player shots break the shield and then damage boss HP.
- Slow emotional bubbles spawn and damage Luz on collision.
- Gaslighting Lite creates a short faster pattern with light shake.
- Zero Contact clears bubbles, damages shield/boss, and provides short safety.
- HUD shows boss, HP/shield, hearts, clarity, special, and pause.
- Pause works with `Esc` and touch/click button.
- Losing all hearts shows game over and retry.
- Reducing boss HP to `0` shows the Level 1 completion screen.
- Gameplay code is modular enough to reuse for later levels.
- `npm test` passes or any remaining test gap is documented.

## Deferred Work

Do not implement in this phase:

- Full level selection persistence.
- Real unlock saving.
- Audio soundtrack.
- Multiple playable characters.
- Advanced enemy AI.
- Level 2 gameplay.
- Final art pass beyond usable Level 1 runtime assets.

## Open Questions

No blocking questions found from the provided documents.

Implementation choices that can remain flexible:

- Exact language of in-game labels: current references mix Spanish and English. Use the wording already present in `level_design/LEVEL_1.md` for core Level 1 content unless a broader localization decision is made.
- Asset extraction quality: if clean crops from the reference sheet are not practical, use isolated generated placeholders first and preserve replacement-friendly asset keys.
