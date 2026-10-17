# -*- coding: utf-8 -*-
"""UHP-400 principled catalog (EN), modeled on BANDELIN SONOPULS structure but scaled
to a single product. Green text = facts Amir must supply. Green dashed box = missing
image, with either an AI-generation prompt (for diagrams/illustrations) or an explicit
"must be a real photo" note (for anything that proves the real product)."""

from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

A = "/home/claude/catalog/assets/"
GREEN = RGBColor(0x1B, 0x8A, 0x3A)
NAVY = RGBColor(0x12, 0x2A, 0x4E)
GREY = RGBColor(0x55, 0x5A, 0x60)
LIGHTGREEN_FILL = "E6F4EA"
LIGHTGREY_FILL = "F2F4F6"

doc = Document()

# ---------------------------------------------------------------- base styles
style = doc.styles["Normal"]
style.font.name = "Calibri"
style.font.size = Pt(10.5)
for section in doc.sections:
    section.left_margin = Cm(2.0)
    section.right_margin = Cm(2.0)
    section.top_margin = Cm(1.8)
    section.bottom_margin = Cm(1.8)

def set_cell_shading(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)

def set_cell_border(cell, color="1B8A3A", sz="12", val="dashed"):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), val)
        el.set(qn("w:sz"), sz)
        el.set(qn("w:color"), color)
        borders.append(el)
    tcPr.append(borders)

def h1(text, number=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    if number:
        r = p.add_run(f"{number}  ")
        r.font.size = Pt(22); r.font.bold = True; r.font.color.rgb = RGBColor(0xBF, 0xD9, 0xE8)
    r = p.add_run(text)
    r.font.size = Pt(20); r.font.bold = True; r.font.color.rgb = NAVY
    bottom_rule(p)
    return p

def bottom_rule(p, color="122A4E", sz="12"):
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), sz)
    bottom.set(qn("w:space"), "4")
    bottom.set(qn("w:color"), color)
    pBdr.append(bottom)
    pPr.append(pBdr)

def h2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    r.font.size = Pt(14); r.font.bold = True; r.font.color.rgb = NAVY
    return p

