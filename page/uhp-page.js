/* Topsonics UHP-400 product page (draft v3). Mounts into [data-uhp-page] inside a shadow root.
   Assets load from the same folder as this script. Needs THREE r128 + GLTFLoader + RoomEnvironment. */
(function () {
  var me = document.currentScript && document.currentScript.src;
  var BASE = me ? me.replace(/[^\/]*$/, '') : '';
  var CSS = "\n/* Layout: one fixed WebGL stage behind the page; transparent \"scene\" sections let it show through,\n   solid sections (photos, video, data) cover it. Text rides on the left, the device on the right. */\n:host{display:block;position:relative;\n  color-scheme:dark;\n  --night:#06080b;      /* page ground */\n  --deck:#0d1117;       /* solid sections */\n  --plate:#141a22;      /* cards, inputs */\n  --rule:rgba(214,226,240,.12);\n  --ink:#eef2f6;\n  --mute:#93a0ae;\n  --led:#5a7bff;        /* the chamber LED blue, used sparingly */\n  --warn:#f0b44c;\n  --display:\"Saira Semi Condensed\",\"Arial Narrow\",Arial,sans-serif;\n  --body:\"IBM Plex Sans\",\"Segoe UI\",Arial,sans-serif;\n  --mono:\"IBM Plex Mono\",ui-monospace,Consolas,monospace;\n  --gut:clamp(16px,5vw,72px);\n}\n*{box-sizing:border-box}\n.uhp{background:var(--night);color:var(--ink);font:400 16.5px/1.6 var(--body);overflow:hidden;position:relative;isolation:isolate;-webkit-text-size-adjust:100%}\na{color:inherit}\nimg,video{max-width:100%;display:block}\nh1,h2,h3{font-family:var(--display);font-weight:500;text-transform:uppercase;letter-spacing:.02em;line-height:1;margin:0;text-wrap:balance}\np{margin:0}\n.eyebrow{font:500 12px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}\n.wrap{padding-inline:var(--gut)}\n.btn{display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 26px;border:1px solid var(--ink);color:var(--ink);text-decoration:none;font:600 14px/1 var(--display);letter-spacing:.16em;text-transform:uppercase;background:transparent;cursor:pointer;transition:background .2s,color .2s}\n.btn:hover,.btn:focus-visible{background:var(--ink);color:var(--night);outline:none}\n.btn.solid{background:var(--ink);color:var(--night)}\n.btn.solid:hover{background:transparent;color:var(--ink)}\n:focus-visible{outline:2px solid var(--led);outline-offset:3px}\n\n/* nav */\n.nav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;align-items:center;gap:28px;padding:calc(env(safe-area-inset-top,0px) + 18px) var(--gut) 18px;background:linear-gradient(var(--night),rgba(6,8,11,0));transition:background .3s}\n.nav.solid{background:rgba(6,8,11,.92);backdrop-filter:blur(10px)}\n.brand{font:600 20px/1 var(--display);letter-spacing:.28em;text-decoration:none}\n.nav nav{display:flex;gap:24px;margin-left:auto}\n.nav nav a{font:500 13px/1 var(--display);letter-spacing:.16em;text-transform:uppercase;text-decoration:none;color:var(--mute)}\n.nav nav a:hover{color:var(--ink)}\n.nav .btn{height:38px;padding:0 18px;font-size:12px}\n@media (max-width:860px){.nav nav{display:none}.nav .btn{margin-left:auto}}\n\n/* WebGL stage */\n#stage{position:fixed;inset:0;z-index:0;width:100%;height:100%;pointer-events:none}\n#stage canvas{width:100%!important;height:100%!important;display:block}\nmain{position:relative;z-index:1}\n.solid-sec{background:var(--deck);position:relative}\n.night-sec{background:var(--night);position:relative}\n\n/* hero */\n.hero{min-height:100vh;min-height:100svh;display:grid;align-content:end;padding-block:120px 48px}\n.hero-fallback{position:absolute;inset:0;background:var(--night) url(%%BASE%%hero-fallback.png) 75% 50%/auto 80% no-repeat;opacity:.9;z-index:-1}\n.hero-fallback.gone{display:none}\n.hero h1{font-size:clamp(64px,11vw,168px);font-weight:500;letter-spacing:.01em}\n.hero .lede{max-width:30ch;font-size:clamp(19px,1.8vw,24px);line-height:1.35;margin-top:18px;color:var(--ink)}\n.hero .ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}\n.stats{max-width:720px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:56px;border-top:1px solid var(--rule)}\n.stat{padding:18px 18px 0 0}\n.stat b{display:block;white-space:nowrap;font:500 clamp(30px,3.6vw,48px)/1 var(--display);letter-spacing:.02em}\n.stat b small{font-size:.5em;letter-spacing:.06em;margin-left:4px;color:var(--mute)}\n.stat span{display:block;margin-top:8px;font:400 12px/1.3 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}\n.cue{display:flex;align-items:center;gap:10px;margin-top:40px;font:400 11px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}\n.cue i{width:1px;height:34px;background:linear-gradient(var(--ink),transparent);animation:cue 2s infinite}\n@keyframes cue{0%{transform:scaleY(.2);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}100%{transform:scaleY(1);opacity:0}}\n@media (max-width:700px){.stats{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:18px}.hero{padding-block:50vh 32px}}\n\n/* proof photo */\n.proof{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:center;gap:clamp(24px,5vw,80px);padding-block:clamp(72px,10vw,140px)}\n.proof figure{margin:0}\n.proof img{width:100%;aspect-ratio:1500/1900;object-fit:cover}\n.proof figcaption,.cap{margin-top:12px;font:400 12px/1.5 var(--mono);letter-spacing:.06em;color:var(--mute)}\n.proof h2{font-size:clamp(40px,5vw,72px)}\n.proof p{margin-top:20px;max-width:46ch;color:var(--mute)}\n.proof .ticks{margin-top:28px;display:grid;gap:12px}\n.ticks div{display:flex;gap:14px;align-items:baseline;border-top:1px solid var(--rule);padding-top:12px}\n.ticks b{font:500 13px/1 var(--mono);color:var(--ink);min-width:3.2em}\n.ticks span{color:var(--mute)}\n@media (max-width:820px){.proof{grid-template-columns:1fr}}\n\n/* problems */\n.problems{padding-block:clamp(72px,10vw,140px)}\n.problems h2{font-size:clamp(40px,5vw,72px);max-width:16ch;margin-top:16px}\n.problems .intro{max-width:56ch;color:var(--mute);margin-top:18px}\n.pgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:56px;border-top:1px solid var(--rule)}\n.pcard{padding:28px 28px 32px 0;border-bottom:1px solid var(--rule);display:grid;gap:10px;align-content:start}\n.pcard+.pcard{padding-left:0}\n.pgrid .pcard:not(:nth-child(3n+1)){padding-left:28px;border-left:1px solid var(--rule)}\n.pcard h3{font-size:26px;letter-spacing:.03em}\n.pcard p{color:var(--mute)}\n.pcard .src{font:400 11.5px/1.4 var(--mono);color:var(--mute);opacity:.8}\n.todo{color:var(--warn)}\n@media (max-width:900px){.pgrid{grid-template-columns:minmax(0,1fr)}.pgrid .pcard:not(:nth-child(3n+1)){padding-left:0;border-left:0}}\n\n/* scroll scenes */\n.scene{position:relative}\n.step{min-height:100vh;min-height:100svh;display:flex;align-items:center;padding-inline:var(--gut)}\n.step .card{max-width:430px;display:grid;gap:14px}\n.step h2{font-size:clamp(38px,4.4vw,64px)}\n.step h3{font-size:clamp(30px,3.2vw,44px)}\n.step p{color:#c9d2dc;font-size:18px}\n.step .solves{font:500 11.5px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--led)}\n.spec{display:grid;gap:0;margin-top:6px;border-top:1px solid var(--rule)}\n.spec div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid var(--rule);font-size:15px}\n.spec dt,.spec span:first-child{color:var(--mute)}\n.spec span:last-child{text-align:right;font-family:var(--mono);font-size:13.5px}\n.part-no{font:500 12px/1 var(--mono);letter-spacing:.18em;color:var(--mute)}\n@media (max-width:820px){\n  .step{align-items:flex-end;padding-bottom:7vh}\n  .step .card{background:rgba(6,8,11,.82);backdrop-filter:blur(8px);padding:20px;border:1px solid var(--rule);max-width:none}\n  .step p{font-size:16px}\n}\n/* label that tracks a 3D part */\n.tag{position:fixed;left:0;top:0;z-index:2;pointer-events:none;display:flex;align-items:center;gap:10px;opacity:0;transition:opacity .25s;font:500 12px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}\n.tag i{width:12px;height:12px;border-radius:50%;border:2px solid var(--ink);box-shadow:0 0 0 6px rgba(90,123,255,.25);flex:none}\n.tag em{font-style:normal;background:rgba(6,8,11,.75);padding:6px 9px;border:1px solid var(--rule)}\n.tag.on{opacity:1}\n\n/* video */\n.film{padding-block:clamp(72px,10vw,140px)}\n.film h2{font-size:clamp(40px,5vw,72px);max-width:18ch;margin-top:16px}\n.film .intro{max-width:56ch;color:var(--mute);margin-top:18px}\n.film-main{margin-top:48px;position:relative}\n.film-main video{width:100%;aspect-ratio:16/9;object-fit:cover;background:var(--plate)}\n.film-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:16px}\n.film-row figure{margin:0}\n.film-row video{width:100%;aspect-ratio:16/9;object-fit:cover;background:var(--plate)}\n.badge{position:absolute;left:16px;top:16px;font:500 11px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;background:rgba(6,8,11,.7);padding:8px 10px;border:1px solid var(--rule)}\n@media (max-width:820px){.film-row{grid-template-columns:minmax(0,1fr)}}\n\n/* specs table, gallery */\n.specs{padding-block:clamp(72px,10vw,140px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:clamp(24px,6vw,96px)}\n.specs h2{font-size:clamp(40px,5vw,72px);margin-top:16px}\n.specs .note{color:var(--mute);margin-top:18px;max-width:40ch}\ntable{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}\nth,td{text-align:left;padding:14px 0;border-bottom:1px solid var(--rule);vertical-align:top}\nth{font:500 12px/1.4 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mute);width:38%;padding-right:16px}\ntd{font-size:16px}\n@media (max-width:820px){.specs{grid-template-columns:minmax(0,1fr)}}\n.gallery{padding-block:0 clamp(72px,10vw,140px)}\n.gallery h2{font-size:clamp(34px,4vw,56px);margin-top:16px}\n.gallery .intro{color:var(--mute);margin-top:14px;max-width:60ch}\n.ggrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:36px}\n.ggrid figure{margin:0}\n.ggrid img{width:100%;aspect-ratio:1500/1900;object-fit:cover}\n.colours{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:56px}\n.colours figure{margin:0;background:#dfe4ea}\n.colours img{width:100%;aspect-ratio:1200/681;object-fit:cover}\n.colours figcaption{background:var(--deck);padding-top:10px;font:400 12px/1.4 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}\n@media (max-width:820px){.ggrid{grid-template-columns:repeat(2,minmax(0,1fr))}.colours{grid-template-columns:minmax(0,1fr)}}\n\n/* value */\n.value{padding-block:clamp(72px,10vw,140px)}\n.value h2{font-size:clamp(40px,5vw,72px);max-width:18ch;margin-top:16px}\n.vcols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(24px,5vw,72px);margin-top:48px}\n.vcols h3{font-size:28px;margin-bottom:14px}\n.vcols ul{margin:0;padding:0;list-style:none;display:grid;gap:0;border-top:1px solid var(--rule)}\n.vcols li{padding:12px 0;border-bottom:1px solid var(--rule);color:#c9d2dc}\n.calc-box{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(24px,5vw,72px);margin-top:72px;align-items:start}\n.calc{background:var(--plate);border:1px solid var(--rule);padding:clamp(20px,3vw,36px)}\n.calc h3{font-size:28px}\n.calc .sub{color:var(--mute);margin-top:6px;font-size:15px}\n.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:22px}\nlabel{display:grid;gap:6px;font:400 12px/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}\ninput,select,textarea{width:100%;height:46px;background:var(--night);border:1px solid var(--rule);color:var(--ink);padding:0 12px;font:500 16px/1 var(--mono)}\ntextarea{height:96px;padding:12px;font:400 15px/1.4 var(--body)}\ninput:focus,select:focus,textarea:focus{border-color:var(--led);outline:none}\n.result{margin-top:24px;padding-top:20px;border-top:1px solid var(--rule);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:12px}\n.result b{font:500 clamp(36px,4vw,54px)/1 var(--display);font-variant-numeric:tabular-nums}\n.result span{font:400 12px/1.4 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}\n.disclaimer{margin-top:18px;font-size:13px;line-height:1.5;color:var(--mute)}\n.box h3{font-size:28px}\n.box p{color:var(--mute);margin-top:8px}\n.box ul{margin:18px 0 0;padding:0;list-style:none;border-top:1px solid var(--rule)}\n.box li{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid var(--rule)}\n.box li b{font:500 12px/1.6 var(--mono);color:var(--led)}\n@media (max-width:860px){.vcols,.calc-box{grid-template-columns:minmax(0,1fr)}.fields{grid-template-columns:minmax(0,1fr)}}\n\n/* explore + research + quote */\n.explore{padding-block:clamp(56px,8vw,110px);display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}\n.explore h2{font-size:clamp(32px,4vw,52px)}\n.explore p{color:var(--mute);margin-top:10px;max-width:52ch}\n.research{padding-block:clamp(72px,10vw,120px);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(24px,5vw,72px)}\n.research h2{font-size:clamp(34px,4vw,52px);margin-top:16px}\n.research ol{margin:22px 0 0;padding:0;list-style:none;border-top:1px solid var(--rule)}\n.research li{padding:14px 0;border-bottom:1px solid var(--rule);color:#c9d2dc}\n.research li small{display:block;font:400 12px/1.5 var(--mono);color:var(--mute);margin-top:4px}\n@media (max-width:820px){.research{grid-template-columns:minmax(0,1fr)}}\n.quote{padding-block:clamp(72px,10vw,140px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:clamp(24px,6vw,96px)}\n.quote h2{font-size:clamp(44px,6vw,88px)}\n.quote .contact{margin-top:24px;display:grid;gap:8px;font:400 15px/1.5 var(--mono);color:var(--mute)}\n.quote .contact b{color:var(--ink);font-weight:500;user-select:all}\n.qform{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}\n.qform .full{grid-column:1/-1}\n.qmsg{grid-column:1/-1;font:400 14px/1.5 var(--body);color:var(--mute);min-height:1.5em}\n@media (max-width:820px){.quote,.qform{grid-template-columns:minmax(0,1fr)}}\nfooter{padding-block:28px 40px;display:flex;flex-wrap:wrap;gap:12px 32px;justify-content:space-between;font:400 12px/1.5 var(--mono);letter-spacing:.08em;color:var(--mute);border-top:1px solid var(--rule)}\n.loading{position:fixed;right:var(--gut);bottom:24px;z-index:3;font:400 11px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}\n/* embedded interactive viewer */\n.tryit{padding-block:clamp(56px,8vw,110px);border-bottom:1px solid var(--rule)}\n.try-head{display:flex;flex-wrap:wrap;gap:16px 48px;align-items:end;justify-content:space-between;margin-bottom:28px}\n.try-head h2{font-size:clamp(32px,4vw,52px);margin-top:14px}\n.try-head p{color:var(--mute);max-width:46ch}\n.viewer-slot{min-height:520px;position:relative}\n.viewer-wait{position:absolute;inset:0;display:grid;place-items:center;font:400 12px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--mute);border:1px dashed var(--rule)}\n/* phone: no scroll-driven 3D, a still image per step */\n.shot{display:none}\n.simple #stage,.simple .loading,.simple .tag,.simple .hero-fallback{display:none}\n.simple .shot{display:block;width:100%;height:auto;aspect-ratio:720/880;object-fit:cover;background:var(--night)}\n.simple .hero{min-height:0;padding-block:24px 48px}\n.simple .hero-shot{width:min(100%,420px);margin:0 auto 8px}\n.simple .scene .step{min-height:0;display:block;padding-block:28px}\n.simple .scene .step .card{background:none;border:0;padding:0;backdrop-filter:none;max-width:none}\n.simple .scene .step .shot{max-width:420px;margin:0 auto 18px}\n.simple .scene .step:first-child{padding-top:64px}\n@media (prefers-reduced-motion:reduce){.cue i{animation:none}}\n\n#stage.abs{position:absolute;top:0;bottom:auto;height:100vh}\n";
  var HTML = "<div class=\"uhp\"><div id=\"stage\" aria-hidden=\"true\"></div>\n<div class=\"loading\" id=\"loading\">Loading 3D model\u2026</div>\n\n<main id=\"top\">\n  <!-- 1 \u00b7 HERO (3D, no controls) -->\n  <section class=\"scene hero wrap\" data-scene=\"hero\" aria-label=\"UHP-400\">\n    <div class=\"hero-fallback\" id=\"heroFallback\"></div>\n    <img class=\"shot hero-shot\" data-shot=\"hero-0\" alt=\"The UHP-400 ultrasonic homogenizer\" width=\"720\" height=\"880\">\n    <div>\n      <p class=\"eyebrow\">Ultrasonic homogenizer \u00b7 Topsonics</p>\n      <h1>UHP-400</h1>\n      <p class=\"lede\">Dispersion, extraction and cell disruption in one enclosed system.</p>\n      <div class=\"ctas\"><a class=\"btn solid\" href=\"#quote\">Request a quote</a><a class=\"btn\" href=\"#film\">Watch it run</a></div>\n      <div class=\"stats\">\n        <div class=\"stat\"><b>400<small>W</small></b><span>Max output power</span></div>\n        <div class=\"stat\"><b>20<small>kHz</small></b><span>Fixed frequency</span></div>\n        <div class=\"stat\"><b>7 / 15<small>mm</small></b><span>Titanium probes</span></div>\n        <div class=\"stat\"><b>0\u201380<small>\u00b0C</small></b><span>Sensor with auto-stop</span></div>\n      </div>\n      <div class=\"cue\"><i></i>Scroll</div>\n    </div>\n  </section>\n\n  <!-- 2 \u00b7 REAL PHOTO -->\n  <section class=\"night-sec\">\n    <div class=\"proof wrap\">\n      <figure>\n        <img src=\"%%BASE%%photo-warm.jpg\" alt=\"The UHP-400 with its door closed, a 1000 mL beaker on the sample table and the touchscreen showing the light colour settings\" loading=\"lazy\" width=\"1500\" height=\"1900\">\n        <figcaption>Photograph of a production UHP-400. Background cleaned, device unretouched.</figcaption>\n      </figure>\n      <div>\n        <p class=\"eyebrow\">The real instrument</p>\n        <h2 style=\"margin-top:16px\">What you see in 3D is what we ship</h2>\n        <p>The model on this page is built from the same CAD files we use to make the instrument. Here is the device itself, with a sample on the table and the touchscreen in the light settings menu.</p>\n        <div class=\"ticks\">\n          <div><b>2003</b><span>Building power ultrasonic systems since 2003</span></div>\n          <div><b>EU</b><span>Designed and made in Vilnius, Lithuania</span></div>\n          <div><b>1:1</b><span>You talk to the engineers who designed it</span></div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- 3 \u00b7 PROBLEMS -->\n  <section class=\"solid-sec\" id=\"problem\">\n    <div class=\"problems wrap\">\n      <p class=\"eyebrow\">The problem</p>\n      <h2>What slows down sample preparation in your lab?</h2>\n      <p class=\"intro\">These are the problems researchers report most often when they prepare dispersions, extracts and lysates.</p>\n      <div class=\"pgrid\">\n        <article class=\"pcard\"><h3>Nanoparticles clump together</h3><p>Agglomerates do not break up by stirring, so suspensions settle and results drift.</p><p class=\"src todo\">Source: [peer-reviewed reference to add]</p></article>\n        <article class=\"pcard\"><h3>Results are hard to reproduce</h3><p>The same protocol gives different results between runs, operators and instruments.</p><p class=\"src\">Source: Nanoscale, 2022</p></article>\n        <article class=\"pcard\"><h3>Samples overheat</h3><p>Heat from continuous sonication damages proteins and DNA before the work is done.</p><p class=\"src todo\">Source: [peer-reviewed reference to add]</p></article>\n        <article class=\"pcard\"><h3>Extraction takes hours</h3><p>Maceration and Soxhlet extraction tie up equipment and people for a long time.</p><p class=\"src\">Source: review, PMC8048006</p></article>\n        <article class=\"pcard\"><h3>Solvents cost money</h3><p>Large solvent volumes raise cost, waste and safety work.</p><p class=\"src\">Source: Food Research International review</p></article>\n        <article class=\"pcard\"><h3>Cell lysis is incomplete</h3><p>Part of the sample stays intact, so yield is lost and runs are repeated.</p><p class=\"src todo\">Source: [peer-reviewed reference to add]</p></article>\n      </div>\n    </div>\n  </section>\n\n  <!-- 4 \u00b7 SOLUTION (3D scroll) -->\n  <section class=\"scene\" data-scene=\"solution\" id=\"solution\" aria-label=\"How the UHP-400 works\">\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-0\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"eyebrow\">How it works</p>\n      <h2>One enclosed system</h2>\n      <p>Generator, acoustic stack, sound cabinet, sample table and temperature control in one instrument. Plug it in and start working.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-1\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Solves: noise and set-up time</p>\n      <h3>Open, load, close</h3>\n      <p>The sample sits inside the sound cabinet. You watch it through the window while the door stays closed.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-2\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Solves: probe position errors</p>\n      <h3>The table brings the sample to the probe</h3>\n      <p>Raise the table on its guide rods until the probe tip is at the right depth, then lock it. The same height every run.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-3\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Solves: clumping \u00b7 incomplete lysis</p>\n      <h3>7 mm or 15 mm titanium probe</h3>\n      <p>Ti-6Al-4V probes vibrate 20,000 times per second. Collapsing cavitation bubbles break particles, droplets and cell walls apart. Choose the probe size to match your volume.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-4\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Solves: overheating</p>\n      <h3>Pulse mode and a temperature limit</h3>\n      <p>Set the duty cycle from 5 to 95 % of a 15-second period. The built-in sensor reads 0\u201380 \u00b0C and stops the run with an alarm at your limit.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-5\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Solves: poor reproducibility</p>\n      <h3>Same settings, every run</h3>\n      <p>Power, duty cycle, time and temperature limit are set on a 5-inch touchscreen. Each run keeps a record: sample code, volume, energy, power and time.</p>\n    </div></div>\n  </section>\n\n  <!-- 5 \u00b7 FILM -->\n  <section class=\"night-sec\" id=\"film\">\n    <div class=\"film wrap\">\n      <p class=\"eyebrow\">Filmed, not animated</p>\n      <h2>Cavitation at the probe tip</h2>\n      <p class=\"intro\">Short clips from our lab. The white jet below the tip is the cavitation zone, where the bubbles form and collapse.</p>\n      <div class=\"film-main\">\n        <video src=\"%%BASE%%clip-onset.mp4\" poster=\"%%BASE%%clip-onset.jpg\" muted loop playsinline preload=\"metadata\" data-auto aria-label=\"Probe tip in water as the power is switched on and a cavitation jet forms\"></video>\n        <span class=\"badge\">Real footage \u00b7 UHP-400</span>\n      </div>\n      <p class=\"cap\">Power on: the cavitation jet forms within a second.</p>\n      <div class=\"film-row\">\n        <figure><video src=\"%%BASE%%clip-macro.mp4\" poster=\"%%BASE%%clip-macro.jpg\" muted loop playsinline preload=\"none\" data-auto aria-label=\"Close view of the probe tip running\"></video><figcaption class=\"cap\">Close view of the tip at work.</figcaption></figure>\n        <figure><video src=\"%%BASE%%clip-wide.mp4\" poster=\"%%BASE%%clip-wide.jpg\" muted loop playsinline preload=\"none\" data-auto aria-label=\"Beaker on the sample table with the probe running\"></video><figcaption class=\"cap\">Beaker on the table, silicone ring holding it in place.</figcaption></figure>\n        <figure><video src=\"%%BASE%%clip-stream.mp4\" poster=\"%%BASE%%clip-stream.jpg\" muted loop playsinline preload=\"none\" data-auto aria-label=\"Steady cavitation stream below the probe\"></video><figcaption class=\"cap\">Steady stream during a run.</figcaption></figure>\n      </div>\n    </div>\n  </section>\n\n  <!-- 6 \u00b7 INSIDE: exploded 3D scroll -->\n  <section class=\"scene\" data-scene=\"explode\" id=\"inside\" aria-label=\"Main parts of the UHP-400\">\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-0\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"eyebrow\">Inside the UHP-400</p>\n      <h2>Six main parts</h2>\n      <p>Keep scrolling. The instrument opens up, and each part shows what it does.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-1\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 1 / 6</p><h3>Control head</h3>\n      <dl class=\"spec\"><div><span>Display</span><span>5-inch capacitive touch</span></div><div><span>Power</span><span>0\u2013400 W</span></div><div><span>Pulse</span><span>5\u201395 % of 15 s</span></div><div><span>Run time</span><span>up to 30 min</span></div><div><span>Records</span><span>every run saved</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-2\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 2 / 6</p><h3>Acoustic stack and probe</h3>\n      <dl class=\"spec\"><div><span>Frequency</span><span>20 kHz \u00b1 1 kHz, fixed</span></div><div><span>Probe</span><span>Ti-6Al-4V</span></div><div><span>Tip</span><span>7 mm or 15 mm</span></div><div><span>Volume, 15 mm</span><span>100\u20133,500 mL</span></div><div><span>Volume, 7 mm</span><span class=\"todo\">[confirm]</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-3\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 3 / 6</p><h3>Door with window</h3>\n      <p>Closes the sound cabinet during the run. The window lets you watch the sample without opening it.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-4\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 4 / 6</p><h3>Sample table</h3>\n      <dl class=\"spec\"><div><span>Height</span><span>adjustable, lockable</span></div><div><span>Guides</span><span>two steel rods</span></div><div><span>Grip</span><span>silicone ring</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-5\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 5 / 6</p><h3>Sound cabinet</h3>\n      <dl class=\"spec\"><div><span>Size</span><span>300 W \u00d7 670 H mm</span></div><div><span>Chamber light</span><span>colour per run state</span></div><div><span>Temperature</span><span>sensor 0\u201380 \u00b0C</span></div><div><span>Colours</span><span>white, green, blue</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-6\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 6 / 6</p><h3>Rear panel</h3>\n      <dl class=\"spec\"><div><span>Supply</span><span>220 V, 50\u201360 Hz, 2 A</span></div><div><span>Switch</span><span>main power switch</span></div><div><span>Cooling</span><span>built-in fan</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-7\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"eyebrow\">Assembled</p>\n      <h2>Made in Lithuania</h2>\n      <p>Every UHP-400 is assembled and tested in Vilnius before it ships.</p>\n      <div><a class=\"btn\" href=\"#specs\">All specifications</a></div>\n    </div></div>\n  </section>\n\n  <!-- 7 \u00b7 SPECS + REAL PHOTOS -->\n  <section class=\"solid-sec\">\n    <div class=\"specs wrap\" id=\"specs\">\n      <div>\n        <p class=\"eyebrow\">Specifications</p>\n        <h2>UHP-400 at a glance</h2>\n        <p class=\"note\">Need a value that is not listed? Ask us and we will send it. <span class=\"todo\">[Factsheet PDF to add]</span></p>\n      </div>\n      <div style=\"overflow-x:auto\">\n        <table>\n          <tr><th>Model</th><td>UHP-400</td></tr>\n          <tr><th>Frequency</th><td>20 kHz \u00b1 1 kHz, fixed</td></tr>\n          <tr><th>Output power</th><td>0\u2013400 W, adjustable</td></tr>\n          <tr><th>Pulse mode</th><td>Duty cycle 5\u201395 % of a 15 s period</td></tr>\n          <tr><th>Run time</th><td>Up to 30 min per cycle</td></tr>\n          <tr><th>Temperature</th><td>Built-in sensor 0\u201380 \u00b0C, limit with alarm and auto-stop</td></tr>\n          <tr><th>Control</th><td>5-inch capacitive touchscreen, run records</td></tr>\n          <tr><th>Probes</th><td>Ti-6Al-4V, 7 mm or 15 mm tip</td></tr>\n          <tr><th>Working volume</th><td>100\u20133,500 mL (15 mm) \u00b7 <span class=\"todo\">[7 mm range to confirm]</span></td></tr>\n          <tr><th>Enclosure</th><td>Sound cabinet with window and colour LED chamber light</td></tr>\n          <tr><th>Power supply</th><td>220 V, 50\u201360 Hz, 2 A</td></tr>\n          <tr><th>Dimensions</th><td>300 mm wide \u00d7 670 mm high \u00b7 depth <span class=\"todo\">[confirm]</span></td></tr>\n          <tr><th>Cabinet colours</th><td>White, green, blue</td></tr>\n        </table>\n      </div>\n    </div>\n    <div class=\"gallery wrap\">\n      <p class=\"eyebrow\">Real photographs</p>\n      <h2>The chamber light tells you the run state</h2>\n      <p class=\"intro\">On the touchscreen you pick one colour for each state: ready, process, pause, finish and error. You can read the state from across the room.</p>\n      <div class=\"ggrid\">\n        <figure><img src=\"%%BASE%%photo-blue.jpg\" alt=\"UHP-400 with blue chamber light\" loading=\"lazy\" width=\"1500\" height=\"1900\"><figcaption class=\"cap\">Blue</figcaption></figure>\n        <figure><img src=\"%%BASE%%photo-green.jpg\" alt=\"UHP-400 with green chamber light\" loading=\"lazy\" width=\"1500\" height=\"1900\"><figcaption class=\"cap\">Green</figcaption></figure>\n        <figure><img src=\"%%BASE%%photo-red.jpg\" alt=\"UHP-400 with red chamber light\" loading=\"lazy\" width=\"1500\" height=\"1900\"><figcaption class=\"cap\">Red</figcaption></figure>\n        <figure><img src=\"%%BASE%%photo-warm.jpg\" alt=\"UHP-400 with warm white chamber light\" loading=\"lazy\" width=\"1500\" height=\"1900\"><figcaption class=\"cap\">Warm white</figcaption></figure>\n      </div>\n      <div class=\"colours\">\n        <figure><img src=\"%%BASE%%render-white.jpg\" alt=\"UHP-400 cabinet in white, rendered\" loading=\"lazy\"><figcaption>Cabinet \u00b7 White (render)</figcaption></figure>\n        <figure><img src=\"%%BASE%%render-green.jpg\" alt=\"UHP-400 cabinet in green, rendered\" loading=\"lazy\"><figcaption>Cabinet \u00b7 Green (render)</figcaption></figure>\n        <figure><img src=\"%%BASE%%render-blue.jpg\" alt=\"UHP-400 cabinet in blue, rendered\" loading=\"lazy\"><figcaption>Cabinet \u00b7 Blue (render)</figcaption></figure>\n      </div>\n    </div>\n  </section>\n\n  <!-- 8 \u00b7 VALUE -->\n  <section class=\"night-sec\" id=\"value\">\n    <div class=\"value wrap\">\n      <p class=\"eyebrow\">The value</p>\n      <h2>What the UHP-400 is worth to your lab</h2>\n      <div class=\"vcols\">\n        <div><h3>University and research labs</h3><ul>\n          <li>A method you can describe exactly in the methods section</li>\n          <li>Repeatable runs from saved settings and run records</li>\n          <li>One instrument for dispersion, emulsions, extraction and lysis</li>\n          <li>Room for new experiments that need controlled cavitation</li>\n        </ul></div>\n        <div><h3>R&amp;D and QC labs in industry</h3><ul>\n          <li>Shorter preparation time per batch</li>\n          <li>Less solvent where ultrasound-assisted methods apply</li>\n          <li>No separate sound box, stand or thermometer to buy</li>\n          <li>Settings that transfer between operators and shifts</li>\n        </ul></div>\n      </div>\n      <div class=\"calc-box\">\n        <form class=\"calc\" id=\"calc\" onsubmit=\"return false\">\n          <h3>Estimate your savings</h3>\n          <p class=\"sub\">Enter your own numbers. The example values are only a starting point.</p>\n          <div class=\"fields\">\n            <label for=\"c-batches\">Batches per month<input id=\"c-batches\" type=\"number\" min=\"0\" step=\"1\" value=\"40\" inputmode=\"decimal\"></label>\n            <label for=\"c-hours\">Hours saved per batch<input id=\"c-hours\" type=\"number\" min=\"0\" step=\"0.25\" value=\"1.5\" inputmode=\"decimal\"></label>\n            <label for=\"c-rate\">Staff cost per hour (\u20ac)<input id=\"c-rate\" type=\"number\" min=\"0\" step=\"1\" value=\"20\" inputmode=\"decimal\"></label>\n            <label for=\"c-solvent\">Solvent saved per batch (\u20ac)<input id=\"c-solvent\" type=\"number\" min=\"0\" step=\"1\" value=\"8\" inputmode=\"decimal\"></label>\n          </div>\n          <div class=\"result\"><span>Estimated saving</span><b id=\"c-out\">\u20ac1,520 / month</b></div>\n          <p class=\"disclaimer\">This calculator gives an illustrative estimate based only on the values you enter. It is not a quotation, a performance guarantee or financial advice. Actual savings depend on your samples, methods, local prices and how the instrument is used. Results reported in scientific papers apply to the conditions of those studies. Topsonics makes no warranty, express or implied, that you will achieve the results shown.</p>\n        </form>\n        <div class=\"box\">\n          <h3>In the box</h3>\n          <p>Everything you need to run your first sample. <span class=\"todo\">[confirm list]</span></p>\n          <ul>\n            <li><b>01</b>Control head with 5-inch touchscreen</li>\n            <li><b>02</b>Sound cabinet with door, window and LED chamber light</li>\n            <li><b>03</b>Height-adjustable sample table</li>\n            <li><b>04</b>Acoustic stack with a 7 mm or 15 mm titanium probe</li>\n            <li><b>05</b>Temperature sensor</li>\n            <li><b>06</b>Power cable and user manual</li>\n          </ul>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- 9 \u00b7 EXPLORE, RESEARCH, QUOTE -->\n  <section class=\"solid-sec\">\n    <div class=\"tryit wrap\" id=\"try\">\n      <div class=\"try-head\"><div><p class=\"eyebrow\">Try it yourself</p><h2>Run the UHP-400 in 3D</h2></div>\n      <p>Open the door, raise the table, swap the probe and press start. On a phone, use the buttons under the model.</p></div>\n      <div class=\"viewer-slot\" id=\"viewerSlot\"><p class=\"viewer-wait\" id=\"viewerWait\">The 3D viewer loads when you reach it.</p></div>\n    </div>\n    <div class=\"research wrap\">\n      <div><p class=\"eyebrow\">Research</p><h2>Further reading</h2>\n        <ol>\n          <li>Reproducibility of probe sonication<small>Nanoscale, 2022 \u00b7 <span class=\"todo\">[full citation and DOI]</span></small></li>\n          <li>Ultrasound-assisted extraction, a review<small>PMC8048006 \u00b7 <span class=\"todo\">[full citation and DOI]</span></small></li>\n          <li>Green extraction with ultrasound<small>Food Research International, 2022 \u00b7 <span class=\"todo\">[full citation and DOI]</span></small></li>\n        </ol></div>\n      <div><p class=\"eyebrow\">Published with the UHP-400</p><h2>Research from our users</h2>\n        <ol><li class=\"todo\">[Papers from labs that used the UHP-400, from your list]</li></ol>\n        <p class=\"cap\" style=\"margin-top:16px\">Published work with the UHP-400? Send us the DOI and we will list it here.</p></div>\n    </div>\n    <div class=\"quote wrap\" id=\"quote\">\n      <div>\n        <p class=\"eyebrow\">Request a quote</p>\n        <h2 style=\"margin-top:16px\">Tell us about your sample</h2>\n        <p style=\"color:var(--mute);margin-top:18px;max-width:40ch\">We reply with a recommended probe, price and delivery time.</p>\n        <div class=\"contact\"><span>Email <b>info@topsonics.com</b></span><span>WhatsApp <b class=\"todo\">[number]</b></span></div>\n      </div>\n      <form class=\"qform\" id=\"qform\">\n        <label for=\"q-sample\">Sample type<input id=\"q-sample\" placeholder=\"e.g. TiO\u2082 in water\"></label>\n        <label for=\"q-vol\">Batch volume (mL)<input id=\"q-vol\" type=\"number\" min=\"0\" inputmode=\"decimal\" placeholder=\"e.g. 250\"></label>\n        <label for=\"q-app\">Application<select id=\"q-app\"><option>Dispersion</option><option>Emulsion</option><option>Extraction</option><option>Cell lysis</option><option>Other</option></select></label>\n        <label for=\"q-country\">Country<input id=\"q-country\"></label>\n        <label for=\"q-org\" class=\"full\">University or company<input id=\"q-org\"></label>\n        <label for=\"q-email\" class=\"full\">Email<input id=\"q-email\" type=\"email\" required></label>\n        <div class=\"full\"><button class=\"btn solid\" type=\"submit\">Request a quote</button></div>\n        <p class=\"qmsg\" id=\"qmsg\" role=\"status\"></p>\n      </form>\n    </div>\n    <footer class=\"wrap\"><span>\u00a9 2026 Topsonics \u00b7 Vilnius, Lithuania</span><span>Designed and made in Lithuania, EU</span><span>Draft v2 \u00b7 items in amber still need your input</span></footer>\n  </section>\n</main>\n\n<div class=\"tag\" id=\"tag\"><i></i><em id=\"tagText\"></em></div>\n\n</div>";
  if (!document.getElementById('uhp-fonts')) {
    var l = document.createElement('link'); l.id = 'uhp-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Saira+Semi+Condensed:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(l);
  }
  function mount(host) {
    if (host.__uhp) return; host.__uhp = true;
    /* full-bleed: break out of the page column */
    function bleed() { host.style.marginLeft = '0px'; host.style.marginRight = '0px'; host.style.maxWidth = 'none';
      var cw = document.documentElement.clientWidth, l = host.getBoundingClientRect().left;
      host.style.width = cw + 'px'; host.style.marginLeft = (-l) + 'px'; }
    bleed(); addEventListener('resize', bleed);
    var root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>' + CSS.split('%%BASE%%').join(BASE) + '</style>' + HTML.split('%%BASE%%').join(BASE);
    /* in-page links (#quote, #specs ...) */
    root.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
      var t = root.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    /* a transformed ancestor breaks position:fixed; fall back to following the viewport by hand */
    var stageEl = root.getElementById('stage'), broken = false;
    for (var p = host.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      var cs = getComputedStyle(p); if (cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none' || /transform|filter/.test(cs.willChange)) { broken = true; break; }
    }
    if (broken) {
      stageEl.classList.add('abs');
      var follow = function () { var r = host.getBoundingClientRect(); var y = Math.min(Math.max(0, -r.top), Math.max(0, r.height - innerHeight)); stageEl.style.transform = 'translateY(' + y + 'px)'; requestAnimationFrame(follow); };
      follow();
    }
    run(root);
  }
  function run(root) {

(function () {
  /* ---------- small page helpers ---------- */

  var eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  function calc() {
    var v = function (id) { var n = parseFloat(root.getElementById(id).value); return isFinite(n) && n > 0 ? n : 0; };
    var m = v('c-batches') * (v('c-hours') * v('c-rate') + v('c-solvent'));
    root.getElementById('c-out').textContent = eur.format(m) + ' / month';
  }
  root.getElementById('calc').addEventListener('input', calc); calc();

  root.getElementById('qform').addEventListener('submit', function (e) {
    e.preventDefault();
    root.getElementById('qmsg').textContent = 'Draft page: this form is not connected yet. On the live site it will send your request to info@topsonics.com.';
  });

  var vids = [].slice.call(root.querySelectorAll('video[data-auto]'));
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.preload = 'auto'; var p = e.target.play(); if (p && p.catch) p.catch(function () {}); } else e.target.pause(); });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- where files live (the GoSite build rewrites this line) ---------- */
  var VBASE = BASE.replace(/page\/$/, ''), VMODEL = 'device.glb', SHELL = root.querySelector('.uhp');

  /* ---------- full interactive viewer, loaded when the visitor gets near it ---------- */
  var slot = root.getElementById('viewerSlot'), viewerStarted = false;
  function loadScript(src, cb) { var sc = document.createElement('script'); sc.src = src; sc.onload = cb; sc.onerror = function () { var w = root.getElementById('viewerWait'); if (w) w.textContent = '3D viewer could not load'; }; document.head.appendChild(sc); }
  function startViewer() {
    if (viewerStarted || !window.THREE) return; viewerStarted = true;
    var go = function () {
      var el = document.createElement('div'); el.setAttribute('data-base', VBASE); el.setAttribute('data-model', VMODEL);
      slot.innerHTML = ''; slot.appendChild(el); window.UP400Viewer.mount(el);
    };
    var withViewer = function () { if (window.UP400Viewer && window.UP400Viewer.mount) go(); else loadScript(VBASE + 'up400-viewer.js', go); };
    if (THREE.OrbitControls) withViewer(); else loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js', withViewer);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting) startViewer(); }, { rootMargin: '600px' }).observe(slot);
  else startViewer();

  /* ---------- phones: still images instead of the scroll-driven 3D ---------- */
  var SIMPLE = matchMedia('(max-width: 819px)').matches && !window.__uhpRenderMode;
  if (SIMPLE) {
    SHELL.classList.add('simple');
    [].forEach.call(root.querySelectorAll('img[data-shot]'), function (im) { im.loading = 'lazy'; im.src = BASE + 'm-' + im.getAttribute('data-shot') + '.jpg'; });
    return;
  }

  /* ---------- 3D stage ---------- */
  var loadingEl = root.getElementById('loading');
  if (!window.THREE || !THREE.GLTFLoader) { loadingEl.textContent = '3D unavailable, showing photos'; return; }
  var MM = 0.001, D2R = Math.PI / 180;
  var host = root.getElementById('stage');
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (err) { loadingEl.textContent = '3D unavailable, showing photos'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
  var camera = new THREE.PerspectiveCamera(22, 1, 0.05, 30);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x223044, 0.35));
  var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(-1.2, 2, 1.6); scene.add(key);
  var rim = new THREE.DirectionalLight(0x9db4ff, 0.9); rim.position.set(1.6, 1.2, -1.8); scene.add(rim);
  var ledA = new THREE.PointLight(0x2e58ff, 0, 0.6, 1.6); ledA.position.set(0, 0.19, 0.06); scene.add(ledA);
  var ledB = new THREE.PointLight(0x3466ff, 0, 0.5, 1.6); ledB.position.set(0, -0.08, 0.05); scene.add(ledB);

  function resize() {
    var w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true;
  }
  addEventListener('resize', resize);

  /* screen textures */
  var tl = new THREE.TextureLoader(), SCR = {};
  ['start', 'running', 'duty', 'temp'].forEach(function (k) {
    var t = tl.load(BASE + k + '.jpg', function () { dirty = true; }); t.encoding = THREE.sRGBEncoding; t.flipY = false; t.anisotropy = 8; SCR[k] = t;
  });
  var screenMat = new THREE.MeshBasicMaterial({ map: SCR.start, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -24 });

  /* door glass + logo, beaker (same dimensions as the product viewer) */
  function rrect(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  var frostMat = new THREE.MeshStandardMaterial({ color: 0xe9e5df, roughness: 0.28, metalness: 0 });
  function doorGlass() {
    var g = new THREE.Group();
    var outer = rrect(287.5 * MM, 487.5 * MM, 23 * MM); outer.holes.push(rrect(194 * MM, 394 * MM, 17 * MM));
    var frost = new THREE.Mesh(new THREE.ExtrudeGeometry(outer, { depth: 4 * MM, bevelEnabled: false, curveSegments: 10 }), frostMat);
    frost.position.z = 153.5 * MM; g.add(frost);
    var clear = new THREE.Mesh(new THREE.ShapeGeometry(rrect(194 * MM, 394 * MM, 17 * MM), 10),
      new THREE.MeshPhysicalMaterial({ color: 0xe8f0ff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.06, depthWrite: false }));
    clear.position.z = 157.4 * MM; clear.renderOrder = 3; g.add(clear);
    var lt = tl.load(BASE + 'logo.png', function () { dirty = true; }); lt.encoding = THREE.sRGBEncoding; lt.anisotropy = 8;
    var logo = new THREE.Mesh(new THREE.PlaneGeometry(42 * MM, 53.5 * MM), new THREE.MeshStandardMaterial({ map: lt, transparent: true, roughness: 0.35, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -8 }));
    logo.position.set(120.5 * MM, 200 * MM, 157.6 * MM); logo.renderOrder = 4; g.add(logo);
    return g;
  }
  var BK = { od: 80, h: 110, wall: 1.5, floor: 2, ml: 300 }, ri = BK.od / 2 - BK.wall;
  var liquidH = BK.ml * 1000 / (Math.PI * ri * ri);
  var liquidMat = new THREE.MeshStandardMaterial({ color: 0xcfe3ff, roughness: 0.15, transparent: true, opacity: 0.45, depthWrite: false });
  function beaker() {
    var g = new THREE.Group(), ro = BK.od / 2;
    var p = [[0, 0], [ro - 3, 0], [ro, 3], [ro, BK.h], [ro + 1.2, BK.h + 1], [ri, BK.h], [ri, BK.floor + 2], [ri - 2, BK.floor], [0, BK.floor]]
      .map(function (v) { return new THREE.Vector2(v[0] * MM, v[1] * MM); });
    var gl = new THREE.Mesh(new THREE.LatheGeometry(p, 72), new THREE.MeshPhysicalMaterial({ color: 0xf2f7ff, roughness: 0.05, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6 }));
    gl.renderOrder = 2; g.add(gl);
    var liq = new THREE.Mesh(new THREE.CylinderGeometry((ri - 0.3) * MM, (ri - 0.3) * MM, liquidH * MM, 64), liquidMat);
    liq.position.y = (BK.floor + liquidH / 2) * MM; liq.renderOrder = 1; g.add(liq);
    return g;
  }

  /* bubbles */
  var NB = 900, bPos = new Float32Array(NB * 3), bVel = new Float32Array(NB * 3), bLife = new Float32Array(NB);
  for (var i = 0; i < NB; i++) bPos[i * 3 + 1] = -10;
  var bGeo = new THREE.BufferGeometry(); bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  var dot = document.createElement('canvas'); dot.width = dot.height = 64; var dx = dot.getContext('2d');
  var rg = dx.createRadialGradient(32, 32, 2, 32, 32, 30); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.45, 'rgba(235,245,255,.85)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  dx.fillStyle = rg; dx.fillRect(0, 0, 64, 64);
  var bubbles = new THREE.Points(bGeo, new THREE.PointsMaterial({ color: 0xeef7ff, size: 0.0025, map: new THREE.CanvasTexture(dot), transparent: true, depthWrite: false }));
  bubbles.frustumCulled = false; bubbles.renderOrder = 6;

  /* ---------- model ---------- */
  var PROBE_TIP = { 7: 64.0, 15: 77.5 }, TIP_R = { 7: 3.5, 15: 7.5 }, TABLE_UP = 0.136;
  var model = null, N = {}, doorPivot, backPivot, BACK_C = new THREE.Vector3(0, 0.19, -0.143), chamberMat = null, screenMesh = null, beakerG;
  var HINGE = new THREE.Vector3(-150 * MM, 0, 158 * MM);
  new THREE.GLTFLoader().load(BASE + 'parts.json', function (gltf) {
    model = gltf.scene;
    model.traverse(function (o) {
      if (!o.isMesh) return;
      o.material.side = THREE.DoubleSide;
      var mk = (o.name.split('__')[1] || '');
      var env = { white: 0.45, whiteint: 0.35, head: 0.45, black: 0.5, titanium: 1.1, steel: 1.1, screw: 1.0, alu: 0.8 }[mk];
      o.material.envMapIntensity = env === undefined ? 0.5 : env;
      if (mk === 'black') { o.material.color.set(0x060607); o.material.roughness = 0.35; o.material.envMapIntensity = 0.25; }
      if (mk === 'touchglass') { o.material.color.set(0x030304); o.material.roughness = 0.18; o.material.envMapIntensity = 0.3; o.material.polygonOffset = true; o.material.polygonOffsetFactor = -1; o.material.polygonOffsetUnits = -4; }
      if (mk === 'white' || mk === 'whiteint' || mk === 'head') o.material.color.multiplyScalar(0.93);
      if (mk === 'chamber') { chamberMat = o.material; o.material.envMapIntensity = 0; o.material.emissive = new THREE.Color(0x0d2cff); o.material.emissiveIntensity = 0; }
      if (o.name === 'screen') { o.material = screenMat; screenMesh = o; }
    });
    ['body', 'door', 'table', 'probe7', 'probe15', 'head', 'stack', 'back'].forEach(function (n) { N[n] = model.getObjectByName(n); });
    doorPivot = new THREE.Group(); doorPivot.position.copy(HINGE); model.add(doorPivot);
    N.door.position.sub(HINGE); doorPivot.add(N.door);
    var dg = doorGlass(); dg.position.sub(HINGE); doorPivot.add(dg);
    backPivot = new THREE.Group(); backPivot.position.copy(BACK_C); model.add(backPivot);
    N.back.position.sub(BACK_C); backPivot.add(N.back);
    beakerG = beaker(); beakerG.position.set(0, -98 * MM, 39.5 * MM); N.table.add(beakerG);
    N.probe15.visible = false;
    model.add(bubbles);
    scene.add(model);
    loadingEl.hidden = true;
    root.getElementById('heroFallback').classList.add('gone');
    dirty = true;
  }, undefined, function (err) { loadingEl.textContent = '3D model could not load'; console.error(err); });

  /* ---------- scroll choreography ----------
     Each scene section has states, one per text step. Between steps the state is interpolated.
     az/el in degrees, dist in metres, t = camera target, door/table/run/ex 0..1, p15 = 15 mm probe. */
  var C = [0, 0.09, 0];
  var SCENES = {
    hero: [ { az: -38, el: 12, dist: 2.25, t: [0, 0.09, 0], spin: 1 } ],
    solution: [
      { az: 28, el: 10, dist: 2.2, t: C },
      { az: 30, el: 9, dist: 2.0, t: C, door: 1 },
      { az: 24, el: 6, dist: 1.75, t: [0, 0.04, 0.03], door: 1, table: 1 },
      { az: 34, el: 4, dist: 1.35, t: [0, 0.1, 0.04], door: 1, table: 1, p15: 1 },
      { az: 22, el: 6, dist: 1.45, t: [0, 0.07, 0.03], table: 1, run: 1, scr: 'running' },
      { az: 10, el: 4, dist: 0.8, t: [0, 0.33, 0.1], table: 1, run: 1, scr: 'duty' }
    ],
    explode: [
      { az: 28, el: 12, dist: 2.7, t: [0, 0.12, 0.02], ex: 0.15 },
      { az: 18, el: 10, dist: 2.6, t: [0.04, 0.26, 0.08], ex: 1, hl: 'head' },
      { az: 22, el: 8, dist: 2.6, t: [0.04, 0.22, 0.08], ex: 1, hl: 'stack' },
      { az: 30, el: 8, dist: 2.7, t: [0.04, 0.18, 0.14], ex: 1, hl: 'door' },
      { az: 26, el: 14, dist: 2.6, t: [0.04, 0.16, 0.1], ex: 1, hl: 'table', table: 0.6 },
      { az: 34, el: 8, dist: 2.7, t: [0.06, 0.2, 0.06], ex: 1, hl: 'body' },
      { az: 30, el: 8, dist: 2.7, t: [0.12, 0.2, 0.06], ex: 1, hl: 'back' },
      { az: 28, el: 10, dist: 2.4, t: [0, 0.09, 0], ex: 0 }
    ]
  };
  var DEF = { az: 0, el: 0, dist: 2, t: C, door: 0, table: 0, run: 0, ex: 0, p15: 0, spin: 0, scr: 'start', hl: null, tableEx: 0 };
  Object.keys(SCENES).forEach(function (k) { SCENES[k] = SCENES[k].map(function (s) { var o = {}; for (var d in DEF) o[d] = s[d] !== undefined ? s[d] : DEF[d]; return o; }); });

  /* exploded offsets (m) and label anchors (model space, before offsets) */
  var EX = { head: [0, 0.27, 0], stack: [0, 0.135, 0], probe7: [0, 0.135, 0], probe15: [0, 0.135, 0], door: [-0.25, 0, 0.27], table: [0, 0, 0.22] };
  var BACK_EX = [0.36, -0.02, 0.12];
  var ANCHOR = {
    head: { p: [0.06, 0.38, 0.11], g: 'head', label: 'Control head' },
    stack: { p: [0.02, 0.2, 0.04], g: 'stack', label: 'Acoustic stack' },
    door: { p: [0.14, 0.12, 0.16], g: 'door', label: 'Door' },
    table: { p: [0.09, -0.12, 0.12], g: 'table', label: 'Sample table' },
    body: { p: [0.15, -0.12, 0.08], g: 'body', label: 'Sound cabinet' },
    back: { p: [0.08, 0.18, -0.15], g: 'back', label: 'Rear panel' }
  };

  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var smooth = function (t) { return t * t * (3 - 2 * t); };
  function mix(a, b, t) {
    var s = smooth(t), o = {};
    ['az', 'el', 'dist', 'door', 'table', 'run', 'ex', 'p15', 'spin'].forEach(function (k) { o[k] = lerp(a[k], b[k], s); });
    o.t = [0, 1, 2].map(function (i) { return lerp(a.t[i], b.t[i], s); });
    o.scr = s < 0.5 ? a.scr : b.scr; o.hl = t < 0.15 ? a.hl : (t > 0.85 ? b.hl : null);
    return o;
  }
  var sections = [].slice.call(root.querySelectorAll('[data-scene]'));
  var forced = null;
  window.__uhpForce = function (name, i) { var st = JSON.parse(JSON.stringify(SCENES[name][i])); st.spin = 0; forced = { st: st, vis: 1, name: name }; smoothState = null; dirty = true; };
  function currentState() {
    if (forced) return forced;
    var vh = innerHeight, best = null;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= vh) continue;
      var list = SCENES[sections[i].dataset.scene], n = list.length;
      var span = Math.max(1, r.height - vh), p = Math.min(1, Math.max(0, -r.top / span));
      var f = p * (n - 1), k = Math.min(n - 2, Math.floor(f));
      var st = n === 1 ? list[0] : mix(list[k], list[k + 1], Math.min(1, Math.max(0, f - k)));
      /* hold each state for the middle of its step, move between steps */
      if (n > 1) { var local = f - k; var hold = 0.3; var tt = Math.min(1, Math.max(0, (local - hold) / (1 - 2 * hold))); st = mix(list[k], list[k + 1], tt); if (tt === 0) st.hl = list[k].hl; if (tt === 1) st.hl = list[k + 1].hl; }
      /* fade in/out at section edges: how much of the screen this section covers */
      var vis = (Math.min(vh, r.bottom) - Math.max(0, r.top)) / vh;
      if (!best || vis > best.vis) best = { st: st, vis: vis, name: sections[i].dataset.scene };
    }
    return best;
  }

  var tag = root.getElementById('tag'), tagText = root.getElementById('tagText');
  var tmpV = new THREE.Vector3();
  var dirty = true, lastT = performance.now(), spinT = 0, curScr = 'start', smoothState = null;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function apply(st, dt, name) {
    if (!model) return;
    var narrow = innerWidth < 820;
    /* place the device right of the text on desktop, above the text card on phones */
    var w = innerWidth, h = innerHeight;
    var fit;
    if (forced) { camera.clearViewOffset(); fit = 1.12 * Math.max(1, 0.95 / camera.aspect) * (name === "explode" ? 1.22 : 1); narrow = false; }
    else if (narrow) { camera.setViewOffset(w, h, 0, h * (name === 'hero' ? 0.27 : 0.17), w, h); fit = Math.min(2.4, Math.max(1.15, 0.95 / camera.aspect)); }
    else { camera.setViewOffset(w, h, -w * 0.23, 0, w, h); fit = 1.25 * Math.max(1, 1.5 / camera.aspect); }
    var az = st.az + (st.spin && !reduce ? spinT * 9 : 0);
    var d = st.dist * fit * (narrow && name === 'hero' ? 1.3 : 1);
    camera.position.set(
      st.t[0] + d * Math.sin(az * D2R) * Math.cos(st.el * D2R),
      st.t[1] + d * Math.sin(st.el * D2R),
      st.t[2] + d * Math.cos(az * D2R) * Math.cos(st.el * D2R));
    camera.lookAt(st.t[0], st.t[1], st.t[2]);

    var ex = st.ex;
    Object.keys(EX).forEach(function (k) { var o = EX[k], node = k === 'door' ? doorPivot : N[k]; if (!node) return;
      var base = k === 'door' ? HINGE : null;
      node.position.set((base ? base.x : 0) + o[0] * ex, (base ? base.y : 0) + o[1] * ex, (base ? base.z : 0) + o[2] * ex); });
    N.table.position.y = st.table * TABLE_UP + EX.table[1] * ex;
    backPivot.position.set(BACK_C.x + BACK_EX[0] * ex, BACK_C.y + BACK_EX[1] * ex, BACK_C.z + BACK_EX[2] * ex);
    backPivot.rotation.y = Math.PI * smooth(Math.min(1, ex));
    doorPivot.rotation.y = -100 * D2R * st.door;
    var use15 = st.p15 > 0.5; N.probe7.visible = !use15; N.probe15.visible = use15;

    var run = st.run;
    var c = new THREE.Color(0x2e58ff);
    ledA.color.copy(c); ledB.color.copy(c);
    ledA.intensity = 1.5 + run * 5.5; ledB.intensity = 1 + run * 3;
    if (chamberMat) { chamberMat.color.setRGB(0.85, 0.87, 0.9).lerp(new THREE.Color(0x2e58ff).multiplyScalar(0.55), 0.35 + run * 0.65);
      chamberMat.emissive.copy(c).convertSRGBToLinear(); chamberMat.emissiveIntensity = 0.25 + run * 0.6; }
    if (st.scr !== curScr && SCR[st.scr]) { curScr = st.scr; screenMat.map = SCR[st.scr]; screenMat.needsUpdate = true; }

    /* bubbles at the probe tip while running */
    var probe = use15 ? 15 : 7;
    var tipY = PROBE_TIP[probe] * MM + EX.stack[1] * ex, cz = 39.5 * MM, tr = TIP_R[probe] * MM;
    var floorY = N.table.position.y - 98 * MM + BK.floor * MM, surf = floorY + liquidH * MM, rIn = (ri - 1) * MM;
    var active = run > 0.5 && tipY < surf && tipY > floorY && !reduce;
    var spawn = active ? Math.floor(dt * 520) : 0, live = 0;
    for (var i = 0; i < NB; i++) {
      var j = i * 3;
      if (bLife[i] <= 0) {
        if (spawn > 0) { spawn--;
          var a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * tr, cloud = Math.random() < 0.6, sp = cloud ? 0.008 + Math.random() * 0.03 : 0.05 + Math.random() * 0.09;
          bPos[j] = Math.cos(a) * rr; bPos[j + 1] = tipY - 0.001; bPos[j + 2] = cz + Math.sin(a) * rr;
          bVel[j] = (Math.random() - 0.5) * (cloud ? 0.05 : 0.025); bVel[j + 1] = -sp; bVel[j + 2] = (Math.random() - 0.5) * (cloud ? 0.05 : 0.025);
          bLife[i] = cloud ? 0.15 + Math.random() * 0.35 : 0.6 + Math.random() * 1.2;
        } else continue;
      }
      bLife[i] -= dt; live++;
      var drag = Math.pow(0.2, dt);
      bVel[j] *= drag; bVel[j + 1] = bVel[j + 1] * drag + 0.05 * dt; bVel[j + 2] *= drag;
      bPos[j] += bVel[j] * dt; bPos[j + 1] += bVel[j + 1] * dt; bPos[j + 2] += bVel[j + 2] * dt;
      var ox = bPos[j], oz = bPos[j + 2] - cz, rad = Math.sqrt(ox * ox + oz * oz);
      if (rad > rIn) { bPos[j] *= rIn / rad; bPos[j + 2] = cz + oz * rIn / rad; bVel[j] *= -0.4; bVel[j + 2] *= -0.4; }
      if (bPos[j + 1] < floorY + 0.002) { bPos[j + 1] = floorY + 0.002; bVel[j + 1] = Math.abs(bVel[j + 1]) * 0.5; }
      if (bPos[j + 1] > surf - 0.001 || bLife[i] <= 0) { bLife[i] = 0; bPos[j + 1] = -10; }
    }
    bGeo.attributes.position.needsUpdate = true;
    return active || live > 0;
  }

  function placeTag(st) {
    var a = st && st.hl && ANCHOR[st.hl];
    if (!a || !model) { tag.classList.remove('on'); return; }
    model.updateMatrixWorld(true);
    tmpV.set(a.p[0], a.p[1], a.p[2]); N[a.g].localToWorld(tmpV);
    tmpV.project(camera);
    if (tmpV.z > 1) { tag.classList.remove('on'); return; }
    var x = (tmpV.x * 0.5 + 0.5) * innerWidth, y = (-tmpV.y * 0.5 + 0.5) * innerHeight;
    tag.style.transform = 'translate(' + Math.round(x - 6) + 'px,' + Math.round(y - 6) + 'px)';
    tagText.textContent = a.label; tag.classList.add('on');
  }

  var lastKey = '';
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    if (window.__uhpFreeze) return;
    var cur = currentState();
    if (!cur) { tag.classList.remove('on'); return; }   /* no 3D section on screen: skip rendering */
    var st = cur.st;
    if (st.spin) spinT += dt;
    /* ease toward the scroll target so wheel steps feel smooth */
    if (!smoothState || reduce || forced) smoothState = JSON.parse(JSON.stringify(st));
    else {
      var e = 1 - Math.pow(0.0015, dt);
      ['az', 'el', 'dist', 'door', 'table', 'run', 'ex', 'p15', 'spin'].forEach(function (k) { smoothState[k] += (st[k] - smoothState[k]) * e; });
      for (var i = 0; i < 3; i++) smoothState.t[i] += (st.t[i] - smoothState.t[i]) * e;
      smoothState.scr = st.scr; smoothState.hl = st.hl;
    }
    var animating = apply(smoothState, dt, cur.name);
    var key = JSON.stringify(smoothState);
    if (key !== lastKey || animating || st.spin || dirty) { renderer.render(scene, camera); dirty = false; lastKey = key; }
    placeTag(cur.name === 'explode' ? smoothState : null);
  }
  resize();
  requestAnimationFrame(frame);
})();

  }
  function mountAll() { [].forEach.call(document.querySelectorAll('[data-uhp-page]'), mount); }
  window.UHPPage = { mountAll: mountAll };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll); else mountAll();
})();
