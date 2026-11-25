import json, sys, statistics as stt, collections
rs=[json.loads(l) for l in open(sys.argv[1])]
LV=['Havre','De Soif','Bouldaire','Tour 3½']
def med(a): return round(stt.median(a)) if a else '-'
def p90(a): a=sorted(a); return round(a[int(len(a)*.9)-1]) if a else '-'
print('runs', len(rs), 'crashes', sum(1 for r in rs if 'crash' in r), 'with JS errors', sum(1 for r in rs if r.get('nerr')))
print()
print(f"{'level':10} {'bot':6} {'mode':5} {'n':>3} {'clear':>6} {'med s':>6} {'p90 s':>6} {'restart':>7} {'KO':>5} {'falls':>6} {'hits/min':>8} {'stuck':>5} {'maxIdle':>7}")
for lvl in range(4):
  for kind in ['dumb','naive','good']:
    for solo in [True, False]:
      g=[r for r in rs if r.get('level')==lvl and r.get('kind')==kind and r.get('solo')==solo and not r.get('campaign')]
      if not g: continue
      cl=[r for r in g if r['cleared']]
      ts=[r['t'] for r in cl]
      print(f"{LV[lvl]:10} {kind:6} {'solo' if solo else 'duo':5} {len(g):>3} {100*len(cl)//len(g):>5}% {med(ts):>6} {p90(ts):>6} {stt.mean([r.get('restarts',0) for r in g]):>7.1f} {stt.mean([r.get('kos',0) for r in g]):>5.1f} {stt.mean([r.get('falls',0) for r in g]):>6.1f} {stt.mean([60*r.get('hits',0)/max(1,r.get('t',1)) for r in g]):>8.1f} {sum(len(r.get('stuck',[])) for r in g):>5} {max(r.get('maxIdle',0) for r in g):>7.0f}")
  print()
# screen times (cleared, non-dumb)
print('median seconds per screen (cleared naive+good runs):')
sc=collections.defaultdict(list)
for r in rs:
  if r['cleared'] and r.get('kind')!='dumb' and not r.get('campaign'):
    for k,v in r.get('screens',{}).items(): sc[k].append(v)
for k in sorted(sc): print(' ', k, med(sc[k]), 'p90', p90(sc[k]), 'n', len(sc[k]))
print()
print('restarts by screen:', collections.Counter(f"{a[0]}:{a[1]}" for r in rs for a in r.get('restartAt',[])).most_common(12))
print('boss time median:', {k: med([r['bossT'][k] for r in rs if k in r.get('bossT',{}) and r['cleared']]) for k in ['boss','oscar','calve','mmf']})
print()
st=collections.Counter()
for r in rs:
  for s in r.get('stuck',[]): st[(s['LEVEL'], s['STATE'], s['scr'], s['zone'])]+=1
print('stuck episodes (level,state,screen,zone):', st.most_common(15))
tm=collections.Counter((r['level'],r['kind'],r['final']['STATE'],r['final']['scr']) for r in rs if not r['cleared'] and 'final' in r)
print('timeouts (level,bot,state,screen):', tm.most_common(15))
errs=collections.Counter(e for r in rs for e in r.get('errors',[]))
print('errors:', errs.most_common(8))
camp=[r for r in rs if r.get('campaign')]
if camp:
  print('campaign runs', len(camp), 'finished', sum(r['cleared'] for r in camp), 'median', med([r['t'] for r in camp if r['cleared']]))
  print(' campaign stops:', collections.Counter((r['final']['LEVEL'], r['final']['STATE']) for r in camp).most_common())
