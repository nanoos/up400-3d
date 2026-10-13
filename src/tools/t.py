import asyncio, sys, os
from playwright.async_api import async_playwright
SITE='/home/claude/site2'; NM='/home/claude/preview/node_modules/three'
W,H,TAG=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3]
POS=sys.argv[4].split(',')
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={"width":W,"height":H}, reduced_motion="no-preference")
        await pg.add_init_script("1")
        pg.on('console', lambda m: print('console:', m.text))
        pg.on('pageerror', lambda e: print('pageerror:', e))
        async def route(r):
            u=r.request.url
            if 'cdn.jsdelivr.net/npm/three@0.128.0/' in u:
                return await r.fulfill(path=NM+'/'+u.split('three@0.128.0/')[1])
            if u.startswith('http://local/'):
                f=SITE+'/'+u[len('http://local/'):].split('#')[0]
                if f.endswith('index.html'):
                    body=b'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body style="margin:0">'+open(f,'rb').read()+b'</body></html>'
                    return await r.fulfill(body=body, content_type='text/html')
                if os.path.exists(f): return await r.fulfill(path=f)
            return await r.abort()
        await pg.route('**/*', route)
        await pg.goto('http://local/index.html')
        await pg.wait_for_timeout(9000)
        await pg.wait_for_timeout(1500)
        for pos in POS:
            sel,step=pos.split(':')
            await pg.evaluate(f'''(()=>{{const s=document.querySelector("{sel}");scrollTo(0,s.getBoundingClientRect().top+scrollY+{step}*innerHeight)}})()''')
            await pg.evaluate('window.__uhpFreeze=false')
            await pg.wait_for_timeout(3500)
            await pg.evaluate('window.__uhpFreeze=true')
            await pg.wait_for_timeout(400)
            await pg.screenshot(timeout=120000, path=f'/home/claude/shots/{TAG}-{sel.strip("#[]=").replace("data-scene","").replace("\"","")}-{step}.png')
        await b.close()
asyncio.run(main())
