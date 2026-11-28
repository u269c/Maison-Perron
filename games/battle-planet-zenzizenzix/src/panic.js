// =====================================================================
// ÉPROUVETTE — world 5, Dr PaNIC's Mutant & Weapons Research Facility, printed as an 1870 engraving. Down and down:
// the roof (mutant birds, man-birds, gaps to fall through), the giant ants, the snakes that puff up (the three-headed
// snake), the samurai mice (cheese stuns them), the vampires (dark; they bite, bleed you, heal, turn into bats), the
// chemical explosives level (scientists throw everything), then the secret lab and DR PaNIC (Pa + Ni + C): nickels
// thrown (often), the carbon cane after an absurdly flourished dance (dizzy), and every 90 s the PROTACTINIUM: the
// lights go out for 15 s, pitch black, and only radioactive things glow — his jacket, the salves he throws, whoever
// they hit (poisoned, and glowing: visible), the puddles where they miss (5 s, they light a little circle; walking
// through one makes your shoes glow, no poison).
// The world 5 creatures plug into the world 4 hooks (zombi.js): their types join W4T / W4BIG / W4NAME, and each hook is
// wrapped here to try world 5 first.
// =====================================================================
const RAD = '#9aff3a', LABC = '#e8e4d8';
Object.assign(ETYPES, {
  bird: { hp: 5, spd: 70, reach: 0, dmg: 1, wind: .3, cd: 1.6 }, manbird: { hp: 11, spd: 50, reach: 24, dmg: 1, wind: .38, cd: 1.1 },
  ant: { hp: 7, spd: 64, reach: 20, dmg: 1, wind: .3, cd: 1.0 }, snake: { hp: 8, spd: 40, reach: 22, dmg: 1, wind: .35, cd: 1.3 },
  hydra: { hp: 80, spd: 26, reach: 70, dmg: 2, wind: .5, cd: 1.0 }, mouse: { hp: 7, spd: 62, reach: 26, dmg: 1, wind: .28, cd: 1.0 },
  vampire: { hp: 12, spd: 44, reach: 22, dmg: 1, wind: .42, cd: 1.6 }, scientist: { hp: 4, spd: 54, reach: 0, dmg: 0, wind: .5, cd: 2.2, ranged: 1 },
  panic: { hp: 150, spd: 44, reach: 40, dmg: 0, wind: .4, cd: 1.0 }
});
const W5T = { bird: 1, manbird: 1, ant: 1, snake: 1, hydra: 1, mouse: 1, vampire: 1, scientist: 1, panic: 1 }, W5DRAWN = { bird: 1, ant: 1, snake: 1, hydra: 1 };
Object.assign(W4T, W5T); Object.assign(W4BIG, { hydra: 1, panic: 1 });
Object.assign(W4NAME, { hydra: ['Le Serpent à trois têtes', 'The Three-Headed Snake'], panic: ['Dr PaNIC', 'Dr PaNIC'] });
const W5SAY = {
  panic: { intro: [['Encore vous ?! Vous avez survécu à mes BÉBÉS ?! Bon. Cours magistral : la DOULEUR.', 'Asseyez-vous, interrogation surprise !'], ['You again?! You survived my BABIES?! Fine. Today’s lecture: PAIN.', 'Sit down, pop quiz!']],
    coin: [['De la monnaie ? Gardez-la !', 'Nickel ! Symbole Ni !', 'Cinq sous, cinq bosses !'], ['Need change? Keep it!', 'Nickel! Symbol Ni!', 'Five cents, five bruises!']],
    cane: [['Et un, et deux, et… cha-cha-CHA !', 'Admirez la technique !', 'Carbone pur, mon cher !'], ['And one, and two, and… cha-cha-CHA!', 'Admire the technique!', 'Pure carbon, my dear!']],
    dark: [['PROTACTINIUM ! Éteignez les lumières !', 'Numéro atomique 91 ! Ça brille, hein ?'], ['PROTACTINIUM! Lights out!', 'Atomic number 91! Glows nicely, eh?']],
    hurt: [['Aïe ! Ma blouse !', 'Ceci n’était pas dans le protocole !', 'Je note ça dans mon cahier de labo !'], ['Ow! My lab coat!', 'This was not in the protocol!', 'I’m writing this in my lab notebook!']] },
  mouse: [['Hai !', 'Fromage ou la vie !', 'Kiai-squiii !'], ['Hai!', 'Cheese or your life!', 'Kiai-squeak!']], cheese: [['MIAM !', 'Du gruyère !', 'Pause fromage !'], ['YUM!', 'Swiss cheese!', 'Cheese break!']],
  vamp: [['Une petite gorgée…', 'Délicieux !', 'Je reviens tout de suite !'], ['Just a little sip…', 'Delicious!', 'Be right back!']], sci: [['Pour la science !', 'Attrapez ça !', 'Ne secouez pas !'], ['For science!', 'Catch!', 'Don’t shake it!']]
};
function w5Say(k, sub) { const v = sub ? W5SAY[k][sub] : W5SAY[k], l = v[LANG === "fr" ? 0 : 1]; return l[(Math.random() * l.length) | 0]; }

// ---- looks: man-birds, mice, vampires, scientists and the doctor ride the warriors' rig ---------------------------
function rigLook(kind, seed, o) { let s = seed * 31 + 9; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; return { type: kind, seed, persona: { brave: r(), lazy: r(), jumpy: r(), show: r() }, voice: 200, ...o(r) }; }
function manbirdLook(seed) { return rigLook('manbird', seed, r => { const fe = r() < .5 ? '#6a5a4a' : '#3a3a4a'; const L = { b: BONES(1.05, { head: 1.05, arm: 1.15, leg: .95 }), top: fe, arms: fe, legs: '#c8a040', legB: '#a88020', skin: '#c8a040', hand: '#c8a040', boots: '#c8a040', wpn: 'paws', name: 'Homme-oiseau' };
  L.foot = (c, f, k, col) => { for (let j = 0; j < 3; j++) limb(c, [[f[0], f[1] - 1], [f[0] + 4 + j * 2.5, f[1] + (j - 1) * 1.2]], .9, '#c8a040'); };
  L.torso = (c, S, tor) => { c.strokeStyle = shadeC(fe, -.3); c.lineWidth = .8; for (let k = 0; k < 5; k++) { const y = lerp(tor[0][1], tor[3][1], .15 + k * .17); c.beginPath(); c.moveTo(tor[0][0] + 2, y); c.quadraticCurveTo(S.chest[0], y + 3, tor[1][0] - 2, y); c.stroke(); } };   // feathers
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr; disc(c, x, y, R, fe, rim); poly(c, [[x + R * .7, y - R * .2], [x + R * 2, y + R * .15], [x + R * .7, y + R * .4]], '#e8b830'); c.fillStyle = '#f4e8a0'; c.beginPath(); c.arc(x + R * .35, y - R * .25, R * .28, 0, 7); c.fill(); c.fillStyle = '#0c0a08'; c.fillRect(x + R * .38, y - R * .3, 1.6, 1.6);
    poly(c, [[x - R * .6, y - R * .8], [x - R * .2, y - R * 1.7], [x + R * .1, y - R * .9]], shadeC(fe, .2)); };
  L.weapon = (c, S) => { const [hx, hy] = S.aF[2]; for (let j = 0; j < 3; j++) limb(c, [[hx, hy], [hx + 5 + j, hy + (j - 1) * 3]], .8, '#f4efe0'); }; L.handF = true; return L; }); }
