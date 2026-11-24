// =====================================================================
// SFX — richer sound effects on top of the audio buses.
// · every sound is placed left/right by where it happens on screen and varies a little each time (pitch, level)
// · impacts by what hits: a sabre slices and rings, Marge's fists boom, the chrome fist clangs, Ruby's guitar thuds
//   and twangs a power chord, Papi's hooves clop, Spora squelches, Magneto zaps, Demi sizzles hot and tinkles cold…
//   and the goons' weapons too (knives, prods, wrenches, chains, a fish)
// · voices: small synthesized grunts per warrior (formant voices: a gruff old admiral, a roadie's shout, a robot,
//   a punk, bubbles for Spora, a honk for Bernache, chitter for the raccoon), and the goons' oofs
// · footsteps by surface (dock planks in Havre, cobbles in De Soif), jumps, landings, dodges, charges, body falls
// · breakables by material (wood, barrel with its iron hoops, glass, metal, pottery, a piano), status effects, pick-ups
// =====================================================================
let PAN = 0;
const SFX = {};
function sfxAt(x) { PAN = typeof camX === 'number' ? Math.max(-.75, Math.min(.75, ((x - camX) / VW - .5) * 1.5)) : 0; return SFX; }
const J = (v, a = .08) => v * (1 + (Math.random() - .5) * 2 * a);   // a little variety every time
function sfxOut(out) { const B = buses(); if (out) return out; if (!PAN || !ac().createStereoPanner) return B.sfx; const p = ac().createStereoPanner(); p.pan.value = PAN; p.connect(B.sfx); return p; }
// building blocks (time t, all in seconds)
function sTone(t, f0, f1, d, v, type = 'sine', out, att = .003) { const a = ac(), o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(sfxOut(out)); o.start(t); o.stop(t + d + .02); return o; }
function sNoise(t, d, v, f0, f1, type = 'bandpass', q = 1, out, att = .004) { const a = ac(), s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); s.buffer = NBUF; s.loop = true; fl.type = type; fl.Q.value = q;
  fl.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) fl.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(fl).connect(g).connect(sfxOut(out)); s.start(t, Math.random() * 1.5); s.stop(t + d + .05); }
// a struck object: inharmonic partials that ring and die (metal, glass, hollow wood, a bell)
function sModal(t, f, ratios, d, v, out) { ratios.forEach((r, i) => sTone(t, f * r, f * r * .995, d / (1 + i * .55), v / (1 + i * .8), 'sine', out, .001)); }
const ROOM = () => buses().verb;
// a formant voice: a buzzy source through three vowel resonances
const VOWEL = { a: [780, 1180, 2700], o: [470, 820, 2650], u: [330, 720, 2450], e: [420, 1800, 2600], i: [300, 2250, 3000], ae: [660, 1650, 2500] };
function sVoice(t, f0, f1, d, v, vw = 'a', o = {}) { v *= 3; const a = ac(), out = sfxOut(), src = a.createOscillator(), env = a.createGain(), F = VOWEL[vw] || VOWEL.a;
  src.type = o.type || 'sawtooth'; src.frequency.setValueAtTime(f0, t); src.frequency.linearRampToValueAtTime((f0 + f1) / 2 * (o.peak || 1.08), t + d * .3); src.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + d);
  if (o.vib) { const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = o.vib; lg.gain.value = f0 * .04; l.connect(lg).connect(src.frequency); l.start(t); l.stop(t + d + .05); }
  env.gain.setValueAtTime(.0001, t); env.gain.exponentialRampToValueAtTime(v, t + Math.min(.03, d * .2)); env.gain.setValueAtTime(v, t + d * .55); env.gain.exponentialRampToValueAtTime(.0001, t + d);
  let head = src; if (o.robot) { const rm = a.createGain(), ro = a.createOscillator(); ro.frequency.value = o.robot; ro.type = 'square'; rm.gain.value = 0; ro.connect(rm.gain); src.connect(rm); head = rm; ro.start(t); ro.stop(t + d + .05); }
  F.forEach((ff, i) => { const bp = a.createBiquadFilter(), g = a.createGain(); bp.type = 'bandpass'; bp.frequency.value = ff * (o.fs || 1); bp.Q.value = 7 + i * 3; g.gain.value = [1, .55, .25][i] * (o.bright ? 1.3 : 1); head.connect(bp).connect(g).connect(env); });
  if (o.gruff) sNoise(t, d * .9, v * o.gruff * .6, 900 * (o.fs || 1), 500, 'bandpass', 1.4);
  env.connect(out); src.start(t); src.stop(t + d + .05); }
