// =====================================================================
// AUDIO — buses (music, effects, ambience) with volumes from the pause menu, cleaner layered sound effects,
// each level's surrounding sounds, and the soundtrack: a small synth band playing long generated songs
// that loop seamlessly, one theme per level in the spirit of its print style, and a faster, rockier boss version.
// Settings saved as bp-audio: { music, sfx, mute, rumble }.
// =====================================================================
const AUD = { music: .7, sfx: .8, mute: false, rumble: 'strong' };
try { Object.assign(AUD, JSON.parse(localStorage.getItem('bp-audio') || '{}')); } catch (e) {}
function saveAud() { try { localStorage.setItem('bp-audio', JSON.stringify(AUD)); } catch (e) {} applyVol(); }
let BUS = null, NBUF = null;
function buses() {
  if (BUS) return BUS; const a = ac();
  const master = a.createGain(), comp = a.createDynamicsCompressor(), lim = a.createDynamicsCompressor(), trim = a.createGain(); comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = .003; comp.release.value = .2;
  lim.threshold.value = -6; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = .001; lim.release.value = .08; trim.gain.value = .85;   // a limiter at the end: big crashes never clip
  master.connect(comp).connect(lim).connect(trim).connect(a.destination);
  const sfx = a.createGain(), music = a.createGain(), amb = a.createGain(), verb = a.createConvolver(), verbG = a.createGain();
  // a small room: decaying noise as the impulse
  const len = a.sampleRate * 1.6, ir = a.createBuffer(2, len, a.sampleRate); for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); } verb.buffer = ir; verbG.gain.value = .22;
  sfx.connect(master); music.connect(master); amb.connect(master); verb.connect(verbG).connect(master);
  // the music's echo (a dotted eighth, set per song)
  const echo = a.createDelay(1), fb = a.createGain(), echoOut = a.createGain(); fb.gain.value = .32; echoOut.gain.value = .3; echo.connect(fb).connect(echo); echo.connect(echoOut).connect(music);
  NBUF = a.createBuffer(1, a.sampleRate * 2, a.sampleRate); { const d = NBUF.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  BUS = { master, sfx, music, amb, verb, echo }; applyVol(); return BUS;
}
function applyVol() { if (!BUS) return; const m = AUD.mute ? 0 : 1; BUS.sfx.gain.value = AUD.sfx * m; BUS.music.gain.value = AUD.music * .5 * m * (MUSIC.duck || 1); BUS.amb.gain.value = AUD.sfx * .55 * m; }

// ---- sound-effect building blocks ---------------------------------------------------------
function nz(t, d, v, f0, f1, type = 'lowpass', q = .8, out, pan = 0) { const a = ac(), B = buses(), s = a.createBufferSource(), fl = a.createBiquadFilter(), gn = a.createGain(); s.buffer = NBUF; s.loop = true; fl.type = type; fl.Q.value = q;
  fl.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) fl.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + d);
  gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(v, t + Math.min(.008, d * .1)); gn.gain.exponentialRampToValueAtTime(.0001, t + d);
  let node = s.connect(fl).connect(gn); if (pan && a.createStereoPanner) { const p = a.createStereoPanner(); p.pan.value = pan; node = node.connect(p); } node.connect(out || B.sfx); s.start(t, Math.random() * 1.5); s.stop(t + d + .05); return gn; }
function tone(t, f0, f1, d, v, type = 'sine', out, att = .004) { const a = ac(), B = buses(), o = a.createOscillator(), gn = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + d);
  gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(v, t + att); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(out || B.sfx); o.start(t); o.stop(t + d + .02); return o; }
