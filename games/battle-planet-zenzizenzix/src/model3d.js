// =====================================================================
// MODEL3D — the showcase models on the select screen: real 3D, ray-marched on the GPU.
// Each warrior is rebuilt from smooth primitives (spheres, round cones, ellipsoids, rounded boxes, tori) hung on the same
// skeleton the game uses (solve() on the same poses), so the combos and specials play in 3D. The shader lights them like a
// studio turntable: warm key light with soft shadows, cool fill, a coloured rim light per side, ambient occlusion, toon-ish
// ramp, ink outline. Model space: x forward, y up, z to the warrior's left (front limbs at +z). Units: rig units.
// If WebGL2 is missing, the select screen falls back to the flat drawing.
// =====================================================================
const M3D = { ok: null, P: [], G: [], MAXP: 128, W: 300, H: 400, Q: 1.25 };
const M3 = { MATTE: 0, SKIN: 1, HAIR: 2, METAL: 3, EMIT: 4, TARTAN: 5, CAMO: 6, LEATHER: 7, EYE: 8, GOLD: 9, TATTOO: 10, SPLIT: 11, SPOTS: 12, FUR: 13, GLASS: 14 };
const M3FS = `#version 300 es
precision highp float;
uniform sampler2D P; uniform int N; uniform vec2 R; uniform vec3 ro, cf, cr, cu; uniform float th, T; uniform vec3 key, rimc, rimd; uniform vec4 bs; uniform float floorR;
out vec4 outc;
vec4 pf(int i, int k) { return texelFetch(P, ivec2(k, i), 0); }
mat2 r2(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float sdRC(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3 ba = b - a; float l2 = dot(ba, ba); if (l2 < 1e-5) return length(p - a) - max(r1, r2);
  float rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1.0 / l2; vec3 pa = p - a; float y = dot(pa, ba), z = y - l2;
  vec3 xv = pa * l2 - ba * y; float x2 = dot(xv, xv), y2 = y * y * l2, z2 = z * z * l2, k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1; }
float sdEl(vec3 p, vec3 r) { float k0 = length(p / r), k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / max(k1, 1e-4); }
float sdBx(vec3 p, vec3 b, float rr) { vec3 q = abs(p) - b + rr; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - rr; }
float sdTo(vec3 p, float R0, float r) { vec2 q = vec2(length(p.xz) - R0, p.y); return length(q) - r; }
float prim(int i, vec3 p, vec4 a, vec4 b, vec4 c) {
  int ty = int(a.w + .5);
  if (ty == 1) return sdRC(p, a.xyz, b.xyz, b.w, c.x);
  vec3 q = p - a.xyz;
  if (ty == 0) return length(q) - b.w;
  q.xz = r2(-b.x) * q.xz; q.xy = r2(-c.z) * q.xy;
  if (ty == 2) return sdEl(q, vec3(b.w, c.x, c.y));
  if (ty == 3) return sdBx(q, vec3(b.w, c.x, c.y), b.y);
  return sdTo(q, b.w, c.x); }
float mapD(vec3 p) { float d = 1e5;
  for (int i = 0; i < 128; i++) { if (i >= N) break; vec4 e = pf(i, 4); float k = pf(i, 2).w; if (length(p - e.xyz) - e.w > d + k + .05) continue;
    float di = prim(i, p, pf(i, 0), pf(i, 1), pf(i, 2)); if (k > 0.0) { float h = clamp(.5 + .5 * (di - d) / k, 0.0, 1.0); d = mix(di, d, h) - k * h * (1.0 - h); } else d = min(d, di); }
  return d; }
float mapC(vec3 p, out vec3 col, out float mat) { float d = 1e5; col = vec3(.5); mat = 0.0; float best = 1e5;
  for (int i = 0; i < 128; i++) { if (i >= N) break; vec4 e = pf(i, 4); float k = pf(i, 2).w; if (length(p - e.xyz) - e.w > d + k + .05) continue;
    float di = prim(i, p, pf(i, 0), pf(i, 1), pf(i, 2)); vec4 ci = pf(i, 3);
    if (k > 0.0) { float h = clamp(.5 + .5 * (di - d) / k, 0.0, 1.0); d = mix(di, d, h) - k * h * (1.0 - h); col = mix(ci.rgb, col, h); if (h < .5) mat = ci.w; }
    else if (di < d) { d = di; col = ci.rgb; mat = ci.w; } }
  return d; }
vec3 nrm(vec3 p) { const vec2 e = vec2(1, -1) * .035; return normalize(e.xyy * mapD(p + e.xyy) + e.yyx * mapD(p + e.yyx) + e.yxy * mapD(p + e.yxy) + e.xxx * mapD(p + e.xxx)); }
float sshadow(vec3 p, vec3 l) { float r = 1.0, t = .25; for (int i = 0; i < 22; i++) { float h = mapD(p + l * t); r = min(r, 9.0 * h / t); t += clamp(h, .25, 4.0); if (r < .02 || t > 70.0) break; } return clamp(r, 0.0, 1.0); }
float ao(vec3 p, vec3 n) { float o = 0.0, s = 1.0; for (int i = 0; i < 5; i++) { float h = .25 + 1.6 * float(i) / 4.0; o += (h - mapD(p + n * h)) * s; s *= .7; } return clamp(1.0 - .32 * o, 0.0, 1.0); }
float hash(vec3 p) { p = fract(p * .3183 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y), mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0.0, 1.0); }
void main() {
  vec2 uv = (gl_FragCoord.xy - R * .5) / (R.y * .5); vec3 rd = normalize(cf + uv.x * th * cr + uv.y * th * cu);
  vec3 oc = ro - bs.xyz; float b = dot(oc, rd), c = dot(oc, oc) - bs.w * bs.w, hd = b * b - c;
  float pw = 2.0 * th / R.y; float t = 0.0, mind = 1e5, tm = 0.0; bool hit = false;
  float tEnd = 1e5;
  if (hd > 0.0) { float sq = sqrt(hd); t = max(0.0, -b - sq); tEnd = -b + sq;
    for (int i = 0; i < 110; i++) { vec3 p = ro + rd * t; float d = mapD(p); if (d < mind) { mind = d; tm = t; } if (d < .0015 * t) { hit = true; break; } t += d * .85; if (t > tEnd) break; } }
  // the floor: the model's soft shadow on the turntable
  float fl = 0.0; vec3 fp = vec3(0);
  if (rd.y < 0.0) { float tf = -ro.y / rd.y; fp = ro + rd * tf; if (length(fp.xz) < floorR && (!hit || tf < t)) { float sh = sshadow(fp + vec3(0, .05, 0), key); float con = clamp(mapD(fp) / 6.0, 0.0, 1.0); fl = (1.0 - sh) * .5 + (1.0 - con) * .35; fl *= smoothstep(floorR, floorR * .6, length(fp.xz)); } }
  if (!hit) { float w = pw * tm; float ink = (hd > 0.0) ? smoothstep(w * 1.9, w * .7, mind) : 0.0; vec4 sh = vec4(0, 0, 0, clamp(fl, 0.0, .8)); vec4 ik = vec4(vec3(.047, .031, .063), 1.0) * ink; outc = ik + sh * (1.0 - ik.a); return; }
  vec3 p = ro + rd * t, n = nrm(p), col; float mat; mapC(p, col, mat); int M = int(mat + .5);
  vec3 v = -rd, h = normalize(key + v); float ndl = dot(n, key), nv = clamp(dot(n, v), 0.0, 1.0);
  // material patterns
  if (M == 5) { vec3 q = p * .9; float sx = step(.8, fract(q.x * .5)) + step(.8, fract(q.y * .5)) + step(.8, fract(q.z * .5)), fx = step(.94, fract(q.x * .5 + .37)) + step(.94, fract(q.y * .5 + .37)) + step(.94, fract(q.z * .5 + .37)); col = mix(col, col * .25, clamp(sx, 0.0, 1.0) * .8); col = mix(col, vec3(.9, .75, .2), clamp(fx, 0.0, 1.0) * .7); }
  if (M == 6) { float nn = noise(p * .3) + .5 * noise(p * .62 + 7.0); col = nn > 1.0 ? col * .55 : nn > .78 ? col * 1.35 : nn < .45 ? vec3(.16, .12, .07) : col; }
  if (M == 10) { float nn = noise(p * vec3(.7, .35, .7)); col = mix(col, vec3(.1, .2, .42), smoothstep(.7, .73, nn) * .8); col = mix(col, vec3(.55, .08, .1), smoothstep(.76, .79, noise(p * .5 + 3.0)) * .75); }
  if (M == 12) { float nn = noise(p * .75); col = mix(col, vec3(.95, .9, .5), smoothstep(.66, .69, nn)); }
  if (M == 13) { col *= .85 + .3 * noise(p * vec3(3, .8, 3)); }
  float emi = 0.0;
  if (M == 11) { if (p.z < 0.0) { float f = noise(vec3(p.x * .35, p.y * .22 - T * 2.2, p.z * .35)) * .7 + noise(vec3(p.x, p.y * .6 - T * 4.0, p.z)) * .3; float up = clamp(p.y / 40.0, 0.0, 1.0); col = mix(vec3(.5, .06, .02), vec3(1.0, .45, .05), f); col = mix(col, vec3(1.0, .85, .35), smoothstep(.62, .8, f) * (1.0 - up)); emi = smoothstep(.5, .85, f) * 1.4; }
    else { float f = noise(p * .45); col = mix(vec3(.22, .4, .72), vec3(.8, .92, 1.0), smoothstep(.35, .75, f)); col = mix(col, vec3(1.0), smoothstep(.86, .9, noise(p * 2.2)) * .6); } }
  if (M == 4) emi = 2.2;
  // lighting
  float wrap = M == 1 || M == 10 ? .4 : .12; float dif = clamp((ndl + wrap) / (1.0 + wrap), 0.0, 1.0); dif = mix(dif, smoothstep(.12, .32, dif), .55);
  float sh = sshadow(p + n * .08, key); float oc2 = ao(p, n);
  vec3 lin = dif * mix(.18, 1.0, sh) * vec3(1.0, .92, .8) * 2.3;
  lin += oc2 * (.5 + .5 * n.y) * vec3(.32, .36, .5);                                   // sky fill
  lin += oc2 * clamp(-n.y, 0.0, 1.0) * vec3(.22, .14, .1);                            // bounce from the floor
  float rim = pow(1.0 - nv, 2.6) * clamp(dot(n, rimd) + .35, 0.0, 1.0); lin += rim * rimc * 2.2;
  vec3 cc = col * lin;
  float sp = pow(clamp(dot(n, h), 0.0, 1.0), M == 3 || M == 9 ? 40.0 : M == 8 || M == 14 ? 90.0 : M == 7 ? 26.0 : M == 2 ? 30.0 : 12.0);
  float ks = M == 3 ? .9 : M == 9 ? 1.1 : M == 8 ? 1.4 : M == 7 ? .55 : M == 2 ? .35 : M == 14 ? 1.2 : M == 11 && p.z > 0.0 ? .7 : M == 1 ? .08 : .05;
  vec3 sc = M == 9 ? vec3(1.0, .82, .45) : M == 3 ? mix(vec3(1), col, .3) : vec3(1);
  cc += sp * ks * sh * sc * 2.0;
  if (M == 2) { float band = smoothstep(.75, 1.0, sin(dot(n, cu) * 9.0 + 1.5)); cc += band * col * .6 * sh; }   // a hair sheen band
  if (M == 3 || M == 9) cc += col * (.25 + .5 * smoothstep(-.2, .8, reflect(rd, n).y)) * .7;      // studio reflection
  cc += col * emi;
  cc = mix(vec3(.047, .031, .063) * .4, cc, smoothstep(.02, .3, nv) * .85 + .15);           // ink at the grazing edges
  cc = aces(cc * .9); cc = pow(cc, vec3(1.0 / 2.2));
  outc = vec4(cc, 1.0); }`;
