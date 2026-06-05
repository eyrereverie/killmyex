# Kill My Ex — Technical Foundation Plan

## Goal

Set up the first technical foundation for the Phaser prototype as a single-page game app. The first implemented screen should be the welcome / splash screen shown in the upper-left panel of `image_sources/ui_journey_01.png`.

This phase should only establish the foundation and the welcome screen. Gameplay, level selection, onboarding flow, combat, enemies, and progression should come later.

## Source References

- `DESIGN_DOCUMENT.md`
- `image_sources/ui_journey_01.png`

## Target Runtime

- Engine: Phaser
- App type: single-page app
- Canvas size: `390 x 844`
- Position: centered in the browser window
- Scaling: preserve proportions while allowing responsive fit / fullscreen later
- Pixel style: crisp pixel graphics with no antialiasing
- First screen: `Splash / Welcome`

## Phase 1 Scope

### 1. Project Structure

Create a small browser game structure:

```text
index.html
styles.css
app.js
src/
  config/
    gameConfig.js
  scenes/
    BootScene.js
    WelcomeScene.js
  ui/
    PixelButton.js
  constants/
    palette.js
assets/
  images/
  audio/
```

For the first pass, the app can remain lightweight. If the project does not yet use a bundler, start with plain browser JavaScript and Phaser loaded from a CDN or local vendor file. A bundler can be added later when the codebase grows.

### 2. Phaser Game Configuration

Set up one Phaser game instance with:

- `width: 390`
- `height: 844`
- `backgroundColor`: dark green-black
- scale mode: fit inside the page while preserving aspect ratio
- auto-center enabled
- pixel art enabled
- antialias disabled
- scene list beginning with `BootScene` and `WelcomeScene`

The page surrounding the canvas should be quiet and centered, with the canvas visually framed like a phone screen.

### 3. Boot Scene

Create `BootScene` as the asset and startup scene.

Initial responsibilities:

- Set pixel rendering defaults.
- Load any placeholder assets required by the welcome screen.
- Register generated textures if using Phaser graphics for temporary pixel-art elements.
- Transition directly to `WelcomeScene`.

For this phase, placeholder/generated textures are acceptable. Final character art, logo art, and audio can be added later.

### 4. Welcome Scene

Implement only the splash / welcome screen from the upper-left reference:

Visual composition:

- Dark cemetery background.
- Small stars in the sky.
- Crescent moon in the upper-right area.
- Pixel clouds / fog.
- Large title: `Kill My Ex`.
- Small pink heart accent in the title area.
- Tombstone centered under the title.
- Tombstone text: `RIP PATRONES TOXICOS`.
- Primary CTA near the bottom: `TAP TO START`.
- Pink heart below the CTA.

Interaction:

- Clicking / tapping anywhere or pressing `Enter` should trigger a placeholder transition.
- Since later screens are out of scope, the transition can currently show a temporary text state such as `Next screen coming later` or restart / idle on the welcome screen.
- Keep the CTA behavior isolated so it can later route to onboarding or the main menu without rewriting the scene.

Tone:

- Pixel Game Boy inspired.
- Dark, cute, ironic, slightly toxic-humor mood.
- High contrast and readable at mobile size.

### 5. UI Foundation

Create a small reusable button helper, even if the welcome screen only has one CTA.

`PixelButton` should support:

- Text label
- Fixed dimensions
- Pointer hover / down states
- Keyboard-triggerable action support where useful
- Pixel-style border and fill

Keep this helper simple. It should establish a pattern for later menu buttons, pause buttons, retry buttons, and continue buttons.

### 6. Visual Constants

Create a central palette file for reusable colors:

- background black-green
- muted cemetery green
- pale bone text
- pink heart / CTA accent
- dark outline
- disabled gray-green

This gives later screens a shared visual language without forcing a full design system too early.

### 7. Input Foundation

For now, support:

- pointer / touch tap
- mouse click
- `Enter` / `Space` for the welcome CTA

Do not implement movement, shooting, dash, or battle controls yet. Those belong to the gameplay foundation phase.

### 8. Acceptance Criteria

The foundation phase is complete when:

- Opening `index.html` or running the local dev server displays a centered `390 x 844` Phaser canvas.
- The canvas scales proportionally to fit the browser window.
- Pixel art renders crisp, without smoothing.
- The welcome screen visually matches the upper-left reference in layout and mood.
- `TAP TO START` is visible and interactive.
- Pointer/touch and keyboard activation work.
- Code is split into small foundation modules instead of everything living in one long script.
- No gameplay systems are implemented yet.

## Deferred Work

The following should not be built in this phase:

- Full onboarding screens.
- Home / dashboard screen.
- Ex naming input.
- Ex archetype selection.
- Level selection.
- Player movement.
- Shooting.
- Enemy waves.
- Collision.
- Health systems.
- Victory / game-over flows.
- Audio system beyond placeholder hooks.

## Suggested Next Phase

After the welcome foundation is working, build the onboarding path from `image_sources/ui_journey_01.png`:

1. Bienvenida message screen.
2. `Como funciona?` three-step explanation.
3. Empty home state.
4. Name input screen.
5. Ex archetype selection.

That phase should end with a first created ex profile and a route into the later level selection / dashboard.