function mouseLook(seed) { return rigLook('mouse', seed, r => { const fur = r() < .5 ? '#9a9a96' : '#c8b8a0', gi = ['#e8e4d8', '#3a3a6a', '#8a2a2a'][(r() * 3) | 0];
  const L = { b: BONES(.72, { head: 1.25, leg: .9, arm: .9 }), top: gi, arms: gi, legs: gi, legB: shadeC(gi, -.2), skin: fur, hand: '#e8b8b0', boots: '#e8b8b0', wpn: 'katana', name: 'Souris samouraï' };
  L.torso = (c, S, tor) => { c.fillStyle = '#1a1a1a'; c.fillRect(S.hip[0] - L.b.hw - 1, S.hip[1] - 3, L.b.hw * 2 + 2, 2.4); c.strokeStyle = shadeC(gi, -.35); c.lineWidth = .8; c.beginPath(); c.moveTo(tor[0][0] + 1, tor[0][1]); c.lineTo(S.hip[0] + 2, S.hip[1] - 3); c.stroke(); };   // the obi belt, the gi's fold
  L.behind = (c, S, p, t) => { c.strokeStyle = '#e8b8b0'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(S.hip[0] - 3, S.hip[1]); c.quadraticCurveTo(S.hip[0] - 14, S.hip[1] + 4 + Math.sin(t * 5) * 3, S.hip[0] - 20, S.hip[1] - 4); c.stroke(); };   // the tail
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr; for (const dx of [-.6, .45]) { disc(c, x + R * dx, y - R * 1.05, R * .62, fur, rim); disc(c, x + R * dx, y - R * 1.05, R * .36, '#e8b8b0'); }
    c.fillStyle = OUT; c.beginPath(); c.ellipse(x + R * .25, y, R + INKW, R * .82 + INKW, 0, 0, 7); c.fill(); c.fillStyle = fur; c.beginPath(); c.ellipse(x + R * .25, y, R, R * .82, 0, 0, 7); c.fill();
    poly(c, [[x + R * .8, y - R * .3], [x + R * 1.7, y + R * .15], [x + R * .8, y + R * .5]], fur); disc(c, x + R * 1.7, y + R * .15, R * .18, '#e86a8a'); c.fillStyle = '#0c0a08'; c.fillRect(x + R * .7, y - R * .25, 2, 2);
    c.fillStyle = '#c8202a'; c.fillRect(x - R * .9, y - R * .55, R * 1.9, R * .25); c.strokeStyle = '#1a1a1a'; c.lineWidth = .5; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x + R * 1.5, y + R * .1 + k * 1.4); c.lineTo(x + R * 2.3, y + k * 2 - 1); c.stroke(); } };   // the headband, whiskers
  L.weapon = (c, S, p, t, o) => { const [hx, hy] = S.aF[2], a = S.handAng, dx = Math.sin(a), dy = Math.cos(a); limb(c, [[hx - dx * 3, hy - dy * 3], [hx + dx * 2, hy + dy * 2]], 1.4, '#1a1a1a'); limb(c, [[hx + dx * 2 + dy * 2.5, hy + dy * 2 - dx * 2.5], [hx + dx * 2 - dy * 2.5, hy + dy * 2 + dx * 2.5]], 1, '#c8a040'); limb(c, [[hx + dx * 2, hy + dy * 2], [hx + dx * 22, hy + dy * 21]], 1.1, '#e8eef4'); };
  L.handF = true; return L; }); }
function vampLook(seed) { return rigLook('vampire', seed, r => { const L = { b: BONES(1.08, { tall: 1.08, leg: 1.08 }), top: '#1a1a1e', arms: '#1a1a1e', legs: '#1a1a1e', legB: '#0e0e10', skin: '#e8e4e0', hand: '#e8e4e0', boots: '#0e0e10', wpn: 'paws', name: 'Vampire' };
  L.behind = (c, S, p, t, o) => { const [cx, cy] = S.chest, fl = Math.sin(t * 3) * 3 + (o.vx ? 6 : 0); poly(c, [[cx - 8, cy - 2], [cx + 6, cy - 2], [cx + 4 - fl * .3, cy + 34], [cx - 14 - fl, cy + 36]], '#8a1020'); poly(c, [[cx - 7, cy], [cx + 4, cy], [cx + 2, cy + 30], [cx - 11 - fl * .8, cy + 32]], '#1a0a0e'); };   // the cape, red inside
  L.torso = (c, S) => { poly(c, [[S.chest[0] - 1, S.chest[1]], [S.chest[0] + 4, S.chest[1]], [S.chest[0] + 1.5, S.chest[1] + 8]], '#f4f0e8'); c.fillStyle = '#c8202a'; c.fillRect(S.chest[0], S.chest[1] + 1, 2, 2); };
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr; disc(c, x + R * .15, y, R, L.skin, rim); poly(c, [[x - R, y - R * .2], [x - R * .2, y - R * 1.15], [x + R * .4, y - R * .7], [x + R, y - R * 1.1], [x + R * 1.1, y - R * .4], [x + R * .3, y - R * .55]], '#0e0e10');   // the widow's peak
    c.fillStyle = '#c8202a'; c.fillRect(x + R * .45, y - R * .2, 2, 1.6); c.fillStyle = '#f4f0e8'; c.fillRect(x + R * .6, y + R * .5, 1, 2.4); c.fillRect(x + R * .9, y + R * .5, 1, 2.4);   // red eye, fangs
    poly(c, [[x - R * .9, y + R * .5], [x - R * 1.6, y - R * .2], [x - R * 1.2, y + R * 1.1]], '#8a1020'); }; L.weapon = null; return L; }); }
function sciLook(seed) { return rigLook('scientist', seed, r => { const sk = ['#e8c8a8', '#c89878', '#8a5a3a'][(r() * 3) | 0], hair = ['#3a2a1a', '#c8c8c0', '#8a4a20'][(r() * 3) | 0];
  const L = { b: BONES(.98, { wide: .95 }), top: LABC, arms: LABC, legs: '#3a3a42', legB: '#2a2a32', skin: sk, hand: '#c8e8f0', boots: '#2a2a2a', wpn: 'paws', name: 'Scientifique' };
  L.torso = (c, S, tor) => { poly(c, [[S.hip[0] - L.b.hw - 1, S.hip[1] - 2], [S.hip[0] + L.b.hw + 1, S.hip[1] - 2], [S.hip[0] + L.b.hw + 3, S.hip[1] + 12], [S.hip[0] - L.b.hw - 3, S.hip[1] + 12]], LABC); c.fillStyle = '#3a6aa8'; c.fillRect(S.chest[0] + 2, S.chest[1] + 4, 2, 4); };   // the coat tails, pens
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr; disc(c, x + R * .1, y, R, sk, rim); c.fillStyle = hair; c.beginPath(); c.arc(x, y - R * .3, R * .95, Math.PI, 0); c.fill();
    c.strokeStyle = '#1a1a1a'; c.lineWidth = 1; c.strokeRect(x + R * .3, y - R * .35, R * .6, R * .4); c.fillStyle = 'rgba(200,240,255,.7)'; c.fillRect(x + R * .3, y - R * .35, R * .6, R * .4);   // safety goggles
    if (o.shout) { c.fillStyle = '#2a140c'; c.fillRect(x + R * .5, y + R * .4, R * .4, R * .35); } };
  L.weapon = (c, S, p, t, o) => { if (!o.flask) return; const [hx, hy] = S.aF[2]; poly(c, [[hx - 3, hy - 1], [hx + 3, hy - 1], [hx + 1, hy - 8], [hx - 1, hy - 8]], o.flask); c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(hx - 2, hy - 5, 1, 3); };
  L.handF = true; return L; }); }