const M3VS = `#version 300 es
in vec2 a; void main() { gl_Position = vec4(a, 0, 1); }`;
function m3dInit() {
  if (M3D.ok !== null) return M3D.ok;
  try { const cv = document.createElement('canvas'); cv.width = Math.round(M3D.W * M3D.Q); cv.height = Math.round(M3D.H * M3D.Q);
    const gl = cv.getContext('webgl2', { premultipliedAlpha: true, preserveDrawingBuffer: true, alpha: true, antialias: false }); if (!gl) return M3D.ok = false;
    const sh = (ty, src) => { const s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, M3VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, M3FS)); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr); const bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); const al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 5, M3D.MAXP, 0, gl.RGBA, gl.FLOAT, null); M3D.tex = tex;
    const U = {}; for (const n of ['P', 'N', 'R', 'ro', 'cf', 'cr', 'cu', 'th', 'T', 'key', 'rimc', 'rimd', 'bs', 'floorR']) U[n] = gl.getUniformLocation(pr, n);
    Object.assign(M3D, { cv, gl, pr, U, buf: new Float32Array(5 * 4 * M3D.MAXP) }); return M3D.ok = true;
  } catch (e) { console.warn('model3d off:', e.message); return M3D.ok = false; } }
// ---- building a model ------------------------------------------------------------------------------------------
const LIN = {}; function lin(hex) { if (LIN[hex]) return LIN[hex]; const n = parseInt(hex.slice(1), 16); return LIN[hex] = [(n >> 16) / 255, (n >> 8 & 255) / 255, (n & 255) / 255].map(v => Math.pow(v, 2.2)); }
const V = { add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s], len: a => Math.hypot(a[0], a[1], a[2]),
  nrm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }, lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] };
function m3push(ty, A, B, r1, r2, r3, ang, k, col, mat, bc, br) { if (M3D.P.length >= M3D.MAXP) return; const Z = M3D.S || 1; if (Z !== 1) { A = V.mul(A, Z); bc = V.mul(bc, Z); if (ty === 1) B = V.mul(B, Z); if (ty === 3) B = [B[0], B[1] * Z, B[2]]; r1 *= Z; br *= Z; k *= Z; if (ty !== 4) { r2 *= Z; r3 *= Z; } else r2 *= Z; } M3D.P.push([ty, A, B, r1, r2, r3, ang, k, lin(col), mat, bc, br]); if (mat === M3.EMIT) M3D.G.push([A, Math.max(r1, r2 || 0), col]); }
const sph = (c, r, col, mat = 0, k = 0) => m3push(0, c, [0, 0, 0], r, 0, 0, 0, k, col, mat, c, r);
const cone = (a, b, r1, r2, col, mat = 0, k = 0) => m3push(1, a, b, r1, r2, 0, 0, k, col, mat, V.lerp(a, b, .5), V.len(V.sub(a, b)) / 2 + Math.max(r1, r2));
const ell = (c, rx, ry, rz, col, mat = 0, k = 0, ang = 0, ry2 = 0) => m3push(2, c, [ry2, 0, 0], rx, ry, rz, ang, k, col, mat, c, Math.max(rx, ry, rz));
const box = (c, hx, hy, hz, rr, col, mat = 0, k = 0, ang = 0, ry2 = 0) => m3push(3, c, [ry2, rr, 0], hx, hy, hz, ang, k, col, mat, c, Math.hypot(hx, hy, hz));
const tor = (c, R0, r, col, mat = 0, k = 0, ang = 0, ry2 = 0) => m3push(4, c, [ry2, 0, 0], R0, r, 0, ang, k, col, mat, c, R0 + r);
// a chain of round cones: hair, cables, tails, plumes. dir is the start direction; bend pulls it each step.
function chain(p0, dir, len, n, r0, r1, col, mat, bend = [0, -.25, 0], wave = 0, t = 0, ph = 0, cols) {
  let p = p0, d = V.nrm(dir); const pts = [p0];
  for (let i = 1; i <= n; i++) { const u = i / n; d = V.nrm(V.add(d, V.add(V.mul(bend, 1 / n * 2), [0, 0, Math.sin(t * 3.2 - i * .8 + ph) * wave * u]))); const q = V.add(p, V.mul(d, len / n));
    cone(p, q, r0 + (r1 - r0) * (i - 1) / n, r0 + (r1 - r0) * u, cols ? cols[i % cols.length] : col, mat); p = q; pts.push(q); }
  return pts; }
