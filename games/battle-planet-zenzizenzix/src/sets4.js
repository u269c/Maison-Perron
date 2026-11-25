// =====================================================================
// SET PIECES, WORLD 4 — Zombimare:
//   The storm: lightning hunts the warriors (a red ring, then the bolt), and in its light the dead climb out of their graves.
//   The mausoleum: the ground shakes, the great bronze doors burst off their hinges and skid across the cemetery, a
//     clatter of bones spills out, then the skeletons march through the doorway.
//   The storm of crows: a black flock sweeps low across the cemetery, there and back, pecking everyone in its way.
//   The bells: in the nave the great bell starts to swing. Every DONG shakes the floor: anyone standing on it is
//     dizzy. Jump on the beat.
// =====================================================================
Object.assign(SET3_INIT, {
  cimetiere: () => { SETP.props.maus = { wx: 1430, open: 0, back: () => drawMausoleum(SETP.props.maus) }; },
  nef: () => { SETP.props.bell = { a: 0, va: 0, back: () => drawBell(SETP.props.bell) }; }
});
function drawMausoleum(M) { const x = sxW(M.wx), base = FLOOR - 1; if (x < -200 || x > VW + 200) return;
  zpoly(g, [[x - 80, base], [x + 80, base], [x + 80, base - 96], [x - 80, base - 96]], '#a8a8a2', ZK); zpoly(g, [[x - 92, base - 96], [x + 92, base - 96], [x, base - 140]], '#8a8a86', ZK);
  for (const dx of [-70, -52, 52, 70]) { zr(g, x + dx - 5, base - 96, 10, 96, '#c8c8c0'); g.strokeStyle = ZK; g.lineWidth = .8; g.strokeRect(x + dx - 5 + .5, base - 96 + .5, 9, 95); }
  g.fillStyle = ZK; g.font = 'bold 7px serif'; g.textAlign = 'center'; g.fillText(LANG === 'fr' ? 'FAMILLE CRÂNEBLANC' : 'THE BONEWHITE FAMILY', x, base - 102); g.textAlign = 'left';
  zr(g, x - 34, base - 78, 68, 78, '#0c0c0e');   // the doorway
  if (!M.open) { zpoly(g, [[x - 34, base], [x, base], [x, base - 78], [x - 34, base - 78]], '#6a6a5e', ZK); zpoly(g, [[x, base], [x + 34, base], [x + 34, base - 78], [x, base - 78]], '#5e5e54', ZK); disc(g, x - 5, base - 40, 2, '#c8a040'); disc(g, x + 5, base - 40, 2, '#c8a040');
    if (M.shake) { g.fillStyle = GRN; g.fillRect(x - 1, base - 78, 2, 78); } }
  else { for (let k = 0; k < 3; k++) { g.fillStyle = `rgba(110,232,58,${.15 + Math.sin(time * 3 + k) * .08})`; g.beginPath(); g.ellipse(x, base - 30, 30 - k * 8, 40 - k * 10, 0, 0, 7); g.fill(); } } }
function drawBell(B) { const cx = VW * .5 + Math.sin(time * .1) * 0, top = 0, L = 70; g.save(); g.translate(cx, top); g.rotate(B.a);
  g.strokeStyle = ZK; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, L - 30); g.stroke(); zr(g, -10, L - 34, 20, 6, '#3a3a3a');
  zpoly(g, [[-12, L - 28], [12, L - 28], [16, L - 10], [26, L + 10], [-26, L + 10], [-16, L - 10]], '#c8a040', ZK); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-10, L - 24, 3, 30); disc(g, Math.sin(B.a * 3) * 8, L + 12, 4, '#8a6a20');
  g.restore(); }
