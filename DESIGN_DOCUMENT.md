---
title: Kill My Ex
project: killmyex
document: DESIGN-DOCUMENT.md
version: 0.1.0
status: active
last_updated: 2026-06-05
authors: Maira Marcucci, GPT-5.3-Codex
---

# Kill My Ex Design Specification

## Table of Contents

```
1. Purpose and Scope
2. Technical Foundation
3. Story
4. Game Composition
4.1 Main Menu
4.2 Level Composition
5. Game Mechanics
```

## 1. Purpose and Scope

This document defines the target structure and behavior of the current kill my ex mini shooter implemented in Phaser game engine.

Primary scope:
* Game concept: Kill My Ex is a stylized pixel-art mini shooter about fighting symbolic emotional enemies after a breakup, with a dark, playful, arcade tone.
* Core gameplay loop: The player enters a level, moves, dodges, shoots enemies, collects pickups, survives enemy waves, defeats a mini-boss, and reaches a win or lose state.
* MVP gameplay requirements: The first version must include one playable character, basic movement, shooting, health/damage, enemy waves, collision, death/restart, and victory flow.
* Visual direction: The game should use a simple vintage pixel UI style with readable characters, a consistent color palette, grungy details, and enemies that feel more hostile through zombie, vampire, or elemental features.
* UI and screens: The prototype should include a start screen, level selection or dashboard, in-game HUD, pause button, health/progress indicators, victory screen, and game over screen.
* Technical scope: The implementation should be modular, with systems for player control, enemies, projectiles, health, wave spawning, level management, UI management, game states, collision, and placeholder audio/assets.

Out of scope:
- Save system, multi-level progression, music soundtrack and narrative flow.

## 2. Technical Foundation

- Engine: Phaser
- Runtime: Single page app (`index.html`) with one Phaser game instance
- Size and Positioning: 390 × 844 pixels, centered in the middle of the screen/page
- Other: pixel graphics without antialiasing but with round pixels; game is centered in the middle of the screen
  and can be maximized to full screen - Phaser takes care of proper scaling so all the proportions remain the same

Technical details will be documented in TECHNICAL_DOCUMENT.md

## 3. Story

The player fights symbolic enemies made from painful memories, toxic messages, jealousy, rage, and heartbreak. Each level represents a stage of emotional recovery, ending with the player defeating the exaggerated “Ex Boss” and reclaiming control, confidence, and freedom.

## 4. Game Composition

### 4.1 Dashboard / Menu Scope
The dashboard should be simple and functional.
Required screens:
Start Screen
Includes:
* Game title
* Start button
* Optional settings button

### 4.2 Level Selection Screen

Includes:
* Level cards
* Locked/unlocked state
* Simple progress indicator

### 4.3 In-Game HUD
Includes:
* Player health
* Enemy/boss health if applicable
* Score or level progress
* Pause button

### 4.4 End Screens
Includes:
* Victory message
* Retry button
* Continue button
* Game over message


### 4.5 Battle UI

Shared Battle UI

Every level uses the same basic UI structure.

Top HUD

* Level name
* Boss name: test.exe
* Boss archetype
* Boss HP bar
* Pause button

Bottom HUD

* Luz portrait
* Hearts / HP
* Emotional resource bar
* Special button
* Current power name

Example:

LEVEL 3 — GUILT
test.exe / The Blamer
HP █████████░░░
LUZ
♥ ♥ ♥
CLARITY 42%
[ ZERO CONTACT ]

## Game Mechanics

There is overall very smooth mechanics to both the player and the enemies.

Core Controls

Desktop / Keyboard Controls

Action	Key
Move up	W / Arrow Up
Move down	S / Arrow Down
Move left	A / Arrow Left
Move right	D / Arrow Right
Shoot	Automatic
Dash / quick dodge	Space
Special power	E
Pause	Esc

Mobile / Touch Controls

Action	Touch Input
Move Luz	Drag finger on screen
Shoot	Automatic
Dash / dodge	Quick swipe
Special power	Tap special button
Pause	Tap pause button

Movement Feel

Luz should feel:

* responsive;
* slightly floaty;
* easy to control with one finger;
* not too fast;
* readable during bullet patterns.

Recommended movement style:

Desktop: 8-direction movement
Mobile: drag-follow movement
Shooting: automatic vertical shots
Dash: short burst with brief invincibility

The player should focus on dodging, positioning, timing and emotional recognition, not on manual shooting.

## Levels

Difficulty Progression

Level	Difficulty	Focus
1 — Denial	Easy	Basic movement and shooting
2 — Confusion	Easy / Medium	Clones and mixed signals
3 — Guilt	Medium	Movement restriction
4 — Truth	Medium / Hard	Pattern recognition
5 — Acceptance	Medium	Restraint and timing
6 — Reconstruction	Hard	Resource collection and survival
7 — Liberation	Final	Full mechanic combination

The same UI bar can be reused, but the label changes per level.

⸻

Levels are documented in the level_design folder.