const P3 = (s2, z = 0) => [s2[0], -s2[1], z];   // a rig point (y down) into model space
// ---- the generic body on the skeleton ----------------------------------------------------------------------------
// C: colours { top, arms, legs, skin, boots, hand, pants? }, M: materials, opt: { noHead, noFace, shoulderPad, bootH }
function m3body(S, b, pose, C, M = {}, opt = {}) {
  const sp = pose.sp || 0, us = [Math.sin(sp), Math.cos(sp), 0], fs = [Math.cos(sp), -Math.sin(sp), 0];
  const hip = P3(S.hip), chest = P3(S.chest), sw = b.sw, hw = b.hw, zl = hw * .62, zs = sw * .98;
  const legs = (k, f, z, col) => { const h = V.add(hip, [0, -.5, z]), kk = P3(k, z * 1.06), ff = P3(f, z * 1.1);
    cone(h, kk, b.lw * .62, b.lw * .5, col, M.legs || 0, 1.2); cone(kk, V.add(ff, [0, 1.6, 0]), b.lw * .5, b.lw * .36, col, M.legs || 0, .8);
    const bh = opt.bootH || 3.2; cone(V.lerp(kk, ff, .55), V.add(ff, [0, 1.2, 0]), b.lw * .44, b.lw * .45, C.boots, M.boots || M3.LEATHER, .5);
    box(V.add(ff, [1.6, 1.15, 0]), 3.0, 1.15, b.lw * .45, .9, C.boots, M.boots || M3.LEATHER, .9); return { h, kk, ff }; };
  const LB = legs(S.kB, S.fB, -zl, C.legs), LF = legs(S.kF, S.fF, zl, C.legs);
  // torso: pelvis, belly, chest, shoulders
  ell(V.add(hip, V.mul(us, 1.6)), hw * .78, 3.4, hw * 1.12, C.pants || C.legs, M.pants || M.legs || 0, 0, -sp);
  ell(V.add(hip, V.mul(us, b.tor * .4)), sw * .62, b.tor * .3, sw * .82, C.belly || C.top, M.belly || M.top || 0, 1.6, -sp);
  ell(V.add(hip, V.mul(us, b.tor * .7)), sw * .7, b.tor * .34, sw * 1.0, C.top, M.top || 0, 1.8, -sp);
  // neck and head
  const ha = sp + (pose.nk || 0), uh = [Math.sin(ha), Math.cos(ha), 0], fh = [Math.cos(ha), -Math.sin(ha), 0], head = P3(S.head), r = b.hr;
  const H = (fx, fy, fz) => [head[0] + fh[0] * fx * r + uh[0] * fy * r, head[1] + fh[1] * fx * r + uh[1] * fy * r, fz * r];
  cone(V.add(chest, V.mul(us, -1)), V.add(P3(S.neck), [0, 0, 0]), 1.9, 1.7, C.neck || C.skin, M3.SKIN, 1.2);
  if (!opt.noHead) { ell(head, r * .96, r * 1.04, r * .9, C.skin, M.skin || M3.SKIN, .6, -ha);
    if (!opt.noFace) {
      for (const z of [-.34, .34]) { ell(H(.86, .08, z), .6, .9, .56, '#140c08', M3.EYE, 0, -ha); sph(H(1.0, .24, z * .92), .2, '#ffffff', M3.EMIT); cone(H(.84, .46, z * .7), H(.76, .52, z * 1.3), .34, .28, C.brow || '#3a2418', 0); }
      sph(H(1.0, -.14, 0), r * .17, C.skin, M3.SKIN, .4);   // nose
      if (opt.shout) ell(H(.84, -.5, 0), .7, .95, 1.4, '#3a0c0c', M3.EYE, 0, -ha); else cone(H(.88, -.48, -.32), H(.9, -.5, .32), .24, .24, C.lip || '#8a3a2a', 0);
      for (const z of [-.95, .95]) sph(H(-.05, -.05, z), r * .22, C.skin, M3.SKIN, .4); } }
  // arms
  const arm = (A, z, col) => { const s0 = P3(A[0], z), e = P3(A[1], z * 1.04), hd = P3(A[2], z * 1.04);
    sph(s0, b.aw * .66, opt.shoulder || col, M.arms || 0, 1.4); cone(s0, e, b.aw * .56, b.aw * .46, col, M.arms || 0, .9); cone(e, hd, b.aw * .46, b.aw * .38, C.fore || col, M.fore || M.arms || 0, .7);
    if (!opt.noHands) { sph(hd, b.aw * .64, C.hand || C.skin, M.hand || M3.SKIN, .6); const dv = V.nrm(V.sub(hd, e)); sph(V.add(hd, V.add(V.mul(dv, b.aw * .25), [0, b.aw * .3, (z > 0 ? 1 : -1) * b.aw * .4])), b.aw * .26, C.hand || C.skin, M.hand || M3.SKIN, .3); } return { s0, e, hd }; };
  const AB = arm(S.aB, -zs, C.arms), AF = arm(S.aF, zs, C.arms);
  return { hip, chest, head, H, us, fs, uh, fh, r, LF, LB, AF, AB, zs, zl };
}
// coat tails / cape panels: two thin hanging panels that trail when running
function tails(top, len, wide, col, mat, m, t, z0 = 1, back = 1, thick = .75) { for (const z of z0 === 0 ? [0] : [-z0, z0]) { const a = -.08 - m.hs * .9 * back - m.hy * .4 + Math.sin(t * 3 + z) * .04, c = V.add(top, [Math.sin(a) * len * .5 * -1 - 1, -Math.cos(a) * len * .5, z]);
    box(c, thick, len * .5, wide, thick * .8, col, mat, .5, a); } }
