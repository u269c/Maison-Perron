// =====================================================================
// SELECT — the warrior select screen, arcade style. The screen is split down the middle: P1 on the left, P2 (or the
// computer) on the right. Each half: a 6×2 grid of portraits in profile on top; below, the highlighted warrior on a
// turntable, rotating in 3D while it runs through its combo and its special in place. Picking a warrior: it squares up,
// shouts its rallying cry, and settles into its fighting stance.
// =====================================================================
const RALLY = {
  amiral: ['Tout le monde sur le pont !', 'All hands on deck!'], marge: ['ON MONTE LE SON !', 'TURN IT UP!'], cyborg: ['Écraser.', 'Crush.'],
  papi: ['En selle, la jeunesse !', 'Saddle up, youngsters!'], ruby: ['Un, deux, trois, QUATRE !', 'One, two, three, FOUR!'], spora: ['Je vais pousser partout.', 'I’ll grow on them.'],
  magneto: ['Tout ce qui est en fer est à moi !', 'Anything made of iron is mine!'], doc: ['Je recouds après. Promis.', 'I’ll stitch them up after. Promise.'], demi: ['Chaud ou froid ? Les deux.', 'Hot or cold? Both.'],
  bernache: ['HOOONK !', 'HOOONK!'], raccoon: ['Réacteurs : allumés !', 'Jets: lit!'], soldier: ['CHAAARGEZ !', 'CHAAARGE!']
};
const SHEAD = {}, SEL_X = 330;   // SEL_X: where the turntable sits in each half
const selScale = id => Math.min(5.2, 196 / heroHeight(id, 1));   // where each warrior's head is, for the portraits (local units, scale 1, facing right)
function headOf(id) { if (SHEAD[id]) return SHEAD[id];
  if (id === 'papi') return SHEAD[id] = [-2.5, -41, 4.2]; if (id === 'spora') return SHEAD[id] = [0, -27, 8]; if (id === 'bernache') return SHEAD[id] = [10, -24.5, 4.6];
  const tmp = document.createElement('canvas').getContext('2d'), S = drawRig(tmp, 0, 0, 1, 1, hlook(id), POSES.idle(0, 0), 0, {}); return SHEAD[id] = [S.head[0], S.head[1], hlook(id).b.hr]; }
// the presentation loop for a hovered warrior: stance, hit, hit, finisher, stance, special, stance
function showcase(id, t) { const C = COMBOS[id] || COMBOS.soldier, SP = SPECIALS[id], seq = [['st', 1.1], ['c', C[0].dur * 2.2, 0], ['c', C[1].dur * 2.2, 1], ['c', C[2].dur * 2.2, 2], ['st', .7], ['sp', SP ? SP.dur : 1], ['st', .9]];
  const total = seq.reduce((a, s) => a + s[1], 0); let u = t % total; for (const s of seq) { if (u < s[1]) return { k: s[0], s: u / s[1], i: s[2], d: s[1] }; u -= s[1]; } return { k: 'st', s: 0 }; }
function showPose(id, sc, t, o) { const NR = NONRIG[id];
  if (sc.k === 'c') { const st = (COMBOS[id] || COMBOS.soldier)[sc.i]; o.atk = true; o.kind = st.kind || sc.i + 1; o.ks = sc.s; if (id === 'ruby') o.swing = 1; if (st.big && id === 'cyborg') o.piston = ph(sc.s).e; return st.pose ? st.pose(sc.s) : POSES.idle(t, 0); }
  if (sc.k === 'sp') { const SP = SPECIALS[id]; o.ss = sc.s; o.prop = SP.prop; if (SP.swing) o.swing = 1; if (SP.nonrig) o.spec = { k: SP.nonrig, s: sc.s }; if (SP.sq) { const [a, b] = SP.sq(sc.s); o.sqx = a; o.sqy = b; } return SP.pose ? SP.pose(sc.s) : POSES.idle(t, 0); }
  return NR ? POSES.idle(t, 0) : heroStance({ w: { id }, i: 0 }, t); }
function selRallySound(id) { try { const t = SND.now(), B = buses(); const f = id === 'bernache' ? 330 : id === 'cyborg' ? 90 : ['ruby', 'demi', 'doc', 'marge'].includes(id) ? 260 : 170;
  nz(t, .55, .25, 900, 1400, 'bandpass', 2.2); const o = tone(t, f, f * 1.5, .5, .12, 'sawtooth'); tone(t + .02, f * 2, f * 2.6, .4, .05, 'square'); drum('crash', t + .05, .7); } catch (e) {} }

