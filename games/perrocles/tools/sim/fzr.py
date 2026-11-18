import json, sys, glob, collections
rows=[json.loads(l) for f in sys.argv[1:] for g in glob.glob(f) for l in open(g)]
c=collections.Counter(r.get('why') for r in rows); print(len(rows), dict(c))
inv=collections.Counter(i[0]+'@'+i[1] for r in rows for i in (r.get('inv') or []))
if inv: print('INV', dict(inv.most_common(12)))
for r in rows:
  if r.get('why')!='end':
    s=json.loads(r.get('state') or '{}'); print(r.get('prof'), r['seed'], r.get('why'), round(r.get('t',0)), s.get('land'), s.get('x'), s.get('st'), s.get('sc'), s.get('boss'), s.get('flags')[-4:] if s.get('flags') else '', s.get('foes'), (r.get('err') or [''])[:1], (r.get('pageerr') or [''])[:1], (r.get('sceneLog') or [])[-3:])
