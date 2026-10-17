<?php
/**
 * Plugin Name: Topsonics UHP-400 – صفحهٔ محصول سه‌بعدی و پیش‌فاکتور
 * Description: صفحهٔ فارسی هموژنایزر اولتراسونیک UHP-400 با مدل سه‌بعدی، پیش‌فاکتور فوری PDF، کد تخفیف یک‌بارمصرف، ذخیرهٔ درخواست‌ها و ارسال ایمیل. همهٔ فایل‌ها داخل افزونه است و به هیچ سرور خارجی وابسته نیست. برای نمایش، کد کوتاه [uhp400] را در یک برگه بگذارید.
 * Version: 1.0.4
 * Author: شرکت توسعه فناوری مافوق صوت
 * Requires at least: 5.8
 * Requires PHP: 7.0
 * Text Domain: topsonics-uhp400
 */

if (!defined('ABSPATH')) exit;

define('UHP400_VER', '1.0.4');
define('UHP400_DIR', plugin_dir_path(__FILE__));
define('UHP400_URL', plugin_dir_url(__FILE__));

/* ------------------------------------------------------------------ settings */

function uhp400_defaults() {
    return array(
        'base_price'    => 350000000,
        'probe7_price'  => 0,
        'probe15_price' => 0,
        'second_probe'  => 40000000,
        'vat_percent'   => 10,
        'valid_days'    => 3,
        'currency'      => 'تومان',
        'extras'        => '',
        'email_to'      => 'a.shahidi@gmail.com',
        'seller_name'   => 'شرکت توسعه فناوری مافوق صوت',
        'seller_phone'  => '۰۹۱۲۳۸۳۰۵۵۱',
        'seller_web'    => 'ultrasonic.co.ir',
        'base_name'     => 'هموژنایزر اولتراسونیک UHP-400 با محفظهٔ صوتی، میز نمونه و حسگر دما',
        'catalog_url'   => '',
        'manual_url_fa' => '',
        'manual_url_en' => '',
    );
}

function uhp400_opt() {
    return wp_parse_args(get_option('uhp400_settings', array()), uhp400_defaults());
}

/* "نام قطعه|قیمت" one per line -> list */
function uhp400_extras($o = null) {
    $o = $o ? $o : uhp400_opt();
    $out = array();
    foreach (preg_split('/\r\n|\r|\n/', (string) $o['extras']) as $i => $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '|') === false) continue;
        list($name, $price) = array_map('trim', explode('|', $line, 2));
        $price = (int) preg_replace('/\D/', '', uhp400_latin_digits($price));
        if ($name === '') continue;
        $out[] = array('id' => 'x' . ($i + 1), 'name' => $name, 'price' => $price);
    }
    return $out;
}

function uhp400_latin_digits($s) {
    return strtr((string) $s, array('۰'=>'0','۱'=>'1','۲'=>'2','۳'=>'3','۴'=>'4','۵'=>'5','۶'=>'6','۷'=>'7','۸'=>'8','۹'=>'9',
        '٠'=>'0','١'=>'1','٢'=>'2','٣'=>'3','٤'=>'4','٥'=>'5','٦'=>'6','٧'=>'7','٨'=>'8','٩'=>'9'));
}

function uhp400_fa_num($n) {
    $s = number_format((float) $n, 0, '.', '٬');
    return strtr($s, array('0'=>'۰','1'=>'۱','2'=>'۲','3'=>'۳','4'=>'۴','5'=>'۵','6'=>'۶','7'=>'۷','8'=>'۸','9'=>'۹'));
}

/* "۳۵۰ میلیون تومان" style when the price is whole millions */
function uhp400_fa_price_words($n, $cur) {
    if ($n > 0 && $n % 1000000 === 0) return uhp400_fa_num($n / 1000000) . ' میلیون ' . $cur;
    return uhp400_fa_num($n) . ' ' . $cur;
}