// ---- the warriors ----------------------------------------------------------------------------------------------------
const KIT3 = {};
KIT3.amiral = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#2a3a7a', arms: '#2a3a7a', legs: '#efe8dc', skin: '#e0a882', boots: '#14100c', brow: '#e8e4dc' }, { boots: M3.LEATHER }, { shout: o.shout, bootH: 6 });
  const { H, hip, us } = B;
  ell(H(.55, -.85, 0), b.hr * .62, b.hr * .7, b.hr * .7, '#f2ece2', M3.FUR, .5, -.2);                  // the white beard
  ell(H(.62, -.3, 0), .9, .45, b.hr * .55, '#f2ece2', M3.FUR, .3);                                       // moustache
  ell(H(-.05, .85, 0), b.hr * .9, b.hr * .38, b.hr * 1.75, '#141014', M3.LEATHER, 0, .1);                // the bicorne, worn athwart
  ell(H(-.05, .72, 0), b.hr * .95, b.hr * .12, b.hr * 1.82, '#e0b45a', M3.GOLD);
  sph(H(.15, 1.0, .9), b.hr * .2, '#c8302a', 0); chain(H(-.3, 1.15, .7), [-.6, .9, .2], 9 + m.hs * 2, 4, 1.2, .4, '#f6f2ea', M3.FUR, [-1.2 - m.hs, -.2, 0], .1, t, 0);   // cockade and plume
  // frock coat: skirt with gold edge, lapels, buttons, epaulettes
  tails(V.add(hip, [-b.hw * .7, 3, 0]), 17, b.hw * .55, '#2a3a7a', 0, m, t, b.hw * .5); tails(V.add(hip, [-b.hw * .9, 3, 0]), 17.3, b.hw * .58, '#e0b45a', M3.GOLD, m, t, b.hw * .5, 1, .35);
  ell(V.add(B.chest, [2.4, -6, 0]), 1.6, 5.2, 2.8, '#f2ece2', 0, 0, -p.sp); for (let k = 0; k < 4; k++) for (const z of [-2.6, 2.6]) sph(V.add(B.chest, [3.6 - k * .2, -3 - k * 2.4, z]), .55, '#e0b45a', M3.GOLD);
  tor(V.add(hip, V.mul(us, 2.2)), b.hw * .9, .7, '#a8302a', 0, 0, 0);
  for (const A of [B.AF, B.AB]) { ell(V.add(A.s0, [0, 1.2, 0]), 3, 1, 3.2, '#e0b45a', M3.GOLD); for (let k = 0; k < 4; k++) cone(V.add(A.s0, [-1.5 + k, .6, (A.s0[2] > 0 ? 1 : -1) * 2.4]), V.add(A.s0, [-1.5 + k, -2.2, (A.s0[2] > 0 ? 1 : -1) * 2.6]), .3, .35, '#f2d58a', M3.GOLD); }
  for (const L of [B.LF, B.LB]) tor(V.lerp(L.kk, L.ff, .1), b.lw * .5, .45, '#e0b45a', M3.GOLD, 0, 0);
  const hd = B.AF.hd, a = S.handAng, d = [Math.sin(a), -Math.cos(a), 0]; ell(hd, 1.6, .4, 1.6, '#e0b45a', M3.GOLD, 0, -a); cone(hd, V.add(hd, V.mul(d, 19)), .55, .18, '#e8ecf0', M3.METAL); };
KIT3.marge = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#1c1616', arms: '#e8b088', legs: '#8a7a52', skin: '#e8b088', boots: '#3a2a1a', brow: '#d83a7a' }, { arms: M3.TATTOO, top: 0, legs: 0 }, { shout: o.shout || p.nk > .2, shoulder: '#e8b088' });
  const { H, hip, us, r } = B; ell(H(-.15, .1, 0), r * .9, r * .95, r * .86, '#c8987a', M3.SKIN, .3, -(p.sp + p.nk));   // shaved sides
  for (let k = 0; k < 7; k++) { const u = -1.05 + k * .35, base = H(Math.sin(u) * .82, Math.cos(u) * .82, 0), dir = [Math.sin(u + .1) * B.uh[1] + B.uh[0] * Math.cos(u), Math.cos(u) * B.uh[1] - Math.sin(u) * B.uh[0] * .3, 0];
    chain(base, [dir[0] - m.hs * .35, dir[1], 0], 7 + (k % 2) * 2 + (k === 3 ? 2 : 0), 2, 1.25, .12, k % 2 ? '#ff4f8a' : '#ff74a8', M3.HAIR, [-m.hs * .6, 0, 0], 0); }
  box(V.add(B.chest, [3.3, -6.5, 0]), .4, 2.2, 3, .3, '#efe6d2', 0, 0, -p.sp);                         // the CREW print
  tor(V.add(B.head, [0, -b.hr - 1.5, 0]), 3.4, .55, '#2a2a2e', M3.METAL, 0, .2); for (const z of [-3.6, 3.6]) ell(V.add(B.head, [0, -b.hr - 2, z]), 1.4, 1.6, .9, '#3a3a40', M3.METAL);   // headset
  cone(V.add(B.chest, [1.5, -1, 2]), V.add(B.chest, [3.4, -7.5, .5]), .25, .25, '#3a6ad8'); box(V.add(B.chest, [3.6, -9, .5]), .3, 1.8, 1.3, .2, '#f4f0e6', 0);   // lanyard and pass
  tor(V.add(hip, V.mul(us, 2.4)), b.hw * 1.0, 1.0, '#4a3a26', M3.LEATHER); tor(V.add(hip, [-b.hw * .9, 1.5, -b.hw * .6]), 1.8, .9, '#9a9aa2', M3.METAL, 0, Math.PI / 2, .8);   // tool belt, gaffer tape
  for (const L of [B.LF, B.LB]) box(V.lerp(L.h, L.kk, .55), 1.4, 1.8, 1.2, .4, '#7a6a44', 0, 0, 0, 0);   // cargo pockets
  sph(H(.0, -.25, -.98), .5, '#e8c77a', M3.GOLD); sph(H(.0, -.25, .98), .5, '#e8c77a', M3.GOLD); };
KIT3.cyborg = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#5a5a64', arms: '#4a4a52', legs: '#3a3a42', skin: '#8a6a5a', boots: '#2a2a30', hand: '#b8b8c4', fore: '#4a4a52' }, { top: M3.METAL, arms: M3.METAL, legs: M3.METAL, boots: M3.METAL, hand: M3.METAL }, { noFace: true });
  const { H, hip, us, r } = B, g = .6 + Math.sin(t * 3) * .4;
  box(H(.35, .12, .5), r * .62, r * .82, r * .42, 1.4, '#9a9aa4', M3.METAL, .3, -(p.sp + p.nk)); for (let k = 0; k < 3; k++) sph(H(.1 + k * .3, .9, .7), .35, '#6a6a74', M3.METAL);   // the steel half of the face
  sph(H(.98, .12, .4), r * .2, '#ff3a1a', M3.EMIT); ell(H(.82, .1, -.36), .38, .55, .4, '#140c08', M3.EYE); cone(H(.84, -.48, -.4), H(.86, -.46, .05), .2, .2, '#4a2a22');
  for (let k = 0; k < 3; k++) chain(H(-.8, .2 - k * .35, -.2 + k * .2), [-1, -.3, -.1 + k * .1], 13, 4, .55, .45, k === 1 ? '#ff7a2a' : '#2a2a30', k === 1 ? M3.EMIT : M3.LEATHER, [-.3 - m.hs * .5, -1, 0], .05, t, k);
  for (const z of [-1, 1]) box(V.add(B.chest, [0, -1.2, z * b.sw * .95]), b.sw * .55, 2.4, 2.4, 1, '#6a6a74', M3.METAL, 0, -p.sp);   // pauldrons
  for (let k = 0; k < 3; k++) cone(V.add(B.chest, [b.sw * .7, -3 - k * 4, -2 + k * 1.5]), V.add(B.chest, [b.sw * .72, -6 - k * 4, -1 + k * 1.5]), .45, .45, '#ff8a3a', M3.EMIT);   // the core glow lines
  sph(V.add(B.chest, [b.sw * .55, -7, 0]), 1.6 + g * .3, '#ffa040', M3.EMIT);
  const A = B.AF; cone(A.e, A.hd, b.aw * .85, b.aw * .8, '#7a7a84', M3.METAL, .6); tor(V.lerp(A.e, A.hd, .3), b.aw * .82, .5, '#3a3a42', M3.METAL, 0, Math.atan2(A.hd[0] - A.e[0], A.hd[1] - A.e[1]) * -1 + Math.PI / 2 * 0);
  sph(A.hd, 4.6, '#c8c8d0', M3.METAL, .5); };
