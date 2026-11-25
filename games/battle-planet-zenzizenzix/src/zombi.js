// =====================================================================
// ZOMBIMARE — world 4, in black and white screentones with one toxic green. The marsh's creatures (blobs that split
// once, frog-men with long tongues, leeches, and the giant swamp spider), the cemetery's skeletons (they collapse into a
// pile when beaten and pull themselves back together unless someone THROWS the pile), the circus plot's elephant and
// giraffe skeletons, and PRÊTRE-O-DAME, the tall bald priest of the church: kicks only (his hands are full), his censer
// trails incense and swings like a nunchaku (dizzy), holy water heals him (break the bottle with a throw or a charge),
// and about once a minute he raises his crucifix and the whole screen goes white: everyone is blinded, him excepted.
// =====================================================================
const GRN = '#4ad828', GRN2 = '#2a9a18', OOZE = '#6ae83a', BONE = '#efe8d8', BONED = '#b8b0a0', ROBE = '#1a1a1e';
Object.assign(ETYPES, {
  blob: { hp: 8, spd: 34, reach: 20, dmg: 1, wind: .45, cd: 1.2 }, blobling: { hp: 4, spd: 54, reach: 16, dmg: 1, wind: .35, cd: 1.0 },
  frog: { hp: 10, spd: 46, reach: 22, dmg: 1, wind: .38, cd: 1.1 }, leech: { hp: 5, spd: 52, reach: 16, dmg: 1, wind: .3, cd: 1.0 },
  skel: { hp: 9, spd: 44, reach: 24, dmg: 1, wind: .4, cd: 1.1 }, boner: { hp: 7, spd: 40, reach: 0, dmg: 1, wind: .6, cd: 2.4, ranged: 1 },
  knight: { hp: 22, spd: 28, reach: 32, dmg: 2, wind: .6, cd: 1.6 },
  spider: { hp: 80, spd: 58, reach: 36, dmg: 2, wind: .5, cd: 1.1 }, elephant: { hp: 90, spd: 40, reach: 50, dmg: 2, wind: .6, cd: 1.3 },
  giraffe: { hp: 80, spd: 46, reach: 40, dmg: 2, wind: .6, cd: 1.3 }, pretre: { hp: 130, spd: 46, reach: 38, dmg: 0, wind: .4, cd: 1.0 }
});
const W4T = { blob: 1, blobling: 1, frog: 1, leech: 1, skel: 1, boner: 1, knight: 1, spider: 1, elephant: 1, giraffe: 1, pretre: 1 };
const W4BIG = { spider: 1, elephant: 1, giraffe: 1, pretre: 1 }, W4SKEL = { skel: 1, boner: 1, knight: 1 }, W4DRAWN = { blob: 1, blobling: 1, leech: 1, spider: 1, elephant: 1, giraffe: 1 };
const W4NAME = { spider: ['L’Araignée des marais', 'The Swamp Spider'], elephant: ['L’Éléphant du cirque', 'The Circus Elephant'], giraffe: ['La Girafe du cirque', 'The Circus Giraffe'], pretre: ['Prêtre-o-Dame', 'Prêtre-o-Dame'] };
const bossLabel = B => W4NAME[B.type] ? W4NAME[B.type][LANG === 'fr' ? 0 : 1] : B.type === 'oscar' ? 'Oscar GrosVerres' : B.type === 'calve' ? 'Calve-Hair' : B.type === 'mmf' ? 'Madame Metal Face' : T[LANG].boss;
const W4SAY = {
  pretre: { intro: [['Mes enfants ! Vous êtes en retard pour la messe. Et pour votre enterrement.', 'Asseyez-vous. Le sermon d’aujourd’hui s’intitule : « Aïe ».'], ['My children! You are late for mass. And for your funeral.', 'Sit down. Today’s sermon is called: “Ouch”.']],
    kick: [['Amen !', 'Un coup de pied béni !', 'Alléluia-HOP !'], ['Amen!', 'A blessed kick!', 'Halleluja-HOP!']],
    swing: [['L’encens, ça pique les yeux, hein ?', 'Respirez profondément !', 'Ding-ding-ding !'], ['Incense stings the eyes, eh?', 'Breathe deeply!', 'Ding-ding-ding!']],
    drink: [['Un petit verre d’eau bénite…', 'Ça, c’est de l’eau de source divine.'], ['A little glass of holy water…', 'Now that is divine spring water.']],
    broke: [['MON EAU BÉNITE !', 'Sacrilège ! C’était la dernière bouteille… de ce carton.'], ['MY HOLY WATER!', 'Sacrilege! That was the last bottle… of this box.']],
    cross: [['QUE LA LUMIÈRE SOIT !', 'Fermez les yeux, mes enfants. Trop tard !'], ['LET THERE BE LIGHT!', 'Close your eyes, children. Too late!']],
    hurt: [['Ouille ! Pas dans la soutane !', 'Je vais vous excommunier !', 'Ça mérite dix « Je vous salue » !'], ['Ow! Not the cassock!', 'I shall excommunicate you!', 'That deserves ten Hail Marys!']] },
  pile: [['CLAC-CLAC-CLAC !', 'Je reviens en un morceau !', 'On ne se débarrasse pas de nous comme ça !'], ['CLACK-CLACK-CLACK!', 'Back in one piece!', 'You can’t get rid of us that easily!']]
};
const w4Say = (k, sub) => { const v = sub ? W4SAY[k][sub] : W4SAY[k], l = v[LANG === 'fr' ? 0 : 1]; return l[(Math.random() * l.length) | 0]; };

// ---- looks (the frog-men, the skeletons and the priest ride the warriors' rig) ---------------------------------
function frogLook(seed) {
  let s = seed * 19 + 3; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const skin = r() < .5 ? GRN : '#5ac838', belly = '#d8f0b0', sc = 1.0 + r() * .12;
  const L = { type: 'frog', seed, b: BONES(sc, { head: 1.25, leg: 1.1, arm: .95, wide: 1.15, tall: .9 }), top: skin, arms: skin, legs: skin, legB: GRN2, skin, hand: skin, boots: GRN2, wpn: 'paws', persona: { brave: r(), lazy: r(), jumpy: .8, show: r() }, name: 'Grenouillard', voice: 220 };
  L.foot = (c, f, k, col) => { for (let j = 0; j < 3; j++) limb(c, [[f[0], f[1] - 1], [f[0] + 3 + j * 3, f[1] - (j - 1) * 1.2]], 1.4, col); };
  L.torso = (c, S, tor) => { poly(c, [[lerp(tor[0][0], tor[1][0], .4), tor[0][1] + 3], [tor[1][0] - 1, tor[1][1] + 3], [tor[2][0] - 1, tor[2][1] - 2], [lerp(tor[3][0], tor[2][0], .4), tor[3][1] - 2]], belly); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr, gul = Math.sin(t * 5 + seed) * .08;
    c.fillStyle = OUT; c.beginPath(); c.ellipse(x + R * .3, y + R * .1, R * 1.35 + INKW, R * .85 + INKW, 0, 0, 7); c.fill(); c.fillStyle = skin; c.beginPath(); c.ellipse(x + R * .3, y + R * .1, R * 1.35, R * .85, 0, 0, 7); c.fill();
    c.fillStyle = belly; c.beginPath(); c.ellipse(x + R * .55, y + R * (.6 + gul), R * .8, R * .35, 0, 0, 7); c.fill();   // the throat pouch
    for (const dx of [-.15, .65]) { disc(c, x + R * dx, y - R * .65, R * .42, skin, rim); disc(c, x + R * dx + R * .08, y - R * .68, R * .24, '#f4f0c0'); c.fillStyle = '#0c0a08'; c.fillRect(x + R * dx, y - R * .72, R * .3, R * .12); }   // bulging eyes
    c.strokeStyle = OUT; c.lineWidth = 1; c.beginPath(); c.moveTo(x - R * .4, y + R * .3); c.quadraticCurveTo(x + R * .6, y + R * .55, x + R * 1.55, y + R * .2); c.stroke();
    if (o.shout) { c.fillStyle = '#e86a8a'; c.beginPath(); c.ellipse(x + R * 1.2, y + R * .4, R * .3, R * .14, 0, 0, 7); c.fill(); } };
  L.weapon = null; return L; }
