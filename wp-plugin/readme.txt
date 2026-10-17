=== Topsonics UHP-400 ===
Persian 3D product page for the UHP-400 ultrasonic homogenizer with instant PDF proforma,
one-time discount codes, lead storage and e-mail notification.
All scripts, fonts, models and images are inside the plugin; no external server is used.

Usage: activate, then put the shortcode [uhp400] on a page.
Admin: menu "UHP-400" (prices and parts, requests, discount codes).

== Changelog ==

= 1.0.3 =
* Hero tagline updated: "همگن‌سازی نانومواد، استخراج گیاهان دارویی و ... همه در یک دستگاه."
* New "کاتالوگ" button in the hero, and new admin settings fields for the catalog PDF link
  and the Persian/English manual PDF links (menu "UHP-400" → تنظیمات و قیمت‌ها). Links are
  entered in the admin and are blank by default; each button/link only shows once a URL is
  set, so it's safe to update them anytime without touching code.
* "آنچه دریافت می‌کنید" (in the box) section now shows 3 real photos (crate, control head
  with probe, cables and sensor) instead of one photo plus a placeholder note.
* Manual-download links (FA + EN) added under the "پیش‌فاکتور فوری" card on the calculator
  page, using the new admin-configurable manual URLs.

= 1.0.2 =
* Instant-proforma "quote" contact line (WhatsApp/Telegram + phone) is now two clickable
  links with icons (wa.me prefilled message / tel:), not plain text.
* A hint line was added under the optional discount-code field: "(جهت دریافت کد تخفیف لطفاً
  تماس بگیرید.)" — codes are not self-serve, so the field tells the customer to call.
* Source edited in src/page-fa/index.html (mirrors /home/claude/site-fa/index.html on the
  build machine); rebuilt page/uhp-page-fa.js and the plugin's assets/page/uhp-page-wp.js via
  src/build_fa.py + src/build_wp.py.

= 1.0.1 =
* Full-width breakout so theme containers/sidebars don't offset the page.
