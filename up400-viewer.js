/*! Topsonics UP-400 interactive 3D viewer · v2
 * Mounts into every element with [data-up400-viewer]. Needs THREE r128 + GLTFLoader + OrbitControls + RoomEnvironment
 * loaded first. Assets are read from the folder this script is served from, or from data-base on the element.
 * Optional attributes: data-model (default device.glb), data-order-url (default: e-mail quote request). */
(function () {
  'use strict';
  var SCRIPT_BASE = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '');

  var ICON = {
    door: '<path d="M5 3h10v18H5z M15 6l4-1.5v15L15 21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12.5" cy="12" r="1" fill="currentColor"/>',
    up: '<path d="M12 5l7 8h-4.5v6h-5v-6H5z" fill="currentColor"/>',
    down: '<path d="M12 19l-7-8h4.5V5h5v6H19z" fill="currentColor"/>',
    light: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    sound: '<path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    mute: '<path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    probe: '<path d="M9 2h6v5l-1.5 2v13h-3V9L9 7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>',
    home: '<path d="M4 11l8-7 8 7v9h-5.5v-5.5h-5V20H4z" fill="currentColor"/>',
    full: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    chev: '<path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    grip: '<circle cx="9" cy="7" r="1.3"/><circle cx="15" cy="7" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="17" r="1.3"/><circle cx="15" cy="17" r="1.3"/>',
    rotate: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  function svg(name, cls) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + ' fill="currentColor">' + ICON[name] + '</svg>'; }

  var CSS = `
:host{display:block;font-family:inherit;color:#e8eef5;-webkit-tap-highlight-color:transparent}
*{box-sizing:border-box}
.stage{position:relative;height:680px;background:#dfe4ea;border-radius:16px;overflow:hidden;user-select:none;-webkit-user-select:none}
.narrow .stage{height:min(80vh,620px);min-height:520px}
:host(:fullscreen) .stage,:host(:-webkit-full-screen) .stage{height:100vh;border-radius:0}
.stage canvas{display:block;width:100%;height:100%;cursor:grab;outline:none;touch-action:none}
.stage canvas:active{cursor:grabbing}
.overlay{position:absolute;inset:0;display:grid;place-items:center;color:#334155;font:600 13px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.08em;pointer-events:none}
[hidden]{display:none!important}
.glass{background:rgba(22,28,36,.84);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);border:1px solid rgba(255,255,255,.1);box-shadow:0 10px 30px rgba(15,23,42,.28),inset 0 1px 0 rgba(255,255,255,.06)}
button{font:inherit;color:inherit;cursor:pointer}
button:focus-visible,.file:focus-within{outline:2px solid #60a5fa;outline-offset:2px}
svg{width:18px;height:18px;flex:none}

/* properties panel */
.panel{position:absolute;left:14px;top:14px;width:290px;max-height:calc(100% - 28px);display:flex;flex-direction:column;border-radius:14px;overflow:hidden;z-index:3}
.p-head{display:flex;align-items:center;gap:8px;padding:10px 10px 10px 12px;cursor:move;touch-action:none;border-bottom:1px solid rgba(255,255,255,.08)}
.p-head .grip{width:16px;height:16px;color:#7b8a9c}
.p-title{flex:1;min-width:0;font-weight:600;font-size:14px;letter-spacing:.01em}
.p-title small{display:block;font-weight:400;font-size:11.5px;color:#93a3b8;margin-top:1px}
.p-tog{border:0;background:rgba(255,255,255,.06);border-radius:8px;width:30px;height:30px;display:grid;place-items:center;transition:transform .2s}
.panel.collapsed .p-tog{transform:rotate(-90deg)}
.panel.collapsed .p-body{display:none}
.p-body{overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#3a4656 transparent}
.sec{border-bottom:1px solid rgba(255,255,255,.07)}
.sec:last-child{border-bottom:0}
.sec-h{width:100%;display:flex;align-items:center;gap:8px;padding:11px 14px;border:0;background:none;text-align:start;font-size:12px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:#a9b7c9}
.sec-h svg{width:16px;height:16px;margin-inline-start:auto;transition:transform .2s;color:#6f7f93}
.sec.closed .sec-h svg{transform:rotate(-90deg)}
.sec.closed .sec-b{display:none}
.sec-b{padding:0 14px 14px;display:flex;flex-direction:column;gap:10px}
.row{display:flex;gap:6px;flex-wrap:wrap}
.btn{flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:13.5px;padding:8px 10px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);transition:background .15s,border-color .15s}
.btn:hover{background:rgba(255,255,255,.1)}
.btn[aria-pressed="true"]{background:#2563eb;border-color:#3b82f6;color:#fff}
.btn:disabled{opacity:.35;cursor:default}
.btn svg{width:15px;height:15px}
.swatches{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.sw{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 4px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);font-size:12.5px}
.sw i{width:34px;height:34px;border-radius:50%;display:block;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
.sw[aria-pressed="true"]{border-color:#3b82f6;background:rgba(37,99,235,.18)}
.kv{display:grid;grid-template-columns:1fr auto;gap:5px 10px;font-size:13px;margin:0}
.kv dt{color:#93a3b8}
.kv dd{margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-variant-numeric:tabular-nums;text-align:end}
.gauge{height:5px;border-radius:3px;background:rgba(255,255,255,.1);overflow:hidden}
.gauge i{display:block;height:100%;background:linear-gradient(90deg,#3b82f6,#60a5fa);width:0;transition:width .3s}
.note{margin:0;font-size:12.5px;line-height:1.45;color:#a9b7c9}
.note.good{color:#4ade80}
.note.warn{color:#fbbf24}
.scr-name{font-weight:600;font-size:14px;color:#fff}
.chips{display:flex;flex-wrap:wrap;gap:5px}
.chip{font-size:12px;padding:5px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04)}
.chip[aria-pressed="true"]{background:#2563eb;border-color:#3b82f6;color:#fff}
.file{position:relative;display:flex;border-radius:9px}
.file input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}
.file span{flex:1;text-align:center;font-size:13px;padding:8px 10px;border-radius:9px;border:1px dashed rgba(255,255,255,.22);color:#cbd5e1}

/* view cube + tools */
.tools{position:absolute;right:8px;top:6px;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:2}
.vc{width:104px;height:104px;perspective:420px;position:relative}
.cube{position:absolute;left:22px;top:22px;width:60px;height:60px;transform-style:preserve-3d}
.f{position:absolute;inset:0;display:grid;place-items:center;font:700 9px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.06em;color:#334155;background:rgba(248,250,252,.9);border:1.5px solid #94a3b8;cursor:pointer;backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:background .15s}
.f:hover{background:#bfdbfe;color:#1e3a8a}
.f.front{transform:translateZ(30px)}.f.back{transform:rotateY(180deg) translateZ(30px)}
.f.right{transform:rotateY(90deg) translateZ(30px)}.f.left{transform:rotateY(-90deg) translateZ(30px)}
.f.top{transform:rotateX(90deg) translateZ(30px)}.f.bottom{transform:rotateX(-90deg) translateZ(30px)}
.tbtn{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;border:0}
.tbtn[aria-pressed="true"]{background:#2563eb;color:#fff}
.tgroup{display:flex;flex-direction:column;border-radius:12px;overflow:hidden}
.tgroup .tbtn{border-radius:0;background:none}
.tgroup .tbtn:hover{background:rgba(255,255,255,.08)}
.tgroup .tbtn+.tbtn{border-top:1px solid rgba(255,255,255,.08)}

/* radial dial */
.dial{position:absolute;right:18px;bottom:46px;width:184px;height:184px;border-radius:50%;z-index:3;touch-action:none;cursor:move}
.dial::before{content:"";position:absolute;inset:50px;border-radius:50%;border:1px dashed rgba(255,255,255,.12);pointer-events:none}
.d-btn{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);transition:background .15s,transform .15s}
.d-btn:hover{background:rgba(255,255,255,.14)}
.d-btn[aria-pressed="true"]{background:#2563eb;border-color:#60a5fa;color:#fff}
.d-btn svg{width:19px;height:19px}
.d-run{width:66px;height:66px;margin:-33px 0 0 -33px;background:linear-gradient(160deg,#3b82f6,#1d4ed8);border:2px solid rgba(255,255,255,.25);color:#fff;box-shadow:0 6px 18px rgba(37,99,235,.45)}
.d-run:hover{background:linear-gradient(160deg,#60a5fa,#2563eb)}
.d-run svg{width:28px;height:28px}
.d-run.on{background:linear-gradient(160deg,#f59e0b,#d97706);box-shadow:0 6px 18px rgba(217,119,6,.45)}
.d-lab{position:absolute;left:0;right:0;bottom:-24px;text-align:center;font-size:11.5px;color:#334155;font-weight:600;pointer-events:none;text-shadow:0 1px 0 rgba(255,255,255,.6)}

/* caption, toast, hint */
.cap{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);max-width:min(560px,calc(100% - 260px));padding:8px 14px;border-radius:12px;font-size:13px;line-height:1.4;color:#e8eef5;z-index:1;text-align:center}
.cap b{color:#fff}
.toast{position:absolute;left:50%;top:14px;transform:translate(-50%,-8px);max-width:calc(100% - 220px);padding:8px 14px;border-radius:999px;font-size:13px;opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;z-index:4;text-align:center}
.toast.on{opacity:1;transform:translate(-50%,0)}
.narrow .panel{width:auto;right:14px;max-height:calc(100% - 120px)}
.narrow .tools{top:76px}
.narrow .vc{width:80px;height:80px}
.narrow .cube{left:17px;top:17px;width:46px;height:46px}
.narrow .f{font-size:7px}
.narrow .f.front{transform:translateZ(23px)}.narrow .f.back{transform:rotateY(180deg) translateZ(23px)}
.narrow .f.right{transform:rotateY(90deg) translateZ(23px)}.narrow .f.left{transform:rotateY(-90deg) translateZ(23px)}
.narrow .f.top{transform:rotateX(90deg) translateZ(23px)}.narrow .f.bottom{transform:rotateX(-90deg) translateZ(23px)}
.narrow .dial{transform:scale(.72);transform-origin:100% 100%;right:8px;bottom:30px}
.narrow .cap{display:none}
.narrow .toast{max-width:calc(100% - 28px);width:max-content;top:74px;border-radius:12px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

  var HTML = `
<div class="wrap">
 <div class="stage" data-r="stage">
  <div class="overlay" data-r="loading">LOADING 3D MODEL…</div>

  <div class="panel glass" data-r="panel">
   <div class="p-head" data-r="phead">
    ${svg('grip', 'grip')}
    <div class="p-title">UP-400 Ultrasonic Homogenizer<small>Drag to move · tap to open or close</small></div>
    <button class="p-tog" data-r="ptog" aria-label="Collapse panel" aria-expanded="true">${svg('chev')}</button>
   </div>
   <div class="p-body">
    <div class="sec" data-sec="color">
     <button class="sec-h">Color ${svg('chev')}</button>
     <div class="sec-b">
      <div class="swatches">
       <button class="sw" data-color="white" aria-pressed="true"><i style="background:linear-gradient(135deg,#f4f2ee 50%,#e9e6e1 50%)"></i>White</button>
       <button class="sw" data-color="green" aria-pressed="false"><i style="background:linear-gradient(135deg,#66ff66 50%,#9bff9c 50%)"></i>Green</button>
       <button class="sw" data-color="blue" aria-pressed="false"><i style="background:linear-gradient(135deg,#00aff0 50%,#00ccff 50%)"></i>Blue</button>
      </div>
     </div>
    </div>
    <div class="sec" data-sec="screen">
     <button class="sec-h">Touchscreen ${svg('chev')}</button>
     <div class="sec-b">
      <div class="scr-name" data-r="scrname">Home</div>
      <p class="note" data-r="scrdesc">Tap START to set up a run.</p>
      <div class="chips" data-r="chips"></div>
      <label class="file"><input type="file" accept="image/*" data-r="upload"><span>Put your own image on the screen…</span></label>
     </div>
    </div>
    <div class="sec closed" data-sec="table">
     <button class="sec-h">Sample table ${svg('chev')}</button>
     <div class="sec-b">
      <div class="row">
       <button class="btn" data-r="up">${svg('up')}Raise</button>
       <button class="btn" data-r="down">${svg('down')}Lower</button>
      </div>
      <div class="gauge" aria-hidden="true"><i data-r="gauge"></i></div>
      <dl class="kv">
       <dt>Notch</dt><dd data-r="notch">–</dd>
       <dt>Tip immersion</dt><dd data-r="immersion">–</dd>
       <dt>Tip to beaker floor</dt><dd data-r="floor">–</dd>
      </dl>
      <p class="note" data-r="advice">The table locks into the rack every 8.5 mm.</p>
     </div>
    </div>
    <div class="sec closed" data-sec="probe">
     <button class="sec-h">Probe ${svg('chev')}</button>
     <div class="sec-b">
      <div class="row">
       <button class="btn" data-probe="7" aria-pressed="true">7 mm tip</button>
       <button class="btn" data-probe="15" aria-pressed="false">15 mm tip</button>
      </div>
      <p class="note">Ti-6Al-4V titanium. Sample: 300 mL in a 400 mL beaker.</p>
     </div>
    </div>
    <div class="sec closed" data-sec="scene">
     <button class="sec-h">Scene ${svg('chev')}</button>
     <div class="sec-b">
      <div class="row">
       <button class="btn" data-scene="lab" aria-pressed="true">Lab bench</button>
       <button class="btn" data-scene="studio" aria-pressed="false">Studio</button>
      </div>
      <p class="note">Demo runs 10× faster than real time. Temperatures and energy are simulated for 300 mL of water.</p>
     </div>
    </div>
   </div>
  </div>

  <div class="tools">
   <div class="vc" title="Click a face to look from that side"><div class="cube" data-r="cube">
    <div class="f front" data-face="front">FRONT</div><div class="f back" data-face="back">BACK</div>
    <div class="f right" data-face="right">RIGHT</div><div class="f left" data-face="left">LEFT</div>
    <div class="f top" data-face="top">TOP</div><div class="f bottom" data-face="bottom">BOTTOM</div>
   </div></div>
   <div class="tgroup glass">
    <button class="tbtn" data-r="home" aria-label="Isometric view" title="Isometric view">${svg('home')}</button>
    <button class="tbtn" data-r="spin" aria-label="Auto-rotate" aria-pressed="false" title="Auto-rotate">${svg('rotate')}</button>
    <button class="tbtn" data-r="full" aria-label="Full screen" title="Full screen">${svg('full')}</button>
   </div>
  </div>

  <div class="dial glass" data-r="dial" title="Drag the dial anywhere">
   <button class="d-btn d-run" data-r="run" aria-label="Start ultrasound">${svg('play')}</button>
   <button class="d-btn" data-a="door" aria-label="Open or close the door" title="Door" aria-pressed="false">${svg('door')}</button>
   <button class="d-btn" data-a="up" aria-label="Raise table" title="Raise table">${svg('up')}</button>
   <button class="d-btn" data-a="light" aria-label="Chamber light" title="Chamber light" aria-pressed="true">${svg('light')}</button>
   <button class="d-btn" data-a="sound" aria-label="Sound" title="Sound" aria-pressed="true">${svg('sound')}</button>
   <button class="d-btn" data-a="down" aria-label="Lower table" title="Lower table">${svg('down')}</button>
   <button class="d-btn" data-a="probe" aria-label="Swap probe" title="Swap probe">${svg('probe')}</button>
   <div class="d-lab" data-r="dlab">Press ▶ to start</div>
  </div>

  <div class="cap glass" data-r="cap"><b>Home.</b> Tap START on the screen, or press ▶ on the dial.</div>
  <div class="toast glass" data-r="toast"></div>
 </div>
</div>`;

  var SCREENS = {
    start:      { name: 'Home', desc: 'Tap START to set up a run, or Turn Off to shut down.' },
    power:      { name: 'Power', desc: 'Set the output from 0 to 400 W. Tap the ring to choose a value, then press Play.' },
    duty:       { name: 'Duty cycle', desc: 'The share of each 15-second period that the ultrasound is on. Pulsing keeps heat down.' },
    time:       { name: 'Total time', desc: 'Run length in minutes, up to 30 per cycle.' },
    temp:       { name: 'Maximum temperature', desc: 'When the sample reaches this limit, the run stops with an alarm.' },
    running:    { name: 'Running', desc: 'Live power, energy, temperature and time. Use Power UP and DOWN to adjust.' },
    pause:      { name: 'Paused', desc: 'The sample record so far. Resume or stop the run.' },
    end:        { name: 'End of process', desc: 'Sample record with code, volume, energy, power and time. Run again or stop.' },
    alarm:      { name: 'Temperature limit', desc: 'The sample reached the maximum temperature. Continue or stop the run.' },
    off:        { name: 'Turn off', desc: 'Confirm to shut the device down.' },
    allset:     { name: 'All set', desc: 'The device is ready to be switched off.' },
    black:      { name: 'Screen off', desc: 'Tap the screen to start the device again.' },
    'set-user': { name: 'Settings · User', desc: 'User name and project are kept with each sample record.' },
    'set-light':{ name: 'Settings · Light', desc: 'Tap a color bar to choose the chamber light for each state.' },
    custom:     { name: 'Your image', desc: 'Your own image on the touchscreen.' }
  };
  var CHIP_ORDER = ['start', 'power', 'duty', 'time', 'temp', 'running', 'pause', 'end', 'alarm', 'set-light', 'set-user', 'off'];
  var COLORS = {
    white: { body: null, head: null, name: 'White' },
    green: { body: 0x9bff9c, head: 0x66ff66, name: 'Green' },
    blue:  { body: 0x00ccff, head: 0x00aff0, name: 'Blue' }
  };

  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('up400-' + k)); localStorage.setItem('up400-' + k, JSON.stringify(v)); } catch (_) { return null; } }

  function Viewer(host) {
    var THREE = window.THREE;
    var BASE = host.hasAttribute('data-base') ? host.getAttribute('data-base') : SCRIPT_BASE;
    var MODEL = host.getAttribute('data-model') || 'device.glb';
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    root.innerHTML = '<style>' + CSS + '</style>' + HTML;
    var R = function (n) { return root.querySelector('[data-r="' + n + '"]'); };
    var all = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
    var wrap = root.querySelector('.wrap'), stage = R('stage');

    new ResizeObserver(function () { wrap.classList.toggle('narrow', host.clientWidth < 700); }).observe(host);
    if (host.clientWidth < 700) R('panel').classList.add('collapsed');

    var started = false, io = null;
    function go() { if (started) return; started = true; if (io) io.disconnect();
      try { start(); } catch (err) { console.error('UP-400 viewer:', err); R('loading').hidden = false; R('loading').textContent = 'VIEWER ERROR: ' + (err && err.message || err); } }
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) go(); }, { rootMargin: '300px' });
      io.observe(host);
    }
    setTimeout(go, 2500);

    function start() {
      var MM = 0.001;
      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      stage.prepend(renderer.domElement);
      var canvas = renderer.domElement;

      var scene = new THREE.Scene();
      var pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;

      var camera = new THREE.PerspectiveCamera(12, 1, 0.08, 30);
      var controls = new THREE.OrbitControls(camera, canvas);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.target.set(0, 0.07, 0.02);
      var fovFactor = function (fov) { return Math.tan(15 * Math.PI / 180) / Math.tan(fov / 2 * Math.PI / 180); };
      var VIEWS = {
        iso:    { dir: [-1, 1, 1],        dist: 1.85, fov: 12 },
        front:  { dir: [0, 0.07, 1],      dist: 1.75, fov: 30 },
        back:   { dir: [0.0, 0.12, -1],   dist: 1.75, fov: 30 },
        left:   { dir: [-1, 0.1, 0.02],   dist: 1.75, fov: 30 },
        right:  { dir: [1, 0.1, 0.02],    dist: 1.75, fov: 30 },
        top:    { dir: [0, 1, 0.02],      dist: 1.75, fov: 30 },
        bottom: { dir: [0, -1, 0.02],     dist: 1.75, fov: 30 }
      };
      function fit() { var a = camera.aspect || 1; return a < 1 ? Math.min(1.9, Math.max(1, 0.95 / a)) : 1; }
      function viewPos(v) { return new THREE.Vector3(v.dir[0], v.dir[1], v.dir[2]).normalize().multiplyScalar(v.dist * fovFactor(v.fov) * fit()).add(controls.target); }
      camera.position.copy(viewPos(VIEWS.iso));
      var baseMaxDist = 3.2;
      function applyFovLimits() { var f = fovFactor(camera.fov); controls.minDistance = 0.45 * f; controls.maxDistance = baseMaxDist * f * fit(); }
      applyFovLimits();

      scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa6b2, 0.35));
      var key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(-1.2, 2, 1.6); scene.add(key);
      key.castShadow = true; key.shadow.mapSize.set(1536, 1536);
      Object.assign(key.shadow.camera, { left: -0.75, right: 0.75, top: 0.75, bottom: -0.75, near: 0.5, far: 6 });
      key.shadow.bias = -0.0006; key.shadow.normalBias = 0.003;
      var rim = new THREE.DirectionalLight(0xdbe6ff, 0.35); rim.position.set(1.5, 1, -1.5); scene.add(rim);
      var ledA = new THREE.PointLight(0x2e58ff, 7, 0.6, 1.6); ledA.position.set(0, 0.19, 0.06); scene.add(ledA);
      var ledB = new THREE.PointLight(0x3466ff, 4, 0.5, 1.6); ledB.position.set(0, -0.08, 0.05); scene.add(ledB);

      var dirty = 3; var invalidate = function () { dirty = Math.max(dirty, 3); };
      controls.addEventListener('change', invalidate);
      function resize() { var w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); clampFloat(); invalidate(); }
      new ResizeObserver(resize).observe(stage);

      /* ---------- toast + caption ---------- */
      var toastT = 0;
      function toast(msg, ms) { var t = R('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, ms || 2200); }

      /* ---------- touchscreen: composited canvas texture ---------- */
      var IMG = {}, current = 'start';
      var scr = document.createElement('canvas'); scr.width = 480; scr.height = 800; var g2 = scr.getContext('2d');
      var screenTex = new THREE.CanvasTexture(scr); screenTex.encoding = THREE.sRGBEncoding; screenTex.flipY = false; screenTex.anisotropy = 8;
      var screenMat = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -24 });
      var screenMesh = null;
      ['start', 'power', 'duty', 'time', 'temp', 'running', 'pause', 'end', 'alarm', 'off', 'allset', 'set-user', 'set-light'].forEach(function (k) {
        var im = new Image(); im.crossOrigin = 'anonymous';
        im.onload = function () { if (k === 'set-light') initLightBars(); if (k === current) drawScreen(); };
        im.src = BASE + k + '.jpg'; IMG[k] = im;
      });

      var P = { power: 200, duty: 50, time: 10, tmax: 60 };
      var RANGE = { power: [0, 400, 10], duty: [10, 100, 5], time: [1, 30, 1], tmax: [20, 100, 1] };
      var SET_KEY = { power: 'power', duty: 'duty', time: 'time', temp: 'tmax' };
      var run = { state: 'ready', power: 200, t: 0, energy: 0, temp: 22, sample: 1, ignoreLimit: false, on: false };
      var lights = { ready: '#0a60ff', process: '#04ccff', pause: '#ff9f00', finish: '#03ff20', error: '#f80c00' };
      var lightX = { ready: 416, process: 390, pause: 270, finish: 330, error: 238 };
      var lightOn = true, preview = null, previewT = 0;
      var LIGHT_ROWS = [['ready', 277], ['process', 355], ['pause', 433], ['finish', 511], ['error', 589]];
      var lightPix = null;
      function initLightBars() {
        var c = document.createElement('canvas'); c.width = 480; c.height = 800; var x = c.getContext('2d');
        x.drawImage(IMG['set-light'], 0, 0);
        try { lightPix = x.getImageData(0, 0, 480, 800); } catch (_) { lightPix = null; }
        if (lightPix) LIGHT_ROWS.forEach(function (r) { lights[r[0]] = barColor(lightX[r[0]], r[1]); });
        applyLight();
      }
      function barColor(x, y) { var i = (Math.round(y) * 480 + Math.round(x)) * 4, d = lightPix.data;
        return '#' + [d[i], d[i + 1], d[i + 2]].map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join(''); }

      var CX = 240, CY = 405, RAD = 190, A0 = 155 * Math.PI / 180, SPAN = 230 * Math.PI / 180;
      function fmtTime(s) { var m = Math.floor(s / 60), ss = Math.floor(s % 60); return m + ':' + (ss < 10 ? '0' : '') + ss; }
      function drawScreen() {
        var s = current;
        g2.fillStyle = s === 'black' ? '#000' : '#f7f7f7'; g2.fillRect(0, 0, 480, 800);
        if (s === 'custom' && customImg) { g2.drawImage(customImg, 0, 0); }
        else if (s !== 'black' && IMG[s] && IMG[s].complete && IMG[s].naturalWidth) g2.drawImage(IMG[s], 0, 0, 480, 800);
        g2.textBaseline = 'alphabetic';
        if (SET_KEY[s]) {
          var key = SET_KEY[s], rg = RANGE[key], t = (P[key] - rg[0]) / (rg[1] - rg[0]);
          if (t < 0.999) { g2.beginPath(); g2.arc(CX, CY, RAD, A0 + t * SPAN, A0 + SPAN); g2.strokeStyle = '#e6ebf1'; g2.lineWidth = 24; g2.lineCap = 'round'; g2.stroke(); }
          var a = A0 + t * SPAN, kx = CX + RAD * Math.cos(a), ky = CY + RAD * Math.sin(a);
          g2.beginPath(); g2.arc(kx, ky, 15, 0, 7); g2.fillStyle = '#fff'; g2.fill(); g2.lineWidth = 4; g2.strokeStyle = s === 'temp' ? '#b3122e' : '#1f6fe5'; g2.stroke();
          g2.font = '700 70px Inter, Arial, sans-serif'; g2.textAlign = 'center'; g2.fillStyle = s === 'temp' ? '#9f1239' : '#0b5bd3';
          g2.fillText(String(P[key]), CX, 325);
        }
        if (s === 'running') {
          g2.textAlign = 'left'; g2.fillStyle = '#0f172a'; g2.font = '700 25px Inter, Arial, sans-serif';
          g2.fillText(String(run.power), 112, 170); g2.fillText((run.energy / 4184).toFixed(2), 334, 170);
          g2.fillText(run.temp.toFixed(1), 112, 303); g2.fillText(fmtTime(run.t), 334, 303);
          if (run.on) { g2.beginPath(); g2.arc(452, 28, 7, 0, 7); g2.fillStyle = '#22c55e'; g2.fill(); }
        }
        if (s === 'pause' || s === 'end') {
          var now = new Date(), pad = function (v) { return (v < 10 ? '0' : '') + v; };
          var vals = ['S-' + ('000' + run.sample).slice(-4), 'Water', '—', '300',
            now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()),
            (run.energy / 4184).toFixed(2), String(run.power), (run.t / 60).toFixed(1)];
          var ys = [112, 158, 205, 252, 299, 346, 393, 440];
          g2.font = '600 18px Inter, Arial, sans-serif'; g2.fillStyle = '#0c4a6e'; g2.textAlign = 'right';
          vals.forEach(function (v, i) { g2.fillText(v, i === 0 ? 336 : 436, ys[i]); });
        }
        if (s === 'set-light') {
          LIGHT_ROWS.forEach(function (r) { var x = lightX[r[0]];
            g2.beginPath(); g2.arc(x, r[1], 12, 0, 7); g2.fillStyle = lights[r[0]]; g2.fill(); g2.lineWidth = 4; g2.strokeStyle = '#fff'; g2.stroke();
            g2.lineWidth = 1.5; g2.strokeStyle = '#1e293b'; g2.beginPath(); g2.arc(x, r[1], 14, 0, 7); g2.stroke(); });
        }
        screenTex.needsUpdate = true; invalidate();
      }
      var customImg = null;
      function show(s, quiet) {
        current = s; drawScreen();
        var info = SCREENS[s] || { name: s, desc: '' };
        R('scrname').textContent = info.name; R('scrdesc').textContent = info.desc;
        R('cap').innerHTML = '<b>' + info.name + '.</b> ' + info.desc;
        all('[data-chip]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.chip === s); });
        if (!quiet && wrap.classList.contains('narrow')) toast(info.name + ': ' + info.desc, 3200);
      }
      R('chips').innerHTML = CHIP_ORDER.map(function (k) { return '<button class="chip" data-chip="' + k + '" aria-pressed="false">' + SCREENS[k].name.replace('Settings · ', '') + '</button>'; }).join('') +
        '<button class="chip" data-chip="custom" aria-pressed="false" hidden>Your image</button>';
      all('[data-chip]').forEach(function (b) { b.onclick = function () { gotoScreen(b.dataset.chip); }; });
      function gotoScreen(s) {
        if (s === 'running') { if (run.state !== 'running') startRun(); else show('running'); return; }
        if (s === 'pause' && run.state === 'running') { pauseRun(); return; }
        if (s === 'alarm') { show('alarm'); setState('alarm'); return; }
        if (s === 'end') { finish(); return; }
        if (run.state === 'running' || run.state === 'paused') stopRun(true);
        if (s === 'start' || SET_KEY[s] || s.indexOf('set-') === 0) setState('ready');
        show(s);
      }

      /* ---------- run simulation ---------- */
      function setState(st) { run.state = st; applyLight(); syncRunBtn(); }
      function startRun(fresh) {
        if (fresh !== false && run.state !== 'paused') { run.t = 0; run.energy = 0; run.temp = 22; run.power = P.power; run.ignoreLimit = false; }
        ensureAudio(); setState('running'); show('running');
        if (immersion() <= 0) toast('The probe tip is out of the liquid. Raise the table so the tip is immersed.', 3600);
      }
      function pauseRun() { setState('paused'); show('pause'); }
      function stopRun(silent) { run.on = false; if (!silent) { setState('ready'); show('start'); } else run.state = 'ready'; syncRunBtn(); }
      function finish() { run.on = false; setState('finished'); show('end'); run.sample++; }
      function syncRunBtn() {
        var b = R('run'), on = run.state === 'running';
        b.innerHTML = svg(on ? 'pause' : 'play'); b.classList.toggle('on', on);
        b.setAttribute('aria-label', on ? 'Pause' : 'Start ultrasound');
        R('dlab').textContent = on ? 'Running · press to pause' : run.state === 'paused' ? 'Paused · press to resume' : 'Press ▶ to start';
      }
      R('run').onclick = function () {
        if (run.state === 'running') pauseRun();
        else if (run.state === 'paused') startRun(false);
        else if (current === 'black' || current === 'allset') { boot(); }
        else startRun();
      };
      function boot() { setState('ready'); lightOn = true; syncLightBtn(); show('start'); toast('Starting up'); }
      var simAcc = 0;
      function simulate(dt) {
        if (run.state !== 'running') { run.on = false; return; }
        var sdt = dt * 10;
        run.t += sdt;
        run.on = ((run.t % 15) / 15) < P.duty / 100 && run.power > 0;
        if (run.on) {
          run.energy += run.power * sdt;
          if (immersion() > 0) run.temp += run.power * 0.8 * sdt / (300 * 4.18);
        }
        run.temp -= (run.temp - 22) * 0.0006 * sdt;
        simAcc += dt;
        if (simAcc > 0.2) { simAcc = 0; if (current === 'running') drawScreen(); }
        if (!run.ignoreLimit && run.temp >= P.tmax) { run.on = false; setState('alarm'); show('alarm'); toast('Temperature limit reached', 2600); }
        else if (run.t >= P.time * 60) { finish(); toast('Run complete'); }
      }

      /* ---------- chamber light ---------- */
      var stateLight = { ready: 'ready', running: 'process', paused: 'pause', finished: 'finish', alarm: 'error', off: null };
      var chamberMat = null;
      function applyLight() {
        var key = stateLight[run.state] || 'ready';
        var col = preview || lights[key];
        var on = lightOn && current !== 'black';
        var c = new THREE.Color(col);
        ledA.color.copy(c); ledB.color.copy(c);
        ledA.intensity = on ? 7 : 0; ledB.intensity = on ? 4 : 0;
        if (chamberMat) {
          if (on) { chamberMat.color.copy(c).multiplyScalar(0.55); chamberMat.emissive.copy(c).convertSRGBToLinear(); chamberMat.emissiveIntensity = 0.85; }
          else { chamberMat.color.setHex(0xd9dde2); chamberMat.emissiveIntensity = 0; }
        }
        invalidate();
      }
      function syncLightBtn() { root.querySelector('[data-a="light"]').setAttribute('aria-pressed', lightOn); }
      function toggleLight() { lightOn = !lightOn; syncLightBtn(); applyLight(); toast(lightOn ? 'Chamber light on' : 'Chamber light off', 1400); }

      /* ---------- screen hot spots (480 x 800 image pixels) ---------- */
      function inBox(u, v, x0, y0, x1, y1) { return u >= x0 && u <= x1 && v >= y0 && v <= y1; }
      function inCirc(u, v, cx, cy, r) { return (u - cx) * (u - cx) + (v - cy) * (v - cy) <= r * r; }
      function notInDemo() { toast('That page is not part of this demo', 1600); }
      function tapScreen(u, v) {
        var s = current;
        if (s === 'black') { boot(); return; }
        if (s === 'custom') { show('start'); return; }
        if (s === 'start') {
          if (inBox(u, v, 92, 530, 388, 597)) { show('power'); return; }
          if (v > 690 && v < 786) {
            if (u < 118) show('start'); else if (u > 362) show('off'); else if (u < 234) orderNow(); else notInDemo();
          }
          return;
        }
        if (SET_KEY[s]) {
          if (inCirc(u, v, 240, 542, 78)) { startRun(); return; }
          if (v > 60 && v < 160) { if (u < 103) show('power'); else if (u < 194) show('duty'); else if (u < 284) show('time'); else if (u < 374) show('temp'); else notInDemo(); return; }
          var dx = u - CX, dy = v - CY, d = Math.sqrt(dx * dx + dy * dy);
          if (d > 150 && d < 225) {
            var a = Math.atan2(dy, dx); var rel = (a - A0) % (2 * Math.PI); if (rel < 0) rel += 2 * Math.PI;
            if (rel <= SPAN + 0.1) {
              var key = SET_KEY[s], rg = RANGE[key], t = Math.min(1, rel / SPAN);
              P[key] = Math.round((rg[0] + t * (rg[1] - rg[0])) / rg[2]) * rg[2]; drawScreen(); return;
            }
          }
          if (inBox(u, v, 405, 563, 458, 627)) { notInDemo(); return; }
          if (inBox(u, v, 16, 660, 98, 752)) { toggleLight(); return; }
          if (inBox(u, v, 382, 660, 464, 752)) { show('set-user'); return; }
          if (inBox(u, v, 12, 754, 56, 798)) { show('start'); return; }
          return;
        }
        if (s === 'running') {
          if (inCirc(u, v, 240, 535, 76)) { pauseRun(); return; }
          if (inCirc(u, v, 113, 535, 62)) { run.power = Math.max(0, run.power - 10); drawScreen(); return; }
          if (inCirc(u, v, 367, 535, 62)) { run.power = Math.min(400, run.power + 10); drawScreen(); return; }
          if (inBox(u, v, 16, 660, 98, 752)) { toggleLight(); return; }
          if (inBox(u, v, 12, 754, 56, 798)) { toast('Pause the run first', 1600); }
          return;
        }
        if (s === 'pause' || s === 'end') {
          if (inCirc(u, v, 178, 566, 52)) { if (s === 'pause') startRun(false); else startRun(); return; }
          if (inCirc(u, v, 296, 566, 52)) { if (s === 'pause') finish(); else stopRun(); return; }
          if (inBox(u, v, 345, 85, 391, 124)) { run.sample = Math.max(1, run.sample - 1); drawScreen(); return; }
          if (inBox(u, v, 401, 85, 447, 124)) { run.sample++; drawScreen(); return; }
          if (inBox(u, v, 14, 658, 96, 750)) { toggleLight(); return; }
          if (inBox(u, v, 12, 754, 56, 798)) { stopRun(); }
          return;
        }
        if (s === 'alarm') {
          if (inBox(u, v, 98, 345, 382, 397)) { run.ignoreLimit = true; setState('running'); show('running'); return; }
          if (inBox(u, v, 98, 413, 382, 465)) { finish(); }
          return;
        }
        if (s === 'off') {
          if (inBox(u, v, 99, 493, 381, 545)) { show('allset'); setTimeout(function () { if (current === 'allset') { run.state = 'off'; show('black'); applyLight(); syncRunBtn(); } }, 1800); return; }
          if (inBox(u, v, 99, 561, 381, 613)) { show('start'); }
          return;
        }
        if (s === 'set-user' || s === 'set-light') {
          if (v > 60 && v < 160) { if (u < 103) show('set-user'); else if (u > 376) show('set-light'); else notInDemo(); return; }
          if (v > 708 && v < 786) { if (u < 118) show('start'); else if (u > 362) toast('Settings saved', 1400); else if (s === 'set-user' && u > 247) toast('Profile loaded', 1400); return; }
          if (s === 'set-light' && u > 226 && u < 446) {
            LIGHT_ROWS.forEach(function (r) {
              if (Math.abs(v - r[1]) < 24 && lightPix) {
                var x = Math.max(236, Math.min(437, u)); lightX[r[0]] = x; lights[r[0]] = barColor(x, r[1]);
                preview = lights[r[0]]; clearTimeout(previewT); previewT = setTimeout(function () { preview = null; applyLight(); }, 2500);
                applyLight(); drawScreen(); toast('Light for "' + r[0] + '" set', 1400);
              }
            });
          }
        }
      }

      /* ---------- door glass, beaker ---------- */
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
        frost.position.z = 153.5 * MM; frost.castShadow = true; g.add(frost);
        var clear = new THREE.Mesh(new THREE.ShapeGeometry(rrect(194 * MM, 394 * MM, 17 * MM), 10),
          new THREE.MeshPhysicalMaterial({ color: 0xe8f0ff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.06, envMapIntensity: 0.5, depthWrite: false }));
        clear.position.z = 157.4 * MM; clear.renderOrder = 3; clear.userData.noPick = true; g.add(clear);
        return g;
      }
      var BK = { od: 80, h: 110, wall: 1.5, floor: 2, ml: 300 };
      var ri = BK.od / 2 - BK.wall;
      var mlToH = function (ml) { return ml * 1000 / (Math.PI * ri * ri); };
      var liquidH = mlToH(BK.ml);
      var liquidMat = new THREE.MeshStandardMaterial({ color: 0xcfe3ff, roughness: 0.15, transparent: true, opacity: 0.45, depthWrite: false });
      function beaker() {
        var g = new THREE.Group(), ro = BK.od / 2;
        var p = [[0, 0], [ro - 3, 0], [ro, 3], [ro, BK.h], [ro + 1.2, BK.h + 1], [ri, BK.h], [ri, BK.floor + 2], [ri - 2, BK.floor], [0, BK.floor]]
          .map(function (v) { return new THREE.Vector2(v[0] * MM, v[1] * MM); });
        var glass = new THREE.Mesh(new THREE.LatheGeometry(p, 72), new THREE.MeshPhysicalMaterial({ color: 0xf2f7ff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6 }));
        glass.renderOrder = 2; g.add(glass);
        var liq = new THREE.Mesh(new THREE.CylinderGeometry((ri - 0.3) * MM, (ri - 0.3) * MM, liquidH * MM, 64), liquidMat);
        liq.position.y = (BK.floor + liquidH / 2) * MM; liq.renderOrder = 1; g.add(liq);
        var c = document.createElement('canvas'); c.width = 256; c.height = 512; var x = c.getContext('2d');
        x.fillStyle = 'rgba(255,255,255,0.9)'; x.font = 'bold 34px Arial';
        var yFor = function (ml) { return 512 - (BK.floor + mlToH(ml)) / BK.h * 512; };
        x.fillText('400', 120, yFor(400) + 12); x.font = 'bold 20px Arial'; x.fillText('APPROX', 112, yFor(400) + 36); x.font = 'bold 30px Arial';
        for (var ml = 50; ml <= 400; ml += 50) { var y = yFor(ml), big = ml % 100 === 0; x.fillRect(40, y - 1.5, big ? 70 : 40, 3); if (big && ml < 400) x.fillText(String(ml), 120, y + 11); }
        var tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
        var print = new THREE.Mesh(new THREE.CylinderGeometry((ro + 0.15) * MM, (ro + 0.15) * MM, BK.h * MM, 32, 1, true, -0.45, 0.9),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
        print.position.y = BK.h / 2 * MM; print.renderOrder = 4; g.add(print);
        return g;
      }

      /* ---------- state ---------- */
      var PROBE_TIP = { 7: -64.0, 15: -77.5 }, TIP_R = { 7: 3.5, 15: 7.5 }, TABLE_TOP = 98.0;
      var PITCH = 8.5, K_MIN = -17, K_MAX = 10, K_WORK = -16, DOOR_MAX = -100 * Math.PI / 180;
      var k = K_WORK, probe = 7, doorTarget = 0;
      var model = null, doorPivot = null, tableNode = null, probes = {};
      var doorAngle = 0, tableY = -PITCH * K_WORK * MM, drag = null;
      var mats = { body: [], head: [] }, baseColor = new Map();

      new THREE.GLTFLoader().load(BASE + MODEL, function (gltf) {
        model = gltf.scene;
        model.traverse(function (o) {
          if (!o.isMesh) return;
          o.material.side = THREE.DoubleSide;
          var parts = o.name.split('__'), grp = parts[0], mk = parts[1] || '';
          var env = { white: 0.45, whiteint: 0.35, head: 0.45, black: 0.5, titanium: 1.1, steel: 1.1, screw: 1.0, alu: 0.8 }[mk];
          o.material.envMapIntensity = env === undefined ? 0.5 : env;
          if (mk === 'black') { o.material.color.set(0x060607); o.material.roughness = 0.35; o.material.envMapIntensity = 0.25; }
          if (mk === 'touchglass') { o.material.color.set(0x030304); o.material.roughness = 0.18; o.material.envMapIntensity = 0.3;
            o.material.polygonOffset = true; o.material.polygonOffsetFactor = -1; o.material.polygonOffsetUnits = -4; }
          if (mk === 'white' || mk === 'whiteint' || mk === 'head') o.material.color.multiplyScalar(0.93);
          if (mk === 'chamber') { chamberMat = o.material; o.material.envMapIntensity = 0; o.material.emissive = new THREE.Color(0x0d2cff); }
          if ((grp === 'body' || grp === 'door') && mk === 'white') { mats.body.push(o.material); baseColor.set(o.material, o.material.color.clone()); }
          if (mk === 'head') { mats.head.push(o.material); baseColor.set(o.material, o.material.color.clone()); }
          if (o.name === 'screen') { o.material = screenMat; screenMesh = o; } else o.castShadow = true;
        });
        scene.add(model);
        var sc = document.createElement('canvas'); sc.width = sc.height = 128; var sx = sc.getContext('2d');
        var gr = sx.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,0.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
        var blob = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.48), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
        blob.rotation.x = -Math.PI / 2; blob.position.set(0, -0.2505, 0); blob.renderOrder = -1; scene.add(blob);
        tableNode = model.getObjectByName('table'); probes[7] = model.getObjectByName('probe7'); probes[15] = model.getObjectByName('probe15');
        var door = model.getObjectByName('door'), hinge = new THREE.Vector3(-150 * MM, 0, 158 * MM);
        doorPivot = new THREE.Group(); doorPivot.position.copy(hinge); model.add(doorPivot);
        door.position.sub(hinge); doorPivot.add(door);
        var glass = doorGlass(); glass.position.sub(hinge); doorPivot.add(glass);
        var b = beaker(); b.position.set(0, -TABLE_TOP * MM, 39.5 * MM); tableNode.add(b);
        R('loading').hidden = true;
        setProbe(7); update(); applyLight(); setColor(store('color') || 'white', true); show('start', true);
        resize(); camera.position.copy(viewPos(VIEWS.iso)); applyFovLimits(); invalidate();
      }, undefined, function (err) { R('loading').hidden = false; R('loading').textContent = 'THE 3D MODEL COULD NOT LOAD (' + BASE + MODEL + ')'; console.error(err); });

      /* ---------- colors ---------- */
      var colorName = 'white';
      function setColor(name, quiet) {
        if (!COLORS[name]) name = 'white';
        colorName = name; var c = COLORS[name];
        mats.body.forEach(function (m) { if (c.body === null) m.color.copy(baseColor.get(m)); else m.color.setHex(c.body).convertSRGBToLinear(); });
        mats.head.forEach(function (m) { if (c.head === null) m.color.copy(baseColor.get(m)); else m.color.setHex(c.head).convertSRGBToLinear(); });
        if (c.body === null) frostMat.color.setHex(0xe9e5df); else frostMat.color.setHex(c.body).convertSRGBToLinear().lerp(new THREE.Color(1, 1, 1), 0.25);
        all('[data-color]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.color === name); });
        store('color', name); drawOrderSign(); invalidate();
        if (!quiet) toast('UP-400 in ' + c.name, 1400);
      }
      all('[data-color]').forEach(function (b) { b.onclick = function () { setColor(b.dataset.color); }; });

      /* ---------- table, probe, door ---------- */
      function syncDoorBtn() { root.querySelector('[data-a="door"]').setAttribute('aria-pressed', doorTarget < -0.05); }
      function toggleDoor() { doorTarget = doorTarget < -0.05 ? 0 : DOOR_MAX; syncDoorBtn(); }
      function raise() { if (k > K_MIN) { k--; update(); } }
      function lower() { if (k < K_MAX) { k++; update(); } }
      R('up').onclick = raise; R('down').onclick = lower;
      all('[data-probe]').forEach(function (b) { b.onclick = function () { setProbe(+b.dataset.probe); }; });
      function setProbe(p) { probe = p; for (var q in probes) if (probes[q]) probes[q].visible = (+q === p);
        all('[data-probe]').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.probe === p); }); update(); drawOrderSign(); }
      function immersion() { var innerFloor = TABLE_TOP + PITCH * k - BK.floor; return PROBE_TIP[probe] - (innerFloor - liquidH); }
      function update() {
        invalidate();
        var innerFloor = TABLE_TOP + PITCH * k - BK.floor, tip = PROBE_TIP[probe];
        var imm = immersion(), toFloor = innerFloor - tip;
        R('notch').textContent = (k - K_MIN + 1) + ' / ' + (K_MAX - K_MIN + 1);
        R('immersion').textContent = imm > 0 ? imm.toFixed(0) + ' mm' : 'out of liquid';
        R('floor').textContent = toFloor.toFixed(0) + ' mm';
        R('gauge').style.width = ((K_MAX - k) / (K_MAX - K_MIN) * 100) + '%';
        R('up').disabled = k <= K_MIN; R('down').disabled = k >= K_MAX;
        var adv = R('advice');
        if (imm <= 0) { adv.textContent = 'Raise the table until the tip is under the liquid surface.'; adv.className = 'note warn'; }
        else if (toFloor < 10) { adv.textContent = 'Tip is close to the beaker floor. Keep at least 10 mm clearance.'; adv.className = 'note warn'; }
        else { adv.textContent = 'Good working position: tip immersed with clearance to the floor.'; adv.className = 'note good'; }
      }

      /* ---------- dial ---------- */
      var ringBtns = all('.d-btn[data-a]');
      ringBtns.forEach(function (b, i) { var a = (-90 + i * 60) * Math.PI / 180; b.style.transform = 'translate(' + (Math.cos(a) * 64).toFixed(1) + 'px,' + (Math.sin(a) * 64).toFixed(1) + 'px)'; });
      ringBtns.forEach(function (b) {
        b.onclick = function () {
          var a = b.dataset.a;
          if (a === 'door') toggleDoor(); else if (a === 'up') raise(); else if (a === 'down') lower();
          else if (a === 'light') toggleLight(); else if (a === 'sound') toggleSound();
          else if (a === 'probe') { setProbe(probe === 7 ? 15 : 7); toast(probe + ' mm probe fitted', 1400); }
        };
      });

      /* ---------- floating panels: drag anywhere inside the stage ---------- */
      function makeFloat(el, handle, name) {
        var st = null;
        handle.addEventListener('pointerdown', function (e) {
          if (e.target.closest('button') && e.target.closest('button') !== handle) return;
          var r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
          st = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false, s: s };
          handle.setPointerCapture(e.pointerId);
        });
        handle.addEventListener('pointermove', function (e) {
          if (!st || e.pointerId !== st.id) return;
          if (!st.moved && Math.hypot(e.clientX - st.sx, e.clientY - st.sy) < 4) return;
          st.moved = true;
          var s = st.s, w = el.offsetWidth, h = el.offsetHeight;
          var x = Math.max(0, Math.min(s.width - w, e.clientX - s.left - st.dx)), y = Math.max(0, Math.min(s.height - h, e.clientY - s.top - st.dy));
          el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto';
          el._pos = [x / s.width, y / s.height];
        });
        handle.addEventListener('pointerup', function (e) { if (st && st.moved && el._pos) store('pos-' + name, el._pos); if (st && !st.moved && el === R('panel') && !e.target.closest('button')) R('ptog').click(); st = null; });
        var p = store('pos-' + name); if (p) el._pos = p;
        el._float = true;
      }
      function clampFloat() {
        [R('panel'), R('dial')].forEach(function (el) {
          if (!el._pos || wrap.classList.contains('narrow')) { if (wrap.classList.contains('narrow')) { el.style.left = el.style.top = el.style.right = el.style.bottom = ''; } return; }
          var w = stage.clientWidth, h = stage.clientHeight;
          var x = Math.max(0, Math.min(w - el.offsetWidth, el._pos[0] * w)), y = Math.max(0, Math.min(h - el.offsetHeight, el._pos[1] * h));
          el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto';
        });
      }
      makeFloat(R('panel'), R('phead'), 'panel');
      makeFloat(R('dial'), R('dial'), 'dial');
      R('ptog').onclick = function () { var c = R('panel').classList.toggle('collapsed'); R('ptog').setAttribute('aria-expanded', !c); };
      all('.sec-h').forEach(function (h) { h.onclick = function () {
        var sec = h.parentNode, wasClosed = sec.classList.contains('closed');
        if (wrap.classList.contains('narrow')) all('.sec').forEach(function (s) { s.classList.add('closed'); });
        sec.classList.toggle('closed', !wasClosed);
      }; });

      /* ---------- view cube, tools ---------- */
      var flyTo = null;
      all('[data-face]').forEach(function (f) { f.onclick = function () { flyTo = VIEWS[f.dataset.face]; }; });
      R('home').onclick = function () { flyTo = VIEWS.iso; };
      var spin = false;
      R('spin').onclick = function () { spin = !spin; R('spin').setAttribute('aria-pressed', spin); controls.autoRotate = spin; };
      controls.autoRotateSpeed = 1.2;
      controls.addEventListener('start', function () { flyTo = null; });
      R('full').onclick = function () {
        var d = document, fs = d.fullscreenElement || d.webkitFullscreenElement;
        if (fs) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
        else { var rq = host.requestFullscreen || host.webkitRequestFullscreen; if (rq) { var p = rq.call(host); if (p && p.catch) p.catch(function () { toast('Full screen is not available here', 1600); }); } else toast('Full screen is not available here', 1600); }
      };
      var cubeEl = R('cube');
      function syncCube() {
        var e = camera.matrixWorldInverse.elements;
        var f = function (v) { return Math.abs(v) < 1e-10 ? 0 : v; };
        cubeEl.style.transform = 'matrix3d(' + [f(e[0]), f(-e[1]), f(e[2]), 0, f(-e[4]), f(e[5]), f(-e[6]), 0, f(e[8]), f(-e[9]), f(e[10]), 0, 0, 0, 0, 1].join(',') + ')';
      }

      /* ---------- page scroll stays free: plain wheel scrolls the page, Ctrl/Cmd + wheel zooms ---------- */
      stage.addEventListener('wheel', function (e) {
        if (e.target !== canvas || e.ctrlKey || e.metaKey || document.fullscreenElement) return;
        e.stopPropagation(); toast('Hold Ctrl and scroll to zoom', 1300);
      }, true);

      /* ---------- order: a 3D sign in the scene ---------- */
      var signCanvas = document.createElement('canvas'); signCanvas.width = 640; signCanvas.height = 220;
      var signTex = new THREE.CanvasTexture(signCanvas); signTex.encoding = THREE.sRGBEncoding; signTex.anisotropy = 8;
      var sign = new THREE.Sprite(new THREE.SpriteMaterial({ map: signTex, transparent: true, depthTest: true, toneMapped: false }));
      sign.scale.set(0.24, 0.0825, 1); sign.position.set(0.3, 0.37, 0.06); sign.renderOrder = 5; scene.add(sign);
      function drawOrderSign() {
        var x = signCanvas.getContext('2d'), W = 640, H = 220, r = 44;
        x.clearRect(0, 0, W, H);
        x.save(); x.shadowColor = 'rgba(15,23,42,.35)'; x.shadowBlur = 24; x.shadowOffsetY = 8;
        x.beginPath(); x.moveTo(r + 10, 10); x.arcTo(W - 10, 10, W - 10, H - 10, r); x.arcTo(W - 10, H - 10, 10, H - 10, r); x.arcTo(10, H - 10, 10, 10, r); x.arcTo(10, 10, W - 10, 10, r); x.closePath();
        var gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3b82f6'); gr.addColorStop(1, '#1d4ed8'); x.fillStyle = gr; x.fill(); x.restore();
        x.fillStyle = '#fff'; x.textAlign = 'left'; x.font = '700 64px Inter, Arial, sans-serif'; x.fillText('Order this one', 52, 112);
        x.font = '500 34px Inter, Arial, sans-serif'; x.fillStyle = 'rgba(255,255,255,.88)'; x.fillText(COLORS[colorName].name + ' · ' + probe + ' mm probe · get a quote', 52, 168);
        x.beginPath(); x.moveTo(548, 82); x.lineTo(586, 110); x.lineTo(548, 138); x.lineWidth = 12; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#fff'; x.stroke();
        signTex.needsUpdate = true; invalidate();
      }
      function orderNow() {
        var url = host.getAttribute('data-order-url');
        var cfg = 'UP-400 · ' + COLORS[colorName].name + ' · ' + probe + ' mm probe';
        if (url) { window.location.href = url + (url.indexOf('?') < 0 ? '?' : '&') + 'config=' + encodeURIComponent(cfg); return; }
        var body = 'Hello Topsonics,\n\nPlease send me a quote for:\n' + cfg + '\n\nSample type:\nBatch volume:\nDelivery country:\n';
        toast('Opening an e-mail to info@topsonics.com', 2600);
        window.location.href = 'mailto:info@topsonics.com?subject=' + encodeURIComponent('Quote request: ' + cfg) + '&body=' + encodeURIComponent(body);
      }

      /* ---------- cavitation bubbles at the probe tip ---------- */
      var NB = 1400, bPos = new Float32Array(NB * 3), bVel = new Float32Array(NB * 3), bLife = new Float32Array(NB);
      var bGeo = new THREE.BufferGeometry(); bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3)); bGeo.setDrawRange(0, NB);
      var dot = document.createElement('canvas'); dot.width = dot.height = 64; var dx2 = dot.getContext('2d');
      var rg2 = dx2.createRadialGradient(32, 32, 2, 32, 32, 30); rg2.addColorStop(0, 'rgba(255,255,255,1)'); rg2.addColorStop(0.45, 'rgba(235,245,255,.85)'); rg2.addColorStop(1, 'rgba(255,255,255,0)');
      dx2.fillStyle = rg2; dx2.fillRect(0, 0, 64, 64);
      var bubbles = new THREE.Points(bGeo, new THREE.PointsMaterial({ color: 0xeef7ff, size: 0.0025, map: new THREE.CanvasTexture(dot), transparent: true, depthWrite: false, opacity: 0.95, sizeAttenuation: true }));
      bubbles.renderOrder = 6; bubbles.frustumCulled = false; scene.add(bubbles);
      for (var i = 0; i < NB; i++) { bLife[i] = 0; bPos[i * 3 + 1] = -10; }
      var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(dot), color: 0xbfe0ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      glow.scale.set(0.016, 0.016, 1); glow.renderOrder = 7; scene.add(glow);
      var spawnAcc = 0, liveBubbles = 0;
      function stepBubbles(dt) {
        var tipY = -PROBE_TIP[probe] * MM, cz = 39.5 * MM, tr = TIP_R[probe] * MM;
        var floorY = tableY - TABLE_TOP * MM + BK.floor * MM, surf = floorY + liquidH * MM, rIn = (ri - 1) * MM;
        var active = run.state === 'running' && run.on && tipY < surf && tipY > floorY;
        glow.position.set(0, tipY - 0.004, cz);
        glow.material.opacity += ((active ? 0.22 + Math.random() * 0.18 : 0) - glow.material.opacity) * 0.3;
        if (active) spawnAcc += dt * (260 + run.power * 2.4);
        var n = Math.floor(spawnAcc); spawnAcc -= n; liveBubbles = 0;
        for (var i = 0; i < NB; i++) {
          var j = i * 3;
          if (bLife[i] <= 0) {
            if (n > 0) { n--;
              var a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * tr;
              bPos[j] = Math.cos(a) * rr; bPos[j + 1] = tipY - 0.001; bPos[j + 2] = cz + Math.sin(a) * rr;
              var cloud = Math.random() < 0.6, sp = cloud ? 0.008 + Math.random() * 0.03 : 0.05 + Math.random() * 0.09;
              bVel[j] = (Math.random() - 0.5) * (cloud ? 0.05 : 0.025); bVel[j + 1] = -sp; bVel[j + 2] = (Math.random() - 0.5) * (cloud ? 0.05 : 0.025);
              bLife[i] = cloud ? 0.15 + Math.random() * 0.35 : 0.6 + Math.random() * 1.2;
            } else { continue; }
          }
          bLife[i] -= dt; liveBubbles++;
          var drag = Math.pow(0.2, dt);
          bVel[j] *= drag; bVel[j + 1] = bVel[j + 1] * drag + 0.05 * dt; bVel[j + 2] *= drag;
          bVel[j] += (Math.random() - 0.5) * 0.08 * dt; bVel[j + 2] += (Math.random() - 0.5) * 0.08 * dt;
          bPos[j] += bVel[j] * dt; bPos[j + 1] += bVel[j + 1] * dt; bPos[j + 2] += bVel[j + 2] * dt;
          var ox = bPos[j], oz = bPos[j + 2] - cz, rad = Math.sqrt(ox * ox + oz * oz);
          if (rad > rIn) { bPos[j] *= rIn / rad; bPos[j + 2] = cz + oz * rIn / rad; bVel[j] *= -0.4; bVel[j + 2] *= -0.4; }
          if (bPos[j + 1] < floorY + 0.002) { bPos[j + 1] = floorY + 0.002; bVel[j + 1] = Math.abs(bVel[j + 1]) * 0.5; }
          if (bPos[j + 1] > surf - 0.001 || bLife[i] <= 0) { bLife[i] = 0; bPos[j + 1] = -10; }
        }
        bGeo.attributes.position.needsUpdate = true;
        liquidMat.opacity = 0.45 + (active ? 0.12 : 0);
        return active || liveBubbles > 0 || glow.material.opacity > 0.01;
      }

      /* ---------- sound: synthesized cavitation noise, muffled when the door is closed ---------- */
      var audio = null, soundOn = store('sound') !== false;
      function ensureAudio() {
        if (audio || !soundOn) { if (audio && audio.ctx.state === 'suspended') audio.ctx.resume(); return; }
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        var ctx = new AC(), len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        var noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
        var band = ctx.createBiquadFilter(); band.type = 'bandpass'; band.frequency.value = 6500; band.Q.value = 0.7;
        var hiss = ctx.createGain(); hiss.gain.value = 0.5;
        var crackleSrc = ctx.createBufferSource(); crackleSrc.buffer = buf; crackleSrc.loop = true; crackleSrc.playbackRate.value = 0.73;
        var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
        var crackle = ctx.createGain(); crackle.gain.value = 0;
        var tone = ctx.createOscillator(); tone.type = 'sine'; tone.frequency.value = 10000;
        var toneG = ctx.createGain(); toneG.gain.value = 0.05;
        var master = ctx.createGain(); master.gain.value = 0;
        var enclosure = ctx.createBiquadFilter(); enclosure.type = 'lowpass'; enclosure.frequency.value = 1500; enclosure.Q.value = 0.5;
        noise.connect(band); band.connect(hiss); hiss.connect(master);
        crackleSrc.connect(hp); hp.connect(crackle); crackle.connect(master);
        tone.connect(toneG); toneG.connect(master);
        master.connect(enclosure); enclosure.connect(ctx.destination);
        noise.start(); crackleSrc.start(); tone.start();
        audio = { ctx: ctx, master: master, crackle: crackle, enclosure: enclosure };
      }
      function stepSound() {
        if (!audio) return;
        var t = audio.ctx.currentTime, active = soundOn && run.state === 'running' && run.on && immersion() > 0;
        var open = -doorAngle / -DOOR_MAX;
        var vol = active ? (0.05 + 0.13 * run.power / 400) * (0.35 + 0.65 * open) : 0;
        audio.master.gain.setTargetAtTime(vol, t, 0.06);
        audio.crackle.gain.setTargetAtTime(active ? Math.random() * 0.9 : 0, t, 0.015);
        audio.enclosure.frequency.setTargetAtTime(1500 + 14000 * open * open, t, 0.08);
      }
      function toggleSound() {
        soundOn = !soundOn; store('sound', soundOn);
        var b = root.querySelector('[data-a="sound"]'); b.setAttribute('aria-pressed', soundOn); b.innerHTML = svg(soundOn ? 'sound' : 'mute');
        if (soundOn) { ensureAudio(); toast('Sound on. Open the door to hear the difference the enclosure makes.', 2800); }
        else { if (audio) audio.master.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.03); toast('Sound off', 1200); }
      }
      (function () { var b = root.querySelector('[data-a="sound"]'); b.setAttribute('aria-pressed', soundOn); b.innerHTML = svg(soundOn ? 'sound' : 'mute'); })();

      /* ---------- direct manipulation + taps ---------- */
      var pickRay = new THREE.Raycaster(), pndc = new THREE.Vector2();
      function setRay(e) { var r = canvas.getBoundingClientRect();
        pndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); pickRay.setFromCamera(pndc, camera); pickRay.camera = camera; }
      function shown(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
      function pick(e) { if (!model) return null; setRay(e);
        var hits = pickRay.intersectObjects([model, sign], true);
        for (var i = 0; i < hits.length; i++) if (!hits[i].object.userData.noPick && shown(hits[i].object)) return hits[i];
        return null; }
      function kindOf(o) { if (o === sign) return 'order'; while (o) { if (o === doorPivot) return 'door'; if (o === tableNode) return 'table'; if (o === screenMesh) return 'screen'; o = o.parent; } return null; }
      function clampDoor(t) { if (t > 0) return t > Math.PI / 2 ? DOOR_MAX : 0; return Math.max(DOOR_MAX, t); }
      var hoverEvt = null;
      stage.addEventListener('pointerdown', function (e) {
        if (e.target !== canvas) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        var h = pick(e), kind = h && kindOf(h.object);
        if (kind === 'door') {
          var H = new THREE.Vector3(); doorPivot.getWorldPosition(H);
          drag = { type: 'door', id: e.pointerId, H: H, r: Math.max(0.03, Math.hypot(h.point.x - H.x, h.point.z - H.z)) };
        } else if (kind === 'table') {
          var n = new THREE.Vector3(); camera.getWorldDirection(n); n.y = 0;
          if (n.lengthSq() < 1e-6) n.set(0, 0, -1); n.normalize();
          drag = { type: 'table', id: e.pointerId, plane: new THREE.Plane().setFromNormalAndCoplanarPoint(n, h.point), y0: h.point.y, off0: -PITCH * k * MM };
        }
        if (drag) { controls.enabled = false; flyTo = null; canvas.style.cursor = 'grabbing'; }
      }, true);
      window.addEventListener('pointermove', function (e) {
        if (!drag) { if (e.pointerType === 'mouse' && e.target === host) hoverEvt = e; return; }
        if (e.pointerId !== drag.id) return;
        setRay(e);
        var o = pickRay.ray.origin, d = pickRay.ray.direction;
        if (drag.type === 'door') {
          var H = drag.H, ox = o.x - H.x, oz = o.z - H.z;
          var a = d.x * d.x + d.z * d.z, b = 2 * (ox * d.x + oz * d.z), c = ox * ox + oz * oz - drag.r * drag.r, pts = [];
          if (a > 1e-9) { var disc = b * b - 4 * a * c;
            if (disc >= 0) { var s = Math.sqrt(disc); [(-b - s) / (2 * a), (-b + s) / (2 * a)].forEach(function (t) { if (t > 0) pts.push([ox + t * d.x, oz + t * d.z]); }); }
            else { var t0 = -b / (2 * a); pts.push([ox + t0 * d.x, oz + t0 * d.z]); } }
          var best = null, bd = Infinity;
          pts.forEach(function (p) { var th = clampDoor(Math.atan2(-p[1], p[0])), dd = Math.abs(th - doorAngle); if (dd < bd) { bd = dd; best = th; } });
          if (best !== null) { doorAngle = doorTarget = best; syncDoorBtn(); invalidate(); }
        } else {
          var p = new THREE.Vector3();
          if (pickRay.ray.intersectPlane(drag.plane, p)) {
            var nk = Math.max(K_MIN, Math.min(K_MAX, Math.round(-(drag.off0 + p.y - drag.y0) / (PITCH * MM))));
            if (nk !== k) { k = nk; update(); }
          }
        }
      });
      function endDrag(e) { if (drag && e.pointerId === drag.id) { drag = null; controls.enabled = true; canvas.style.cursor = ''; } }
      window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);
      var down = null;
      canvas.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; });
      canvas.addEventListener('pointerup', function (e) {
        if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
        var h = pick(e), kind = h && kindOf(h.object);
        if (kind === 'order') { orderNow(); return; }
        if (kind === 'screen' && h.uv) tapScreen(h.uv.x * 480, (1 - h.uv.y) * 800);
      });

      /* ---------- lab scene ---------- */
      var BENCH_TOP = -0.2515;
      function canvasTex(w, h, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
        var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t; }
      function lathe(pts, mat) { return new THREE.Mesh(new THREE.LatheGeometry(pts.map(function (q) { return new THREE.Vector2(q[0] * MM, q[1] * MM); }), 64), mat); }
      function glassMat() { return new THREE.MeshPhysicalMaterial({ color: 0xf3f8ff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.5 }); }
      function std(c, r, m) { return new THREE.MeshStandardMaterial({ color: c, roughness: r === undefined ? 0.6 : r, metalness: m || 0 }); }
      function buildLab() {
        var g = new THREE.Group(), top = BENCH_TOP, cabH = 0.82, floorY = top - 0.03 - cabH;
        var bench = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.03, 0.78), std(0x2b3034, 0.5));
        bench.material.envMapIntensity = 0.12; bench.position.set(0.1, top - 0.015, 0.03); bench.receiveShadow = true; g.add(bench);
        var cab = new THREE.Mesh(new THREE.BoxGeometry(2.16, cabH - 0.1, 0.66), std(0xd6dade, 0.55)); cab.position.set(0.1, top - 0.03 - (cabH - 0.1) / 2, -0.01); g.add(cab);
        var kick = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.1, 0.6), std(0x3a3f44, 0.7)); kick.position.set(0.1, floorY + 0.05, -0.04); g.add(kick);
        [-0.98, -0.44, 0.1, 0.64, 1.18].forEach(function (x) { var m = new THREE.Mesh(new THREE.BoxGeometry(0.004, cabH - 0.1, 0.004), std(0x8d949b)); m.position.set(x, cab.position.y, 0.322); g.add(m); });
        [-0.71, -0.17, 0.37, 0.91].forEach(function (x) { var m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 12), std(0xb9bec4, 0.25, 0.9)); m.position.set(x, top - 0.12, 0.335); g.add(m); });
        var floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), std(0xb7bcc1, 0.85)); floor.rotation.x = -Math.PI / 2; floor.position.y = floorY; floor.receiveShadow = true; g.add(floor);
        var wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), std(0xe3e6ea, 0.9)); wall.position.set(0, floorY + 2.5, -0.36); wall.receiveShadow = true; g.add(wall);
        var tiles = canvasTex(600, 300, function (x, w, h) {
          x.fillStyle = '#c8cdd2'; x.fillRect(0, 0, w, h);
          for (var row = 0; row < 4; row++) for (var col = -1; col < 5; col++) {
            var ox = col * 150 + (row % 2 ? 75 : 0) + 2, oy = row * 75 + 2;
            var gr = x.createLinearGradient(0, oy, 0, oy + 71); gr.addColorStop(0, '#fbfbfc'); gr.addColorStop(1, '#eef0f2');
            x.fillStyle = gr; x.fillRect(ox, oy, 146, 71); }
        });
        tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping; tiles.repeat.set(12 / 0.6, 0.6 / 0.3);
        var splash = new THREE.Mesh(new THREE.PlaneGeometry(12, 0.6), new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.3 }));
        splash.position.set(0, top + 0.3, -0.3595); splash.receiveShadow = true; g.add(splash);
        var flask = new THREE.Group();
        var fg = lathe([[0, 0], [40, 0], [42.5, 3], [17, 96], [17, 138], [19.5, 140]], glassMat()); fg.renderOrder = 2; flask.add(fg);
        var fl = lathe([[0, 1.5], [39, 1.5], [33, 26], [0, 26]], new THREE.MeshStandardMaterial({ color: 0x8fd3a0, roughness: 0.2, transparent: true, opacity: 0.6, depthWrite: false }));
        fl.renderOrder = 1; flask.add(fl); flask.position.set(0.31, top, 0.17); g.add(flask);
        var bottle = new THREE.Group();
        var amber = lathe([[0, 0], [41, 0], [43, 3], [43, 120], [36, 140], [24, 150], [24, 168], [0, 168]], new THREE.MeshStandardMaterial({ color: 0x6a3a12, roughness: 0.15, transparent: true, opacity: 0.88 }));
        amber.castShadow = true; bottle.add(amber);
        var cap = new THREE.Mesh(new THREE.CylinderGeometry(26 * MM, 26 * MM, 26 * MM, 40), std(0x1f4fbf, 0.45)); cap.position.y = 179 * MM; cap.castShadow = true; bottle.add(cap);
        var lab = canvasTex(512, 160, function (x, w, h) { x.fillStyle = '#f7f7f5'; x.fillRect(0, 0, w, h); x.fillStyle = '#1f2a37'; x.font = 'bold 40px Arial';
          x.fillText('Ethanol 96%', 24, 64); x.font = '26px Arial'; x.fillStyle = '#4b5563'; x.fillText('500 mL · C2H5OH', 24, 112); x.fillStyle = '#d33'; x.fillRect(430, 30, 56, 56); });
        var label = new THREE.Mesh(new THREE.CylinderGeometry(43.4 * MM, 43.4 * MM, 55 * MM, 40, 1, true, -0.9, 1.8), new THREE.MeshStandardMaterial({ map: lab, roughness: 0.7 }));
        label.position.y = 60 * MM; bottle.add(label); bottle.position.set(0.45, top, -0.12); bottle.rotation.y = -0.35; g.add(bottle);
        return g;
      }
      var lab = buildLab(); scene.add(lab);
      var studioGround = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.14 }));
      studioGround.rotation.x = -Math.PI / 2; studioGround.position.y = BENCH_TOP + 0.0004; studioGround.receiveShadow = true; scene.add(studioGround);
      var labBg = new THREE.Color(0xe3e6ea);
      function setScene(mode) {
        var isLab = mode === 'lab';
        lab.visible = isLab; studioGround.visible = !isLab; scene.background = isLab ? labBg : null;
        controls.maxPolarAngle = isLab ? Math.PI / 2 - 0.04 : Math.PI; baseMaxDist = isLab ? 2.4 : 3.2; applyFovLimits();
        all('[data-scene]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.scene === mode); });
        store('scene', mode); invalidate();
      }
      all('[data-scene]').forEach(function (b) { b.onclick = function () { setScene(b.dataset.scene); }; });
      setScene(store('scene') === 'studio' ? 'studio' : 'lab');

      /* ---------- upload own screen image ---------- */
      R('upload').onchange = function (e) {
        var f = e.target.files && e.target.files[0]; if (!f) return;
        var img = new Image();
        img.onload = function () {
          var c = document.createElement('canvas'); c.width = 480; c.height = 800; var x = c.getContext('2d');
          var s = Math.max(480 / img.width, 800 / img.height), w = img.width * s, h = img.height * s;
          x.fillStyle = '#ffffff'; x.fillRect(0, 0, 480, 800); x.drawImage(img, (480 - w) / 2, (800 - h) / 2, w, h);
          customImg = c; root.querySelector('[data-chip="custom"]').hidden = false; show('custom'); URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(f); e.target.value = '';
      };
      drawOrderSign(); resize();
      host._up400 = { camera: camera, controls: controls, invalidate: invalidate, tap: function (u, v) { tapScreen(u, v); }, screen: function () { return current; }, run: run, P: P, png: function () { return scr.toDataURL('image/png'); }, color: function () { return chamberMat && '#' + ledA.color.getHexString(); } };

      /* ---------- loop (draws only when something changed or moves) ---------- */
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      var ease = reduce ? 1 : 0.12, last = performance.now(), clock = 0;
      (function loop(now) {
        if (!host.isConnected) { renderer.dispose(); if (audio) audio.ctx.close(); return; }
        requestAnimationFrame(loop);
        var dt = Math.min(0.05, ((now || performance.now()) - last) / 1000); last = now || performance.now(); clock += dt;
        if (doorPivot) {
          if (!(drag && drag.type === 'door')) { var dd = doorTarget - doorAngle; if (Math.abs(dd) > 1e-4) { doorAngle += dd * ease; dirty = Math.max(dirty, 2); } else doorAngle = doorTarget; }
          if (doorPivot.rotation.y !== doorAngle) { doorPivot.rotation.y = doorAngle; dirty = Math.max(dirty, 1); }
        }
        if (tableNode) {
          var dt2 = -PITCH * k * MM - tableY; if (Math.abs(dt2) > 1e-6) { tableY += dt2 * ease; dirty = Math.max(dirty, 2); } else tableY = -PITCH * k * MM;
          if (tableNode.position.y !== tableY) { tableNode.position.y = tableY; dirty = Math.max(dirty, 1); }
        }
        simulate(dt);
        if (stepBubbles(dt)) dirty = Math.max(dirty, 1);
        stepSound();
        if (flyTo) {
          var a = reduce ? 1 : 0.1;
          camera.fov += (flyTo.fov - camera.fov) * a; camera.updateProjectionMatrix(); applyFovLimits();
          var p = viewPos(flyTo); camera.position.lerp(p, a); dirty = Math.max(dirty, 2);
          if (camera.position.distanceTo(p) < 0.005 && Math.abs(camera.fov - flyTo.fov) < 0.05) { camera.fov = flyTo.fov; camera.updateProjectionMatrix(); applyFovLimits(); flyTo = null; }
        }
        if (hoverEvt && !drag && model) { var h = pick(hoverEvt), kd = h && kindOf(h.object);
          canvas.style.cursor = (kd === 'door' || kd === 'table') ? 'grab' : (kd === 'screen' || kd === 'order') ? 'pointer' : ''; hoverEvt = null; }
        if (controls.update()) dirty = Math.max(dirty, 1);
        if (dirty > 0) { renderer.render(scene, camera); syncCube(); dirty--; }
      })();
    }
  }

  function mountAll() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-up400-viewer]:not([data-up400-mounted])'), function (el) {
      el.setAttribute('data-up400-mounted', '');
      try { Viewer(el); } catch (err) { console.error('UP-400 viewer:', err); el.textContent = 'UP-400 viewer error: ' + (err && err.message || err); }
    });
  }
  window.UP400Viewer = { mountAll: mountAll };
  mountAll();
})();
