// Print shader. Two layers: the backdrop (T) gets the style's texture
// (halftone, hatching, grain…) and is dimmed by D; the actors (F) get flat
// colour and crisp ink only. N flashes the whole frame into black ink on
// strong hits, in every style.
const FRAG = `
precision highp float;
uniform sampler2D T; uniform sampler2D F; uniform vec2 R; uniform float tm; uniform float S; uniform float K; uniform float D; uniform float N; uniform float FL;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
vec3 tx(vec2 p){return texture2D(T,clamp(p,vec2(.5),R-.5)/R).rgb;}
vec4 fx(vec2 p){return texture2D(F,clamp(p,vec2(.5),R-.5)/R);}
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
float sob(vec2 p,float w){
  vec3 a=tx(p+vec2(-w,-w)),b=tx(p+vec2(0,-w)),c=tx(p+vec2(w,-w)),d=tx(p+vec2(-w,0)),f=tx(p+vec2(w,0)),g=tx(p+vec2(-w,w)),h=tx(p+vec2(0,w)),i=tx(p+vec2(w,w));
  vec3 gx=-a-2.*d-g+c+2.*f+i, gy=-a-2.*b-c+g+2.*h+i; return length(gx)+length(gy);
}
float sobF(vec2 p,float w){
  float a=fx(p+vec2(-w,-w)).a,b=fx(p+vec2(0,-w)).a,c=fx(p+vec2(w,-w)).a,d=fx(p+vec2(-w,0)).a,f=fx(p+vec2(w,0)).a,g=fx(p+vec2(-w,w)).a,h=fx(p+vec2(0,w)).a,i=fx(p+vec2(w,w)).a;
  return abs(-a-2.*d-g+c+2.*f+i)+abs(-a-2.*b-c+g+2.*h+i);
}
mat2 rm(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec4 cmyk(vec3 c){float k=1.-max(max(c.r,c.g),c.b);float d=max(1.-k,1e-3);return vec4((1.-c.r-k)/d,(1.-c.g-k)/d,(1.-c.b-k)/d,k);}
float ht(vec2 p,float a,float z,vec4 m,float q){
  mat2 r=rm(a); vec2 qp=r*p; vec2 cc=(floor(qp/z)+.5)*z; vec2 pc=cc*r;
  float val=dot(cmyk(tx(pc)),m); if(q>0.) val=floor(val*q+.5)/q; if(val>.93) return 1.;
  float rad=sqrt(clamp(val,0.,1.))*z*.72; return smoothstep(rad+.8,rad-.8,length(qp-cc));
}
float htg(vec2 p,float a,float z,float val){ vec2 qp=rm(a)*p; vec2 cc=(floor(qp/z)+.5)*z; float rad=sqrt(clamp(val,0.,1.))*z*.72; return smoothstep(rad+.7,rad-.7,length(qp-cc)); }
float bay2(vec2 a){a=floor(a);return fract(dot(a,vec2(.5,a.y*.75)));}
float bay4(vec2 a){return bay2(.5*a)*.25+bay2(a);}
void nb(vec3 c,vec3 q,inout float bd,inout vec3 best){float d=distance(c,q);if(d<bd){bd=d;best=q;}}
vec3 ukiyo(vec3 c){float bd=9.;vec3 b=c;nb(c,vec3(.94,.89,.76),bd,b);nb(c,vec3(.16,.27,.45),bd,b);nb(c,vec3(.85,.3,.18),bd,b);nb(c,vec3(.86,.66,.36),bd,b);nb(c,vec3(.1,.09,.1),bd,b);nb(c,vec3(.45,.6,.66),bd,b);nb(c,vec3(.62,.46,.56),bd,b);nb(c,vec3(.98,.82,.6),bd,b);return b;}
// the page colour each style fades its backdrop toward when dimmed
vec3 tone(){
  if(S<.5) return vec3(.96,.91,.79); if(S<1.5) return vec3(1.,.98,.94); if(S<2.5) return vec3(.95,.93,.87); if(S<3.5) return vec3(.97);
  if(S<4.5) return vec3(.95,.9,.82); if(S<5.5) return vec3(.97,.95,.9); if(S<6.5) return vec3(.93,.87,.74); if(S<7.5) return vec3(.95,.9,.78);
  if(S<8.5) return vec3(.08,.22,.46); if(S<9.5) return vec3(.94,.89,.76); if(S<10.5) return vec3(.03,.01,.06); if(S<11.5) return vec3(.98,.96,.92);
  if(S<12.5) return vec3(.96,.94,.88); if(S<13.5) return vec3(.13,.17,.15); if(S<14.5) return vec3(.22,.2,.26); if(S<15.5) return vec3(.55,.67,.06); return vec3(.95,.92,.55);
}
vec3 inkc(){ if(S>3.5&&S<4.5) return vec3(.16,.09,.1); if(S>5.5&&S<6.5) return vec3(.2,.13,.08); if(S>7.5&&S<8.5) return vec3(.92,.96,1.); if(S>9.5&&S<10.5) return vec3(1.,.3,.85); if(S>12.5&&S<13.5) return vec3(.95,.95,.9); if(S>14.5&&S<15.5) return vec3(.06,.22,.06); return vec3(.05,.04,.06); }
vec3 BG(vec2 p){
  vec3 c0=tx(p); float l=lum(c0); vec3 col;
  if(S<.5){ // I. Silver Age
    vec3 paper=vec3(.96,.91,.79)*(.93+.07*vn(p*.06/K))*(.97+.03*h21(p)); float z=5.*K;
    float c=ht(p+vec2(1.3,.5)*K,.26,z,vec4(1,0,0,0),4.), m=ht(p+vec2(-.9,1.)*K,1.31,z,vec4(0,1,0,0),4.), y=ht(p,0.,z,vec4(0,0,1,0),4.), k=step(.84,cmyk(c0).w);
    col=paper*mix(vec3(1),vec3(.05,.63,.92),c*.95)*mix(vec3(1),vec3(.93,.08,.5),m*.92)*mix(vec3(1),vec3(1.,.9,.08),y*.95);
    col*=1.-k*.9; col*=1.-smoothstep(1.,1.8,sob(p,1.2*K))*.9;
  } else if(S<1.5){ // II. Ligne claire
    float lq=floor(l*5.+.5)/5.; col=c0*(lq+.05)/(l+.05); col=pow(clamp(mix(col,vec3(1.,.98,.94),.08),0.,1.),vec3(.88));
    col*=.985+.015*h21(p); col=mix(col,vec3(.08,.06,.09),smoothstep(.7,1.3,sob(p,.9*K)));
  } else if(S<2.5){ // III. Noir ink
    vec3 paper=vec3(.95,.93,.87)*(.95+.05*vn(p*.05/K)); col=paper;
    float warm=smoothstep(.16,.32,c0.r-max(c0.g,c0.b))*step(.3,l), dark=1.-smoothstep(.2,.27,l);
    float s=5.*K, h1=step(fract((p.x+p.y)/s),(.56-l)*1.9)*step(l,.56), h2=step(fract((p.x-p.y)/s),(.44-l)*1.9)*step(l,.44);
    col=mix(col,vec3(.8,.1,.07),warm*(1.-dark)*(1.-h1*.6)); col=mix(col,vec3(.05,.04,.05),max(dark,max(h1*(1.-warm),h2)));
    col=mix(col,vec3(.04),smoothstep(.9,1.5,sob(p,1.8*K)));
  } else if(S<3.5){ // IV. Manga / black and white
    col=vec3(.97,.97,.96); float t1=htg(p,.785,3.4*K,.18), t2=htg(p,.785,4.5*K,.55);
    if(l<.2) col=vec3(.04); else if(l<.42) col=mix(col,vec3(.04),t2); else if(l<.7) col=mix(col,vec3(.04),t1);
    col=mix(col,vec3(.03),smoothstep(.8,1.4,sob(p,1.2*K)));
  } else if(S<4.5){ // V. SF 1977
    vec2 w=(vec2(vn(p*.02/K),vn(p*.02/K+7.))-.5)*2.*K; c0=tx(p+w); l=lum(c0);
    col=mix(c0,vec3(l),.32)*vec3(1.05,1.,.86)+vec3(.05,.04,.02); col=mix(col,vec3(.97,.93,.85),.16)*(.9+.1*vn(p*.012/K))*(.97+.03*h21(p));
    float s=3.4*K, hl=step(.72,fract((p.x*.7+p.y*.3)/s))*step(l,.52), hl2=step(.72,fract((p.x*.3-p.y*.7)/s))*step(l,.32);
    col*=1.-.5*max(hl,hl2); if(l<.16&&h21(floor(p/K))<.55) col*=.35;
    col=mix(col,vec3(.16,.09,.1),smoothstep(.6,1.,sob(p,.8*K))*step(.22,vn(p*.15/K))*.9);
  } else if(S<5.5){ // 1. Risograph
    vec3 cA=tx(p+vec2(2.,1.)*K); float pink=clamp(1.-cA.g*1.1+(cA.r-.5)*.3,0.,1.), teal=clamp(1.-c0.r*1.05,0.,1.);
    float pa=step(h21(floor(p/K)),pink*.85), ta=step(h21(floor(p/K)+17.3),teal*.85);
    col=vec3(.97,.95,.9)*mix(vec3(1),vec3(1.,.32,.6),pa)*mix(vec3(1),vec3(.0,.55,.62),ta);
  } else if(S<6.5){ // 2. Engraving 1870
    vec3 paper=vec3(.93,.87,.74)*(.92+.08*vn(p*.03/K)); float sc=4.*K;
    float wv=p.y+sin(p.x*.02/K+vn(p*.01/K)*6.)*3.*K, d1=abs(fract(wv/sc)-.5)*2., l1=step(d1,clamp((.85-l)*1.1,0.,1.));
    float wv2=p.x+p.y*.4+sin(p.y*.03/K)*2.*K, d2=abs(fract(wv2/sc)-.5)*2., l2=step(d2,clamp((.45-l)*1.4,0.,1.));
    col=mix(paper,vec3(.2,.13,.08),max(l1,l2)); col=mix(col,vec3(.15,.1,.06),smoothstep(.8,1.4,sob(p,K)));
  } else if(S<7.5){ // 3. Linocut
    vec3 paper=vec3(.95,.9,.78); float r=vn(p*.2/K)*.12, g=step(.62,vn(vec2(p.x*.08/K,p.y*.5/K)+vn(p*.02/K)*3.));
    if(l+r<.3) col=mix(vec3(.08,.06,.05),paper,g*step(.17,l+r)); else if(l+r<.6) col=vec3(.78,.32,.16)*(.9+.1*vn(p*.3/K)); else col=paper;
    col=mix(col,vec3(.08,.06,.05),smoothstep(.9,1.4,sob(p,1.6*K))*step(.3,vn(p*.4/K)+.2));
  } else if(S<8.5){ // 4. Cyanotype
    col=mix(vec3(.05,.18,.42),vec3(.85,.92,.96),smoothstep(.15,.9,pow(l,.8)+(vn(p*.05/K)-.5)*.12))*(.94+.06*h21(floor(p/K)));
    col=mix(col,vec3(.92,.96,1.),smoothstep(.9,1.5,sob(p,K))*.8);
  } else if(S<9.5){ // 5. Ukiyo-e
    col=mix(ukiyo(c0),c0*vec3(.95,.92,.85),.22)*(.93+.07*vn(vec2(p.x*.01/K,p.y*.2/K)));
    col=mix(col,vec3(.1,.09,.1),smoothstep(.8,1.4,sob(p,1.1*K)));
  } else if(S<10.5){ // 6. Neon
    float e=sob(p,K), e2=sob(p,3.*K); col=c0*.16+vec3(.02,0.,.06);
    vec3 gl=mix(vec3(1.,.2,.8),vec3(.2,.9,1.),step(.5,fract(l*3.)));
    col+=gl*(smoothstep(.6,1.2,e)*1.1+smoothstep(.4,1.4,e2)*.25); col*=.85+.15*step(.5,fract(p.y/(2.*K)));
  } else if(S<11.5){ // 7. Watercolour
    vec2 w=(vec2(vn(p*.015/K),vn(p*.015/K+5.))-.5)*8.*K;
    vec3 a=(tx(p+w)+tx(p+w*.5+vec2(3,0)*K)+tx(p-w*.4+vec2(0,3)*K)+c0)*.25;
    col=pow(mix(a,vec3(1),.18),vec3(.9)); col*=1.-smoothstep(.3,1.,sob(p+w*.5,2.*K))*.18;
    col*=vec3(.98,.96,.92)*(.9+.1*vn(p*.08/K))*(.96+.04*h21(floor(p/K)));
  } else if(S<12.5){ // 8. Pointillism
    col=vec3(.96,.94,.88); float z=4.5*K;
    for(int g=0;g<2;g++){ vec2 off=vec2(float(g)*.5*z); vec2 cid=floor((p+off)/z); vec2 cc=(cid+.5)*z-off+(vec2(h21(cid+float(g)*9.),h21(cid+3.1+float(g)*9.))-.5)*z*.5;
      vec3 dc=clamp(tx(cc)+(vec3(h21(cid+.3),h21(cid+.7),h21(cid+.9))-.5)*.28,0.,1.); col=mix(col,dc,smoothstep(z*.42,z*.42-1.2,length(p-cc))); }
  } else if(S<13.5){ // 9. Chalk
    vec3 slate=vec3(.13,.17,.15)*(.9+.1*vn(p*.02/K)); float st=vn(vec2(p.x*.04/K+p.y*.02/K,p.y*.4/K));
    float ch=smoothstep(.25,.95,l)*(.55+.45*st)*step(.35,h21(floor(p/K))+.25); vec3 tint=mix(vec3(1),c0/max(l,.1)*.6+.4,.6);
    col=mix(slate,tint,clamp(ch,0.,1.)*.9); col=mix(col,vec3(.95),smoothstep(.9,1.5,sob(p,1.2*K))*step(.3,vn(p*.5/K)+.15)*.8);
  } else if(S<14.5){ // 10. Stained glass
    float z=16.*K; vec2 g=p/z, i=floor(g); float d1=9.,d2=9.; vec2 best=g;
    for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 o=vec2(float(x),float(y)); vec2 c=i+o+vec2(h21(i+o),h21(i+o+7.3))*.8+.1; float d=length(g-c); if(d<d1){d2=d1;d1=d;best=c;} else if(d<d2) d2=d; }
    vec3 cc=tx(best*z); cc=clamp(mix(vec3(lum(cc)),cc,1.5)*1.15,0.,1.); col=cc*(.85+.3*(1.-d1)); col=mix(col,vec3(.06,.05,.07),smoothstep(.07,.03,d2-d1));
  } else if(S<15.5){ // 11. Four-tone handheld screen
    float z=3.*K; float lq=lum(tx((floor(p/z)+.5)*z)); float lev=floor(clamp(lq+(bay4(floor(p/z))-.5)*.3,0.,1.)*3.99);
    col=lev<.5?vec3(.06,.22,.06):lev<1.5?vec3(.19,.38,.19):lev<2.5?vec3(.55,.67,.06):vec3(.61,.74,.06);
  } else { // 12. Pop screenprint
    float lq=l+(vn(p*.1/K)-.5)*.05; col=lq<.33?vec3(.3,.1,.45):lq<.6?vec3(1.,.42,.2):vec3(.95,.95,.3);
    col*=mix(.15,1.,step(.22,lum(tx(p+vec2(3.,2.)*K))));
  }
  return col;
}
vec3 FG(vec3 fc,float fl,vec2 p){
  if(S<.5){ vec3 o=clamp(mix(vec3(fl),fc,1.2)*1.1,0.,1.); return floor(o*7.+.5)/7.*vec3(1.,.97,.9); }
  if(S<1.5){ float lq=floor(fl*5.+.5)/5.; vec3 o=fc*(lq+.05)/(fl+.05); return pow(clamp(mix(o,vec3(1.,.98,.94),.08),0.,1.),vec3(.88)); }
  if(S<2.5){ float warm=smoothstep(.16,.32,fc.r-max(fc.g,fc.b))*step(.3,fl); return fl<.16?vec3(.05,.04,.05):mix(vec3(.95,.93,.87),vec3(.8,.1,.07),warm); }
  if(S<3.5) return fl<.15?vec3(.04):fl<.4?vec3(.6):fl<.65?vec3(.82):vec3(.97);
  if(S<4.5) return (mix(fc,vec3(fl),.25)*vec3(1.05,1.,.88)+vec3(.05,.04,.02))*(.94+.06*vn(p*.012/K));
  if(S<5.5){ float pk=floor(clamp(1.-fc.g*1.1+(fc.r-.5)*.3,0.,1.)*3.+.5)/3., tl=floor(clamp(1.-fc.r*1.05,0.,1.)*3.+.5)/3.; return vec3(.97,.95,.9)*mix(vec3(1),vec3(1.,.32,.6),pk)*mix(vec3(1),vec3(.0,.55,.62),tl); }
  if(S<6.5) return mix(vec3(.25,.16,.1),vec3(.93,.87,.74),floor(fl*4.+.5)/4.);
  if(S<7.5) return fl<.25?vec3(.08,.06,.05):fl<.55?vec3(.78,.32,.16):vec3(.95,.9,.78);
  if(S<8.5) return mix(vec3(.05,.18,.42),vec3(.85,.92,.96),floor(smoothstep(.1,.8,fl)*3.+.5)/3.);
  if(S<9.5) return ukiyo(fc);
  if(S<10.5) return fc*.5+vec3(.03,0.,.07);
  if(S<11.5) return pow(mix(fc,vec3(1),.12),vec3(.9));
  if(S<12.5) return mix(fc,vec3(1),.06);
  if(S<13.5) return mix(vec3(fl),fc,.6)*.8+.2;
  if(S<14.5) return clamp(mix(vec3(fl),fc,1.3)*1.1,0.,1.);
  if(S<15.5){ float lev=floor(fl*3.99); return lev<.5?vec3(.06,.22,.06):lev<1.5?vec3(.19,.38,.19):lev<2.5?vec3(.55,.67,.06):vec3(.61,.74,.06); }
  return fl<.3?vec3(.1,.15,.5):fl<.6?vec3(1.,.3,.6):vec3(.98,.95,.85);
}
void main(){
  vec2 p=gl_FragCoord.xy;
  if(S>16.5){ vec4 f0=fx(p); gl_FragColor=vec4(mix(tx(p),f0.rgb,f0.a),1.); return; }
  // walkable ground: full strength. Backdrop: dimmed and greyed. An ink ground line between.
  float cy=R.y-p.y, walk=smoothstep(-1.,1.,cy-FL); vec3 b=BG(p);
  vec3 col=mix(mix(tone(),mix(vec3(lum(b)),b,1.-clamp((1.-D)*1.2,0.,.3)),D),b,walk);
  col=mix(col,inkc(),(1.-smoothstep(1.2*K,2.6*K,abs(cy-FL-1.5*K)))*.9);
  vec4 f=fx(p); vec3 ink=inkc(); float fe=smoothstep(.6,1.4,sobF(p,(S>.5&&S<1.5?.9:1.2)*K));
  if(f.a>0.){ vec3 o=mix(FG(f.rgb,lum(f.rgb),p),ink,fe); col=mix(col,o,smoothstep(0.,.5,f.a)); } else col=mix(col,ink,fe);
  if(N>0.){ float L=lum(col); float warm=smoothstep(.12,.3,col.r-max(col.g,col.b)); vec3 nc=L<.4?vec3(.04,.03,.04):mix(vec3(.96,.94,.88),vec3(.82,.1,.07),warm); col=mix(col,nc,N); }
  gl_FragColor=vec4(col,1.);
}`;
function initGL(cv) {
  const gl = cv.getContext('webgl', { preserveDrawingBuffer: true }); if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}')); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const mk = u => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + u); gl.bindTexture(gl.TEXTURE_2D, t); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); return t; };
  const t0 = mk(0), t1 = mk(1);
  const U = n => gl.getUniformLocation(pr, n), uR = U('R'), uS = U('S'), uT = U('tm'), uK = U('K'), uD = U('D'), uN = U('N'), uF = U('FL'); gl.uniform1i(U('T'), 0); gl.uniform1i(U('F'), 1);
  return { draw(bg, fg, style, t, k, dim = 1, noir = 0, floorY = 0) { gl.viewport(0, 0, cv.width, cv.height);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t0); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bg);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, t1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fg);
    gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uS, style); gl.uniform1f(uT, t); gl.uniform1f(uK, k); gl.uniform1f(uD, dim); gl.uniform1f(uN, noir); gl.uniform1f(uF, floorY); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); } };
}