KIT3.ruby = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#141014', arms: '#141014', legs: '#1a1620', skin: '#f2cca8', boots: '#0c0a0c', belly: '#f2eee6', pants: '#b8202a', lip: '#c8283a', brow: '#a8201c' }, { top: M3.LEATHER, arms: M3.LEATHER, belly: 0, pants: M3.TARTAN }, { shout: o.shout });
  const { H, hip, us, r } = B, ha = p.sp + p.nk;
  ell(H(-.25, .2, 0), r * 1.0, r * 1.08, r * .98, '#c82024', M3.HAIR, .8, -ha);                            // hair, cap
  ell(H(.45, .55, .25), r * .55, r * .3, r * .7, '#d82a28', M3.HAIR, .5, -ha - .5);                        // side fringe
  for (let k = 0; k < 9; k++) { const z = (k - 4) * .23; chain(H(-.7, .3 - Math.abs(z) * .5, z * 1.15), [-.55 - m.hs * .8, -.6 + m.hy * .6, z * .35], 18 + (k % 3) * 3, 5, 1.6, .55, k % 2 ? '#d22a2a' : '#e8402e', M3.HAIR, [-m.hs * 1.4 + .15, -.55 + m.hy * .9, 0], .12, t, k * .7); }
  // skirt, studs, guitar
  cone(V.add(hip, V.mul(us, 2.2)), V.add(hip, [.3 + m.hs * -.5, -7, 0]), b.hw * 1.0, b.hw * 1.75, '#b8202a', M3.TARTAN, .4);
  tor(V.add(hip, V.mul(us, 2.4)), b.hw * .95, .55, '#141014', M3.LEATHER);
  for (const A of [B.AF, B.AB]) for (let k = 0; k < 4; k++) sph(V.add(A.s0, [-1.2 + k * .8, 1.6, (A.s0[2] > 0 ? 1 : -1) * 1.4]), .42, '#d8dce0', M3.METAL);
  const gtr = (c, dir, ang) => { const n0 = V.add(c, V.mul(dir, -2)), n1 = V.add(c, V.mul(dir, 15)); ell(c, 4.2, 5.4, 1.4, '#efe6d2', M3.LEATHER, 0, ang); ell(V.add(c, V.mul(dir, -3.2)), 4.8, 4.0, 1.4, '#efe6d2', M3.LEATHER, 0, ang); sph(V.add(c, [0, 0, 1.2]), 1.2, '#141014', M3.EYE);
    cone(n0, n1, .75, .6, '#3a2414', M3.LEATHER); box(V.add(n1, V.mul(dir, 1.5)), 1.1, 2, .6, .3, '#141014', M3.LEATHER, 0, ang); };
  if (o.swing) { const a = S.handAng, d = [Math.sin(a), -Math.cos(a), 0]; gtr(V.add(B.AF.hd, V.mul(d, 9)), d, -a + Math.PI); }
  else gtr(V.add(B.chest, [-b.sw * .9, -8, 0]), V.nrm([.55, .8, 0]), -.6); };
KIT3.magneto = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#2a3a7a', arms: '#c8885a', legs: '#2a3a7a', skin: '#c8885a', boots: '#2a1a2a', belly: '#2a3a7a', brow: '#2a1a10' }, { boots: M3.LEATHER }, { shout: o.shout, shoulder: '#c8885a' });
  const { H, hip, us, r } = B, ha = p.sp + p.nk;
  ell(H(.25, .2, 0), r * .9, r * .5, r * .95, '#c82a2a', M3.LEATHER, .4, -ha); box(H(-.2, .65, 0), r * .7, r * .2, r * .9, .5, '#c82a2a', M3.LEATHER, .3, -ha);   // the mask
  for (const z of [-.36, .36]) ell(H(.9, .12, z), .5, .3, .5, '#f6f0e0', M3.GLASS, 0, -ha);
  for (const z of [-1, 1]) chain(H(-.9, .1, z * .2), [-1, -.2, z * .3], 7 + m.hs * 3, 3, .5, .25, '#c82a2a', 0, [-m.hs, -.6, 0], .2, t, z);
  tails(V.add(B.chest, [-b.sw * .55, 0, 0]), b.tor * 1.05, b.sw * 1.05, '#3a5ab0', 0, m, t, 0, 1.2, .5); tor(V.add(B.chest, [0, -.6, 0]), b.sw * .85, .6, '#f2cc6a', M3.GOLD, 0, .25);   // short cape, gold collar
  tor(V.add(hip, V.mul(us, 2.3)), b.hw * .98, .9, '#c8963a', M3.GOLD); box(V.add(hip, [b.hw * .9, 2.3, 0]), .5, 1.4, 1.4, .3, '#f2cc6a', M3.GOLD);
  const hd = B.AF.hd, g = .5 + Math.sin(t * 5) * .5; sph(hd, b.aw * .75, '#6a7a9a', M3.METAL); sph(hd, 1.6 + g * .6, '#7ac8ff', M3.EMIT);
  for (let k = 0; k < 3; k++) tor(hd, 3.5 + k * 1.6 + g, .18, '#9ad8ff', M3.EMIT, 0, t * 2 + k * 1.2, t * 1.3 + k); };
KIT3.doc = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#efe6d2', arms: '#efe6d2', legs: '#5a5a3a', skin: '#e0b090', boots: '#3a2a1a', belly: '#efe6d2', pants: '#5a5a3a', brow: '#8a847a' }, {}, { shout: o.shout });
  const { H, hip, us, r } = B, ha = p.sp + p.nk;
  ell(H(-.25, .3, 0), r * .95, r * .85, r * .96, '#bfb8ac', M3.HAIR, .6, -ha); sph(H(-.95, .7, 0), r * .5, '#b8b0a4', M3.HAIR, .4);   // grey hair and bun
  chain(H(.3, .7, .7), [.3, -1, .2], 5, 3, .35, .2, '#c8c0b4', M3.HAIR, [-m.hs, 0, 0], .2, t, 1);
  for (const z of [-.36, .36]) tor(H(.86, .12, z), .55, .12, '#3a3020', M3.METAL, 0, Math.PI / 2, Math.PI / 2);      // glasses
  tails(V.add(hip, [-b.hw * .55, 3, 0]), 14, b.hw * .6, '#efe6d2', 0, m, t, b.hw * .55);   // the field coat
  for (let k = 0; k < 3; k++) sph(V.add(B.chest, [b.sw * .66, -4 - k * 3, .6]), .45, '#8a7a5a', 0);
  const AB = B.AB; tor(V.lerp(AB.s0, AB.e, .45), b.aw * .52, .7, '#c8302a', 0, Math.atan2(AB.e[0] - AB.s0[0], AB.e[1] - AB.s0[1]));   // red-cross armband
  sph(V.add(V.lerp(AB.s0, AB.e, .45), [0, 0, -b.aw * .55]), .7, '#ffffff', 0);
  tor(V.add(B.chest, [0, -1.2, 0]), 2.8, .3, '#2a2a2e', M3.LEATHER, 0, .35); cone(V.add(B.chest, [2.2, -1.6, 1.4]), V.add(B.chest, [3.2, -7, 1.4]), .3, .3, '#2a2a2e', M3.LEATHER); ell(V.add(B.chest, [3.4, -7.6, 1.4]), .9, .9, .5, '#c8ccd2', M3.METAL);   // stethoscope
  box(V.add(B.chest, [-b.sw * .95, -6, 0]), 1.6, 3.4, 3, .8, '#6a4426', M3.LEATHER, 0, -p.sp); };
