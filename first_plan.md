Kill My Ex — Level & Controls Development Guide

Game Type

Kill My Ex is a vertical pixel-art mini shooter for mobile and desktop.
Each level represents one emotional phase of grief after a breakup.

The player controls Luz, who dodges emotional attacks and shoots light to break toxic patterns. The enemy is not a real person, but a symbolic version of an ex: test.exe, the embodiment of the pattern.

Core message:

You are not killing the ex. You are breaking the pattern.

⸻

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

⸻

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

⸻

Shared Gameplay Loop

Each level follows this structure:

1. Level intro
    * Boss appears.
    * Emotional phrase appears.
    * Level mechanic is introduced.
2. Main fight
    * Player dodges attacks.
    * Player shoots automatically.
    * Emotional resource builds up.
3. Special pattern
    * Boss uses the level’s unique emotional attack.
4. Pattern break
    * Player uses the right mechanic or special power.
5. Victory
    * Boss HP reaches 0%.
    * “Pattern Broken” screen appears.
6. Progress
    * Next grief phase unlocks.
    * Rewards are given.

⸻

Emotional Resources by Level

The emotional resource changes as the player progresses.

Level	Resource
Level 1 — Denial	Clarity
Level 2 — Confusion	Clarity
Level 3 — Guilt	Clarity
Level 4 — Truth	Deep Clarity
Level 5 — Acceptance	Calm Clarity
Level 6 — Reconstruction	Self-Worth
Level 7 — Liberation	Full Light

The same UI bar can be reused, but the label changes per level.

⸻

Level 1 — Denial

Emotional Phase

Denial

Level Quote

“It wasn’t that bad.”

Boss

test.exe / The Denier

Boss Phrase

“You’re exaggerating. It wasn’t that serious.”

Objective

Survive the denial phase, break the first emotional shield, and reduce test.exe HP to 0%.

Gameplay Description

This is the tutorial fight. The player learns how to move, dodge and shoot. Attacks are simple and readable.

The boss minimizes the player’s pain by throwing dismissive text bubbles.

Main Mechanics

Emotional Bubbles

Slow text bubbles move downward.

Examples:

* “It wasn’t that bad.”
* “You’re too sensitive.”
* “You’re exaggerating.”
* “We were just talking.”

If they hit Luz, she loses one heart or clarity.

Minimization Shield

test.exe starts with a weak shield.
The player must keep shooting until the shield breaks.

Gaslighting Lite

A short attack pattern where bubbles move slightly faster and the screen shakes lightly.

Special Power

Zero Contact

Effect:

* clears all emotional bubbles on screen;
* damages the boss shield;
* gives the player a short moment of safety.

Development Notes

* This level should be easy.
* It teaches movement and basic dodging.
* Visuals should be dark but not overwhelming.
* Enemy projectiles should be slow and readable.

Completion Reward

Unlocks:

Level 2 — Confusion

⸻

Level 2 — Confusion

Emotional Phase

Confusion

Level Quote

“I like you, but I’m not ready for something serious.”

Boss

test.exe / The Confuser

Boss Phrase

“I don’t want labels. You get it, right?”

Objective

Survive mixed signals, identify the real threat, and keep your clarity high.

Gameplay Description

This level introduces uncertainty. The player must dodge mixed messages, avoid fake openings and recognize clones.

Main Mechanics

Mixed Messages

Projectiles move in unpredictable patterns.

Examples:

* “I miss you.”
* “I need space.”
* “You’re different.”
* “I’m not ready.”

Some projectiles look harmless but still damage clarity.

Clones

Fake versions of test.exe appear on the screen.
Only the real boss takes damage.

The real boss can be identified by:

* a subtle glow;
* different animation timing;
* staying closer to the center;
* having the true HP bar connection.

Mental Fog

For a few seconds, the screen becomes darker or blurrier.
Projectiles remain visible, but less clear.

Special Power

Zero Contact

Effect:

* removes clones temporarily;
* clears fake messages;
* reveals the real boss for a few seconds.

Development Notes

* The player should feel emotionally disoriented but not lost.
* UI should always remain readable.
* Avoid making the confusion mechanic unfair.
* Clones should be visually distinct enough after a second of observation.

Completion Reward

Unlocks:

Level 3 — Guilt

⸻

Level 3 — Guilt

Emotional Phase

Guilt

Level Quote

“Maybe I was the problem.”

Boss

test.exe / The Blamer

Boss Phrase

“Everything that went wrong was your fault.”

Objective

Break the guilt shield and stop carrying responsibility that does not belong to Luz.

Gameplay Description

This level is more restrictive. The boss uses emotional chains, guilt echoes and distorted memories to slow Luz down.

