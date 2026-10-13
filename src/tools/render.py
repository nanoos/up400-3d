import asyncio, os
from playwright.async_api import async_playwright
SITE='/home/claude/site2'; NM='/home/claude/preview/node_modules/three'
SHOTS=[('solution',i) for i in range(7)]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={"width":720,"height":880}, device_scale_factor=1.25)
        await pg.add_init_script('window.__uhpRenderMode=true')
        pg.on('pageerror', lambda e: print('pageerror:', e))
        async def route(r):
            u=r.request.url
            if 'three@0.128.0/' in u: return await r.fulfill(path=NM+'/'+u.split('three@0.128.0/')[1])
            if u.startswith('http://local/'):
                f=SITE+'/'+u[13:]
                if f.endswith('index.html'):
                    return await r.fulfill(body=b'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+open(f,'rb').read()+b'</body></html>',content_type='text/html')
                if os.path.exists(f): return await r.fulfill(path=f)
            return await r.abort()
        await pg.route('**/*', route)
        await pg.goto('http://local/index.html')
        await pg.wait_for_function('document.getElementById("loading").hidden', timeout=90000)
        await pg.add_style_tag(content='main,header,.loading,.fab{visibility:hidden!important}')
        for name,i in SHOTS:
            await pg.evaluate(f'window.__uhpForce("{name}",{i})')
            await pg.evaluate('window.__uhpFreeze=false')
            await pg.wait_for_timeout(3000 if name=='solution' and i>=4 else 1500)
            await pg.evaluate('window.__uhpFreeze=true')
            await pg.wait_for_timeout(300)
            await pg.screenshot(timeout=180000, path=f'/home/claude/shots/m/m-{name}-{i}.png')
        await b.close()
asyncio.run(main())
