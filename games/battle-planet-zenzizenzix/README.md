# Battle Planet ZenzizenziX

*In the works.* A two-player co-op side-scrolling brawler in the spirit of Battletoads.

Two retired, seasoned warriors pick up arms again when the evil **Lord Villen-Hüüs** comes to
conquer their planet. They chase him across eight planets, beat his generals, his assistant
**Madame Metal Face** (the real brains of the operation), and bring him to justice before the
**Emperor D'Justeece** for the bounty on his head. Then the long way home begins: the same
eight planets in reverse, harder and darker, now ruled by local warlords and two familiar
faces back as robot zombies.

- **Two players, two controllers**, on one screen. Friendly fire on.
- **Move, jump, one attack, one special.** Attacks always strike left or right; moving up or
  down strafes.
- **One rewind watch per player, once per game:** time runs backward on screen for the last
  5 seconds, then play restarts from there.
- **Twelve warriors, two of each role (Les Douze):** from Amiral Remords, a repentant
  general with a rocket peg leg, to Bernache, a very angry Canada goose, alongside the three
  original heroes (the big cyborg, the space raccoon and Jean-Louis Carnage, the soldier).
- **8 planets of 4–6 screens** on a 2.5D floor, with holes to jump, traps and towers, then a
  reversed **hard mode** back home.
- **Upbeat 80s punk** on the Maison Perron music engine.

Like every Maison Perron game, it will be one self-contained HTML file, French by default
with English one tap away.

**Play World 1:** [battle-planet-zenzizenzix.html](battle-planet-zenzizenzix.html): pick two of the twelve, watch the prologue (the Clock War, the medals, the eight hiding places, thirty years of retirement, Villen-Hüüs in his lair), then fight through Havre in the World 1 comic print. World 2, **De Soif**, follows: the city port, Le Poisson Blanc and its barman Oscar GrosVerres. Pick a world on the title screen with ◀ ▶. The dialogue changes with every pair and every game. Playing alone? Pick your warrior, then your partner: the computer plays it, and you give it orders on the shoulder buttons. Every warrior has a triple combo with a named finisher. Press Esc or Start for the controller map. [Play it on the site](https://u269c.github.io/Maison-Perron/games/battle-planet-zenzizenzix/battle-planet-zenzizenzix.html). Sources in `src` (`python3 src/build.py`).

**The look:** [mocks/comic-styles.html](mocks/comic-styles.html), one comic print style per planet.

**The science dossier:** [docs/dossier-kepler-90.html](docs/dossier-kepler-90.html), the real eight-planet system the game is set in (Kepler-90), planet by planet, with settlements, imagined life, space stations and the Empire's home system. On the site: [u269c.github.io/Maison-Perron/games/battle-planet-zenzizenzix/docs/dossier-kepler-90.html](https://u269c.github.io/Maison-Perron/games/battle-planet-zenzizenzix/docs/dossier-kepler-90.html).

**Playable mocks:** [mocks/level1-havre.html](mocks/level1-havre.html), level 1 on Havre in four screens (the docks, the fish market, the tidal flats, the lighthouse square), each 3–4 screens wide with its own live background and event. Kill every wave to move on; friendly fire is on; double-tap forward to charge (it can cancel a melee attack), double-tap back to dodge (bullets too). Lord Villen-Hüüs waits at the end. [Play it on the site](https://u269c.github.io/Maison-Perron/games/battle-planet-zenzizenzix/mocks/level1-havre.html). Sources in `mocks/src` (`python3 mocks/src/build.py`).

**The warriors:** [docs/art/les-douze.html](docs/art/les-douze.html), the painted cards for the 12 (initial design), and [docs/warrior-file.html](docs/warrior-file.html), the record of how they were chosen. On the site: [Les Douze](https://u269c.github.io/Maison-Perron/games/battle-planet-zenzizenzix/docs/art/les-douze.html) · [The warrior file](https://u269c.github.io/Maison-Perron/games/battle-planet-zenzizenzix/docs/warrior-file.html).

**The plan:** [docs/PLAN.md](docs/PLAN.md): story, controls, characters, planets and bosses,
music, what we reuse from the other games, milestones, and the open questions.

The name riffs on *zenzizenzic*, an old word for a number raised to the fourth power (the
square of a square), as Robert Recorde used it in *The Whetstone of Witte* in 1557.
