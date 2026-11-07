/* SonoPars CUSHA 3D explorer. Mounts into [data-cusha-page] inside a shadow root. Assets: 13a54635b0e1c0bb8ccd0ba1a5b37e5ee88c1204 */
(function(){
  var BASE="https://cdn.jsdelivr.net/gh/nanoos/up400-3d@13a54635b0e1c0bb8ccd0ba1a5b37e5ee88c1204/cusha/";
  var CSS="\n/* Layout: one deep-navy stage carrying the model, a control rail under it, then a module index. Single dark look taken from the CUSHA splash screen. */\n:host{display:block;position:relative;\n  --bg:#070d2a; --bg2:#0b1640; --panel:rgba(14,28,78,.72); --line:rgba(120,190,255,.18);\n  --fg:#e9f1ff; --muted:#93a6d6; --accent:#2fd3ff; --accent2:#2a6bff;\n  --f-display:\"Outfit\",\"Vazirmatn\",system-ui,sans-serif;\n  --f-body:\"Vazirmatn\",\"Outfit\",system-ui,sans-serif;\n  --f-mono:\"JetBrains Mono\",ui-monospace,Consolas,monospace;\n  color-scheme:dark;\n}\n*{box-sizing:border-box}\n[hidden]{display:none!important}\n.cs{position:relative;isolation:isolate;overflow:hidden;color:var(--fg);text-align:right}\n.cs{font-family:var(--f-body);font-size:15px;line-height:1.7;direction:rtl;\n  background:radial-gradient(120% 80% at 85% 10%,rgba(47,211,255,.16),transparent 55%),radial-gradient(90% 70% at 10% 90%,rgba(42,107,255,.18),transparent 60%),var(--bg);}\n.wrap{max-width:1240px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}\nheader.top{padding-block:28px 8px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap}\n.brand{direction:ltr;text-align:left}\n.brand h1{font-family:var(--f-display);font-weight:600;font-size:clamp(34px,5vw,52px);line-height:1;margin:0;letter-spacing:-.01em}\n.brand p{font-family:var(--f-display);font-weight:300;margin:6px 0 0;color:#cfe0ff;font-size:clamp(14px,1.6vw,18px)}\n.lead{max-width:44ch;color:var(--muted);margin:0;font-size:14px}\n.stage{position:relative;margin-top:12px;height:clamp(420px,68vh,720px);border-radius:18px;overflow:hidden;border:1px solid var(--line);\n  background:radial-gradient(70% 60% at 50% 45%,rgba(47,211,255,.10),transparent 70%),linear-gradient(180deg,var(--bg2),var(--bg))}\n#c{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}\n#labels{position:absolute;inset:0;pointer-events:none}\n.lbl{position:absolute;top:0;left:0;pointer-events:auto;direction:ltr;text-decoration:none;color:var(--fg);\n  display:flex;align-items:center;gap:7px;white-space:nowrap;font-family:var(--f-display);font-size:12.5px;\n  padding:4px 10px 4px 8px;border-radius:999px;background:rgba(7,13,42,.78);border:1px solid rgba(47,211,255,.45);\n  backdrop-filter:blur(6px);transition:opacity .25s,border-color .2s,background .2s;will-change:transform}\n.lbl i{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent)}\n.lbl small{color:var(--muted);font-family:var(--f-body);font-size:11px}\n.lbl:hover,.lbl.on{background:rgba(42,107,255,.9);border-color:var(--accent)}\n.lbl:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.status{position:absolute;inset:0;display:grid;place-items:center;color:var(--muted);font-family:var(--f-mono);font-size:13px}\n.hint{position:absolute;bottom:12px;left:14px;font-size:12px;color:var(--muted);pointer-events:none;direction:rtl}\n.card{position:absolute;top:14px;right:14px;width:min(300px,calc(100% - 28px));padding:14px 16px;border-radius:14px;background:var(--panel);\n  border:1px solid var(--line);backdrop-filter:blur(10px)}\n.card h3{margin:0;font-size:16px;font-weight:600}\n.card .en{direction:ltr;text-align:right;font-family:var(--f-mono);font-size:12px;color:var(--accent);margin:2px 0 6px}\n.card p{margin:0 0 10px;font-size:13px;color:var(--muted)}\n.card .row{display:flex;gap:8px;flex-wrap:wrap}\n.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:9px;font-size:13px;text-decoration:none;color:#04122e;background:var(--accent);font-weight:600;border:0;cursor:pointer;font-family:var(--f-body)}\n.btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line)}\n.btn:focus-visible{outline:2px solid #fff;outline-offset:2px}\n.x{position:absolute;top:8px;left:10px;background:none;border:0;color:var(--muted);font-size:18px;cursor:pointer}\n.rail{margin-top:14px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding:14px 18px;border-radius:14px;background:var(--panel);border:1px solid var(--line)}\n.rail label{font-weight:600;font-size:14px}\n.slider{flex:1;min-width:220px;display:flex;align-items:center;gap:12px}\n.slider span{font-size:12px;color:var(--muted);white-space:nowrap}\ninput[type=range]{flex:1;appearance:none;height:4px;border-radius:4px;background:linear-gradient(270deg,var(--accent2),var(--accent));direction:rtl}\ninput[type=range]::-webkit-slider-thumb{appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--accent);box-shadow:0 0 12px var(--accent);cursor:pointer}\ninput[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--accent);cursor:pointer}\n#pct{font-family:var(--f-mono);font-variant-numeric:tabular-nums;color:var(--accent);min-width:4ch;text-align:left}\n.toggles{display:flex;gap:8px}\n.chip{padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--fg);font-family:var(--f-body);font-size:13px;cursor:pointer}\n.chip[aria-pressed=true]{background:rgba(47,211,255,.15);border-color:var(--accent)}\nsection.mods{padding-block:40px 24px}\nsection.mods h2{font-family:var(--f-display);font-weight:600;font-size:22px;margin:0 0 4px}\nsection.mods .sub{color:var(--muted);margin:0 0 18px;font-size:14px}\n.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}\n.mod{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;padding:14px 16px;border-radius:12px;border:1px solid var(--line);background:rgba(11,22,64,.55);cursor:pointer;text-align:right;color:var(--fg);font-family:var(--f-body)}\n.mod:hover,.mod.on{border-color:var(--accent)}\n.mod .n{grid-row:span 3;font-family:var(--f-mono);color:var(--accent);font-size:13px;padding-top:2px}\n.mod b{font-weight:600}\n.mod .en{direction:ltr;text-align:right;font-family:var(--f-mono);font-size:12px;color:var(--muted)}\n.mod .fin{font-size:12.5px;color:#bcd0ff}\nfooter{padding-block:24px 40px;color:var(--muted);font-size:12.5px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-top:1px solid var(--line);margin-top:20px}\nfooter .en{direction:ltr;font-family:var(--f-display)}\n@media (max-width:560px){.hint{display:none}.card{top:auto;bottom:12px}}\n@media (prefers-reduced-motion:reduce){.lbl{transition:none}}\n";
  var HTML="<div class=\"cs\"><div class=\"wrap\">\n  <header class=\"top\">\n    <div class=\"brand\"><h1>Cusha</h1><p>Cavitational Ultrasonic Surgical High Aspiration</p></div>\n    <p class=\"lead\">\u0645\u062f\u0644 \u0633\u0647\u200c\u0628\u0639\u062f\u06cc \u0645\u0627\u0698\u0648\u0644\u200c\u0647\u0627\u06cc \u0627\u0635\u0644\u06cc \u062f\u0633\u062a\u06af\u0627\u0647. \u0628\u0627 \u0627\u0633\u0644\u0627\u06cc\u062f\u0631 \u067e\u0627\u06cc\u06cc\u0646 \u062f\u0633\u062a\u06af\u0627\u0647 \u0631\u0627 \u0628\u0627\u0632 \u06a9\u0646\u06cc\u062f\u061b \u0631\u0648\u06cc \u0647\u0631 \u0642\u0637\u0639\u0647 \u06cc\u0627 \u0628\u0631\u0686\u0633\u0628 \u0622\u0646 \u06a9\u0644\u06cc\u06a9 \u06a9\u0646\u06cc\u062f \u062a\u0627 \u0634\u06cc\u062a \u0627\u0637\u0644\u0627\u0639\u0627\u062a\u0634 \u062f\u0631 \u06af\u0648\u06af\u0644\u200c\u062f\u0631\u0627\u06cc\u0648 \u0628\u0627\u0632 \u0634\u0648\u062f.</p>\n  </header>\n\n  <div class=\"stage\" id=\"stage\">\n    <canvas id=\"c\" aria-label=\"\u0645\u062f\u0644 \u0633\u0647\u200c\u0628\u0639\u062f\u06cc \u062f\u0633\u062a\u06af\u0627\u0647 CUSHA\"></canvas>\n    <div id=\"labels\"></div>\n    <div class=\"status\" id=\"status\">\u062f\u0631 \u062d\u0627\u0644 \u0628\u0627\u0631\u06af\u0630\u0627\u0631\u06cc \u0645\u062f\u0644\u2026 <span id=\"prog\"></span></div>\n    <div class=\"hint\">\u06a9\u0634\u06cc\u062f\u0646: \u0686\u0631\u062e\u0634 \u00b7 \u0627\u0633\u06a9\u0631\u0648\u0644: \u0628\u0632\u0631\u06af\u200c\u0646\u0645\u0627\u06cc\u06cc</div>\n    <div class=\"card\" id=\"card\" hidden>\n      <button class=\"x\" id=\"cardx\" aria-label=\"\u0628\u0633\u062a\u0646\">\u00d7</button>\n      <h3 id=\"cfa\"></h3><div class=\"en\" id=\"cen\"></div><p id=\"cfin\"></p>\n      <div class=\"row\"><a class=\"btn\" id=\"csheet\" target=\"_blank\" rel=\"noopener\">\u0628\u0627\u0632 \u06a9\u0631\u062f\u0646 \u0634\u06cc\u062a \u2197</a><a class=\"btn ghost\" id=\"cfold\" target=\"_blank\" rel=\"noopener\">\u067e\u0648\u0634\u0647 \u062f\u0631\u0627\u06cc\u0648</a></div>\n    </div>\n  </div>\n\n  <div class=\"rail\">\n    <label for=\"ex\">\u0646\u0645\u0627\u06cc \u0627\u0646\u0641\u062c\u0627\u0631\u06cc</label>\n    <div class=\"slider\"><span>\u0645\u0648\u0646\u062a\u0627\u0698</span><input id=\"ex\" type=\"range\" min=\"0\" max=\"100\" value=\"0\"><span>\u0628\u0627\u0632</span><output id=\"pct\" for=\"ex\">0%</output></div>\n    <div class=\"toggles\">\n      <button class=\"chip\" id=\"rot\" aria-pressed=\"true\">\u0686\u0631\u062e\u0634 \u062e\u0648\u062f\u06a9\u0627\u0631</button>\n      <button class=\"chip\" id=\"lab\" aria-pressed=\"true\">\u0646\u0627\u0645 \u0642\u0637\u0639\u0627\u062a</button>\n    </div>\n  </div>\n\n  <section class=\"mods\">\n    <h2>\u0645\u0627\u0698\u0648\u0644\u200c\u0647\u0627</h2>\n    <p class=\"sub\">\u0647\u0631 \u0645\u0627\u0698\u0648\u0644 \u06cc\u06a9 \u0641\u0627\u06cc\u0644 STEP\u060c \u06cc\u06a9 \u067e\u0648\u0634\u0647 \u0648 \u06cc\u06a9 \u0634\u06cc\u062a \u062f\u0631 \u062f\u0631\u0627\u06cc\u0648 \u062f\u0627\u0631\u062f.</p>\n    <div class=\"grid\" id=\"grid\"></div>\n  </section>\n\n  <footer><span>\u0633\u0648\u0646\u0648\u067e\u0627\u0631\u0633 \u00b7 \u0637\u0631\u0627\u062d\u06cc \u0648 \u0633\u0627\u062e\u062a \u0627\u06cc\u0631\u0627\u0646</span><span class=\"en\">SonoPars \u2014 CUSHA</span></footer>\n</div>\n\n</div>";
  if(!document.getElementById('cusha-fonts')){var l=document.createElement('link');l.id='cusha-fonts';l.rel='stylesheet';l.href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Vazirmatn:wght@300;400;600;700&family=JetBrains+Mono:wght@400&display=swap";document.head.appendChild(l);}
  async function run(sr){
const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/+esm');
const {OrbitControls}=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js/+esm');
const {GLTFLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js/+esm');
const {DRACOLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js/+esm');
const {RoomEnvironment}=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js/+esm');


const S=id=>`https://docs.google.com/spreadsheets/d/${id}/edit`, F=id=>`https://drive.google.com/drive/folders/${id}`;
// key: [Persian name, finish, sheet id, folder id, explode vector (mm)]
const MODS={
 Body_Sheet_metal:['بدنه ورق‌کاری','ورق فولادی، رنگ سفید','1oWg0dly2nrwykXRWpS51K5TmOPpH-pSDnwv3tKtyXeg','1NtIvZtjJ0FRCO5MDYUcNvlRJ4S8CX3rl',[0,0,0]],
 Aluminium_panel_CNC:['پنل‌های آلومینیومی CNC','آلومینیوم آنادایز','1EzNg-wFyozQcvxysbo5xSSbSo4TBD9BdN5M2tB-XeSE','1SmbjA1ESpbKia42NaX6_J3XgbM1bVDov',[0,20,220]],
 Dwin_LCD:['نمایشگر لمسی DWIN','شیشه مشکی، ۱۳٫۳ اینچ','1HBm9c_thHQCuh3JtVLj1VbhuFq9XPTlPuyfVJNRzfJw','1wQRpl9BvQv2R3gSsWt29qpV3-Xw0O-Rq',[0,70,380]],
 Pristaltic_pump:['پمپ پریستالتیک','Kamoer KK300','1aV8YqgunLg_k9lVMQo8NQdvqxUknv4l1XwY6OeNuHTE','1E9QEaUh_SyJFYg5gHFrfWK1FQ9eBq5EL',[170,30,420]],
 Pinch_Valve:['شیر پینچ','آلومینیوم آنادایز','1wtBQk7lyG1Az4WGQ5uoZTp7ANb1Mg2G43_qkU0g6jTc','1Z4qoOMiWobGlqENfGwtE6AchCVHbfLrE',[-180,10,470]],
 Suction_Pump:['پمپ ساکشن','—','1-Eep5BvcNDoQCxbtc2ns2ulYRwjaQnxoVpLcmJVoyVk','1lw9htlmOAV7rcqaUAMdASE5oxje7WFV-',[0,60,-40]],
 Requaltor:['رگولاتور و موتور پله‌ای','NEMA 23','14qBSsTDyOs73jybKSF2wj8aoog54f5qZsJ6YFCtePb0','1wys4aSE1fe-LHoUsBLc4PjWwbwsBTDvP',[300,-10,-80]],
 Trolly_Handel:['ترولی و دسته','پایه','1g71kmIJ2mVM5bNcj3KhDdS8dJHaMZ137Ol32pV6M_60','1v9mwFhOL3wShMoCexqHxafQS1_Zr4-Dj',[0,-230,0]],
};
// per-node overrides: covers split sideways, back plate goes backwards
const NODE={'Body_Sheet_metal#0':[300,160,0],'Body_Sheet_metal#1':[-300,160,0],'Aluminium_panel_CNC#2':[0,0,-300],'Aluminium_panel_CNC#1':[0,-10,190]};

const canvas=sr.getElementById('c'), stage=sr.getElementById('stage');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene();
scene.environment=new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(),0.04).texture;
const cam=new THREE.PerspectiveCamera(32,1,1,20000);
const ctr=new OrbitControls(cam,canvas); ctr.enableDamping=true; ctr.autoRotate=true; ctr.autoRotateSpeed=0.55; ctr.enablePan=false;
const key=new THREE.DirectionalLight(0xffffff,1.4); key.position.set(600,900,900); scene.add(key);
const rim=new THREE.DirectionalLight(0x6fd8ff,1.1); rim.position.set(-900,300,-700); scene.add(rim);
scene.add(new THREE.HemisphereLight(0xcfe6ff,0x0a1440,0.5));

const root=new THREE.Group(); scene.add(root);
const groups={}, movers=[], pickables=[];
let explode=0, target=0, selected=null, hovered=null, showLabels=true;

function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
new ResizeObserver(resize).observe(stage); resize();

const labelsEl=sr.getElementById('labels');
const onModel=gltf=>{
  const m=gltf.scene;
  const box=new THREE.Box3().setFromObject(m), c=box.getCenter(new THREE.Vector3());
  m.position.sub(c); root.add(m); root.updateMatrixWorld(true);
  Object.keys(MODS).forEach((k,i)=>{
    const g=m.getObjectByName(k); if(!g) return;
    const matCache=new Map();
    g.traverse(o=>{ if(o.isMesh){
      if(!matCache.has(o.material)) matCache.set(o.material,o.material.clone());
      o.material=matCache.get(o.material); o.material.envMapIntensity=1.1; o.userData.mod=k; pickables.push(o);
    }});
    g.children.forEach(ch=>{const v=NODE[ch.name]||MODS[k][4]; movers.push({o:ch,base:ch.position.clone(),v:new THREE.Vector3(...v)});});
    const gb=new THREE.Box3().setFromObject(g); const anchor=gb.getCenter(new THREE.Vector3());
    if(k==='Body_Sheet_metal'){const cb=new THREE.Box3().setFromObject(g.children[0]); anchor.copy(cb.getCenter(new THREE.Vector3())); anchor.y=cb.max.y; anchor.v=new THREE.Vector3(...NODE['Body_Sheet_metal#0']);}
    if(k==='Aluminium_panel_CNC'){const cb=new THREE.Box3().setFromObject(g.children[1]); anchor.copy(cb.getCenter(new THREE.Vector3())); anchor.v=new THREE.Vector3(...NODE['Aluminium_panel_CNC#1']);}
    if(k==='Dwin_LCD'){anchor.y=gb.max.y;}
    const a=document.createElement('a'); a.className='lbl'; a.href=S(MODS[k][2]); a.target='_blank'; a.rel='noopener';
    a.innerHTML=`<i></i>${k.replace(/_/g,' ')}<small>${MODS[k][0]}</small>`;
    a.addEventListener('mouseenter',()=>setHover(k)); a.addEventListener('mouseleave',()=>setHover(null));
    labelsEl.appendChild(a);
    groups[k]={g,anchor,v:anchor.v||new THREE.Vector3(...MODS[k][4]),el:a,i};
  });
  // LCD screen image on the tilted glass (normal tilted ~9.8deg about X)
  const lcd=m.getObjectByName('Dwin_LCD#0');
  if(lcd){
    new THREE.TextureLoader().load(BASE+'screen.jpg',t=>{
      t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=8;
      const th=Math.asin(0.17/Math.hypot(0.17,0.98));
      const N=new THREE.Vector3(0,Math.sin(th),Math.cos(th)), U=new THREE.Vector3(0,Math.cos(th),-Math.sin(th));
      const p=new THREE.Mesh(new THREE.PlaneGeometry(294,165.4),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));
      p.position.copy(N.clone().multiplyScalar(1.75)).add(U.clone().multiplyScalar(3.45)); p.rotation.x=-th;
      lcd.add(p);
    });
  }
  const size=box.getSize(new THREE.Vector3()).length();
  cam.position.set(size*0.95,size*0.42,size*1.35); ctr.target.set(0,0,0); ctr.minDistance=size*0.5; ctr.maxDistance=size*4;
  sr.getElementById('status').hidden=true;
  buildGrid();
};
const fail=()=>{sr.getElementById('status').textContent='بارگذاری مدل ناموفق بود. صفحه را دوباره باز کنید.';};
{const dl=new DRACOLoader(); dl.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/');
const gl=new GLTFLoader(); gl.setDRACOLoader(dl); gl.load(BASE+'cusha.glb',onModel,e=>{if(e.total)sr.getElementById('prog').textContent=Math.round(e.loaded/e.total*100)+'%';},fail);}

// explode slider
const ex=sr.getElementById('ex'), pct=sr.getElementById('pct');
ex.addEventListener('input',()=>{target=ex.value/100; pct.textContent=ex.value+'%'; ctr.autoRotate=false; setRot(false);});
const rotBtn=sr.getElementById('rot'), labBtn=sr.getElementById('lab');
function setRot(on){ctr.autoRotate=on; rotBtn.setAttribute('aria-pressed',on);}
rotBtn.onclick=()=>setRot(!ctr.autoRotate);
labBtn.onclick=()=>{showLabels=!showLabels; labBtn.setAttribute('aria-pressed',showLabels);};

// picking
const ray=new THREE.Raycaster(), ptr=new THREE.Vector2(); let down=null;
function pick(e){const r=canvas.getBoundingClientRect(); ptr.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1); ray.setFromCamera(ptr,cam); const h=ray.intersectObjects(pickables,false)[0]; return h?h.object.userData.mod:null;}
canvas.addEventListener('pointermove',e=>{ if(e.pointerType==='mouse'){const k=pick(e); setHover(k); canvas.style.cursor=k?'pointer':'grab';}});
canvas.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
canvas.addEventListener('pointerup',e=>{ if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<5){ select(pick(e)); } down=null;});
function tint(k,amt){ if(!k||!groups[k]) return; groups[k].g.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material.emissive.setHex(0x1b8fff);o.material.emissiveIntensity=amt;}});}
function setHover(k){ if(hovered===k) return; if(hovered&&hovered!==selected) tint(hovered,0); hovered=k; if(k&&k!==selected) tint(k,0.18); Object.entries(groups).forEach(([n,G])=>G.el.classList.toggle('on',n===k||n===selected));}
const card=sr.getElementById('card');
function select(k){
  if(selected) tint(selected,0); selected=k;
  sr.querySelectorAll('.mod').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
  if(!k){card.hidden=true; setHover(hovered); return;}
  tint(k,0.32); const M=MODS[k];
  sr.getElementById('cfa').textContent=M[0]; sr.getElementById('cen').textContent=k+'.stp';
  sr.getElementById('cfin').textContent='پرداخت / مشخصه: '+M[1];
  sr.getElementById('csheet').href=S(M[2]); sr.getElementById('cfold').href=F(M[3]);
  card.hidden=false; Object.entries(groups).forEach(([n,G])=>G.el.classList.toggle('on',n===k));
}
sr.getElementById('cardx').onclick=()=>select(null);

