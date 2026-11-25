// =====================================================================
// FLOW — title, pick two warriors, the prologue, the level, the ending.
// =====================================================================
const UI = {
  fr: { press: 'Appuie sur une touche ou un bouton', world: 'MONDE 1 · HAVRE', pick: 'Choisissez vos deux guerriers', p1: 'J1', p2: 'J2', hint: 'J1 : W A S D + F · J2 : flèches + K · manettes : croix + attaque · spécial : au hasard · saut : annuler', solo: 'Seul ? Choisis ton partenaire : l’ordinateur le jouera.', cpu: 'ORDI', duo: 'Duo idéal : ', go: 'C’est parti !', cont: 'À SUIVRE…', again: 'Frapper : retour au titre', next: 'Frapper : en route pour De Soif', next2: 'Frapper : en route pour Bouldaire', esc3: 'Calve-Hair part pour la prison impériale. Rasé. Le rouage n° 3 est à vous.', esc35: 'Madame Metal Face s’est envolée avec le rouage n° 3. Ce n’est que partie remise.', esc: 'Villen-Hüüs s’est enfui avec le rouage de Havre.', esc2: 'Oscar part pour la prison impériale. Le rouage n° 2 est à vous.', wsel: '◀ ▶ choisir le monde', lang: 'EN', roles: { Ranged: 'Tir', Tank: 'Tank', Bruiser: 'Cogneur', Support: 'Soutien', Trickster: 'Ruse', Speedster: 'Vitesse' },
    help: '<b>J1</b> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> bouger · <kbd>Espace</kbd> sauter · <kbd>F</kbd> frapper · <kbd>G</kbd> spécial · <b>double avant</b> charge · <b>double arrière</b> esquive', help2: '<b>J2</b> flèches · <kbd>Maj droite</kbd> sauter · <kbd>K</kbd> frapper · <kbd>L</kbd> spécial', help3: '<kbd>Entrée</kbd> passer les dialogues · <kbd>Échap</kbd> pause · manettes : le premier bouton pressé choisit le joueur · <b>solo</b> ordres au partenaire : <kbd>1</kbd>–<kbd>4</kbd> ou L1 R1 L2 R2' },
  en: { press: 'Press any key or button', world: 'WORLD 1 · HAVRE', pick: 'Pick your two warriors', p1: 'P1', p2: 'P2', hint: 'P1: W A S D + F · P2: arrows + K · pads: d-pad + attack · special: random · jump: undo', solo: 'Alone? Pick your partner: the computer will play them.', cpu: 'CPU', duo: 'Best partner: ', go: 'Here we go!', cont: 'TO BE CONTINUED…', again: 'Attack: back to title', next: 'Attack: on to De Soif', next2: 'Attack: on to Bouldaire', esc3: 'Calve-Hair is off to the imperial prison. Shaved. Gear no. 3 is yours.', esc35: 'Madame Metal Face flew off with gear no. 3. This isn’t over.', esc: 'Villen-Hüüs escaped with the Havre gear.', esc2: 'Oscar is off to the imperial prison. Gear no. 2 is yours.', wsel: '◀ ▶ pick a world', lang: 'FR', roles: { Ranged: 'Ranged', Tank: 'Tank', Bruiser: 'Bruiser', Support: 'Support', Trickster: 'Trickster', Speedster: 'Speedster' },
    help: '<b>P1</b> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move · <kbd>Space</kbd> jump · <kbd>F</kbd> attack · <kbd>G</kbd> special · <b>double-tap forward</b> charge · <b>double-tap back</b> dodge', help2: '<b>P2</b> arrows · <kbd>Right Shift</kbd> jump · <kbd>K</kbd> attack · <kbd>L</kbd> special', help3: '<kbd>Enter</kbd> skip dialogue · <kbd>Esc</kbd> pause · pads: the first button pressed picks the player · <b>solo</b> partner orders: <kbd>1</kbd>–<kbd>4</kbd> or L1 R1 L2 R2' }
};
const ROLE = { amiral: 'Ranged', marge: 'Tank', cyborg: 'Tank', papi: 'Bruiser', ruby: 'Ranged', spora: 'Support', magneto: 'Trickster', doc: 'Support', demi: 'Trickster', bernache: 'Speedster', raccoon: 'Speedster', soldier: 'Bruiser' };
const PARTNER = { amiral: 'spora', spora: 'amiral', marge: 'ruby', ruby: 'marge', cyborg: 'raccoon', raccoon: 'cyborg', papi: 'bernache', bernache: 'papi', magneto: 'demi', demi: 'magneto', doc: 'soldier', soldier: 'doc' };
const GAME_SPEED = 1.065;   // the fights run 6.5% faster than real time (the music keeps its own clock)
let STATE = 'title', SEL = null, endT = 0, last = performance.now(), WSEL = 0, PAIR = null, barSaid = false;
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
  const ins = menuInputs(), armed = dbgTitle(ins); if (STATE !== 'title') { pressed.clear(); return; }   // the secret code (debug.js)
  if (!armed && (ins.some(i => i.a || i.j || i.s || i.start) || pressed.has('Enter') || pressed.has('Space'))) { DEBUG.pick = null; LEVEL = WSEL; STATE = 'select'; musicPlay(LEVELS[WSEL].id); musicDuck(.7); SEL = { cur: [0, 1], lock: [false, false], solo: false }; beep(660, .1, 'triangle', .05, 200); }
  if (pressed.has('KeyL')) toggleLang(); for (const i of ins) if (i.tap) { WSEL = (WSEL + i.tap + LEVELS.length) % LEVELS.length; beep(520, .05, 'square', .03); if (MUSIC.on) musicPlay(LEVELS[WSEL].id); }
  menuFrame(LEVELS[WSEL].style, F => { WARRIORS.forEach((w, k) => { const id = w.id, x = 70 + k * 74, face = k % 2 ? -1 : 1, fl = FIDGETS[id], ph = (time * .45 + k * .37) % ((fl ? fl.length : 1) + 2);
    const pose = fl && ph < fl.length ? POSES[fl[Math.floor(ph)]](time + k) : POSES.idle(time, k); drawHero(F, id, x, 500 - (k % 2) * 14, face, 1.55, pose, time + k, { idle: Math.sin(time + k) > 0 ? 'peck' : 'preen', walk: time * 4, speed: 0 }); }); });
  const wob = Math.sin(time * 2) * 2;
  out.save(); out.translate(480, 150); out.rotate(-.04); burst(out, 0, 0, 330, 110, 18, .1, '#ffe88a', OUT, 4); out.restore();
  bigText('BATTLE PLANET', 480, 118 + wob, 64, '#e8402a'); bigText('ZENZIZENZIX', 480, 182 - wob, 52, '#2a3a7a');
  bigText((WSEL > 0 ? '◀  ' : '    ') + LEVELS[WSEL].name[LANG] + (WSEL < LEVELS.length - 1 ? '  ▶' : '    '), 480, 250, 22, '#f4ead8'); bigText(UI[LANG].wsel, 480, 330, 13, '#e8e0d0'); if (Math.floor(time * 2) % 2) bigText(UI[LANG].press, 480, 300, 18, '#fff');
  out.font = '600 12px Georgia, serif'; out.fillStyle = '#fff'; out.textAlign = 'right'; out.fillText('L : ' + (LANG === 'fr' ? 'English' : 'Français'), 948, 528); out.textAlign = 'left';
  out.strokeStyle = OUT; out.lineWidth = 5; out.strokeRect(2.5, 2.5, 955, 535); out.setTransform(1, 0, 0, 1, 0, 0); pressed.clear();
}
// ---- pick two: see select.js -------------------------------------------
// ---- story ---------------------------------------------------------------
function beginStory(a, b) { musicDuck(.45); CPU = !!(SEL && SEL.cpu); const seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0; PAIR = [a, b]; STORY = buildStory(a, b, seed); STORY2 = buildSoif(a, b, seed); STORY3 = buildBould(a, b, seed); STATE = 'prologue'; INKFX = []; WORLD.noir = 0;
  if (DEBUG.pick) { const pk = DEBUG.pick; DEBUG.pick = null; debugStart(a, b, pk); return; }
  if (LEVEL === 0) startPrologue(a, b, STORY, () => startPlay(a, b)); else if (LEVEL === 3) startCut(a, b, buildTheft(STORY3), () => startWorld(3)); else startCut(a, b, LEVEL === 2 ? buildBouldIntro(STORY3) : buildSoifIntro(STORY2), () => startPlay(a, b)); }