// ---- voices ----------------------------------------------------------------------------------------------------
const VOX = { amiral: { f: 104, v: 'o', gruff: .5, vib: 5 }, marge: { f: 188, v: 'a', gruff: .35 }, cyborg: { f: 74, v: 'o', robot: 46, gruff: .2 }, papi: { f: 138, v: 'e', vib: 7, gruff: .3 },
  ruby: { f: 262, v: 'a', bright: 1 }, spora: { bub: 1 }, magneto: { f: 112, v: 'u', gruff: .25 }, doc: { f: 238, v: 'e' }, demi: { f: 176, v: 'u', gruff: .6, fs: .85 },
  bernache: { honk: 1 }, raccoon: { chit: 1 }, soldier: { f: 132, v: 'a', gruff: .55 } };
const VCD = new Map();
SFX.voice = (id, kind = 'effort', x) => { try { const now = SND.now(), key = id + (x === undefined ? '' : ''); if ((VCD.get(id) || 0) > now) return; VCD.set(id, now + (kind === 'ko' ? .9 : .28)); if (x !== undefined) sfxAt(x);
  const V = VOX[id] || VOX.soldier, t = now + .01, L = { effort: [.14, .14, 1.15, .82], big: [.3, .2, 1.3, .7], hurt: [.18, .2, 1.1, .6], ko: [.75, .2, 1.05, .45], lift: [.32, .12, 1, .95], throw: [.2, .17, 1.2, .8], cheer: [.45, .16, 1.45, 1.2], jump: [.08, .06, 1.2, 1.1] }[kind] || [.14, .14, 1.1, .8];
  const [d, v, up, end] = L, vw = kind === 'hurt' || kind === 'lift' ? 'u' : kind === 'ko' ? 'o' : kind === 'cheer' ? 'ae' : V.v;
  if (V.bub) { for (let k = 0; k < (kind === 'ko' ? 9 : kind === 'big' ? 5 : 3); k++) sTone(t + k * .045, J(260 + k * 60), J(900 + k * 120), .05, v * 1.1, 'sine'); return; }
  if (V.honk) { sVoice(t, J(340), J(kind === 'hurt' || kind === 'ko' ? 220 : 300), d * 1.2, v * .65, 'a', { type: 'square', fs: 1.25, bright: 1 }); if (kind === 'big' || kind === 'ko') sVoice(t + d * 1.1, J(330), 240, d, v, 'a', { type: 'square', fs: 1.25 }); return; }
  if (V.chit) { const n = kind === 'ko' ? 6 : kind === 'big' ? 4 : 3; for (let k = 0; k < n; k++) sVoice(t + k * .06, J(560 + (k % 2) * 140), J(kind === 'hurt' ? 380 : 700), .05, v * .7, k % 2 ? 'i' : 'e', { fs: 1.4 }); return; }
  sVoice(t, J(V.f, .05), J(V.f * end, .05), d, v, vw, { vib: V.vib, robot: V.robot, gruff: V.gruff, fs: V.fs, bright: V.bright, peak: up }); } catch (e) {} finally { PAN = 0; } };