KIT3.demi = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#2a1a2a', arms: '#a83a14', legs: '#1a0e0e', skin: '#1a0e0e', boots: '#1a0e0e', hand: '#e0a070' }, {}, { noFace: true });
  const { H, hip, us, r, chest } = B, ha = p.sp + p.nk;
  ell(H(.05, .1, 0), r * 1.32, r * 1.38, r * 1.28, '#5a3a5a', M3.MATTE, .4, -ha); cone(H(-.4, .9, 0), H(-1.6 - m.hs, 1.4, 0), r * .7, .3, '#5a3a5a', M3.MATTE, .8); ell(H(1.0, -.05, 0), r * .5, r * .95, r * .9, '#0a0406', M3.MATTE, 0, -ha);   // hood, its point, the dark inside
  sph(H(1.38, .12, -.34), .62, '#ff9a30', M3.EMIT); sph(H(1.38, .12, .34), .62, '#8ae0ff', M3.EMIT);
  const lowY = Math.min(P3(S.fF)[1], P3(S.fB)[1]); cone(V.add(chest, [0, -1, 0]), [hip[0] - 1 - m.hs * 3, lowY + 1.5, 0], b.sw * .95, b.sw * 2.2, '#c84a1a', M3.SPLIT, 1.2);   // the cloak, flame and frost
  for (let k = 0; k < 2; k++) chain(V.add(chest, [1, 0, k ? .8 : -.8]), [-.5 - m.hs, -.5, k ? .5 : -.5], 12, 4, 1.1, .5, k ? '#8ad8ff' : '#ff7a2a', k ? M3.GLASS : M3.EMIT, [-m.hs * 1.2, -.3, 0], .2, t, k * 2);   // scarf
  for (let k = 0; k < 5; k++) { const u = (t * .7 + k / 5) % 1; sph([hip[0] - 3 + Math.sin(k * 3 + t) * 4, lowY + 4 + u * 30, -b.sw * 1.6 - Math.sin(k) * 2], .7 * (1 - u), '#ffb040', M3.EMIT);
    box([hip[0] - 2 + Math.cos(k * 2) * 4, lowY + 6 + ((t * .3 + k / 5) % 1) * 26, b.sw * 1.7], .5, .5, .5, .1, '#d8f4ff', M3.GLASS, 0, t + k, t * 1.3 + k); } };
KIT3.raccoon = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#d8962a', arms: '#d8962a', legs: '#c8862a', skin: '#a8a098', boots: '#2a2420', hand: '#5a5450' }, { skin: M3.FUR }, { noFace: true });
  const { H, hip, us, r } = B, ha = p.sp + p.nk;
  for (const z of [-.62, .62]) { ell(H(-.15, .95, z), r * .38, r * .45, r * .2, '#7a726c', M3.FUR, .3, -ha); ell(H(-.1, .95, z * 1.02), r * .2, r * .26, r * .12, '#2a2420', M3.FUR); }
  ell(H(.55, .05, 0), r * .55, r * .3, r * 1.0, '#141210', M3.FUR, .3, -ha);                 // the mask
  ell(H(.85, -.35, 0), r * .5, r * .35, r * .48, '#efe8de', M3.FUR, .4, -ha); sph(H(1.25, -.25, 0), r * .16, '#141210', M3.EYE);   // muzzle, nose
  for (const z of [-.38, .38]) { sph(H(.86, .1, z), .55, '#f6e8b0', M3.GLASS); sph(H(.98, .12, z), .3, '#141210', M3.EYE); }
  tor(H(.1, .45, 0), r * .98, .35, '#5a4a3a', M3.LEATHER, 0, Math.PI / 2 - .2, Math.PI / 2); for (const z of [-.4, .4]) tor(H(.75, .55, z), .7, .3, '#c8a050', M3.GOLD, 0, Math.PI / 2, Math.PI / 2);   // goggles up on the brow
  box(V.add(B.chest, [-b.sw * .85, -5, 0]), 1.8, 4.2, 3.4, 1, '#5a5a66', M3.METAL, 0, -p.sp); for (const z of [-2, 2]) { cone(V.add(B.chest, [-b.sw * 1.1, -3, z]), V.add(B.chest, [-b.sw * 1.1, -10, z]), 1.2, 1.4, '#8a8a96', M3.METAL);
    if (o.fly || o.rocket) cone(V.add(B.chest, [-b.sw * 1.1, -10.5, z]), V.add(B.chest, [-b.sw * 1.3 - 1, -17 - Math.random() * 3, z]), 1.1, .2, '#9fdcff', M3.EMIT); }
  const tb = V.add(hip, [-b.hw * .8, 1, 0]); chain(tb, [-1, .25 + Math.sin(t * 2) * .2, 0], 15, 6, 2.0, 1.4, '#8a7a6a', M3.FUR, [-m.hs * .5, .5 + m.hy * .3, .1], .25, t, 0, ['#8a7a6a', '#2a2420']); };
KIT3.soldier = (S, b, p, t, o, m) => { const B = m3body(S, b, p, { top: '#4a5a2e', arms: '#4a5a2e', legs: '#46562c', skin: '#d86a4a', boots: '#1a1612', brow: '#6a2a1a' }, { top: M3.CAMO, arms: M3.CAMO, legs: M3.CAMO, pants: M3.CAMO }, { shout: o.shout || p.nk < -.3 });
  const { H, hip, us, r } = B, ha = p.sp + p.nk;
  ell(H(0, .45, 0), r * 1.18, r * .85, r * 1.15, '#3a4a24', M3.CAMO, 0, -ha); ell(H(.05, .1, 0), r * 1.3, r * .14, r * 1.28, '#2a3418', 0, 0, -ha);   // helmet and brim
  cone(H(-.2, .1, -1.05), H(.35, -.9, -.6), .2, .2, '#2a2010'); cone(H(-.2, .1, 1.05), H(.35, -.9, .6), .2, .2, '#2a2010');   // the strap
  cone(V.add(B.chest, [2.2, -1.8, .3]), V.add(B.chest, [3, -4.5, .3]), .15, .15, '#c8ccd2', M3.METAL); box(V.add(B.chest, [3.2, -5, .3]), .2, .9, .6, .15, '#c8ccd2', M3.METAL);   // dog tags
  cone(V.add(B.chest, [-b.sw * .5, 0, b.sw * .6]), V.add(hip, [b.hw * .6, 2, -b.hw * .6]), .55, .55, '#2a2620', M3.LEATHER);
  box(V.add(B.chest, [-b.sw * 1.0, -6, 0]), 2.2, 4.4, 4, 1.2, '#3a4a24', M3.CAMO, 0, -p.sp); tor(V.add(hip, V.mul(us, 2.4)), b.hw * .98, .8, '#2a2010', M3.LEATHER);
  for (const L of [B.LF, B.LB]) box(V.lerp(L.h, L.kk, .55), 1.3, 1.6, 1.1, .3, '#3a4a24', M3.CAMO); };
