# Battle Planet ZenzizenziX — the plan

*Status: idea board, November 2026. Nothing is built yet. Items marked **(proposed)** are
suggestions to fill a gap; items under [Open questions](#open-questions) still need a call.*

## The pitch

Two retired, seasoned warriors pick up arms again to save their planet. Together, on one
screen with two controllers, they chase the evil **Lord Villen-Hüüs** across eight planets
and bring him to justice before the **Emperor D'Justeece**, who has put a bounty on his head.

It's a **co-op side-scrolling brawler** in the spirit of Battletoads: screen-by-screen fights
on a 2.5D floor, traps and jumps, a boss at the end of every planet, **friendly fire on**, and
an upbeat 80s punk soundtrack.

## Pillars

1. **Two friends, one couch.** Built for two controllers first. Friendly fire makes teamwork
   matter (and makes it funny).
2. **Simple to pick up.** Move, jump, one attack, one special. That's the whole game pad.
   Plus one rewind watch each, once per game.
3. **Every character feels different.** Health, speed and the special move change how you play.
4. **Loud and fast.** 80s punk, big hit sounds, screen shake, rumble.
5. **The long way home.** Beating the eight planets unlocks a harder, darker trip back.

## The story

| Part | Where | What happens | Boss |
|---|---|---|---|
| Prologue | **Planet 1: home** | Lord Villen-Hüüs's army lands on our planet. Our two veterans come out of retirement. | **Lord Villen-Hüüs** (first fight; he escapes) |
| The chase | **Planets 2–7** | We hop from planet to planet after him. On each one he flees as soon as the fight starts and leaves one of his generals to deal with us. | **Generals 1–6**, one per planet |
| The showdown | **Planet 8** | We finally corner him. | **Lord Villen-Hüüs** (final fight) |
| The twist | **Planet 8** | Surprise: his assistant was the brains behind the whole plan all along. | **Madame Metal Face** |
| Hard mode: the way home | **Planets 8 → 1**, reversed | With Lord Villen-Hüüs's army gone, local warlords have taken over the liberated planets and mean to keep them. We fight our way back home through harder, darker versions of every world. | **A warlord per planet**, and robot-zombie versions of **Lord Villen-Hüüs** and **Madame Metal Face** |
| Epilogue | Before the throne | We bring Lord Villen-Hüüs to the **Emperor D'Justeece** and collect the bounty. **(proposed:** shown after the first win on planet 8, with a second, bigger ending once we're home again**)** | — |

## How it plays

### The format

Same rules as every Maison Perron game:

- **One self-contained HTML file** (`battle-planet-zenzizenzix.html`). Open it and play,
  offline, no install.
- Canvas pixel art at a small fixed resolution, scaled up without blurring, **60 fps** or more.
- **French by default**, English toggle **(proposed:** same as the other games**)**.
- Saves in local storage: best progress, unlocked hard mode, settings.

### Screens and levels

- **8 planets**, one level each, **4–6 screens** per level.
- **A screen is a locked arena.** Enemies come in waves. When the last one is down, a "GO →"
  sign appears, and as soon as **one** player walks off the right edge, the game moves to the
  next screen. **(proposed:** the other player is pulled along, so nobody gets left behind**)**
- **2.5D floor.** The walkable floor takes up about the lower half of the screen, in a "3D"
  projection: you move left/right **and** up/down (into and out of the screen). Everything
  is drawn back to front so characters pass in front of and behind each other.
- **Terrain:**
  - **obstacles** you walk around (crates, rocks, wrecks)
  - **holes** you have to jump over (fall in: lose health and respawn at the edge)
  - **traps** (spikes, crushers, fire vents, electric floors) **(proposed list)**
  - **towers and ledges** you can jump onto, to fight from above or dodge

### Controls

