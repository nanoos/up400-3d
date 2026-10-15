/**
 * Topsonics UHP-400 – ذخیرهٔ اطلاعات مشتری‌های پیش‌فاکتور در Google Sheet
 * این کد را در Extensions > Apps Script همان شیت بچسبانید و به صورت Web app منتشر کنید.
 */
var HEADERS = ['زمان ثبت', 'شمارهٔ پیش‌فاکتور', 'نام', 'موبایل', 'سازمان / شرکت', 'شهر',
               'تعداد', 'پراب', 'رنگ', 'جمع (تومان)', 'مالیات (تومان)', 'مبلغ کل (تومان)', 'صفحه'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.setRightToLeft(true);
    }
    var probe = { '7': '۷ میلی‌متر', '15': '۱۵ میلی‌متر', 'both': '۷ و ۱۵ میلی‌متر' }[d.probe] || d.probe;
    sheet.appendRow([
      new Date(d.time || Date.now()), clean(d.number), clean(d.name), clean(d.mobile), clean(d.org), clean(d.city),
      Number(d.qty) || 1, clean(probe), clean(d.color), Number(d.subtotal) || 0, Number(d.vat) || 0, Number(d.total) || 0, clean(d.page)
    ]);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error');
  } finally {
    lock.releaseLock();
  }
}

/* متن را کوتاه می‌کند و جلوی اجرای فرمول (= + - @) را می‌گیرد */
function clean(v) {
  var s = String(v == null ? '' : v).slice(0, 300);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
