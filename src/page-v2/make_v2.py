"""Build src/page-v2/index.html from src/page/index.html with the review changes (16 Oct 2026).
Green text / green boxes (.todo, .todo-box) = facts or photos Amir still has to supply."""
import re
SRC = '/home/claude/up400-3d/src/page/index.html'
OUT = '/home/claude/up400-3d/src/page-v2/index.html'
s = open(SRC, encoding='utf-8').read()

def rep(old, new, count=1):
    global s
    assert s.count(old) >= 1, old[:80]
    s = s.replace(old, new, count)

def T(t):  # inline green "to fill" text
    return '<span class="todo">' + t + '</span>'

def BOX(label, hint):  # green placeholder for a missing photo / chart
    return ('<div class="todo-box" role="note"><b>%s</b><span>%s</span></div>' % (label, hint))

# ---------------------------------------------------------------- CSS
CSS = r"""
/* v2: placeholders to fill (green) */
.todo{color:#0a7a2f;background:#e3f9e5;border-bottom:1px dashed #0a7a2f;padding:0 3px;font-weight:600}
.todo-box{border:2px dashed #12a243;background:#e9fbea;color:#0a6b2a;border-radius:4px;min-height:200px;display:grid;place-content:center;gap:8px;text-align:center;padding:20px;font-size:15px}
.todo-box b{font-size:17px}
/* v2: three reading levels */
.levels{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.levels a{font-size:14px;border:1px solid var(--line);border-radius:999px;padding:6px 14px;color:var(--ink);text-decoration:none;background:var(--paper)}
.levels a b{color:var(--blue);margin-right:6px}
.lvl{display:flex;align-items:center;gap:12px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--blue);font-weight:700;margin-bottom:18px}
.lvl::after{content:"";flex:1;height:1px;background:var(--line)}
/* v2: plain introduction */
.intro{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(24px,5vw,72px);align-items:start}
.intro .what{font-size:clamp(18px,1.6vw,21px);line-height:1.65;color:var(--ink);margin-top:14px}
.facts{margin:0;border-top:1px solid var(--line)}
.facts div{display:grid;grid-template-columns:150px minmax(0,1fr);gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:15.5px}
.facts dt{color:var(--mute)}.facts dd{margin:0;color:var(--ink)}
@media (max-width:760px){.intro{grid-template-columns:minmax(0,1fr)}.facts div{grid-template-columns:120px minmax(0,1fr)}}
/* v2: power note */
.pnote{margin-top:28px;border-left:4px solid var(--blue);background:var(--mist);padding:18px 20px;border-radius:0 3px 3px 0}
.pnote h3{font-size:19px;margin-bottom:8px}.pnote p{font-size:15.5px;color:var(--text);margin:0 0 8px}
.specs table caption{text-align:left;font-weight:700;color:var(--ink);padding:14px 0 6px;font-size:15px}
.specs table caption:first-child{padding-top:0}
/* v2: in the box */
.inbox{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:40px}
.inbox figure{margin:0;background:var(--mist);border-radius:3px;overflow:hidden;display:grid;grid-template-rows:auto 1fr}
.inbox img{width:100%;height:320px;object-fit:contain;background:#ece9e0;display:block}
.inbox figcaption{padding:14px 16px;font-size:15px;color:var(--text)}
.inbox figcaption b{display:block;color:var(--ink);margin-bottom:4px}
.inbox .wide{grid-column:span 2}
.inbox .todo-box{min-height:320px}
.boxlist{margin:28px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 40px;border-top:1px solid var(--line)}
.boxlist li{padding:10px 0;border-bottom:1px solid var(--line);font-size:15.5px}
.boxlist li b{color:var(--blue);margin-right:10px}
@media (max-width:760px){.inbox{grid-template-columns:minmax(0,1fr)}.inbox .wide{grid-column:auto}.inbox img{height:280px}.boxlist{grid-template-columns:minmax(0,1fr)}}
/* v2: evidence, safety, applications */
.egrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-top:40px}
.ecard{background:var(--paper);border:1px solid var(--line);border-radius:3px;padding:20px;display:grid;gap:12px;align-content:start}
.ecard h3{font-size:20px}.ecard p{font-size:15.5px;margin:0}
.ecard .todo-box{min-height:220px}
.sgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(24px,5vw,72px);margin-top:36px}
.sgrid h3{font-size:22px;margin-bottom:10px}
.sgrid ul{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}
.sgrid li{padding:11px 0;border-bottom:1px solid var(--line);font-size:15.5px}
.agrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-top:40px}
.acard{border:1px solid var(--line);border-radius:3px;padding:20px;display:grid;gap:10px;align-content:start;background:var(--paper)}
.acard h3{font-size:19px}.acard p{font-size:15px;margin:0;color:var(--text)}
.acard a{font-weight:600;color:var(--blue);text-decoration:none;font-size:15px}
@media (max-width:900px){.agrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.egrid,.sgrid,.agrid{grid-template-columns:minmax(0,1fr)}}
.pcard .helps b{color:var(--ink)}
.calc-more{margin-top:48px;border-top:1px solid var(--line)}
.calc-more>summary{cursor:pointer;list-style:none;padding:18px 0;font-weight:600;color:var(--blue);font-size:18px}
.calc-more>summary::-webkit-details-marker{display:none}
.calc-more .calc-box{margin-top:8px}
"""
rep('</style>', CSS + '</style>')