function panicLook() {
  const L = { b: BONES(1.15, { wide: .9, leg: 1.1, arm: 1.05, head: 1.12 }), top: '#d8e8a0', arms: '#d8e8a0', legs: '#4a3a5a', legB: '#3a2a4a', skin: '#f0d8c0', hand: '#f0d8c0', boots: '#2a1a12', seed: 51, name: 'Dr PaNIC', wpn: 'cane', voice: 170 };
  L.torso = (c, S, tor) => { poly(c, [[S.hip[0] - L.b.hw - 1, S.hip[1] - 3], [S.hip[0] + L.b.hw + 1, S.hip[1] - 3], [S.hip[0] + L.b.hw + 5, S.hip[1] + 16], [S.hip[0] - L.b.hw - 6, S.hip[1] + 16]], '#d8e8a0');   // the radioactive lab coat
    c.fillStyle = '#2a2a2a'; c.font = 'bold 3px sans-serif'; c.fillText('Pa·Ni·C', S.chest[0] - 4, S.chest[1] + 9); c.fillStyle = '#e8c040'; c.beginPath(); c.arc(S.chest[0] + 3, S.chest[1] + 3, 1.6, 0, 7); c.fill();
    c.fillStyle = '#8a2a8a'; poly(c, [[S.chest[0], S.chest[1]], [S.chest[0] + 3, S.chest[1]], [S.chest[0] + 1.5, S.chest[1] + 3]], '#8a2a8a'); };   // badge, bow tie
  L.head = (c, S, p, t, o, rim) => { const [x, y] = S.head, R = L.b.hr;
    for (let k = 0; k < 9; k++) { const a = -2.8 + k * .32, ln = R * (1.1 + (k % 3) * .25 + Math.sin(t * 6 + k) * .05); limb(c, [[x + Math.cos(a) * R * .7, y + Math.sin(a) * R * .7], [x + Math.cos(a) * (R + ln), y + Math.sin(a) * (R + ln)]], 1.4, '#f4f4f0'); }   // wild white hair
    disc(c, x + R * .1, y, R * .95, L.skin, rim); c.fillStyle = '#1a1a1a'; c.lineWidth = 1;
    for (const dx of [.15, .7]) { c.fillStyle = '#e8e8d0'; c.beginPath(); c.arc(x + R * dx, y - R * .15, R * .3, 0, 7); c.fill(); c.strokeStyle = '#1a1a1a'; c.stroke(); c.fillStyle = '#1a1a1a'; c.fillRect(x + R * dx - .8, y - R * .2, 1.6, 1.6); }   // round spectacles
    c.fillStyle = '#c8c8c0'; c.fillRect(x + R * .2, y + R * .45, R * .7, R * .18);   // moustache
    if (o.shout) { c.fillStyle = '#2a140c'; c.fillRect(x + R * .4, y + R * .62, R * .45, R * .3); } };
  L.weapon = (c, S, p, t, o) => { const [hx, hy] = S.aF[2], spin = o.spin || 0, a = spin ? t * 18 : S.handAng, dx = Math.sin(a), dy = Math.cos(a);
    limb(c, [[hx - dx * 4, hy - dy * 4], [hx + dx * 26, hy + dy * 26]], 1.5, '#141414'); c.strokeStyle = '#141414'; c.lineWidth = 1.5; c.beginPath(); c.arc(hx - dx * 4 + dy * 2.5, hy - dy * 4 - dx * 2.5, 2.6, 0, 7); c.stroke();   // the carbon cane
    if (o.coin) { const [bx, by] = S.aB[2]; c.fillStyle = '#c8c8c0'; c.beginPath(); c.arc(bx, by - 2, 2.4, 0, 7); c.fill(); }
    if (o.salve) { const [bx, by] = S.aB[2]; c.fillStyle = RAD; c.beginPath(); c.arc(bx, by - 3, 3, 0, 7); c.fill(); } };
  L.handF = true; return L; }
const PANIC = panicLook();

// ---- spawning ---------------------------------------------------------------------------------------------------
function w5Spawn(e, from) {
  if (e.type === 'manbird') e.look = manbirdLook(SEEDN++); if (e.type === 'mouse') e.look = mouseLook(SEEDN++); if (e.type === 'vampire') e.look = vampLook(SEEDN++); if (e.type === 'scientist') e.look = sciLook(SEEDN++);
  if (W5DRAWN[e.type]) e.look = { type: e.type, seed: SEEDN++, wpn: 'paws', persona: { brave: 1, lazy: 0, jumpy: 0, show: 0 }, name: e.type, voice: 150, b: BONES(1, {}) };
  if (e.type === 'bird') { e.y = 70 + Math.random() * 20; e.hov = e.y; e.state = 'walk'; }
  if (e.type === 'hydra') { WORLD.boss = e; e.inv = 1.5; e.heads = [0, 1, 2].map(i => ({ i, st: 'sway', t: Math.random() * 2, cd: 1 + i * .8, lx: 0, ly: 0 })); e.x = camX + VW * .72; e.z = DEPTH * .5; e.state = 'walk';
    banner(W4NAME.hydra[LANG === 'fr' ? 0 : 1], -1, true, '#9aff6a'); SND.boom(.5); musicPlay(LEVELS[LEVEL].id, true); }
  if (e.type === 'panic') { e.look = PANIC; e.x = scr.barX || camX + VW * .8; e.z = 50; e.state = 'intro'; e.inv = 99; e.ot = 0; e.coinCD = 3; e.caneCD = 5; e.darkCD = 20; e.salveCD = 0; WORLD.boss = e; WORLD.oscar = e; WORLD.panic = e;
    musicPlay(LEVELS[LEVEL].id, true); if (typeof STORY5 !== 'undefined' && STORY5) playLines(STORY5.panic, false); }
}
// ---- hits ---------------------------------------------------------------------------------------------------------
function w5Hit(e, dmg, dir, src, kb) {
  if (e.type === 'panic') { e.vx = dir * 25 * kb; if (src && src.meter !== undefined) src.meter = Math.min(100, src.meter + 5);
    if (e.state === 'cane' && (HITKIND === 'throw' || (src && src.dash > 0))) { e.state = 'hurt'; e.stun = .8; }   // a throw or a charge breaks his little dance
    if (e.hp <= 0) { panicDown(e); return true; } SFX.impact(hitKind(src), Math.min(1, dmg / 3 + .2), e.x); if (Math.random() < .15) quip(e, w5Say('panic', 'hurt')); return true; }
  if (e.type === 'hydra') { e.vx = dir * 10 * kb; if (src && src.meter !== undefined) src.meter = Math.min(100, src.meter + 5);
    if (e.hp <= 0) { boneBurst(e, '#6a8a3a', 34); if (WORLD.boss === e) WORLD.boss = null; return false; } SFX.impact(hitKind(src), Math.min(1, dmg / 3 + .2), e.x); return true; }
  if (e.type === 'snake' && !e.puff && e.hp > 0) { e.puff = 4; e.state = 'walk'; pop(e.x, e.z, 50, LANG === 'fr' ? 'POUF !' : 'PUFF!', '#e8e0a0'); }   // a hit snake puffs up like a pufferfish
  if (e.type === 'vampire' && !e.bat && e.hp > 0 && !(e.batCD > time) && Math.random() < .22) { vampBat(e); return true; }
  if (e.type === 'bird' && e.hp <= 0) boneBurst(e, '#8a6a4a', 8);
  return false;
}
function w5OnHit(e, q) { if (e.type === 'manbird' && Math.random() < .3) addStatus(q, 'bleed'); if (e.type === 'snake' && Math.random() < .4) addStatus(q, 'poison');
  if (e.type === 'vampire') { addStatus(q, 'bleed'); e.hp = Math.min(e.max, e.hp + 2); fx.push({ k: 'plus', x: e.x, z: e.z, t: 1 }); if (Math.random() < .4) quip(e, w5Say('vamp')); } }
