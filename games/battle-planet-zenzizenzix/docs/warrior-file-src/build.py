# Builds docs/warrior-file.html from template.html + the parts of the earlier pages.
import re
import os
HERE=os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
OUT=os.path.join(HERE,'..','warrior-file.html')
def scope(css, pre, drop=('body','body:before','*',':root','html')):
    out=[]; i=0; css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
    while i<len(css):
        j=css.find('{',i)
        if j<0: break
        sel=css[i:j].strip()
        if sel.startswith('@'):
            depth=1;k=j+1
            while depth:
                depth+= {'{':1,'}':-1}.get(css[k],0); k+=1
            out.append(sel+'{'+scope(css[j+1:k-1],pre,drop)+'}'); i=k; continue
        k=css.index('}',j); body=css[j+1:k]; i=k+1
        sels=[s.strip() for s in sel.split(',') if s.strip() not in drop]
        if sels: out.append(','.join(pre+' '+s for s in sels)+'{'+body+'}')
    return '\n'.join(out)
body=open('an_body.html').read()
if '<nav>' in body: a=body.index('<nav>'); b=body.index('</nav>')+6; body=body[:a]+body[b:]
import base64, json
def douze():
    art=os.path.join(HERE,'..','art')
    heroes=open(os.path.join(art,'les-douze-src','heroes.js')).read()
    thumbs={}
    for f in sorted(os.listdir(os.path.join(art,'les-douze','thumbs'))):
        thumbs[f[:-4]]='data:image/jpeg;base64,'+base64.b64encode(open(os.path.join(art,'les-douze','thumbs',f),'rb').read()).decode()
    return heroes+'\nconst THUMBS = '+json.dumps(thumbs)+';'
t=open('template.html').read()
for k,v in {'WAR_CSS':scope(open('war_css.css').read(),'.wv'),'AN_CSS':scope(open('an_css.css').read(),'.an'),'AN_BODY':body,'WAR_JS':open('war_js2.js').read(),'AN_JS':open('an_js.js').read(),'DOUZE_JS':douze()}.items():
    t=t.replace('{{'+k+'}}',v)
open(OUT,'w').write(t); print('built',len(t))
