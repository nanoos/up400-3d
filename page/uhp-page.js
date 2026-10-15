/* Topsonics UHP-400 product page (v1.0). Mounts into [data-uhp-page] inside a shadow root.
   Assets load from the same folder as this script. Needs THREE r128 + GLTFLoader + RoomEnvironment. */
(function () {
  var me = document.currentScript && document.currentScript.src;
  var BASE = me ? me.replace(/[^\/]*$/, '') : '';
  var CSS = "\n/* Layout: a light laboratory page in the Bandelin manner (white and pale grey panels, clear blue headings,\n   square-ish 3 px corners). One fixed WebGL stage sits behind transparent \"scene\" sections; solid sections cover it. */\n:host{display:block;position:relative;\n  color-scheme:light;\n  --paper:#ffffff;      /* solid sections */\n  --mist:#f2f4f6;       /* page ground behind the 3D stage, cards */\n  --line:#d9dee3;\n  --ink:#191e23;        /* strong text */\n  --text:#3a4148;       /* running text */\n  --mute:#66707a;\n  --blue:#0f5aa5;       /* headings, buttons */\n  --navy:#003761;       /* titles, numbers */\n  --teal:#3fb6c2;       /* small accents */\n  --amber:#a35f00;      /* placeholders still to fill */\n  --display:\"Titillium Web\",\"Segoe UI\",Arial,sans-serif;\n  --body:\"Titillium Web\",\"Segoe UI\",Arial,sans-serif;\n  --mono:\"IBM Plex Mono\",ui-monospace,Consolas,monospace;\n  --gut:clamp(16px,5vw,72px);\n}\n*{box-sizing:border-box}\n.uhp{background:var(--mist);color:var(--text);font:400 17px/1.6 var(--body);overflow-x:hidden;position:relative;isolation:isolate;-webkit-text-size-adjust:100%;overflow:hidden}\na{color:var(--blue)}\nimg,video{max-width:100%;display:block}\nh1,h2,h3{font-family:var(--display);font-weight:600;color:var(--navy);line-height:1.15;margin:0;text-wrap:balance}\np{margin:0}\n.eyebrow{font:600 13px/1 var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--blue)}\n.wrap{padding-inline:var(--gut)}\n.inner{max-width:1240px;margin:0 auto}\n.btn{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 24px;border:1px solid var(--blue);border-radius:3px;color:var(--blue);text-decoration:none;font:600 15px/1 var(--display);background:transparent;cursor:pointer;transition:background .2s,color .2s}\n.btn:hover,.btn:focus-visible{background:var(--blue);color:#fff;outline:none}\n.btn.solid{background:var(--blue);color:#fff}\n.btn.solid:hover{background:var(--navy);border-color:var(--navy)}\n:focus-visible{outline:2px solid var(--teal);outline-offset:3px}\n.todo{color:var(--amber)}\n\n/* nav */\n.nav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;align-items:center;gap:28px;padding:calc(env(safe-area-inset-top,0px) + 14px) var(--gut) 14px;background:rgba(255,255,255,.94);border-bottom:1px solid var(--line);backdrop-filter:blur(8px)}\n.brand{font:700 20px/1 var(--display);letter-spacing:.2em;text-decoration:none;color:var(--navy)}\n.nav nav{display:flex;gap:24px;margin-left:auto}\n.nav nav a{font:600 14px/1 var(--display);text-decoration:none;color:var(--text)}\n.nav nav a:hover{color:var(--blue)}\n.nav .btn{height:38px;padding:0 16px;font-size:14px}\n@media (max-width:900px){.nav nav{display:none}.nav .btn{margin-left:auto}}\n\n/* WebGL stage */\n#stage{position:fixed;inset:0;z-index:0;width:100%;height:100%;pointer-events:none}\n#stage canvas{width:100%!important;height:100%!important;display:block}\nmain{position:relative;z-index:1}\n.paper{background:var(--paper);position:relative}\n.sec{padding-block:clamp(64px,8vw,112px)}\n.sec-head{max-width:720px;display:grid;gap:14px}\n.sec-head h2{font-size:clamp(32px,3.6vw,48px)}\n.sec-head p{color:var(--mute);font-size:18px}\n\n/* hero */\n.hero{min-height:100vh;min-height:100svh;display:grid;align-content:center;padding-block:110px 56px}\n.hero-fallback{position:absolute;inset:0;background:var(--mist) url(%%BASE%%hero-fallback.png) 76% 50%/auto 76% no-repeat;z-index:-1}\n.hero-fallback.gone{display:none}\n.hero .inner{width:100%}\n.hero-text{max-width:min(500px,44vw)}\n.hero h1{font-size:clamp(52px,6.4vw,96px);font-weight:700;letter-spacing:-.01em;line-height:1;white-space:nowrap}\n.hero .lede{font-size:clamp(19px,1.7vw,23px);line-height:1.4;margin-top:16px;color:var(--ink)}\n.hero .ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}\n.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:44px;border-top:1px solid var(--line);max-width:560px}\n.stat{padding:14px 14px 0 0}\n.stat b{display:block;font:700 clamp(26px,2.6vw,34px)/1 var(--display);color:var(--navy);white-space:nowrap}\n.stat b small{font-size:.5em;font-weight:600;margin-left:3px;color:var(--mute)}\n.stat span{display:block;margin-top:6px;font-size:13px;line-height:1.3;color:var(--mute)}\n@media (max-width:900px){.stats{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:16px}}\n\n/* benefits with the product photo */\n.benefits{display:grid;grid-template-columns:minmax(0,340px) minmax(0,1fr);gap:clamp(28px,6vw,96px);align-items:center}\n.benefits figure{margin:0;justify-self:center}\n.benefits img{width:100%;max-width:320px;height:auto;margin:0 auto}\n.benefits figcaption,.cap{margin-top:10px;font-size:13px;color:var(--mute);text-align:center}\n.blist{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:0;border-top:1px solid var(--line)}\n.blist li{display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;padding:16px 0;border-bottom:1px solid var(--line)}\n.blist li::before{content:\"\";width:18px;height:18px;margin-top:5px;border-radius:50%;background:var(--blue) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 12.5l4 4 8-9' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") center/12px no-repeat}\n.blist b{display:block;color:var(--ink);font-weight:600}\n.blist span{color:var(--mute)}\n@media (max-width:640px){.benefits{grid-template-columns:minmax(0,1fr)}.benefits img{max-width:240px}}\n\n/* problems with references */\n.pgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:44px}\n.pcard{background:var(--paper);border:1px solid var(--line);border-radius:3px;display:grid;grid-template-rows:auto 1fr;overflow:hidden}\n.pcard .fig{background:#fff;border-bottom:1px solid var(--line);height:132px;display:grid;place-items:center;padding:10px}\n.pcard .fig img{max-height:112px;width:auto;object-fit:contain}\n.pcard .body{padding:18px 20px 20px;display:grid;gap:10px;align-content:start}\n.pcard h3{font-size:21px}\n.pcard p{color:var(--text);font-size:16px}\n.ref{font-size:13px;line-height:1.45;color:var(--mute);border-top:1px solid var(--line);padding-top:10px}\n.ref a{font-weight:600;text-decoration:none}\n.ref a:hover{text-decoration:underline}\n.ref small{display:block;margin-top:4px;font-size:11.5px}\n.helps{font-size:14.5px;color:var(--navy);font-weight:600}\n@media (max-width:980px){.pgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}\n@media (max-width:640px){.pgrid{grid-template-columns:minmax(0,1fr)}}\n\n/* scroll scenes */\n.scene{position:relative}\n.step{min-height:78vh;display:flex;align-items:center;padding-inline:var(--gut)}\n.scene .step:first-child{min-height:90vh}\n.step .card{max-width:min(420px,44vw);display:grid;gap:12px;background:rgba(255,255,255,.9);border:1px solid var(--line);border-radius:3px;padding:24px 26px;box-shadow:0 10px 30px rgba(0,55,97,.06)}\n.step h2{font-size:clamp(30px,3.2vw,42px)}\n.step h3{font-size:clamp(24px,2.4vw,32px)}\n.step p{font-size:17px}\n.step .solves{font:600 12px/1 var(--display);letter-spacing:.12em;text-transform:uppercase;color:var(--teal)}\n.spec{display:grid;margin:4px 0 0;border-top:1px solid var(--line)}\n.spec div{display:flex;justify-content:space-between;gap:16px;padding:9px 0;border-bottom:1px solid var(--line);font-size:15px}\n.spec span:first-child{color:var(--mute)}\n.spec span:last-child{text-align:right;font-weight:600;color:var(--ink)}\n.part-no{font:600 12px/1 var(--display);letter-spacing:.14em;color:var(--mute)}\n\n.tag{position:fixed;left:0;top:0;z-index:2;pointer-events:none;display:flex;align-items:center;gap:8px;opacity:0;transition:opacity .3s;font:600 13px/1 var(--display);white-space:nowrap;color:var(--navy)}\n.tag i{width:12px;height:12px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 6px rgba(15,90,165,.18);flex:none}\n.tag em{font-style:normal;background:#fff;padding:6px 9px;border:1px solid var(--line);border-radius:3px}\n.tag.on{opacity:1}\n.tag.flip{flex-direction:row-reverse}\n.tag.probe em{display:grid;gap:2px;padding:10px 14px 10px 12px;border-left:4px solid var(--blue);font-weight:600;font-size:13px;color:var(--mute);box-shadow:0 8px 24px rgba(0,55,97,.12)}\n.tag.probe em b{font:700 30px/1 var(--display);color:var(--navy);letter-spacing:-.01em}\n.tag.probe i{width:14px;height:14px;background:#fff;border:3px solid var(--blue)}\n\n/* film */\n.film-main{margin-top:40px;position:relative}\n.film-main video{width:100%;aspect-ratio:16/9;object-fit:cover;background:#e6eaee;border-radius:3px}\n.film-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:16px}\n.film-row figure{margin:0}\n.film-row video{width:100%;aspect-ratio:16/9;object-fit:cover;background:#e6eaee;border-radius:3px}\n.film .cap{text-align:left}\n.badge{position:absolute;left:14px;top:14px;font:600 12px/1 var(--display);background:#fff;color:var(--navy);padding:7px 10px;border-radius:3px}\n@media (max-width:820px){.film-row{grid-template-columns:minmax(0,1fr)}}\n\n/* specs + photos */\n.specs{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:clamp(24px,6vw,96px)}\ntable{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}\nth,td{text-align:left;padding:13px 0;border-bottom:1px solid var(--line);vertical-align:top}\nth{font-weight:600;color:var(--mute);width:38%;padding-right:16px;font-size:15px}\ntd{font-size:16px;color:var(--ink)}\n@media (max-width:820px){.specs{grid-template-columns:minmax(0,1fr)}}\n.ggrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-top:36px;max-width:960px}\n.ggrid figure{margin:0;background:var(--mist);border-radius:3px;padding:18px 12px 12px;display:grid;justify-items:center}\n.ggrid img{height:240px;width:auto;object-fit:contain}\n.colours{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:40px;max-width:960px}\n.colours figure{margin:0}\n.colours img{width:100%;aspect-ratio:1200/681;object-fit:cover;border-radius:3px}\n.colours figcaption{padding-top:8px;font-size:14px;color:var(--mute)}\n@media (max-width:760px){.ggrid{grid-template-columns:repeat(2,minmax(0,1fr))}.ggrid img{height:190px}.colours{gap:8px}.colours figcaption{font-size:12px}}\n\n/* value + calculator */\n.vcols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(24px,5vw,72px);margin-top:40px}\n.vcols h3{font-size:24px;margin-bottom:12px}\n.vcols ul{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}\n.vcols li{padding:11px 0;border-bottom:1px solid var(--line)}\n.calc-box{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(24px,5vw,72px);margin-top:64px;align-items:start}\n.calc{background:var(--paper);border:1px solid var(--line);border-radius:3px;padding:clamp(20px,3vw,32px)}\n.calc h3{font-size:24px}\n.calc .sub{color:var(--mute);margin-top:6px;font-size:15px}\n.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:20px}\nlabel{display:grid;gap:6px;font-size:14px;font-weight:600;color:var(--text)}\ninput,select{width:100%;height:44px;background:#fff;border:1px solid var(--line);border-radius:3px;color:var(--ink);padding:0 12px;font:500 16px/1 var(--mono)}\ninput:focus,select:focus{border-color:var(--blue);outline:none}\n.result{margin-top:22px;padding:16px;background:var(--mist);border-radius:3px;display:grid;gap:4px}\n.result span{font-size:14px;color:var(--mute)}\n.result b{font:700 clamp(28px,3vw,38px)/1.1 var(--display);color:var(--navy);font-variant-numeric:tabular-nums}\n.result em{font-style:normal;font-size:14px;color:var(--ink)}\n.basis{margin-top:16px;font-size:14px;color:var(--text)}\n.basis ul{margin:6px 0 0;padding-left:18px}\n.disclaimer{margin-top:14px;font-size:13px;line-height:1.5;color:var(--mute);border-left:3px solid var(--line);padding-left:12px}\n.box{background:var(--paper);border:1px solid var(--line);border-radius:3px;padding:clamp(20px,3vw,32px)}\n.box h3{font-size:24px}\n.box p{color:var(--mute);margin-top:6px}\n.box ul{margin:16px 0 0;padding:0;list-style:none;border-top:1px solid var(--line)}\n.box li{display:flex;gap:14px;padding:11px 0;border-bottom:1px solid var(--line)}\n.box li b{font:600 13px/1.7 var(--mono);color:var(--blue)}\n@media (max-width:860px){.vcols,.calc-box{grid-template-columns:minmax(0,1fr)}.fields{grid-template-columns:minmax(0,1fr)}}\n\n/* viewer, research, quote */\n.try-head{display:flex;flex-wrap:wrap;gap:16px 48px;align-items:end;justify-content:space-between;margin-bottom:24px}\n.try-head p{color:var(--mute);max-width:46ch}\n.viewer-slot{min-height:520px;position:relative}\n.viewer-wait{position:absolute;inset:0;display:grid;place-items:center;font-size:14px;color:var(--mute);border:1px dashed var(--line);border-radius:3px}\n.research ol{margin:22px 0 0;padding:0;list-style:none;border-top:1px solid var(--line);columns:2;column-gap:48px}\n.research li{padding:12px 0;border-bottom:1px solid var(--line);break-inside:avoid;font-size:15.5px}\n.research li small{display:block;color:var(--mute);margin-top:2px}\n@media (max-width:820px){.research ol{columns:1}}\n.quote{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:clamp(24px,6vw,96px)}\n.quote h2{font-size:clamp(36px,4.4vw,56px)}\n.quote .contact{margin-top:20px;display:grid;gap:6px;color:var(--mute)}\n.quote .contact b{color:var(--ink);font-weight:600;user-select:all}\n.qform{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}\n.qform .full{grid-column:1/-1}\n.qmsg{grid-column:1/-1;font-size:14px;color:var(--mute);min-height:1.5em}\n@media (max-width:820px){.quote,.qform{grid-template-columns:minmax(0,1fr)}}\nfooter{padding-block:24px 36px;display:flex;flex-wrap:wrap;gap:10px 32px;justify-content:space-between;font-size:14px;color:var(--mute);border-top:1px solid var(--line)}\n.loading{position:fixed;right:var(--gut);bottom:20px;z-index:3;font-size:13px;color:var(--mute)}\n\n/* phones: still images instead of the scroll-driven 3D */\n.shot{display:none}\n.simple #stage,.simple .loading,.simple .tag,.simple .hero-fallback{display:none}\n.simple .shot{display:block;width:100%;height:auto;aspect-ratio:720/880;object-fit:cover;background:var(--mist)}\n.simple .hero{min-height:0;padding-block:76px 40px}\n.simple .hero-shot{width:min(100%,380px);margin:0 auto 4px}\n.simple .scene .step,.simple .scene .step:first-child{min-height:0;display:block;padding-block:20px}\n.simple .scene .step .card{box-shadow:none}\n.simple .scene .step .shot{max-width:380px;margin:0 auto 14px}\n.simple .scene .step:first-child{padding-top:56px}\n\n/* floating contact buttons */\n.fab{position:fixed;right:calc(18px + env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:30;display:flex;flex-direction:column-reverse;align-items:flex-end;gap:12px}\n.fab-main{width:60px;height:60px;border-radius:50%;border:0;background:var(--blue);color:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 8px 22px rgba(0,55,97,.3);transition:transform .25s,background .25s}\n.fab-main:hover{background:var(--navy)}\n.fab-main svg{width:28px;height:28px;transition:transform .25s,opacity .2s;grid-area:1/1}\n.fab-main .x{opacity:0;transform:rotate(-90deg)}\n.fab.open .fab-main .x{opacity:1;transform:none}\n.fab.open .fab-main .chat{opacity:0;transform:rotate(90deg)}\n.fab-list{display:flex;flex-direction:column;gap:10px;align-items:flex-end;pointer-events:none}\n.fab-item{display:flex;align-items:center;gap:10px;text-decoration:none;opacity:0;transform:translateY(12px) scale(.9);transition:opacity .2s,transform .25s}\n.fab.open .fab-list{pointer-events:auto}\n.fab.open .fab-item{opacity:1;transform:none}\n.fab.open .fab-item:nth-child(2){transition-delay:.04s}.fab.open .fab-item:nth-child(3){transition-delay:.08s}\n.fab-item span{background:#fff;color:var(--ink);font:600 14px/1 var(--display);padding:8px 12px;border-radius:3px;box-shadow:0 4px 14px rgba(0,30,60,.14);white-space:nowrap}\n.fab-item i{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;box-shadow:0 6px 18px rgba(0,30,60,.22);flex:none}\n.fab-item i svg{width:28px;height:28px}\n.fab-wa i{background:#25d366}.fab-mail i{background:#ea4335}.fab-tel i{background:#0f5aa5}\n@media (prefers-reduced-motion:reduce){.fab-item,.fab-main svg{transition:none}}\n\n/* phones with 3D: device in the top part of the screen, text underneath */\n.p3d .hero{min-height:0;padding-block:62vh 40px;padding-block:62svh 40px}\n.p3d .hero-fallback{display:none}\n.p3d .hero-text{max-width:none}\n.p3d .hero h1{font-size:54px}\n.p3d .scene .step,.p3d .scene .step:first-child{min-height:100vh;min-height:100svh;align-items:flex-end;padding-bottom:88px}\n.p3d .step .card{max-width:none;width:100%;padding:18px 20px;background:rgba(255,255,255,.95)}\n.p3d .step h2{font-size:28px}.p3d .step h3{font-size:24px}.p3d .step p{font-size:16px}\n.p3d .tag em{font-size:12px}\n.p3d .tag.probe em b{font-size:24px}\n.p3d .loading{left:16px;right:auto;top:72px;bottom:auto}\n\n\n#stage.abs{position:absolute;top:0;bottom:auto;height:100vh}\n";
  var HTML = "<div class=\"uhp\"><div id=\"stage\" aria-hidden=\"true\"></div>\n<div class=\"loading\" id=\"loading\">Loading 3D model\u2026</div>\n\n<main id=\"top\">\n  <!-- HERO -->\n  <section class=\"scene hero wrap\" data-scene=\"hero\" aria-label=\"UHP-400\">\n    <div class=\"hero-fallback\" id=\"heroFallback\"></div>\n    <img class=\"shot hero-shot\" data-shot=\"hero-0\" alt=\"The UHP-400 ultrasonic homogenizer\" width=\"720\" height=\"880\">\n    <div class=\"inner\"><div class=\"hero-text\">\n      <p class=\"eyebrow\">Ultrasonic homogenizer</p>\n      <h1>UHP-400</h1>\n      <p class=\"lede\">Dispersion, extraction and cell disruption in one enclosed system.</p>\n      <div class=\"ctas\"><a class=\"btn solid\" href=\"#quote\">Request a quote</a><a class=\"btn\" href=\"#film\">Watch it run</a></div>\n      <div class=\"stats\">\n        <div class=\"stat\"><b>400<small>W</small></b><span>Max output power</span></div>\n        <div class=\"stat\"><b>24<small>kHz</small></b><span>Fixed frequency</span></div>\n        <div class=\"stat\"><b>7 / 15<small>mm</small></b><span>Titanium probes</span></div>\n        <div class=\"stat\"><b>0\u201380<small>\u00b0C</small></b><span>Sensor with auto-stop</span></div>\n      </div>\n    </div></div>\n  </section>\n\n  <!-- BENEFITS -->\n  <section class=\"paper\">\n    <div class=\"sec wrap\"><div class=\"inner benefits\">\n      <figure>\n        <img src=\"%%BASE%%studio-34.webp\" alt=\"The UHP-400 in three-quarter view, with blue chamber light and a 1000 mL beaker on the sample table\" width=\"418\" height=\"760\" loading=\"lazy\">\n        <figcaption>Photo of a production UHP-400</figcaption>\n      </figure>\n      <div>\n        <div class=\"sec-head\">\n          <p class=\"eyebrow\">What you get</p>\n          <h2>Less preparation work, more results you can trust</h2>\n        </div>\n        <ul class=\"blist\">\n          <li><div><b>Ready on the first day</b><span>Sound cabinet, sample table, temperature sensor and touchscreen come as one instrument. No extra parts to source.</span></div></li>\n          <li><div><b>The same result every run</b><span>Power, pulse, time and temperature limit are set as numbers, and every run is saved with its energy and time.</span></div></li>\n          <li><div><b>Gentle on heat-sensitive samples</b><span>Pulse mode spreads the energy, and the run stops by itself at the temperature limit you set.</span></div></li>\n          <li><div><b>A quieter bench</b><span>The sample runs inside a closed cabinet with a window, so you can watch it without opening the door.</span></div></li>\n          <li><div><b>Help from the people who built it</b><span>Designed and made in Vilnius, Lithuania, by a team working in power ultrasonics since 2003.</span></div></li>\n        </ul>\n      </div>\n    </div></div>\n  </section>\n\n  <!-- PROBLEMS -->\n  <section class=\"sec wrap\" id=\"problem\" style=\"background:var(--mist);position:relative\">\n    <div class=\"inner\">\n      <div class=\"sec-head\">\n        <p class=\"eyebrow\">The problem</p>\n        <h2>What makes sample preparation slow and unreliable</h2>\n        <p>Each point below comes from a peer-reviewed, open-access paper. Click through to read it.</p>\n      </div>\n      <div class=\"pgrid\">\n        <article class=\"pcard\"><div class=\"fig\"><img src=\"%%BASE%%fig-pradhan.jpg\" alt=\"Particle size distributions after probe and bath sonication\" loading=\"lazy\"></div><div class=\"body\">\n          <h3>Nanoparticles clump together</h3>\n          <p>Metal nanoparticles agglomerate strongly in liquid. In this study, probe sonication dispersed them better than an ultrasonic bath.</p>\n          <p class=\"helps\">UHP-400: probe sonication at up to 400 W.</p>\n          <p class=\"ref\"><a href=\"https://doi.org/10.1007/s11051-016-3597-5\" target=\"_blank\" rel=\"noopener\">Pradhan et al., 2016</a> \u00b7 J. Nanoparticle Research 18:285<small>Figure 1 from the paper, CC BY 4.0</small></p>\n        </div></article>\n        <article class=\"pcard\"><div class=\"fig\"><img src=\"%%BASE%%fig-mccormack.jpg\" alt=\"Diagram of the parameters to report for a dispersion protocol\" loading=\"lazy\"></div><div class=\"body\">\n          <h3>Results are hard to reproduce</h3>\n          <p>A 2025 review found that changes in sonication method, power and duration change particle properties and the toxicity results that follow.</p>\n          <p class=\"helps\">UHP-400: power, pulse and time set as exact numbers.</p>\n          <p class=\"ref\"><a href=\"https://doi.org/10.1186/s12989-025-00627-8\" target=\"_blank\" rel=\"noopener\">McCormack et al., 2025</a> \u00b7 Particle and Fibre Toxicology 22<small>Figure 3 from the paper, CC BY 4.0</small></p>\n        </div></article>\n        <article class=\"pcard\"><div class=\"fig\"><img src=\"%%BASE%%fig-pchelintsev.jpg\" alt=\"Gels comparing sonication power and time\" loading=\"lazy\"></div><div class=\"body\">\n          <h3>Too much energy damages the sample</h3>\n          <p>The sonication needed to shear chromatin often degraded large proteins, and runs under identical-looking conditions gave different results.</p>\n          <p class=\"helps\">UHP-400: pulse mode and a temperature limit with auto-stop.</p>\n          <p class=\"ref\"><a href=\"https://doi.org/10.1371/journal.pone.0148023\" target=\"_blank\" rel=\"noopener\">Pchelintsev et al., 2016</a> \u00b7 PLoS ONE 11:e0148023<small>Figure 3 from the paper, CC BY 4.0</small></p>\n        </div></article>\n        <article class=\"pcard\"><div class=\"fig\"><img src=\"%%BASE%%fig-momchev.jpg\" alt=\"Phenolic acid content for different extraction solvents\" loading=\"lazy\"></div><div class=\"body\">\n          <h3>Extraction takes too long</h3>\n          <p>Compared with maceration, ultrasound-assisted extraction gave significantly higher yields of phenolic acids in a shorter time.</p>\n          <p class=\"helps\">UHP-400: runs of up to 30 minutes per cycle.</p>\n          <p class=\"ref\"><a href=\"https://doi.org/10.3390/molecules25215142\" target=\"_blank\" rel=\"noopener\">Momchev et al., 2020</a> \u00b7 Molecules 25:5142<small>Figure 1 from the paper, CC BY 4.0</small></p>\n        </div></article>\n        <article class=\"pcard\"><div class=\"fig\"><img src=\"%%BASE%%fig-turrini.jpg\" alt=\"Model coefficients for pulsed ultrasound extraction, including duty cycle\" loading=\"lazy\"></div><div class=\"body\">\n          <h3>Solvents cost money and add risk</h3>\n          <p>Pulsed ultrasound-assisted extraction with a food-grade solvent was tested as a greener alternative to conventional maceration.</p>\n          <p class=\"helps\">UHP-400: pulse mode from 5 to 95 % duty cycle.</p>\n          <p class=\"ref\"><a href=\"https://doi.org/10.3390/foods8100466\" target=\"_blank\" rel=\"noopener\">Turrini et al., 2019</a> \u00b7 Foods 8:466<small>Figure 3 from the paper, CC BY 4.0</small></p>\n        </div></article>\n        <article class=\"pcard\"><div class=\"fig\"><img src=\"%%BASE%%fig-piorino.jpg\" alt=\"Lysate protein output for different sonication energies\" loading=\"lazy\"></div><div class=\"body\">\n          <h3>Cell lysis is hard to get right</h3>\n          <p>Too little energy leaves cells intact and too much degrades proteins. The best energy input changed with the experiment.</p>\n          <p class=\"helps\">UHP-400: energy recorded for every run.</p>\n          <p class=\"ref\"><a href=\"https://doi.org/10.1021/acssynbio.3c00312\" target=\"_blank\" rel=\"noopener\">Piorino &amp; Styczynski, 2023</a> \u00b7 ACS Synthetic Biology 12<small>Figure 1 from the paper, CC BY 4.0</small></p>\n        </div></article>\n      </div>\n    </div>\n  </section>\n\n  <!-- HOW IT WORKS (3D scroll) -->\n  <section class=\"scene\" data-scene=\"solution\" id=\"solution\" aria-label=\"How the UHP-400 works\">\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-0\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"eyebrow\">How it works</p>\n      <h2>One enclosed system</h2>\n      <p>Generator, acoustic stack, sound cabinet, sample table and temperature control in one instrument.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-1\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Less noise, less set-up</p>\n      <h3>Open, load, close</h3>\n      <p>The sample sits inside the sound cabinet. You watch it through the window while the door stays closed.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-2\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Same probe depth every run</p>\n      <h3>The table brings the sample to the probe</h3>\n      <p>Raise the table on its guide rods until the probe tip is at the right depth, then lock it.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-3\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Right probe for the volume</p>\n      <h3>7 mm probe for small samples</h3>\n      <p>Ti-6Al-4V titanium probes vibrate 24,000 times per second. The slim 7 mm tip concentrates the energy in small volumes.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-4\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Right probe for the volume</p>\n      <h3>15 mm probe for larger batches</h3>\n      <p>Swap to the 15 mm tip for 100\u20133,500 mL. Both probes fit the same acoustic stack.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-5\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Protects heat-sensitive samples</p>\n      <h3>Pulse mode and a temperature limit</h3>\n      <p>Set the duty cycle from 5 to 95 % of a 15-second period. The sensor reads 0\u201380 \u00b0C and stops the run with an alarm at your limit.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"solution-6\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"solves\">Results you can report</p>\n      <h3>Same settings, every run</h3>\n      <p>Save a full setting of power, duty cycle, time and temperature limit, and load it again with one tap. Every run also keeps its sample record.</p>\n    </div></div>\n  </section>\n\n  <!-- FILM -->\n  <section class=\"paper\" id=\"film\">\n    <div class=\"sec wrap film\"><div class=\"inner\">\n      <div class=\"sec-head\">\n        <p class=\"eyebrow\">Filmed, not animated</p>\n        <h2>Cavitation at the probe tip</h2>\n        <p>Short clips from our lab. The white jet below the tip is the cavitation zone, where the bubbles form and collapse.</p>\n      </div>\n      <div class=\"film-main\">\n        <video src=\"%%BASE%%clip-onset.mp4\" poster=\"%%BASE%%clip-onset.jpg\" muted loop playsinline preload=\"metadata\" data-auto aria-label=\"Probe tip in water as the power is switched on and a cavitation jet forms\"></video>\n        <span class=\"badge\">Real footage \u00b7 UHP-400</span>\n      </div>\n      <p class=\"cap\">Power on: the cavitation jet forms within a second.</p>\n      <div class=\"film-row\">\n        <figure><video src=\"%%BASE%%clip-macro.mp4\" poster=\"%%BASE%%clip-macro.jpg\" muted loop playsinline preload=\"none\" data-auto aria-label=\"Close view of the probe tip running\"></video><figcaption class=\"cap\">Close view of the tip at work.</figcaption></figure>\n        <figure><video src=\"%%BASE%%clip-wide.mp4\" poster=\"%%BASE%%clip-wide.jpg\" muted loop playsinline preload=\"none\" data-auto aria-label=\"Beaker on the sample table with the probe running\"></video><figcaption class=\"cap\">Beaker on the table, silicone ring holding it in place.</figcaption></figure>\n        <figure><video src=\"%%BASE%%clip-stream.mp4\" poster=\"%%BASE%%clip-stream.jpg\" muted loop playsinline preload=\"none\" data-auto aria-label=\"Steady cavitation stream below the probe\"></video><figcaption class=\"cap\">Steady stream during a run.</figcaption></figure>\n      </div>\n    </div></div>\n  </section>\n\n  <!-- INSIDE: one part at a time -->\n  <section class=\"scene\" data-scene=\"explode\" id=\"inside\" aria-label=\"Main parts of the UHP-400\">\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-0\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"eyebrow\">Inside the UHP-400</p>\n      <h2>Six main parts</h2>\n      <p>Keep scrolling. Each part comes forward while the rest fades back.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-1\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 1 / 6</p><h3>Control head</h3>\n      <dl class=\"spec\"><div><span>Display</span><span>5-inch capacitive touch</span></div><div><span>Power</span><span>0\u2013400 W</span></div><div><span>Pulse</span><span>5\u201395 % of 15 s</span></div><div><span>Run time</span><span>up to 30 min</span></div><div><span>Records</span><span>every run saved</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-2\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 2 / 6</p><h3>Acoustic stack and probe</h3>\n      <dl class=\"spec\"><div><span>Frequency</span><span>24 kHz \u00b1 1 kHz, fixed</span></div><div><span>Probe</span><span>Ti-6Al-4V</span></div><div><span>Tip</span><span>7 mm or 15 mm</span></div><div><span>Volume, 15 mm</span><span>100\u20133,500 mL</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-3\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 3 / 6</p><h3>Door with window</h3>\n      <p>Closes the sound cabinet during the run. The window lets you watch the sample without opening it.</p>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-4\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 4 / 6</p><h3>Sample table</h3>\n      <dl class=\"spec\"><div><span>Height</span><span>adjustable, lockable</span></div><div><span>Guides</span><span>two steel rods</span></div><div><span>Grip</span><span>silicone ring</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-5\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 5 / 6</p><h3>Sound cabinet</h3>\n      <dl class=\"spec\"><div><span>Size</span><span>300 W \u00d7 670 H mm</span></div><div><span>Chamber light</span><span>colour per run state</span></div><div><span>Temperature</span><span>sensor 0\u201380 \u00b0C</span></div><div><span>Colours</span><span>white, green, blue</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-6\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"part-no\">PART 6 / 6</p><h3>Rear panel</h3>\n      <dl class=\"spec\"><div><span>Supply</span><span>220 V, 50\u201360 Hz, 2 A</span></div><div><span>Switch</span><span>main power switch</span></div><div><span>Cooling</span><span>built-in fan</span></div></dl>\n    </div></div>\n    <div class=\"step\"><img class=\"shot\" data-shot=\"explode-7\" alt=\"\" width=\"720\" height=\"880\"><div class=\"card\">\n      <p class=\"eyebrow\">Assembled</p>\n      <h2>Made in Lithuania</h2>\n      <p>Designed and built in Vilnius, Lithuania, by a team working in power ultrasonics since 2003.</p>\n      <div><a class=\"btn\" href=\"#specs\">All specifications</a></div>\n    </div></div>\n  </section>\n\n  <!-- SPECS + PHOTOS -->\n  <section class=\"paper\">\n    <div class=\"sec wrap\"><div class=\"inner\">\n      <div class=\"specs\" id=\"specs\">\n        <div class=\"sec-head\" style=\"align-content:start\">\n          <p class=\"eyebrow\">Specifications</p>\n          <h2>UHP-400 at a glance</h2>\n          <p>Need a value that is not listed? Ask us and we will send it.</p>\n        </div>\n        <div style=\"overflow-x:auto\">\n          <table>\n            <tr><th>Model</th><td>UHP-400</td></tr>\n            <tr><th>Frequency</th><td>24 kHz \u00b1 1 kHz, fixed</td></tr>\n            <tr><th>Output power</th><td>0\u2013400 W, adjustable</td></tr>\n            <tr><th>Pulse mode</th><td>Duty cycle 5\u201395 % of a 15 s period</td></tr>\n            <tr><th>Run time</th><td>Up to 30 min per cycle</td></tr>\n            <tr><th>Temperature</th><td>Built-in sensor 0\u201380 \u00b0C, limit with alarm and auto-stop</td></tr>\n            <tr><th>Control</th><td>5-inch capacitive touchscreen, run records</td></tr>\n            <tr><th>Probes</th><td>Ti-6Al-4V, 7 mm or 15 mm tip</td></tr>\n            <tr><th>Working volume</th><td>100\u20133,500 mL with the 15 mm probe; smaller volumes with the 7 mm probe</td></tr>\n            <tr><th>Enclosure</th><td>Sound cabinet with window and colour LED chamber light</td></tr>\n            <tr><th>Power supply</th><td>220 V, 50\u201360 Hz, 2 A</td></tr>\n            <tr><th>Dimensions</th><td>300 mm wide \u00d7 670 mm high</td></tr>\n            <tr><th>Cabinet colours</th><td>White, green, blue</td></tr>\n          </table>\n        </div>\n      </div>\n      <div style=\"margin-top:clamp(56px,7vw,96px)\">\n        <div class=\"sec-head\">\n          <p class=\"eyebrow\">Real photographs</p>\n          <h2>The UHP-400 from every side</h2>\n          <p>The chamber light shows the run state. On the touchscreen you choose a colour for ready, process, pause, finish and error.</p>\n        </div>\n        <div class=\"ggrid\">\n          <figure><img src=\"%%BASE%%studio-34.webp\" alt=\"UHP-400 three-quarter view with blue chamber light\" width=\"418\" height=\"760\" loading=\"lazy\"><figcaption class=\"cap\">Three-quarter view</figcaption></figure>\n          <figure><img src=\"%%BASE%%studio-front-blue.webp\" alt=\"UHP-400 front view with blue chamber light\" width=\"333\" height=\"760\" loading=\"lazy\"><figcaption class=\"cap\">Front, blue light</figcaption></figure>\n          <figure><img src=\"%%BASE%%studio-front-red.webp\" alt=\"UHP-400 front view with red chamber light\" width=\"339\" height=\"760\" loading=\"lazy\"><figcaption class=\"cap\">Front, red light</figcaption></figure>\n          <figure><img src=\"%%BASE%%studio-back.webp\" alt=\"UHP-400 rear panel with power switch, inlet, fan and connectors\" width=\"332\" height=\"760\" loading=\"lazy\"><figcaption class=\"cap\">Rear panel</figcaption></figure>\n        </div>\n        <div class=\"colours\">\n          <figure><img src=\"%%BASE%%render-white.jpg\" alt=\"UHP-400 cabinet in white, rendered\" loading=\"lazy\"><figcaption>Cabinet colour: white (render)</figcaption></figure>\n          <figure><img src=\"%%BASE%%render-green.jpg\" alt=\"UHP-400 cabinet in green, rendered\" loading=\"lazy\"><figcaption>Cabinet colour: green (render)</figcaption></figure>\n          <figure><img src=\"%%BASE%%render-blue.jpg\" alt=\"UHP-400 cabinet in blue, rendered\" loading=\"lazy\"><figcaption>Cabinet colour: blue (render)</figcaption></figure>\n        </div>\n      </div>\n    </div></div>\n  </section>\n\n  <!-- VALUE -->\n  <section class=\"sec wrap\" id=\"value\" style=\"background:var(--mist);position:relative\">\n    <div class=\"inner\">\n      <div class=\"sec-head\">\n        <p class=\"eyebrow\">The value</p>\n        <h2>What the UHP-400 is worth to your lab</h2>\n      </div>\n      <div class=\"vcols\">\n        <div><h3>University and research labs</h3><ul>\n          <li>A method you can describe exactly in the methods section</li>\n          <li>Repeatable runs from saved settings and run records</li>\n          <li>One instrument for dispersion, emulsions, extraction and lysis</li>\n          <li>Room for new experiments that need controlled cavitation</li>\n        </ul></div>\n        <div><h3>R&amp;D and QC labs in industry</h3><ul>\n          <li>Shorter preparation time per batch</li>\n          <li>Less solvent where ultrasound-assisted methods apply</li>\n          <li>No separate sound box, stand or thermometer to buy</li>\n          <li>Settings that transfer between operators and shifts</li>\n        </ul></div>\n      </div>\n      <div class=\"calc-box\">\n        <form class=\"calc\" id=\"calc\" onsubmit=\"return false\">\n          <h3>Work out your own example</h3>\n          <p class=\"sub\">Type in figures from your own lab. The numbers shown are only an example to start from.</p>\n          <div class=\"fields\">\n            <label for=\"c-batches\">Batches per month<input id=\"c-batches\" type=\"number\" min=\"0\" step=\"1\" value=\"40\" inputmode=\"decimal\"></label>\n            <label for=\"c-hours\">Hours you expect to save per batch<input id=\"c-hours\" type=\"number\" min=\"0\" step=\"0.25\" value=\"1\" inputmode=\"decimal\"></label>\n            <label for=\"c-rate\">Staff cost per hour (\u20ac)<input id=\"c-rate\" type=\"number\" min=\"0\" step=\"1\" value=\"20\" inputmode=\"decimal\"></label>\n            <label for=\"c-solvent\">Solvent you expect to save per batch (\u20ac)<input id=\"c-solvent\" type=\"number\" min=\"0\" step=\"1\" value=\"5\" inputmode=\"decimal\"></label>\n          </div>\n          <div class=\"result\" aria-live=\"polite\">\n            <span>Result of your own figures (batches \u00d7 (hours \u00d7 cost + solvent))</span>\n            <b id=\"c-out\">\u20ac1,000 per month</b>\n            <em>This is your calculation, not a promise from Topsonics.</em>\n          </div>\n          <div class=\"basis\">Why ultrasound can save time and solvent, from published studies:\n            <ul>\n              <li><a href=\"https://doi.org/10.3390/molecules25215142\" target=\"_blank\" rel=\"noopener\">Momchev et al., 2020</a>: higher yields in a shorter time than maceration.</li>\n              <li><a href=\"https://doi.org/10.3390/foods8100466\" target=\"_blank\" rel=\"noopener\">Turrini et al., 2019</a>: pulsed ultrasound extraction with a food-grade solvent.</li>\n            </ul>\n            These studies used their own samples and equipment. The calculator does not use their numbers; it only multiplies the figures you enter.\n          </div>\n          <p class=\"disclaimer\">Illustration only. This calculator is not a quotation, an offer, a performance guarantee or financial advice, and Topsonics does not pay, refund or guarantee any amount shown. Actual time and cost depend on your samples, methods, local prices and how the instrument is used. Topsonics makes no warranty, express or implied, that you will achieve the figures you enter.</p>\n        </form>\n        <div class=\"box\">\n          <h3>In the box</h3>\n          <p>The parts of the instrument that come together, so there is nothing extra to source.</p>\n          <ul>\n            <li><b>01</b>Control head with 5-inch touchscreen</li>\n            <li><b>02</b>Sound cabinet with door, window and LED chamber light</li>\n            <li><b>03</b>Height-adjustable sample table</li>\n            <li><b>04</b>Acoustic stack with a 7 mm or 15 mm titanium probe</li>\n            <li><b>05</b>Built-in temperature sensor</li>\n                      </ul>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- VIEWER, RESEARCH, QUOTE -->\n  <section class=\"paper\">\n    <div class=\"sec wrap\" id=\"try\"><div class=\"inner\">\n      <div class=\"try-head\">\n        <div class=\"sec-head\"><p class=\"eyebrow\">Try it yourself</p><h2>Run the UHP-400 in 3D</h2></div>\n        <p>Open the door, raise the table, swap the probe and press start. On a phone, use the buttons under the model.</p>\n      </div>\n      <div class=\"viewer-slot\" id=\"viewerSlot\"><p class=\"viewer-wait\" id=\"viewerWait\">The 3D viewer loads when you reach it.</p></div>\n    </div></div>\n    <div class=\"wrap research\" style=\"padding-bottom:clamp(56px,7vw,96px)\"><div class=\"inner\">\n      <div class=\"sec-head\"><p class=\"eyebrow\">References</p><h2>Papers cited on this page</h2>\n        <p>All are open access. Figures shown above are used under their CC BY 4.0 licences.</p></div>\n      <ol>\n        <li><a href=\"https://doi.org/10.1007/s11051-016-3597-5\" target=\"_blank\" rel=\"noopener\">Effect of sonication on particle dispersion, administered dose and metal release of non-functionalized, non-inert metal nanoparticles</a><small>Pradhan S. et al. J. Nanoparticle Research 18, 285 (2016)</small></li>\n        <li><a href=\"https://doi.org/10.1186/s12989-025-00627-8\" target=\"_blank\" rel=\"noopener\">Investigating the impact of the dispersion protocol on the physico-chemical identity and toxicity of nanomaterials</a><small>McCormack A. et al. Particle and Fibre Toxicology 22 (2025)</small></li>\n        <li><a href=\"https://doi.org/10.1371/journal.pone.0148023\" target=\"_blank\" rel=\"noopener\">Critical parameters for efficient sonication and improved chromatin immunoprecipitation of high molecular weight proteins</a><small>Pchelintsev N.A., Adams P.D., Nelson D.M. PLoS ONE 11, e0148023 (2016)</small></li>\n        <li><a href=\"https://doi.org/10.3390/molecules25215142\" target=\"_blank\" rel=\"noopener\">Comparison of maceration and ultrasonication for green extraction of phenolic acids from Echinacea purpurea aerial parts</a><small>Momchev P. et al. Molecules 25, 5142 (2020)</small></li>\n        <li><a href=\"https://doi.org/10.3390/foods8100466\" target=\"_blank\" rel=\"noopener\">Pulsed ultrasound-assisted extraction as an alternative method to conventional maceration for the extraction of the polyphenolic fraction of Ribes nigrum buds</a><small>Turrini F. et al. Foods 8, 466 (2019)</small></li>\n        <li><a href=\"https://doi.org/10.1021/acssynbio.3c00312\" target=\"_blank\" rel=\"noopener\">Complex dependence of Escherichia coli-based cell-free expression on sonication energy during lysis</a><small>Piorino F., Styczynski M.P. ACS Synthetic Biology 12 (2023)</small></li>\n      </ol>\n    </div></div>\n    <div class=\"sec wrap\" id=\"quote\" style=\"background:var(--mist)\"><div class=\"inner quote\">\n      <div>\n        <p class=\"eyebrow\">Request a quote</p>\n        <h2 style=\"margin-top:14px\">Tell us about your sample</h2>\n        <p style=\"color:var(--mute);margin-top:16px;max-width:40ch\">We reply with a recommended probe, price and delivery time.</p>\n        <div class=\"contact\"><span>Email <b>info@topsonics.com</b></span><span>WhatsApp <b>+370 663 02479</b></span><span>Phone <b>+370 658 43069</b></span></div>\n      </div>\n      <form class=\"qform\" id=\"qform\">\n        <label for=\"q-sample\">Sample type<input id=\"q-sample\" placeholder=\"e.g. TiO\u2082 in water\"></label>\n        <label for=\"q-vol\">Batch volume (mL)<input id=\"q-vol\" type=\"number\" min=\"0\" inputmode=\"decimal\" placeholder=\"e.g. 250\"></label>\n        <label for=\"q-app\">Application<select id=\"q-app\"><option>Dispersion</option><option>Emulsion</option><option>Extraction</option><option>Cell lysis</option><option>Other</option></select></label>\n        <label for=\"q-country\">Country<input id=\"q-country\"></label>\n        <label for=\"q-org\" class=\"full\">University or company<input id=\"q-org\"></label>\n        <label for=\"q-email\" class=\"full\">Email<input id=\"q-email\" type=\"email\" required></label>\n        <div class=\"full\"><button class=\"btn solid\" type=\"submit\">Request a quote</button></div>\n        <p class=\"qmsg\" id=\"qmsg\" role=\"status\"></p>\n      </form>\n    </div></div>\n    <footer class=\"wrap\"><span>\u00a9 2026 Topsonics \u00b7 Vilnius, Lithuania</span><span>Designed and made in Lithuania, EU</span><span>info@topsonics.com \u00b7 +370 663 02479</span></footer>\n  </section>\n</main>\n\n<div class=\"tag\" id=\"tag\"><i></i><em id=\"tagText\"></em></div>\n<div class=\"fab\" id=\"fab\">\n  <button class=\"fab-main\" id=\"fabMain\" type=\"button\" aria-expanded=\"false\" aria-controls=\"fabList\" aria-label=\"Contact Topsonics\">\n    <svg class=\"chat\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3 6.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm5 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm5 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z\"/></svg>\n    <svg class=\"x\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 6l12 12M18 6L6 18\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\"/></svg>\n  </button>\n  <div class=\"fab-list\" id=\"fabList\">\n    <a class=\"fab-item fab-wa\" href=\"https://wa.me/37066302479?text=Hello%20Topsonics%2C%20I%20am%20interested%20in%20the%20UHP-400.\" target=\"_blank\" rel=\"noopener\"><span>WhatsApp +370 663 02479</span><i><svg viewBox=\"0 0 32 32\" aria-hidden=\"true\"><path fill=\"#fff\" d=\"M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 6.9L3 29l6.5-2c1.9 1 4.1 1.6 6.5 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.8-1.7l-.4-.2-3.9 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.9-3.9-1.9-6C4.9 9.7 9.9 4.9 16 4.9s11.1 4.8 11.1 10.9S22.1 26.4 16 26.4zm6.1-8.1c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.2-.2.3-.4.5-.6.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-1.8-1-2.5-.3-.6-.5-.6-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.6 5.7 4.9 2.8 1.1 3.4.9 4 .8.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.6-.4z\"/></svg></i></a>\n    <a class=\"fab-item fab-mail\" href=\"mailto:info@topsonics.com?subject=UHP-400%20enquiry\"><span>info@topsonics.com</span><i><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#fff\" d=\"M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zm1.4 2L12 12.6l7.6-5.1H4.4zM20 9.3l-7.4 5a1 1 0 0 1-1.1 0L4 9.3V16.5h16V9.3z\"/></svg></i></a>\n    <a class=\"fab-item fab-tel\" href=\"tel:+37065843069\"><span>Call +370 658 43069</span><i><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#fff\" d=\"M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z\"/></svg></i></a>\n  </div>\n</div>\n\n</div>";
  if (!document.getElementById('uhp-fonts')) {
    var l = document.createElement('link'); l.id = 'uhp-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';
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
  var fab = root.getElementById('fab'), fabMain = root.getElementById('fabMain');
  fabMain.addEventListener('click', function () { var o = fab.classList.toggle('open'); fabMain.setAttribute('aria-expanded', o); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && fab.classList.contains('open')) { fab.classList.remove('open'); fabMain.setAttribute('aria-expanded', false); } });
  var eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  function calc() {
    var v = function (id) { var n = parseFloat(root.getElementById(id).value); return isFinite(n) && n > 0 ? n : 0; };
    var m = v('c-batches') * (v('c-hours') * v('c-rate') + v('c-solvent'));
    root.getElementById('c-out').textContent = eur.format(m) + ' per month';
  }
  root.getElementById('calc').addEventListener('input', calc); calc();

  root.getElementById('qform').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = function (id) { return root.getElementById(id).value.trim(); };
    var body = 'Sample type: ' + f('q-sample') + '\nBatch volume (mL): ' + f('q-vol') + '\nApplication: ' + f('q-app') + '\nCountry: ' + f('q-country') + '\nUniversity or company: ' + f('q-org') + '\nReply to: ' + f('q-email');
    var a = document.createElement('a');
    a.href = 'mailto:info@topsonics.com?subject=' + encodeURIComponent('UHP-400 quote request') + '&body=' + encodeURIComponent(body);
    a.click();
    root.getElementById('qmsg').textContent = 'Your email app should open with the request filled in. If it does not, please write to info@topsonics.com or message us on WhatsApp.';
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

  /* ---------- phones get the full 3D too; still images are only a fallback (no WebGL, very low memory, data saver) ---------- */
  var PHONE = matchMedia('(max-width: 640px)').matches && !window.__uhpRenderMode;
  function goSimple() {
    SHELL.classList.remove('p3d'); SHELL.classList.add('simple');
    [].forEach.call(root.querySelectorAll('img[data-shot]'), function (im) { im.loading = 'lazy'; im.src = BASE + 'm-' + im.getAttribute('data-shot') + '.jpg'; });
  }
  var lowEnd = (navigator.deviceMemory && navigator.deviceMemory < 3) || (navigator.connection && navigator.connection.saveData);
  if (PHONE && lowEnd) { goSimple(); return; }
  if (PHONE) SHELL.classList.add('p3d');

  /* ---------- 3D stage ---------- */
  var loadingEl = root.getElementById('loading');
  if (!window.THREE || !THREE.GLTFLoader) { loadingEl.textContent = '3D unavailable, showing photos'; goSimple(); return; }
  var MM = 0.001, D2R = Math.PI / 180;
  var host = root.getElementById('stage');
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (err) { loadingEl.textContent = '3D unavailable, showing photos'; goSimple(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
  var camera = new THREE.PerspectiveCamera(22, 1, 0.05, 30);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8794a3, 0.45));
  var key = new THREE.DirectionalLight(0xffffff, 1.05); key.position.set(-1.2, 2, 1.6); scene.add(key);
  var rim = new THREE.DirectionalLight(0xe4ecff, 0.45); rim.position.set(1.6, 1.2, -1.8); scene.add(rim);
  var ledA = new THREE.PointLight(0x2e58ff, 0, 0.6, 1.6); ledA.position.set(0, 0.19, 0.06); scene.add(ledA);
  var ledB = new THREE.PointLight(0x3466ff, 0, 0.5, 1.6); ledB.position.set(0, -0.08, 0.05); scene.add(ledB);

  var dirty = true;
  function resize() {
    var w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true;
  }
  addEventListener('resize', resize);

  /* screen textures: the device's own screens */
  var tl = new THREE.TextureLoader(), SCR = {};
  ['start', 'power', 'duty', 'time', 'temp', 'running', 'save'].forEach(function (k) {
    var t = tl.load(BASE + k + '.jpg', function () { if (renderer.initTexture) renderer.initTexture(t); dirty = true; }); t.encoding = THREE.sRGBEncoding; t.flipY = false; t.anisotropy = 8; SCR[k] = t;
  });
  var screenMat = new THREE.MeshBasicMaterial({ map: SCR.start, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -24 });

  /* door glass + logo, beaker (same dimensions as the product viewer) */
  function rrect(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  function doorGlass() {
    var g = new THREE.Group();
    var outer = rrect(287.5 * MM, 487.5 * MM, 23 * MM); outer.holes.push(rrect(194 * MM, 394 * MM, 17 * MM));
    frostMat = new THREE.MeshStandardMaterial({ color: 0xe9e5df, roughness: 0.28, metalness: 0 }); frostMat.userData.base = frostMat.color.clone();
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
  function beaker() {
    var g = new THREE.Group(), ro = BK.od / 2;
    var p = [[0, 0], [ro - 3, 0], [ro, 3], [ro, BK.h], [ro + 1.2, BK.h + 1], [ri, BK.h], [ri, BK.floor + 2], [ri - 2, BK.floor], [0, BK.floor]]
      .map(function (v) { return new THREE.Vector2(v[0] * MM, v[1] * MM); });
    var gl = new THREE.Mesh(new THREE.LatheGeometry(p, 72), new THREE.MeshPhysicalMaterial({ color: 0xf2f7ff, roughness: 0.05, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6 }));
    gl.renderOrder = 2; g.add(gl);
    var liq = new THREE.Mesh(new THREE.CylinderGeometry((ri - 0.3) * MM, (ri - 0.3) * MM, liquidH * MM, 64),
      new THREE.MeshStandardMaterial({ color: 0xcfe3ff, roughness: 0.15, transparent: true, opacity: 0.45, depthWrite: false }));
    liq.position.y = (BK.floor + liquidH / 2) * MM; liq.renderOrder = 1; g.add(liq);
    return g;
  }

  /* soft contact shadow under the device */
  var sc = document.createElement('canvas'); sc.width = sc.height = 128; var sx = sc.getContext('2d');
  var sg = sx.createRadialGradient(64, 64, 4, 64, 64, 64); sg.addColorStop(0, 'rgba(0,30,60,0.28)'); sg.addColorStop(1, 'rgba(0,30,60,0)');
  sx.fillStyle = sg; sx.fillRect(0, 0, 128, 128);
  var blob = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2; blob.position.set(0, -0.2505, 0.01); blob.renderOrder = -1; scene.add(blob);

  /* bubbles */
  var NB = 900, bPos = new Float32Array(NB * 3), bVel = new Float32Array(NB * 3), bLife = new Float32Array(NB);
  for (var i = 0; i < NB; i++) bPos[i * 3 + 1] = -10;
  var bGeo = new THREE.BufferGeometry(); bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  var dot = document.createElement('canvas'); dot.width = dot.height = 64; var dx = dot.getContext('2d');
  var rg = dx.createRadialGradient(32, 32, 2, 32, 32, 30); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.45, 'rgba(235,245,255,.85)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  dx.fillStyle = rg; dx.fillRect(0, 0, 64, 64);
  var bubbles = new THREE.Points(bGeo, new THREE.PointsMaterial({ color: 0xdfeeff, size: 0.0025, map: new THREE.CanvasTexture(dot), transparent: true, depthWrite: false }));
  bubbles.frustumCulled = false; bubbles.renderOrder = 6;

  /* ---------- model ---------- */
  var PROBE_TIP = { 7: 64.0, 15: 77.5 }, TIP_R = { 7: 3.5, 15: 7.5 }, TABLE_UP = 0.136;
  var model = null, N = {}, doorPivot, backPivot, BACK_C = new THREE.Vector3(0, 0.19, -0.143), chamberMat = null;
  var HINGE = new THREE.Vector3(-150 * MM, 0, 158 * MM);
  /* fade groups: every material belongs to exactly one group, so a group can fade on its own */
  var FADE = {}, fadeNow = {};
  var colorMats = { body: [], head: [] }, frostMat = null;
  var OPTS = [ { body: null, head: null }, { body: 0x9bff9c, head: 0x66ff66 }, { body: 0x00ccff, head: 0x00aff0 } ];
  var cA = new THREE.Color(), cB = new THREE.Color(), cW = new THREE.Color(1, 1, 1);
  function optColor(i, part, base, out) { var h = OPTS[i][part]; if (h === null) return out.copy(base); return out.setHex(h).convertSRGBToLinear(); }
  function collect(name, root) {
    var list = [];
    root.traverse(function (o) {
      if (!o.isMesh && !o.isPoints) return;
      if (o === bubbles) return;
      var m = o.material;
      if (m.userData.group && m.userData.group !== name) { m = m.clone(); o.material = m; }
      m.userData.group = name;
      if (m.userData.baseOpacity === undefined) { m.userData.baseOpacity = m.opacity; m.userData.baseTransparent = m.transparent; m.userData.baseDepthWrite = m.depthWrite; }
      if (list.indexOf(m) < 0) list.push(m);
    });
    FADE[name] = list; fadeNow[name] = 1;
  }
  function setFade(name, a) {
    if (a > 0.985) a = 1;
    if (fadeNow[name] === a) return;
    fadeNow[name] = a;
    FADE[name].forEach(function (m) {
      var solid = a > 0.995;
      var tr = solid ? m.userData.baseTransparent : true;
      if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
      m.opacity = m.userData.baseOpacity * (solid ? 1 : a);
      m.depthWrite = solid ? m.userData.baseDepthWrite : false;
    });
  }

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
      if (mk === 'white' || mk === 'whiteint' || mk === 'head') o.material.color.multiplyScalar(0.9);
      if (mk === 'chamber') { chamberMat = o.material; o.material.envMapIntensity = 0; o.material.emissive = new THREE.Color(0x0d2cff); o.material.emissiveIntensity = 0; }
      if (o.name === 'screen') o.material = screenMat;
      if (o.name === 'body__white' || o.name === 'door__white') { o.material.userData.base = o.material.color.clone(); colorMats.body.push(o.material); }
      if (o.name === 'head__head') { o.material.userData.base = o.material.color.clone(); colorMats.head.push(o.material); }
    });
    ['body', 'door', 'table', 'probe7', 'probe15', 'head', 'stack', 'back'].forEach(function (n) { N[n] = model.getObjectByName(n); });
    doorPivot = new THREE.Group(); doorPivot.position.copy(HINGE); model.add(doorPivot);
    N.door.position.sub(HINGE); doorPivot.add(N.door);
    var dg = doorGlass(); dg.position.sub(HINGE); doorPivot.add(dg);
    backPivot = new THREE.Group(); backPivot.position.copy(BACK_C); model.add(backPivot);
    N.back.position.sub(BACK_C); backPivot.add(N.back);
    N.table.add(beaker()); N.table.children[N.table.children.length - 1].position.set(0, -98 * MM, 39.5 * MM);
    N.probe15.visible = false;
    collect('head', N.head); collect('stack', N.stack); collect('probe7', N.probe7); collect('probe15', N.probe15);
    collect('door', doorPivot); collect('table', N.table); collect('body', N.body); collect('back', backPivot);
    model.add(bubbles);
    scene.add(model);
    loadingEl.hidden = true;
    root.getElementById('heroFallback').classList.add('gone');
    dirty = true;
  }, undefined, function (err) { loadingEl.textContent = '3D model could not load'; console.error(err); goSimple(); });

  /* ---------- scroll choreography ----------
     One state per text step; between steps the state is interpolated. The camera stays in front of the device.
     az/el degrees, dist metres, t = camera target, door/table/run/lift/ex 0..1,
     swap = alternate 7/15 mm probes, scrs = screens to cycle, fo = part in focus (others fade). */
  var C = [0, 0.09, 0], LCD = [0, 0.336, 0.104];
  var SCENES = {
    hero: [ { az: 0, el: 7, dist: 2.35, t: C, hero: 1, table: 0.6, scrs: ['start', 'power', 'duty', 'time', 'temp', 'running'] } ],
    solution: [
      { az: 6, el: 8, dist: 2.25, t: C },
      { az: 16, el: 8, dist: 2.05, t: C, door: 1 },
      { az: 14, el: 6, dist: 1.8, t: [0, 0.04, 0.03], door: 1, table: 1 },
      { az: 12, el: 3, dist: 1.05, t: [0, 0.1, 0.04], door: 1, table: 1, ptag: 1 },
      { az: 14, el: 3, dist: 1.05, t: [0, 0.09, 0.04], door: 1, table: 1, p15: 1, ptag: 1 },
      { az: 3, el: 9, dist: 0.6, t: LCD, table: 1, run: 1, scrs: ['duty', 'temp'] },
      { az: 3, el: 9, dist: 0.6, t: LCD, table: 1, scr: 'save' }
    ],
    explode: [
      { az: 8, el: 9, dist: 2.4, t: [0, 0.1, 0] },
      { az: 12, el: 7, dist: 1.25, t: [0, 0.37, 0.05], fo: 'head', lift: 1 },
      { az: 16, el: 4, dist: 1.25, t: [0, 0.18, 0.04], fo: 'stack' },
      { az: 22, el: 6, dist: 1.95, t: [-0.04, 0.05, 0.12], fo: 'door', door: 0.35 },
      { az: 14, el: 14, dist: 1.45, t: [0, 0.0, 0.05], fo: 'table', table: 0.6 },
      { az: 18, el: 8, dist: 2.2, t: [0, 0.06, 0], fo: 'body' },
      { az: 10, el: 6, dist: 2.2, t: [0.15, 0.13, 0.04], fo: 'back', ex: 1 },
      { az: 8, el: 8, dist: 2.35, t: C }
    ]
  };
  var NUM = ['az', 'el', 'dist', 'door', 'table', 'run', 'ex', 'lift', 'p15', 'hero', 'ptag'];
  var DEF = { az: 0, el: 0, dist: 2, t: C, door: 0, table: 0, run: 0, ex: 0, lift: 0, p15: 0, hero: 0, ptag: 0, scr: 'start', scrs: null, fo: null };
  Object.keys(SCENES).forEach(function (k) { SCENES[k] = SCENES[k].map(function (s) { var o = {}; for (var d in DEF) o[d] = s[d] !== undefined ? s[d] : DEF[d]; return o; }); });

  var BACK_EX = [0.36, -0.02, 0.12];
  var ANCHOR = {
    head: { p: [0.06, 0.38, 0.11], g: 'head', label: 'Control head' },
    stack: { p: [0.02, 0.2, 0.04], g: 'stack', label: 'Acoustic stack and probe' },
    door: { p: [0.14, 0.12, 0.16], g: 'door', label: 'Door with window' },
    table: { p: [0.09, -0.12, 0.12], g: 'table', label: 'Sample table' },
    body: { p: [0.15, -0.12, 0.08], g: 'body', label: 'Sound cabinet' },
    back: { p: [0.08, 0.18, -0.15], g: 'back', label: 'Rear panel' }
  };

  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var smooth = function (t) { return t * t * (3 - 2 * t); };
  function mix(a, b, t) {
    var s = smooth(t), o = {};
    NUM.forEach(function (k) { o[k] = lerp(a[k], b[k], s); });
    o.t = [0, 1, 2].map(function (i) { return lerp(a.t[i], b.t[i], s); });
    var near = t < 0.5 ? a : b;
    o.scr = near.scr; o.scrs = near.scrs; o.fo = near.fo;
    return o;
  }
  var sections = [].slice.call(root.querySelectorAll('[data-scene]'));
  var forced = null;
  window.__uhpForce = function (name, i) { forced = { st: JSON.parse(JSON.stringify(SCENES[name][i])), vis: 1, name: name }; smoothState = null; dirty = true; };
  function currentState() {
    if (forced) return forced;
    var vh = innerHeight, best = null;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= vh) continue;
      var list = SCENES[sections[i].dataset.scene], n = list.length, st;
      if (n === 1) st = list[0];
      else {
        var span = Math.max(1, r.height - vh), p = Math.min(1, Math.max(0, -r.top / span));
        var f = p * (n - 1), k = Math.min(n - 2, Math.floor(f));
        /* hold each state for the middle of its step, move between steps */
        var hold = 0.3, tt = Math.min(1, Math.max(0, (f - k - hold) / (1 - 2 * hold)));
        st = mix(list[k], list[k + 1], tt);
      }
      var vis = (Math.min(vh, r.bottom) - Math.max(0, r.top)) / vh;
      if (!best || vis > best.vis) best = { st: st, vis: vis, name: sections[i].dataset.scene };
    }
    return best;
  }

  var tag = root.getElementById('tag'), tagText = root.getElementById('tagText');
  var tmpV = new THREE.Vector3();
  var clock = 0, lastT = performance.now(), curScr = 'start', smoothState = null;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GROUPS = ['head', 'stack', 'probe7', 'probe15', 'door', 'table', 'body', 'back'];

  function apply(st, dt, name) {
    if (!model) return false;
    var narrow = innerWidth <= 640, w = innerWidth, h = innerHeight, fit;
    var T = forced || reduce ? 0 : clock;
    if (forced) { camera.clearViewOffset(); fit = 1.12 * Math.max(1, 0.95 / camera.aspect); }
    else if (narrow) { camera.setViewOffset(w, h, 0, h * 0.17, w, h); fit = Math.max(1.15, 0.78 / camera.aspect); }
    else { camera.setViewOffset(w, h, -w * (w < 1000 ? 0.24 : 0.2), -h * 0.02, w, h); fit = Math.max(1.12, 0.66 / camera.aspect); }

    /* slow motion only: the hero swings left and right in front; every other view breathes a few degrees */
    var az = st.az + st.hero * 16 * Math.sin(T * 0.35) + (1 - st.hero) * 2.5 * Math.sin(T * 0.45);
    var el = st.el + 0.8 * Math.sin(T * 0.3);
    var d = st.dist * fit * (narrow ? 1 + 0.22 * (1 - st.hero) : 1);
    camera.position.set(
      st.t[0] + d * Math.sin(az * D2R) * Math.cos(el * D2R),
      st.t[1] + d * Math.sin(el * D2R),
      st.t[2] + d * Math.cos(az * D2R) * Math.cos(el * D2R));
    camera.lookAt(st.t[0], st.t[1], st.t[2]);

    /* parts */
    var table = st.table + st.hero * 0.22 * Math.sin(T * 0.6);
    N.table.position.y = table * TABLE_UP;
    doorPivot.rotation.y = -100 * D2R * st.door;
    N.head.position.y = 0.035 * st.lift;
    backPivot.position.set(BACK_C.x + BACK_EX[0] * st.ex, BACK_C.y + BACK_EX[1] * st.ex, BACK_C.z + BACK_EX[2] * st.ex);
    backPivot.rotation.y = Math.PI * smooth(Math.min(1, st.ex));
    var use15 = st.hero > 0.5 ? Math.floor(T / 3.2) % 2 === 1 : st.p15 > 0.5;
    /* colour options cycle in the hero: white, green, blue */
    var ph = T / 4.5, ia = Math.floor(ph) % 3, ib = (ia + 1) % 3, fr = smooth(Math.min(1, Math.max(0, (ph - Math.floor(ph) - 0.7) / 0.3)));
    var hw = st.hero;
    if (hw > 0.001 || colorMats.dirty) {
      ['body', 'head'].forEach(function (part) {
        colorMats[part].forEach(function (m) { var b = m.userData.base; optColor(ia, part, b, cA); optColor(ib, part, b, cB); cA.lerp(cB, fr); m.color.copy(b).lerp(cA, hw); });
      });
      if (frostMat) { var fb = frostMat.userData.base; optColor(ia, 'body', fb, cA); optColor(ib, 'body', fb, cB); cA.lerp(cB, fr); if (OPTS[ia].body !== null || OPTS[ib].body !== null) cA.lerp(cW, 0.25); frostMat.color.copy(fb).lerp(cA, hw); }
      colorMats.dirty = hw > 0.001;
    }
    N.probe7.visible = !use15; N.probe15.visible = use15;

    /* fade everything except the part in focus */
    var e = forced ? 1 : 1 - Math.pow(0.02, dt);
    GROUPS.forEach(function (g) {
      var inFocus = !st.fo || g === st.fo || (st.fo === 'stack' && (g === 'probe7' || g === 'probe15'));
      var target = inFocus ? 1 : 0.07;
      var next = fadeNow[g] + (target - fadeNow[g]) * e;
      setFade(g, Math.abs(next - target) < 0.006 ? target : next);
    });
    blob.material.opacity = st.fo ? 0.35 : 1;

    /* chamber light and screen */
    var run = st.run;
    var c = new THREE.Color(0x2e58ff);
    ledA.color.copy(c); ledB.color.copy(c);
    ledA.intensity = 1 + run * 5.5; ledB.intensity = 0.6 + run * 3;
    if (chamberMat) { chamberMat.color.setRGB(0.88, 0.9, 0.93).lerp(new THREE.Color(0x2e58ff).multiplyScalar(0.55), 0.25 + run * 0.7);
      chamberMat.emissive.copy(c).convertSRGBToLinear(); chamberMat.emissiveIntensity = 0.18 + run * 0.6; }
    var scr = st.scrs ? st.scrs[forced ? 0 : Math.floor(T / 2.4) % st.scrs.length] : st.scr;
    if (scr !== curScr && SCR[scr]) { curScr = scr; screenMat.map = SCR[scr]; }

    /* bubbles at the probe tip while running */
    var probe = use15 ? 15 : 7;
    var tipY = PROBE_TIP[probe] * MM, cz = 39.5 * MM, tr = TIP_R[probe] * MM;
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
    return true;
  }

  function putTag(px, py) {
    tag.classList.remove('flip');
    var wTag = tag.offsetWidth, x = px - 6;
    if (x + wTag > innerWidth - 8) { tag.classList.add('flip'); x = px + 6 - wTag; }
    tag.style.transform = 'translate(' + Math.round(Math.max(4, x)) + 'px,' + Math.round(py - 6) + 'px)';
  }
  function placeTag(st, name) {
    if (st && name === 'solution' && st.ptag > 0.5 && model) {
      var big = N.probe15.visible, node = big ? N.probe15 : N.probe7;
      model.updateMatrixWorld(true);
      tmpV.set(big ? 0.009 : 0.005, (big ? 0.0775 : 0.064) + 0.03, 0.0395); node.localToWorld(tmpV); tmpV.project(camera);
      var px = (tmpV.x * 0.5 + 0.5) * innerWidth, py = (-tmpV.y * 0.5 + 0.5) * innerHeight;
      tag.classList.add('probe');
      var html = big ? '<b>Ø 15 mm</b>titanium probe · 100–3,500 mL' : '<b>Ø 7 mm</b>titanium probe · small volumes';
      if (tagText.innerHTML !== html) tagText.innerHTML = html;
      putTag(px, py); tag.classList.add('on'); return;
    }
    tag.classList.remove('probe');
    var a = st && st.fo && ANCHOR[st.fo];
    if (!a || !model) { tag.classList.remove('on'); return; }
    model.updateMatrixWorld(true);
    tmpV.set(a.p[0], a.p[1], a.p[2]); N[a.g].localToWorld(tmpV);
    tmpV.project(camera);
    if (tmpV.z > 1) { tag.classList.remove('on'); return; }
    var x = (tmpV.x * 0.5 + 0.5) * innerWidth, y = (-tmpV.y * 0.5 + 0.5) * innerHeight;
    if (tagText.textContent !== a.label) tagText.textContent = a.label;
    putTag(x, y); tag.classList.add('on');
  }

  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    if (window.__uhpFreeze) return;
    var cur = currentState();
    if (!cur) { tag.classList.remove('on'); return; }   /* no 3D section on screen: skip rendering */
    clock += dt;
    var st = cur.st;
    /* ease toward the scroll target so wheel steps feel smooth */
    if (!smoothState || reduce || forced) smoothState = JSON.parse(JSON.stringify(st));
    else {
      var e = 1 - Math.pow(0.004, dt);
      NUM.forEach(function (k) { smoothState[k] += (st[k] - smoothState[k]) * e; });
      for (var i = 0; i < 3; i++) smoothState.t[i] += (st.t[i] - smoothState.t[i]) * e;
      smoothState.scr = st.scr; smoothState.scrs = st.scrs; smoothState.fo = st.fo;
    }
    if (apply(smoothState, dt, cur.name)) renderer.render(scene, camera);
    placeTag(cur.name === 'explode' || cur.name === 'solution' ? smoothState : null, cur.name);
  }
  resize();
  requestAnimationFrame(frame);
})();

  }
  function mountAll() { [].forEach.call(document.querySelectorAll('[data-uhp-page]'), mount); }
  window.UHPPage = { mountAll: mountAll };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll); else mountAll();
})();