/* price phrases written in the page text -> current prices */
function uhp400_replacements($o) {
    $cur = $o['currency'];
    $base = (int) $o['base_price'];
    $sec = (int) $o['second_probe'];
    $vat = (float) $o['vat_percent'];
    $days = (int) $o['valid_days'];
    return array(
        array('۳۵۰ میلیون تومان', uhp400_fa_price_words($base, $cur)),
        array('۴۰ میلیون تومان', uhp400_fa_price_words($sec, $cur)),
        array('۳۵۰٬۰۰۰٬۰۰۰ تومان', uhp400_fa_num($base) . ' ' . $cur),
        array('۴۰٬۰۰۰٬۰۰۰ تومان', uhp400_fa_num($sec) . ' ' . $cur),
        array('۱۰ درصد مالیات', uhp400_fa_num($vat) . ' درصد مالیات'),
        array('۱۰٪ مالیات', uhp400_fa_num($vat) . '٪ مالیات'),
        array('۳ روز اعتبار', uhp400_fa_num($days) . ' روز اعتبار'),
    );
}

/* ------------------------------------------------------------------ install */

register_activation_hook(__FILE__, 'uhp400_activate');
function uhp400_activate() {
    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $c = $wpdb->get_charset_collate();
    dbDelta("CREATE TABLE {$wpdb->prefix}uhp400_codes (
        code varchar(20) NOT NULL,
        percent tinyint(3) unsigned NOT NULL,
        created_at datetime NOT NULL,
        used_at datetime NULL DEFAULT NULL,
        lead_id bigint(20) unsigned NULL DEFAULT NULL,
        PRIMARY KEY  (code)
    ) $c;");
    dbDelta("CREATE TABLE {$wpdb->prefix}uhp400_leads (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        created_at datetime NOT NULL,
        number varchar(40) NOT NULL DEFAULT '',
        name varchar(190) NOT NULL DEFAULT '',
        mobile varchar(40) NOT NULL DEFAULT '',
        org varchar(190) NOT NULL DEFAULT '',
        city varchar(100) NOT NULL DEFAULT '',
        qty int(11) NOT NULL DEFAULT 1,
        probe varchar(10) NOT NULL DEFAULT '',
        color varchar(40) NOT NULL DEFAULT '',
        extras text NULL,
        code varchar(20) NOT NULL DEFAULT '',
        discount_pct tinyint(3) unsigned NOT NULL DEFAULT 0,
        subtotal bigint(20) NOT NULL DEFAULT 0,
        discount bigint(20) NOT NULL DEFAULT 0,
        vat bigint(20) NOT NULL DEFAULT 0,
        total bigint(20) NOT NULL DEFAULT 0,
        page varchar(255) NOT NULL DEFAULT '',
        ip varchar(64) NOT NULL DEFAULT '',
        mail_sent tinyint(1) NOT NULL DEFAULT 0,
        PRIMARY KEY  (id),
        KEY created_at (created_at)
    ) $c;");
    if (!get_option('uhp400_settings')) add_option('uhp400_settings', uhp400_defaults());
    /* seed the one-time discount codes shipped with the plugin (only once, never overwrites) */
    if (!get_option('uhp400_codes_seeded')) {
        $file = UHP400_DIR . 'data/codes.csv';
        if (file_exists($file) && ($h = fopen($file, 'r'))) {
            fgetcsv($h);
            while (($r = fgetcsv($h)) !== false) {
                if (count($r) < 2) continue;
                $wpdb->query($wpdb->prepare(
                    "INSERT IGNORE INTO {$wpdb->prefix}uhp400_codes (code, percent, created_at) VALUES (%s, %d, %s)",
                    strtoupper(trim($r[0])), (int) $r[1], current_time('mysql')));
            }
            fclose($h);
        }
        update_option('uhp400_codes_seeded', 1);
    }
}

/* ------------------------------------------------------------------ front end */