def h3(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(text)
    r.font.size = Pt(11.5); r.font.bold = True; r.font.color.rgb = RGBColor(0x2F, 0x6F, 0x8F)
    return p

def body(text, size=10.5, italic=False, bold=False, color=None, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    r = p.add_run(text)
    r.font.size = Pt(size); r.italic = italic; r.bold = bold
    if color: r.font.color.rgb = color
    return p

def mixed(parts, space_after=6):
    """parts: list of (text, is_green) tuples, rendered in one paragraph."""
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    for text, green in parts:
        r = p.add_run(text)
        r.font.size = Pt(10.5)
        if green:
            r.font.color.rgb = GREEN
            r.italic = True
    return p

def bullet(text, green=False):
    p = doc.add_paragraph(style="List Bullet")
    r = p.add_run(text)
    r.font.size = Pt(10.5)
    if green:
        r.font.color.rgb = GREEN
        r.italic = True
    return p

def need_text(label, prompt=""):
    """Inline green placeholder span used inside mixed() calls."""
    return (f"[NEEDED: {label}" + (f" — {prompt}" if prompt else "") + "]", True)

def image_box(label, kind, detail, width=Inches(5.5)):
    """kind: 'prompt' (AI-generation ok) or 'real' (must be an authentic photo)."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.rows[0].cells[0]
    set_cell_shading(cell, LIGHTGREEN_FILL)
    set_cell_border(cell)
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(8)
    tag = "IMAGE NEEDED — AI PROMPT OK" if kind == "prompt" else "PHOTO NEEDED — MUST BE REAL (do not AI-generate)"
    r = p.add_run(f"□  {tag}\n")
    r.font.bold = True; r.font.color.rgb = GREEN; r.font.size = Pt(9.5)
    r2 = p.add_run(label)
    r2.font.bold = True; r2.font.color.rgb = GREEN; r2.font.size = Pt(10.5)
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(8)
    r3 = p2.add_run(detail)
    r3.font.color.rgb = GREEN; r3.font.size = Pt(9.5); r3.italic = True
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table

def add_pic(path, width=Inches(2.6), caption=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.add_picture(path, width=width)
    if caption:
        c = doc.add_paragraph()
        c.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cr = c.add_run(caption)
        cr.italic = True; cr.font.size = Pt(9); cr.font.color.rgb = GREY

def spec_table(rows, headers=("Property", "Value")):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Light Grid Accent 1"
    hdr = t.rows[0].cells
    for i, htext in enumerate(headers):
        hdr[i].text = ""
        pr = hdr[i].paragraphs[0]
        r = pr.add_run(htext)
        r.bold = True; r.font.size = Pt(10); r.font.color.rgb = RGBColor(0xFF,0xFF,0xFF)
        set_cell_shading(hdr[i], "122A4E")
    for row in rows:
        cells = t.add_row().cells
        for i, val in enumerate(row):
            cells[i].paragraphs[0].clear() if cells[i].paragraphs[0].runs else None
            green = isinstance(val, tuple)
            text = val[0] if green else val
            r = cells[i].paragraphs[0].add_run(text)
            r.font.size = Pt(9.8)
            if green:
                r.font.color.rgb = GREEN
                r.italic = True
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t

def note_box(text, kind="info"):
    table = doc.add_table(rows=1, cols=1)
    cell = table.rows[0].cells[0]
    color = "FDF3D0" if kind == "info" else "FBE3E0"
    set_cell_shading(cell, color)
    p = cell.paragraphs[0]
    r = p.add_run(("⚠  " if kind != "info" else "ℹ  ") + text)
    r.font.size = Pt(9.8)
    r.font.color.rgb = RGBColor(0x6B, 0x4E, 0x00) if kind == "info" else RGBColor(0x8A, 0x1F, 0x11)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    return table

def page_break():
    doc.add_page_break()

# ================================================================= COVER
p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(60)
r = p.add_run("TOPSONICS")
r.font.size = Pt(16); r.font.bold = True; r.font.color.rgb = NAVY

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(30)
r = p.add_run("UHP-400")
r.font.size = Pt(44); r.font.bold = True; r.font.color.rgb = NAVY

p = doc.add_paragraph()
r = p.add_run("Ultrasonic Homogenizer — Technical & Application Catalog")
r.font.size = Pt(15); r.font.color.rgb = GREY

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(10)
r = p.add_run("20 kHz · up to 400 W · integrated sound enclosure, temperature display and touchscreen control")
r.font.size = Pt(11); r.font.italic = True; r.font.color.rgb = GREY

add_pic(A + "device_lab1.png", width=Inches(6.3))

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(20)
r = p.add_run("Draft catalog — built from the BANDELIN SONOPULS catalog structure, scaled to one product. "
              "Text in green marks facts Amir needs to supply; green boxes mark missing images.")
r.font.size = Pt(9); r.italic = True; r.font.color.rgb = GREY

page_break()

# ================================================================= TOC (manual, simple)
h2("Contents")
toc_items = [
    ("01", "Understanding ultrasonic homogenization", "3"),
    ("02", "The UHP-400", "5"),
    ("03", "Using the UHP-400", "11"),
    ("04", "Applications", "14"),
    ("05", "Service & support", "17"),
]
for num, title, pg in toc_items:
    p = doc.add_paragraph()
    r = p.add_run(f"{num}   {title}")
    r.font.size = Pt(11)
body("Page numbers are approximate in this draft; they will settle once the green sections are filled in.",
     size=8.5, italic=True, color=GREY)

page_break()

# ================================================================= CH 01
h1("Understanding ultrasonic homogenization", "01")

h2("How it works")
body("An ultrasonic homogenizer converts electrical energy into mechanical vibration at a fixed ultrasonic "
     "frequency — for the UHP-400, 20 kHz ± 1 kHz, above the range of human hearing. A piezoelectric "
     "converter inside the instrument vibrates at this frequency; a titanium horn amplifies the vibration's "
     "amplitude and transmits it to a probe, whose tip is immersed in the liquid sample.")
body("The vibrating tip alternately compresses and expands the liquid immediately next to it, fast enough that "
     "microscopic vapour bubbles form and then collapse violently — a phenomenon called cavitation. Each "
     "bubble collapse releases a local, momentary spike of pressure and temperature. Spread over millions of "
     "bubbles per second, this is what disperses particles, breaks up cell walls, emulsifies immiscible liquids, "
     "and accelerates dissolution and reactions.")

h2("Why a probe homogenizer instead of a bath")
rows = [
    ["Energy delivery", "Direct, concentrated at the probe tip — high local intensity"],
    ["Typical volumes", "µl to several litres, same instrument"],
    ["Processing time", "Seconds to minutes"],
    ["Best for", "Cell/tissue disruption, nanoparticle dispersion, emulsification, degassing, extraction"],
]
spec_table(rows, headers=("", ""))

h2("About the 400 W figure — and why it needs three numbers, not one")
body("“400 W” on its own is ambiguous, and a buyer who later measures something different will feel "
     "misled. Three different numbers are all legitimately called “power” for this type of instrument, "
     "and the catalog should state all three rather than pick one:")
bullet("Generator output power — the maximum electrical power the generator can deliver to the converter (this is what “400 W” means here).")
mixed([("Mains power draw — what the instrument pulls from the wall socket; always higher than the generator output, because the generator and cooling fan have losses. ", False), need_text("measured mains draw in W or A at full power")])
mixed([("Calorimetric (acoustic) power — the power that actually reaches the liquid, which is always lower than the generator output and depends on the probe tip, amplitude and liquid. ", False), need_text("measured calorimetric power for the standard probe, by amplitude")])

h3("How calorimetric power is measured (standard method)")
body("This is the industry-standard method (used by BANDELIN and others) for stating a credible, independently "
     "checkable power figure, and is worth adopting as-is:")
body("P = ΔQ / Δt = c · m · ΔT / Δt", italic=False, bold=True, size=12)
rows = [
    ["P", "Acoustic power delivered to the liquid [W]"],
    ["ΔQ", "Heat supplied to the liquid [J]"],
    ["Δt", "Sonication time [s]"],
    ["c", "Specific heat capacity of the liquid [J/(kg·K)] — 4186 for water"],
    ["m", "Mass of the liquid sample [kg]"],
    ["ΔT", "Temperature rise measured over Δt [K]"],
]
spec_table(rows, headers=("Symbol", "Meaning"))
note_box("Procedure: sonicate a known mass of water (e.g. 100–200 ml) in an insulated vessel for a short, fixed "
         "time at a given amplitude, record the temperature rise with a fast thermometer immediately after stopping, "
         "and compute P. Repeat at a few amplitude settings to build a power-vs-amplitude curve. This only needs doing "
         "once per probe/amplitude combination and then can be published permanently.", kind="info")
mixed([("Measured result: ", False), need_text("calorimetric power table (W) vs. amplitude setting, for the standard probe")])

h2("Device anatomy")
image_box("Annotated cutaway / labelled photo of the UHP-400",
          "prompt",
          "AI image prompt (or redraw in-house): ‘Clean technical illustration, side cutaway view of a compact "
          "benchtop ultrasonic homogenizer, cream-and-white enclosure with a glass viewing window, labelled parts: "
          "touchscreen control head, piezoelectric converter, titanium horn, sonication probe, beaker with sample, "
          "sample platform, sound-insulated enclosure. Flat vector / technical-manual style, light background, "
          "clear leader lines and labels, no brand logos.’")

page_break()

# ================================================================= CH 02
h1("The UHP-400", "02")

add_pic(A + "device_front.png", width=Inches(2.3))
h2("At a glance")
rows = [
    ["Type", "Benchtop probe-type ultrasonic homogenizer (ultrasonic processor)"],
    ["Frequency", "20 ± 1 kHz, fixed"],
    ["Generator output", "0–400 W, adjustable"],
    ["Control", "5\" TFT touchscreen"],
    ["Working mode", "Continuous or pulsed (pulse ON 1–15 s, pulse OFF 1–12 s, max. cycle 30 min)"],
    ["Enclosure", "Built-in sound-insulated cabinet with viewing window"],
    ["Temperature display", "Built-in thermometer, 0–100 °C"],
    ["Standard horn/probe", "Ti-6Al-4V titanium alloy, 15 mm tip diameter"],
    ["Working volume", "100–3,500 ml (standard probe)"],
    ["Power supply", "220 V AC, 50–60 Hz"],
    ["Rated input current", "2 A"],
]
spec_table(rows)
mixed([("Source: current TOPSONICS/ultrasonic.co.ir spec sheet. ", False),
       (" Not yet confirmed for the current UHP-400 (only documented for the related UP-400 unit):", False)])
bullet("Peak tip amplitude (µm, unloaded)", green=True)
bullet("Working volume range for a smaller/micro probe, if one is offered", green=True)
bullet("Noise level, dB(A), measured at 1 m with the enclosure door closed / open", green=True)
bullet("Overall depth and weight of the unit", green=True)
bullet("Any digital/data connection (USB, RS-232, Ethernet) for logging or export", green=True)
bullet("IP rating of the enclosure, if any", green=True)

h2("What's in the box")
body("Real photos of exactly what ships, taken against a plain background, do more for buyer confidence than any "
     "rendering — this is one of the two highest-priority fixes from the last page review.")

t = doc.add_table(rows=1, cols=3)
t.autofit = True
c = t.rows[0].cells
for cell, img, cap in [
    (c[0], A + "box_crate.png", "Shipping crate"),
    (c[1], A + "box_head.png", "Control head, converter, horn and probe"),
    (c[2], A + "box_cables.png", "Cables and temperature sensor"),
]:
    cell.paragraphs[0].add_run().add_picture(img, width=Inches(1.7))
    p = cell.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(cap); r.font.size = Pt(8.5); r.italic = True
doc.add_paragraph().paragraph_format.space_after = Pt(4)

mixed([("Still missing, and needed before this section is complete: ", False)])
bullet("Photo of the sound-insulated enclosure as packed for shipping", green=True)
bullet("Photo of both probe sizes together, if more than one ships as standard", green=True)
bullet("What exactly is printed on the box labelled ‘cables and temperature sensor’ above — confirm which cable is the red one, which is the black screw-lock one, and which is the DB9 connector, and what each one connects to", green=True)
bullet("Whether a printed manual, quick-start card, calibration certificate or test report is included", green=True)

h2("Accessories")
mixed([("What is actually sold alongside the UHP-400 — spare probes of other diameters, cooling vessels, "
        "a stand, a sound-proof upgrade, a recirculating chiller, temperature probes, a foot switch? ", False),
       need_text("list of accessories actually offered, with part numbers/prices if they exist")])
note_box("BANDELIN sells a matching probe/vessel/accessory ecosystem (rosette cooling cells, flow-through vessels, "
         "indirect-sonication cup horns, a sound-proof cabinet, a recirculating chiller). The UHP-400 already has "
         "the enclosure and temperature display built in, so it doesn't need to copy that whole catalog — "
         "only list what we actually sell or could realistically offer; inventing accessories we don't carry "
         "would be the kind of unverifiable claim the earlier page review flagged.", kind="warn")

page_break()

# ================================================================= CH 03
h1("Using the UHP-400", "03")

h2("Choosing a vessel and immersion depth")
body("A narrow, tall vessel gives better sound distribution than a wide one: energy is emitted downward and to "
     "the sides from the probe tip, and in a wide vessel much of the liquid never enters the active cavitation "
     "field. A slim, conical vessel is usually the better choice; cooling in an ice bath works well with narrow "
     "vessels too, since the sample stays in contact with the cold wall.")
body("The probe should normally be immersed about 1–2 cm into the liquid. Too shallow and the sample may "
     "foam or splash; too deep and the sample is damped and the result is poorer, particularly with viscous "
     "liquids.")
image_box("Immersion depth — correct vs. too shallow vs. too deep",
          "prompt",
          "AI image prompt: ‘Three simple side-by-side technical diagrams of a glass beaker with liquid and a "
          "metal sonication probe tip dipped in from above; left labelled a green checkmark ‘correct, "
          "1–2 cm’; middle labelled a red cross ‘too shallow – splashing’; right labelled a "
          "red cross ‘too deep – damped’. Clean flat illustration style, light grey background, no text "
          "other than the labels described.’")

h2("Setting the sound parameters")
rows = [
    ["Amplitude", "Controls cavitation intensity. Start from a low setting and increase only as needed — "
     "excess amplitude mainly adds heat and foaming, not better results."],
    ["Pulse mode", "Alternates ON/OFF so heat can dissipate between bursts. UHP-400 supports ON 1–15 s / "
     "OFF 1–12 s, for a cycle of up to 30 minutes."],
    ["Temperature", "The built-in display reads 0–100 °C. For heat-sensitive samples, cool in an ice bath "
     "and favour pulse mode over continuous operation."],
    ["Sonication time", "Usually 15 s to 5 min for a given sample; find the right duration experimentally, since "
     "it depends on volume, viscosity and the desired result."],
]
spec_table(rows, headers=("Parameter", "Guidance"))

h2("Good practice")
bullet("Mount the converter only by its housing (e.g. in a stand clamp) — never by the cable or the horn.")
bullet("For very small volumes, immerse the probe as far as practical and consider a conical tube to reduce splashing.")
bullet("Glass beads (up to ~0.5 mm) can intensify cavitation on tough samples; they settle out afterwards and can be centrifuged off.")
bullet("Clean the probe tip after each use; inspect regularly for pitting, which reduces output over time.")
mixed([("Probe wear/lifetime data for our titanium probe at typical amplitudes: ", False),
       need_text("hours-to-replace guide value, if we have it from field use or testing")])

h2("Safety")
bullet("Hearing protection is recommended outside the enclosure during extended continuous use, and required if operating without the enclosure closed.")
mixed([("Door interlock — does the UHP-400 stop or warn if the enclosure door is opened during sonication? ", False), need_text("confirm interlock behaviour")])
mixed([("Any auto-stop on over-temperature or on probe fault? ", False), need_text("confirm")])

page_break()

# ================================================================= CH 04
h1("Applications", "04")
body("The processes below are the standard, well-established applications of probe-type ultrasonic homogenizers "
     "in general — they are not unique to the UHP-400 and are not, by themselves, proof of its performance. "
     "Real UHP-400 case studies (next page) are what actually builds buyer confidence; this overview exists to "
     "help a visitor recognize their own problem.")

apps = [
    ("Cell & tissue disruption", "Lysis of bacteria, yeast, fungi, plant cells, algae and tissue for DNA/RNA, "
     "protein and metabolite extraction. The standard method in molecular biology labs for decades."),
    ("Nanoparticle dispersion", "De-agglomeration of nanoparticles in solution for particle-size analysis, "
     "coatings, or further processing; improves distribution and stability."),
    ("Emulsification & dispersion", "Mixing of liquids that don't naturally combine, and suspending solids in "
     "liquids, to very fine (micro/nano-scale) droplet or particle sizes without clumping or sedimentation."),
    ("Extraction", "Faster, higher-yield extraction of compounds from plant or soil material into a liquid phase, "
     "often at lower temperature and with less solvent than conventional methods."),
    ("Degassing", "Rapid removal of dissolved air from liquids, e.g. before HPLC analysis or in sample prep."),
]
for title, text in apps:
    h3(title)
    body(text, space_after=4)

h2("By field")
rows = [
    ["Academic & research labs", "Cell/tissue disruption, nanomaterials, sample preparation for analysis"],
    ["Pharma & biotech", "Emulsification, nanoparticle formulation, extraction of actives"],
    ["Food & beverage", "Homogenising samples for analysis, extraction, degassing of beverages"],
    ["Materials & chemistry", "Dispersing pigments/fillers, nanoparticle de-agglomeration, sonochemistry"],
]
spec_table(rows, headers=("Field", "Typical use"))

h2("Your own case studies (highest-value content)")
note_box("This is where the catalog should carry real weight that BANDELIN's generic chapter can't: specific "
         "Iranian/regional customers, what they processed, what settings they used, and what result they got. "
         "If even two or three can be documented, they outperform all of the generic text above for a buyer "
         "deciding whether this device solves their exact problem.", kind="info")
mixed([("Needed: ", False), need_text("2–3 real application write-ups — customer/industry, sample, "
       "settings used, outcome achieved, with a photo if possible")])
image_box("Photo(s) of the UHP-400 actually running a real customer sample",
          "real",
          "Must be a genuine photo, not AI-generated — this is exactly the kind of ‘real evidence’ "
          "the earlier page review asked for. A phone photo from a customer site is fine.")

page_break()

# ================================================================= CH 05
h1("Service & support", "05")

h2("Frequently asked questions")
faqs = [
    ("Is 400 W the power that reaches my sample?",
     "No. 400 W is the maximum electrical power the generator can deliver to the converter. The actual power "
     "transmitted into the liquid (the calorimetric power, see Chapter 1) is lower and depends on the probe and "
     "amplitude used."),
    ("Can the probe touch the vessel wall or my hand during sonication?",
     "No — contact with the vessel can damage the probe and the vessel; contact with skin can cause burns "
     "or tissue damage. Always use the stand and keep hands clear while the instrument is running."),
    ("How deep should the probe be immersed?",
     "Normally 1–2 cm. Too shallow causes splashing and foaming; too deep damps the signal and gives a "
     "weaker, less even result."),
    ("Does the probe wear out?",
     "Yes — the tip gradually erodes with use, which reduces output over time. Inspect periodically and "
     "replace when pitting becomes significant."),
]
for q, a in faqs:
    h3(q)
    body(a, space_after=4)

mixed([("Still to add: ", False)])
bullet("What to do if the enclosure door won't close / interlock won't reset", green=True)
bullet("Viscosity or temperature limits for continuous operation", green=True)
bullet("Whether a loaner/demo unit is available for evaluation, as BANDELIN offers", green=True)

h2("Warranty & service")
mixed([("Warranty period and what it covers: ", False), need_text("e.g. 12/24 months, parts/labour, excludes probe wear")])
mixed([("Recommended calibration/service interval: ", False), need_text("confirm, or state none required")])
mixed([("Does a decontamination/cleaning statement need to accompany a unit sent in for service? ", False), need_text("confirm process, if any")])

h2("Compliance")
note_box("The only compliance document on file is a 2019 CE Declaration of Conformity for a machine listed as "
         "model ‘UP-400’ (not ‘UHP-400’), serial 13731. It cites the In-Vitro Diagnostic Medical "
         "Devices Directive (98/79/EC) — not the right directive family for a general-purpose lab instrument "
         "— and references the EMC Directive 2004/108/EC and a Low Voltage Directive citation with a typo "
         "(‘2006/9s/EC’), both of which were repealed and replaced by 2014/30/EU and 2014/35/EU in 2016. "
         "Do not publish this certificate as current compliance for the UHP-400 without having it reviewed and, "
         "if needed, reissued under the correct directives by someone qualified to do so — publishing an "
         "outdated or mismatched certificate is a bigger credibility risk than having no certificate listed yet.",
         kind="warn")
mixed([("Current, correct compliance documentation for the UHP-400 as sold today: ", False),
       need_text("valid CE declaration under 2014/30/EU (EMC) and 2014/35/EU (LVD), or confirmation that none exists yet")])

h2("Contact")
body("TOPSONICS — Ultrasonic Technology Development Co.")
mixed([("A named technical/sales contact (name, direct phone, direct email) builds more trust than a general "
        "info@ address — BANDELIN leads this whole chapter with one. ", False),
       need_text("name + title + direct phone + direct email of the person who should field buyer questions")])

doc.save("/home/claude/catalog/UHP-400-catalog-EN-draft.docx")
print("saved")