# ---------------------------------------------------------------- nav
rep('<a href="#problem">Problem</a><a href="#solution">How it works</a><a href="#film">Film</a><a href="#inside">Inside</a><a href="#specs">Specs</a><a href="#value">Value</a>',
    '<a href="#overview">Overview</a><a href="#solution">How it works</a><a href="#specs">Specs</a><a href="#box">In the box</a><a href="#evidence">Evidence</a><a href="#research">For researchers</a>')

# ---------------------------------------------------------------- hero stat (power wording)
rep('<div class="stat"><b>400<small>W</small></b><span>Max output power</span></div>',
    '<div class="stat"><b>400<small>W</small></b><span>Generator output, max.</span></div>')

# ---------------------------------------------------------------- LEVEL 1: plain intro, before benefits
INTRO = '''  <!-- LEVEL 1: OVERVIEW (plain, self-contained) -->
  <section class="paper" id="overview">
    <div class="sec wrap"><div class="inner">
      <p class="lvl">1 · Quick overview</p>
      <div class="intro">
        <div>
          <h2 style="font-size:clamp(30px,3.2vw,42px)">What is the UHP-400?</h2>
          <p class="what">The UHP-400 is a benchtop probe-type ultrasonic homogenizer (probe sonicator) for laboratories. It drives a titanium probe at a fixed 24 kHz with up to 400 W of electrical power from its generator, and treats liquid samples up to 3.5 L. The probe, a height-adjustable sample table, a temperature sensor and a touchscreen controller are built into one sound cabinet with a window. Labs use it for cell lysis, nanoparticle dispersion, emulsification and plant extraction. It is designed and made by Topsonics in Vilnius, Lithuania.</p>
          <nav class="levels" aria-label="Reading levels">
            <a href="#overview"><b>1</b>Quick overview</a>
            <a href="#specs"><b>2</b>Specifications and evidence</a>
            <a href="#research"><b>3</b>For researchers</a>
          </nav>
        </div>
        <dl class="facts" aria-label="Key facts">
          <div><dt>Type</dt><dd>Probe ultrasonic homogenizer, benchtop</dd></div>
          <div><dt>Frequency</dt><dd>24 kHz ± 1 kHz, fixed</dd></div>
          <div><dt>Generator output</dt><dd>Up to 400 W, adjustable %s</dd></div>
          <div><dt>Mains input</dt><dd>220 V, 50–60 Hz; %s</dd></div>
          <div><dt>Probes</dt><dd>Ti-6Al-4V titanium, 7 mm or 15 mm tip</dd></div>
          <div><dt>Sample volume</dt><dd>100–3,500 mL (15 mm probe); %s (7 mm probe)</dd></div>
          <div><dt>Heat control</dt><dd>Pulse 5–95 %%, sensor 0–80 °C with alarm and auto-stop</dd></div>
          <div><dt>Enclosure</dt><dd>Built-in sound cabinet with window; %s</dd></div>
          <div><dt>Made in</dt><dd>Vilnius, Lithuania (EU)</dd></div>
        </dl>
      </div>
    </div></div>
  </section>

''' % (T('[confirm: electrical power to the transducer]'), T('[measured draw at full power: ___ W]'),
       T('[___–___ mL]'), T('[noise: ___ dB(A) at 1 m, door closed]'))