const SND = {
  now: () => ac().currentTime,
  // a punch: a low body thump, a crisp slap, a little mid crunch
  hit(str = .5, kind = 'punch') { try { const t = SND.now(); tone(t, 150 + str * 40, 45, .12 + str * .1, .35 + str * .35); nz(t, .035, .25 + str * .2, 4500, 2500, 'highpass', .7); nz(t, .07 + str * .06, .18 + str * .2, 1100, 500, 'bandpass', 1.2);
    if (kind === 'blade') nz(t, .12, .2, 6000, 9000, 'highpass', 1); if (kind === 'metal') { tone(t, 900, 760, .2, .06, 'square'); tone(t, 1340, 1300, .25, .04, 'triangle'); } } catch (e) {} },
  hurt(str = .5) { try { const t = SND.now(); tone(t, 120, 40, .16, .45 + str * .2); nz(t, .1, .25, 900, 300, 'lowpass', 1); } catch (e) {} },
  swish(str = .5) { try { const t = SND.now(); nz(t, .1 + str * .08, .1 + str * .1, 1200, 5200, 'bandpass', 2.5); } catch (e) {} },
  // crashes: a boom you feel, a filtered roar that settles, then debris ticking down
  crash(size = 1) { try { const t = SND.now(), B = buses(); tone(t, 90, 32, .35 + size * .25, Math.min(.9, .4 + size * .3)); nz(t, .5 + size * .5, .35 + size * .15, 1600, 220, 'lowpass', .9); nz(t, .25 + size * .2, .18, 2600, 1200, 'bandpass', 1.5, B.verb);
    for (let k = 0; k < 4 + size * 5; k++) { const d = t + .06 + Math.random() * (.4 + size * .4); nz(d, .03, .05 + Math.random() * .08, 2000 + Math.random() * 3000, 0, 'bandpass', 3); } } catch (e) {} },
  boom(size = 1) { try { const t = SND.now(), B = buses(); tone(t, 70, 22, .7 + size * .5, Math.min(1, .6 + size * .25)); nz(t, 1.2 + size * .8, .5, 2400, 120, 'lowpass', .7); nz(t, .9, .2, 1200, 300, 'lowpass', .7, B.verb);
    for (let k = 0; k < 10; k++) nz(t + .1 + Math.random() * .9, .04, .05, 1800 + Math.random() * 2000, 0, 'bandpass', 4); } catch (e) {} },
  wood(size = .5) { try { const t = SND.now(); tone(t, 220, 90, .09, .25 + size * .2, 'triangle'); nz(t, .12 + size * .15, .25, 1800, 700, 'bandpass', 2); for (let k = 0; k < 4; k++) nz(t + .03 + Math.random() * .2, .025, .07, 2500 + Math.random() * 1500, 0, 'bandpass', 4); } catch (e) {} },
  glass() { try { const t = SND.now(); nz(t, .25, .25, 7000, 3000, 'highpass', 1); for (let k = 0; k < 9; k++) tone(t + Math.random() * .3, 2400 + Math.random() * 3200, 0, .25 + Math.random() * .3, .03, 'sine'); } catch (e) {} },
  metal(d = 1) { try { const t = SND.now(); const g = nz(t, d, .2, 1300, 2200, 'bandpass', 9); tone(t, 140, 110, d, .08, 'sawtooth'); tone(t, 760, 620, d * .8, .03, 'square'); } catch (e) {} },
  horn(d = 2.6, f = 62) { try { const a = ac(), B = buses(), t = SND.now(), lp = a.createBiquadFilter(), gn = a.createGain(); lp.type = 'lowpass'; lp.frequency.value = 420; gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(.32, t + .5); gn.gain.setValueAtTime(.32, t + d - .6); gn.gain.exponentialRampToValueAtTime(.0001, t + d);
    for (const df of [0, .6, -.4]) { const o = a.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f + df; o.connect(lp); o.start(t); o.stop(t + d + .05); } lp.connect(gn); gn.connect(B.sfx); gn.connect(B.verb); } catch (e) {} },
  alarm(n = 4) { try { const t = SND.now(); for (let k = 0; k < n; k++) { tone(t + k * .5, 700, 900, .24, .06, 'square'); tone(t + k * .5 + .25, 900, 700, .24, .06, 'square'); } } catch (e) {} },
  rotor(d = 2) { try { const t = SND.now(); for (let k = 0; k < d * 9; k++) nz(t + k / 9, .07, .16, 500, 200, 'lowpass', 1.2); } catch (e) {} },
  splash(size = 1) { try { const t = SND.now(); nz(t, .6 + size * .5, .3, 3000, 600, 'lowpass', .6); nz(t + .05, .4, .15, 6000, 3000, 'highpass', .6); } catch (e) {} }
};

