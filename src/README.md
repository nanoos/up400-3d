# Sources for the UHP-400 product page

Live page: https://ultrasonic-homogenizer.gosite.dev/en/uhp-400 (GoSite HTML module loads `page/uhp-page.js` from this repo via jsDelivr, pinned to a commit SHA).

- `page/index.html` – the full page (standalone version, also used for the claude.ai preview). Edit this first.
- `page/build_gosite.py` – turns `index.html` into `page/uhp-page.js` (shadow-DOM embed for GoSite).
- `model/` – STEP → mesh pipeline: `tess.py` (OCP tessellation) → `build_glb.py` (device.glb for the viewer) / `build_parts.py` (parts.json split into head, stack, probes, door, table, body, back for the page).
- `tools/render.py` – renders the phone fallback stills (`page/m-*.jpg`); `tools/t.py` – Playwright screenshots for checks.

Update flow: edit `src/page/index.html` → run `build_gosite.py` → copy to `page/` → commit → put the new commit SHA in the GoSite module.
