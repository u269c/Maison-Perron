// =====================================================================
// BUDDY — the computer partner for solo games.
// It plays player 2 by pressing the same virtual buttons a person would (move, attack, charge, throw,
// special), so it has your moves, your combos and your status effects — no cheating, and it fumbles too.
// A real second player can grab the P2 controls at any moment; the computer steps back in 3 s after they let go.
// Player 1 gives orders: L2 "come here", R2 "charge", L3 "hold here", R3 "free" (keyboard 1 2 3 4).
// =====================================================================
let CPU = false;
const BUDDY = { mode: 'free', hold: null, think: 0, plan: null, hum: 9, taps: [], atkCD: 0, chain: 0, chainMax: 3, talkCD: 0, lowCD: 0, spared: null, prevKO: false, stuck: 0, lastX: 0, lastZ: 0 };
const ORDER_KEYS = ['follow', 'charge', 'hold', 'free'];
const ORDER_NAME = { follow: ['À moi !', 'To me!'], charge: ['Fonce !', 'Charge!'], hold: ['Tiens bon !', 'Hold here!'], free: ['Libre !', 'Free!'] };
// how each warrior answers an order, FR / EN
const ORDER_ACK = {
  amiral: { follow: ['À vos ordres. Je me mets dans votre sillage.', 'Aye. Falling into your wake.'], charge: ['Bordée générale ! À l’abordage !', 'All guns! Board them!'], hold: ['Je jette l’ancre ici.', 'Dropping anchor here.'], free: ['Navigation libre !', 'Free sailing!'] },
  marge: { follow: ['J’arrive ! Personne ne touche à ma tête d’affiche.', 'Coming! Nobody touches my headliner.'], charge: ['ENFIN ! On monte le volume !', 'FINALLY! Turning it up!'], hold: ['Je bouge pas. La scène, c’est moi.', 'Not moving. I’m the stage.'], free: ['Carte blanche ? Tu vas le regretter.', 'Free rein? You’ll regret that.'] },
  cyborg: { follow: ['Je viens.', 'Coming.'], charge: ['Écraser.', 'Crush.'], hold: ['Je reste. Comme un mur.', 'I stay. Like a wall.'], free: ['Je décide.', 'I decide.'] },
  papi: { follow: ['J’arrive, j’arrive ! À mon âge, on ne court pas : on avance.', 'Coming, coming! At my age you don’t run, you proceed.'], charge: ['Hue, la monture ! Comme au bon vieux temps !', 'Giddy-up! Like the good old days!'], hold: ['Parfait, je n’avais pas envie de marcher.', 'Perfect, I didn’t feel like walking.'], free: ['Je fais à ma façon. Comme toujours.', 'My way. As always.'] },
  ruby: { follow: ['Je te colle comme un larsen.', 'Sticking to you like feedback.'], charge: ['Solo de batterie ! J’y vais !', 'Drum solo! Going in!'], hold: ['Je tiens la note.', 'Holding the note.'], free: ['Impro !', 'Improv time!'] },
  spora: { follow: ['Je pousse à côté de toi.', 'Growing right beside you.'], charge: ['Je vais leur pousser dessus. Littéralement.', 'I’ll grow on them. Literally.'], hold: ['Je prends racine.', 'Taking root.'], free: ['Je me répands où je veux.', 'Spreading wherever I like.'] },
  magneto: { follow: ['Attiré, comme toujours.', 'Attracted, as always.'], charge: ['Pôle positif : eux. Pôle négatif : leur avenir.', 'Positive pole: them. Negative pole: their future.'], hold: ['Je me colle au sol.', 'Sticking to the floor.'], free: ['Champ libre.', 'Free field.'] },
  doc: { follow: ['Reste près de moi, je n’ai que deux mains.', 'Stay close, I only have two hands.'], charge: ['Je vais leur prescrire une raclée.', 'Prescribing them a beating.'], hold: ['J’installe une infirmerie ici.', 'Setting up a field hospital here.'], free: ['Je fais ma tournée.', 'Doing my rounds.'] },
  demi: { follow: ['Une moitié de moi te couvre. L’autre aussi.', 'Half of me has your back. So does the other half.'], charge: ['Chaud devant ! Et froid derrière !', 'Hot coming through! Cold right behind!'], hold: ['Je garde la place. À température ambiante.', 'Holding the spot. At room temperature.'], free: ['Je suis d’humeur changeante.', 'My mood is changeable.'] },
  bernache: { follow: ['HONK ! (Il arrive en se dandinant.)', 'HONK! (He waddles over.)'], charge: ['HOOONK !!', 'HOOONK!!'], hold: ['Honk. (Il couve des œufs imaginaires.)', 'Honk. (He sits on imaginary eggs.)'], free: ['Honk ? Honk !', 'Honk? Honk!'] },
  raccoon: { follow: ['Je couvre tes arrières. Et tes poches.', 'Got your back. And your pockets.'], charge: ['Allumage des réacteurs !', 'Lighting the jets!'], hold: ['Je campe ici. J’ai vu une poubelle.', 'Camping here. I saw a bin.'], free: ['Liberté ! Les poubelles sont à moi !', 'Freedom! The bins are mine!'] },
  soldier: { follow: ['Reçu. Formation serrée.', 'Copy. Tight formation.'], charge: ['Baïonnette au canon !', 'Fix bayonets!'], hold: ['Position tenue !', 'Holding position!'], free: ['Initiative autorisée. Merci.', 'Initiative granted. Thanks.'] }
};
// things it says on its own; {n} is player 1's name
const BUDDY_SAY = {
  cheer: [['Joli, {n} !', 'Ça, c’est un final !', 'Rappel ! Rappel !', 'Je n’aurais pas fait mieux. Enfin, si.', 'Il a vu des étoiles. Moi aussi, un peu.'], ['Nice one, {n}!', 'Now THAT’s a finale!', 'Encore! Encore!', 'Couldn’t have done better. Well, I could.', 'He saw stars. So did I, a bit.']],
  low: [['Tiens bon, {n} !', 'Mange quelque chose, {n}, tu es tout pâle !', 'Ne meurs pas, j’ai pas les clés du vaisseau !'], ['Hang in there, {n}!', 'Eat something, {n}, you look pale!', 'Don’t die, I don’t have the ship keys!']],
  down: [['Je… fais une petite pause…', 'Relève-moi, {n} !', 'Aïe. Dis à mon chat que je l’aimais.'], ['I’m… taking a little break…', 'Help me up, {n}!', 'Ouch. Tell my cat I loved her.']],
  up: [['Merci, {n} ! Je te dois un verre.', 'Me revoilà !', 'Bon, où en étions-nous ?'], ['Thanks, {n}! I owe you a drink.', 'I’m back!', 'Right, where were we?']],
  spare: [['À toi l’honneur, {n} !', 'Le dernier coup est pour toi, {n} !', 'Je te le garde au chaud !'], ['All yours, {n}!', 'The last hit is yours, {n}!', 'Kept him warm for you!']],
  food: [['Je prends juste une bouchée.', 'Miam. Pardon. Miam.'], ['Just one bite.', 'Yum. Sorry. Yum.']]
};
function buddySay(kind, dur = 2.2) { const p = players[1]; if (!p || p.ko > 0 && kind !== 'down') return; const L = LANG === 'en' ? 1 : 0; quip(p, pickA(BUDDY_SAY[kind][L]).replace('{n}', VOICE[players[0].w.id].voc[L]), dur); BUDDY.talkCD = 5; }
function buddyReset() { Object.assign(BUDDY, { mode: 'free', hold: null, think: .4, plan: null, hum: 9, taps: [], atkCD: .5, chain: 0, chainMax: 3, talkCD: 3, lowCD: 8, spared: null, prevKO: false, stuck: 0 }); }
function buddyOn() { return CPU && BUDDY.hum >= 3; }
function buddyOrder(n) {
  const p = players[1], m = ORDER_KEYS[n - 1]; if (!m || !p) return;
  BUDDY.mode = m; BUDDY.hold = m === 'hold' ? { x: p.x, z: p.z } : null; BUDDY.think = 0; BUDDY.atkCD = 0;
  if (p.ko <= 0) quip(p, ORDER_ACK[p.w.id][m][LANG === 'en' ? 1 : 0], 2.2);
  pop(players[0].x, players[0].z, heroHeight(players[0].w.id, RIG_S) + 14, ORDER_NAME[m][LANG === 'en' ? 1 : 0], '#8ad8ff'); beep(740, .06, 'triangle', .04, 120);
}
function buddyEvent(kind, who) { if (!buddyOn() || who !== players[0] || BUDDY.talkCD > 0) return; if (kind === 'finisher' && Math.random() < .5) buddySay('cheer'); }

