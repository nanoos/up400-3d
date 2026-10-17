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

## Spec conflict — resolved 17 Oct 2026: the live site is the reference
The datasheet PDF and the (now outdated) `topsonics-marketing` skill disagreed with the
live GoSite page (`src/page/index.html`) on four points. Amir decided: **the live site wins**.
`fa_catalog.html` now uses the site's numbers:
- Frequency: **24 kHz ± 1 kHz** (not the datasheet's 20 kHz).
- Probes: **7 mm and 15 mm** tips, both Ti-6Al-4V (not just 15 mm).
- Temperature: **0–80 °C sensor, with alarm and auto-stop at the limit** (not the datasheet's
  0–100 °C display range).
- Control head: 5" capacitive touchscreen **with run-history logging** (the
  `topsonics-marketing` skill's claims list had this as "not confirmed" — it is now).
- Also added from the site, not previously in the catalog: enclosure colour options
  (white/green/blue).

The `topsonics-marketing` skill's `references/claims-and-compliance.md` still has the old
(wrong) numbers and the old "do not claim" list — it was not updated as part of this change.
**Update that skill to match before anyone drafts more Topsonics copy from it**, or the two
will drift apart again.

Still true and unchanged by this decision:
- **CE declaration:** the only one on file (2019, model "UP-400", Tehran address) cites
  superseded EU directives and should not be published as current compliance — see
  `references/claims-and-compliance.md` in the topsonics-marketing skill.
- `build_en_draft.py` (the English BANDELIN-style draft) was built before this resolution
  and still has the old, more cautious numbers in its green-flagged gaps — re-check it
  against this file before reusing.

## Second rebuild — 17 Oct 2026: company identity switched to ultrasonic.co.ir (Iran)

Amir asked for the *final/graphic* Persian catalog (`fa_catalog.html`) to be rebuilt from the
real Persian site content (`src/page-fa/index.html` / `wp-plugin/assets/content-fa.html`)
instead of the English/Lithuania GoSite copy used in the first draft. Changes:

- **Manufacturer/company identity**: "توپ‌سونیکس، ویلنیوس، لیتوانی" (Lithuania/EU) replaced
  throughout with "شرکت توسعه فناوری مافوق صوت" — ساخت ایران، فعال از سال ۱۳۸۲ (2003). This
  is the real company identity used on ultrasonic.co.ir (WP plugin author field, JSON-LD
  `manufacturer`); "Topsonics" stays as the product/brand name only (JSON-LD `brand`), so the
  logo/wordmark on the cover is unchanged.
- **Contact page**: real Iran contact (WhatsApp/Telegram + phone `+98 912 383 0551`,
  `ultrasonic.co.ir`) replacing the fabricated Lithuania email/phone numbers from the first
  draft, with clickable `wa.me`/`tel:` links matching the site fix below.
- **New pages**: a "شواهد علمی" (research/evidence) page listing the 6 real peer-reviewed
  citations from the site with DOIs, and a real FAQ page (both lifted from
  `content-fa.html`) — replacing invented generic content from the BANDELIN-inspired draft.
- **Applications page**: rewritten to the site's actual four use-cases (cell lysis/ChIP,
  nanoparticle dispersion, plant-compound extraction, repeatable run settings).
- **Graphic design pass**: added a feature-chip row (touch screen / run-logging / auto
  temperature stop), a three-color body-swatch grid using the real render-white/green/blue
  renders, and fixed a CSS grid bug in the new research list (meta/DOI text was wrapping into
  the narrow number-badge column instead of the content column).
- `assets/` now holds the actual images used (device photos, in-the-box photos, logo, the
  3 color renders) rather than only being documented as "copy them in before rendering" —
  the catalog folder is self-contained in git now.

**Not done / still open:** `build_en_draft.py` (English draft) still uses the Lithuania/EU
company framing and was not touched in this pass — if that file is reused, it needs the same
Iran-identity rebase, or it will contradict `fa_catalog.html`.