rep('  <!-- BENEFITS -->', INTRO + '  <!-- BENEFITS -->')

# ---------------------------------------------------------------- benefits: claims we can back
rep('<li><div><b>The same result every run</b><span>Power, pulse, time and temperature limit are set as numbers, and every run is saved with its energy and time.</span></div></li>',
    '<li><div><b>The same settings every run</b><span>Power, pulse, time and temperature limit are set as numbers and can be saved and reloaded, and every run is recorded with its energy and time.</span></div></li>')
rep('<li><div><b>A quieter bench</b><span>The sample runs inside a closed cabinet with a window, so you can watch it without opening the door.</span></div></li>',
    '<li><div><b>A quieter bench</b><span>The sample runs inside a closed cabinet with a window, so you can watch it without opening the door. %s</span></div></li>'
    % T('[Measured at 1 m: ___ dB(A) door closed, ___ dB(A) door open, same power and probe]'))

# ---------------------------------------------------------------- remove problem cards here; they move to level 3
m = re.search(r'  <!-- PROBLEMS -->\n  <section class="sec wrap" id="problem".*?\n  </section>\n\n', s, re.S)
problem = m.group(0); s = s.replace(problem, '')
problem = problem.replace('<!-- PROBLEMS -->', '<!-- LEVEL 3: LITERATURE -->')
problem = problem.replace('id="problem" style="background:var(--mist);position:relative">\n    <div class="inner">',
                          'id="research" style="background:var(--mist);position:relative">\n    <div class="inner">\n      <p class="lvl">3 · For researchers</p>')
problem = problem.replace('<p class="eyebrow">The problem</p>\n        <h2>What makes sample preparation slow and unreliable</h2>\n        <p>Each point below comes from a peer-reviewed, open-access paper. Click through to read it.</p>',
    '<p class="eyebrow">What the literature says</p>\n        <h2>Six sample-preparation problems, and what each means at the bench</h2>\n        <p>Each card summarises a peer-reviewed, open-access paper and then says what it means in practice. These studies used their own equipment, not the UHP-400; they show why the settings matter, not how our instrument performed.</p>')
practice = {
 'UHP-400: probe sonication at up to 400 W.': 'Use a probe, not a bath, for agglomerated powders, and report the power and time you used.',
 'UHP-400: power, pulse and time set as exact numbers.': 'Write power, pulse, time, volume and probe size into your method. On the UHP-400 these are numbers you can save and reload.',
 'UHP-400: pulse mode and a temperature limit with auto-stop.': 'Use pulse mode and an ice bath for proteins and chromatin. The UHP-400 stops the run at the temperature limit you set.',
 'UHP-400: runs of up to 30 minutes per cycle.': 'Test short runs first; ultrasound can replace hours of maceration. One UHP-400 cycle runs up to 30 minutes.',
 'UHP-400: pulse mode from 5 to 95 % duty cycle.': 'Pulsed runs with a milder solvent are worth testing. The UHP-400 duty cycle goes from 5 to 95 %.',
 'UHP-400: energy recorded for every run.': 'Find the energy that works for your cells and repeat it. The UHP-400 records the energy of every run.',
}
for a, b in practice.items():
    assert a in problem, a
    problem = problem.replace(a, '<b>In practice:</b> ' + b)