function skelLook(seed, kind) {
  let s = seed * 23 + 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const knight = kind === 'knight', sc = knight ? 1.28 : .95 + r() * .2;
  const L = { type: kind, seed, b: BONES(sc, knight ? { wide: 1.3, tall: 1.05 } : { wide: 1, arm: 1.05, leg: 1.05, head: 1.1 }), top: knight ? '#8a8a92' : BONE, arms: BONE, legs: BONE, legB: BONED, skin: BONE, hand: BONE, boots: knight ? '#5a5a62' : BONE, wpn: kind === 'boner' ? 'bone' : knight ? 'mace' : 'sword', persona: { brave: .9, lazy: r(), jumpy: .2, show: r() }, name: 'Squelette', voice: kind === 'knight' ? 90 : 260, thin: !knight };
  // thin bones: no flesh. A narrow spine instead of a body, a ribcage drawn round it, a pelvis, knobbly joints
  const ribW = L.b.sw; L.b.aw = (knight ? 1.9 : 1.05) * sc; L.b.lw = (knight ? 2.3 : 1.25) * sc; if (!knight) { L.b.sw = 1.1 * sc; L.b.hw = 1.6 * sc; }
  L.foot = (c, f, k, col) => { limb(c, [[f[0] - 1, f[1] - .8], [f[0] + 5, f[1] - .8]], 1.1, col); for (let j = 0; j < 3; j++) limb(c, [[f[0] + 4, f[1] - .8], [f[0] + 6.5, f[1] - .6 + (j - 1) * .7]], .5, col); };
  const knob = (c, p, r) => { c.fillStyle = OUT; c.beginPath(); c.arc(p[0], p[1], r + INKW * .7, 0, 7); c.fill(); c.fillStyle = BONE; c.beginPath(); c.arc(p[0], p[1], r, 0, 7); c.fill(); };
  L.torso = (c, S, tor) => { if (knight) { poly(c, [[S.chest[0] - ribW, S.chest[1] - 1], [S.chest[0] + ribW, S.chest[1] - 1], [S.hip[0] + ribW * .8, S.hip[1] - 2], [S.hip[0] - ribW * .8, S.hip[1] - 2]], '#8a8a92'); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(S.chest[0] - 3, S.chest[1] + 2, 2, 8); c.fillStyle = '#5a5a62'; c.fillRect(S.hip[0] - ribW * .8, S.hip[1] - 4, ribW * 1.6, 3); return; }
    const cx = S.chest[0], cy = S.chest[1], hy = S.hip[1], len = hy - cy;
    for (let k = 0; k < 5; k++) { const yy = cy + 1.5 + k * len * .11, w = ribW * (1 - k * .1);   // the ribs: thin curved bones from the spine
      for (const pass of [[OUT, 1.6], [BONE, .7]]) { c.strokeStyle = pass[0]; c.lineWidth = pass[1]; c.beginPath(); c.moveTo(cx - w, yy + 2.2); c.quadraticCurveTo(cx - w * .9, yy - 1.2, cx, yy); c.quadraticCurveTo(cx + w * .9, yy - 1.2, cx + w, yy + 2.2); c.stroke(); } }
    for (const pass of [[OUT, 2.2], [BONE, 1.1]]) { c.strokeStyle = pass[0]; c.lineWidth = pass[1]; c.beginPath(); c.moveTo(cx, cy - 2); c.lineTo(S.hip[0], hy - 2); c.stroke(); }   // the spine
    for (let k = 0; k < 4; k++) knob(c, [lerp(cx, S.hip[0], .62 + k * .1), lerp(cy, hy, .62 + k * .1) - 2], .7);   // lower vertebrae
    for (const sd of [-1, 1]) for (const pass of [[OUT, 1.9], [BONE, .9]]) { c.strokeStyle = pass[0]; c.lineWidth = pass[1]; c.beginPath(); c.moveTo(S.hip[0], hy - 1.5); c.quadraticCurveTo(S.hip[0] + sd * ribW * .75, hy - 4.5, S.hip[0] + sd * ribW * .55, hy + .5); c.stroke(); }   // the hip bones: two thin wings
    knob(c, [S.hip[0], hy - .5], .9);
    for (const pass of [[OUT, 1.8], [BONE, .8]]) { c.strokeStyle = pass[0]; c.lineWidth = pass[1]; c.beginPath(); c.moveTo(cx - ribW * .9, cy - 1); c.lineTo(cx + ribW * .9, cy - 1); c.stroke(); } };   // collarbones
  L.front = (c, S) => { for (const p of [S.kF, S.kB, S.aF[1], S.aB[1]]) knob(c, p, knight ? 1.1 : .85); };   // elbows and knees
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr;
    if (knight) { poly(c, [[x - R * 1.05, y + R * .9], [x - R * 1.1, y - R * .7], [x, y - R * 1.25], [x + R * 1.1, y - R * .7], [x + R * 1.05, y + R * .9]], '#8a8a92', rim); c.fillStyle = '#0c0a0c'; c.fillRect(x - R * .2, y - R * .2, R * 1.2, R * .22); c.fillStyle = GRN; c.fillRect(x + R * .45, y - R * .18, 2, 2);   // the helmet slit, a green glint
      poly(c, [[x - R * .2, y - R * 1.2], [x + R * .2, y - R * 1.9], [x + R * .5, y - R * 1.15]], '#c83a2a'); return; }
    c.fillStyle = OUT; c.beginPath(); c.ellipse(x + R * .1, y - R * .1, R + INKW, R * .95 + INKW, 0, 0, 7); c.fill(); c.fillStyle = BONE; c.beginPath(); c.ellipse(x + R * .1, y - R * .1, R, R * .95, 0, 0, 7); c.fill();
    c.fillStyle = BONE; c.fillRect(x + R * .1, y + R * .4, R * .9, R * .5); c.strokeStyle = OUT; c.lineWidth = .8; c.strokeRect(x + R * .1, y + R * .4, R * .9, R * .5); for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x + R * (.1 + k * .22), y + R * .4); c.lineTo(x + R * (.1 + k * .22), y + R * .9); c.stroke(); }   // the jaw, teeth
    c.fillStyle = '#0c0a08'; c.beginPath(); c.ellipse(x + R * .55, y - R * .15, R * .28, R * .32, 0, 0, 7); c.fill(); c.fillStyle = GRN; c.fillRect(x + R * .5, y - R * .2, 1.6, 1.6);   // the eye socket and its green light
    c.fillStyle = '#0c0a08'; c.beginPath(); c.moveTo(x + R * .95, y + R * .1); c.lineTo(x + R * 1.08, y + R * .3); c.lineTo(x + R * .85, y + R * .3); c.fill(); };
  L.weapon = (c, S, p, t, o) => { const [hx, hy] = S.aF[2], a = S.handAng, dx = Math.sin(a), dy = Math.cos(a);
    if (kind === 'sword') { limb(c, [[hx - dx * 2, hy - dy * 2], [hx + dx * 3, hy + dy * 3]], 1.6, '#5a3a20'); limb(c, [[hx + dx * 3 + dy * 3, hy + dy * 3 - dx * 3], [hx + dx * 3 - dy * 3, hy + dy * 3 + dx * 3]], 1.2, '#8a8a92'); limb(c, [[hx + dx * 3, hy + dy * 3], [hx + dx * 20, hy + dy * 20]], 1.8, '#a8a49a'); }
    else if (kind === 'boner') { limb(c, [[hx - dx * 5, hy - dy * 5], [hx + dx * 7, hy + dy * 7]], 1.8, BONE); disc(c, hx + dx * 8, hy + dy * 8, 2, BONE); disc(c, hx - dx * 6, hy - dy * 6, 2, BONE); }
    else { limb(c, [[hx - dx * 3, hy - dy * 3], [hx + dx * 12, hy + dy * 12]], 2, '#5a3a20'); disc(c, hx + dx * 15, hy + dy * 15, 5, '#6a6a72'); for (let k = 0; k < 6; k++) { const aa = k * 1.05; limb(c, [[hx + dx * 15 + Math.cos(aa) * 5, hy + dy * 15 + Math.sin(aa) * 5], [hx + dx * 15 + Math.cos(aa) * 8, hy + dy * 15 + Math.sin(aa) * 8]], 1, '#6a6a72'); }
      const [bx, by] = S.aB[2]; poly(c, [[bx - 2, by - 12], [bx + 9, by - 12], [bx + 9, by + 4], [bx + 3.5, by + 10], [bx - 2, by + 4]], '#7a7a82'); c.fillStyle = GRN; c.fillRect(bx + 2, by - 5, 3, 3); } };
  L.handF = true; return L; }
function pretreLook() {
  const L = { b: BONES(1.42, { wide: .9, leg: 1.4, arm: 1.2, tall: 1.2, head: .95 }), top: ROBE, arms: ROBE, legs: ROBE, legB: '#121216', skin: '#e8d0b8', hand: '#e8d0b8', boots: '#0c0a0c', seed: 41, name: 'Prêtre-o-Dame', wpn: 'censer', voice: 120 };
  L.foot = (c, f, k, col) => { poly(c, [[f[0] - 3, f[1]], [f[0] + 8, f[1]], [f[0] + 6, f[1] - 3], [f[0] - 3, f[1] - 3]], col); };
  L.torso = (c, S, tor) => { const hx = S.hip[0], hy = S.hip[1], w = L.b.hw;
    poly(c, [[hx - w - 1, hy - 2], [hx + w + 1, hy - 2], [hx + w + 7, hy + 30], [hx - w - 7, hy + 30]], ROBE);   // the cassock's skirt
    c.fillStyle = '#3a3a42'; for (let k = 0; k < 7; k++) c.fillRect(S.chest[0] + 1, S.chest[1] + 3 + k * 4.2, 1.2, 1.2);   // the long row of buttons
    c.fillStyle = '#f4f0e8'; c.fillRect(S.chest[0] - 1, S.chest[1] - 1, 5, 2.2);   // the white collar
    c.strokeStyle = '#8a7a5a'; c.lineWidth = .8; c.beginPath(); c.moveTo(tor[0][0] + 1, tor[0][1] + 1); c.lineTo(hx, hy + 6); c.lineTo(tor[1][0] - 1, tor[1][1] + 1); c.stroke(); };   // the rosary
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr;
    c.fillStyle = OUT; c.beginPath(); c.ellipse(x + R * .1, y, R * .95 + INKW, R * 1.1 + INKW, 0, 0, 7); c.fill(); c.fillStyle = L.skin; c.beginPath(); c.ellipse(x + R * .1, y, R * .95, R * 1.1, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(x - R * .15, y - R * .7, R * .35, R * .16, -.3, 0, 7); c.fill();   // the shine on his bald head
    poly(c, [[x + R * .85, y - R * .1], [x + R * 1.3, y + R * .35], [x + R * .85, y + R * .45]], L.skin);
    c.fillStyle = '#5a5a5a'; c.fillRect(x + R * .2, y - R * .42, R * .7, R * .16);   // the bushy brow
    if (o.blindEyes) { c.fillStyle = '#ffffff'; c.fillRect(x + R * .45, y - R * .25, 3, 1.8); } else if (Math.sin(t * 1.3) < .985) { c.fillStyle = '#140c08'; c.fillRect(x + R * .55, y - R * .25, 1.6, 1.4); }
    c.fillStyle = '#5a5a5a'; c.fillRect(x - R * .95, y - R * .1, R * .25, R * .5);   // the last tuft over the ear
    c.fillStyle = '#2a140c'; if (o.shout) c.fillRect(x + R * .5, y + R * .58, R * .5, R * .3); else c.fillRect(x + R * .5, y + R * .62, R * .45, R * .1); };
  L.weapon = (c, S, p, t, o) => { const [hx, hy] = S.aF[2];
    // the censer on its chain: dangles and sways, or whirls round like a nunchaku
    const spin = o.spin || 0, a = spin ? t * 16 : Math.sin(t * 2.2) * .25 + (o.vx || 0) * .002, len = spin ? 22 : 14, cx = hx + Math.sin(a) * len, cy = hy + Math.cos(a) * len;
    c.strokeStyle = '#c8b070'; c.lineWidth = .8; c.beginPath(); c.moveTo(hx, hy); c.lineTo(cx, cy); c.stroke();
    poly(c, [[cx - 3.5, cy], [cx + 3.5, cy], [cx + 2.5, cy + 5], [cx - 2.5, cy + 5]], '#c8a040'); poly(c, [[cx - 2.5, cy], [cx, cy - 3], [cx + 2.5, cy]], '#e8c860');
    if (spin) { c.strokeStyle = 'rgba(220,220,220,.5)'; c.lineWidth = 1; c.beginPath(); c.arc(hx, hy, len, a - 1.2, a); c.stroke(); }
    // the other hand: the crucifix when he brandishes it, the holy-water bottle when he drinks
    const [bx, by] = S.aB[2];
    if (o.cross) { const gl = o.cross; c.fillStyle = `rgba(255,255,230,${.35 * gl})`; c.beginPath(); c.arc(bx, by - 6, 14 + gl * 10, 0, 7); c.fill(); poly(c, [[bx - 1.5, by + 4], [bx + 1.5, by + 4], [bx + 1.5, by - 14], [bx - 1.5, by - 14]], '#e8c860'); poly(c, [[bx - 6, by - 9], [bx + 6, by - 9], [bx + 6, by - 6], [bx - 6, by - 6]], '#e8c860'); }
    else if (o.bottle) { poly(c, [[bx - 2.5, by - 2], [bx + 2.5, by - 2], [bx + 2.5, by - 12], [bx + 1, by - 14], [bx + 1, by - 17], [bx - 1, by - 17], [bx - 1, by - 14], [bx - 2.5, by - 12]], '#9ac8e8'); c.fillStyle = '#f4f0e8'; c.fillRect(bx - 2.5, by - 9, 5, 3); c.fillStyle = '#c8202a'; c.fillRect(bx - .4, by - 8.8, .8, 2.6); c.fillRect(bx - 1.3, by - 8, 2.6, .8); } };
  L.handF = true; L.handB = true; return L; }