// ---- the non-humans --------------------------------------------------------------------------------------------------
function m3papi(sc, t, o, m) { // Papi on his tidewalker: a stilt-legged walking machine with a horse's head
  const K = sc.k === 'c' ? sc.i + 1 : 0, KS = sc.s || 0, sp = sc.k === 'sp' ? sc.s : -1, e = K ? Math.sin(Math.min(1, KS * 1.4) * Math.PI) : 0;
  const rear = sp < 0 ? 0 : sp < .45 ? ease(sp / .45) * .5 : sp < .6 ? .5 : sp < .7 ? .5 * (1 - (sp - .6) / .1) : 0;
  const pivot = [-12, 34, 0], R = q => { if (!rear) return q; const dx = q[0] - pivot[0], dy = q[1] - pivot[1], c = Math.cos(rear), s = Math.sin(rear); return [pivot[0] + dx * c - dy * s, pivot[1] + dx * s + dy * c, q[2]]; };
  const bob = Math.sin(t * 2.2) * .6, by = 38 + bob;
  [[-12, -4, 0], [-4, 4, Math.PI], [7, -4, Math.PI * .5], [14, 4, Math.PI * 1.5]].forEach(([lx, z, off], i) => { const sw = Math.sin(t * 2 + off) * .06 + (K === 3 && i >= 2 ? -e * .5 : 0);
    let h = [lx, by - 3, z], k = [lx + 6 + sw * 10, by - 19, z * 1.1], f = [lx + sw * 14, 0, z * 1.15]; if (rear > .2 && i >= 2) { const pw = Math.sin(t * 16 + i); k = [lx + 9, by - 12 + pw * 2, z]; f = [lx + 5 + pw * 4, by - 20 + Math.abs(pw) * 4, z]; }
    h = R(h); k = R(k); f = i >= 2 ? R(f) : f; cone(h, k, 1.8, 1.4, i % 2 ? '#4a3c26' : '#6a5a3a', M3.METAL, .5); cone(k, f, 1.4, .9, '#3a3020', M3.METAL, .4); sph(k, 1.7, '#8a7a4a', M3.GOLD); box(V.add(f, [1, .6, 0]), 2.4, .7, 1.4, .4, '#2a2418', M3.METAL); });
  box(R([0, by + 2, 0]), 17, 4.2, 6.5, 2.5, '#9a8a4a', M3.METAL, .5); for (let k = 0; k < 5; k++) sph(R([-12 + k * 6, by + 2, 6.4]), .6, '#e0c870', M3.GOLD);
  box(R([-8, by + 7.5, 0]), 5.5, 1.6, 5.5, 1.2, '#d8d8d0', M3.LEATHER, .3);
  const nk = K === 2 ? e * 10 : K === 1 ? e * 5 : 0, n0 = R([14, by + 4, 0]), n1 = R([21 + nk, by + 18 - nk * .4, 0]), hd = R([25 + nk * 1.3, by + 22 - nk * .6, 0]);
  cone(n0, n1, 3, 2.2, '#9a8a4a', M3.METAL, 1); box(hd, 5, 2.4, 2.6, 1.2, '#b8a860', M3.METAL, .6, -.5 + nk * .02); for (const z of [-1.4, 1.4]) { cone(V.add(hd, [-3, 2.4, z]), V.add(hd, [-4.5, 6, z * 1.2]), .9, .2, '#9a8a4a', M3.METAL); sph(V.add(hd, [1, 1, z * 1.6]), .55, '#ffd060', M3.EMIT); }
  // the rider
  const rr = R([-8, by + 9, 0]), ch = R([-7, by + 20, 0]), hh = R([-6.5, by + 25, 0]);
  ell(V.lerp(rr, ch, .5), 3.2, 6, 4, '#a83a2a', 0, .8); sph(hh, 3.6, '#e0b090', M3.SKIN, .8); ell(V.add(hh, [-.2, 2.2, 0]), 3.9, 1.6, 3.9, '#4a5a3a', 0); box(V.add(hh, [3, 1.5, 0]), 2.2, .4, 3, .3, '#4a5a3a', 0);   // cap
  ell(V.add(hh, [3, -1.4, 0]), 1.2, .8, 2.6, '#f2ece2', M3.FUR, .3); for (const z of [-1.3, 1.3]) ell(V.add(hh, [3.1, .4, z]), .3, .5, .35, '#140c08', M3.EYE);
  for (const z of [-4, 4]) { const s0 = V.add(ch, [0, -1, z]), hn = V.add(s0, [5, -5 + (K ? e * 4 : 0), z * .3]); cone(s0, hn, 1.5, 1.2, '#a83a2a', 0, .6); sph(hn, 1.4, '#e0b090', M3.SKIN); }
  for (const z of [-3.5, 3.5]) { cone(V.add(rr, [1, 0, z]), V.add(rr, [5, -4, z * 1.5]), 1.8, 1.4, '#3a3a4a', 0, .5); cone(V.add(rr, [5, -4, z * 1.5]), V.add(rr, [4, -11, z * 1.6]), 1.4, 1.2, '#3a3a4a', 0, .5); }
  if (rear > .2 && sp < .6) cone(R([-17, by + 3, 0]), R([-30 - Math.random() * 6, by + 4, 0]), 2, .3, '#ffc860', M3.EMIT);
  return 62; }
function m3spora(sc, t, o, m) { // Spora: a mushroom jellyfish, true 3D, eight tentacles all round
  const K = sc.k === 'c' ? sc.i + 1 : 0, KS = sc.s || 0, sp = sc.k === 'sp' ? sc.s : -1, e = K ? Math.sin(Math.min(1, KS * 1.3) * Math.PI) : 0;
  const pulse = Math.sin(t * 3) * .5 + .5, burst = sp >= 0 ? Math.sin(Math.min(1, sp * 1.2) * Math.PI) : 0, y0 = 26 + Math.sin(t * 1.6) * 2 + burst * 8 + (K === 3 ? e * 4 : 0), dx = K ? e * 5 : 0;
  const c = [dx, y0, 0], rx = 13 * (1 + burst * .15 - pulse * .04), ry = 8.5 * (1 + pulse * .05);
  ell(V.add(c, [0, 2, 0]), rx, ry, rx, '#4a8a3a', M3.SPOTS, 0); ell(V.add(c, [0, -1.5, 0]), rx * .92, 2.4, rx * .92, '#c88ab0', M3.MATTE, 1.2);
  for (const z of [-3, 3]) { sph(V.add(c, [rx * .78, -1.2, z]), 1.3, '#141014', M3.EYE); sph(V.add(c, [rx * .86, -.9, z * 1.05]), .4, '#ffffff', M3.EMIT); }
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + .2, R0 = rx * .62, base = V.add(c, [Math.cos(a) * R0, -2.5, Math.sin(a) * R0]), out2 = [Math.cos(a) * (.3 + burst * .8 + (K ? e * .4 : 0)), -1, Math.sin(a) * (.3 + burst * .8)];
    chain(base, out2, 18 + (k % 3) * 3, 5, 1.2, .35, k % 2 ? '#c88ab0' : '#a86a98', M3.MATTE, [-m.hs * .5 - (K && Math.cos(a) > 0 ? -e : 0), .5 + pulse * .4, 0], .3, t * 1.4, k * .8); }
  if (sp > .2 || K === 3) for (let k = 0; k < 10; k++) { const u = ((sp >= 0 ? sp : KS) * 1.6 + k / 10) % 1, a = k * 2.4; sph(V.add(c, [Math.cos(a) * (6 + u * 26), 2 + u * 10 - u * u * 14, Math.sin(a) * (6 + u * 26)]), 1.1 * (1 - u) + .2, '#c8ff8a', M3.EMIT); }
  return 52; }
