"""SEO layer for the UHP-400 pages.
1) inserts a visible FAQ (details/summary) into site2/index.html and site-fa/index.html (idempotent)
2) builds a static, crawlable text copy of each page + Product/FAQPage JSON-LD
   -> seo-en.html / seo-fa.html, placed inside the GoSite host div (hidden once the shadow DOM mounts)
"""
import json, re, html
from bs4 import BeautifulSoup, NavigableString, Tag

FAQ_EN = [
 ("Which probe should I use for my sample volume?",
  "Use the 15 mm probe for batches from 100 mL up to 3.5 L, and the 7 mm probe for smaller volumes such as vials, tubes and small beakers. "
  "A thinner tip concentrates the power on a smaller area, so it gives a small sample a higher intensity; the wider tip spreads the energy through a larger volume. "
  "Both probes are Ti-6Al-4V titanium and fit the same acoustic stack."),
 ("How do I keep the sample from overheating during sonication?",
  "Combine pulse mode, cooling and a temperature limit. On the UHP-400 the pulse duty cycle is adjustable from 5 to 95 % of a 15 s period, so the sample cools between bursts. "
  "Put heat-sensitive samples such as proteins or cells in an ice bath. The built-in sensor reads 0–80 °C and stops the run automatically when your limit is reached."),
 ("How deep should the probe tip go into the liquid?",
  "Immerse the tip about 10–15 mm below the surface and keep it centred, at least one probe diameter away from the vessel wall and bottom. "
  "A tip that is too shallow pulls in air and causes foaming; a tip that touches the wall wastes energy and can crack glass. "
  "The adjustable sample table lets you repeat the same position on every run."),
 ("Ultrasonic homogenizer or rotor-stator: which is better?",
  "For small and medium liquid batches an ultrasonic homogenizer usually reaches smaller particle and droplet sizes and breaks cells more completely. "
  "The probe is one solid piece with no seals or blades, so it is quick to clean, and you can switch probes for different volumes. "
  "Its drawback is heat, which the UHP-400 controls with pulse mode and the automatic temperature limit. Rotor-stator mixers suit larger volumes and very viscous material."),
 ("How do I look after the titanium probe, and how long does it last?",
  "Rinse the tip with deionized water after each run, wipe it dry and avoid abrasive cleaners. "
  "Check the end face regularly: cavitation slowly erodes it into a rough, pitted surface. "
  "Replace a worn or cracked tip, because it loses efficiency and puts extra load on the transducer. Probe life depends on power, run time and the sample; abrasive particles and solvents wear it faster."),
 ("What is the UHP-400 used for?",
  "The main uses are cell lysis (bacteria, yeast and tissue) for protein and DNA work, emulsification, dispersing and de-agglomerating nanoparticles, "
  "and extracting compounds from plant material. It is also used to shear chromatin for ChIP."),
 ("Is the UHP-400 loud? Do I need a separate sound box?",
  "No separate box is needed. The UHP-400 has a built-in sound cabinet with a door and window, so the probe runs enclosed and you can watch the sample through the window."),
]