// ---- surrounding sounds, per level ---------------------------------------------------------
const AMB = { lvl: null, nodes: [], t: 0, next: {} };
function ambStop() { for (const n of AMB.nodes) { try { n.stop(); } catch (e) {} } AMB.nodes = []; AMB.lvl = null; }
function ambStart(lvl) { if (AMB.lvl === lvl) return; ambStop(); AMB.lvl = lvl; try { const a = ac(), B = buses();
    const bed = (f, q, v, lfo, type = 'lowpass') => { const s = a.createBufferSource(), fl = a.createBiquadFilter(), gn = a.createGain(); s.buffer = NBUF; s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q; gn.gain.value = v; s.connect(fl).connect(gn).connect(B.amb);
      if (lfo) { const o = a.createOscillator(), og = a.createGain(); o.frequency.value = lfo; og.gain.value = v * .8; o.connect(og).connect(gn.gain); o.start(); AMB.nodes.push(o); } s.start(); AMB.nodes.push(s); };
    if (lvl === 'havre') { bed(420, .7, .16, .11); bed(900, .5, .05, .07); }                 // the sea washing on the quay, in slow swells
    else { bed(180, .6, .1, 0); bed(500, 1.2, .05, .05, 'bandpass'); }                          // the city's hum and distant traffic
    AMB.next = { gull: 2, horn: 14, car: 6, chat: 0 }; } catch (e) {} }
function ambTick(dt) { if (!AMB.lvl || !BUS) return; const N = AMB.next, t = SND.now(), B = BUS; for (const k in N) N[k] -= dt;
  try {
    if (AMB.lvl === 'havre') {
      if (N.gull <= 0) { N.gull = 3 + Math.random() * 6; const pan = Math.random() * 1.6 - .8, f = 1500 + Math.random() * 600; for (let k = 0; k < 2 + (Math.random() * 3 | 0); k++) { const s = t + k * .17; const o = tone(s, f, f * .78, .16, .05, 'sine', B.amb); tone(s, f * 2.01, f * 1.5, .1, .012, 'sine', B.amb); } }
      if (N.horn <= 0) { N.horn = 35 + Math.random() * 20; const a = ac(), lp = a.createBiquadFilter(), gn = a.createGain(); lp.type = 'lowpass'; lp.frequency.value = 300; gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(.06, t + .6); gn.gain.exponentialRampToValueAtTime(.0001, t + 2.4); const o = a.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 55; o.connect(lp).connect(gn).connect(B.amb); gn.connect(B.verb); o.start(t); o.stop(t + 2.5); }
    } else {
      if (N.car <= 0) { N.car = 5 + Math.random() * 8; const pan = Math.random() < .5 ? -.7 : .7; nz(t, 2.2, .05, 300, 700, 'bandpass', 1.5, B.amb, pan); if (Math.random() < .35) { tone(t + .8, 420, 0, .18, .025, 'square', B.amb); tone(t + 1.05, 420, 0, .3, .025, 'square', B.amb); } }
      if (typeof scrIdx !== 'undefined' && scrIdx === 3 && N.chat <= 0) { N.chat = .12; nz(t, .14, .02 + Math.random() * .03, 500 + Math.random() * 600, 0, 'bandpass', 3, B.amb, Math.random() * 1.2 - .6); if (Math.random() < .05) tone(t, 3000 + Math.random() * 900, 0, .3, .02, 'sine', B.amb); }
    } } catch (e) {} }

