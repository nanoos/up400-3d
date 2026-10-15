import asyncio, os, sys
from playwright.async_api import async_playwright
SITE=sys.argv[1]; NM='/home/claude/preview/node_modules/three'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        ctx=await b.new_context(viewport={"width":390,"height":844}, is_mobile=True, has_touch=True, device_scale_factor=1)
        pg=await ctx.new_page()
        pg.on('pageerror', lambda e: print('pageerror:', str(e)[:200]))
        async def route(r):
            u=r.request.url
            if 'three@0.128.0/' in u: return await r.fulfill(path=NM+'/'+u.split('three@0.128.0/')[1])
            if u.startswith('http://local/'):
                f=SITE+'/'+u[13:].split('?')[0]
                if f.endswith('index.html'): return await r.fulfill(body=b'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}.gs{position:fixed;top:0;left:0;right:0;height:70px;background:#fff;z-index:50;border-bottom:1px solid #ddd;font:600 22px sans-serif;padding:22px}</style></head><body><div class="gs">Ultrasonic Homogenizer</div>'+open(f,'rb').read()+b'</body></html>',content_type='text/html; charset=utf-8')
                if os.path.exists(f): return await r.fulfill(path=f)
            return await r.abort()
        await pg.route('**/*', route)
        await pg.goto('http://local/index.html'); await pg.wait_for_timeout(30000)
        async def shot(name, js=None, wait=6000):
            if js: await pg.evaluate(js)
            await pg.wait_for_timeout(wait)
            try: await pg.screenshot(path='/home/claude/shots/ph-%s.png'%name, timeout=90000)
            except Exception as e: print('fail', name)
        await shot('hero', None, 1000)
        steps='[...document.querySelectorAll("#solution .step")]'
        await shot('probe', steps+'[3].scrollIntoView({block:"end"})')
        await shot('table', '[...document.querySelectorAll("#inside .step")][4].scrollIntoView({block:"end"})')
        await shot('stack', '[...document.querySelectorAll("#inside .step")][2].scrollIntoView({block:"end"})')
        await shot('colours', 'document.querySelector(".colours").scrollIntoView({block:"center"})', 2000)
        await b.close()
asyncio.run(main())