const PRETRE = pretreLook();

// ---- spawning ---------------------------------------------------------------------------------------------------
function w4Spawn(e, from) {
  if (!W4T[e.type]) return;
  if (e.type === 'frog') e.look = frogLook(SEEDN++);
  if (W4SKEL[e.type]) e.look = skelLook(SEEDN++, e.type === 'skel' ? 'sword' : e.type);
  if (W4DRAWN[e.type]) e.look = { type: e.type, seed: SEEDN++, wpn: 'paws', persona: { brave: 1, lazy: 0, jumpy: 0, show: 0 }, name: e.type, voice: 140, b: BONES(1, {}) };
  if (e.type === 'leech') { e.z = Math.max(4, Math.min(DEPTH - 4, e.z)); }
  if (W4BIG[e.type] && e.type !== 'pretre') { WORLD.boss = e; e.inv = 1.5; e.cd = 1.5; e.actCD = 2; banner(W4NAME[e.type][LANG === 'fr' ? 0 : 1], -1, true, '#9aff6a'); SND.boom(.5); musicPlay(LEVELS[LEVEL].id, true); }
  if (e.type === 'spider') { e.x = camX + VW * .65; e.z = DEPTH * .5; e.y = 230; e.vy = -20; e.state = 'drop'; }
  if (e.type === 'elephant' || e.type === 'giraffe') { e.x = camX + VW + 60; e.z = DEPTH * .45; e.state = 'walk'; }
  if (e.type === 'pretre') { e.look = PRETRE; e.x = scr.barX || camX + VW * .8; e.z = 40; e.y = 0; e.state = 'intro'; e.inv = 99; e.ot = 0; e.healCD = 14; e.flashCD = 18; e.swingCD = 6; WORLD.boss = e; WORLD.oscar = e; WORLD.pretre = e;
    musicPlay(LEVELS[LEVEL].id, true); if (typeof STORY4 !== 'undefined' && STORY4) playLines(STORY4.pretre, false); }
}

// ---- hits ---------------------------------------------------------------------------------------------------------
// called by hitEnemy after the damage is taken. true = handled (skip the generic reaction and death)
function w4Hit(e, dmg, dir, src, kb) {
  if (!W4T[e.type]) return false;
  if (e.type === 'pretre') {
    e.vx = dir * 25 * kb; if (src && src.meter !== undefined) src.meter = Math.min(100, src.meter + 5);
    if (e.state === 'drink' && (HITKIND === 'throw' || HITKIND === 'boom' || (src && src.dash > 0))) { e.state = 'hurt'; e.stun = 1.2; e.healCD = 18; quip(e, w4Say('pretre', 'broke'));
      for (let k = 0; k < 10; k++) fx.push({ k: 'debris', x: e.x, z: e.z, y: 60, vx: (Math.random() - .5) * 180, vy: 60 + Math.random() * 120, rot: 0, vr: 9, t: 1, col: k % 2 ? '#9ac8e8' : '#ffffff', w: 2 }); SFX.smash('bottles', .5, e.x); }
    if (e.hp <= 0) { pretreDown(e); return true; }
    SFX.impact(hitKind(src), Math.min(1, dmg / 3 + .2), e.x); if (Math.random() < .15) quip(e, w4Say('pretre', 'hurt')); return true; }
  if (W4BIG[e.type]) {   // the minibosses don't flinch from ordinary hits
    e.vx = dir * 20 * kb; if (src && src.meter !== undefined) src.meter = Math.min(100, src.meter + 5);
    if (e.hp <= 0) { boneBurst(e, e.type === 'spider' ? OOZE : BONE, 30); if (WORLD.boss === e) WORLD.boss = null; return false; }
    SFX.impact(hitKind(src), Math.min(1, dmg / 3 + .2), e.x); return true; }
  if (W4SKEL[e.type] && e.hp <= 0) { skelCollapse(e); return true; }
  if ((e.type === 'blob') && e.hp <= 0) {   // a blob splits, once
    SND.splash(.6); for (const s of [-1, 1]) { spawn('blobling', 'R', 0); const c = enemies[enemies.length - 1]; c.x = e.x + s * 14; c.z = Math.max(4, Math.min(DEPTH - 4, e.z + s * 8)); c.vy = 160; c.y = 2; c.onScr = true; c.vx = s * 120; }
    boneBurst(e, OOZE, 8); }
  return false;
}
function boneBurst(e, col, n) { for (let k = 0; k < n; k++) fx.push({ k: 'debris', x: e.x + (Math.random() - .5) * 40, z: e.z, y: 20 + Math.random() * 60, vx: (Math.random() - .5) * 260, vy: 80 + Math.random() * 220, rot: Math.random() * 6, vr: (Math.random() - .5) * 20, t: 1.6, col: k % 3 ? col : shadeC(col, -.3), w: 3 + Math.random() * 6 }); }
// a beaten skeleton falls into a pile of bones: 3 s still, 2 s rattling, then it stands up again, unless the pile is THROWN
Object.assign(BK, { bones: { size: 's', hp: 999, w: 22, d: 14, h: 10, col: BONE, food: .001 } });
Object.assign(BK_SC, { bones: 1.4 });
function skelCollapse(e) {
  e.state = 'pile'; e.inv = 99; e.hp = 1; e.pileT = 0; e.vx = 0; e.stun = 0; SFX.smash('crate', .5, e.x); boneBurst(e, BONE, 6);
  const K = BK.bones, b = { k: 'bones', x: e.x, z: e.z, ...K, hp: K.hp, max: K.hp, y: 0, vx: 0, vy: 0, held: null, thrown: false, rot: 0, flash: 0, id: Math.random(), foe: e, knight: e.type === 'knight' };
  if (!WORLD.pileHint) { WORLD.pileHint = 1; banner(LANG === 'fr' ? 'Ramassez le tas d’os et LANCEZ-le, sinon il se relève !' : 'Pick up the bone pile and THROW it, or it gets back up!', -1, false, '#e8e8e0'); }
  BREAK.push(b); e.pile = b; INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'CLAC !' : 'CLACK!', x: (e.x - camX) * 1.5, y: sy(e.z, 20) * 1.5, size: 22, t: 0, rot: -.1 });
}
function w4Smash(b) {   // from smash(): a thrown pile shatters for good
  if (b.k !== 'bones' || !b.foe) return; const e = b.foe; b.foe = null; if (e.dead) return;
  e.x = b.x; e.z = b.z; e.state = 'walk'; e.inv = 0; e.hp = 0; e.shattered = true; boneBurst(e, BONE, 14); onEnemyDown(e); e.dead = 1.2; e.vy = 0; e.y = 0;
  INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'CRAC-BADABOUM !' : 'KRAK-CLATTER!', x: (b.x - camX) * 1.5, y: sy(b.z, 20) * 1.5 - 20, size: 26, t: 0, rot: .1 });
}
function w4OnHit(e, q) { if (e.type === 'leech' && Math.random() < .5) addStatus(q, 'bleed'); if ((e.type === 'blob' || e.type === 'blobling') && Math.random() < .15) addStatus(q, 'poison'); }
function w4Shot(e) { const p = targetOf(e); if (!p) return; const dx = p.x - e.x, T = Math.max(.4, Math.min(1, Math.abs(dx) / 240));
  fx.push({ k: 'bonep', x: e.x + e.face * 10, z: e.z, y: 46, vx: dx / T, vz: (p.z - e.z) / T, vy: GRAV * T * .5 - 46 / T, rot: 0, t: T + .6, from: e }); SFX.swish('light', .5, e.x); }