| Action | Gamepad | Keyboard, player 1 **(proposed)** | Keyboard, player 2 **(proposed)** |
|---|---|---|---|
| Move | Left stick / D-pad | W A S D | ← ↑ → ↓ |
| Jump | ✕ / A | Space | Right Shift |
| Attack | □ / X | F | K |
| Special | ○ / B | G | L |
| Pause | Options / Start | Esc | Esc |

- **Attack** always strikes **horizontally** in the direction you're facing, left or right.
- Moving up or down **strafes**: you keep facing left or right, so you can line up with an
  enemy and keep hitting.
- **Special** is different for each character (below). **(proposed:** it recharges on a meter
  that fills over time and when you land hits, so it can't be spammed**)**
- Each controller is one player. The game asks each player to **press a button to join**
  (the browser only sees a controller after a button press). One keyboard can host both
  players as a fallback.
- **Rumble** on hits, KOs and specials.

### Friendly fire

**On**: your attacks and specials hit your partner too. **(proposed:** partner hits do half
damage and can't take the last heart, with a "Brutal" option for full friendly fire**)**

### The rewind watch

The game's signature trick. Each player wears a **watch that turns back time, once per game**.
Press it and the whole world runs **backward for the last 5 seconds**, then play picks up again
from that point, 5 seconds in the past.

- **You see the rewind happen.** The last 5 seconds play back in reverse: fighters walk
  backward, punches un-land, enemies stand back up, health bars refill, the knocked-out partner
  floats back to their feet. **(proposed:** played back at 2× speed, so it takes 2.5 seconds,
  with a VHS rewind look: scan lines, a colour shift, a "◀◀" in the corner and a tape-whine
  sound with the music running backward**)**
- **Once per game, per player.** Two players means two rewinds in the whole run, so choosing
  *when* is the whole game. It's not refilled between planets.
- **It rewinds everything,** both players included: using your watch also undoes your
  partner's last 5 seconds, for better or worse.
- **On the HUD:** a small watch icon next to each player's health that goes grey once used.
- **(proposed) Button:** press Jump and Special together (a gamepad's Select/Share button works
  too), so it can't go off by accident.
- **(proposed) In the story:** the watches are a gift from the Emperor D'Justeece with the
  bounty contract, made on the clockwork worlds of Kepler-80.
- **How we build it:** the game keeps a rolling record of the last 5 seconds of the world
  (every fighter's position, health and animation frame, 60 times a second; about 300 small
  snapshots). Rewinding replays that record backward, then the game resumes from the oldest
  snapshot. This is simple to do because the whole game state is plain data.

## The characters

**Initial design, 18 November 2026: Les Douze.** Twelve warriors, two of each role, chosen in
the round-2 analysis (the merged roster). The full painted cards, with stories, stats, strengths,
weaknesses and partners, are in [art/les-douze.html](art/les-douze.html); how we got there is in
[warrior-file.html](warrior-file.html). Names marked *(to come)* still need a name.

Pick one each. **(proposed:** both players can't pick the same one, so the pair always differs**)**

| # | Warrior | Role | Special move | Pairs with |
|---|---|---|---|---|
| I | **Amiral Remords** | Ranged | **Mutiny Broadside:** two old gunners appear, fire a volley across the screen, then fight for 4 s. | Spora |
| II | **Marge la Roadie** | Tank | **Amp Dive:** dives onto her amp; the shockwave knocks the whole screen down, the amp stays as cover. | Ruby Tonnerre |
| III | **The big cyborg** *(to come)* | Tank | **Lava Roll:** rolls half a screen, knocking enemies up or down, leaving a trail of lava. | The space raccoon |
| IV | **Papi des marées** | Bruiser | **Rocket Stomp:** his tidewalker rams across the screen and stomps; everyone nearby bounces up. | Bernache |
| V | **Ruby Tonnerre** | Ranged | **Thunder Chord:** stuns the row, then lightning strikes everyone stunned. | Marge la Roadie |
| VI | **Spora** | Support | **Spore Cloud:** a cloud that roots and stings enemies and heals her partner. | Amiral Remords |
| VII | **Docteur Magnéto** | Trickster | **Magnet Slam:** pulls every enemy into one heap, then piledrives it. | Demi |
| VIII | **Doc Suture** | Support | **Field Patch:** throws a med-kit that heals her partner one heart, across the screen. | Jean-Louis Carnage |
| IX | **Demi** | Trickster | **Flip Side:** switches between fire (burns) and frost (freezes); fire then frost does bonus damage. | Docteur Magnéto |
| X | **Bernache** | Speedster | **HONK:** enemies drop their guard, fall over and run for 3 s. | Papi des marées |
| XI | **The space raccoon** *(to come)* | Speedster | **Rocket Pack:** flies over the crowd, fires down at 30°, untouchable for 5 s. | The big cyborg |
| XII | **Jean-Louis Carnage** (the soldier) | Bruiser | **RAGE:** a shockwave pushes enemies a third of the screen back; invincible for 3 s. | Doc Suture |

The three original heroes (the big guy, the raccoon and the soldier, now Jean-Louis Carnage) are kept; the big guy now
has Obsidienne's lava. The art is a first pass painted in code; realistic paintings can replace it
using the prompts in `art/les-douze-src/prompts.md`.

## Planets and bosses

| # | Planet | Campaign boss | Hard-mode boss **(proposed placement)** |
|---|---|---|---|
| 1 | Home *(name to come)* | Lord Villen-Hüüs (escapes) | Robot-zombie **Lord Villen-Hüüs** and robot-zombie **Madame Metal Face**, together: the last fight of the game |
| 2 | *(to come)* | General 1 | Warlord 1 |
| 3 | *(to come)* | General 2 | Warlord 2 |
| 4 | *(to come)* | General 3 | Warlord 3 |
| 5 | *(to come)* | General 4 | Warlord 4 |
| 6 | *(to come)* | General 5 | Warlord 5 |
| 7 | *(to come)* | General 6 | Warlord 6 |
| 8 | *(to come)* | Lord Villen-Hüüs, then Madame Metal Face | Warlord 7, first stop on the way home |

**Hard mode** starts on planet 8 and goes back to planet 1. Each level is **played in
reverse**, from its last screen to its first, on darker, harsher versions of the same worlds,
with tougher enemies and new traps. **(proposed:** in hard mode the scrolling runs right to
left, so the way home literally feels like going back**)**

Between levels, a short **planet hop** shows the ship flying to the next planet (or back).

## Art direction

**Decided 23 November 2026: a comic book, printed differently on every planet.** Try them live
in [mocks/comic-styles.html](../mocks/comic-styles.html).

| World | Print style |
|---|---|
| 1 | SF 1977: fine hatching, washed-out pastels, watercolour grain |
| 2 | Silver Age: Ben-Day dots, misregistered four-colour print, newsprint |
| 3 | Ligne claire: one even line, flat colours |
| 4 | Black and white: screentones |
| 5 | Engraving 1870: sepia copperplate, wavy hatching |
| 6 | Ukiyo-e: Prussian blue, vermilion, ochre, wood grain |
| 7 | Chalk: chalk on slate, dark and dusty |
| 8 | Stained glass: coloured cells set in lead |

Rules for every world:

- **Halftone, hatching and grain only on the backdrop.** Fighters, props and effects are flat
  colour with a crisp ink outline.
- **The ground you fight on is always clear:** full strength, with an ink ground line; the
  backdrop behind it is dimmed (75% to start) and greyed.
- **Noir-ink accents on strong hits and specials, everywhere:** speed lines, black and red impact
  rays, a red-slash sound effect and a short ink flash. Weak hits keep the world's own lettering.
- Some worlds are harder to read on purpose (chalk, stained glass): the look is part of the challenge.

## Music and sound

- **Upbeat 80s punk**: fast (around 170–190 BPM), distorted guitars, driving bass, punchy
  drums. **(proposed:** one track per planet, a boss track, darker re-arrangements of every
  track for hard mode, and short stings for "GO →", level clear and game over**)**
- Built on the **Mine-Moule music engine** (v3), which already has distorted guitars, a rock
  drum kit, crossfades and playlists.
- **Fantastic sound effects**, all synthesized: punches and kicks, hits by enemy size, KOs,
  each special (the roll's rumble, the rocket pack's thrust, the RAGE scream), jumps and
  landings, falling into a hole, traps, the "GO →" chime, and the planet hop.

## Building it

### What we reuse from the other games

| Piece | From |
|---|---|
| Music and sound engine | Mine-Moule (v3) |
| Input, with named actions, held / just pressed | Mine-Moule, extended to **two players with one controller each** |
| Fixed-step main loop, crash-safe | BlocSauteur and Mine-Moule |
| Pixel-crisp screen scaling, portrait/landscape, safe areas | Kick la Banane |
| Saves with defaults and versions | Kick la Banane and Mine-Moule |
| French/English text with fallback | La Mort aux Trousses |
| Particles, screen shake, floating text | all of them |
| Seedable randomness, console hook, headless simulator for balancing | BlocSauteur and Perroclès |

### What's new

- **2.5D world:** every entity has x (left/right), depth (up/down on the floor) and height
  (jumps); hits only land when attacker and target are close in depth too.
- **Depth-sorted drawing** so fighters overlap correctly.
- **Arena camera:** locks per screen, unlocks on "GO →".
- **Enemy AI** that surrounds, takes turns attacking, and dodges specials.
- **Two-player join, character select, shared or separate lives.**
- **The rewind watch:** a rolling 5-second record of the world, played back in reverse.

### Milestones

| | Goal | Done when |
|---|---|---|
| **M0** | One-screen prototype | Two players move, jump, attack and hit each other (friendly fire) against a wave of basic enemies, with gamepads and keyboard. |
| **M1** | The three characters | Each has its health, speed, look and special. Character select and join screen. The rewind watch works, with its reverse playback. |
| **M2** | Planet 1, complete | Home planet, all its screens, terrain (obstacles, holes, traps, towers), the first Lord Villen-Hüüs fight, music and sound. |
| **M3** | Planets 2–4 | Three planets with their generals, the planet hop between levels. |
| **M4** | Planets 5–8 | The rest of the campaign, the final Lord Villen-Hüüs fight, Madame Metal Face, the throne-room ending. |
| **M5** | Hard mode | Reversed, darker planets 8 → 1, the warlords, the robot-zombie finale. |
| **M6** | Polish and balance | Simulated playthroughs for tuning, rumble, accessibility, then it goes on the launcher as a released game. |

## Open questions

1. **Names:** the three heroes, the eight planets, the six generals, the seven warlords.
2. **Two veterans, three characters:** are the "two retired warriors" of the story whichever
   two the players pick, or two of the three in particular?
3. **One player:** can the game be played alone (with or without an AI partner)?
4. **Lives and continues:** shared or separate? What happens when one player is down?
5. **The special:** cooldown meter, limited uses per screen, or free to use?
6. **Friendly fire strength:** full, half, or a setting?
7. **Other moves:** grabs and throws, a dash, a jump attack, a team move when both players
   attack the same enemy?
8. **Enemies:** what do Lord Villen-Hüüs's soldiers look like, and how many kinds?
9. **Pick-ups:** health, power-ups, coins for the bounty?
10. **Where the robot-zombie Lord and Madame appear** in hard mode (proposed: together, as the
    last fight, at home).
11. ~~**Art style and resolution**~~ Decided: see [Art direction](#art-direction).
12. **Languages:** French and English like the others, or more?
13. **The rewind watch:** reverse playback at real speed (5 s) or 2× (2.5 s)? Can a player
    who is knocked out still use theirs? Does hard mode give a second charge, or none?