add_shortcode('uhp400', 'uhp400_shortcode');
function uhp400_shortcode() {
    $o = uhp400_opt();
    $a = UHP400_URL . 'assets/';
    $v = $a . 'vendor/';
    wp_enqueue_script('uhp400-three', $v . 'three/build/three.min.js', array(), '0.128.0', true);
    wp_enqueue_script('uhp400-gltf', $v . 'three/examples/js/loaders/GLTFLoader.js', array('uhp400-three'), '0.128.0', true);
    wp_enqueue_script('uhp400-room', $v . 'three/examples/js/environments/RoomEnvironment.js', array('uhp400-three'), '0.128.0', true);
    wp_enqueue_script('uhp400-page', $a . 'page/uhp-page-wp.js', array('uhp400-three', 'uhp400-gltf', 'uhp400-room'), UHP400_VER, true);

    $extras = uhp400_extras($o);
    $cfg = array(
        'base'    => $a . 'page/',
        'root'    => $a,
        'ajax'    => admin_url('admin-ajax.php'),
        'replace' => uhp400_replacements($o),
        'pf'      => array(
            'currency'  => $o['currency'],
            'vat'       => ((float) $o['vat_percent']) / 100,
            'validDays' => (int) $o['valid_days'],
            'items'     => array(
                'base'    => array('name' => $o['base_name'], 'price' => (int) $o['base_price']),
                'probe7'  => array('name' => 'پراب تیتانیومی ۷ میلی‌متر', 'price' => (int) $o['probe7_price']),
                'probe15' => array('name' => 'پراب تیتانیومی ۱۵ میلی‌متر', 'price' => (int) $o['probe15_price']),
                'extra'   => array('name' => 'پراب دوم', 'price' => (int) $o['second_probe']),
            ),
            'extras'    => $extras,
            'seller'    => array('name' => $o['seller_name'], 'phone' => $o['seller_phone'], 'web' => $o['seller_web']),
        ),
        'links'   => array(
            'catalog'   => $o['catalog_url'],
            'manualFa'  => $o['manual_url_fa'],
            'manualEn'  => $o['manual_url_en'],
        ),
    );
    $inline = 'window.UHP_WP=' . wp_json_encode($cfg) . ';'
            . 'window.__UHP_LIB=' . wp_json_encode($v . 'libs/') . ';'
            . 'window.__UHP_THREE_EX=' . wp_json_encode($v . 'three/examples/js/') . ';'
            . 'window.__UHP_SAVE_URL="";';
    wp_add_inline_script('uhp400-page', $inline, 'before');

    /* static, crawlable copy of the page (hidden once the 3D page mounts) + structured data */
    $html = file_get_contents(UHP400_DIR . 'assets/content-fa.html');
    $html = str_replace(
        array('{{URL}}', '{{ASSETS}}', '{{PRICE_IRR}}'),
        array(esc_url(get_permalink()), esc_url($a), (string) ((int) $o['base_price'] * 10)),
        $html);
    foreach (uhp400_replacements($o) as $p) $html = str_replace($p[0], $p[1], $html);
    return '<style>body{overflow-x:hidden}.uhp400-bleed{position:relative;max-width:none!important;box-sizing:border-box}</style>'
         . '<div class="uhp400-bleed" id="uhp400-bleed">' . $html . '</div>'
         . '<script>(function(){var e=document.getElementById("uhp400-bleed");if(!e)return;'
         . 'function f(){var w=document.documentElement.clientWidth;e.style.width=w+"px";e.style.left="0px";'
         . 'var r=e.getBoundingClientRect();e.style.left=(-r.left)+"px";}'
         . 'f();window.addEventListener("resize",f);window.addEventListener("load",f);'
         . 'if(window.ResizeObserver&&e.parentNode)new ResizeObserver(f).observe(e.parentNode);})();</script>';
}

/* ------------------------------------------------------------------ proforma request */

