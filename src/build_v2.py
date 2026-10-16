"""v2 page (review changes, 16 Oct 2026): src/page-v2/index.html -> page/uhp-page-v2.js + src/seo/module-v2-content.html
usage: python3 src/build_v2.py <ASSET_SHA>   (commit that contains the box-*.webp photos)"""
import re, json, sys, html
sys.path.insert(0, '/home/claude/up400-3d/src/seo')
import seo
R = '/home/claude/up400-3d/'
SRC = R + 'src/page-v2/index.html'
ASSET = sys.argv[1]

def T(t): return '<span class="todo">' + t + '</span>'
FAQ = [(q, html.escape(a)) for q, a in seo.FAQ_EN]
FAQ.insert(1, ("Is 400 W the power that goes into my sample?",
  "No. 400 W is the maximum electrical power the generator delivers to the transducer " + T('[confirm]') + ". "
  "The power drawn from the wall socket is higher, because the generator and its fan have losses. The acoustic power that reaches the liquid is lower, "
  "and depends on the probe, the amplitude and the liquid; it is measured by calorimetry, from the temperature rise of a known volume of water. "
  "See the specification table for our measured values " + T('[values to add]') + "."))
FAQ = [(q, a.replace(html.escape('No separate box is needed.'), 'No separate box is needed.') +
        (' ' + T('[Measured at 1 m: ___ dB(A) door closed, ___ dB(A) door open]') if q.startswith('Is the UHP-400 loud') else '')) for q, a in FAQ]

def faq_block(items):
    qa = ''.join('<details><summary><h3>%s</h3></summary><p>%s</p></details>' % (html.escape(q), a) for q, a in items)
    return ('    <div class="sec wrap faq" id="faq"><div class="inner">\n'
            '      <div class="sec-head"><p class="eyebrow">Questions</p><h2>Frequently asked questions</h2><p>Short answers to what labs ask us most about probe sonication and the UHP-400.</p></div>\n'
            '      <div class="qa">%s</div>\n    </div></div>\n') % qa
seo.insert_faq(SRC, faq_block(FAQ))

# ---------------------------------------------------------------- bundle
s = open(SRC, encoding='utf-8').read()
css = re.search(r'<style>(.*?)</style>', s, re.S).group(1)
font = re.search(r'<link rel="stylesheet" href="([^"]+)"', s).group(1)
body = s[s.index('<div id="stage"'):s.index('<script src=')]
js = s[s.rindex('<script>') + 8:s.rindex('</script>')]
css = css.replace(':root{', ':host{display:block;position:relative;', 1)
css = css.replace('html{scroll-behavior:smooth}\n', '')
bodyrule = re.search(r'\nbody\{[^}]*\}', css).group(0)
css = css.replace(bodyrule, '\n.uhp{' + bodyrule[6:-1] + ';position:relative;isolation:isolate;-webkit-text-size-adjust:100%;overflow:hidden}')
css = css.replace('@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}', '')
css += '\n#stage.abs{position:absolute;top:0;bottom:auto;height:100vh}\n'
css = css.replace("url(hero-fallback.png)", "url(%%BASE%%hero-fallback.png)")
for attr in ['src', 'poster']:
    body = re.sub(attr + r'="([\w.-]+\.(?:jpg|png|mp4|webp))"', lambda m: attr + '="%%BASE%%' + m.group(1) + '"', body)
markup = '<div class="uhp">' + body + '</div>'
cfg = "  var BASE = '', VBASE = '', VMODEL = 'device.glb', SHELL = document.body;"
assert cfg in js
js = js.replace(cfg, "  var VBASE = BASE.replace(/page\\/$/, ''), VMODEL = 'device-draco.glb', SHELL = root.querySelector('.uhp');")
js = js.replace('document.getElementById', 'root.getElementById').replace('document.querySelectorAll', 'root.querySelectorAll')
left = [l for l in js.split('\n') if 'document.' in l and 'document.createElement' not in l and 'document.head' not in l]
assert not left, left
page = open(R + 'page/uhp-page.js', encoding='utf-8').read()   # template = live EN bundle
head = page[:page.index('  var CSS = ')]
tail = page[page.index("  if (!document.getElementById('uhp-fonts'))"):]
a = tail.index('  function run(root) {\n') + len('  function run(root) {\n'); b = tail.index('\n  }\n  function mountAll()')
tail = tail[:a] + js + tail[b:]
out = head + '  var CSS = ' + json.dumps(css) + ';\n  var HTML = ' + json.dumps(markup) + ';\n' + tail
out = re.sub(r"\n  var CBASE = [^\n]*", "", out)
out = re.sub(r"var BASE = me \? [^;]*;", "var BASE = me ? 'https://cdn.jsdelivr.net/gh/nanoos/up400-3d@" + ASSET + "/page/' : '';", out)
out = re.sub(r"(var BASE = me \? [^;]*;)", r"\1\n  var CBASE = me ? me.replace(/[^\\/]*$/, '').replace(/page\\/$/, '') : '';", out, count=1)
out = out.replace('(v1.0)', '(v2 draft)')
# separate globals so v1 and v2 never clash
out = out.replace("[data-uhp-page]", "[data-uhp-page-v2]").replace("window.UHPPage", "window.UHPPageV2")
assert ASSET in out and 'data-uhp-page-v2' in out
open(R + 'page/uhp-page-v2.js', 'w', encoding='utf-8').write(out)

# ---------------------------------------------------------------- static SEO copy + JSON-LD
txt = seo.extract(SRC)
URL = 'https://ultrasonic-homogenizer.gosite.dev/en/uhp-400-v2'
d = seo.product_ld('en')
d['url'] = URL
d['description'] = ("Benchtop probe-type ultrasonic homogenizer (probe sonicator) for laboratories: fixed 24 kHz, generator output up to 400 W, "
                    "Ti-6Al-4V probes with 7 mm or 15 mm tips for 100–3,500 mL, built-in sound cabinet with window, pulse mode 5–95 % and a 0–80 °C "
                    "temperature limit with auto-stop. For cell lysis, nanoparticle dispersion, emulsification and plant extraction. Made in Vilnius, Lithuania.")
for p in d['additionalProperty']:
    if p['name'] == 'Output power': p['name'] = 'Generator output power'; p['value'] = 'Up to 400 W, adjustable'
    if p['name'] == 'Power supply': p['value'] = '220 V AC, 50–60 Hz'
d['image'] = [d['image'][0], 'https://cdn.jsdelivr.net/gh/nanoos/up400-3d@' + ASSET + '/page/box-head.webp', d['image'][1]]
strip = lambda a: re.sub(r'\s+', ' ', re.sub(r'<span class="todo">.*?</span>', '', a)).replace(' .', '.').strip()
faq_ld = seo.faq_ld([(q, html.unescape(strip(a))) for q, a in FAQ])
contact = '<h2>Contact</h2><p>Topsonics, Vilnius, Lithuania. Email info@topsonics.com, WhatsApp +370 663 02479.</p>'
content = ('<div data-uhp-page-v2 style="background:#f2f4f6;min-height:100vh">\n'
           '<article class="uhp-seo" lang="en" style="%s">\n%s\n%s\n</article>\n</div>\n%s\n%s'
           % (seo.STATIC_STYLE, txt, contact, seo.ld(d), seo.ld(faq_ld)))
open(R + 'src/seo/module-v2-content.html', 'w', encoding='utf-8').write(content)
print('bundle', len(out), 'content', len(content))
