// =====================================================================
// FLOW — title, pick two warriors, the prologue, the level, the ending.
// =====================================================================
const UI = {
  fr: { press: 'Appuie sur une touche ou un bouton', world: 'MONDE 1 · HAVRE', pick: 'Choisissez vos deux guerriers', p1: 'J1', p2: 'J2', hint: 'J1 : W A S D + F · J2 : flèches + K · manettes : croix + attaque · spécial : au hasard · saut : annuler', solo: 'Seul ? Choisis les deux.', duo: 'Duo idéal : ', go: 'C’est parti !', cont: 'À SUIVRE…', again: 'Frapper : retour au titre', esc: 'Villen-Hüüs s’est enfui avec le rouage de Havre.', lang: 'EN', roles: { Ranged: 'Tir', Tank: 'Tank', Bruiser: 'Cogneur', Support: 'Soutien', Trickster: 'Ruse', Speedster: 'Vitesse' },
    help: '<b>J1</b> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> bouger · <kbd>Espace</kbd> sauter · <kbd>F</kbd> frapper · <kbd>G</kbd> spécial · <b>double avant</b> charge · <b>double arrière</b> esquive', help2: '<b>J2</b> flèches · <kbd>Maj droite</kbd> sauter · <kbd>K</kbd> frapper · <kbd>L</kbd> spécial', help3: '<kbd>Entrée</kbd> passer les dialogues · <kbd>Échap</kbd> pause · manettes : le premier bouton pressé choisit le joueur' },
  en: { press: 'Press any key or button', world: 'WORLD 1 · HAVRE', pick: 'Pick your two warriors', p1: 'P1', p2: 'P2', hint: 'P1: W A S D + F · P2: arrows + K · pads: d-pad + attack · special: random · jump: undo', solo: 'Alone? Pick both.', duo: 'Best partner: ', go: 'Here we go!', cont: 'TO BE CONTINUED…', again: 'Attack: back to title', esc: 'Villen-Hüüs escaped with the Havre gear.', lang: 'FR', roles: { Ranged: 'Ranged', Tank: 'Tank', Bruiser: 'Bruiser', Support: 'Support', Trickster: 'Trickster', Speedster: 'Speedster' },
    help: '<b>P1</b> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move · <kbd>Space</kbd> jump · <kbd>F</kbd> attack · <kbd>G</kbd> special · <b>double-tap forward</b> charge · <b>double-tap back</b> dodge', help2: '<b>P2</b> arrows · <kbd>Right Shift</kbd> jump · <kbd>K</kbd> attack · <kbd>L</kbd> special', help3: '<kbd>Enter</kbd> skip dialogue · <kbd>Esc</kbd> pause · pads: the first button pressed picks the player' }
};
const ROLE = { amiral: 'Ranged', marge: 'Tank', cyborg: 'Tank', papi: 'Bruiser', ruby: 'Ranged', spora: 'Support', magneto: 'Trickster', doc: 'Support', demi: 'Trickster', bernache: 'Speedster', raccoon: 'Speedster', soldier: 'Bruiser' };
const PARTNER = { amiral: 'spora', spora: 'amiral', marge: 'ruby', ruby: 'marge', cyborg: 'raccoon', raccoon: 'cyborg', papi: 'bernache', bernache: 'papi', magneto: 'demi', demi: 'magneto', doc: 'soldier', soldier: 'doc' };
let STATE = 'title', SEL = null, endT = 0, last = performance.now();
const wById = id => WARRIORS.find(w => w.id === id);
function nameOf(id) { return LANG === 'fr' ? VOICE[id].full[0].replace(/^l’/, 'L’').replace(/^le /, 'Le ') : VOICE[id].full[1].replace(/^the /, 'The '); }
function menuInputs() { assignPads(); return [readInput(0), readInput(1)]; }
function menuFrame(style, drawFg) {
  INKW = STYLE_INK[4];
  bgX.setTransform(1, 0, 0, 1, 0, 0); bgX.clearRect(0, 0, RW, RH); fgX.setTransform(1, 0, 0, 1, 0, 0); fgX.clearRect(0, 0, RW, RH);
  bgX.setTransform(2, 0, 0, 2, 0, 0); fgX.setTransform(2, 0, 0, 2, 0, 0); stageHavre(bgX, time); drawFg(fgX);
  if (GL) GL.draw(bgH, fgH, style, time, 2, DIM, WORLD.noir || 0, 680); else { const c = cv.getContext('2d'); c.drawImage(bgH, 0, 0); c.drawImage(fgH, 0, 0); }
  out.setTransform(1, 0, 0, 1, 0, 0); out.clearRect(0, 0, RW, RH); out.setTransform(2, 0, 0, 2, 0, 0);
}
function bigText(t, x, y, size, fill, al = 'center', font = 'Impact, "Arial Black", sans-serif') { out.font = `900 ${size}px ${font}`; out.textAlign = al; out.textBaseline = 'middle'; out.lineJoin = 'round'; out.lineWidth = size / 6; out.strokeStyle = OUT; out.strokeText(t, x, y); out.fillStyle = fill; out.fillText(t, x, y); }
// ---- title -------------------------------------------------------------
function titleFrame(dt) {
  const ins = menuInputs(); if (ins.some(i => i.a || i.j || i.s || i.start) || pressed.has('Enter') || pressed.has('Space')) { STATE = 'select'; SEL = { cur: [0, 1], lock: [false, false], solo: false }; beep(660, .1, 'triangle', .05, 200); }
  if (pressed.has('KeyL')) toggleLang();
  menuFrame(4, F => { WARRIORS.forEach((w, k) => { const id = w.id, x = 70 + k * 74, face = k % 2 ? -1 : 1, fl = FIDGETS[id], ph = (time * .45 + k * .37) % ((fl ? fl.length : 1) + 2);
    const pose = fl && ph < fl.length ? POSES[fl[Math.floor(ph)]](time + k) : POSES.idle(time, k); drawHero(F, id, x, 500 - (k % 2) * 14, face, 1.55, pose, time + k, { idle: Math.sin(time + k) > 0 ? 'peck' : 'preen', walk: time * 4, speed: 0 }); }); });
  const wob = Math.sin(time * 2) * 2;
  out.save(); out.translate(480, 150); out.rotate(-.04); burst(out, 0, 0, 330, 110, 18, .1, '#ffe88a', OUT, 4); out.restore();
  bigText('BATTLE PLANET', 480, 118 + wob, 64, '#e8402a'); bigText('ZENZIZENZIX', 480, 182 - wob, 52, '#2a3a7a');
  bigText(UI[LANG].world, 480, 250, 22, '#f4ead8'); if (Math.floor(time * 2) % 2) bigText(UI[LANG].press, 480, 300, 18, '#fff');
  out.font = '600 12px Georgia, serif'; out.fillStyle = '#fff'; out.textAlign = 'right'; out.fillText('L : ' + (LANG === 'fr' ? 'English' : 'Français'), 948, 528); out.textAlign = 'left';
  out.strokeStyle = OUT; out.lineWidth = 5; out.strokeRect(2.5, 2.5, 955, 535); out.setTransform(1, 0, 0, 1, 0, 0); pressed.clear();
}
// ---- pick two -------------------------------------------------------------
function selectFrame(dt) {
  const ins = menuInputs(), N = WARRIORS.length; if (pressed.has('KeyL')) toggleLang();
  const move = (k, inp) => { const dx = inp.tap || (inp.xEdge || 0), dz = inp.zEdge || 0; if (dx) SEL.cur[k] = (SEL.cur[k] + dx + N) % N; if (dz) SEL.cur[k] = (SEL.cur[k] + dz * 6 + N) % N; if (dx || dz) beep(440, .03, 'square', .03); };
  ins.forEach((inp, i) => { const zE = inp.z && !SEL['pz' + i] ? Math.sign(inp.z) : 0, xE = inp.x && !SEL['px' + i] && !inp.tap ? Math.sign(inp.x) : 0; SEL['pz' + i] = inp.z; SEL['px' + i] = inp.x; inp.zEdge = zE; inp.xEdge = xE; });
  // P1 controls slot 0; once locked, P1 can also pick slot 1 (playing alone). P2 always controls slot 1.
  const ctl = [[ins[0]], [ins[1]].concat(SEL.lock[0] ? [ins[0]] : [])];
  for (let k = 0; k < 2; k++) for (const inp of ctl[k]) { if (SEL.lock[k]) { if (inp.j) { SEL.lock[k] = false; beep(220, .06); } continue; }
    move(k, inp); if (inp.s) { let r; do r = (Math.random() * N) | 0; while (SEL.lock[1 - k] && r === SEL.cur[1 - k]); SEL.cur[k] = r; }
    if (inp.a && !(SEL.lock[1 - k] && SEL.cur[1 - k] === SEL.cur[k])) { SEL.lock[k] = true; beep(880, .12, 'triangle', .05, 300); if (k === 0 && !SEL.lock[1] && SEL.cur[1] === SEL.cur[0]) SEL.cur[1] = (SEL.cur[0] + 1) % N; } }
  if (ins[0].j && !SEL.lock[0] && !SEL.lock[1]) { STATE = 'title'; }
  if (SEL.lock[0] && SEL.lock[1]) { SEL.goT = (SEL.goT || 0) + dt; if (SEL.goT > .8) beginStory(WARRIORS[SEL.cur[0]].id, WARRIORS[SEL.cur[1]].id); }
  const cw = 142, ch = 196, x0 = 30, y0 = 58;
  menuFrame(4, F => { WARRIORS.forEach((w, k) => { const col = k % 6, row = (k / 6) | 0, x = x0 + col * (cw + 8), y = y0 + row * (ch + 14), hot = SEL.cur[0] === k || SEL.cur[1] === k;
    F.fillStyle = hot ? '#f6ecd4' : '#e8dcc0'; F.fillRect(x, y, cw, ch); F.fillStyle = 'rgba(0,0,0,.08)'; F.fillRect(x, y + ch - 46, cw, 46);
    F.save(); F.beginPath(); F.rect(x, y, cw, ch); F.clip(); const fl = FIDGETS[w.id], pose = hot ? POSES.cheer(time + k) : fl ? POSES[fl[Math.floor(time * .4 + k) % fl.length]](time + k) : POSES.idle(time, k);
    drawHero(F, w.id, x + cw / 2, y + ch - 52, 1, 1.7, pose, time + k, { idle: 'peck', speed: hot ? 1 : 0, walk: time * 5, atk: hot && w.id !== 'papi' }); F.restore(); }); });
  WARRIORS.forEach((w, k) => { const col = k % 6, row = (k / 6) | 0, x = x0 + col * (cw + 8), y = y0 + row * (ch + 14);
    out.font = 'bold 13px Impact, "Arial Black", sans-serif'; out.textAlign = 'center'; out.fillStyle = OUT; out.fillText(nameOf(w.id).toUpperCase(), x + cw / 2, y + ch - 28); out.font = '600 11px Georgia, serif'; out.fillStyle = '#5a3a2a'; out.fillText(UI[LANG].roles[ROLE[w.id]], x + cw / 2, y + ch - 12);
    out.lineWidth = 3; out.strokeStyle = OUT; out.strokeRect(x, y, cw, ch);
    for (let s = 0; s < 2; s++) if (SEL.cur[s] === k) { out.lineWidth = SEL.lock[s] ? 7 : 4; out.strokeStyle = s ? '#3a8ad8' : '#e84a8a'; out.strokeRect(x - 3 - s * 4, y - 3 - s * 4, cw + 6 + s * 8, ch + 6 + s * 8); bigText(s ? UI[LANG].p2 : UI[LANG].p1, x + (s ? cw - 18 : 18), y + 16, 18, s ? '#8ad8ff' : '#ffb0d0'); if (SEL.lock[s]) bigText('✓', x + (s ? cw - 18 : 18), y + 42, 22, '#7dffc0'); } });
  out.textAlign = 'left'; bigText(UI[LANG].pick, 480, 30, 26, '#ffe88a');
  const hover = WARRIORS[SEL.cur[SEL.lock[0] ? 1 : 0]].id, pn = PARTNER[hover]; bigText(`${nameOf(hover)} · ${wById(hover).sp} · ${UI[LANG].duo}${nameOf(pn)}`, 480, 492, 15, '#fff');
  out.font = '600 12px Georgia, serif'; out.textAlign = 'center'; out.fillStyle = '#fff'; out.strokeStyle = OUT; out.lineWidth = 3; const h = UI[LANG].hint + (SEL.lock[0] && !SEL.lock[1] ? ' · ' + UI[LANG].solo : ''); out.strokeText(h, 480, 520); out.fillText(h, 480, 520); out.textAlign = 'left';
  if (SEL.lock[0] && SEL.lock[1]) bigText(UI[LANG].go, 480, 270, 54, '#ffd23f');
  out.strokeStyle = OUT; out.lineWidth = 5; out.strokeRect(2.5, 2.5, 955, 535); out.setTransform(1, 0, 0, 1, 0, 0); pressed.clear();
}
// ---- story ---------------------------------------------------------------
function beginStory(a, b) { STORY = buildStory(a, b, (Date.now() ^ (Math.random() * 1e9)) >>> 0); STATE = 'prologue'; INKFX = []; WORLD.noir = 0; startPrologue(a, b, STORY, () => startPlay(a, b)); }
function startPlay(a, b) { STATE = 'play'; INKFX = []; WORLD.noir = 0; newGame([wById(a), wById(b)]); endT = 0; LASTBOSS = null; QUIPS.length = 0; playLines(STORY.battle, true); }
function toTitle() { STATE = 'title'; enemies = []; fx = []; INKFX = []; QUIPS.length = 0; DLG.q = []; DLG.cur = null; DLG.blocking = false; WORLD.noir = 0; WORLD.levelDone = false; }
function endOverlay() {
  out.setTransform(2, 0, 0, 2, 0, 0); out.fillStyle = 'rgba(10,7,16,.5)'; out.fillRect(0, 0, 960, 540);
  out.save(); out.translate(480, 200); out.rotate(-.05); burst(out, 0, 0, 300, 90, 16, .1, '#ffe88a', OUT, 4); out.restore(); bigText(UI[LANG].cont, 480, 200, 54, '#e8402a');
  caption(out, 4, UI[LANG].esc, 480 - out.measureText(UI[LANG].esc).width / 2 - 60, 300);
  const L = T[LANG]; players.forEach((p, k) => bigText(`${k ? L.p2 : L.p1} ${nameOf(p.w.id)} · ${L.ffc} : ${p.ff}`, 480, 370 + k * 30, 18, k ? '#8ad8ff' : '#ffb0d0'));
  if (Math.floor(time * 2) % 2) bigText(UI[LANG].again, 480, 460, 18, '#fff'); out.setTransform(1, 0, 0, 1, 0, 0);
}
function toggleLang() { LANG = LANG === 'fr' ? 'en' : 'fr'; try { localStorage.setItem('bp-lang', LANG); } catch (e) {} helpBar(); }
function helpBar() { const L = UI[LANG]; document.documentElement.lang = LANG;
  document.getElementById('help').innerHTML = `<span>${L.help}</span><span>${L.help2}</span><span>${L.help3}</span><span class="sp"></span><button id="b-dim" type="button">${LANG === 'fr' ? 'Décor' : 'Backdrop'} ${Math.round(DIM * 100)} %</button><button id="b-lang" type="button">${L.lang}</button>`;
  document.getElementById('b-lang').onclick = toggleLang; document.getElementById('b-dim').onclick = () => { DIM = DIM >= 1 ? .5 : Math.round((DIM + .125) * 1000) / 1000; try { localStorage.setItem('bp-dim', DIM); } catch (e) {} helpBar(); }; }
try { DIM = +localStorage.getItem('bp-dim') || .75; } catch (e) {}
function frame(now) {
  const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now; FRAME_DT = dt;
  try {
    if (STATE === 'title') { time += dt; titleFrame(dt); }
    else if (STATE === 'select') { time += dt; selectFrame(dt); }
    else if (STATE === 'prologue') { time += dt; const ins = menuInputs(); updateCut(dt, ins); if (STATE === 'prologue') renderCut(); pressed.clear(); }
    else if (STATE === 'play' || STATE === 'end') { const wasDone = WORLD.levelDone; update(dt); render();
      if (STATE === 'play' && WORLD.levelDone && !DLG.cur) { endT += dt; if (endT > 2.5) { STATE = 'end'; endT = 0; } }
      if (STATE === 'end') { endT += dt; endOverlay(); const ins = [readInput(0), readInput(1)]; if (endT > 1.5 && (ins.some(i => i.a || i.start) || pressed.has('Enter') || pressed.has('KeyR'))) toTitle(); pressed.clear(); } }
  } catch (e) { console.error(e); }
  requestAnimationFrame(frame);
}
helpBar(); requestAnimationFrame(frame);
