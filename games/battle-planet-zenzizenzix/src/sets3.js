// =====================================================================
// SET PIECES, WORLD 3 — Bouldaire:
//   The boulevard: the badgers have dug under the great golden statue of Calve-Hair. It cracks, tilts, and comes down
//     along the whole boulevard; its head snaps off and rolls down the street at you, smashing everything, until it
//     ploughs into a shop front and stays there. Badgers climb out of the hole.
//   The arcade: a hare leaps from the gallery onto the giant disco ball and swings on it; the chain snaps; the ball
//     bounces once on the marble, cracking it, and on the second bounce bursts into a storm of mirror shards (they cut).
//   The salon: the giant golden scissors over the reception break loose, fall blades first through the desk, spin
//     across the floor like a propeller (they cut), and stick upright in the tiles.
// =====================================================================
const SET3_INIT = {
  boulevard: () => { SETP.props.statue = { wx: 420, a: 0, fallen: false, headOff: false, crack: 0, back: () => drawStatue(SETP.props.statue) }; },
  galerie: () => { SETP.props.ball = { gone: false }; },
  salon: () => { SETP.props.shears = { wx: 300, hang: 1, back: () => { const S = SETP.props.shears; if (S.hang && !(SETP.cur && SETP.cur.k === 'scissors')) drawGiantScissors(sxW(S.wx), 78, 0, 1, true); } }; }
};
function drawStatue(S) { const bx = sxW(S.wx), base = FLOOR - 2; if (bx < -400 || bx > VW + 300) return;
  lr(g, bx - 34, base - 30, 68, 30, '#e8dcc8'); lr(g, bx - 40, base - 34, 80, 6, '#d8ccb8'); lr(g, bx - 24, base - 22, 48, 12, '#c8963a'); g.fillStyle = LCI; g.font = 'bold 5px sans-serif'; g.textAlign = 'center'; g.fillText('CALVE-HAIR · LE GÉNIE', bx, base - 14.5); g.textAlign = 'left';
  if (S.crack > 0) { g.strokeStyle = LCI; g.lineWidth = 1; g.beginPath(); g.moveTo(bx - 10, base - 34); g.lineTo(bx - 4, base - 22); g.lineTo(bx - 12, base - 10); g.lineTo(bx - 6, base); if (S.crack > 1) { g.moveTo(bx + 8, base - 34); g.lineTo(bx + 14, base - 18); g.lineTo(bx + 6, base - 6); } g.stroke(); }
  g.save(); g.translate(bx - 14, base - 34); g.rotate(-S.a); g.translate(14, 0); g.scale(.8, .8); drawStatueBody(g, !S.headOff); g.restore(); }
function drawStatueBody(g, head) { const GO = '#e8b830', GD = '#b88a20', s = 1.0;
  lpoly(g, [[-13, 0], [-3, 0], [-2, -70], [-11, -70]], GO); lpoly(g, [[2, 0], [12, 0], [11, -70], [2, -70]], GD); lpoly(g, [[-16, 0], [15, 0], [15, 4], [-16, 4]], GD);   // the long legs
  lpoly(g, [[-14, -70], [14, -70], [16, -120], [-16, -120]], GO); lpoly(g, [[-6, -118], [6, -118], [4, -126], [-4, -126]], GO);   // the body
  lpoly(g, [[-14, -118], [-7, -114], [-28, -170], [-36, -167]], GD); lpoly(g, [[14, -118], [7, -114], [26, -172], [34, -169]], GO);   // arms raised
  for (const [x, y] of [[-32, -170], [29, -172]]) { lpoly(g, [[x - 2, y], [x + 2, y], [x + 6, y - 30], [x + 3, y - 30]], '#fff2b0'); lpoly(g, [[x - 2, y], [x + 2, y], [x - 4, y - 30], [x - 7, y - 30]], '#fff2b0'); }   // the scissors held aloft
  for (let k = 0; k < 7; k++) { g.strokeStyle = LCI; g.lineWidth = 3.4; g.beginPath(); g.moveTo(-6 + k * .5, -132); g.bezierCurveTo(-30 - k * 4, -120, -24 - k * 6, -90, -40 - k * 5, -60 + k * 3); g.stroke(); g.strokeStyle = k % 2 ? GO : GD; g.lineWidth = 2.2; g.stroke(); }   // bronze hair flowing in a sculpted wind
  if (head) drawStatueHead(g, 0, -138, 15, 0); }