function vampBat(e) { e.batCD = time + 4; e.bat = 1; e.batT = 0; e.state = 'walk'; e.inv = .4; e.batTo = (e.x < camX + VW / 2) ? camX + VW - 40 : camX + 40; e.y = Math.max(e.y, 10);
  for (let k = 0; k < 8; k++) fx.push({ k: 'smoke', x: e.x + (Math.random() - .5) * 20, z: e.z, y: 30 + Math.random() * 30, f: Math.random() - .5, t: .9 }); pop(e.x, e.z, 80, LANG === 'fr' ? 'POUF !' : 'POOF!', '#c8202a'); }
function w5Shot(e) { const p = targetOf(e); if (!p) return;
  if (e.type === 'scientist') { const k = e.carry || pickW([['petard', 3], ['poison', 2], ['fizz', 2], ['gas', 1]]); e.carry = null; const dx = p.x - e.x, T = Math.max(.5, Math.min(1.1, Math.abs(dx) / 220));
    fx.push({ k: 'flask', kind: k, x: e.x + e.face * 8, z: e.z, y: 50, vx: dx / T, vz: (p.z - e.z) / T, vy: GRAV * T * .5 - 50 / T, rot: 0, t: T + 1, from: e }); if (Math.random() < .35) quip(e, w5Say('sci')); SFX.swish('light', .5, e.x); } }
// ---- AI -------------------------------------------------------------------------------------------------------------
function w5Pre(e, dt, p) {
  if (e.type === 'snake' && e.puff > 0) { e.puff -= dt; if (e.puff <= 0) e.puff = 0; }
  if (e.type === 'mouse') { e.dashCD = (e.dashCD ?? 2 + Math.random() * 2) - dt; const dx = p.x - e.x;
    if (e.dashCD <= 0 && Math.abs(dx) > 50 && Math.abs(dx) < 150 && Math.abs(p.z - e.z) < 14) { e.dashCD = 3.5 + Math.random() * 2; e.face = Math.sign(dx); e.vx = e.face * 420; e.react = { k: 'bang', t: .3 }; if (Math.random() < .4) quip(e, w5Say('mouse')); SFX.swish('heavy', .6, e.x); e.dashHit = true; return false; } }
  if (e.type === 'scientist') {   // keeps away from warriors, grabs something explosive when it can
    const near = players.filter(q => q.ko <= 0).sort((a, b) => Math.abs(a.x - e.x) - Math.abs(b.x - e.x))[0]; if (!near) return false;
    if (!e.carry) { const it = BREAK.find(b => !b.broken && !b.held && !b.thrown && BK[b.k] && BK[b.k].surprise && b.k !== 'holy' && b.k !== 'cheese' && Math.abs(b.x - e.x) < 60 && Math.abs(b.z - e.z) < 30); if (it) { it.broken = true; e.carry = it.k; } }
    const dx = e.x - near.x; if (Math.abs(dx) < 110) { goToward(e, e.x + Math.sign(dx || 1) * 60, e.z + (e.z < DEPTH / 2 ? 10 : -10), ETYPES.scientist.spd, dt); e.face = -Math.sign(dx || 1); e.flee = 0; if (e.cd > .4) return true; } }
  return false;
}
function w5Update(e, dt) {
  if (e.type === 'bird') return birdAI(e, dt);
  if (e.type === 'hydra') return hydraAI(e, dt);
  if (e.type === 'panic') return panicAI(e, dt);
  if (e.type === 'vampire' && e.bat) return batAI(e, dt);
  if (e.type === 'mouse' && e.dashHit) { if (Math.abs(e.vx) < 80) e.dashHit = false; else for (const q of near4(e, 22, 14)) { e.dashHit = false; hitPlayer(q, 1, e.face, e); break; } }
  if (e.cheese > 0) { e.cheese -= dt; e.mv = 0; return true; }
  return false;
}
function birdAI(e, dt) { const p = targetOf(e); if (!p) return true; e.cd -= dt; e.vy = 0;
  if (e.state === 'swoop') { e.t2 += dt; const u = Math.min(1, e.t2 / .55); e.y = lerp(e.hov, 10, Math.sin(u * Math.PI)); e.x += e.face * 210 * dt; e.walk += dt * 14;
    if (!e.hit && e.y < 26) for (const q of near4(e, 18, 14)) { e.hit = true; hitPlayer(q, 1, e.face, e); break; }
    if (u >= 1) { e.state = 'walk'; e.y = e.hov; e.cd = 1.2 + Math.random(); } return true; }
  const dx = p.x - e.x; e.face = Math.sign(dx) || e.face; e.y = e.hov + Math.sin(time * 4 + e.x * .1) * 6; e.walk += dt * 10;
  if (e.cd <= 0 && Math.abs(dx) < 120 && Math.abs(dx) > 50 && Math.abs(p.z - e.z) < 16) { e.state = 'swoop'; e.t2 = 0; e.hit = false; SFX.swish('light', .6, e.x); return true; }
  goToward(e, p.x - Math.sign(dx || 1) * 90, p.z, ETYPES.bird.spd, dt); return true; }
function batAI(e, dt) { e.batT += dt; e.vy = 0; e.walk += dt * 18; const p = targetOf(e);
  if (e.batT < 1.4) { const dx = e.batTo - e.x; e.x += Math.sign(dx) * Math.min(Math.abs(dx), 380 * dt); e.y = lerp(e.y, 80, dt * 4); e.face = Math.sign(dx) || e.face; return true; }
  if (!p) return true; if (!e.charge) { e.charge = 1; e.face = Math.sign(p.x - e.x) || 1; e.cz = p.z; }
  e.x += e.face * 420 * dt; e.z += (e.cz - e.z) * Math.min(1, dt * 4); e.y = lerp(e.y, 24, dt * 6);
  for (const q of near4(e, 20, 14)) { if (hitPlayer(q, 1, e.face, e)) w5OnHit(e, q); vampLand(e); return true; }
  if (e.batT > 3.2 || e.x < camX - 20 || e.x > camX + VW + 20) vampLand(e); return true; }
function vampLand(e) { e.bat = 0; e.charge = 0; e.y = 0; e.state = 'walk'; e.cd = .8; for (let k = 0; k < 6; k++) fx.push({ k: 'smoke', x: e.x + (Math.random() - .5) * 20, z: e.z, y: 20 + Math.random() * 30, f: Math.random() - .5, t: .8 }); }
// the three-headed snake: a coiled body that slides slowly; each head sways, strikes or spits on its own
function hydraHead(e, h) { const f = e.face, t = h.t, k = h.st !== 'strike' ? 0 : t < .35 ? Math.sin(t / .35 * Math.PI / 2) : t < .6 ? 1 : Math.max(0, 1 - (t - .6) / .25);
  const rx = e.x + f * (6 + h.i * 22) + Math.sin(time * 1.6 + h.i * 2.1) * 9, ry = 112 + (h.i === 1 ? 26 : 0) + Math.cos(time * 1.3 + h.i * 1.7) * 8;   // three tall necks sway above the coils; a strike lunges out and down
  return { x: rx + f * k * 100, y: lerp(ry, 24, k), z: e.z - 6 + h.i * 6 }; }