// ---- AI -------------------------------------------------------------------------------------------------------------
// the ordinary goons' extra moves, before the generic fight logic (true = this frame is taken)
function w4Pre(e, dt, p) {
  if (e.type === 'frog') { e.tongueCD = (e.tongueCD ?? 2 + Math.random() * 2) - dt; const dx = p.x - e.x;
    if (e.tongueCD <= 0 && Math.abs(dx) > 50 && Math.abs(dx) < 150 && Math.abs(p.z - e.z) < 14) { e.tongueCD = 4 + Math.random() * 2; e.face = Math.sign(dx); fx.push({ k: 'tongue', x: e.x, z: e.z, y: 0, e, len: 0, max: Math.abs(dx) + 10, dir: e.face, t: .7, T: .7, hit: false }); e.react = { k: 'bang', t: .7 }; SFX.goon(e, 'attack'); return true; } }
  if (e.type === 'leech' && e.state === 'walk') e.walk += dt * 6;
  return false;
}
const near4 = (e, rx, rz, ahead) => players.filter(q => q.ko <= 0 && q.fall <= 0 && Math.abs(q.z - e.z) < rz && Math.abs(q.x - e.x) < rx && (!ahead || (q.x - e.x) * e.face > -10));
function goToward(e, tx, tz, spd, dt) { const dx = tx - e.x, dz = tz - e.z; if (Math.abs(dx) > 4) { const nx = e.x + Math.sign(dx) * spd * dt; if (!blocked(nx, e.z, e.y)) e.x = nx; e.mv = 1; e.walk += dt * 8; } if (Math.abs(dz) > 3) e.z = Math.max(0, Math.min(DEPTH, e.z + Math.sign(dz) * spd * .6 * dt)); }
// full AI for the minibosses, the priest and the piles (true = handled)
function w4Update(e, dt) {
  if (!W4T[e.type]) return false;
  if (e.pile && !e.pile.broken && e.state !== 'pile') { e.state = 'pile'; e.inv = 99; e.stun = 0; }   // a pull or a stun (Magneto's magnet…) must not wake a pile early
  if (e.type === 'pretre' && e.state !== 'intro' && e.state !== 'kneel' && e.inv > 50) e.inv = 0;   // interrupted during his entrance: he must not stay invulnerable
  if (e.state === 'pile') { const b = e.pile; e.mv = 0; e.vx = 0; if (!b || b.broken) return true; e.x = b.x; e.z = b.z;
    if (!b.held && !b.thrown) e.pileT += dt; if (e.pileT > 3 && !b.held) b.wob = .14;
    if (e.pileT > 5 && !b.held && !b.thrown) { b.broken = true; b.foe = null; e.pile = null; e.state = 'rise'; e.riseT = .8; e.hp = Math.ceil(e.max * .6); e.inv = .9; quip(e, w4Say('pile')); SFX.smash('crate', .3, e.x); }
    return true; }
  if (e.state === 'rise') { e.riseT -= dt; e.mv = 0; if (e.riseT <= 0) { e.state = 'walk'; e.cd = .8; } return true; }
  if (e.type === 'spider') return spiderAI(e, dt);
  if (e.type === 'elephant') return elephantAI(e, dt);
  if (e.type === 'giraffe') return giraffeAI(e, dt);
  if (e.type === 'pretre') return pretreAI(e, dt);
  return false;
}
function spiderAI(e, dt) { const p = targetOf(e); if (!p) return true; e.cd -= dt; e.actCD -= dt; e.face = Math.sign(p.x - e.x) || e.face; const dx = p.x - e.x, ad = Math.abs(dx);
  if (e.state === 'leap') { e.x += e.hop * dt; if (e.y <= 0 && e.vy <= 0) { e.state = 'walk'; e.hop = 0; fx.push({ k: 'ring', x: e.x, z: e.z, max: 80, t: .45, col: '#9aff6a' }); WORLD.shake = 8; SND.boom(.4);
      for (const q of near4(e, 70, 30)) if (hitPlayer(q, 1, Math.sign(q.x - e.x) || 1, e)) { q.vy = 180; q.vx = Math.sign(q.x - e.x) * 200; } } return true; }
  if (e.state === 'wind') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'walk'; e.cd = 1 + Math.random() * .6;
      if (e.act === 'bite') { SFX.swish('heavy', .8, e.x); for (const q of near4(e, 46, 18, true)) hitPlayer(q, 2, e.face, e); }
      if (e.act === 'web') { fx.push({ k: 'web', x: e.x + e.face * 20, z: e.z, y: 20, vx: e.face * 280, vz: (p.z - e.z) * 1.2, t: 1.6, from: e }); SFX.swish('light', .6, e.x); }
      if (e.act === 'leap') { e.state = 'leap'; e.vy = 330; e.y = 1; e.hop = Math.max(-260, Math.min(260, dx / .9)); } } return true; }
  if (e.cd <= 0) { if (ad < 50 && Math.abs(p.z - e.z) < 18) { e.state = 'wind'; e.act = 'bite'; e.t2 = .45; return true; }
    if (e.actCD <= 0 && ad > 110) { e.state = 'wind'; e.act = Math.random() < .5 ? 'web' : 'leap'; e.t2 = e.act === 'web' ? .5 : .6; e.actCD = 3.5; return true; } }
  goToward(e, p.x - Math.sign(dx || 1) * 36, p.z, ETYPES.spider.spd, dt); return true; }
function elephantAI(e, dt) { const p = targetOf(e); if (!p) return true; e.cd -= dt; e.actCD -= dt; const dx = p.x - e.x, ad = Math.abs(dx);
  if (e.state === 'charge') { const nx = e.x + e.face * 360 * dt; e.x = nx; e.walk += dt * 18; e.mv = 1; WORLD.shake = Math.max(WORLD.shake, 2);
    for (const q of near4(e, 60, 22)) if (!e.hitSet.has(q)) { e.hitSet.add(q); if (hitPlayer(q, 2, e.face, e)) { q.vy = 260; q.vx = e.face * 320; } }
    for (const o of enemies) if (o !== e && !o.dead && !W4BIG[o.type] && o.state !== 'pile' && !e.hitSet.has(o) && Math.abs(o.x - e.x) < 60 && Math.abs(o.z - e.z) < 22) { e.hitSet.add(o); hitEnemy(o, 3, e.face, null, 2); }
    if ((e.face > 0 && e.x > camX + VW - 50) || (e.face < 0 && e.x < camX + 50)) { e.state = 'walk'; e.cd = 1.4; WORLD.shake = 10; SND.boom(.6); e.vx = -e.face * 60; } return true; }
  if (e.state === 'wind') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'walk'; e.cd = 1.2;
      if (e.act === 'swipe') { SFX.swish('heavy', 1, e.x); for (const q of near4(e, 80, 26, true)) if (hitPlayer(q, 2, e.face, e)) { q.vx = e.face * 260; q.vy = 150; } }
      if (e.act === 'stomp') { fx.push({ k: 'ring', x: e.x + e.face * 30, z: e.z, max: 90, t: .5, col: BONE }); WORLD.shake = 12; SND.boom(.8); for (const q of near4(e, 90, 34)) if (q.y < 6 && hitPlayer(q, 1, Math.sign(q.x - e.x) || 1, e)) { q.vy = 200; } }
      if (e.act === 'charge') { e.state = 'charge'; e.hitSet = new Set(); SND.boom(.3); INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'BARRIIIT !' : 'TOOOOT!', x: (e.x - camX) * 1.5, y: sy(e.z, 120) * 1.5, size: 30, t: 0, rot: -.1 }); } } return true; }
  if (e.cd <= 0) { e.face = Math.sign(dx) || e.face;
    if (e.actCD <= 0 && ad > 140) { e.state = 'wind'; e.act = 'charge'; e.t2 = 1.25; e.actCD = 7; e.z += (p.z - e.z) * .5; return true; }
    if (ad < 90 && Math.abs(p.z - e.z) < 26) { e.state = 'wind'; e.act = Math.random() < .35 ? 'stomp' : 'swipe'; e.t2 = e.act === 'stomp' ? .8 : .55; return true; } }
  e.face = Math.sign(dx) || e.face; goToward(e, p.x - Math.sign(dx || 1) * 60, p.z, ETYPES.elephant.spd, dt); return true; }