// the goons: gruff, varied by their seed
SFX.goon = (e, kind = 'hurt') => { try { const now = SND.now(); if ((e.vcd || 0) > now) return; e.vcd = now + .5; sfxAt(e.x); const s = (e.look && e.look.seed) || 3, f = 110 + (s * 37) % 70, t = now + .01;
  if (e.type === 'oscar') return sVoice(t, J(150), J(kind === 'down' ? 70 : 105), kind === 'down' ? .9 : .25, .2, 'o', { gruff: .7, vib: 6 });
  if (e.type === 'calve') return sVoice(t, J(175), J(kind === 'down' ? 90 : 140), kind === 'down' ? 1.0 : .22, .16, kind === 'down' ? 'o' : 'a', { vib: 6, bright: 1, peak: 1.3 });
  if (kind === 'down') sVoice(t, J(f * 1.2), J(f * .5), .5, .13, 'o', { gruff: .5 }); else sVoice(t, J(f), J(f * .7), .16, .12, ['u', 'o', 'a'][s % 3], { gruff: .5 }); } catch (e2) {} finally { PAN = 0; } };
// ---- impacts -----------------------------------------------------------------------------------------------------
const HKIND = { amiral: 'blade', marge: 'heavy', cyborg: 'metal', papi: 'hoof', ruby: 'guitar', spora: 'squelch', magneto: 'zap', doc: 'kick', demi: 'fire', bernache: 'slap', raccoon: 'light', soldier: 'butt' };
const WKIND = { knife: 'blade', axe: 'blade', harpoon: 'blade', prod: 'zap', chain: 'chain', wrench: 'metal', pipe: 'metal', shovel: 'metal', anchor: 'metal', hammer: 'metal', mace: 'metal', shield: 'metal', baton: 'butt', club: 'butt', rifleButt: 'butt', fish: 'fish', fists: 'heavy', staff: 'heavy' };
function body(t, str, lo = 1) { sTone(t, J(150 * lo + str * 30), 42 * lo, .1 + str * .12, .32 + str * .33); sTone(t, J(62 * lo), 38 * lo, .16 + str * .14, .25 + str * .3); }   // the thump you feel
function crack(t, str, f = 4200) { sNoise(t, .03, .22 + str * .2, J(f), f * .55, 'highpass', .7); }                                          // the slap on contact
SFX.impact = (kind, str = .5, x) => { try { if (x !== undefined) sfxAt(x); const t = SND.now(), R = ROOM(); str = Math.max(.15, Math.min(1.2, str));
  switch (kind) {
    case 'blade': crack(t, str * .6, 6000); sNoise(t, .09 + str * .05, .2 + str * .15, J(2600), 9000, 'bandpass', 1.6); sModal(t + .005, J(2300), [1, 2.41, 3.93], .35 + str * .25, .045 + str * .03); body(t, str * .5, 1.2); break;
    case 'heavy': crack(t, str, 3200); body(t, str * 1.1, .8); sNoise(t, .12 + str * .1, .25 + str * .2, J(900), 280, 'bandpass', 1.2); sTone(t, 48, 30, .35 + str * .2, .3 + str * .25); if (str > .7) sNoise(t, .5, .18, 900, 200, 'lowpass', .7, R); break;
    case 'metal': crack(t, str, 5000); body(t, str * .8, .9); sModal(t, J(420), [1, 2.76, 5.4, 8.93], .45 + str * .4, .07 + str * .06); sModal(t, J(420) * 1.5, [1, 2.76], .3, .05, R); break;
    case 'guitar': body(t, str * .9, .9); crack(t, str * .7, 3500); { const a = ac(), sh = a.createWaveShaper(), cv = new Float32Array(256); for (let i = 0; i < 256; i++) { const x2 = i / 128 - 1; cv[i] = Math.tanh(x2 * 6); } sh.curve = cv; const g = a.createGain(); g.gain.value = .5; sh.connect(g).connect(sfxOut());
        [82.4, 123.5, 164.8].forEach((f, i) => { const o = a.createOscillator(), e = a.createGain(); o.type = 'sawtooth'; o.frequency.value = J(f, .01) * (str > .8 ? 1.335 : 1); e.gain.setValueAtTime(.0001, t + i * .012); e.gain.exponentialRampToValueAtTime(.12, t + i * .012 + .004); e.gain.exponentialRampToValueAtTime(.0001, t + .55 + str * .3); o.connect(e).connect(sh); o.start(t); o.stop(t + 1); }); } sTone(t + .02, 520, 260, .18, .05, 'triangle'); break;
    case 'hoof': sModal(t, J(540), [1, 2.9, 4.6], .09, .22 + str * .1); body(t, str * .8, .95); crack(t, str * .4, 2500); break;
    case 'squelch': sNoise(t, .18, .25 + str * .15, J(380), 1300, 'bandpass', 4); sNoise(t + .03, .14, .15, 1600, 500, 'bandpass', 5); for (let k = 0; k < 3; k++) sTone(t + .04 + k * .04, J(300), J(800), .05, .07); body(t, str * .5, 1.1); break;
    case 'zap': { const a = ac(), o = a.createOscillator(), m = a.createOscillator(), mg = a.createGain(), e = a.createGain(); o.type = 'square'; o.frequency.value = J(95); m.frequency.value = 31; mg.gain.value = 80; m.connect(mg).connect(o.frequency); e.gain.setValueAtTime(.0001, t); e.gain.exponentialRampToValueAtTime(.09 + str * .05, t + .004); e.gain.exponentialRampToValueAtTime(.0001, t + .22 + str * .1); o.connect(e).connect(sfxOut()); o.start(t); m.start(t); o.stop(t + .4); m.stop(t + .4); }
      sNoise(t, .2, .16, 5000, 7000, 'highpass', .8); for (let k = 0; k < 5; k++) sNoise(t + Math.random() * .2, .012, .12, 6000, 0, 'highpass', 1); body(t, str * .5, 1); break;
    case 'kick': crack(t, str * .8, 3800); body(t, str, 1.05); sNoise(t, .06, .16, 1200, 600, 'bandpass', 1.4); break;
    case 'fire': body(t, str * .6, 1); sNoise(t, .3, .22 + str * .1, 600, 2400, 'bandpass', .8); for (let k = 0; k < 8; k++) sNoise(t + Math.random() * .3, .01, .1, 4000 + Math.random() * 3000, 0, 'highpass', 1); sModal(t + .06, J(3100), [1, 1.5, 2.3], .3, .03); break;
    case 'slap': sNoise(t, .06, .35 + str * .1, J(1500), 700, 'bandpass', .9); crack(t, str * .5, 4500); body(t, str * .4, 1.3); break;
    case 'light': crack(t, str * .6, 5000); body(t, str * .7, 1.3); break;
    case 'butt': sModal(t, J(260), [1, 2.3, 3.1], .14, .2); body(t, str, .95); crack(t, str * .6, 3000); break;
    case 'chain': body(t, str * .7, 1); for (let k = 0; k < 6; k++) sModal(t + k * .025 + Math.random() * .02, J(1800, .2), [1, 2.7], .12, .04); break;
    case 'fish': sNoise(t, .1, .4, J(900), 500, 'bandpass', 2); sNoise(t + .02, .12, .2, 2400, 1200, 'bandpass', 3); body(t, str * .5, 1.2); break;
    default: crack(t, str); body(t, str); sNoise(t, .07 + str * .06, .18 + str * .2, 1100, 500, 'bandpass', 1.2); }
  if (str >= .95) sNoise(t, .35, .12, 1400, 300, 'lowpass', .8, R); } catch (e) {} finally { PAN = 0; } };
