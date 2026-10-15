import asyncio, sys, os, re
from playwright.async_api import async_playwright
REPO='/home/claude/up400-3d'; NM='/home/claude/preview/node_modules/three'
mod=open(sys.argv[1],encoding='utf-8').read(); out=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={"width":1280,"height":900})
        pg.on('pageerror', lambda e: print('pageerror:', str(e)[:200]))
        pg.on('console', lambda m: m.type=='error' and print('console:', m.text[:200]))
        async def route(r):
            u=r.request.url
            if 'three@0.128.0/' in u: return await r.fulfill(path=NM+'/'+u.split('three@0.128.0/')[1])
            m=re.search(r'gh/nanoos/up400-3d@[0-9a-f]+/(.*)$',u)
            if m and os.path.exists(REPO+'/'+m.group(1)): return await r.fulfill(path=REPO+'/'+m.group(1))
            if u.startswith('http://local/'):
                # mimic React dangerouslySetInnerHTML (scripts inert) + re-run each <script> like many builders do
                html='<!doctype html><html><head><meta charset="utf-8"></head><body><main id="m"></main><script>var MOD=%s;var m=document.getElementById("m");m.innerHTML=MOD;[].forEach.call(m.querySelectorAll("script"),function(o){var s=document.createElement("script");if(o.type)s.type=o.type;s.textContent=o.textContent;o.replaceWith(s);});</script></body></html>'
                import json
                return await r.fulfill(body=html%json.dumps(mod).replace("</","<\\/"),content_type='text/html')
            return await r.abort()
        await pg.route('**/*',route)
        await pg.goto('http://local/'); await pg.wait_for_timeout(8000)
        print('shadow:', await pg.evaluate('!!document.querySelector("[data-uhp-page],[data-uhp-page-fa]").shadowRoot'))
        await pg.screenshot(path=out); await b.close()
asyncio.run(main())