function hydraAI(e, dt) { const p = targetOf(e); if (!p) return true; e.vy = 0; e.y = 0; const dx = p.x - e.x; e.face = Math.sign(dx) || e.face;
  if (Math.abs(dx) > 120) goToward(e, p.x - Math.sign(dx) * 100, p.z, ETYPES.hydra.spd, dt); else e.walk += dt * 2;
  for (const h of e.heads) { h.cd -= dt; h.t += dt;
    if (h.st === 'sway' && h.cd <= 0) { const q = players.filter(q => q.ko <= 0).sort((a, b) => Math.abs(a.x - e.x) - Math.abs(b.x - e.x))[(h.i + (Math.random() < .5 ? 0 : 1)) % Math.max(1, players.length)] || p;
      if (Math.abs(q.x - e.x) < 130 && Math.random() < .65) { h.st = 'strike'; h.t = 0; h.tz = q.z; h.hit = false; SFX.swish('heavy', .7, e.x); } else { h.st = 'spit'; h.t = 0; } }
    if (h.st === 'strike') { if (!h.hit && h.t > .28 && h.t < .62) { const hp = hydraHead(e, h); for (const q of players) if (q.ko <= 0 && Math.abs(q.x - hp.x) < 24 && Math.abs(q.z - h.tz) < 16 && q.y < 50) { h.hit = true; if (hitPlayer(q, 2, e.face, e) && Math.random() < .4) addStatus(q, 'poison'); break; } } if (h.t > .9) { h.st = 'sway'; h.cd = 1.4 + Math.random() * 1.5; } }
    if (h.st === 'spit') { if (h.t > .4 && !h.spat) { h.spat = true; const hp = hydraHead(e, h), q = p, T = .7; fx.push({ k: 'venom', x: hp.x, z: e.z, y: hp.y, vx: (q.x - hp.x) / T, vz: (q.z - e.z) / T, vy: GRAV * T * .5 - hp.y / T, t: T + .5, from: e }); } if (h.t > .9) { h.st = 'sway'; h.spat = false; h.cd = 1.8 + Math.random() * 1.5; } } }
  return true; }
// Dr PaNIC
function panicAI(e, dt) { e.y = 0; e.vy = 0;
  if (e.state === 'kneel') return true;
  if (e.state === 'intro') { e.ot += dt; if (e.ot > 3) { e.state = 'walk'; e.inv = 0; quip(e, w5Say('panic', 'intro')); } return true; }
  const p = targetOf(e); if (!p) return true; e.cd -= dt; e.coinCD -= dt; e.caneCD -= dt; e.darkCD -= dt; const dx = p.x - e.x, ad = Math.abs(dx);
  if (WORLD.dark > 0 && WORLD.darkBy === e) { e.salveCD -= dt; if (e.salveCD <= 0 && e.state === 'walk') { e.salveCD = 3.2 + Math.random(); throwSalve(e, p); } }
  if (e.state === 'lights') { e.t2 -= dt; if (e.t2 <= 0) { WORLD.dark = 15; WORLD.darkT = 15; WORLD.darkBy = e; e.state = 'walk'; e.salveCD = .6; e.darkCD = 90; SND.boom(.4); try { const t0 = SND.now(); tone(t0, 220, 55, 1.2, .12, 'sawtooth'); } catch (er) {} } return true; }
  if (e.state === 'coin') { e.t2 -= dt; if (e.t2 <= 0) { for (let k = -1; k <= 1; k++) { const T = .55; fx.push({ k: 'coin', x: e.x + e.face * 10, z: e.z, y: 50, vx: (p.x - e.x) / T + k * 40, vz: (p.z - e.z) / T + k * 30, vy: GRAV * T * .5 - 50 / T + 40, t: T + .4, rot: 0, from: e }); } SFX.swish('light', .6, e.x); e.state = 'walk'; e.cd = .6; e.coinCD = 3.2 + Math.random() * 1.4; } return true; }
  if (e.state === 'cane') { e.t2 -= dt; const u = 1 - e.t2 / 1.6; e.x += Math.sin(u * 14) * 60 * dt; e.y = Math.abs(Math.sin(u * 9)) * 16 * (u < .85 ? 1 : 0); if (Math.random() < dt * 8) fx.push({ k: 'spark', x: e.x + (Math.random() - .5) * 30, z: e.z, y: 40 + Math.random() * 30, t: .4, col: '#e8e0a0' });
    if (e.t2 <= 0) { e.state = 'strike'; e.t2 = .25; SFX.swish('heavy', 1, e.x); for (const q of near4(e, 52, 18, true)) if (hitPlayer(q, 2, e.face, e)) { addStatus(q, 'dizzy'); q.vx = e.face * 260; q.vy = 150; } } return true; }
  if (e.state === 'strike') { e.t2 -= dt; if (e.t2 <= 0) { e.state = 'walk'; e.cd = 1; e.caneCD = 5 + Math.random() * 2; } return true; }
  if (e.darkCD <= 0 && !(WORLD.dark > 0)) { e.state = 'lights'; e.t2 = .9; quip(e, w5Say('panic', 'dark')); return true; }
  if (e.caneCD <= 0 && ad < 70 && Math.abs(p.z - e.z) < 18) { e.face = Math.sign(dx) || e.face; e.state = 'cane'; e.t2 = 1.6; quip(e, w5Say('panic', 'cane')); return true; }
  if (e.coinCD <= 0 && ad > 60 && ad < 300) { e.face = Math.sign(dx) || e.face; e.state = 'coin'; e.t2 = .35; if (Math.random() < .3) quip(e, w5Say('panic', 'coin')); return true; }
  e.face = Math.sign(dx) || e.face; goToward(e, p.x - Math.sign(dx || 1) * (e.caneCD <= 0 ? 40 : 140), p.z, ETYPES.panic.spd, dt); return true; }
function throwSalve(e, p) { const T = .8; fx.push({ k: 'salve', x: e.x + e.face * 10, z: e.z, y: 55, vx: (p.x - e.x + (Math.random() - .5) * 30) / T, vz: (p.z - e.z) / T, vy: GRAV * T * .5 - 55 / T, t: T + .5, from: e }); SFX.swish('light', .5, e.x); }
function panicDown(e) { e.state = 'kneel'; e.inv = 99; e.hp = 1; WORLD.oscarDownT = time; WORLD.dark = 0; for (const o of enemies) if (o !== e && !o.dead) o.flee = 99; fx = fx.filter(f => !['coin', 'salve', 'flask', 'venom'].includes(f.k)); for (const p of players) p.st = [];
  banner(LANG === 'fr' ? 'DR PANIC À GENOUX' : 'DR PANIC KNEELS', -1, true, RAD); inkAccent(e.x, e.z, 60); }
function w5Pose(e) { if (e.type !== 'panic') return null; const t = time;
  if (e.state === 'kneel') return POSES.kneel(t); if (e.state === 'intro') return POSES.chat(t);
  if (e.state === 'lights') return PZ({ ry: 1, sp: -.2, nk: -.3, aF: [2.8, .2], aB: [2.6, .3], lF: [.2, -.1], lB: [-.2, -.08] });
  if (e.state === 'coin') return PZ({ ry: 1, sp: .15, nk: 0, aF: [.5, .5], aB: [-1.2 + (1 - e.t2 / .35) * 3, .3], lF: [.4, -.2], lB: [-.3, -.1] });
  if (e.state === 'cane') { const u = 1 - e.t2 / 1.6; return PZ({ ry: 2, sp: Math.sin(u * 12) * .3, nk: Math.sin(u * 9) * .2, aF: [1.2 + Math.sin(u * 16) * 1.2, .3], aB: [-.8 + Math.cos(u * 11) * .8, .8], lF: [.5 + Math.sin(u * 10) * .5, -.5], lB: [-.4 - Math.cos(u * 10) * .4, -.3], rot: Math.sin(u * 7) * .15 }); }
  if (e.state === 'strike') return PZ({ ry: 2, sp: .45, nk: -.2, aF: [2.4, .1], aB: [-.6, .5], lF: [.7, -.5], lB: [-.6, -.1] });
  return null; }