function drawStatueHead(g, x, y, r, rot) { g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = '#e8b830'; g.strokeStyle = LCI; g.lineWidth = 1.2; g.beginPath(); g.ellipse(0, 0, r * .9, r * 1.1, 0, 0, 7); g.fill(); g.stroke();
  lpoly(g, [[r * .7, -r * .1], [r * 1.25, r * .3], [r * .75, r * .4]], '#e8b830'); g.fillStyle = '#7a5a10'; g.fillRect(r * .3, -r * .35, r * .5, r * .12); g.fillRect(r * .5, -r * .2, 2, 2);
  g.beginPath(); g.moveTo(r * .4, r * .5); g.quadraticCurveTo(r * .8, r * .4, r * 1.05, r * .62); g.quadraticCurveTo(r * .8, r * .55, r * .4, r * .58); g.fill();
  lpoly(g, [[-r * .95, r * .2], [-r, -r * .8], [-r * .3, -r * 1.35], [r * .6, -r * 1.4], [r * 1.05, -r * .9], [r * .3, -r * .8]], '#c8961a'); g.restore(); }
function drawGiantScissors(x, y, rot, s, hanging) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  if (hanging) { g.strokeStyle = LCI; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-40, -70); g.lineTo(-20, -6); g.moveTo(40, -70); g.lineTo(20, -6); g.stroke(); }
  for (const sg of [-1, 1]) { g.save(); g.rotate(sg * .14); lpoly(g, [[-4, 0], [4, 0], [3, 70], [0, 82], [-2, 70]], '#fff2b0'); g.restore(); }
  for (const sg of [-1, 1]) { g.fillStyle = LCI; g.beginPath(); g.ellipse(sg * 14, -18, 15, 11, sg * .4, 0, 7); g.fill(); g.fillStyle = '#ffd23f'; g.beginPath(); g.ellipse(sg * 14, -18, 13, 9, sg * .4, 0, 7); g.fill(); g.fillStyle = '#f4c8d8'; g.beginPath(); g.ellipse(sg * 14, -18, 7, 4.5, sg * .4, 0, 7); g.fill(); }
  g.fillStyle = '#c8963a'; g.beginPath(); g.arc(0, 0, 5, 0, 7); g.fill(); g.strokeStyle = LCI; g.stroke(); g.restore(); }