add_action('wp_ajax_uhp400_proforma', 'uhp400_proforma');
add_action('wp_ajax_nopriv_uhp400_proforma', 'uhp400_proforma');
function uhp400_proforma() {
    global $wpdb;
    $o = uhp400_opt();
    $in = function ($k, $max = 190) { return isset($_POST[$k]) ? mb_substr(sanitize_text_field(wp_unslash($_POST[$k])), 0, $max) : ''; };

    if ($in('hp') !== '') wp_send_json_error(array('message' => 'درخواست نامعتبر است.'));

    /* simple flood guard: 15 requests per hour per IP */
    $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
    $key = 'uhp400_rl_' . md5($ip);
    $hits = (int) get_transient($key);
    if ($hits >= 15) wp_send_json_error(array('message' => 'تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید یا تماس بگیرید.'));
    set_transient($key, $hits + 1, HOUR_IN_SECONDS);

    $name = $in('name');
    $mobile = uhp400_latin_digits($in('mobile', 40));
    if ($name === '' || strlen(preg_replace('/\D/', '', $mobile)) < 10) {
        wp_send_json_error(array('message' => 'لطفاً نام و شمارهٔ موبایل را کامل وارد کنید.'));
    }
    $org = $in('org'); $city = $in('city', 100);
    $qty = max(1, min(20, (int) uhp400_latin_digits($in('qty', 5))));
    $probe = in_array($in('probe', 10), array('7', '15', 'both'), true) ? $in('probe', 10) : '15';
    $color = in_array($in('color', 40), array('سفید', 'سبز', 'آبی'), true) ? $in('color', 40) : 'سفید';

    /* prices are always calculated here, never taken from the browser */
    $p7 = 'پراب تیتانیومی ۷ میلی‌متر'; $p15 = 'پراب تیتانیومی ۱۵ میلی‌متر';
    $main_name = $probe === '7' ? $p7 : $p15;
    $main_price = $probe === '7' ? (int) $o['probe7_price'] : (int) $o['probe15_price'];
    $rows = array(array('name' => $o['base_name'] . '، همراه ' . $main_name . '، رنگ ' . $color, 'q' => $qty, 'p' => (int) $o['base_price'] + $main_price));
    if ($probe === 'both') $rows[] = array('name' => $p7 . ' (پراب دوم)', 'q' => $qty, 'p' => (int) $o['second_probe']);
    $chosen = array_filter(explode(',', $in('extras', 500)));
    $extra_names = array();
    foreach (uhp400_extras($o) as $x) {
        if (in_array($x['id'], $chosen, true)) { $rows[] = array('name' => $x['name'], 'q' => 1, 'p' => $x['price']); $extra_names[] = $x['name']; }
    }
    $sub = 0; foreach ($rows as $r) $sub += $r['q'] * $r['p'];

    /* one-time discount code: claimed atomically, so it can never be used twice */
    $code = strtoupper(preg_replace('/\s+/', '', uhp400_latin_digits($in('code', 20))));
    $pct = 0;
    $t = $wpdb->prefix . 'uhp400_codes';
    if ($code !== '') {
        $claimed = $wpdb->query($wpdb->prepare("UPDATE $t SET used_at = %s WHERE code = %s AND used_at IS NULL", current_time('mysql'), $code));
        if ($claimed !== 1) wp_send_json_error(array('message' => 'کد تخفیف معتبر نیست یا قبلاً استفاده شده است. کد را بررسی کنید یا آن را خالی بگذارید.'));
        $pct = (int) $wpdb->get_var($wpdb->prepare("SELECT percent FROM $t WHERE code = %s", $code));
    }
    $disc = (int) round($sub * $pct / 100);
    $vat_pct = (float) $o['vat_percent'];
    $vat = (int) round(($sub - $disc) * $vat_pct / 100);
    $total = $sub - $disc + $vat;

    $wpdb->insert($wpdb->prefix . 'uhp400_leads', array(
        'created_at' => current_time('mysql'), 'name' => $name, 'mobile' => $mobile, 'org' => $org, 'city' => $city,
        'qty' => $qty, 'probe' => $probe, 'color' => $color, 'extras' => implode('، ', $extra_names), 'code' => $code,
        'discount_pct' => $pct, 'subtotal' => $sub, 'discount' => $disc, 'vat' => $vat, 'total' => $total,
        'page' => esc_url_raw($in('page', 255)), 'ip' => $ip,
    ));
    $id = (int) $wpdb->insert_id;
    $number = 'UHP-' . current_time('ymd') . '-' . str_pad((string) $id, 4, '0', STR_PAD_LEFT);
    $wpdb->update($wpdb->prefix . 'uhp400_leads', array('number' => $number), array('id' => $id));
    if ($code !== '') $wpdb->update($t, array('lead_id' => $id), array('code' => $code));

    /* e-mail to the owner (the lead is already saved, so a mail failure loses nothing) */
    $cur = $o['currency'];
    $lines = '';
    foreach ($rows as $r) $lines .= '<tr><td>' . esc_html($r['name']) . '</td><td>' . uhp400_fa_num($r['q']) . '</td><td>' . uhp400_fa_num($r['q'] * $r['p']) . '</td></tr>';
    $body = '<div dir="rtl" style="font-family:Tahoma,sans-serif;font-size:14px;line-height:1.8">'
        . '<h2>پیش‌فاکتور جدید ' . esc_html($number) . '</h2>'
        . '<p><b>نام:</b> ' . esc_html($name) . '<br><b>موبایل:</b> ' . esc_html($mobile) . '<br><b>سازمان:</b> ' . esc_html($org) . '<br><b>شهر:</b> ' . esc_html($city) . '</p>'
        . '<table border="1" cellpadding="6" style="border-collapse:collapse">' . $lines . '</table>'
        . '<p>جمع: ' . uhp400_fa_num($sub) . ' ' . $cur
        . ($pct ? '<br>تخفیف ' . uhp400_fa_num($pct) . '٪ (کد ' . esc_html($code) . '): ' . uhp400_fa_num($disc) . ' ' . $cur : '')
        . '<br>مالیات: ' . uhp400_fa_num($vat) . ' ' . $cur . '<br><b>مبلغ قابل پرداخت: ' . uhp400_fa_num($total) . ' ' . $cur . '</b></p>'
        . '<p style="color:#666">صفحه: ' . esc_html($in('page', 255)) . '</p></div>';
    $sent = wp_mail($o['email_to'], 'پیش‌فاکتور جدید UHP-400 – ' . $name, $body, array('Content-Type: text/html; charset=UTF-8'));
    if ($sent) $wpdb->update($wpdb->prefix . 'uhp400_leads', array('mail_sent' => 1), array('id' => $id));

    wp_send_json_success(array(
        'number' => $number, 'rows' => $rows, 'sub' => $sub, 'discPct' => $pct, 'disc' => $disc, 'code' => $code,
        'vat' => $vat, 'vatPct' => $vat_pct, 'total' => $total, 'validDays' => (int) $o['valid_days'],
    ));
}