function w5O(e, o) { if (e.type !== 'panic') return; o.spin = e.state === 'cane' ? 1 : 0; o.coin = e.state === 'coin'; o.salve = WORLD.dark > 0 && e.salveCD < .6; o.vx = e.vx; o.shout = QUIPS.some(q => q.obj === e); }
// ---- the hand-drawn creatures -------------------------------------------------------------------------------------
function w5Draw(e) { if (!W5DRAWN[e.type] && !(e.type === 'vampire' && e.bat)) return false; const x = e.x - camX, y = sy(e.z, e.y), t = time, fl = e.flash > 0; if (x < -200 || x > VW + 200) return true;
  if (e.dead && e.dead < .5) g.globalAlpha = e.dead / .5; const f = e.face;
  if (e.type === 'vampire') { shadow(e.x, e.z, e.y, 8); const w = Math.sin(t * 22) * 6; g.fillStyle = fl ? '#fff' : '#1a0a10'; g.beginPath(); g.moveTo(x - 14, y - 4 - w); g.quadraticCurveTo(x - 6, y - 2, x, y); g.quadraticCurveTo(x + 6, y - 2, x + 14, y - 4 - w); g.lineTo(x + 8, y + 1); g.lineTo(x, y + 3); g.lineTo(x - 8, y + 1); g.closePath(); g.fill(); g.fillStyle = '#c8202a'; g.fillRect(x + f * 2 - 1, y - 2, 1.6, 1.6); g.globalAlpha = 1; return true; }
  if (e.type === 'bird') { shadow(e.x, e.z, 0, 10); const w = Math.sin(t * 16 + e.x) * 9, C = fl ? '#fff' : '#5a4a3a';
    g.fillStyle = OUT; g.beginPath(); g.ellipse(x, y - 6, 12, 7, 0, 0, 7); g.fill(); g.fillStyle = C; g.beginPath(); g.ellipse(x, y - 6, 10.5, 5.8, 0, 0, 7); g.fill();
    for (const s of [-1, 1]) { g.fillStyle = shadeC(C, -.15); g.beginPath(); g.moveTo(x - 4, y - 8); g.quadraticCurveTo(x - 6, y - 18 - w * s * .3, x - 22, y - 12 - w); g.lineTo(x + 2, y - 6); g.closePath(); g.fill(); g.strokeStyle = OUT; g.lineWidth = 1; g.stroke(); }
    disc(g, x + f * 11, y - 10, 5, C); poly(g, [[x + f * 14, y - 11], [x + f * 22, y - 9], [x + f * 14, y - 7]], '#e8b830'); g.fillStyle = RAD; g.fillRect(x + f * 12 - 1, y - 12, 2.4, 2.4); g.fillStyle = '#0c0a08'; g.fillRect(x + f * 12.5 - .5, y - 11.5, 1.2, 1.2);   // a third eye, mutant
    for (const s of [-3, 2]) limb(g, [[x + s, y - 1], [x + s + f * 2, y + 4]], .8, '#c8a040'); g.globalAlpha = 1; return true; }
  if (e.type === 'ant') { shadow(e.x, e.z, e.y, 22); const wk = (e.walk || 0) * 1.2, C = fl ? '#fff' : '#2a1a14', bite = e.state === 'wind' ? 1 : 0;
    for (let k = 0; k < 3; k++) for (const s of [0, 1]) { const bx = x + (k - 1) * 9, ph = Math.sin(wk + k * 2 + s * Math.PI) * (e.mv ? 5 : 1); limb(g, [[bx, y - 12], [bx + (k - 1) * 4 + ph * .4, y - 18 - (s ? 2 : 0)], [bx + (k - 1) * 8 + ph, y - (s ? 1 : 0)]], s ? 1.4 : 1.7, s ? '#1a100c' : C); }
    for (const [dx, rx, ry] of [[-f * 16, 10, 7], [0, 6, 5], [f * 12, 7, 6]]) { g.fillStyle = OUT; g.beginPath(); g.ellipse(x + dx, y - 13, rx + 1.2, ry + 1.2, 0, 0, 7); g.fill(); g.fillStyle = C; g.beginPath(); g.ellipse(x + dx, y - 13, rx, ry, 0, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x - f * 18, y - 18, 4, 1.4);
    for (const s of [-1, 1]) limb(g, [[x + f * 16, y - 14], [x + f * (21 + bite * 3), y - 13 + s * (3 - bite * 2)]], 1.3, '#4a2a1a');   // mandibles
    for (const s of [0, 1]) limb(g, [[x + f * 14, y - 18], [x + f * (16 + s * 4), y - 28], [x + f * (22 + s * 4), y - 30]], .8, C); g.fillStyle = RAD; g.fillRect(x + f * 14 - 1, y - 16, 2, 2); g.globalAlpha = 1; return true; }
  if (e.type === 'snake') { const P = e.puff ? 1.7 : 1, wk = (e.walk || 0); shadow(e.x, e.z, e.y, 16 * P); const C = fl ? '#fff' : '#5a7a2a';
    let px = x - f * 22 * P, py = y - 3; for (let k = 0; k < 8; k++) { const nx = x - f * (22 - k * 5.5) * P, ny = y - 3 - Math.sin(wk * 2 + k * .9) * 2 * P - (k > 5 ? (k - 5) * 6 * P : 0); limb(g, [[px, py], [nx, ny]], (2 + k * .35) * P, k % 2 ? C : shadeC(C, -.2)); px = nx; py = ny; }
    disc(g, px + f * 3 * P, py - 2 * P, 4.5 * P, C); if (e.puff) for (let k = 0; k < 8; k++) { const a = k * .785; limb(g, [[px + Math.cos(a) * 4 * P, py - 2 * P + Math.sin(a) * 4 * P], [px + Math.cos(a) * 6.5 * P, py - 2 * P + Math.sin(a) * 6.5 * P]], .6, '#e8e0a0'); }   // spines when puffed
    g.fillStyle = '#e8d040'; g.fillRect(px + f * 4 * P - 1, py - 4 * P, 2, 2); if (Math.sin(t * 6 + e.x) > .4) limb(g, [[px + f * 7 * P, py - 1], [px + f * 11 * P, py], [px + f * 12 * P, py - 2]], .6, '#c8202a'); g.globalAlpha = 1; return true; }
  if (e.type === 'hydra') { shadow(e.x, e.z, 0, 76); const C = fl ? '#fff' : '#4a6a24', C2 = '#c8c070';
    for (let k = 0; k < 4; k++) { const rx = 64 - k * 13, ry = 15 - k * 1.5, cy = y - 13 - k * 13; g.fillStyle = OUT; g.beginPath(); g.ellipse(x - f * 8, cy, rx + 2, ry + 2, 0, 0, 7); g.fill(); g.fillStyle = k % 2 ? shadeC(C, -.15) : C; g.beginPath(); g.ellipse(x - f * 8, cy, rx, ry, 0, 0, 7); g.fill();
      g.fillStyle = C2; for (let j = 0; j < 7; j++) g.fillRect(x - f * 8 - rx * .7 + j * rx * .23, cy + ry * .45, 3, 2); }   // the coils, with a pale belly
    { const tx = x - f * 70, ty = y - 8; g.strokeStyle = OUT; g.lineWidth = 7; g.beginPath(); g.moveTo(x - f * 50, y - 12); g.quadraticCurveTo(tx - f * 10, ty + 4 + Math.sin(t * 3) * 3, tx - f * 22, ty - 10); g.stroke(); g.strokeStyle = C; g.lineWidth = 4.5; g.stroke(); }   // the tail tip
    const order = [...e.heads].sort((a, b) => a.i === 1 ? -1 : b.i === 1 ? 1 : 0);   // the middle neck behind the other two
    for (const h of order) { const hp = hydraHead(e, h), bx = x + f * (h.i - 1) * 16, by = y - 58, hx = hp.x - camX, hy = sy(e.z, hp.y), mx = (bx + hx) / 2 - f * 18, my = Math.min(by, hy) - 22;
      for (const [w, col] of [[17, OUT], [14, C], [5, C2]]) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(mx, my, hx, hy); g.stroke(); } g.lineCap = 'butt';
      g.fillStyle = shadeC(C, -.25); for (let j = 1; j < 6; j++) { const u = j / 6, px = (1 - u) * (1 - u) * bx + 2 * u * (1 - u) * mx + u * u * hx, py = (1 - u) * (1 - u) * by + 2 * u * (1 - u) * my + u * u * hy; g.beginPath(); g.arc(px - f * 3, py - 3, 2, 0, 7); g.fill(); }   // scales along the back
      const open = h.st === 'strike' || (h.st === 'spit' && h.t > .25 && h.t < .55) ? 1 : 0; g.save(); g.translate(hx, hy); g.scale(f * 2, 2); g.rotate(open ? .25 : 0);
      poly(g, [[-5, -5], [9, -5], [14, -2 - open * 4], [5, 0], [14, 2 + open * 4], [9, 5], [-5, 5]], C); poly(g, [[-3, -6], [2, -9], [6, -5]], shadeC(C, -.2));   // the head, a little horned brow
      g.fillStyle = '#e8d040'; g.fillRect(4, -3.5, 2.6, 2.6); g.fillStyle = '#0c0a08'; g.fillRect(5.2, -3.3, 1, 2.2);
      if (open) { g.fillStyle = '#c8202a'; g.fillRect(6, -1.4, 8, 2.8); g.fillStyle = '#f4f0e0'; g.fillRect(12, -3 - open * 2, 1, 3); g.fillRect(12, 1 + open * 2, 1, 3); } else if (Math.sin(t * 5 + h.i * 2) > .5) limb(g, [[14, 0], [18, 0], [20, -1.5]], .5, '#c8202a'); g.restore(); }
    g.globalAlpha = 1; return true; }
  g.globalAlpha = 1; return false; }