function giraffeAI(e, dt) { const p = targetOf(e); if (!p) return true; e.cd -= dt; const dx = p.x - e.x, ad = Math.abs(dx); e.neck = e.neck ?? 0;
  if (e.state === 'wind') { e.t2 -= dt; const s = 1 - e.t2 / (e.act === 'slam' ? 1.0 : .45);
    if (e.act === 'slam') e.neck = s < .7 ? -.25 * s / .7 : -.25 + (s - .7) / .3 * 2.65;
    if (e.t2 <= 0) { e.state = 'recover'; e.t2 = .7; e.cd = 1.4;
      if (e.act === 'slam') { const hx = e.x + e.face * 98, hz = e.markZ; fx.push({ k: 'ring', x: hx, z: hz, max: 60, t: .4, col: BONE }); WORLD.shake = 9; SND.boom(.5);
        for (const q of players) if (q.ko <= 0 && q.fall <= 0 && Math.abs(q.x - hx) < 30 && Math.abs(q.z - hz) < 16 && hitPlayer(q, 2, e.face, e)) { q.vy = 170; addStatus(q, 'dizzy'); } }
      if (e.act === 'kick') { SFX.swish('heavy', 1, e.x); for (const q of players) if (q.ko <= 0 && Math.abs(q.z - e.z) < 18 && (q.x - e.x) * e.face < 0 && Math.abs(q.x - e.x) < 64 && hitPlayer(q, 2, -e.face, e)) { q.vx = -e.face * 300; q.vy = 200; } } }
    return true; }
  if (e.state === 'recover') { e.t2 -= dt; e.neck += (0 - e.neck) * Math.min(1, dt * 3); if (e.t2 <= 0) e.state = 'walk'; return true; }
  e.neck += (Math.sin(time * 1.3) * .1 - e.neck) * Math.min(1, dt * 2);
  const behind = players.find(q => q.ko <= 0 && Math.abs(q.z - e.z) < 18 && (q.x - e.x) * e.face < 0 && Math.abs(q.x - e.x) < 60);
  if (e.cd <= 0 && behind) { e.state = 'wind'; e.act = 'kick'; e.t2 = .45; return true; }
  if (e.cd <= 0 && ad > 80 && ad < 120 && Math.abs(p.z - e.z) < 30) { e.face = Math.sign(dx); e.state = 'wind'; e.act = 'slam'; e.t2 = 1.0; e.markZ = p.z; fx.push({ k: 'mark', x: e.x + e.face * 98, z: p.z, t: 1.0, T: 1.0 }); return true; }
  e.face = Math.sign(dx) || e.face; goToward(e, p.x - Math.sign(dx || 1) * 100, p.z, ETYPES.giraffe.spd, dt); return true; }
function pretreAI(e, dt) { e.y = 0; e.vy = 0;
  if (e.state === 'kneel') return true;
  if (Math.random() < dt * 6) fx.push({ k: 'incense', x: e.x - e.face * 8 + (Math.random() - .5) * 6, z: e.z, y: 40 + Math.random() * 6, t: 2.2, T: 2.2, vx: -e.face * 6 + (Math.random() - .5) * 6 });   // the incense trail
  if (e.state === 'intro') { e.ot += dt; if (e.ot > 3) { e.state = 'walk'; e.inv = 0; quip(e, w4Say('pretre', 'intro')); } return true; }
  if (e.state === 'hurt') { e.stun -= dt; if (e.stun <= 0) { e.state = 'walk'; e.cd = .6; } return true; }
  const p = targetOf(e); if (!p) return true; e.cd -= dt; e.healCD -= dt; e.flashCD -= dt; e.swingCD -= dt; const dx = p.x - e.x, ad = Math.abs(dx);
  if (e.state === 'drink') { e.t2 -= dt; if (e.t2 <= 0) { e.hp = Math.min(e.max, e.hp + e.max * .15); fx.push({ k: 'plus', x: e.x, z: e.z, t: 1 }); pop(e.x, e.z, 130, '+15 %', '#9aff6a'); SFX.heal(e.x); e.state = 'walk'; e.healCD = 20; e.cd = .8; } return true; }
  if (e.state === 'cross') { e.t2 -= dt; if (e.t2 <= 0) { WORLD.blind = 5; WORLD.blindT = 5; e.state = 'walk'; e.cd = .3; e.flashCD = 50 + Math.random() * 15; SFX.status('dizzy', e.x); try { const t = SND.now(); for (const [f, v] of [[523, .1], [659, .08], [784, .07], [1046, .04]]) tone(t, f, f, 2, v, 'sine', undefined, .25); } catch (er) {} } return true; }
  if (e.state === 'swing') { e.t2 -= dt; if (e.t2 < .9) for (const q of near4(e, 64, 26)) if (!e.hitSet.has(q)) { e.hitSet.add(q); if (hitPlayer(q, 1, Math.sign(q.x - e.x) || 1, e)) { addStatus(q, 'dizzy'); q.vx = Math.sign(q.x - e.x) * 200; } }
    if (Math.random() < dt * 30) fx.push({ k: 'incense', x: e.x + Math.cos(time * 16) * 22, z: e.z, y: 46 + Math.sin(time * 16) * 6, t: 1.2, T: 1.2, vx: 0 });
    if (e.t2 <= 0) { e.state = 'walk'; e.cd = 1.2; e.swingCD = 10 + Math.random() * 4; } return true; }
  if (e.state === 'wind') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'strike'; e.t2 = .2; SFX.swish('heavy', .9, e.x);
      for (const q of near4(e, 46, 16, true)) if (hitPlayer(q, e.act === 'high' ? 2 : 1, e.face, e)) { q.vx = e.face * (e.act === 'high' ? 280 : 180); if (e.act === 'high') q.vy = 200; } if (Math.random() < .3) quip(e, w4Say('pretre', 'kick')); } return true; }
  if (e.state === 'strike') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'walk'; e.cd = 1.0 + Math.random() * .5; } return true; }
  // decide
  if (e.flashCD <= 0 && ad < 360) { e.state = 'cross'; e.t2 = 1.3; quip(e, w4Say('pretre', 'cross')); return true; }
  if (e.healCD <= 0 && e.hp < e.max * .7) { e.state = 'drink'; e.t2 = 1.6; quip(e, w4Say('pretre', 'drink')); return true; }
  if (e.swingCD <= 0 && near4(e, 70, 26).length) { e.state = 'swing'; e.t2 = 1.3; e.hitSet = new Set(); quip(e, w4Say('pretre', 'swing')); return true; }
  if (e.cd <= 0 && ad < 50 && Math.abs(p.z - e.z) < 16) { e.face = Math.sign(dx) || e.face; e.state = 'wind'; e.act = Math.random() < .3 ? 'high' : 'low'; e.t2 = e.act === 'high' ? .55 : .4; return true; }
  e.face = Math.sign(dx) || e.face; goToward(e, p.x - Math.sign(dx || 1) * 28, p.z, ETYPES.pretre.spd, dt); return true; }
function pretreDown(e) { e.state = 'kneel'; e.inv = 99; e.hp = 1; WORLD.oscarDownT = time; WORLD.blind = 0; for (const o of enemies) if (o !== e && !o.dead) o.flee = 99; fx = fx.filter(f => !['bonep', 'web', 'tongue'].includes(f.k)); for (const p of players) p.st = [];
  banner(LANG === 'fr' ? 'PRÊTRE-O-DAME À GENOUX' : 'PRÊTRE-O-DAME KNEELS', -1, true, '#9aff6a'); inkAccent(e.x, e.z, 60); }
function w4Pose(e) { if (e.type !== 'pretre') return null; const t = time;
  if (e.state === 'kneel') return POSES.kneel(t);
  if (e.state === 'intro') return e.ot < 1.6 ? POSES.salute(t) : POSES.chat(t);
  if (e.state === 'hurt') return POSES.hurt(.5, 1);
  if (e.state === 'drink') return PZ({ ry: .5, sp: -.25, nk: -.35, aF: [.6, .4], aB: [2.6, 2.2], lF: [.2, -.1], lB: [-.2, -.08] });
  if (e.state === 'cross') { const s = 1 - Math.max(0, e.t2) / 1.3; return PZ({ ry: 1, sp: -.15 * s, nk: -.1, aF: [.5, .3], aB: [1.4 + s * .4, .2], lF: [.35, -.2], lB: [-.3, -.1] }); }
  if (e.state === 'swing') return PZ({ ry: 2, sp: .1, nk: 0, aF: [1.6, .05], aB: [.4, .6], lF: [.5, -.4], lB: [-.4, -.3], rot: Math.sin(t * 20) * .03 });
  if (e.state === 'wind') { const s = 1 - Math.max(0, e.t2) / (e.act === 'high' ? .5 : .35); return PZ({ ry: 1, sp: -.3 * s, nk: .1, aF: [.9, .5], aB: [-.4, .6], lF: [.5 + s * (e.act === 'high' ? 1.4 : .9), -2 * s], lB: [-.15, -.05] }); }
  if (e.state === 'strike') return POSES.kick(e.act === 'high' ? .3 : .25);
  return null; }
function w4O(e, o) { if (e.type !== 'pretre') return; o.spin = e.state === 'swing' ? 1 : 0; o.cross = e.state === 'cross' ? 1 - Math.max(0, e.t2) / 1.3 : 0; o.bottle = e.state === 'drink'; o.vx = e.vx; o.shout = QUIPS.some(q => q.obj === e); }