/* ------------------------------------------------------------------ admin */

add_action('admin_menu', function () {
    add_menu_page('UHP-400', 'UHP-400', 'manage_options', 'uhp400', 'uhp400_page_settings', 'dashicons-media-document', 58);
    add_submenu_page('uhp400', 'تنظیمات و قیمت‌ها', 'تنظیمات و قیمت‌ها', 'manage_options', 'uhp400', 'uhp400_page_settings');
    add_submenu_page('uhp400', 'درخواست‌های پیش‌فاکتور', 'درخواست‌ها', 'manage_options', 'uhp400-leads', 'uhp400_page_leads');
    add_submenu_page('uhp400', 'کدهای تخفیف', 'کدهای تخفیف', 'manage_options', 'uhp400-codes', 'uhp400_page_codes');
});

function uhp400_page_settings() {
    if (!current_user_can('manage_options')) return;
    $o = uhp400_opt();
    if (isset($_POST['uhp400_save']) && check_admin_referer('uhp400_settings')) {
        foreach (uhp400_defaults() as $k => $def) {
            if (!isset($_POST[$k])) continue;
            $val = wp_unslash($_POST[$k]);
            if (is_int($def)) $val = (int) preg_replace('/[^\d]/', '', uhp400_latin_digits($val));
            elseif ($k === 'extras') $val = sanitize_textarea_field($val);
            elseif ($k === 'email_to') $val = sanitize_email($val);
            elseif (in_array($k, array('catalog_url', 'manual_url_fa', 'manual_url_en'), true)) $val = esc_url_raw($val);
            else $val = sanitize_text_field($val);
            $o[$k] = $val;
        }
        update_option('uhp400_settings', $o);
        echo '<div class="notice notice-success"><p>ذخیره شد.</p></div>';
    }
    $f = function ($k, $label, $help = '') use ($o) {
        echo '<tr><th><label for="' . esc_attr($k) . '">' . esc_html($label) . '</label></th><td><input class="regular-text" id="' . esc_attr($k) . '" name="' . esc_attr($k) . '" value="' . esc_attr($o[$k]) . '">' . ($help ? '<p class="description">' . esc_html($help) . '</p>' : '') . '</td></tr>';
    };
    echo '<div class="wrap" dir="rtl"><h1>UHP-400 – تنظیمات و قیمت‌ها</h1>';
    echo '<p>برای نمایش صفحه، کد کوتاه <code>[uhp400]</code> را در یک برگه قرار دهید. قیمت‌ها بدون ویرگول و به ' . esc_html($o['currency']) . ' وارد شوند.</p>';
    echo '<form method="post">';
    wp_nonce_field('uhp400_settings');
    echo '<table class="form-table">';
    $f('base_price', 'قیمت دستگاه پایه (با یک پراب)');
    $f('probe7_price', 'اضافه‌قیمت پراب ۷ میلی‌متر', 'اگر پراب ۷ در قیمت پایه است، ۰ بگذارید.');
    $f('probe15_price', 'اضافه‌قیمت پراب ۱۵ میلی‌متر', 'اگر پراب ۱۵ در قیمت پایه است، ۰ بگذارید.');
    $f('second_probe', 'قیمت پراب دوم', 'وقتی مشتری «هر دو پراب» را انتخاب کند.');
    $f('vat_percent', 'مالیات بر ارزش افزوده (درصد)', 'جداگانه روی مبلغ پس از تخفیف اضافه می‌شود.');
    $f('valid_days', 'اعتبار پیش‌فاکتور (روز)');
    $f('currency', 'واحد پول');
    echo '<tr><th><label for="extras">قطعات و اقلام اضافه</label></th><td><textarea id="extras" name="extras" rows="6" class="large-text" dir="rtl" placeholder="پراب تیتانیومی ۱۵ میلی‌متر یدکی|40000000">' . esc_textarea($o['extras']) . '</textarea><p class="description">هر خط یک قلم: نام|قیمت. این اقلام در فرم به‌صورت گزینهٔ اختیاری نمایش داده می‌شوند.</p></td></tr>';
    $f('base_name', 'شرح دستگاه در پیش‌فاکتور');
    $f('email_to', 'ایمیل دریافت درخواست‌ها');
    $f('seller_name', 'نام فروشنده');
    $f('seller_phone', 'تلفن فروشنده');
    $f('seller_web', 'وب‌سایت فروشنده');
    $f('catalog_url', 'لینک فایل کاتالوگ (PDF)', 'آدرس فایل کاتالوگ که در صفحهٔ اصلی روی دکمهٔ «کاتالوگ» می‌رود. فایل را در رسانه (Media) وردپرس بار بگذارید و لینکش را این‌جا بگذارید.');
    $f('manual_url_fa', 'لینک منوال فارسی (PDF)');
    $f('manual_url_en', 'لینک منوال انگلیسی (PDF)');
    echo '</table><p><button class="button button-primary" name="uhp400_save" value="1">ذخیره</button></p></form>';
    echo '<hr><form method="post">';
    wp_nonce_field('uhp400_test_mail');
    echo '<p><button class="button" name="uhp400_test_mail" value="1">ارسال ایمیل آزمایشی</button></p></form>';
    if (isset($_POST['uhp400_test_mail']) && check_admin_referer('uhp400_test_mail')) {
        $ok = wp_mail($o['email_to'], 'ایمیل آزمایشی افزونهٔ UHP-400', 'اگر این ایمیل را دریافت کرده‌اید، ارسال ایمیل از سایت کار می‌کند.');
        echo $ok ? '<div class="notice notice-success"><p>ایمیل ارسال شد. صندوق ورودی و پوشهٔ اسپم را بررسی کنید.</p></div>'
                 : '<div class="notice notice-error"><p>ارسال ایمیل ناموفق بود. یک افزونهٔ SMTP نصب و تنظیم کنید.</p></div>';
    }
    echo '</div>';
}