const BIG_FOE = { boss: .5, oscar: .15 };   // leave the deciding blow on a boss to player 1 (Villen-Hüüs flees at 40 %)
const FOE_SHOTS = ['laser', 'glass', 'shaker', 'goonball'];
function buddyThink(p) {
  const B = BUDDY, pl = players[0], role = ROLE[p.w.id], hpR = p.hp / hpMax(p.w), plR = pl.hp / hpMax(pl.w);
  const foes = enemies.filter(e => !e.dead && e.state !== 'drop' && e.state !== 'arrive' && !(e.flee > 0) && e.state !== 'kneel' && e.state !== 'escape' && e.x > camX - 20 && e.x < camX + VW + 20);
  B.plan = null;
  // 1. dodge what is flying at it (it notices most, not all)
  for (const f of fx) if (FOE_SHOTS.includes(f.k) && f.from && !f.from.w) { const dx = p.x - f.x; if (Math.sign(f.vx || 0) === Math.sign(dx) && Math.abs(dx) < 120 && Math.abs(f.z - p.z) < 16 && Math.random() < .65) { B.plan = { x: p.x - Math.sign(f.vx) * 6, z: p.z + (p.z > DEPTH / 2 ? -34 : 34) }; return; } }
  // 2. eat if hurt — but leave the food to player 1 if they need it more
  if (hpR < .5 && FOOD.length && hpR <= plR + .05) { const f = FOOD.reduce((a, b) => Math.abs(b.x - p.x) < Math.abs(a.x - p.x) ? b : a); if (Math.abs(f.x - p.x) < 260) { B.plan = { x: f.x, z: f.z }; if (B.talkCD <= 0 && Math.random() < .3) buddySay('food', 1.6); return; } }
  if (plR <= .25 && pl.ko <= 0 && B.lowCD <= 0) { B.lowCD = 25; buddySay('low'); }
  // 3. where it is allowed to roam
  let anchor = null, leash = 1e9;
  if (B.mode === 'follow') { anchor = { x: pl.x - pl.face * 30, z: pl.z + (pl.z < DEPTH / 2 ? 20 : -20) }; leash = 70; }
  else if (B.mode === 'hold' && B.hold) { anchor = B.hold; leash = 85; }
  else if (B.mode === 'free' && role === 'Support') { anchor = { x: pl.x, z: pl.z }; leash = 150; }
  const near = (e, a, r) => Math.hypot(e.x - a.x, (e.z - a.z) * 1.6) < r;
  const spare = e => BIG_FOE[e.type] && pl.ko <= 0 && e.hp / e.max < BIG_FOE[e.type] && !(e.state === 'drink' && e.hp > 8);
  let cand = foes.filter(e => !spare(e) && (!anchor || near(e, anchor, leash + 40)));
  const sp = foes.find(spare); if (sp && B.spared !== sp) { B.spared = sp; buddySay('spare'); }
  // 4. throw something: holding one, or standing next to one with a goon in line and player 1 out of the way
  const inLine = (e, from) => Math.abs(e.z - from.z) < 10 && Math.abs(e.x - from.x) > 40 && Math.abs(e.x - from.x) < 260;
  const plInWay = e => Math.abs(pl.z - p.z) < 16 && (pl.x - p.x) * (e.x - p.x) > 0 && Math.abs(pl.x - p.x) < Math.abs(e.x - p.x);
  if (p.hold) { const e = cand.find(e => inLine(e, p) && !plInWay(e)); if (e) { B.plan = { x: p.x, z: p.z, throwAt: e }; return; }
    const e2 = cand[0]; if (e2) { B.plan = { x: p.x + Math.sign(e2.x - p.x) * 20, z: e2.z, face: e2 }; return; } }
  else if (!cand.some(e => Math.abs(e.x - p.x) < 70 && Math.abs(e.z - p.z) < 18) && Math.random() < .5) {
    const b = BREAK.find(b => !b.broken && !b.held && !b.thrown && b.size !== 'l' && Math.abs(b.x - p.x) < 60 && Math.abs(b.z - p.z) < 20);
    if (b && cand.some(e => Math.abs(e.z - b.z) < 14 && Math.abs(e.x - b.x) < 240)) { B.plan = { x: b.x - Math.sign(b.x - p.x || 1) * (b.w / 2 + 6), z: b.z, pick: b }; return; } }
  // 5. pick a target: whoever is beating on player 1 first, from the side player 1 isn't on
  if (cand.length) {
    const score = e => { let s = Math.hypot(e.x - p.x, (e.z - p.z) * 2); if (targetOf(e) === pl && e.engaged) s -= 70; if (e.state === 'wind' && targetOf(e) === pl) s -= 50; if (B.mode === 'charge') s = Math.abs(e.x - (pl.x + pl.face * 120)) * .6 + s * .4; if (e.type === 'oscar' && e.state === 'drink') s -= 200; return s; };
    const e = cand.reduce((a, b) => score(b) < score(a) ? b : a), R = reachOf(p);
    // stand on the far side from player 1 if there is room on screen (flank), else on its own side
    const lo = camX + 14, hi = camX + VW - 14, spot = sd => Math.max(lo, Math.min(hi, e.x + sd * R * .6));
    let side = Math.sign(p.x - e.x) || 1; const plSide = Math.abs(pl.z - e.z) < 22 && Math.abs(pl.x - e.x) < 70 ? Math.sign(pl.x - e.x) : 0;
    if (plSide === side && Math.abs(spot(-side) - e.x) >= 8) side = -side;
    if (Math.abs(spot(side) - e.x) < 8) side = -side;
    let x = spot(side);
    // going round to the far side: swing wide in depth so as not to walk through player 1 or the goon
    let z = e.z; if (Math.sign(p.x - e.x) !== side && Math.abs(p.x - e.x) > 10) z = e.z + (e.z > DEPTH / 2 ? -26 : 26);
    B.plan = { x, z, target: e };
    const dx = Math.abs(e.x - p.x), dz = Math.abs(e.z - p.z), aggro = { Tank: .3, Bruiser: .3, Speedster: .4, Trickster: .22, Ranged: .15, Support: .12 }[role] + (B.mode === 'charge' ? .25 : 0);
    // read a wind-up aimed at it: back off or charge through it (a charge stops a swing)
    const clear = !plInWay(e);
    if (e.state === 'wind' && targetOf(e) === p && dx < 60 && dz < 16) { const r = Math.random(); if (r < aggro && clear) buddyTap(Math.sign(e.x - p.x), 2); else if (r < aggro + .3) buddyTap(-Math.sign(e.x - p.x), 2, Math.sign(e.x - p.x)); return; }
    // close the gap with a charge now and then
    if (clear && dz < 8 && dx > 70 && dx < 160 && (p.face === Math.sign(e.x - p.x)) && Math.random() < aggro * .6) buddyTap(p.face, 2);
    // special: only with a crowd around and player 1 well clear of the blast
    if (p.meter >= 100 && foes.filter(o => Math.abs(o.x - p.x) < 90 && Math.abs(o.z - p.z) < 30).length >= 2 && Math.hypot(pl.x - p.x, pl.z - p.z) > 170 && Math.random() < .5) B.plan.special = true;
    return;
  }
  // 6. nothing to hit: stay with player 1 (or at the held spot), a step behind
  if (anchor && B.mode === 'hold') { B.plan = { x: anchor.x, z: anchor.z }; return; }
  const gap = Math.abs(pl.x - p.x); if (gap > 50 || Math.abs(pl.z - p.z) > 30) B.plan = { x: pl.x - (pl.face || 1) * 40, z: pl.z + (pl.z < DEPTH / 2 ? 18 : -18) };
}
// double-tap: dir twice; for a dodge the warrior must face the other way first
function buddyTap(dir, n, faceFirst) { const B = BUDDY; if (B.taps.length || players[1].dash > 0 || players[1].dodge > 0) return; if (faceFirst) players[1].face = faceFirst; for (let k = 0; k < n; k++) B.taps.push({ t: .02 + k * .1, dir }); }

