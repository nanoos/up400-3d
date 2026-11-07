"""Turn the standalone CUSHA page (index.html) into cusha-page.js: a shadow-DOM embed for GoSite.
Mounts into <div data-cusha-page></div>. Assets load from jsDelivr pinned to ASSET_SHA."""
import re,json,sys
src,asset=sys.argv[1],sys.argv[2]
s=open(src).read()
css=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
font=re.search(r'<link rel="stylesheet" href="([^"]+)"',s).group(1)
body=s[s.index('<div class="wrap">'):s.index('<script type="importmap">')]
js=s[s.index('<script type="module">')+len('<script type="module">'):s.rindex('</script>')]
css=css.replace(':root{',':host{display:block;position:relative;',1)
css=re.sub(r'html,body\{[^}]*\}\n','',css)
css=css.replace('body{font-family','.cs{font-family',1)
css=css.replace('[hidden]{display:none!important}','[hidden]{display:none!important}\n.cs{position:relative;isolation:isolate;overflow:hidden;color:var(--fg);text-align:right}')
# imports -> dynamic, from jsDelivr +esm (bare 'three' rewritten by jsDelivr)
imp=re.findall(r"^import .*?;\n",js,re.M)
for l in imp: js=js.replace(l,'')
T='https://cdn.jsdelivr.net/npm/three@0.160.0'
pre=f"""const THREE=await import('{T}/+esm');
const {{OrbitControls}}=await import('{T}/examples/jsm/controls/OrbitControls.js/+esm');
const {{GLTFLoader}}=await import('{T}/examples/jsm/loaders/GLTFLoader.js/+esm');
const {{DRACOLoader}}=await import('{T}/examples/jsm/loaders/DRACOLoader.js/+esm');
const {{RoomEnvironment}}=await import('{T}/examples/jsm/environments/RoomEnvironment.js/+esm');
"""
js=js.replace('document.getElementById','sr.getElementById').replace('document.querySelectorAll','sr.querySelectorAll')
left=[l for l in js.split('\n') if 'document.' in l and 'document.createElement' not in l]
assert not left,left
# model: load glb directly + decoder from jsDelivr
a=js.index("fetch('cusha_model.txt')"); b=js.index("}).catch(fail);")+len("}).catch(fail);")
js=js[:a]+f"""{{const dl=new DRACOLoader(); dl.setDecoderPath('{T}/examples/jsm/libs/draco/gltf/');
const gl=new GLTFLoader(); gl.setDRACOLoader(dl); gl.load(BASE+'cusha.glb',onModel,e=>{{if(e.total)sr.getElementById('prog').textContent=Math.round(e.loaded/e.total*100)+'%';}},fail);}}"""+js[b:]
js=js.replace("load('screen.jpg'","load(BASE+'screen.jpg'")
assert "BASE+'cusha.glb'" in js and "BASE+'screen.jpg'" in js
BASE=f"https://cdn.jsdelivr.net/gh/nanoos/up400-3d@{asset}/cusha/"
out=f"""/* SonoPars CUSHA 3D explorer. Mounts into [data-cusha-page] inside a shadow root. Assets: {asset} */
(function(){{
  var BASE={json.dumps(BASE)};
  var CSS={json.dumps(css)};
  var HTML={json.dumps('<div class="cs">'+body+'</div>')};
  if(!document.getElementById('cusha-fonts')){{var l=document.createElement('link');l.id='cusha-fonts';l.rel='stylesheet';l.href={json.dumps(font)};document.head.appendChild(l);}}
  async function run(sr){{
{pre}{js}
  }}
  function mount(host){{
    if(host.shadowRoot) return;
    var root=host.attachShadow({{mode:'open'}});
    root.innerHTML='<style>'+CSS+'</style>'+HTML;
    var art=host.querySelector('.cusha-static'); if(art) art.style.display='none';
    run(root).catch(function(e){{console.error('CUSHA page',e);var st=root.getElementById('status');if(st)st.textContent='Model could not load.';}});
  }}
  function mountAll(){{[].forEach.call(document.querySelectorAll('[data-cusha-page]'),mount);}}
  window.CushaPage={{mountAll:mountAll}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountAll);else mountAll();
}})();
"""
import os; open(os.path.join(os.path.dirname(os.path.abspath(src)),'cusha-page.js'),'w').write(out); print('ok',len(out))
