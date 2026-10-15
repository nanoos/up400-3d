# Assembling the WordPress plugin zip

The PHP, static content and codes live here; media and vendor files are copied in when packaging:

1. `python3 src/build_fa.py && python3 src/build_wp.py` -> `uhp-page-wp.js` (all paths from the plugin folder via `window.UHP_WP`).
2. Copy into `topsonics-uhp400/assets/`:
   - `page/`: every file of repo `page/` except `*.js` and `parts.json`, plus `uhp-page-wp.js`
   - root: `*.jpg` (viewer screens), `device-draco.glb`, `up400-viewer.js`
   - `vendor/three/` (r128): `build/three.min.js`, `examples/js/loaders/{GLTFLoader,DRACOLoader}.js`, `examples/js/environments/RoomEnvironment.js`, `examples/js/controls/OrbitControls.js`, `examples/js/libs/draco/{draco_wasm_wrapper.js,draco_decoder.wasm,draco_decoder.js}`
   - `vendor/libs/html2canvas/1.4.1/html2canvas.min.js`, `vendor/libs/jspdf/2.5.1/jspdf.umd.min.js`
3. Zip the `topsonics-uhp400` folder.

Tested on WordPress (SQLite) with PHP 8.3: page mounts with zero external requests, proforma, one-time codes, parts, admin pages, PDF download.