function startWorld(n) { LEVEL = n; musicPlay(LEVELS[n].id); musicDuck(.45); const [a, b] = PAIR; STATE = 'prologue'; INKFX = []; WORLD.noir = 0; if (n === 1) startCut(a, b, buildSoifIntro(STORY2), () => startPlay(a, b)); else if (n === 2) startCut(a, b, buildBouldIntro(STORY3), () => startPlay(a, b)); else if (n === 3) startClimb(); else startPlay(a, b); }
function startPlay(a, b) { musicPlay(LEVELS[LEVEL].id); musicDuck(1); ambStart(LEVELS[LEVEL].id); STATE = 'play'; INKFX = []; WORLD.noir = 0; WORLD.oscarDownT = 0; SCREENS = LEVELS[LEVEL].screens; barSaid = false; newGame([wById(a), wById(b)]); buddyReset(); endT = 0; LASTBOSS = null; QUIPS.length = 0; WORLD.calve = null; playLines(LEVEL === 0 ? STORY.battle : LEVEL === 1 ? STORY2.arrive : LEVEL === 3 ? STORY3.sky : STORY3.arrive, false); WORLD.mmf = null; if (LEVEL === 3) banner(LANG === 'fr' ? 'Lancez des objets pour ouvrir le chemin · ←← / →→ + saut : grand saut' : 'Throw things to open the way · ←← / →→ + jump: long jump', -1, false, '#ffe6a8'); }
function oscarDown(e) { e.state = 'kneel'; e.inv = 99; e.hp = 1; WORLD.oscarDownT = time; for (const o of enemies) if (o !== e && !o.dead) o.flee = 99; fx = fx.filter(f => !['glass', 'shaker', 'goonball'].includes(f.k)); for (const p of players) p.st = []; banner(LANG === 'fr' ? 'OSCAR À GENOUX' : 'OSCAR KNEELS', -1, true, '#ffd23f'); inkAccent(e.x, e.z, 60); }
function toTitle() { ambStop(); musicPlay(LEVELS[WSEL].id); musicDuck(.7); STATE = 'title'; enemies = []; fx = []; INKFX = []; QUIPS.length = 0; DLG.q = []; DLG.cur = null; DLG.blocking = false; WORLD.noir = 0; WORLD.levelDone = false; }
function endOverlay() {
  out.setTransform(2, 0, 0, 2, 0, 0); out.fillStyle = 'rgba(10,7,16,.5)'; out.fillRect(0, 0, 960, 540);
  out.save(); out.translate(480, 200); out.rotate(-.05); burst(out, 0, 0, 300, 90, 16, .1, '#ffe88a', OUT, 4); out.restore(); bigText(UI[LANG].cont, 480, 200, 54, '#e8402a');
  const esc = LEVEL === 0 ? UI[LANG].esc : LEVEL === 1 ? UI[LANG].esc2 : LEVEL === 3 ? UI[LANG].esc35 : UI[LANG].esc3; out.font = 'bold 13px "Arial Narrow", sans-serif'; caption(out, 4, esc, 480 - out.measureText(esc).width / 2 - 10, 300);
  const L = T[LANG]; players.forEach((p, k) => bigText(`${k ? L.p2 : L.p1} ${nameOf(p.w.id)} · ${L.ffc} : ${p.ff}`, 480, 370 + k * 30, 18, k ? '#8ad8ff' : '#ffb0d0'));
  if (Math.floor(time * 2) % 2) bigText(LEVEL === 0 ? UI[LANG].next : LEVEL === 1 ? UI[LANG].next2 : UI[LANG].again, 480, 460, 18, '#fff'); out.setTransform(1, 0, 0, 1, 0, 0);
}
function toggleLang() { LANG = LANG === 'fr' ? 'en' : 'fr'; try { localStorage.setItem('bp-lang', LANG); } catch (e) {} helpBar(); }
function helpBar() { document.documentElement.lang = LANG; }   // the controls now live in the pause screen
try { DIM = +localStorage.getItem('bp-dim') || .75; } catch (e) {}
function frame(now) {
  const dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = now; FRAME_DT = dt; musicTick();
  try {
    if (STATE === 'title') { time += dt; titleFrame(dt); }
    else if (STATE === 'debug') { time += dt; debugFrame(dt); }
    else if (STATE === 'select') { time += dt; selectFrame(dt); }
    else if (STATE === 'prologue') { time += dt; const ins = menuInputs(); updateCut(dt, ins); if (STATE === 'prologue') renderCut(); pressed.clear(); }
    else if (STATE === 'climb') { time += dt; climbFrame(dt * GAME_SPEED); pressed.clear(); }
    else if (STATE === 'play' || STATE === 'end') { const wasDone = WORLD.levelDone; FRAME_DT = dt * GAME_SPEED; update(dt * GAME_SPEED); render();
      if (STATE === 'play' && WORLD.levelDone && !DLG.cur) { endT += dt; if (endT > 2.5) { STATE = 'end'; endT = 0; } }
      if (STATE === 'play' && LEVEL === 1 && scrIdx === 3 && !barSaid && fade <= 0) { barSaid = true; playLines(STORY2.bar, false); }
      if (STATE === 'play' && LEVEL === 2 && scrIdx === 3 && !barSaid && fade <= 0) { barSaid = true; playLines(STORY3.salon, false); }
      if (STATE === 'play' && WORLD.oscarDownT && time - WORLD.oscarDownT > 2.2) { WORLD.oscarDownT = 0; STATE = 'prologue'; if (LEVEL === 2) startCut(PAIR[0], PAIR[1], buildCalveEnd(STORY3), () => startWorld(3)); else startCut(PAIR[0], PAIR[1], LEVEL === 3 ? buildTourEnd(STORY3) : buildOscarEnd(STORY2), () => { STATE = 'end'; endT = 0; WORLD.levelDone = true; }); }
      if (STATE === 'end') { endT += dt; endOverlay(); const ins = [readInput(0), readInput(1)]; if (endT > 1.5 && (ins.some(i => i.a || i.start) || pressed.has('Enter') || pressed.has('KeyR'))) { if (LEVEL < LEVELS.length - 1 && PAIR) startWorld(LEVEL + 1); else toTitle(); } pressed.clear(); } }
  } catch (e) { console.error(e); }
  requestAnimationFrame(frame);
}
helpBar(); requestAnimationFrame(frame);
