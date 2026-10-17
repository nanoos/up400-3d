# UHP-400 product catalog (standalone document, not the GoSite page)

Two build scripts, kept separate from the v2 page work:

- `build_en_draft.py` — English working draft (python-docx). Full BANDELIN-style
  structure with green text/boxes for facts and photos Amir still needs to supply.
  Run: `python3 build_en_draft.py` from this folder (expects images in `../../catalog/assets/`,
  i.e. the ones pulled from the claude.ai project files `topsonics_UHP-400 1-6.png` and the
  v2 page's `box-crate/box-head/box-cables.webp`).
- `fa_catalog.html` + `render.js` — final, polished Persian catalog (print-ready A4, RTL,
  brand colors/fonts from `src/page/index.html`). Contains **only verified facts** (per the
  `topsonics-marketing` skill's claims-and-compliance list) — no placeholders, nothing
  unconfirmed. Fonts are in `fonts/` (Vazirmatn + Titillium Web, via @fontsource, Arabic/Latin
  subsets only). Images referenced via `assets/...` — same source images as above, expected
  in a sibling `assets/` folder next to the HTML when rendering.
  Render: `node render.js` (uses Playwright/Chromium, outputs a print PDF).

## Known open conflicts to resolve before reusing either file (do not silently pick one)
- **Frequency:** datasheet PDF + topsonics-marketing skill say 20 kHz ± 1 kHz; the live
  GoSite page (`src/page/index.html`) says 24 kHz ± 1 kHz. The Persian catalog omits this
  figure entirely until resolved.
- **Probe sizes:** marketing skill says one horn size (15 mm) is confirmed, 7 mm is
  explicitly an unconfirmed claim; the live GoSite page lists both 7 mm and 15 mm.
- **Temperature:** datasheet says display range 0–100 °C; live page says 0–80 °C limit with
  alarm/auto-stop. Could be two different things (display vs. safety cutoff) or a copy error
  — not stated anywhere as one confirmed number, so the Persian catalog only says "built-in
  thermometer" with no range.
- **"Run records" / data logging:** appears in the live GoSite spec table; the marketing
  skill explicitly lists "data logging / SD card" as a claim not to make until confirmed.
  Left out of the Persian catalog.
- **CE declaration:** the only one on file (2019, model "UP-400", Tehran address) cites
  superseded EU directives and should not be published as current compliance — see
  `references/claims-and-compliance.md` in the topsonics-marketing skill.

Fix the live `uhp-400` / `uhp-400-v2` GoSite pages and this catalog together once Amir
confirms the real numbers, so the three don't keep drifting apart.