Main Mechanics

Blame Transfer

Text projectiles try to transfer responsibility to the player.

Examples:

* “You made me like this.”
* “You always overreact.”
* “I gave you everything.”
* “No one else will love you.”

If they hit Luz, clarity drops more than HP.

Invisible Chains

Chains appear on the battlefield and restrict movement.
If Luz stays inside a chain zone, her speed is reduced.

Distorted Memories

Memory frames float across the screen.
Some are real, some are emotionally edited.

The player should avoid reacting too fast.

Guilt Echo

Circular waves repeat internal thoughts.

Examples:

* “I should have done more.”
* “Maybe I was too much.”
* “Maybe I hurt him.”
* “Maybe I caused this.”

Special Attack

“You Made Me This Way”

test.exe becomes shielded and fires a heavy guilt pattern.

The player must survive, avoid chains and use Zero Contact at the correct moment to break the shield.

Special Power

Zero Contact

Effect:

* breaks the guilt shield;
* clears chains;
* gives Luz a short clarity boost.

Development Notes

* This level should feel heavier and slower.
* Movement restriction is the core mechanic.
* Do not overuse text; keep projectiles readable.
* The player should feel release when the chains break.

Completion Reward

Unlocks:

Level 4 — Truth

⸻

Level 4 — Truth

Emotional Phase

Truth

Level Quote

“Now I see things as they really were.”

Boss

test.exe / The Chameleon

Boss Phrase

“It wasn’t me. It depends how you look at it.”

Objective

Reconstruct the truth, break the masks and stop justifying the pattern.

Gameplay Description

This level is about observation before action. The player must recognize the real version of the boss and shoot the correct pattern fragments.

Main Mechanics

Truth Distortion

test.exe shows multiple versions of the story.

Examples:

* “I was the one who gave more.”
* “You exaggerated everything.”
* “I was just stressed.”
* “Nobody understood me.”

Only one version is true enough to damage.

Pattern Fragments

Puzzle-like fragments appear on screen.
The player must shoot the correct fragments in sequence.

Correct hits build Deep Clarity.
Wrong hits distort the screen.

Masks

test.exe wears different masks:

* victim;
* hero;
* indifferent;
* confused;
* innocent.

Each mask has a different projectile pattern.

Broken Mirrors

Mirrors reflect distorted versions of the past.
Destroying the correct mirror reveals the real boss.

Special Power

Real Zero Contact

Effect:

* destroys the false versions;
* removes the current mask;
* exposes test.exe’s core for a few seconds.

Development Notes

* This is a pattern-recognition level.
* The player should pause mentally before shooting.
* Visual design should include mirrors, masks and puzzle fragments.
* Avoid making the correct answer too obscure.

Completion Reward

Unlocks:

Level 5 — Acceptance

⸻

Level 5 — Acceptance

Emotional Phase

Acceptance

Level Quote

“I didn’t need to understand everything to let it go.”

Boss

test.exe / The Ghost

Boss Phrase

“Maybe I never had a real answer to give you.”

Objective

Accept the memories without getting trapped by them. Reduce test.exe HP to 0% and stabilize Calm Clarity.

Gameplay Description

This level is slower, softer and more emotional. The player is not fighting chaos anymore. They are learning not to chase closure.

Main Mechanics

Soft Nostalgia

Slow messages and memories float around the screen.

Examples:

* “Maybe it was real.”
* “Maybe he did care.”
* “Maybe it could have worked.”
* “Remember when it was good?”

Not every memory is dangerous. Some only test the player’s impulse to react.

Real Memories

Photo frames appear.
The player should not instantly destroy them.

Instead:

* observe;
* let them pass;
* collect calm light after they fade.

Letting Go

If the player avoids attaching to a memory, Calm Clarity increases.

Breathing Zones

Safe glowing areas appear briefly.
Standing in them restores clarity and slows projectiles.

Special Power

Zero Contact

Effect:

* clears the final nostalgia wave;
* transforms rage shots into stable light;
* deals calm damage to test.exe.

Development Notes

* This level should feel less chaotic.
* It is about restraint.
* The difficulty comes from not chasing nostalgia.
* Music should feel melancholic but peaceful.

Completion Reward

Unlocks:

Level 6 — Reconstruction

⸻

Level 6 — Reconstruction

Emotional Phase

Reconstruction

Level Quote

“I won’t ask for crumbs from someone who can’t stay.”

Boss

test.exe / The Ghost of the Past

Boss Phrase

“I thought you would always come back.”

Objective

Build Self-Worth to 100%, resist relapse messages and defeat the Ghost of the Past.

Gameplay Description

This level is about moving forward. The battlefield becomes more open, and the player collects light orbs that represent rebuilding life after the breakup.