// ---- the creatures drawn by hand ---------------------------------------------------------------------------------
function w4Draw(e) {
  if (e.state === 'pile') return true; if (e.shattered) return true; if (!W4DRAWN[e.type]) return false;
  const x = e.x - camX, y = sy(e.z, e.y), t = time, fl = e.flash > 0; if (x < -160 || x > VW + 160) return true;
  if (e.dead && e.dead < .5) g.globalAlpha = e.dead / .5;
  if (e.type === 'blob' || e.type === 'blobling') { const r = e.type === 'blob' ? 15 : 9, w = Math.sin(t * 6 + e.x * .1) * .12, sq = e.state === 'wind' ? 1 + Math.min(1, (ETYPES[e.type].wind - e.t2) * 3) * .35 : 1, dd = e.dead ? .45 : 1;
    shadow(e.x, e.z, e.y, r);
    g.fillStyle = OUT; g.beginPath(); g.ellipse(x, y - r * .8 * dd, r * (1 + w) * sq + 1.5, r * .85 * (1 - w) / sq * dd + 1.5, 0, 0, 7); g.fill();
    g.fillStyle = fl ? '#ffffff' : OOZE; g.beginPath(); g.ellipse(x, y - r * .8 * dd, r * (1 + w) * sq, r * .85 * (1 - w) / sq * dd, 0, 0, 7); g.fill();
    g.fillStyle = GRN2; g.beginPath(); g.ellipse(x + 2, y - r * .3 * dd, r * .8, r * .25 * dd, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(x - r * .4, y - r * 1.2 * dd, r * .25, r * .12, -.4, 0, 7); g.fill();
    if (!e.dead) for (const s of [-.3, .3]) { disc(g, x + e.face * r * .25 + s * r, y - r * 1.05, r * .2, '#f4f0d0'); g.fillStyle = '#0c0a08'; g.fillRect(x + e.face * r * .3 + s * r - 1, y - r * 1.07, 2, 2); }
    if (Math.sin(t * 3 + e.x) > .7) { g.fillStyle = OOZE; g.fillRect(x + r * .6, y - r * .3, 1.6, 3 + Math.sin(t * 9) * 2); }
    g.globalAlpha = 1; return true; }
  if (e.type === 'leech') { shadow(e.x, e.z, e.y, 9); const ph = e.walk || 0; for (let k = 4; k >= 0; k--) { const sx = x - e.face * k * 5, syy = y - 3 - Math.abs(Math.sin(ph - k * .7)) * 3; disc(g, sx, syy, 3.4 - k * .25, fl ? '#ffffff' : k % 2 ? '#2a3a22' : '#3a5a2a'); }
    g.fillStyle = '#c8202a'; g.fillRect(x + e.face * 3 - 1, y - 5, 2, 2); g.globalAlpha = 1; return true; }
  if (e.type === 'spider') { drawSpider(e, x, y, fl); g.globalAlpha = 1; return true; }
  if (e.type === 'elephant') { drawElephant(e, x, y, fl); g.globalAlpha = 1; return true; }
  if (e.type === 'giraffe') { drawGiraffe(e, x, y, fl); g.globalAlpha = 1; return true; }
  g.globalAlpha = 1; return false;
}
function drawSpider(e, x, y, fl) { const t = time, f = e.face, wk = (e.walk || 0) * .9, body = fl ? '#ffffff' : '#2a2a30', lift = e.state === 'wind' ? Math.min(1, (.5 - e.t2) * 3) : 0;
  if (e.state === 'drop') { g.strokeStyle = 'rgba(240,240,240,.8)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y - 30); g.stroke(); }
  shadow(e.x, e.z, e.y, 34);
  for (let side = 0; side < 2; side++) for (let k = 0; k < 4; k++) { const sd = side ? -1 : 1, bx = x + (k - 1.5) * 9, ph = Math.sin(wk + k * 1.4 + side * Math.PI) * (e.mv ? 6 : 1), kx = bx + sd * (14 + k * 2) + ph * .5, ky = y - 34 - (side ? 4 : 0), fx0 = bx + sd * (26 + k * 4) + ph, fy = y - (side ? 3 : 0);
    limb(g, [[bx, y - 22], [kx, ky], [fx0, fy]], side ? 2.2 : 2.6, side ? '#1a1a20' : body); }
  g.fillStyle = OUT; g.beginPath(); g.ellipse(x - f * 14, y - 24 - lift * 4, 20, 15, 0, 0, 7); g.fill(); g.fillStyle = body; g.beginPath(); g.ellipse(x - f * 14, y - 24 - lift * 4, 18.5, 13.5, 0, 0, 7); g.fill();   // the abdomen
  g.fillStyle = GRN; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(x - f * (8 + k * 6), y - 30 + k * 2, 2.6, 1.6, 0, 0, 7); g.fill(); }   // oozing green marks
  disc(g, x + f * 6, y - 22 - lift * 6, 9, body);   // the head
  for (let k = 0; k < 4; k++) { g.fillStyle = k < 2 ? GRN : '#c8202a'; g.fillRect(x + f * (8 + (k % 2) * 4) - 1, y - 26 - lift * 6 - (k >> 1) * 3, 2.2, 2.2); }
  for (const s of [-1, 1]) limb(g, [[x + f * 12, y - 18 - lift * 6], [x + f * (16 + lift * 4), y - 12 + s * 2]], 1.6, '#e8e0c0');   // fangs
  if (Math.sin(t * 2 + e.x) > .6) { g.fillStyle = OOZE; g.fillRect(x + f * 14, y - 12, 1.4, 4); } }
function bone(gg, pts, w) { limb(gg, pts, w, BONE); }
function drawElephant(e, x, y, fl) { const f = e.face, wk = (e.walk || 0) * .5, mv = e.mv || e.state === 'charge' ? 1 : 0, st = e.state === 'wind' ? e.act : e.state;
  const rear = st === 'stomp' ? Math.sin(Math.min(1, (.8 - e.t2) / .8) * Math.PI) * .35 : 0, head = st === 'charge' ? .3 : st === 'swipe' ? -.4 + Math.min(1, (.55 - e.t2) / .55) * 1.2 : 0;
  shadow(e.x, e.z, e.y, 56); g.save(); g.translate(x, y); g.scale(f, 1); if (rear) { g.translate(-40, 0); g.rotate(-rear); g.translate(40, 0); }
  const C = fl ? '#ffffff' : BONE; const L4 = [[-40, 0], [-26, Math.PI], [24, Math.PI], [38, 0]];
  for (const [lx, ph] of L4) { const sw = Math.sin(ph + wk) * 7 * mv; limb(g, [[lx, -62], [lx + sw * .4, -32], [lx + sw, -2]], 5.5, C); disc(g, lx + sw * .4, -32, 3.6, C); }
  limb(g, [[-52, -60], [-20, -74], [18, -76], [44, -66]], 3.4, C);   // the spine
  for (let k = 0; k < 7; k++) { const rx = -32 + k * 10, h = 22 - Math.abs(k - 3) * 2; g.strokeStyle = OUT; g.lineWidth = 4.2; g.beginPath(); g.moveTo(rx, -73); g.quadraticCurveTo(rx - 6, -73 + h * .7, rx - 1, -73 + h * 1.4); g.stroke(); g.strokeStyle = C; g.lineWidth = 2.2; g.stroke(); }   // ribs
  limb(g, [[-50, -60], [-64, -46], [-62, -30]], 1.6, C);   // the tail
  g.save(); g.translate(48, -66); g.rotate(head);
  g.fillStyle = OUT; g.beginPath(); g.ellipse(10, -4, 17, 15, 0, 0, 7); g.fill(); g.fillStyle = C; g.beginPath(); g.ellipse(10, -4, 15.5, 13.5, 0, 0, 7); g.fill();   // the skull
  g.fillStyle = '#0c0a08'; g.beginPath(); g.ellipse(14, -8, 4, 4.5, 0, 0, 7); g.fill(); g.fillStyle = GRN; g.fillRect(13, -9, 2.4, 2.4);
  limb(g, [[16, 8], [28, 16], [34, 10]], 2.6, '#f8f4e8');   // the tusk
  const tr = Math.sin(time * 2) * .3 + (st === 'charge' ? -1.2 : 0); let px = 20, py = 6; for (let k = 0; k < 7; k++) { const a = .2 + k * .18 + tr * (k / 7); px += Math.cos(a) * 5; py += Math.sin(a) * 5; disc(g, px, py, 3 - k * .25, C); }   // the trunk, vertebra by vertebra
  g.restore(); g.restore();
  if (st === 'charge' || (e.state === 'wind' && e.act === 'charge')) { g.fillStyle = 'rgba(240,240,240,.5)'; for (let k = 0; k < 4; k++) g.fillRect(x - f * (70 + k * 14), y - 20 - k * 12, 20, 1.5); } }
function drawGiraffe(e, x, y, fl) { const f = e.face, wk = (e.walk || 0) * .55, mv = e.mv ? 1 : 0, C = fl ? '#ffffff' : BONE, kick = e.state === 'wind' && e.act === 'kick' ? Math.min(1, (.45 - e.t2) / .3) : 0;
  shadow(e.x, e.z, e.y, 40); g.save(); g.translate(x, y); g.scale(f, 1);
  for (const [lx, ph, back] of [[-22, 0, 1], [-12, Math.PI, 1], [14, Math.PI, 0], [24, 0, 0]]) { const sw = Math.sin(ph + wk) * 8 * mv, kk = back ? kick : 0;
    limb(g, [[lx, -80], [lx + sw * .4 - kk * 12, -42 - kk * 6], [lx + sw - kk * 34, -2 - kk * 26]], 3.2, C); disc(g, lx + sw * .4 - kk * 12, -42 - kk * 6, 2.6, C); }
  limb(g, [[-28, -82], [0, -88], [28, -86]], 3, C); for (let k = 0; k < 5; k++) { const rx = -18 + k * 8; g.strokeStyle = OUT; g.lineWidth = 3.6; g.beginPath(); g.moveTo(rx, -87); g.quadraticCurveTo(rx - 4, -76, rx, -68); g.stroke(); g.strokeStyle = C; g.lineWidth = 1.8; g.stroke(); }
  limb(g, [[-28, -82], [-38, -70]], 1.4, C);
  const a = (e.neck || 0) - .15, base = [28, -88]; let px = base[0], py = base[1];   // the neck: nine vertebrae up to the little skull
  for (let k = 0; k < 9; k++) { const aa = a + k * (e.neck > .6 ? .03 : -.005); px += Math.sin(aa) * 10; py -= Math.cos(aa) * 10; disc(g, px, py, 3.2 - k * .12, C); }
  g.save(); g.translate(px, py); g.rotate(a + .9);
  g.fillStyle = OUT; g.beginPath(); g.ellipse(6, 0, 11, 6, 0, 0, 7); g.fill(); g.fillStyle = C; g.beginPath(); g.ellipse(6, 0, 9.5, 4.8, 0, 0, 7); g.fill();
  limb(g, [[0, -4], [-2, -11]], 1.4, C); limb(g, [[3, -4], [3, -11]], 1.4, C); disc(g, -2, -12, 1.8, C); disc(g, 3, -12, 1.8, C);   // the ossicones
  g.fillStyle = '#0c0a08'; g.fillRect(4, -3, 3, 3); g.fillStyle = GRN; g.fillRect(4.5, -2.5, 1.6, 1.6); g.restore(); g.restore(); }

// ---- effects ------------------------------------------------------------------------------------------------------
function w4Fx(f, dt) {
  if (f.k === 'incense') { f.y += 14 * dt; f.x += (f.vx || 0) * dt; return true; }
  if (f.k === 'mark') return true;
  if (f.k === 'tongue') { const e = f.e; if (!e || e.dead || e.state === 'pile') { f.t = 0; return true; } const u = 1 - f.t / f.T; f.len = (u < .4 ? u / .4 : 1 - (u - .4) / .6) * f.max; f.x = e.x; f.z = e.z;
    if (!f.hit && u < .45) for (const q of players) if (q.ko <= 0 && q.fall <= 0 && Math.abs(q.z - e.z) < 12 && (q.x - e.x) * f.dir > 0 && Math.abs(q.x - e.x) < f.len + 6) { f.hit = true; if (hitPlayer(q, 1, -f.dir, e)) { q.pull = { x: e.x + f.dir * 26, z: e.z, t: .35 }; pop(q.x, q.z, q.y + 70, LANG === 'fr' ? 'SCHLURP !' : 'SHLURP!', '#9aff6a'); } break; }
    return true; }
  if (f.k === 'web') { f.x += f.vx * dt; f.z = Math.max(0, Math.min(DEPTH, f.z + f.vz * dt));
    for (const q of players) if (q.ko <= 0 && q.dodge <= 0 && Math.abs(q.x - f.x) < 14 && Math.abs(q.z - f.z) < 12 && q.y < 40) { f.t = 0; q.frozen = Math.max(q.frozen || 0, 1.2); hitPlayer(q, 0, Math.sign(f.vx), f.from); pop(q.x, q.z, q.y + 70, LANG === 'fr' ? 'ENGLUÉ !' : 'WEBBED!', '#e8e8e8'); break; }
    return true; }
  if (f.k === 'bonep') { f.x += f.vx * dt; f.z = Math.max(0, Math.min(DEPTH, f.z + f.vz * dt)); f.vy -= GRAV * dt; f.y += f.vy * dt; f.rot += dt * 14;
    for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 12 && Math.abs(q.z - f.z) < 12 && f.y < q.y + 60 && f.y > q.y) { f.t = 0; hitPlayer(q, 1, Math.sign(f.vx), f.from); break; }
    if (f.y <= 0) { f.t = 0; boneBurst({ x: f.x, z: f.z }, BONE, 3); } return true; }
  return false;
}
function drawW4Fx(f) { const x = f.x - camX, y = sy(f.z, f.y || 0);
  if (f.k === 'incense') { const u = 1 - f.t / f.T, a = Math.sin(u * Math.PI) * .45; g.fillStyle = `rgba(225,225,225,${a})`; g.beginPath(); g.arc(x + Math.sin(u * 7 + f.x) * 3, y, 2 + u * 6, 0, 7); g.fill(); return true; }
  if (f.k === 'mark') { const u = 1 - f.t / f.T; g.strokeStyle = `rgba(200,30,30,${.4 + u * .5})`; g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, sy(f.z, 0), 26 * (1.4 - u * .4), 9 * (1.4 - u * .4), 0, 0, 7); g.stroke(); g.fillStyle = `rgba(200,30,30,${u * .25})`; g.fill(); return true; }
  if (f.k === 'tongue') { const e = f.e; if (!e) return true; const mx = e.x - camX + f.dir * 8, my = sy(e.z, 52); g.strokeStyle = OUT; g.lineWidth = 4; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + f.dir * f.len, my + 4); g.stroke(); g.strokeStyle = '#e86a8a'; g.lineWidth = 2.4; g.stroke(); disc(g, mx + f.dir * f.len, my + 4, 3, '#e86a8a'); return true; }
  if (f.k === 'web') { g.strokeStyle = 'rgba(245,245,245,.9)'; g.lineWidth = 1; for (let k = 0; k < 6; k++) { const a = k * 1.05; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 6); g.stroke(); } g.beginPath(); g.ellipse(x, y, 6, 4, 0, 0, 7); g.stroke(); return true; }
  if (f.k === 'bonep') { g.save(); g.translate(x, y); g.rotate(f.rot); limb(g, [[-6, 0], [6, 0]], 1.8, BONE); disc(g, -7, 0, 2.2, BONE); disc(g, 7, 0, 2.2, BONE); g.restore(); return true; }
  return false;
}

