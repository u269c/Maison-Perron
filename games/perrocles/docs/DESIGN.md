# Perroclès: how we made it

These are the design notes for Perroclès: where the idea came from, how we worked, what we
decided along the way and why. The full decision log, written during development and
milestone by milestone, is in [decisions.html](decisions.html).

> **Spoilers.** This document gives away the father, the ending and most of the bosses. If you
> want to play first, [stop here](../README.md).

## Contents

1. [Where it started](#where-it-started)
2. [How we worked](#how-we-worked)
3. [The story decisions](#the-story-decisions)
4. [Art direction](#art-direction)
5. [Fights as small puzzles](#fights-as-small-puzzles)
6. [Balance: who it's for](#balance-whos-it-for)
7. [Testing with hundreds of robot playthroughs](#testing-with-hundreds-of-robot-playthroughs)
8. [What a person found that the robots didn't](#what-a-person-found-that-the-robots-didnt)
9. [Still open](#still-open)
10. [Version history](#version-history)

## Where it started

Perroclès began as "Mine-Moule, but Greek myths": a full rewrite of
[Mine-Moule](../../mine-moule), the house survival platformer, reusing its code where it made
sense. The brief was short:

- a **demigod**, child of a god and a mortal, who doesn't know which god;
- a **guide** who leads the main quest;
- monsters and bosses taken from **Heracles' labours and the Odyssey**;
- **every road leads to a fight with Hera**;
- French first, then Greek and English.

The name is a family joke: *Perron*, the household's name, plus *-klês*, "glory", the ending of
Heracles, Pericles and Sophocles.

The survival loop of Mine-Moule (gather by day, build at night) didn't survive the first
prototypes. A myth wants a journey, so the game became a side-scrolling adventure through
the places of the stories, with the quest for the father holding it together.

## How we worked

The game was built by one developer (Francis) working with Claude, with Francis deciding and
Claude proposing, building and testing. Everything went through rounds like this:

1. **Boards before code.** Each big question got a review page with options side by side: four
   art styles for every kind of subject, 33 weapons and items each animated in both worlds,
   three rounds of story proposals. Francis picked, mixed and corrected, and the choices were
   written down as decisions.
2. **Prototypes, then simulated players.** Prototypes 0.1 to 0.4 tried out the mechanics. Each
   one was played by a robot hundreds of times as two personas, *a kid playing for the first
   time* and *a hardcore player*, and rebalanced from the report. The first rebalance
   ("Proposal B": boss health ×2.5, a hit cap with a roar in the last phase, burn-or-armour
   mechanics, Athena's mercy, cheaper special items) set the tuning for everything after.
3. **One act at a time.** From 0.5 on, each build added a part of the story: Act I (0.6),
   Act II (0.7 to 0.9), Act III (1.0), Act IV and the endings (1.1). Each was played by the
   bots, screenshotted, and reviewed by a separate image-reviewing agent that hadn't seen the
   code, looking for faces, limbs through bodies, unreadable text and the like.
4. **Decisions while away.** When Francis was away, the calls he would normally have made were
   made anyway and logged with the reason and the alternative, so he could overturn any of
   them on return. That log is [decisions.html](decisions.html).
5. **Hardening, then a person plays it.** Version 1.2 was a few hundred full playthroughs with
   monkeys on the keyboard, to find every softlock. Then Francis played it start to finish
   and sent notes, which became 1.2.1.

A gate held throughout: no final character, weapon or item design went in without Francis
seeing it first.

## The story decisions

### The rule of two sights

The premise came first, because it's also the main mechanic: **gods see mortals only as mist,
mortals can't see gods, and a demigod can see both, but never both at once.** It explains
why gods walk around disguised in every myth, why the hero is overlooked by everyone (the
gods literally can't see him), and it gives the player a button that changes the world. The
God's view is a painted vase, because that's how we actually see the Greek gods today.

### An oath on the Styx, and a name in letters

Why doesn't anyone just tell him who his father is? Because the gods swore on the Styx that no
god would claim a mortal child, and nobody who knows may say it. The hero has to *read* it
instead. The father's name turns up one Greek letter at a time, wherever an oath can't reach:
on the wall of the cleaned stables (Η Φ), on Talos's bronze nail (Α), with Atlas and the
dragon Ladon (Ι), with Prometheus (Σ), and finally in the Underworld, because the dead have sworn nothing,
where the whole word settles: **ΗΦΑΙΣΤΟΥ**, "of Hephaestus". Francis decided the letters
arrive in order, so the player can start guessing after two letters.

### The father is Hephaestus, not Zeus

Zeus was the obvious answer, which is why it isn't him. Hephaestus is the god Hera threw off
Olympus at birth for being lame, which makes the whole game about the same thing twice: a
child nobody wanted to see. It also explains a lot of small things that were already in the
game: the special weapons are "cyberpunk" because they're his workshop's (Homer gives him
golden handmaids that move on their own), every gift arrives "already paid for by a man who limps", and
Circe's cauldron and Talos's ankle carry the same smith's mark as the hero's sword.

It also makes **Hera** the hero's grandmother, unknowingly hunting her own grandson. She
appears in every act as an old woman, and in Act I she even hires the hero to find "the hidden
child". That's him.

### Other story calls

- **Mentor is Athena, revealed early.** The Odyssey's trick, but the player is let in on it at
  Delphi, so the fun is in watching her pretend to be an old man.
- **The labour beasts are constellations** Hera pulls down from the sky. When beaten, they rise
  back into the stars (the lion becomes Leo, the Hydra and the crab Hydra and Cancer) in a
  small cinematic.
- **Braided, not branching.** Answers in dialogue come in three moods, Force, Cunning and
  Heart. They reorder the labours and the islands and change lines along the way, but
  everyone plays the same story. Branching would have meant writing the game three times.
- **The true ending is "make her look".** Hera can't see her grandson because he's mortal. The
  finale isn't about beating her, it's about making her see him, and the grandmother loophole
  in the oath does the rest.
- **The hero has no spoken name until the last scene,** when he's finally given one:
  Perroclès.
- **Tone:** warm and funny, with Greek-myth puns at dad-joke level and situation jokes that
  survive translation ("Nobody has put out my eye!"). Polyphemus asks your name and calls you
  Nobody whatever you answer. Eurystheus gives orders from inside his jar. Each of the three
  languages gets its own jokes where a pun doesn't travel.
- **Borges' Asterion.** The Minotaur is the gentle, lonely door-counter of Borges' story, and
  he joins you.

## Art direction

### Two styles, one rule each

The first art board put every kind of subject (heroes, villains, monsters, places) in four
directions: classic, goth, death metal and cyberpunk. The result: **classic for good folk, goth
for foes and bosses, metal when a boss drops to its last 18 % of health** (faster and harder),
**cyberpunk for the special weapons**.

For the look of the worlds, the pixel style won the mortal view and the painted-vase style
became the God's view: black figures on red clay, no backgrounds, just a ground line and a
meander band. Figures don't breathe in the God's view, because paintings don't.

### Density and finish

- **"32-bit" density:** a 480 × 270 screen of 2-pixel pixels, up to 48 colours per sprite.
- **No heavy outlines:** at most one soft pixel, in a darker shade of the colour it touches,
  never black.
- **Faces:** small dark eyes with no whites, thin soft lips, tousled curls. The first hero face
  came out creepy, and the fix became a rule: young faces get no cheek or jaw shadow, only
  elders do.
- **Gods are taller in the God's view:** lesser gods +20 %, Olympians +25 %, Titans +50 %.
- **Names on clay tablets:** gods' names in the God's view are fine Greek capitals pressed into
  a small clay tablet beside the head, as painted names sit on real vases.
- **Close-ups are painted at 8× the density** on a separate high-resolution layer, not in game
  pixels.

### Bodies that move properly

"Put your back into it" was the direction for every action. Characters are small skeletons
(hips, knees, two arms, a tilting head) baked into sprites at load, which makes the rules
enforceable:

- **steps are locked to the distance moved**, so nobody skates;
- **crouches bend the knees**, pickups too, never the waist;
- **arms swing when running**, including the hand that holds a staff, spear, club or oar;
- **centaurs** have the human torso over the front legs, not the middle of the horse;
- delicate actions (catching a feather, releasing a star) are two-handed and slow; drinks are
  gulped.

### The Hydra, after the Caeretan hydria

The first Hydra was a dragon with a big body and a bundle of heads. Francis sent a photo of the
Caeretan hydria (about 525 BC), the vase where Heracles and Iolaos fight it, and the note
*"a snake really, no big body"*. The Hydra is now one long serpent: a coiled trunk, a fan of
thin necks, gaping snake heads, and in the God's view the alternating black and added-red
necks of the painting. The Book of the Gods reuses the same drawing.

## Fights as small puzzles

Every boss asks a question before it asks for reflexes, and the answer usually comes from the
myth:

| Boss | The question | The answer |
|---|---|---|
| Nemean lion | Swords bounce off its hide | Switch to the club; it parries blows to the face, so hit after its pounce, after a missed swipe, or from behind; then wrestle |
| Hydra | Cut a head, two grow back | Burn the stump with the torch before it regrows |
| Erymanthian boar | Too fast to hit | Stand in front of a snowdrift and jump when he charges; he ploughs in head first, and his rump is all yours |
| Stymphalian birds | Out of reach | Athena's bronze rattles scare them up into sling range |
| Augean stables | Not a fight | Two dams, a sluice, a flood |
| Polyphemus | A giant with a club | Jump the dust ring; the club sticks in the ground; hit his fingers. Maron's wine makes him tipsy |
| Aeolus | Runaway winds blow you back | Shelter behind bronze windbreaks; hit the winds when they're out of breath |
| Circe | Don't hit the lady | Knock over her cauldron while she stirs |
| Sirens | The song pulls you to the rail | Carry wax, one ball at a time, to the sailors' ears |
| Scylla and Charybdis | Survive the strait | Watch the shadows, send the planted heads home, hold on through the whirlpool's tilt |
| Talos | Bronze all over | The nail at his ankle glows after his slam: hit it |

Act III and IV follow the same idea: Cerberus has to be put to sleep, Typhon is a team fight
with your father, and Hera's fight comes in four phases, each about sight.

## Balance: who it's for

The targets were agreed early and never moved:

- **A first-time young player:** at least 99 % finish, about one or two deaths per act, nobody
  stuck on anything for more than a minute, boss fights of 20 to 30 seconds.
- **A hardcore player:** few or no deaths, but has to work for it. No fight can be won by
  mashing the button.
- **Heroic mode** is the real challenge, for anyone who wants it.

Two tools keep the normal game fair without making it trivial:

- **Mercy.** Small, quiet help when a fight drags on. When the hero falls and gets back up, a boss keeps most of the damage
  already done to it (Athena's mercy). The Hydra stops regrowing as fast after 45 seconds, and extra heads wither
  when you die. Circe stirs longer after misses, Cerberus sleeps longer each time he wakes,
  and the boar's snowdrifts get bigger after three misses. Heroic turns most of it off.
- **Telling, not guessing.** Each boss's trick is said out loud by someone, usually twice:
  Pholus explains the snowdrift, the hero mutters "the snow, it has to be the snow" when a hit
  bounces, a hint line sits above the boss bar.

The bots measured every boss against the targets. For example, at 0.6 the kid bot finished
Act I in 12 runs out of 12 with 2.0 deaths per run and a 24-second median lion fight, and the
hardcore bot finished 24 out of 24 with about one death per run.

## Testing with hundreds of robot playthroughs

The [simulator](../tools/sim) drives the real game file in headless Chromium through a small
test hook (`window.GAME`). It's the same game a player gets, not a copy.

- **Players.** A bot plays with a goal-directed *director* that knows the story (where to walk,
  whom to talk to, what each boss needs) and different *profiles*: a first-time kid (slow
  reactions, mistakes, forgets the trick), a hardcore player, a masher, each also on Heroic.
- **Monkeys.** On top of that, a monkey presses random things at random times: the God's view
  on and off, the pause menu, the Library, scene skipping, changing language mid-sentence.
- **Quit and Continue.** Runs can quit at a random moment and reload the save, or reload in
  every single level, to check that every save point resumes cleanly.
- **Time.** A budget mode fast-forwards game time about forty times, so a full game takes a few
  minutes.
- **Invariants, every frame.** A scene running too long, a dialogue that never closes, a dead
  hero who never respawns, a letterbox that never lifts, a black screen, a hero below the
  floor or off-screen, NaN positions, a scene starting over and over. Any of these stops the
  run and saves a screenshot.

For 1.2 the bots played **385 full games**, Prologue to the end card. They found six softlocks
and a class of timing bugs:

- quitting after the last labour lost the king's report, so the game waited for a scene that
  never came (the pending report is now saved);
- quitting on Olympus after the fight left nowhere to go (it now resumes the homecoming);
- a "leaving the level" guard that could get stuck and block every exit (it now heals itself);
- the Sirens' helm trigger could be walked past;
- a scripted walk that could never arrive, freezing a scene (walks now have a time limit);
- story scenes that were silently dropped when another scene was busy (they now queue).

The timing bugs were all the same mistake: about fifteen pieces of game logic used the
browser's `setTimeout`, so they kept running while the game was paused or after the player
had left the level. They now use a `later()` on game time that pauses with the game and is
dropped on level change. Fades, title cards and respawns moved from the drawing code into
the update loop for the same reason, which also fixed every fade-in after a fade-out being
invisible.

## What a person found that the robots didn't

When Francis played 1.2 from start to finish, none of his notes were softlocks. All of them
were about seeing, reading and feeling, which is what the robots are worst at:

- a bridge with grass growing on top, over a road that wasn't cut (now a real gully with water);
- money carried over into a new game;
- dark text on a black screen before Delphi;
- the weapon rows the wrong way round for L1 and R1 (the rows were swapped, not the buttons);
- brigands attacking before their scene, and a scene playing while the hero was dead;
- a knock that didn't reach the jar, and a staff "swing" that didn't swing;
- snow starting all at once, for no reason the player was told (now gradual, with a reason);
- a snowdrift that was "hardly a big snow pile" (now a real pile with a boar's rump sticking out);
- the boar dying with a fifth of his bar left (the bar now shows the hits he really needs);
- Artemis standing there in the God's view with nothing to say;
- one sentence from Eurystheus that didn't make sense.

The lesson we took: bots are good at "can you get stuck?", and people are good at "does this
make sense, and is it fun?". Both are needed.

## Still open

- **Heroic Aeolus, Circe and Talos** may be too hard: the hardcore bot finished 5 of 10 full
  Heroic games, and every stop was at one of those three.
- **The Hydra's necks could fan straight up** like the vase painting. It would change the fight.
- Should Aeolus's island float? Should the labour beasts look divine in the God's view? Where
  should the father's letters live in the menus?
- **Player two** (Argos, the dog) is scaffolded but not playable yet.
- The Book of the Gods has six pages so far; more gods are met than are written up.
- Art polish: centaur legs, Talos's kneel, Cerberus's anatomy, Atlas's arm, Prometheus's
  chains, Argus's neck.

## Version history

| Version | What it added |
|---|---|
| 0.1 – 0.3 | Mechanics prototypes through Tiryns and three labours; 512-run simulated playtest; "Proposal B" tuning |
| 0.4 | The Prologue in Oloosson and Delphi; the two worlds; the Owl's Eye |
| 0.5 | Act I to the Nemean lion: the Argolid road, Tiryns, Eurystheus's jar, the stances, Heroic mode |
| 0.6 | Act I complete: Lerna, Arcadia, the Augean stables; the labour order by stance; constellations |
| 0.7 | Act II: Argos, Ocyrhoe, the ship's deck, Polyphemus, Aeolus, Circe |
| 0.8 | The Sirens, Scylla and Charybdis |
| 0.9 | Crete: Talos, Ariadne, the Labyrinth, Asterion |
| 1.0 | Act III: Hera's reveal, Lemnos, Atlas and Ladon, Prometheus, the Underworld |
| 1.1 | Act IV and the endings: Etna and Typhon, the Heraion and Argus, Hera on Olympus, the homecoming |
| 1.2 | Hardening: 385 full robot playthroughs, six softlocks fixed, game-time timers, the new Hydra |
| 1.2.1 | Francis's playtest notes: bridges, snow, the boar, the HUD, scenes that wait their turn |