Main Mechanics

Past Repetition

Old scenes from previous levels appear again.

Examples:

* empty promises;
* late-night messages;
* mixed signals;
* distorted memories.

If the player stays near them too long, Self-Worth decreases.

Ghost Attachments

Ghost figures represent what could have been.

They pull Luz toward them.
The player must move away or shoot sustained light.

Emotional Void

Dark zones appear on the battlefield.
If Luz enters them, movement slows and shooting weakens.

If Luz crosses them without stopping, Self-Worth increases.

Relapse Messages

Messages try to pull the player back.

Examples:

* “Can we talk?”
* “I miss you.”
* “I’m changing.”
* “I remembered us.”

Rebuilding Orbs

Collectible orbs represent healing actions.

Examples:

* friends;
* therapy;
* rest;
* body;
* creativity;
* home;
* boundaries;
* future plans.

Collecting them increases Self-Worth.

Special Power

Real Zero Contact

Effect:

* clears relapse messages;
* opens a forward path;
* strengthens Luz’s shield;
* heavily damages test.exe.

Development Notes

* This level should feel like a rebirth.
* Add warmer colors near the end.
* Player should feel stronger than in previous levels.
* The screen can slowly brighten as Self-Worth increases.

Completion Reward

Unlocks:

Level 7 — Liberation

⸻

Level 7 — Liberation

Emotional Phase

Liberation

Level Quote

“I am no longer carrying you. I return to myself.”

Boss

test.exe / The Last Echo

Boss Phrase

“If you let me go… what is left of us?”

Objective

Cross the final path, break the last remaining ties and complete the liberation phase.

Gameplay Description

This is the final level. It is not about rage. It is about full release. The battle should feel like a final emotional crossing.

Main Mechanics

Final Echoes

Small ghost-like echoes appear with old phrases.

Examples:

* “Don’t leave.”
* “One more chance.”
* “You owe me closure.”
* “Wasn’t it real?”

They are weak but distracting.

Residual Ties

Soft chains pull Luz backward.
The player breaks them by aiming light at them or using dash.

Exit Gate

A glowing portal appears in the distance.
The player must keep moving toward it while surviving the final pattern.

Full Light

If the player maintains clarity and avoids relapse, Luz enters Full Light mode.

In Full Light mode:

* shots become wider;
* movement becomes smoother;
* projectiles slow slightly;
* the screen brightens.

Final Special Power

Final Zero Contact

Effect:

* destroys all remaining ties;
* breaks the final core of the pattern;
* opens the exit gate.

Development Notes

* This level should feel open and cinematic.
* The color palette should shift from dark purple to sunrise pink, orange and gold.
* The final attack should be intense but beautiful.
* The ending should feel like release, not revenge.

Completion Reward

Unlocks:

Epilogue / Garden / Ending

Possible ending text:

The pattern is gone.
The story is yours again.

⸻

Difficulty Progression

Level	Difficulty	Focus
1 — Denial	Easy	Basic movement and shooting
2 — Confusion	Easy / Medium	Clones and mixed signals
3 — Guilt	Medium	Movement restriction
4 — Truth	Medium / Hard	Pattern recognition
5 — Acceptance	Medium	Restraint and timing
6 — Reconstruction	Hard	Resource collection and survival
7 — Liberation	Final	Full mechanic combination

⸻

Development Priority

For the first playable build, implement levels in this order:

MVP Build

1. Level 1 — Denial
2. Dashboard
3. Cemetery
4. Create Ex
5. Level Result screen

Vertical Slice Build

1. Level 1 — Denial
2. Level 2 — Confusion
3. Level 3 — Guilt

Full Demo Build

All 7 levels.

⸻

Reusable Level Data Structure

For development, each level can be defined as data:

{
  "id": 1,
  "name": "Denial",
  "phase": "First phase of grief",
  "quote": "It wasn't that bad.",
  "bossName": "test.exe",
  "bossTitle": "The Denier",
  "bossPhrase": "You're exaggerating. It wasn't that serious.",
  "resource": "Clarity",
  "objective": "Survive denial and reduce test.exe HP to 0%.",
  "mechanics": [
    "Emotional Bubbles",
    "Minimization Shield",
    "Gaslighting Lite"
  ],
  "specialPower": "Zero Contact",
  "reward": "Unlock Level 2 — Confusion"
}

⸻

Key Design Rule

Each level should introduce one main emotional mechanic and reuse the same basic controls.

That keeps the game easy to learn, but emotionally different each time.

Same controls.
Same shooter base.
Different emotional pattern per level.

This is what makes the game simple enough to build, but strong enough to feel meaningful.