// ---- swings ------------------------------------------------------------------------------------------------------
const WH = { blade: [2400, 7000, 3, .11], heavy: [380, 1300, 1.2, .2], metal: [500, 1800, 1.5, .16], guitar: [300, 1100, 1.4, .2], hoof: [600, 1600, 1.5, .12], squelch: [500, 1200, 2, .14],
  zap: [1200, 3600, 2.5, .12], kick: [800, 2600, 1.8, .12], fire: [500, 2200, 1, .18], slap: [900, 2600, 1.3, .12], light: [1400, 4200, 2, .09], butt: [700, 2000, 1.6, .14] };
SFX.swish = (kind, str = .5, x) => { try { if (x !== undefined) sfxAt(x); const t = SND.now(), [f0, f1, q, d] = WH[kind] || WH.light, D = d * (.8 + str * .6);
  sNoise(t, D, .07 + str * .1, J(f0), J(f1), 'bandpass', q, null, D * .45); if (str > .8) sNoise(t, D * 1.3, .06, f0 * .5, f1 * .5, 'bandpass', q * .7, null, D * .5);
  if (kind === 'fire') sNoise(t, D, .08, 300, 900, 'lowpass', .7); if (kind === 'zap') sTone(t, 220, 880, D, .03, 'square'); } catch (e) {} finally { PAN = 0; } };
