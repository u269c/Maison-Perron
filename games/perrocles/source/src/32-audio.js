// ═══ AUDIO: Mine-Moule's engine, with a lyre, an aulos, a frame drum, and a second layer for the God's view ═══
// Each layer of a track is tagged w: 'm' (mortal), 'g' (God's view) or both. Both layers always play in step; switching worlds crossfades.
const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const Audio = { ctx: null, music: { key: null, playing: false, timer: null, oscs: [], ev: [], idx: 0, t0: 0, loopDur: 1, track: null }, world: 'm',
  ensure() { if (this.ctx || window.SIM_ON) { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); return; } const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0.6; this.master.connect(c.destination); this.sfxGain = c.createGain(); this.sfxGain.connect(this.master); this.musicGain = c.createGain(); this.musicGain.connect(this.master);
    this.mBus = c.createGain(); this.gBus = c.createGain(); this.gBus.gain.value = 0; this.mBus.connect(this.musicGain);
    // the God's view sounds from far away: a long hall
    const len = c.sampleRate * 3.2, ir = c.createBuffer(2, len, c.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    this.verb = c.createConvolver(); this.verb.buffer = ir; const vg = c.createGain(); vg.gain.value = 0.55; this.gBus.connect(this.verb); this.verb.connect(vg); vg.connect(this.musicGain); const dry = c.createGain(); dry.gain.value = 0.6; this.gBus.connect(dry); dry.connect(this.musicGain);
    this.echoIn = c.createGain(); this.echoDelay = c.createDelay(2); this.echoDelay.delayTime.value = 0.38; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; const fb = c.createGain(); fb.gain.value = 0.28; const wet = c.createGain(); wet.gain.value = 0.2;
    this.echoIn.connect(this.echoDelay); this.echoDelay.connect(lp); lp.connect(fb); fb.connect(this.echoDelay); lp.connect(wet); wet.connect(this.musicGain);
    const nl = (c.sampleRate * 0.6) | 0, nb = c.createBuffer(1, nl, c.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nl; i++) nd[i] = Math.random() * 2 - 1; this.noise = nb; this.applyGain();
    if (this.pending) { const p = this.pending; this.pending = null; this.playMusic(p); } },
  applyGain() { if (!this.master) return; this.musicGain.gain.value = Save.d.music ? 0.75 : 0; this.sfxGain.gain.value = Save.d.sfx ? 1 : 0; },
  setWorld(w, fade = 0.7) { this.world = w; if (!this.ctx) return; const t = this.ctx.currentTime; for (const [b, on] of [[this.mBus, w === 'm'], [this.gBus, w === 'g']]) { b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value, t); b.gain.linearRampToValueAtTime(on ? 1 : 0.0001, t + fade); } },
  _reg(o, end) { o.__end = end; this.music.oscs.push(o); },
  _noiseHit(t, f, gain, dur, dest, band) { const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; const fl = c.createBiquadFilter(); fl.type = band ? 'bandpass' : 'highpass'; fl.frequency.value = f; const g = c.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); s.connect(fl); fl.connect(g); g.connect(dest); s.start(t); s.stop(t + dur + 0.05); this._reg(s, t + dur + 0.05); },
  _tone(t, f0, f1, type, gain, dur, dest) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.02); this._reg(o, t + dur + 0.02); },
  _perc(h, t, bus) { switch (h) { case 'D': this._tone(t, 120, 70, 'sine', 0.55, 0.28, bus); this._noiseHit(t, 400, 0.12, 0.06, bus, true); break; // frame drum, low
    case 'd': this._noiseHit(t, 1800, 0.18, 0.07, bus, true); this._tone(t, 260, 200, 'triangle', 0.12, 0.05, bus); break; // frame drum, rim
    case 'J': this._noiseHit(t, 7000, 0.12, 0.12, bus); this._noiseHit(t + 0.03, 8000, 0.06, 0.08, bus); break; // tambourine jingles
    case 'C': this._noiseHit(t, 5200, 0.1, 0.03, bus, true); break; // finger cymbals, tick
    case 'B': for (const m of [1, 2.76, 5.4]) this._tone(t, 1760 * m, 1760 * m, 'sine', 0.05 / m, 1.6, bus); break; } },
  _voice(v, f, t, dur, gain, pan, echo, bus) { const c = this.ctx, end = t + dur + (v === 'bell' || v === 'lyre' ? 1.6 : 0.6), g = c.createGain(); let out = g; if (pan && c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = pan; g.connect(p); out = p; } out.connect(bus); if (echo) out.connect(this.echoIn);
    const osc = (type, freq, det) => { const o = c.createOscillator(); o.type = type; o.frequency.value = freq; if (det) o.detune.value = det; o.start(t); o.stop(end); this._reg(o, end); return o; };
    const vib = (o, rate, depth, delay) => { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = rate; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(depth, t + delay + 0.25); l.connect(lg); lg.connect(o.detune); l.start(t); l.stop(end); this._reg(l, end); };
    const env = (a, sus, rel) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + a); g.gain.setValueAtTime(gain * sus, t + Math.max(a + 0.01, dur * 0.85)); g.gain.exponentialRampToValueAtTime(0.0008, t + dur + rel); };
    switch (v) {
      case 'lyre': { const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(4200, t); lp.frequency.exponentialRampToValueAtTime(900, t + 0.6); lp.connect(g); for (const [m, a, ty] of [[1, 1, 'triangle'], [2, 0.32, 'sine'], [3, 0.12, 'sine'], [1.003, 0.4, 'sawtooth']]) { const o = osc(ty, f * m), og = c.createGain(); og.gain.value = a * (ty === 'sawtooth' ? 0.25 : 1); o.connect(og); og.connect(lp); }
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + 0.004); g.gain.exponentialRampToValueAtTime(gain * 0.3, t + 0.25); g.gain.exponentialRampToValueAtTime(0.0008, t + Math.min(2.2, 0.8 + dur)); break; }
      case 'aulos': { const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2.2; bp.Q.value = 0.9; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; bp.connect(lp); lp.connect(g); for (const d of [-6, 6]) { const o = osc('sawtooth', f, d); o.connect(bp); vib(o, 5.2, 14, 0.18); } const sq = osc('square', f * 0.5); const sg = c.createGain(); sg.gain.value = 0.08; sq.connect(sg); sg.connect(lp); env(0.05, 0.85, 0.1); this._noiseHit(t, f * 3, gain * 0.3, 0.06, out, true); break; }
      case 'choir': { const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800; lp.connect(g); for (const d of [-11, -3, 4, 12]) { const o = osc(d % 2 ? 'triangle' : 'sine', f, d); o.connect(lp); vib(o, 4.4 + d * 0.03, 8, 0.4); } g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + Math.min(0.9, dur * 0.5)); g.gain.setValueAtTime(gain, t + dur * 0.8); g.gain.exponentialRampToValueAtTime(0.0008, t + dur + 0.6); break; }
      case 'bell': { for (const [m, a] of [[1, 1], [2.76, 0.3], [5.4, 0.12], [8.9, 0.05]]) { const o = osc('sine', f * m), og = c.createGain(); og.gain.value = a; o.connect(og); og.connect(g); } g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0008, t + 1.8); break; }
      case 'drone': { const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; lp.connect(g); for (const [m, d] of [[1, -4], [1, 4], [1.5, 0], [0.5, 0]]) osc('sawtooth', f * m, d).connect(lp); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + 0.8); g.gain.setValueAtTime(gain, t + dur * 0.9); g.gain.exponentialRampToValueAtTime(0.0008, t + dur + 0.8); break; }
      case 'pluckBass': { const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; lp.connect(g); osc('triangle', f).connect(lp); osc('sine', f * 2).connect(lp); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + 0.006); g.gain.exponentialRampToValueAtTime(gain * 0.4, t + 0.2); g.gain.exponentialRampToValueAtTime(0.0008, t + dur + 0.3); break; }
      default: { osc(v || 'triangle', f).connect(g); env(0.01, 0.8, 0.1); } } },
  noteToFreq(n) { const m = String(n).match(/^([A-G])(#|b)?(\d)$/); if (!m) return 0; return 440 * 2 ** ((+m[3] * 12 + SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) - 57) / 12); },
  _compile(tr) { if (tr.__c) return tr.__c; const beat = 60 / tr.bpm, ev = []; let dur = 0;
    for (const L of tr.layers) { let t = 0; const w = L.w || '*'; if (L.drum) { for (const [h, b] of L.notes) { if (h !== 'R') ev.push([t, h, 0, 0, 0, L.gain || 1, 0, 0, w]); t += b * beat; } }
      else for (const [n, b] of L.notes) { const d = b * beat; if (n && n !== 'R') { const notes = n.split('+'); for (const nn of notes) ev.push([t, null, this.noteToFreq(nn), d * (L.sus ?? 0.9), L.voice || 'triangle', L.gain ?? 0.2, !!L.echo, L.pan || 0, w]); } t += d; }
      dur = Math.max(dur, t); } ev.sort((a, b) => a[0] - b[0]); return (tr.__c = { ev, dur }); },
  playMusic(key, fade = true) { if (!this.ctx) { this.pending = key; return; } if (this.music.key === key && this.music.playing) return; const m = this.music;
    if (fade && m.playing) { const g = this.musicGain.gain, now = this.ctx.currentTime; g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(0.0001, now + 0.8); clearTimeout(this._fadeT); m.key = key;
      this._fadeT = setTimeout(() => { this._start(key); const n2 = this.ctx.currentTime; g.cancelScheduledValues(n2); g.setValueAtTime(0.0001, n2); g.linearRampToValueAtTime(Save.d.music ? 0.75 : 0, n2 + 1.2); }, 820); return; }
    this._start(key); },
  _start(key) { this.stopMusic(); const tr = MUSIC[key]; if (!tr) return; const c = this._compile(tr), m = this.music; Object.assign(m, { key, track: tr, ev: c.ev, loopDur: c.dur, idx: 0, playing: true }); m.t0 = this.ctx.currentTime + 0.1; this.echoDelay.delayTime.setValueAtTime((tr.echo || 0.75) * 60 / tr.bpm, this.ctx.currentTime); this._pump(); },
  _pump() { const m = this.music; if (!m.playing) return; const now = this.ctx.currentTime, hz = now + 1.2;
    for (; ;) { if (m.idx >= m.ev.length) { if (m.track.loop === false) { m.playing = false; return; } m.idx = 0; m.t0 += m.loopDur; } const e = m.ev[m.idx], at = m.t0 + e[0]; if (at > hz) break; m.idx++; if (at < now - 0.03) continue;
      const bus = e[8] === 'g' ? this.gBus : e[8] === 'm' ? this.mBus : this.musicGain; if (e[1]) this._perc(e[1], at, bus); else this._voice(e[4], e[2], at, e[3], e[5], e[7], e[6], bus); }
    m.oscs = m.oscs.filter((o) => o.__end > now); m.timer = setTimeout(() => this._pump(), 200); },
  stopMusic() { const m = this.music; m.playing = false; if (m.timer) clearTimeout(m.timer); for (const o of m.oscs) { try { o.stop(); } catch (e) { } } m.oscs = []; m.key = null; },
  blip(f, dur, wave, gain, t, dest) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = wave; o.frequency.value = f; g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.02, dur)); o.connect(g); g.connect(dest || this.sfxGain); o.start(t); o.stop(t + dur + 0.03); },
  // the voice of a dialogue line: a short phrase of each character's instrument, then soft syllable ticks while text types
  speak(voice, i) { if (!this.ctx || !Save.d.sfx) return; const t = this.ctx.currentTime, S = this.sfxGain, V = VOICES[voice] || VOICES.default; const f = this.noteToFreq(V.notes[i % V.notes.length]) * (1 + (Math.random() - 0.5) * 0.04); this.blip(f, 0.05, V.wave, V.gain, t); },
  sfx(name, k = 1) { if (!this.ctx || !Save.d.sfx) return; const t = this.ctx.currentTime, S = this.sfxGain, n = (q) => this.noteToFreq(q);
    const F = { step: () => this._noiseHit(t, 700 + Math.random() * 400, 0.05 * k, 0.035, S, true), jump: () => { this._noiseHit(t, 1200, 0.08, 0.06, S, true); this.blip(n('A4'), 0.05, 'triangle', 0.06, t); }, land: () => this._noiseHit(t, 500, 0.18, 0.07, S, true),
      swing: () => this._noiseHit(t, 2400, 0.16, 0.14, S), hit: () => { this._noiseHit(t, 900, 0.4, 0.09, S, true); this.blip(n('C3'), 0.08, 'square', 0.18, t); }, whirl: () => this._noiseHit(t, 1800, 0.06, 0.1, S, true), shoot: () => { this._noiseHit(t, 3000, 0.14, 0.08, S); this.blip(n('E5'), 0.04, 'triangle', 0.08, t); },
      hurt: () => { this.blip(n('A3'), 0.14, 'sawtooth', 0.18, t); this.blip(n('E3'), 0.16, 'sawtooth', 0.15, t + 0.05); }, bark: () => { this._tone(t, 520, 300, 'sawtooth', 0.12, 0.09, S); this._tone(t + 0.13, 560, 320, 'sawtooth', 0.1, 0.08, S); },
      bleat: () => { const o = this.ctx.createOscillator(), g = this.ctx.createGain(), l = this.ctx.createOscillator(), lg = this.ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = 330; l.frequency.value = 22; lg.gain.value = 40; l.connect(lg); lg.connect(o.frequency); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06, t + 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5); o.connect(g); g.connect(S); o.start(t); l.start(t); o.stop(t + 0.55); l.stop(t + 0.55); },
      cluck: () => { for (let i = 0; i < 3; i++) this._tone(t + i * 0.07, 900, 600, 'square', 0.04, 0.04, S); }, meow: () => this._tone(t, 600, 900, 'triangle', 0.06, 0.3, S), howl: () => this._tone(t, 300, 520, 'sawtooth', 0.06, 1.4, S), growl: () => this._noiseHit(t, 160, 0.3, 0.5, S, true),
      hiss: () => this._noiseHit(t, 5000, 0.18, 0.5, S, true), page: () => { this._noiseHit(t, 3000, 0.1, 0.2, S); [74, 79, 83].forEach((q, i) => this.blip(440 * 2 ** ((q - 69) / 12), 0.4, 'triangle', 0.06, t + 0.1 + i * 0.08)); },
      eyeOpen: () => { [62, 69, 74, 81, 86].forEach((q, i) => this.blip(440 * 2 ** ((q - 69) / 12), 1.2, 'sine', 0.07, t + i * 0.05)); this._noiseHit(t, 4000, 0.1, 0.8, S); }, eyeClose: () => { [86, 81, 74, 69].forEach((q, i) => this.blip(440 * 2 ** ((q - 69) / 12), 0.8, 'sine', 0.06, t + i * 0.05)); },
      ichor: () => [81, 88, 93].forEach((q, i) => this.blip(440 * 2 ** ((q - 69) / 12), 0.4, 'sine', 0.08, t + i * 0.06)), coin: () => { this.blip(n('E6'), 0.06, 'square', 0.06, t); this.blip(n('B6'), 0.1, 'square', 0.05, t + 0.05); },
      thunder: () => { this._noiseHit(t, 80, 0.7, 2.2, S, true); this._noiseHit(t + 0.1, 200, 0.4, 1.6, S, true); this._tone(t, 60, 35, 'sine', 0.5, 1.8, S); }, smash: () => { for (let i = 0; i < 4; i++) this._noiseHit(t + i * 0.03, 800 + i * 600, 0.25, 0.12, S, true); },
      boxOpen: () => this._noiseHit(t, 2600, 0.04, 0.06, S, true), choose: () => this.blip(n('A5'), 0.05, 'triangle', 0.08, t), save: () => [62, 66, 69, 74].forEach((q, i) => this.blip(440 * 2 ** ((q - 69) / 12), 0.5, 'triangle', 0.08, t + i * 0.08)) };
    (F[name] || F.step)(); },
};
const VOICES = { default: { notes: ['A4', 'C5', 'D5', 'E5'], wave: 'triangle', gain: 0.035 }, hero: { notes: ['D5', 'E5', 'F5', 'A5', 'G5'], wave: 'triangle', gain: 0.035 }, theano: { notes: ['A4', 'C5', 'D5', 'C5'], wave: 'sine', gain: 0.05 }, mentor: { notes: ['D4', 'F4', 'A4', 'G4'], wave: 'triangle', gain: 0.04 },
  odysseus: { notes: ['G3', 'A3', 'C4', 'D4'], wave: 'square', gain: 0.018 }, pythia: { notes: ['E4', 'F4', 'B4', 'A4'], wave: 'sine', gain: 0.05 }, pan: { notes: ['E5', 'G5', 'A5', 'B5', 'D6'], wave: 'square', gain: 0.016 }, athena: { notes: ['D4', 'A4', 'D5', 'F5'], wave: 'sine', gain: 0.05 },
  man: { notes: ['C4', 'E4', 'G4'], wave: 'triangle', gain: 0.035 }, woman: { notes: ['G4', 'B4', 'D5'], wave: 'sine', gain: 0.045 }, elder: { notes: ['A3', 'C4', 'E4'], wave: 'triangle', gain: 0.035 }, kid: { notes: ['E5', 'G5', 'A5', 'C6'], wave: 'triangle', gain: 0.03 }, dog: { notes: ['C5'], wave: 'square', gain: 0.01 } };