FAQ_FA = [
 ("برای هر حجم نمونه از کدام پراب استفاده کنم؟",
  "برای حجم ۱۰۰ میلی‌لیتر تا ۳٫۵ لیتر از پراب ۱۵ میلی‌متری و برای حجم‌های کمتر، مثل ویال، لوله و بشر کوچک، از پراب ۷ میلی‌متری استفاده کنید. "
  "نوک باریک‌تر توان را روی سطح کوچک‌تری متمرکز می‌کند و به نمونهٔ کم شدت بیشتری می‌دهد؛ نوک پهن‌تر انرژی را در حجم بزرگ‌تری پخش می‌کند. "
  "هر دو پراب از تیتانیوم Ti-6Al-4V هستند و روی یک استک آکوستیک بسته می‌شوند."),
 ("چطور از داغ شدن نمونه هنگام سونیکیت جلوگیری کنم؟",
  "حالت پالس، خنک‌کردن و حد دما را با هم به کار ببرید. در UHP-400 دیوتی سایکل پالس از ۵ تا ۹۵ درصدِ یک دورهٔ ۱۵ ثانیه‌ای قابل تنظیم است تا نمونه بین پالس‌ها خنک شود. "
  "نمونه‌های حساس به گرما مثل پروتئین و سلول را در حمام یخ بگذارید. حسگر داخلی دستگاه ۰ تا ۸۰ درجه را می‌خواند و با رسیدن به حدی که تعیین کرده‌اید، کار را خودکار متوقف می‌کند."),
 ("نوک پراب چقدر باید داخل مایع برود؟",
  "نوک پراب را حدود ۱۰ تا ۱۵ میلی‌متر زیر سطح مایع و در مرکز ظرف قرار دهید، دست‌کم به اندازهٔ قطر پراب دور از دیواره و کف. "
  "اگر نوک خیلی بالا باشد هوا وارد می‌شود و کف ایجاد می‌کند؛ اگر به دیواره بخورد انرژی هدر می‌رود و ممکن است ظرف شیشه‌ای ترک بردارد. "
  "میز نمونهٔ قابل تنظیم کمک می‌کند در هر بار کار همان ارتفاع را تکرار کنید."),
 ("هموژنایزر اولتراسونیک بهتر است یا روتور-استاتور؟",
  "برای حجم‌های کم و متوسط مایع، هموژنایزر اولتراسونیک معمولاً به اندازهٔ ذره و قطرهٔ ریزتری می‌رسد و سلول‌ها را کامل‌تر می‌شکند. "
  "پراب یک قطعهٔ یکپارچه و بدون آب‌بند و تیغه است، پس تمیز کردنش سریع است و برای حجم‌های مختلف می‌شود پراب را عوض کرد. "
  "عیب آن تولید گرماست که UHP-400 با حالت پالس و حد دمای خودکار کنترلش می‌کند. روتور-استاتور برای حجم‌های بزرگ‌تر و مواد خیلی غلیظ مناسب‌تر است."),
 ("از پراب تیتانیومی چطور نگهداری کنم و عمرش چقدر است؟",
  "بعد از هر بار کار نوک پراب را با آب دیونیزه بشویید، خشک کنید و از پاک‌کننده‌های ساینده استفاده نکنید. "
  "سطح نوک را مرتب بررسی کنید؛ کاویتاسیون به‌تدریج آن را زبر و حفره‌دار می‌کند. "
  "نوک فرسوده یا ترک‌خورده را عوض کنید، چون بازده را کم می‌کند و به ترنسدیوسر فشار می‌آورد. عمر پراب به توان، زمان کار و نوع نمونه بستگی دارد؛ ذرات ساینده و حلال‌ها آن را زودتر فرسوده می‌کنند."),
 ("UHP-400 برای چه کارهایی استفاده می‌شود؟",
  "کاربردهای اصلی: لیز سلولی (باکتری، مخمر و بافت) برای کار با پروتئین و DNA، ساخت امولسیون، پراکنده‌سازی و شکستن کلوخه‌های نانوذرات، "
  "و استخراج ترکیبات از مواد گیاهی. برای خرد کردن کروماتین در آزمایش ChIP هم به کار می‌رود."),
 ("آیا دستگاه پرسروصداست؟ جعبهٔ صدا جداگانه لازم دارد؟",
  "خیر، جعبهٔ جداگانه لازم نیست. UHP-400 محفظهٔ صوتی داخلی با در و پنجره دارد؛ پراب داخل محفظه کار می‌کند و نمونه را از پنجره می‌بینید."),
 ("قیمت هموژنایزر UHP-400 چقدر است؟",
  "قیمت UHP-400 همراه یک پراب (۷ یا ۱۵ میلی‌متر)، محفظهٔ صوتی، میز نمونه و حسگر دما ۳۵۰ میلیون تومان است و ۱۰ درصد مالیات بر ارزش افزوده جداگانه به آن اضافه می‌شود. "
  "پراب دوم ۴۰ میلیون تومان است. با فرم همین صفحه پیش‌فاکتور فوری بگیرید؛ پیش‌فاکتور ۳ روز اعتبار دارد."),
]