// ---- the soundtrack -------------------------------------------------------------------------------
// A song is generated from a theme: a key, a tempo, a set of chord progressions and motifs; sections (A, A', B, C…) are laid
// out into a long form (about three minutes) whose end leads back to its start, so it loops without a seam.
const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);
function srng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const THEMES = {
  // World 1, Havre (the 1977 science-fiction print): analogue synths, a sea-shanty melody in D dorian, arpeggios like starlight
  havre: { root: 62, scale: [0, 2, 3, 5, 7, 9, 10], bpm: 148, lead: 'pulse', arp: 1, bassT: 'saw', organ: 0, drum: 'disco', echo: .75,
    prog: { A: [[0, 'm'], [-2, 'M'], [-4, 'M'], [-2, 'M']], B: [[0, 'm'], [3, 'M'], [5, 'M'], [7, 'M']], C: [[-4, 'M'], [-2, 'M'], [-5, 'm'], [0, 'm']], D: [[5, 'M'], [-4, 'M'], [-2, 'M'], [0, 'm']] },
    form: ['A', 'A', 'B', 'A', 'C', 'B', 'A', 'D', 'C', 'B', 'A', 'D', 'A', 'B', 'B', 'C', 'A', 'D', 'C', 'A', 'B', 'D', 'C', 'D'] },   // ~5 minutes, then it loops
  // World 2, De Soif (the Silver Age print): sixties surf and spy — a twangy lead with tremolo, offbeat organ, walking bass, in E
  soif: { root: 64, scale: [0, 1, 4, 5, 7, 8, 10], bpm: 166, lead: 'twang', arp: 0, bassT: 'walk', organ: 1, drum: 'surf', echo: .5,
    prog: { A: [[0, 'm'], [-2, 'M'], [-4, 'M'], [-5, '7']], B: [[5, 'm'], [0, 'm'], [7, '7'], [0, 'm']], C: [[-4, 'M'], [-2, 'M'], [0, 'm'], [0, 'm']], D: [[1, 'M'], [0, 'm'], [1, 'M'], [-5, '7']] },
    form: ['A', 'A', 'B', 'A', 'D', 'C', 'A', 'B', 'D', 'A', 'C', 'B', 'A', 'D', 'D', 'C', 'B', 'A', 'C', 'A', 'B', 'D', 'C', 'B'] }
};
const CHORD = { m: [0, 3, 7], M: [0, 4, 7], 7: [0, 4, 7, 10] };
function buildSong(id, boss) {
  const T = THEMES[id], R = srng(id.length * 977 + (boss ? 31 : 0)), bars = [];
  const motifs = {}; const rhythms = [[0, 2, 4, 6, 8, 11, 12, 14], [0, 3, 6, 8, 10, 12], [0, 2, 3, 4, 8, 10, 12, 13, 14], [0, 4, 6, 7, 8, 12], [0, 1, 2, 4, 6, 8, 9, 10, 12, 14]];
  for (const sec in T.prog) { const rh = rhythms[(R() * rhythms.length) | 0]; let deg = 4 + ((R() * 3) | 0); motifs[sec] = [0, 1, 2, 3].map(b => rh.map(st => { deg = Math.max(0, Math.min(11, deg + [-2, -1, -1, 0, 1, 1, 2][(R() * 7) | 0])); return { st, deg, len: 1 + (R() < .3 ? 1 : 0) }; })); }
  const rep = {}; let sectIdx = 0;
  for (const sec of T.form) { rep[sec] = (rep[sec] || 0) + 1; const prog = T.prog[sec], vr = srng(sectIdx * 131 + rep[sec] * 17 + (boss ? 7 : 0));
    for (let half = 0; half < 2; half++) for (let b = 0; b < 4; b++) { const [ch, q] = prog[b], mel = motifs[sec][b].map(n => ({ ...n }));
      if (rep[sec] > 1 || half) mel.forEach(n => { if (vr() < .28) n.deg = Math.max(0, Math.min(12, n.deg + (vr() < .5 ? -1 : 1) * (vr() < .7 ? 1 : 2))); });     // each time round, a little different
      if (half && b === 3) mel.splice(Math.max(1, mel.length - 3));                                                                    // breathe at the end of a phrase
      bars.push({ ch, q, mel, sec, rep: rep[sec], half, last: b === 3 && half === 1, oct: sec === 'C' ? -1 : (rep[sec] > 2 ? 1 : 0), quiet: sec === 'C' && !boss }); }
    sectIdx++; }
  return { id, boss, bpm: Math.round(T.bpm * (boss ? 1.2 : 1)), T, bars };
}
const MUSIC = { song: null, bar: 0, step: 0, nextT: 0, on: false, duck: 1, want: null, fade: 1 };
function musicPlay(id, boss = false) { const key = id + (boss ? '!' : ''); if (MUSIC.want === key && MUSIC.on) return; MUSIC.want = key; try { const B = buses(); MUSIC.song = buildSong(id, boss); MUSIC.bar = 0; MUSIC.step = 0; MUSIC.nextT = ac().currentTime + .1; MUSIC.on = true; B.echo.delayTime.value = 60 / MUSIC.song.bpm * MUSIC.song.T.echo; } catch (e) {} }
function musicStop() { MUSIC.on = false; MUSIC.want = null; }
function musicDuck(v) { MUSIC.duck = v; applyVol(); }
function scale(T, deg, oct = 0) { const n = T.scale.length, o = Math.floor(deg / n), d = ((deg % n) + n) % n; return T.root + T.scale[d] + 12 * (o + oct); }
function musicTick() { if (!MUSIC.on || !MUSIC.song || !AC) return; const a = AC, S = MUSIC.song, spb = 60 / S.bpm / 4;   // seconds per sixteenth
  while (MUSIC.nextT < a.currentTime + .15) { playStep(S, S.bars[MUSIC.bar], MUSIC.step, MUSIC.nextT, spb); MUSIC.nextT += spb; MUSIC.step++; if (MUSIC.step >= 16) { MUSIC.step = 0; MUSIC.bar = (MUSIC.bar + 1) % S.bars.length; } } }
