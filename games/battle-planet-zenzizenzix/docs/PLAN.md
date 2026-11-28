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

### The prologue and the Clock (decided 23 November 2026)

**The Clock.** Thirty years ago, Lord Villen-Hüüs built a clock that turns back time, to undo every defeat he ever had. Our two
warriors beat him in the last battle of the Clock War and smashed it into **nine gears**. He fled in a pod, and one gear
slipped in with him. Nobody noticed: "one gear short, it's a clock that'll never work".

**The prologue**, played after the two players pick their warriors (skippable):

1. **The past** (printed as an 1870 engraving): the last battle, the Clock shatters, he flees, they count eight pieces and
   decide to hide them, one per world.
2. **The ceremony:** Emperor D'Justeece pins a medal on each of them (every warrior has a medal of their own), the crowd
   cheers, then Commandant Bourrasque takes them aside: get rid of those gears. A montage shows the eight hiding places:
   Dorée (a cloud of gold), Embrume (under a bar's stage), Brasier (a volcano), Fumerolle (under a geyser), Crépuscule
   (right on the line between day and night), the Ring (a station dumpster), Havre (under the lighthouse) and L'Inconnue
   (nobody remembers where).
3. **Thirty years of peace:** a split screen of each warrior's retirement (the Admiral's floating restaurant, Marge's bingo
   through Big Bertha, Doc knitting a sweater for every soldier she ever patched up, Bernache terrorising the park…).
4. **The lair** (printed in noir ink): Villen-Hüüs talks, and talks. Madame Metal Face (tiny, black dress, short hair,
   glasses) listens and takes notes. He shows the gear he kept. Then a 3×3 grid fills with him smashing his way to the
   gears world after world, until square 7, Havre, zooms to full screen and play starts.

**Then:** he takes the gears back world by world; Madame Metal Face's advice is to hand each one to a general ("never all
your gears in one basket"), which is why each of planets 2–7 has a general to beat, and why she is the real brain on planet 8.

**Dialogue changes every game.** Each warrior has their own voice (puns, catchphrases, their retirement), the six partner
pairs have scenes of their own, a dozen other pairs have special exchanges, and the villain insults whoever you picked.
The pre-battle banter runs 3 to 7 lines depending on the pair. Lines live in `src/story.js`, in French and English.

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
| 1 | **Havre** (home) | Lord Villen-Hüüs (escapes) | Robot-zombie **Lord Villen-Hüüs** and robot-zombie **Madame Metal Face**, together: the last fight of the game |
| 2 | **De Soif** (the city port) | **Oscar GrosVerres**, barman of Le Poisson Blanc | Warlord 1 |
| 3 | **Bouldaire** (the fashion planet) | **CALVE-HAIR**, the hairdresser (scissor cuts that bleed, a hair tornado that pushes back and dizzies, long-leg kicks) | Warlord 2 |
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

## Triple combos (decided 24 November 2026)

Every warrior chains three hits: a first strike, a second that varies it, then a **named finisher** that hits much harder
(+2), freezes the frame for an instant, shakes the screen, prints its name in noir ink and sends whoever it hits flying.
Each move has a real wind-up, a snap and a follow-through, and lunges forward; the finisher lunges furthest.

| Warrior | Hit 1 | Hit 2 | Finisher |
|---|---|---|---|
| Amiral Remords | sabre slash | backhand slash | **Bordée!** rocket-leg lunge thrust |
| Marge | hook | uppercut | **Big Bertha!** two-fisted overhead smash, shockwave |
| The big cyborg | chrome hook | elbow | **Piston!** the chrome arm fires out, longest reach |
| Papi | fork jab from the saddle | the tidewalker head-butts | **Hoof stomp!** it rears and stomps, shockwave |
| Ruby | guitar slash | backhand | **Power chord!** overhead guitar smash, lightning |
| Spora | one tendril lash | two lashes | **Spore burst!** |
| Magnéto | hook | cross | **Magnetic lariat!** |
| Doc Suture | bag swing | front kick | **Defibrillator!** two-palm shock |
| Demi | fire palm | ice palm | **Equinox!** both palms, fire and frost |
| Bernache | peck | wing slap | **Furious honk!** wings spread, a charging lunge |
| The raccoon | swipe | kick | **Rocket dive!** a jet-pack dive kick |
| Jean-Louis Carnage | jab | uppercut | **Bayonet!** a long charging thrust |

**Attack animation passes (24 November 2026).** Every move is keyframed on the whole body: guard → coil (weight back,
torso turned away, the striking limb loaded, the other arm guarding) → contact (front foot steps in, hips drive through,
the other arm yanks back) → overshoot → settle → guard. Faint afterimages on the extension, a white ring where the blow lands,
speed lines behind punches, a 35 ms freeze on every connect (85 ms on finishers). Only finishers and specials get the
noir flash and the big sound words. Openers vary (jabs for Magnéto, Demi and Jean-Louis).

Villen-Hüüs's soldiers have two attacks per weapon family, picked at random: an overhead chop or a flat swing (clubs, axes,
wrenches…), a stepping stab or a low gut stab (knives, prods, harpoons), a two-handed floor slam (dust, debris, a tremor) or
a wide sweep (brutes), and a shouldered rifle shot with recoil, a spent shell and muzzle smoke (gunners). A glint on the
weapon hand marks the moment before the blow; they step in (never through you) and stay overextended for a beat afterwards.