// ---- effects ------------------------------------------------------------------------------------------------------
function arcFx(f, dt) { f.x += f.vx * dt; f.z = Math.max(0, Math.min(DEPTH, f.z + f.vz * dt)); f.vy -= GRAV * dt; f.y += f.vy * dt; f.rot = (f.rot || 0) + dt * 12; }
function w5Fx(f, dt) {
  if (f.k === 'coin') { arcFx(f, dt); for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 10 && Math.abs(q.z - f.z) < 10 && f.y < q.y + 60 && f.y > q.y) { f.t = 0; hitPlayer(q, 1, Math.sign(f.vx), f.from); beep(1800, .05, 'square', .04); break; } if (f.y <= 0) { f.t = Math.min(f.t, .5); f.vx = 0; f.vz = 0; f.vy = 0; f.y = 0; } return true; }
  if (f.k === 'venom') { arcFx(f, dt); for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 12 && Math.abs(q.z - f.z) < 12 && f.y < q.y + 60) { f.t = 0; hitPlayer(q, 1, Math.sign(f.vx), f.from); addStatus(q, 'poison'); break; } if (f.y <= 0) f.t = 0; return true; }
  if (f.k === 'flask') { arcFx(f, dt); let hit = f.y <= 0; for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 12 && Math.abs(q.z - f.z) < 12 && f.y < q.y + 60 && f.y > q.y) hit = true;
    if (hit) { f.t = 0; surpriseBreak({ k: f.kind, x: f.x, z: f.z, y: 0, from: f.from }); } return true; }
  if (f.k === 'salve') { arcFx(f, dt); for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 14 && Math.abs(q.z - f.z) < 12 && f.y < q.y + 60 && f.y > q.y) { f.t = 0; addStatus(q, 'poison'); q.glowT = Math.max(q.glowT || 0, WORLD.dark || 6); pop(q.x, q.z, q.y + 70, LANG === 'fr' ? 'RADIOACTIF !' : 'RADIOACTIVE!', RAD); return true; }
    if (f.y <= 0) { f.t = 0; fx.push({ k: 'pud', x: f.x, z: f.z, t: 5, T: 5, r: 16 }); SND.splash(.4); } return true; }
  if (f.k === 'pud') { for (const q of players) if (q.ko <= 0 && q.y < 3 && Math.abs(q.x - f.x) < f.r && Math.abs(q.z - f.z) < f.r * .5) q.shoeT = Math.max(q.shoeT || 0, 8); return true; }
  return false;
}
function drawW5Fx(f) { const x = f.x - camX, y = sy(f.z, f.y || 0);
  if (f.k === 'coin') { g.save(); g.translate(x, y); g.scale(Math.abs(Math.cos(f.rot)) + .2, 1); disc(g, 0, 0, 2.6, '#d8d8d0'); g.restore(); return true; }
  if (f.k === 'venom') { g.fillStyle = '#9ad83a'; g.beginPath(); g.ellipse(x, y, 3, 2, 0, 0, 7); g.fill(); return true; }
  if (f.k === 'flask') { g.save(); g.translate(x, y); g.rotate(f.rot); poly(g, [[-3, 3], [3, 3], [1, -4], [-1, -4]], BK[f.kind] ? BK[f.kind].col : '#9ac8e8'); g.restore(); return true; }
  if (f.k === 'salve') { disc(g, x, y, 3.4, RAD); return true; }
  if (f.k === 'pud') { const a = Math.min(1, f.t / f.T * 1.3); g.fillStyle = `rgba(150,255,60,${.75 * a})`; g.beginPath(); g.ellipse(x, sy(f.z, 0), f.r, f.r * .4, 0, 0, 7); g.fill(); return true; }
  return false; }