function boltDraw(x, z, u) { const X = x - camX, Y = sy(z, 0); g.strokeStyle = `rgba(255,255,255,${1 - u})`; g.lineWidth = 3 - u * 2; g.beginPath(); let px = X + (Math.random() - .5) * 20, py = 0; g.moveTo(px, py); while (py < Y) { px += (Math.random() - .5) * 18; py = Math.min(Y, py + 16 + Math.random() * 14); px += (X - px) * .2; g.lineTo(px, py); } g.stroke(); }
Object.assign(SETDEF, {
  storm: { dur: 5.4,
    start: C => { C.d.bolts = []; },
    ev: [[.4, C => strikeMark(C)], [1.6, C => strikeMark(C)], [2.8, C => strikeMark(C)],
         [3.9, C => { C.wave.forEach(([type, from], k) => { spawn(type, 'R', k); const e = enemies[enemies.length - 1]; e.x = camX + 120 + k * 140 + Math.random() * 40; e.z = 10 + (k * 37) % (DEPTH - 20); e.onScr = true; e.face = -1; if (W4SKEL[type]) { e.state = 'rise'; e.riseT = 1.2; } });
           WORLD.flash = .35; quake(6); for (let k = 0; k < 4; k++) puff(camX + 120 + k * 140, 40, 6, 0, 1.4); INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'ILS SE RÉVEILLENT !' : 'THEY’RE WAKING UP!', x: 480, y: 160, size: 30, t: 0, rot: -.05 }); }]],
    tick: (C, dt) => { for (const b of C.d.bolts) { b.t += dt; if (!b.hit && b.t >= .8) { b.hit = true; WORLD.flash = Math.max(WORLD.flash, .45); quake(5); SND.boom(.9); fx.push({ k: 'ring', x: b.x, z: b.z, max: 50, t: .35, col: '#ffffff' });
          DECALS.push({ x: b.x, z: b.z, col: '#1a1a1a', t: 6, T: 6, r: 12, kind: 'blood', grow: 0 });
          for (const q of players) if (q.ko <= 0 && q.fall <= 0 && Math.abs(q.x - b.x) < 30 && Math.abs(q.z - b.z) < 14 && q.y < 40 && hitPlayer(q, 2, Math.sign(q.x - b.x) || 1, null)) q.vy = 200;
          for (const e of enemies) if (!e.dead && e.state !== 'pile' && Math.abs(e.x - b.x) < 30 && Math.abs(e.z - b.z) < 14) hitEnemy(e, 3, Math.sign(e.x - b.x) || 1, null); } } },
    items: C => C.d.bolts.map(b => ({ key: b.z + .1, draw: () => { if (b.t < .8) { const u = b.t / .8; g.strokeStyle = `rgba(220,30,30,${.4 + u * .6})`; g.lineWidth = 1.5; g.beginPath(); g.ellipse(b.x - camX, sy(b.z, 0), 30 * (1.3 - u * .3), 10 * (1.3 - u * .3), 0, 0, 7); g.stroke(); } else if (b.t < 1.15) boltDraw(b.x, b.z, (b.t - .8) / .35); } })) },
  mausolee: { dur: 7,
    start: C => { C.d.slabs = []; },
    ev: [[.3, C => { const M = SETP.props.maus; if (M) M.shake = 1; quake(4); bigRumble([[0, .3, .5, 400]]); }], [1.0, () => quake(6)],
         [1.7, C => { const M = SETP.props.maus; if (!M) return; M.open = 1; M.shake = 0; quake(12); SND.boom(1.2); SFX.smash('car', 1, M.wx); WORLD.flash = .2; camPunch(M.wx, 0, 30, .12);
           INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'BRAOUM !' : 'KA-BRAOOM!', x: (M.wx - camX) * 1.5, y: 150, size: 40, t: 0, rot: -.08 });
           C.d.slabs = [{ x: M.wx - 18, z: 6 + Math.random() * 30, vx: -330, rot: 0, hit: new Set() }, { x: M.wx + 18, z: 60 + Math.random() * 50, vx: 330, rot: 0, hit: new Set() }];
           for (let k = 0; k < 18; k++) fx.push({ k: 'debris', x: M.wx + (Math.random() - .5) * 40, z: 2, y: 30 + Math.random() * 40, vx: (Math.random() - .5) * 340, vy: 120 + Math.random() * 200, rot: 0, vr: 14, t: 1.6, col: BONE, w: 3 + Math.random() * 5 }); }],
         [3.4, C => { const M = SETP.props.maus; const x0 = M ? M.wx : camX + VW / 2; setDrop(C, [[x0 - 10, 4, 0], [x0 + 10, 8, 0], [x0, 12, 0], [x0 + 4, 16, 0]]); for (const e of enemies) if (e.y > 0 && W4T[e.type]) { e.y = 0; e.vy = 0; } }]],
    tick: (C, dt) => { for (const s of C.d.slabs) { s.x += s.vx * dt; s.vx *= Math.pow(.6, dt); s.rot += dt * 2;
        if (Math.abs(s.vx) > 80) for (const q of players) if (!s.hit.has(q) && q.ko <= 0 && Math.abs(q.x - s.x) < 22 && Math.abs(q.z - s.z) < 14 && q.y < 20) { s.hit.add(q); if (hitPlayer(q, 2, Math.sign(s.vx), null)) { q.vy = 220; q.vx = Math.sign(s.vx) * 280; } } } },
    items: C => C.d.slabs.map(s => ({ key: s.z, draw: () => { const x = s.x - camX, y = sy(s.z, 0); g.save(); g.translate(x, y); g.rotate(Math.sin(s.rot) * .08); zpoly(g, [[-18, 0], [18, 0], [18, -6], [-18, -6]], '#6a6a5e', ZK); disc(g, 0, -3, 1.6, '#c8a040'); g.restore(); if (Math.abs(s.vx) > 60) { g.fillStyle = 'rgba(200,200,190,.5)'; g.fillRect(x - Math.sign(s.vx) * 30, y - 4, 10, 2); } } })),
    keep: C => { } },
  crows: { dur: 7,
    start: C => { C.d.flock = []; },
    ev: [[.3, C => flock(C, -1)], [3.6, C => flock(C, 1)], [6.2, C => C.wave.forEach(([type, from], k) => spawn(type, from, k))]],
    tick: (C, dt) => { for (const b of C.d.flock) { b.x += b.vx * dt; b.y = b.y0 + Math.sin(time * 6 + b.ph) * 6;
        for (const q of players) if (!b.hit.has(q) && q.ko <= 0 && q.dodge <= 0 && Math.abs(q.x - b.x) < 10 && Math.abs(q.z - b.z) < 10 && b.y < q.y + 64 && b.y > q.y + 10) { b.hit.add(q); hitPlayer(q, 1, Math.sign(b.vx), null); }
        for (const e of enemies) if (!e.dead && e.state !== 'pile' && !b.hit.has(e) && Math.abs(e.x - b.x) < 10 && Math.abs(e.z - b.z) < 10) { b.hit.add(e); hitEnemy(e, 1, Math.sign(b.vx), null, .5); } }
      C.d.flock = C.d.flock.filter(b => b.x > camX - 120 && b.x < camX + VW + 120); if (Math.random() < dt * (C.d.flock.length > 5 ? 6 : 0)) beep(900 + Math.random() * 300, .08, 'sawtooth', .03, -500); },
    items: C => C.d.flock.map(b => ({ key: b.z, draw: () => { const x = b.x - camX, y = sy(b.z, b.y), f = Math.sin(time * 18 + b.ph) * 4, s = Math.sign(b.vx);
        g.strokeStyle = '#0c0c0e'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x - 7, y - f); g.quadraticCurveTo(x - 3, y - 2, x, y); g.quadraticCurveTo(x + 3, y - 2, x + 7, y - f); g.stroke(); g.fillStyle = '#0c0c0e'; g.beginPath(); g.ellipse(x, y, 4, 2.2, 0, 0, 7); g.fill(); g.fillStyle = '#e8c040'; g.fillRect(x + s * 4, y - .6, s * 2.4, 1.2); } })) },
  bells: { dur: 8.6,
    start: C => { C.d.peal = 0; INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'SAUTEZ SUR LE DONG !' : 'JUMP ON THE DONG!', x: 480, y: 120, size: 26, t: 0, rot: -.04 }); },
    ev: [[1.5, C => peal(C)], [3.2, C => peal(C)], [4.9, C => peal(C)], [6.6, C => peal(C)], [7.6, C => setDrop(C, [[camX + 60, 30, 0], [camX + VW - 60, 70, 0], [camX + 80, 90, 0], [camX + VW - 80, 20, 0]])]],
    tick: (C, dt) => { const B = SETP.props.bell; if (B) { B.va += (-B.a * 12 - B.va * .4) * dt; B.va += Math.sin(time * 3.6) * 2.5 * dt; B.a += B.va * dt; } } }
});
function strikeMark(C) { const alive = players.filter(q => q.ko <= 0 && q.fall <= 0); const q = alive[(Math.random() * alive.length) | 0]; if (!q) return; C.d.bolts.push({ x: q.x + (Math.random() - .5) * 20, z: q.z, t: 0, hit: false }); beep(300, .5, 'sawtooth', .02, 900); }
function flock(C, dir) { const x0 = dir < 0 ? camX + VW + 80 : camX - 80; for (let k = 0; k < 24; k++) C.d.flock.push({ x: x0 - dir * Math.random() * 160, z: Math.random() * DEPTH, y0: 18 + Math.random() * 40, y: 30, vx: dir * (300 + Math.random() * 80), ph: Math.random() * 6, hit: new Set() });
  INKFX.push({ k: 'sfx', text: LANG === 'fr' ? 'CROÂ ! CROÂ !' : 'CAW! CAW!', x: dir < 0 ? 820 : 140, y: 140, size: 30, t: 0, rot: dir * .06 }); }
function peal(C) { const B = SETP.props.bell; if (B) B.va += (B.a > 0 ? -1 : 1) * 2.2; C.d.peal++; quake(7); SND.boom(.5); try { const t = SND.now(); for (const [f, v] of [[110, .3], [220, .16], [277, .1], [330, .08]]) tone(t, f, f * .995, 2.8, v, 'sine', undefined, .004); } catch (e) {}
  INKFX.push({ k: 'sfx', text: 'DONG !', x: 480, y: 90, size: 44, t: 0, rot: (Math.random() - .5) * .2 });
  for (const q of players) if (q.ko <= 0 && q.fall <= 0 && q.y < 6 && q.dodge <= 0) addStatus(q, 'dizzy');
  for (const e of enemies) if (!e.dead && e.state !== 'pile' && e.y < 6 && !W4BIG[e.type]) { e.state = 'hurt'; e.stun = 1; } }