function uhp400_csv($filename, $header, $rows) {
    nocache_headers();
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename=' . $filename);
    echo "\xEF\xBB\xBF";
    $out = fopen('php://output', 'w');
    fputcsv($out, $header);
    foreach ($rows as $r) fputcsv($out, array_values((array) $r));
    fclose($out);
    exit;
}

add_action('admin_init', function () {
    global $wpdb;
    if (!current_user_can('manage_options') || empty($_GET['uhp400_export'])) return;
    check_admin_referer('uhp400_export');
    if ($_GET['uhp400_export'] === 'leads') {
        $rows = $wpdb->get_results("SELECT created_at, number, name, mobile, org, city, qty, CASE probe WHEN 'both' THEN '7+15' ELSE probe END, color, extras, code, discount_pct, subtotal, discount, vat, total, mail_sent FROM {$wpdb->prefix}uhp400_leads ORDER BY id DESC", ARRAY_A);
        uhp400_csv('uhp400-leads.csv', array('زمان', 'شماره', 'نام', 'موبایل', 'سازمان', 'شهر', 'تعداد', 'پراب', 'رنگ', 'اقلام اضافه', 'کد تخفیف', 'درصد', 'جمع', 'تخفیف', 'مالیات', 'مبلغ کل', 'ایمیل ارسال شد'), $rows);
    }
    if ($_GET['uhp400_export'] === 'codes') {
        $rows = $wpdb->get_results("SELECT code, percent, CASE WHEN used_at IS NULL THEN 'استفاده نشده' ELSE 'استفاده شده' END, used_at, lead_id FROM {$wpdb->prefix}uhp400_codes ORDER BY percent, code", ARRAY_N);
        uhp400_csv('uhp400-codes.csv', array('کد', 'درصد', 'وضعیت', 'زمان استفاده', 'شمارهٔ درخواست'), $rows);
    }
});