// ---- world 4 breakables -------------------------------------------------------------------------------------------
Object.assign(BK, {
  stump: { size: 'l', hp: 8, w: 30, d: 22, h: 18, col: '#5a4a3a', solid: 1 }, jar: { size: 's', hp: 1, w: 10, d: 10, h: 14, col: '#a8c8a0', food: .3 },
  lantern: { size: 's', hp: 1, w: 9, d: 9, h: 15, col: '#3a3a3a' }, tomb: { size: 'l', hp: 10, w: 26, d: 14, h: 30, col: '#9a9a9a', solid: 1 },
  urn: { size: 's', hp: 2, w: 12, d: 12, h: 16, col: '#7a7a7a', food: .25 }, coffin: { size: 'm', hp: 5, w: 30, d: 14, h: 12, col: '#4a3a2a', food: .5 },
  pew: { size: 'l', hp: 10, w: 70, d: 16, h: 18, col: '#5a3a24', solid: 1 }, candle: { size: 's', hp: 1, w: 10, d: 10, h: 26, col: '#c8a040' },
  alms: { size: 'm', hp: 4, w: 16, d: 14, h: 22, col: '#6a4a2a', food: .9 }, holy: { size: 's', hp: 1, w: 9, d: 9, h: 16, col: '#9ac8e8', food: .001, surprise: 1 }
});
Object.assign(BK_SC, { stump: 1.5, jar: 1.5, lantern: 1.5, tomb: 1.5, urn: 1.4, coffin: 1.6, pew: 1.3, candle: 1.4, alms: 1.4, holy: 1.6 });
Object.assign(BK3_DRAW, {
  bones: (g, W, H, c, dk, lt, b) => { const k = b && b.knight; for (const [x0, y0, x1, y1] of [[-10, -1, 8, -3], [-7, -4, 9, 0], [-9, -2, 4, -7], [2, -1, 10, -5]]) { limb(g, [[x0, y0], [x1, y1]], 1.6, BONE); disc(g, x0, y0, 1.6, BONE); disc(g, x1, y1, 1.6, BONE); }
    if (k) poly(g, [[-4, -2], [5, -2], [5, -9], [0, -11], [-4, -9]], '#8a8a92'); else { disc(g, 0, -6, 4, BONE); g.fillStyle = '#0c0a08'; g.fillRect(.5, -7, 1.6, 1.6); g.fillStyle = GRN; g.fillRect(.8, -6.8, .8, .8); } },
  stump: (g, W, H, c, dk, lt) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2 - 2, -H], [-W / 2 + 2, -H]], c); g.fillStyle = '#8a7a5a'; g.beginPath(); g.ellipse(0, -H, W / 2 - 2, 3, 0, 0, 7); g.fill(); g.strokeStyle = dk; g.lineWidth = .6; g.beginPath(); g.ellipse(0, -H, W / 4, 1.4, 0, 0, 7); g.stroke(); g.fillStyle = GRN; g.fillRect(-W / 2 + 2, -H * .4, 4, 2); g.fillRect(W / 4, -H * .7, 3, 2); },
  jar: (g, W, H, c) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .8], [-W / 2, -H * .8]], 'rgba(200,230,200,.7)'); g.fillStyle = OOZE; g.fillRect(-W / 2 + 1, -H * .5, W - 2, H * .5 - 1); disc(g, 0, -H * .35, 2, '#f4f0d0'); g.fillStyle = '#0c0a08'; g.fillRect(-.5, -H * .38, 1.2, 1.2); g.fillStyle = '#3a3a3a'; g.fillRect(-W / 2 - 1, -H, W + 2, H * .2); },
  lantern: (g, W, H, c) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .7], [-W / 2, -H * .7]], c); g.fillStyle = `rgba(160,255,110,${.7 + Math.sin(time * 9) * .2})`; g.fillRect(-W / 2 + 1.5, -H * .65, W - 3, H * .55); poly(g, [[-W / 2 - 1, -H * .7], [W / 2 + 1, -H * .7], [0, -H]], c); },
  tomb: (g, W, H, c, dk) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .7], [W / 3, -H * .92], [0, -H], [-W / 3, -H * .92], [-W / 2, -H * .7]], c); g.fillStyle = dk; g.fillRect(-1, -H * .8, 2, H * .3); g.fillRect(-4, -H * .72, 8, 2); g.fillStyle = '#3a3a3a'; g.font = 'bold 3px sans-serif'; g.textAlign = 'center'; g.fillText('R.I.P.', 0, -H * .3); g.fillStyle = GRN; g.fillRect(-W / 2, -3, W * .4, 3); },
  urn: (g, W, H, c, dk, lt) => { poly(g, [[-W / 3, 0], [W / 3, 0], [W / 2, -H * .6], [W / 4, -H * .9], [-W / 4, -H * .9], [-W / 2, -H * .6]], c); g.fillStyle = lt; g.fillRect(-W / 2 + 2, -H * .55, 1.5, H * .3); poly(g, [[-W / 4, -H * .9], [W / 4, -H * .9], [W / 5, -H], [-W / 5, -H]], dk); },
  coffin: (g, W, H, c, dk) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2 + 2, -H * .6], [W / 2 - 4, -H], [-W / 2 + 4, -H], [-W / 2 - 2, -H * .6]], c); g.fillStyle = '#c8a040'; g.fillRect(-1, -H * .9, 2, H * .7); g.fillRect(-4, -H * .7, 8, 1.6); },
  pew: (g, W, H, c, dk, lt) => { poly(g, [[-W / 2, -H * .5], [W / 2, -H * .5], [W / 2, -H * .62], [-W / 2, -H * .62]], lt); poly(g, [[-W / 2, -H * .62], [W / 2, -H * .62], [W / 2, -H * 1.3], [-W / 2, -H * 1.3]], c); g.fillStyle = dk; g.fillRect(-W / 2, -H * .5, 3, H * .5); g.fillRect(W / 2 - 3, -H * .5, 3, H * .5); g.fillRect(-W / 2, -H * 1.3, W, 1.5); },
  candle: (g, W, H, c) => { limb(g, [[0, 0], [0, -H * .7]], 1.4, c); poly(g, [[-W / 2, -H * .7], [W / 2, -H * .7], [W / 3, -H * .66], [-W / 3, -H * .66]], c); g.fillStyle = '#f4f0e8'; g.fillRect(-1.5, -H * .95, 3, H * .25); g.fillStyle = `rgba(255,240,170,${.8 + Math.sin(time * 14) * .2})`; g.beginPath(); g.ellipse(0, -H - 1, 1.4, 2.6, 0, 0, 7); g.fill(); poly(g, [[-W / 3, 0], [W / 3, 0], [0, -3]], c); },
  alms: (g, W, H, c, dk) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.fillStyle = '#1a1a1a'; g.fillRect(-W / 4, -H + 3, W / 2, 1.5); g.fillStyle = '#efe6d2'; g.font = 'bold 2.6px sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'TRONC' : 'ALMS', 0, -H * .5); g.fillStyle = '#c8a040'; g.fillRect(-1.5, -H * .3, 3, 3); },
  holy: (g, W, H) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H * .65], [W * .2, -H * .8], [W * .2, -H], [-W * .2, -H], [-W * .2, -H * .8], [-W / 2, -H * .65]], '#9ac8e8'); g.fillStyle = '#f4f0e8'; g.fillRect(-W / 2 + 1, -H * .5, W - 2, H * .25); g.fillStyle = '#c8202a'; g.fillRect(-.4, -H * .48, .8, H * .2); g.fillRect(-1.5, -H * .42, 3, .8); g.fillStyle = `rgba(255,255,255,${.5 + Math.sin(time * 5) * .3})`; g.fillRect(-W / 2 + 1, -H * .62, 1.2, H * .5); }
});
// holy water: a splash that heals everyone it lands on (warriors 2 hearts; enemies too, so aim)
const _sbW4 = surpriseBreak;
surpriseBreak = function (b) { if (b.k === 'holy') { SFX.smash('bottles', .4, b.x); SFX.heal(b.x); for (let k = 0; k < 10; k++) fx.push({ k: 'debris', x: b.x, z: b.z, y: 8, vx: (Math.random() - .5) * 160, vy: 60 + Math.random() * 120, rot: 0, vr: 9, t: .8, col: k % 2 ? '#9ac8e8' : '#ffffff', w: 2 });
    for (const q of players) if (q.ko <= 0 && Math.abs(q.x - b.x) < 50 && Math.abs(q.z - b.z) < 24) { q.hp = Math.min(hpMax(q.w), q.hp + 2); fx.push({ k: 'plus', x: q.x, z: q.z, t: 1 }); }
    INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'SPLACH-AMEN !' : 'SPLASH-AMEN!', x: (b.x - camX) * 1.5, y: sy(b.z, 20) * 1.5 - 20, size: 22, t: 0, rot: .1 }); return; }
  return _sbW4(b); };