CSS = """
/* FAQ */
.faq .qa{margin-top:22px;border-top:1px solid var(--line)}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;padding-block:16px;padding-inline:0 36px;position:relative}
.faq summary::-webkit-details-marker{display:none}
.faq summary h3{font-size:17px;margin:0;font-weight:600}
.faq summary::after{content:"+";position:absolute;inset-inline-end:4px;top:12px;font-size:24px;line-height:1;color:var(--blue);transition:transform .2s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq details p{margin:0 0 18px;color:var(--mute);max-width:75ch;font-size:15.5px;line-height:1.7}
"""

def faq_block(items, eyebrow, title, sub):
    qa = ''.join('<details><summary><h3>%s</h3></summary><p>%s</p></details>' % (html.escape(q), html.escape(a)) for q, a in items)
    return ('    <div class="sec wrap faq" id="faq"><div class="inner">\n'
            '      <div class="sec-head"><p class="eyebrow">%s</p><h2>%s</h2><p>%s</p></div>\n'
            '      <div class="qa">%s</div>\n    </div></div>\n') % (eyebrow, title, sub, qa)

def insert_faq(path, block):
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'    <div class="sec wrap faq" id="faq">.*?\n    </div></div>\n', '', s, flags=re.S)  # replace old copy
    s = s.replace('\n/* FAQ */' + CSS.split('/* FAQ */', 1)[1], '\n')
    i = s.index('    <div class="wrap research"')
    s = s[:i] + block + s[i:]
    j = s.index('</style>')
    s = s[:j] + CSS.lstrip('\n') + s[j:]
    open(path, 'w', encoding='utf-8').write(s)

SKIP_TAGS = {'script', 'style', 'svg', 'canvas', 'form', 'button', 'input', 'select', 'label', 'video', 'img', 'nav', 'template'}
SKIP_IDS = {'tag', 'fab', 'pfModal', 'viewerSlot', 'nav', 'qform'}

def text_of(el):
    return re.sub(r'\s+', ' ', el.get_text(' ')).strip()

def inline(el):
    """text with external links kept"""
    out = []
    for c in el.descendants:
        if isinstance(c, NavigableString) and not any(p.name == 'a' for p in c.parents if p is not el and isinstance(p, Tag)):
            if c.parent.name not in SKIP_TAGS: out.append(' ' + html.escape(str(c)) + ' ')
        elif isinstance(c, Tag) and c.name == 'a' and (c.get('href') or '').startswith('http'):
            out.append(' <a href="%s">%s</a> ' % (html.escape(c['href']), html.escape(text_of(c))))
    t = re.sub(r'\s+', ' ', ''.join(out)).strip()
    return re.sub(r' ([,.;:!?،؛])', r'\1', t)

def extract(path):
    soup = BeautifulSoup(open(path, encoding='utf-8').read(), 'html.parser')
    root = soup.body or soup
    out = []
    def walk(el):
        for c in el.children:
            if not isinstance(c, Tag): continue
            if c.name in SKIP_TAGS or c.get('id') in SKIP_IDS or c.get('aria-hidden') == 'true' or c.has_attr('hidden'): continue
            if c.name in ('h1', 'h2', 'h3'):
                t = text_of(c)
                if t: out.append('<%s>%s</%s>' % (c.name, html.escape(t), c.name))
            elif c.name == 'p':
                t = inline(c)
                if t and len(t) > 2: out.append('<p>%s</p>' % t)
            elif c.name in ('ul', 'ol'):
                lis = [inline(li) for li in c.find_all('li', recursive=False)]
                lis = [x for x in lis if x]
                if lis: out.append('<%s>%s</%s>' % (c.name, ''.join('<li>%s</li>' % x for x in lis), c.name))
            elif c.name == 'table':
                rows = []
                for tr in c.find_all('tr'):
                    cells = tr.find_all(['th', 'td'])
                    if len(cells) == 2: rows.append('<tr><th>%s</th><td>%s</td></tr>' % (html.escape(text_of(cells[0])), html.escape(text_of(cells[1]))))
                if rows: out.append('<table>%s</table>' % ''.join(rows))
            else:
                walk(c)
    walk(root)
    # drop consecutive duplicates
    res = []
    for x in out:
        if not res or res[-1] != x: res.append(x)
    return '\n'.join(res)