function uhp400_page_leads() {
    global $wpdb;
    if (!current_user_can('manage_options')) return;
    $rows = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}uhp400_leads ORDER BY id DESC LIMIT 300");
    $exp = wp_nonce_url(admin_url('admin.php?page=uhp400-leads&uhp400_export=leads'), 'uhp400_export');
    echo '<div class="wrap" dir="rtl"><h1>درخواست‌های پیش‌فاکتور</h1><p><a class="button" href="' . esc_url($exp) . '">دانلود همه (CSV برای اکسل)</a></p>';
    echo '<table class="widefat striped"><thead><tr><th>زمان</th><th>شماره</th><th>نام</th><th>موبایل</th><th>سازمان / شهر</th><th>سفارش</th><th>کد تخفیف</th><th>مبلغ کل</th><th>ایمیل</th></tr></thead><tbody>';
    if (!$rows) echo '<tr><td colspan="9">هنوز درخواستی ثبت نشده است.</td></tr>';
    foreach ($rows as $r) {
        $pl = array('7' => '۷ میلی‌متر', '15' => '۱۵ میلی‌متر', 'both' => '۷ و ۱۵ میلی‌متر');
        $order = uhp400_fa_num($r->qty) . ' دستگاه، پراب ' . esc_html($pl[$r->probe] ?? $r->probe) . '، ' . esc_html($r->color) . ($r->extras ? '؛ ' . esc_html($r->extras) : '');
        echo '<tr><td>' . esc_html($r->created_at) . '</td><td dir="ltr">' . esc_html($r->number) . '</td><td>' . esc_html($r->name) . '</td><td dir="ltr">' . esc_html($r->mobile) . '</td><td>' . esc_html($r->org) . ($r->city ? ' / ' . esc_html($r->city) : '') . '</td><td>' . $order . '</td><td dir="ltr">' . esc_html($r->code) . ($r->discount_pct ? ' (' . (int) $r->discount_pct . '%)' : '') . '</td><td>' . uhp400_fa_num($r->total) . '</td><td>' . ($r->mail_sent ? '✓' : '✗') . '</td></tr>';
    }
    echo '</tbody></table></div>';
}

