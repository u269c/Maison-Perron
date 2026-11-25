import asyncio, json, sys, random, time
from playwright.async_api import async_playwright
import os
HERE=os.path.dirname(os.path.abspath(__file__))
URL='file://'+os.path.join(HERE,'..','..','battle-planet-zenzizenzix.html')
BOTJS=open(os.path.join(HERE,'bot.js')).read()
async def worker(jobs, out, wid):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=swiftshader','--mute-audio'])
        for job in jobs:
            pg = await b.new_page(viewport={'width':640,'height':360}); errs=[]
            pg.on('pageerror', lambda e: errs.append(str(e)[:300])); pg.on('console', lambda m: errs.append(m.text[:300]) if m.type=='error' else None)
            await pg.goto(URL); await pg.wait_for_timeout(300)
            await pg.evaluate(BOTJS)
            t0=time.time()
            try:
                await pg.evaluate(f"BOT.start({job['level']}, '{job['kind']}', {str(job['solo']).lower()}, {json.dumps(job['pair'])}, {job['seed']})")
                cap = job['cap']; st = {'done': False, 't': 0}
                while not st['done'] and st['t'] < cap:
                    st = await pg.evaluate(f"BOT.step(900, {str(job.get('campaign', False)).lower()})")
                res = await pg.evaluate("BOT.result()")
            except Exception as e:
                res = {'crash': str(e)[:300]}
            res.update(job); res['errors'] = errs[:8]; res['nerr'] = len(errs); res['wall'] = round(time.time()-t0, 1); res['cleared'] = bool(res.get('done'))
            out.write(json.dumps(res)+'\n'); out.flush()
            print(wid, job['level'], job['kind'], 'solo' if job['solo'] else 'duo', job['pair'], 'CLEAR' if res['cleared'] else 'TIMEOUT', round(res.get('t',0)), 's game,', res['wall'], 's wall, restarts', res.get('restarts'), 'stuck', len(res.get('stuck',[])), 'err', len(errs), flush=True)
            await pg.close()
        await b.close()
async def main():
    jobs=json.load(open(sys.argv[1])); outp=sys.argv[2]; nw=int(sys.argv[3]) if len(sys.argv)>3 else 2
    out=open(outp,'a'); chunks=[jobs[i::nw] for i in range(nw)]
    await asyncio.gather(*[worker(c, out, k) for k,c in enumerate(chunks)])
asyncio.run(main())