// ---- breakables of the facility: cheese boxes (stun the mice), lab benches, beakers and chemistry sets --------------
Object.assign(BK, {
  cheese: { size: 's', hp: 1, w: 14, d: 12, h: 10, col: '#e8c840', food: .3 }, bench: { size: 'l', hp: 9, w: 48, d: 18, h: 18, col: '#6a6a6a', solid: 1 },
  vent: { size: 'l', hp: 8, w: 26, d: 20, h: 20, col: '#8a8a86', solid: 1 }, tank: { size: 'm', hp: 4, w: 16, d: 14, h: 22, col: '#9ac8a8', food: .2 },
  beaker: { size: 's', hp: 1, w: 9, d: 9, h: 13, col: '#9ad8e8', food: .001, surprise: 1 }, chemset: { size: 's', hp: 1, w: 14, d: 10, h: 9, col: '#c8803a', food: .001, surprise: 1 }
});
Object.assign(BK_SC, { cheese: 1.5, bench: 1.4, vent: 1.4, tank: 1.5, beaker: 1.6, chemset: 1.5 });
Object.assign(BK3_DRAW, {
  cheese: (g, W, H, c, dk) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], '#c8a060'); g.fillStyle = c; g.beginPath(); g.moveTo(-W / 2 + 2, -H + 1); g.lineTo(W / 2 - 2, -H + 1); g.lineTo(W / 2 - 2, -H * .4); g.closePath(); g.fill(); g.fillStyle = '#c8a020'; for (const [a, b] of [[2, -H * .7], [-2, -H * .8]]) { g.beginPath(); g.arc(a, b, 1.2, 0, 7); g.fill(); } g.fillStyle = '#5a3a1a'; g.font = 'bold 2.6px sans-serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'FROMAGE' : 'CHEESE', 0, -H * .2); },
  bench: (g, W, H, c, dk, lt) => { poly(g, [[-W / 2, -H], [W / 2, -H], [W / 2, -H + 3], [-W / 2, -H + 3]], '#2a2a2a'); poly(g, [[-W / 2 + 2, -H + 3], [W / 2 - 2, -H + 3], [W / 2 - 2, 0], [-W / 2 + 2, 0]], c); g.fillStyle = dk; g.fillRect(-W / 4, -H + 6, W / 2, 1); g.fillStyle = '#9ad8e8'; g.fillRect(-W / 3, -H - 6, 3, 6); g.fillStyle = '#e8c040'; g.fillRect(W / 5, -H - 5, 4, 5); },
  vent: (g, W, H, c, dk) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); g.fillStyle = dk; for (let k = 0; k < 4; k++) g.fillRect(-W / 2 + 3, -H + 3 + k * 4, W - 6, 1.6); disc(g, 0, -H - 2, W * .3, '#6a6a66'); },
  tank: (g, W, H, c) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], 'rgba(170,220,190,.8)'); g.fillStyle = '#7ab858'; g.fillRect(-W / 2 + 1, -H * .6, W - 2, H * .6 - 1); disc(g, 0, -H * .35, 2.6, '#e8e4c0'); g.fillStyle = '#3a3a3a'; g.fillRect(-W / 2 - 1, -H - 2, W + 2, 3); },
  beaker: (g, W, H) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W * .2, -H * .7], [W * .2, -H], [-W * .2, -H], [-W * .2, -H * .7]], 'rgba(200,235,245,.85)'); g.fillStyle = '#5ac8e8'; g.fillRect(-W / 2 + 2, -H * .35, W - 4, H * .35 - .5); g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(0, -H * .25 - (time * 8 % 3), .8, 0, 7); g.fill(); },
  chemset: (g, W, H, c, dk) => { poly(g, [[-W / 2, 0], [W / 2, 0], [W / 2, -H], [-W / 2, -H]], c); for (let k = 0; k < 3; k++) { g.fillStyle = ['#e83a3a', '#3ae86a', '#3a8ae8'][k]; g.fillRect(-W / 2 + 2 + k * 4, -H - 5, 2.4, 6); } g.fillStyle = dk; g.fillRect(-W / 2, -H * .5, W, 1); }
});
// a beaker bursts into a dizzy fizz, a chemistry set pops; a cheese box stops the mice around it for a moment
const _sbW5 = surpriseBreak;
surpriseBreak = function (b) { if (b.k === 'beaker') return _sbW5({ ...b, k: 'fizz' }); if (b.k === 'chemset') return _sbW5({ ...b, k: 'petard' });
  if (b.k === 'cheese') { for (const e of enemies) if (!e.dead && e.type === 'mouse' && Math.abs(e.x - b.x) < 80 && Math.abs(e.z - b.z) < 40) { e.cheese = 1.2; e.state = 'walk'; e.vx = 0; quip(e, w5Say('cheese')); } return; }
  return _sbW5(b); };
BK.cheese.surprise = 1; BK.cheese.food = .3;
// ---- darkness: the protactinium (pitch black, 15 s) and the vampires' lab (dim). Only glowing things light it --------
const DKC = document.createElement('canvas');
function darkLevel() { let k = 0; if (WORLD.dark > 0) { const T0 = WORLD.darkT || 15, el = T0 - WORLD.dark; k = Math.min(1, el / .25, WORLD.dark / 1.2) * .992; } if (scr && scr.dim && STATE === 'play') k = Math.max(k, scr.dim); return k; }
function w5Tick(dt) { if (WORLD.dark > 0) { WORLD.dark = Math.max(0, WORLD.dark - dt); if (WORLD.darkBy && (WORLD.darkBy.dead || WORLD.darkBy.state === 'kneel')) WORLD.dark = Math.min(WORLD.dark, 1); }
  for (const p of players) { p.glowT = Math.max(0, (p.glowT || 0) - dt); p.shoeT = Math.max(0, (p.shoeT || 0) - dt); } }
function drawDark() { const k = darkLevel(); if (k <= 0) return; if (DKC.width !== RW) { DKC.width = RW; DKC.height = RH; } const d = DKC.getContext('2d'), s = RW / 960, lights = [];
  const L = (x, z, y, r, a = 1, col = null) => { const [ix, iy] = toInk(x, z, y); lights.push([ix * s, iy * s, r * s, a, col]); };
  if (scr && scr.dim && !(WORLD.dark > 0)) { for (const p of players) if (p.ko <= 0) L(p.x, p.z, p.y + 40, 150, 1); for (const e of enemies) if (!e.dead && e.type === 'vampire') L(e.x, e.z, (e.y || 0) + 60, 18, .7, '#ff3040'); }
  for (const p of players) { if (p.glowT > 0) L(p.x, p.z, p.y + 36, 90, Math.min(1, p.glowT), RAD); if (p.shoeT > 0) L(p.x, p.z, p.y + 2, 34, Math.min(1, p.shoeT / 2), RAD); }
  const B = WORLD.panic; if (B && !B.dead) L(B.x, B.z, (B.y || 0) + 40, 70, 1, RAD);
  for (const f of fx) { if (f.k === 'salve') L(f.x, f.z, f.y, 46, 1, RAD); if (f.k === 'pud') L(f.x, f.z, 0, f.r * 4, Math.min(1, f.t / f.T * 1.4), RAD); }
  d.setTransform(1, 0, 0, 1, 0, 0); d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, RW, RH); d.fillStyle = `rgba(2,3,2,${k})`; d.fillRect(0, 0, RW, RH);
  d.globalCompositeOperation = 'destination-out'; for (const [x, y, r, a] of lights) { const gr = d.createRadialGradient(x, y, r * .15, x, y, r); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(.6, `rgba(0,0,0,${a * .55})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = gr; d.fillRect(x - r, y - r, r * 2, r * 2); }
  out.save(); out.setTransform(1, 0, 0, 1, 0, 0); out.drawImage(DKC, 0, 0); out.globalCompositeOperation = 'lighter';
  for (const [x, y, r, a, col] of lights) if (col) { const gr = out.createRadialGradient(x, y, 0, x, y, r * .9); gr.addColorStop(0, col === RAD ? `rgba(110,255,50,${.32 * a})` : `rgba(255,40,60,${.3 * a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); out.fillStyle = gr; out.fillRect(x - r, y - r, r * 2, r * 2); }
  out.restore(); }
// ---- world 5 plugs into the world 4 hooks -------------------------------------------------------------------------------
{ const _sp = w4Spawn; w4Spawn = (e, from) => W5T[e.type] ? w5Spawn(e, from) : _sp(e, from);
  const _hit = w4Hit; w4Hit = (e, dmg, dir, src, kb) => W5T[e.type] ? w5Hit(e, dmg, dir, src, kb) : _hit(e, dmg, dir, src, kb);
  const _oh = w4OnHit; w4OnHit = (e, q) => W5T[e.type] ? w5OnHit(e, q) : _oh(e, q);
  const _sh = w4Shot; w4Shot = e => W5T[e.type] ? w5Shot(e) : _sh(e);
  const _pre = w4Pre; w4Pre = (e, dt, p) => W5T[e.type] ? w5Pre(e, dt, p) : _pre(e, dt, p);
  const _up = w4Update; w4Update = (e, dt) => W5T[e.type] ? w5Update(e, dt) : _up(e, dt);
  const _dr = w4Draw; w4Draw = e => W5T[e.type] ? w5Draw(e) : _dr(e);
  const _po = w4Pose; w4Pose = e => e.type === 'panic' ? w5Pose(e) : _po(e);
  const _o = w4O; w4O = (e, o) => { _o(e, o); w5O(e, o); };
  const _fx = w4Fx; w4Fx = (f, dt) => w5Fx(f, dt) || _fx(f, dt);
  const _dfx = drawW4Fx; drawW4Fx = f => drawW5Fx(f) || _dfx(f);
  const _tk = w4Tick; w4Tick = dt => { _tk(dt); w5Tick(dt); };
  const _rs = w4Reset; w4Reset = s => { _rs(s); WORLD.dark = 0; WORLD.darkBy = null; for (const p of players) { p.glowT = 0; p.shoeT = 0; } };
}