function m3goose(sc, t, o, m) { // Bernache: a Canada goose, wings and all
  const K = sc.k === 'c' ? sc.i + 1 : 0, KS = sc.s || 0, sp = sc.k === 'sp' ? sc.s : -1, e = K ? Math.sin(Math.min(1, KS * 1.3) * Math.PI) : 0;
  const honk = sp >= 0 ? Math.sin(Math.min(1, sp * 1.3) * Math.PI) : 0, wing = Math.max(honk, K === 3 ? e : 0, K === 2 ? e * .6 : 0);
  const bob = Math.sin(t * 2.4) * .4, bc = [-2, 13 + bob, 0];
  for (const z of [-2.2, 2.2]) { const k = [z > 0 ? 1 : -1, 6, z]; cone(V.add(bc, [1, -5, z]), [k[0] * (K ? e * 2 : 0), 5, z], .9, .6, '#1a1612', M3.LEATHER); cone([k[0] * (K ? e * 2 : 0), 5, z], [0, .6, z], .6, .5, '#1a1612', M3.LEATHER); ell([1.6, .5, z], 2.4, .5, 1.6, '#1a1612', M3.LEATHER); }
  ell(bc, 11, 7, 7, '#8a7a68', M3.FUR, 0, .08); ell(V.add(bc, [2, -2.5, 0]), 8.5, 4.5, 5.8, '#efe8dc', M3.FUR, 2); ell(V.add(bc, [-10, 1, 0]), 3.4, 2.4, 3.6, '#1a1612', M3.FUR, 1.2);   // body, belly, tail
  for (const z of [-1, 1]) { const w0 = V.add(bc, [0, 3, z * 6]); if (wing > .05) { const tip = V.add(w0, [-5 - wing * 3, 5 + wing * 9, z * (4 + wing * 10)]); cone(w0, tip, 3.4, 1.4, '#6a5a4a', M3.FUR, 1); ell(V.lerp(w0, tip, .6), 6, 1.2, 4, '#5a4a3a', M3.FUR, 1, .4, z * (1.2 + wing)); }
    else ell(V.add(w0, [-2, -.5, -z * 1.2]), 9, 3.4, 1.8, '#6a5a4a', M3.FUR, 1, .15); }
  const lunge = (K === 1 || K === 2 ? e * 8 : 0) + honk * 6, n0 = V.add(bc, [8, 4, 0]); const pts = chain(n0, [.3 + lunge * .06, 1, 0], 16 - lunge * .4, 5, 2.4, 1.7, '#141210', M3.FUR, [lunge * .25 + .6, -.2, 0], .05, t, 0);
  const hd = V.add(pts[pts.length - 1], [1.2, 1, 0]); ell(hd, 3.2, 2.4, 2.3, '#141210', M3.FUR, .8, -.2); ell(V.add(hd, [-.2, -.9, 0]), 1.8, 1.1, 2.45, '#f6f2ea', M3.FUR, .2, .3);   // head and chin strap
  const op = honk * .9 + (K ? e * .4 : 0); cone(V.add(hd, [2.4, .2, 0]), V.add(hd, [6.2, .6 + op, 0]), 1.0, .3, '#1a1612', M3.LEATHER); if (op > .1) cone(V.add(hd, [2.4, -.4, 0]), V.add(hd, [5.6, -1 - op * 1.5, 0]), .8, .3, '#1a1612', M3.LEATHER);
  for (const z of [-1.5, 1.5]) { sph(V.add(hd, [1.6, .9, z]), .55, '#140c08', M3.EYE); }
  if (honk > .3) for (let k = 0; k < 3; k++) tor(V.add(hd, [9 + k * 4 + honk * 3, .5, 0]), 2 + k * 1.6, .25, '#ffe88a', M3.EMIT, 0, Math.PI / 2, 0);
  return 40; }
// keep the frame rate: if frames run long, render the models at a lower resolution (and back up when there's room)
function m3dPace(dt) { if (!M3D.ok || M3D.fixed) return; M3D.avg = (M3D.avg || dt) * .95 + dt * .05; M3D.cool = (M3D.cool || 0) - dt; if (M3D.cool > 0) return;
  const q0 = M3D.Q; if (M3D.avg > .024 && M3D.Q > .6) M3D.Q = Math.max(.6, M3D.Q * .85); else if (M3D.avg < .0175 && M3D.Q < 1.25) M3D.Q = Math.min(1.25, M3D.Q * 1.1);
  if (M3D.Q !== q0) { M3D.cv.width = Math.round(M3D.W * M3D.Q); M3D.cv.height = Math.round(M3D.H * M3D.Q); M3D.cool = 1.2; } }
// ---- rendering -------------------------------------------------------------------------------------------------
// one call per half: builds the model for warrior id with the pose (or the non-rig showcase state), renders it at turntable
// angle th and returns { cv, ox, oy } — draw cv so that (ox, oy) lands on the turntable's centre.
function m3dModel(id, pose, sc, t, o, m) {
  M3D.P = []; M3D.G = []; M3D.S = id === 'bernache' ? 1.65 : id === 'spora' ? 1.2 : 1;
  if (id === 'papi') return m3papi(sc, t, o, m); if (id === 'spora') return m3spora(sc, t, o, m) * M3D.S; if (id === 'bernache') return m3goose(sc, t, o, m) * M3D.S;
  const L = hlook(id), b = L.b, S = solve(b, pose), LIE = pose.lie || 0, RT = pose.rot || 0;
  if (RT || LIE) { const tf = (q, cx, cy, a) => { const dx = q[0] - cx, dy = q[1] - cy, c = Math.cos(a), s2 = Math.sin(a); q[0] = cx + dx * c - dy * s2; q[1] = cy + dx * s2 + dy * c; };
    const pts = [S.hip, S.chest, S.neck, S.head, S.kF, S.fF, S.kB, S.fB, ...S.aF, ...S.aB].map(q => { const c = [q[0], q[1]]; return [q, c]; });
    for (const [q, c] of pts) { if (RT) tf(c, S.hip[0], S.hip[1], RT); if (LIE) { c[1] -= b.sw * LIE; tf(c, 0, 0, -Math.PI / 2 * LIE); } }
    for (const [q, c] of pts) { q[0] = c[0]; q[1] = c[1]; } pose = { ...pose, sp: (pose.sp || 0) + RT - Math.PI / 2 * LIE }; S.handAng -= RT - Math.PI / 2 * LIE; } (KIT3[id] || ((S, b, p) => m3body(S, b, p, { top: L.top, arms: L.arms || L.top, legs: L.legs, skin: L.skin, boots: L.boots })))(S, b, pose, t, o, m);
  return -S.head[1] + b.hr * 2; }
function m3dRender(id, pose, sc, th, side, t, o, m) {
  if (!m3dInit()) return null; const top = m3dModel(id, pose, sc, t, o, m), gl = M3D.gl, P = M3D.P, n = P.length, f = M3D.buf;
  for (let i = 0; i < n; i++) { const [ty, A, B, r1, r2, r3, ang, k, col, mat, bc, br] = P[i], q = i * 20;
    f.set([A[0], A[1], A[2], ty, B[0], B[1], B[2], r1, r2, r3, ang, k, col[0], col[1], col[2], mat, bc[0], bc[1], bc[2], br + k], q); }
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, M3D.tex); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 5, M3D.MAXP, gl.RGBA, gl.FLOAT, f);
  const W = M3D.cv.width, H = M3D.cv.height, U = M3D.U, VH = 104, D = 300, phi = .12, tgt = [0, 44, 0], thv = (VH / 2) / D;
  const ro = [tgt[0] + D * Math.sin(th) * Math.cos(phi), tgt[1] + D * Math.sin(phi), tgt[2] + D * Math.cos(th) * Math.cos(phi)], cf = V.nrm(V.sub(tgt, ro)), cr = V.nrm(V.cross(cf, [0, 1, 0])), cu = V.cross(cr, cf);
  gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1i(U.P, 0); gl.uniform1i(U.N, n); gl.uniform2f(U.R, W, H); gl.uniform3fv(U.ro, ro); gl.uniform3fv(U.cf, cf); gl.uniform3fv(U.cr, cr); gl.uniform3fv(U.cu, cu); gl.uniform1f(U.th, thv); gl.uniform1f(U.T, t);
  const kd = V.nrm(V.add(V.add(V.mul(cr, -.55), V.mul(cu, .75)), V.mul(cf, -.5))), rd = V.nrm(V.add(V.mul(cr, side ? -.7 : .7), V.mul(cf, .6)));
  gl.uniform3fv(U.key, kd); gl.uniform3fv(U.rimc, side ? lin('#7ac0ff') : lin('#ff8ab8')); gl.uniform3fv(U.rimd, V.mul(rd, -1)); gl.uniform4f(U.bs, 0, top * .5, 0, Math.max(48, top * .5 + 26)); gl.uniform1f(U.floorR, 30);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  // where the origin and the glows land on the canvas
  const proj = q => { const v = V.sub(q, ro), z = V.dot(v, cf); return [W / 2 + V.dot(v, cr) / z / thv * H / 2, H / 2 - V.dot(v, cu) / z / thv * H / 2]; };
  const o0 = proj([0, 0, 0]), s = 1 / M3D.Q; return { cv: M3D.cv, ox: o0[0] * s, oy: o0[1] * s, w: W * s, h: H * s, glow: M3D.G.map(([q, r, col]) => { const [x, y] = proj(q); return [x * s, y * s, r * s * H / (2 * thv * D), col]; }) }; }
