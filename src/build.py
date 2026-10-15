"""Turn site2/index.html into page/uhp-page.js (shadow-DOM embed for GoSite)."""
import re, json
s=open('/home/claude/site2/index.html').read()
css=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
font=re.search(r'<link rel="stylesheet" href="([^"]+)"',s).group(1)
body=s[s.index('<div id="stage"'):s.index('<script src=')]
js=s[s.rindex('<script>')+8:s.rindex('</script>')]
css=css.replace(':root{',':host{display:block;position:relative;',1)
css=css.replace('html{scroll-behavior:smooth}\n','')
bodyrule=re.search(r'\nbody\{[^}]*\}',css).group(0)
css=css.replace(bodyrule,'\n.uhp{'+bodyrule[6:-1]+';position:relative;isolation:isolate;-webkit-text-size-adjust:100%;overflow:hidden}')
css=css.replace('@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}','')
css+='\n#stage.abs{position:absolute;top:0;bottom:auto;height:100vh}\n'
css=css.replace("url(hero-fallback.png)","url(%%BASE%%hero-fallback.png)")
for attr in ['src','poster']:
    body=re.sub(attr+r'="([\w.-]+\.(?:jpg|png|mp4|webp))"', lambda m: attr+'="%%BASE%%'+m.group(1)+'"', body)
markup='<div class="uhp">'+body+'</div>'
cfg="  var BASE = '', VBASE = '', VMODEL = 'device.glb', SHELL = document.body;"
assert cfg in js
js=js.replace(cfg,"  var VBASE = BASE.replace(/page\\/$/, ''), VMODEL = 'device-draco.glb', SHELL = root.querySelector('.uhp');")
js=js.replace('document.getElementById','root.getElementById').replace('document.querySelectorAll','root.querySelectorAll')
left=[l for l in js.split('\n') if 'document.' in l and 'document.createElement' not in l and 'document.head' not in l]
assert not left, left
page=open('/home/claude/gosite-page/page/uhp-page.js').read()
head=page[:page.index('  var CSS = ')]
tail=page[page.index("  if (!document.getElementById('uhp-fonts'))"):]
tail=re.sub(r"l\.href = '[^']+';", "l.href = '"+font+"';", tail, count=1)
a=tail.index('  function run(root) {\n')+len('  function run(root) {\n'); b=tail.index('\n  }\n  function mountAll()')
tail=tail[:a]+js+tail[b:]
head=re.sub(r'\(draft v\d+\)','(v1.1)',head)
out=head+'  var CSS = '+json.dumps(css)+';\n  var HTML = '+json.dumps(markup)+';\n'+tail
ASSET=open('/home/claude/gosite-page/ASSET_SHA').read().strip()
out=re.sub(r"var BASE = me \? [^;]*;", "var BASE = me ? 'https://cdn.jsdelivr.net/gh/nanoos/up400-3d@"+ASSET+"/page/' : '';", out)
assert ASSET in out
out=re.sub(r"\n  var CBASE = [^\n]*", "", out)  # drop old CBASE lines
out=re.sub(r"(var BASE = me \? [^;]*;)", r"\1\n  var CBASE = me ? me.replace(/[^\\/]*$/, '').replace(/page\\/$/, '') : '';", out, count=1)
assert out.count("VBASE + 'up400-viewer.js'")>=1
out=out.replace("VBASE + 'up400-viewer.js'", "CBASE + 'up400-viewer.js'")
open('/home/claude/gosite-page/page/uhp-page.js','w').write(out); print('ok', len(out))