**Fighting distance and stances (24 November 2026).** Engaged goons hold just outside their reach, shuffling in and out in a
fighting stance (light bounce, lead hand up), and close the gap with a step at the moment they strike; nobody stands inside
a hero (goons ease back to arm's length). Each warrior squares up in their own way when goons are near: the Amiral points
the sabre with a hand on the hip, Marge drops into a brawler's crouch, the cyborg lets the chrome arm hang heavy, Ruby holds
the guitar across, Magnéto shows his palms, Demi takes a martial stance, the raccoon stays low and springy, Jean-Louis
keeps a boxer's guard.

## Controller rumble (24 November 2026)

Each event plays a short pattern on the two motors (heavy and light), per player (`src/rumble.js`):
getting hit (stronger with damage; friendly fire is a distinct double knock), knocked out (a big jolt fading like a slowing
heartbeat), falling in the water, being helped up (three rising pulses), dizzy (a wobble swapping between motors for the whole
three seconds, then a thump on the floor), poisoned (a sick buzz, then a light buzz on each tick), bleeding (a heartbeat on each tick),
landing a hit (a tiny tick; a heavy thud for finishers), starting a special, lifting and throwing breakables, a perfect dodge,
a counter, and any big shake on screen (explosions, slams). V toggles it in the pause screen.

## Computer partner for solo games (decided 24 November 2026)

Playing alone, you pick your own warrior and then your partner on the selection screen (the second card shows **ORDI / CPU**).
The computer plays that partner by pressing the same virtual buttons a person would, so it has the same moves, combos,
throws and status effects, and nothing extra. A real second player can grab the P2 controls at any time and the computer
steps back in 3 seconds after they let go.

- **Weaker than you on purpose:** it reacts a beat late, sometimes stops a combo at two hits, and charges or dodges only some of the time.
- **Plays as a partner:** goes for whoever is hitting you, flanks from the side you are not on, leaves food to whichever of you
  is more hurt, never swings, charges or throws when you are in the way, sidesteps incoming bottles and lasers, jumps gaps,
  interrupts Oscar's drinking.
- **The final blow is yours:** it stops hitting a boss near the end (Villen-Hüüs below 50 %, Oscar below 15 %) and tells you so.
- **Fights in character:** Support warriors stay close to you; tanks and bruisers charge more; Speedsters close gaps.
- **Orders** (player 1, shoulder buttons): L1 *À moi !* (come to me), R1 *Fonce !* (charge), L2 *Tiens bon !* (hold this spot), R2 *Libre !*
  (its own judgment); keyboard 1 2 3 4. Each warrior answers each order in its own voice; it also cheers your finishers,
  worries when you are low, and asks to be helped up.
- **If player 1 goes down, the screen restarts.** If the partner goes down, help it up or it gets up on its own.

Controls are no longer printed under the game: the game fills the window, and the pause screen shows a controller with
an arrow to each button (plus the keyboard keys, the backdrop dimmer on B and the language on L).

## Big scenic moments (24 November 2026)

Three per level: the first screen, the second, and the boss (`src/setpieces.js`); each holds its wave until its goons are down,
shakes the screen hard, slows time at the impact, hits with a huge noir sound word and a long rumble pattern, and leaves its wreck behind.

- **Havre, the docks: La Gourmande.** A runaway freighter, horn blaring, ploughs into the quay: geysers, splinters, the bow crumples,
  two containers fall onto the quay (they crush whoever is under them and stay as breakables, a third falls into the sea), then goons jump off her deck.
- **Havre, the lighthouse square: the barrage.** Searchlights sweep the square; red target rings mark where the flagship's shells land, seven of them;
  one hits the lighthouse, whose top topples into the square and breaks into rubble; then Villen-Hüüs comes down.
- **Havre, the fish market: the fighter.** The town's flak hits one of Villen-Hüüs's fighters; it dives in burning, belly-lands at the far end of
  the street and skids its whole length toward you in a fountain of sparks, ploughing through stalls (a flashing red lane shows where: step out of it);
  it stops, blows up, and its escort crawls out of the burning wreck, which stays as an obstacle.
- **De Soif, downtown: the elevated train.** A three-car train races along the viaduct over the boulevard, brakes screaming; the first car jumps the
  rails, smashes through the parapet and drops onto the street; the second hangs off the broken edge, swinging and sparking; concrete rains down;
  goons pour out of the fallen car, which stays, burning.
- **De Soif, the container port: the gantry crane.** The container swings harder and harder, the cable snaps, it lands and bursts open with goons
  inside; then the crane's legs buckle and the whole girder comes down across the quay in sparks.
- **De Soif, Le Poisson Blanc: the beer tanker.** An engine roars, bottles rattle, and a beer tanker smashes through the back wall in a storm of bricks,
  its headlights blazing; foam fountains from the ruptured tank, beer floods the floor, barrels roll out, and Oscar climbs out of the cab.

## Sound and soundtrack (24 November 2026)

- **Mixing:** music, effects and surroundings each have their own volume; a compressor and a limiter keep big crashes clean.
- **Effects are layered:** a punch is a low thump plus a crisp slap plus a mid crunch; crashes are a boom you feel, a roar that settles and debris
  ticking down, with a little room echo; wood, glass and metal each have their own sound.
- **Surroundings:** Havre has the sea washing on the quay, gulls and a far foghorn; De Soif has the city's hum, passing cars and horns, and a
  crowded bar's chatter and clinking glasses on the last screen.
- **Soundtrack:** a small synth band plays songs generated from each level's theme, about five minutes long, looping seamlessly
  (the form's last section leads back into its first). Havre (the 1977 science-fiction print): analogue synth lead with vibrato, starlight arpeggios,
  disco drums, a sea-shanty melody in D dorian, 148 BPM. De Soif (the Silver Age print): sixties surf-and-spy, a twangy tremolo lead, offbeat organ,
  walking bass, in E Phrygian dominant, 166 BPM. The boss gets the same theme 20 % faster and rockier: distorted lead, driving eighth-note bass,
  double kicks, crashes. The music dips under each big scenic moment.
- **Pause menu settings:** music volume, effects volume, sound on/off, rumble strong/light/off, backdrop dimming, language.

## Specials, redone (24 November 2026)

Every special is now a short animated move with a readable wind-up, a real physical action and a recovery
(`src/specials.js`: keyframed poses, timed events, physics for what flies). The warrior is locked in with super armour.
Nothing reaches past about 150 px; shouts (the honk, the roar) push the partner but don't hurt them.

| Warrior | Special | What happens |
|---|---|---|
| Amiral Remords | Mutiny Broadside | raises the sabre, shouts "FIRE!", slashes forward; three cannonballs arc in from his ship off screen onto the nearest goons and explode |
| Marge | Amp Dive | crouches, hoists her amp overhead, hops and slams it down (shockwave); the amp squeals feedback twice |
| The big cyborg | Lava Quake | raises the chrome arm and punches the ground from a kneel; a lava fissure tears forward, spouting and burning |
| Papi | Rocket Stomp | the tidewalker rears on its hind legs, front hooves pawing, rocket roaring, Papi waving; crashes down (shockwave, cracks) |
| Ruby | Thunder Chord | leans back and windmills the strings twice (sound arcs), then lightning strikes the nearest goons, leaving them twitching |
| Spora | Spore Cloud | swells up, squeezes and bursts into a drifting cloud: goons nearby are stuck, spore-covered; heals the partner |
| Magnéto | Magnet Slam | braces, palms out; goons in front are dragged across the floor, heels skidding, then he claps them together |
| Doc Suture | Field Patch | turns to the partner, digs in the bag and lobs a med kit; the partner catches it (or it lands as a pickup) |
| Demi | Flip Side | palms to the hip, then a two-handed stream of flames or frost (alternates each time) |
| Bernache | HONK | neck drawn back, chest puffed, then a cone of honk: goons cover their ears and flee; feathers everywhere |
| The raccoon | Rocket Pack | ignites the pack, rises, fires three plasma shots aimed at goons, comes back down |
| Jean-Louis Carnage | RAGE | clenches and shakes, then roars (goons stagger back), steaming; then four seconds of rage |

## Motion and feel pass (24 November 2026)

A motion layer (`src/anim.js`) sits on top of the poses:

- **Squash and stretch** on every fighter: stretch on a jump, squash on landing, crouch before a punch, snap on the swing,
  pinch on a hit, a head that snaps back or forward depending on where the hit came from. Springs, so everything settles with a wobble.
- **Lean into speed:** fighters lean forward when they run and back when they brake; heroes run (not walk) when moving sideways,
  with dust under each footstep and a skid puff on sharp turns.
- **Afterimages** on charges, dodges, rolls, dives, finishers and anything launched.
- **Impact:** a white flash on whoever is hit, sparks, a comic impact star on big hits; the camera punches in on finishers;
  slow motion on the last goon of a wave.
- **Bodies as bowling balls:** a goon launched by a finisher (or knocked out) bounces once, slides with dust, knocks over the goons
  it flies into and smashes the breakables it hits; the goons it flies past flinch or duck. Breakables wobble when hit.
- **After a wave:** each warrior strikes a signature pose (the Amiral salutes, Marge pumps her fist, Ruby plays air guitar, Doc bows…),
  and if the two heroes are close they high-five.
- **Cel shading:** limbs, torsos and heads get a darker side away from the light.
- **Lettering:** one big sound word and two small ones at a time; older ones bow out.

## Status effects and breakables (decided 24 November 2026)

**Status effects** apply in every level. The same effect never stacks: getting it again restarts its timer. At most two
at once, the two most recent, each with its own timer. Health counts in quarter hearts.

| Effect | Lasts | What happens |
|---|---|---|
| Poisoned | 4 s | Greenish, fumes from the head, 20% slower, -1/4 heart a second |
| Dizzy | 3 s + 1 s | Stars around the head and the six controls shuffled; then 1 s on the floor shaking the stars off (vulnerable, can't act) |
| Bleeding | 3 s + 1 s | Drops in the warrior's colour leave traces that fade after 1.5 s, -1/4 heart a second; then 1 s spinning a bandage on with a woosh (vulnerable, can't act) |

**Breakables** fill every level. Small and medium ones (crates, chairs, stools, barrels, bins, lobster pots, bottle crates,
newspaper boxes) are picked up with attack and thrown with attack again: they hit enemies and the partner, and break on
impact. Large ones break after a number of hits: table 8, stall and cart 10, motorcycle 12, piano 14, forklift 16, car 20.
Everything breaks into debris, and some hide food (1 heart).

**Charging into breakables (24 November 2026).** A charge (double-tap forward) shoves whatever breakable it meets.
Small and medium ones are punted along the ground: they bowl over goons (1 damage from small, 2 from medium, knockdown),
crack a little on each impact, cannon into other breakables like billiard balls, and can hit your partner too.
Large ones slide by weight and stop the charge with a shoulder-check: a keg, cart or motorcycle skids, a table less,
a piano a little, a forklift or car barely rocks. Each shove also costs the large one 1 hit point.

**Progressive breakage (24 November 2026).** Small and medium breakables show every hit: a crate cracks, loses a plank,
then a corner; a barrel splits a stave, its hoop slips, then a stave is gone; a bin dents and loses its lid; a newspaper box's
window cracks and its door hangs open. They lean a little further away from each hit and shed chips.

**Enemies stay on screen (24 November 2026).** Once a goon has walked on screen it cannot be knocked, launched or walk back
off it; goons also never wait or shoot from off screen, hop across water, and walk round crates.

**Specials kept local (24 November 2026).** No special reaches further than about a quarter of the screen (150 px of 640;
cannonballs and rocket shots fade out by then), and none reaches more than 50 px up or down the floor, so a partner half
a screen away is always safe from friendly fire.

**Status effects, redrawn (24 November 2026).**
- *Poison:* a sickly green-to-violet sheen that sweeps up the body, a hunched, swaying posture, rising toxic bubbles that pop,
  curling green-violet wisps, green drool that leaves bubbling puddles, a wobbling skull-and-crossbones overhead that swells on each tick.
- *Dizzy:* stars and two little birds circle the head in depth (in front of and behind it), a spiral above, the body sways;
  afterwards, sitting up, a few stars still circle.
- *Bleed:* teardrop drips that splash and spread into pools with a dark rim, a spurt and a red throb on each tick;
  then the fighter stands still, arms up, while a bandage winds round from the feet up (no more spinning).
- *Frozen:* a faceted ice block with highlights, glints and frost at the feet; it shatters into shards when it melts.
- *Burning:* layered flame tongues licking up the body, embers, smoke. *Spores:* mushrooms sprout on the goon, spores drift off, it sneezes.

## Warrior style and the select screen (24 November 2026)

**Dress** (`src/dress.js`). Hair and clothes are chains of segments with their own secondary motion: they stream back
when a warrior runs, lift when falling, drop on a jump, and keep a slow wave of their own (a spring per warrior feeds
`o.hs` / `o.hy`). Each warrior got a cleaner silhouette:

| Warrior | What moves |
|---|---|
| Amiral Remords | long navy coat tails with gold trim, white plume on the tricorn, fringed epaulettes |
| Marge la Roadie | now the stage crew: gelled pink mohawk, shaved sides, bare tattooed arms, black CREW tee, khaki cargo pants, headset, backstage pass, gaffer tape on the belt |
| Ruby Tonnerre | the punk guitarist: a long sheet of flame-red hair, side fringe, cropped studded leather jacket over a white tee, red tartan skirt that swings, black tights, cream guitar |
| Le Gros Cyborg | three cables from the skull |
| Magneto | short blue cape, red mask ribbons |
| La Doc | cream field coat with tails, red-cross armband, stethoscope, loose strands of hair |
| Demi | two-tone scarf (hot and cold) |
| Raccoon | ringed fluffy tail |
| Soldier | dog tags, helmet strap |

Marge and Ruby no longer read alike: pink mohawk, khaki and bare arms against long red hair, black leather and tartan.

**Select screen** (`src/select.js`), arcade style. The screen is split down the middle: P1 on the left, P2 (or the
computer) on the right. Each half has:
- a 6×2 grid of small portraits in profile at the top;
- below it, the highlighted warrior as a real 3D model on a turntable, rotating while it runs its three-hit combo (the
  finisher name flashes), then its special in place (the special's name flashes), then squares up again;
- the name, role, special, and five stat bars (health, speed, power, reach, special).

Attack picks: the warrior shouts its rallying cry in a balloon (one line per warrior, French and English), with a shout
sound and a small shake, then settles into its own fighting stance. Jump changes your mind; special picks at random.
Playing alone, P1 picks the partner on the right too, and the computer plays them. When both are in: "C'EST PARTI !".

**The 3D showcase models** (`src/model3d.js`). The select screen's big models are not the game sprites: each warrior is
rebuilt from smooth 3D shapes (spheres, round cones, ellipsoids, rounded boxes, rings) hung on the same skeleton and
poses as the game, so combos and specials play in 3D. They are ray-marched on the GPU (WebGL2) and lit like a studio
turntable: warm key light with soft shadows, cool fill and floor bounce, a pink rim light on the P1 side and blue on P2,
ambient occlusion, a soft toon ramp, ink at the edges, and the model's shadow on the turntable. Materials: cloth, skin,
hair with a sheen band, metal and gold with reflections, leather, glass, glowing parts (with a bloom), tartan (Ruby's
skirt), camouflage (Soldier), tattoos (Marge's arms), Demi's split cloak (live flame on one side, frost on the other),
Spora's spotted cap. Papi's tidewalker, Spora (eight tentacles all round) and Bernache (wings that open on the honk) have
their own 3D builds and moves. Resting angle is a three-quarter view facing the other player. If frames run long, the
models drop resolution automatically; without WebGL2 the screen falls back to the flat drawing.

## Picking up and throwing, each with their own body (24 November 2026)

`src/carry.js`. A lift is a real motion (reach down, grab, rise; a puff of dust and a heave on the grab), the carried
thing follows the warrior's actual hands, and a throw has a wind-up, a release frame and a follow-through. Lifting
roots you; carrying slows you by the warrior's strength.

| Warrior | Carries | Throws |
|---|---|---|
| Amiral Remords | on his shoulder, behind his head | overhand heave |
| Marge la Roadie | one hand, high overhead, tossing it lightly (scoops it up one-handed) | a big two-step slam, the screen shakes |
| Le Gros Cyborg | on the chrome fist, arm straight out | piston punch: flat, very fast, a puff of steam |
| Papi | in the tidewalker's teeth | neck snap |
| Ruby Tonnerre | both hands overhead | guitar-smash over the head |
| Spora | telekinesis: it floats on wavy green strands, motes orbiting | it flies on a wobbling, weaving path with green rings |
| Magneto | magnetism: it hangs in front of his palm on blue arcs | palm push: straight and fast, a blue trail |
| La Doc | hugged against her belly, a careful squat to lift | two-handed underhand lob, high and soft |
| Demi | balanced on a burning palm | sidearm fling with a fire trail |
| Bernache | scooped onto her back | the honk flings it off |
| Raccoon | too big for him: wobbling overhead, a struggle to lift, slow | a little hop and a two-handed toss |
| Soldier | tucked under an arm | grenade lob, high arc |

## Richer sound effects (24 November 2026)

`src/sfx.js`, on top of the audio buses. Every effect is placed left or right by where it happens on screen and varies a
little each time (pitch, level), so repeated hits never sound copy-pasted.
- **Impacts by what hits**: Amiral's sabre slices and rings; Marge's fists boom; the Cyborg's chrome fist clangs; Ruby's
  guitar thuds and twangs a distorted power chord; Papi's hooves clop; Spora squelches and bubbles; Magneto zaps;
  La Doc's kicks snap; Demi sizzles hot and tinkles cold; Bernache's wings slap; the Raccoon's quick punches; the Soldier's
  rifle butt knocks wood. Goon weapons too: knives slice, prods zap, wrenches and pipes clang, chains rattle, a fish slaps.
- **Voices**: small synthesized grunts per warrior (a gruff old admiral with a wobble, a roadie's shout, a ring-modulated
  robot, a punk, an old man for Papi, bubbles for Spora, a honk for Bernache, chitter for the Raccoon): efforts on some
  hits, a yell on finishers and specials, oofs when hurt, a cry on a knock-out, a strain on lifts, a grunt on throws.
  Goons oof and cry out when they go down, then their bodies hit the floor.
- **Moving**: footsteps by surface (hollow dock planks in Havre, cobbles in De Soif; stilt clanks for Papi, webbed slaps
  for Bernache, heavy servo steps for the Cyborg and brutes), jumps, landings that thud by height, dodges, charges.
- **Things**: breakables by material — wood splinters, barrels with ringing iron hoops, kegs that slosh, glass shards,
  metal bins, pottery, cars, and a piano that collapses into a chord; knocks when hit but not broken.
- **The rest**: poison bubbles, dizzy birds, bleeding drips, food chimes, healing sparkles, enemy lasers, a coloured
  rising swell when a special starts.

## World 2: De Soif and Oscar GrosVerres

A hot, dry planet where every street has a bar, printed in Âge d'argent. Four screens: the container port (a crane drops a
container), downtown (a police chase in the back street), the street of bars (someone thrown out through a window), and
**Le Poisson Blanc**, a western saloon with a balcony that drunk goons jump from.

**Oscar GrosVerres** is not an evil man: alone as a child, he fell in with a gang, went to prison, and Villen-Hüüs got him
out with a promise that he'd never be alone or bored again. So he fills his bar with goons.

- Throws empty glasses: bleeding, no hit damage.
- Shakes and throws his shaker: it bursts into bubbles, dizziness.
- Throws drunk goons: 1/2 heart and poison; the goon gets up and fights.
- Drinks from his keg to heal 15%, at most every 20 s; any hit or charge stops it; break the keg to end it.
- All his throws can be dodged with the back-dodge, and can hit your partner.
- Beaten, he kneels; his story plays as a scratched silent film; the Empire police take him; he gives up gear no. 2.

## World 3: Bouldaire and Calve-Hair

A glamorous fashion planet in *ligne claire*, with an Italian-disco theme (150 BPM, octave bass, handclaps). Four screens:

1. **Le boulevard des Ciseaux**, a Haussmann shopping street. Set piece: the golden Calve-Hair statue topples and its head
   rolls down one lane, crushing goons and props; it stays as a wreck.
2. **La galerie lumière**, a glass-roofed arcade on two floors. Set piece: a hare rides the disco ball down; it bounces and
   bursts into mirror shards that cut (bleed).
3. **L'avenue de la Mode**, dusk, neon boutiques, billboards, a catwalk and paparazzi flashes.
4. **Le salon Calve-Hair**, pink walls and bulb mirrors. Set piece: giant golden scissors fall, spin across the floor (bleed)
   and stick upright. Then the boss.

Goons: apprentice stylists (comb, razor and shears bleed; curlers shove), **blowers** (a hot gust that pushes), **sprayers**
(a can that bursts into a pink dizzy cloud), **mutant hares** (long pounce; a ground thump with a shockwave) and **blaireaux**
(badgers that dig, tunnel and pop up with an uppercut, throw shaving-foam balls, and **lather** you with the brush).

**Lathered** (new status): 3.5 s, about 35% slower, foam on the head, no damage.

**Calve-Hair**, taller than the Warriors, two golden scissors, hair that never stops moving:

- Scissor snips: bleeding, no hit damage. Long-leg kick: 1 heart and a big push-back.
- Hair tornado (every 10–13 s): pushes everyone back, makes you dizzy, throws goons and props around. Punches bounce off;
  only a **charge** or a **thrown object** breaks it, and that leaves him dazed for 1.8 s.
- Hairspray cloud: heals 15%, at most every 20 s; any hit stops it; the cloud does nothing to us.
- Beaten, his hair falls flat; a silent film tells his story; the police take him; he hands over the gear; in prison a
  badger barber shaves him bald.

## Level 3½: La Tour Calve-Hair (24 November 2026)

A short challenge between Bouldaire and the next planet, about **dashing and throwing** rather than fighting.

- **The interruption:** halfway through Calve-Hair's silent film, a card says "Et puis…" and Madame Metal Face walks *into*
  the film, then steps out of it into colour ("Pardon. Je coupe la séance."). She tells the police she's from the Empire's
  evidence office, has them sign forms in triplicate, takes gear no. 3 and runs for the cranes behind the salon.
- **The climb** (its own mode, `climb.js`): six ladders up the crane mast, the screen scrolls upward. Left/right hops a
  ladder, twice quickly is a two-ladder leap; jump lunges up; attack swats falling things. Rivets, paint pots and clamps
  rain down (warnings at the top edge), steel beams swing across, welding torches spit sparks, hair-dryer goons blow you
  sideways, and she kicks binders and staplers down. Landings are checkpoints; running out of hearts drops you to the last one.
- **The sky platforms** (`crane.js`, a play screen with `sky: true`): decks hang from crane cables over the void. A fall
  costs half a heart and puts you back on the last deck. Six throw puzzles: a counterweight, a crane button, a sand bucket
  (three throws), pigeons on a seesaw beam, a swinging counterweight, and a billboard's two guy ropes (the second needs a
  jump-throw) that falls into a bridge. Three long gaps need a dash-jump. A crane hook lowers new toolboxes when you run out.
- **Madame Metal Face, three strikes:** on the top crane. Punches go on her clipboard ("TOC"), the third hit of a combo is
  countered ("Noté."), and a charge she sees coming she vaults over. Only a **thrown object**, or a **charge right after one
  of her attacks** (yellow brackets show the opening), lands. She moves like a ninja: skips away, spinning kicks, a diving
  kick from above, and homing paper-plane memos that make you bleed. Each strike goes *CLANG*, cracks her glasses and knocks a
  sheet off her clipboard; after the second the metal shows under her cheek. After three: "Bon. J'ai un rendez-vous." — her
  tape measure hooks Villen-Hüüs's passing ship and she's gone with the gear.
- **After:** back in the salon the film resumes where it stopped, the police show their receipt in triplicate, Calve-Hair
  goes to prison for his shave, and gear no. 3 is lost.
- Music: the disco band as a chase, in D Phrygian at 164 BPM; wind for ambience.

## Playtest bots (24 November 2026)

`tools/playtest/` runs bots through the real game loop headless (renders stubbed, about 200× real time): `dumb` (random
mashing), `naive` (walks right and fights) and `good` (dodges, charges, throws, solves the sky puzzles), solo and duo,
with random warrior pairs. About 1,100 runs found and fixed: the goose's honk left bosses with a flee flag that never
cleared (it switched off keep-on-screen, the old "Oscar off screen" bug); enemies and the computer partner pressing
forever against a long wreck or a parked car instead of walking round (in solo the stuck partner pinned player 1 at the
edge of the screen); a badger knocked out of its tunnel stayed a moving mound; a lost crane hook that could block the
bucket puzzle's supply; a double tap after a run-up turning into a dodge instead of a dash; dodges and charges carrying you
off the edge into water or the void; and the "just hit" timer only counting down while drawing. Solo now plays like two:
the computer partner comes to revive player 1 instead of the screen restarting. Calve-Hair tells you how to break his
tornado after three punches bounce off.

**The computer partner is a sidekick, not a carry** (25 November 2026): its hits do 60 % damage; it fights within ~150 px of
player 1 (unless ordered to charge); it paces its combos and charges less; and when it's been doing more than its share of
the damage, or player 1 has stood about for 5 s, it only defends itself and player 1, softer and slower. In solo the
partner went from ~38 % of the damage dealt to ~18 %, and solo now takes ~20 % longer than duo with ~40 % more knockouts.

## Debug mode (25 November 2026)

On the title screen, enter **↑ ↑ ↓ ↓ ← → ← → ✕ □ ✕ □** (keyboard: W W S S A D A D Space F Space F, or the arrows with
Right Shift and K). A menu opens: any screen of any world, straight to each boss's own wave, and the three parts of
level 3½ (the climb, the platforms, Madame Metal Face). ○ / G toggles invincibility. Then pick your warriors as usual;
intro cutscenes are skipped. `src/debug.js`.

## Playtest notes, 25 November 2026: water, bosses, more things to throw

After a 2-hour session: falling in the water could loop (respawn, fall, respawn…), the bosses were too hard, and more throwables were wanted.

- **Respawn after a fall** (`respawnSpot` in `game.js`): back to the last dry spot, but moved on screen (an off-screen spot was clamped back
  over the water by the camera, which made the loop), at least 36 px from any edge, on free floor, with knock-back speed, charge and dodge
  cleared and 2 s of invincibility. Bots: 411 re-falls within 3 s of a respawn before (one run had 374, on the sky platforms), 85 after,
  none of them loops (bots retrying the same jump).
- **Bosses about 25 % easier** (`BOSS_EASE` in `game.js`, one knob): boss health ×0.85 (Villen-Hüüs, Oscar, Calve-Hair) and damage in boss
  fights ×0.85 (every few lost points are skipped). Metal Face keeps her three strikes and only gets the softer hits. Bots, 96 runs each:
  damage taken in boss fights −29 %, KOs −30 %, boss-fight time −28 %, screen restarts during boss fights 81 → 43.
- **50 % more throwables** (`boom.js`): every screen gets half as many again as it has small and medium breakables (at least two), placed
  on free floor, the same spots every time; about half are the screen's own kinds, half are new **surprises** that do something when they
  break, however they break (thrown, punched, slid into a wall, or caught in another blast). Friendly fire applies.
  - **Tord-boyaux** (green bottle, skull label): a poison mist; poisoned enemies lose 1 a second for 4 s (bosses 2.5 s).
  - **Siphon** (soda bottle): a fizz cloud; enemies inside wander dizzy for 2.6 s (bosses 1.2 s, then immune for 7 s).
  - **Pétards** (box of firecrackers): a small blast, 2 damage and a knock-up; sets off the neighbours (chain reactions).
  - **Bonbonne de gaz** (gas bottle, medium, 3 hits): a big blast, 3 damage, sets enemies on fire.
  - **Bidon d'huile** (oil can): a slick puddle for 8 s; enemies that walk in slip and fall, warriors skid.
  Warriors in a mist get the same status (poison, dizzy); blasts hit them for 1 (gas 2). Metal Face ignores blasts and clouds: only real throws
  count against her. On the sky platforms the supply hooks now drop firecrackers, poison and fizz bottles too.

## World 4: Zombimare and Prêtre-o-Dame (25 November 2026)

Black and white screentones (the manga print) with **one toxic green** kept by the shader: slime, poison, glowing eyes, a few stained-glass
panes. Four screens; the level is meant to be hard, with three minibosses before the boss.

1. **Le marais des Morts** — giant gnarled trees, moss, eyes in the dark, will-o'-wisps. Three **bog holes** (fall in: −2 hearts, back on the
   bank), five **poison patches** on the floor (step in: poisoned; jump over them), and things **hanging from the branches**: vines that grab
   you (1 heart, held 1 s) and cocoons that drop a leech or a blob when you pass. Enemies: **blobs** that split in two once, **frog-men** whose
   tongue pulls you in, **leeches** (bleeding). Miniboss: **the Swamp Spider**, down on its silk thread: bite, web (stuck 1.2 s), leap and
   shockwave.
2. **Le cimetière** — graves, the church on the hill, the circus plot, the great mausoleum of the Bonewhite family, a storm that flashes
   every few seconds. **Skeletons** (sword, bone-thrower, armoured knight; thin bones: a spine, a ribcage, hip bones, knobbly joints) **collapse into a pile of bones** when beaten: 3 s still, 2 s
   rattling, then they stand up again (at 60 %) unless someone **picks up the pile and throws it**. A banner says so the first time; the
   computer partner and the playtest bots throw piles too. Minibosses from the circus plot: **the Elephant** (trunk swipe, stomp, a charge
   across the screen) and **the Giraffe** (a red ring on the floor, then its head slams down there; a kick backwards).
   Big moments: **the storm** (lightning hunts the warriors, then the dead climb out of their graves), **the mausoleum** (the doors burst off
   and skid across, skeletons march out), **the storm of crows** (a black flock sweeps across and back, pecking everyone).
3. **La nef** — pews (big solid breakables), candles, alms boxes, **holy water** (bursts into a splash that heals 2 hearts, enemies too).
   Big moment: **the bells** — every DONG makes anyone standing on the floor dizzy: jump on the beat.
4. **Le chœur** — up the steps: the organ, the rose window, the altar. **Prêtre-o-Dame**: very tall, bald, black cassock. Kicks only (his
   hands are full); his censer trails incense everywhere he walks; he whirls it like a nunchaku (dizzy); he drinks holy water to heal 15 %
   (break the bottle with a throw or a charge); about once a minute he raises his crucifix and the **whole screen goes white for 5 s** (a flash, 2.4 s of near-total white,
   then a slow dimming back), only the faintest blurred contours of the fighters showing through; the lettering and balloons go under the
   white too, only the HUD stays readable — he sees fine, everyone else is blind. No free hits, just a fight in the white.

Story (funny and child-friendly): Villen-Hüüs leaves gear no. 4 under the priest's great bell; Madame Metal Face takes notes. Beaten,
Prêtre-o-Dame confesses he was afraid of the dark, became a priest to light candles everywhere, and served Villen-Hüüs for a clock that brings
the day back; the police take him away ("no smoking in the cells"). Music: a horror-film pipe organ in A harmonic minor with a church bell.

Bots (36 runs): naive and good bots clear it (one naive solo run timed out); about 1.5× the knockouts of Bouldaire, which is the intended
"hard". Fixed on the way, for every level: two warriors falling into the same hole no longer restarts the screen (a fall counts as "down" only
if it will knock you out).

## World 5: Éprouvette and Dr PaNIC (28 November 2026)

Printed as an 1870 engraving (shader style 6: sepia copperplate, wavy hatching). Dr PaNIC (Pa + Ni + C: protactinium, nickel, carbon) is a
chemistry professor; his Mutant & Weapons Research Facility goes one floor deeper every screen. Six short screens (1740 px, two thirds of a
usual one) before the boss room. The planet's name, Éprouvette ("test tube"), is a placeholder until Francis picks one.

1. **Le toit** — a fancy spacecraft drops the warriors straight into the fight; Dr PaNIC screams for his birds and runs downstairs. No railing:
   two gaps in the roof to fall through. **Mutant birds** (three eyes) hover out of reach and swoop low to peck — hit them on the swoop or
   jump; **man-birds** with claws land among you (bleeding).
2. **Niveau −1 · Fourmis géantes** — the ant farm cut open on the walls; lots of quick giant ants.
3. **Niveau −2 · Serpents** — snakes that **puff up like pufferfish** when hit (spines, bigger, venom). Miniboss: **the Three-Headed Snake**,
   coils as wide as a car and three tall necks that sway, strike out and down (2 damage, sometimes poison) or spit venom, each on its own.
4. **Niveau −3 · Souris samouraï** — mice in gis with katanas that dash at you; **cheese boxes**: break one or throw it and every mouse nearby
   stops for a cheese break (about a second).
5. **Niveau −4 · Labo des vampires** — dim (only a pool of light around the warriors, red eyes in the dark). Vampires bite: you bleed and they
   heal. Sometimes, when hit, they turn into a bat, fly off fast, then charge back and bite. Little damage, lots of stamina.
6. **Niveau −5 · Explosifs chimiques** — five times the breakables, 90 % of them explosive (flasks, beakers that fizz, chemistry sets that
   pop, petards, poison, gas). Scientists (ordinary people, very little health) never punch: they keep away, grab explosives and throw them.
   Chain reactions everywhere.
7. **Niveau −6 · Le labo secret** — a mixed wave of everything from above, then **Dr PaNIC**: glowing lab coat, wild white hair, round
   spectacles. **Nickels** (often): a spread of three coins. **Carbon cane**: 1.6 s of uselessly flourished dancing (twirls, hops, swirls),
   then one smack: 2 damage and dizzy; a throw or a charge breaks the dance. **Protactinium** (first after 20 s, then every 90 s): the lights
   go out for **15 s**, pitch black. Only radioactive things glow: his jacket, the salves he throws, whoever they hit (poisoned, and glowing
   for the rest of the dark: now you're visible), the puddles where they miss (5 s, dimming, lighting a circle twice their size), and the
   shoes of anyone who walks through a puddle (no poison).

Story: Villen-Hüüs hands gear no. 5 to Dr PaNIC ("the elevator is broken, nobody will ever get down there"); beaten, he's asked for his
flashback and has none: "Oh, no need for a history lesson here. I just like chemistry, that's all. Sometimes it's just boring like that."
The police let him keep the coat as a night light. Music: a nervous mad-scientist synth in B locrian; the facility hums and bubbles.

Bots (good, duo and solo): all clear in 9–14 minutes of game time, 2–6 screen restarts. Tuned on the way: vampires had 39 restarts
(hp 16 → 12, heal 3 → 2, bat 35 % → 22 % with a 4 s cooldown, fewer per wave), the boss room's opening waves cut from three to two,
Dr PaNIC's coins and salves a little slower, the snake's hp 95 → 80.

## Four-hit combos (27 November 2026)

Every warrior's chain is now four hits: hits 1 and 2 alternate, hit 3 is the same kind of hit only harder (+1 damage, about twice the
push, a heavier freeze), and hit 4 is the named finisher, after **0.3 s of charging** (the warrior coils and trembles, lines gather,
a rising whine; you can be hit while charging) — then the finisher pushes 20 % further and launches 15 % higher than the old one.
New moves so far: **Jean-Louis Carnage** (jab, cross, hard hook, *Coup de casque*: a helmet-first headbutt with his whole body),
**Papi des marées** (prod, the horse's head butt, both harder, then *Coup de sabot*: the horse rears up while charging and stomps),
**Spora** (green lash, pink lash, both at once, then *Sporade*: it swells up and bursts). The other nine keep their moves for now: hit 3 is
a harder hit 1, hit 4 is their old finisher with the charge. Bots (60 runs, old vs new): no change in clears, restarts or knockouts beyond noise.

## Battle shouts (27 November 2026)

The balloons goons and the partner shout during fights are drawn at 70 % size and 65 % opacity, and fade 25 % sooner, so they stop
covering the action (`QSTYLE` in `play.js`, which can also space them out: a gap between balloons, a cap on how many show at once).
Bosses and the lines spoken during set pieces keep full-size balloons.

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

**Walking and running (24 November 2026).** The lifted foot now swings forward (it used to swing backward), and the walk/run cycle advances with the
distance actually covered, so planted feet grip the floor instead of sliding (heroes, goons, fleeing goons).

**Real-world scale (24 November 2026).** A warrior is about 72 px tall (1.8 m), so about 40 px per metre. Breakables are drawn at real size
(a car ~1.5 m tall and ~4.3 m long, tables at hip height, a wheelie bin at the waist, a forklift taller than you, shipping containers 2 m tall);
the big moments too: La Gourmande towers over the quay, the fighter is the size of a real light jet, the fallen train car fills the back
of the boulevard (it grows as it falls toward you from the viaduct), the beer tanker fills the hole it makes, the crane reaches the top of the screen.