function selectFrame(dt) {
  const ins = menuInputs(), N = WARRIORS.length; if (pressed.has('KeyL')) toggleLang();
  SEL.ht = SEL.ht || [0, 0]; SEL.lt = SEL.lt || [0, 0]; SEL.rot = SEL.rot || [.55, Math.PI - .55]; SEL.mo = SEL.mo || [{}, {}];
  const move = (k, inp) => { const dx = inp.tap || (inp.xEdge || 0), dz = inp.zEdge || 0, was = SEL.cur[k]; if (dx) { const row = Math.floor(SEL.cur[k] / 6), col = (SEL.cur[k] % 6 + dx + 6) % 6; SEL.cur[k] = row * 6 + col; } if (dz) SEL.cur[k] = (SEL.cur[k] + 6) % N; if (SEL.cur[k] !== was) { SEL.ht[k] = 0; beep(440, .03, 'square', .03); } };
  ins.forEach((inp, i) => { const zE = inp.z && !SEL['pz' + i] ? Math.sign(inp.z) : 0, xE = inp.x && !SEL['px' + i] && !inp.tap ? Math.sign(inp.x) : 0; SEL['pz' + i] = inp.z; SEL['px' + i] = inp.x; inp.zEdge = zE; inp.xEdge = xE; });
  // P1 drives the left; P2 the right — or P1 too, once P1 has picked (playing alone, the computer takes the right)
  const ctl = [[ins[0]], [ins[1]].concat(SEL.lock[0] ? [ins[0]] : [])];
  for (let k = 0; k < 2; k++) for (const inp of ctl[k]) { if (SEL.lock[k]) { if (inp.j && !(k === 0 && SEL.lock[1] && ins[0] === inp && SEL.cpu)) { SEL.lock[k] = false; beep(220, .06); } continue; }
    move(k, inp); if (inp.s) { SEL.cur[k] = (Math.random() * N) | 0; SEL.ht[k] = 0; }
    if (inp.a) { SEL.lock[k] = true; SEL.lt[k] = 0; if (k === 1) SEL.cpu = inp === ins[0] && ins[1] !== ins[0]; selRallySound(WARRIORS[SEL.cur[k]].id); WORLD.shake = 3; } }
  if (ins[0].j && !SEL.lock[0] && !SEL.lock[1]) { STATE = 'title'; }
  for (let k = 0; k < 2; k++) { SEL.ht[k] += dt; SEL.lt[k] += dt; SEL.rot[k] += dt * (SEL.lock[k] ? 0 : .6) * (k ? -1 : 1); if (SEL.lock[k]) { const rest = k ? Math.PI - .55 : .55, tg = rest + Math.round((SEL.rot[k] - rest) / (Math.PI * 2)) * Math.PI * 2; SEL.rot[k] += (tg - SEL.rot[k]) * Math.min(1, dt * 5); } }
  if (SEL.lock[0] && SEL.lock[1]) { SEL.goT = (SEL.goT || 0) + dt; if (SEL.goT > 1.6) beginStory(WARRIORS[SEL.cur[0]].id, WARRIORS[SEL.cur[1]].id); } else SEL.goT = 0;
  const cpuSide = SEL.cpu || (SEL.lock[0] && !SEL.lock[1]);
  m3dPace(dt);
  menuFrame(4, F => {
    // the two halves
    for (let k = 0; k < 2; k++) { const hx = k * 480; F.fillStyle = k ? 'rgba(20,40,80,.55)' : 'rgba(80,20,40,.55)'; F.fillRect(hx, 0, 480, 540);
      const gr = F.createRadialGradient(hx + SEL_X, 470, 10, hx + SEL_X, 420, 240); gr.addColorStop(0, k ? 'rgba(140,200,255,.35)' : 'rgba(255,150,190,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); F.fillStyle = gr; F.fillRect(hx, 170, 480, 370);
      F.fillStyle = 'rgba(0,0,0,.35)'; F.beginPath(); F.ellipse(hx + SEL_X, 474, 100, 15, 0, 0, 7); F.fill(); F.strokeStyle = k ? 'rgba(140,200,255,.6)' : 'rgba(255,150,190,.6)'; F.lineWidth = 2; F.beginPath(); F.ellipse(hx + SEL_X, 474, 100, 15, 0, 0, 7); F.stroke();
      // the grid of portraits
      WARRIORS.forEach((w, i) => { const col = i % 6, row = (i / 6) | 0, x = hx + 22 + col * 74, y = 36 + row * 66, on = SEL.cur[k] === i;
        F.fillStyle = on ? (k ? '#3a6ab8' : '#b83a6a') : '#2a2234'; F.fillRect(x, y, 70, 62); F.fillStyle = on ? (k ? '#9ad0ff' : '#ffb0d0') : '#4a3e58'; F.fillRect(x, y + 44, 70, 18);
        F.save(); F.beginPath(); F.rect(x, y, 70, 62); F.clip(); const [hx0, hy0, hr] = headOf(w.id), s = 13 / hr; const fl = FIDGETS[w.id];
        INKW = .9; drawHero(F, w.id, x + 34 - hx0 * s, y + 31 - hy0 * s, 1, s, POSES.idle(time * .6 + i, i), NONRIG[w.id] ? 0 : time + i, { idle: 'peck', speed: 0, walk: 0 }); F.restore(); });
      // the turntable
      const id = WARRIORS[SEL.cur[k]].id, locked = SEL.lock[k], o = {}, sc = locked ? { k: 'st' } : showcase(id, SEL.ht[k]); let pose = showPose(id, sc, time, o);
      if (locked) { if (SEL.lt[k] < .75) { pose = POSES.cheer(time * 1.4); o.shout = 1; } else pose = NONRIG[id] ? POSES.idle(time, 0) : heroStance({ w: { id }, i: k }, time); }
      const M = motionFor(SEL.mo[k], sc.k === 'c' && sc.i === 2 ? 160 : sc.k === 'c' ? 70 : 0, 1, 0, false, dt); o.hs = M.hs + Math.sin(time * 1.3 + k) * .08; o.hy = M.hy;
      const cs = Math.cos(SEL.rot[k]), sx = Math.sign(cs || 1) * Math.max(.16, Math.abs(cs)), big = selScale(id), lean = locked && SEL.lt[k] < .3 ? 1 + Math.sin(SEL.lt[k] / .3 * Math.PI) * .08 : 1;
      SEL['r' + k] = m3dInit() ? { id, pose, sc, o, lean } : null;
      if (!SEL['r' + k]) { F.save(); F.translate(hx + SEL_X, 472); F.scale(sx * lean, 2 - lean); INKW = .7; drawHero(F, id, 0, 0, 1, big, pose, time, o); F.restore(); INKW = STYLE_INK[4]; }
      if (sc.k === 'c' && sc.i === 2 && sc.s > .4 && sc.s < .7 || sc.k === 'sp' && sc.s > .35 && sc.s < .75) { F.save(); F.globalCompositeOperation = 'lighter'; const g2 = F.createRadialGradient(hx + SEL_X + sx * 80, 380, 4, hx + SEL_X + sx * 80, 380, 120); g2.addColorStop(0, 'rgba(255,240,200,.35)'); g2.addColorStop(1, 'rgba(255,240,200,0)'); F.fillStyle = g2; F.fillRect(hx, 200, 480, 300); F.restore(); }
      SEL['sc' + k] = sc; }
  });
  // the 3D models go on the overlay, above the comic filter, so they keep their colour and shine
  for (let k = 0; k < 2; k++) { const r = SEL['r' + k]; if (!r) continue; const R3 = m3dRender(r.id, r.pose, r.sc, SEL.rot[k], k, time, r.o, { hs: r.o.hs, hy: r.o.hy }); if (!R3) continue;
    const hx = k * 480, lean = r.lean, w = R3.w * lean, h = R3.h * (2 - lean); out.drawImage(R3.cv, hx + SEL_X - R3.ox * lean, 474 - R3.oy * (2 - lean), w, h);
    out.save(); out.globalCompositeOperation = 'lighter'; for (const [gx, gy, gr, gc] of R3.glow) { const X = hx + SEL_X + (gx - R3.ox) * lean, Y = 474 + (gy - R3.oy) * (2 - lean), rr = gr * 4 + 6, g3 = out.createRadialGradient(X, Y, 0, X, Y, rr); g3.addColorStop(0, gc + '66'); g3.addColorStop(1, gc + '00'); out.fillStyle = g3; out.fillRect(X - rr, Y - rr, rr * 2, rr * 2); } out.restore(); }
  // lettering on top
  for (let k = 0; k < 2; k++) { const hx = k * 480, w = WARRIORS[SEL.cur[k]], id = w.id, sc = SEL['sc' + k] || {}, cpu = k === 1 && cpuSide, L = LANG === 'en' ? 1 : 0;
    bigText(k ? (cpu ? UI[LANG].cpu : UI[LANG].p2) : UI[LANG].p1, hx + 22, 20, 20, k ? '#8ad8ff' : '#ffb0d0', 'left');
    bigText(SEL.lock[k] ? (LANG === 'fr' ? 'PRÊT !' : 'READY!') : (LANG === 'fr' ? 'CHOISIS TON GUERRIER' : 'PICK YOUR WARRIOR'), hx + 458, 20, 14, SEL.lock[k] ? '#7dffc0' : '#f4ead8', 'right');
    WARRIORS.forEach((ww, i) => { if (SEL.cur[k] !== i) return; const col = i % 6, row = (i / 6) | 0, x = hx + 22 + col * 74, y = 36 + row * 66; out.lineWidth = SEL.lock[k] ? 5 : 3.5; out.strokeStyle = k ? '#8ad8ff' : '#ffb0d0'; out.strokeRect(x - 1, y - 1, 72, 64); });
    out.lineWidth = 1.2; out.strokeStyle = 'rgba(0,0,0,.6)'; WARRIORS.forEach((ww, i) => { const col = i % 6, row = (i / 6) | 0; out.strokeRect(hx + 22 + col * 74, 36 + row * 66, 70, 62); });
    bigText(nameOf(id).toUpperCase(), hx + 24, 192, 24, '#ffe88a', 'left'); out.font = '600 12px Georgia, serif'; out.textAlign = 'left'; out.fillStyle = '#f4ead8'; out.fillText(`${UI[LANG].roles[ROLE[id]]} · ${LANG === 'fr' ? 'Spécial' : 'Special'} : ${w.sp}`, hx + 24, 216);
    const labs = LANG === 'fr' ? ['Vie', 'Vitesse', 'Force', 'Portée', 'Spécial'] : ['Health', 'Speed', 'Power', 'Reach', 'Special'];
    labs.forEach((lb, j) => { const y = 238 + j * 20; out.font = '700 10px system-ui, sans-serif'; out.fillStyle = '#e8e0d0'; out.fillText(lb, hx + 24, y + 9); for (let q = 0; q < 5; q++) { out.fillStyle = q < w.st[j] ? (k ? '#8ad8ff' : '#ffb0d0') : 'rgba(255,255,255,.15)'; out.fillRect(hx + 78 + q * 13, y + 1, 11, 9); } });
    if (sc.k === 'c' && sc.i === 2) { const S3 = (COMBOS[id] || COMBOS.soldier)[2]; if (S3.name) bigText(S3.name[L], hx + SEL_X + 20, 236 - Math.sin(sc.s * Math.PI) * 6, 20, '#fff', 'center'); }
    if (sc.k === 'sp') bigText(w.sp.toUpperCase(), hx + SEL_X + 20, 236, 22, '#ffd23f', 'center');
    if (SEL.lock[k] && SEL.lt[k] < 2.2) { const a = Math.min(1, (2.2 - SEL.lt[k]) * 2), x0 = hx + SEL_X + 6, y0 = 472 - heroHeight(id, selScale(id)) + 8; out.globalAlpha = a; balloon(out, 4, RALLY[id][L], x0, y0, 1, true, 104, 1); out.globalAlpha = 1; }
    out.font = '600 11px Georgia, serif'; out.textAlign = 'center'; out.fillStyle = '#e8e0d0'; out.strokeStyle = OUT; out.lineWidth = 3;
    const hint = SEL.lock[k] ? (LANG === 'fr' ? 'Saut : changer d’avis' : 'Jump: change your mind') : (LANG === 'fr' ? '◀ ▶ ▲ ▼ choisir · Frapper : valider · Spécial : au hasard' : '◀ ▶ ▲ ▼ choose · Attack: pick · Special: random');
    out.strokeText(hint, hx + 240, 522); out.fillText(hint, hx + 240, 522); }
  if (SEL.lock[0] && !SEL.lock[1] && !SEL.cpu) { out.font = '700 12px Georgia, serif'; out.textAlign = 'center'; const h = LANG === 'fr' ? 'Seul ? Choisis aussi ton partenaire : l’ordinateur le jouera.' : 'Alone? Pick your partner too: the computer will play them.'; out.strokeText(h, 720, 504); out.fillStyle = '#ffe88a'; out.fillText(h, 720, 504); }
  out.fillStyle = OUT; out.fillRect(478, 0, 4, 540);
  if (SEL.lock[0] && SEL.lock[1]) { const u = Math.min(1, SEL.goT * 2); bigText(LANG === 'fr' ? 'C’EST PARTI !' : 'GAME ON!', 480, 300, 40 + u * 24, '#ffd23f'); }
  out.strokeStyle = OUT; out.lineWidth = 5; out.strokeRect(2.5, 2.5, 955, 535); out.setTransform(1, 0, 0, 1, 0, 0); pressed.clear();
}