// ---- the screen: swamp holes, poison patches, dangling hazards, the blinding light -----------------------------
function w4Reset(scr) { WORLD.blind = 0; for (const D of scr.dangles || []) { D.done = false; D.cd = 0; D.grab = 0; D.fallT = 0; } }
function w4Tick(dt) {
  if (WORLD.blind > 0) WORLD.blind = Math.max(0, WORLD.blind - dt);
  if (!scr || (!scr.patches && !scr.dangles)) return;
  for (const P of scr.patches || []) { P.ph = (P.ph || 0) + dt;
    for (const q of players) if (q.ko <= 0 && q.fall <= 0 && q.y < 3 && ((q.x - P.x) / P.rx) ** 2 + ((q.z - P.z) / P.rz) ** 2 < 1 && !hasSt(q, 'poison')) { addStatus(q, 'poison'); pop(q.x, q.z, q.y + 60, LANG === 'fr' ? 'BEURK !' : 'YUCK!', '#9aff6a'); } }
  for (const D of scr.dangles || []) { D.cd = Math.max(0, (D.cd || 0) - dt); D.sw = (D.sw || Math.random() * 6) + dt;
    if (D.kind === 'vine') { if (D.cd <= 0) for (const q of players) if (q.ko <= 0 && q.fall <= 0 && Math.abs(q.x - D.x) < 14 && Math.abs(q.z - D.z) < 16 && q.y < 30) { D.cd = 6; D.grab = 1; q.frozen = Math.max(q.frozen || 0, 1.0); hitPlayer(q, 1, 0, null); pop(q.x, q.z, q.y + 70, LANG === 'fr' ? 'GLURP !' : 'GLORP!', '#9aff6a'); break; }
      D.grab = Math.max(0, (D.grab || 0) - dt); }
    if (D.kind === 'cocoon' && !D.done) for (const q of players) if (q.ko <= 0 && Math.abs(q.x - D.x) < 60) { D.done = true; D.fallT = 0; spawn(D.spawn || 'leech', 'drop', 0); const e = enemies[enemies.length - 1]; e.x = D.x; e.z = D.z; e.y = 120; e.vy = 0; e.onScr = true; SND.splash(.4); break; } }
}
function drawW4Back() {   // under everyone: the poison patches
  for (const P of scr.patches || []) { const x = P.x - camX, y = sy(P.z, 0); if (x < -60 || x > VW + 60) continue;
    g.fillStyle = OUT; g.beginPath(); g.ellipse(x, y, P.rx + 1, P.rz + 1, 0, 0, 7); g.fill(); g.fillStyle = GRN2; g.beginPath(); g.ellipse(x, y, P.rx, P.rz, 0, 0, 7); g.fill(); g.fillStyle = OOZE; g.beginPath(); g.ellipse(x - 2, y - 1, P.rx * .8, P.rz * .7, 0, 0, 7); g.fill();
    for (let k = 0; k < 3; k++) { const u = ((P.ph || 0) * .7 + k / 3) % 1, bx = x + Math.sin(k * 2.3 + P.x) * P.rx * .5, by = y + Math.cos(k * 1.7) * P.rz * .4; g.strokeStyle = `rgba(230,255,200,${1 - u})`; g.lineWidth = .8; g.beginPath(); g.arc(bx, by - u * 4, 1 + u * 3, 0, 7); g.stroke(); } }
}
function w4Items(items) {   // the dangling vines and cocoons, sorted with everyone
  for (const D of scr.dangles || []) { if (D.kind === 'cocoon' && D.done && (D.fallT = (D.fallT || 0) + FRAME_DT) > 1) continue; items.push({ key: D.z, draw: () => { const x = D.x - camX + Math.sin(D.sw) * 3, top = 0, len = D.kind === 'vine' ? 150 - (D.grab ? 20 : 0) : 120, y = sy(D.z, 0) - (D.kind === 'vine' ? 40 : 90);
    if (x < -40 || x > VW + 40) return;
    g.strokeStyle = OUT; g.lineWidth = 3; g.beginPath(); g.moveTo(x, top); g.quadraticCurveTo(x + 6, (top + y) / 2, x, y); g.stroke(); g.strokeStyle = D.kind === 'vine' ? GRN2 : '#e8e8e0'; g.lineWidth = D.kind === 'vine' ? 2 : 1; g.stroke();
    if (D.kind === 'vine') { for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? GRN : GRN2; g.beginPath(); g.ellipse(x + (k % 2 ? 3 : -3), top + (y - top) * (.3 + k * .14), 3, 1.6, k % 2 ? .5 : -.5, 0, 7); g.fill(); } g.fillStyle = OOZE; g.fillRect(x - 1, y, 2, 4 + Math.sin(time * 3 + D.x) * 2); }
    else if (!D.done) { g.fillStyle = OUT; g.beginPath(); g.ellipse(x, y + 10, 8, 13, 0, 0, 7); g.fill(); g.fillStyle = '#d8d8cc'; g.beginPath(); g.ellipse(x, y + 10, 6.5, 11.5, 0, 0, 7); g.fill(); g.strokeStyle = '#a8a89a'; g.lineWidth = .6; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 6, y + 2 + k * 5); g.lineTo(x + 6, y + 5 + k * 5); g.stroke(); } if (Math.sin(time * 4 + D.x) > .5) { g.fillStyle = GRN; g.fillRect(x - 1, y + 8, 2, 2); } } } }); }
}
// everyone blinded: the whole screen goes white, only pale ghosts of the fighters show through
// 5 s: a flash in a tenth of a second, 2.4 s of near-total white, then a slow 2.6 s dimming back. Only the faintest blurred contours
// of the fighters show through the white; the scene itself comes back late in the dimming.
function drawBlind() { if (!(WORLD.blind > 0)) return; const T0 = WORLD.blindT || 5, el = T0 - WORLD.blind, rem = WORLD.blind;
  const k = Math.min(Math.min(1, el / .1), rem > 2.6 ? 1 : Math.pow(rem / 2.6, .6));
  out.setTransform(1, 0, 0, 1, 0, 0); out.fillStyle = `rgba(255,255,252,${.993 * k})`; out.fillRect(0, 0, RW, RH);
  const ga = .045 * k; if (ga > .003) { out.save(); out.globalAlpha = ga; try { out.filter = 'grayscale(1) contrast(.5) brightness(1.15) blur(3px)'; } catch (e) {} out.drawImage(fgH, 0, 0, RW, RH); out.restore(); try { out.filter = 'none'; } catch (e) {} } }