// ---- moving around -----------------------------------------------------------------------------------------------
const SURF = { havre: 'wood', soif: 'stone' };
SFX.step = (who, x, big = 1) => { try { sfxAt(x); const t = SND.now(), s = SURF[LEVELS[LEVEL] && LEVELS[LEVEL].id] || 'wood', v = .055 * big;
  if (who === 'papi') { sModal(t, J(700, .1), [1, 2.6], .07, v * 1.3); sTone(t, 120, 70, .06, v * 1.5); return; }
  if (who === 'bernache') { sNoise(t, .04, v * 1.6, J(1100), 600, 'bandpass', 1.5); return; }
  if (who === 'spora') { if (Math.random() < .3) sTone(t, J(300), J(500), .05, v * .6); return; }
  if (who === 'cyborg') { sTone(t, J(70), 40, .12, v * 2.4); sModal(t, J(380), [1, 2.76], .08, v * .7); return; }
  if (s === 'wood') { sModal(t, J(210, .12), [1, 2.4], .07, v * 1.1); sNoise(t, .04, v * .8, 1400, 700, 'bandpass', 1.2); }
  else { sNoise(t, .03, v * 1.1, J(2600), 1500, 'bandpass', 1.4); sTone(t, J(110), 60, .05, v); } } catch (e) {} finally { PAN = 0; } };
SFX.jump = (id, x) => { try { sfxAt(x); const t = SND.now(); sNoise(t, .16, .07, 500, 2200, 'bandpass', 1.2, null, .05); sTone(t, 140, 90, .06, .08); } catch (e) {} finally { PAN = 0; } if (Math.random() < .3) SFX.voice(id, 'jump', x); };
SFX.land = (id, x, str = .5) => { try { sfxAt(x); const t = SND.now(); sTone(t, J(95), 40, .12 + str * .1, .22 + str * .25); sNoise(t, .1 + str * .1, .12 + str * .12, 1100, 300, 'lowpass', .8);
  if (SURF[LEVELS[LEVEL] && LEVELS[LEVEL].id] === 'wood') sModal(t, J(180), [1, 2.4, 3.7], .15, .08 + str * .06); } catch (e) {} finally { PAN = 0; } };