IMG = 'https://cdn.jsdelivr.net/gh/nanoos/up400-3d@72379a7eec6d3222adfe43f78c51e9434b722581/page/'

def product_ld(lang):
    props_en = [('Frequency', '24 kHz ± 1 kHz'), ('Output power', '0–400 W, adjustable'), ('Pulse mode', 'Duty cycle 5–95 % of a 15 s period'),
                ('Run time', 'Up to 30 min per cycle'), ('Temperature control', 'Built-in sensor 0–80 °C with alarm and auto-stop'),
                ('Probes', 'Ti-6Al-4V titanium, 7 mm or 15 mm tip'), ('Working volume', '100–3,500 mL with the 15 mm probe; smaller volumes with the 7 mm probe'),
                ('Control', '5-inch capacitive touchscreen'), ('Enclosure', 'Built-in sound cabinet with window'), ('Power supply', '220 V, 50–60 Hz, 2 A'),
                ('Dimensions', '300 mm wide × 670 mm high')]
    props_fa = [('فرکانس', '24 kHz ± 1 kHz'), ('توان خروجی', '0 تا 400 وات، قابل تنظیم'), ('حالت پالس', 'دیوتی سایکل ۵ تا ۹۵ درصد از دورهٔ ۱۵ ثانیه‌ای'),
                ('زمان اجرا', 'تا ۳۰ دقیقه در هر چرخه'), ('کنترل دما', 'حسگر داخلی ۰ تا ۸۰ درجه با هشدار و توقف خودکار'),
                ('پراب', 'تیتانیوم Ti-6Al-4V، نوک ۷ یا ۱۵ میلی‌متر'), ('حجم کاری', '۱۰۰ تا ۳۵۰۰ میلی‌لیتر با پراب ۱۵؛ حجم کمتر با پراب ۷'),
                ('کنترل', 'صفحهٔ لمسی خازنی ۵ اینچ'), ('محفظه', 'محفظهٔ صوتی داخلی با پنجره'), ('برق ورودی', '220 V، 50–60 Hz، 2 A'),
                ('ابعاد', 'عرض ۳۰۰ و ارتفاع ۶۷۰ میلی‌متر')]
    if lang == 'en':
        d = {"@context": "https://schema.org", "@type": "Product", "name": "UHP-400 Ultrasonic Homogenizer", "model": "UHP-400",
             "url": "https://ultrasonic-homogenizer.gosite.dev/en/uhp-400",
             "description": "Laboratory ultrasonic homogenizer (probe sonicator), 400 W at 24 kHz, with 7 mm and 15 mm Ti-6Al-4V probes, built-in sound cabinet, pulse mode and a 0–80 °C temperature limit with auto-stop. For cell lysis, emulsification, nanoparticle dispersion and extraction.",
             "category": "Laboratory equipment > Ultrasonic homogenizer",
             "brand": {"@type": "Brand", "name": "Topsonics"},
             "manufacturer": {"@type": "Organization", "name": "Topsonics", "url": "https://topsonics.com", "email": "info@topsonics.com", "address": {"@type": "PostalAddress", "addressLocality": "Vilnius", "addressCountry": "LT"}},
             "countryOfOrigin": "LT", "color": "White, green, blue",
             "image": [IMG + 'render-white.jpg', IMG + 'photo-blue.jpg', IMG + 'running.jpg'],
             "additionalProperty": [{"@type": "PropertyValue", "name": n, "value": v} for n, v in props_en]}
    else:
        d = {"@context": "https://schema.org", "@type": "Product", "name": "هموژنایزر اولتراسونیک UHP-400", "alternateName": "UHP-400 Ultrasonic Homogenizer", "model": "UHP-400",
             "url": "https://ultrasonic-homogenizer.gosite.dev/en/uhp-400-fa", "inLanguage": "fa",
             "description": "هموژنایزر اولتراسونیک آزمایشگاهی (سونیکاتور پرابی) با توان ۴۰۰ وات و فرکانس ۲۴ کیلوهرتز، پراب تیتانیومی ۷ و ۱۵ میلی‌متر، محفظهٔ صوتی داخلی، حالت پالس و حد دمای ۰ تا ۸۰ درجه با توقف خودکار؛ برای لیز سلولی، امولسیون، پراکنده‌سازی نانوذرات و استخراج. ساخت ایران.",
             "category": "تجهیزات آزمایشگاهی > هموژنایزر اولتراسونیک",
             "brand": {"@type": "Brand", "name": "Topsonics"},
             "manufacturer": {"@type": "Organization", "name": "شرکت توسعه فناوری مافوق صوت", "url": "https://ultrasonic.co.ir", "telephone": "+989123830551", "foundingDate": "2003", "address": {"@type": "PostalAddress", "addressCountry": "IR"}},
             "countryOfOrigin": "IR", "color": "سفید، سبز، آبی",
             "image": [IMG + 'render-white.jpg', IMG + 'photo-blue.jpg', IMG + 'running.jpg'],
             "additionalProperty": [{"@type": "PropertyValue", "name": n, "value": v} for n, v in props_fa],
             "offers": {"@type": "Offer", "price": "3500000000", "priceCurrency": "IRR",
                        "description": "۳۵۰ میلیون تومان همراه یک پراب، بدون ۱۰٪ مالیات بر ارزش افزوده",
                        "priceSpecification": {"@type": "UnitPriceSpecification", "price": "3500000000", "priceCurrency": "IRR", "valueAddedTaxIncluded": False},
                        "seller": {"@type": "Organization", "name": "شرکت توسعه فناوری مافوق صوت"},
                        "url": "https://ultrasonic-homogenizer.gosite.dev/en/uhp-400-fa#quote"}}
    return d