function buddyInput(p, human, dt) {
  const B = BUDDY;
  if (human.x || human.z || human.tap || human.j || human.a || human.s) B.hum = 0; else B.hum += dt;
  if (!CPU || B.hum < 3) return human;
  const inp = { tap: 0, x: 0, z: 0, j: false, a: false, s: false, c: false, start: false, noTap: true }, pl = players[0];
  B.atkCD -= dt; B.talkCD -= dt; B.lowCD -= dt;
  if (p.ko > 0 && !B.prevKO) { B.prevKO = true; buddySay('down', 2.6); }
  if (p.ko <= 0 && B.prevKO) { B.prevKO = false; if (Math.random() < .7) buddySay('up'); }
  if (p.ko > 0 || p.fall > 0) return inp;
  for (const t of B.taps) t.t -= dt; const tp = B.taps.find(t => t.t <= 0); if (tp) { inp.tap = tp.dir; B.taps.splice(B.taps.indexOf(tp), 1); }
  B.think -= dt; if (B.think <= 0) { B.think = .17 + Math.random() * .13; buddyThink(p); }   // reacts a beat late, like a person
  const P = B.plan; if (!P) return inp;
  // walk there, never off a ledge
  const dx = P.x - p.x, dz = P.z - p.z;
  inp.x = Math.abs(dx) > 2 ? Math.sign(dx) * Math.min(1, Math.abs(dx) / 8 + .35) : 0; inp.z = Math.abs(dz) > 2 ? Math.sign(dz) * Math.min(1, Math.abs(dz) / 10 + .3) : 0;
  const onGround = p.y <= Math.max(0, ground(p.x, p.z)) + .5;
  if (inp.x && ground(p.x + Math.sign(inp.x) * 16, p.z) < -900) {   // a gap: jump it if there is ground to land on, else stop
    let land = 0; for (let d = 30; d <= 84; d += 6) if (ground(p.x + Math.sign(inp.x) * d, p.z) > -900) { land = d; break; }
    if (land && Math.abs(dx) > 20 && onGround) { inp.j = true; inp.x = Math.sign(inp.x); } else if (onGround) inp.x = 0; } if (inp.z && ground(p.x, p.z + inp.z * 12) < -900) inp.z = 0;
  const moved = Math.abs(p.x - B.lastX) + Math.abs(p.z - B.lastZ); B.lastX = p.x; B.lastZ = p.z;
  if ((inp.x || inp.z) && moved < .05 && p.atk <= 0) { B.stuck += dt; if (B.stuck > .5) { inp.j = true; inp.z = p.z > DEPTH / 2 ? -1 : 1; if (B.stuck > 1.2) B.stuck = 0; } } else B.stuck = 0;
  const e = P.target || P.throwAt || P.face;
  if (P.pick) { if (Math.abs(dx) < 8 && Math.abs(dz) < 6 && B.atkCD <= 0) { inp.x = Math.sign(P.pick.x - p.x) * .2; inp.a = true; B.atkCD = .4; B.think = .25; } return inp; }
  if (P.throwAt) { const f = Math.sign(e.x - p.x); if (p.face !== f) inp.x = f * .3; else if (B.atkCD <= 0) { inp.a = true; B.atkCD = .5; B.think = .1; } return inp; }
  if (!P.target) return inp;
  if (P.special && p.sp <= 0) { inp.s = true; P.special = false; }
  // in reach: face it and swing — hit, hit, finisher (sometimes it stops at two, like anyone)
  const R = reachOf(p), ex = e.x - p.x, ez = e.z - p.z;
  if (Math.abs(ex) < R * .95 + 4 && Math.abs(ez) < 9) {
    const f = Math.sign(ex) || p.face; inp.x = 0; if (Math.abs(dz) < 4) inp.z = 0;
    if (p.face !== f) { inp.x = f * .3; return inp; }
    const plFront = pl.ko <= 0 && Math.abs(pl.z - p.z) < 16 && (pl.x - p.x) * f > -4 && Math.abs(pl.x - p.x) < R + 8;   // friendly fire is on
    if (plFront) { inp.z = p.z > pl.z ? 1 : -1; return inp; }
    if (p.atk <= 0 && B.atkCD <= 0) { inp.a = true; B.chain++; if (B.chain >= B.chainMax) { B.chain = 0; B.chainMax = Math.random() < .25 ? 2 : 3; B.atkCD = .45 + Math.random() * .35; } else B.atkCD = .04 + Math.random() * .09; }
  } else if (p.comboT <= 0) B.chain = 0;
  return inp;
}
