import asyncio, os
from playwright.async_api import async_playwright
SITE='/home/claude/site-fa'; NM='/home/claude/preview/node_modules/three'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={"width":1280,"height":900}, reduced_motion="reduce")
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
        await pg.goto('http://local/index.html'); await pg.wait_for_timeout(6000)
        await pg.evaluate('window.__uhpFreeze=true')
        await pg.evaluate('document.getElementById("receive").scrollIntoView()'); await pg.wait_for_timeout(800)
        await pg.screenshot(path='/home/claude/shots/fa-receive.png', timeout=120000)
        await pg.fill('#q-name','علی رضایی'); await pg.fill('#q-mobile','09121234567'); await pg.fill('#q-org','دانشگاه تهران'); await pg.fill('#q-city','تهران')
        await pg.select_option('#q-probe','both')
        await pg.evaluate('document.getElementById("qform").requestSubmit()'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='/home/claude/shots/fa-pf.png', timeout=120000)
        await b.close()
asyncio.run(main())
