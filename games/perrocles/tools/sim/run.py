import asyncio, sys, json, time
from playwright.async_api import async_playwright
# usage: run.py prof n start par k out.jsonl
prof, n, start, par, K, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
heroic = prof.endswith('H'); base = prof.rstrip('H')
import os
START = os.environ.get('START', '')  # e.g. lerna: start in Lerna, stop when the labour is done
HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.environ.get('PAGE', 'file://' + os.path.normpath(os.path.join(HERE, '..', '..', 'perrocles.html')))
SIM = open(os.path.join(HERE, 'sim.js')).read()
async def one(b, seed):
  pg = await b.new_page(viewport={'width': 480, 'height': 270}); errs = []
  pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
  try:
    await pg.goto(PAGE); await pg.wait_for_function("window.GAME && G.scene === 'title'", timeout=60000); await pg.wait_for_timeout(300)
    await pg.keyboard.press('Enter'); await pg.wait_for_function("G.scene === 'play' && G.hero", timeout=30000)
    if START == 'delphiS':
      await pg.evaluate("GAME.auto=true; for (const k of ['quest','oar','goat','dusk','thread','farewell','wolves','spring']) flag(k,true); G.hero.hasClub=true; enterLand('delphi', 1800); Save.save(); 1")
    elif START == 'full':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; 1")
    elif START == 'lerna':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos']) flag(k,true); flag('stance', ['force','cunning'][%d %% 2]); if (%d %% 2 === 0) { flag('lion', true); flag('pelt', true); HEROS.maxHp = 7; } G.hero.hp = HEROS.maxHp; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='xiphos'; enterLand('lerna', 40); 1" % (seed, seed))
    elif START == 'act4':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos','lion','pelt','lerna','arcadia','hind','artemis','venom','elis','augeas','birds','boar','stables','ocyrhoe','ship','quayHera','argosSeen','polyphemus','wine','cyclopsSeen','aeolus','windsCaught','aeolusIn','aeolusSeen','bagOpen','moly','circe','circeSeen','sirens','sirensSeen','strait','straitSeen','crete','creteSeen','talos','thread','asterion','labSeen','act2done','shore','shoreSeen','eyeBroken','ownSight','lemnos','lemnosSeen','tripods','forge','hesperides','hesperidesSeen','atlas','apple','caucasus','caucasusSeen','charonObol','styx','ferried','cerberus','shadeTalk','tiresias','underworld','underworldSeen']) flag(k,true); if (%d %% 2 === 0) flag('well', true); flag('stance','force'); Save.d.letters='ΗΦΑΙΣΤΟΥ'; HEROS.maxHp = 7; G.hero.hp = 7; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='forge'; enterLand('etna', 40); 1" % seed)
    elif START == 'act4o':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos','lion','pelt','lerna','arcadia','hind','artemis','venom','elis','augeas','birds','boar','stables','ocyrhoe','ship','quayHera','argosSeen','polyphemus','wine','cyclopsSeen','aeolus','windsCaught','aeolusIn','aeolusSeen','bagOpen','moly','circe','circeSeen','sirens','sirensSeen','strait','straitSeen','crete','creteSeen','talos','thread','asterion','labSeen','act2done','shore','shoreSeen','eyeBroken','ownSight','lemnos','lemnosSeen','tripods','forge','hesperides','hesperidesSeen','atlas','apple','caucasus','caucasusSeen','charonObol','styx','ferried','cerberus','shadeTalk','tiresias','underworld','underworldSeen']) flag(k,true); if (%d %% 2 === 0) flag('well', true); flag('stance','force'); Save.d.letters='ΗΦΑΙΣΤΟΥ'; HEROS.maxHp = 7; G.hero.hp = 7; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='forge'; flag('etna',true); flag('reunion',true); flag('heraion',true); enterLand('olympus', 600); 1" % seed)
    elif START == 'act3b':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos','lion','pelt','lerna','arcadia','hind','artemis','venom','elis','augeas','birds','boar','stables','ocyrhoe','ship','quayHera','argosSeen','polyphemus','wine','cyclopsSeen','aeolus','windsCaught','aeolusIn','aeolusSeen','bagOpen','moly','circe','circeSeen','sirens','sirensSeen','strait','straitSeen','crete','creteSeen','talos','thread','asterion','labSeen','act2done','shore','shoreSeen','eyeBroken','ownSight','lemnos','lemnosSeen','tripods','forge','hesperides','hesperidesSeen','atlas','apple']) flag(k,true); flag('stance','force'); Save.d.letters='ΗΦΑΙ'; HEROS.maxHp = 7; G.hero.hp = 7; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='forge'; enterLand('deck', 60); 1")
    elif START == 'act3a':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos','lion','pelt','lerna','arcadia','hind','artemis','venom','elis','augeas','birds','boar','stables','ocyrhoe','ship','quayHera','argosSeen','polyphemus','wine','cyclopsSeen','aeolus','windsCaught','aeolusIn','aeolusSeen','bagOpen','moly','circe','circeSeen','sirens','sirensSeen','strait','straitSeen','crete','creteSeen','talos','thread','asterion','labSeen']) flag(k,true); flag('stance','force'); Save.d.letters='ΗΦΑ'; HEROS.maxHp = 7; G.hero.hp = 7; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='xiphos'; enterLand('deck', 60); 1")
    elif START == 'act2d':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos','lion','pelt','lerna','arcadia','hind','artemis','venom','elis','augeas','birds','boar','stables','ocyrhoe','ship','quayHera','argosSeen','polyphemus','wine','cyclopsSeen','aeolus','windsCaught','aeolusIn','aeolusSeen','bagOpen','moly','circe','circeSeen','sirens','sirensSeen','strait','straitSeen']) flag(k,true); flag('stance','force'); HEROS.maxHp = 7; G.hero.hp = 7; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='xiphos'; enterLand('deck', 60); 1")
    elif START == 'act2c':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos','lion','pelt','lerna','arcadia','hind','artemis','venom','elis','augeas','birds','boar','stables','ocyrhoe','ship','quayHera','argosSeen','polyphemus','wine','cyclopsSeen','aeolus','windsCaught','aeolusIn','aeolusSeen','bagOpen','moly','circe','circeSeen']) flag(k,true); flag('stance','force'); HEROS.maxHp = 7; G.hero.hp = 7; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='xiphos'; enterLand('deck', 60); 1")
    elif START == 'act2b':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos','lion','pelt','lerna','arcadia','hind','artemis','venom','elis','augeas','birds','boar','stables','ocyrhoe','ship','quayHera','argosSeen','polyphemus','wine','cyclopsSeen']) flag(k,true); flag('stance','force'); HEROS.maxHp = 7; G.hero.hp = 7; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='xiphos'; enterLand('deck', 60); 1")
    elif START == 'act2':
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring','argolid','hermes','feather','tiryns','labours','xiphos','lion','pelt','lerna','arcadia','hind','artemis','venom','elis','augeas','birds','boar','stables','ocyrhoe','ship','quayHera','argosSeen']) flag(k,true); flag('stance','force'); HEROS.maxHp = 7; G.hero.hp = 7; G.hero.hasClub=true; G.hero.hasEye=true; G.hero.weapon='xiphos'; enterLand('cyclops', %d); 1" % (40 if seed % 2 == 0 else 300))
    else:
      await pg.evaluate("Save.d.heroic=" + ('true' if heroic else 'false') + "; GAME.auto=true; for (const k of ['quest','farewell','oracle','athena','eyeGiven','spring']) flag(k,true); G.hero.hasClub=true; G.hero.hasEye=true; enterLand('delphi', 2380); 1")
    await pg.wait_for_timeout(300)
    SIMSET = f"window.SIMARGS={{seed:{seed}, prof:'{base}', k:{K}, budget:{1 if os.environ.get('BUDGET') else 0}, tmax:{os.environ.get('TMAX','1200')}, chaos:{os.environ.get('CHAOS','0')}, forceG:{os.environ.get('FORCEG','0')}, until:'{ os.environ.get('UNTIL') or {'lerna':'lerna','act2':'polyphemus','act2b':'circe','act2c':'strait','act2d':'crete','act3a':'hesperides','act3b':'underworld','act4':'zzz','act4o':'zzz'}.get(START,'') }'}}; 1"
    await pg.evaluate(SIMSET); await pg.evaluate(SIM + "\n;1")
    t0 = time.time()
    RELOAD = float(os.environ.get('RELOAD', '0')); nre = 0; parts = []; RELOADLAND = os.environ.get('RELOADLAND'); rlLand = None; rlog = []
    SHOT = os.environ.get('SHOTS'); lastLand = None; pend = None; import random as _r; _r.seed(seed)
    while time.time() - t0 < int(os.environ.get('REALMAX','400')):
      await pg.wait_for_timeout(1500)
      st = await pg.evaluate("[SIM.done, G.land, G.scene]")
      if st[0]: break
      doRL = RELOADLAND and st[1] != rlLand and nre < 80
      if doRL: rlLand = st[1]
      if doRL or (RELOAD and nre < 3 and _r.random() < RELOAD):
        nre += 1; part = json.loads(await pg.evaluate("JSON.stringify(Object.assign({}, SIM, {t: NOW.t - SIM.t0}))")); parts.append(part)
        await pg.evaluate("Save.save(); 1"); await pg.reload(); await pg.wait_for_function("window.GAME && G.scene === 'title'", timeout=60000); await pg.wait_for_timeout(200)
        await pg.keyboard.press('Enter'); await pg.wait_for_function("G.scene === 'play' && G.hero", timeout=30000)
        after = await pg.evaluate("G.land + ':' + Math.round(G.hero.x)"); rlog.append([st[1], after])
        await pg.evaluate("GAME.auto=true; 1"); await pg.evaluate(SIMSET); await pg.evaluate(SIM + "\n;1"); continue
      if os.environ.get('BLACKPROBE'):
        bp = await pg.evaluate("(()=>{ try { render(); } catch(e){} const c=document.querySelector('canvas'); const g=c.getContext('2d'); let mx=0; try { const d=g.getImageData(0,0,c.width,c.height).data; for (let i=0;i<d.length;i+=400) mx=Math.max(mx,d[i],d[i+1],d[i+2]); } catch(e) { mx=-1; } return JSON.stringify({mx, land:G.land, sc:G.script&&G.script.name, black:G.black, fade:G.fade&&{t:+G.fade.t.toFixed(2),dur:G.fade.dur,dir:G.fade.dir}, card:!!G.card, sky:!!G.sky, constel:!!G.constel, tilt:G.tilt, skyDark:G.skyDark, world:G.world, paused:G.paused, scene:G.scene, cutaway:!!G.cutaway}); })()")
        bpj = json.loads(bp)
        if bpj['mx'] >= 0 and bpj['mx'] < 12: print('BLACK', seed, bp, flush=True)
      if SHOT and pend and st[1] == pend and not st[0]:
        await pg.evaluate("try { render(); } catch (e) {} 1"); await pg.screenshot(path=f"{SHOT}/{prof}-{seed}-{st[1]}-{int(time.time()-t0)}.png"); pend = None
      if SHOT and st[1] != lastLand:
        lastLand = st[1]
        if _r.random() < float(os.environ.get('SHOTP', '0.3')): pend = st[1]
    r = json.loads(await pg.evaluate("JSON.stringify(SIM)")); r['pageerr'] = errs[:3]; D=os.environ.get('DUMP');
    r['rlog'] = rlog
    if parts:
      r['reloads'] = len(parts); r['t'] = r.get('t', 0) + sum(p.get('t', 0) or (p.get('_now', 0)) for p in parts)
      for p in parts:
        for k, v in (p.get('deaths') or {}).items(): r.setdefault('deaths', {})[k] = r['deaths'].get(k, 0) + v
        r['inv'] = (p.get('inv') or []) + (r.get('inv') or []); r['err'] = (p.get('err') or []) + (r.get('err') or [])
        for k, v in (p.get('mk') or {}).items(): r.setdefault('mk', {})[k] = r['mk'].get(k, 0) + v
    r['state'] = await pg.evaluate("JSON.stringify({land:G.land,x:Math.round(G.hero.x),y:Math.round(G.hero.y),hp:G.hero.hp,st:G.hero.state,sc:G.script&&G.script.name,dl:G.dialog?{who:String(G.dialog.who&&G.dialog.who.id||G.dialog.who),done:G.dialog.done,t:G.dialog.t,ch:!!G.dialog.choices,txt:String(G.dialog.text&&(G.dialog.text.en||G.dialog.text)||'').slice(0,60)}:0,lb:G.letterbox,boss:G.boss&&G.boss.a&&(G.boss.a.id+'/'+(G.boss.a.mem&&(G.boss.a.mem.st||G.boss.a.mem.state))+'/hp'+G.boss.a.hp+'/p'+(G.boss.a.punish||0)),heroic:!!Save.d.heroic,torch:G.hero.torch,weapon:G.hero.weapon,heads:G.boss&&G.boss.a&&G.boss.a.heads?G.boss.a.heads.map(q=>q.st+(q.imm?'*':'')).join(','):'',ichor:Math.round(G.ichor||0),goal:G.hero.goal,scripted:G.hero.scripted,busy:G.hero.busy,hvx:Math.round(G.hero.vx),leaving:G.leaving,goals:G.actors.filter(a=>a.goal).map(a=>a.id+':'+Math.round(a.x)+'>'+Math.round(a.goal.x)),wait:G.script&&G.script.waiting&&Object.keys(G.script.waiting),sceneLog:(SIM.sceneLog||[]).slice(-6),paused:G.paused,scene:G.scene,q:(G.sceneQ||[]).map(q=>q.name),later:(G.later||[]).length,eyeT:G.eyeT,bounds:G.bounds,world:G.world,flags:Object.keys(Save.d.flags||{}).filter(k=>Save.d.flags[k]).slice(-10),foes:G.actors.filter(a=>a.foe&&a.alive&&!a.hidden).map(a=>a.id+':'+Math.round(a.x)).slice(0,6),zones:(G.zones||[]).map(z=>z.x0+'-'+z.x1).slice(0,8)})")
    if SHOT and r.get('why') != 'end': await pg.evaluate("try { render(); } catch (e) {} 1"); await pg.screenshot(path=f"{SHOT}/FAIL-{prof}-{seed}-{r.get('why')}.png")
    if D: r['dump']=await pg.evaluate(D)
    r['real'] = round(time.time() - t0, 1)
  except Exception as e:
    r = {'seed': seed, 'prof': prof, 'done': False, 'why': 'harness', 'err': [str(e)[:200]], 'pageerr': errs[:3]}
  await pg.close(); return r
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--disable-background-networking', '--disable-component-update', '--no-first-run'])
    q = list(range(start, start + n)); f = open(out, 'a')
    async def worker():
      while q:
        seed = q.pop(0); r = await one(b, seed); f.write(json.dumps(r) + '\n'); f.flush()
        print(seed, r.get('why'), round(r.get('t', 0)), r.get('deaths'), 'lion', r.get('lion'), r.get('stuck'), r.get('err')[:1] if r.get('err') else '', r.get('real'), flush=True)
    await asyncio.gather(*[worker() for _ in range(par)])
    await b.close()
asyncio.run(main())