// ── the music: modes of old Greece, built with Mine-Moule's grid notation ──
function grid(str, step) { const out = []; for (const tok of str.trim().split(/\s+/)) { if (tok === '|' || tok === '') continue; const last = out[out.length - 1]; if (tok === '-') { if (last) last[1] += step; continue; } if (tok === '.') { if (last && last[0] === 'R') last[1] += step; else out.push(['R', step]); continue; } out.push([tok, step]); } return out; }
const g8 = (s) => grid(s, 0.5), g4 = (s) => grid(s, 1), g16 = (s) => grid(s, 0.25), rep = (a, n) => { let o = []; while (n-- > 0) o = o.concat(a); return o; };
const MUSIC = {
  // D Dorian, an easy walk: lyre melody and plucked bass in the mortal world; bells and a choir carry the same tune in the God's view
  village: { bpm: 96, echo: 0.75, layers: [
    { w: 'm', voice: 'lyre', gain: 0.17, pan: -0.15, notes: g8('D5 . F5 E5 D5 . A4 . | C5 D5 E5 . D5 C5 A4 . | G4 . A4 C5 D5 . E5 F5 | E5 . D5 C5 D5 - - . | D5 . F5 E5 D5 . A4 . | C5 D5 E5 . G5 F5 E5 . | F5 E5 D5 C5 A4 . G4 A4 | D5 - - - . . . .') },
    { w: 'm', voice: 'pluckBass', gain: 0.22, notes: g4('D3 A2 D3 A2 | C3 G2 C3 G2 | G2 D3 F2 C3 | A2 E3 D3 A2 | D3 A2 D3 A2 | C3 G2 C3 G2 | F2 C3 G2 D3 | D3 A2 D3 .') },
    { w: 'm', voice: 'aulos', gain: 0.05, pan: 0.2, notes: [['R', 16], ...g4('A4 - G4 - | F4 - E4 - | D4 - - - | . . . .')] },
    { w: 'm', drum: true, gain: 1, notes: rep(g8('D . d . d d . d | D . d . J . d .'), 4) },
    { w: 'g', voice: 'bell', gain: 0.12, pan: -0.2, notes: g8('D6 . F6 E6 D6 . A5 . | C6 D6 E6 . D6 C6 A5 . | G5 . A5 C6 D6 . E6 F6 | E6 . D6 C6 D6 - - . | D6 . F6 E6 D6 . A5 . | C6 D6 E6 . G6 F6 E6 . | F6 E6 D6 C6 A5 . G5 A5 | D6 - - - . . . .') },
    { w: 'g', voice: 'choir', gain: 0.06, notes: g4('D4+A4 - - - | C4+G4 - - - | G3+D4 - - - | A3+E4 - - - | D4+A4 - - - | C4+G4 - - - | F3+C4 - G3+D4 - | D4+A4 - - -') },
    { w: 'g', voice: 'drone', gain: 0.05, notes: [['D2', 32]] },
    { w: 'g', drum: true, notes: rep(g4('B . . . . . . .'), 4) } ] },
  // A Phrygian, a steady climb
  road: { bpm: 104, echo: 0.5, layers: [
    { w: 'm', voice: 'lyre', gain: 0.15, notes: g8('A4 Bb4 C5 . A4 . E5 . | D5 C5 Bb4 . A4 . . . | G4 A4 Bb4 C5 D5 . C5 Bb4 | A4 - - . . . . . | E5 . D5 C5 Bb4 . C5 . | D5 . E5 F5 E5 D5 C5 . | Bb4 A4 G4 . A4 Bb4 C5 Bb4 | A4 - - - . . . .') },
    { w: 'm', voice: 'pluckBass', gain: 0.2, notes: g8('A2 . E3 . A2 . E3 . | A2 . E3 . A2 . E3 . | G2 . D3 . G2 . D3 . | A2 . E3 . A2 . E3 . | A2 . E3 . A2 . E3 . | D3 . A2 . D3 . A2 . | G2 . D3 . F2 . C3 . | A2 . E3 . A2 . . .') },
    { w: 'm', drum: true, notes: rep(g8('D . d d D . d . | D . d . d J d d'), 4) },
    { w: 'm', voice: 'aulos', gain: 0.045, pan: 0.3, notes: [['R', 16], ...g8('E5 - - - D5 - C5 - | Bb4 - - - A4 - - - | G4 - A4 - Bb4 - C5 - | A4 - - - - - - -')] },
    { w: 'g', voice: 'bell', gain: 0.1, notes: g8('A5 Bb5 C6 . A5 . E6 . | D6 C6 Bb5 . A5 . . . | G5 A5 Bb5 C6 D6 . C6 Bb5 | A5 - - . . . . . | E6 . D6 C6 Bb5 . C6 . | D6 . E6 F6 E6 D6 C6 . | Bb5 A5 G5 . A5 Bb5 C6 Bb5 | A5 - - - . . . .') },
    { w: 'g', voice: 'choir', gain: 0.06, notes: g4('A3+E4 - - - | A3+E4 - - - | G3+D4 - - - | A3+E4 - - - | A3+E4 - - - | D4+A4 - - - | G3+D4 - F3+C4 - | A3+E4 - - -') },
    { w: 'g', voice: 'drone', gain: 0.05, notes: [['A1', 32]] } ] },
  // E Phrygian, solemn: Delphi
  delphi: { bpm: 72, echo: 0.75, layers: [
    { w: 'm', voice: 'lyre', gain: 0.16, notes: g8('E4 B4 E5 . F5 . E5 D5 | C5 . B4 . A4 . B4 . | E4 B4 E5 . G5 . F5 E5 | D5 . C5 B4 C5 - - . | A4 C5 E5 . D5 . C5 B4 | A4 . G4 . F4 . E4 . | F4 G4 A4 B4 C5 . B4 A4 | B4 - - - E4 - - .') },
    { w: 'm', voice: 'drone', gain: 0.045, notes: [['E2', 16], ['A2', 8], ['E2', 8]] },
    { w: 'm', voice: 'aulos', gain: 0.05, pan: 0.25, notes: [['R', 8], ...g4('B4 - - - | C5 - B4 - | A4 - - - | G4 - F4 - | E4 - - -'), ['R', 4]] },
    { w: 'm', drum: true, notes: rep(g4('D . d . | D . . d'), 4) },
    { w: 'g', voice: 'choir', gain: 0.07, notes: g4('E4+B4 - - - | A3+E4 - - - | E4+B4 - - - | G3+D4 - - - | A3+E4 - - - | F3+C4 - - - | D4+A4 - - - | E4+B4 - - -') },
    { w: 'g', voice: 'bell', gain: 0.09, notes: g8('E5 B5 E6 . F6 . E6 D6 | C6 . B5 . A5 . B5 . | E5 B5 E6 . G6 . F6 E6 | D6 . C6 B5 C6 - - . | A5 C6 E6 . D6 . C6 B5 | A5 . G5 . F5 . E5 . | F5 G5 A5 B5 C6 . B5 A5 | B5 - - - E5 - - .') },
    { w: 'g', voice: 'drone', gain: 0.05, notes: [['E1', 32]] } ] },
  // night: slow, open lyre, crickets of the frame drum's rim
  night: { bpm: 60, echo: 0.75, layers: [
    { w: 'm', voice: 'lyre', gain: 0.12, notes: g4('D4 A4 D5 . | C5 A4 E4 . | F4 A4 C5 . | E4 G4 A4 . | D4 A4 D5 . | E5 C5 A4 . | F4 E4 D4 C4 | D4 - - .') },
    { w: 'm', voice: 'drone', gain: 0.035, notes: [['D2', 32]] },
    { w: 'g', voice: 'choir', gain: 0.06, notes: g4('D4+A4 - - - | A3+E4 - - - | F3+C4 - - - | E3+A3 - - - | D4+A4 - - - | A3+E4 - - - | F3+C4 - - - | D4+A4 - - -') },
    { w: 'g', voice: 'bell', gain: 0.07, notes: g4('D5 A5 D6 . | C6 A5 E5 . | F5 A5 C6 . | E5 G5 A5 . | D5 A5 D6 . | E6 C6 A5 . | F5 E5 D5 C5 | D5 - - .') } ] },
  // the serpents: C Phrygian dominant, quick and low
  serpents: { bpm: 132, echo: 0.5, layers: [
    { w: '*', voice: 'pluckBass', gain: 0.24, notes: rep(g8('C3 . C3 Db3 C3 . G2 . | C3 . C3 Db3 E3 . Db3 .'), 4) },
    { w: 'm', voice: 'aulos', gain: 0.06, notes: g8('G4 Ab4 B4 C5 B4 Ab4 G4 . | F4 . E4 F4 G4 . . . | G4 Ab4 B4 C5 Db5 C5 B4 . | Ab4 G4 F4 E4 F4 - G4 . | C5 . B4 . Ab4 . G4 . | F4 G4 Ab4 . G4 F4 E4 . | Db4 E4 F4 G4 Ab4 . B4 . | C5 - - - . . . .') },
    { w: '*', drum: true, notes: rep(g8('D d d D d d D d | D d D d J d D d'), 4) },
    { w: 'g', voice: 'choir', gain: 0.07, notes: g4('C4+G4 - - - | C4+G4 - - - | Db4+Ab4 - - - | C4+G4 - - - | C4+G4 - - - | Db4+Ab4 - - - | E3+B3 - - - | C4+G4 - - -') } ] },
  title: { bpm: 66, echo: 0.75, layers: [
    { w: 'm', voice: 'lyre', gain: 0.16, notes: g4('D4 A4 F5 E5 | D5 C5 A4 . | G4 C5 E5 D5 | C5 A4 G4 . | F4 A4 D5 C5 | A4 G4 F4 E4 | D4 F4 A4 E5 | D5 - - .') },
    { w: 'm', voice: 'drone', gain: 0.04, notes: [['D2', 32]] }, { w: 'm', voice: 'aulos', gain: 0.04, notes: [['R', 16], ...g4('A4 - - - | G4 - F4 - | E4 - - - | D4 - - -')] },
    { w: 'g', voice: 'choir', gain: 0.06, notes: g4('D4+A4 - - - | A3+E4 - - - | C4+G4 - - - | A3+E4 - - - | F3+C4 - - - | A3+E4 - - - | D4+A4 - - - | D4+A4 - - -') } ] },
};
