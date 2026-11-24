// Print shader: turns the flat scene into a printed page, in five ways.
const FRAG = `
precision highp float;
uniform sampler2D T; uniform sampler2D F; uniform vec2 R; uniform float tm; uniform float S; uniform float K;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
vec3 tx(vec2 p){return texture2D(T,clamp(p,vec2(.5),R-.5)/R).rgb;}
vec4 fx(vec2 p){return texture2D(F,clamp(p,vec2(.5),R-.5)/R);}
float sobF(vec2 p,float w){
  float a=fx(p+vec2(-w,-w)).a,b=fx(p+vec2(0,-w)).a,c=fx(p+vec2(w,-w)).a,d=fx(p+vec2(-w,0)).a,f=fx(p+vec2(w,0)).a,g=fx(p+vec2(-w,w)).a,h=fx(p+vec2(0,w)).a,i=fx(p+vec2(w,w)).a;
  return abs(-a-2.*d-g+c+2.*f+i)+abs(-a-2.*b-c+g+2.*h+i);
}
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
float sob(vec2 p,float w){
  vec3 a=tx(p+vec2(-w,-w)),b=tx(p+vec2(0,-w)),c=tx(p+vec2(w,-w)),d=tx(p+vec2(-w,0)),f=tx(p+vec2(w,0)),g=tx(p+vec2(-w,w)),h=tx(p+vec2(0,w)),i=tx(p+vec2(w,w));
  vec3 gx=-a-2.*d-g+c+2.*f+i, gy=-a-2.*b-c+g+2.*h+i; return length(gx)+length(gy);
}
mat2 rm(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec4 cmyk(vec3 c){float k=1.-max(max(c.r,c.g),c.b);float d=max(1.-k,1e-3);return vec4((1.-c.r-k)/d,(1.-c.g-k)/d,(1.-c.b-k)/d,k);}
float ht(vec2 p,float a,float z,vec4 m,float q){
  mat2 r=rm(a); vec2 qp=r*p; vec2 cc=(floor(qp/z)+.5)*z; vec2 pc=cc*r;
  float val=dot(cmyk(tx(pc)),m); if(q>0.) val=floor(val*q+.5)/q; if(val>.93) return 1.;
  float rad=sqrt(clamp(val,0.,1.))*z*.72; return smoothstep(rad+.8,rad-.8,length(qp-cc));
}
float htg(vec2 p,float a,float z,float val){ vec2 qp=rm(a)*p; vec2 cc=(floor(qp/z)+.5)*z; float rad=sqrt(clamp(val,0.,1.))*z*.72; return smoothstep(rad+.7,rad-.7,length(qp-cc)); }
void main(){
  vec2 p=gl_FragCoord.xy; vec3 col; vec3 c0=tx(p); float l=lum(c0);
  if(S>4.5){vec4 f0=fx(p);gl_FragColor=vec4(mix(c0,f0.rgb,f0.a),1.);return;}
  if(S<.5){ // I. Silver Age: Ben-Day, misregistered CMY, newsprint
    vec3 paper=vec3(.96,.91,.79)*(.93+.07*vn(p*.06/K))*(.97+.03*h21(p));
    float z=5.*K;
    float c=ht(p+vec2(1.3,.5)*K,.26,z,vec4(1,0,0,0),4.);
    float m=ht(p+vec2(-.9,1.)*K,1.31,z,vec4(0,1,0,0),4.);
    float y=ht(p,0.,z,vec4(0,0,1,0),4.);
    float k=step(.84,cmyk(c0).w);
    col=paper; col*=mix(vec3(1),vec3(.05,.63,.92),c*.95); col*=mix(vec3(1),vec3(.93,.08,.5),m*.92); col*=mix(vec3(1),vec3(1.,.9,.08),y*.95);
    col*=1.-k*.9; col*=1.-smoothstep(1.,1.8,sob(p,1.2*K))*.9;
  } else if(S<1.5){ // II. Ligne claire: even line, flat colours
    float lq=floor(l*5.+.5)/5.; col=c0*(lq+.05)/(l+.05); col=mix(col,vec3(1.,.98,.94),.08); col=pow(clamp(col,0.,1.),vec3(.88));
    col*=.985+.015*h21(p); col=mix(col,vec3(.08,.06,.09),smoothstep(.7,1.3,sob(p,.9*K)));
  } else if(S<2.5){ // III. Noir ink: big blacks, hatching, one spot colour
    vec3 paper=vec3(.95,.93,.87)*(.95+.05*vn(p*.05/K)); col=paper;
    float warm=smoothstep(.16,.32,c0.r-max(c0.g,c0.b))*step(.3,l);
    float dark=1.-smoothstep(.2,.27,l);
    float s=5.*K, h1=step(fract((p.x+p.y)/s),(.56-l)*1.9)*step(l,.56), h2=step(fract((p.x-p.y)/s),(.44-l)*1.9)*step(l,.44);
    col=mix(col,vec3(.8,.1,.07),warm*(1.-dark)*(1.-h1*.6));
    col=mix(col,vec3(.05,.04,.05),max(dark,max(h1*(1.-warm),h2)));
    col=mix(col,vec3(.04),smoothstep(.9,1.5,sob(p,1.8*K)));
  } else if(S<3.5){ // IV. Manga: screentones, black and white
    col=vec3(.97,.97,.96);
    float t1=htg(p,.785,3.4*K,.18), t2=htg(p,.785,4.5*K,.55);
    if(l<.2) col=vec3(.04); else if(l<.42) col=mix(col,vec3(.04),t2); else if(l<.7) col=mix(col,vec3(.04),t1);
    col=mix(col,vec3(.03),smoothstep(.8,1.4,sob(p,1.2*K)));
  } else { // V. SF 1977: fine hatching, washed pastels, watercolour grain
    vec2 w=(vec2(vn(p*.02/K),vn(p*.02/K+7.))-.5)*2.*K; c0=tx(p+w); l=lum(c0);
    col=mix(c0,vec3(l),.32); col=col*vec3(1.05,1.,.86)+vec3(.05,.04,.02);
    vec3 paper=vec3(.97,.93,.85); col=mix(col,paper,.16)*(.9+.1*vn(p*.012/K))*(.97+.03*h21(p));
    float s=3.4*K, hl=step(.72,fract((p.x*.7+p.y*.3)/s))*step(l,.52), hl2=step(.72,fract((p.x*.3-p.y*.7)/s))*step(l,.32);
    col*=1.-.5*max(hl,hl2); if(l<.16&&h21(floor(p/K))<.55) col*=.35;
    float e=smoothstep(.6,1.,sob(p,.8*K))*step(.22,vn(p*.15/K)); col=mix(col,vec3(.16,.09,.1),e*.9);
  }
  // the actors: flat colour, crisp ink, never a halftone
  vec4 f=fx(p); float fa=f.a; if(fa>0.){
    vec3 fc=f.rgb; float fl=lum(fc); vec3 o;
    if(S<.5){ o=clamp(mix(vec3(fl),fc,1.2)*1.1,0.,1.); o=floor(o*7.+.5)/7.; o*=vec3(1.,.97,.9); }
    else if(S<1.5){ float lq=floor(fl*5.+.5)/5.; o=fc*(lq+.05)/(fl+.05); o=pow(clamp(mix(o,vec3(1.,.98,.94),.08),0.,1.),vec3(.88)); }
    else if(S<2.5){ float warm=smoothstep(.16,.32,fc.r-max(fc.g,fc.b))*step(.3,fl); o=fl<.16?vec3(.05,.04,.05):mix(vec3(.95,.93,.87),vec3(.8,.1,.07),warm); }
    else if(S<3.5){ o=fl<.15?vec3(.04):fl<.4?vec3(.6):fl<.65?vec3(.82):vec3(.97); }
    else { o=mix(fc,vec3(fl),.25)*vec3(1.05,1.,.88)+vec3(.05,.04,.02); o*=.94+.06*vn(p*.012/K); }
    float ew=S>.5&&S<1.5?.9:S>3.5?.8:1.2; vec3 ink=S>3.5?vec3(.16,.09,.1):vec3(.05,.04,.06);
    o=mix(o,ink,smoothstep(.6,1.4,sobF(p,ew*K)));
    col=mix(col,o,smoothstep(0.,.5,fa));
  } else { float e=sobF(p,1.2*K); col=mix(col,S>3.5?vec3(.16,.09,.1):vec3(.05,.04,.06),smoothstep(.6,1.4,e)); }
  gl_FragColor=vec4(col,1.);
}`;
function initGL(cv) {
  const gl = cv.getContext('webgl', { preserveDrawingBuffer: true }); if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}')); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); const mk = u => { const tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + u); gl.bindTexture(gl.TEXTURE_2D, tx); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); return tx; }; const t0 = mk(0), t1 = mk(1);
  const U = n => gl.getUniformLocation(pr, n), uR = U('R'), uS = U('S'), uT = U('tm'), uK = U('K'); gl.uniform1i(U('T'), 0); gl.uniform1i(U('F'), 1);
  return { draw(src, fg, style, t, k) { gl.viewport(0, 0, cv.width, cv.height); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t0); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, t1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fg); gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uS, style); gl.uniform1f(uT, t); gl.uniform1f(uK, k); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); } };
}