# ---------------------------------------------------------------- specs table: grouped, power clarified
old_table = re.search(r'          <table>.*?</table>', s, re.S).group(0)
new_table = '''          <table>
            <caption>Ultrasonics</caption>
            <tr><th scope="row">Model</th><td>UHP-400</td></tr>
            <tr><th scope="row">Frequency</th><td>24 kHz ± 1 kHz, fixed</td></tr>
            <tr><th scope="row">Generator output power</th><td>Up to 400 W, adjustable %s</td></tr>
            <tr><th scope="row">Power into the liquid (calorimetric)</th><td>%s</td></tr>
            <tr><th scope="row">Amplitude at the tip</th><td>%s</td></tr>
            <tr><th scope="row">Probes</th><td>Ti-6Al-4V titanium, 7 mm or 15 mm tip</td></tr>
            <tr><th scope="row">Working volume</th><td>100–3,500 mL with the 15 mm probe; %s with the 7 mm probe</td></tr>
          </table>
          <table>
            <caption>Control and safety</caption>
            <tr><th scope="row">Pulse mode</th><td>Duty cycle 5–95 %% of a 15 s period</td></tr>
            <tr><th scope="row">Run time</th><td>Up to 30 min per cycle</td></tr>
            <tr><th scope="row">Temperature</th><td>Built-in sensor 0–80 °C, limit with alarm and auto-stop</td></tr>
            <tr><th scope="row">Control</th><td>5-inch capacitive touchscreen, saved settings, run records</td></tr>
            <tr><th scope="row">Data connection</th><td>%s</td></tr>
          </table>
          <table>
            <caption>Electrical and physical</caption>
            <tr><th scope="row">Mains supply</th><td>220 V AC, 50–60 Hz %s</td></tr>
            <tr><th scope="row">Mains power draw</th><td>%s</td></tr>
            <tr><th scope="row">Enclosure</th><td>Sound cabinet with window and colour LED chamber light</td></tr>
            <tr><th scope="row">Noise</th><td>%s</td></tr>
            <tr><th scope="row">Dimensions (W × D × H)</th><td>300 × %s × 670 mm</td></tr>
            <tr><th scope="row">Weight</th><td>%s</td></tr>
            <tr><th scope="row">Cabinet colours</th><td>White, green, blue</td></tr>
            <tr><th scope="row">Conformity</th><td>CE %s</td></tr>
          </table>''' % (
    T('[confirm: electrical power to the transducer, 0–100 %]'),
    T('[___ W, 15 mm probe in 500 mL water at 100 %; method below]'),
    T('[___ µm peak-to-peak, 7 mm / 15 mm]'),
    T('[___–___ mL]'),
    T('[confirm what the 9-pin (DB9) cable is for: PC link / data export?]'),
    T('[is 2 A the rated input current or the fuse rating?]'),
    T('[___ W at full output, measured with a plug-in power meter]'),
    T('[___ dB(A) at 1 m, door closed]'),
    T('[depth ___]'),
    T('[___ kg]'),
    T('[link to the declaration of conformity]'))
s = s.replace(old_table, new_table)

PNOTE = '''
          <div class="pnote" id="power">
            <h3>About the 400 W figure</h3>
            <p>400 W is the maximum electrical power the generator delivers to the transducer %s. It is not the power drawn from the wall socket, and it is not the acoustic power that reaches your sample.</p>
            <p>The mains draw is higher than the output because the generator and its cooling fan have losses. The power that goes into the liquid is lower again, and depends on the probe, the amplitude and the liquid. We state it separately, measured by calorimetry: the temperature rise of a known volume of water over a short run.</p>
            <p>%s</p>
          </div>''' % (T('[confirm]'), T('[Our measurement: ___ W into 500 mL water with the 15 mm probe at 100 %, ___ W with the 7 mm probe in ___ mL; mains draw ___ W]'))
rep('''          </table>
        </div>
      </div>''', '''          </table>''' + PNOTE + '''
        </div>
      </div>''')
rep('<p class="eyebrow">Specifications</p>', '<p class="lvl" style="margin-bottom:6px">2 · Specifications and evidence</p>\n          <p class="eyebrow">Specifications</p>')
rep('<p>Need a value that is not listed? Ask us and we will send it.</p>',
    '<p>Values in green are still being measured or confirmed. Need a value that is not listed? Ask us and we will send it.</p>')