function buildGrid(){
  const grid=sr.getElementById('grid');
  Object.entries(MODS).forEach(([k,M],i)=>{
    const b=document.createElement('button'); b.className='mod'; b.dataset.k=k;
    b.innerHTML=`<span class="n">${String(i+1).padStart(2,'0')}</span><b>${M[0]}</b><span class="en">${k}.stp</span><span class="fin">${M[1]}</span>`;
    b.onclick=()=>{select(k); stage.scrollIntoView({behavior:'smooth',block:'center'}); if(target<0.5){target=0.7;ex.value=70;pct.textContent='70%';}};
    grid.appendChild(b);
  });
}

// render loop
const tmp=new THREE.Vector3(); const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
let last=performance.now();
function frame(now=performance.now()){
  const dt=Math.min(0.1,(now-last)/1000); last=now;
  explode+= (target-explode)*(1-Math.exp(-dt*4.5));
  const e=ease(Math.min(1,Math.max(0,explode)));
  for(const m of movers) m.o.position.copy(m.base).addScaledVector(m.v,e);
  const sc=1/(1+0.42*e); root.scale.setScalar(sc);
  ctr.update(); renderer.render(scene,cam);
  const w=stage.clientWidth,h=stage.clientHeight, lop=showLabels?Math.min(1,Math.max(0,(e-0.12)*2.2)):0;
  for(const k in groups){const G=groups[k];
    tmp.copy(G.anchor).addScaledVector(G.v,e).multiplyScalar(sc); tmp.project(cam);
    const x=(tmp.x*.5+.5)*w, y=(-tmp.y*.5+.5)*h;
    G.el.style.transform=`translate(${x}px,${y}px) translate(-50%,-140%)`;
    G.el.style.opacity=(tmp.z<1)?lop:0; G.el.style.pointerEvents=lop>0.2?'auto':'none';
  }
  requestAnimationFrame(frame);
}
frame();

  }
  function mount(host){
    if(host.shadowRoot) return;
    var root=host.attachShadow({mode:'open'});
    root.innerHTML='<style>'+CSS+'</style>'+HTML;
    var art=host.querySelector('.cusha-static'); if(art) art.style.display='none';
    run(root).catch(function(e){console.error('CUSHA page',e);var st=root.getElementById('status');if(st)st.textContent='Model could not load.';});
  }
  function mountAll(){[].forEach.call(document.querySelectorAll('[data-cusha-page]'),mount);}
  window.CushaPage={mountAll:mountAll};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountAll);else mountAll();
})();