SFX.dodge = x => { try { sfxAt(x); const t = SND.now(); sNoise(t, .18, .14, 3000, 900, 'bandpass', 1.6, null, .02); sNoise(t + .02, .12, .06, 6000, 3000, 'highpass', .8); } catch (e) {} finally { PAN = 0; } };
SFX.dash = (id, x) => { try { sfxAt(x); const t = SND.now(); sNoise(t, .28, .16, 400, 1800, 'bandpass', 1, null, .03); sTone(t, 80, 45, .15, .25); sNoise(t, .05, .12, 2000, 900, 'bandpass', 1); } catch (e) {} finally { PAN = 0; } };
SFX.bodyfall = (x, big = 1) => { try { sfxAt(x); const t = SND.now(); sTone(t, J(80), 34, .25 * big, .35); sNoise(t, .18, .2, 900, 200, 'lowpass', .8); sNoise(t + .06, .1, .08, 1500, 600, 'bandpass', 1.2); } catch (e) {} finally { PAN = 0; } };
SFX.dodged = x => { try { sfxAt(x); const t = SND.now(); SFX.dodge(x); sModal(t + .04, 2600, [1, 1.5, 2], .4, .04); } catch (e) {} finally { PAN = 0; } };
SFX.counter = x => { try { sfxAt(x); const t = SND.now(); sModal(t, 1400, [1, 2.76, 5.4], .5, .08); sNoise(t, .15, .15, 2000, 6000, 'bandpass', 2); body(t, .8, 1); } catch (e) {} finally { PAN = 0; } };
// ---- things -------------------------------------------------------------------------------------------------------
const MAT = { crate: 'wood', fishcrate: 'wood', stall: 'wood', table: 'wood', chair: 'wood', stool: 'wood', cart: 'wood', barrel: 'barrel', keg: 'keg', bottles: 'glass', bin: 'metal', newsbox: 'metal', moto: 'metal', car: 'car', forklift: 'car', pot: 'pot', piano: 'piano', container: 'metal', rubble: 'stone' };
SFX.knock = (k, x) => { try { sfxAt(x); const t = SND.now(), m = MAT[k] || 'wood';   // a hit that doesn't break it yet
  if (m === 'metal' || m === 'car') sModal(t, J(330), [1, 2.76, 5.4], .4, .09); else if (m === 'glass') sModal(t, J(2100), [1, 2.3, 3.6], .3, .04); else if (m === 'pot') sModal(t, J(700), [1, 2.1, 3.3], .2, .1); else if (m === 'piano') { sModal(t, J(220), [1, 2, 3, 4.01], 1, .05); }
  else { sModal(t, J(m === 'barrel' || m === 'keg' ? 150 : 240), [1, 2.4, 3.7], .12, .16); if (m === 'barrel' || m === 'keg') sModal(t, 900, [1, 2.76], .3, .03); } sNoise(t, .05, .1, 1500, 600, 'bandpass', 1.2); } catch (e) {} finally { PAN = 0; } };
SFX.smash = (k, size = .5, x) => { try { sfxAt(x); const t = SND.now(), m = MAT[k] || 'wood', R = ROOM();
  const splinters = (n, f) => { for (let i = 0; i < n; i++) { const d = t + .02 + Math.random() * .35; sModal(d, J(f, .3), [1, 2.4], .05, .05); sNoise(d, .025, .06, 3000 + Math.random() * 2000, 0, 'bandpass', 3); } };
  const shards = n => { for (let i = 0; i < n; i++) sTone(t + Math.random() * .45, 2200 + Math.random() * 4200, 0, .2 + Math.random() * .3, .035, 'sine'); sNoise(t, .3, .25, 7000, 3500, 'highpass', 1); };
  sTone(t, J(110), 40, .2 + size * .2, .3 + size * .2);
  if (m === 'wood' || m === 'barrel' || m === 'keg') { sNoise(t, .15 + size * .1, .3, 1600, 600, 'bandpass', 1.2); splinters(6 + size * 8, 900); }
  if (m === 'barrel' || m === 'keg') sModal(t + .05, J(820), [1, 2.76, 5.4], .6, .05);
  if (m === 'keg') { sNoise(t + .03, .7, .2, 1600, 400, 'lowpass', .8); for (let i = 0; i < 6; i++) sTone(t + .1 + Math.random() * .5, J(400), J(900), .05, .04); }   // beer everywhere
  if (m === 'glass') shards(14);
  if (m === 'metal') { sModal(t, J(260), [1, 2.76, 5.4, 8.93], .8, .1); sModal(t + .08, J(390), [1, 2.76], .5, .06, R); sNoise(t, .3, .2, 2400, 800, 'bandpass', 1.5); }
  if (m === 'pot') { sModal(t, J(620), [1, 2.1, 3.3], .25, .1); shards(5); sNoise(t, .2, .2, 2600, 900, 'bandpass', 1.2); }
  if (m === 'car') { SND.crash(1.6); sModal(t, 180, [1, 2.76, 5.4], 1.2, .1, R); shards(10); }
  if (m === 'piano') { [65.4, 98, 130.8, 164.8, 196, 261.6, 329.6].forEach((f, i) => sModal(t + i * .015, f, [1, 2, 3.01, 4.03], 2.2, .04, i % 2 ? R : null)); splinters(10, 700); }
  if (m === 'stone') { sNoise(t, .5, .3, 900, 200, 'lowpass', .8); for (let i = 0; i < 10; i++) sNoise(t + Math.random() * .5, .03, .08, 1500 + Math.random() * 1500, 0, 'bandpass', 3); }
  if (size > .8) sNoise(t, .6, .14, 1200, 250, 'lowpass', .8, R); } catch (e) {} finally { PAN = 0; } };