function uhp400_page_codes() {
    global $wpdb;
    if (!current_user_can('manage_options')) return;
    $t = $wpdb->prefix . 'uhp400_codes';
    if (isset($_POST['uhp400_gen']) && check_admin_referer('uhp400_codes')) {
        $pct = max(1, min(90, (int) uhp400_latin_digits($_POST['pct'] ?? 10)));
        $n = max(1, min(200, (int) uhp400_latin_digits($_POST['count'] ?? 10)));
        $letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; $made = 0; $tries = 0;
        while ($made < $n && $tries++ < $n * 20) {
            $c = $pct; for ($i = 0; $i < 4; $i++) $c .= $letters[random_int(0, strlen($letters) - 1)];
            $made += (int) $wpdb->query($wpdb->prepare("INSERT IGNORE INTO $t (code, percent, created_at) VALUES (%s, %d, %s)", $c, $pct, current_time('mysql')));
        }
        echo '<div class="notice notice-success"><p>' . uhp400_fa_num($made) . ' کد ' . uhp400_fa_num($pct) . '٪ ساخته شد.</p></div>';
    }
    if (isset($_POST['uhp400_del']) && check_admin_referer('uhp400_codes')) {
        $wpdb->query($wpdb->prepare("DELETE FROM $t WHERE code = %s AND used_at IS NULL", strtoupper(sanitize_text_field(wp_unslash($_POST['code'] ?? '')))));
    }
    $rows = $wpdb->get_results("SELECT * FROM $t ORDER BY percent, code");
    $exp = wp_nonce_url(admin_url('admin.php?page=uhp400-codes&uhp400_export=codes'), 'uhp400_export');
    echo '<div class="wrap" dir="rtl"><h1>کدهای تخفیف یک‌بارمصرف</h1>';
    echo '<p>هر کد فقط یک بار پذیرفته می‌شود. تخفیف روی جمع سفارش (پیش از مالیات) اعمال می‌شود. <a class="button" href="' . esc_url($exp) . '">دانلود فهرست (CSV)</a></p>';
    echo '<form method="post" style="margin:12px 0">';
    wp_nonce_field('uhp400_codes');
    echo 'ساخت <input name="count" value="10" size="3"> کد جدید با تخفیف <input name="pct" value="10" size="3"> درصد <button class="button button-primary" name="uhp400_gen" value="1">ساخت</button></form>';
    echo '<table class="widefat striped" style="max-width:720px"><thead><tr><th>کد</th><th>درصد</th><th>وضعیت</th><th>زمان استفاده</th><th></th></tr></thead><tbody>';
    foreach ($rows as $r) {
        echo '<tr><td dir="ltr"><code>' . esc_html($r->code) . '</code></td><td>' . (int) $r->percent . '٪</td><td>' . ($r->used_at ? '<b style="color:#b32d2e">استفاده شده</b>' : '<span style="color:#008a20">آزاد</span>') . '</td><td>' . esc_html((string) $r->used_at) . '</td><td>';
        if (!$r->used_at) {
            echo '<form method="post" style="margin:0">'; wp_nonce_field('uhp400_codes');
            echo '<input type="hidden" name="code" value="' . esc_attr($r->code) . '"><button class="button-link-delete" name="uhp400_del" value="1" onclick="return confirm(\'حذف شود؟\')">حذف</button></form>';
        }
        echo '</td></tr>';
    }
    echo '</tbody></table></div>';
}