def faq_ld(items):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}

def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False).replace('</', '<\\/') + '</script>'

STATIC_STYLE = 'max-width:860px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Tahoma,sans-serif;line-height:1.7;color:#1d2733'

if __name__ == '__main__':
    insert_faq('/home/claude/site2/index.html', faq_block(FAQ_EN, 'Questions', 'Frequently asked questions',
               'Short answers to what labs ask us most about probe sonication and the UHP-400.'))
    insert_faq('/home/claude/site-fa/index.html', faq_block(FAQ_FA, 'پرسش‌ها', 'پرسش‌های پرتکرار',
               'پاسخ کوتاه به پرسش‌هایی که آزمایشگاه‌ها دربارهٔ سونیکیت با پراب و UHP-400 بیشتر می‌پرسند.'))
    en = extract('/home/claude/site2/index.html')
    fa = extract('/home/claude/site-fa/index.html')
    fa_price = '<h2>قیمت</h2><p>قیمت UHP-400 همراه یک پراب ۳۵۰٬۰۰۰٬۰۰۰ تومان به‌علاوهٔ ۱۰٪ مالیات بر ارزش افزوده؛ پراب دوم ۴۰٬۰۰۰٬۰۰۰ تومان. تماس، واتساپ و تلگرام: ۰۹۱۲۳۸۳۰۵۵۱</p>'
    en_contact = '<h2>Contact</h2><p>Topsonics, Vilnius, Lithuania. Email info@topsonics.com, WhatsApp +370 663 02479.</p>'
    open('/home/claude/gosite-page/seo-en.html', 'w', encoding='utf-8').write(
        '<article class="uhp-seo" lang="en" style="%s">\n%s\n%s\n</article>\n%s\n%s' % (STATIC_STYLE, en, en_contact, ld(product_ld('en')), ld(faq_ld(FAQ_EN))))
    open('/home/claude/gosite-page/seo-fa.html', 'w', encoding='utf-8').write(
        '<article class="uhp-seo" lang="fa" dir="rtl" style="%s">\n%s\n%s\n</article>\n%s\n%s' % (STATIC_STYLE, fa, fa_price, ld(product_ld('fa')), ld(faq_ld(FAQ_FA))))
    print('en', len(en), 'fa', len(fa))