Object.assign(SETDEF, {
  // =================== BOULDAIRE 1 — THE STATUE ===================
  statue: { dur: 7.6,
    start: C => { const S = SETP.props.statue; C.d.S = S; SND.alarm(2); bigRumble([[0, .15, .3, 1200]]); },
    tick: (C, dt) => { const S = C.d.S, d = C.d;
      if (C.t < 1.4) { if (Math.random() < dt * 20) fx.push({ k: 'puff', x: S.wx + (Math.random() - .5) * 60, z: -4, y: 2, vx: (Math.random() - .5) * 80, vy: 30, r: 4, t: .6, T: .7 }); quake(1.5); }
      if (C.t > 1.4 && !S.fallen) { const u = clamp1((C.t - 1.4) / 1.6); S.a = Math.pow(u, 2.4) * 1.48; quake(2 + u * 4); }
      if (d.roll) { const H = d.roll; H.x += H.v * dt; H.rot += H.v * dt / H.r; if (Math.random() < dt * 30) fx.push({ k: 'puff', x: H.x - Math.sign(H.v) * H.r, z: H.z, y: 2, vx: -H.v * .3, vy: 20, r: 4, t: .5, T: .6 }); quake(4);
        crushAt(H.x, H.z, H.r * 1.6, 30, 2); for (const b of BREAK) if (!b.broken && Math.abs(b.x - H.x) < H.r + b.w / 2 && Math.abs(b.z - H.z) < 26) smash(b, Math.sign(H.v));
        if (H.x >= H.stop) { H.x = H.stop; H.v = 0; d.roll = null; d.headAt = H; quake(14); camPunch(H.x, H.z, 20, .1); SFX.smash('car', 1, H.x); SND.boom(1); splinters(H.x + H.r, H.z, 30, '#cfe4f0', 1); solidWreck(H.x, H.z, H.r * 1.9, 28, 60);
          INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'KLANG-KRASH !!' : 'KLANG-KRASH!!', x: sxW(H.x) * 1.5, y: 230, size: 46, t: 0, strong: true, rot: .06 }); bigRumble([[0, 1, .9, 500], [550, .5, .4, 400]]); } } },
    ev: [[.3, C => quip(players[0], LANG === 'fr' ? 'Les blaireaux creusent sous la statue !' : 'The badgers are digging under the statue!', 2.2)],
      [1.2, C => { const S = C.d.S; S.crack = 1; SFX.smash('rubble', .8, S.wx); quake(6); }], [1.8, C => { C.d.S.crack = 2; SND.crash(1); }],
      [2.3, C => { fx.push({ k: 'lane', z: 52, x0: camX + 20, x1: camX + VW - 20, t: 1.6, T: 1.6, hw: 24 }); quip(players[1] && players[1].ko <= 0 ? players[1] : players[0], LANG === 'fr' ? 'ELLE TOMBE !' : 'IT’S COMING DOWN!', 1.6); }],
      [3.0, C => { const S = C.d.S; S.fallen = true; S.a = 1.48; quake(20); camPunch(S.wx - 120, -10, 30, .14); slowMo(.5); WORLD.flash = .25; WORLD.noir = .8; SND.boom(2); SND.crash(2.2); SFX.smash('metal', 1, S.wx - 100);
        bigRumble([[0, 1, 1, 700], [750, .7, .6, 500], [1300, .4, .3, 400]]); INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'BRAAAOUMMM !!' : 'KA-THOOOOM!!', x: sxW(S.wx - 120) * 1.5, y: 200, size: 56, t: 0, strong: true, rot: -.06 });
        for (let k = 0; k < 18; k++) fx.push({ k: 'smoke2', x: S.wx - 220 + k * 16, z: -6, y: 6 + Math.random() * 20, vx: (Math.random() - .5) * 40, vy: 20 + Math.random() * 30, t: 2.4, T: 2.4, r: 10 + Math.random() * 8 }); splinters(S.wx - 160, -4, 30, '#e8b830', 1.1); for (const e of enemies) if (!e.dead) react(e, 'cower', 1.2); }],
      [3.3, C => { const S = C.d.S; S.headOff = true; C.d.roll = { x: camX - 30, z: 52, r: 30, v: 330, rot: 0, stop: camX + VW - 110 }; SFX.smash('metal', .8, camX); }],
      [5.4, C => { const S = C.d.S; quip(players[0], LANG === 'fr' ? 'Et voilà les terrassiers !' : 'And here come the diggers!', 1.6); setDrop(C, [[S.wx - 20, 8, 30], [S.wx + 20, 14, 36], [S.wx - 40, 20, 30], [S.wx + 30, 6, 40]]); }],
      [6.4, C => { SETP.hold = false; }]],
    items: C => C.d.roll ? [{ key: C.d.roll.z, draw: () => { const H = C.d.roll; shadow(H.x, H.z, 0, H.r); drawStatueHead(g, sxW(H.x), sy(H.z, H.r * 1.1), H.r, H.rot); } }] : [],
    keep: C => { const H = C.d.headAt; if (H) SETP.props.head = { item: () => ({ key: H.z, draw: () => drawStatueHead(g, sxW(H.x), sy(H.z, H.r * 1.1), H.r, H.rot - .3) }) }; } },
  // =================== BOULDAIRE 2 — THE DISCO BALL ===================
  discoball: { dur: 6.8,
    start: C => { C.d.x = Math.max(camX + 200, Math.min(camX + 440, camX + (scr.atrium || 900) - camX * .7)); C.d.y = 96; C.d.vy = 0; C.d.phase = 'hang'; C.d.swing = 0; C.d.hare = 0; musicDuck(.25); },
    tick: (C, dt) => { const d = C.d; d.swing = Math.sin(C.t * 4) * Math.min(.4, C.t * .2) * (d.phase === 'hang' ? 1 : 0);
      if (d.phase === 'fall') { d.vy -= SPG * dt; d.y += d.vy * dt; if (d.y <= 0) { d.y = 0; if (d.bounce === 0) { d.bounce = 1; d.vy = 360; d.vx = 70; quake(16); camPunch(d.x, 60, 24, .1); SND.boom(1.2); SFX.smash('glass', 1, d.x); fx.push({ k: 'ring', x: d.x, z: 60, max: 120, t: .5, col: '#ffffff' }); splinters(d.x, 60, 24, '#e8c8c8', .9); crushAt(d.x, 60, 70, 40, 2);
            INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'BOÏNNNG !' : 'BOINNNG!', x: sxW(d.x) * 1.5, y: 260, size: 40, t: 0, strong: true, rot: .1 }); bigRumble([[0, .9, .8, 300]]); }
          else { d.phase = 'burst'; d.burstT = C.t; quake(18); slowMo(.45); WORLD.flash = .3; WORLD.noir = .5; SND.boom(1.5); SFX.smash('glass', 1, d.x); SFX.smash('bottles', 1, d.x); camPunch(d.x, 60, 30, .12);
            INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'KRISSSHHH !!' : 'KRISSSHHH!!', x: sxW(d.x) * 1.5, y: 220, size: 54, t: 0, strong: true, rot: -.05 }); bigRumble([[0, 1, 1, 500], [550, .5, .4, 400]]);
            for (let k = 0; k < 70; k++) { const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 320; fx.push({ k: 'mshard', x: d.x, z: 60, y: 30, vx: Math.cos(a) * v, vz: Math.sin(a) * v * .3, vy: 80 + Math.random() * 260, t: 1.4 + Math.random() * .6, rot: Math.random() * 6, vr: (Math.random() - .5) * 30, cut: k < 40 }); } } } }
      if (d.vx) d.x += d.vx * dt; },
    ev: [[.4, C => quip(players[0], LANG === 'fr' ? 'Il y a un lièvre sur la boule à facettes !' : 'There’s a hare on the disco ball!', 2)], [.8, C => { C.d.hare = 1; SFX.jump('raccoon', C.d.x); }],
      [2.4, C => { const d = C.d; d.phase = 'fall'; d.vy = 0; d.bounce = 0; d.hare = 2; SFX.smash('metal', .5, d.x); quip(players[1] && players[1].ko <= 0 ? players[1] : players[0], LANG === 'fr' ? 'LA CHAÎNE !' : 'THE CHAIN!', 1.4); fx.push({ k: 'lane', z: 60, x0: d.x - 80, x1: d.x + 80, t: 1.2, T: 1.2, hw: 30 }); }],
      [4.4, C => { musicDuck(1); setDrop(C, [[C.d.x - 60, 10, 200], [C.d.x + 40, 20, 210], [C.d.x - 20, 6, 220], [C.d.x + 80, 14, 205]]); }],
      [5.4, C => { SETP.hold = false; }]],
    items: C => { const d = C.d; if (d.phase === 'burst') return []; return [{ key: 58, draw: () => { const x = sxW(d.x), ytop = d.phase === 'hang' ? 0 : -999; if (d.phase === 'hang') { g.save(); g.translate(x, 0); g.rotate(d.swing); drawDiscoBall(g, 0, 0, 120, 28, time); if (d.hare) { const hl = hareLook(77); drawRig(g, 0, 150, 1, RIG_S * .9, hl, POSES.flail ? POSES.flail(time) : POSES.idle(time), time, {}); } g.restore(); }
        else { shadow(d.x, 60, 0, 30); drawDiscoBall(g, x, sy(60, d.y + 28) - 38, 10, 28, time * 3); } } }]; },
    keep: C => { SETP.props.ball = { gone: true }; } },
  // =================== BOULDAIRE 4 — THE GOLDEN SCISSORS ===================
  scissors: { dur: 6.6,
    start: C => { const S = SETP.props.shears; C.d.S = S; C.d.x = S.wx; C.d.y = 150; C.d.rot = 0; C.d.phase = 'hang'; C.d.z = 50; },
    tick: (C, dt) => { const d = C.d;
      if (d.phase === 'hang') { d.rot = C.t > .8 ? Math.sin((C.t - .8) * 6) * .4 : 0; }
      if (d.phase === 'fall') { d.vy -= SPG * dt; d.y += d.vy * dt; if (d.y <= 0) { d.y = 0; d.phase = 'spin'; d.spinT = C.t; d.vx = 260; quake(16); camPunch(d.x, d.z, 24, .12); SND.crash(1.4); SFX.smash('metal', 1, d.x); splinters(d.x, d.z, 30, '#f4ead8', 1); fx.push({ k: 'ring', x: d.x, z: d.z, max: 90, t: .4, col: '#ffd23f' }); crushAt(d.x, d.z, 50, 30, 2);
          INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'TCHAK !!' : 'THWACK!!', x: sxW(d.x) * 1.5, y: 250, size: 48, t: 0, strong: true, rot: .06 }); bigRumble([[0, 1, .9, 400]]); } }
      if (d.phase === 'spin') { d.x += d.vx * dt; d.vx *= Math.pow(.6, dt); d.rot += dt * 26; quake(3); if (Math.random() < dt * 30) fx.push({ k: 'spark2', x: d.x + (Math.random() - .5) * 60, y: 2, z: d.z, vx: (Math.random() - .5) * 200, vy: -40 - Math.random() * 100, t: .4 });
        for (const q of players) if (q.ko <= 0 && !d.hit.has(q) && Math.abs(q.x - d.x) < 48 && Math.abs(q.z - d.z) < 18 && q.y < 30) { d.hit.add(q); if (q.dodge > 0) { hitPlayer(q, 0, 0, null); continue; } if (hitPlayer(q, 1, Math.sign(q.x - d.x) || 1, null)) { addStatus(q, 'bleed'); q.vx = (Math.sign(q.x - d.x) || 1) * 300; } }
        for (const e of enemies) if (!e.dead && !d.hit.has(e) && Math.abs(e.x - d.x) < 48 && Math.abs(e.z - d.z) < 18) { d.hit.add(e); hitEnemy(e, 3, Math.sign(e.x - d.x) || 1, null, 2); }
        for (const b of BREAK) if (!b.broken && Math.abs(b.x - d.x) < 40 + b.w / 2 && Math.abs(b.z - d.z) < 22) smash(b, 1);
        if (C.t - d.spinT > 1.9) { d.phase = 'stuck'; d.rot = .1; quake(12); SND.crash(1); SFX.smash('metal', .8, d.x); solidWreck(d.x, d.z, 40, 16, 90); camPunch(d.x, d.z, 14, .06);
          INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'SHTONK !' : 'SHTONK!', x: sxW(d.x) * 1.5, y: 240, size: 36, t: 0, strong: true, rot: -.08 }); } } },
    ev: [[.3, C => quip(players[0], LANG === 'fr' ? 'Les ciseaux d’or… ils bougent !' : 'The golden scissors… they’re moving!', 2)], [.8, C => { SFX.smash('metal', .4, C.d.x); }],
      [1.7, C => { const d = C.d; d.phase = 'fall'; d.vy = 0; d.y = 104; d.rot = 0; d.hit = new Set(); C.d.S.hang = 0; SFX.smash('metal', .6, d.x); fx.push({ k: 'lane', z: d.z, x0: d.x - 40, x1: camX + VW - 20, t: 1.6, T: 1.6, hw: 22 }); quip(players[1] && players[1].ko <= 0 ? players[1] : players[0], LANG === 'fr' ? 'ÉCARTEZ-VOUS !' : 'GET CLEAR!', 1.4); }],
      [4.8, C => { setDrop(C, [[camX + 140, 10, 200], [camX + 330, 20, 210], [camX + 520, 6, 220], [camX + 240, 14, 205]]); }],
      [5.6, C => { SETP.hold = false; }]],
    items: C => { const d = C.d; return [{ key: d.z, draw: () => { const x = sxW(d.x);
        if (d.phase === 'hang') drawGiantScissors(x, 78, d.rot, 1, true);
        else if (d.phase === 'fall') drawGiantScissors(x, sy(d.z, d.y + 80), 0, 1, false);
        else if (d.phase === 'spin') { shadow(d.x, d.z, 0, 40); g.save(); g.translate(x, sy(d.z, 10)); g.scale(1, .35); g.rotate(d.rot); g.translate(0, -30); drawGiantScissors(0, 0, 0, .9, false); g.restore(); }
        else drawGiantScissors(x, sy(d.z, 60), d.rot, 1, false); } }]; },
    keep: C => { const d = C.d; SETP.props.shearsStuck = { item: () => ({ key: d.z, draw: () => drawGiantScissors(sxW(d.x), sy(d.z, 60), .1, 1, false) }) }; } }
});
// mirror shards from the disco ball: they glint as they fly, and the first ones to reach you cut
function set3Fx(f, dt) { if (f.k !== 'mshard') return false; f.x += f.vx * dt; f.z = Math.max(-8, Math.min(DEPTH, f.z + f.vz * dt)); f.vy -= GRAV * dt; f.y = Math.max(0, f.y + f.vy * dt); f.rot += f.vr * dt; if (f.y === 0) { f.vx *= .7; f.vz *= .7; f.vr *= .5; }
  if (f.cut && f.y > 2) for (const q of players) if (q.ko <= 0 && Math.abs(q.x - f.x) < 10 && Math.abs(q.z - f.z) < 10 && f.y < q.y + 60) { f.cut = false; if (q.dodge > 0) { hitPlayer(q, 0, 0, null); break; } if (q.inv <= 0) { addStatus(q, 'bleed'); q.inv = .4; } break; }
  return true; }
function drawSet3Fx(f) { if (f.k !== 'mshard') return false; const x = f.x - camX, y = sy(f.z, f.y), gl = Math.sin(time * 20 + f.rot * 3) > .3; g.save(); g.translate(x, y); g.rotate(f.rot); g.fillStyle = gl ? '#ffffff' : ['#b8c8e0', '#ffc8e8', '#c8ffe8'][Math.abs(Math.round(f.rot * 3)) % 3]; g.fillRect(-2, -1.5, 4, 3); g.strokeStyle = LCI; g.lineWidth = .4; g.strokeRect(-2, -1.5, 4, 3); g.restore(); return true; }