SFX.yum = x => { try { sfxAt(x); const t = SND.now(); [523, 659, 784, 1046].forEach((f, i) => sTone(t + i * .06, f, f, .22, .07, 'triangle')); sModal(t + .25, 2093, [1, 2.4], .4, .03); } catch (e) {} finally { PAN = 0; } };
SFX.heal = x => { try { sfxAt(x); const t = SND.now(); [659, 880, 1318].forEach((f, i) => sTone(t + i * .08, f, f * 1.01, .35, .05, 'sine')); sNoise(t, .4, .05, 4000, 8000, 'highpass', .8); } catch (e) {} finally { PAN = 0; } };
// status effects landing on someone
SFX.status = (k, x) => { try { sfxAt(x); const t = SND.now();
  if (k === 'poison') { for (let i = 0; i < 7; i++) sTone(t + i * .05 + Math.random() * .02, J(180), J(420), .07, 0.096); sNoise(t, .35, 0.16, 300, 900, 'bandpass', 5); }
  else if (k === 'dizzy') { for (let i = 0; i < 4; i++) sTone(t + i * .09, J(2400), J(3200), .07, 0.056, 'sine'); sTone(t, 600, 300, .3, 0.08, 'triangle'); }   // the little birds
  else if (k === 'bleed') { sNoise(t, .12, 0.24, 2500, 1200, 'bandpass', 2); for (let i = 0; i < 3; i++) sTone(t + .15 + i * .18, J(1200), J(500), .05, 0.064); }
  else { sTone(t, 300, 200, .2, 0.08, 'sawtooth'); } } catch (e) {} finally { PAN = 0; } };
SFX.laser = x => { try { sfxAt(x); const t = SND.now(); sTone(t, 1800, 320, .16, .06, 'square'); sTone(t, 900, 160, .16, .05, 'sawtooth'); sNoise(t, .05, .08, 5000, 2000, 'highpass', 1); } catch (e) {} finally { PAN = 0; } };
// a rising swell when a special starts, coloured per warrior
const SPCOL = { amiral: [200, 900], marge: [120, 700], cyborg: [60, 400], papi: [150, 800], ruby: [220, 1400], spora: [300, 1200], magneto: [90, 1800], doc: [400, 1600], demi: [140, 2400], bernache: [300, 900], raccoon: [500, 2000], soldier: [150, 700] };
SFX.special = (id, x) => { try { sfxAt(x); const t = SND.now(), [a, b] = SPCOL[id] || [200, 1000]; sNoise(t, .5, .32, a * 3, b * 4, 'bandpass', 2, null, .35); sTone(t, a, b, .45, .11, 'sawtooth', null, .3); sTone(t, a * 1.5, b * 1.5, .45, .07, 'triangle', null, .3); sNoise(t + .3, .6, .16, 2000, 400, 'lowpass', .8, ROOM()); } catch (e) {} finally { PAN = 0; } SFX.voice(id, 'big', x); };