// ---- the band ----
function inst(kind, t, n, d, v) { const a = AC, B = BUS, f = NOTE(n), out = B.music;
  if (kind === 'pulse' || kind === 'lead!') { const o = a.createOscillator(), o2 = a.createOscillator(), lp = a.createBiquadFilter(), gn = a.createGain(); o.type = 'square'; o2.type = kind === 'lead!' ? 'sawtooth' : 'square'; o.frequency.value = f; o2.frequency.value = f * 1.005;
    const vib = a.createOscillator(), vg = a.createGain(); vib.frequency.value = 5.5; vg.gain.value = f * .006; vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(kind === 'lead!' ? 3200 : 2200, t); lp.frequency.exponentialRampToValueAtTime(900, t + d); gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(v, t + .01); gn.gain.setValueAtTime(v * .7, t + d * .7); gn.gain.exponentialRampToValueAtTime(.0001, t + d);
    let src = gn; if (kind === 'lead!') { const ws = a.createWaveShaper(), c = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 128 - 1; c[i] = Math.tanh(x * 3); } ws.curve = c; gn.connect(ws); src = ws; }
    o.connect(lp); o2.connect(lp); lp.connect(gn); src.connect(out); src.connect(B.echo); [o, o2, vib].forEach(x => { x.start(t); x.stop(t + d + .05); }); return; }
  if (kind === 'twang') { const o = a.createOscillator(), lp = a.createBiquadFilter(), gn = a.createGain(), trem = a.createOscillator(), tg = a.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f * 1.02, t); o.frequency.exponentialRampToValueAtTime(f, t + .04);
    lp.type = 'lowpass'; lp.Q.value = 6; lp.frequency.setValueAtTime(3600, t); lp.frequency.exponentialRampToValueAtTime(700, t + Math.min(d, .5)); gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(v, t + .005); gn.gain.exponentialRampToValueAtTime(.0001, t + d + .2);
    trem.frequency.value = 7; tg.gain.value = v * .35; trem.connect(tg).connect(gn.gain); o.connect(lp).connect(gn); gn.connect(out); gn.connect(B.echo); gn.connect(B.verb); [o, trem].forEach(x => { x.start(t); x.stop(t + d + .25); }); return; }
  if (kind === 'arp') { tone(t, f, f, d, v, 'square', out, .003); return; }
  if (kind === 'bass' || kind === 'bass!') { const o = a.createOscillator(), lp = a.createBiquadFilter(), gn = a.createGain(); o.type = 'sawtooth'; o.frequency.value = f; lp.type = 'lowpass'; lp.Q.value = 5; lp.frequency.setValueAtTime(kind === 'bass!' ? 1400 : 900, t); lp.frequency.exponentialRampToValueAtTime(160, t + d);
    gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(v, t + .006); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(lp).connect(gn).connect(out); o.start(t); o.stop(t + d + .03); return; }
  if (kind === 'pad') { const lp = a.createBiquadFilter(), gn = a.createGain(); lp.type = 'lowpass'; lp.frequency.value = 1100; gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(v, t + d * .3); gn.gain.exponentialRampToValueAtTime(.0001, t + d); lp.connect(gn).connect(out); gn.connect(B.verb);
    for (const dt of [-.08, .08]) { const o = a.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt * 100; o.connect(lp); o.start(t); o.stop(t + d + .05); } return; }
  if (kind === 'organ') { for (const [m, vv] of [[1, 1], [2, .5], [4, .25]]) tone(t, f * m, f * m, d, v * vv, 'sine', out, .005); return; }
}
function drum(kind, t, v = 1) { const out = BUS.music;
  if (kind === 'kick') { tone(t, 150, 42, .22, .7 * v, 'sine', out, .002); nz(t, .015, .15 * v, 3000, 0, 'highpass', .7, out); }
  else if (kind === 'snare') { nz(t, .16, .32 * v, 1800, 900, 'bandpass', .8, out); tone(t, 220, 160, .08, .18 * v, 'triangle', out, .002); }
  else if (kind === 'hat') nz(t, .04, .1 * v, 8000, 0, 'highpass', .8, out);
  else if (kind === 'ohat') nz(t, .2, .08 * v, 7000, 0, 'highpass', .8, out);
  else if (kind === 'crash') { nz(t, 1.2, .16 * v, 5000, 3000, 'highpass', .5, out); nz(t, 1.2, .05 * v, 3000, 0, 'bandpass', .5, BUS.verb); }
  else if (kind === 'tom') tone(t, 160 * v, 80 * v, .2, .4, 'sine', out, .002);
  else if (kind === 'ride') nz(t, .25, .06 * v, 9000, 6000, 'bandpass', 4, out);
}
function playStep(S, bar, st, t, spb) { const T = S.T, boss = S.boss, q = CHORD[bar.q], root = T.root + bar.ch, beat = st % 4 === 0;
  // drums
  if (!bar.quiet || st >= 8) {
    if (T.drum === 'disco' || boss) { if (beat || boss && st % 2 === 0 && R2(st)) drum('kick', t, (beat ? 1 : .7) * (boss ? .75 : 1)); if (st === 4 || st === 12) drum('snare', t); drum(st % 2 ? 'hat' : (st % 4 === 2 ? 'ohat' : 'hat'), t, st % 2 ? .6 : 1); }
    else { if (st === 0 || st === 6 || st === 8 || st === 10 && bar.half) drum('kick', t); if (st === 4 || st === 12) drum('snare', t); if (st % 2 === 0) drum('ride', t); if (bar.last && st >= 12) drum('tom', t, 1.6 - (st - 12) * .15); }
    if (st === 0 && (bar.rep === 1 && !bar.half || boss && bar.half === 0)) drum('crash', t, boss ? .7 : .8);
    if (bar.last && st >= 12 && T.drum === 'disco') drum('tom', t, 1.5 - (st - 12) * .12); }
  else if (beat) drum('hat', t, .5);
  // bass
  if (T.bassT === 'walk' && !boss) { if (beat) { const walk = [0, q[1], q[2], q[1] + 2][st / 4]; inst('bass', t, root - 24 + walk, spb * 3.6, .32); } }
  else if (st % 2 === 0 || boss) { const n = root - 24 + (st % 8 === 6 ? 12 : 0); inst(boss ? 'bass!' : 'bass', t, n, spb * (boss ? .9 : 1.8), boss ? .17 : .34); }
  // chords: pads, or offbeat organ stabs
  if (T.organ && !boss) { if (st % 4 === 2) q.forEach(iv => inst('organ', t, root + iv - 12, spb * 1.4, .05)); }
  else if (st === 0) q.forEach(iv => inst('pad', t, root + iv - 12, spb * 16, bar.quiet ? .07 : .045));
  if (boss && st % 4 === 2) q.forEach(iv => inst('organ', t, root + iv, spb, .018));
  // arpeggio
  if (T.arp || boss) { const seq = [...q, q[0] + 12]; inst('arp', t, root + seq[st % seq.length] + (boss ? 0 : 12), spb * .9, bar.quiet ? .05 : boss ? .018 : .028); }
  // melody
  if (!bar.quiet || bar.half) for (const n of bar.mel) if (n.st === st) inst(boss ? 'lead!' : T.lead, t, scale(T, n.deg, bar.oct), spb * (n.len * 2 + .5), boss ? .035 : T.lead === 'twang' ? .11 : .07);
}
function R2(st) { return st % 4 === 2; }
