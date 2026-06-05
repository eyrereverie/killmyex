# Kill My Ex Technical Document

## Current Scope

This project is a Phaser-based single-page browser game prototype. The current implementation establishes the technical foundation and the first welcome / splash screen only.

Implemented scope:

- Single-page browser entry point.
- Local Phaser 3 runtime.
- Centered mobile-format game canvas.
- Pixel-art rendering configuration.
- Boot scene and welcome scene.
- Reusable pixel button helper.
- Shared color palette constants.
- Node-based local dev server.
- Playwright smoke test for the welcome screen.

Deferred scope:

- Onboarding flow.
- Dashboard / home screen.
- Ex creation.
- Level selection.
- Gameplay controls.
- Player, enemies, combat, collision, health, audio, and progression systems.

## Runtime

- Engine: Phaser `3.90.0`
- App type: browser single-page app
- Entry HTML: `index.html`
- App entry script: `app.js`
- Game size: `390 x 844`
- Scale mode: `Phaser.Scale.FIT`
- Centering: `Phaser.Scale.CENTER_BOTH`
- Rendering: pixel art enabled, antialias disabled, round pixels enabled
- Phaser loading: local dependency from `node_modules/phaser/dist/phaser.min.js`

The page shell in `styles.css` centers the canvas in the browser and frames it like a phone screen. Browser image rendering is set to `pixelated` / `crisp-edges`.

## Project Structure

```text
index.html
styles.css
app.js
package.json
package-lock.json
TECHNICAL_DOCUMENT.md

src/
  config/
    gameConfig.js
  constants/
    palette.js
  scenes/
    BootScene.js
    WelcomeScene.js
  ui/
    PixelButton.js

scripts/
  dev-server.mjs
  smoke-welcome.mjs
  static-server.mjs

assets/
  images/
  audio/

image_sources/
level_design/
plans/done/
```

## Application Entry

`index.html` defines the browser shell and `#game` mount point. It loads Phaser from the local npm dependency and then loads `app.js` as a browser ES module.

`app.js` waits for the window load event and starts one `Phaser.Game` instance using `gameConfig`.

## Game Configuration

`src/config/gameConfig.js` owns the Phaser configuration:

- Exports `GAME_WIDTH = 390`.
- Exports `GAME_HEIGHT = 844`.
- Sets the Phaser parent element to `game`.
- Uses the shared palette background.
- Enables pixel rendering options.
- Registers the scene order as:
  - `BootScene`
  - `WelcomeScene`

## Scenes

### BootScene

`src/scenes/BootScene.js` is the startup scene.

Current responsibilities:

- Applies canvas pixel rendering.
- Generates a simple `pixel` texture placeholder.
- Preloads `assets/images/welcome_screen.png`.
- Sets the camera background color.
- Immediately starts `WelcomeScene`.

This scene is the future home for asset preloading and generated texture registration.

### WelcomeScene

`src/scenes/WelcomeScene.js` implements the first welcome / splash screen.

Visual elements:

- Full-screen `welcome_screen.png` background image.
- Bottom CTA: `TAP TO START`.

Input:

- Pointer / touch activation through the CTA.
- Tapping outside the button also activates the CTA.
- Keyboard activation through `Enter` and `Space`.

Current transition behavior:

- The CTA fades out.
- A temporary `NEXT SCREEN COMING LATER` message appears.

This is intentionally a placeholder so the welcome screen can later route into onboarding or the main menu without changing the visual foundation.

## UI Foundation

`src/ui/PixelButton.js` defines a small reusable button helper.

It supports:

- Fixed width and height.
- Text label.
- Pointer hover state.
- Pointer down state.
- Programmatic activation via `activate()`.
- Pixel-style border, fill, and inset feedback.

The welcome screen uses this for `TAP TO START`. Later screens can reuse it for menu, continue, pause, retry, and confirmation buttons.

## Visual Constants

`src/constants/palette.js` centralizes the current color language:

- Dark background.
- Cemetery greens.
- Pale bone text.
- Pink accent / heart color.
- Dark outline.
- Disabled gray-green.

The scene code should continue to use this palette where practical so future screens keep a consistent visual tone.

## Assets

The project includes placeholder asset folders:

```text
assets/images/
assets/audio/
```

The current welcome screen uses `assets/images/welcome_screen.png` as its background, with the interactive Phaser CTA button layered above it. Final additional character art and audio can be added later.

`image_sources/` contains visual reference material and should be treated as design input, not runtime dependency.

## Scripts

Defined in `package.json`:

```text
npm run dev
npm run smoke
npm test
```

### `npm run dev`

Runs:

```text
node scripts/dev-server.mjs
```

This starts a Node static server at:

```text
http://127.0.0.1:8000/
```

Optional environment variables:

- `PORT`
- `HOST`

### `npm run smoke`

Runs:

```text
node scripts/smoke-welcome.mjs
```

The smoke test starts a temporary local Node static server on port `4173`, opens Chromium through Playwright, and verifies:

- A canvas is rendered.
- Canvas dimensions are `390 x 844`.
- The rendered canvas is not blank.
- Pressing `Enter` changes the welcome screen.

### `npm test`

Runs:

```text
npm run smoke
```

## Local Static Server

`scripts/static-server.mjs` provides the shared Node static server helper used by both the dev server and smoke test.

Current behavior:

- Serves files from the repository root.
- Maps `/` to `/index.html`.
- Sets basic content types for HTML, CSS, JavaScript, JSON, and PNG.
- Blocks path traversal attempts.

## Testing Status

Current verification command:

```text
npm test
```

Expected success output:

```text
Welcome screen smoke test passed.
```

## Development Notes

- Keep the current foundation lightweight.
- Add gameplay systems only in later phases.
- Prefer adding new screens as Phaser scenes under `src/scenes/`.
- Prefer shared UI helpers under `src/ui/`.
- Keep colors in `src/constants/palette.js` unless a screen has a strong reason for a one-off value.
- Keep runtime assets under `assets/`; keep reference images under `image_sources/`.