# ---------------------------------------------------------------- new level-2 sections after specs/photos
LEVEL2 = '''  <!-- IN THE BOX (real photos) -->
  <section class="paper" id="box">
    <div class="sec wrap" style="padding-top:0"><div class="inner">
      <div class="sec-head">
        <p class="eyebrow">What you receive</p>
        <h2>In the box</h2>
        <p>Photographed from a real delivery. The instrument ships in a plywood crate with steel edges.</p>
      </div>
      <div class="inbox">
        <figure><img src="box-crate.webp" alt="UHP-400 plywood shipping crate with steel edges, rope handles and the Topsonics logo" width="900" height="1125" loading="lazy"><figcaption><b>Shipping crate</b>Plywood with steel edge protection and two rope handles. %s</figcaption></figure>
        <figure><img src="box-head.webp" alt="UHP-400 control head with touchscreen, acoustic stack and titanium probe" width="900" height="1125" loading="lazy"><figcaption><b>Control head with acoustic stack and probe</b>5-inch touchscreen, transducer housing and titanium probe, delivered as one unit.</figcaption></figure>
        %s
        <figure class="wide"><img src="box-cables.webp" alt="UHP-400 cables: mains cord, red cable, black cable with screw connectors, 9-pin cable and temperature probe" width="1400" height="744" loading="lazy"><figcaption><b>Cables and temperature sensor</b>From left: mains power cord; red cable %s; black cable with screw-lock connectors %s; 9-pin cable %s; stainless-steel temperature sensor.</figcaption></figure>
        %s
      </div>
      <ul class="boxlist" aria-label="Packing list">
        <li><b>01</b>Sound cabinet with door, window, LED chamber light and sample table %s</li>
        <li><b>02</b>Control head with 5-inch touchscreen</li>
        <li><b>03</b>Acoustic stack with titanium probe, 7 mm or 15 mm %s</li>
        <li><b>04</b>Temperature sensor, stainless steel</li>
        <li><b>05</b>Mains power cord</li>
        <li><b>06</b>Connection cables (3) %s</li>
        <li><b>07</b>%s</li>
        <li><b>08</b>%s</li>
      </ul>
    </div></div>
  </section>

  <!-- MEASURED PERFORMANCE -->
  <section class="sec wrap" id="evidence" style="background:var(--mist);position:relative">
    <div class="inner">
      <div class="sec-head">
        <p class="eyebrow">Measured on the UHP-400</p>
        <h2>Performance data</h2>
        <p>Measurements from our lab on a production unit. Each chart says how it was measured, so you can repeat it.</p>
      </div>
      <div class="egrid">
        <article class="ecard"><h3>Power delivered into water</h3>
          %s
          <p>Calorimetric method: 500 mL of water, 15 mm probe, 60 s runs at 25, 50, 75 and 100 %%. Power = mass × 4.18 J/g·K × temperature rise ÷ time.</p></article>
        <article class="ecard"><h3>Run-to-run repeatability</h3>
          %s
          <p>Five identical runs from one saved setting: energy delivered and final temperature for each run, with the spread between them.</p></article>
        <article class="ecard"><h3>Noise with the door closed</h3>
          %s
          <p>Sound level at 1 m in front of the cabinet: instrument off, running with the door open, running with the door closed. Same probe and power.</p></article>
        <article class="ecard"><h3>Result on a real sample</h3>
          %s
          <p>One application measured before and after treatment, for example particle size of a nanopowder dispersion or protein released from cells.</p></article>
      </div>
    </div>
  </section>

  <!-- SAFETY AND CALIBRATION -->
  <section class="paper" id="safety">
    <div class="sec wrap"><div class="inner">
      <div class="sec-head">
        <p class="eyebrow">Safety, calibration and support</p>
        <h2>Documents and checks</h2>
      </div>
      <div class="sgrid">
        <div><h3>Safety</h3><ul>
          <li>The probe runs inside a closed sound cabinet; you watch the sample through the window.</li>
          <li>Temperature limit with alarm and automatic stop.</li>
          <li>Main power switch and built-in cooling fan on the rear panel.</li>
          <li>CE marked. %s</li>
          <li>%s</li>
          <li>%s</li>
        </ul></div>
        <div><h3>Calibration and service</h3><ul>
          <li>%s</li>
          <li>%s</li>
          <li>%s</li>
          <li>%s</li>
          <li>Probes are wear parts: the tip erodes slowly with cavitation and is replaced when worn.</li>
          <li>Support directly from the engineers who designed the instrument.</li>
        </ul></div>
      </div>
    </div></div>
  </section>

  <!-- APPLICATIONS (internal links) -->
  <section class="paper" id="applications">
    <div class="sec wrap" style="padding-top:0"><div class="inner">
      <div class="sec-head">
        <p class="eyebrow">Applications</p>
        <h2>What labs use it for</h2>
        <p>Each application has its own page with a starting protocol, probe choice and the papers behind it.</p>
      </div>
      <div class="agrid">
        <article class="acard"><h3>Cell lysis</h3><p>Breaking bacteria, yeast and tissue cells to release proteins and DNA, with pulse mode and an ice bath to keep the sample cold.</p><a href="/en/uhp-400-cell-lysis">Cell lysis with the UHP-400 →</a>%s</article>
        <article class="acard"><h3>Nanoparticle dispersion</h3><p>Breaking up agglomerates of oxide, metal and carbon nanomaterials in liquid before measurement or testing.</p><a href="/en/uhp-400-nanoparticle-dispersion">Dispersion with the UHP-400 →</a>%s</article>
        <article class="acard"><h3>Emulsification</h3><p>Making fine oil-in-water and water-in-oil emulsions for food, cosmetic and pharmaceutical formulations.</p><a href="/en/uhp-400-emulsification">Emulsions with the UHP-400 →</a>%s</article>
        <article class="acard"><h3>Plant extraction</h3><p>Ultrasound-assisted extraction of phenolics, oils and other compounds, often faster and with less solvent than maceration.</p><a href="/en/uhp-400-extraction">Extraction with the UHP-400 →</a>%s</article>
      </div>
    </div></div>
  </section>

''' % (
    T('[crate size ___ × ___ × ___ cm, gross weight ___ kg]'),
    BOX('Photo to add', 'Sound cabinet with door open and sample table, as packed'),
    T('[what is it: transducer / HF cable?]'),
    T('[what does it connect?]'),
    T('[PC / data link?]'),
    BOX('Photo to add', 'Probes: the 7 mm and 15 mm tips side by side, with any tool or wrench supplied'),
    T('[photo above]'), T('[second probe optional]'), T('[confirm names]'),
    T('[user manual: printed / PDF?]'),
    T('[tool for changing the probe, test report or warranty card?]'),
    BOX('Chart to add', 'Measured power (W) vs. power setting (%), 15 mm probe, 500 mL water'),
    BOX('Chart to add', 'Energy (J) and end temperature for 5 runs from the same saved setting'),
    BOX('Data to add', 'Three readings in dB(A) at 1 m: off / door open / door closed (a phone sound-meter app is enough to start)'),
    BOX('Chart or photo to add', 'Before/after for one real sample, with sample, volume, probe, power and time'),
    T('[link to the CE declaration of conformity (PDF)]'),
    T('[standards applied, e.g. EN 61010-1 / EMC: confirm]'),
    T('[door interlock: does the probe stop when the door is opened? Only keep if true]'),
    T('[frequency check: how and when is it tested?]'),
    T('[power / temperature sensor calibration: what is checked before shipping? test report included?]'),
    T('[recommended service interval]'),
    T('[warranty: ___ months]'),
    T(' [page to create]'), T(' [page to create]'), T(' [page to create]'), T(' [page to create]'))

rep('  <!-- VALUE -->', LEVEL2 + '  <!-- VALUE -->')

# ---------------------------------------------------------------- value: shorter; calculator folded; old "In the box" box removed
calc = re.search(r'      <div class="calc-box">.*?\n      </div>\n    </div>\n  </section>', s, re.S).group(0)
inner_form = re.search(r'        <form class="calc".*?</form>', calc, re.S).group(0)
s = s.replace(calc, '''      <details class="calc-more">
        <summary>Work out the time and solvent you could save →</summary>
        <div class="calc-box" style="grid-template-columns:minmax(0,1fr)">
''' + inner_form + '''
        </div>
      </details>
    </div>
  </section>''')

# ---------------------------------------------------------------- level 3 block goes after value, before the viewer
rep('  <!-- VIEWER, RESEARCH, QUOTE -->', problem + '  <!-- VIEWER, RESEARCH, QUOTE -->')

# ---------------------------------------------------------------- FAQ: power + noise answers (seo_v2 rewrites the FAQ block from its list)
open(OUT, 'w', encoding='utf-8').write(s)
print('ok', len(s))
